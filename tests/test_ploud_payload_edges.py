"""Real-world PLOUD payload edge cases for parsing and delta application."""
from __future__ import annotations

from dataclasses import replace

import pytest
from ploc_cellar.models import Cellar, Order, Rack, RackItem, Wine
from ploc_cellar.ploud import (
    PLOUDCollections,
    PloudError,
    PloudIncompleteDelta,
    _as_json_object,
    _deleted_id,
    _deleted_kind,
    _float,
    _int,
    _merged_optional_text,
    _merged_positive_float,
    _object_id,
    _optional_text,
    _parse_color_rgb,
    _reference_id,
    _source_field,
    apply_sync,
)


def _wine(
    wine_id: str = "wine-1",
    *,
    owner_id: str | None = None,
    domain: str | None = None,
) -> Wine:
    return Wine(
        id=wine_id,
        name="Vin de référence",
        bottles=2,
        bottles_in_cellar=0,
        vintage=2020,
        appellation="AOP",
        color="Rouge",
        color_rgb=(201, 25, 58),
        classification="Village",
        region="Languedoc",
        country="France",
        grapes="Syrah",
        cuvee="Vieilles vignes",
        comment="Garde",
        alcohol_percent=13.5,
        service_temperature_min=15.0,
        service_temperature_max=17.0,
        bottle_format="Bouteille",
        bottle_volume_l=0.75,
        ploud_pid="ploud-123",
        domain=domain,
        owner_id=owner_id,
    )


def test_json_object_rejects_non_string_mapping_keys() -> None:
    assert _as_json_object({1: "not a PLOUD field"}) is None
    assert _as_json_object({"id": "wine-1"}) == {"id": "wine-1"}


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        (True, None),
        (False, None),
        (12, 12),
        (12.0, 12),
        (12.5, None),
        ("12", 12),
        ("12.0", None),
        ("", None),
        (None, None),
    ],
)
def test_integer_parser_matches_poud_numeric_fields(
    value: object, expected: int | None
) -> None:
    assert _int(value) == expected


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        (True, None),
        (False, None),
        (12, 12.0),
        ("13.5", 13.5),
        ("", None),
        ("not-a-number", None),
        (float("inf"), None),
        (float("nan"), None),
        (None, None),
    ],
)
def test_float_parser_rejects_non_finite_or_non_numeric_values(
    value: object, expected: float | None
) -> None:
    assert _float(value) == expected


def test_optional_text_normalizes_empty_and_whitespace_values() -> None:
    assert _optional_text("  Domaine  ") == "Domaine"
    assert _optional_text("   ") is None
    assert _optional_text(None) is None
    assert _optional_text(42) is None


def test_source_field_prefers_expanded_value_when_raw_value_is_blank() -> None:
    present, value = _source_field(
        {"nm": " "},
        {"name": "Domaine PLOUD"},
        "name",
        "nm",
    )

    assert present is True
    assert value == "Domaine PLOUD"


def test_source_field_distinguishes_missing_from_explicit_clear() -> None:
    assert _source_field({}, {}, "appellation") == (False, None)
    assert _source_field({"appellation": ""}, {}, "appellation") == (True, "")


def test_optional_text_merge_preserves_omitted_and_applies_clear() -> None:
    assert _merged_optional_text({}, {}, "AOP", "appellation") == "AOP"
    assert _merged_optional_text(
        {"appellation": "   "}, {}, "AOP", "appellation"
    ) is None
    assert _merged_optional_text(
        {"appellation": None}, {}, "AOP", "appellation"
    ) is None


def test_optional_text_merge_rejects_wrong_payload_type() -> None:
    with pytest.raises(PloudError, match="invalid text field"):
        _merged_optional_text(
            {"appellation": 2020}, {}, "AOP", "appellation"
        )


def test_positive_float_merge_preserves_omission_and_clears_zero() -> None:
    assert _merged_positive_float({}, {}, 13.5, "alcohol_percent") == 13.5
    assert _merged_positive_float(
        {"alcohol_percent": "0"}, {}, 13.5, "alcohol_percent"
    ) is None
    assert _merged_positive_float(
        {"alcohol_percent": None}, {}, 13.5, "alcohol_percent"
    ) is None


