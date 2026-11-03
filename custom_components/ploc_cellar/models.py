"""Typed PLOUD cellar models and persistent JSON serialization."""
from __future__ import annotations

import math
from dataclasses import dataclass, field, replace
from typing import cast

from homeassistant.util.json import JsonObjectType, JsonValueType

from .const import CELLAR_DATA_VERSION

type JsonValue = JsonValueType
type JsonObject = JsonObjectType


@dataclass(frozen=True, slots=True)
class Wine:
    """A PLOUD Wine reference with its display-ready characteristics."""

    id: str
    name: str
    # PLOUD total stock, including bottles not assigned to a rack position.
    bottles: int
    # Derived from the number of assigned PLOUD RackItems.
    bottles_in_cellar: int
    vintage: int | None
    appellation: str | None
    color: str | None
    color_rgb: tuple[int, int, int] | None
    classification: str | None
    region: str | None
    country: str | None
    grapes: str | None
    cuvee: str | None
    comment: str | None
    alcohol_percent: float | None
    service_temperature_min: float | None
    service_temperature_max: float | None
    bottle_format: str | None
    bottle_volume_l: float | None
    ploud_pid: str | None
    domain: str | None
    owner_id: str | None


@dataclass(frozen=True, slots=True)
class Rack:
    """A cellar rack."""

    id: str
    name: str


@dataclass(frozen=True, slots=True)
class RackItem:
    """A rack position and its assigned wine."""

    id: str
    rack_id: str
    wine_id: str
    row: int | None
    column: int | None


@dataclass(frozen=True, slots=True)
class Order:
    """A PLOUD stock movement associated with a wine."""

    id: str
    wine_id: str
    incoming: int
    outgoing: int


@dataclass(frozen=True, slots=True)
class WineStock:
    """Derived stock quantities and inventory diagnostics for one wine."""

    purchased: int
    consumed: int
    movement_balance: int
    calculated_stock: int
    bottles_to_store: int
    inventory_errors: tuple[str, ...]


