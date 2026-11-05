"""Functional tests for PLOC config-flow authentication and reauthentication."""
from __future__ import annotations

import asyncio
from types import SimpleNamespace
from typing import Any
from uuid import UUID

import pytest

from ploc_cellar import config_flow as flow_module
from ploc_cellar.config_flow import ConfigFlow
from ploc_cellar.const import CONF_DEVICE, CONF_TOKEN
from ploc_cellar.auth import PlocAuthError, PlocConnectionError


def _new_flow() -> ConfigFlow:
    """Create a flow handler with the minimum Home Assistant context."""
    flow = ConfigFlow()
    flow.hass = SimpleNamespace(
        config=SimpleNamespace(country="FR", language="fr")
    )
    return flow


def _patch_form(monkeypatch: pytest.MonkeyPatch) -> None:
    """Replace the HA form renderer with a deterministic result."""
    monkeypatch.setattr(
        ConfigFlow,
        "async_show_form",
        lambda self, **kwargs: {"type": "form", **kwargs},
    )
    monkeypatch.setattr(
        ConfigFlow,
        "_async_current_entries",
        lambda self: [],
    )


def test_user_step_rejects_invalid_email_without_authentication(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Invalid account email is rejected before creating an HTTP session."""
    _patch_form(monkeypatch)
    monkeypatch.setattr(
        flow_module,
        "async_authenticate",
        lambda *args: pytest.fail("authentication must not run"),
    )

    result = asyncio.run(
        _new_flow().async_step_user(
            {"username": "not-an-email", "password": "secret"}
        )
    )

    assert result["step_id"] == "user"
    assert result["errors"] == {"username": "invalid_email"}


@pytest.mark.parametrize(
    ("error", "expected"),
    [
        (PlocAuthError("invalid credentials"), "invalid_auth"),
        (PlocConnectionError("offline"), "cannot_connect"),
    ],
)
def test_user_step_reports_authentication_failures(
    monkeypatch: pytest.MonkeyPatch,
    error: Exception,
    expected: str,
) -> None:
    """Authentication and connectivity failures map to distinct form errors."""
    _patch_form(monkeypatch)

    async def fail_authentication(*args: Any) -> str:
        raise error

    monkeypatch.setattr(flow_module, "async_authenticate", fail_authentication)
    monkeypatch.setattr(flow_module, "async_get_clientsession", lambda hass: object())

    result = asyncio.run(
        _new_flow().async_step_user(
            {"username": "user@example.com", "password": "secret"}
        )
    )

    assert result["errors"] == {"base": expected}


def test_user_step_creates_entry_with_generated_device_uuid(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Successful setup stores the PLOUD token and a generated full UUID."""
    _patch_form(monkeypatch)
    expected_device = UUID("12345678-1234-5678-1234-567812345678")
    monkeypatch.setattr(flow_module, "uuid4", lambda: expected_device)
    monkeypatch.setattr(flow_module, "async_get_clientsession", lambda hass: object())

    async def authenticate(*args: Any) -> str:
        assert args[1] == "user@example.com"
        assert args[3] == "fr"
        return "ploud-access-token"

    async def set_unique_id(self: ConfigFlow, unique_id: str) -> None:
        self.unique_id = unique_id

    monkeypatch.setattr(flow_module, "async_authenticate", authenticate)
    monkeypatch.setattr(ConfigFlow, "async_set_unique_id", set_unique_id)
    monkeypatch.setattr(ConfigFlow, "_abort_if_unique_id_configured", lambda self: None)
    monkeypatch.setattr(
        ConfigFlow,
        "async_create_entry",
        lambda self, *, title, data: {"title": title, "data": data},
    )

    result = asyncio.run(
        _new_flow().async_step_user(
            {"username": "user@example.com", "password": "secret"}
        )
    )

    assert result == {
        "title": "Ploc Cellar",
        "data": {
            CONF_TOKEN: "ploud-access-token",
            CONF_DEVICE: str(expected_device),
        },
    }


def test_user_step_aborts_when_already_configured(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """The one-config-entry rule is enforced before showing the form."""
    flow = _new_flow()
    monkeypatch.setattr(ConfigFlow, "_async_current_entries", lambda self: [object()])
    monkeypatch.setattr(
        ConfigFlow,
        "async_abort",
        lambda self, *, reason: {"type": "abort", "reason": reason},
    )

    result = asyncio.run(flow.async_step_user())

    assert result == {"type": "abort", "reason": "already_configured"}


def test_reauthentication_step_reuses_existing_entry_and_language(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Reauthentication renews the token without creating a new device."""
    flow = _new_flow()
    entry = SimpleNamespace(
        unique_id="existing-device-uuid",
        options={"language": "en"},
    )
    monkeypatch.setattr(ConfigFlow, "_get_reauth_entry", lambda self: entry)
    monkeypatch.setattr(
        ConfigFlow,
        "async_set_unique_id",
        lambda self, unique_id: _async_noop(),
    )
    monkeypatch.setattr(ConfigFlow, "_abort_if_unique_id_mismatch", lambda self: None)
    monkeypatch.setattr(
        ConfigFlow,
        "async_show_form",
        lambda self, **kwargs: {"type": "form", **kwargs},
    )

    result = asyncio.run(flow.async_step_reauth({}))

    assert result["step_id"] == "reauth_confirm"


async def _async_noop() -> None:
    """Stand-in for Home Assistant's asynchronous unique-ID setter."""
    return None


def test_reauthentication_success_updates_only_the_access_token(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A successful reauthentication updates credentials on the existing entry."""
    flow = _new_flow()
    entry = SimpleNamespace(unique_id="existing-device", options={"language": "en"})
    monkeypatch.setattr(ConfigFlow, "_get_reauth_entry", lambda self: entry)
    monkeypatch.setattr(flow_module, "async_get_clientsession", lambda hass: object())

    async def authenticate(*args: Any) -> str:
        assert args[3] == "en"
        return "renewed-ploud-token"

    monkeypatch.setattr(flow_module, "async_authenticate", authenticate)
    monkeypatch.setattr(
        ConfigFlow,
        "async_update_reload_and_abort",
        lambda self, config_entry, *, data_updates: {
            "entry": config_entry,
            "updates": data_updates,
        },
    )

    result = asyncio.run(
        flow.async_step_reauth_confirm(
            {"username": "user@example.com", "password": "secret"}
        )
    )

    assert result["entry"] is entry
    assert result["updates"] == {CONF_TOKEN: "renewed-ploud-token"}