@pytest.mark.parametrize("value", [True, -1, "NaN", "not-a-number", []])
def test_positive_float_merge_rejects_invalid_poud_values(value: object) -> None:
    with pytest.raises(PloudError, match="invalid numeric field"):
        _merged_positive_float(
            {"alcohol_percent": value}, {}, 13.5, "alcohol_percent"
        )


def test_reference_and_object_ids_reject_invalid_values() -> None:
    assert _reference_id(17) == "17"
    assert _reference_id("  wine-1  ") == "wine-1"
    assert _reference_id("  ") is None
    with pytest.raises(PloudError, match="invalid reference ID"):
        _reference_id(True)
    with pytest.raises(PloudError, match="invalid reference ID"):
        _reference_id([])
    with pytest.raises(PloudError, match="invalid Wine ID"):
        _object_id({"id": 17}, "Wine")


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ([0, 128, 255], (0, 128, 255)),
        ((1, 2.0, "3"), (1, 2, 3)),
        ([1, 2], None),
        ([1, 2, 256], None),
        ([1, True, 3], None),
        ("1,2,3", None),
    ],
)
def test_rgb_parser_accepts_only_three_valid_byte_components(
    value: object, expected: tuple[int, int, int] | None
) -> None:
    assert _parse_color_rgb(value) == expected


def test_deleted_object_id_supports_poud_key_variants_and_numeric_ids() -> None:
    assert _deleted_id({"Id": " wine-1 "}) == "wine-1"
    assert _deleted_id({"ID": 17}) == "17"
    assert _deleted_id({"id": True}) is None
    assert _deleted_id({"id": " "}) is None


@pytest.mark.parametrize(
    ("record", "expected"),
    [
        ({"type": 100}, "wine"),
        ({"Type": "106"}, "owner"),
        ({"objectType": 111}, "rack"),
        ({"ObjectType": "112"}, "rackitem"),
        ({"ty": "rack_item"}, "rackitem"),
        ({"type": "future-type"}, "futuretype"),
        ({"type": True}, ""),
        ({}, ""),
    ],
)
def test_deleted_object_type_accepts_documented_poud_variants(
    record: dict[str, object], expected: str
) -> None:
    assert _deleted_kind(record) == expected


def test_wine_parser_reads_expanded_reference_fields_and_compact_aliases() -> None:
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": "wine-1",
                "ploud_reference_fields": {
                    "nm": "Cuvée des collines",
                    "bo": "3",
                    "vi": "2021",
                    "co": "8024",
                    "gr": "Grenache",
                    "cu": "Parcelle nord",
                    "de": "14.0",
                    "ti": "14",
                    "to": "16",
                    "pid": "PID-42",
                },
            }
        ],
    }

    apply_sync(cellar, objects, 2)

    wine = cellar.wines["wine-1"]
    assert wine.name == "Cuvée des collines"
    assert wine.bottles == 3
    assert wine.vintage == 2021
    assert wine.color_rgb == (201, 25, 58)
    assert wine.grapes == "Grenache"
    assert wine.cuvee == "Parcelle nord"
    assert wine.alcohol_percent == 14.0
    assert wine.service_temperature_min == 14.0
    assert wine.service_temperature_max == 16.0
    assert wine.ploud_pid == "PID-42"


def test_wine_partial_delta_preserves_omitted_reference_fields() -> None:
    previous = _wine()
    cellar = Cellar(wines={previous.id: previous})
    objects: PLOUDCollections = {
        "Wines": [{"id": previous.id}],
    }

    apply_sync(cellar, objects, 2)

    assert cellar.wines[previous.id] == replace(previous, bottles_in_cellar=0)


