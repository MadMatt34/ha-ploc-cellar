"""Tests for the private PLOUD wine image cache."""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any, cast

from ploc_cellar import images as images_module
from ploc_cellar.images import async_sync_images, find_cached_image, safe_image_path
from ploc_cellar.models import Cellar, Wine
from ploc_cellar.ploud import PLOUDCollections


class _FakeHass:
    """Run executor jobs inline for deterministic filesystem tests."""

    async def async_add_executor_job(self, function: Any, *args: Any) -> Any:
        return function(*args)


def _wine(document_id: str) -> Wine:
    """Build a minimal wine whose primary image references one document."""
    return Wine(
        id="wine-1",
        name="Vin de test",
        bottles=1,
        bottles_in_cellar=1,
        vintage=2020,
        appellation=None,
        color=None,
        color_rgb=None,
        classification=None,
        region=None,
        country=None,
        grapes=None,
        cuvee=None,
        comment=None,
        alcohol_percent=None,
        service_temperature_min=None,
        service_temperature_max=None,
        bottle_format=None,
        bottle_volume_l=None,
        ploud_pid=None,
        domain=None,
        owner_id=None,
        ploud_reference_fields={"im": document_id},
    )


def _document(document_id: str, timestamp: int) -> dict[str, Any]:
    """Build the server metadata used to invalidate a cached document."""
    return {
        "id": document_id,
        "tm": f"2026-11-07T10:00:{timestamp:02d}Z",
        "tp": timestamp,
        "lt": 8,
        "ct": "image/jpeg",
        "wd": 2,
        "ht": 2,
    }


