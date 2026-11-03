"""Resolve the PLOUD language from Home Assistant settings."""
from __future__ import annotations

from homeassistant.core import HomeAssistant

from .const import SUPPORTED_LANGUAGES

# Countries where French is an official language or is widely used.
FRENCH_SPEAKING_COUNTRIES: frozenset[str] = frozenset(
    {
        "AD",  # Andorra
        "BE",  # Belgium
        "BF",  # Burkina Faso
        "BI",  # Burundi
        "BJ",  # Benin
        "CA",  # Canada
        "CD",  # Democratic Republic of the Congo
        "CF",  # Central African Republic
        "CG",  # Republic of the Congo
        "CH",  # Switzerland
        "CI",  # Côte d'Ivoire
        "CM",  # Cameroon
        "DJ",  # Djibouti
        "DZ",  # Algeria
        "FR",  # France
        "GA",  # Gabon
        "GN",  # Guinea
        "GQ",  # Equatorial Guinea
        "HT",  # Haiti
        "KM",  # Comoros
        "LB",  # Lebanon
        "LU",  # Luxembourg
        "MA",  # Morocco
        "MC",  # Monaco
        "MG",  # Madagascar
        "ML",  # Mali
        "MR",  # Mauritania
        "MU",  # Mauritius
        "NE",  # Niger
        "RW",  # Rwanda
        "SC",  # Seychelles
        "SN",  # Senegal
        "TD",  # Chad
        "TG",  # Togo
        "TN",  # Tunisia
        "VU",  # Vanuatu
    }
)


def get_default_ploud_language(hass: HomeAssistant) -> str:
    """Return the automatic PLOUD language from Home Assistant's core settings."""
    if country := hass.config.country:
        return "fr" if country.upper() in FRENCH_SPEAKING_COUNTRIES else "en"

    home_assistant_language = (
        hass.config.language.casefold().replace("_", "-").partition("-")[0]
    )
    return "fr" if home_assistant_language == "fr" else "en"


def get_ploud_language(
    hass: HomeAssistant, configured_language: object
) -> str:
    """Return a manual language override or the automatic Home Assistant language."""
    if (
        isinstance(configured_language, str)
        and configured_language in SUPPORTED_LANGUAGES
    ):
        return configured_language

    return get_default_ploud_language(hass)
