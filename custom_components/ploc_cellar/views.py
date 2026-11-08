"""Authenticated HTTP view for cached PLOUD wine images."""
from __future__ import annotations

from typing import cast

from aiohttp import web
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers.http import HomeAssistantView

from .const import DOMAIN
from .images import safe_image_path
from .types import PlocCellarConfigEntry


class PlocCellarImageView(HomeAssistantView):
    """Serve entry-scoped cached wine images to authenticated HA clients."""

    url = "/api/ploc_cellar/{entry_id}/images/{document_id}"
    name = "api:ploc_cellar:image"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the view with its Home Assistant instance."""
        self.hass = hass

    async def get(
        self,
        request: web.Request,
        entry_id: str,
        document_id: str,
    ) -> web.FileResponse:
        """Return one cached image for a currently loaded integration entry."""
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if (
            entry is None
            or entry.domain != DOMAIN
            or entry.state is not ConfigEntryState.LOADED
        ):
            raise web.HTTPNotFound()

        coordinator = cast(PlocCellarConfigEntry, entry).runtime_data
        image_path = safe_image_path(coordinator.image_directory, document_id)
        if image_path is None:
            raise web.HTTPNotFound()

        return web.FileResponse(
            image_path,
            headers={"Cache-Control": "private, no-store"},
        )
