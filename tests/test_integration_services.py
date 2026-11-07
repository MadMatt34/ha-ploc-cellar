"""Functional tests for Home Assistant service registration and dispatch."""
from __future__ import annotations

import asyncio
from datetime import timedelta
from types import SimpleNamespace
from typing import Any

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from ploc_cellar import async_setup, async_setup_entry, async_unload_entry
from ploc_cellar.const import (
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_TOKEN,
    DOMAIN,
    PLOUD_DEFAULT_SERVER,
    SERVICE_GET_INVENTORY,
)
from ploc_cellar.models import Cellar, Rack, RackItem


class _Coordinator:
    """Provide the cached inventory data used by the inventory service."""

    def __init__(self) -> None:
        self.data = Cellar()


class _HTTP:
    """Record authenticated views registered by the integration."""

    def __init__(self) -> None:
        self.views: list[Any] = []

    def register_view(self, view: Any) -> None:
        self.views.append(view)


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
        http=_HTTP(),
        config_entries=SimpleNamespace(
            async_get_entry=lambda entry_id: entry if entry_id == "entry-1" else None
        ),
    )


def test_async_setup_registers_only_the_inventory_service() -> None:
    """Register only inventory; synchronization is exposed through entity buttons."""
    coordinator = _Coordinator()
    hass = _hass(coordinator)

    assert asyncio.run(async_setup(hass, {})) is True
    assert set(hass.services.handlers) == {SERVICE_GET_INVENTORY}
    assert len(hass.http.views) == 1


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
    assert response["rack_items"] == []
    assert response["stale"] is False


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
        http=_HTTP(),
        config_entries=SimpleNamespace(async_get_entry=lambda entry_id: entry),
    )
    asyncio.run(async_setup(hass, {}))
    call = SimpleNamespace(data={"config_entry_id": "entry-1"})

    with pytest.raises(ServiceValidationError):
        asyncio.run(hass.services.handlers[SERVICE_GET_INVENTORY](call))


def test_setup_entry_loads_coordinator_and_forwards_platforms(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A valid config entry initializes one coordinator and forwards platforms."""
    import ploc_cellar as integration

    created: dict[str, Any] = {}
    forwarded: list[object] = []

    class _FakeCoordinator:
        def __init__(
            self,
            hass: object,
            entry: object,
            session: object,
            server: str,
            token: str,
            device: str,
            language: str,
            *,
            scan_interval: timedelta,
        ) -> None:
            self.cellar = Cellar()
            created["arguments"] = {
                "server": server,
                "token": token,
                "device": device,
                "language": language,
                "scan_interval": scan_interval,
            }

        async def async_load(self) -> None:
            return None

        async def async_config_entry_first_refresh(self) -> None:
            created["first_refresh"] = True

    async def forward(entry: object, platforms: list[object]) -> None:
        forwarded.extend(platforms)

    monkeypatch.setattr(integration, "PlocCellarCoordinator", _FakeCoordinator)
    monkeypatch.setattr(integration, "async_get_clientsession", lambda hass: object())
    hass = SimpleNamespace(
        config=SimpleNamespace(country="FR", language="fr"),
        config_entries=SimpleNamespace(async_forward_entry_setups=forward),
    )
    entry = SimpleNamespace(
        data={CONF_TOKEN: "access-token", CONF_DEVICE: "device-uuid"},
        options={CONF_SCAN_INTERVAL: 240, CONF_LANGUAGE: "auto"},
        entry_id="entry-1",
    )

    assert asyncio.run(async_setup_entry(hass, entry)) is True
    assert entry.runtime_data.cellar.initialized is False
    assert created["arguments"] == {
        "server": PLOUD_DEFAULT_SERVER,
        "token": "access-token",
        "device": "device-uuid",
        "language": "fr",
        "scan_interval": timedelta(minutes=240),
    }
    assert created["first_refresh"] is True
    assert len(forwarded) == 2


def test_setup_entry_rejects_missing_credentials() -> None:
    """An incomplete stored config entry fails before coordinator construction."""
    hass = SimpleNamespace(
        config=SimpleNamespace(country="FR", language="fr"),
        config_entries=SimpleNamespace(),
    )
    entry = SimpleNamespace(data={}, options={}, entry_id="entry-1")

    with pytest.raises(HomeAssistantError):
        asyncio.run(async_setup_entry(hass, entry))


def test_unload_entry_delegates_platform_unload() -> None:
    """Unloading delegates to Home Assistant for both integration platforms."""
    calls: list[object] = []

    async def unload(entry: object, platforms: list[object]) -> bool:
        calls.extend(platforms)
        return True

    hass = SimpleNamespace(
        config_entries=SimpleNamespace(async_unload_platforms=unload)
    )
    entry = SimpleNamespace(entry_id="entry-1")

    assert asyncio.run(async_unload_entry(hass, entry)) is True
    assert len(calls) == 2


def test_inventory_service_exposes_complete_rack_positions() -> None:
    """The response contains physical positions, including unassigned ones."""
    coordinator = _Coordinator()
    coordinator.data.racks["rack-1"] = Rack(id="rack-1", name="Rack A")
    coordinator.data.rack_items["slot-1"] = RackItem(
        id="slot-1",
        rack_id="rack-1",
        wine_id="",
        row=2,
        column=3,
    )
    coordinator.data.stale = True
    hass = _hass(coordinator)
    asyncio.run(async_setup(hass, {}))
    call = SimpleNamespace(data={"config_entry_id": "entry-1"})

    response = asyncio.run(hass.services.handlers[SERVICE_GET_INVENTORY](call))

    assert response["stale"] is True
    assert response["rack_items"] == [
        {
            "id": "slot-1",
            "rack_id": "rack-1",
            "wine_id": None,
            "row": 2,
            "column": 3,
        }
    ]
