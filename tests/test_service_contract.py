"""Explicit compatibility tests for the public inventory service contract."""
from __future__ import annotations

from typing import cast

from ploc_cellar import _build_inventory_response
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine


def _contract_wine() -> Wine:
    """Build a wine with representative nullable and populated fields."""
    return Wine(
        id="wine-1",
        name="Mas Olivier",
        bottles=2,
        bottles_in_cellar=1,
        vintage=2021,
        appellation="Faugères",
        color="Rouge",
        color_rgb=(120, 20, 30),
        classification=None,
        region="Languedoc",
        country="France",
        grapes="Syrah",
        cuvee=None,
        comment=None,
        alcohol_percent=13.5,
        service_temperature_min=14.0,
        service_temperature_max=16.0,
        bottle_format="Bouteille",
        bottle_volume_l=0.75,
        ploud_pid="ploud-1",
        domain="Domaine Mas Olivier",
        owner_id=None,
        ploud_reference_fields={"im": "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"},
        meals=2080,
    )


def test_get_inventory_response_matches_public_contract() -> None:
    """Pin every exposed key and nested object shape consumed by TypeScript."""
    cellar = Cellar(
        last_sync="2026-11-07T10:00:00+00:00",
        stock_reconstruction_complete=True,
        wines={"wine-1": _contract_wine()},
        racks={"rack-1": Rack(id="rack-1", name="Cave principale")},
        rack_items={
            "slot-1": RackItem(
                id="slot-1",
                rack_id="rack-1",
                wine_id="wine-1",
                row=2,
                column=3,
            )
        },
        orders={
            "order-1": Order(
                id="order-1", wine_id="wine-1", incoming=0, outgoing=2
            )
        },
    )

    response = _build_inventory_response(
        cellar,
        search="",
        color="",
        image_url_builder=lambda identifier: f"/api/image/{identifier}",
    )

    assert set(response) == {
        "stale",
        "total_bottles",
        "stocked_wines",
        "wine_references",
        "total_stock_bottles",
        "stock_reconstruction_complete",
        "total_positions",
        "empty_positions",
        "unlocated_wines",
        "unlocated_bottles",
        "negative_movement_wines",
        "negative_movement_bottles",
        "physical_surplus_wines",
        "physical_surplus_bottles",
        "wine_diagnostics",
        "matching_wines",
        "rack_count",
        "occupied_positions",
        "positions_without_rack",
        "positions_with_unknown_wine",
        "orders_without_wine",
        "racks",
        "rack_items",
        "wines",
        "last_sync",
    }

    wines = cast(list[dict[str, object]], response["wines"])
    assert len(wines) == 1
    assert set(wines[0]) == {
        "id",
        "name",
        "domain",
        "bottles",
        "effective_stock",
        "ploud_bottles",
        "bottles_in_cellar",
        "unlocated_bottles",
        "purchased",
        "consumed",
        "movement_balance",
        "calculated_stock",
        "negative_movement_bottles",
        "physical_surplus_bottles",
        "vintage",
        "appellation",
        "color",
        "color_rgb",
        "classification",
        "region",
        "country",
        "grapes",
        "cuvee",
        "comment",
        "alcohol_percent",
        "service_temperature_min",
        "service_temperature_max",
        "bottle_format",
        "bottle_volume_l",
        "ploud_pid",
        "image_url",
        "meals",
        "locations",
    }

    racks = cast(list[dict[str, object]], response["racks"])
    assert len(racks) == 1
    assert set(racks[0]) == {"id", "name"}

    rack_items = cast(list[dict[str, object]], response["rack_items"])
    assert len(rack_items) == 1
    assert set(rack_items[0]) == {
        "id",
        "rack_id",
        "wine_id",
        "row",
        "column",
    }

    locations = cast(list[dict[str, object]], wines[0]["locations"])
    assert len(locations) == 1
    assert set(locations[0]) == {"rack", "rack_id", "row", "column"}

    diagnostics = cast(list[dict[str, object]], response["wine_diagnostics"])
    assert len(diagnostics) == 1
    assert set(diagnostics[0]) == {
        "id",
        "name",
        "domain",
        "vintage",
        "purchased",
        "consumed",
        "movement_balance",
        "bottles_in_cellar",
        "effective_stock",
        "unlocated_bottles",
        "negative_movement_bottles",
        "physical_surplus_bottles",
        "wine",
    }
    diagnostic_wine = cast(dict[str, object], diagnostics[0]["wine"])
    assert set(diagnostic_wine) == {
        "id", "name", "domain", "bottles", "effective_stock",
        "ploud_bottles", "bottles_in_cellar", "unlocated_bottles",
        "purchased", "consumed", "movement_balance", "calculated_stock",
        "negative_movement_bottles", "physical_surplus_bottles",
        "vintage", "appellation", "color", "color_rgb", "classification",
        "region", "country", "grapes", "cuvee", "comment", "alcohol_percent",
        "service_temperature_min", "service_temperature_max", "bottle_format",
        "bottle_volume_l", "ploud_pid", "image_url", "meals", "locations",
    }
    assert diagnostic_wine["id"] == "wine-1"
    assert diagnostic_wine["locations"] == locations

    # Pin important nullable/type semantics as well as field names.
    assert response["last_sync"] == "2026-11-07T10:00:00+00:00"
    assert response["total_stock_bottles"] == 1
    assert wines[0]["bottles"] == 1
    assert wines[0]["color_rgb"] == [120, 20, 30]
    assert wines[0]["classification"] is None
    assert wines[0]["bottle_volume_l"] == 0.75
    assert wines[0]["image_url"] == "/api/image/4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    assert wines[0]["meals"] == 2080
    assert rack_items[0]["wine_id"] == "wine-1"
    assert diagnostics[0]["physical_surplus_bottles"] == 1


def test_get_inventory_incomplete_reconstruction_preserves_nullable_contract() -> None:
    """Fields unavailable before a full Orders snapshot remain explicitly null."""
    cellar = Cellar(wines={"wine-1": _contract_wine()})

    response = _build_inventory_response(cellar, search="", color="")
    wines = cast(list[dict[str, object]], response["wines"])

    assert response["total_stock_bottles"] is None
    assert response["wine_references"] is None
    assert response["unlocated_wines"] is None
    assert response["unlocated_bottles"] is None
    assert response["negative_movement_wines"] is None
    assert response["negative_movement_bottles"] is None
    assert response["physical_surplus_wines"] is None
    assert response["physical_surplus_bottles"] is None
    assert response["wine_diagnostics"] is None
    assert wines[0]["bottles"] is None
    assert wines[0]["effective_stock"] is None
    assert wines[0]["unlocated_bottles"] is None
    assert wines[0]["purchased"] is None
    assert wines[0]["consumed"] is None
    assert wines[0]["movement_balance"] is None
    assert wines[0]["calculated_stock"] is None
    assert wines[0]["negative_movement_bottles"] is None
    assert wines[0]["physical_surplus_bottles"] is None
    assert wines[0]["image_url"] is None
    assert wines[0]["meals"] == 2080
