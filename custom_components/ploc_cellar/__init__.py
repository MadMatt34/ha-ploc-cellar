"""Home Assistant integration for a read-only PLOUD wine cellar."""
from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_SERVER,
    CONF_TOKEN,
    DEFAULT_LANGUAGE,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
)
from .coordinator import PlocCellarCoordinator

PLATFORMS: list[Platform] = [Platform.SENSOR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type PlocCellarConfigEntry = ConfigEntry[PlocCellarCoordinator]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration from config entries only."""
    return True


async def async_setup_entry(
    hass: HomeAssistant, entry: PlocCellarConfigEntry
) -> bool:
    """Set up the PLOUD connection, coordinator, entities and actions."""
    interval_minutes = entry.options.get(
        CONF_SCAN_INTERVAL, int(DEFAULT_SCAN_INTERVAL.total_seconds() // 60)
    )
    language = entry.options.get(
        CONF_LANGUAGE, entry.data.get(CONF_LANGUAGE, DEFAULT_LANGUAGE)
    )
    coordinator = PlocCellarCoordinator(
        hass,
        entry,
        async_get_clientsession(hass),
        entry.data[CONF_SERVER],
        entry.data[CONF_TOKEN],
        entry.data[CONF_DEVICE],
        language,
        scan_interval=timedelta(minutes=interval_minutes),
    )
    await coordinator.async_load()
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    async def get_inventory(call: ServiceCall) -> dict[str, Any]:
        """Return the current stocked inventory on demand."""
        cellar = coordinator.data
        search = str(call.data.get("search", "")).casefold().strip()
        color = str(call.data.get("color", "")).casefold().strip()
        wines: list[dict[str, Any]] = []
        for wine in cellar.wines.values():
            if wine.bottles <= 0:
                continue
            searchable = " ".join(
                (
                    wine.name,
                    wine.appellation or "",
                    wine.region or "",
                    wine.country or "",
                    wine.grapes or "",
                    wine.cuvee or "",
                )
            ).casefold()
            if search and search not in searchable:
                continue
            if color and color not in (wine.color or "").casefold():
                continue
            locations = [
                {
                    "rack": (
                        cellar.racks[item.rack_id].name
                        if item.rack_id in cellar.racks
                        else item.rack_id
                    ),
                    "rack_id": item.rack_id,
                    "row": item.row,
                    "column": item.column,
                }
                for item in cellar.rack_items.values()
                if item.wine_id == wine.id and item.rack_id in cellar.racks
            ]
            wines.append(
                {
                    "id": wine.id,
                    "name": wine.name,
                    "bottles": wine.bottles,
                    "vintage": wine.vintage,
                    "appellation": wine.appellation,
                    "color": wine.color,
                    "color_rgb": wine.color_rgb,
                    "classification": wine.classification,
                    "region": wine.region,
                    "country": wine.country,
                    "grapes": wine.grapes,
                    "cuvee": wine.cuvee,
                    "bottle_format": wine.bottle_format,
                    "bottle_volume_l": wine.bottle_volume_l,
                    "ploud_pid": wine.ploud_pid,
                    "locations": locations,
                }
            )
        wines.sort(
            key=lambda item: (
                str(item["name"]).casefold(),
                item["vintage"] or 0,
            )
        )
        return {
            "total_bottles": cellar.total_bottles,
            "stocked_wines": cellar.stocked_wines,
            "matching_wines": len(wines),
            "rack_count": len(cellar.racks),
            "occupied_positions": cellar.occupied_positions,
            "racks": [
                {"id": rack.id, "name": rack.name}
                for rack in cellar.racks.values()
            ],
            "wines": wines,
            "last_sync": cellar.last_sync,
        }

    async def sync_service(call: ServiceCall) -> None:
        """Trigger an immediate PLOUD synchronization."""
        await coordinator.async_force_sync()

    hass.services.async_register(
        DOMAIN,
        "get_inventory",
        get_inventory,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(DOMAIN, "sync", sync_service)
    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: PlocCellarConfigEntry
) -> bool:
    """Unload platforms and remove integration actions."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    hass.services.async_remove(DOMAIN, "get_inventory")
    hass.services.async_remove(DOMAIN, "sync")
    return True
