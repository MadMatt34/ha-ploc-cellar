# Ploc Cellar

A Home Assistant custom integration for a **read-only** view of a PLOC wine cellar synchronized through PLOUD.

[Version française](README.fr.md)

## Requirements

- Home Assistant 2026.10.4 or newer.
- Python 3.14.2 or newer, as required by Home Assistant 2026.10.4.

## Features

- PLOUD remains the source of truth.
- Read-only incremental synchronization through `POST https://ploud.ploc.co/v1/sync/exec`, using `Objects={}`.
- Initial synchronization uses the validated bootstrap value `LastSyncTime=1`. Later synchronizations use the client-maintained Unix-millisecond cursor.
- Persistent local model containing the `Wine` references returned by PLOUD, racks and rack positions. PLOUD's declared stock (`Wine.bo`) is retained as raw data. Effective stock is reconstructed from `Orders` movements and physically placed bottles (`RackItems`): `max(0, Orders balance, bottles in cellar)`. This rule reproduces the `Stock` column of the supplied reference CSV for all 116 wine references analyzed. Diagnostics are separated into unlocated stock (`unlocated_bottles`), negative movement balances (`negative_movement_bottles`) and physical surplus (`physical_surplus_bottles`). Unlocated stock means that the movement-derived stock exceeds the number of bottles assigned to rack positions; it does not prove a bottle was removed without a declared outgoing movement. PLOUD data is never modified. Wine characteristics, including the winery name, are stored directly in each wine record. The `Owners` collection is used transiently to resolve owner UUIDs; no Owner lookup table is persisted. If an incremental Wine update references an Owner absent from the delta, or an Owner record without a display-name field, one full synchronization is requested to resolve it.
- Fourteen focused inventory, rack and diagnostic sensors; no entity is created for each wine, rack or position.
- Detailed inventory is returned on demand by the `ploc_cellar.get_inventory` action.
- Wine primary and cover photos are downloaded from PLOUD `Documents` for referenced wines, cached locally and served through an authenticated Home Assistant endpoint. Changed documents invalidate the cache; unreferenced or deleted documents are pruned, and removing the config entry deletes its image cache.
- UUIDs are normalized to their canonical lowercase form across Wine, Rack, RackItem, Order, Owner and deletion references; opaque non-UUID identifiers are trimmed without changing case.
- Differential and full synchronization are available through the two buttons on the **Ploc Cellar** device.
- One Ploc Cellar config entry is allowed per Home Assistant instance.
- No write operations are sent to PLOUD.

For detailed inventory formulas, synchronization rules and storage
integrity guarantees, see the [algorithm specification in French](docs/ALGORITHMES.md).

## Installation and first-time setup

1. Copy the `custom_components/ploc_cellar` folder into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Go to **Settings → Devices & services → Add integration** and select **Ploc Cellar**.
4. Enter your PLOC account email address and password.

You do not need to enter a technical token, device identifier or PLOUD server. The integration uses a fixed PLOUD server endpoint.

### Authentication and PLOUD activation

Home Assistant automatically performs the following operations:

1. Signs in to the PLOC account through `POST https://api.ploc.co/a/v3/signin`. The request uses the encryption and signature scheme employed by the PLOC application.
2. Activates PLOUD for the **Home Assistant** application through `POST https://api.ploc.co/v1/ploud/activate`, using the PLOC session token obtained in the previous step.
3. Retrieves the PLOUD access token returned by the activation endpoint.
4. Generates a UUID device identifier dedicated to this installation.
5. Stores the PLOUD access token and device identifier in the Home Assistant config entry. The language is not fixed in that entry: it is resolved automatically from the country configured in Home Assistant.
6. Runs the first read-only synchronization against the fixed PLOUD server.

The full UUID is stored locally. PLOUD requests send only its first five characters in the `Device` field and use that short identifier when calculating the request signature, matching the Android client's behavior.

The email address, password and PLOC session token are not stored in the config entry. The password is used only during initial authentication or reauthentication.

### Reauthentication

When Home Assistant requests reauthentication, enter the PLOC account email address and password again. The integration renews PLOUD activation and replaces the stored access token. The device identifier remains unchanged.

## Synchronization options

Open **Settings → Devices & services → Ploc Cellar → Configure** to change:

- **Synchronization interval**: 5 to 1,440 minutes; 240 minutes by default.
- **PLOUD response language**: `Automatic`, `Français` or `English`. In automatic mode (the default), francophone countries use `fr` and all other countries use `en`. When no country is configured in Home Assistant, its general language is used as a fallback (`fr` for French, `en` otherwise). The manual `Français` and `English` choices remain in force until `Automatic` is selected.

Saving the options reloads the config entry. The PLOUD server endpoint cannot be changed through the integration.

## Entities

All 14 sensors and two synchronization buttons are linked to the same **Ploc Cellar** device and use the same PLOUD coordinator. The integration does not create one entity per wine, rack or position.

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
## Actions

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

## Storage and privacy

Image files remain in the config entry's private cache and are served only to authenticated Home Assistant users. The cache is separate from the persisted inventory and does not cause any writes to PLOUD.

The PLOUD access token and device UUID are stored in the Home Assistant config entry. The password and PLOC session token are not stored.

The local inventory and its matching synchronization cursor are stored through Home Assistant's persistent `Store`. Received changes are applied to a candidate model and saved before replacing the in-memory model, so a failed storage write does not advance the active cursor.

The integration sends only the parameters required for synchronization and an empty `Objects` field. It does not send cellar objects or perform cellar modifications. PLOUD may still include reference collections in its response; the integration ignores collections it does not need. The `Owners` collection is processed only in memory to update `Wine.domain`. `Orders` movements are stored locally to calculate inventory diagnostics. Orders whose Wine reference is no longer present are retained as history and counted in `orders_without_wine`, but do not contribute to any known Wine stock. If an incremental Wine update references an Owner missing from the delta, the coordinator performs one full synchronization for resolution.

## Validation

CI runs Ruff, Hassfest, strict Pyright type analysis against the latest stable Home Assistant release available from PyPI, the unit test suite with pytest, and HACS integration validation.

These static checks do not replace end-to-end testing against a real Home Assistant instance and the PLOUD cellar.


## Lovelace cards

The optional Lovelace cards are maintained and released independently in the
[Ploc Cellar Cards repository](https://github.com/MadMatt34/ha-ploc-cellar-frontend).
That repository contains the card documentation, HACS Dashboard installation
instructions and frontend development workflow.
