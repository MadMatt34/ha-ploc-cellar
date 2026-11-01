"""Config and options flows for Ploc Cellar."""
from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlsplit

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import (
    ConfigEntry,
    OptionsFlowWithReload,
)
from homeassistant.core import callback

from .const import (
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_SERVER,
    CONF_TOKEN,
    DEFAULT_LANGUAGE,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MIN_SCAN_INTERVAL_MINUTES,
)


def _normalise_server(value: str) -> str | None:
    """Validate and normalize the PLOUD base URL."""
    server = value.strip().rstrip("/")
    try:
        parsed = urlsplit(server)
    except ValueError:
        return None
    if (
        parsed.scheme not in {"http", "https"}
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.query
        or parsed.fragment
    ):
        return None
    return server


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure one PLOUD device."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Set up a PLOUD connection."""
        if self._async_current_entries():
            return self.async_abort(reason="already_configured")

        errors: dict[str, str] = {}
        if user_input is not None:
            server = _normalise_server(user_input[CONF_SERVER])
            token = user_input[CONF_TOKEN].strip()
            device = user_input[CONF_DEVICE].strip()
            if server is None:
                errors["base"] = "invalid_server"
            elif not token:
                errors["base"] = "invalid_token"
            elif re.fullmatch(r"[A-Za-z0-9]{5}", device) is None:
                errors["base"] = "invalid_device"
            else:
                await self.async_set_unique_id(device)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="Ploc Cellar",
                    data={
                        CONF_SERVER: server,
                        CONF_TOKEN: token,
                        CONF_DEVICE: device,
                        CONF_LANGUAGE: user_input[CONF_LANGUAGE],
                    },
                )

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_SERVER, default="https://ploud.ploc.co/v1"
                ): str,
                vol.Required(CONF_TOKEN): str,
                vol.Required(CONF_DEVICE): str,
                vol.Required(
                    CONF_LANGUAGE, default=DEFAULT_LANGUAGE
                ): vol.In(["fr", "en"]),
            }
        )
        return self.async_show_form(
            step_id="user", data_schema=schema, errors=errors
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Change the PLOUD server without changing the device identity."""
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}
        if user_input is not None:
            server = _normalise_server(user_input[CONF_SERVER])
            if server is None:
                errors["base"] = "invalid_server"
            else:
                await self.async_set_unique_id(entry.unique_id)
                self._abort_if_unique_id_mismatch()
                return self.async_update_reload_and_abort(
                    entry, data_updates={CONF_SERVER: server}
                )

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_SERVER, default=entry.data[CONF_SERVER]
                    ): str
                }
            ),
            errors=errors,
        )

    async def async_step_reauth(
        self, entry_data: dict[str, Any]
    ) -> config_entries.ConfigFlowResult:
        """Start token renewal."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Replace an invalid PLOUD token."""
        entry = self._get_reauth_entry()
        if user_input is not None:
            token = user_input[CONF_TOKEN].strip()
            if not token:
                return self.async_show_form(
                    step_id="reauth_confirm",
                    data_schema=vol.Schema({vol.Required(CONF_TOKEN): str}),
                    errors={"base": "invalid_token"},
                )
            return self.async_update_reload_and_abort(
                entry, data_updates={CONF_TOKEN: token}
            )
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema({vol.Required(CONF_TOKEN): str}),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlowWithReload:
        """Create the options flow."""
        return PlocCellarOptionsFlow()


class PlocCellarOptionsFlow(OptionsFlowWithReload):
    """Configure polling and PLOUD response language."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Update the integration options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current_interval = self.config_entry.options.get(
            CONF_SCAN_INTERVAL, int(DEFAULT_SCAN_INTERVAL.total_seconds() // 60)
        )
        current_language = self.config_entry.options.get(
            CONF_LANGUAGE, self.config_entry.data.get(CONF_LANGUAGE, DEFAULT_LANGUAGE)
        )
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_SCAN_INTERVAL, default=current_interval
                ): vol.All(
                    vol.Coerce(int),
                    vol.Range(
                        min=MIN_SCAN_INTERVAL_MINUTES,
                        max=MAX_SCAN_INTERVAL_MINUTES,
                    ),
                ),
                vol.Required(
                    CONF_LANGUAGE, default=current_language
                ): vol.In(["fr", "en"]),
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
