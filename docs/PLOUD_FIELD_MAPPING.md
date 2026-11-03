# PLOUD field mapping

This document records the field mappings observed in the supplied local cellar
snapshot (116 wine records, 23 racks, 144 rack items, sync cursor and six stored
reference collections) and in the full PLOUD synchronization response, which
also returned 59 `Owners` records.

It distinguishes confirmed mappings from interpretations and fields that remain
unknown. Unknown fields are deliberately not exposed in the integration's
business model.

## Wine fields used by the integration

| PLOUD key / expanded field | Integration attribute | Meaning | Status / handling |
|---|---|---|---|
| `id` | `id` | Wine UUID | Confirmed |
| `nm` / `name` | `name` | Wine name | Confirmed |
| `bo` / `bottles` | `bottles` | Number of bottles | Confirmed; only values greater than zero are retained |
| `vi` / `vintage` | `vintage` | Vintage | Confirmed; zero becomes `None` |
| `appellation` | `appellation` | Appellation label | Expanded label used directly; reference ID `ap` is not stored |
| `color` | `color` | Color label | Expanded label used directly; reference ID `co` is not stored |
| `color_rgb` | `color_rgb` | RGB color triplet | In the supplied persisted snapshot this value was already calculated by the previous integration from the `colors` reference collection; it was not present in `ploud_reference_fields`. The refactored integration uses the exact nine RGB values from that snapshot as a local palette. |
| `classification` | `classification` | Classification label | Expanded label used directly; reference ID `cl` is not stored |
| `region` | `region` | Region label | Expanded label used directly; reference ID `rn` is not stored |
| `country` | `country` | Country label | Expanded label used directly; reference ID `cn` is not stored |
| `gr` / `grapes` | `grapes` | Grape varieties | Confirmed by matching the expanded field and compact field |
| `cu` / `cuvee` | `cuvee` | Cuvée | Confirmed by matching the expanded field and compact field |
| `cs` / `comment` | `comment` | User comment | Confirmed by the user; empty text becomes `None` |
| `de` | `alcohol_percent` | Alcohol percentage | Confirmed by the user; zero becomes `None` |
| `ti` | `service_temperature_min` | Minimum serving temperature | Confirmed by the user; zero becomes `None` |
| `to` | `service_temperature_max` | Maximum serving temperature | Confirmed by the user; zero becomes `None` |
| `bottle_format` | `bottle_format` | Bottle format label | Expanded label used directly; reference ID `vf` is not stored |
| `bottle_volume_l` | `bottle_volume_l` | Bottle volume in litres | Expanded value used directly |
| `pid` / `ploud_pid` | `ploud_pid` | PLOC product identifier | Confirmed by matching the compact and expanded fields; empty text becomes `None` |
| `ow` / `Owners.id` → `fullname` | `domain` | Winery / estate name | Owner UUID resolved through the `Owners` collection; the PLOC `Owner` model inherits the `Contact.fullname` display field; empty or unresolved names become `None` |

The legacy `ploud_reference_fields` dictionary is no longer part of the
`Wine` model or newly persisted data. Its confirmed values are extracted during
the storage migration.

## Reference collections

The supplied data includes the six general reference collections below. The
full synchronization response also returned 59 `Owners` records.

| Collection | Records | Legacy ID key | Expanded wine field |
|---|---:|---|---|
| `appellations` | 2,674 | `ap` | `appellation` |
| `bottleFormats` | 17 | `vf` | `bottle_format`, `bottle_volume_l` |
| `classifications` | 30 | `cl` | `classification` |
| `colors` | 9 | `co` | `color`, `color_rgb` |
| `countries` | 50 | `cn` | `country` |
| `regions` | 406 | `rn` | `region` |
| `Owners` | 59 | `id` | `ow` → `domain` |

The integration consumes the expanded wine fields and does not retain the six
general reference collections. It processes `Owners` to resolve each wine
`ow` UUID to its winery name. The resolved name is stored directly in the
`Wine` record; a compact UUID-to-name lookup is kept locally for incremental
Wine changes, but the full Owner records are not retained. The sync request
remains `Objects={}`, so other reference records may still be included in the
response; network traffic is not guaranteed to decrease.

