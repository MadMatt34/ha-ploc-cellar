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
| `bo` / `bottles` | `Wine.bottles` | PLOUD-declared stock | Retained as raw source data; not used alone as effective stock because it overstates the CSV reference for 16 wines in the supplied snapshot |
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
| `ml` | `Wine.meals` | Food-pairing association bitmask | Confirmed by the public PLOUD `Meals` flags enum; raw integer is preserved, including unknown bits |
| `ow` | `owner_id` | Owner UUID | Retained in the Wine record only as a technical reference, allowing later Owner updates to refresh the winery name |
| `Owners.id` → `fullname` | `domain` | Winery / estate name | Owner UUID is resolved from the current response; the name is stored directly in the matching Wine record. The PLOC `Owner` model inherits the `Contact.fullname` display field; empty or unresolved names become `None` |

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
general reference collections. It processes `Owners` transiently to resolve
each wine `ow` UUID to its winery name. The resolved name is stored directly
in the matching `Wine` record. No Owner lookup table or raw Owner record is
persisted. When an incremental Wine update references an Owner absent from
that delta, the coordinator requests one full synchronization (with
`LastSyncTime=1`) and reapplies that complete response. It does not infer
the name from another wine sharing the same Owner UUID. The sync request
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

## Stock, rack positions and inventory diagnostics

The integration also consumes the `Orders` and `RackItems` collections. These
collections have different meanings and must not be conflated.

### Order fields

The PLOUD server model identifies the following compact fields:

| PLOUD key | Integration attribute | Meaning | Handling |
|---|---|---|---|
| `id` | `Order.id` | Order UUID | Confirmed |
| `wi` | `Order.wine_id` | Associated Wine UUID | Confirmed |
| `in` | `Order.incoming` | Number of bottles entering stock | Confirmed |
| `ot` | `Order.outgoing` | Number of bottles leaving stock | Confirmed |

Other Order fields (date, occasion, vendor, comments, price, etc.) are not
needed for these stock calculations and are not copied into the integration's
Order model.

### RackItem fields

| PLOUD key | Integration attribute | Meaning | Handling |
|---|---|---|---|
| `id` | `RackItem.id` | Rack position record UUID | Confirmed |
| `rk` | `RackItem.rack_id` | Associated Rack UUID | Confirmed |
| `wi` | `RackItem.wine_id` | Associated Wine UUID | Confirmed |
| `rw` | `RackItem.row` | Row coordinate | Confirmed |
| `cl` | `RackItem.column` | Column coordinate | Confirmed |

Each RackItem represents one physical position. A non-empty `wine_id` makes that position occupied, even while its Wine or Rack reference is temporarily unavailable. The in-cellar quantity for a known Wine is the number of RackItems carrying that Wine ID; it does not depend on Rack metadata. The total number of positions is the number of RackItems records, and empty positions are total positions minus occupied positions.

The integration exposes two additional integrity counters: `orphaned_rack_positions` counts RackItems whose Rack ID is not currently known, and `orphaned_wine_positions` counts occupied RackItems whose Wine ID is not currently known. An orphaned Wine position still counts as one physical bottle in `total_bottles` and `total_stock_bottles`; it is not silently counted as empty or discarded. If an incremental delta introduces unresolved references, the coordinator immediately requests a complete snapshot. If that snapshot still contains unresolved RackItem references, it is rejected and the previous inventory is retained. A restored storage snapshot already containing orphaned positions starts with a full sync cursor so those references are retried after restart.

### Stock values and formulas

Analysis of the supplied `Vins.csv`, `Caves.csv` and full PLOUD snapshot establishes the following reconstruction rule. For each of the 116 Wine UUIDs, the formula below reproduces the CSV `Stock` value exactly:

`effective_stock = max(0, movement_balance, bottles_in_cellar)`

