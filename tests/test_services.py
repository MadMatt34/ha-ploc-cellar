"""Inventory service response regression tests."""
from __future__ import annotations

from typing import cast

from homeassistant.util.json import JsonObjectType
from ploc_cellar import _build_inventory_response
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine


def _wine(
    wine_id: str,
    *,
    name: str,
    color: str | None = None,
    bottles: int = 0,
    domain: str | None = None,
) -> Wine:
    return Wine(
        id=wine_id,
        name=name,
        bottles=bottles,
        bottles_in_cellar=0,
        vintage=2021,
        appellation="AOC",
        color=color,
        color_rgb=(120, 20, 30),
        classification=None,
        region="Languedoc",
        country="France",
        grapes="Syrah",
        cuvee=None,
        comment=None,
        alcohol_percent=None,
        service_temperature_min=None,
        service_temperature_max=None,
        bottle_format=None,
        bottle_volume_l=None,
        ploud_pid=None,
        domain=domain,
        owner_id=None,
    )


def _response(cellar: Cellar, *, search: str = "", color: str = "") -> JsonObjectType:
    return _build_inventory_response(cellar, search=search, color=color)


def test_inventory_service_reports_complete_stock_and_locations() -> None:
    """The service returns calculated stock, physical locations and global totals."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "wine-a": _wine("wine-a", name="Mas Olivier", color="Rouge"),
            "wine-b": _wine("wine-b", name="Domaine Blanc", color="Blanc"),
        },
        racks={"rack": Rack(id="rack", name="Cave principale")},
        rack_items={
            "slot-a": RackItem(
                id="slot-a", rack_id="rack", wine_id="wine-a", row=2, column=3
            )
        },
        orders={
            "order-a": Order("order-a", "wine-a", incoming=4, outgoing=1)
        },
    )
    cellar.refresh_bottles_in_cellar()

    result = _response(cellar)

    assert result["stock_reconstruction_complete"] is True
    assert result["total_bottles"] == 1
    assert result["total_stock_bottles"] == 3
    assert result["matching_wines"] == 1
    wines = cast(list[dict[str, object]], result["wines"])
    assert wines[0]["id"] == "wine-a"
    assert wines[0]["bottles"] == 3
    assert wines[0]["bottles_in_cellar"] == 1
    assert wines[0]["unlocated_bottles"] == 2
    assert wines[0]["negative_movement_bottles"] == 0
    assert wines[0]["physical_surplus_bottles"] == 0
    assert result["unlocated_wines"] == 1
    assert result["unlocated_bottles"] == 2
    diagnostics = cast(list[dict[str, object]], result["wine_diagnostics"])
    assert [item["id"] for item in diagnostics] == ["wine-a"]
    assert diagnostics[0]["purchased"] == 4
    assert diagnostics[0]["consumed"] == 1
    assert diagnostics[0]["movement_balance"] == 3
    assert diagnostics[0]["bottles_in_cellar"] == 1
    assert diagnostics[0]["effective_stock"] == 3
    assert diagnostics[0]["unlocated_bottles"] == 2
    locations = cast(list[dict[str, object]], wines[0]["locations"])
    assert locations == [
        {
            "rack": "Cave principale",
            "rack_id": "rack",
            "row": 2,
            "column": 3,
        }
    ]


def test_inventory_service_filters_search_and_color_case_insensitively() -> None:
    """Search and color filters apply to the returned inventory, not global totals."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "wine-a": _wine(
                "wine-a", name="Mas Olivier", color="Rouge", domain="Domaine A"
            ),
            "wine-b": _wine("wine-b", name="Domaine Blanc", color="Blanc"),
        },
        orders={
            "order-a": Order("order-a", "wine-a", incoming=2, outgoing=0),
            "order-b": Order("order-b", "wine-b", incoming=3, outgoing=0),
        },
    )

    result = _response(cellar, search="OLIVIER", color="rou")

    assert result["matching_wines"] == 1
    wines = cast(list[dict[str, object]], result["wines"])
    assert [wine["id"] for wine in wines] == ["wine-a"]
    assert result["total_stock_bottles"] == 5
    assert result["wine_references"] == 2


