# Ploc Cellar

A Home Assistant custom integration for a **read-only** view of a PLOC wine cellar synchronized through PLOUD.

[Version française](README.fr.md)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.10.4%2B-blue)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Custom%20repository-blue)](https://www.hacs.xyz/docs/faq/custom_repositories/)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Ploc Cellar](https://raw.githubusercontent.com/MadMatt34/ha-ploc-cellar/main/custom_components/ploc_cellar/brand/logo.png)

## Documentation

- [Technical documentation index](docs/README.md) / [French](docs/README.fr.md)
- [Inventory algorithms](docs/ALGORITHMS.md) / [French](docs/ALGORITHMS.fr.md)
- [PLOUD field mapping](docs/PLOUD_FIELD_MAPPING.md) / [French](docs/PLOUD_FIELD_MAPPING.fr.md)
- [Test strategy](docs/TESTS.md) / [French](docs/TESTS.fr.md)
- [Backend/frontend compatibility matrix and release policy](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.md)

## Requirements

- Home Assistant 2026.10.4 or newer.
- Python 3.14.2 or newer, as required by Home Assistant 2026.10.4.

## Features

- PLOUD remains the source of truth; the integration is read-only and sends no cellar mutations.
- Incremental synchronization uses `POST https://ploud.ploc.co/v1/sync/exec` with `Objects={}`. The initial bootstrap uses the validated `LastSyncTime=1`; later requests use the client-maintained Unix-millisecond cursor.
- The local persistent model stores wine references, racks, physical rack positions, movements and indexed reference collections. Wine characteristics, including winery/domain, are stored on each wine record. PLOUD's raw `Wine.bo` is retained as informational data.
- Effective stock is reconstructed from `Orders` movements and physically placed bottles (`RackItems`): `max(0, movement balance, bottles in cellar)`. Diagnostics separately report unlocated stock, negative movement balances and physical surplus. Unlocated stock does not prove that a bottle was removed without a declared outgoing movement.
- Fourteen inventory, rack and diagnostic sensors are provided; no entity is created per wine, rack or position.
- Detailed inventory is available on demand through `ploc_cellar.get_inventory`.
- Wine photos are downloaded from referenced PLOUD `Documents`, cached privately and served through an authenticated Home Assistant endpoint. Changed documents invalidate cache entries; deleted or unreferenced documents are pruned.
- Differential and full synchronization buttons are available on the Ploc Cellar device.
- UUIDs are normalized to canonical lowercase form; opaque identifiers are trimmed without case changes.
- Multiple config entries are supported, each with its own account, device, coordinator, persisted inventory and image cache.
- No write operation is sent to PLOUD.

## Installation

### HACS (recommended)

1. In HACS, open **Custom repositories**.
2. Add `MadMatt34/ha-ploc-cellar` and select the **Integration** category.
3. Install **Ploc Cellar**.
4. Restart Home Assistant, then go to **Settings → Devices & services → Add integration** and select **Ploc Cellar**.

The repository is a HACS custom integration and is not part of the default HACS catalog.

### Manual installation

1. Copy `custom_components/ploc_cellar` into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Add **Ploc Cellar** from **Settings → Devices & services → Add integration**.

### First setup and accounts

Enter the PLOC account email and password. No technical token, device ID or server URL is required. Home Assistant authenticates to PLOC, activates PLOUD for the Home Assistant application, stores the returned access token and a per-entry UUID device identifier, then starts the initial read-only sync. The full UUID stays local; requests use its first five characters as the PLOUD `Device` identifier.

Email, password and PLOC session token are not retained in the config entry. Password is used only for setup or reauthentication. Add additional accounts as separate config entries; each remains isolated. During reauthentication, provide the account credentials again; the device identifier is retained.

## Configuration

Open **Settings → Devices & services → Ploc Cellar → Configure**.

- **Synchronization interval:** 5–1,440 minutes; 240 minutes by default.
- **PLOUD response language:** Automatic, Français or English. Automatic selects French for francophone countries and English otherwise; if no country is configured, Home Assistant's general language is used as a fallback. Manual language selection takes precedence until Automatic is selected.

The PLOUD endpoint is fixed and cannot be changed in options.

## Entities and controls

Each config entry creates a separate **Ploc Cellar** device with 14 sensors and two synchronization buttons. Sensors cover physical cellar bottles, reconstructed stock, stocked wine references, references physically in the cellar, rack count/capacity/availability, stock diagnostics and last successful synchronization. Movement-derived values are `unknown` until a complete `Orders` snapshot is validated. Physical counts remain available.

The last-successful-sync sensor retains its timestamp after a failed later sync and sets `stale` to true; a successful sync clears it. Home Assistant generates entity IDs from the instance's naming format. Existing registry IDs are preserved; use **Recreate entity IDs** from the device menu to regenerate them with the current format.

The differential button applies changes since the saved cursor. The full-sync button requests a complete snapshot and rebuilds the local inventory; the validated inventory remains available until the new snapshot has been validated and persisted. Both buttons can be used with the standard `button.press` action.

## Inventory action

The response action `ploc_cellar.get_inventory` requires `config_entry_id` and accepts optional `search` and `color` filters. Search covers wine name, winery, appellation, region, country, grapes, cuvée and comment. Use `response_variable` in a script or automation.

The response includes global totals and diagnostics, rack and position details, matching wines, `wine_diagnostics`, `stock_reconstruction_complete`, `stale` and `last_sync`. The frontend repository's [backend contract](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.md) documents the response fields and nullability. Filtered results do not change global totals.

## Synchronization and frontend notifications

After a sync has been validated, persisted and committed, the integration fires `ploc_cellar_sync_completed` for administrator automations. It includes the config-entry ID, last-sync timestamp, trigger, actual sync type, changed object IDs and change counts. No event is emitted for a failed sync.

Frontend cards refresh through the entry-scoped `ploc_cellar/subscribe_sync` WebSocket notification instead of the admin-only event. The notification payload is empty and only signals that inventory is ready; the card then calls `ploc_cellar.get_inventory`. The backend validates the loaded config entry and cleans subscriptions on unsubscribe or WebSocket disconnect. No polling or entity ID is required.

## Storage and privacy

Inventory and synchronization cursor are persisted transactionally through Home Assistant's `Store`. Changes are applied to a candidate model and saved before replacing the active model, so a failed save does not advance the in-memory cursor. Reference collections are persisted for incremental resolution; raw Owner records are transient, with resolved winery names stored on Wine. Orders history is retained for diagnostics, including movements referencing unknown/deleted wines.

Image files are stored in the entry's private cache and served only to authenticated Home Assistant users. The PLOUD access token and device UUID are stored per config entry; passwords and PLOC session tokens are not stored. Debug logs may contain raw cellar records and should be anonymized before sharing.

## Validation

CI runs Ruff, Hassfest, strict Pyright, tests and HACS validation. The test suite uses deterministic HTTP doubles and does not contact real PLOC/PLOUD accounts. CI tests the declared minimum Home Assistant version (2026.10.4) and latest stable. Passing CI does not replace a live Home Assistant installation test or validate current private PLOUD service availability.

## Lovelace cards

The separate [Ploc Cellar frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend) provides overview, inventory and rack cards. The backend exposes an authenticated image endpoint and inventory action; cards refresh on the entry-scoped WebSocket sync signal. See the frontend README and the [compatibility policy](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.md) for supported pairs.

## Troubleshooting

- **Authentication fails:** verify PLOC credentials and Home Assistant connectivity to PLOC/PLOUD.
- **Stock sensors show `unknown`:** movement-derived stock remains unavailable until a complete `Orders` snapshot has been validated; physical counts may still be available.
- **Last sync is stale:** a later synchronization failed; the last validated inventory is retained. Review Home Assistant logs and run synchronization from the Ploc Cellar device.
- **Frontend cards do not refresh:** update the frontend and confirm that the card is using the same Ploc Cellar config entry.

When reporting an issue, include Home Assistant and integration versions, relevant logs and reproduction steps. Never include passwords or access tokens. Debug logs may include raw cellar data; anonymize them before sharing.

## Uninstallation

1. Remove the Ploc Cellar config entry from **Settings → Devices & services**.
2. Uninstall the integration through HACS, or remove `custom_components/ploc_cellar` if installed manually.
3. Restart Home Assistant.

Removing the config entry also removes its persistent inventory snapshot and private wine-image cache.

## License and disclaimer

Distributed under the [MIT License](LICENSE).

Ploc Cellar is an independent, unofficial project, not affiliated with, endorsed by or supported by PLOC or PLOUD. It relies on private, undocumented PLOUD interfaces discovered through independent technical research; these are not an official API specification and may change without notice.
