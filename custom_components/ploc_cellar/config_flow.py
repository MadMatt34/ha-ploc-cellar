"""Config flow for PLOUD connection details."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from .const import CONF_DEVICE, CONF_LANGUAGE, CONF_SERVER, CONF_TOKEN, DEFAULT_LANGUAGE, DOMAIN

class PlocCellarConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None):
        errors: dict[str, str] = {}
        if user_input is not None:
            server = str(user_input[CONF_SERVER]).strip().rstrip("/")
            device = str(user_input[CONF_DEVICE]).strip()
            if not server.startswith(("https://", "http://")):
                errors["base"] = "invalid_server"
            elif len(device) != 5:
                errors["base"] = "invalid_device"
            else:
                await self.async_set_unique_id(device)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(title="Ploc Cellar", data={
                    **user_input, CONF_SERVER: server, CONF_DEVICE: device})
        schema = vol.Schema({
            vol.Required(CONF_SERVER, default="https://ploud.ploc.co/v1/"): str,
            vol.Required(CONF_TOKEN): str,
            vol.Required(CONF_DEVICE): str,
            vol.Optional(CONF_LANGUAGE, default=DEFAULT_LANGUAGE): str,
        })
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)
