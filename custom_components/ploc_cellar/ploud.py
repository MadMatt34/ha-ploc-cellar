"""Asynchronous, strictly read-only PLOUD sync client."""
from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import math
import time
from typing import Any, cast

from aiohttp import ClientError, ClientSession, ClientTimeout, FormData

from .const import PLOUD_HMAC_KEY, PLOUD_SYNC_METHOD, PLOUD_SYNC_PATH, PLOUD_VERSION
from .models import Cellar, JsonObject, Rack, RackItem, Wine

REFERENCE_COLLECTIONS = (
    "appellations",
    "bottleFormats",
    "classifications",
    "colors",
    "countries",
    "regions",
)
type PLOUDCollections = dict[str, list[JsonObject]]
type PLOUDReferences = dict[str, dict[str, JsonObject]]


class PloudError(Exception):
    """PLOUD communication or payload error."""


class PloudAuthError(PloudError):
    """PLOUD rejected the configured access token."""


def _sha_repeat(value: str, count: int) -> str:
    """Apply the protocol's repeated SHA-256 transformation."""
    result = value
    for _ in range(count):
        result = hashlib.sha256(result.encode()).hexdigest()
    return result


def _signature(token: str, device: str, timestamp: int) -> str:
    """Build the validated PLOUD sync HMAC signature."""
    material = "".join(
        (
            _sha_repeat(str(timestamp), 15),
            _sha_repeat(token, 20),
            _sha_repeat(device, 20),
            _sha_repeat(PLOUD_SYNC_METHOD, 20),
        )
    )
    digest = hmac.new(PLOUD_HMAC_KEY, material.encode(), hashlib.sha256).digest()
    return base64.b64encode(digest).decode("ascii")


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


def _text(value: object) -> str | None:
    """Return a string value."""
    return value if isinstance(value, str) else None


