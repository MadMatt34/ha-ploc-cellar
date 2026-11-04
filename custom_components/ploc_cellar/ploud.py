"""Asynchronous, strictly read-only PLOUD sync client."""
from __future__ import annotations

import base64
import hashlib
import hmac
import logging
import math
import time
from dataclasses import replace
from typing import cast

from aiohttp import ClientError, ClientSession, ClientTimeout, FormData
from homeassistant.util.json import JsonValueType

from .const import (
    PLOUD_COLLECTION_DELETED,
    PLOUD_COLLECTION_ORDERS,
    PLOUD_COLLECTION_OWNERS,
    PLOUD_COLLECTION_RACK_ITEMS,
    PLOUD_COLLECTION_RACKS,
    PLOUD_COLLECTION_WINES,
    PLOUD_HMAC_KEY,
    PLOUD_SUPPORTED_COLLECTIONS,
    PLOUD_SYNC_METHOD,
    PLOUD_SYNC_PATH,
    PLOUD_VERSION,
)
from .models import Cellar, JsonObject, Order, Rack, RackItem, Wine

type PLOUDCollections = dict[str, list[JsonObject]]

_LOGGER = logging.getLogger(__name__)


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


def _reference_id(value: object) -> str | None:
    """Normalize a PLOUD reference ID without accepting booleans."""
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, str):
        return value.strip() or None
    if isinstance(value, int):
        return str(value)
    return None


def _source_reference_id(
    raw: JsonObject,
    fields: JsonObject,
    *names: str,
) -> tuple[bool, str | None]:
    """Read a reference while distinguishing an explicit empty value."""
    for source in (raw, fields):
        for name in names:
            if name in source:
                return True, _reference_id(source[name])
    return False, None

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


# RGB values copied from the nine entries in the supplied PLOUD colors
# collection. Mapping by the stable "co" identifier avoids language dependence.
_COLOR_RGB_BY_ID: dict[str, tuple[int, int, int]] = {
    "8019": (153, 115, 85),  # Autre
    "8020": (255, 211, 116),  # Blanc
    "8021": (237, 214, 182),  # Effervescent
    "8022": (158, 195, 199),  # Liquoreux
    "10253": (65, 101, 138),  # Muté
    "10254": (240, 142, 68),  # Orange
    "8023": (225, 136, 145),  # Rosé
    "8024": (201, 25, 58),  # Rouge
    "721a2c41-cdcb-4629-a7fb-7c30ea2fbd87": (34, 199, 129),  # Sirop
}



def _owner_display_name(raw: JsonObject) -> tuple[bool, str | None]:
    """Return an Owner display name when its name field is present."""
    for key in ("fullname", "fullName", "full_name", "nm", "name", "Name"):
        if key in raw:
            return True, _optional_text(raw[key])
    return False, None


