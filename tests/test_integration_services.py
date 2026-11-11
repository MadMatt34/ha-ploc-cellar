"""Functional tests for Home Assistant service registration and dispatch."""
from __future__ import annotations

import asyncio
from datetime import timedelta
from pathlib import Path
from types import SimpleNamespace
from typing import Any

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from ploc_cellar import (
    async_remove_entry,
    async_setup,
    async_setup_entry,
    async_unload_entry,
)
from ploc_cellar.const import (
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_TOKEN,
    DOMAIN,
    PLOUD_DEFAULT_SERVER,
    SERVICE_GET_INVENTORY,
    SIGNAL_SYNC_COMPLETED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from ploc_cellar.models import Cellar, Rack, RackItem


class _Coordinator:
    """Provide the cached inventory data used by the inventory service."""

    def __init__(self) -> None:
        self.data = Cellar()

    def image_url(self, document_id: str) -> None:
        """Test coordinator has no cached image documents."""
        return None


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
        data={},
        config_entries=SimpleNamespace(
            async_get_entry=lambda entry_id: entry if entry_id == "entry-1" else None
        ),
    )


def test_async_setup_registers_only_the_inventory_service() -> None:
    """Register the inventory service and scoped synchronization subscription."""
    coordinator = _Coordinator()
    hass = _hass(coordinator)

    assert asyncio.run(async_setup(hass, {})) is True
    assert set(hass.services.handlers) == {SERVICE_GET_INVENTORY}
    assert len(hass.http.views) == 1
    assert list(hass.data["websocket_api"]) == [f"{DOMAIN}/subscribe_sync"]



