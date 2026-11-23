# Ploc Cellar inventory algorithms

[Version française](ALGORITHMES.md)

This document describes the business rules and invariants applied by the integration. PLOUD remains the source of truth: Ploc Cellar reconstructs a local read-only inventory and never repairs the remote cellar. The [French specification](ALGORITHMES.md) is maintained alongside this English version.

## 1. Source collections

| PLOUD collection | Role in the local model |
|---|---|
| `Wines` | Wine references and descriptive characteristics |
| `Orders` | Incoming and outgoing bottle movements |
| `RackItems` | Physical positions, occupied or empty |
| `Racks` | Rack metadata |
| `appellations`, `bottleFormats`, `classifications`, `colors`, `countries`, `regions` | Reference indexes persisted in `Cellar.references` to resolve compact wine identifiers |
| `Owners` | Temporary winery-name resolution from its UUID; only the resolved name is retained in `Wine.domain` |
| `DeletedObjects` | Explicit deletions applied to the local model |

Zero-stock Wine references remain in the model because a later delta may assign them a movement or rack position. They are excluded from the normal inventory list while their effective stock remains zero.

The raw `Wine.bo` (or `Wine.bottles`) value is retained for information only. It is never used directly as effective stock.

## 2. Stock reconstruction

The following quantities are calculated independently for each wine UUID.

### 2.1 Movements

- `purchased` = sum of the wine's `Order.in` values.
- `consumed` = sum of the wine's `Order.ot` values.
- `movement_balance` = `purchased - consumed`.
- `calculated_stock` = `max(0, movement_balance)`.

A negative balance is not clamped in the diagnostic data: it remains visible in `movement_balance` and produces the `negative_movement_balance` warning.

### 2.2 Physically placed bottles

Each `RackItem` represents exactly one physical position. A position is occupied when its `wine_id` is not empty.

For a known wine, `bottles_in_cellar` is the number of `RackItems` whose `wine_id` matches that wine UUID. This count does not depend on rack metadata being available. A RackItem whose `rack_id` is temporarily unknown remains occupied and still counts toward the associated wine.

### 2.3 Effective stock

The reconstruction rule is:

```text
effective_stock = max(0, movement_balance, bottles_in_cellar)
unlocated_bottles = max(0, effective_stock - bottles_in_cellar)
```

Consequences:

- Effective stock is never negative.
- Effective stock can never be lower than the number of bottles already placed.
- Movements determine available stock when they exceed the number of placed bottles.
- `Wine.bo` is not part of this formula.

## 3. Global inventory invariants

Let `R` be the set of all RackItems.

| Attribute | Rule |
|---|---|
| `total_positions` | `len(R)` |
| `occupied_positions` | Number of RackItems with a non-empty `wine_id` |
| `empty_positions` | `total_positions - occupied_positions` |
| `total_bottles` | `occupied_positions` |
| `stocked_wines` | Number of known Wine references with `bottles_in_cellar > 0` |
| `wine_references` | Number of known Wine references with positive effective stock |
| `unlocated_bottles` | Effective-stock bottles not assigned to a position |
| `total_stock_bottles` | Sum of known effective stocks + `positions_with_unknown_wine` |
| `rack_count` | Number of known Rack references |

Three integrity counters are distinct:

- `positions_without_rack`: positions whose `rack_id` does not match a locally known rack.
- `positions_with_unknown_wine`: occupied positions whose `wine_id` does not match a locally known Wine reference.
- `orders_without_wine`: retained Order movements whose `wine_id` no longer matches a locally known Wine reference.

A position with an unknown wine remains a physical bottle and is included in `occupied_positions` and `total_bottles`. It is also included in `total_stock_bottles` once stock reconstruction is complete. If Orders history is unavailable, `total_stock_bottles` is `null`, rather than presenting a partial total as exact. Such a position is never silently converted to an empty slot.

Search and color filters on `get_inventory` never change global totals.

## 4. Stock and consistency diagnostics

Movement-derived diagnostics are calculated only when Orders history is complete. Before then, their quantities and counters are `null`; physical position quantities and position references remain known.

### 4.1 Unlocated stock

For each wine:

`unlocated_bottles = max(0, effective_stock - bottles_in_cellar)`.

- `unlocated_wines` counts references with at least one unlocated bottle.
- `unlocated_bottles` counts those bottles.

This means reconstructed stock from movements exceeds the number of bottles assigned to rack positions. It does not prove that a bottle was removed without an outgoing movement: it may never have been placed in a rack or may be stored elsewhere.