def _parse_wine(
    raw: JsonObject,
    *,
    owner_names: dict[str, str | None],
    previous: Wine | None,
) -> Wine:
    """Convert one PLOUD wine and resolve its Owner UUID to a winery name."""
    stored_fields = raw.get("ploud_reference_fields")
    fields = (
        cast(JsonObject, stored_fields) if isinstance(stored_fields, dict) else {}
    )

    color = _optional_text(_source_value(raw, fields, "color"))
    color_id = _reference_id(_source_value(raw, fields, "color_id", "co"))
    color_rgb = (
        _COLOR_RGB_BY_ID.get(color_id) if color_id is not None else None
    )
    if color_rgb is None:
        # Prefer the PLOUD identifier mapping. Accept an explicit RGB value
        # only as a fallback for payloads that omit a recognized color ID.
        color_rgb = _parse_color_rgb(_source_value(raw, fields, "color_rgb"))

    wine_id = raw.get("id")
    if not isinstance(wine_id, str) or not wine_id.strip():
        raise PloudError("PLOUD returned a wine without a valid ID")

    # PLOUD payloads may expose both the descriptive field and its compact
    # protocol alias. Keep the existing precedence, but report disagreements
    # so the source of inventory-count discrepancies can be identified.
    bottles_value = _source_value(raw, fields, "bottles")
    compact_bottles_value = _source_value(raw, fields, "bo")
    bottles = _int(
        bottles_value if bottles_value is not None else compact_bottles_value
    )
    compact_bottles = _int(compact_bottles_value)
    if (
        bottles is not None
        and compact_bottles is not None
        and bottles != compact_bottles
    ):
        _LOGGER.warning(
            "PLOUD bottle-count fields disagree for wine %s (%s): "
            "bottles=%r, bo=%r; using bottles=%d",
            wine_id,
            _optional_text(_source_value(raw, fields, "name", "nm")) or "",
            bottles_value,
            compact_bottles_value,
            bottles,
        )
    if bottles is None or bottles < 0:
        raise PloudError(
            f"PLOUD returned an invalid bottle count for wine {wine_id}"
        )

    _LOGGER.debug(
        "PLOUD wine inventory record: id=%s name=%r bottles=%r bo=%r "
        "selected=%d total_stocked=%s",
        wine_id,
        _optional_text(_source_value(raw, fields, "name", "nm")) or "",
        bottles_value,
        compact_bottles_value,
        bottles,
        bottles > 0,
    )

    vintage = _int(_source_value(raw, fields, "vintage", "vi"))
    if vintage is not None and vintage <= 0:
        vintage = None

    has_owner_id, owner_id = _source_reference_id(
        raw, fields, "owner_id", "ownerId", "ow", "owner", "Owner"
    )
    if not has_owner_id and previous is not None:
        owner_id = previous.owner_id

    domain = _optional_text(
        _source_value(raw, fields, "domain", "owner_name", "owner_fullname")
    )
    if owner_id is not None and owner_id.casefold() in owner_names:
        domain = owner_names[owner_id.casefold()]
    elif previous is not None and previous.owner_id == owner_id:
        domain = domain or previous.domain

    return Wine(
        id=wine_id,
        name=_optional_text(_source_value(raw, fields, "name", "nm")) or "",
        bottles=bottles,
        bottles_in_cellar=0,
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
        domain=domain,
        owner_id=owner_id,
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
        value = raw.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def _deleted_kind(raw: JsonObject) -> str:
    """Normalize a deleted-object type, including PLOUD numeric object IDs."""
    numeric_types = {
        "100": "wine",
        "106": "owner",
        "111": "rack",
        "112": "rackitem",
    }
    for key in ("type", "Type", "objectType", "ObjectType", "ty"):
        value = raw.get(key)
        if isinstance(value, bool) or value is None:
            continue
        if isinstance(value, int):
            normalized = str(value)
        elif isinstance(value, str):
            normalized = value.strip().casefold()
        else:
            continue
        if not normalized:
            continue
        if normalized.isdecimal():
            return numeric_types.get(normalized, "")
        return normalized.replace("_", "").replace("-", "")
    return ""


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
) -> set[str]:
    """Apply a PLOUD delta and return unresolved new Owner references."""
    removed_wine_ids: set[str] = set()
    removed_rack_ids: set[str] = set()
    deleted_owner_ids: set[str] = set()
    unresolved_owner_ids: set[str] = set()
    owner_names: dict[str, str | None] = {}
    owner_records_seen: set[str] = set()

    # Owner names are transient to this response only. The resolved winery
    # name is copied into each affected Wine record.
    for raw in _collection(objects, PLOUD_COLLECTION_OWNERS):
        owner_id = _deleted_id(raw)
        if owner_id is None:
            continue
        owner_key = owner_id.casefold()
        owner_records_seen.add(owner_key)
        has_name, owner_name = _owner_display_name(raw)
        if not has_name:
            continue
        owner_names[owner_key] = owner_name
        for wine_id, wine in tuple(cellar.wines.items()):
            if wine.owner_id is not None and wine.owner_id.casefold() == owner_key:
                if wine.domain != owner_name:
                    cellar.wines[wine_id] = replace(wine, domain=owner_name)

    for raw in _collection(objects, PLOUD_COLLECTION_WINES):
        raw_id = raw.get("id")
        previous = cellar.wines.get(raw_id) if isinstance(raw_id, str) else None
        wine = _parse_wine(
            raw,
            owner_names=owner_names,
            previous=previous,
        )
        if (
            wine.owner_id is not None
            and wine.domain is None
            and wine.owner_id.casefold() not in owner_records_seen
            and (
                previous is None
                or previous.owner_id is None
                or previous.owner_id.casefold() != wine.owner_id.casefold()
                or previous.domain is not None
            )
        ):
            unresolved_owner_ids.add(wine.owner_id)
        # Keep every Wine reference, including zero-total-stock wines. A later
        # RackItem delta may assign one to a cellar position without repeating
        # its Wine object in the same response.
        cellar.wines[wine.id] = wine
        removed_wine_ids.discard(wine.id)

    seen_rack_ids: set[str] = set()
    for raw in _collection(objects, PLOUD_COLLECTION_RACKS):
        identifier = raw.get("id")
        if not isinstance(identifier, str) or not identifier.strip():
            raise PloudError("PLOUD returned a Rack without a valid ID")
        if identifier in seen_rack_ids:
            raise PloudError(f"PLOUD returned duplicate Rack ID: {identifier}")
        seen_rack_ids.add(identifier)
        cellar.racks[identifier] = Rack(
            identifier,
            _optional_text(raw.get("nm", raw.get("name"))) or "",
        )

    seen_rack_item_ids: set[str] = set()
    for raw in _collection(objects, PLOUD_COLLECTION_RACK_ITEMS):
        identifier = raw.get("id")
        if not isinstance(identifier, str) or not identifier.strip():
            raise PloudError("PLOUD returned a RackItem without a valid ID")
        if identifier in seen_rack_item_ids:
            raise PloudError(f"PLOUD returned duplicate RackItem ID: {identifier}")
        seen_rack_item_ids.add(identifier)
        previous = cellar.rack_items.get(identifier)

        rack_key = next(
            (key for key in ("rk", "rack_id", "rack") if key in raw),
            None,
        )
        wine_key = next(
            (key for key in ("wi", "wine_id", "wine") if key in raw),
            None,
        )
        row_key = next((key for key in ("rw", "row") if key in raw), None)
        column_key = next((key for key in ("cl", "column") if key in raw), None)

        rack_id = previous.rack_id if previous is not None else ""
        wine_id = previous.wine_id if previous is not None else ""
        row = previous.row if previous is not None else None
        column = previous.column if previous is not None else None
        if rack_key is not None:
            rack_id = _optional_text(raw[rack_key]) or ""
        if wine_key is not None:
            wine_id = _optional_text(raw[wine_key]) or ""
        if row_key is not None:
            row = _int(raw[row_key])
        if column_key is not None:
            column = _int(raw[column_key])

        item = RackItem(identifier, rack_id, wine_id, row, column)
        cellar.rack_items[item.id] = item

    for raw in _collection(objects, PLOUD_COLLECTION_ORDERS):
        identifier = raw.get("id")
        if not isinstance(identifier, str) or not identifier:
            raise PloudError("PLOUD returned an Order without a valid ID")
        wine_id = _optional_text(raw.get("wi", raw.get("wine_id", raw.get("wine"))))
        incoming = _int(raw.get("in"))
        outgoing = _int(raw.get("ot"))
        if (
            wine_id is None
            or incoming is None
            or outgoing is None
            or incoming < 0
            or outgoing < 0
        ):
            raise PloudError(f"PLOUD returned an invalid Order record: {identifier}")
        cellar.orders[identifier] = Order(
            id=identifier,
            wine_id=wine_id,
            incoming=incoming,
            outgoing=outgoing,
        )

    for raw in _collection(objects, PLOUD_COLLECTION_DELETED):
        object_id = _deleted_id(raw)
        if object_id is None:
            continue

        normalized_kind = _deleted_kind(raw)
        if normalized_kind == "owner" or (
            not normalized_kind
            and any(
                wine.owner_id is not None
                and wine.owner_id.casefold() == object_id.casefold()
                for wine in cellar.wines.values()
            )
        ):
            deleted_owner_ids.add(object_id.casefold())
            for wine_id, wine in tuple(cellar.wines.items()):
                if (
                    wine.owner_id is not None
                    and wine.owner_id.casefold() == object_id.casefold()
                ):
                    cellar.wines[wine_id] = replace(wine, domain=None)
            continue

        named_targets = {
            "wine": cellar.wines,
            "rack": cellar.racks,
            "rackitem": cellar.rack_items,
            "order": cellar.orders,
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
            ("order", cellar.orders),
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

    # An explicitly deleted Owner is not an unresolved reference: its wines
    # correctly keep no winery name.
    unresolved_owner_ids.difference_update(deleted_owner_ids)

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

    # RackItems, not Wine.bo, define the quantity physically stored in the
    # cellar. Refresh after applying both collections and all deletions.
    cellar.refresh_bottles_in_cellar()
    cellar.cursor = next_cursor
    cellar.initialized = True
    return unresolved_owner_ids
