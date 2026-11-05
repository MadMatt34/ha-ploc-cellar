"""Tests for Ploc Cellar sensor definitions and values."""
from __future__ import annotations

from datetime import UTC, datetime

from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine
from ploc_cellar.sensor import SENSOR_DESCRIPTIONS, _parse_last_sync


def _wine(wine_id: str, bottles_in_cellar: int) -> Wine:
    """Build a wine reference for sensor metric tests."""
    return Wine(
        id=wine_id,
        name=wine_id,
        bottles=0,
        bottles_in_cellar=bottles_in_cellar,
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


def test_sensor_metric_definitions_and_values() -> None:
    """Each configured sensor exposes the intended cellar aggregate."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "wine-a": _wine("wine-a", 3),
            "wine-b": _wine("wine-b", 0),
        },
        racks={"rack": Rack(id="rack", name="Main rack")},
        rack_items={
            "slot-a1": RackItem("slot-a1", "rack", "wine-a", 1, 1),
            "slot-a2": RackItem("slot-a2", "rack", "wine-a", 1, 2),
            "slot-a3": RackItem("slot-a3", "rack", "wine-a", 1, 3),
            "slot-empty": RackItem("slot-empty", "rack", "", 1, 4),
        },
        orders={
            "order-a": Order("order-a", "wine-a", incoming=2, outgoing=0),
            "order-b": Order("order-b", "wine-b", incoming=0, outgoing=2),
        },
    )
    expected = {
        "bottles_in_stock": 3,
        "bottles_stock_total": 3,
        "wines_references": 1,
        "wines_in_stock": 1,
        "rack_count": 1,
        "rack_positions_total": 4,
        "rack_positions_available": 1,
        "diagnostic_bottles_unalocated": 0,
        "diagnostic_wines_unlocated": 0,
        "diagnostic_bottles_negative_movements": 2,
        "diagnostic_wines_negative_movements": 1,
        "diagnostic_bottles_physical_surplus": 1,
        "diagnostic_wines_physical_surplus": 1,
    }

    assert {
        description.translation_key: description.value_fn(cellar)
        for description in SENSOR_DESCRIPTIONS
    } == expected
    assert len(SENSOR_DESCRIPTIONS) == 13


def test_stock_diagnostics_are_unknown_until_orders_are_complete() -> None:
    """Movement-derived counters stay unknown until a complete Orders snapshot."""
    cellar = Cellar()
    values = {
        description.translation_key: description.value_fn(cellar)
        for description in SENSOR_DESCRIPTIONS
    }

    assert values["bottles_in_stock"] == 0
    assert values["wines_in_stock"] == 0
    assert values["rack_count"] == 0
    assert values["rack_positions_total"] == 0
    assert values["rack_positions_available"] == 0
    assert values["bottles_stock_total"] is None
    assert values["wines_references"] is None
    assert values["diagnostic_bottles_unalocated"] is None
    assert values["diagnostic_wines_unlocated"] is None
    assert values["diagnostic_bottles_negative_movements"] is None
    assert values["diagnostic_wines_negative_movements"] is None
    assert values["diagnostic_bottles_physical_surplus"] is None
    assert values["diagnostic_wines_physical_surplus"] is None


def test_parse_last_sync_requires_timezone_aware_timestamp() -> None:
    """The timestamp sensor only accepts complete ISO 8601 timestamps."""
    expected = datetime(2026, 11, 5, 10, 30, tzinfo=UTC)

    assert _parse_last_sync(expected.isoformat()) == expected
    assert _parse_last_sync("2026-11-05T10:30:00") is None
    assert _parse_last_sync(None) is None
