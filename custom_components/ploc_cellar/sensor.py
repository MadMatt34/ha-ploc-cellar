"""Single aggregate cellar sensor."""
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
    def available(self) -> bool:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Keep the last persisted totals visible during a PLOUD outage."""
        # Setup guarantees a successful first refresh or a restored cellar snapshot.
        return True

    @property
    def native_value(self) -> int:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Return the number of bottles assigned to cellar positions."""
        return self.coordinator.data.total_bottles

    @property
    def extra_state_attributes(self) -> dict[str, int | bool | str | None]:  # pyright: ignore[reportIncompatibleVariableOverride]
        """Expose aggregate attributes and the last successful synchronization."""
        cellar = self.coordinator.data
        return {
            "stocked_wines": cellar.stocked_wines,
            "total_stocked_wines": cellar.total_stocked_wines,
            "total_stock_bottles": cellar.total_stock_bottles,
            "rack_count": len(cellar.racks),
            "occupied_positions": cellar.occupied_positions,
            "stale": cellar.stale,
            "last_successful_sync": cellar.last_sync,
        }


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the one aggregate sensor."""
    async_add_entities([PlocCellarSensor(entry.runtime_data)])