@dataclass(slots=True)
class Cellar:
    """Complete local cellar snapshot."""

    cursor: int = field(default=1, compare=False)
    # Include this timestamp in equality so successful no-op syncs notify listeners.
    last_sync: str | None = field(default=None)
    initialized: bool = field(default=False, compare=False)
    stale: bool = field(default=False)
    wines: dict[str, Wine] = field(default_factory=lambda: dict[str, Wine]())
    racks: dict[str, Rack] = field(default_factory=lambda: dict[str, Rack]())
    rack_items: dict[str, RackItem] = field(
        default_factory=lambda: dict[str, RackItem]()
    )
    orders: dict[str, Order] = field(default_factory=lambda: dict[str, Order]())

    @property
    def total_bottles(self) -> int:
        """Return the number of bottles assigned to cellar positions."""
        return sum(wine.bottles_in_cellar for wine in self.wines.values())

    @property
    def total_stock_bottles(self) -> int:
        """Return the total stock quantity reported by PLOUD."""
        return sum(wine.bottles for wine in self.wines.values())

    @property
    def stocked_wines(self) -> int:
        """Return the number of wine references with bottles in the cellar."""
        return sum(wine.bottles_in_cellar > 0 for wine in self.wines.values())

    @property
    def total_stocked_wines(self) -> int:
        """Return the number of wine references with a positive PLOUD stock."""
        return sum(wine.bottles > 0 for wine in self.wines.values())

    def stock_for(self, wine: Wine) -> WineStock:
        """Calculate movement stock, unplaced bottles and inventory anomalies."""
        purchased = 0
        consumed = 0
        for order in self.orders.values():
            if order.wine_id == wine.id:
                purchased += order.incoming
                consumed += order.outgoing
        movement_balance = purchased - consumed
        calculated_stock = max(0, movement_balance)

        errors: list[str] = []
        if movement_balance < 0:
            errors.append("negative_movement_balance")
        if wine.bottles > calculated_stock:
            errors.append("declared_stock_above_movements")
        elif wine.bottles < calculated_stock:
            errors.append("declared_stock_below_movements")
        if wine.bottles_in_cellar > wine.bottles:
            errors.append("cellar_stock_above_total")

        return WineStock(
            purchased=purchased,
            consumed=consumed,
            movement_balance=movement_balance,
            calculated_stock=calculated_stock,
            bottles_to_store=max(0, wine.bottles - wine.bottles_in_cellar),
            inventory_errors=tuple(errors),
        )

    @property
    def total_bottles_to_store(self) -> int:
        """Return the number of declared bottles not assigned to a rack."""
        return sum(
            self.stock_for(wine).bottles_to_store for wine in self.wines.values()
        )

    @property
    def inventory_error_wines(self) -> int:
        """Return the number of wines with at least one inventory anomaly."""
        return sum(
            bool(self.stock_for(wine).inventory_errors)
            for wine in self.wines.values()
        )

    @property
    def inventory_error_count(self) -> int:
        """Return the number of inventory anomaly flags across all wines."""
        return sum(
            len(self.stock_for(wine).inventory_errors)
            for wine in self.wines.values()
        )

    def refresh_bottles_in_cellar(self) -> None:
        """Recalculate each wine's in-cellar quantity from assigned RackItems."""
        counts: dict[str, int] = {}
        for item in self.rack_items.values():
            if item.wine_id in self.wines and item.rack_id in self.racks:
                counts[item.wine_id] = counts.get(item.wine_id, 0) + 1

        for wine_id, wine in tuple(self.wines.items()):
            count = counts.get(wine_id, 0)
            if wine.bottles_in_cellar != count:
                self.wines[wine_id] = replace(wine, bottles_in_cellar=count)

    @property
    def occupied_positions(self) -> int:
        """Return rack positions with a wine assignment in existing racks."""
        return sum(
            1
            for item in self.rack_items.values()
            if item.wine_id and item.rack_id in self.racks
        )

    def to_storage(self) -> JsonObject:
        """Serialize the snapshot to JSON-compatible data."""
        wines: dict[str, JsonValue] = {
            wine_id: {
                "id": wine.id,
                "name": wine.name,
                "bottles": wine.bottles,
                "bottles_in_cellar": wine.bottles_in_cellar,
                "vintage": wine.vintage,
                "appellation": wine.appellation,
                "color": wine.color,
                "color_rgb": (
                    list(wine.color_rgb) if wine.color_rgb is not None else None
                ),
                "classification": wine.classification,
                "region": wine.region,
                "country": wine.country,
                "grapes": wine.grapes,
                "cuvee": wine.cuvee,
                "comment": wine.comment,
                "alcohol_percent": wine.alcohol_percent,
                "service_temperature_min": wine.service_temperature_min,
                "service_temperature_max": wine.service_temperature_max,
                "bottle_format": wine.bottle_format,
                "bottle_volume_l": wine.bottle_volume_l,
                "ploud_pid": wine.ploud_pid,
                "domain": wine.domain,
                "owner_id": wine.owner_id,
            }
            for wine_id, wine in self.wines.items()
        }
        racks: dict[str, JsonValue] = {
            rack_id: {"id": rack.id, "name": rack.name}
            for rack_id, rack in self.racks.items()
        }
        rack_items: dict[str, JsonValue] = {
            item_id: {
                "id": item.id,
                "rack_id": item.rack_id,
                "wine_id": item.wine_id,
                "row": item.row,
                "column": item.column,
            }
            for item_id, item in self.rack_items.items()
        }
        orders: dict[str, JsonValue] = {
            order_id: {
                "id": order.id,
                "wine_id": order.wine_id,
                "incoming": order.incoming,
                "outgoing": order.outgoing,
            }
            for order_id, order in self.orders.items()
        }
        return {
            "version": CELLAR_DATA_VERSION,
            "cursor": self.cursor,
            "last_sync": self.last_sync,
            "initialized": self.initialized,
            "wines": wines,
            "racks": racks,
            "rack_items": rack_items,
            "orders": orders,
        }

    @classmethod
    def from_storage(cls, data: JsonObject) -> Cellar:
        """Restore and migrate a persisted cellar snapshot."""
        data_version = _int(data.get("version"))
        if data_version not in (1, 2, 3, 4, 5, CELLAR_DATA_VERSION):
            raise ValueError("Unsupported Ploc Cellar storage version")

        stored_cursor = max(1, _int(data.get("cursor")) or 1)
        cellar = cls(
            # Older snapshots retained only wines with a positive PLOUD stock.
            # Force one full sync to restore every Wine reference and derive
            # in-cellar quantities from the current RackItems collection.
            cursor=1 if data_version < CELLAR_DATA_VERSION else stored_cursor,
            last_sync=_str(data.get("last_sync")),
            initialized=data.get("initialized") is True,
        )

        for key, raw in _as_dict(data.get("wines")).items():
            if not isinstance(raw, dict):
                continue
            wine = _wine_from_dict(raw, key)
            if wine.id in cellar.wines:
                raise ValueError(f"Duplicate wine ID in stored cellar: {wine.id}")
            cellar.wines[wine.id] = wine

        for key, raw in _as_dict(data.get("racks")).items():
            if isinstance(raw, dict):
                cellar.racks[key] = Rack(
                    id=_str(raw.get("id")) or key,
                    name=_str(raw.get("name")) or "",
                )
        for key, raw in _as_dict(data.get("rack_items")).items():
            if isinstance(raw, dict):
                item = _rack_item_from_dict(raw, key)
                # Preserve the assignment even when an older snapshot lacks
                # the corresponding Wine reference; the full-sync migration
                # will restore the complete Wine collection.
                cellar.rack_items[key] = item

        for key, raw in _as_dict(data.get("orders")).items():
            if isinstance(raw, dict):
                order = _order_from_dict(raw, key)
                cellar.orders[order.id] = order

        cellar.refresh_bottles_in_cellar()
        return cellar