def test_sync_websocket_subscription_is_scoped_and_sends_no_inventory_data(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Authenticated standard-user subscriptions receive only scoped invalidations."""
    import ploc_cellar as integration

    first = _Coordinator()
    second = _Coordinator()
    entries = {
        "entry-1": SimpleNamespace(
            domain=DOMAIN, state=ConfigEntryState.LOADED, runtime_data=first
        ),
        "entry-2": SimpleNamespace(
            domain=DOMAIN, state=ConfigEntryState.LOADED, runtime_data=second
        ),
    }
    hass = SimpleNamespace(
        services=_Services(),
        http=_HTTP(),
        websocket_api=_WebSocketAPI(),
        config_entries=SimpleNamespace(async_get_entry=entries.get),
    )
    connected: dict[str, list[Any]] = {}

    def connect(_hass: Any, signal: str, callback: Any) -> Any:
        connected.setdefault(signal, []).append(callback)

        def unsubscribe() -> None:
            connected[signal].remove(callback)
            if not connected[signal]:
                del connected[signal]

        return unsubscribe

    monkeypatch.setattr(integration, "async_dispatcher_connect", connect)
    assert asyncio.run(async_setup(hass, {})) is True
    handler = hass.data["websocket_api"][f"{DOMAIN}/subscribe_sync"][0]

    class _Connection:
        def __init__(self) -> None:
            self.user = SimpleNamespace(is_admin=False)
            self.subscriptions: dict[int, Any] = {}
            self.messages: list[dict[str, Any]] = []
            self.results: list[int] = []
            self.errors: list[tuple[Any, ...]] = []

        def send_event(self, message_id: int, event: dict[str, Any]) -> None:
            self.messages.append({"id": message_id, "type": "event", "event": event})

        def send_result(self, message_id: int) -> None:
            self.results.append(message_id)

        def send_error(self, *args: Any) -> None:
            self.errors.append(args)

    connection = _Connection()
    handler(
        hass,
        connection,
        {"id": 7, "type": f"{DOMAIN}/subscribe_sync", "config_entry_id": "entry-1"},
    )

    signal_one = f"{SIGNAL_SYNC_COMPLETED}_entry-1"
    signal_two = f"{SIGNAL_SYNC_COMPLETED}_entry-2"
    second_connection = _Connection()
    handler(
        hass,
        second_connection,
        {"id": 9, "type": f"{DOMAIN}/subscribe_sync", "config_entry_id": "entry-2"},
    )

    assert set(connected) == {signal_one, signal_two}
    assert connection.results == [7]
    assert second_connection.results == [9]
    assert connection.errors == []
    assert 7 in connection.subscriptions
    assert 9 in second_connection.subscriptions

    connected[signal_one][0]()
    assert connection.messages == [{"id": 7, "type": "event", "event": {}}]
    assert second_connection.messages == []
    connected[signal_two][0]()
    assert second_connection.messages == [{"id": 9, "type": "event", "event": {}}]
    assert "wines" not in str(connection.messages + second_connection.messages)

    connection.subscriptions[7]()
    second_connection.subscriptions[9]()
    assert connected == {}


def test_sync_websocket_subscription_rejects_unloaded_entry() -> None:
    """A client cannot subscribe to a missing or unloaded configuration entry."""
    hass = SimpleNamespace(
        services=_Services(),
        http=_HTTP(),
        websocket_api=_WebSocketAPI(),
        config_entries=SimpleNamespace(async_get_entry=lambda _entry_id: None),
    )
    asyncio.run(async_setup(hass, {}))
    connection = SimpleNamespace(
        subscriptions={},
        send_message=lambda _message: None,
        send_result=lambda _message_id: None,
        send_error=lambda *args: errors.append(args),
    )
    errors: list[tuple[Any, ...]] = []

    hass.data["websocket_api"][f"{DOMAIN}/subscribe_sync"][0](
        hass,
        connection,
        {"id": 8, "type": f"{DOMAIN}/subscribe_sync", "config_entry_id": "missing"},
    )

    assert errors
    assert connection.subscriptions == {}


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



def test_inventory_service_dispatches_to_the_selected_config_entry() -> None:
    """Two configured accounts return data from their own coordinator only."""
    first_coordinator = _Coordinator()
    first_coordinator.data = Cellar(
        racks={"rack-a": Rack(id="rack-a", name="First cellar")}
    )
    second_coordinator = _Coordinator()
    second_coordinator.data = Cellar(
        racks={
            "rack-b": Rack(id="rack-b", name="Second cellar"),
            "rack-c": Rack(id="rack-c", name="Second cellar 2"),
        }
    )
    entries = {
        "entry-1": SimpleNamespace(
            domain=DOMAIN,
            state=ConfigEntryState.LOADED,
            runtime_data=first_coordinator,
        ),
        "entry-2": SimpleNamespace(
            domain=DOMAIN,
            state=ConfigEntryState.LOADED,
            runtime_data=second_coordinator,
        ),
    }
    hass = SimpleNamespace(
        services=_Services(),
        http=_HTTP(),
        config_entries=SimpleNamespace(async_get_entry=entries.get),
    )
    asyncio.run(async_setup(hass, {}))

    def get_inventory(entry_id: str) -> dict[str, Any]:
        """Call the response service for one selected config entry."""
        return asyncio.run(
            hass.services.handlers[SERVICE_GET_INVENTORY](
                SimpleNamespace(
                    data={
                        "config_entry_id": entry_id,
                        "search": "",
                        "color": "",
                    }
                )
            )
        )

    first_response = get_inventory("entry-1")
    second_response = get_inventory("entry-2")

    assert first_response["rack_count"] == 1
    assert first_response["racks"] == [
        {"id": "rack-a", "name": "First cellar"}
    ]
    assert second_response["rack_count"] == 2
    assert second_response["racks"] == [
        {"id": "rack-b", "name": "Second cellar"},
        {"id": "rack-c", "name": "Second cellar 2"},
    ]


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



def test_remove_entry_deletes_its_image_cache(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Deleting a config entry removes only its own integration cache."""
    cache_root = tmp_path / ".storage" / DOMAIN / "entry-1"
    image_directory = cache_root / "images"
    image_directory.mkdir(parents=True)
    (image_directory / "cached.jpg").write_bytes(b"image")

    async def add_executor_job(function: Any, *args: Any) -> Any:
        return function(*args)

    hass = SimpleNamespace(
        config=SimpleNamespace(
            path=lambda *parts: str(tmp_path.joinpath(*parts))
        ),
        async_add_executor_job=add_executor_job,
    )
    entry = SimpleNamespace(entry_id="entry-1")

    removed_stores: list[tuple[int, str, bool]] = []

    class _FakeStore:
        def __init__(
            self, hass: Any, version: int, key: str, *, atomic_writes: bool
        ) -> None:
            removed_stores.append((version, key, atomic_writes))

        async def async_remove(self) -> None:
            return None

    import ploc_cellar as integration

    monkeypatch.setattr(integration, "Store", _FakeStore)
    asyncio.run(async_remove_entry(hass, entry))

    assert removed_stores == [(STORAGE_VERSION, f"{STORAGE_KEY}.entry-1", True)]
    assert not cache_root.exists()
