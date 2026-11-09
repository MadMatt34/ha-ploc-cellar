"""Expose manual differential and full PLOUD synchronization buttons."""
from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import const
from .coordinator import PlocCellarCoordinator
from .entity import PlocCellarEntityIdentity, get_entity_identity
from .models import Cellar
from .types import PlocCellarConfigEntry


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
        unique_id=const.BUTTON_SYNC_UNIQUE_ID,
        icon="mdi:sync",
        press_fn=lambda coordinator: coordinator.async_force_sync(),
    ),
    PlocCellarButtonDescription(
        translation_key="sync_full",
        unique_id=const.BUTTON_SYNC_FULL_UNIQUE_ID,
        icon="mdi:database-sync",
        press_fn=lambda coordinator: coordinator.async_force_full_sync(),
    ),
)


class PlocCellarSyncButton(ButtonEntity):
    """Trigger one synchronization mode on the shared PLOUD coordinator."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: PlocCellarCoordinator,
        description: PlocCellarButtonDescription,
        identity: PlocCellarEntityIdentity,
    ) -> None:
        """Initialize a translated synchronization button."""
        super().__init__()
        self.coordinator = coordinator
        self._description = description
        self._attr_device_info = identity.device_info
        self._attr_translation_key = description.translation_key
        self._attr_unique_id = identity.unique_id(description.unique_id)
        self._attr_icon = description.icon

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
    identity = get_entity_identity(hass, entry)
    async_add_entities(
        [
            PlocCellarSyncButton(coordinator, description, identity)
            for description in BUTTON_DESCRIPTIONS
        ]
    )
