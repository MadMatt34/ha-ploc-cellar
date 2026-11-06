"""Corrupted-storage and legacy-cache regression tests for cellar models."""
from __future__ import annotations

from typing import Any, cast

import pytest
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine, normalize_identifier


def _wine() -> Wine:
    return Wine(
        id="wine-1",
        name="Vin de référence",
        bottles=3,
        bottles_in_cellar=1,
        vintage=2021,
        appellation="AOP",
        color="Rouge",
        color_rgb=(201, 25, 58),
        classification="Village",
        region="Languedoc",
        country="France",
        grapes="Syrah",
        cuvee="Parcelle",
        comment=None,
        alcohol_percent=13.5,
        service_temperature_min=15.0,
        service_temperature_max=17.0,
        bottle_format="Bouteille",
        bottle_volume_l=0.75,
        ploud_pid="pid-1",
        domain="Domaine",
        owner_id="owner-1",
    )


def _valid_snapshot() -> dict[str, Any]:
    cellar = Cellar(
        cursor=123,
        initialized=True,
        stock_reconstruction_complete=True,
        wines={"wine-1": _wine()},
        racks={"rack-1": Rack("rack-1", "Cave")},
        rack_items={"slot-1": RackItem("slot-1", "rack-1", "wine-1", 1, 1)},
        orders={"order-1": Order("order-1", "wine-1", 4, 1)},
    )
    return cast(dict[str, Any], cellar.to_storage())


def test_identifier_normalization_keeps_opaque_ids_and_rejects_empty_values() -> None:
    assert normalize_identifier("  rack-A  ") == "rack-A"
    assert normalize_identifier(" ") == ""


def test_rack_item_validation_rejects_mismatched_identity_and_unknown_wine() -> None:
    cellar = Cellar(
        racks={"rack-1": Rack("rack-1", "Cave")},
        wines={"wine-1": _wine()},
        rack_items={"slot-1": RackItem("different-id", "rack-1", "wine-1", 1, 1)},
    )
    with pytest.raises(ValueError, match="Invalid RackItem identifier"):
        cellar.validate_rack_items()

    cellar.rack_items["slot-1"] = RackItem(
        "slot-1", "rack-1", "missing-wine", 1, 1
    )
    with pytest.raises(ValueError, match="unknown wine"):
        cellar.validate_rack_items()


@pytest.mark.parametrize(
    ("field", "value", "message"),
    [
        ("bottles", True, "Invalid bottles value"),
        ("bottles_in_cellar", -1, "Invalid bottles_in_cellar value"),
        ("vintage", 0, "Invalid Wine vintage"),
        ("appellation", 42, "Invalid Wine field appellation"),
        ("owner_id", " owner-1 ", "Non-canonical Wine owner_id"),
        ("alcohol_percent", True, "Invalid Wine field alcohol_percent"),
        ("bottle_volume_l", 0.0, "Invalid Wine field bottle_volume_l"),
        ("color_rgb", [1, 2, 300], "Invalid Wine color_rgb"),
    ],
)
def test_current_storage_rejects_invalid_wine_fields(
    field: str, value: object, message: str
) -> None:
    data = _valid_snapshot()
    data["wines"]["wine-1"][field] = value

    with pytest.raises(ValueError, match=message):
        Cellar.from_storage(data)


def test_current_storage_rejects_missing_wine_fields_and_invalid_collections() -> None:
    data = _valid_snapshot()
    data["wines"]["wine-1"].pop("country")

    with pytest.raises(ValueError, match="Incomplete Wine record"):
        Cellar.from_storage(data)

    data = _valid_snapshot()
    data["rack_items"] = []

    with pytest.raises(ValueError, match="rack_items collection"):
        Cellar.from_storage(data)


