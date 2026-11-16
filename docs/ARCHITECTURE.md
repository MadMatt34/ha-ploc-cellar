# Backend architecture and lifecycle

[Version française](ARCHITECTURE.fr.md)

This document describes the integration's internal boundaries and runtime lifecycle. User setup instructions are in the root [README](../README.md) and [French README](../README.fr.md).

## Component boundaries

The integration is a read-only Home Assistant client for PLOC/PLOUD. PLOUD remains the source of truth.

- `auth.py` handles PLOC sign-in and PLOUD activation.
- `ploud.py` implements PLOUD transport, request signing, response validation and conversion of source records.
- `models.py` defines the local inventory model and its serialization/integrity rules.
- `coordinator.py` owns synchronization, candidate-state construction, persistence and publication of successful updates.
- `sensor.py` and `button.py` expose summary entities and manual synchronization controls.
- `views.py` serves cached wine images through an authenticated Home Assistant endpoint.
- `services.yaml` and the service registration expose the response action `ploc_cellar.get_inventory`.
- `types.py` centralizes shared typed structures; `const.py` owns integration constants.

The frontend is a separate repository. It communicates with this integration through Home Assistant and does not call PLOC or PLOUD directly. The exact public service and notification contract is documented in the [frontend contract](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.md).

## Configuration-entry isolation

Each config entry owns its account activation data, coordinator, persistent inventory, synchronization cursor and private image cache. Multiple entries are supported; state must never leak between accounts.

The PLOUD access token and generated device UUID are retained in the Home Assistant config entry. The PLOC password and short-lived PLOC session token are not persisted. Reauthentication renews the PLOUD activation token while retaining the entry's device identity.

## Authentication boundary

The integration performs these operations during setup:

1. Sign in to the PLOC account through the PLOC authentication endpoint.
2. Use the resulting session token to activate PLOUD for the Home Assistant application.
3. validate the activation response and extract the PLOUD access token.
4. Generate a device UUID for this config entry and persist the activation data.
5. Start the first read-only synchronization.

The concrete endpoints and private request/signature details are intentionally treated as implementation details: the upstream interfaces are undocumented and may change. Do not describe them as a supported public API. The authoritative implementation is in `auth.py`, `ploud.py` and `const.py`.

## Synchronization lifecycle

A coordinator refresh can be initiated by the configured interval, the differential-sync button, or the full-sync button.

- Differential synchronization requests changes since the persisted PLOUD cursor.
- Full synchronization requests a complete snapshot and rebuilds the candidate inventory.
- A recovery full snapshot may be requested when a delta cannot be safely resolved against the local reference data.
- Changes are applied to a candidate model. Validation and persistent storage must succeed before the active in-memory inventory and cursor are replaced.
- A failed request, invalid payload or failed persistence must not publish a partially updated inventory or advance the active cursor.
- The last successfully committed inventory remains available after a later synchronization failure and is exposed as stale.

The exact merge rules, deletion handling, cursor semantics, stock reconstruction and cache lifecycle are specified in [ALGORITHMS.md](ALGORITHMS.md).

## Successful-update notifications

After a candidate inventory has been validated, persisted and committed, the integration:

- updates the coordinator's active data;
- emits the public `ploc_cellar_sync_completed` event for administrator automations;
- notifies entry-scoped frontend subscribers through the `ploc_cellar/subscribe_sync` WebSocket command.

The public event contains synchronization metadata and effective object-ID changes. The frontend subscription notification is deliberately empty and acts only as an invalidation signal; the card then calls `ploc_cellar.get_inventory`.

Home Assistant restricts custom-event subscriptions to administrators, so the frontend uses the dedicated authenticated WebSocket command rather than the public event. The payload, fields and lifecycle guarantees are defined in the [backend/frontend contract](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.md).

## Inventory and image storage

The inventory snapshot and its matching synchronization cursor are stored using Home Assistant's persistent Store. The image cache is separate, private to the config entry and served only through an authenticated endpoint.

Image downloads are best-effort and must not cause a valid inventory synchronization to fail. A document update changes the served image URL so clients can invalidate an existing browser object URL. Removing a config entry removes its inventory and image cache.

Cached-image lookup performs synchronous filesystem checks and directory scans. Async callers must dispatch these operations through Home Assistant's executor. The image synchronization path offloads each cache lookup, the authenticated image view offloads its safe-path lookup, and the `ploc_cellar.get_inventory` service dispatches the complete response-building operation once. This keeps filesystem access and response construction off the event loop while preserving the synchronous helper interfaces and avoiding one executor dispatch per wine image.

See [PLOUD_FIELD_MAPPING.md](PLOUD_FIELD_MAPPING.md) for source-to-model mapping and [ALGORITHMS.md](ALGORITHMS.md) for persistence and image lifecycle details.

## Maintenance invariants

- Never send cellar mutations to PLOUD.
- Keep config-entry data, inventory, cursors and caches isolated.
- Never advance the committed cursor before the matching inventory snapshot is persisted.
- Do not notify consumers before a successful commit.
- Preserve unresolved physical positions in physical totals; do not silently convert them into empty positions.
- Treat incomplete movement history as incomplete data, not as a zero stock.
- Keep the backend response contract synchronized with the frontend types, compile-time assertions and contract tests.
