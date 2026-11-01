"""Home Assistant integration for a read-only PLOUD wine cellar."""
from __future__ import annotations

from collections.abc import Callable
from datetime import timedelta
from typing import Any, cast

import voluptuous as vol
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import Platform
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    SupportsResponse,
)
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType, VolSchemaType
from homeassistant.util.json import JsonObjectType, JsonValueType

from .const import (
    CONF_COLOR,
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_SEARCH,
    CONF_SERVER,
    CONF_TOKEN,
    DEFAULT_LANGUAGE,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MIN_SCAN_INTERVAL_MINUTES,
    SERVICE_GET_INVENTORY,
    SERVICE_SYNC,
    SUPPORTED_LANGUAGES,
)
from .coordinator import PlocCellarCoordinator
from .models import Cellar
from .types import GetInventoryServiceData, PlocCellarConfigEntry, SyncServiceData

PLATFORMS: list[Platform] = [Platform.SENSOR]
CONFIG_SCHEMA: Callable[[dict[str, Any]], dict[str, Any]] = cast(
    Callable[[dict[str, Any]], dict[str, Any]],
    cv.config_entry_only_config_schema(DOMAIN),
)

GET_INVENTORY_SCHEMA: VolSchemaType = cast(VolSchemaType, vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Optional(CONF_SEARCH, default=""): cv.string,
        probatio.Optional(CONF_COLOR, default=""): cv.string,
    }
)
SYNC_SCHEMA: VolSchemaType = cast(VolSchemaType, vol.Schema(
    {
        probatio.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)


def _get_coordinator(
    hass: HomeAssistant,
    config_entry_id: str,
) -> PlocCellarCoordinator:
    """Return the loaded coordinator selected by the config entry ID."""
    entry = hass.config_entries.async_get_entry(config_entry_id)
    if (
        entry is None
        or entry.domain != DOMAIN
        or entry.state is not ConfigEntryState.LOADED
    ):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="config_entry_not_loaded",
        )
    return cast(PlocCellarConfigEntry, entry).runtime_data


def _build_inventory_response(
    cellar: Cellar,
    *,
    search: str,
    color: str,
) -> JsonObjectType:
    """Build a JSON-safe inventory response without exposing sensor attributes."""
    normalized_search = search.casefold().strip()
    normalized_color = color.casefold().strip()
    inventory: list[JsonValueType] = []

    stocked_wines = sorted(
        (wine for wine in cellar.wines.values() if wine.bottles > 0),
        key=lambda wine: (wine.name.casefold(), wine.vintage or 0),
    )
    for wine in stocked_wines:
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
        if normalized_search and normalized_search not in searchable:
            continue
        if normalized_color and normalized_color not in (wine.color or "").casefold():
            continue

        locations: list[JsonValueType] = [
            {
                "rack": cellar.racks[item.rack_id].name,
                "rack_id": item.rack_id,
                "row": item.row,
                "column": item.column,
            }
            for item in cellar.rack_items.values()
            if item.wine_id == wine.id and item.rack_id in cellar.racks
        ]
        inventory.append(
            {
                "id": wine.id,
                "name": wine.name,
                "bottles": wine.bottles,
                "vintage": wine.vintage,
                "appellation": wine.appellation,
                "color": wine.color,
                "color_rgb": cast(
                    JsonValueType,
                    list(wine.color_rgb) if wine.color_rgb is not None else None,
                ),
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

    racks: list[JsonValueType] = [
        {"id": rack.id, "name": rack.name} for rack in cellar.racks.values()
    ]
    return {
        "total_bottles": cellar.total_bottles,
        "stocked_wines": cellar.stocked_wines,
        "matching_wines": len(inventory),
        "rack_count": len(cellar.racks),
        "occupied_positions": cellar.occupied_positions,
        "racks": racks,
        "wines": inventory,
        "last_sync": cellar.last_sync,
    }


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register integration actions independently of config entry setup."""

    async def get_inventory(call: ServiceCall) -> JsonObjectType:
        """Return the current stocked inventory on demand."""
        service_data = cast(GetInventoryServiceData, call.data)
        coordinator = _get_coordinator(
            hass, service_data["config_entry_id"]
        )
        return _build_inventory_response(
            coordinator.data,
            search=service_data.get(CONF_SEARCH, ""),
            color=service_data.get(CONF_COLOR, ""),
        )

    async def sync_service(call: ServiceCall) -> None:
        """Trigger an immediate PLOUD synchronization."""
        service_data = cast(SyncServiceData, call.data)
        coordinator = _get_coordinator(
            hass, service_data["config_entry_id"]
        )
        await coordinator.async_force_sync()

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_INVENTORY,
        get_inventory,
        schema=GET_INVENTORY_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_SYNC,
        sync_service,
        schema=SYNC_SCHEMA,
    )
    return True


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
) -> bool:
    """Set up the PLOUD connection, coordinator and sensor platform."""
    raw_interval = entry.options.get(
        CONF_SCAN_INTERVAL,
        int(DEFAULT_SCAN_INTERVAL.total_seconds() // 60),
    )
    interval_minutes = (
        raw_interval
        if isinstance(raw_interval, int)
        and not isinstance(raw_interval, bool)
        and MIN_SCAN_INTERVAL_MINUTES <= raw_interval <= MAX_SCAN_INTERVAL_MINUTES
        else int(DEFAULT_SCAN_INTERVAL.total_seconds() // 60)
    )

    raw_language = entry.options.get(
        CONF_LANGUAGE,
        entry.data.get(CONF_LANGUAGE, DEFAULT_LANGUAGE),
    )
    language = (
        raw_language
        if isinstance(raw_language, str) and raw_language in SUPPORTED_LANGUAGES
        else DEFAULT_LANGUAGE
    )

    server = entry.data.get(CONF_SERVER)
    token = entry.data.get(CONF_TOKEN)
    device = entry.data.get(CONF_DEVICE)
    if (
        not isinstance(server, str)
        or not server
        or not isinstance(token, str)
        or not token
        or not isinstance(device, str)
        or not device
    ):
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="invalid_config_entry",
        )

    coordinator = PlocCellarCoordinator(
        hass,
        entry,
        async_get_clientsession(hass),
        server,
        token,
        device,
        language,
        scan_interval=timedelta(minutes=interval_minutes),
    )
    await coordinator.async_load()
    if coordinator.cellar.initialized:
        # Keep the last persisted inventory usable while PLOUD is unavailable.
        coordinator.async_set_updated_data(coordinator.cellar)
        await coordinator.async_refresh()
    else:
        await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
) -> bool:
    """Unload platforms; the config-entry-bound coordinator shuts down automatically."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