def test_current_storage_rejects_invalid_rack_and_rack_item_records() -> None:
    data = _valid_snapshot()
    data["racks"]["rack-1"]["name"] = None

    with pytest.raises(ValueError, match="Incomplete Rack record"):
        Cellar.from_storage(data)

    data = _valid_snapshot()
    data["rack_items"]["slot-1"]["row"] = True

    with pytest.raises(ValueError, match="Invalid RackItem row"):
        Cellar.from_storage(data)


def test_current_storage_rejects_invalid_order_records() -> None:
    data = _valid_snapshot()
    data["orders"]["order-1"]["incoming"] = True

    with pytest.raises(ValueError, match="Invalid Order incoming"):
        Cellar.from_storage(data)

    data = _valid_snapshot()
    data["orders"]["order-1"]["wine_id"] = " wine-1 "

    with pytest.raises(ValueError, match="Non-canonical Order wine_id"):
        Cellar.from_storage(data)


def test_legacy_cache_restores_compact_reference_fields_and_rgb() -> None:
    stored = {
        "version": 5,
        "cursor": 123,
        "initialized": True,
        "wines": {
            "wine-legacy": {
                "id": "wine-legacy",
                "name": "Vin historique",
                "bottles": " ",
                "color_rgb": [10, 20, 30],
                "ploud_reference_fields": {
                    "bo": "2",
                    "vi": "2020",
                    "gr": "Grenache",
                    "cu": "Vieilles vignes",
                    "de": "14.0",
                    "ti": "15",
                    "to": "17",
                    "pid": "PID-legacy",
                },
            }
        },
        "racks": {},
        "rack_items": {},
        "orders": {},
    }

    cellar = Cellar.from_storage(cast(Any, stored))

    wine = cellar.wines["wine-legacy"]
    assert wine.bottles == 2
    assert wine.vintage == 2020
    assert wine.color_rgb == (10, 20, 30)
    assert wine.grapes == "Grenache"
    assert wine.cuvee == "Vieilles vignes"
    assert wine.alcohol_percent == 14.0
    assert wine.service_temperature_min == 15.0
    assert wine.service_temperature_max == 17.0
    assert wine.ploud_pid == "PID-legacy"


def test_legacy_cache_ignores_non_record_entries_and_rejects_duplicate_ids() -> None:
    stored = {
        "version": 5,
        "cursor": 123,
        "initialized": True,
        "wines": {
            "ignored": "not a wine record",
            "wine-1": {
                "id": "wine-1",
                "name": "Vin",
                "bottles": 1,
            },
            " wine-1 ": {
                "id": "wine-1",
                "name": "Doublon",
                "bottles": 1,
            },
        },
        "racks": {},
        "rack_items": {},
        "orders": {},
    }

    with pytest.raises(ValueError, match="Duplicate wine ID"):
        Cellar.from_storage(cast(Any, stored))


def test_legacy_cache_rejects_invalid_order_movement_and_reference() -> None:
    base: dict[str, Any] = {
        "version": 5,
        "cursor": 123,
        "initialized": True,
        "wines": {},
        "racks": {},
        "rack_items": {},
        "orders": {
            "order-1": {
                "id": "order-1",
                "wine_id": "wine-1",
                "incoming": -1,
                "outgoing": 0,
            }
        },
    }

    with pytest.raises(ValueError, match="Invalid stock movement"):
        Cellar.from_storage(cast(Any, base))

    base["orders"]["order-1"]["incoming"] = 1
    base["orders"]["order-1"]["wine_id"] = " "
    with pytest.raises(ValueError, match="Invalid wine reference"):
        Cellar.from_storage(cast(Any, base))


def test_current_storage_requires_consistent_stock_reconstruction_state() -> None:
    data = _valid_snapshot()
    data["stock_reconstruction_complete"] = False

    with pytest.raises(ValueError, match="full-sync cursor"):
        Cellar.from_storage(data)

    data = _valid_snapshot()
    data["stock_reconstruction_complete"] = "yes"

    with pytest.raises(ValueError, match="Invalid stock reconstruction flag"):
        Cellar.from_storage(data)