def test_wine_partial_delta_explicitly_clears_optional_reference_fields() -> None:
    previous = _wine()
    cellar = Cellar(wines={previous.id: previous})
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": previous.id,
                "bottles": 2,
                "appellation": "",
                "grapes": None,
                "alcohol_percent": 0,
            }
        ],
    }

    apply_sync(cellar, objects, 2)

    wine = cellar.wines[previous.id]
    assert wine.appellation is None
    assert wine.grapes is None
    assert wine.alcohol_percent is None
    assert wine.region == previous.region


def test_wine_parser_uses_custom_rgb_when_no_known_color_reference_exists() -> None:
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin orange",
                "bottles": 1,
                "color_id": "unknown-color",
                "color_rgb": [240, 142, 68],
            }
        ],
    }

    apply_sync(cellar, objects, 2)

    assert cellar.wines["wine-1"].color_rgb == (240, 142, 68)


def test_wine_parser_rejects_invalid_custom_rgb() -> None:
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin orange",
                "bottles": 1,
                "color_rgb": [240, 142, 300],
            }
        ],
    }

    with pytest.raises(PloudError, match="invalid RGB color"):
        apply_sync(cellar, objects, 2)


def test_wine_parser_logs_conflicting_bottle_count_representations(
    caplog: pytest.LogCaptureFixture,
) -> None:
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin test",
                "bottles": 2,
                "bo": 3,
            }
        ],
    }

    apply_sync(cellar, objects, 2)

    assert cellar.wines["wine-1"].bottles == 2
    assert "bottle-count fields disagree" in caplog.text


@pytest.mark.parametrize("bottles", [True, -1, 1.5, "not-a-count"])
def test_wine_parser_rejects_invalid_bottle_count(bottles: object) -> None:
    cellar = Cellar()
    objects: PLOUDCollections = {
        "Wines": [
            {
                "id": "wine-1",
                "name": "Vin test",
                "bottles": bottles,
            }
        ],
    }

    with pytest.raises(PloudError, match="invalid bottle count"):
        apply_sync(cellar, objects, 2)


def test_new_wine_without_bottle_count_requires_complete_record() -> None:
    with pytest.raises(PloudIncompleteDelta, match="bottle count"):
        apply_sync(
            Cellar(),
            {"Wines": [{"id": "wine-1", "name": "Vin test"}]},
            2,
        )


def test_owner_name_alias_updates_existing_wines() -> None:
    previous = _wine(owner_id="owner-1", domain="Ancien domaine")
    cellar = Cellar(wines={previous.id: previous})
    objects: PLOUDCollections = {
        "Owners": [{"id": "owner-1", "fullName": "  Domaine actuel  "}],
    }

    apply_sync(cellar, objects, 2)

    assert cellar.wines[previous.id].domain == "Domaine actuel"


def test_deleted_owner_clears_domain_without_marking_it_unresolved() -> None:
    previous = _wine(owner_id="owner-1", domain="Domaine supprimé")
    cellar = Cellar(wines={previous.id: previous})
    objects: PLOUDCollections = {
        "DeletedObjects": [{"id": "owner-1", "type": 106}],
    }

    unresolved = apply_sync(cellar, objects, 2)

    assert unresolved == set()
    assert cellar.wines[previous.id].domain is None


def test_partial_rack_item_update_preserves_references_and_clears_position() -> None:
    cellar = Cellar(
        racks={"rack-1": Rack("rack-1", "Cave")},
        wines={"wine-1": _wine()},
        rack_items={
            "slot-1": RackItem("slot-1", "rack-1", "wine-1", 2, 4)
        },
    )
    objects: PLOUDCollections = {
        "RackItems": [{"id": "slot-1", "rw": None, "cl": ""}],
    }

    apply_sync(cellar, objects, 2)

    item = cellar.rack_items["slot-1"]
    assert item.rack_id == "rack-1"
    assert item.wine_id == "wine-1"
    assert item.row is None
    assert item.column is None


def test_full_snapshot_can_contain_an_empty_rack_position() -> None:
    cellar = Cellar(racks={"rack-1": Rack("rack-1", "Cave")})

    apply_sync(
        cellar,
        {"RackItems": [{"id": "slot-1", "rk": "rack-1"}]},
        2,
        full_snapshot=True,
    )

    assert cellar.rack_items["slot-1"].wine_id == ""


