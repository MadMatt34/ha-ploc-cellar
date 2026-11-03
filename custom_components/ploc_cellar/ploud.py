"""Asynchronous, strictly read-only PLOUD sync client."""
from __future__ import annotations

import base64
import hashlib
import hmac
import math
import time
from typing import cast

from aiohttp import ClientError, ClientSession, ClientTimeout, FormData
from homeassistant.util.json import JsonValueType

from .const import (
    PLOUD_COLLECTION_DELETED,
    PLOUD_COLLECTION_RACK_ITEMS,
    PLOUD_COLLECTION_RACKS,
    PLOUD_COLLECTION_WINES,
    PLOUD_HMAC_KEY,
    PLOUD_SUPPORTED_COLLECTIONS,
    PLOUD_SYNC_METHOD,
    PLOUD_SYNC_PATH,
    PLOUD_VERSION,
)
from .models import Cellar, JsonObject, Rack, RackItem, Wine

type PLOUDCollections = dict[str, list[JsonObject]]


class PloudError(Exception):
    """PLOUD communication or payload error."""


def _as_json_object(value: object) -> JsonObject | None:
    """Validate and convert an arbitrary value to a Home Assistant JSON object."""
    if not isinstance(value, dict):
        return None
    raw_mapping = cast(dict[object, object], value)
    result: JsonObject = {}
    for key, item in raw_mapping.items():
        if not isinstance(key, str):
            return None
        result[key] = cast(JsonValueType, item)
    return result


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


