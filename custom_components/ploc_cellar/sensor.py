"""Single aggregate cellar sensor."""
from functools import cached_property

from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, SENSOR_UNIQUE_ID
from .coordinator import PlocCellarCoordinator
from .types import PlocCellarConfigEntry


class PlocCellarSensor(CoordinatorEntity[PlocCellarCoordinator], SensorEntity):
    """Expose a compact cellar summary, not one entity per wine or rack."""

    _attr_has_entity_name = True
    _attr_translation_key = "inventory"
    _attr_icon = "mdi:bottle-wine"
    _attr_device_info = DeviceInfo(
        identifiers={(DOMAIN, "ploc_cellar")},
        translation_key="cellar",
        manufacturer="PLOC",
    )

    def __init__(self, coordinator: PlocCellarCoordinator) -> None:
        """Initialize the aggregate sensor."""
        super().__init__(coordinator)
        self._attr_unique_id = SENSOR_UNIQUE_ID

    @property
    def available(self) -> bool:
        """Keep the last persisted totals visible during a PLOUD outage."""
        # Setup guarantees a successful first refresh or a restored cellar snapshot.
        return True

    @cached_property
    def native_value(self) -> int:
        """Return the total number of bottles."""
        return self.coordinator.data.total_bottles

    @cached_property
    def extra_state_attributes(self) -> dict[str, int | bool]:
        """Expose stable aggregate attributes and a stale-data indicator."""
        cellar = self.coordinator.data
        return {
            "stocked_wines": cellar.stocked_wines,
            "rack_count": len(cellar.racks),
            "occupied_positions": cellar.occupied_positions,
            "stale": not self.coordinator.last_update_success,
        }


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the one aggregate sensor."""
    async_add_entities([PlocCellarSensor(entry.runtime_data)])
