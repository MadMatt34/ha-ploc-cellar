"""Home Assistant integration for a read-only PLOUD wine cellar."""
from __future__ import annotations

from collections.abc import Callable
from datetime import timedelta
from pathlib import Path
from typing import Any, cast

import probatio
from homeassistant.components.websocket_api import async_register_command
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import ERR_NOT_FOUND
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.components.websocket_api.messages import event_message
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import ATTR_CONFIG_ENTRY_ID, Platform
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType
from homeassistant.util.json import JsonObjectType, JsonValueType

from .const import (
    CONF_COLOR,
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_SEARCH,
    CONF_TOKEN,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MIN_SCAN_INTERVAL_MINUTES,
    PLOUD_DEFAULT_SERVER,
    SERVICE_GET_INVENTORY,
    SIGNAL_SYNC_COMPLETED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .coordinator import PlocCellarCoordinator
from .images import remove_image_cache
from .language import get_ploud_language
from .models import Cellar, Wine
from .types import GetInventoryServiceData, PlocCellarConfigEntry
from .views import PlocCellarImageView

PLATFORMS: list[Platform] = [Platform.BUTTON, Platform.SENSOR]
CONFIG_SCHEMA: Callable[[dict[str, Any]], dict[str, Any]] = cast(
    Callable[[dict[str, Any]], dict[str, Any]],
    cv.config_entry_only_config_schema(DOMAIN),  # pyright: ignore[reportUnknownMemberType]
)

GET_INVENTORY_SCHEMA: Any = cast(
    Any,
    probatio.Schema(
        {
            probatio.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
            probatio.Optional(CONF_SEARCH, default=""): cv.string,
            probatio.Optional(CONF_COLOR, default=""): cv.string,
        }
    ),
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


def _wine_image_url(
    wine: Wine,
    image_url_builder: Callable[[str], str | None] | None,
) -> str | None:
    """Resolve a Wine's primary image, falling back to its cover image."""
    if image_url_builder is None:
        return None
    for field in ("im", "ci"):
        value = wine.ploud_reference_fields.get(field)
        if isinstance(value, str) and value.strip():
            image_url = image_url_builder(value.strip())
            if image_url is not None:
                return image_url
        if isinstance(value, int) and not isinstance(value, bool):
            image_url = image_url_builder(str(value))
            if image_url is not None:
                return image_url
    return None


def _build_inventory_response(
    cellar: Cellar,
    *,
    search: str,
    color: str,
    image_url_builder: Callable[[str], str | None] | None = None,
) -> JsonObjectType:
    """Build a JSON-safe inventory response without exposing sensor attributes."""
    normalized_search = search.casefold().strip()
    normalized_color = color.casefold().strip()
    inventory: list[JsonValueType] = []
    wine_diagnostics: list[JsonValueType] | None = (
        [] if cellar.stock_reconstruction_complete else None
    )

    # Build physical locations once instead of scanning every RackItem for
    # each wine in both the diagnostics and inventory response.
    locations_by_wine: dict[str, list[JsonValueType]] = {}
    for item in cellar.rack_items.values():
        if not item.wine_id or item.rack_id not in cellar.racks:
            continue
        locations_by_wine.setdefault(item.wine_id, []).append(
            {
                "rack": cellar.racks[item.rack_id].name,
                "rack_id": item.rack_id,
                "row": item.row,
                "column": item.column,
            }
        )

    if wine_diagnostics is not None:
        for wine in sorted(
            cellar.wines.values(),
            key=lambda item: (item.name.casefold(), item.vintage or 0),
        ):
            stock = cellar.stock_for(wine)
            unlocated = stock.unlocated_bottles or 0
            negative = stock.negative_movement_bottles or 0
            physical_surplus = stock.physical_surplus_bottles or 0
            if not (unlocated or negative or physical_surplus):
                continue
            locations = locations_by_wine.get(wine.id, [])
            wine_details: JsonObjectType = {
                "id": wine.id,
                "name": wine.name,
                "domain": wine.domain,
                "bottles": stock.effective_stock,
                "effective_stock": stock.effective_stock,
                "ploud_bottles": wine.bottles,
                "bottles_in_cellar": wine.bottles_in_cellar,
                "unlocated_bottles": stock.unlocated_bottles,
                "purchased": stock.purchased,
                "consumed": stock.consumed,
                "movement_balance": stock.movement_balance,
                "calculated_stock": stock.calculated_stock,
                "negative_movement_bottles": stock.negative_movement_bottles,
                "physical_surplus_bottles": stock.physical_surplus_bottles,
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
                "comment": wine.comment,
                "alcohol_percent": wine.alcohol_percent,
                "service_temperature_min": wine.service_temperature_min,
                "service_temperature_max": wine.service_temperature_max,
                "bottle_format": wine.bottle_format,
                "bottle_volume_l": wine.bottle_volume_l,
                "ploud_pid": wine.ploud_pid,
                "meals": wine.meals,
                "image_url": _wine_image_url(wine, image_url_builder),
                "locations": locations,
            }
            wine_diagnostics.append(
                {
                    "id": wine.id,
                    "name": wine.name,
                    "domain": wine.domain,
                    "vintage": wine.vintage,
                    "purchased": stock.purchased,
                    "consumed": stock.consumed,
                    "movement_balance": stock.movement_balance,
                    "bottles_in_cellar": wine.bottles_in_cellar,
                    "effective_stock": stock.effective_stock,
                    "unlocated_bottles": stock.unlocated_bottles,
                    "negative_movement_bottles": (
                        stock.negative_movement_bottles
                    ),
                    "physical_surplus_bottles": (
                        stock.physical_surplus_bottles
                    ),
                    "wine": wine_details,
                }
            )

    stocked_wines = sorted(
        (
            wine
            for wine in cellar.wines.values()
            if (
                cellar.stock_for(wine).effective_stock > 0
                if cellar.stock_reconstruction_complete
                else wine.bottles_in_cellar > 0
            )
        ),
        key=lambda wine: (wine.name.casefold(), wine.vintage or 0),
    )
    for wine in stocked_wines:
        searchable = " ".join(
            (
                wine.name,
                wine.domain or "",
                wine.appellation or "",
                wine.region or "",
                wine.country or "",
                wine.grapes or "",
                wine.cuvee or "",
                wine.comment or "",
            )
        ).casefold()
        if normalized_search and normalized_search not in searchable:
            continue
        if normalized_color and normalized_color not in (wine.color or "").casefold():
            continue

        stock = cellar.stock_for(wine)
        locations = locations_by_wine.get(wine.id, [])
        inventory.append(
            {
                "id": wine.id,
                "name": wine.name,
                "domain": wine.domain,
                "bottles": (
                    stock.effective_stock
                    if cellar.stock_reconstruction_complete
                    else None
                ),
                "effective_stock": (
                    stock.effective_stock
                    if cellar.stock_reconstruction_complete
                    else None
                ),
                "ploud_bottles": wine.bottles,
                "bottles_in_cellar": wine.bottles_in_cellar,
                "unlocated_bottles": stock.unlocated_bottles,
                "purchased": stock.purchased,
                "consumed": stock.consumed,
                "movement_balance": stock.movement_balance,
                "calculated_stock": stock.calculated_stock,
                "negative_movement_bottles": (
                    stock.negative_movement_bottles
                ),
                "physical_surplus_bottles": (
                    stock.physical_surplus_bottles
                ),
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
                "comment": wine.comment,
                "alcohol_percent": wine.alcohol_percent,
                "service_temperature_min": wine.service_temperature_min,
                "service_temperature_max": wine.service_temperature_max,
                "bottle_format": wine.bottle_format,
                "bottle_volume_l": wine.bottle_volume_l,
                "ploud_pid": wine.ploud_pid,
                "meals": wine.meals,
                "image_url": _wine_image_url(wine, image_url_builder),
                "locations": locations,
            }
        )

    racks: list[JsonValueType] = [
        {"id": rack.id, "name": rack.name} for rack in cellar.racks.values()
    ]
    rack_items: list[JsonValueType] = [
        {
            "id": item.id,
            "rack_id": item.rack_id,
            "wine_id": item.wine_id or None,
            "row": item.row,
            "column": item.column,
        }
        for item in cellar.rack_items.values()
    ]
    return {
        "stale": cellar.stale,
        "total_bottles": cellar.total_bottles,
        "stocked_wines": cellar.stocked_wines,
        "wine_references": cellar.wine_references,
        "total_stock_bottles": cellar.total_stock_bottles,
        "stock_reconstruction_complete": cellar.stock_reconstruction_complete,
        "total_positions": cellar.total_positions,
        "empty_positions": cellar.empty_positions,
        "unlocated_wines": cellar.unlocated_wines,
        "unlocated_bottles": cellar.unlocated_bottles,
        "negative_movement_wines": cellar.negative_movement_wines,
        "negative_movement_bottles": cellar.negative_movement_bottles,
        "physical_surplus_wines": cellar.physical_surplus_wines,
        "physical_surplus_bottles": cellar.physical_surplus_bottles,
        "wine_diagnostics": wine_diagnostics,
        "matching_wines": len(inventory),
        "rack_count": len(cellar.racks),
        "occupied_positions": cellar.occupied_positions,
        "positions_without_rack": cellar.positions_without_rack,
        "positions_with_unknown_wine": cellar.positions_with_unknown_wine,
        "orders_without_wine": cellar.orders_without_wine,
        "racks": racks,
        "rack_items": rack_items,
        "wines": inventory,
        "last_sync": cellar.last_sync,
    }


@callback
@cast(Any, websocket_command)(
    {
        probatio.Required("type"): f"{DOMAIN}/subscribe_sync",
        probatio.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)
def websocket_subscribe_sync(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to successful sync notifications for one loaded cellar."""
    config_entry_id = msg[ATTR_CONFIG_ENTRY_ID]
    try:
        _get_coordinator(hass, config_entry_id)
    except ServiceValidationError:
        connection.send_error(
            msg["id"],
            ERR_NOT_FOUND,
            "Ploc Cellar configuration entry is not loaded",
        )
        return

    @callback
    def forward_sync_completed() -> None:
        """Send an empty invalidation message; inventory remains service-only."""
        connection.send_message(event_message(msg["id"], {}))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass,
        f"{SIGNAL_SYNC_COMPLETED}_{config_entry_id}",
        forward_sync_completed,
    )
    connection.send_result(msg["id"])


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the inventory service, sync WebSocket command and image endpoint."""
    hass.http.register_view(PlocCellarImageView(hass))
    cast(Any, async_register_command)(hass, websocket_subscribe_sync)

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
            image_url_builder=coordinator.image_url,
        )

    hass.services.async_register(  # pyright: ignore[reportUnknownMemberType]
        DOMAIN,
        SERVICE_GET_INVENTORY,
        get_inventory,
        schema=GET_INVENTORY_SCHEMA,
        supports_response=SupportsResponse.ONLY,
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

    language = get_ploud_language(
        hass, entry.options.get(CONF_LANGUAGE)
    )

    token = entry.data.get(CONF_TOKEN)
    device = entry.data.get(CONF_DEVICE)
    if (
        not isinstance(token, str)
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
        PLOUD_DEFAULT_SERVER,
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



async def async_remove_entry(
    hass: HomeAssistant,
    entry: PlocCellarConfigEntry,
) -> None:
    """Remove entry-scoped inventory storage and image cache on deletion."""
    store: Store[dict[str, Any]] = Store(
        hass,
        STORAGE_VERSION,
        f"{STORAGE_KEY}.{entry.entry_id}",
        atomic_writes=True,
    )
    await store.async_remove()

    cache_root = Path(hass.config.path(".storage", DOMAIN, entry.entry_id))
    await hass.async_add_executor_job(remove_image_cache, cache_root)