def _float(value: object) -> float | None:
    """Parse a finite floating-point value."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float, str)):
        try:
            parsed = float(value)
        except (OverflowError, ValueError):
            return None
        return parsed if math.isfinite(parsed) else None
    return None


def _optional_text(value: object) -> str | None:
    """Return normalized optional text, treating empty strings as missing."""
    if not isinstance(value, str):
        return None
    normalized = value.strip()
    return normalized or None


def _positive_float(value: object) -> float | None:
    """Parse a positive finite float; PLOUD uses zero for missing values."""
    parsed = _float(value)
    return parsed if parsed is not None and parsed > 0 else None


def _source_value(
    raw: JsonObject,
    fields: JsonObject,
    *names: str,
) -> object:
    """Read a display-ready field from a PLOUD record or its expanded fields."""
    for source in (raw, fields):
        for name in names:
            value = source.get(name)
            if value is not None and not (
                isinstance(value, str) and not value.strip()
            ):
                return value
    return None


def _parse_color_rgb(value: object) -> tuple[int, int, int] | None:
    """Parse a validated RGB triplet."""
    if not isinstance(value, (list, tuple)):
        return None
    components = cast(list[object] | tuple[object, ...], value)
    if len(components) != 3:
        return None
    red, green, blue = (_int(component) for component in components)
    if (
        red is None
        or green is None
        or blue is None
        or not all(0 <= component <= 255 for component in (red, green, blue))
    ):
        return None
    return red, green, blue


# These RGB values reproduce the nine entries in the supplied legacy colors
# reference collection. A direct RGB value in a future Wine payload takes priority.
_COLOR_RGB: dict[str, tuple[int, int, int]] = {
    "autre": (153, 115, 85),
    "blanc": (255, 211, 116),
    "effervescent": (237, 214, 182),
    "liquoreux": (158, 195, 199),
    "muté": (65, 101, 138),
    "orange": (240, 142, 68),
    "rosé": (225, 136, 145),
    "rouge": (201, 25, 58),
    "sirop": (34, 199, 129),
}


def _parse_wine(raw: JsonObject) -> Wine:
    """Convert one PLOUD wine using its own expanded display fields."""
    stored_fields = raw.get("ploud_reference_fields")
    fields = (
        cast(JsonObject, stored_fields) if isinstance(stored_fields, dict) else {}
    )

    color = _optional_text(_source_value(raw, fields, "color"))
    color_rgb = _parse_color_rgb(
        _source_value(raw, fields, "color_rgb")
    ) or (_COLOR_RGB.get(color.casefold()) if color is not None else None)

    wine_id = raw.get("id")
    if not isinstance(wine_id, str) or not wine_id.strip():
        raise PloudError("PLOUD returned a wine without a valid ID")

    raw_bottles = _source_value(raw, fields, "bottles", "bo")
    bottles = _int(raw_bottles)
    if bottles is None or bottles < 0:
        raise PloudError(
            f"PLOUD returned an invalid bottle count for wine {wine_id}"
        )

    vintage = _int(_source_value(raw, fields, "vintage", "vi"))
    if vintage is not None and vintage <= 0:
        vintage = None

    return Wine(
        id=wine_id,
        name=_optional_text(_source_value(raw, fields, "name", "nm")) or "",
        bottles=bottles,
        vintage=vintage,
        appellation=_optional_text(_source_value(raw, fields, "appellation")),
        color=color,
        color_rgb=color_rgb,
        classification=_optional_text(
            _source_value(raw, fields, "classification")
        ),
        region=_optional_text(_source_value(raw, fields, "region")),
        country=_optional_text(_source_value(raw, fields, "country")),
        grapes=_optional_text(_source_value(raw, fields, "grapes", "gr")),
        cuvee=_optional_text(_source_value(raw, fields, "cuvee", "cu")),
        comment=_optional_text(_source_value(raw, fields, "comment", "cs")),
        alcohol_percent=_positive_float(
            _source_value(raw, fields, "alcohol_percent", "de")
        ),
        service_temperature_min=_positive_float(
            _source_value(raw, fields, "service_temperature_min", "ti")
        ),
        service_temperature_max=_positive_float(
            _source_value(raw, fields, "service_temperature_max", "to")
        ),
        bottle_format=_optional_text(
            _source_value(raw, fields, "bottle_format")
        ),
        bottle_volume_l=_positive_float(
            _source_value(raw, fields, "bottle_volume_l")
        ),
        ploud_pid=_optional_text(_source_value(raw, fields, "ploud_pid", "pid")),
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
    short_device = device[:5]
    fields = {
        "Token": token,
        "Signature": _signature(token, short_device, timestamp),
        "Device": short_device,
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
                payload_raw: object = await response.json(content_type=None)
            except (ValueError, TypeError):
                payload_raw = None

            if response.status in (401, 403):
                auth_payload = _as_json_object(payload_raw)
                error_code = (
                    auth_payload.get("error") if auth_payload is not None else None
                )
                if response.status == 401 or str(error_code) == "20":
                    raise PloudAuthError("PLOUD rejected the access token")

            if response.status != 200:
                raise PloudError(f"PLOUD returned HTTP {response.status}")
            if payload_raw is None:
                raise PloudError("PLOUD returned invalid JSON")
    except (ClientError, TimeoutError) as err:
        raise PloudError(f"PLOUD sync request failed: {err}") from err

    payload = _as_json_object(payload_raw)
    if payload is None:
        raise PloudError("PLOUD response is not a JSON object")
    objects_value = payload.get("objects", payload.get("Objects"))
    objects = _as_json_object(objects_value)
    if objects is None:
        raise PloudError("PLOUD response has no objects collection")

    supported_collections = {
        name.casefold() for name in PLOUD_SUPPORTED_COLLECTIONS
    }
    collections: PLOUDCollections = {}
    for name, values in objects.items():
        if name.casefold() not in supported_collections:
            continue
        if not isinstance(values, list):
            raise PloudError(f"PLOUD collection {name} is not an array")

        records: list[JsonObject] = []
        for item in values:
            record = _as_json_object(item)
            if record is None:
                raise PloudError(
                    f"PLOUD collection {name} contains an invalid record"
                )
            records.append(record)
        collections[name] = records

    # The protocol cursor is the sync-start Unix timestamp in milliseconds.
    # Never move it backwards if the host clock is adjusted.
    next_cursor = max(timestamp * 1000, max(1, cursor))
    return collections, next_cursor


def apply_sync(
    cellar: Cellar, objects: PLOUDCollections, next_cursor: int
) -> None:
    """Apply a PLOUD delta to a candidate cellar model."""
    removed_wine_ids: set[str] = set()
    removed_rack_ids: set[str] = set()

    for raw in _collection(objects, PLOUD_COLLECTION_WINES):
        wine = _parse_wine(raw)
        if wine.bottles > 0:
            cellar.wines[wine.id] = wine
            removed_wine_ids.discard(wine.id)
        else:
            cellar.wines.pop(wine.id, None)
            removed_wine_ids.add(wine.id)

    for raw in _collection(objects, PLOUD_COLLECTION_RACKS):
        identifier = raw.get("id")
        if isinstance(identifier, str):
            cellar.racks[identifier] = Rack(
                identifier,
                _optional_text(raw.get("nm", raw.get("name"))) or "",
            )

    for raw in _collection(objects, PLOUD_COLLECTION_RACK_ITEMS):
        identifier = raw.get("id")
        if isinstance(identifier, str):
            item = RackItem(
                identifier,
                _optional_text(raw.get("rk", raw.get("rack_id", raw.get("rack"))))
                or "",
                _optional_text(raw.get("wi", raw.get("wine_id", raw.get("wine"))))
                or "",
                _int(raw.get("rw", raw.get("row"))),
                _int(raw.get("cl", raw.get("column"))),
            )
            cellar.rack_items[item.id] = item

    for raw in _collection(objects, PLOUD_COLLECTION_DELETED):
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
        normalized_kind = kind.casefold() if isinstance(kind, str) else ""
        named_targets = {
            "wine": cellar.wines,
            "rack": cellar.racks,
            "rackitem": cellar.rack_items,
        }
        if normalized_kind in named_targets:
            named_targets[normalized_kind].pop(object_id, None)
            if normalized_kind == "wine":
                removed_wine_ids.add(object_id)
            elif normalized_kind == "rack":
                removed_rack_ids.add(object_id)
            continue

        targets = (
            ("wine", cellar.wines),
            ("rack", cellar.racks),
            ("rackitem", cellar.rack_items),
        )
        matches = [
            (target_kind, mapping)
            for target_kind, mapping in targets
            if object_id in mapping
        ]
        if len(matches) == 1:
            target_kind, mapping = matches[0]
            mapping.pop(object_id, None)
            if target_kind == "wine":
                removed_wine_ids.add(object_id)
            elif target_kind == "rack":
                removed_rack_ids.add(object_id)

    # Removing a wine frees its physical rack slot; retain the RackItem and
    # clear only its wine assignment. Deleting a rack removes its positions.
    # Also clear stale assignments whose wine is no longer in the inventory.
    for item_id, item in tuple(cellar.rack_items.items()):
        if item.rack_id in removed_rack_ids:
            cellar.rack_items.pop(item_id, None)
        elif item.wine_id and (
            item.wine_id in removed_wine_ids or item.wine_id not in cellar.wines
        ):
            cellar.rack_items[item_id] = RackItem(
                item.id, item.rack_id, "", item.row, item.column
            )

    cellar.cursor = next_cursor
    cellar.initialized = True