### 4.2 Negative movement balance

For each wine:

`negative_movement_bottles = max(0, -movement_balance)`.

- `negative_movement_wines` counts references with a negative movement balance.
- `negative_movement_bottles` sums the absolute values of those negative balances.

This identifies a ledger where outgoing movements exceed incoming movements. It does not represent a number of physically missing bottles.

### 4.3 Physical surplus

For each wine:

`physical_surplus_bottles = max(0, bottles_in_cellar - calculated_stock)`.

`calculated_stock` is `max(0, movement_balance)`.

- `physical_surplus_wines` counts references whose physically placed bottles exceed the non-negative movement-derived stock.
- `physical_surplus_bottles` sums those surplus physical bottles.

A physical surplus may indicate an unrecorded incoming movement or incomplete history. It can coexist with a negative movement balance for the same reference; diagnostic families are not necessarily mutually exclusive.

### 4.4 Unresolved references

- `positions_without_rack` counts positions referencing an unknown rack.
- `positions_with_unknown_wine` counts occupied positions referencing an unknown wine.
- `orders_without_wine` counts retained orders whose wine no longer exists in local references. This can be normal history after a wine is deleted in PLOUD.

### 4.5 Diagnostic details

The `get_inventory` action exposes `wine_diagnostics`, an unfiltered list of wines with at least one of the three stock diagnostics: `unlocated_bottles`, `negative_movement_bottles` or `physical_surplus_bottles`. It also includes wines with zero effective stock. Each entry provides purchased and consumed quantities, movement balance, physical quantity, effective stock and all three diagnostic quantities. The list is `null` while Orders reconstruction is incomplete.

Aggregates are exposed through separate Home Assistant sensors grouped into inventory, racks and diagnostics. `sensor.ploc_cellar_bottles_in_stock` retains its historical unique ID and measures physically occupied positions; `sensor.ploc_cellar_bottles_stock_total` measures reconstructed effective stock. The six diagnostic sensors represent the three diagnostic families, each with a bottle count and a wine-reference count. `sensor.ploc_cellar_diagnostic_last_successful_sync` provides the last committed synchronization timestamp and carries the `stale` attribute. `wine_diagnostics` and individual wine characteristics remain available only through `get_inventory`; no entity is created per wine.

## 5. PLOUD synchronization rules

### 5.1 Full and incremental synchronization

The first synchronization and every recovery use `LastSyncTime=1`. Later synchronizations use the incremental cursor in Unix milliseconds.

A full response is a snapshot: the candidate model starts from an empty cellar. References absent from that snapshot are therefore not accidentally retained.

A delta is applied to a copy of the last validated model. The active model and its cursor change only after validation and verified persistence.

A full response must contain `Wines`, `Racks`, `RackItems`, `Orders` and `Owners`. RackItem references must resolve within the snapshot. A full snapshot that still contains an unknown Rack or Wine reference is rejected.

### 5.2 Partial-field merging

A delta may contain only some fields of an existing object. The general rules are:

- **Field omitted:** preserve the known value from the previous model.
- **Field explicitly empty or null:** clear it when the field permits an empty value.
- **Field present but invalid:** reject the response rather than silently erase a known value.
- **New incomplete object:** do not invent missing fields; request a full snapshot.

These rules apply to Wine characteristics, Rack metadata, Order movements and RackItem positions.

For an existing Wine, omitted characteristics, name, vintage, owner and informational bottle quantity are preserved. Explicitly empty descriptive fields may be cleared. A new Wine must include its identifier and initial bottle-count value; otherwise the delta is incomplete.

For an existing Rack, omitted `nm` or `name` preserves the previous name. A new Rack must provide a name. An explicitly empty or null name clears it; a value of the wrong type rejects the response.

For an existing RackItem, handling of `wi` depends on whether position coordinates are complete:

- If `rk`, `rw` and `cl` are all present but `wi` is omitted, the delta describes a complete position that is now empty; the previous `wine_id` is cleared.
- If any of `rk`, `rw` or `cl` is omitted, the position delta is incomplete; the previous wine assignment is preserved even if `wi` is omitted.
- If `wi` is present with a value, that assignment is applied. An explicitly empty string or null also clears the assignment.

For a new RackItem, `rk` and `wi` must be present. Their omission does not mean the position is empty. Explicitly empty coordinates become `None`; malformed coordinates reject the response.

