# PLOUD field mapping

This document describes the current mapping implemented by the backend. PLOUD
remains the source of truth; the integration synchronizes read-only data and
never sends cellar mutations.

## Collections

| PLOUD collection | Local representation | Retention |
|---|---|---|
| `Wines` | Immutable `Wine` records in `Cellar.wines` | Persisted, including zero-stock references |
| `Racks` | `Rack` records in `Cellar.racks` | Persisted |
| `RackItems` | `RackItem` records in `Cellar.rack_items` | Persisted, including empty slots and unresolved references in restored snapshots |
| `Orders` | `Order` records in `Cellar.orders` | Persisted to reconstruct stock |
| `appellations`, `bottleFormats`, `classifications`, `colors`, `countries`, `regions` | Indexed JSON records in `Cellar.references` | Persisted and merged across incremental synchronizations |
| `Owners` | Temporary UUID-to-display-name lookup | Not persisted as raw records |
| `Documents` | Image metadata used by the private image cache | Not part of the cellar model; referenced image bytes are cached separately |
| `DeletedObjects` | Explicit deletion instructions | Applied to the candidate model; not retained as a collection |

The six reference collections are part of the serialized cellar snapshot. This
allows a later incremental Wine record to resolve compact reference IDs even
when the corresponding lookup record is not repeated in that delta. Owner
records are deliberately transient: the resolved winery name is stored in the
Wine record as `domain`, while the Owner UUID is retained as `owner_id`.

## Wine fields

| PLOUD field | Local field | Meaning and handling |
|---|---|---|
| `id` | `Wine.id` | Required identifier; UUIDs are normalized to lowercase canonical form |
| `nm` / `name` | `Wine.name` | Wine name; partial deltas preserve omitted values |
| `bo` / `bottles` | `Wine.bottles` | Raw PLOUD quantity, retained for reference only; not used to calculate effective stock |
| `vi` / `vintage` | `Wine.vintage` | Vintage; zero and empty values mean unknown |
| `ap` | `Wine.appellation` | Resolved through `appellations` |
| `co` | `Wine.color`, `Wine.color_rgb` | Resolved through `colors`; RGB values are validated |
| `cl` | `Wine.classification` | Resolved through `classifications` |
| `rn` | `Wine.region` | Resolved through `regions` |
| `cn` | `Wine.country` | Resolved through `countries` |
| `gr` | `Wine.grapes` | Grape composition text |
| `cu` | `Wine.cuvee` | Cuvée |
| `cs` | `Wine.comment` | Comment |
| `de` | `Wine.alcohol_percent` | Alcohol percentage; finite non-negative numeric values only |
| `ti`, `to` | `Wine.service_temperature_min`, `Wine.service_temperature_max` | Service-temperature bounds |
| `vf` | `Wine.bottle_format`, `Wine.bottle_volume_l` | Resolved through `bottleFormats` |
| `pid` | `Wine.ploud_pid` | PLOC product identifier |
| `ml` | `Wine.meals` | Optional non-negative raw integer bitmask; unknown bits are preserved |
| `ow` | `Wine.owner_id`, `Wine.domain` | Owner identifier retained; display name resolved from the current Owners response and stored on Wine |
| `im`, `ci` | `Wine.ploud_reference_fields` | Primary and cover document IDs used by the image cache |
| Other compact fields | `Wine.ploud_reference_fields` | Retained for safe incremental merging and later reference resolution |

A delta that omits a field preserves the previous value. An explicitly empty
field clears the corresponding optional value. A new Wine record must contain
the required identity, name and bottle-count data; incomplete records trigger
recovery rather than silently creating a partial business record.

## Reference IDs and lookup data

| Collection | Compact Wine field | Display fields |
|---|---|---|
| `appellations` | `ap` | `nm` |
| `bottleFormats` | `vf` | `nm`, `vo` (litres) |
| `classifications` | `cl` | `nm` |
| `colors` | `co` | `nm`, `r`, `g`, `b` |
| `countries` | `cn` | `nm` |
| `regions` | `rn` | `nm` |

Reference indexes are keyed by normalized IDs and are updated when a
synchronization includes a reference collection. Wine display fields are
refreshed from the merged index. A missing lookup does not fabricate a label:
the last valid display value is retained when appropriate, otherwise the
field remains unknown.

## Food-pairing bitmask

PLOUD stores food associations in `Wine.ml`; the backend exposes the raw value
as `Wine.meals`. It is a bitmask, so flags combine with bitwise OR.

| Bit | Category |
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
| `8192` | Épicés |

For example, `10341` is the combination of `1 + 4 + 32 + 64 + 2048 + 8192`
(Aperitif, Starter, Fish, White meat, Cheese and Spicy dishes). Missing or null
`meals` means that PLOUD did not provide association data. Future unknown bits
remain in the raw integer and are not assigned an invented label.

## Rack and movement fields

| Collection / field | Local field | Meaning |
|---|---|---|
| `Racks.id` | `Rack.id` | Rack identifier |
| `Racks.nm` / `name` | `Rack.name` | Rack display name |
| `RackItems.id` | `RackItem.id` | Physical slot record identifier |
| `RackItems.rk` | `RackItem.rack_id` | Rack reference |
| `RackItems.wi` | `RackItem.wine_id` | Wine reference; empty means an unoccupied slot |
| `RackItems.rw` | `RackItem.row` | Zero-based row coordinate, nullable |
| `RackItems.cl` | `RackItem.column` | Zero-based column coordinate, nullable |
| `Orders.id` | `Order.id` | Movement identifier |
| `Orders.wi` | `Order.wine_id` | Wine reference |
| `Orders.in` | `Order.incoming` | Incoming bottle quantity |
| `Orders.ot` | `Order.outgoing` | Outgoing bottle quantity |

Each RackItem represents one physical position. An occupied position remains
counted even if a Wine or Rack reference is temporarily unresolved. The
inventory response exposes these conditions as `positions_with_unknown_wine`
and `positions_without_rack`; it does not relabel an unresolved occupied slot
as empty.

## Stock and diagnostics

For a wine with a complete Orders history:

```text
purchased = sum(Order.in)
consumed = sum(Order.ot)
movement_balance = purchased - consumed
calculated_stock = max(0, movement_balance)
effective_stock = max(calculated_stock, bottles_in_cellar)
unlocated_bottles = max(0, effective_stock - bottles_in_cellar)
negative_movement_bottles = max(0, -movement_balance)
physical_surplus_bottles = max(0, bottles_in_cellar - calculated_stock)
```

The three diagnostics are independent and may coexist. The raw PLOUD
`Wine.bo` value is informational only. Until a complete Orders snapshot has
been validated, stock-derived values are null; known physical positions remain
available.

## Inventory action contract

The response-only Home Assistant action is `ploc_cellar.get_inventory`.
It accepts a required `config_entry_id` and optional text filters `search`
and `color`. Search covers wine name, winery/domain, appellation, region,
country, grapes, cuvée and comment. Filters do not change global totals.

The response includes global counts and diagnostics, `matching_wines`,
`racks`, `rack_items`, `wines`, `wine_diagnostics`, `stale`,
`stock_reconstruction_complete` and `last_sync`. A wine entry contains its
display characteristics, stock values, optional `meals`, image URL and
locations. A location carries the rack name and ID plus nullable row and
column coordinates.

The complete machine-readable contract is guarded by the backend
`test_service_contract.py` test and mirrored by TypeScript contract
assertions in the frontend repository.
