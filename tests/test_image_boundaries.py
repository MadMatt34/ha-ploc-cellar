"""Boundary tests for the PLOUD image cache."""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any, cast

import pytest
from ploc_cellar import images as images_module
from ploc_cellar.images import async_sync_images, find_cached_image
from ploc_cellar.models import Cellar, Wine
from ploc_cellar.ploud import PloudError


class _FakeHass:
    """Run filesystem executor jobs inline for deterministic tests."""

    async def async_add_executor_job(self, function: Any, *args: Any) -> Any:
        return function(*args)


def _cellar(document_id: str) -> Cellar:
    """Build a cellar with one primary image reference."""
    wine = Wine(
        id="wine-1", name="Wine", bottles=1, bottles_in_cellar=1,
        vintage=None, appellation=None, color=None, color_rgb=None,
        classification=None, region=None, country=None, grapes=None,
        cuvee=None, comment=None, alcohol_percent=None,
        service_temperature_min=None, service_temperature_max=None,
        bottle_format=None, bottle_volume_l=None, ploud_pid=None,
        domain=None, owner_id=None,
        ploud_reference_fields={"im": document_id},
    )
    return Cellar(wines={"wine-1": wine})


@pytest.mark.parametrize(
    ("size", "is_cached"),
    [
        (images_module._MAX_IMAGE_BYTES, True),
        (images_module._MAX_IMAGE_BYTES + 1, False),
    ],
)
def test_image_download_enforces_the_exact_size_limit(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    size: int,
    is_cached: bool,
) -> None:
    """A 20 MiB image is accepted and a one-byte-larger image is rejected."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"

    async def fake_download(*args: Any, **kwargs: Any) -> bytes:
        return b"\xff\xd8\xff" + b"x" * (size - 3)

    monkeypatch.setattr(images_module, "async_get_document", fake_download)
    asyncio.run(
        async_sync_images(
            cast(Any, _FakeHass()), cast(Any, object()),
            directory=tmp_path, server="https://ploud.example/v1",
            token="token", device="device", cellar=_cellar(document_id),
            objects={"Documents": [{"id": document_id, "tp": 1, "ct": "image/jpeg"}]},
            last_sync_time=1,
        )
    )

    cached = find_cached_image(tmp_path, document_id)
    assert (cached is not None) is is_cached
    if cached is not None:
        assert cached.stat().st_size == images_module._MAX_IMAGE_BYTES


@pytest.mark.parametrize(
    "error",
    [PloudError("PLOUD unavailable"), OSError("temporary filesystem failure")],
)
def test_download_failures_are_isolated_from_inventory_sync(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    error: Exception,
) -> None:
    """PLOUD and filesystem download errors do not escape image synchronization."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"

    async def fail_download(*args: Any, **kwargs: Any) -> bytes:
        raise error

    monkeypatch.setattr(images_module, "async_get_document", fail_download)
    asyncio.run(
        async_sync_images(
            cast(Any, _FakeHass()), cast(Any, object()),
            directory=tmp_path, server="https://ploud.example/v1",
            token="token", device="device", cellar=_cellar(document_id),
            objects={"Documents": [{"id": document_id, "tp": 1, "ct": "image/jpeg"}]},
            last_sync_time=1,
        )
    )
    assert find_cached_image(tmp_path, document_id) is None
