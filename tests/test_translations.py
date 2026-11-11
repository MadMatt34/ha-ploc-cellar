"""Verify that Home Assistant translation dictionaries stay structurally aligned."""

import json
from pathlib import Path
from typing import Any

import pytest

TRANSLATIONS_DIR = (
    Path(__file__).parents[1]
    / "custom_components"
    / "ploc_cellar"
    / "translations"
)


def _flatten_keys(value: dict[str, Any], prefix: str = "") -> set[str]:
    keys: set[str] = set()
    for key, child in value.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(child, dict):
            keys.update(_flatten_keys(child, path))
        else:
            keys.add(path)
    return keys


@pytest.fixture
def translations() -> dict[str, dict[str, Any]]:
    return {
        language: json.loads(
            (TRANSLATIONS_DIR / f"{language}.json").read_text(encoding="utf-8")
        )
        for language in ("en", "fr")
    }


def test_english_and_french_translation_keys_match(
    translations: dict[str, dict[str, Any]],
) -> None:
    assert _flatten_keys(translations["en"]) == _flatten_keys(translations["fr"])


@pytest.mark.parametrize("language", ("en", "fr"))
def test_translation_leaf_values_are_non_empty_strings(
    translations: dict[str, dict[str, Any]], language: str
) -> None:
    def visit(value: dict[str, Any], prefix: str = "") -> None:
        for key, child in value.items():
            path = f"{prefix}.{key}" if prefix else key
            if isinstance(child, dict):
                visit(child, path)
            else:
                assert isinstance(child, str), f"{language}.{path} must be a string"
                assert child.strip(), f"{language}.{path} must not be empty"

    visit(translations[language])
