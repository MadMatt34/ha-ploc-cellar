"""Unit tests for PLOUD delta parsing and inventory integrity."""
from __future__ import annotations

import pytest
from ploc_cellar.models import Cellar, Order, Rack, Wine
from ploc_cellar.ploud import (
    PLOUDCollections,
    PloudError,
    PloudIncompleteDelta,
    apply_sync,
)


def _wine(
    wine_id: str,
    *,
    owner_id: str | None = None,
    domain: str | None = None,
) -> Wine:
    """Build a minimal complete Wine model for tests."""
    return Wine(
        id=wine_id,
        name=wine_id,
        bottles=0,
        bottles_in_cellar=0,
        vintage=None,
        appellation=None,
        color=None,
        color_rgb=None,
        classification=None,
        region=None,
        country=None,
        grapes=None,
        cuvee=None,
        comment=None,
        alcohol_percent=None,
        service_temperature_min=None,
        service_temperature_max=None,
        bottle_format=None,
        bottle_volume_l=None,
        ploud_pid=None,
        domain=domain,
        owner_id=owner_id,
    )


def test_partial_rack_update_preserves_existing_name() -> None:
    """An omitted Rack name in a delta must not erase the cached name."""
    cellar = Cellar(racks={"rack-1": Rack(id="rack-1", name="Cave principale")})
    objects: PLOUDCollections = {"Racks": [{"id": "rack-1"}]}

    apply_sync(cellar, objects, 2)

    assert cellar.racks["rack-1"].name == "Cave principale"


def test_new_rack_without_name_requires_full_sync() -> None:
    """A new Rack without a name is incomplete rather than silently blank."""
    cellar = Cellar()
    objects: PLOUDCollections = {"Racks": [{"id": "rack-1"}]}

    with pytest.raises(PloudIncompleteDelta):
        apply_sync(cellar, objects, 2)


def test_explicit_empty_rack_name_clears_previous_name() -> None:
    """An explicit empty Rack name is a clear, not an omission."""
    cellar = Cellar(racks={"rack-1": Rack(id="rack-1", name="Cave principale")})
    objects: PLOUDCollections = {"Racks": [{"id": "rack-1", "nm": ""}]}

    apply_sync(cellar, objects, 2)

    assert cellar.racks["rack-1"].name == ""


def test_invalid_rack_name_is_rejected() -> None:
    """A malformed Rack name must not replace a valid cached name."""
    cellar = Cellar(racks={"rack-1": Rack(id="rack-1", name="Cave principale")})
    objects: PLOUDCollections = {"Racks": [{"id": "rack-1", "nm": 42}]}

    with pytest.raises(PloudError):
        apply_sync(cellar, objects, 2)

    assert cellar.racks["rack-1"].name == "Cave principale"


def test_owner_without_name_is_not_marked_as_resolved() -> None:
    """An Owner ID without a display-name field must request resolution."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Owners": [{"id": "owner-1"}],
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin de test",
                "bottles": 1,
                "owner_id": "owner-1",
            },
        ],
    }

    unresolved = apply_sync(cellar, objects, 2)

    assert unresolved == {"owner-1"}
    assert cellar.wines["wine-1"].domain is None


def test_duplicate_owner_ids_are_rejected_case_insensitively() -> None:
    """Owner UUIDs differing only by case still identify the same Owner."""
    cellar = Cellar()
    owner_id = "aabbccdd-1234-5678-9abc-def012345678"
    objects: PLOUDCollections = {
        "Owners": [
            {"id": owner_id.upper(), "fullname": "Domaine"},
            {"id": owner_id, "fullname": "Autre domaine"},
        ],
    }

    with pytest.raises(PloudError, match="duplicate Owner ID"):
        apply_sync(cellar, objects, 2)



def test_opaque_owner_identifiers_preserve_case() -> None:
    """Opaque Owner IDs are case-sensitive just like other opaque IDs."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Owners": [
            {"id": "owner-a", "fullname": "Domaine A"},
            {"id": "OWNER-A", "fullname": "Domaine B"},
        ],
        "Wines": [
            {
                "id": "wine-a",
                "name": "Vin A",
                "bottles": 0,
                "owner_id": "owner-a",
            },
            {
                "id": "wine-b",
                "name": "Vin B",
                "bottles": 0,
                "owner_id": "OWNER-A",
            },
        ],
    }

    unresolved = apply_sync(cellar, objects, 2)

    assert unresolved == set()
    assert cellar.wines["wine-a"].domain == "Domaine A"
    assert cellar.wines["wine-b"].domain == "Domaine B"

