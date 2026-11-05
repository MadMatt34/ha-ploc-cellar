"""Cryptographic payload and HTTP contract tests for PLOC authentication."""
from __future__ import annotations

import asyncio
import base64
from typing import Any

import pytest
from aiohttp import ClientError

from ploc_cellar import auth


class _Response:
    """Async response context manager for authentication requests."""

    def __init__(self, status: int, payload: object) -> None:
        self.status = status
        self.reason = "test"
        self.headers = {"Content-Type": "application/json"}
        self.payload = payload

    async def __aenter__(self) -> _Response:
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        traceback: object,
    ) -> None:
        return None

    async def json(self, *, content_type: str | None = None) -> object:
        return self.payload


class _Session:
    """Capture sequential authentication API requests."""

    def __init__(self, responses: list[_Response]) -> None:
        self.responses = iter(responses)
        self.requests: list[tuple[str, dict[str, Any]]] = []

    def post(self, url: str, **kwargs: Any) -> _Response:
        self.requests.append((url, kwargs))
        return next(self.responses)


def test_signin_payload_has_required_encrypted_fields() -> None:
    """The sign-in payload has valid base64 ciphertext and no plaintext secrets."""
    payload = auth._build_signin_payload("user@example.com", "secret-password")

    assert isinstance(payload["timestamp"], int)
    assert payload["version"] == auth.PLOC_VERSION
    assert payload["apnsToken"] == ""
    for field in ("iv", "key", "email", "password", "application", "signature"):
        decoded = base64.b64decode(payload[field], validate=True)
        assert decoded
    assert payload["email"] != "user@example.com"
    assert payload["password"] != "secret-password"


def test_response_detail_extracts_safe_error_text() -> None:
    """Useful API error details are extracted without dumping response values."""
    assert auth._response_detail({"error": {"message": "invalid credentials"}}) == (
        "; message=invalid credentials"
    )
    assert auth._response_detail({"token": "secret"}) == ""
    assert auth._response_detail("not an object") == ""


def test_authenticate_signs_in_and_activates_ploud() -> None:
    """PLOC account token is exchanged for the separate PLOUD access token."""
    session = _Session(
        [
            _Response(200, {"Account": {"AccessToken": "account-token"}}),
            _Response(200, {"Account": {"Ploud": {"AccessToken": "ploud-token"}}}),
        ]
    )

    token = asyncio.run(
        auth.async_authenticate(
            session, " user@example.com ", "password", "fr"
        )
    )

    assert token == "ploud-token"
    assert len(session.requests) == 2
    signin_url, signin_request = session.requests[0]
    activation_url, activation_request = session.requests[1]
    assert signin_url == f"{auth.AUTH_API_BASE}/signin"
    assert activation_url == f"{auth.GATEWAY_API_BASE}/ploud/activate"
    assert signin_request["timeout"].total == 30
    activation_payload = activation_request["json"]
    assert activation_payload["accessToken"] == "account-token"
    assert activation_payload["language"] == "fr"
    assert activation_payload["ploudToken"] == "PLOUD"
    assert activation_request["timeout"].total == 30


@pytest.mark.parametrize("status", [401, 403, 400])
def test_authentication_rejects_authentication_http_errors(status: int) -> None:
    """Credential and client errors are reported as authentication failures."""
    session = _Session([_Response(status, {"message": "rejected"})])

    with pytest.raises(auth.PlocAuthError, match=f"HTTP {status}"):
        asyncio.run(
            auth._post_json(
                session, "https://example.test", "signin", {}, "sign-in"
            )
        )


@pytest.mark.parametrize("status", [408, 425, 429, 500, 503])
def test_authentication_classifies_transient_http_errors(status: int) -> None:
    """Rate limits and server failures are reported as connection failures."""
    session = _Session([_Response(status, {"message": "temporarily unavailable"})])

    with pytest.raises(auth.PlocConnectionError, match=f"HTTP {status}"):
        asyncio.run(auth._post_json(session, "https://example.test", "signin", {}, "sign-in"))


def test_authentication_wraps_network_errors() -> None:
    """Transport exceptions do not escape the authentication abstraction."""
    class _BrokenSession:
        def post(self, url: str, **kwargs: Any) -> _Response:
            raise ClientError("offline")

    with pytest.raises(auth.PlocConnectionError, match="unavailable"):
        asyncio.run(
            auth._post_json(
                _BrokenSession(), "https://example.test", "signin", {}, "sign-in"
            )
        )


def test_authentication_rejects_non_object_json() -> None:
    """A successful response must still contain a JSON object."""
    session = _Session([_Response(200, ["not", "an", "object"])])

    with pytest.raises(auth.PlocAuthError, match="invalid JSON object"):
        asyncio.run(auth._post_json(session, "https://example.test", "signin", {}, "sign-in"))


def test_authentication_requires_both_tokens() -> None:
    """A sign-in response without an account token cannot activate PLOUD."""
    session = _Session([_Response(200, {"Account": {}})])

    with pytest.raises(auth.PlocAuthError, match="no account access token"):
        asyncio.run(
            auth.async_authenticate(
                session, "user@example.com", "password", "en"
            )
        )
