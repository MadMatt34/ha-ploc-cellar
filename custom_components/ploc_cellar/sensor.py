"""Single aggregate cellar sensor."""
from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import PlocCellarCoordinator

class PlocCellarSensor(CoordinatorEntity[PlocCellarCoordinator], SensorEntity):
    _attr_has_entity_name = True
    _attr_name = "Cellar"
    _attr_icon = "mdi:bottle-wine"
    _attr_native_unit_of_measurement = "bottles"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator: PlocCellarCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{DOMAIN}_summary"

    @property
    def native_value(self) -> int:
        return self.coordinator.data.total_bottles

    @property
    def extra_state_attributes(self) -> dict:
        cellar = self.coordinator.data
        return {
            "stocked_wines": cellar.stocked_wines,
            "rack_count": len(cellar.racks),
            "occupied_positions": cellar.occupied_positions,
            "last_sync": cellar.last_sync,
            "inventory_action": "ploc_cellar.get_inventory",
        }