| Integration field | Source / formula | Meaning |
|---|---|---|
| `ploud_bottles` | Raw `Wine.bo` | PLOUD-declared quantity, retained for comparison |
| `purchased` | Sum of `Order.in` for the Wine UUID | Total recorded incoming movements |
| `consumed` | Sum of `Order.ot` for the Wine UUID | Total recorded outgoing movements |
| `movement_balance` | `purchased - consumed` | Signed balance of recorded movements |
| `calculated_stock` | `max(0, movement_balance)` | Movement balance with the application's zero lower bound |
| `bottles_in_cellar` | Count of RackItems whose `wine_id` matches this Wine ID | Number of physical bottles assigned to this reference, including positions whose Rack metadata is temporarily unresolved |
| `bottles` / `effective_stock` | `max(calculated_stock, bottles_in_cellar)` | Reconstructed total stock; matches the CSV `Stock` column |
| `bottles_to_store` | `effective_stock - bottles_in_cellar` | Bottles not assigned to a RackItem |
| `wine_references` | Count of references with `effective_stock > 0` | Active known inventory reference count; zero-stock catalogue records are retained internally but not exposed in the normal inventory |
| `total_bottles` | `occupied_positions` | Count of all occupied physical RackItems, including temporarily unresolved Wine or Rack references |
| `total_positions` | Number of RackItem records | All physical positions, occupied or empty |
| `occupied_positions` | Count of RackItems with a non-empty `wine_id` | All occupied physical positions |
| `empty_positions` | `total_positions - occupied_positions` | Physical positions without a Wine assignment |
| `orphaned_rack_positions` | Count of RackItems with an unknown `rack_id` | Position references whose Rack metadata is unavailable |
| `orphaned_wine_positions` | Count of occupied RackItems with an unknown `wine_id` | Physical bottles whose Wine record is unavailable |
| `total_stock_bottles` | Sum of known Wine effective stocks plus `orphaned_wine_positions` | Preserves physical bottles from unresolved Wine references in the global total |

The raw `Wine.bo` value is deliberately not substituted for reconstructed stock. In the supplied snapshot it totals 128 bottles, whereas the CSV stock totals 108. The reconstruction formula totals 108 and matches all 116 CSV reference quantities. RackItem counts match the CSV `Stock (en cave)` values for all 116 references. The CSV baseline is therefore:

- 116 wine references;
- 105 bottles physically placed;
- 144 total positions, including 39 empty positions;
- 3 bottles not placed;
- 3 references with at least one unplaced bottle.

### Inventory anomaly flags and movement warnings

The integration distinguishes unplaced bottles from discrepancies between the Orders movement balance and effective stock. Raw `Wine.bo` is retained for reference only and does not define movement anomalies.

| Field / flag | Condition | Interpretation |
|---|---|---|
| `inventory_errors` / `unplaced_bottles` | `bottles_to_store > 0` | One or more bottles are not assigned to a rack position |
| `movement_warnings` / `negative_movement_balance` | `movement_balance < 0` | Recorded outgoing movements exceed incoming movements |
| `movement_warnings` / `movement_balance_mismatch` | `movement_balance != effective_stock` | Recorded movements do not reproduce the effective stock |
| `movement_difference_bottles` | `abs(movement_balance - effective_stock)` | Absolute bottle discrepancy for this reference |

The three CSV references with bottles to store are Domaine Rémy Nodin Crozes-Hermitage Le Mazel 2019 (1), Montbazillac 2021 (1) and Romeria Del Sol (1). The seven movement-anomaly references in the supplied snapshot are reported separately from the normal inventory list. Four have a positive discrepancy totalling five bottles; three have a negative movement balance of -1 each. The sum of absolute discrepancies is eight bottles. The integration never corrects PLOUD data. Movement warnings are diagnostic and are not counted as unplaced-stock anomalies. Zero-stock references remain in the internal synchronized model but are omitted from the normal inventory list; zero-stock references with movement anomalies remain visible in the dedicated `movement_anomalies` diagnostic list.
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
| `no` | Zero or numeric identifiers (38 non-zero records) | Unknown |
| `ps` | `0`, `1`, `8`, `16` | Unknown code |
| `at` | Zero on 115 records; `2022` on one | Unknown |
| `re` | Empty on all records | Unknown / no usable sample |
| `ac`, `af`, `cf`, `ct`, `ep`, `it`, `lt`, `lg`, `nt` | Zero on all 116 records | Unknown; no non-zero sample |
| `fa` | `false` on all 116 records | Unknown boolean; no positive sample |