def test_numeric_owner_identifiers_are_normalized() -> None:
    """Integer IDs are normalized consistently on both Owner sides."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Owners": [{"id": 17, "fullname": "Domaine des tests"}],
        "Wines": [
            {"id": "wine-1", "name": "Vin de test", "bottles": 0, "owner_id": 17}
        ],
    }

    apply_sync(cellar, objects, 2)

    wine = cellar.wines["wine-1"]
    assert wine.owner_id == "17"
    assert wine.domain == "Domaine des tests"


def test_invalid_owner_display_name_is_rejected() -> None:
    """A present non-text Owner name must not be interpreted as an empty name."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Owners": [{"id": "owner-1", "fullname": 42}],
    }

    with pytest.raises(PloudError, match="invalid Owner display name"):
        apply_sync(cellar, objects, 2)


@pytest.mark.parametrize(
    ("field", "value"),
    (
        ("vintage", -1),
        ("alcohol_percent", -1.0),
        ("service_temperature_min", -1.0),
        ("service_temperature_max", -1.0),
        ("bottle_volume_l", -0.75),
    ),
)
def test_negative_optional_wine_values_are_rejected(
    field: str, value: int | float
) -> None:
    """Negative optional Wine values must not be silently cleared."""
    cellar = Cellar()
    wine_record: dict[str, int | float | str] = {
        "id": "wine-1",
        "name": "Vin de test",
        "bottles": 0,
        field: value,
    }
    objects: PLOUDCollections = {"Wines": [wine_record]}

    with pytest.raises(PloudError, match="invalid"):
        apply_sync(cellar, objects, 2)


def test_zero_optional_wine_values_mean_no_value() -> None:
    """PLOUD's zero sentinel remains an explicit empty optional value."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin de test",
                "bottles": 0,
                "vintage": 0,
                "alcohol_percent": 0.0,
                "bottle_volume_l": 0.0,
            },
        ],
    }

    apply_sync(cellar, objects, 2)

    wine = cellar.wines["wine-1"]
    assert wine.vintage is None
    assert wine.alcohol_percent is None
    assert wine.bottle_volume_l is None


def test_invalid_owner_reference_type_is_rejected() -> None:
    """Malformed owner IDs must not clear a previous Wine owner silently."""
    cellar = Cellar(
        wines={
            "wine-1": _wine(
                "wine-1",
                owner_id="owner-1",
                domain="Domaine précédent",
            )
        }
    )
    objects: PLOUDCollections = {
        "Wines": [{"id": "wine-1", "bottles": 0, "owner_id": []}],
    }

    with pytest.raises(PloudError, match="invalid reference ID"):
        apply_sync(cellar, objects, 2)

    assert cellar.wines["wine-1"].owner_id == "owner-1"
    assert cellar.wines["wine-1"].domain == "Domaine précédent"




def test_new_wine_without_name_requires_full_sync() -> None:
    """A new Wine without name or nm is an incomplete delta."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [{"id": "wine-1", "bottles": 0}],
    }

    with pytest.raises(PloudIncompleteDelta, match="missing its name"):
        apply_sync(cellar, objects, 2)


