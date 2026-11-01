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

## Installation

1. Copy `custom_components/ploc_cellar` into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Go to **Settings → Devices & services → Add integration** and select **Ploc Cellar**.
4. Enter the PLOUD server URL, PLOUD access token and preferred language. The device identifier is generated automatically.

## Preparing the PLOUD access token

The integration requires the technical PLOUD access token. This is not the PLOC password, the PLOC session token, or the `ploud_token` field.

The Python PLOC/PLOUD client used to validate the protocol performs the preparation:

1. It signs in to the PLOC account using the PLOC email address and password.
2. It activates PLOUD for this client (`POST /ploud/activate`).
3. The response contains the PLOUD model, including `accessToken`. The client stores this value under `ploud_access_token` in its local state file.
4. The Python synchronization client then reuses that value as the `Token` field in `/sync/exec` requests.

The Python client's default state file is:

```text
~/.ploc_ploud_state.json
```

After activation with the Python client, display the value to enter in Home Assistant locally:

```bash
jq -r '.ploud_access_token' ~/.ploc_ploud_state.json
```

Copy that value into the integration's **PLOUD access token** field. Do not use `ploud_token` or the top-level `accessToken`: these are different fields. Do not publish or share the token. The `device` field in this file belongs to the Python client and must not be copied: Home Assistant generates its own device identity.

If the state file already exists, the Python client normally reuses its saved credentials and does not run activation again. The `~/.ploc_ploud_cellar.json` file is only the local inventory cache; it does not contain authentication credentials.

> The Home Assistant integration does not currently sign in to the PLOC account or activate PLOUD itself. This prerequisite is performed by the Python preparation client.

## Configuration

### Connection settings

Initial setup asks for the PLOUD server URL (default `https://ploud.ploc.co/v1`), the PLOUD access token and the response language (`fr` or `en`). A new device identifier is generated for each new installation. It is derived from the first five hexadecimal characters of a random UUID, following the five-character short format used by PLOC and validated with `sync/exec`. It is stored in the config entry and remains stable across reloads and reauthentication. Note: the first Python preparation client generated a full UUID for its own device; that separate identifier is not reused by Home Assistant.

Use **Reconfigure** to change the server URL. If PLOUD rejects the token, Home Assistant starts reauthentication so it can be replaced without removing the integration.

### Synchronization options

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
