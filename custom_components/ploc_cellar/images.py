"""Private, entry-scoped cache for PLOUD wine photographs."""
from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import re
from pathlib import Path
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant

from .models import Cellar, JsonObject, normalize_identifier
from .ploud import PLOUDCollections, PloudError, async_get_document

if TYPE_CHECKING:
    from aiohttp import ClientSession

_LOGGER = logging.getLogger(__name__)

_MAX_IMAGE_BYTES = 20 * 1024 * 1024
_DOWNLOAD_CONCURRENCY = 4
_METADATA_FIELDS = ("tm", "tp", "lt", "ct", "wd", "ht", "or", "ty")
_IMAGE_SIGNATURES: tuple[tuple[bytes, str], ...] = (
    (b"\xff\xd8\xff", ".jpg"),
    (b"\x89PNG\r\n\x1a\n", ".png"),
    (b"GIF87a", ".gif"),
    (b"GIF89a", ".gif"),
)


def _document_id(value: object) -> str | None:
    """Normalize a compact PLOUD document identifier."""
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (str, int)):
        return normalize_identifier(str(value)) or None
    return None


def image_document_ids(cellar: Cellar) -> set[str]:
    """Return the distinct primary and cover image document IDs in the cellar."""
    identifiers: set[str] = set()
    for wine in cellar.wines.values():
        for field in ("im", "ci"):
            identifier = _document_id(wine.ploud_reference_fields.get(field))
            if identifier is not None:
                identifiers.add(identifier)
    return identifiers


def _collection_records(
    objects: PLOUDCollections,
    collection_name: str,
) -> list[JsonObject]:
    """Return one known collection from a PLOUD response."""
    for name, records in objects.items():
        if name.casefold() == collection_name.casefold():
            return records
    return []


def _deleted_document_ids(objects: PLOUDCollections) -> set[str]:
    """Return document IDs explicitly deleted by PLOUD."""
    records = _collection_records(objects, "DeletedObjects")
    deleted: set[str] = set()
    for record in records:
        raw_kind = next(
            (
                record[key]
                for key in ("type", "Type", "objectType", "ObjectType", "ty")
                if key in record
            ),
            None,
        )
        kind = (
            str(raw_kind).strip().casefold()
            if isinstance(raw_kind, (str, int)) and not isinstance(raw_kind, bool)
            else ""
        )
        if kind not in {"115", "document", "documents"}:
            continue
        identifier = _document_id(record.get("id"))
        if identifier is not None:
            deleted.add(identifier)
    return deleted


def _document_records(objects: PLOUDCollections) -> dict[str, JsonObject]:
    """Index document metadata from one incremental or complete response."""
    records = _collection_records(objects, "Documents")
    indexed: dict[str, JsonObject] = {}
    for record in records:
        identifier = _document_id(record.get("id"))
        if identifier is None:
            raise PloudError("PLOUD returned a Document without a valid ID")
        if identifier in indexed:
            raise PloudError(f"PLOUD returned duplicate Document ID: {identifier}")
        indexed[identifier] = record
    return indexed


