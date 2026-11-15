# Inventory and synchronization algorithms

This document is the English overview of the inventory rules. The detailed implementation specification, including edge cases and recovery behavior, remains in [ALGORITHMES.md](ALGORITHMES.md) (French).

## Source collections

- `Wines` provide wine references and characteristics.
- `Racks` and `RackItems` describe physical racks and individual positions.
- `Orders` provide incoming and outgoing bottle movements.
- Reference collections resolve compact identifiers used by wine records.
- `Documents` provide wine photos when a wine references an available image.

PLOUD remains the source of truth. The integration does not send cellar mutations.

## Physical positions and movement stock

A `RackItem` represents one physical position. A position is occupied when it has a wine reference; each occupied position represents one physical bottle. Occupied positions remain part of physical totals even when their wine or rack reference cannot currently be resolved.

```text
purchased = sum(Order.in)
consumed = sum(Order.ot)
movement_balance = purchased - consumed
calculated_stock = max(0, movement_balance)
bottles_in_cellar = count(occupied RackItems referencing the wine)
effective_stock = max(calculated_stock, bottles_in_cellar)
```

The raw PLOUD `Wine.bo` value is retained for information but does not determine effective stock.

## Independent diagnostics

```text
unlocated_bottles = max(0, effective_stock - bottles_in_cellar)
negative_movement_bottles = max(0, -movement_balance)
physical_surplus_bottles = max(0, bottles_in_cellar - calculated_stock)
```

These diagnostics describe different conditions and may coexist:
- **Unlocated stock:** reconstructed stock exceeds the number of bottles assigned to rack positions. This does not prove that a bottle was removed without an outgoing movement; it may never have been placed in a rack or may be stored elsewhere.
- **Negative movement balance:** outgoing movements exceed incoming movements.
- **Physical surplus:** more bottles are physically assigned to rack positions than the non-negative movement balance.

Until a complete Orders snapshot has been validated, movement-derived stock and diagnostics are unavailable (`null`/unknown). Physical position counts remain available. An incomplete history must never be interpreted as a zero stock.

## Synchronization rules

- The initial synchronization uses the validated bootstrap cursor. Subsequent incremental requests use the locally persisted cursor.
- A full synchronization replaces the candidate snapshot; a delta merges partial records into the current model.
- Omitted fields in a partial record are not equivalent to explicit clearing. Explicit deletion records are handled separately from ordinary missing records.
- Identifiers are normalized consistently before matching records and references.
- Reference lookups use locally persisted reference collections. If a delta cannot safely resolve required reference data, the coordinator requests a bounded recovery full synchronization rather than inventing a value.
- The detailed rules for duplicate IDs, unresolved references, deletion semantics and recovery are specified in [ALGORITHMES.md](ALGORITHMES.md).

## Transactional persistence

Synchronization is applied to a candidate model, not directly to the active inventory. The candidate is validated and persisted with its matching cursor before it replaces the active in-memory state. A failed request, invalid candidate or storage failure must not advance the committed cursor or publish a partially updated inventory.

After a later synchronization failure, the last successfully committed inventory remains available and is marked stale.

## Wine image cache

Wine images are optional and independent of inventory correctness. Documents are validated, downloaded to a private cache scoped to the config entry and served through an authenticated Home Assistant endpoint. Image download failures do not fail an otherwise valid inventory synchronization. Changed document metadata results in a changed local image URL so the frontend can reload the image. Unreferenced, deleted and replaced cached documents are pruned according to the document references and deletion information known to the integration.

## Invariants

1. PLOUD data is read-only.
2. One occupied rack position contributes one physical bottle, including unresolved wine references.
3. Physical stock and movement-derived stock remain distinct concepts.
4. Raw `Wine.bo` is informational, not authoritative for effective stock.
5. Unknown or incomplete movement history is not zero.
6. Inventory and cursor persistence are committed together.
7. No event or frontend invalidation notification is sent before a successful commit.
8. Per-entry inventories, cursors and image caches remain isolated.
