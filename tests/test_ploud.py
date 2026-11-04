"""Unit tests for PLOUD delta parsing and inventory integrity."""
from __future__ import annotations

import pytest

from custom_components.ploc_cellar.models import Cellar, Order, Rack, Wine
from custom_components.ploc_cellar.ploud import (
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
            {"id": "wine-1", "bottles": 1, "owner_id": "owner-1"},
        ],
    }

    unresolved = apply_sync(cellar, objects, 2)

    assert unresolved == {"owner-1"}
    assert cellar.wines["wine-1"].domain is None


def test_duplicate_owner_ids_are_rejected_case_insensitively() -> None:
    """Owner UUIDs differing only by case still identify the same Owner."""
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Owners": [
            {"id": "owner-1", "fullname": "Domaine"},
            {"id": "OWNER-1", "fullname": "Autre domaine"},
        ],
    }

    with pytest.raises(PloudError, match="duplicate Owner ID"):
        apply_sync(cellar, objects, 2)


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


def test_deleted_wine_keeps_historical_orders_as_orphans() -> None:
    """Orders survive Wine deletion and remain outside known-wine stock."""
    cellar = Cellar(
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

    apply_sync(cellar, objects, 2)

    assert "historical-order" in cellar.orders
    assert cellar.orphaned_order_count == 1
    assert cellar.stock_for(cellar.wines["known-wine"]).movement_balance == 3
    assert cellar.total_stock_bottles == 3
