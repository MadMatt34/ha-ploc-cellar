"""Shared integration types."""
from __future__ import annotations

from typing import TYPE_CHECKING, NotRequired, TypedDict

from homeassistant.config_entries import ConfigEntry

if TYPE_CHECKING:
    from .coordinator import PlocCellarCoordinator

type PlocCellarConfigEntry = ConfigEntry["PlocCellarCoordinator"]


class GetInventoryServiceData(TypedDict):
    """Validated data for the inventory response action."""

    config_entry_id: str
    search: NotRequired[str]
    color: NotRequired[str]


class SyncServiceData(TypedDict):
    """Validated data for the synchronization action."""

    config_entry_id: str


class ConfigFlowUserInput(TypedDict):
    """Validated PLOC account credentials for initial setup."""

    email: str
    password: str


class ReauthFlowInput(TypedDict):
    """Validated PLOC account credentials for reauthentication."""

    email: str
    password: str


class OptionsFlowInput(TypedDict):
    """Validated options flow input."""

    scan_interval: int
    language: str
