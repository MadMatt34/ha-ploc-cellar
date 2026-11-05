"""Regression tests for PLOUD delta merge and deletion semantics."""
from __future__ import annotations

import pytest
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine
from ploc_cellar.ploud import PloudIncompleteDelta, apply_sync


def _wine(wine_id: str) -> Wine:
    """Build a complete Wine record."""
    return Wine(
        id=wine_id,
        name="Vin",
        bottles=0,
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


def test_partial_order_delta_preserves_omitted_fields() -> None:
    """An Order update changes only supplied fields."""
    cellar = Cellar(
        orders={
            "order": Order(
                id="order",
                wine_id="wine",
                incoming=7,
                outgoing=2,
            )
        }
    )

    apply_sync(cellar, {"Orders": [{"id": "order", "ot": 4}]}, 123)

    assert cellar.orders["order"] == Order(
        id="order",
        wine_id="wine",
        incoming=7,
        outgoing=4,
    )


def test_new_order_missing_a_required_field_requests_full_sync() -> None:
    """A partial record cannot create a movement with fabricated quantities."""
    cellar = Cellar()

    with pytest.raises(PloudIncompleteDelta):
        apply_sync(cellar, {"Orders": [{"id": "order", "in": 2, "ot": 0}]}, 123)

    assert cellar.orders == {}


def test_partial_rack_item_delta_preserves_unmentioned_references() -> None:
    """A position update to one coordinate retains its other known fields."""
    original = RackItem(
        id="slot",
        rack_id="rack",
        wine_id="wine",
        row=2,
        column=3,
    )
    cellar = Cellar(
        racks={"rack": Rack(id="rack", name="Cave")},
        wines={"wine": _wine("wine")},
        rack_items={"slot": original},
    )

    apply_sync(cellar, {"RackItems": [{"id": "slot", "rw": 5}]}, 123)

    assert cellar.rack_items["slot"] == RackItem(
        id="slot",
        rack_id="rack",
        wine_id="wine",
        row=5,
        column=3,
    )
    assert cellar.wines["wine"].bottles_in_cellar == 1


def test_new_rack_item_without_rack_requests_full_sync() -> None:
    """A new physical position must identify the rack it belongs to."""
    cellar = Cellar()

    with pytest.raises(PloudIncompleteDelta):
        apply_sync(
            cellar,
            {"RackItems": [{"id": "slot", "wi": "", "rw": 1}]},
            123,
        )

    assert cellar.rack_items == {}


def test_full_snapshot_rack_item_without_wine_is_an_empty_position() -> None:
    """A full snapshot may omit the wine reference for an empty position."""
    cellar = Cellar(
        racks={"rack": Rack(id="rack", name="Cave")},
    )

    apply_sync(
        cellar,
        {"RackItems": [{"id": "slot", "rk": "rack", "rw": 1, "cl": 2}]},
        123,
        full_snapshot=True,
    )

    assert cellar.rack_items["slot"] == RackItem(
        id="slot",
        rack_id="rack",
        wine_id="",
        row=1,
        column=2,
    )
    assert cellar.empty_positions == 1


def test_incremental_new_rack_item_without_wine_still_requests_full_sync() -> None:
    """A partial delta cannot silently turn a missing wine field into an empty slot."""
    cellar = Cellar()

    with pytest.raises(PloudIncompleteDelta):
        apply_sync(
            cellar,
            {"RackItems": [{"id": "slot", "rk": "rack", "rw": 1}]},
            123,
        )

    assert cellar.rack_items == {}


def test_deleting_wine_frees_slot_but_keeps_order_history() -> None:
    """Wine deletion frees physical slots and preserves historic movements."""
    cellar = Cellar(
        wines={"wine": _wine("wine")},
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
        orders={"order": Order("order", "wine", incoming=3, outgoing=1)},
    )

    apply_sync(
        cellar,
        {"DeletedObjects": [{"id": "wine", "type": "wine"}]},
        123,
    )

    assert "wine" not in cellar.wines
    assert cellar.rack_items["slot"].wine_id == ""
    assert cellar.total_positions == 1
    assert cellar.occupied_positions == 0
    assert cellar.empty_positions == 1
    assert "order" in cellar.orders
    assert cellar.orders_without_wine is None


def test_deleting_rack_removes_its_physical_positions() -> None:
    """A deleted rack removes its positions rather than making them empty."""
    cellar = Cellar(
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot": RackItem(
                id="slot",
                rack_id="rack",
                wine_id="",
                row=1,
                column=1,
            )
        },
    )

    apply_sync(
        cellar,
        {"DeletedObjects": [{"id": "rack", "type": "rack"}]},
        123,
    )

    assert cellar.racks == {}
    assert cellar.rack_items == {}
    assert cellar.total_positions == 0
