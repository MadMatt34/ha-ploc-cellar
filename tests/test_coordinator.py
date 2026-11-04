"""Coordinator recovery and transactional storage regression tests."""
from __future__ import annotations

import asyncio
from typing import Any, cast

import pytest
from homeassistant.exceptions import HomeAssistantError
from ploc_cellar import coordinator as coordinator_module
from ploc_cellar.coordinator import PlocCellarCoordinator, UpdateFailed
from ploc_cellar.models import Cellar, JsonValue, RackItem
from ploc_cellar.ploud import PLOUDCollections, PloudError


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


def _coordinator(cellar: Cellar, store: _FakeStore) -> PlocCellarCoordinator:
    """Create a coordinator with only the dependencies used by tested methods."""
    coordinator = object.__new__(PlocCellarCoordinator)
    coordinator.hass = cast(Any, type("FakeHass", (), {"is_stopping": False})())
    coordinator.store = cast(Any, store)
    coordinator.cellar = cellar
    coordinator._force_full_sync = False
    coordinator.session = cast(Any, object())
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