def test_uuid_identifiers_are_canonicalized_across_collections() -> None:
    """UUIDs normalize identically in object IDs and cross-collection references."""
    wine_id = "aabbccdd-1234-5678-9abc-def012345678"
    rack_id = "00112233-4455-6677-8899-aabbccddeeff"
    rack_item_id = "11112222-3333-4444-aaaa-bbbbccccdddd"
    order_id = "99998888-7777-6666-5555-444433332222"
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": f" {wine_id.upper()} ",
                "name": "Vin UUID",
                "bottles": 0,
            }
        ],
        "Racks": [{"id": rack_id.upper(), "nm": "Cave"}],
        "RackItems": [
            {
                "id": rack_item_id.upper(),
                "rk": rack_id.upper(),
                "wi": wine_id.upper(),
            }
        ],
        "Orders": [
            {
                "id": order_id.upper(),
                "wi": wine_id.upper(),
                "in": 4,
                "ot": 1,
            }
        ],
    }

    apply_sync(cellar, objects, 2)

    assert set(cellar.wines) == {wine_id}
    assert set(cellar.racks) == {rack_id}
    assert set(cellar.rack_items) == {rack_item_id}
    assert cellar.rack_items[rack_item_id].rack_id == rack_id
    assert cellar.rack_items[rack_item_id].wine_id == wine_id
    assert set(cellar.orders) == {order_id}
    assert cellar.orders[order_id].wine_id == wine_id


def test_legacy_cache_without_orders_marks_stock_unknown() -> None:
    """A pre-Orders cache remains useful offline without inventing stock values."""
    wine_id = "aabbccdd-1234-5678-9abc-def012345678"
    rack_id = "00112233-4455-6677-8899-aabbccddeeff"
    item_id = "11112222-3333-4444-aaaa-bbbbccccdddd"
    stored = {
        "version": 5,
        "cursor": 123456,
        "last_sync": "2026-11-01T12:00:00+00:00",
        "initialized": True,
        "wines": {
            wine_id.upper(): {
                "id": wine_id.upper(),
                "name": "Vin historique",
                "bottles": 3,
            }
        },
        "racks": {rack_id.upper(): {"id": rack_id.upper(), "name": "Cave"}},
        "rack_items": {
            item_id.upper(): {
                "id": item_id.upper(),
                "rack_id": rack_id.upper(),
                "wine_id": wine_id.upper(),
                "row": 1,
                "column": 1,
            }
        },
    }

    cellar = Cellar.from_storage(stored)

    assert cellar.initialized is True
    assert cellar.cursor == 1
    assert cellar.stock_reconstruction_complete is False
    assert set(cellar.wines) == {wine_id}
    assert set(cellar.racks) == {rack_id}
    assert cellar.rack_items[item_id].wine_id == wine_id
    assert cellar.total_bottles == 1
    assert cellar.total_stock_bottles is None
    assert cellar.unlocated_bottles is None
    assert cellar.stock_for(cellar.wines[wine_id]).unlocated_bottles is None




def test_order_rejects_non_text_wine_reference() -> None:
    """Order references remain text identifiers; numeric IDs are Owner-only."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Orders": [{"id": "order-1", "wi": 17, "in": 1, "ot": 0}],
    }

    with pytest.raises(PloudError, match="invalid Order record"):
        apply_sync(cellar, objects, 2)


def test_deleted_wine_keeps_historical_orders_as_orphans() -> None:
    """Orders survive Wine deletion and remain outside known-wine stock."""
    cellar = Cellar(
        stock_reconstruction_complete=True,
        wines={
            "deleted-wine": _wine("deleted-wine"),
            "known-wine": _wine("known-wine"),
        },
        orders={
            "historical-order": Order(
                id="historical-order",
                wine_id="deleted-wine",
                incoming=9,
                outgoing=2,
            ),
            "known-order": Order(
                id="known-order",
                wine_id="known-wine",
                incoming=4,
                outgoing=1,
            ),
        },
    )
    objects: PLOUDCollections = {
        "DeletedObjects": [{"id": "deleted-wine", "type": "wine"}],
    }

    unresolved = apply_sync(cellar, objects, 2)

    assert unresolved == set()
    assert "historical-order" in cellar.orders
    assert cellar.orders_without_wine == 1
    assert cellar.stock_for(cellar.wines["known-wine"]).movement_balance == 3
    assert cellar.total_stock_bottles == 3
