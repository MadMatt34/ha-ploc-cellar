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
    required = {"wines", "racks", "rackitems", "orders", "owners"}
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
        self._force_full_sync = False

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
            cursor = (
                1
                if self._force_full_sync or not self.cellar.initialized
                else self.cellar.cursor
            )
            _LOGGER.info(
                "Starting PLOUD %s synchronization (LastSyncTime=%d)",
                "full" if cursor == 1 else "incremental",
                cursor,
            )
            objects, next_cursor = await async_sync(
                self.session,
                server=self.server,
                token=self.token,
                device=self.device,
                language=self.language,
                cursor=cursor,
            )
            full_sync = cursor == 1
            _LOGGER.info(
                "PLOUD response received: %s",
                ", ".join(
                    f"{name}={len(records)}" for name, records in objects.items()
                ) or "no supported collections",
            )
            if full_sync:
                _validate_full_sync(objects)

            # A full PLOUD response is a snapshot, not a delta. Start from an
            # empty model so wines absent from that snapshot cannot survive.
            updated_cellar = Cellar() if full_sync else deepcopy(self.cellar)
            unresolved_owner_ids = apply_sync(
                updated_cellar, objects, next_cursor
            )

            if unresolved_owner_ids and not full_sync:
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
                # The fallback is also a complete snapshot: discard both the
                # partial delta candidate and the previous committed model.
                updated_cellar = Cellar()
                unresolved_owner_ids = apply_sync(
                    updated_cellar, objects, next_cursor
                )
                full_sync = True

            if unresolved_owner_ids:
                _LOGGER.warning(
                    "Full PLOUD sync did not include %d referenced Owner record(s); "
                    "the winery name remains unresolved",
                    len(unresolved_owner_ids),
                )

            _LOGGER.info(
                "PLOUD %s sync applied: %d wines in cellar, %d bottles in "
                "cellar; %d wine references with stock, %d total bottles; "
                "%d movement-anomaly references (%d bottles discrepancy); "
                "%d racks, %d occupied positions",
                "full" if full_sync else "incremental",
                updated_cellar.stocked_wines,
                updated_cellar.total_bottles,
                updated_cellar.wine_references,
                updated_cellar.total_stock_bottles,
                updated_cellar.movement_warning_wines,
                updated_cellar.movement_warning_bottles,
                len(updated_cellar.racks),
                updated_cellar.occupied_positions,
            )
            updated_cellar.last_sync = datetime.now(UTC).isoformat()
            updated_cellar.stale = False
            await self.store.async_save(updated_cellar.to_storage())
            self.cellar = updated_cellar
            if full_sync:
                self._force_full_sync = False
            return updated_cellar
        except PloudAuthError as err:
            self.cellar.stale = True
            raise ConfigEntryAuthFailed from err
        except (PloudError, HomeAssistantError, OSError) as err:
            self.cellar.stale = True
            raise UpdateFailed(str(err)) from err

    async def async_force_full_sync(self) -> Cellar:
        """Request a complete PLOUD snapshot without clearing current data first."""
        _LOGGER.info("Manual full PLOUD synchronization requested")
        self._force_full_sync = True
        while self._force_full_sync:
            await self.async_refresh()
            if not self.last_update_success:
                raise HomeAssistantError(
                    translation_domain=DOMAIN,
                    translation_key="sync_failed",
                ) from self.last_exception
        return self.data

    async def async_force_sync(self) -> Cellar:
        """Request an immediate refresh and report failure to the caller."""
        await self.async_refresh()
        if not self.last_update_success:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="sync_failed",
            ) from self.last_exception
        return self.data
