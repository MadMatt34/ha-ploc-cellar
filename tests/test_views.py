"""Tests for authenticated PLOUD image serving."""
from __future__ import annotations

import asyncio
import hashlib
from pathlib import Path
from types import SimpleNamespace
from typing import Any, cast

import pytest
from aiohttp import web
from homeassistant.config_entries import ConfigEntryState
from ploc_cellar.views import PlocCellarImageView


def _view(tmp_path: Path, document_id: str) -> PlocCellarImageView:
    """Build an authenticated image view with one loaded config entry."""
    prefix = hashlib.sha256(document_id.encode()).hexdigest()
    image_path = tmp_path / f"{prefix}-fingerprint.jpg"
    image_path.write_bytes(b"\xff\xd8\xffimage")
    coordinator = SimpleNamespace(image_directory=tmp_path)
    entry = SimpleNamespace(
        domain="ploc_cellar",
        state=ConfigEntryState.LOADED,
        runtime_data=coordinator,
    )
    hass = SimpleNamespace(
        config_entries=SimpleNamespace(async_get_entry=lambda entry_id: entry)
    )
    return PlocCellarImageView(cast(Any, hass))


def test_image_view_serves_only_cached_images(
    tmp_path: Path,
) -> None:
    """A loaded entry can serve a cached image through the authenticated view."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    view = _view(tmp_path, document_id)

    response = asyncio.run(
        view.get(
            cast(web.Request, object()),
            "entry-1",
            document_id,
        )
    )

    assert isinstance(response, web.FileResponse)
    assert response.headers["Cache-Control"] == "private, no-store"
    assert view.requires_auth is True


@pytest.mark.parametrize(
    ("entry", "document_id"),
    [
        (None, "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"),
        (
            SimpleNamespace(
                domain="ploc_cellar",
                state=ConfigEntryState.NOT_LOADED,
                runtime_data=SimpleNamespace(image_directory=Path("/tmp")),
            ),
            "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a",
        ),
    ],
)
def test_image_view_hides_missing_or_unloaded_entries(
    entry: object,
    document_id: str,
) -> None:
    """Images are unavailable after the config entry is unloaded or removed."""
    hass = SimpleNamespace(
        config_entries=SimpleNamespace(async_get_entry=lambda entry_id: entry)
    )
    view = PlocCellarImageView(cast(Any, hass))

    with pytest.raises(web.HTTPNotFound):
        asyncio.run(
            view.get(
                cast(web.Request, object()),
                "entry-1",
                document_id,
            )
        )


def test_image_view_rejects_uncached_and_unsafe_document_ids(
    tmp_path: Path,
) -> None:
    """Only a cached document with a valid opaque identifier can be served."""
    view = _view(tmp_path, "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a")

    with pytest.raises(web.HTTPNotFound):
        asyncio.run(
            view.get(
                cast(web.Request, object()),
                "entry-1",
                "not-a-valid-path/../../secret",
            )
        )
