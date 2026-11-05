"""Config and options flows for Ploc Cellar."""
from __future__ import annotations

import logging
from typing import Any, cast
from uuid import uuid4

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry, OptionsFlowWithReload
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .auth import PlocAuthError, PlocConnectionError, async_authenticate
from .const import (
    CONF_DEVICE,
    CONF_LANGUAGE,
    CONF_SCAN_INTERVAL,
    CONF_TOKEN,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL_MINUTES,
    MIN_SCAN_INTERVAL_MINUTES,
    SUPPORTED_LANGUAGES,
)
from .language import get_default_ploud_language, get_ploud_language
from .types import (
    ConfigFlowUserInput,
    OptionsFlowInput,
    ReauthFlowInput,
)

_LOGGER = logging.getLogger(__name__)


def _is_valid_email(value: str) -> bool:
    """Validate an email address with Voluptuous."""
    try:
        cast(Any, vol.Email)()(value)
    except vol.Invalid:
        return False
    return True


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure a PLOC account and activate PLOUD for Home Assistant."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Sign in to PLOC and activate PLOUD."""
        if self._async_current_entries():
            return self.async_abort(reason="already_configured")

        errors: dict[str, str] = {}
        if user_input is not None:
            credentials = cast(ConfigFlowUserInput, user_input)
            if not _is_valid_email(credentials["username"]):
                errors["username"] = "invalid_email"
            if "username" not in errors:
                try:
                    token = await async_authenticate(
                        async_get_clientsession(self.hass),
                        credentials["username"],
                        credentials["password"],
                        get_default_ploud_language(self.hass),
                    )
                except PlocAuthError as err:
                    _LOGGER.warning("PLOC/PLOUD authentication failed: %s", err)
                    errors["base"] = "invalid_auth"
                except PlocConnectionError as err:
                    _LOGGER.warning("PLOC/PLOUD service unavailable: %s", err)
                    errors["base"] = "cannot_connect"
                else:
                    # Keep the full UUID in configuration. PLOUD requests use
                    # the five-character short identifier derived from it.
                    device = str(uuid4())
                    await self.async_set_unique_id(device)
                    self._abort_if_unique_id_configured()
                    return self.async_create_entry(
                        title="Ploc Cellar",
                        data={
                            CONF_TOKEN: token,
                            CONF_DEVICE: device,
                        },
                    )

        schema = cast(
            Any,
            vol.Schema(
                {
                    vol.Required("username"): str,
                    vol.Required("password"): selector.TextSelector(  # pyright: ignore[reportUnknownMemberType]
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.PASSWORD,
                            autocomplete="current-password",
                        )
                    ),
                }
            ),
        )
        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )

    async def async_step_reauth(
        self, entry_data: dict[str, Any]
    ) -> config_entries.ConfigFlowResult:
        """Start PLOC account reauthentication."""
        entry = self._get_reauth_entry()
        await self.async_set_unique_id(entry.unique_id)
        self._abort_if_unique_id_mismatch()
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Sign in again and renew PLOUD activation."""
        errors: dict[str, str] = {}
        if user_input is not None:
            credentials = cast(ReauthFlowInput, user_input)
            entry = self._get_reauth_entry()
            if not _is_valid_email(credentials["username"]):
                errors["username"] = "invalid_email"
            else:
                try:
                    token = await async_authenticate(
                        async_get_clientsession(self.hass),
                        credentials["username"],
                        credentials["password"],
                        get_ploud_language(
                            self.hass, entry.options.get(CONF_LANGUAGE)
                        ),
                    )
                except PlocAuthError as err:
                    _LOGGER.warning("PLOC/PLOUD reauthentication failed: %s", err)
                    errors["base"] = "invalid_auth"
                except PlocConnectionError as err:
                    _LOGGER.warning("PLOC/PLOUD service unavailable: %s", err)
                    errors["base"] = "cannot_connect"
                else:
                    return self.async_update_reload_and_abort(
                        entry,
                        # Reauthentication renews credentials without changing
                        # the fixed PLOUD endpoint.
                        data_updates={CONF_TOKEN: token},
                    )

        schema = cast(
            Any,
            vol.Schema(
                {
                    vol.Required("username"): str,
                    vol.Required("password"): selector.TextSelector(  # pyright: ignore[reportUnknownMemberType]
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.PASSWORD,
                            autocomplete="current-password",
                        )
                    ),
                }
            ),
        )
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=schema,
            errors=errors,
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
            "auto",
        )
        current_language = (
            raw_language
            if isinstance(raw_language, str)
            and raw_language in (*SUPPORTED_LANGUAGES, "auto")
            else "auto"
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
                    ): selector.SelectSelector(  # pyright: ignore[reportUnknownMemberType]
                        selector.SelectSelectorConfig(
                            options=[
                                selector.SelectOptionDict(
                                    value="auto",
                                    label="Auto",
                                ),
                                selector.SelectOptionDict(
                                    value="fr",
                                    label="Français",
                                ),
                                selector.SelectOptionDict(
                                    value="en",
                                    label="English",
                                ),
                            ],
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                }
            ),
        )
        return self.async_show_form(
            step_id="init",
            data_schema=schema,
        )
