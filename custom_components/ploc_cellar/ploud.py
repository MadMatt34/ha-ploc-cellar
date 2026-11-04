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


class PloudIncompleteDelta(PloudError):
    """A new or updated delta record lacks fields needed to apply it safely."""


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


def _source_field(
    raw: JsonObject,
    fields: JsonObject,
    *names: str,
) -> tuple[bool, object]:
    """Read a field while distinguishing omission from an explicit empty value."""
    found = False
    fallback: object = None
    for source in (raw, fields):
        for name in names:
            if name not in source:
                continue
            found = True
            fallback = source[name]
            if fallback is not None and not (
                isinstance(fallback, str) and not fallback.strip()
            ):
                return True, fallback
    return found, fallback


def _source_value(
    raw: JsonObject,
    fields: JsonObject,
    *names: str,
) -> object:
    """Read a display-ready field from a PLOUD record or its expanded fields."""
    _, value = _source_field(raw, fields, *names)
    return value


def _merged_optional_text(
    raw: JsonObject,
    fields: JsonObject,
    previous: str | None,
    *names: str,
) -> str | None:
    """Keep an omitted value, but apply an explicitly empty value as a clear."""
    present, value = _source_field(raw, fields, *names)
    if not present:
        return previous
    if value is None:
        return None
    if not isinstance(value, str):
        raise PloudError(f"PLOUD returned an invalid text field: {names[0]}")
    return value.strip() or None


def _merged_positive_float(
    raw: JsonObject,
    fields: JsonObject,
    previous: float | None,
    *names: str,
) -> float | None:
    """Merge an optional numeric field; PLOUD zero represents no value."""
    present, value = _source_field(raw, fields, *names)
    if not present:
        return previous
    if value is None or (isinstance(value, str) and not value.strip()):
        return None
    parsed = _float(value)
    if parsed is None or parsed < 0:
        raise PloudError(f"PLOUD returned an invalid numeric field: {names[0]}")
    return parsed if parsed > 0 else None


def _reference_id(value: object) -> str | None:
    """Normalize a PLOUD reference ID and reject malformed non-empty values."""
    if value is None:
        return None
    if isinstance(value, bool):
        raise PloudError("PLOUD returned an invalid reference ID")
    if isinstance(value, str):
        return value.strip() or None
    if isinstance(value, int):
        return str(value)
    raise PloudError("PLOUD returned an invalid reference ID")


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
    """Return a validated Owner display name when its name field is present."""
    for key in ("fullname", "fullName", "full_name", "nm", "name", "Name"):
        if key in raw:
            value = raw[key]
            if value is not None and not isinstance(value, str):
                raise PloudError("PLOUD returned an invalid Owner display name")
            return True, _optional_text(value)
    return False, None


