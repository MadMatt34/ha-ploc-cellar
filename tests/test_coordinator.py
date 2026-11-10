"""Coordinator recovery and transactional storage regression tests."""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any, cast

import pytest
from homeassistant.exceptions import (
    ConfigEntryAuthFailed,
    HomeAssistantError,
)
from ploc_cellar import coordinator as coordinator_module
from ploc_cellar.const import EVENT_SYNC_COMPLETED
from ploc_cellar.coordinator import (
    PlocCellarCoordinator,
    UpdateFailed,
    _build_sync_changes,
    _validate_full_sync,
)
from ploc_cellar.models import Cellar, JsonValue, Rack, RackItem
from ploc_cellar.ploud import PloudAuthError, PLOUDCollections, PloudError


class _FakeStore:
    """Minimal asynchronous Store double with controllable read-back data."""

    def __init__(self) -> None:
        self.saved: dict[str, JsonValue] | None = None
        self.read_back: dict[str, JsonValue] | None = None
        self.save_error: Exception | None = None

    async def async_save(self, data: dict[str, JsonValue]) -> None:
        """Save a snapshot or raise the configured write error."""
        if self.save_error is not None:
            raise self.save_error
        self.saved = data
        if self.read_back is None:
            self.read_back = data

    async def async_load(self) -> dict[str, JsonValue] | None:
        """Return the configured persisted snapshot."""
        return self.read_back


class _FakeBus:
    """Capture Home Assistant events fired by the coordinator."""

    def __init__(self) -> None:
        self.events: list[tuple[str, dict[str, Any]]] = []

    def async_fire(self, event_type: str, event_data: dict[str, Any]) -> None:
        """Record an event and its payload."""
        self.events.append((event_type, event_data))


def _coordinator(cellar: Cellar, store: _FakeStore) -> PlocCellarCoordinator:
    """Create a coordinator with only the dependencies used by tested methods."""
    coordinator = object.__new__(PlocCellarCoordinator)
    hass = type("FakeHass", (), {"is_stopping": False})()
    hass.bus = _FakeBus()
    coordinator.hass = cast(Any, hass)
    coordinator.store = cast(Any, store)
    coordinator.cellar = cellar
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


def test_verified_save_rejects_mismatched_read_back() -> None:
    """A write is not committed when Store read-back differs from its payload."""
    store = _FakeStore()
    store.read_back = {"different": True}
    coordinator = _coordinator(Cellar(), store)
    payload: dict[str, JsonValue] = {"expected": True}

    with pytest.raises(HomeAssistantError, match="could not be verified"):
        asyncio.run(coordinator._async_save_verified(payload))

    assert store.saved == payload


def test_verified_save_rejects_write_error() -> None:
    """Store write errors propagate to the caller."""
    store = _FakeStore()
    store.save_error = OSError("disk full")
    coordinator = _coordinator(Cellar(), store)

    with pytest.raises(OSError, match="disk full"):
        asyncio.run(coordinator._async_save_verified({"cursor": 2}))


