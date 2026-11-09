"""Tests for Ploc Cellar sensor definitions and values."""
from __future__ import annotations

import asyncio
from datetime import UTC, datetime
from types import SimpleNamespace
from typing import cast

from homeassistant.helpers.device_registry import DeviceInfo
from ploc_cellar.coordinator import PlocCellarCoordinator
from ploc_cellar.entity import PlocCellarEntityIdentity
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine
from ploc_cellar import sensor as sensor_module
from ploc_cellar.sensor import (
    SENSOR_DESCRIPTIONS,
    PlocCellarLastSyncSensor,
    PlocCellarMetricSensor,
    _parse_last_sync,
    async_setup_entry,
)


def _identity() -> PlocCellarEntityIdentity:
    """Build a legacy identity for direct entity tests."""
    return PlocCellarEntityIdentity(
        device_info=DeviceInfo(
            identifiers={("ploc_cellar", "ploc_cellar")},
            translation_key="cellar",
            manufacturer="PLOC",
        ),
        unique_id_suffix=None,
    )


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



def test_metric_sensor_exposes_value_and_remains_available() -> None:
    """Metric entities keep cached values without forcing an entity ID."""
    cellar = Cellar(stock_reconstruction_complete=True)
    coordinator = cast(
        PlocCellarCoordinator, SimpleNamespace(data=cellar)
    )
    sensor = PlocCellarMetricSensor(coordinator, SENSOR_DESCRIPTIONS[0], _identity())

    assert sensor.native_value == 0
    assert sensor.available is True
    assert sensor.unique_id == SENSOR_DESCRIPTIONS[0].unique_id
    assert sensor.entity_id is None


def test_last_sync_sensor_exposes_timestamp_and_stale_attribute() -> None:
    """The timestamp entity preserves the last success and reports stale data."""
    cellar = Cellar(
        last_sync="2026-11-05T10:30:00+00:00",
        stale=True,
    )
    coordinator = cast(
        PlocCellarCoordinator, SimpleNamespace(data=cellar)
    )
    sensor = PlocCellarLastSyncSensor(coordinator, _identity())

    assert sensor.native_value == datetime(2026, 11, 5, 10, 30, tzinfo=UTC)
    assert sensor.extra_state_attributes == {"stale": True}
    assert sensor.available is True
    assert sensor.entity_id is None


def test_last_sync_sensor_handles_missing_timestamp() -> None:
    """No successful synchronization is represented by an unknown timestamp."""
    coordinator = cast(
        PlocCellarCoordinator, SimpleNamespace(data=Cellar(last_sync=None))
    )
    sensor = PlocCellarLastSyncSensor(coordinator)

    assert sensor.native_value is None


def test_sensor_platform_sets_up_all_fourteen_entities() -> None:
    """Platform setup adds thirteen metrics and the last-success timestamp."""
    coordinator = cast(
        PlocCellarCoordinator, SimpleNamespace(data=Cellar())
    )
    entry = SimpleNamespace(runtime_data=coordinator)
    monkeypatch.setattr(sensor_module, "get_entity_identity", lambda hass, config_entry: _identity())
    added: list[object] = []

    asyncio.run(
        async_setup_entry(
            object(),
            entry,
            lambda entities: added.extend(entities),
        )
    )

    assert len(added) == 14
    assert all(entity.entity_id is None for entity in added)
