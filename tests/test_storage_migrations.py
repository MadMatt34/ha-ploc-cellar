"""Regression tests for legacy cellar storage migrations."""
from __future__ import annotations

import pytest

from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine


def _wine() -> Wine:
    return Wine(
        id="wine",
        name="Vin",
        bottles=12,
        bottles_in_cellar=0,
        vintage=None,
        appellation=None,
        color=None,
        color_rgb=None,
        classification=None,
        region=None,
        country=None,
        grapes=None,
        cuvee=None,
        comment=None,
        alcohol_percent=None,
        service_temperature_min=None,
        service_temperature_max=None,
        bottle_format=None,
        bottle_volume_l=None,
        ploud_pid=None,
        domain=None,
        owner_id=None,
    )


@pytest.mark.parametrize("version", [1, 2, 3, 4, 5])
def test_legacy_versions_force_full_sync_and_keep_physical_cache(
    version: int,
) -> None:
    """Legacy schemas preserve known objects but never claim complete Orders."""
    cellar = Cellar(
        cursor=1_800_000_000_000,
        initialized=True,
        wines={"wine": _wine()},
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot": RackItem(
                id="slot",
                rack_id="rack",
                wine_id="wine",
                row=1,
                column=1,
            )
        },
        orders={"order": Order("order", "wine", incoming=5, outgoing=1)},
    )
    stored = cellar.to_storage()
    stored["version"] = version

    migrated = Cellar.from_storage(stored)

    assert migrated.initialized is True
    assert migrated.cursor == 1
    assert migrated.stock_reconstruction_complete is False
    assert migrated.wines["wine"].bottles_in_cellar == 1
    assert migrated.total_bottles == 1
    assert migrated.total_stock_bottles is None


def test_legacy_migration_normalizes_uuid_keys_and_references() -> None:
    """Legacy storage accepts noncanonical UUIDs and restores canonical links."""
    cellar = Cellar(
        cursor=123,
        initialized=True,
        wines={"wine": _wine()},
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot": RackItem(
                id="slot",
                rack_id="rack",
                wine_id="wine",
                row=1,
                column=1,
            )
        },
    )
    stored = cellar.to_storage()
    wine_uuid = "AABBCCDD-1234-5678-9ABC-DEF012345678"
    rack_uuid = "11223344-1234-5678-9ABC-DEF012345678"
    slot_uuid = "FFEEDDCC-1234-5678-9ABC-DEF012345678"
    wines = stored["wines"]
    racks = stored["racks"]
    items = stored["rack_items"]
    assert isinstance(wines, dict)
    assert isinstance(racks, dict)
    assert isinstance(items, dict)
    wine_record = wines.pop("wine")
    rack_record = racks.pop("rack")
    item_record = items.pop("slot")
    assert isinstance(wine_record, dict)
    assert isinstance(rack_record, dict)
    assert isinstance(item_record, dict)
    wine_record["id"] = wine_uuid
    rack_record["id"] = rack_uuid
    item_record.update(
        {"id": slot_uuid, "rack_id": rack_uuid, "wine_id": wine_uuid}
    )
    wines[wine_uuid] = wine_record
    racks[rack_uuid] = rack_record
    items[slot_uuid] = item_record
    stored["version"] = 5

    migrated = Cellar.from_storage(stored)

    assert list(migrated.wines) == [wine_uuid.lower()]
    assert list(migrated.racks) == [rack_uuid.lower()]
    assert list(migrated.rack_items) == [slot_uuid.lower()]
    assert migrated.rack_items[slot_uuid.lower()].rack_id == rack_uuid.lower()
    assert migrated.rack_items[slot_uuid.lower()].wine_id == wine_uuid.lower()


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("initialized", "yes"),
        ("cursor", True),
        ("last_sync", 123),
        ("stock_reconstruction_complete", "true"),
    ],
)
def test_current_storage_rejects_invalid_metadata(field: str, value: object) -> None:
    """Current schema metadata is strictly validated instead of coerced."""
    stored = Cellar(
        cursor=1,
        initialized=False,
        stock_reconstruction_complete=False,
    ).to_storage()
    stored[field] = value  # type: ignore[typeddict-item]

    with pytest.raises(ValueError):
        Cellar.from_storage(stored)
