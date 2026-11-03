# PLOUD field mapping

This document records the field mappings observed in the complete local cellar
snapshot supplied for the Ploc Cellar integration (116 wine records, 23 racks,
144 rack items, sync cursor and six reference collections).

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
| `color_rgb` | `color_rgb` | RGB color triplet | Used directly when present; known color palette is a fallback |
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

The legacy `ploud_reference_fields` dictionary is no longer part of the
`Wine` model or newly persisted data. Its confirmed values are extracted during
the storage migration.

## Reference identifiers no longer synchronized

The supplied snapshot contained these reference collections:

| Collection | Records in snapshot | Legacy ID key | Expanded wine field |
|---|---:|---|---|
| `appellations` | 2,674 | `ap` | `appellation` |
| `bottleFormats` | 17 | `vf` | `bottle_format`, `bottle_volume_l` |
| `classifications` | 30 | `cl` | `classification` |
| `colors` | 9 | `co` | `color`, `color_rgb` |
| `countries` | 50 | `cn` | `country` |
| `regions` | 406 | `rn` | `region` |

The integration now consumes the expanded wine fields and does not request or
persist these reference collections. The RGB fallback table is limited to color
labels observed in the supplied snapshot; it is not a replacement reference
synchronization mechanism.

## Known technical or user-specific fields excluded from the Wine model

| PLOUD key | Observed content | Decision |
|---|---|---|
| `ow` | Owner UUID | Excluded; owner information is not part of the integration model |
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
- A wine update with `bottles = 0` removes the wine and any rack positions
  assigned to it.
- A deleted wine also removes its assigned rack positions.
- Empty rack slots (rack items with an empty `wine_id`) are retained.
- The persistent cellar payload is migrated from schema version 1 to version 2.
  Existing wine characteristics, rack data, the incremental cursor and the
  last successful synchronization timestamp are retained. Legacy zero-stock
  wines and their assigned positions are dropped during migration.
- The synchronization remains read-only and continues to send `Objects={}`.
