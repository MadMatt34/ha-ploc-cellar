"""Shared integration types."""
from __future__ import annotations

from typing import NotRequired, TypedDict

from homeassistant.config_entries import ConfigEntry

from .coordinator import PlocCellarCoordinator


type PlocCellarConfigEntry = ConfigEntry[PlocCellarCoordinator]


class GetInventoryServiceData(TypedDict):
    """Validated data for the inventory response action."""

    config_entry_id: str
    search: NotRequired[str]
    color: NotRequired[str]


class SyncServiceData(TypedDict):
    """Validated data for the synchronization action."""

    config_entry_id: str


class ConfigFlowUserInput(TypedDict):
    """Validated initial configuration flow input."""

    server: str
    token: str
    device: str
    language: str


class ReconfigureFlowInput(TypedDict):
    """Validated reconfiguration flow input."""

    server: str


class ReauthFlowInput(TypedDict):
    """Validated reauthentication flow input."""

    token: str


class OptionsFlowInput(TypedDict):
    """Validated options flow input."""

    scan_interval: int
    language: str
