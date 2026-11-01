"""Typed PLOUD cellar models and persistent JSON serialization."""
from __future__ import annotations

import math
from dataclasses import asdict, dataclass, field
from typing import TypeAlias, cast

JsonScalar: TypeAlias = str | int | float | bool | None
JsonValue: TypeAlias = JsonScalar | list["JsonValue"] | dict[str, "JsonValue"]
JsonObject: TypeAlias = dict[str, JsonValue]


@dataclass(frozen=True, slots=True)
class Wine:
    """A PLOUD wine record, including wines with no current stock."""

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
    bottle_format: str | None
    bottle_volume_l: float | None
    ploud_pid: str | None
    ploud_reference_fields: JsonObject = field(default_factory=dict)


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
    wines: dict[str, Wine] = field(default_factory=dict)
    racks: dict[str, Rack] = field(default_factory=dict)
    rack_items: dict[str, RackItem] = field(default_factory=dict)
    references: dict[str, dict[str, JsonObject]] = field(default_factory=dict)

    @property
    def total_bottles(self) -> int:
        """Return the total number of bottles currently in stock."""
        return sum(wine.bottles for wine in self.wines.values() if wine.bottles > 0)

    @property
    def stocked_wines(self) -> int:
        """Return the number of wines with at least one bottle."""
        return sum(1 for wine in self.wines.values() if wine.bottles > 0)

    @property
    def occupied_positions(self) -> int:
        """Return positions assigned to stocked wines in existing racks."""
        stocked_ids = {
            wine.id for wine in self.wines.values() if wine.bottles > 0
        }
        return sum(
            1
            for item in self.rack_items.values()
            if item.wine_id in stocked_ids and item.rack_id in self.racks
        )

    def to_storage(self) -> JsonObject:
        """Serialize the snapshot to JSON-compatible data."""
        return cast(
            JsonObject,
            {
                "version": 1,
                "cursor": self.cursor,
                "last_sync": self.last_sync,
                "initialized": self.initialized,
                "wines": {key: asdict(wine) for key, wine in self.wines.items()},
                "racks": {key: asdict(rack) for key, rack in self.racks.items()},
                "rack_items": {
                    key: asdict(item) for key, item in self.rack_items.items()
                },
                "references": self.references,
            },
        )

    @classmethod
    def from_storage(cls, data: JsonObject) -> Cellar:
        """Restore a snapshot from persistent storage."""
        if data.get("version") != 1:
            raise ValueError("Unsupported Ploc Cellar storage version")

        cellar = cls(
            cursor=max(1, _int(data.get("cursor")) or 1),
            last_sync=_str(data.get("last_sync")),
            initialized=data.get("initialized") is True,
        )
        for key, raw in _as_dict(data.get("wines")).items():
            if isinstance(raw, dict):
                cellar.wines[key] = _wine_from_dict(raw, key)
        for key, raw in _as_dict(data.get("racks")).items():
            if isinstance(raw, dict):
                cellar.racks[key] = Rack(
                    id=_str(raw.get("id")) or key,
                    name=_str(raw.get("name")) or "",
                )
        for key, raw in _as_dict(data.get("rack_items")).items():
            if isinstance(raw, dict):
                cellar.rack_items[key] = _rack_item_from_dict(raw, key)

        references: dict[str, dict[str, JsonObject]] = {}
        for name, collection in _as_dict(data.get("references")).items():
            references[name] = {
                identifier: _as_dict(record)
                for identifier, record in _as_dict(collection).items()
                if isinstance(record, dict)
            }
        cellar.references = references
        return cellar


def _as_dict(value: object) -> JsonObject:
    """Return a JSON object or an empty object."""
    if isinstance(value, dict) and all(isinstance(key, str) for key in value):
        return cast(JsonObject, value)
    return {}


def _str(value: object) -> str | None:
    """Return a string value."""
    return value if isinstance(value, str) else None


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
    except ValueError:
        return None
    return parsed if parsed is not None and math.isfinite(parsed) else None


def _wine_from_dict(raw: dict[str, JsonValue], key: str) -> Wine:
    """Restore a wine from a stored JSON object."""
    rgb = raw.get("color_rgb")
    color_rgb = None
    if (
        isinstance(rgb, (list, tuple))
        and len(rgb) == 3
        and all(
            isinstance(component, int)
            and not isinstance(component, bool)
            and 0 <= component <= 255
            for component in rgb
        )
    ):
        color_rgb = (rgb[0], rgb[1], rgb[2])

    return Wine(
        id=_str(raw.get("id")) or key,
        name=_str(raw.get("name")) or "",
        bottles=_int(raw.get("bottles")) or 0,
        vintage=_int(raw.get("vintage")),
        appellation=_str(raw.get("appellation")),
        color=_str(raw.get("color")),
        color_rgb=color_rgb,
        classification=_str(raw.get("classification")),
        region=_str(raw.get("region")),
        country=_str(raw.get("country")),
        grapes=_str(raw.get("grapes")),
        cuvee=_str(raw.get("cuvee")),
        bottle_format=_str(raw.get("bottle_format")),
        bottle_volume_l=_float(raw.get("bottle_volume_l")),
        ploud_pid=_str(raw.get("ploud_pid")),
        ploud_reference_fields=_as_dict(raw.get("ploud_reference_fields")),
    )


def _rack_item_from_dict(raw: dict[str, JsonValue], key: str) -> RackItem:
    """Restore a rack position from a stored JSON object."""
    return RackItem(
        id=_str(raw.get("id")) or key,
        rack_id=_str(raw.get("rack_id")) or "",
        wine_id=_str(raw.get("wine_id")) or "",
        row=_int(raw.get("row")),
        column=_int(raw.get("column")),
    )
