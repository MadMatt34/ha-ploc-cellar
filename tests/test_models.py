"""Unit tests for stock reconstruction and cellar storage migrations."""
from __future__ import annotations

import pytest

from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine


def _wine(wine_id: str, *, bottles: int = 0) -> Wine:
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
    """Movement totals, physical lower bounds and orphaned slots stay distinct."""
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
            "slot-orphan": _item("slot-orphan", "deleted-wine"),
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
    assert stock_a.bottles_to_store == 2
    assert stock_a.movement_warnings == ()

    stock_b = cellar.stock_for(cellar.wines["wine-b"])
    assert stock_b.movement_balance == 1
    assert stock_b.effective_stock == 2
    assert stock_b.bottles_to_store == 0
    assert stock_b.movement_difference_bottles == 1
    assert stock_b.movement_warnings == ("movement_balance_mismatch",)

    stock_c = cellar.stock_for(cellar.wines["wine-c"])
    assert stock_c.movement_balance == -3
    assert stock_c.effective_stock == 0
    assert stock_c.bottles_to_store == 0
    assert stock_c.movement_difference_bottles == 3
    assert stock_c.movement_warnings == (
        "negative_movement_balance",
        "movement_balance_mismatch",
    )

    assert cellar.total_positions == 4
    assert cellar.occupied_positions == 4
    assert cellar.empty_positions == 0
    assert cellar.total_bottles == 4
    assert cellar.stocked_wines == 2
    assert cellar.wine_references == 2
    assert cellar.total_stock_bottles == 6
    assert cellar.total_bottles_to_store == 2
    assert cellar.inventory_error_wines == 1
    assert cellar.inventory_error_count == 1
    assert cellar.movement_warning_wines == 2
    assert cellar.movement_warning_bottles == 4
    assert cellar.orphaned_wine_positions == 1
    assert cellar.orphaned_order_count == 1


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
    assert stock.bottles_to_store is None
    assert stock.movement_difference_bottles is None

    assert cellar.total_bottles == 2
    assert cellar.total_positions == 2
    assert cellar.empty_positions == 0
    assert cellar.stocked_wines == 1
    assert cellar.orphaned_wine_positions == 1
    assert cellar.wine_references is None
    assert cellar.total_stock_bottles is None
    assert cellar.total_bottles_to_store is None
    assert cellar.inventory_error_wines is None
    assert cellar.inventory_error_count is None
    assert cellar.movement_warning_wines is None
    assert cellar.movement_warning_bottles is None
    assert cellar.orphaned_order_count is None


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
    assert restored.orphaned_wine_positions == 1
    assert restored.cursor == 1