For an existing Order, omitted `wi`, `in` and `ot` values are preserved. A new Order must provide all three fields. Quantities must be non-negative integers.

For a Wine, a negative vintage or negative numeric value (alcohol, temperatures or volume) rejects the response. Zero is interpreted as missing data for these optional fields. `owner_id` must be a string or integer; null or empty clears the reference, while another type rejects the response.

An Owner must have an identifier. Its name may be omitted in a delta, but that Owner is then unresolved: a Wine newly associated with that Owner triggers a full recovery. An explicitly empty or null name clears the winery domain; a name of the wrong type rejects the response.

### 5.3 Duplicate identifiers

A response cannot contain the same Wine, Owner, Rack, RackItem or Order identifier twice. Two supported collection names that differ only by case (for example `Wines` and `wines`) are also rejected; no collection may be silently ignored.

### 5.4 Identifier normalization

UUID identifiers are converted to canonical lowercase hyphenated form, whether they come from an object, cross-reference or `DeletedObjects`. This applies to Wine, Rack, RackItem, Order and Owner. Surrounding whitespace is removed first.

Non-UUID identifiers remain opaque: they are trimmed only and retain their case. Identifiers and references restored from old storage are normalized the same way before model dictionaries are rebuilt.

New storage writes require canonical representation. If a migration detects two keys that become identical after normalization, it is rejected and the cache is recovered through a full snapshot rather than arbitrarily merging records.

### 5.5 Unknown references and explicit deletions

A RackItem reference to an unknown Wine is retained as an occupied position. When it arrives in a delta, it triggers recovery through a full synchronization. If the full snapshot does not resolve the reference, the snapshot is rejected.

An Order whose `wine_id` no longer exists in `Wines` is retained as movement history, for example when a wine was deleted without deleting its orders. It contributes to no known wine's stock, does not create an artificial Wine reference and does not trigger a full synchronization by itself. The `orders_without_wine` counter exposes these records. An explicit Order deletion in `DeletedObjects` is still applied normally.

A reference to an Owner missing from a delta or with an incomplete name may trigger a full synchronization to resolve the winery name. Duplicate Owner identifiers are rejected case-insensitively.

Deletion semantics are explicit:

- Deleting a Wine clears only its `wine_id` in affected positions; the position ID, rack, row and column are retained.
- Deleting a Rack deletes the physical positions belonging to that rack.
- A Wine reference merely absent from a delta is **not** a deletion.
- A Wine received with `bo = 0` is **not** deleted and its positions are **not** cleared.

## 6. Persistent storage and transaction

The cellar schema version is stored separately from the Home Assistant storage envelope version. The current schema is version 7. Version 6 was the first to persist Orders movements.

On load:

- Supported historical schemas are migrated and their cursor is reset to `1` to force a full snapshot.
- Versions 1 to 5 do not contain complete Orders history. The physical cache is retained, but `stock_reconstruction_complete` is `false`.
- For version 6, Orders history is considered complete when the stored cursor is greater than `1`. A cursor of `1` means the first snapshot was not yet committed.
- Storage is converted to version 7; UUID identifiers and all their references are normalized. The Orders-availability flag is retained separately from the cursor reset to `1`.
- The current schema must contain the four persisted collections (`wines`, `racks`, `rack_items`, `orders`) as dictionaries with complete, correctly typed records. It also contains `stock_reconstruction_complete`; when false, the cursor must remain `1`.
- Incomplete or malformed current storage is not interpreted as an empty collection. The cached inventory is set aside in memory and a full synchronization is required. The existing file is replaced only after a new snapshot has been received, validated and successfully persisted.

Each synchronization follows this transaction:

1. Fetch the PLOUD response.
2. Build a candidate model (copy the active model for a delta, empty model for a full snapshot).
3. Apply changes and deletions.
4. Validate RackItem references and model invariants.
5. Serialize and save the candidate through the Home Assistant `Store` using atomic writes.
6. Read storage back and compare it with the candidate.
7. Replace the active model and cursor only after the write is verified.

On network, validation or persistence failure, the last validated model and its cursor remain active; the inventory is marked stale (`stale = true`).

### Offline cache without Orders history

Versions 1 to 5 did not retain the movements needed to reconstruct effective stock. Raw `Wine.bo` is not a valid substitute because it may overstate real stock. To avoid both fabricated estimates and partial values presented as exact, known data remains accessible while movement-dependent results are temporarily unavailable:

- `total_bottles`, occupied positions and physically placed quantities remain exact.
- `stock_reconstruction_complete` is `false`.
- `wine_references`, `total_stock_bottles`, unlocated-stock, negative-movement and physical-surplus counters, and `orders_without_wine` are `null`.
- `get_inventory` returns known wines that are physically placed, but their calculated stock and diagnostic fields are `null`.
- A successful complete PLOUD snapshot marks stock reconstruction complete and re-enables all calculations.

A version 6 cache that already contains a complete Orders snapshot retains its calculations during an outage, even if migration to version 7 forces another snapshot to refresh identifiers.

### Home Assistant shutdown during a save

When Home Assistant enters its stopping state, `Store.async_save()` may queue data for a final write and return before the file has reached disk. In this case, `Store.async_load()` may return the queued data from its in-memory state: equality between reloaded data and the candidate alone does not prove disk persistence.

The integration checks the stopping state before saving, immediately after `async_save()` and after reloading. If shutdown starts during this sequence, the transaction is not considered committed and the in-memory model is not advanced. Home Assistant's final write may still complete the queued save; on restart, storage is validated again before reuse.

## 7. Read-only guarantees

All synchronization requests send `Objects={}`. The integration sends no modified cellar objects and performs no business writes to PLOUD. Consistency corrections are local to the Home Assistant model; remote anomalies remain diagnostics and are never automatically repaired.

## 8. Food-pairing data

PLOUD stores food pairings in `Wine.ml`. The integration exposes this as the optional raw integer `Wine.meals`; it does not translate, normalize or remove flags. This is a bitmask: multiple categories can be combined using bitwise OR.

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
| `1024` | Vegetable dishes |
| `2048` | Cheese |
| `4096` | Dessert |
| `8192` | Spicy dishes |

The frontend maps these flags to localized labels in the wine detail view. Missing or null `meals` means pairing data is unavailable; it must not be interpreted as an explicitly empty list. The PLOUD Android application identifies `8192` as `foodtype8192` (spicy dishes). Unknown future bits remain preserved by the backend and are ignored by the frontend.

## 9. Wine images and PLOUD documents

Images are not part of stock calculations and never modify cellar data. They are synchronized separately from the PLOUD `Documents` collection and the references carried by `Wines` records.

### 9.1 References and retrieval

- Wine compact fields `im` and `ci` reference the primary image and cover image respectively.
- Document metadata is retained from the `Documents` collection. It identifies the document type and supports a version fingerprint based on available metadata (`tm`, `tp`, `lt`, `ct`, `wd`, `ht`, `or`, `ty`).
- Binary content is fetched on demand through the PLOUD `getdocument` method and its dedicated document route. The request is signed according to the PLOC client protocol; the response is a binary stream, not JSON.
- Only documents referenced by at least one Wine are downloaded. Unreferenced documents are not bulk-downloaded.
- Supported image formats are JPEG, PNG, GIF and WebP. Validation uses the binary signature; a generic MIME type does not prevent a valid image from being accepted. Documents identified as PDF, text, audio or video are rejected. The maximum accepted image size is 20 MiB.

### 9.2 Cache and refresh

Images are stored in a private cache scoped to the config entry, under `.storage/ploc_cellar/<entry_id>/images`. The image cache is separate from transactional inventory storage.

The filename includes a document fingerprint. If metadata changes for the same document ID, a new version is downloaded and the served path changes. The frontend can therefore detect a different URL and reload the image even when the PLOUD document ID remains unchanged.

An image download failure does not fail inventory synchronization. A valid existing image remains available; another attempt is made during a later synchronization.

### 9.3 Deletion and cleanup

After a successful image synchronization, the cache is pruned: files no longer matching an `im` or `ci` reference, explicitly deleted documents (PLOUD type `Document = 115`) and replaced older versions are removed. Deletions are not inferred from simple absence in an inventory delta; they rely on known document references and explicit document deletions.

Removing a Home Assistant config entry deletes its image-cache directory. Unloading or reloading an entry does not delete images. The cache remains local and is never sent to PLOUD.

### 9.4 Exposure to Home Assistant and the frontend

The `get_inventory` service adds `image_url` to each wine record when the primary image or, failing that, the cover image is available in the cache. The value is `null` when no usable local image exists. The path is served by an authenticated Home Assistant view; responses use private HTTP caching without shared persistence.

The URL is a local Home Assistant endpoint, not a public PLOUD URL. The frontend must use Home Assistant's authenticated mechanism to retrieve its content. Images must not be loaded through an unauthenticated remote element or cached in public storage.