def _as_dict(value: object) -> JsonObject:
    """Return a JSON object or an empty object."""
    if not isinstance(value, dict):
        return {}
    raw_mapping = cast(dict[object, object], value)
    result: JsonObject = {}
    for key, item in raw_mapping.items():
        if not isinstance(key, str):
            return {}
        result[key] = cast(JsonValue, item)
    return result


def _str(value: object) -> str | None:
    """Return a string value."""
    return value if isinstance(value, str) else None


def _optional_str(value: object) -> str | None:
    """Normalize an optional text value."""
    if not isinstance(value, str):
        return None
    normalized = value.strip()
    return normalized or None


def _int(value: object) -> int | None:
    """Parse an integer without accepting booleans or fractional values."""
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    if isinstance(value, str):
        try:
            return int(value)
        except ValueError:
            return None
    return None


def _float(value: object) -> float | None:
    """Parse a finite floating-point value."""
    if isinstance(value, bool):
        return None
    try:
        parsed = float(value) if isinstance(value, (int, float, str)) else None
    except (OverflowError, ValueError):
        return None
    return parsed if parsed is not None and math.isfinite(parsed) else None


def _positive_float(value: object) -> float | None:
    """Return a positive finite value; PLOUD uses zero for missing data."""
    parsed = _float(value)
    return parsed if parsed is not None and parsed > 0 else None