def _parse_wine(
    raw: JsonObject,
    *,
    owner_names: dict[str, str | None],
    previous: Wine | None,
) -> Wine:
    """Convert a PLOUD Wine record, retaining fields omitted by an incremental delta."""
    stored_fields = raw.get("ploud_reference_fields")
    fields = (
        cast(JsonObject, stored_fields) if isinstance(stored_fields, dict) else {}
    )

    wine_id = raw.get("id")
    if not isinstance(wine_id, str) or not wine_id.strip():
        raise PloudError("PLOUD returned a wine without a valid ID")

    # Missing count fields in an existing partial update must not reset raw
    # PLOUD metadata. A new Wine still needs an initial count value.
    has_bottles, bottles_value = _source_field(raw, fields, "bottles", "bo")
    if not has_bottles or bottles_value is None or (
        isinstance(bottles_value, str) and not bottles_value.strip()
    ):
        if previous is None:
            raise PloudIncompleteDelta(
                f"New PLOUD Wine record is missing its bottle count: {wine_id}"
            )
        bottles = previous.bottles
    else:
        bottles = _int(bottles_value)
        if bottles is None or bottles < 0:
            raise PloudError(
                f"PLOUD returned an invalid bottle count for wine {wine_id}"
            )

    has_compact_bottles, compact_bottles_value = _source_field(raw, fields, "bo")
    compact_bottles = (
        _int(compact_bottles_value) if has_compact_bottles else None
    )
    if (
        compact_bottles is not None
        and bottles != compact_bottles
    ):
        _LOGGER.warning(
            "PLOUD bottle-count fields disagree for wine %s (%s): "
            "bottles=%r, bo=%r; using bottles=%d",
            wine_id,
            _optional_text(_source_value(raw, fields, "name", "nm")) or (
                previous.name if previous is not None else ""
            ),
            bottles_value,
            compact_bottles_value,
            bottles,
        )

    has_name, name_value = _source_field(raw, fields, "name", "nm")
    if has_name:
        if name_value is not None and not isinstance(name_value, str):
            raise PloudError(f"PLOUD returned an invalid name for wine {wine_id}")
        name = _optional_text(name_value) or ""
    else:
        name = previous.name if previous is not None else ""

    has_vintage, vintage_value = _source_field(raw, fields, "vintage", "vi")
    if not has_vintage:
        vintage = previous.vintage if previous is not None else None
    elif vintage_value is None or (
        isinstance(vintage_value, str) and not vintage_value.strip()
    ):
        vintage = None
    else:
        vintage = _int(vintage_value)
        if vintage is None:
            raise PloudError(f"PLOUD returned an invalid vintage for wine {wine_id}")
        if vintage < 0:
            raise PloudError(f"PLOUD returned an invalid vintage for wine {wine_id}")
        if vintage == 0:
            vintage = None

    color = _merged_optional_text(
        raw, fields, previous.color if previous is not None else None, "color"
    )
    has_color_id, color_id_value = _source_field(raw, fields, "color_id", "co")
    has_rgb, rgb_value = _source_field(raw, fields, "color_rgb")
    if has_color_id or has_rgb:
        color_id = _reference_id(color_id_value) if has_color_id else None
        color_rgb = _COLOR_RGB_BY_ID.get(color_id) if color_id is not None else None
        if color_rgb is None and has_rgb:
            color_rgb = _parse_color_rgb(rgb_value)
            if (
                rgb_value is not None
                and not (isinstance(rgb_value, str) and not rgb_value.strip())
                and color_rgb is None
            ):
                raise PloudError(
                    f"PLOUD returned an invalid RGB color for wine {wine_id}"
                )
    else:
        color_rgb = previous.color_rgb if previous is not None else None

    has_owner_id, owner_value = _source_field(
        raw, fields, "owner_id", "ownerId", "ow", "owner", "Owner"
    )
    owner_id = (
        _reference_id(owner_value)
        if has_owner_id
        else previous.owner_id if previous is not None else None
    )

    has_domain, domain_value = _source_field(
        raw, fields, "domain", "owner_name", "owner_fullname"
    )
    if has_domain:
        if domain_value is not None and not isinstance(domain_value, str):
            raise PloudError(
                f"PLOUD returned an invalid winery name for wine {wine_id}"
            )
        domain = _optional_text(domain_value)
    elif previous is not None and previous.owner_id == owner_id:
        domain = previous.domain
    else:
        domain = None
    if owner_id is not None and owner_id.casefold() in owner_names:
        domain = owner_names[owner_id.casefold()]

    return Wine(
        id=wine_id,
        name=name,
        bottles=bottles,
        bottles_in_cellar=(
            previous.bottles_in_cellar if previous is not None else 0
        ),
        vintage=vintage,
        appellation=_merged_optional_text(
            raw,
            fields,
            previous.appellation if previous is not None else None,
            "appellation",
        ),
        color=color,
        color_rgb=color_rgb,
        classification=_merged_optional_text(
            raw,
            fields,
            previous.classification if previous is not None else None,
            "classification",
        ),
        region=_merged_optional_text(
            raw, fields, previous.region if previous is not None else None, "region"
        ),
        country=_merged_optional_text(
            raw, fields, previous.country if previous is not None else None, "country"
        ),
        grapes=_merged_optional_text(
            raw, fields, previous.grapes if previous is not None else None,
            "grapes", "gr",
        ),
        cuvee=_merged_optional_text(
            raw, fields, previous.cuvee if previous is not None else None,
            "cuvee", "cu",
        ),
        comment=_merged_optional_text(
            raw, fields, previous.comment if previous is not None else None,
            "comment", "cs",
        ),
        alcohol_percent=_merged_positive_float(
            raw, fields,
            previous.alcohol_percent if previous is not None else None,
            "alcohol_percent", "de",
        ),
        service_temperature_min=_merged_positive_float(
            raw, fields,
            previous.service_temperature_min if previous is not None else None,
            "service_temperature_min", "ti",
        ),
        service_temperature_max=_merged_positive_float(
            raw, fields,
            previous.service_temperature_max if previous is not None else None,
            "service_temperature_max", "to",
        ),
        bottle_format=_merged_optional_text(
            raw, fields, previous.bottle_format if previous is not None else None,
            "bottle_format",
        ),
        bottle_volume_l=_merged_positive_float(
            raw, fields,
            previous.bottle_volume_l if previous is not None else None,
            "bottle_volume_l",
        ),
        ploud_pid=_merged_optional_text(
            raw, fields, previous.ploud_pid if previous is not None else None,
            "ploud_pid", "pid",
        ),
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
    """Extract and normalize the ID of a PLOUD object."""
    for key in ("id", "Id", "ID"):
        value = raw.get(key)
        if isinstance(value, str):
            normalized = value.strip()
            if normalized:
                return normalized
        elif isinstance(value, int) and not isinstance(value, bool):
            return str(value)
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
    seen_collection_names: set[str] = set()
    for name, values in objects.items():
        normalized_name = name.casefold()
        if normalized_name not in supported_collections:
            continue
        if normalized_name in seen_collection_names:
            raise PloudError(
                "PLOUD returned duplicate collection names differing only "
                f"by case: {name}"
            )
        seen_collection_names.add(normalized_name)
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
    seen_owner_ids: set[str] = set()
    for raw in _collection(objects, PLOUD_COLLECTION_OWNERS):
        owner_id = _deleted_id(raw)
        if owner_id is None:
            raise PloudError("PLOUD returned an Owner without a valid ID")
        owner_key = owner_id.casefold()
        if owner_key in seen_owner_ids:
            raise PloudError(f"PLOUD returned duplicate Owner ID: {owner_id}")
        seen_owner_ids.add(owner_key)
        has_name, owner_name = _owner_display_name(raw)
        if not has_name:
            continue
        owner_records_seen.add(owner_key)
        owner_names[owner_key] = owner_name
        for wine_id, wine in tuple(cellar.wines.items()):
            if wine.owner_id is not None and wine.owner_id.casefold() == owner_key:
                if wine.domain != owner_name:
                    cellar.wines[wine_id] = replace(wine, domain=owner_name)

    seen_wine_ids: set[str] = set()
    for raw in _collection(objects, PLOUD_COLLECTION_WINES):
        raw_id = raw.get("id")
        if not isinstance(raw_id, str) or not raw_id.strip():
            raise PloudError("PLOUD returned a wine without a valid ID")
        if raw_id in seen_wine_ids:
            raise PloudError(f"PLOUD returned duplicate Wine ID: {raw_id}")
        seen_wine_ids.add(raw_id)
        previous = cellar.wines.get(raw_id)
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
            unresolved_owner_ids.add(wine.owner_id.casefold())
        # Keep every Wine reference, including zero-total-stock wines. A later
        # RackItem delta may assign one to a cellar position without repeating
        # its Wine object in the same response.
        cellar.wines[wine.id] = wine
        removed_wine_ids.discard(wine.id)

    seen_rack_ids: set[str] = set()
    for raw in _collection(objects, PLOUD_COLLECTION_RACKS):
        raw_identifier = raw.get("id")
        if not isinstance(raw_identifier, str) or not raw_identifier.strip():
            raise PloudError("PLOUD returned a Rack without a valid ID")
        identifier = raw_identifier.strip()
        if identifier in seen_rack_ids:
            raise PloudError(f"PLOUD returned duplicate Rack ID: {identifier}")
        seen_rack_ids.add(identifier)

        previous = cellar.racks.get(identifier)
        has_name, name_value = _source_field(raw, {}, "nm", "name")
        if not has_name:
            if previous is None:
                raise PloudIncompleteDelta(
                    f"New PLOUD Rack {identifier} is missing its name"
                )
            name = previous.name
        elif name_value is None:
            name = ""
        elif isinstance(name_value, str):
            name = name_value.strip()
        else:
            raise PloudError(f"PLOUD returned an invalid name for Rack {identifier}")

        cellar.racks[identifier] = Rack(identifier, name)

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

        if previous is None and (rack_key is None or wine_key is None):
            raise PloudIncompleteDelta(
                f"New PLOUD RackItem {identifier} is missing its rack or wine field"
            )

        rack_id = previous.rack_id if previous is not None else ""
        wine_id = previous.wine_id if previous is not None else ""
        row = previous.row if previous is not None else None
        column = previous.column if previous is not None else None

        if rack_key is not None:
            raw_rack_id = raw[rack_key]
            if not isinstance(raw_rack_id, str) or not raw_rack_id.strip():
                raise PloudError(
                    f"PLOUD returned an invalid rack ID for RackItem {identifier}"
                )
            rack_id = raw_rack_id.strip()

        if wine_key is not None:
            raw_wine_id = raw[wine_key]
            if raw_wine_id is None or (
                isinstance(raw_wine_id, str) and not raw_wine_id.strip()
            ):
                wine_id = ""
            elif isinstance(raw_wine_id, str):
                wine_id = raw_wine_id.strip()
            else:
                raise PloudError(
                    f"PLOUD returned an invalid wine ID for RackItem {identifier}"
                )

        if row_key is not None:
            raw_row = raw[row_key]
            if raw_row is None or (
                isinstance(raw_row, str) and not raw_row.strip()
            ):
                row = None
            else:
                row = _int(raw_row)
                if row is None:
                    raise PloudError(
                        f"PLOUD returned an invalid row for RackItem {identifier}"
                    )

        if column_key is not None:
            raw_column = raw[column_key]
            if raw_column is None or (
                isinstance(raw_column, str) and not raw_column.strip()
            ):
                column = None
            else:
                column = _int(raw_column)
                if column is None:
                    raise PloudError(
                        f"PLOUD returned an invalid column for RackItem {identifier}"
                    )

        item = RackItem(identifier, rack_id, wine_id, row, column)
        cellar.rack_items[item.id] = item

    seen_order_ids: set[str] = set()
    for raw in _collection(objects, PLOUD_COLLECTION_ORDERS):
        identifier = raw.get("id")
        if not isinstance(identifier, str) or not identifier.strip():
            raise PloudError("PLOUD returned an Order without a valid ID")
        if identifier in seen_order_ids:
            raise PloudError(f"PLOUD returned duplicate Order ID: {identifier}")
        seen_order_ids.add(identifier)

        previous = cellar.orders.get(identifier)
        wine_key = next(
            (key for key in ("wi", "wine_id", "wine") if key in raw),
            None,
        )
        incoming_key = next(
            (key for key in ("in", "incoming") if key in raw),
            None,
        )
        outgoing_key = next(
            (key for key in ("ot", "outgoing") if key in raw),
            None,
        )
        if previous is None and (
            wine_key is None or incoming_key is None or outgoing_key is None
        ):
            raise PloudIncompleteDelta(
                f"New PLOUD Order {identifier} is missing required movement fields"
            )

        wine_id = (
            _optional_text(raw[wine_key])
            if wine_key is not None
            else previous.wine_id if previous is not None else None
        )
        incoming = (
            _int(raw[incoming_key])
            if incoming_key is not None
            else previous.incoming if previous is not None else None
        )
        outgoing = (
            _int(raw[outgoing_key])
            if outgoing_key is not None
            else previous.outgoing if previous is not None else None
        )
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
        elif item.wine_id and item.wine_id in removed_wine_ids:
            cellar.rack_items[item_id] = RackItem(
                item.id, item.rack_id, "", item.row, item.column
            )

    # RackItems, not Wine.bo, define the quantity physically stored in the
    # cellar. Refresh after applying both collections and all deletions.
    cellar.refresh_bottles_in_cellar()
    cellar.cursor = next_cursor
    cellar.initialized = True
    return unresolved_owner_ids
