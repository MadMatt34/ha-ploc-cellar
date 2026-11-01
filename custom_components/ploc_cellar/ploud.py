"""Asynchronous, strictly read-only PLOUD sync client."""
from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import time
from typing import Any

from aiohttp import ClientError, ClientSession, ClientTimeout, FormData

from .const import HMAC_KEY, PLOUD_VERSION
from .models import Cellar, Rack, RackItem, Wine

REFERENCE_COLLECTIONS = ("appellations", "bottleFormats", "classifications", "colors", "countries", "regions")
WINE_REFERENCE_FIELDS = ("ap", "cl", "cn", "co", "rn", "vf", "pid", "cs", "cu", "tg", "re", "gr", "de", "ep", "it", "af", "at", "cf", "ct", "ti", "to", "lt", "lg", "ac", "no", "ps", "ml")

class PloudError(Exception):
    """PLOUD communication or payload error."""

def _sha_repeat(value: str, count: int) -> str:
    result = value
    for _ in range(count):
        result = hashlib.sha256(result.encode()).hexdigest()
    return result

def _signature(token: str, device: str, timestamp: int) -> str:
    material = "".join((_sha_repeat(str(timestamp), 15), _sha_repeat(token, 20),
                        _sha_repeat(device, 20), _sha_repeat("sync", 20)))
    digest = hmac.new(HMAC_KEY, material.encode(), hashlib.sha256).digest()
    return base64.b64encode(digest).decode("ascii")

def _int(value: object) -> int | None:
    if isinstance(value, bool): return None
    if isinstance(value, int): return value
    if isinstance(value, float) and value.is_integer(): return int(value)
    if isinstance(value, str):
        try: return int(value)
        except ValueError: return None
    return None

def _text(value: object) -> str | None:
    return value if isinstance(value, str) else None


def _float(value: object) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return None
    return None

def _lookup(refs: dict, collection: str, identifier: object) -> dict | None:
    if identifier is None: return None
    values = refs.get(collection, {})
    return values.get(str(identifier)) if isinstance(values, dict) else None

def _label(refs: dict, collection: str, identifier: object) -> str | None:
    item = _lookup(refs, collection, identifier)
    return _text(item.get("nm")) if item else None

def _parse_wine(raw: dict, refs: dict) -> Wine:
    stored_refs = raw.get("ploud_reference_fields")
    raw_refs = (
        dict(stored_refs)
        if isinstance(stored_refs, dict)
        else {
            key: value
            for key, value in raw.items()
            if key not in {"id", "sid", "nm", "tc", "tm", "tp"}
        }
    )
    def ref_id(short: str, long: str) -> object:
        return raw.get(long, raw_refs.get(short))
    fmt = _lookup(refs, "bottleFormats", ref_id("vf", "bottle_format_id"))
    color_ref = _lookup(refs, "colors", ref_id("co", "color_id"))
    rgb = None
    if color_ref is not None:
        red, green, blue = (
            _int(color_ref.get(channel)) for channel in ("r", "g", "b")
        )
        if all(
            value is not None and 0 <= value <= 255
            for value in (red, green, blue)
        ):
            rgb = (red, green, blue)
    return Wine(
        id=str(raw["id"]), name=_text(raw.get("nm", raw.get("name"))) or "",
        bottles=_int(raw.get("bo", raw.get("bottles"))) or 0,
        vintage=_int(raw.get("vi", raw.get("vintage"))),
        appellation=_label(refs, "appellations", ref_id("ap", "appellation_id")) or _text(raw.get("appellation")),
        color=_label(refs, "colors", ref_id("co", "color_id")) or _text(raw.get("color")),
        color_rgb=rgb, classification=_label(refs, "classifications", ref_id("cl", "classification_id")) or _text(raw.get("classification")),
        region=_label(refs, "regions", ref_id("rn", "region_id")) or _text(raw.get("region")),
        country=_label(refs, "countries", ref_id("cn", "country_id")) or _text(raw.get("country")),
        grapes=_text(raw.get("grapes")) or _text(raw_refs.get("gr")),
        cuvee=_text(raw.get("cuvee")) or _text(raw_refs.get("cu")),
        bottle_format=_text(fmt.get("nm")) if fmt else _text(raw.get("bottle_format")),
        bottle_volume_l=(
            float(fmt["vo"])
            if fmt and isinstance(fmt.get("vo"), (int, float))
            else _float(raw.get("bottle_volume_l"))
        ),
        ploud_pid=_text(raw.get("ploud_pid")) or _text(raw_refs.get("pid")),
        ploud_reference_fields=raw_refs,
    )

