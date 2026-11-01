"""Ploc Cellar integration setup."""
from __future__ import annotations

from aiohttp import ClientSession
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import CONF_DEVICE, CONF_LANGUAGE, CONF_SERVER, CONF_TOKEN, DEFAULT_LANGUAGE, DOMAIN
from .coordinator import PlocCellarCoordinator

PLATFORMS = ["sensor"]

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    session: ClientSession = async_get_clientsession(hass)
    coordinator = PlocCellarCoordinator(hass, session, entry.entry_id,
        entry.data[CONF_SERVER], entry.data[CONF_TOKEN], entry.data[CONF_DEVICE],
        entry.data.get(CONF_LANGUAGE, DEFAULT_LANGUAGE))
    await coordinator.async_load()
    await coordinator.async_config_entry_first_refresh()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    async def get_inventory(call: ServiceCall) -> dict:
        cellar = coordinator.data
        search = str(call.data.get("search", "")).casefold().strip()
        color = str(call.data.get("color", "")).casefold().strip()
        wines = []
        for wine in cellar.wines.values():
            if wine.bottles <= 0: continue
            if search and search not in " ".join((wine.name, wine.appellation or "", wine.region or "", wine.country or "")).casefold():
                continue
            if color and color not in (wine.color or "").casefold(): continue
            locations = [{"rack": cellar.racks[item.rack_id].name if item.rack_id in cellar.racks else item.rack_id,
                "row": item.row, "column": item.column}
                for item in cellar.rack_items.values() if item.wine_id == wine.id]
            wines.append({"id": wine.id, "name": wine.name, "bottles": wine.bottles,
                "vintage": wine.vintage, "appellation": wine.appellation, "color": wine.color,
                "color_rgb": wine.color_rgb, "classification": wine.classification,
                "region": wine.region, "country": wine.country, "grapes": wine.grapes,
                "cuvee": wine.cuvee, "bottle_format": wine.bottle_format,
                "bottle_volume_l": wine.bottle_volume_l, "ploud_pid": wine.ploud_pid,
                "locations": locations})
        wines.sort(key=lambda item: (str(item["name"]).casefold(), item["vintage"] or 0))
        return {"total_bottles": cellar.total_bottles, "stocked_wines": len(wines),
                "racks": [{"id": r.id, "name": r.name} for r in cellar.racks.values()],
                "wines": wines, "last_sync": cellar.last_sync}

    async def sync_service(call: ServiceCall) -> None:
        await coordinator.async_force_sync()

    hass.services.async_register(DOMAIN, "get_inventory", get_inventory,
        supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, "sync", sync_service)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True

async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    hass.services.async_remove(DOMAIN, "get_inventory")
    hass.services.async_remove(DOMAIN, "sync")
    hass.data[DOMAIN].pop(entry.entry_id, None)
    return True
