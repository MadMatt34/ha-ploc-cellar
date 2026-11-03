"""Cellar coordinator and persistent Home Assistant storage."""
from __future__ import annotations

import logging
from copy import deepcopy
from datetime import UTC, datetime, timedelta

from aiohttp import ClientSession
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, HomeAssistantError
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import CELLAR_DATA_VERSION, DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .models import Cellar, JsonValue
from .ploud import (
    PloudAuthError,
    PLOUDCollections,
    PloudError,
    apply_sync,
    async_sync,
)
from .types import PlocCellarConfigEntry

_LOGGER = logging.getLogger(__name__)


def _validate_full_sync(objects: PLOUDCollections) -> None:
    """Require the complete set of collections needed for a full cellar sync."""
    collection_names = {name.casefold() for name in objects}
    required = {"wines", "racks", "rackitems", "owners"}
    if not required.issubset(collection_names):
        raise PloudError(
            "Full PLOUD sync is missing one or more cellar collections"
        )


class PlocCellarCoordinator(DataUpdateCoordinator[Cellar]):
    """Fetch PLOUD deltas and publish the shared cellar model."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: PlocCellarConfigEntry,
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
            always_update=False,
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
                if stored.get("version") != CELLAR_DATA_VERSION:
                    try:
                        await self.store.async_save(self.cellar.to_storage())
                    except (HomeAssistantError, OSError, TypeError, ValueError) as err:
                        # Keep the migrated in-memory snapshot available. The
                        # next successful sync will persist it transactionally.
                        _LOGGER.warning(
                            "Could not persist migrated Ploc Cellar storage: %s",
                            err,
                        )
        except (HomeAssistantError, OSError, ValueError, TypeError) as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="invalid_storage",
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
            if cursor == 1:
                _validate_full_sync(objects)

            updated_cellar = deepcopy(self.cellar)
            unresolved_owner_ids = apply_sync(
                updated_cellar, objects, next_cursor
            )

            if unresolved_owner_ids and cursor != 1:
                _LOGGER.info(
                    "An incremental PLOUD update references an Owner missing "
                    "from the delta; requesting one full sync to resolve winery names"
                )
                objects, next_cursor = await async_sync(
                    self.session,
                    server=self.server,
                    token=self.token,
                    device=self.device,
                    language=self.language,
                    cursor=1,
                )
                _validate_full_sync(objects)
                # Discard the partial candidate and apply the complete response
                # to the last committed snapshot, not on top of the delta.
                updated_cellar = deepcopy(self.cellar)
                unresolved_owner_ids = apply_sync(
                    updated_cellar, objects, next_cursor
                )

            if unresolved_owner_ids:
                _LOGGER.warning(
                    "Full PLOUD sync did not include %d referenced Owner record(s); "
                    "the winery name remains unresolved",
                    len(unresolved_owner_ids),
                )

            updated_cellar.last_sync = datetime.now(UTC).isoformat()
            updated_cellar.stale = False
            await self.store.async_save(updated_cellar.to_storage())
            self.cellar = updated_cellar
            return updated_cellar
        except PloudAuthError as err:
            self.cellar.stale = True
            raise ConfigEntryAuthFailed from err
        except (PloudError, HomeAssistantError, OSError) as err:
            self.cellar.stale = True
            raise UpdateFailed(str(err)) from err

    async def async_force_sync(self) -> Cellar:
        """Request an immediate refresh and report failure to the caller."""
        await self.async_refresh()
        if not self.last_update_success:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="sync_failed",
            ) from self.last_exception
        return self.data
