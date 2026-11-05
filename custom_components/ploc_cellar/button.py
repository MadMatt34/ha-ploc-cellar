"""Expose manual partial and full PLOUD synchronization buttons."""
from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    BUTTON_SYNC_FULL_UNIQUE_ID,
    BUTTON_SYNC_UNIQUE_ID,
    DOMAIN,
)
from .coordinator import PlocCellarCoordinator
from .models import Cellar
from .types import PlocCellarConfigEntry


_DEVICE_INFO = DeviceInfo(
    identifiers={(DOMAIN, "ploc_cellar")},
    translation_key="cellar",
    manufacturer="PLOC",
)


@dataclass(frozen=True, slots=True)
class PlocCellarButtonDescription:
    """Describe one manual synchronization action."""

    translation_key: str
    unique_id: str
    icon: str
    press_fn: Callable[[PlocCellarCoordinator], Awaitable[Cellar]]


BUTTON_DESCRIPTIONS: tuple[PlocCellarButtonDescription, ...] = (
    PlocCellarButtonDescription(
        translation_key="sync",
        unique_id=BUTTON_SYNC_UNIQUE_ID,
        icon="mdi:sync",
        press_fn=lambda coordinator: coordinator.async_force_sync(),
    ),
    PlocCellarButtonDescription(
        translation_key="sync_full",
        unique_id=BUTTON_SYNC_FULL_UNIQUE_ID,
        icon="mdi:database-sync",
        press_fn=lambda coordinator: coordinator.async_force_full_sync(),
    ),
)


class PlocCellarSyncButton(ButtonEntity):
    """Trigger one synchronization mode on the shared PLOUD coordinator."""

    _attr_has_entity_name = True
    _attr_device_info = _DEVICE_INFO

    def __init__(
        self,
        coordinator: PlocCellarCoordinator,
        description: PlocCellarButtonDescription,
    ) -> None:
        """Initialize a translated synchronization button."""
        super().__init__()
        self.coordinator = coordinator
        self._description = description
        self._attr_translation_key = description.translation_key
        self._attr_unique_id = description.unique_id
        self._attr_icon = description.icon
        self.entity_id = f"button.{DOMAIN}_{description.translation_key}"

    async def async_press(self) -> None:
        """Run the requested synchronization and propagate any failure."""
        await self._description.press_fn(self.coordinator)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the two synchronization buttons on the cellar device."""
    coordinator = entry.runtime_data
    async_add_entities(
        [
            PlocCellarSyncButton(coordinator, description)
            for description in BUTTON_DESCRIPTIONS
        ]
    )
