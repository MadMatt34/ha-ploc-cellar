"""Unit tests for stock reconstruction and cellar storage migrations."""
from __future__ import annotations

import pytest
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine


def _wine(
    wine_id: str, *, bottles: int = 0, meals: int | None = None
) -> Wine:
    """Build a wine with all persisted fields populated."""
    return Wine(
        id=wine_id,
        name=wine_id,
        bottles=bottles,
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
        meals=meals,
    )


def _item(item_id: str, wine_id: str, rack_id: str = "rack") -> RackItem:
    """Build a physical cellar position."""
    return RackItem(
        id=item_id,
        rack_id=rack_id,
        wine_id=wine_id,
        row=1,
        column=1,
    )


def test_stock_reconstruction_and_global_aggregates() -> None:
    """Movement totals, physical stock and integrity counters stay distinct."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "wine-a": _wine("wine-a", bottles=99),
            "wine-b": _wine("wine-b"),
            "wine-c": _wine("wine-c"),
        },
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot-a": _item("slot-a", "wine-a"),
            "slot-b1": _item("slot-b1", "wine-b"),
            "slot-b2": _item("slot-b2", "wine-b"),
            "slot-orphan": _item("slot-orphan", "deleted-wine", "missing-rack"),
        },
        orders={
            "order-a": Order("order-a", "wine-a", incoming=5, outgoing=2),
            "order-b": Order("order-b", "wine-b", incoming=1, outgoing=0),
            "order-c": Order("order-c", "wine-c", incoming=0, outgoing=3),
            "order-orphan": Order(
                "order-orphan", "deleted-wine", incoming=8, outgoing=1
            ),
        },
    )
    cellar.refresh_bottles_in_cellar()

    stock_a = cellar.stock_for(cellar.wines["wine-a"])
    assert stock_a.purchased == 5
    assert stock_a.consumed == 2
    assert stock_a.movement_balance == 3
    assert stock_a.effective_stock == 3
    assert stock_a.unlocated_bottles == 2
    assert stock_a.negative_movement_bottles == 0
    assert stock_a.physical_surplus_bottles == 0

    stock_b = cellar.stock_for(cellar.wines["wine-b"])
    assert stock_b.movement_balance == 1
    assert stock_b.effective_stock == 2
    assert stock_b.unlocated_bottles == 0
    assert stock_b.negative_movement_bottles == 0
    assert stock_b.physical_surplus_bottles == 1

    stock_c = cellar.stock_for(cellar.wines["wine-c"])
    assert stock_c.movement_balance == -3
    assert stock_c.effective_stock == 0
    assert stock_c.unlocated_bottles == 0
    assert stock_c.negative_movement_bottles == 3
    assert stock_c.physical_surplus_bottles == 0

    assert cellar.total_positions == 4
    assert cellar.occupied_positions == 4
    assert cellar.empty_positions == 0
    assert cellar.total_bottles == 4
    assert cellar.stocked_wines == 2
    assert cellar.wine_references == 2
    assert cellar.total_stock_bottles == 6
    assert cellar.unlocated_wines == 1
    assert cellar.unlocated_bottles == 2
    assert cellar.negative_movement_wines == 1
    assert cellar.negative_movement_bottles == 3
    assert cellar.physical_surplus_wines == 1
    assert cellar.physical_surplus_bottles == 1
    assert cellar.positions_without_rack == 1
    assert cellar.positions_with_unknown_wine == 1
    assert cellar.orders_without_wine == 1



def test_negative_movement_and_physical_surplus_are_independent() -> None:
    """A physical surplus can coexist with a negative movement balance."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={"wine": _wine("wine")},
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot-1": _item("slot-1", "wine"),
            "slot-2": _item("slot-2", "wine"),
        },
        orders={"order": Order("order", "wine", incoming=0, outgoing=1)},
    )
    cellar.refresh_bottles_in_cellar()

    stock = cellar.stock_for(cellar.wines["wine"])

    assert stock.movement_balance == -1
    assert stock.calculated_stock == 0
    assert stock.effective_stock == 2
    assert stock.unlocated_bottles == 0
    assert stock.negative_movement_bottles == 1
    assert stock.physical_surplus_bottles == 2
    assert cellar.negative_movement_wines == 1
    assert cellar.negative_movement_bottles == 1
    assert cellar.physical_surplus_wines == 1
    assert cellar.physical_surplus_bottles == 2


