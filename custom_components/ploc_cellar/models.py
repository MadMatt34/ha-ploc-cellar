"""Typed PLOUD cellar models and persistent JSON serialization."""
from __future__ import annotations

import math
from dataclasses import dataclass, field, replace
from typing import cast
from uuid import UUID

from homeassistant.util.json import JsonObjectType, JsonValueType

from .const import (
    CELLAR_DATA_VERSION,
    ORDERS_STORAGE_VERSION,
    PLOUD_REFERENCE_COLLECTIONS,
)

type JsonValue = JsonValueType
type JsonObject = JsonObjectType


def _empty_json_object() -> JsonObject:
    """Return a fresh, explicitly typed JSON object."""
    return {}


def _empty_reference_index() -> dict[str, dict[str, JsonObject]]:
    """Return a fresh, explicitly typed PLOUD reference index."""
    return {}


def normalize_identifier(value: str) -> str:
    """Trim an identifier and canonicalize UUIDs without changing opaque IDs."""
    normalized = value.strip()
    if not normalized:
        return ""
    try:
        return str(UUID(normalized))
    except ValueError:
        return normalized


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
    # Original compact PLOUD properties retained for later reference resolution.
    ploud_reference_fields: JsonObject = field(default_factory=_empty_json_object)
    # Raw PLOUD Meals bitmask (ml); unknown future bits remain preserved.
    meals: int | None = None


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
    """Reconstructed stock quantities and diagnostics for one wine."""

    purchased: int | None
    consumed: int | None
    movement_balance: int | None
    calculated_stock: int | None
    # Before Orders are complete, this is only the known physical lower bound.
    effective_stock: int
    unlocated_bottles: int | None
    negative_movement_bottles: int | None
    physical_surplus_bottles: int | None