def test_sync_downloads_and_caches_a_referenced_image(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    """A missing referenced document is downloaded and stored by opaque ID hash."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    cellar = Cellar(wines={"wine-1": _wine(document_id)})
    objects: PLOUDCollections = {
        "Documents": [
            {**_document(document_id, 1), "ct": "application/octet-stream"}
        ]
    }
    downloads: list[str] = []

    async def fake_download(
        session: Any,
        *,
        server: str,
        token: str,
        device: str,
        document_id: str,
        last_sync_time: int,
        max_bytes: int,
    ) -> bytes:
        downloads.append(document_id)
        return b"\xff\xd8\xffimage-data"

    monkeypatch.setattr(images_module, "async_get_document", fake_download)

    asyncio.run(
        async_sync_images(
            cast(Any, _FakeHass()),
            cast(Any, object()),
            directory=tmp_path,
            server="https://ploud.example/v1",
            token="token",
            device="device",
            cellar=cellar,
            objects=objects,
            last_sync_time=123,
        )
    )

    cached = find_cached_image(tmp_path, document_id)
    assert cached is not None
    assert cached.read_bytes() == b"\xff\xd8\xffimage-data"
    assert safe_image_path(tmp_path, document_id) == cached
    assert downloads == [document_id]
    assert document_id not in cached.name


def test_unchanged_document_metadata_reuses_cached_image(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    """An unchanged PLOUD document is not downloaded again."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    cellar = Cellar(wines={"wine-1": _wine(document_id)})
    objects: PLOUDCollections = {"Documents": [_document(document_id, 1)]}
    downloads = 0

    async def fake_download(*args: Any, **kwargs: Any) -> bytes:
        nonlocal downloads
        downloads += 1
        return b"\xff\xd8\xffimage-data"

    monkeypatch.setattr(images_module, "async_get_document", fake_download)
    arguments = {
        "hass": cast(Any, _FakeHass()),
        "session": cast(Any, object()),
        "directory": tmp_path,
        "server": "https://ploud.example/v1",
        "token": "token",
        "device": "device",
        "cellar": cellar,
        "objects": objects,
        "last_sync_time": 123,
    }

    asyncio.run(async_sync_images(**arguments))
    first_path = find_cached_image(tmp_path, document_id)
    asyncio.run(async_sync_images(**arguments))

    assert downloads == 1
    assert find_cached_image(tmp_path, document_id) == first_path


def test_changed_document_metadata_replaces_cached_image(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    """A modified document with the same ID invalidates and replaces its cache."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    cellar = Cellar(wines={"wine-1": _wine(document_id)})
    downloads = 0

    async def fake_download(*args: Any, **kwargs: Any) -> bytes:
        nonlocal downloads
        downloads += 1
        return b"\xff\xd8\xff" + bytes([downloads])

    monkeypatch.setattr(images_module, "async_get_document", fake_download)
    arguments = {
        "hass": cast(Any, _FakeHass()),
        "session": cast(Any, object()),
        "directory": tmp_path,
        "server": "https://ploud.example/v1",
        "token": "token",
        "device": "device",
        "cellar": cellar,
        "last_sync_time": 123,
    }

    asyncio.run(
        async_sync_images(
            **arguments,
            objects={"Documents": [_document(document_id, 1)]},
        )
    )
    first_path = find_cached_image(tmp_path, document_id)
    assert first_path is not None

    asyncio.run(
        async_sync_images(
            **arguments,
            objects={"Documents": [_document(document_id, 2)]},
        )
    )
    second_path = find_cached_image(tmp_path, document_id)

    assert downloads == 2
    assert second_path is not None
    assert second_path != first_path
    assert second_path.read_bytes() == b"\xff\xd8\xff\x02"
    assert list(tmp_path.iterdir()) == [second_path]


def test_deleted_document_and_unreferenced_image_are_removed(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    """PLOUD deletion and Wine image-reference removal prune cached files."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    cellar = Cellar(wines={"wine-1": _wine(document_id)})

    async def fake_download(*args: Any, **kwargs: Any) -> bytes:
        return b"\xff\xd8\xffimage-data"

    monkeypatch.setattr(images_module, "async_get_document", fake_download)
    hass = cast(Any, _FakeHass())
    session = cast(Any, object())
    common = {
        "hass": hass,
        "session": session,
        "directory": tmp_path,
        "server": "https://ploud.example/v1",
        "token": "token",
        "device": "device",
        "last_sync_time": 123,
    }
    asyncio.run(
        async_sync_images(
            **common,
            cellar=cellar,
            objects={"Documents": [_document(document_id, 1)]},
        )
    )
    assert find_cached_image(tmp_path, document_id) is not None

    asyncio.run(
        async_sync_images(
            **common,
            cellar=Cellar(),
            objects={"DeletedObjects": [{"id": document_id, "ty": 115}]},
        )
    )
    assert find_cached_image(tmp_path, document_id) is None
    assert list(tmp_path.iterdir()) == []


def test_failed_replacement_keeps_previous_cached_image(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    """A transient download failure must not evict the last valid image."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    cellar = Cellar(wines={"wine-1": _wine(document_id)})

    async def successful_download(*args: Any, **kwargs: Any) -> bytes:
        return b"\xff\xd8\xffold-image"

    monkeypatch.setattr(images_module, "async_get_document", successful_download)
    common = {
        "hass": cast(Any, _FakeHass()),
        "session": cast(Any, object()),
        "directory": tmp_path,
        "server": "https://ploud.example/v1",
        "token": "token",
        "device": "device",
        "cellar": cellar,
        "last_sync_time": 123,
    }
    asyncio.run(
        async_sync_images(
            **common,
            objects={"Documents": [_document(document_id, 1)]},
        )
    )
    previous = find_cached_image(tmp_path, document_id)
    assert previous is not None

    async def failed_download(*args: Any, **kwargs: Any) -> bytes:
        raise images_module.PloudError("temporary upstream failure")

    monkeypatch.setattr(images_module, "async_get_document", failed_download)
    asyncio.run(
        async_sync_images(
            **common,
            objects={"Documents": [_document(document_id, 2)]},
        )
    )

    assert find_cached_image(tmp_path, document_id) == previous
    assert previous.read_bytes() == b"\xff\xd8\xffold-image"


def test_empty_reference_set_prunes_the_last_cached_image(
    tmp_path: Path,
) -> None:
    """Removing the final Wine reference also removes its orphaned image."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    prefix = images_module._cache_prefix(document_id)
    cached = tmp_path / f"{prefix}-version.jpg"
    cached.write_bytes(b"\\xff\\xd8\\xffimage-data")

    asyncio.run(
        async_sync_images(
            cast(Any, _FakeHass()),
            cast(Any, object()),
            directory=tmp_path,
            server="https://ploud.example/v1",
            token="token",
            device="device",
            cellar=Cellar(),
            objects={},
            last_sync_time=123,
        )
    )

    assert not cached.exists()
    assert list(tmp_path.iterdir()) == []



def test_deleted_document_ids_accepts_supported_identifier_aliases() -> None:
    """Deleted document IDs use the same key aliases as other PLOUD records."""
    for identifier_key in ("id", "Id", "ID"):
        deleted = images_module._deleted_document_ids(
            {
                "DeletedObjects": [
                    {identifier_key: "document-1", "ty": 115}
                ]
            }
        )
        assert deleted == {"document-1"}
