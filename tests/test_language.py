"""Tests for automatic and explicit PLOUD language selection."""
from __future__ import annotations

from types import SimpleNamespace

import pytest
from ploc_cellar.language import (
    FRENCH_SPEAKING_COUNTRIES,
    get_default_ploud_language,
    get_ploud_language,
)


@pytest.mark.parametrize("country", sorted(FRENCH_SPEAKING_COUNTRIES))
def test_french_speaking_country_selects_french(country: str) -> None:
    """Every configured francophone country selects French automatically."""
    hass = SimpleNamespace(
        config=SimpleNamespace(country=country, language="en")
    )
    assert get_default_ploud_language(hass) == "fr"


@pytest.mark.parametrize("country", ["US", "GB", "DE", "JP", ""])
def test_non_francophone_country_selects_language_from_ha(country: str) -> None:
    """A non-francophone country falls back to HA's UI language."""
    hass = SimpleNamespace(
        config=SimpleNamespace(country=country, language="fr-CA")
    )
    assert get_default_ploud_language(hass) == "fr"


@pytest.mark.parametrize("language", ["en", "en-US", "de", ""])
def test_non_french_ha_language_defaults_to_english(language: str) -> None:
    """Non-French HA languages use English unless a country is francophone."""
    hass = SimpleNamespace(
        config=SimpleNamespace(country=None, language=language)
    )
    assert get_default_ploud_language(hass) == "en"


@pytest.mark.parametrize("override", ["fr", "en"])
def test_supported_language_override_has_priority(override: str) -> None:
    """A supported manual choice overrides automatic language detection."""
    hass = SimpleNamespace(
        config=SimpleNamespace(country="FR", language="fr")
    )
    assert get_ploud_language(hass, override) == override


@pytest.mark.parametrize("override", [None, "", "auto", "FR", 1, True])
def test_invalid_language_override_uses_automatic_language(
    override: object,
) -> None:
    """Unknown or malformed options never leak into the PLOUD request."""
    hass = SimpleNamespace(
        config=SimpleNamespace(country="US", language="fr")
    )
    assert get_ploud_language(hass, override) == "en"