def test_incomplete_order_history_exposes_only_physical_facts() -> None:
    """A legacy offline cache never invents movement-derived stock."""
    cellar = Cellar(
        wines={"wine": _wine("wine", bottles=50)},
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot": _item("slot", "wine"),
            "orphan": _item("orphan", "unknown-wine"),
        },
    )
    cellar.refresh_bottles_in_cellar()

    stock = cellar.stock_for(cellar.wines["wine"])
    assert stock.effective_stock == 1
    assert stock.purchased is None
    assert stock.consumed is None
    assert stock.movement_balance is None
    assert stock.calculated_stock is None
    assert stock.unlocated_bottles is None
    assert stock.negative_movement_bottles is None
    assert stock.physical_surplus_bottles is None

    assert cellar.total_bottles == 2
    assert cellar.total_positions == 2
    assert cellar.empty_positions == 0
    assert cellar.stocked_wines == 1
    assert cellar.positions_with_unknown_wine == 1
    assert cellar.wine_references is None
    assert cellar.total_stock_bottles is None
    assert cellar.unlocated_wines is None
    assert cellar.unlocated_bottles is None
    assert cellar.negative_movement_wines is None
    assert cellar.negative_movement_bottles is None
    assert cellar.physical_surplus_wines is None
    assert cellar.physical_surplus_bottles is None
    assert cellar.positions_without_rack == 0
    assert cellar.orders_without_wine is None


def test_version_six_complete_orders_migrate_offline_but_force_snapshot() -> None:
    """A v6 cache with a post-full-sync cursor retains valid stock offline."""
    cellar = Cellar(
        cursor=1_800_000_000_000,
        initialized=True,
        stock_reconstruction_complete=True,
        wines={"wine": _wine("wine")},
        orders={"order": Order("order", "wine", incoming=4, outgoing=1)},
    )
    stored = cellar.to_storage()
    stored["version"] = 6
    stored.pop("stock_reconstruction_complete")

    migrated = Cellar.from_storage(stored)

    assert migrated.initialized is True
    assert migrated.cursor == 1
    assert migrated.stock_reconstruction_complete is True
    assert migrated.stock_for(migrated.wines["wine"]).effective_stock == 3
    assert migrated.total_stock_bottles == 3


def test_version_six_cursor_one_migrates_with_unknown_stock() -> None:
    """A v6 cache still on its initial cursor has no proven full Orders history."""
    cellar = Cellar(
        cursor=1,
        initialized=True,
        stock_reconstruction_complete=False,
        wines={"wine": _wine("wine")},
        orders={"order": Order("order", "wine", incoming=4, outgoing=1)},
    )
    stored = cellar.to_storage()
    stored["version"] = 6
    stored.pop("stock_reconstruction_complete")

    migrated = Cellar.from_storage(stored)

    assert migrated.cursor == 1
    assert migrated.stock_reconstruction_complete is False
    assert migrated.total_stock_bottles is None


def test_version_seven_rejects_incomplete_stock_with_incremental_cursor() -> None:
    """An incomplete movement snapshot must never resume from an incremental cursor."""
    stored = Cellar(
        cursor=123456,
        initialized=True,
        stock_reconstruction_complete=False,
    ).to_storage()

    with pytest.raises(ValueError, match="full-sync cursor"):
        Cellar.from_storage(stored)


