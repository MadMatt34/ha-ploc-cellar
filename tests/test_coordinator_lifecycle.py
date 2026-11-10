"""Lifecycle and recovery tests for the PLOUD coordinator."""
from __future__ import annotations

import asyncio
import hashlib
from copy import deepcopy
from datetime import timedelta
from pathlib import Path
from typing import Any, cast

import pytest
from homeassistant.exceptions import HomeAssistantError
from ploc_cellar import coordinator as coordinator_module
from ploc_cellar.const import CELLAR_DATA_VERSION, DOMAIN
from ploc_cellar.coordinator import PlocCellarCoordinator, UpdateFailed
from ploc_cellar.models import Cellar, JsonValue
from ploc_cellar.ploud import PLOUDCollections, PloudError


class _Store:
    """Controllable Store double for coordinator persistence boundaries."""

    def __init__(self, stored: dict[str, JsonValue] | None = None) -> None:
        self.stored = stored
        self.saved: dict[str, JsonValue] | None = None
        self.save_error: Exception | None = None
        self.on_save: Any = None
        self.on_load: Any = None

    async def async_save(self, data: dict[str, JsonValue]) -> None:
        if self.save_error is not None:
            raise self.save_error
        self.saved = deepcopy(data)
        self.stored = deepcopy(data)
        if self.on_save is not None:
            self.on_save()

    async def async_load(self) -> dict[str, JsonValue] | None:
        if self.on_load is not None:
            self.on_load()
        return deepcopy(self.stored)


class _FakeBus:
    """Capture Home Assistant events fired by the coordinator."""

    def __init__(self) -> None:
        self.events: list[tuple[str, dict[str, str | None]]] = []

    def async_fire(
        self,
        event_type: str,
        event_data: dict[str, str | None],
    ) -> None:
        self.events.append((event_type, event_data))


def _coordinator(
    cellar: Cellar | None = None,
    store: _Store | None = None,
) -> PlocCellarCoordinator:
    coordinator = object.__new__(PlocCellarCoordinator)
    fake_config = type(
        "FakeConfig",
        (),
        {"path": lambda self, *parts: str(Path("/tmp").joinpath(*parts))},
    )()
    hass = type(
        "FakeHass",
        (),
        {"is_stopping": False, "config": fake_config, "bus": _FakeBus()},
    )()
    coordinator.hass = cast(Any, hass)
    coordinator.store = cast(Any, store or _Store())
    coordinator.cellar = cellar or Cellar()
    coordinator._force_full_sync = False
    coordinator._sync_trigger = "recurring"
    coordinator.session = cast(Any, object())
    coordinator.entry_id = "test-entry"
    coordinator.image_directory = Path("/tmp/ploc-cellar-test-images")
    coordinator.server = "https://ploud.example"
    coordinator.token = "token"
    coordinator.device = "device"
    coordinator.language = "fr"
    return coordinator


def _empty_snapshot() -> PLOUDCollections:
    return {
        "Wines": [],
        "Racks": [],
        "RackItems": [],
        "Orders": [],
        "Owners": [],
    }


def test_verified_save_refuses_to_start_when_home_assistant_is_stopping() -> None:
    coordinator = _coordinator()
    coordinator.hass.is_stopping = True

    with pytest.raises(HomeAssistantError, match="is stopping"):
        asyncio.run(coordinator._async_save_verified({"cursor": 10}))

    assert coordinator.store.saved is None


def test_verified_save_checks_stopping_after_store_write() -> None:
    store = _Store()
    coordinator = _coordinator(store=store)
    store.on_save = lambda: setattr(coordinator.hass, "is_stopping", True)

    with pytest.raises(HomeAssistantError, match="write completed"):
        asyncio.run(coordinator._async_save_verified({"cursor": 10}))

    assert store.saved == {"cursor": 10}


def test_verified_save_checks_stopping_after_read_back() -> None:
    store = _Store()
    coordinator = _coordinator(store=store)
    store.on_load = lambda: setattr(coordinator.hass, "is_stopping", True)

    with pytest.raises(HomeAssistantError, match="verification completed"):
        asyncio.run(coordinator._async_save_verified({"cursor": 10}))


def test_load_without_saved_snapshot_keeps_empty_cellar() -> None:
    coordinator = _coordinator()

    asyncio.run(coordinator.async_load())

    assert coordinator.cellar.initialized is False
    assert coordinator._force_full_sync is False
    assert coordinator._sync_trigger == "recurring"


def test_load_restores_current_snapshot_without_rewriting_it() -> None:
    stored = Cellar(
        cursor=123,
        initialized=True,
        stock_reconstruction_complete=True,
    ).to_storage()
    coordinator = _coordinator(store=_Store(stored))

    asyncio.run(coordinator.async_load())

    assert coordinator.cellar.cursor == 123
    assert coordinator.cellar.initialized is True
    assert coordinator.store.saved is None


