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
- Persistent local model containing the `Wine` references returned by PLOUD, racks and rack positions. PLOUD's declared stock (`Wine.bo`) is retained as raw data. Effective stock is reconstructed from `Orders` movements and physically placed bottles (`RackItems`): `max(0, Orders balance, bottles in cellar)`. This rule reproduces the `Stock` column of the supplied reference CSV for all 116 wine references analyzed. Unplaced bottles (`bottles_to_store`) are the difference between this effective stock and the in-cellar quantity. Differences between `Wine.bo` and the reconstructed value are exposed as movement warnings; PLOUD data is never modified. Wine characteristics, including the winery name, are stored directly in each wine record. The `Owners` collection is used transiently to resolve owner UUIDs; no Owner lookup table is persisted. If an incremental Wine update references an Owner absent from the delta, one full synchronization is requested to resolve it.
- One compact summary sensor; no entity is created for each wine, rack or position.
- Detailed inventory is returned on demand by the `ploc_cellar.get_inventory` action.
- Immediate synchronization is available through the `ploc_cellar.sync` action.
- One Ploc Cellar config entry is allowed per Home Assistant instance.
- No write operations are sent to PLOUD.

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

## Entity

The integration creates one summary sensor:

- `sensor.ploc_cellar_inventory`: number of bottles assigned to cellar positions (derived from `RackItems`).

Its attributes are:

| Attribute ID | Description |
|---|---|
| `wine_references` | Number of references with positive effective stock |
| `stocked_wines` | Number of wine references with at least one cellar position |
| `total_stock_bottles` | Total reconstructed bottle count |
| `bottles_to_store` | Number of unplaced bottles |
| `inventory_error_wines` | Number of references with unplaced bottles |
| `inventory_error_count` | Number of references with unplaced bottles |
| `movement_warning_wines` | Number of references with movement anomalies |
| `movement_warning_bottles` | Sum of absolute bottle discrepancies between movements and effective stock |
| `rack_count` | Number of racks |
| `total_positions` | Total number of physical rack positions |
| `empty_positions` | Number of empty rack positions |
| `occupied_positions` | Number of positions occupied by stocked wines |
| `stale` | Indicates that the latest synchronization failed |
| `last_successful_sync` | Date and time of the last successful synchronization (ISO 8601) |

Attribute labels are translated using the Home Assistant language. If synchronization fails, the last known local inventory is retained and `stale` indicates that the data may be outdated. A successful synchronization resets this flag to `false`.

The full wine list is deliberately not stored in sensor attributes. It remains in persistent storage and is returned only when requested.

## Actions

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

- global totals: `total_bottles` and `stocked_wines` describe the physical cellar contents; `total_stock_bottles` describes reconstructed effective stock; `bottles_to_store`, `inventory_error_wines` and `inventory_error_count` report unplaced bottles and anomalies;
- `rack_count`, `total_positions`, `occupied_positions` and `empty_positions`, the number of racks and the position breakdown;
- `matching_wines`, the number of wines matching the filters;
- `racks`, the list of racks;
- `wines`, only wines with positive effective stock, including `bottles` (reconstructed effective stock), `ploud_bottles` (raw `Wine.bo` value), `bottles_in_cellar` (in-cellar), `bottles_to_store` (unplaced), `purchased`, `consumed`, `movement_balance`, `calculated_stock`, `inventory_errors` (unplaced bottles) and `movement_warnings` (differences between movement balance and effective stock);
- `movement_anomalies`, the dedicated list of the 7 references whose movements do not match effective stock, including zero-stock references;
- `last_sync`, the date and time of the last successful synchronization.

`inventory_errors` contains `unplaced_bottles` when a reference has bottles that are not assigned to a rack. References with movement discrepancies are listed separately in `movement_anomalies`, including those with zero effective stock; they are therefore not included in the normal `wines` list. `movement_warning_wines` counts these references and `movement_warning_bottles` sums the absolute bottle differences between movement balance and effective stock. Raw `Wine.bo` values are informational and do not determine effective stock or movement anomalies. No correction is sent to PLOUD. Filters do not change the global totals. Each wine location contains its rack name and ID, plus row and column when available.

### `ploc_cellar.sync`

Triggers an immediate read-only synchronization:

```yaml
action: ploc_cellar.sync
data:
  config_entry_id: YOUR_CONFIG_ENTRY_ID
```

## Storage and privacy

The PLOUD access token and device UUID are stored in the Home Assistant config entry. The password and PLOC session token are not stored.

The local inventory and its matching synchronization cursor are stored through Home Assistant's persistent `Store`. Received changes are applied to a candidate model and saved before replacing the in-memory model, so a failed storage write does not advance the active cursor.

The integration sends only the parameters required for synchronization and an empty `Objects` field. It does not send cellar objects or perform cellar modifications. PLOUD may still include reference collections in its response; the integration ignores collections it does not need. The `Owners` collection is processed only in memory to update `Wine.domain`. `Orders` movements are stored locally to calculate inventory diagnostics. If an incremental Wine update references an Owner missing from the delta, the coordinator performs one full synchronization for resolution.

## Validation

CI runs Ruff and Hassfest and performs strict Pyright type analysis against the latest stable Home Assistant release available from PyPI.

These static checks do not replace end-to-end testing against a real Home Assistant instance and the PLOUD cellar.
