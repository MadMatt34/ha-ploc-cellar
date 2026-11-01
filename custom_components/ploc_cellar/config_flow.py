"""Config and options flows for Ploc Cellar."""
from __future__ import annotations

from typing import Any, cast
from urllib.parse import urlsplit

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry, OptionsFlowWithReload
from homeassistant.core import callback

from .const import (
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_SERVER,
    CONF_TOKEN,
    DEFAULT_LANGUAGE,
    DEFAULT_SCAN_INTERVAL,
    DEVICE_ID_LENGTH,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MIN_SCAN_INTERVAL_MINUTES,
    PLOUD_DEFAULT_SERVER,
    SUPPORTED_LANGUAGES,
)
from .types import (
    ConfigFlowUserInput,
    OptionsFlowInput,
    ReauthFlowInput,
    ReconfigureFlowInput,
)


def _normalise_server(value: str) -> str | None:
    """Validate and normalize the PLOUD base URL."""
    server = value.strip().rstrip("/")
    try:
        parsed = urlsplit(server)
        _ = parsed.port
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
            validated_input = cast(ConfigFlowUserInput, user_input)
            server = _normalise_server(validated_input[CONF_SERVER])
            token = validated_input[CONF_TOKEN].strip()
            device = validated_input[CONF_DEVICE].strip()
            if server is None:
                errors["base"] = "invalid_server"
            elif not token:
                errors["base"] = "invalid_token"
            elif len(device) != DEVICE_ID_LENGTH:
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
                        CONF_LANGUAGE: validated_input[CONF_LANGUAGE],
                    },
                )

        schema = cast(
            Any,
            vol.Schema(
                {
                    vol.Required(
                        CONF_SERVER,
                        default=PLOUD_DEFAULT_SERVER,
                    ): str,
                    vol.Required(CONF_TOKEN): str,
                    vol.Required(CONF_DEVICE): str,
                    vol.Required(
                        CONF_LANGUAGE,
                        default=DEFAULT_LANGUAGE,
                    ): vol.In(SUPPORTED_LANGUAGES),
                }
            ),
        )
        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Change the PLOUD server without changing the device identity."""
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}
        if user_input is not None:
            validated_input = cast(ReconfigureFlowInput, user_input)
            server = _normalise_server(validated_input[CONF_SERVER])
            if server is None:
                errors["base"] = "invalid_server"
            else:
                await self.async_set_unique_id(entry.unique_id)
                self._abort_if_unique_id_mismatch()
                return self.async_update_reload_and_abort(
                    entry,
                    data_updates={CONF_SERVER: server},
                )

        schema = cast(
            Any,
            vol.Schema(
                {
                    vol.Required(
                        CONF_SERVER,
                        default=entry.data[CONF_SERVER],
                    ): str
                }
            ),
        )
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=schema,
            errors=errors,
        )

    async def async_step_reauth(
        self, entry_data: dict[str, Any]
    ) -> config_entries.ConfigFlowResult:
        """Start token renewal."""
        entry = self._get_reauth_entry()
        await self.async_set_unique_id(entry.unique_id)
        self._abort_if_unique_id_mismatch()
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Replace an invalid PLOUD token."""
        if user_input is not None:
            validated_input = cast(ReauthFlowInput, user_input)
            token = validated_input[CONF_TOKEN].strip()
            if not token:
                schema = cast(
                    Any,
                    vol.Schema({vol.Required(CONF_TOKEN): str}),
                )
                return self.async_show_form(
                    step_id="reauth_confirm",
                    data_schema=schema,
                    errors={"base": "invalid_token"},
                )
            entry = self._get_reauth_entry()
            return self.async_update_reload_and_abort(
                entry,
                data_updates={CONF_TOKEN: token},
            )

        schema = cast(
            Any,
            vol.Schema({vol.Required(CONF_TOKEN): str}),
        )
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=schema,
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
            validated_input = cast(OptionsFlowInput, user_input)
            return self.async_create_entry(title="", data=validated_input)

        default_interval = int(DEFAULT_SCAN_INTERVAL.total_seconds() // 60)
        raw_interval = self.config_entry.options.get(
            CONF_SCAN_INTERVAL,
            default_interval,
        )
        current_interval = (
            raw_interval
            if isinstance(raw_interval, int)
            and not isinstance(raw_interval, bool)
            and MIN_SCAN_INTERVAL_MINUTES
            <= raw_interval
            <= MAX_SCAN_INTERVAL_MINUTES
            else default_interval
        )

        raw_language = self.config_entry.options.get(
            CONF_LANGUAGE,
            self.config_entry.data.get(CONF_LANGUAGE, DEFAULT_LANGUAGE),
        )
        current_language = (
            raw_language
            if isinstance(raw_language, str)
            and raw_language in SUPPORTED_LANGUAGES
            else DEFAULT_LANGUAGE
        )

        schema = cast(
            Any,
            vol.Schema(
                {
                    vol.Required(
                        CONF_SCAN_INTERVAL,
                        default=current_interval,
                    ): vol.All(
                        vol.Coerce(int),
                        vol.Range(
                            min=MIN_SCAN_INTERVAL_MINUTES,
                            max=MAX_SCAN_INTERVAL_MINUTES,
                        ),
                    ),
                    vol.Required(
                        CONF_LANGUAGE,
                        default=current_language,
                    ): vol.In(SUPPORTED_LANGUAGES),
                }
            ),
        )
        return self.async_show_form(
            step_id="init",
            data_schema=schema,
        )