The official PLOUD server model maps `ml` to the `Meals` flags enum on each
Wine record (`Wine.cs`, `Meals.cs`). The currently documented flags are:

| Bit value | PLOUD enum | Meaning |\n|---:|---|---|\n| 1 | `Aperitif` | Apéritif |\n| 2 | `Soup` | Soupe |\n| 4 | `Entry` | Entrée |\n| 8 | `PorkButchery` | Charcuterie et porc |\n| 16 | `SeaFood` | Fruits de mer |\n| 32 | `Fish` | Poissons |\n| 64 | `WhiteMeat` | Viandes blanches |\n| 128 | `Game` | Gibier |\n| 256 | `Poultry` | Volailles |\n| 512 | `RedMeat` | Viandes rouges |\n| 1024 | `DishAndVegetable` | Plats et légumes |\n| 2048 | `Cheese` | Fromages |\n| 4096 | `Dessert` | Desserts |\n\nThese values are combined with bitwise OR. For example, `2080` means\n`Cheese` + `Fish`. The APK contains a resource named `foodtype8192`, but\nthat value is not defined in the public server enum; it is therefore retained\nin the raw mask and deliberately not assigned a display label.\n
The compact key `ml` is exposed as the raw `Wine.meals` integer in the inventory response. It is optional for legacy records and preserves all bits, including values not defined by the public enum.

The compact keys `cn`, `rn`, `ap`, `vf`, `co` and `cl` are known
reference identifiers from the legacy payload. Their corresponding expanded
labels are used instead. They are not persisted as separate model attributes.

## Synchronization and storage behavior

- All Wine records, including zero-stock records, remain in the synchronized model because future deltas may update them. The normal inventory response exposes only wines with positive effective stock. Movement-anomaly references are exposed separately in `movement_anomalies`, even when their effective stock is zero.
- A Wine update with `bottles = 0` changes only the raw PLOUD bottle-count
  field. It does not delete the Wine record or clear any RackItem assignment;
  `Wine.bo` is informational and is not the source of effective stock.
- An explicitly deleted Wine frees its assigned positions by clearing the
  `wine_id`, while preserving each physical slot's ID, Rack, row and column.
- Deleting a rack removes its rack positions.
- Empty rack slots (RackItems with an empty `wine_id`) are retained.
- Incremental deltas may temporarily reference a Rack or Wine that is not
  present in the same response. Those positions are retained and reported by
  `orphaned_rack_positions` or `orphaned_wine_positions`; they still count as
  physical positions and occupied bottles. A complete snapshot must resolve
  every RackItem reference or it is rejected without replacing the previous
  inventory.
- Synchronization is applied to a candidate model. The current model and
  cursor are replaced only after the candidate passes validation and its
  serialized payload has been saved and read back successfully. A sync,
  validation or persistence failure leaves the last committed model and
  cursor in place and marks its data as stale.
- Home Assistant Store writes use atomic file replacement. Since
  `Store.async_save()` may log some write errors without raising them, the
  integration reads the payload back and compares it with the candidate before
  committing the new in-memory state.
- The persistent cellar payload uses schema version 7. Version 6 was the
  first schema to persist Order movements; a version-6 snapshot with a cursor
  above 1 is treated as having a complete Orders history. Versions 1-5, and
  version 6 with cursor 1, are migrated with stock reconstruction marked
  incomplete until a complete PLOUD snapshot succeeds. Their physical rack
  positions remain available offline, but calculated stock and movement
  diagnostics are returned as null. Raw Wine.bo is never used as a substitute
  for missing Orders. UUID identifiers and cross-references are canonicalized
  during migration. The migrated payload is saved immediately when possible;
  if verification fails, the migrated in-memory model remains usable and its
  cursor is reset to request a full sync.
- The synchronization remains read-only and continues to send `Objects={}`.
