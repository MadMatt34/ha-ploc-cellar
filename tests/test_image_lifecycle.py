"""Config-entry image-cache lifecycle tests."""
from __future__ import annotations

import asyncio
from pathlib import Path
from types import SimpleNamespace
from typing import Any

import ploc_cellar as integration
from ploc_cellar.const import STORAGE_KEY, STORAGE_VERSION


class _FakeHass:
    """Provide only the path and executor APIs used by entry removal."""

    def __init__(self, config_dir: Path) -> None:
        self.config = SimpleNamespace(
            path=lambda *parts: str(config_dir.joinpath(*parts))
        )

    async def async_add_executor_job(self, function: Any, *args: Any) -> Any:
        return function(*args)


def test_removing_config_entry_deletes_only_its_image_cache(
    tmp_path: Path, monkeypatch: Any
) -> None:
    """Removing one entry deletes its cache without touching another entry."""
    removed_cache = tmp_path / ".storage" / "ploc_cellar" / "entry-1"
    retained_cache = tmp_path / ".storage" / "ploc_cellar" / "entry-2"
    (removed_cache / "images").mkdir(parents=True)
    retained_cache.mkdir(parents=True)
    (removed_cache / "images" / "wine.jpg").write_bytes(b"image")
    (retained_cache / "keep.txt").write_text("keep", encoding="utf-8")

    removed_stores: list[tuple[int, str, bool]] = []

    class _FakeStore:
        def __init__(
            self, hass: Any, version: int, key: str, *, atomic_writes: bool
        ) -> None:
            removed_stores.append((version, key, atomic_writes))

        async def async_remove(self) -> None:
            return None

    monkeypatch.setattr(integration, "Store", _FakeStore)

    asyncio.run(
        integration.async_remove_entry(
            _FakeHass(tmp_path),
            SimpleNamespace(entry_id="entry-1"),
        )
    )

    assert removed_stores == [(STORAGE_VERSION, f"{STORAGE_KEY}.entry-1", True)]
    assert not removed_cache.exists()
    assert (retained_cache / "keep.txt").read_text(encoding="utf-8") == "keep"
