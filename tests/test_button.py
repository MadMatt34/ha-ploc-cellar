"""Tests for manual PLOUD synchronization buttons."""
from __future__ import annotations

import asyncio
from typing import cast

import pytest
from homeassistant.helpers.device_registry import DeviceInfo
from ploc_cellar.button import BUTTON_DESCRIPTIONS, PlocCellarSyncButton
from ploc_cellar.coordinator import PlocCellarCoordinator
from ploc_cellar.entity import PlocCellarEntityIdentity
from ploc_cellar.models import Cellar


def _identity() -> PlocCellarEntityIdentity:
    """Build a legacy identity for direct entity tests."""
    return PlocCellarEntityIdentity(
        device_info=DeviceInfo(
            identifiers={("ploc_cellar", "ploc_cellar")},
            translation_key="cellar",
            manufacturer="PLOC",
        ),
        unique_id_suffix=None,
    )


class _FakeCoordinator:
    """Record manual synchronization calls."""

    def __init__(self) -> None:
        """Initialize the call history."""
        self.calls: list[str] = []
        self.failure: Exception | None = None

    async def async_force_sync(self) -> Cellar:
        """Record the differential synchronization request."""
        self.calls.append("differential")
        if self.failure is not None:
            raise self.failure
        return Cellar()

    async def async_force_full_sync(self) -> Cellar:
        """Record the complete synchronization request."""
        self.calls.append("full")
        if self.failure is not None:
            raise self.failure
        return Cellar()


def test_manual_buttons_call_the_matching_coordinator_methods() -> None:
    """Each button invokes only its corresponding coordinator operation."""
    fake = _FakeCoordinator()
    coordinator = cast(PlocCellarCoordinator, fake)
    buttons = [
        PlocCellarSyncButton(coordinator, description, _identity())
        for description in BUTTON_DESCRIPTIONS
    ]

    assert [button.translation_key for button in buttons] == [
        "sync",
        "sync_full",
    ]
    assert [button.unique_id for button in buttons] == [
        "ploc_cellar_sync",
        "ploc_cellar_sync_full",
    ]
    # Home Assistant generates entity IDs from the current naming settings.
    assert all(button.entity_id is None for button in buttons)

    asyncio.run(buttons[0].async_press())
    assert fake.calls == ["differential"]

    asyncio.run(buttons[1].async_press())
    assert fake.calls == ["differential", "full"]


def test_manual_button_propagates_synchronization_failure() -> None:
    """Synchronization errors are not swallowed by a button press."""
    fake = _FakeCoordinator()
    fake.failure = RuntimeError("PLOUD unavailable")
    button = PlocCellarSyncButton(
        cast(PlocCellarCoordinator, fake), BUTTON_DESCRIPTIONS[0], _identity()
    )

    with pytest.raises(RuntimeError, match="PLOUD unavailable"):
        asyncio.run(button.async_press())
