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
    assert wines[0]["bottles_to_store"] == 2
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
    assert result["bottles_to_store"] is None
    assert result["movement_anomalies"] is None
    wines = cast(list[dict[str, object]], result["wines"])
    assert len(wines) == 1
    assert wines[0]["bottles"] is None
    assert wines[0]["effective_stock"] is None
    assert wines[0]["bottles_in_cellar"] == 1
    assert wines[0]["bottles_to_store"] is None
    assert wines[0]["inventory_errors"] is None
    assert wines[0]["movement_warnings"] is None


def test_inventory_service_excludes_unstocked_wines_but_reports_anomalies() -> None:
    """Zero-stock anomalies remain diagnosable without appearing as inventory."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "stocked": _wine("stocked", name="Vin en cave"),
            "anomaly": _wine("anomaly", name="Vin anomalie"),
        },
        orders={
            "stocked-order": Order("stocked-order", "stocked", incoming=2, outgoing=0),
            "anomaly-order": Order("anomaly-order", "anomaly", incoming=0, outgoing=3),
        },
    )

    result = _response(cellar, search="vin en cave")

    wines = cast(list[dict[str, object]], result["wines"])
    anomalies = cast(list[dict[str, object]], result["movement_anomalies"])
    assert [wine["id"] for wine in wines] == ["stocked"]
    assert result["matching_wines"] == 1
    assert [item["id"] for item in anomalies] == ["anomaly"]