def _metadata_fingerprint(record: JsonObject) -> str | None:
    """Fingerprint the server-managed fields that change with a document."""
    metadata = {
        key: record[key]
        for key in _METADATA_FIELDS
        if key in record
    }
    if not metadata:
        return None
    encoded = json.dumps(
        metadata,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode()
    return hashlib.sha256(encoded).hexdigest()[:16]


def _cache_prefix(document_id: str) -> str:
    """Hash opaque server IDs before using them as filesystem names."""
    return hashlib.sha256(document_id.encode()).hexdigest()


def find_cached_image(directory: Path, document_id: str) -> Path | None:
    """Find the cached image for a document without exposing its raw ID as a path."""
    prefix = _cache_prefix(document_id) + "-"
    if not directory.is_dir():
        return None
    candidates = sorted(
        path
        for path in directory.iterdir()
        if path.is_file()
        and path.name.startswith(prefix)
        and path.suffix in {".jpg", ".png", ".gif", ".webp"}
    )
    return candidates[-1] if candidates else None


def _image_extension(content: bytes) -> str | None:
    """Recognize supported raster image formats from their actual bytes."""
    for signature, extension in _IMAGE_SIGNATURES:
        if content.startswith(signature):
            return extension
    if (
        len(content) >= 12
        and content.startswith(b"RIFF")
        and content[8:12] == b"WEBP"
    ):
        return ".webp"
    return None


def _remove_document_files(directory: Path, document_id: str) -> None:
    """Remove every cached version of one document."""
    prefix = _cache_prefix(document_id) + "-"
    if not directory.is_dir():
        return
    for path in directory.iterdir():
        if path.is_file() and path.name.startswith(prefix):
            path.unlink(missing_ok=True)


def _store_image(
    directory: Path,
    document_id: str,
    fingerprint: str,
    extension: str,
    content: bytes,
) -> None:
    """Atomically replace older cached versions of one document."""
    prefix = _cache_prefix(document_id)
    destination = directory / f"{prefix}-{fingerprint}{extension}"
    temporary = destination.with_suffix(destination.suffix + ".tmp")
    temporary.write_bytes(content)
    temporary.replace(destination)
    prefix = _cache_prefix(document_id) + "-"
    for path in directory.iterdir():
        if path.is_file() and path.name.startswith(prefix) and path != destination:
            path.unlink(missing_ok=True)


def _cleanup_unreferenced(directory: Path, referenced: set[str]) -> None:
    """Remove cache files no longer referenced by any Wine image field."""
    if not directory.is_dir():
        return
    prefixes = {_cache_prefix(identifier) + "-" for identifier in referenced}
    for path in directory.iterdir():
        if not path.is_file():
            continue
        if path.name.endswith(".tmp") or not any(
            path.name.startswith(prefix) for prefix in prefixes
        ):
            path.unlink(missing_ok=True)


async def async_sync_images(
    hass: HomeAssistant,
    session: ClientSession,
    *,
    directory: Path,
    server: str,
    token: str,
    device: str,
    cellar: Cellar,
    objects: PLOUDCollections,
    last_sync_time: int,
) -> None:
    """Download changed referenced images and prune stale cache files."""
    referenced = image_document_ids(cellar)
    deleted = _deleted_document_ids(objects)
    if not referenced and not deleted:
        return
    metadata = _document_records(objects)
    await hass.async_add_executor_job(directory.mkdir, 0o700, True, True)

    for identifier in deleted:
        await hass.async_add_executor_job(
            _remove_document_files, directory, identifier
        )

    semaphore = asyncio.Semaphore(_DOWNLOAD_CONCURRENCY)

    async def update_one(identifier: str) -> None:
        """Update one referenced image, leaving inventory sync independent."""
        if identifier in deleted:
            return
        record = metadata.get(identifier)
        fingerprint = _metadata_fingerprint(record) if record is not None else None
        cached = find_cached_image(directory, identifier)
        if cached is not None and (
            fingerprint is None
            or cached.name.startswith(f"{_cache_prefix(identifier)}-{fingerprint}")
        ):
            return

        if record is not None:
            content_type = record.get("ct")
            if isinstance(content_type, str) and content_type.strip() and (
                content_type.casefold().startswith(
                    ("application/pdf", "text/", "audio/", "video/")
                )
            ):
                await hass.async_add_executor_job(
                    _remove_document_files, directory, identifier
                )
                return

        async with semaphore:
            try:
                content = await async_get_document(
                    session,
                    server=server,
                    token=token,
                    device=device,
                    document_id=identifier,
                    last_sync_time=last_sync_time,
                    max_bytes=_MAX_IMAGE_BYTES,
                )
                extension = _image_extension(content)
                if extension is None:
                    raise PloudError(
                        f"PLOUD document {identifier} is not a supported raster image"
                    )
                await hass.async_add_executor_job(
                    _store_image,
                    directory,
                    identifier,
                    fingerprint or "unknown",
                    extension,
                    content,
                )
            except (PloudError, OSError) as err:
                _LOGGER.warning(
                    "Could not update PLOUD wine image %s: %s",
                    identifier,
                    err,
                )

    await asyncio.gather(*(update_one(identifier) for identifier in sorted(referenced)))
    await hass.async_add_executor_job(
        _cleanup_unreferenced, directory, referenced
    )


def remove_image_cache(directory: Path) -> None:
    """Remove the complete integration-owned image cache."""
    import shutil

    shutil.rmtree(directory, ignore_errors=True)


def safe_image_path(directory: Path, document_id: str) -> Path | None:
    """Return a cached image only for a valid, normalized document ID."""
    identifier = _document_id(document_id)
    if identifier is None or not re.fullmatch(r"[a-fA-F0-9-]{1,128}", identifier):
        return None
    return find_cached_image(directory, identifier)
