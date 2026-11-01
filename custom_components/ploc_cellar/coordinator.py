"""Cellar coordinator and persistent Home Assistant storage."""
from __future__ import annotations

import logging
from copy import deepcopy
from datetime import datetime, timedelta, timezone

from aiohttp import ClientSession
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, HomeAssistantError
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .models import Cellar, JsonValue
from .ploud import PloudAuthError, PloudError, apply_sync, async_sync

_LOGGER = logging.getLogger(__name__)


class PlocCellarCoordinator(DataUpdateCoordinator[Cellar]):
    """Fetch PLOUD deltas and publish the shared cellar model."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        session: ClientSession,
        server: str,
        token: str,
        device: str,
        language: str,
        scan_interval: timedelta,
    ) -> None:
        super().__init__(
            hass,
            logger=_LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=scan_interval,
        )
        self.session = session
        self.server = server
        self.token = token
        self.device = device
        self.language = language
        self.store: Store[dict[str, JsonValue]] = Store(
            hass, STORAGE_VERSION, f"{STORAGE_KEY}.{entry.entry_id}"
        )
        self.cellar = Cellar()

    async def async_load(self) -> None:
        """Restore the model and its matching incremental cursor."""
        try:
            stored = await self.store.async_load()
            if stored is not None:
                self.cellar = Cellar.from_storage(stored)
        except (OSError, ValueError, TypeError) as err:
            raise HomeAssistantError(
                "The stored Ploc Cellar data is invalid; refusing to discard it"
            ) from err

    async def _async_update_data(self) -> Cellar:
        """Apply a PLOUD delta and persist it before publishing the new model."""
        try:
            cursor = self.cellar.cursor if self.cellar.initialized else 1
            objects, next_cursor = await async_sync(
                self.session,
                server=self.server,
                token=self.token,
                device=self.device,
                language=self.language,
                cursor=cursor,
            )
            if not self.cellar.initialized:
                collection_names = {name.casefold() for name in objects}
                required = {"wines", "racks", "rackitems"}
                if not required.issubset(collection_names):
                    raise PloudError(
                        "Initial PLOUD sync is missing one or more cellar collections"
                    )

            updated_cellar = deepcopy(self.cellar)
            apply_sync(updated_cellar, objects, next_cursor)
            updated_cellar.last_sync = datetime.now(timezone.utc).isoformat()
            await self.store.async_save(updated_cellar.to_storage())
            self.cellar = updated_cellar
            return updated_cellar
        except PloudAuthError as err:
            raise ConfigEntryAuthFailed from err
        except (PloudError, HomeAssistantError, OSError) as err:
            raise UpdateFailed(str(err)) from err

    async def async_force_sync(self) -> Cellar:
        """Request an immediate refresh and report failure to the caller."""
        await self.async_refresh()
        if not self.last_update_success or self.data is None:
            raise HomeAssistantError("PLOUD synchronization failed") from self.last_exception
        return self.data