def test_inventory_service_incomplete_cache_exposes_physical_facts_only() -> None:
    """Offline service output never presents partial Orders as reconstructed stock."""
    cellar = Cellar(
        wines={"wine": _wine("wine", name="Vin", bottles=40)},
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "slot": RackItem(
                id="slot", rack_id="rack", wine_id="wine", row=1, column=1
            )
        },
    )
    cellar.refresh_bottles_in_cellar()

    result = _response(cellar)

    assert result["stock_reconstruction_complete"] is False
    assert result["total_bottles"] == 1
    assert result["stocked_wines"] == 1
    assert result["total_stock_bottles"] is None
    assert result["wine_references"] is None
    assert result["unlocated_bottles"] is None
    assert result["negative_movement_bottles"] is None
    assert result["physical_surplus_bottles"] is None
    assert result["wine_diagnostics"] is None
    wines = cast(list[dict[str, object]], result["wines"])
    assert len(wines) == 1
    assert wines[0]["bottles"] is None
    assert wines[0]["effective_stock"] is None
    assert wines[0]["bottles_in_cellar"] == 1
    assert wines[0]["unlocated_bottles"] is None
    assert wines[0]["negative_movement_bottles"] is None
    assert wines[0]["physical_surplus_bottles"] is None


def test_inventory_service_excludes_unstocked_wines_but_reports_anomalies() -> None:
    """Zero-stock anomalies remain diagnosable without appearing as inventory."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "stocked": _wine("stocked", name="Vin en cave"),
            "anomaly": _wine("anomaly", name="Vin anomalie"),
            "physical": _wine("physical", name="Vin excédentaire"),
        },
        racks={"rack": Rack(id="rack", name="Cave")},
        rack_items={
            "physical-1": RackItem(
                "physical-1", "rack", "physical", row=1, column=1
            ),
            "physical-2": RackItem(
                "physical-2", "rack", "physical", row=1, column=2
            ),
        },
        orders={
            "stocked-order": Order("stocked-order", "stocked", incoming=2, outgoing=0),
            "anomaly-order": Order("anomaly-order", "anomaly", incoming=0, outgoing=3),
            "physical-order": Order("physical-order", "physical", incoming=1, outgoing=0),
        },
    )
    cellar.refresh_bottles_in_cellar()

    result = _response(cellar, search="vin en cave")

    wines = cast(list[dict[str, object]], result["wines"])
    diagnostics = cast(list[dict[str, object]], result["wine_diagnostics"])
    assert [wine["id"] for wine in wines] == ["stocked"]
    assert result["matching_wines"] == 1
    diagnostics_by_id = {item["id"]: item for item in diagnostics}
    assert set(diagnostics_by_id) == {"anomaly", "physical", "stocked"}
    assert diagnostics_by_id["anomaly"]["movement_balance"] == -3
    assert diagnostics_by_id["anomaly"]["effective_stock"] == 0
    assert diagnostics_by_id["anomaly"]["negative_movement_bottles"] == 3
    assert diagnostics_by_id["anomaly"]["unlocated_bottles"] == 0
    assert diagnostics_by_id["anomaly"]["physical_surplus_bottles"] == 0
    assert diagnostics_by_id["stocked"]["movement_balance"] == 2
    assert diagnostics_by_id["stocked"]["effective_stock"] == 2
    assert diagnostics_by_id["stocked"]["negative_movement_bottles"] == 0
    assert diagnostics_by_id["stocked"]["unlocated_bottles"] == 2
    assert diagnostics_by_id["physical"]["movement_balance"] == 1
    assert diagnostics_by_id["physical"]["bottles_in_cellar"] == 2
    assert diagnostics_by_id["physical"]["effective_stock"] == 2
    assert diagnostics_by_id["physical"]["physical_surplus_bottles"] == 1
    assert result["negative_movement_wines"] == 1
    assert result["negative_movement_bottles"] == 3
    assert result["unlocated_wines"] == 1
    assert result["unlocated_bottles"] == 2
    assert result["physical_surplus_wines"] == 1
    assert result["physical_surplus_bottles"] == 1