def test_incremental_orphan_recovery_commits_only_full_snapshot(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """An unresolved delta reference is discarded and replaced by a full snapshot."""
    cellar = Cellar(
        cursor=123,
        initialized=True,
        stock_reconstruction_complete=True,
        rack_items={
            "orphan-slot": RackItem(
                id="orphan-slot",
                rack_id="missing-rack",
                wine_id="",
                row=1,
                column=1,
            )
        },
    )
    store = _FakeStore()
    coordinator = _coordinator(cellar, store)
    calls: list[int] = []
    full_snapshot: PLOUDCollections = {
        "Wines": [],
        "Racks": [],
        "RackItems": [],
        "Orders": [],
        "Owners": [],
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
        """Return an empty delta followed by an authoritative full snapshot."""
        calls.append(cursor)
        if cursor == 1:
            return full_snapshot, 456
        return {}, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert calls == [123, 1]
    assert updated.rack_items == {}
    assert updated.cursor == 456
    assert updated.stock_reconstruction_complete is True
    assert coordinator.cellar is updated
    assert coordinator._force_full_sync is False
    assert store.saved == updated.to_storage()


def test_failed_full_recovery_keeps_previous_model_and_forces_retry(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A failed fallback never publishes the partial delta candidate."""
    original = Cellar(
        cursor=123,
        initialized=True,
        stock_reconstruction_complete=True,
        rack_items={
            "orphan-slot": RackItem(
                id="orphan-slot",
                rack_id="missing-rack",
                wine_id="",
                row=1,
                column=1,
            )
        },
    )
    store = _FakeStore()
    coordinator = _coordinator(original, store)
    calls = 0

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        """Fail the full-sync recovery after returning the initial delta."""
        nonlocal calls
        calls += 1
        if cursor == 1:
            raise PloudError("full snapshot unavailable")
        return {}, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(UpdateFailed, match="full snapshot unavailable"):
        asyncio.run(coordinator._async_update_data())

    assert calls == 2
    assert coordinator.cellar is original
    assert coordinator.cellar.cursor == 123
    assert coordinator._force_full_sync is True
    assert store.saved is None



@pytest.mark.parametrize(
    "objects",
    [
        {},
        {"Wines": [], "Racks": [], "RackItems": [], "Orders": []},
        {"Wines": [], "Racks": [], "RackItems": [], "Owners": []},
    ],
)
def test_full_snapshot_requires_every_authoritative_collection(
    objects: PLOUDCollections,
) -> None:
    """A full snapshot is rejected when any stock-bearing collection is absent."""
    with pytest.raises(PloudError, match="missing one or more"):
        _validate_full_sync(objects)


def test_full_snapshot_accepts_all_required_collections() -> None:
    """An empty but complete snapshot is valid and distinct from a delta."""
    _validate_full_sync(
        {
            "Wines": [],
            "Racks": [],
            "RackItems": [],
            "Orders": [],
            "Owners": [],
        }
    )


def test_manual_partial_sync_reports_failed_refresh() -> None:
    """A failed coordinator refresh becomes a service-visible HA error."""
    coordinator = object.__new__(PlocCellarCoordinator)
    coordinator.last_update_success = False
    coordinator.last_exception = RuntimeError("PLOUD unavailable")
    coordinator._sync_trigger = "recurring"

    async def fake_refresh() -> None:
        assert coordinator._sync_trigger == "forced_incremental"

    coordinator.async_refresh = fake_refresh

    with pytest.raises(HomeAssistantError):
        asyncio.run(coordinator.async_force_sync())

    assert coordinator._sync_trigger == "recurring"


def test_manual_full_sync_retries_until_complete_snapshot() -> None:
    """The full-sync request remains active until the coordinator commits it."""
    coordinator = object.__new__(PlocCellarCoordinator)
    coordinator._force_full_sync = True
    coordinator._sync_trigger = "recurring"
    coordinator.last_update_success = True
    coordinator.last_exception = None
    coordinator.data = Cellar()
    calls = 0

    async def fake_refresh() -> None:
        nonlocal calls
        assert coordinator._sync_trigger == "forced_full"
        calls += 1
        coordinator._force_full_sync = False

    coordinator.async_refresh = fake_refresh

    result = asyncio.run(coordinator.async_force_full_sync())

    assert calls == 1
    assert result is coordinator.data
    assert coordinator._force_full_sync is False



def test_full_sync_commits_only_a_complete_snapshot(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A valid full snapshot rebuilds the model and advances its cursor."""
    original = Cellar(cursor=123, initialized=True)
    store = _FakeStore()
    coordinator = _coordinator(original, store)
    coordinator._force_full_sync = True
    snapshot: PLOUDCollections = {
        "Wines": [],
        "Racks": [],
        "RackItems": [],
        "Orders": [],
        "Owners": [],
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
        assert cursor == 1
        return snapshot, 456

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert updated is coordinator.cellar
    assert updated.cursor == 456
    assert updated.initialized is True
    assert updated.stock_reconstruction_complete is True
    assert updated.stale is False
    assert updated.last_sync is not None
    assert store.saved == updated.to_storage()
    assert coordinator.hass.bus.events == [
        (
            EVENT_SYNC_COMPLETED,
            {
                "config_entry_id": "test-entry",
                "last_sync": updated.last_sync,
                "trigger": "recurring",
                "sync_type": "full",
                "changes": {
                    "wines": {"added": [], "updated": [], "deleted": []},
                    "racks": {"added": [], "updated": [], "deleted": []},
                    "rack_items": {"added": [], "updated": [], "deleted": []},
                    "orders": {"added": [], "updated": [], "deleted": []},
                },
                "change_counts": {
                    "wines": {"added": 0, "updated": 0, "deleted": 0},
                    "racks": {"added": 0, "updated": 0, "deleted": 0},
                    "rack_items": {"added": 0, "updated": 0, "deleted": 0},
                    "orders": {"added": 0, "updated": 0, "deleted": 0},
                },
            },
        )
    ]


def test_image_cache_is_not_pruned_when_inventory_persistence_fails(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """An uncommitted candidate must never trigger destructive image cleanup."""
    original = Cellar(cursor=123, initialized=True)
    store = _FakeStore()
    store.save_error = OSError("disk full")
    coordinator = _coordinator(original, store)
    coordinator._force_full_sync = True
    snapshot: PLOUDCollections = {
        "Wines": [],
        "Racks": [],
        "RackItems": [],
        "Orders": [],
        "Owners": [],
    }
    image_sync_called = False

    async def fake_sync(*args: Any, **kwargs: Any) -> tuple[PLOUDCollections, int]:
        return snapshot, 456

    async def fake_image_sync(*args: Any, **kwargs: Any) -> None:
        nonlocal image_sync_called
        image_sync_called = True

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)
    monkeypatch.setattr(coordinator_module, "async_sync_images", fake_image_sync)

    with pytest.raises(UpdateFailed, match="disk full"):
        asyncio.run(coordinator._async_update_data())

    assert image_sync_called is False
    assert coordinator.cellar is original


def test_unexpected_image_cache_error_does_not_invalidate_committed_inventory(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Image-cache failures cannot turn a verified inventory commit into a failure."""
    original = Cellar(cursor=123, initialized=True)
    store = _FakeStore()
    coordinator = _coordinator(original, store)
    coordinator._force_full_sync = True
    snapshot: PLOUDCollections = {
        "Wines": [],
        "Racks": [],
        "RackItems": [],
        "Orders": [],
        "Owners": [],
    }

    async def fake_sync(*args: Any, **kwargs: Any) -> tuple[PLOUDCollections, int]:
        return snapshot, 456

    async def failing_image_sync(*args: Any, **kwargs: Any) -> None:
        raise RuntimeError("unexpected cache failure")

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)
    monkeypatch.setattr(coordinator_module, "async_sync_images", failing_image_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert updated is coordinator.cellar
    assert updated.stale is False
    assert updated.cursor == 456
    assert store.saved == updated.to_storage()


def test_partial_sync_commits_delta_and_preserves_reconstruction_state(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A valid delta advances the cursor without downgrading stock completeness."""
    original = Cellar(
        cursor=123,
        initialized=True,
        stock_reconstruction_complete=True,
    )
    store = _FakeStore()
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
        assert cursor == 123
        return {}, 124

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    updated = asyncio.run(coordinator._async_update_data())

    assert updated.cursor == 124
    assert updated.stock_reconstruction_complete is True
    assert updated.stale is False
    assert coordinator.cellar is updated
    assert store.saved == updated.to_storage()
    assert coordinator.hass.bus.events == [
        (
            EVENT_SYNC_COMPLETED,
            {
                "config_entry_id": "test-entry",
                "last_sync": updated.last_sync,
                "trigger": "recurring",
                "sync_type": "incremental",
                "changes": {
                    "wines": {"added": [], "updated": [], "deleted": []},
                    "racks": {"added": [], "updated": [], "deleted": []},
                    "rack_items": {"added": [], "updated": [], "deleted": []},
                    "orders": {"added": [], "updated": [], "deleted": []},
                },
                "change_counts": {
                    "wines": {"added": 0, "updated": 0, "deleted": 0},
                    "racks": {"added": 0, "updated": 0, "deleted": 0},
                    "rack_items": {"added": 0, "updated": 0, "deleted": 0},
                    "orders": {"added": 0, "updated": 0, "deleted": 0},
                },
            },
        )
    ]


def test_invalid_full_snapshot_does_not_replace_cached_model(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A malformed full snapshot leaves the validated cache and cursor intact."""
    original = Cellar(cursor=123, initialized=True, stale=False)
    store = _FakeStore()
    coordinator = _coordinator(original, store)
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
        assert cursor == 1
        return {"Wines": []}, 456

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(UpdateFailed, match="missing one or more"):
        asyncio.run(coordinator._async_update_data())

    assert coordinator.cellar is original
    assert coordinator.cellar.cursor == 123
    assert coordinator.cellar.stale is True
    assert store.saved is None


def test_authentication_failure_requests_config_entry_reauth(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """An expired PLOUD token is surfaced as a Home Assistant auth failure."""
    original = Cellar(cursor=123, initialized=True)
    coordinator = _coordinator(original, _FakeStore())

    async def fake_sync(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        language: str,
        cursor: int,
    ) -> tuple[PLOUDCollections, int]:
        raise PloudAuthError("invalid access token")

    monkeypatch.setattr(coordinator_module, "async_sync", fake_sync)

    with pytest.raises(ConfigEntryAuthFailed):
        asyncio.run(coordinator._async_update_data())

    assert coordinator.cellar is original
    assert coordinator.cellar.stale is True


def test_sync_change_summary_detects_additions_updates_and_deletions() -> None:
    """The event diff compares committed object state, not received records."""
    before = Cellar(racks={
        "kept": Rack(id="kept", name="Before"),
        "removed": Rack(id="removed", name="Removed"),
    })
    after = Cellar(racks={
        "kept": Rack(id="kept", name="After"),
        "added": Rack(id="added", name="Added"),
    })

    assert _build_sync_changes(before, after)["racks"] == {
        "added": ["added"],
        "updated": ["kept"],
        "deleted": ["removed"],
    }