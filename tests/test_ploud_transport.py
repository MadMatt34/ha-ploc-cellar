"""Transport-level robustness tests for the PLOUD sync client."""
from __future__ import annotations

import asyncio
from typing import Any, cast

import aiohttp
import pytest
from ploc_cellar.ploud import PloudAuthError, PloudError, async_sync


class _FakeResponse:
    """Small aiohttp response double supporting async context management."""

    def __init__(
        self,
        *,
        status: int = 200,
        payload: object = None,
        json_error: Exception | None = None,
    ) -> None:
        self.status = status
        self.payload = payload
        self.json_error = json_error

    async def __aenter__(self) -> _FakeResponse:
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        traceback: object,
    ) -> None:
        return None

    async def json(self, *, content_type: str | None = None) -> object:
        """Return the configured payload or simulate JSON decoding failure."""
        if self.json_error is not None:
            raise self.json_error
        return self.payload


class _FakeSession:
    """Minimal session double for deterministic HTTP and network failures."""

    def __init__(
        self,
        response: _FakeResponse | None = None,
        request_error: Exception | None = None,
    ) -> None:
        self.response = response or _FakeResponse(
            payload={"objects": {}}
        )
        self.request_error = request_error
        self.request_url: str | None = None
        self.request_timeout: aiohttp.ClientTimeout | None = None

    def post(
        self,
        url: str,
        *,
        data: aiohttp.FormData,
        timeout: aiohttp.ClientTimeout,
    ) -> _FakeResponse:
        """Capture request details and return the configured response."""
        self.request_url = url
        self.request_timeout = timeout
        if self.request_error is not None:
            raise self.request_error
        return self.response


def _run_sync(session: _FakeSession) -> tuple[dict[str, list[dict[str, Any]]], int]:
    """Run one sync request through the public transport function."""
    return asyncio.run(
        async_sync(
            cast(aiohttp.ClientSession, session),
            server="https://ploud.example/",
            token="test-token",
            device="device-identifier",
            language="fr",
            cursor=123,
        )
    )


def test_sync_sends_request_to_expected_endpoint() -> None:
    """The transport posts to the sync endpoint and configures a timeout."""
    session = _FakeSession()

    collections, cursor = _run_sync(session)

    assert collections == {}
    assert cursor >= 123
    assert session.request_url == "https://ploud.example/sync/exec"
    assert session.request_timeout is not None
    assert session.request_timeout.total == 120


@pytest.mark.parametrize("status", [400, 404, 429, 500, 502, 503])
def test_sync_rejects_http_errors(status: int) -> None:
    """Non-success HTTP responses are surfaced as PLOUD errors."""
    session = _FakeSession(
        _FakeResponse(status=status, payload={"error": "upstream failure"})
    )

    with pytest.raises(PloudError, match=f"HTTP {status}"):
        _run_sync(session)


def test_sync_rejects_invalid_access_token() -> None:
    """An HTTP 401 response is reported as an authentication error."""
    session = _FakeSession(_FakeResponse(status=401, payload={}))

    with pytest.raises(PloudAuthError, match="access token"):
        _run_sync(session)


def test_sync_rejects_invalid_json() -> None:
    """A successful HTTP response with malformed JSON is rejected."""
    session = _FakeSession(
        _FakeResponse(status=200, json_error=ValueError("invalid JSON"))
    )

    with pytest.raises(PloudError, match="invalid JSON"):
        _run_sync(session)


@pytest.mark.parametrize("payload", [None, [], "not-an-object", 42])
def test_sync_rejects_non_object_json_payload(payload: object) -> None:
    """The top-level JSON response must be an object."""
    session = _FakeSession(_FakeResponse(payload=payload))

    with pytest.raises(PloudError, match=r"invalid JSON|not a JSON object"):
        _run_sync(session)


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"Objects": None},
        {"objects": []},
        {"objects": "not-an-object"},
    ],
)
def test_sync_rejects_missing_or_invalid_objects_container(
    payload: object,
) -> None:
    """The response must contain an object-valued objects container."""
    session = _FakeSession(_FakeResponse(payload=payload))

    with pytest.raises(PloudError, match="objects collection"):
        _run_sync(session)


def test_sync_accepts_empty_delta_and_omitted_collections() -> None:
    """Collections omitted from an incremental delta are legitimately empty."""
    session = _FakeSession(_FakeResponse(payload={"objects": {"Wines": []}}))

    collections, _ = _run_sync(session)

    assert collections == {"Wines": []}


def test_sync_ignores_unknown_collections() -> None:
    """New server-side collections do not break forward-compatible parsing."""
    session = _FakeSession(
        _FakeResponse(
            payload={
                "objects": {
                    "Wines": [],
                    "FutureCollection": [{"id": "ignored"}],
                }
            }
        )
    )

    collections, _ = _run_sync(session)

    assert collections == {"Wines": []}


@pytest.mark.parametrize(
    ("collection", "expected_message"),
    [
        ("Wines", "is not an array"),
        ("RackItems", "contains an invalid record"),
    ],
)
def test_sync_rejects_malformed_collection_data(
    collection: str,
    expected_message: str,
) -> None:
    """Known collections must be arrays containing JSON objects only."""
    value: object = "not-an-array" if collection == "Wines" else [None]
    session = _FakeSession(
        _FakeResponse(payload={"objects": {collection: value}})
    )

    with pytest.raises(PloudError, match=expected_message):
        _run_sync(session)


def test_sync_rejects_duplicate_collection_names_ignoring_case() -> None:
    """Case variants of one collection cannot silently overwrite each other."""
    session = _FakeSession(
        _FakeResponse(
            payload={"objects": {"Wines": [], "wines": []}}
        )
    )

    with pytest.raises(PloudError, match="duplicate collection names"):
        _run_sync(session)


def test_sync_wraps_request_timeout() -> None:
    """An expired request timeout is converted to a domain-specific error."""
    session = _FakeSession(request_error=TimeoutError("request timed out"))

    with pytest.raises(PloudError, match="sync request failed"):
        _run_sync(session)


def test_sync_wraps_network_errors() -> None:
    """aiohttp connection failures are converted to PLOUD errors."""
    session = _FakeSession(
        request_error=aiohttp.ClientConnectionError("connection refused")
    )

    with pytest.raises(PloudError, match="sync request failed"):
        _run_sync(session)
