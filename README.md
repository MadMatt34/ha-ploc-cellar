# Ploc Cellar

A Home Assistant custom integration for a **read-only** view of a PLOC wine cellar synchronized through PLOUD.

[Version française](README.fr.md)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.10.4%2B-blue)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Custom%20repository-blue)](https://www.hacs.xyz/docs/faq/custom_repositories/)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Ploc Cellar](https://raw.githubusercontent.com/MadMatt34/ha-ploc-cellar/main/custom_components/ploc_cellar/brand/logo.png)

## Documentation

- [Technical documentation index](docs/README.md)
- [Backend/frontend compatibility and release policy](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.md)

## Requirements

- Home Assistant 2026.10.4 or newer.

## Features

- Read-only access: PLOUD remains the source of truth and the integration never modifies cellar data.
- Automatic incremental synchronization, with manual incremental and full synchronization available from the integration device.
- Inventory, rack occupancy and stock-consistency diagnostics.
- Wine characteristics, food-pairing information and locally cached wine photos when available.
- Detailed inventory on demand through the ploc_cellar.get_inventory action.
- Multiple configuration entries, each with its own account, inventory and cache.

Stock is reconstructed from movements and physical rack positions. Diagnostics distinguish stock not assigned to a rack position, negative movement balances and physical surplus. See the [inventory algorithm documentation](docs/ALGORITHMES.md) for exact definitions.

## Installation

### HACS (recommended)

1. In HACS, open **Custom repositories**.
2. Add **MadMatt34/ha-ploc-cellar** and select the **Integration** category.
3. Install **Ploc Cellar**.
4. Restart Home Assistant.
5. Open **Settings → Devices & services → Add integration** and select **Ploc Cellar**.

### Manual installation

1. Copy the custom_components/ploc_cellar folder into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Add **Ploc Cellar** from **Settings → Devices & services → Add integration**.

### First setup and accounts

Enter your PLOC account email address and password when prompted. No technical token, device identifier or server URL is required. The integration activates PLOUD automatically and starts the initial synchronization.

Additional accounts can be added by setting up another Ploc Cellar integration entry. Each entry remains isolated. If Home Assistant requests reauthentication, enter the account email address and password again.

## Configuration

Open **Settings → Devices & services → Ploc Cellar → Configure**.

- **Synchronization interval:** 5 to 1,440 minutes; 240 minutes by default.
- **PLOUD response language:** Automatic, French or English. Automatic selects French for francophone countries and English otherwise, using the Home Assistant language as a fallback when no country is configured.

The PLOUD server endpoint is fixed and cannot be changed from the options.

## Entities and controls

Each configured account creates a **Ploc Cellar** device with inventory, rack and diagnostic sensors, plus two synchronization buttons. No separate entity is created for every wine, rack or position.

Sensors report physical occupancy, reconstructed stock, wine-reference counts, rack capacity, diagnostic quantities and the last successful synchronization. Stock-derived values remain unavailable until a complete movement history has been validated. If a later synchronization fails, the last valid inventory is retained and the last-sync sensor is marked stale.

Use the device buttons to request either a differential synchronization or a full refresh. Both can also be triggered with Home Assistant's standard button.press action.

## Inventory action

The response action ploc_cellar.get_inventory returns detailed cellar data for a selected configuration entry. It requires config_entry_id and accepts optional search and color filters. In scripts and automations, capture its response with response_variable.

The response includes cellar totals, racks, physical positions, matching wines, stock diagnostics and the last successful synchronization. See the [inventory service contract](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.md) for the exact response shape and nullability rules.

## Troubleshooting

- **Authentication fails:** check the PLOC account credentials and that Home Assistant can reach PLOC/PLOUD services.
- **Stock values are unknown:** they remain unavailable until a complete PLOUD movement snapshot has been validated. Physical rack and bottle counts may still be available.
- **The last synchronization is stale:** a later synchronization failed; the last validated inventory is retained. Check **Settings → System → Logs**, then retry from the Ploc Cellar device.
- **Frontend cards do not refresh:** check that the frontend is installed, compatible and configured for the same integration entry.

When reporting an issue, include the Home Assistant version, integration version, relevant log messages and reproduction steps. Never publish passwords or access tokens. Debug logs can contain raw cellar records; redact personal or cellar-specific information before sharing them.

## Uninstallation

1. Open **Settings → Devices & services → Ploc Cellar** and remove the configuration entry.
2. Uninstall **Ploc Cellar** from HACS, or remove the custom_components/ploc_cellar folder if installed manually.
3. Restart Home Assistant.

Removing a configuration entry also removes its local inventory snapshot and private wine-image cache.

## License and disclaimer

This project is distributed under the [MIT License](LICENSE).

Ploc Cellar is an independent, unofficial project. It is not affiliated with, endorsed by or supported by PLOC or PLOUD. The backend relies on private, undocumented PLOUD interfaces reconstructed through independent technical research; they are not an official API specification and may change without notice.
