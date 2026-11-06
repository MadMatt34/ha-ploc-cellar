"""Expose the cellar inventory as focused sensors."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import EntityCategory
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    SENSOR_BOTTLES_STOCK_TOTAL_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_BOTTLES_NEGATIVE_MOVEMENTS_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_BOTTLES_PHYSICAL_SURPLUS_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_BOTTLES_UNALOCATED_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_LAST_SUCCESSFUL_SYNC_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_WINES_NEGATIVE_MOVEMENTS_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_WINES_PHYSICAL_SURPLUS_UNIQUE_ID,
    SENSOR_DIAGNOSTIC_WINES_UNLOCATED_UNIQUE_ID,
    SENSOR_RACK_COUNT_UNIQUE_ID,
    SENSOR_RACK_POSITIONS_AVAILABLE_UNIQUE_ID,
    SENSOR_RACK_POSITIONS_TOTAL_UNIQUE_ID,
    SENSOR_UNIQUE_ID,
    SENSOR_WINES_IN_STOCK_UNIQUE_ID,
    SENSOR_WINES_REFERENCES_UNIQUE_ID,
)
from .coordinator import PlocCellarCoordinator
from .models import Cellar
from .types import PlocCellarConfigEntry


@dataclass(frozen=True, slots=True)
class PlocCellarSensorDescription:
    """Describe one numeric value exposed by the cellar model."""

    translation_key: str
    unique_id: str
    value_fn: Callable[[Cellar], int | None]
    icon: str
    entity_category: EntityCategory | None = None


_DEVICE_INFO = DeviceInfo(
    identifiers={(DOMAIN, "ploc_cellar")},
    translation_key="cellar",
    manufacturer="PLOC",
)

SENSOR_DESCRIPTIONS: tuple[PlocCellarSensorDescription, ...] = (
    PlocCellarSensorDescription(
        "bottles_in_stock",
        SENSOR_UNIQUE_ID,
        lambda cellar: cellar.total_bottles,
        "mdi:bottle-wine",
    ),
    PlocCellarSensorDescription(
        "bottles_stock_total",
        SENSOR_BOTTLES_STOCK_TOTAL_UNIQUE_ID,
        lambda cellar: cellar.total_stock_bottles,
        "mdi:archive",
    ),
    PlocCellarSensorDescription(
        "wines_references",
        SENSOR_WINES_REFERENCES_UNIQUE_ID,
        lambda cellar: cellar.wine_references,
        "mdi:book-open-variant",
    ),
    PlocCellarSensorDescription(
        "wines_in_stock",
        SENSOR_WINES_IN_STOCK_UNIQUE_ID,
        lambda cellar: cellar.stocked_wines,
        "mdi:bottle-wine-outline",
    ),
    PlocCellarSensorDescription(
        "rack_count",
        SENSOR_RACK_COUNT_UNIQUE_ID,
        lambda cellar: len(cellar.racks),
        "mdi:archive-outline",
    ),
    PlocCellarSensorDescription(
        "rack_positions_total",
        SENSOR_RACK_POSITIONS_TOTAL_UNIQUE_ID,
        lambda cellar: cellar.total_positions,
        "mdi:grid",
    ),
    PlocCellarSensorDescription(
        "rack_positions_available",
        SENSOR_RACK_POSITIONS_AVAILABLE_UNIQUE_ID,
        lambda cellar: cellar.empty_positions,
        "mdi:grid-large",
    ),
    PlocCellarSensorDescription(
        "diagnostic_bottles_unalocated",
        SENSOR_DIAGNOSTIC_BOTTLES_UNALOCATED_UNIQUE_ID,
        lambda cellar: cellar.unlocated_bottles,
        "mdi:alert-circle-outline",
        EntityCategory.DIAGNOSTIC,
    ),
    PlocCellarSensorDescription(
        "diagnostic_wines_unlocated",
        SENSOR_DIAGNOSTIC_WINES_UNLOCATED_UNIQUE_ID,
        lambda cellar: cellar.unlocated_wines,
        "mdi:alert-circle-outline",
        EntityCategory.DIAGNOSTIC,
    ),
    PlocCellarSensorDescription(
        "diagnostic_bottles_negative_movements",
        SENSOR_DIAGNOSTIC_BOTTLES_NEGATIVE_MOVEMENTS_UNIQUE_ID,
        lambda cellar: cellar.negative_movement_bottles,
        "mdi:trending-down",
        EntityCategory.DIAGNOSTIC,
    ),
    PlocCellarSensorDescription(
        "diagnostic_wines_negative_movements",
        SENSOR_DIAGNOSTIC_WINES_NEGATIVE_MOVEMENTS_UNIQUE_ID,
        lambda cellar: cellar.negative_movement_wines,
        "mdi:trending-down",
        EntityCategory.DIAGNOSTIC,
    ),
    PlocCellarSensorDescription(
        "diagnostic_bottles_physical_surplus",
        SENSOR_DIAGNOSTIC_BOTTLES_PHYSICAL_SURPLUS_UNIQUE_ID,
        lambda cellar: cellar.physical_surplus_bottles,
        "mdi:alert-outline",
        EntityCategory.DIAGNOSTIC,
    ),
    PlocCellarSensorDescription(
        "diagnostic_wines_physical_surplus",
        SENSOR_DIAGNOSTIC_WINES_PHYSICAL_SURPLUS_UNIQUE_ID,
        lambda cellar: cellar.physical_surplus_wines,
        "mdi:alert-outline",
        EntityCategory.DIAGNOSTIC,
    ),
)


def _parse_last_sync(value: str | None) -> datetime | None:
    """Parse the stored ISO 8601 timestamp, requiring timezone information."""
    if value is None:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None or parsed.tzinfo is None:
        return None
    return parsed


class PlocCellarMetricSensor(
    CoordinatorEntity[PlocCellarCoordinator], SensorEntity
):
    """Expose one inventory, rack or stock-diagnostic metric."""

    _attr_has_entity_name = True
    _attr_device_info = _DEVICE_INFO
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: PlocCellarCoordinator,
        description: PlocCellarSensorDescription,
    ) -> None:
        """Initialize the sensor from its static description."""
        super().__init__(coordinator)
        self._description = description
        self._attr_translation_key = description.translation_key
        self._attr_unique_id = description.unique_id
        self._attr_icon = description.icon
        if description.entity_category is not None:
            self._attr_entity_category = description.entity_category

    @property
    def available(self) -> bool:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Keep the persisted model available while PLOUD is unreachable."""
        return True

    @property
    def native_value(self) -> int | None:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Return the metric calculated by the current cellar model."""
        return self._description.value_fn(self.coordinator.data)


class PlocCellarLastSyncSensor(
    CoordinatorEntity[PlocCellarCoordinator], SensorEntity
):
    """Expose the last successful synchronization and its stale status."""

    _attr_has_entity_name = True
    _attr_device_info = _DEVICE_INFO
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_translation_key = "diagnostic_last_successful_sync"
    _attr_unique_id = SENSOR_DIAGNOSTIC_LAST_SUCCESSFUL_SYNC_UNIQUE_ID
    _attr_icon = "mdi:calendar-clock"
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coordinator: PlocCellarCoordinator) -> None:
        """Initialize the timestamp sensor with its stable entity ID."""
        super().__init__(coordinator)

    @property
    def available(self) -> bool:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Keep the last successful timestamp visible during a PLOUD outage."""
        return True

    @property
    def native_value(self) -> datetime | None:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Return the timestamp of the last validated and persisted sync."""
        return _parse_last_sync(self.coordinator.data.last_sync)

    @property
    def extra_state_attributes(self) -> dict[str, bool]:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Expose whether the currently displayed snapshot may be outdated."""
        return {"stale": self.coordinator.data.stale}



async def async_setup_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up all inventory and diagnostic sensors on the cellar device."""
    coordinator = entry.runtime_data
    entities: list[SensorEntity] = [
        PlocCellarMetricSensor(coordinator, description)
        for description in SENSOR_DESCRIPTIONS
    ]
    entities.append(PlocCellarLastSyncSensor(coordinator))
    async_add_entities(entities)