def test_version_seven_round_trip_preserves_orphaned_physical_positions() -> None:
    """Storage round trips do not convert unresolved occupied slots into empties."""
    cellar = Cellar(
        cursor=1_800_000_000_000,
        initialized=True,
        stock_reconstruction_complete=True,
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={"slot": _item("slot", "missing-wine")},
    )

    restored = Cellar.from_storage(cellar.to_storage())

    assert restored.total_positions == 1
    assert restored.occupied_positions == 1
    assert restored.total_bottles == 1
    assert restored.empty_positions == 0
    assert restored.positions_with_unknown_wine == 1
    assert restored.cursor == 1



def test_reference_collections_and_compact_wine_fields_survive_storage() -> None:
    """Persist lookup indexes and source IDs for future incremental updates."""
    wine = Wine(
        id="wine",
        name="Vin",
        bottles=1,
        bottles_in_cellar=0,
        vintage=2022,
        appellation="Languedoc",
        color="Rouge",
        color_rgb=(201, 25, 58),
        classification=None,
        region="Languedoc-Roussillon",
        country="France",
        grapes="Syrah",
        cuvee=None,
        comment=None,
        alcohol_percent=None,
        service_temperature_min=None,
        service_temperature_max=None,
        bottle_format="Bouteille",
        bottle_volume_l=0.75,
        ploud_pid=None,
        domain=None,
        owner_id=None,
        ploud_reference_fields={"ap": "app-1", "co": "color-1", "vf": "format-1"},
    )
    cellar = Cellar(
        wines={"wine": wine},
        references={
            "appellations": {"app-1": {"id": "app-1", "nm": "Languedoc"}},
            "colors": {"color-1": {"id": "color-1", "nm": "Rouge"}},
            "bottleFormats": {
                "format-1": {"id": "format-1", "nm": "Bouteille", "vo": 0.75}
            },
        },
    )

    restored = Cellar.from_storage(cellar.to_storage())

    assert restored.references == cellar.references
    assert (
        restored.wines["wine"].ploud_reference_fields
        == wine.ploud_reference_fields
    )


def test_legacy_cache_without_reference_indexes_requests_full_sync() -> None:
    """An old cache without lookup indexes must bootstrap references on next refresh."""
    cellar = Cellar(
        cursor=123456,
        initialized=True,
        stock_reconstruction_complete=True,
        wines={"wine": _wine("wine")},
    )

    restored = Cellar.from_storage(cellar.to_storage())

    assert restored.cursor == 1
    assert restored.stock_reconstruction_complete is True


def test_wine_meal_bitmask_survives_storage_round_trip() -> None:
    """The raw meal bitmask, including unknown future flags, is persisted."""
    cellar = Cellar(
        wines={
            "wine": _wine(
                "wine", meals=8192 | 2048 | 32
            )
        }
    )

    restored = Cellar.from_storage(cellar.to_storage())

    assert restored.wines["wine"].meals == 10272


def test_legacy_wine_meals_are_restored_from_compact_reference_fields() -> None:
    """Older caches can recover ml from their retained PLOUD compact fields."""
    stored = Cellar(wines={"wine": _wine("wine")}).to_storage()
    wines = stored["wines"]
    assert isinstance(wines, dict)
    record = wines["wine"]
    assert isinstance(record, dict)
    record.pop("meals")
    record["ploud_reference_fields"] = {"ml": 2080}

    restored = Cellar.from_storage(stored)

    assert restored.wines["wine"].meals == 2080


def test_order_aggregate_is_refreshed_after_delta_mutations() -> None:
    """A committed Orders delta rebuilds the aggregate used by stock_for."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={"wine": _wine("wine")},
        orders={"order": Order("order", "wine", incoming=3, outgoing=1)},
    )
    assert cellar.stock_for(cellar.wines["wine"]).movement_balance == 2

    cellar.orders["order-2"] = Order("order-2", "wine", incoming=4, outgoing=0)
    cellar.refresh_bottles_in_cellar()

    stock = cellar.stock_for(cellar.wines["wine"])
    assert stock.purchased == 7
    assert stock.consumed == 1
    assert stock.movement_balance == 6
