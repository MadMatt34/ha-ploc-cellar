"""Config-entry image-cache lifecycle tests."""
from __future__ import annotations

import asyncio
from pathlib import Path
from types import SimpleNamespace
from typing import Any

from ploc_cellar import async_remove_entry


class _FakeHass:
    """Provide only the path and executor APIs used by entry removal."""

    def __init__(self, config_dir: Path) -> None:
        self.config = SimpleNamespace(
            path=lambda *parts: str(config_dir.joinpath(*parts))
        )

    async def async_add_executor_job(self, function: Any, *args: Any) -> Any:
        return function(*args)


def test_removing_config_entry_deletes_only_its_image_cache(tmp_path: Path) -> None:
    """Removing one entry deletes its cache without touching another entry."""
    removed_cache = tmp_path / ".storage" / "ploc_cellar" / "entry-1"
    retained_cache = tmp_path / ".storage" / "ploc_cellar" / "entry-2"
    (removed_cache / "images").mkdir(parents=True)
    retained_cache.mkdir(parents=True)
    (removed_cache / "images" / "wine.jpg").write_bytes(b"image")
    (retained_cache / "keep.txt").write_text("keep", encoding="utf-8")

    asyncio.run(
        async_remove_entry(
            _FakeHass(tmp_path),
            SimpleNamespace(entry_id="entry-1"),
        )
    )

    assert not removed_cache.exists()
    assert (retained_cache / "keep.txt").read_text(encoding="utf-8") == "keep"
