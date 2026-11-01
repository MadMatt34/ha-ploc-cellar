"""Cellar coordinator and persistent storage."""
from __future__ import annotations

from datetime import datetime, timezone

from aiohttp import ClientSession
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DEFAULT_SCAN_INTERVAL, DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .models import Cellar
from .ploud import PloudError, apply_sync, async_sync

class PlocCellarCoordinator(DataUpdateCoordinator[Cellar]):
    def __init__(self, hass: HomeAssistant, session: ClientSession, entry_id: str,
                 server: str, token: str, device: str, language: str) -> None:
        super().__init__(hass, logger=__import__("logging").getLogger(__name__),
            name=DOMAIN, update_interval=DEFAULT_SCAN_INTERVAL)
        self.session = session
        self.server, self.token, self.device, self.language = server, token, device, language
        self.store: Store[dict] = Store(hass, STORAGE_VERSION, f"{STORAGE_KEY}.{entry_id}")
        self.cellar = Cellar()

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        if stored is not None:
            self.cellar = Cellar.from_storage(stored)

    async def _async_update_data(self) -> Cellar:
        try:
            cursor = self.cellar.cursor if self.cellar.initialized else 1
            objects, next_cursor = await async_sync(self.session, server=self.server,
                token=self.token, device=self.device, language=self.language, cursor=cursor)
            if not self.cellar.initialized and not all(
                any(k.lower() == name.lower() and isinstance(v, list) and v for k,v in objects.items())
                for name in ("Wines", "Racks", "RackItems")
            ):
                raise PloudError("Initial sync did not return the complete cellar baseline")
            apply_sync(self.cellar, objects, next_cursor)
            self.cellar.last_sync = datetime.now(timezone.utc).isoformat()
            await self.store.async_save(self.cellar.to_storage())
            return self.cellar
        except PloudError as err:
            raise UpdateFailed(str(err)) from err

    async def async_force_sync(self) -> Cellar:
        return await self.async_refresh()
