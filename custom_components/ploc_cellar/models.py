"""Typed PLOUD cellar models and persistent JSON serialization."""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import cast

from homeassistant.util.json import JsonObjectType, JsonValueType

type JsonValue = JsonValueType
type JsonObject = JsonObjectType

# Version of the serialized Cellar payload. The Home Assistant Store envelope
# version remains unchanged so existing data can be loaded and migrated.
_CELLAR_DATA_VERSION = 2


@dataclass(frozen=True, slots=True)
class Wine:
    """A stocked PLOUD wine with its display-ready characteristics."""

    id: str
    name: str
    bottles: int
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


@dataclass(slots=True)
class Cellar:
    """Complete local cellar snapshot."""

    cursor: int = field(default=1, compare=False)
    last_sync: str | None = field(default=None, compare=False)
    initialized: bool = field(default=False, compare=False)
    stale: bool = field(default=False)
    wines: dict[str, Wine] = field(default_factory=lambda: dict[str, Wine]())
    racks: dict[str, Rack] = field(default_factory=lambda: dict[str, Rack]())
    rack_items: dict[str, RackItem] = field(
        default_factory=lambda: dict[str, RackItem]()
    )

    @property
    def total_bottles(self) -> int:
        """Return the total number of bottles currently in stock."""
        return sum(wine.bottles for wine in self.wines.values())

    @property
    def stocked_wines(self) -> int:
        """Return the number of wines with at least one bottle."""
        return len(self.wines)

    @property
    def occupied_positions(self) -> int:
        """Return positions assigned to stocked wines in existing racks."""
        stocked_ids = set(self.wines)
        return sum(
            1
            for item in self.rack_items.values()
            if item.wine_id in stocked_ids and item.rack_id in self.racks
        )

    def to_storage(self) -> JsonObject:
        """Serialize the snapshot to JSON-compatible data."""
        wines: dict[str, JsonValue] = {
            wine_id: {
                "id": wine.id,
                "name": wine.name,
                "bottles": wine.bottles,
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
        return {
            "version": _CELLAR_DATA_VERSION,
            "cursor": self.cursor,
            "last_sync": self.last_sync,
            "initialized": self.initialized,
            "wines": wines,
            "racks": racks,
            "rack_items": rack_items,
        }

    @classmethod
    def from_storage(cls, data: JsonObject) -> Cellar:
        """Restore and migrate a persisted cellar snapshot."""
        data_version = _int(data.get("version"))
        if data_version not in (1, _CELLAR_DATA_VERSION):
            raise ValueError("Unsupported Ploc Cellar storage version")

        cellar = cls(
            cursor=max(1, _int(data.get("cursor")) or 1),
            last_sync=_str(data.get("last_sync")),
            initialized=data.get("initialized") is True,
        )
        removed_wine_ids: set[str] = set()
        for key, raw in _as_dict(data.get("wines")).items():
            if not isinstance(raw, dict):
                continue
            wine = _wine_from_dict(raw, key)
            if wine.bottles > 0:
                cellar.wines[key] = wine
            else:
                removed_wine_ids.add(wine.id)

        for key, raw in _as_dict(data.get("racks")).items():
            if isinstance(raw, dict):
                cellar.racks[key] = Rack(
                    id=_str(raw.get("id")) or key,
                    name=_str(raw.get("name")) or "",
                )
        for key, raw in _as_dict(data.get("rack_items")).items():
            if isinstance(raw, dict):
                item = _rack_item_from_dict(raw, key)
                if item.wine_id not in removed_wine_ids:
                    cellar.rack_items[key] = item

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
        if name in raw:
            return raw[name]
        return legacy_fields.get(legacy_name)

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

    raw_bottles = (
        raw.get("bottles")
        if "bottles" in raw
        else legacy_fields.get("bo")
    )
    bottles = max(0, _int(raw_bottles) or 0)

    return Wine(
        id=_str(raw.get("id")) or key,
        name=_str(raw.get("name")) or "",
        bottles=bottles,
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