@dataclass(slots=True)
class Cellar:
    """Complete local cellar snapshot."""

    cursor: int = field(default=1, compare=False)
    # Include this timestamp in equality so successful no-op syncs notify listeners.
    last_sync: str | None = field(default=None)
    initialized: bool = field(default=False, compare=False)
    # True only after a complete Orders snapshot has been successfully applied.
    stock_reconstruction_complete: bool = False
    stale: bool = field(default=False)
    wines: dict[str, Wine] = field(default_factory=lambda: dict[str, Wine]())
    racks: dict[str, Rack] = field(default_factory=lambda: dict[str, Rack]())
    rack_items: dict[str, RackItem] = field(
        default_factory=lambda: dict[str, RackItem]()
    )
    orders: dict[str, Order] = field(default_factory=lambda: dict[str, Order]())
    # Indexed PLOUD lookup collections, retained across incremental syncs.
    references: dict[str, dict[str, JsonObject]] = field(
        default_factory=_empty_reference_index
    )

    @property
    def total_bottles(self) -> int:
        """Return all occupied physical positions, including unresolved references.

        RackItems are physical bottle positions. This count must not depend on
        whether the Wine or Rack metadata is temporarily available locally.
        """
        return self.occupied_positions

    @property
    def wine_references(self) -> int | None:
        """Return positive-stock references, or None until Orders are complete."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            self.stock_for(wine).effective_stock > 0 for wine in self.wines.values()
        )

    @property
    def total_stock_bottles(self) -> int | None:
        """Return reconstructed stock, or None until Orders are complete."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            self.stock_for(wine).effective_stock for wine in self.wines.values()
        ) + self.positions_with_unknown_wine

    @property
    def orders_without_wine(self) -> int | None:
        """Return retained Orders whose Wine reference is unknown."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            order.wine_id not in self.wines for order in self.orders.values()
        )

    @property
    def stocked_wines(self) -> int:
        """Return the number of wine references with bottles in the cellar."""
        return sum(wine.bottles_in_cellar > 0 for wine in self.wines.values())

    @property
    def total_positions(self) -> int:
        """Return all PLOUD RackItems, including positions with unresolved racks."""
        return len(self.rack_items)

    @property
    def empty_positions(self) -> int:
        """Return all physical RackItems without a wine assignment."""
        return self.total_positions - self.occupied_positions

    @property
    def positions_without_rack(self) -> int:
        """Return positions whose referenced rack is not available locally."""
        return sum(
            item.rack_id not in self.racks for item in self.rack_items.values()
        )

    @property
    def positions_with_unknown_wine(self) -> int:
        """Return occupied positions whose Wine reference is unavailable."""
        return sum(
            bool(item.wine_id) and item.wine_id not in self.wines
            for item in self.rack_items.values()
        )

    def stock_for(self, wine: Wine) -> WineStock:
        """Reconstruct stock and keep its three diagnostic types independent.

        PLOUD's Wine.bo is informational only. The effective stock is the
        greater of the non-negative movement balance and the physical cellar
        count. A complete Orders snapshot is required for stock diagnostics.
        """
        if not self.stock_reconstruction_complete:
            return WineStock(
                purchased=None,
                consumed=None,
                movement_balance=None,
                calculated_stock=None,
                effective_stock=wine.bottles_in_cellar,
                unlocated_bottles=None,
                negative_movement_bottles=None,
                physical_surplus_bottles=None,
            )

        purchased = 0
        consumed = 0
        for order in self.orders.values():
            if order.wine_id == wine.id:
                purchased += order.incoming
                consumed += order.outgoing

        movement_balance = purchased - consumed
        calculated_stock = max(0, movement_balance)
        effective_stock = max(calculated_stock, wine.bottles_in_cellar)

        return WineStock(
            purchased=purchased,
            consumed=consumed,
            movement_balance=movement_balance,
            calculated_stock=calculated_stock,
            effective_stock=effective_stock,
            unlocated_bottles=max(
                0, effective_stock - wine.bottles_in_cellar
            ),
            negative_movement_bottles=max(0, -movement_balance),
            physical_surplus_bottles=max(
                0, wine.bottles_in_cellar - calculated_stock
            ),
        )

    @property
    def unlocated_wines(self) -> int | None:
        """Return the number of known wines with stock not assigned to a rack."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            (self.stock_for(wine).unlocated_bottles or 0) > 0
            for wine in self.wines.values()
        )

    @property
    def unlocated_bottles(self) -> int | None:
        """Return all known bottles not assigned to a rack position."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            self.stock_for(wine).unlocated_bottles or 0
            for wine in self.wines.values()
        )

    @property
    def negative_movement_wines(self) -> int | None:
        """Return the number of wines with a negative movement balance."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            (self.stock_for(wine).negative_movement_bottles or 0) > 0
            for wine in self.wines.values()
        )

    @property
    def negative_movement_bottles(self) -> int | None:
        """Return the absolute deficit represented by negative movement balances."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            self.stock_for(wine).negative_movement_bottles or 0
            for wine in self.wines.values()
        )

    @property
    def physical_surplus_wines(self) -> int | None:
        """Return the number of wines with more physical bottles than calculated."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            (self.stock_for(wine).physical_surplus_bottles or 0) > 0
            for wine in self.wines.values()
        )

    @property
    def physical_surplus_bottles(self) -> int | None:
        """Return physical bottles above the non-negative movement stock."""
        if not self.stock_reconstruction_complete:
            return None
        return sum(
            self.stock_for(wine).physical_surplus_bottles or 0
            for wine in self.wines.values()
        )

    def refresh_bottles_in_cellar(self) -> None:
        """Recalculate each wine's in-cellar quantity from assigned RackItems."""
        counts: dict[str, int] = {}
        for item in self.rack_items.values():
            if item.wine_id in self.wines:
                counts[item.wine_id] = counts.get(item.wine_id, 0) + 1

        for wine_id, wine in tuple(self.wines.items()):
            count = counts.get(wine_id, 0)
            if wine.bottles_in_cellar != count:
                self.wines[wine_id] = replace(wine, bottles_in_cellar=count)

    @property
    def occupied_positions(self) -> int:
        """Return all physical RackItems assigned to a wine."""
        return sum(bool(item.wine_id) for item in self.rack_items.values())

    def validate_rack_items(self, *, allow_unresolved: bool = False) -> None:
        """Validate RackItem identity and, when requested, all object references."""
        for item_id, item in self.rack_items.items():
            if not item_id or item.id != item_id:
                raise ValueError(f"Invalid RackItem identifier: {item_id!r}")
            if not allow_unresolved and (
                not item.rack_id or item.rack_id not in self.racks
            ):
                raise ValueError(
                    f"RackItem {item_id} references an unknown rack: {item.rack_id!r}"
                )
            if (
                not allow_unresolved
                and item.wine_id
                and item.wine_id not in self.wines
            ):
                raise ValueError(
                    f"RackItem {item_id} references an unknown wine: {item.wine_id!r}"
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
                "meals": wine.meals,
                "ploud_reference_fields": wine.ploud_reference_fields,
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
        references: dict[str, JsonValue] = {
            collection: {
                identifier: entry
                for identifier, entry in entries.items()
            }
            for collection, entries in self.references.items()
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
            "stock_reconstruction_complete": self.stock_reconstruction_complete,
            "wines": wines,
            "racks": racks,
            "rack_items": rack_items,
            "orders": orders,
            "references": references,
        }

    @classmethod
    def from_storage(cls, data: JsonObject) -> Cellar:
        """Restore and migrate a persisted cellar snapshot."""
        data_version = _int(data.get("version"))
        if data_version not in (
            1, 2, 3, 4, 5, ORDERS_STORAGE_VERSION, CELLAR_DATA_VERSION
        ):
            raise ValueError("Unsupported Ploc Cellar storage version")

        stored_cursor = max(1, _int(data.get("cursor")) or 1)
        if data_version in (ORDERS_STORAGE_VERSION, CELLAR_DATA_VERSION):
            _validate_current_storage(
                data,
                require_stock_reconstruction=data_version == CELLAR_DATA_VERSION,
                require_canonical_identifiers=data_version == CELLAR_DATA_VERSION,
            )

        if data_version == CELLAR_DATA_VERSION:
            stock_reconstruction_complete = (
                data.get("stock_reconstruction_complete") is True
            )
        elif data_version == ORDERS_STORAGE_VERSION:
            # Version 6 persisted Orders. A cursor above 1 proves that a full
            # snapshot had already been committed; cursor 1 means it had not.
            stock_reconstruction_complete = stored_cursor > 1
        else:
            # Versions 1-5 did not persist a complete Orders history.
            stock_reconstruction_complete = False

        cellar = cls(
            # Upgrade the schema and force a new snapshot, but retain trustworthy
            # cached Orders so their stock calculation remains usable offline.
            cursor=(
                1
                if data_version < CELLAR_DATA_VERSION
                or not stock_reconstruction_complete
                else stored_cursor
            ),
            last_sync=_str(data.get("last_sync")),
            initialized=data.get("initialized") is True,
            stock_reconstruction_complete=stock_reconstruction_complete,
            references={
                collection: {
                    identifier: _as_dict(entry)
                    for identifier, entry in _as_dict(
                        _as_dict(data.get("references")).get(collection)
                    ).items()
                    if isinstance(entry, dict)
                }
                for collection in PLOUD_REFERENCE_COLLECTIONS
                if collection in _as_dict(data.get("references"))
            },
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
                rack = Rack(
                    id=_stored_id(raw.get("id"), key, "Rack"),
                    name=_str(raw.get("name")) or "",
                )
                if rack.id in cellar.racks:
                    raise ValueError(f"Duplicate rack ID in stored cellar: {rack.id}")
                cellar.racks[rack.id] = rack
        for key, raw in _as_dict(data.get("rack_items")).items():
            if isinstance(raw, dict):
                item = _rack_item_from_dict(raw, key)
                if item.id in cellar.rack_items:
                    raise ValueError(
                        f"Duplicate RackItem ID in stored cellar: {item.id}"
                    )
                # Preserve unresolved rack and wine references in a restored
                # snapshot. Their counts are exposed separately, and the forced
                # full sync repairs them without misreporting them as empty slots.
                cellar.rack_items[item.id] = item

        for key, raw in _as_dict(data.get("orders")).items():
            if isinstance(raw, dict):
                order = _order_from_dict(raw, key)
                if order.id in cellar.orders:
                    raise ValueError(f"Duplicate order ID in stored cellar: {order.id}")
                cellar.orders[order.id] = order

        cellar.refresh_bottles_in_cellar()
        if cellar.positions_without_rack or cellar.positions_with_unknown_wine:
            # Resolve legacy or interrupted RackItem references from a complete
            # PLOUD snapshot instead of continuing with an incomplete delta.
            cellar.cursor = 1
        if cellar.wines and not cellar.references:
            # Older caches did not retain lookup collections or compact Wine IDs.
            # A full snapshot is required to enrich their existing Wine records.
            cellar.cursor = 1
        return cellar


def _validate_current_storage(
    data: JsonObject,
    *,
    require_stock_reconstruction: bool = True,
    require_canonical_identifiers: bool = True,
) -> None:
    """Reject incomplete or malformed snapshots using the selected schema."""
    initialized = data.get("initialized")
    cursor = data.get("cursor")
    last_sync = data.get("last_sync")
    if not isinstance(initialized, bool):
        raise ValueError("Invalid initialized flag in current cellar storage")
    if isinstance(cursor, bool) or not isinstance(cursor, int) or cursor < 1:
        raise ValueError("Invalid cursor in current cellar storage")
    if last_sync is not None and not isinstance(last_sync, str):
        raise ValueError("Invalid last_sync value in current cellar storage")
    if require_stock_reconstruction:
        complete = data.get("stock_reconstruction_complete")
        if not isinstance(complete, bool):
            raise ValueError(
                "Invalid stock reconstruction flag in current cellar storage"
            )
        if not complete and cursor != 1:
            raise ValueError(
                "Incomplete stock reconstruction must use a full-sync cursor"
            )

    raw_references = data.get("references")
    if raw_references is not None and not isinstance(raw_references, dict):
        raise ValueError("Invalid PLOUD references in current cellar storage")

    collections: dict[str, dict[str, JsonObject]] = {}
    for collection_name in ("wines", "racks", "rack_items", "orders"):
        raw_collection = data.get(collection_name)
        if not isinstance(raw_collection, dict):
            raise ValueError(
                f"Missing or invalid {collection_name} collection "
                "in current cellar storage"
            )
        records: dict[str, JsonObject] = {}
        for key, raw_record in cast(dict[object, object], raw_collection).items():
            if not isinstance(key, str) or not key:
                raise ValueError(
                    f"Invalid identifier in current cellar storage collection "
                    f"{collection_name}"
                )
            if not isinstance(raw_record, dict):
                raise ValueError(
                    f"Invalid record {key} in current cellar storage collection "
                    f"{collection_name}"
                )
            record_mapping = cast(dict[object, object], raw_record)
            record = _as_dict(record_mapping)
            if len(record) != len(record_mapping):
                raise ValueError(
                    f"Invalid field name in current cellar storage record {key}"
                )
            if record.get("id") != key:
                raise ValueError(
                    f"Record identifier does not match key in {collection_name}: {key}"
                )
            if require_canonical_identifiers and normalize_identifier(key) != key:
                raise ValueError(
                    f"Non-canonical identifier in {collection_name}: {key}"
                )
            records[key] = record
        collections[collection_name] = records

    wine_fields = {
        "id",
        "name",
        "bottles",
        "bottles_in_cellar",
        "vintage",
        "appellation",
        "color",
        "color_rgb",
        "classification",
        "region",
        "country",
        "grapes",
        "cuvee",
        "comment",
        "alcohol_percent",
        "service_temperature_min",
        "service_temperature_max",
        "bottle_format",
        "bottle_volume_l",
        "ploud_pid",
        "domain",
        "owner_id",
    }
    text_fields = (
        "appellation",
        "color",
        "classification",
        "region",
        "country",
        "grapes",
        "cuvee",
        "comment",
        "bottle_format",
        "ploud_pid",
        "domain",
        "owner_id",
    )
    float_fields = (
        "alcohol_percent",
        "service_temperature_min",
        "service_temperature_max",
        "bottle_volume_l",
    )
    for identifier, wine in collections["wines"].items():
        if not wine_fields.issubset(wine):
            raise ValueError(
                f"Incomplete Wine record in current cellar storage: {identifier}"
            )
        if not isinstance(wine.get("name"), str):
            raise ValueError(
                f"Invalid Wine name in current cellar storage: {identifier}"
            )
        for field_name in ("bottles", "bottles_in_cellar"):
            value = wine.get(field_name)
            if isinstance(value, bool) or not isinstance(value, int) or value < 0:
                raise ValueError(
                    f"Invalid {field_name} value in current cellar storage: "
                    f"{identifier}"
                )
        vintage = wine.get("vintage")
        if vintage is not None and (
            isinstance(vintage, bool) or not isinstance(vintage, int) or vintage <= 0
        ):
            raise ValueError(
                f"Invalid Wine vintage in current cellar storage: {identifier}"
            )
        meals = wine.get("meals")
        if meals is not None and (
            isinstance(meals, bool) or not isinstance(meals, int) or meals < 0
        ):
            raise ValueError(
                f"Invalid Wine meal association bitmask in current cellar storage: "
                f"{identifier}"
            )
        reference_fields = wine.get("ploud_reference_fields")
        if reference_fields is not None and not isinstance(reference_fields, dict):
            raise ValueError(
                f"Invalid PLOUD reference fields in stored wine {identifier}"
            )
        for field_name in text_fields:
            value = wine.get(field_name)
            if value is not None and not isinstance(value, str):
                raise ValueError(
                    f"Invalid Wine field {field_name} in current cellar storage: "
                    f"{identifier}"
                )
            if (
                field_name == "owner_id"
                and require_canonical_identifiers
                and isinstance(value, str)
                and normalize_identifier(value) != value
            ):
                raise ValueError(
                    f"Non-canonical Wine owner_id in current cellar storage: "
                    f"{identifier}"
                )
        for field_name in float_fields:
            value = wine.get(field_name)
            if value is not None:
                parsed = _float(value)
                if (
                    isinstance(value, bool)
                    or not isinstance(value, (int, float))
                    or parsed is None
                    or parsed <= 0
                ):
                    raise ValueError(
                        f"Invalid Wine field {field_name} in current cellar storage: "
                        f"{identifier}"
                    )
        color_rgb = wine.get("color_rgb")
        if color_rgb is not None:
            if (
                not isinstance(color_rgb, list)
                or len(color_rgb) != 3
                or any(
                    isinstance(component, bool)
                    or not isinstance(component, int)
                    or not 0 <= component <= 255
                    for component in color_rgb
                )
            ):
                raise ValueError(
                    f"Invalid Wine color_rgb in current cellar storage: {identifier}"
                )

    for identifier, rack in collections["racks"].items():
        if not {"id", "name"}.issubset(rack) or not isinstance(rack.get("name"), str):
            raise ValueError(
                f"Incomplete Rack record in current cellar storage: {identifier}"
            )

    for identifier, item in collections["rack_items"].items():
        if not {"id", "rack_id", "wine_id", "row", "column"}.issubset(item):
            raise ValueError(
                f"Incomplete RackItem record in current cellar storage: {identifier}"
            )
        rack_id = item.get("rack_id")
        wine_id = item.get("wine_id")
        if not isinstance(rack_id, str) or not rack_id:
            raise ValueError(
                f"Invalid RackItem rack_id in current cellar storage: {identifier}"
            )
        if not isinstance(wine_id, str):
            raise ValueError(
                f"Invalid RackItem wine_id in current cellar storage: {identifier}"
            )
        if require_canonical_identifiers and (
            normalize_identifier(rack_id) != rack_id
            or normalize_identifier(wine_id) != wine_id
        ):
            raise ValueError(
                f"Non-canonical RackItem reference in current cellar storage: "
                f"{identifier}"
            )
        for field_name in ("row", "column"):
            value = item.get(field_name)
            if value is not None and (
                isinstance(value, bool) or not isinstance(value, int)
            ):
                raise ValueError(
                    f"Invalid RackItem {field_name} in current cellar storage: "
                    f"{identifier}"
                )

    for identifier, order in collections["orders"].items():
        if not {"id", "wine_id", "incoming", "outgoing"}.issubset(order):
            raise ValueError(
                f"Incomplete Order record in current cellar storage: {identifier}"
            )
        wine_id = order.get("wine_id")
        if not isinstance(wine_id, str) or not wine_id:
            raise ValueError(
                f"Invalid Order wine_id in current cellar storage: {identifier}"
            )
        if (
            require_canonical_identifiers
            and normalize_identifier(wine_id) != wine_id
        ):
            raise ValueError(
                f"Non-canonical Order wine_id in current cellar storage: {identifier}"
            )
        for field_name in ("incoming", "outgoing"):
            value = order.get(field_name)
            if isinstance(value, bool) or not isinstance(value, int) or value < 0:
                raise ValueError(
                    f"Invalid Order {field_name} in current cellar storage: "
                    f"{identifier}"
                )


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


def _optional_id(value: object) -> str | None:
    """Normalize an optional UUID or opaque identifier."""
    if not isinstance(value, str):
        return None
    normalized = normalize_identifier(value)
    return normalized or None


def _stored_id(value: object, key: str, object_type: str) -> str:
    """Normalize a stored object ID, rejecting empty identifiers."""
    identifier = normalize_identifier(_str(value) or key)
    if not identifier:
        raise ValueError(f"Invalid stored {object_type} identifier: {key!r}")
    return identifier


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

    raw_meals = raw.get("meals", legacy_fields.get("ml"))
    meals = _int(raw_meals)
    if raw_meals is not None and (meals is None or meals < 0):
        raise ValueError(f"Invalid meal association bitmask in stored wine {key}")

    return Wine(
        id=_stored_id(raw.get("id"), key, "Wine"),
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
        owner_id=_optional_id(value("owner_id", "ow")),
        ploud_reference_fields=legacy_fields,
        meals=meals,
    )


def _order_from_dict(raw: JsonObject, key: str) -> Order:
    """Restore a stock movement from a stored JSON object."""
    incoming = _int(raw.get("incoming"))
    outgoing = _int(raw.get("outgoing"))
    if incoming is None or outgoing is None or incoming < 0 or outgoing < 0:
        raise ValueError(f"Invalid stock movement in stored order {key}")
    wine_id = _optional_id(raw.get("wine_id"))
    if not wine_id:
        raise ValueError(f"Invalid wine reference in stored order {key}")
    return Order(
        id=_stored_id(raw.get("id"), key, "Order"),
        wine_id=wine_id,
        incoming=incoming,
        outgoing=outgoing,
    )


def _rack_item_from_dict(raw: JsonObject, key: str) -> RackItem:
    """Restore a rack position from a stored JSON object."""
    return RackItem(
        id=_stored_id(raw.get("id"), key, "RackItem"),
        rack_id=_optional_id(raw.get("rack_id")) or "",
        wine_id=_optional_id(raw.get("wine_id")) or "",
        row=_int(raw.get("row")),
        column=_int(raw.get("column")),
    )