def test_load_migrates_legacy_snapshot_and_persists_current_schema() -> None:
    stored = Cellar(cursor=123, initialized=True).to_storage()
    stored["version"] = 5
    store = _Store(stored)
    coordinator = _coordinator(store=store)

    asyncio.run(coordinator.async_load())

    assert coordinator.cellar.cursor == 1
    assert coordinator.cellar.initialized is True
    assert store.saved is not None
    assert store.saved["version"] == CELLAR_DATA_VERSION


def test_load_keeps_migrated_snapshot_when_rewrite_fails() -> None:
    stored = Cellar(cursor=123, initialized=True).to_storage()
    stored["version"] = 5
    store = _Store(stored)
    store.save_error = OSError("disk is read-only")
    coordinator = _coordinator(store=store)

    asyncio.run(coordinator.async_load())

    assert coordinator.cellar.initialized is True
    assert coordinator.store.saved is None


def test_load_with_invalid_known_snapshot_forces_full_recovery() -> None:
    coordinator = _coordinator(store=_Store({"version": CELLAR_DATA_VERSION}))

    asyncio.run(coordinator.async_load())

    assert coordinator.cellar.stale is True
    assert coordinator.cellar.initialized is False
    assert coordinator._force_full_sync is True
    assert coordinator.store.saved is None


def test_load_wraps_unsupported_or_unreadable_storage() -> None:
    coordinator = _coordinator(store=_Store({"version": 999}))

    with pytest.raises(HomeAssistantError) as err:
        asyncio.run(coordinator.async_load())

    assert err.value.translation_key == "invalid_storage"


