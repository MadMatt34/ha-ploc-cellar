"""Config-entry deletion removes only its own persistent cellar data."""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any, cast

import ploc_cellar


class _FakeStore:
    """Capture the Home Assistant Store key and removal call."""

    def __init__(self, key: str) -> None:
        self.key = key
        self.removed = False

    async def async_remove(self) -> None:
        self.removed = True


class _FakeHass:
    """Provide the path and executor APIs used by entry cleanup."""

    def __init__(self) -> None:
        self.removed_paths: list[Path] = []

    def config_path(self, *parts: str) -> str:
        return str(Path("/config").joinpath(*parts))

    async def async_add_executor_job(self, function: Any, *args: Any) -> Any:
        self.removed_paths.append(Path(args[0]))
        return function(*args)


def test_remove_entry_deletes_its_store_and_image_cache(
    monkeypatch: Any,
) -> None:
    """Deleting one entry removes its Store and image directory, not another."""
    stores: list[_FakeStore] = []
    removed_image_caches: list[Path] = []

    def store_factory(
        hass: Any,
        version: int,
        key: str,
        *,
        atomic_writes: bool,
    ) -> _FakeStore:
        assert version == 1
        assert atomic_writes is True
        store = _FakeStore(key)
        stores.append(store)
        return store

    monkeypatch.setattr(ploc_cellar, "Store", store_factory)
    monkeypatch.setattr(
        ploc_cellar,
        "remove_image_cache",
        lambda path: removed_image_caches.append(path),
    )

    class Config:
        @staticmethod
        def path(*parts: str) -> str:
            return str(Path("/config").joinpath(*parts))

    hass = _FakeHass()
    hass.config = Config()
    entry = type("Entry", (), {"entry_id": "entry-to-remove"})()

    asyncio.run(ploc_cellar.async_remove_entry(cast(Any, hass), cast(Any, entry)))

    assert len(stores) == 1
    assert stores[0].key == "ploc_cellar.cellar.entry-to-remove"
    assert stores[0].removed is True
    assert removed_image_caches == [
        Path("/config/.storage/ploc_cellar/entry-to-remove")
    ]
