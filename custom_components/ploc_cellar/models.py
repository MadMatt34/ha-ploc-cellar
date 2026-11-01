"""Typed PLOUD cellar data models and JSON serialization."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import TypeAlias

JsonScalar: TypeAlias = str | int | float | bool | None
JsonValue: TypeAlias = JsonScalar | list["JsonValue"] | dict[str, "JsonValue"]

@dataclass(frozen=True, slots=True)
class Wine:
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
    ploud_reference_fields: dict[str, JsonValue] = field(default_factory=dict)

@dataclass(frozen=True, slots=True)
class Rack:
    id: str
    name: str

@dataclass(frozen=True, slots=True)
class RackItem:
    id: str
    rack_id: str
    wine_id: str
    row: int | None
    column: int | None

@dataclass(slots=True)
class Cellar:
    cursor: int = 1
    last_sync: str | None = None
    initialized: bool = False
    wines: dict[str, Wine] = field(default_factory=dict)
    racks: dict[str, Rack] = field(default_factory=dict)
    rack_items: dict[str, RackItem] = field(default_factory=dict)
    references: dict[str, dict[str, dict[str, JsonValue]]] = field(default_factory=dict)

    @property
    def total_bottles(self) -> int:
        return sum(w.bottles for w in self.wines.values() if w.bottles > 0)

    @property
    def stocked_wines(self) -> int:
        return sum(1 for w in self.wines.values() if w.bottles > 0)

    @property
    def occupied_positions(self) -> int:
        stocked = {w.id for w in self.wines.values() if w.bottles > 0}
        return sum(1 for item in self.rack_items.values()
                   if item.wine_id in stocked and item.rack_id in self.racks)

    def to_storage(self) -> dict[str, JsonValue]:
        return {
            "version": 1, "cursor": self.cursor, "last_sync": self.last_sync,
            "initialized": self.initialized,
            "wines": {k: asdict(v) for k, v in self.wines.items()},
            "racks": {k: asdict(v) for k, v in self.racks.items()},
            "rack_items": {k: asdict(v) for k, v in self.rack_items.items()},
            "references": self.references,
        }

    @classmethod
    def from_storage(cls, data: dict[str, JsonValue]) -> "Cellar":
        if data.get("version") != 1:
            raise ValueError("Unsupported Ploc Cellar storage version")
        cellar = cls(cursor=max(1, _int(data.get("cursor")) or 1),
                     last_sync=_str(data.get("last_sync")),
                     initialized=data.get("initialized") is True)
        for key, raw in _dict(data.get("wines")).items():
            if isinstance(raw, dict):
                cellar.wines[key] = _wine_from_dict(raw, key)
        for key, raw in _dict(data.get("racks")).items():
            if isinstance(raw, dict):
                cellar.racks[key] = Rack(str(raw.get("id", key)), _str(raw.get("name")) or "")
        for key, raw in _dict(data.get("rack_items")).items():
            if isinstance(raw, dict):
                cellar.rack_items[key] = _rack_item_from_dict(raw, key)
        refs = _dict(data.get("references"))
        cellar.references = {str(n): {str(i): v for i, v in _dict(c).items() if isinstance(v, dict)}
                             for n, c in refs.items()}
        return cellar

def _dict(value: object) -> dict:
    return value if isinstance(value, dict) else {}
def _str(value: object) -> str | None:
    return value if isinstance(value, str) else None
def _int(value: object) -> int | None:
    if isinstance(value, bool): return None
    if isinstance(value, int): return value
    if isinstance(value, str):
        try: return int(value)
        except ValueError: return None
    return None
def _float(value: object) -> float | None:
    if isinstance(value, bool): return None
    if isinstance(value, (int, float)): return float(value)
    if isinstance(value, str):
        try: return float(value)
        except ValueError: return None
    return None
def _wine_from_dict(raw: dict, key: str) -> Wine:
    rgb = raw.get("color_rgb")
    color_rgb = tuple(rgb) if isinstance(rgb, (list, tuple)) and len(rgb) == 3 else None
    refs = raw.get("ploud_reference_fields")
    return Wine(
        id=str(raw.get("id", key)), name=_str(raw.get("name")) or "",
        bottles=_int(raw.get("bottles")) or 0, vintage=_int(raw.get("vintage")),
        appellation=_str(raw.get("appellation")), color=_str(raw.get("color")),
        color_rgb=color_rgb, classification=_str(raw.get("classification")),
        region=_str(raw.get("region")), country=_str(raw.get("country")),
        grapes=_str(raw.get("grapes")), cuvee=_str(raw.get("cuvee")),
        bottle_format=_str(raw.get("bottle_format")),
        bottle_volume_l=_float(raw.get("bottle_volume_l")),
        ploud_pid=_str(raw.get("ploud_pid")),
        ploud_reference_fields={k:v for k,v in _dict(refs).items()},
    )
def _rack_item_from_dict(raw: dict, key: str) -> RackItem:
    return RackItem(id=str(raw.get("id", key)),
        rack_id=_str(raw.get("rack_id")) or "", wine_id=_str(raw.get("wine_id")) or "",
        row=_int(raw.get("row")), column=_int(raw.get("column")))
