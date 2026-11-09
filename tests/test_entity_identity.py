"""Tests for stable per-config-entry device and entity identities."""
from __future__ import annotations

from types import SimpleNamespace
from typing import Any, cast

import pytest
from homeassistant.core import HomeAssistant
from ploc_cellar import entity as entity_module
from ploc_cellar.const import DOMAIN
from ploc_cellar.entity import get_entity_identity
from ploc_cellar.types import PlocCellarConfigEntry

LEGACY_IDENTIFIER = "ploc_cellar"


class _DeviceRegistry:
    """Expose a legacy device for identity migration tests."""

    def __init__(self, legacy_device: Any) -> None:
        self.legacy_device = legacy_device

    def async_get_device(
        self,
        identifiers: set[tuple[str, str]],
        connections: set[tuple[str, str]],
    ) -> Any:
        assert identifiers == {(DOMAIN, LEGACY_IDENTIFIER)}
        assert connections == set()
        return self.legacy_device


def test_existing_entry_keeps_legacy_device_and_entity_unique_ids(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """An installation already owning the legacy device keeps registry identity."""
    entry = SimpleNamespace(entry_id="legacy-entry", unique_id="legacy-uuid")
    registry = _DeviceRegistry(
        SimpleNamespace(config_entries={"legacy-entry"})
    )
    monkeypatch.setattr(
        entity_module,
        "async_get_device_registry",
        lambda hass: cast(Any, registry),
    )

    identity = get_entity_identity(cast(HomeAssistant, object()), cast(PlocCellarConfigEntry, entry))

    assert identity.device_info["identifiers"] == {
        (DOMAIN, LEGACY_IDENTIFIER)
    }
    assert identity.unique_id("ploc_cellar_summary") == "ploc_cellar_summary"


def test_additional_entry_gets_independent_device_and_entity_unique_ids(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A second entry cannot collide with the existing entry's registry IDs."""
    entry = SimpleNamespace(entry_id="second-entry", unique_id="second-device-uuid")
    registry = _DeviceRegistry(
        SimpleNamespace(config_entries={"legacy-entry"})
    )
    monkeypatch.setattr(
        entity_module,
        "async_get_device_registry",
        lambda hass: cast(Any, registry),
    )

    identity = get_entity_identity(
        cast(HomeAssistant, object()), cast(PlocCellarConfigEntry, entry)
    )

    assert identity.device_info["identifiers"] == {
        (DOMAIN, "second-device-uuid")
    }
    assert identity.unique_id("ploc_cellar_summary") == (
        "ploc_cellar_summary_second-device-uuid"
    )


def test_first_entry_on_a_new_installation_uses_its_own_identity(
    monkeypatch,
) -> None:
    """A fresh installation does not claim the legacy identity."""
    entry = SimpleNamespace(entry_id="first-entry", unique_id="first-device-uuid")
    monkeypatch.setattr(
        entity_module,
        "async_get_device_registry",
        lambda hass: cast(Any, _DeviceRegistry(None)),
    )

    identity = get_entity_identity(object(), entry)

    assert identity.device_info["identifiers"] == {
        (DOMAIN, "first-device-uuid")
    }
    assert identity.unique_id("ploc_cellar_summary") == (
        "ploc_cellar_summary_first-device-uuid"
    )
