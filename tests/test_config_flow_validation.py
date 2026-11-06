"""Pure validation tests for configuration-flow input contracts."""
from __future__ import annotations

import pytest
from ploc_cellar.config_flow import _is_valid_email


@pytest.mark.parametrize(
    "email",
    [
        "user@example.com",
        "first.last+ha@example.co.uk",
        "user@subdomain.example.org",
    ],
)
def test_config_flow_accepts_valid_email_addresses(email: str) -> None:
    """Valid account email addresses pass the config-flow validator."""
    assert _is_valid_email(email) is True


@pytest.mark.parametrize(
    "email",
    [
        "",
        "plain-text",
        "missing-at.example.com",
        "user@",
        "@example.com",
        "user example@example.com",
    ],
)
def test_config_flow_rejects_invalid_email_addresses(email: str) -> None:
    """Malformed account email addresses are rejected before any HTTP call."""
    assert _is_valid_email(email) is False
