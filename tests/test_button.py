"""Tests for manual PLOUD synchronization buttons."""
from __future__ import annotations

import asyncio
from typing import cast

from ploc_cellar.button import BUTTON_DESCRIPTIONS, PlocCellarSyncButton
from ploc_cellar.coordinator import PlocCellarCoordinator
from ploc_cellar.models import Cellar


class _FakeCoordinator:
    """Record manual synchronization calls."""

    def __init__(self) -> None:
        """Initialize the call history."""
        self.calls: list[str] = []

    async def async_force_sync(self) -> Cellar:
        """Record the partial synchronization request."""
        self.calls.append("partial")
        return Cellar()

    async def async_force_full_sync(self) -> Cellar:
        """Record the complete synchronization request."""
        self.calls.append("full")
        return Cellar()


def test_manual_buttons_call_the_matching_coordinator_methods() -> None:
    """Each button invokes only its corresponding coordinator operation."""
    fake = _FakeCoordinator()
    coordinator = cast(PlocCellarCoordinator, fake)
    buttons = [
        PlocCellarSyncButton(coordinator, description)
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
    assert [button.entity_id for button in buttons] == [
        "button.ploc_cellar_sync",
        "button.ploc_cellar_sync_full",
    ]

    asyncio.run(buttons[0].async_press())
    assert fake.calls == ["partial"]

    asyncio.run(buttons[1].async_press())
    assert fake.calls == ["partial", "full"]
