"""Cellar coordinator and persistent Home Assistant storage."""
from __future__ import annotations

import asyncio
import hashlib
import logging
from copy import deepcopy
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any
from urllib.parse import quote

from aiohttp import ClientSession
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import (
    CELLAR_DATA_VERSION,
    DOMAIN,
    SIGNAL_SYNC_COMPLETED,
    ORDERS_STORAGE_VERSION,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .images import async_sync_images, find_cached_image
from .models import Cellar, JsonValue, normalize_identifier
from .ploud import (
    PloudAuthError,
    PLOUDCollections,
    PloudError,
    PloudIncompleteDelta,
    apply_sync,
    async_sync,
)
from .types import PlocCellarConfigEntry

_LOGGER = logging.getLogger(__name__)
_IMAGE_SYNC_TIMEOUT_SECONDS = 10

def _log_stock_diagnostics(stage: str, cellar: Cellar) -> None:
    """Log the stock inputs and derived diagnostics for every wine."""
    if not _LOGGER.isEnabledFor(logging.DEBUG):
        return

    _LOGGER.debug(
        "Stock diagnostics snapshot (%s): wines=%d, rack_items=%d, orders=%d, "
        "stock_reconstruction_complete=%s",
        stage,
        len(cellar.wines),
        len(cellar.rack_items),
        len(cellar.orders),
        cellar.stock_reconstruction_complete,
    )
    for wine in cellar.wines.values():
        stock = cellar.stock_for(wine)
        _LOGGER.debug(
            "Stock diagnostics wine (%s): id=%s, name=%r, bottles=%d, "
            "physical=%d, purchased=%s, consumed=%s, movement_balance=%s, "
            "calculated_stock=%s, effective_stock=%d, unlocated=%s, "
            "negative_movement=%s, physical_surplus=%s",
            stage, wine.id, wine.name, wine.bottles, wine.bottles_in_cellar,
            stock.purchased, stock.consumed, stock.movement_balance,
            stock.calculated_stock, stock.effective_stock,
            stock.unlocated_bottles, stock.negative_movement_bottles,
            stock.physical_surplus_bottles,
        )


def _validate_full_sync(objects: PLOUDCollections) -> None:
    """Require the complete set of collections needed for a full cellar sync."""
    collection_names = {name.casefold() for name in objects}
    required = {"wines", "racks", "rackitems", "orders", "owners"}
    if not required.issubset(collection_names):
        raise PloudError(
            "Full PLOUD sync is missing one or more cellar collections"
        )


def _build_sync_changes(
    before: Cellar,
    after: Cellar,
) -> dict[str, dict[str, list[str]]]:
    """Return effective additions, updates and deletions by cellar collection."""
    collections = (
        ("wines", before.wines, after.wines),
        ("racks", before.racks, after.racks),
        ("rack_items", before.rack_items, after.rack_items),
        ("orders", before.orders, after.orders),
    )
    changes: dict[str, dict[str, list[str]]] = {}
    for name, previous, current in collections:
        previous_ids = previous.keys()
        current_ids = current.keys()
        added = sorted(current_ids - previous_ids)
        deleted = sorted(previous_ids - current_ids)
        updated = sorted(
            identifier for identifier in previous_ids & current_ids
            if previous[identifier] != current[identifier]
        )
        changes[name] = {"added": added, "updated": updated, "deleted": deleted}
    return changes


class PlocCellarCoordinator(DataUpdateCoordinator[Cellar]):
    """Fetch PLOUD deltas and publish the shared cellar model."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: PlocCellarConfigEntry,
        session: ClientSession,
        server: str,
        token: str,
        device: str,
        language: str,
        scan_interval: timedelta,
    ) -> None:
        super().__init__(
            hass,
            logger=_LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=scan_interval,
            always_update=False,
        )
        self.session = session
        self.entry_id = entry.entry_id
        self.image_directory = Path(
            hass.config.path(".storage", DOMAIN, entry.entry_id, "images")
        )
        self.server = server
        self.token = token
        self.device = device
        self.language = language
        self.store: Store[dict[str, JsonValue]] = Store(
            hass,
            STORAGE_VERSION,
            f"{STORAGE_KEY}.{entry.entry_id}",
            atomic_writes=True,
        )
        self.cellar = Cellar()
        self._force_full_sync = False
        self._sync_trigger = "recurring"

    async def _async_save_verified(self, data: dict[str, JsonValue]) -> None:
        """Persist a snapshot atomically and verify it can be read back.

        Home Assistant Store.async_save logs some write errors instead of
        propagating them. Reading the just-written payload back is therefore
        required before committing the in-memory model or advancing its cursor.
        """
        if self.hass.is_stopping:
            raise HomeAssistantError(
                "Home Assistant is stopping; storage was not saved"
            )

        await self.store.async_save(data)
        # Store.async_save queues a final write and returns without writing to
        # disk when Home Assistant has already entered its stopping state.
        # Store.async_load can then return that pending in-memory payload, so
        # read-back equality alone is not proof of durability.
        if self.hass.is_stopping:
            raise HomeAssistantError(
                "Home Assistant started stopping before the storage write completed"
            )

        persisted = await self.store.async_load()
        if self.hass.is_stopping:
            raise HomeAssistantError(
                "Home Assistant started stopping before storage verification completed"
            )
        if persisted != data:
            raise HomeAssistantError(
                "Ploc Cellar storage write could not be verified"
            )

    async def async_load(self) -> None:
        """Restore the model and its matching incremental cursor."""
        try:
            stored = await self.store.async_load()
            if stored is None:
                return
            try:
                self.cellar = Cellar.from_storage(stored)
            except ValueError as err:
                if stored.get("version") not in (
                    1,
                    2,
                    3,
                    4,
                    5,
                    ORDERS_STORAGE_VERSION,
                    CELLAR_DATA_VERSION,
                ):
                    raise
                # Do not trust or overwrite a malformed known snapshot.
                # Keep its file untouched and recover from a complete PLOUD
                # snapshot before persisting a replacement.
                self.cellar = Cellar(stale=True)
                self._force_full_sync = True
                _LOGGER.error(
                    "Stored Ploc Cellar data is incomplete or invalid; "
                    "the cached inventory is withheld and a full PLOUD sync "
                    "will be required before replacing the stored snapshot: %s",
                    err,
                )
                return

            if stored.get("version") != CELLAR_DATA_VERSION:
                try:
                    await self._async_save_verified(self.cellar.to_storage())
                except (HomeAssistantError, OSError, TypeError, ValueError) as err:
                    # Keep the migrated in-memory snapshot available. The
                    # next successful sync will persist it transactionally.
                    _LOGGER.warning(
                        "Could not persist migrated Ploc Cellar storage: %s",
                        err,
                    )
        except (HomeAssistantError, OSError, ValueError, TypeError) as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="invalid_storage",
            ) from err

    async def _async_update_data(self) -> Cellar:
        """Apply a PLOUD delta and persist it before publishing the new model."""
        sync_trigger = self._sync_trigger
        previous_cellar = self.cellar
        try:
            cursor = (
                1
                if self._force_full_sync or not self.cellar.initialized
                else self.cellar.cursor
            )
            _LOGGER.info(
                "Starting PLOUD %s synchronization (LastSyncTime=%d)",
                "full" if cursor == 1 else "incremental",
                cursor,
            )
            objects, next_cursor = await async_sync(
                self.session,
                server=self.server,
                token=self.token,
                device=self.device,
                language=self.language,
                cursor=cursor,
            )
            full_sync = cursor == 1
            _LOGGER.info(
                "PLOUD response received: %s",
                ", ".join(
                    f"{name}={len(records)}" for name, records in objects.items()
                ) or "no supported collections",
            )
            _log_stock_diagnostics("before sync application", self.cellar)
            if full_sync:
                _validate_full_sync(objects)

            # A full PLOUD response is a snapshot, not a delta. Start from an
            # empty model so wines absent from that snapshot cannot survive.
            updated_cellar = Cellar() if full_sync else deepcopy(self.cellar)
            recovery_reason: str | None = None
            unresolved_owner_ids: set[str]
            try:
                unresolved_owner_ids = apply_sync(
                    updated_cellar, objects, next_cursor, full_snapshot=full_sync
                )
            except PloudIncompleteDelta as err:
                if full_sync:
                    raise PloudError(
                        "Full PLOUD snapshot contains incomplete records"
                    ) from err
                unresolved_owner_ids = set()
                recovery_reason = "incomplete delta records"

            if not full_sync and recovery_reason is None:
                has_orphaned_positions = bool(
                    updated_cellar.positions_without_rack
                    or updated_cellar.positions_with_unknown_wine
                )
                if unresolved_owner_ids or has_orphaned_positions:
                    reasons: list[str] = []
                    if unresolved_owner_ids:
                        reasons.append("Owner references")
                    if has_orphaned_positions:
                        reasons.append("RackItem references")
                    recovery_reason = " and ".join(reasons)

            if recovery_reason is not None and not full_sync:
                _LOGGER.info(
                    "Incremental PLOUD update requires a complete snapshot "
                    "(%s); requesting one full sync",
                    recovery_reason,
                )
                # Keep retrying a complete snapshot if this recovery attempt
                # fails; the preceding incremental delta is not committed.
                self._force_full_sync = True
                objects, next_cursor = await async_sync(
                    self.session,
                    server=self.server,
                    token=self.token,
                    device=self.device,
                    language=self.language,
                    cursor=1,
                )
                _validate_full_sync(objects)
                # The fallback is also a complete snapshot: discard both the
                # partial delta candidate and the previous committed model.
                updated_cellar = Cellar()
                try:
                    unresolved_owner_ids = apply_sync(
                        updated_cellar, objects, next_cursor, full_snapshot=True
                    )
                except PloudIncompleteDelta as err:
                    raise PloudError(
                        "Full PLOUD snapshot contains incomplete records"
                    ) from err
                full_sync = True

            try:
                updated_cellar.validate_rack_items(
                    allow_unresolved=not full_sync
                )
            except ValueError as err:
                message = (
                    "Full PLOUD snapshot contains unresolved RackItem references"
                    if full_sync
                    else "PLOUD delta contains invalid RackItem identifiers"
                )
                raise PloudError(message) from err

            if full_sync:
                # A full snapshot contains the authoritative complete Orders
                # collection, so stock-derived values are now safe to publish.
                updated_cellar.stock_reconstruction_complete = True

            if unresolved_owner_ids:
                _LOGGER.warning(
                    "Full PLOUD sync did not include %d referenced Owner record(s); "
                    "the winery name remains unresolved",
                    len(unresolved_owner_ids),
                )

            _log_stock_diagnostics("after sync application", updated_cellar)
            _LOGGER.info(
                "PLOUD %s sync applied: %d wines in cellar, %d bottles in "
                "cellar; %s wine references with stock, %s total bottles; "
                "%s wines with unlocated stock (%s bottles); "
                "%s wines with negative movement balance (%s bottles); "
                "%s wines with physical surplus (%s bottles); "
                "%d racks, %d occupied positions",
                "full" if full_sync else "incremental",
                updated_cellar.stocked_wines,
                updated_cellar.total_bottles,
                updated_cellar.wine_references,
                updated_cellar.total_stock_bottles,
                updated_cellar.unlocated_wines,
                updated_cellar.unlocated_bottles,
                updated_cellar.negative_movement_wines,
                updated_cellar.negative_movement_bottles,
                updated_cellar.physical_surplus_wines,
                updated_cellar.physical_surplus_bottles,
                len(updated_cellar.racks),
                updated_cellar.occupied_positions,
            )
            updated_cellar.last_sync = datetime.now(UTC).isoformat()
            updated_cellar.stale = False
            await self._async_save_verified(updated_cellar.to_storage())
            # The persisted inventory is now committed. Only then may image
            # cleanup remove files referenced by the previous snapshot.
            self.cellar = updated_cellar
            try:
                async with asyncio.timeout(_IMAGE_SYNC_TIMEOUT_SECONDS):
                    await async_sync_images(
                        self.hass,
                        self.session,
                        directory=self.image_directory,
                        server=self.server,
                        token=self.token,
                        device=self.device,
                        cellar=updated_cellar,
                        objects=objects,
                        last_sync_time=next_cursor,
                    )
            except TimeoutError:
                # Inventory is already committed. Bound image work so a large
                # or slow document batch cannot delay coordinator publication.
                _LOGGER.warning(
                    "PLOUD image cache update exceeded its %d-second budget; "
                    "remaining images will be retried on a later sync",
                    _IMAGE_SYNC_TIMEOUT_SECONDS
                )
            except (PloudError, OSError) as err:
                # Image availability must never prevent inventory refreshes.
                _LOGGER.warning("PLOUD wine image cache update failed: %s", err)
            except Exception:
                # Unexpected cache failures must not invalidate the already
                # persisted inventory snapshot.
                _LOGGER.exception(
                    "Unexpected PLOUD wine image cache update error; "
                    "inventory synchronization remains committed"
                )
            if full_sync:
                self._force_full_sync = False
            changes = _build_sync_changes(previous_cellar, updated_cellar)
            change_counts = {
                collection: {
                    operation: len(identifiers)
                    for operation, identifiers in operations.items()
                }
                for collection, operations in changes.items()
            }
            event_data: dict[str, Any] = {
                "config_entry_id": self.entry_id,
                "last_sync": updated_cellar.last_sync,
                "trigger": sync_trigger,
                "sync_type": "full" if full_sync else "incremental",
                "changes": changes,
                "change_counts": change_counts,
            }
            async_dispatcher_send(
                self.hass,
                f"{SIGNAL_SYNC_COMPLETED}_{self.entry_id}",
            )
            return updated_cellar
        except PloudAuthError as err:
            self.cellar.stale = True
            _LOGGER.warning("PLOUD authentication failed: %s", err)
            raise ConfigEntryAuthFailed from err
        except (PloudError, HomeAssistantError, OSError) as err:
            self.cellar.stale = True
            _LOGGER.exception("PLOUD synchronization failed: %s", err)
            raise UpdateFailed(str(err)) from err
        except Exception:
            # Keep unexpected parsing/model/storage failures visible in the
            # integration log; DataUpdateCoordinator otherwise exposes only
            # a generic failed-refresh status to manual service callers.
            self.cellar.stale = True
            _LOGGER.exception("Unexpected error during PLOUD synchronization")
            raise

    async def async_force_full_sync(self) -> Cellar:
        """Request a complete PLOUD snapshot without clearing current data first."""
        _LOGGER.info("Manual full PLOUD synchronization requested")
        self._force_full_sync = True
        self._sync_trigger = "forced_full"
        try:
            while self._force_full_sync:
                await self.async_refresh()
                if not self.last_update_success:
                    raise HomeAssistantError(
                        translation_domain=DOMAIN,
                        translation_key="sync_failed",
                    ) from self.last_exception
            return self.data
        finally:
            self._sync_trigger = "recurring"

    async def async_force_sync(self) -> Cellar:
        """Request an immediate refresh and report failure to the caller."""
        self._sync_trigger = "forced_incremental"
        try:
            await self.async_refresh()
            if not self.last_update_success:
                raise HomeAssistantError(
                    translation_domain=DOMAIN,
                    translation_key="sync_failed",
                ) from self.last_exception
            return self.data
        finally:
            self._sync_trigger = "recurring"


    def image_url(self, document_id: str) -> str | None:
        """Return the authenticated API URL when a PLOUD image is cached."""
        identifier = normalize_identifier(document_id)
        if not identifier:
            return None
        cached_image = find_cached_image(self.image_directory, identifier)
        if cached_image is None:
            return None
        cache_prefix = f"{hashlib.sha256(identifier.encode()).hexdigest()}-"
        image_version = cached_image.name.removeprefix(cache_prefix)
        return (
            f"/api/ploc_cellar/{self.entry_id}/images/"
            f"{quote(identifier, safe='')}?v={quote(image_version, safe='')}"
        )
