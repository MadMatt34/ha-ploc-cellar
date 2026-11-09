"""Per-config-entry Home Assistant device and entity identities."""
from __future__ import annotations

from dataclasses import dataclass

from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import (
    DeviceInfo,
    async_get as async_get_device_registry,
)

from .const import DOMAIN
from .types import PlocCellarConfigEntry

LEGACY_DEVICE_IDENTIFIER = "ploc_cellar"


@dataclass(frozen=True, slots=True)
class PlocCellarEntityIdentity:
    """Keep legacy registry IDs for the existing entry; isolate later entries."""

    device_info: DeviceInfo
    unique_id_suffix: str | None

    def unique_id(self, base_unique_id: str) -> str:
        """Return a stable unique ID for this config entry."""
        if self.unique_id_suffix is None:
            return base_unique_id
        return f"{base_unique_id}_{self.unique_id_suffix}"


def get_entity_identity(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
) -> PlocCellarEntityIdentity:
    """Resolve a per-entry device identity without renaming an existing device."""
    registry = async_get_device_registry(hass)
    legacy_device = registry.async_get_device(
        {(DOMAIN, LEGACY_DEVICE_IDENTIFIER)},
        set(),
    )
    preserve_legacy_identity = (
        legacy_device is not None
        and legacy_device.config_entry_id == entry.entry_id
    )

    device_identifier = (
        LEGACY_DEVICE_IDENTIFIER
        if preserve_legacy_identity
        else entry.unique_id
    )
    return PlocCellarEntityIdentity(
        device_info=DeviceInfo(
            identifiers={(DOMAIN, device_identifier)},
            translation_key="cellar",
            manufacturer="PLOC",
        ),
        unique_id_suffix=(
            None if preserve_legacy_identity else entry.unique_id
        ),
    )