def _wine_from_dict(raw: JsonObject, key: str) -> Wine:
    """Restore a wine, migrating fields from the legacy reference dictionary."""
    legacy_fields = _as_dict(raw.get("ploud_reference_fields"))

    def value(name: str, legacy_name: str) -> object:
        """Prefer a populated current field, then its legacy source field."""
        for candidate in (raw.get(name), legacy_fields.get(legacy_name)):
            if candidate is not None and not (
                isinstance(candidate, str) and not candidate.strip()
            ):
                return candidate
        return None

    color_rgb = None
    rgb = raw.get("color_rgb")
    if isinstance(rgb, (list, tuple)) and len(rgb) == 3:
        red = _int(rgb[0])
        green = _int(rgb[1])
        blue = _int(rgb[2])
        if (
            red is not None
            and green is not None
            and blue is not None
            and all(0 <= component <= 255 for component in (red, green, blue))
        ):
            color_rgb = (red, green, blue)

    vintage = _int(raw.get("vintage"))
    if vintage is None:
        vintage = _int(legacy_fields.get("vi"))
    if vintage is not None and vintage <= 0:
        vintage = None

    raw_bottles = raw.get("bottles")
    if raw_bottles is None or (
        isinstance(raw_bottles, str) and not raw_bottles.strip()
    ):
        raw_bottles = legacy_fields.get("bo")
    parsed_bottles = _int(raw_bottles)
    if parsed_bottles is None or parsed_bottles < 0:
        raise ValueError(f"Invalid bottle count in stored wine {key}")
    bottles = parsed_bottles

    parsed_bottles_in_cellar = _int(raw.get("bottles_in_cellar"))
    if parsed_bottles_in_cellar is None:
        if "bottles_in_cellar" in raw:
            raise ValueError(f"Invalid in-cellar bottle count in stored wine {key}")
        parsed_bottles_in_cellar = 0
    if parsed_bottles_in_cellar < 0:
        raise ValueError(f"Invalid in-cellar bottle count in stored wine {key}")

    return Wine(
        id=_str(raw.get("id")) or key,
        name=_str(raw.get("name")) or "",
        bottles=bottles,
        bottles_in_cellar=parsed_bottles_in_cellar,
        vintage=vintage,
        appellation=_optional_str(value("appellation", "appellation")),
        color=_optional_str(value("color", "color")),
        color_rgb=color_rgb,
        classification=_optional_str(value("classification", "classification")),
        region=_optional_str(value("region", "region")),
        country=_optional_str(value("country", "country")),
        grapes=_optional_str(value("grapes", "gr")),
        cuvee=_optional_str(value("cuvee", "cu")),
        comment=_optional_str(value("comment", "cs")),
        alcohol_percent=_positive_float(legacy_fields.get("de"))
        if "alcohol_percent" not in raw
        else _positive_float(raw.get("alcohol_percent")),
        service_temperature_min=_positive_float(legacy_fields.get("ti"))
        if "service_temperature_min" not in raw
        else _positive_float(raw.get("service_temperature_min")),
        service_temperature_max=_positive_float(legacy_fields.get("to"))
        if "service_temperature_max" not in raw
        else _positive_float(raw.get("service_temperature_max")),
        bottle_format=_optional_str(value("bottle_format", "bottle_format")),
        bottle_volume_l=_positive_float(value("bottle_volume_l", "bottle_volume_l")),
        ploud_pid=_optional_str(value("ploud_pid", "pid")),
        domain=_optional_str(value("domain", "domain")),
        owner_id=_optional_str(value("owner_id", "ow")),
    )


def _order_from_dict(raw: JsonObject, key: str) -> Order:
    """Restore a stock movement from a stored JSON object."""
    incoming = _int(raw.get("incoming"))
    outgoing = _int(raw.get("outgoing"))
    if incoming is None or outgoing is None or incoming < 0 or outgoing < 0:
        raise ValueError(f"Invalid stock movement in stored order {key}")
    wine_id = _str(raw.get("wine_id"))
    if not wine_id:
        raise ValueError(f"Invalid wine reference in stored order {key}")
    return Order(
        id=_str(raw.get("id")) or key,
        wine_id=wine_id,
        incoming=incoming,
        outgoing=outgoing,
    )


def _rack_item_from_dict(raw: JsonObject, key: str) -> RackItem:
    """Restore a rack position from a stored JSON object."""
    return RackItem(
        id=_str(raw.get("id")) or key,
        rack_id=_str(raw.get("rack_id")) or "",
        wine_id=_str(raw.get("wine_id")) or "",
        row=_int(raw.get("row")),
        column=_int(raw.get("column")),
    )