def _float(value: object) -> float | None:
    """Parse a finite floating-point value."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float, str)):
        try:
            parsed = float(value)
        except ValueError:
            return None
        return parsed if math.isfinite(parsed) else None
    return None


def _lookup(
    references: PLOUDReferences, collection: str, identifier: object
) -> JsonObject | None:
    """Resolve a PLOUD reference identifier."""
    if identifier is None:
        return None
    return references.get(collection, {}).get(str(identifier))


def _label(
    references: PLOUDReferences, collection: str, identifier: object
) -> str | None:
    """Resolve the display label of a PLOUD reference."""
    item = _lookup(references, collection, identifier)
    return _text(item.get("nm")) if item else None


def _parse_wine(raw: JsonObject, references: PLOUDReferences) -> Wine:
    """Convert one raw PLOUD wine while retaining all source fields."""
    stored_refs = raw.get("ploud_reference_fields")
    raw_refs = (
        cast(JsonObject, stored_refs)
        if isinstance(stored_refs, dict)
        else {
            key: value
            for key, value in raw.items()
            if key not in {"id", "sid", "nm", "tc", "tm", "tp"}
        }
    )

    def ref_id(short: str, long: str) -> object:
        return raw.get(long, raw_refs.get(short))

    bottle_format = _lookup(
        references, "bottleFormats", ref_id("vf", "bottle_format_id")
    )
    color_ref = _lookup(references, "colors", ref_id("co", "color_id"))
    color_rgb = None
    if color_ref is not None:
        red, green, blue = (
            _int(color_ref.get(channel)) for channel in ("r", "g", "b")
        )
        if (
            red is not None
            and green is not None
            and blue is not None
            and all(0 <= value <= 255 for value in (red, green, blue))
        ):
            color_rgb = (red, green, blue)

    return Wine(
        id=str(raw["id"]),
        name=_text(raw.get("nm", raw.get("name"))) or "",
        bottles=_int(raw.get("bo", raw.get("bottles"))) or 0,
        vintage=_int(raw.get("vi", raw.get("vintage"))),
        appellation=(
            _label(references, "appellations", ref_id("ap", "appellation_id"))
            or _text(raw.get("appellation"))
        ),
        color=(
            _label(references, "colors", ref_id("co", "color_id"))
            or _text(raw.get("color"))
        ),
        color_rgb=color_rgb,
        classification=(
            _label(
                references,
                "classifications",
                ref_id("cl", "classification_id"),
            )
            or _text(raw.get("classification"))
        ),
        region=(
            _label(references, "regions", ref_id("rn", "region_id"))
            or _text(raw.get("region"))
        ),
        country=(
            _label(references, "countries", ref_id("cn", "country_id"))
            or _text(raw.get("country"))
        ),
        grapes=_text(raw.get("grapes")) or _text(raw_refs.get("gr")),
        cuvee=_text(raw.get("cuvee")) or _text(raw_refs.get("cu")),
        bottle_format=(
            _text(bottle_format.get("nm"))
            if bottle_format
            else _text(raw.get("bottle_format"))
        ),
        bottle_volume_l=(
            _float(bottle_format.get("vo"))
            if bottle_format
            else _float(raw.get("bottle_volume_l"))
        ),
        ploud_pid=_text(raw.get("ploud_pid")) or _text(raw_refs.get("pid")),
        ploud_reference_fields=raw_refs,
    )


def _collection(objects: PLOUDCollections, name: str) -> list[JsonObject]:
    """Return a named collection without trusting response item shapes."""
    for key, values in objects.items():
        if key.casefold() == name.casefold():
            return values
    return []


def _deleted_id(raw: JsonObject) -> str | None:
    """Extract the ID of a deleted PLOUD object."""
    for key in ("id", "Id", "ID"):
        if isinstance(raw.get(key), str):
            return cast(str, raw[key])
    return None


async def async_sync(
    session: ClientSession,
    *,
    server: str,
    token: str,
    device: str,
    language: str,
    cursor: int,
) -> tuple[PLOUDCollections, int]:
    """Fetch one read-only incremental PLOUD synchronization."""
    timestamp = int(time.time())
    fields = {
        "Token": token,
        "Signature": _signature(token, device, timestamp),
        "Device": device,
        "Timestamp": str(timestamp),
        "LastSyncTime": str(max(1, cursor)),
        "Method": PLOUD_SYNC_METHOD,
        "Version": str(PLOUD_VERSION),
        "Ln": language,
        "Objects": "{}",
    }
    form = FormData()
    for key, value in fields.items():
        form.add_field(key, value)

    try:
        async with session.post(
            server.rstrip("/") + PLOUD_SYNC_PATH,
            data=form,
            timeout=ClientTimeout(total=120),
        ) as response:
            try:
                payload: Any = await response.json(content_type=None)
            except (ValueError, TypeError):
                payload = None

            if response.status in (401, 403):
                error_code = (
                    payload.get("error")
                    if isinstance(payload, dict)
                    else None
                )
                if response.status == 401 or str(error_code) == "20":
                    raise PloudAuthError("PLOUD rejected the access token")

            if response.status != 200:
                raise PloudError(f"PLOUD returned HTTP {response.status}")
            if payload is None:
                raise PloudError("PLOUD returned invalid JSON")
    except (ClientError, asyncio.TimeoutError) as err:
        raise PloudError(f"PLOUD sync request failed: {err}") from err

    if not isinstance(payload, dict):
        raise PloudError("PLOUD response is not a JSON object")
    objects = payload.get("objects", payload.get("Objects"))
    if not isinstance(objects, dict):
        raise PloudError("PLOUD response has no objects collection")

    collections: PLOUDCollections = {}
    for name, values in objects.items():
        if isinstance(values, list):
            collections[str(name)] = [
                cast(JsonObject, item)
                for item in values
                if isinstance(item, dict)
                and all(isinstance(key, str) for key in item)
            ]

    # The protocol cursor is the sync-start Unix timestamp in milliseconds.
    # Never move it backwards if the host clock is adjusted.
    next_cursor = max(timestamp * 1000, max(1, cursor))
    return collections, next_cursor


def apply_sync(
    cellar: Cellar, objects: PLOUDCollections, next_cursor: int
) -> None:
    """Apply a PLOUD delta to a candidate cellar model."""
    for name in REFERENCE_COLLECTIONS:
        for item in _collection(objects, name):
            identifier = item.get("id")
            if isinstance(identifier, str):
                cellar.references.setdefault(name, {})[identifier] = item

    for raw in _collection(objects, "Wines"):
        if isinstance(raw.get("id"), str):
            wine = _parse_wine(raw, cellar.references)
            cellar.wines[wine.id] = wine

    for raw in _collection(objects, "Racks"):
        identifier = raw.get("id")
        if isinstance(identifier, str):
            rack = Rack(
                identifier,
                _text(raw.get("nm", raw.get("name"))) or "",
            )
            cellar.racks[rack.id] = rack

    for raw in _collection(objects, "RackItems"):
        identifier = raw.get("id")
        if isinstance(identifier, str):
            item = RackItem(
                identifier,
                _text(raw.get("rk", raw.get("rack_id", raw.get("rack"))))
                or "",
                _text(raw.get("wi", raw.get("wine_id", raw.get("wine"))))
                or "",
                _int(raw.get("rw", raw.get("row"))),
                _int(raw.get("cl", raw.get("column"))),
            )
            cellar.rack_items[item.id] = item

    reference_changed = any(
        _collection(objects, name) for name in REFERENCE_COLLECTIONS
    )
    for raw in _collection(objects, "DeletedObjects"):
        object_id = _deleted_id(raw)
        if object_id is None:
            continue

        kind = next(
            (
                raw[key]
                for key in ("type", "Type", "objectType", "ObjectType")
                if isinstance(raw.get(key), str)
            ),
            "",
        )
        named_targets = {
            "wine": cellar.wines,
            "rack": cellar.racks,
            "rackitem": cellar.rack_items,
        }
        if isinstance(kind, str) and kind.casefold() in named_targets:
            named_targets[kind.casefold()].pop(object_id, None)
            continue

        targets = [
            cellar.wines,
            cellar.racks,
            cellar.rack_items,
            *cellar.references.values(),
        ]
        matches = [mapping for mapping in targets if object_id in mapping]
        if len(matches) == 1:
            matches[0].pop(object_id, None)
            if any(
                matches[0] is reference_map
                for reference_map in cellar.references.values()
            ):
                reference_changed = True

    # Re-resolve labels when reference records are added, changed or deleted.
    if reference_changed:
        for wine_id, wine in tuple(cellar.wines.items()):
            raw_wine = {
                **wine.ploud_reference_fields,
                "id": wine.id,
                "nm": wine.name,
                "bo": wine.bottles,
                "vi": wine.vintage,
                "appellation": wine.appellation,
                "color": wine.color,
                "region": wine.region,
                "country": wine.country,
                "classification": wine.classification,
                "grapes": wine.grapes,
                "cuvee": wine.cuvee,
                "bottle_format": wine.bottle_format,
                "bottle_volume_l": wine.bottle_volume_l,
                "ploud_pid": wine.ploud_pid,
            }
            cellar.wines[wine_id] = _parse_wine(raw_wine, cellar.references)

    cellar.cursor = next_cursor
    cellar.initialized = True
