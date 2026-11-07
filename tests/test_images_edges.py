"""Edge-case coverage for PLOUD image cache validation and pruning."""
from __future__ import annotations

import asyncio
import hashlib
from pathlib import Path
from typing import Any, cast

import pytest

from ploc_cellar import images as images_module
from ploc_cellar.images import (
    _cleanup_unreferenced,
    _deleted_document_ids,
    _document_id,
    _document_records,
    _image_extension,
    _metadata_fingerprint,
    _remove_document_files,
    async_sync_images,
    find_cached_image,
    image_document_ids,
    remove_image_cache,
    safe_image_path,
)
from ploc_cellar.models import Cellar, Wine
from ploc_cellar.ploud import PloudError


def test_document_ids_and_collection_records_reject_invalid_values() -> None:
    """Malformed identifiers and duplicate Document records are rejected."""
    assert _document_id(None) is None
    assert _document_id(True) is None
    assert _document_id([]) is None
    assert _document_id("  ") is None

    with pytest.raises(PloudError, match="without a valid ID"):
        _document_records({"Documents": [{"name": "missing-id"}]})

    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    with pytest.raises(PloudError, match="duplicate Document ID"):
        _document_records(
            {
                "Documents": [
                    {"id": document_id},
                    {"id": document_id},
                ]
            }
        )


def test_deleted_document_filter_and_empty_metadata_fingerprint() -> None:
    """Only Document deletion records are treated as image deletions."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    deleted = _deleted_document_ids(
        {
            "DeletedObjects": [
                {"id": "wine-1", "ty": 100},
                {"id": document_id, "ty": 115},
                {"id": [], "ty": "document"},
            ]
        }
    )

    assert deleted == {document_id}
    assert _metadata_fingerprint({"id": document_id}) is None


def test_image_document_ids_include_cover_image_and_ignore_invalid_fields() -> None:
    """The cover image remains usable when the primary image is absent."""
    wine = Wine(
        id="wine-1",
        name="Vin",
        bottles=0,
        bottles_in_cellar=0,
        vintage=None,
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
        ploud_reference_fields={
            "im": [],
            "ci": "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a",
        },
    )

    assert image_document_ids(Cellar(wines={"wine-1": wine})) == {
        "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    }


def test_image_extension_supports_raster_signatures() -> None:
    """Only recognized JPEG, PNG, GIF and WebP bodies are cached."""
    assert _image_extension(b"\xff\xd8\xffrest") == ".jpg"
    assert _image_extension(b"\x89PNG\r\n\x1a\nrest") == ".png"
    assert _image_extension(b"GIF89arest") == ".gif"
    assert _image_extension(b"RIFFxxxxWEBPrest") == ".webp"
    assert _image_extension(b"not-an-image") is None


def test_cache_helpers_handle_missing_directories_and_prune_orphans(
    tmp_path: Path,
) -> None:
    """Cache lookup, removal and pruning tolerate missing paths and stale files."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    missing = tmp_path / "missing"
    assert find_cached_image(missing, document_id) is None
    _remove_document_files(missing, document_id)
    _cleanup_unreferenced(missing, set())

    prefix = hashlib.sha256(document_id.encode()).hexdigest()
    cached = tmp_path / f"{prefix}-version.jpg"
    orphan = tmp_path / "orphan.jpg"
    temporary = tmp_path / "partial.tmp"
    cached.write_bytes(b"\xff\xd8\xffimage")
    orphan.write_bytes(b"orphan")
    temporary.write_bytes(b"partial")
    (tmp_path / "subdirectory").mkdir()

    _cleanup_unreferenced(tmp_path, {document_id})

    assert cached.is_file()
    assert not orphan.exists()
    assert not temporary.exists()
    assert (tmp_path / "subdirectory").is_dir()

    _remove_document_files(tmp_path, document_id)
    assert find_cached_image(tmp_path, document_id) is None


def test_safe_image_path_rejects_path_traversal(tmp_path: Path) -> None:
    """Opaque document identifiers cannot escape the cache directory."""
    assert safe_image_path(tmp_path, "../secret") is None


def test_non_image_document_metadata_removes_cached_photo(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A referenced document changed to a non-image type is not served."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"
    prefix = hashlib.sha256(document_id.encode()).hexdigest()
    cached = tmp_path / f"{prefix}-old.jpg"
    cached.write_bytes(b"\xff\xd8\xffimage")

    async def fail_download(*args: Any, **kwargs: Any) -> bytes:
        raise AssertionError("non-image documents must not be downloaded")

    monkeypatch.setattr(images_module, "async_get_document", fail_download)

    asyncio.run(
        async_sync_images(
            cast(Any, _FakeHass()),
            cast(Any, object()),
            directory=tmp_path,
            server="https://ploud.example/v1",
            token="token",
            device="device",
            cellar=_cellar(document_id),
            objects={"Documents": [{"id": document_id, "tp": 2, "ct": "application/pdf"}]},
            last_sync_time=1,
        )
    )

    assert not cached.exists()


class _FakeHass:
    """Execute filesystem jobs inline for async image-cache tests."""

    async def async_add_executor_job(self, function: Any, *args: Any) -> Any:
        return function(*args)


def _cellar(document_id: str) -> Cellar:
    """Build one Wine with a primary image reference."""
    wine = Wine(
        id="wine-1",
        name="Vin",
        bottles=0,
        bottles_in_cellar=0,
        vintage=None,
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
    return Cellar(wines={"wine-1": wine})


def test_download_errors_and_unsupported_images_do_not_break_inventory(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Failed or non-image downloads are logged and left uncached."""
    document_id = "4fe6124e-6d59-45b5-9dcd-67f3fcdcda0a"

    async def unsupported(*args: Any, **kwargs: Any) -> bytes:
        return b"not-an-image"

    monkeypatch.setattr(images_module, "async_get_document", unsupported)
    asyncio.run(
        async_sync_images(
            cast(Any, _FakeHass()),
            cast(Any, object()),
            directory=tmp_path,
            server="https://ploud.example/v1",
            token="token",
            device="device",
            cellar=_cellar(document_id),
            objects={"Documents": [{"id": document_id, "tp": 1, "ct": "image/jpeg"}]},
            last_sync_time=1,
        )
    )
    assert find_cached_image(tmp_path, document_id) is None


def test_remove_image_cache_removes_the_entry_directory(tmp_path: Path) -> None:
    """The integration cleanup removes nested image files and the directory."""
    cache = tmp_path / "entry" / "images"
    cache.mkdir(parents=True)
    (cache / "image.jpg").write_bytes(b"image")

    remove_image_cache(cache.parent)

    assert not cache.parent.exists()
