"""Single aggregate cellar sensor."""
from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .coordinator import PlocCellarCoordinator


class PlocCellarSensor(CoordinatorEntity[PlocCellarCoordinator], SensorEntity):
    """Expose a compact cellar summary, not one entity per wine or rack."""

    _attr_has_entity_name = True
    _attr_translation_key = "inventory"
    _attr_icon = "mdi:bottle-wine"
    _attr_native_unit_of_measurement = "bottles"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_device_info = DeviceInfo(
        identifiers={(DOMAIN, "ploc_cellar")},
        name="Ploc Cellar",
        manufacturer="PLOC",
    )

    def __init__(self, coordinator: PlocCellarCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{DOMAIN}_summary"

    @property
    def native_value(self) -> int:
        return self.coordinator.data.total_bottles

    @property
    def extra_state_attributes(self) -> dict[str, int | str | None]:
        cellar = self.coordinator.data
        return {
            "stocked_wines": cellar.stocked_wines,
            "rack_count": len(cellar.racks),
            "occupied_positions": cellar.occupied_positions,
            "last_sync": cellar.last_sync,
        }


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the one aggregate sensor."""
    async_add_entities([PlocCellarSensor(entry.runtime_data)])