The local RGB map reproduces all nine records from the supplied `colors`
reference collection and is keyed by the wine's `co` color identifier:

| `co` identifier | Color label in the supplied reference data | RGB |
|---|---|---|
| `8019` | Autre | `(153, 115, 85)` |
| `8020` | Blanc | `(255, 211, 116)` |
| `8021` | Effervescent | `(237, 214, 182)` |
| `8022` | Liquoreux | `(158, 195, 199)` |
| `10253` | Muté | `(65, 101, 138)` |
| `10254` | Orange | `(240, 142, 68)` |
| `8023` | Rosé | `(225, 136, 145)` |
| `8024` | Rouge | `(201, 25, 58)` |
| `721a2c41-cdcb-4629-a7fb-7c30ea2fbd87` | Sirop | `(34, 199, 129)` |

This keeps RGB resolution independent of the display language. The legacy stored
`color_rgb` value was derived from that collection by the previous integration;
the supplied `ploud_reference_fields` do not contain RGB values. An explicit RGB
triplet in a future Wine payload is accepted only when the color ID has no known
mapping. Unknown IDs without an explicit RGB value have no RGB value until the
local map is extended.

## Known technical or user-specific fields excluded from the Wine model

| PLOUD key | Observed content | Decision |
|---|---|---|
| `tg` | Examples include `moelleux,`, `vin doux`, `foie gras` | Tags; excluded by design |
| `ln` | `fr` on all 116 records | Language metadata; excluded |
| `im` | UUID-like image identifier | Image metadata; excluded |
| `iw`, `ih` | Image dimensions | Image metadata; excluded |
| `ci` | UUID-like identifier, present on 4 records | Possible secondary image identifier; exact meaning unknown |
| `cw`, `ch` | Dimensions, non-zero on 4 records | Likely dimensions associated with `ci`; interpretation not confirmed |

## Unknown or unconfirmed fields

These keys were present in the supplied snapshot but have no reliable mapping yet.
They are intentionally not exposed or persisted in the business model.

| PLOUD key | Observed values in supplied snapshot | Status |
|---|---|---|
| `ml` | Zero or positive integers (61 non-zero records) | Unknown; do not infer meaning from the numeric pattern |
| `no` | Zero or numeric identifiers (38 non-zero records) | Unknown |
| `ps` | `0`, `1`, `8`, `16` | Unknown code |
| `at` | Zero on 115 records; `2022` on one | Unknown |
| `re` | Empty on all records | Unknown / no usable sample |
| `ac`, `af`, `cf`, `ct`, `ep`, `it`, `lt`, `lg`, `nt` | Zero on all 116 records | Unknown; no non-zero sample |
| `fa` | `false` on all 116 records | Unknown boolean; no positive sample |

The compact keys `cn`, `rn`, `ap`, `vf`, `co` and `cl` are known
reference identifiers from the legacy payload. Their corresponding expanded
labels are used instead. They are not persisted as separate model attributes.

## Synchronization and storage behavior

- Only wine records with `bottles > 0` are kept in the local inventory.
- A wine update with `bottles = 0` removes the wine from the inventory and
  clears the `wine_id` from its rack positions while preserving each physical
  slot's ID, rack, row and column.
- A deleted wine also frees its assigned positions without deleting the slots.
- Deleting a rack removes its rack positions.
- Empty rack slots (rack items with an empty `wine_id`) are retained.
- The persistent cellar payload is migrated from schema versions 1 and 2 to
  version 3 when loaded. The migration resets the cursor to `1` once so the next
  synchronization receives all `Owners` records and resolves existing wine
  domains. The compact Owner UUID-to-name lookup is retained for incremental
  Wine updates, but raw Owner records are not stored. The migrated payload is
  saved immediately when possible; if that save fails, the migrated in-memory
  model remains usable and the next successful sync retries persistence.
  Existing wine characteristics, rack data and the last successful
  synchronization timestamp are retained. Legacy zero-stock wines are removed
  and their assigned rack positions are retained as empty slots during migration.
- The synchronization remains read-only and continues to send `Objects={}`.