def test_incomplete_delta_is_discarded_before_full_snapshot_recovery(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    original = Cellar(cursor=123, initialized=True, stock_reconstruction_complete=True)
    coordinator = _coordinator(original)
    calls: list[int] = []

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        calls.append(cursor)
        if cursor == 1:
            return _empty_snapshot(), 456
        return {"Wines": [{"id": "new-wine", "bottles": 2}]}, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert calls == [123, 1]
    assert updated.wines == {}
    assert updated.cursor == 456
    assert updated.stock_reconstruction_complete is True
    assert coordinator._force_full_sync is False
    assert coordinator.store.saved == updated.to_storage()


def test_unresolved_owner_in_delta_triggers_authoritative_snapshot(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    original = Cellar(cursor=123, initialized=True)
    coordinator = _coordinator(original)
    calls: list[int] = []

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        calls.append(cursor)
        if cursor == 1:
            return _empty_snapshot(), 456
        return {
            "Wines": [
                {
                    "id": "wine-1",
                    "name": "Vin test",
                    "bottles": 1,
                    "owner_id": "owner-not-in-delta",
                }
            ]
        }, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert calls == [123, 1]
    assert updated.wines == {}
    assert updated.cursor == 456
    assert coordinator.store.saved == updated.to_storage()


def test_full_snapshot_with_incomplete_wine_is_rejected(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    original = Cellar(cursor=123, initialized=True)
    coordinator = _coordinator(original)
    coordinator._force_full_sync = True

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        return (
            {
                **_empty_snapshot(),
                "Wines": [{"id": "wine-1", "bottles": 1}],
            },
            456,
        )

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(UpdateFailed, match="incomplete records"):
        asyncio.run(coordinator._async_update_data())

    assert coordinator.cellar is original
    assert coordinator.cellar.stale is True
    assert coordinator.store.saved is None
    assert coordinator._force_full_sync is True


def test_full_snapshot_with_unknown_rack_reference_is_rejected(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    coordinator = _coordinator()
    coordinator._force_full_sync = True

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        return (
            {
                **_empty_snapshot(),
                "RackItems": [{"id": "slot-1", "rk": "missing-rack", "wi": ""}],
            },
            456,
        )

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(UpdateFailed, match="unresolved RackItem references"):
        asyncio.run(coordinator._async_update_data())

    assert coordinator.cellar.stale is True
    assert coordinator.store.saved is None


def test_full_snapshot_with_unresolved_owner_is_committed_with_warning(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    coordinator = _coordinator()
    coordinator._force_full_sync = True
    snapshot = {
        **_empty_snapshot(),
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin sans domaine résolu",
                "bottles": 0,
                "owner_id": "owner-1",
            }
        ],
        "Owners": [{"id": "owner-1"}],
    }

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        return snapshot, 456

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert updated.wines["wine-1"].domain is None
    assert updated.cursor == 456
    assert updated.stale is False
    assert coordinator._force_full_sync is False


def test_storage_failure_does_not_publish_candidate_cellar(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    original = Cellar(cursor=123, initialized=True)
    store = _Store()
    store.save_error = OSError("disk full")
    coordinator = _coordinator(original, store)

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        return {}, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(UpdateFailed, match="disk full"):
        asyncio.run(coordinator._async_update_data())

    assert coordinator.cellar is original
    assert coordinator.cellar.cursor == 123
    assert coordinator.cellar.stale is True


def test_unexpected_model_failure_is_logged_and_propagated(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    original = Cellar(cursor=123, initialized=True)
    coordinator = _coordinator(original)

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        return {}, 124

    def fail_apply(
        cellar: Cellar,
        objects: PLOUDCollections,
        next_cursor: int,
        *,
        full_snapshot: bool = False,
    ) -> set[str]:
        raise RuntimeError("unexpected parser failure")

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)
    monkeypatch.setattr(coordinator_module, "apply_sync", fail_apply)

    with pytest.raises(RuntimeError, match="unexpected parser failure"):
        asyncio.run(coordinator._async_update_data())

    assert coordinator.cellar is original
    assert coordinator.cellar.stale is True


def test_manual_full_sync_surfaces_failed_refresh() -> None:
    coordinator = _coordinator()
    coordinator.last_update_success = False
    coordinator.last_exception = PloudError("PLOUD unavailable")

    async def fake_refresh() -> None:
        return None

    coordinator.async_refresh = fake_refresh

    with pytest.raises(HomeAssistantError) as err:
        asyncio.run(coordinator.async_force_full_sync())

    assert err.value.translation_key == "sync_failed"
    assert coordinator._force_full_sync is True


def test_manual_partial_sync_returns_latest_data_after_success() -> None:
    coordinator = _coordinator()
    expected = Cellar(cursor=456)
    coordinator.last_update_success = True
    coordinator.data = expected

    async def fake_refresh() -> None:
        return None

    coordinator.async_refresh = fake_refresh

    assert asyncio.run(coordinator.async_force_sync()) is expected


def test_coordinator_initializes_ha_refresh_and_entry_storage(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Construction wires the HA coordinator and entry-scoped atomic Store."""
    captured: dict[str, Any] = {}
    store = _Store()

    def fake_base_init(self: Any, hass: Any, **kwargs: Any) -> None:
        captured["hass"] = hass
        captured["base_kwargs"] = kwargs

    def fake_store(
        hass: Any,
        version: int,
        key: str,
        *,
        atomic_writes: bool,
    ) -> _Store:
        captured["store_args"] = (hass, version, key, atomic_writes)
        return store

    monkeypatch.setattr(
        coordinator_module.DataUpdateCoordinator,
        "__init__",
        fake_base_init,
    )
    monkeypatch.setattr(coordinator_module, "Store", fake_store)
    fake_config = type(
        "FakeConfig",
        (),
        {"path": lambda self, *parts: str(Path("/tmp").joinpath(*parts))},
    )()
    hass = type(
        "FakeHass",
        (),
        {"is_stopping": False, "config": fake_config},
    )()
    entry = type("FakeEntry", (), {"entry_id": "entry-42"})()

    coordinator = PlocCellarCoordinator(
        cast(Any, hass),
        cast(Any, entry),
        cast(Any, object()),
        "https://ploud.example",
        "access-token",
        "device-identifier",
        "fr",
        timedelta(minutes=240),
    )

    assert captured["hass"] is hass
    assert captured["base_kwargs"]["name"] == DOMAIN
    assert captured["base_kwargs"]["update_interval"] == timedelta(minutes=240)
    assert captured["base_kwargs"]["always_update"] is False
    assert captured["store_args"] == (
        hass,
        coordinator_module.STORAGE_VERSION,
        f"{DOMAIN}.cellar.entry-42",
        True,
    )
    assert coordinator.store is store
    assert coordinator.cellar.initialized is False
    assert coordinator._force_full_sync is False


def test_incomplete_fallback_snapshot_is_rejected_without_committing_delta(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A malformed recovery snapshot cannot replace the last committed cellar."""
    original = Cellar(cursor=123, initialized=True)
    coordinator = _coordinator(original)
    calls: list[int] = []

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        calls.append(cursor)
        if cursor == 1:
            return {
                **_empty_snapshot(),
                "Wines": [{"id": "new-wine", "bottles": 1}],
            }, 456
        return {
            "Wines": [{"id": "new-wine", "bottles": 1}],
        }, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(UpdateFailed, match="incomplete records"):
        asyncio.run(coordinator._async_update_data())

    assert calls == [123, 1]
    assert coordinator.cellar is original
    assert coordinator.cellar.cursor == 123
    assert coordinator.cellar.stale is True
    assert coordinator._force_full_sync is True
    assert coordinator.store.saved is None



def test_image_url_changes_when_cached_document_version_changes(
    tmp_path: Path,
) -> None:
    """A changed document version produces a new frontend cache-busting URL."""
    coordinator = _coordinator()
    coordinator.image_directory = tmp_path
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    prefix = hashlib.sha256(document_id.encode()).hexdigest()

    first_image = tmp_path / f"{prefix}-first.jpg"
    first_image.write_bytes(b"\xff\xd8\xfffirst")
    first_url = coordinator.image_url(document_id)

    second_image = tmp_path / f"{prefix}-second.jpg"
    second_image.write_bytes(b"\xff\xd8\xffsecond")
    first_image.unlink()
    second_url = coordinator.image_url(document_id)

    assert first_url == (
        "/api/ploc_cellar/test-entry/images/"
        "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a?v=first.jpg"
    )
    assert second_url == (
        "/api/ploc_cellar/test-entry/images/"
        "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a?v=second.jpg"
    )
    assert first_url != second_url