def _collection(objects: dict, name: str) -> list[dict]:
    for key, value in objects.items():
        if str(key).lower() == name.lower() and isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]
    return []

def _deleted_id(raw: dict) -> str | None:
    for key in ("id", "Id", "ID"):
        if isinstance(raw.get(key), str): return raw[key]
    return None

async def async_sync(session: ClientSession, *, server: str, token: str,
                     device: str, language: str, cursor: int) -> tuple[dict[str, list[dict]], int]:
    timestamp = int(time.time())
    fields = {
        "Token": token, "Signature": _signature(token, device, timestamp),
        "Device": device, "Timestamp": str(timestamp), "LastSyncTime": str(max(1,cursor)),
        "Method": "sync", "Version": str(PLAUD_VERSION), "Ln": language, "Objects": "{}",
    }
    form = FormData()
    for key, value in fields.items():
        form.add_field(key, value)
    try:
        async with session.post(server.rstrip("/") + "/sync/exec", data=form,
                                timeout=ClientTimeout(total=120)) as response:
            body = await response.text()
            if response.status != 200:
                raise PloudError(f"PLOUD HTTP {response.status}: {body[:500]}")
            try:
                payload: Any = await response.json(content_type=None)
            except (ValueError, TypeError) as err:
                raise PloudError("PLOUD returned invalid JSON") from err
    except (ClientError, asyncio.TimeoutError) as err:
        raise PloudError(f"PLOUD sync request failed: {err}") from err
    if not isinstance(payload, dict):
        raise PloudError("PLOUD response is not a JSON object")
    objects = payload.get("objects", payload.get("Objects"))
    if not isinstance(objects, dict):
        raise PloudError("PLOUD response has no objects collection")
    return ({str(k): [v for v in values if isinstance(v, dict)]
             for k, values in objects.items() if isinstance(values, list)}, timestamp * 1000)

def apply_sync(cellar: Cellar, objects: dict[str, list[dict]], next_cursor: int) -> None:
    for name in REFERENCE_COLLECTIONS:
        for item in _collection(objects, name):
            if isinstance(item.get("id"), str):
                cellar.references.setdefault(name, {})[item["id"]] = item
    for raw in _collection(objects, "Wines"):
        if isinstance(raw.get("id"), str):
            wine = _parse_wine(raw, cellar.references)
            cellar.wines[wine.id] = wine
    for raw in _collection(objects, "Racks"):
        if isinstance(raw.get("id"), str):
            rack = Rack(raw["id"], _text(raw.get("nm", raw.get("name"))) or "")
            cellar.racks[rack.id] = rack
    for raw in _collection(objects, "RackItems"):
        if isinstance(raw.get("id"), str):
            item = RackItem(raw["id"], _text(raw.get("rk", raw.get("rack_id", raw.get("rack")))) or "",
                _text(raw.get("wi", raw.get("wine_id", raw.get("wine")))) or "",
                _int(raw.get("rw", raw.get("row"))), _int(raw.get("cl", raw.get("column"))))
            cellar.rack_items[item.id] = item
    for raw in _collection(objects, "DeletedObjects"):
        object_id = _deleted_id(raw)
        if not object_id: continue
        kind = next((raw[k] for k in ("type","Type","objectType","ObjectType") if isinstance(raw.get(k), str)), "")
        targets = {"Wine": cellar.wines, "Rack": cellar.racks, "RackItem": cellar.rack_items}
        if kind in targets:
            targets[kind].pop(object_id, None)
        else:
            matches = [mapping for mapping in targets.values() if object_id in mapping]
            if len(matches) == 1: matches[0].pop(object_id, None)
    # Re-resolve all wines if a reference entry changed.
    if any(_collection(objects, name) for name in REFERENCE_COLLECTIONS):
        for wine_id, wine in tuple(cellar.wines.items()):
            cellar.wines[wine_id] = _parse_wine({**wine.ploud_reference_fields,
                "id": wine.id, "nm": wine.name, "bo": wine.bottles, "vi": wine.vintage,
                "appellation": wine.appellation, "color": wine.color, "region": wine.region,
                "country": wine.country, "classification": wine.classification,
                "grapes": wine.grapes, "cuvee": wine.cuvee, "bottle_format": wine.bottle_format,
                "bottle_volume_l": wine.bottle_volume_l, "ploud_pid": wine.ploud_pid}, cellar.references)
    cellar.cursor = next_cursor
    cellar.initialized = True