@pytest.mark.parametrize(
    ("field", "value", "message"),
    [
        ("rk", [], "invalid rack ID"),
        ("wi", 17, "invalid wine ID"),
        ("rw", "first", "invalid row"),
        ("cl", 1.5, "invalid column"),
    ],
)
def test_rack_item_parser_rejects_malformed_position_data(
    field: str, value: object, message: str
) -> None:
    record: dict[str, object] = {
        "id": "slot-1",
        "rk": "rack-1",
        "wi": "wine-1",
        field: value,
    }

    with pytest.raises(PloudError, match=message):
        apply_sync(Cellar(), {"RackItems": [record]}, 2)


def test_order_delta_preserves_fields_omitted_by_server() -> None:
    cellar = Cellar(
        orders={
            "order-1": Order(
                id="order-1",
                wine_id="wine-1",
                incoming=5,
                outgoing=2,
            )
        }
    )

    apply_sync(
        cellar,
        {"Orders": [{"id": "order-1", "in": 8}]},
        2,
    )

    assert cellar.orders["order-1"] == Order(
        id="order-1",
        wine_id="wine-1",
        incoming=8,
        outgoing=2,
    )


def test_new_order_without_all_movement_fields_is_incomplete() -> None:
    with pytest.raises(PloudIncompleteDelta, match="required movement fields"):
        apply_sync(
            Cellar(),
            {"Orders": [{"id": "order-1", "wi": "wine-1", "in": 1}]},
            2,
        )


@pytest.mark.parametrize(
    ("incoming", "outgoing"),
    [(-1, 0), (0, -1), (True, 0), (1.5, 0)],
)
def test_order_parser_rejects_invalid_movement_counts(
    incoming: object, outgoing: object
) -> None:
    with pytest.raises(PloudError, match="invalid Order record"):
        apply_sync(
            Cellar(),
            {
                "Orders": [
                    {
                        "id": "order-1",
                        "wi": "wine-1",
                        "in": incoming,
                        "ot": outgoing,
                    }
                ]
            },
            2,
        )


@pytest.mark.parametrize(
    ("kind", "object_id"),
    [
        ("100", "wine-1"),
        ("111", "rack-1"),
        ("112", "slot-1"),
    ],
)
def test_numeric_deleted_object_types_remove_the_matching_entity(
    kind: str, object_id: str
) -> None:
    cellar = Cellar(
        wines={"wine-1": _wine()},
        racks={"rack-1": Rack("rack-1", "Cave")},
        rack_items={"slot-1": RackItem("slot-1", "rack-1", "wine-1", 1, 1)},
    )

    apply_sync(
        cellar,
        {"DeletedObjects": [{"Id": object_id, "ty": kind}]},
        2,
    )

    if kind == "100":
        assert "wine-1" not in cellar.wines
        assert cellar.rack_items["slot-1"].wine_id == ""
    elif kind == "111":
        assert "rack-1" not in cellar.racks
        assert "slot-1" not in cellar.rack_items
    else:
        assert "slot-1" not in cellar.rack_items


def test_untyped_deleted_id_removes_only_an_unambiguous_match() -> None:
    cellar = Cellar(
        wines={"shared-id": _wine("shared-id")},
        racks={"shared-id": Rack("shared-id", "Cave")},
    )

    apply_sync(cellar, {"DeletedObjects": [{"id": "shared-id"}]}, 2)

    assert "shared-id" in cellar.wines
    assert "shared-id" in cellar.racks


def test_deleted_object_with_unknown_id_or_type_is_ignored() -> None:
    cellar = Cellar(wines={"wine-1": _wine()})

    apply_sync(
        cellar,
        {
            "DeletedObjects": [
                {"id": []},
                {"id": "wine-1", "type": "future-object"},
            ]
        },
        2,
    )

    assert "wine-1" in cellar.wines
