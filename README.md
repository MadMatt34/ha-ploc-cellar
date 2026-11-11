# Ploc Cellar

A Home Assistant custom integration for a **read-only** view of a PLOC wine cellar synchronized through PLOUD.

[Version française](README.fr.md)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.10.4%2B-blue)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Custom%20repository-blue)](https://www.hacs.xyz/docs/faq/custom_repositories/)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Ploc Cellar](https://raw.githubusercontent.com/MadMatt34/ha-ploc-cellar/main/custom_components/ploc_cellar/brand/logo.png)

## 📚 Documentation

- [Backend/frontend compatibility matrix and release policy](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.md)

- [Requirements](#requirements)
- [Features](#features)
- [Food-pairing data](#food-pairing-data)
- [Installation and first-time setup](#installation-and-first-time-setup)
- [Synchronization options](#synchronization-options)
- [Entities](#entities)
- [Actions and inventory response](#actions)
- [Synchronization event](#synchronization-event)
- [Storage and privacy](#storage-and-privacy)
- [Validation](#validation)
- [Lovelace cards](#lovelace-cards)
- [Troubleshooting](#troubleshooting)
- [Uninstallation](#uninstallation)
- [License and disclaimer](#license-and-disclaimer)


## 📋 Requirements

- Home Assistant 2026.10.4 or newer.
- Python 3.14.2 or newer, as required by Home Assistant 2026.10.4.

## ⚡ Features

- PLOUD remains the source of truth.
- Read-only incremental synchronization through `POST https://ploud.ploc.co/v1/sync/exec`, using `Objects={}`.
- Initial synchronization uses the validated bootstrap value `LastSyncTime=1`. Later synchronizations use the client-maintained Unix-millisecond cursor.
- Persistent local model containing the `Wine` references returned by PLOUD, racks and rack positions. PLOUD's declared stock (`Wine.bo`) is retained as raw data. Effective stock is reconstructed from `Orders` movements and physically placed bottles (`RackItems`): `max(0, Orders balance, bottles in cellar)`. This rule reproduces the `Stock` column of the supplied reference CSV for all 116 wine references analyzed. Diagnostics are separated into unlocated stock (`unlocated_bottles`), negative movement balances (`negative_movement_bottles`) and physical surplus (`physical_surplus_bottles`). Unlocated stock means that the movement-derived stock exceeds the number of bottles assigned to rack positions; it does not prove a bottle was removed without a declared outgoing movement. PLOUD data is never modified. Wine characteristics, including the winery name, are stored directly in each wine record. The six PLOUD reference collections are indexed and persisted locally so incremental Wine updates can resolve their compact IDs without requiring a full refresh. The `Owners` collection remains transient and is used only to resolve winery names. If an incremental Wine update references an Owner absent from the delta, or an Owner record without a display-name field, one full synchronization is requested to resolve it.
- Fourteen focused inventory, rack and diagnostic sensors; no entity is created for each wine, rack or position.
- Detailed inventory is returned on demand by the `ploc_cellar.get_inventory` action.
- Wine primary and cover photos are downloaded from PLOUD `Documents` for referenced wines, cached locally and served through an authenticated Home Assistant endpoint. Changed documents invalidate the cache; unreferenced or deleted documents are pruned, and removing the config entry deletes its image cache.
- UUIDs are normalized to their canonical lowercase form across Wine, Rack, RackItem, Order, Owner and deletion references; opaque non-UUID identifiers are trimmed without changing case.
- Differential and full synchronization are available through the two buttons on the **Ploc Cellar** device.
- Multiple Ploc Cellar config entries are supported. Each entry uses a PLOC/PLOUD account, Home Assistant device, coordinator, persistent inventory and image cache isolated from the others.
- No write operations are sent to PLOUD.

## 🍽️ Food-pairing data

PLOUD stores food-pairing associations in the `Wine.ml` field. The integration exposes this value as the optional raw integer `Wine.meals`; it does not translate, normalize or discard individual flags. It is a bitmask, so several categories can be present in one value by combining their flags with bitwise OR.

Identified PLOUD `Meals` flags:

| Bit value | Food category |
|---:|---|
| `1` | Aperitif |
| `2` | Soup |
| `4` | Starter |
| `8` | Pork and charcuterie |
| `16` | Seafood |
| `32` | Fish |
| `64` | White meat |
| `128` | Game |
| `256` | Poultry |
| `512` | Red meat |
| `1024` | Dishes with vegetables |
| `2048` | Cheese |
| `4096` | Dessert |
| `8192` | Spicy dishes |

The frontend maps these flags to localized labels in the wine detail dialog. A missing or null `meals` value means that no association data is available; it must not be interpreted as an explicit empty list.

The PLOUD Android application identifies `8192` as `foodtype8192` (spicy dishes). The frontend displays this confirmed flag as **Spicy dishes**. Other unknown bits must still be preserved by the backend and ignored by the frontend.

For detailed inventory formulas, synchronization rules and storage
integrity guarantees, see the [algorithm specification in French](docs/ALGORITHMES.md).

## 🧩 Installation and first-time setup

### HACS custom repository (recommended)

1. In HACS, open **Custom repositories**.
2. Add `MadMatt34/ha-ploc-cellar` and select the **Integration** category.
3. Install **Ploc Cellar** from HACS.
4. Restart Home Assistant, then open **Settings → Devices & services → Add integration** and select **Ploc Cellar**.

The repository is distributed as a HACS custom integration; it is not presented as part of the default HACS catalog.

### Manual installation


1. Copy the `custom_components/ploc_cellar` folder into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Go to **Settings → Devices & services → Add integration** and select **Ploc Cellar**.
4. Enter your PLOC account email address and password.

You do not need to enter a technical token, device identifier or PLOUD server. The integration uses a fixed PLOUD server endpoint. To add another PLOC account, repeat the integration setup and sign in with that account.

### Authentication and PLOUD activation

Home Assistant automatically performs the following operations:

1. Signs in to the PLOC account through `POST https://api.ploc.co/a/v3/signin`. The request uses the encryption and signature scheme employed by the PLOC application.
2. Activates PLOUD for the **Home Assistant** application through `POST https://api.ploc.co/v1/ploud/activate`, using the PLOC session token obtained in the previous step.
3. Retrieves the PLOUD access token returned by the activation endpoint.
4. Generates a UUID device identifier dedicated to this config entry.
5. Stores the PLOUD access token and device identifier in that Home Assistant config entry. Each account therefore has its own PLOUD device identifier. The language is not fixed in the entry: it is resolved automatically from the country configured in Home Assistant.
6. Runs the first read-only synchronization against the fixed PLOUD server.

The full UUID is stored locally. PLOUD requests send only its first five characters in the `Device` field and use that short identifier when calculating the request signature, matching the Android client's behavior.

The email address, password and PLOC session token are not stored in the config entry. The password is used only during initial authentication or reauthentication.

### Reauthentication

When Home Assistant requests reauthentication, enter the PLOC account email address and password again. The integration renews PLOUD activation and replaces the stored access token. The device identifier remains unchanged.

## ⚙️ Synchronization options

Open **Settings → Devices & services → Ploc Cellar → Configure** to change:

- **Synchronization interval**: 5 to 1,440 minutes; 240 minutes by default.
- **PLOUD response language**: `Automatic`, `Français` or `English`. In automatic mode (the default), francophone countries use `fr` and all other countries use `en`. When no country is configured in Home Assistant, its general language is used as a fallback (`fr` for French, `en` otherwise). The manual `Français` and `English` choices remain in force until `Automatic` is selected.

Saving the options reloads the config entry. The PLOUD server endpoint cannot be changed through the integration.

## 📊 Entities

Each config entry creates its own **Ploc Cellar** device with 14 sensors, two synchronization buttons and a dedicated PLOUD coordinator. Inventories, entity identities and caches remain isolated between accounts. The integration does not create one entity per wine, rack or position.

| Family | Entity name | Meaning |
|---|---|---|
| Inventory | Bottles in cellar | Bottles physically assigned to cellar positions (occupied `RackItems`). |
| Inventory | Total stock bottles | Total reconstructed stock: movement stock or physical stock, whichever is greater, including occupied positions with an unknown wine. |
| Inventory | Wine references in stock | Known wine references with positive effective stock. |
| Inventory | Wine references physically in cellar | Known wine references with at least one physical cellar position. |
| Racks | Number of racks | Number of known racks. |
| Racks | Total rack positions | Total physical rack positions. |
| Racks | Available rack positions | Empty rack positions. |
| Diagnostics | Unlocated bottles | Reconstructed bottles not assigned to a rack position. |
| Diagnostics | Wines with unlocated stock | Wine references with unlocated stock. |
| Diagnostics | Bottles with negative movement balance | Absolute total of negative incoming-minus-outgoing balances. |
| Diagnostics | Wines with negative movement balance | Wine references with a negative movement balance. |
| Diagnostics | Bottles in physical surplus | Physical bottles above non-negative movement stock. |
| Diagnostics | Wines with physical surplus | Wine references with a physical surplus. |
| Diagnostics | Last successful synchronization | Timestamp of the last successful synchronization; its `stale` attribute is true when a later synchronization has failed. |
| Buttons | Differential synchronization | Fetches changes since the saved PLOUD cursor. |
| Buttons | Full synchronization | Forces a complete PLOUD snapshot and rebuilds the local inventory. |

Movement-derived inventory and diagnostic sensors show `unknown` until a complete PLOUD `Orders` snapshot has been validated. Physical bottle and rack-position counts remain available. After a synchronization failure, the last successful timestamp is retained and the `stale` attribute on the last-sync sensor becomes true; a successful synchronization resets it to false.

The integration does not force entity IDs. Home Assistant generates them from the naming format configured on the instance (area, parent device, device and entity name). Existing entity IDs in the registry are preserved during upgrades. To regenerate them using the current format, use **Recreate entity IDs** from the device menu.
## 🔘 Actions

### Synchronization buttons

The two buttons are available on the **Ploc Cellar** device:

- the differential synchronization button applies changes since the last synchronization using the stored cursor.
- the full synchronization button requests a complete PLOUD snapshot and rebuilds the local inventory. The existing validated inventory remains available until the new snapshot has been validated and persisted.

Both buttons can also be used from an automation with the standard `button.press` action.

### `ploc_cellar.get_inventory`

A response action. Use `response_variable` in a script or automation.

A `config_entry_id` is required to identify the Ploc Cellar connection. Home Assistant provides a selector restricted to this integration's config entries. Optional filters are:

- `search`: partial match against wine name, winery, appellation, region, country, grape, cuvée or comment.
- `color`: partial match against the wine color.

Example:

```yaml
action: ploc_cellar.get_inventory
data:
  config_entry_id: YOUR_CONFIG_ENTRY_ID
  search: Condrieu
response_variable: cellar
```

The response contains:

- global totals: `total_bottles` counts all physically occupied positions; `stocked_wines` counts known Wine references with at least one position; `total_stock_bottles` also includes occupied positions whose Wine reference is temporarily unknown; `orders_without_wine` counts retained movements for unknown or deleted wines (these movements are excluded from known-wine stock calculations); `unlocated_wines` and `unlocated_bottles` describe reconstructed stock not assigned to rack positions; `negative_movement_wines` and `negative_movement_bottles` describe negative movement balances; `physical_surplus_wines` and `physical_surplus_bottles` describe physical bottles above non-negative movement stock. These Orders-derived values are `null` while `stock_reconstruction_complete` is false;
- `rack_count`, `total_positions`, `occupied_positions` and `empty_positions`, the number of racks and the position breakdown; `positions_without_rack` and `positions_with_unknown_wine` report temporarily unresolved Rack or Wine references;
- `matching_wines`, the number of wines matching the filters;
- `racks`, the list of racks;
- `rack_items`, the complete list of physical positions, including empty positions and unresolved rack/wine references. Each item contains `id`, `rack_id`, `wine_id` (`null` when unassigned), `row` and `column`;
- `stale`, whether the displayed inventory is older than the last successful synchronization because a later synchronization failed;
- `wines`, normally only wines with positive effective stock. If reconstruction is incomplete, only known wines with physical bottles in rack positions are returned; their stock-derived quantities and diagnostics are `null`, as are global stock-derived totals;
- `wine_diagnostics`, the unfiltered list of all wines with at least one unlocated-stock, negative-movement or physical-surplus diagnostic, including wines with zero effective stock. Each entry includes purchased, consumed, movement balance, physical quantity, effective stock and all three diagnostic quantities. It is `null` while stock reconstruction is incomplete;
- `stock_reconstruction_complete`, whether a complete Orders snapshot is available;
- `last_sync`, the date and time of the last successful synchronization.

For each wine, `unlocated_bottles` is the difference between effective stock and physical bottles in rack positions; `negative_movement_bottles` is the absolute value of a negative incoming-minus-outgoing balance; and `physical_surplus_bottles` is the number of physical bottles above `max(0, movement_balance)`. These are separate diagnostics and may coexist for the same wine. Unlocated stock does not prove that a bottle was removed without declaring an outgoing movement: the bottle may never have been placed or may be stored outside the cellar. Raw `Wine.bo` values are informational and do not determine effective stock. No correction is sent to PLOUD. Filters do not change global totals. Each wine location contains its rack name and ID, plus row and column when available.

## 📡 Synchronization notification

After a synchronization has been successfully validated, persisted and committed to the active inventory, the integration emits an internal dispatcher signal scoped to that configuration entry. It no longer fires a custom event on the Home Assistant event bus.

Frontend cards subscribe through the `ploc_cellar/subscribe_sync` WebSocket command and provide the cellar's `config_entry_id`. The backend verifies that the Ploc Cellar entry exists and is loaded, then attaches the subscription to that entry's dedicated signal. Authenticated non-admin Home Assistant users can use this command; it does not require administrator privileges.

Each WebSocket notification has an intentionally empty payload (`{}`). It indicates only that a new inventory has been validated and persisted. It does not expose cellar data, object identifiers or synchronization details. The card then reads the inventory through the `ploc_cellar.get_inventory` response service. No notification is sent when synchronization fails or is not committed.

Home Assistant automatically removes the subscription when the client unsubscribes or its WebSocket connection closes. Signals are isolated by `config_entry_id`, so a synchronization notifies only clients subscribed to the corresponding cellar.

## 🔐 Storage and privacy

Image files remain in the config entry's private cache and are served only to authenticated Home Assistant users. The cache is separate from the persisted inventory and does not cause any writes to PLOUD.

The PLOUD access token and device UUID are stored separately in each Home Assistant config entry. The password and PLOC session token are not stored.

The local inventory and its matching synchronization cursor are stored through Home Assistant's persistent `Store`. Received changes are applied to a candidate model and saved before replacing the in-memory model, so a failed storage write does not advance the active cursor.

The integration sends only the parameters required for synchronization and an empty `Objects` field. It does not send cellar objects or perform cellar modifications. The six reference collections (`appellations`, `bottleFormats`, `classifications`, `colors`, `countries` and `regions`) are indexed and persisted in the local snapshot for incremental reference resolution. The `Owners` collection is processed only in memory to update `Wine.domain`; raw Owner records are not persisted. `Orders` movements are stored locally to calculate inventory diagnostics. Orders whose Wine reference is no longer present are retained as history and counted in `orders_without_wine`, but do not contribute to any known Wine stock. If an incremental Wine update references an Owner missing from the delta, the coordinator performs one full synchronization for resolution.

## 🧪 Validation

CI runs Ruff and Hassfest, then executes strict Pyright and the pytest suite against both the declared minimum Home Assistant version (2026.10.4) and the latest stable release. HACS integration validation runs separately.

These static checks do not replace end-to-end testing against a real Home Assistant instance and the PLOUD cellar.


## 🖥️ Lovelace cards

The optional Lovelace cards are maintained and released independently in the
[Ploc Cellar Cards repository](https://github.com/MadMatt34/ha-ploc-cellar-frontend).
That repository contains the card documentation, HACS Dashboard installation
instructions and frontend development workflow.


## 🛠️ Troubleshooting

- **The integration cannot be added or reauthenticated:** check the PLOC account email address and password, then retry the authentication flow.
- **Authentication succeeds but no cellar data appears:** confirm that PLOUD is activated for the Home Assistant application and that Home Assistant can reach the PLOC/PLOUD services.
- **Stock-related sensors show `unknown`:** movement-derived values remain unavailable until a complete `Orders` snapshot has been validated. Physical rack and bottle counts can still be available.
- **The last synchronization is marked stale:** the most recent synchronization failed; the last validated inventory is retained. Check **Settings → System → Logs** and retry a synchronization from the Ploc Cellar device.
- **The cards do not update after synchronization:** verify that the frontend version is current and that the card uses the intended Ploc Cellar configuration entry.

When opening an issue, include the Home Assistant version, integration version, relevant log messages and the steps needed to reproduce the problem. Never publish passwords, access tokens or other credentials.

## 🗑️ Uninstallation

1. Open **Settings → Devices & services → Ploc Cellar**.
2. Open the integration/device menu and remove the Ploc Cellar configuration entry.
3. If installed through HACS, uninstall **Ploc Cellar** from HACS.
4. If installed manually, remove `custom_components/ploc_cellar` from the Home Assistant configuration directory.
5. Restart Home Assistant.

Removing the configuration entry also removes its persistent cellar snapshot and private cached wine-image files.

When debug logging is enabled for this integration, PLOUD synchronization logs include raw wine, rack, rack-position and order records to support diagnostics. These records may contain personal or cellar-specific information; redact them before sharing logs publicly.

## ⚖️ License and disclaimer

This project is distributed under the [MIT License](LICENSE).

This integration relies on PLOUD interfaces that are **not part of a public, documented API**. Its implementation was developed through independent technical research, including analysis of PLOUD-related repositories, comparison of application backup files, examination of the official mobile application's behavior and other observations and tests. These findings are reverse-engineering work, not an official API specification; the private interfaces may change at any time and without notice. The owner of PLOC was contacted to discuss this work and the availability of an official interface, but no response had been received when this documentation was written.

Ploc Cellar is an independent, unofficial project. It is not affiliated with, endorsed by or supported by PLOC or PLOUD.
