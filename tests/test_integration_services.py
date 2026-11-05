"""Functional tests for Home Assistant service registration and dispatch."""
from __future__ import annotations

import asyncio
from types import SimpleNamespace
from typing import Any

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.exceptions import ServiceValidationError
from ploc_cellar import async_setup
from ploc_cellar.const import (
    DOMAIN,
    SERVICE_GET_INVENTORY,
    SERVICE_SYNC,
    SERVICE_SYNC_FULL,
)
from ploc_cellar.models import Cellar


class _Coordinator:
    """Capture the public synchronization calls made by registered services."""

    def __init__(self) -> None:
        self.data = Cellar()
        self.partial_calls = 0
        self.full_calls = 0

    async def async_force_sync(self) -> None:
        self.partial_calls += 1

    async def async_force_full_sync(self) -> None:
        self.full_calls += 1


class _Services:
    """Record service handlers registered by the integration."""

    def __init__(self) -> None:
        self.handlers: dict[str, Any] = {}

    def async_register(
        self,
        domain: str,
        service: str,
        handler: Any,
        **kwargs: Any,
    ) -> None:
        assert domain == DOMAIN
        self.handlers[service] = handler


def _hass(coordinator: _Coordinator) -> SimpleNamespace:
    """Build the minimum HA service/config-entry surface."""
    entry = SimpleNamespace(
        domain=DOMAIN,
        state=ConfigEntryState.LOADED,
        runtime_data=coordinator,
    )
    return SimpleNamespace(
        services=_Services(),
        config_entries=SimpleNamespace(
            async_get_entry=lambda entry_id: entry if entry_id == "entry-1" else None
        ),
    )


def test_async_setup_registers_all_public_services() -> None:
    """Setup registers inventory, partial sync and full sync handlers."""
    coordinator = _Coordinator()
    hass = _hass(coordinator)

    assert asyncio.run(async_setup(hass, {})) is True
    assert set(hass.services.handlers) == {
        SERVICE_GET_INVENTORY,
        SERVICE_SYNC,
        SERVICE_SYNC_FULL,
    }


def test_sync_services_dispatch_to_the_selected_coordinator() -> None:
    """The sync handlers invoke their matching coordinator methods."""
    coordinator = _Coordinator()
    hass = _hass(coordinator)
    asyncio.run(async_setup(hass, {}))
    call = SimpleNamespace(data={"config_entry_id": "entry-1"})

    asyncio.run(hass.services.handlers[SERVICE_SYNC](call))
    asyncio.run(hass.services.handlers[SERVICE_SYNC_FULL](call))

    assert coordinator.partial_calls == 1
    assert coordinator.full_calls == 1


def test_inventory_service_returns_json_safe_empty_inventory() -> None:
    """The response service returns aggregate data from the loaded entry."""
    coordinator = _Coordinator()
    hass = _hass(coordinator)
    asyncio.run(async_setup(hass, {}))
    call = SimpleNamespace(
        data={"config_entry_id": "entry-1", "search": "", "color": ""}
    )

    response = asyncio.run(hass.services.handlers[SERVICE_GET_INVENTORY](call))

    assert response["total_bottles"] == 0
    assert response["rack_count"] == 0
    assert response["wines"] == []
    assert response["racks"] == []


@pytest.mark.parametrize(
    "entry",
    [
        None,
        SimpleNamespace(domain="other", state=ConfigEntryState.LOADED),
        SimpleNamespace(domain=DOMAIN, state=ConfigEntryState.NOT_LOADED),
    ],
)
def test_services_reject_missing_wrong_or_unloaded_entries(entry: object) -> None:
    """A service cannot dispatch against an absent or unloaded config entry."""
    hass = SimpleNamespace(
        services=_Services(),
        config_entries=SimpleNamespace(async_get_entry=lambda entry_id: entry),
    )
    asyncio.run(async_setup(hass, {}))
    call = SimpleNamespace(data={"config_entry_id": "entry-1"})

    with pytest.raises(ServiceValidationError):
        asyncio.run(hass.services.handlers[SERVICE_SYNC](call))
