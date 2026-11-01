# Ploc Cellar

A Home Assistant custom integration for a **read-only** view of a PLOC wine cellar synchronized through PLOUD.

[Version française](README.fr.md)

## Requirements

- Home Assistant 2026.8.2 or newer.
- Python 3.14.2 or newer (required by Home Assistant 2026.8.2).

## Features

- PLOUD remains the source of truth.
- Incremental synchronization through the existing PLOUD `POST /sync/exec` endpoint with `Objects={}`.
- Initial synchronization uses the validated `LastSyncTime=1` bootstrap value. Later requests use the client-maintained Unix-millisecond cursor.
- Complete local model retained in Home Assistant's persistent `Store`: wines (including zero-stock wines), racks, rack positions and reference data.
- One compact summary sensor; no entity is created for each wine, rack or position.
- Detailed inventory is returned on demand by `ploc_cellar.get_inventory`.
- Manual refresh through `ploc_cellar.sync`.
- No write operations are sent to PLOUD.

## Installation and first-time setup

1. Copy `custom_components/ploc_cellar` into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Go to **Settings → Devices & services → Add integration** and select **Ploc Cellar**.
4. Enter only your PLOC account email address and password.

Home Assistant automatically performs the following operations:

1. Generates a UUID device identifier dedicated to this installation.
2. Signs in to the PLOC account through `POST https://api.ploc.co/v1/signin`. The request uses the encryption and signature scheme employed by the PLOC application.
3. Activates PLOUD for the **Home Assistant** application through `POST /ploud/activate`, using the PLOC session token obtained in the previous step.
4. Extracts the PLOUD server URL and PLOUD access token returned by the API.
5. Stores the server, PLOUD token and device identifier in the Home Assistant config entry.
6. Runs the first read-only cellar synchronization.

The PLOC password and PLOC session token are not stored in the config entry. Only the information required for subsequent PLOUD synchronization is retained. The password is used only during initial authentication or reauthentication.

If authentication fails, check the PLOC credentials and the availability of PLOC/PLOUD services. The integration does not ask the user for a technical token and does not require the Python preparation client.

## Device identity

The Python client used to validate the protocol generated its device identifier with `str(uuid4())`, which is a full UUID. The integration follows the same mechanism: each new Home Assistant installation gets its own full UUID, stored in the config entry and reused for subsequent synchronization requests. Do not enter or copy an identifier from a phone or the Python client.

## Synchronization options

Open **Configure** to change the polling interval (5 to 1,440 minutes; default 15 minutes) and PLOUD response language (French or English). Saving options reloads the config entry. Manual synchronization remains available.

## Entity

- `sensor.ploc_cellar_inventory`: total bottle count.
- Attributes: stocked wines, rack count, occupied positions and a `stale` flag indicating whether the latest synchronization failed. The last synchronization time is included in the inventory action response.

The full wine list is deliberately not stored in sensor attributes. It remains in persistent storage and is returned only when requested.

## Actions

### `ploc_cellar.get_inventory`

A response action. Use `response_variable` in a script or automation.

A `config_entry_id` is required to identify the PLOUD connection. Home Assistant provides a config-entry selector restricted to Ploc Cellar. Optional filters are `search` (wine name, appellation, region, country, grapes or cuvée) and `color`.

```yaml
action: ploc_cellar.get_inventory
data:
  config_entry_id: YOUR_CONFIG_ENTRY_ID
  search: Condrieu
response_variable: cellar
```

The response includes global bottle and stocked-wine counts, the number of matching wines, racks, occupied positions, wine details and the last successful synchronization timestamp. Filtering does not change global totals.

### `ploc_cellar.sync`

Triggers an immediate synchronization:

```yaml
action: ploc_cellar.sync
data:
  config_entry_id: YOUR_CONFIG_ENTRY_ID
```

## Storage and privacy

The PLOUD access token and device identifier are stored in the Home Assistant config entry. The local inventory and matching synchronization cursor are stored through Home Assistant's persistent `Store`. Received changes are saved before replacing the in-memory model, so a failed storage write does not advance the active cursor.

The integration only requests synchronization data; it does not send cellar objects or perform cellar modifications.

## Development status

This integration is under active development. CI checks Ruff, Hassfest and strict Pyright type analysis against Home Assistant 2026.8.2 and the latest stable release. These static checks do not replace end-to-end testing against a real Home Assistant instance and the PLOUD cellar.
