"""PLOC account authentication and PLOUD device activation."""
from __future__ import annotations

import base64
import hashlib
import hmac
import os
import time
from typing import Any, cast

from aiohttp import ClientError, ClientSession, ClientTimeout
from cryptography.hazmat.primitives import padding as sym_padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from .const import (
    AUTH_API_BASE,
    GATEWAY_API_BASE,
    PLOC_APPLICATION_NAME,
    PLOC_RSA_PUBLIC_KEY,
    PLOC_VERSION,
    PLOUD_HMAC_KEY,
)


class PlocAuthError(Exception):
    """PLOC rejected credentials or PLOUD activation."""


class PlocConnectionError(Exception):
    """PLOC authentication endpoint could not be reached."""


def _sha_repeat(value: str, count: int) -> str:
    """Apply the repeated SHA-256 transformation used by the PLOC API."""
    result = value
    for _ in range(count):
        result = hashlib.sha256(result.encode("utf-8")).hexdigest()
    return result


def _hmac_b64(value: str) -> str:
    digest = hmac.new(
        PLOUD_HMAC_KEY, value.encode("utf-8"), hashlib.sha256
    ).digest()
    return base64.b64encode(digest).decode("ascii")


def _aes_encrypt(key: bytes, iv: bytes, value: str) -> str:
    aes = algorithms.AES(key)
    padder = sym_padding.PKCS7(aes.block_size).padder()
    padded = padder.update(value.encode("utf-8")) + padder.finalize()
    encryptor = Cipher(aes, modes.CBC(iv)).encryptor()
    encrypted = encryptor.update(padded) + encryptor.finalize()
    return base64.b64encode(encrypted).decode("ascii")


def _rsa_encrypt(public_key: Any, value: bytes) -> str:
    encrypted = public_key.encrypt(value, asym_padding.PKCS1v15())
    return base64.b64encode(encrypted).decode("ascii")


def _build_signin_payload(email: str, password: str) -> dict[str, str | int]:
    """Build the encrypted sign-in payload used by the PLOC Android client."""
    timestamp = int(time.time())
    aes_key = os.urandom(32)
    iv = os.urandom(16)
    public_key = serialization.load_der_public_key(
        base64.b64decode(PLOC_RSA_PUBLIC_KEY)
    )
    iv_b64 = base64.b64encode(iv).decode("ascii")
    key_b64 = _rsa_encrypt(public_key, aes_key)
    email_b64 = _aes_encrypt(aes_key, iv, email)
    password_b64 = _aes_encrypt(aes_key, iv, password)
    application_b64 = _aes_encrypt(aes_key, iv, PLOC_APPLICATION_NAME)

    signing_material = "".join(
        (
            _sha_repeat(str(timestamp), 15),
            _sha_repeat("", 10),
            _sha_repeat(iv_b64, 20),
            _sha_repeat(key_b64, 20),
            _sha_repeat(email_b64, 20),
            _sha_repeat(password_b64, 20),
            _sha_repeat(application_b64, 20),
        )
    )
    return {
        "timestamp": timestamp,
        "iv": iv_b64,
        "key": key_b64,
        "email": email_b64,
        "password": password_b64,
        "application": application_b64,
        "apnsToken": "",
        "version": PLOC_VERSION,
        "signature": _hmac_b64(signing_material),
    }


def _get_dict(value: object) -> dict[str, Any] | None:
    return cast(dict[str, Any], value) if isinstance(value, dict) else None


def _response_detail(value: object) -> str:
    """Return a short, non-secret API error detail when one is available."""
    payload = _get_dict(value)
    if payload is None:
        return ""
    candidates = (
        payload,
        _get_dict(payload.get("error")),
        _get_dict(payload.get("errors")),
        _get_dict(payload.get("data")),
    )
    for candidate in candidates:
        if candidate is None:
            continue
        for key in (
            "message",
            "Message",
            "error_description",
            "description",
            "error",
            "Error",
            "status",
            "Status",
            "code",
        ):
            detail = candidate.get(key)
            if isinstance(detail, (str, int)) and detail not in ("", 0):
                return f"; {key}={str(detail)[:200]}"
    return ""


def _http_context(response: Any, url: str, detail: str) -> str:
    """Build an HTTP diagnostic without including request credentials."""
    parts = [
        f"HTTP {response.status} {response.reason or ''}".strip(),
        f"URL={url}",
    ]
    content_type = response.headers.get("Content-Type")
    server = response.headers.get("Server")
    if content_type:
        parts.append(f"Content-Type={content_type}")
    if server:
        parts.append(f"Server={server}")
    if detail:
        parts.append(detail.lstrip("; "))
    return "; ".join(parts)


def _extract_access_token(payload: dict[str, Any]) -> str | None:
    token = payload.get("accessToken")
    if isinstance(token, str) and token:
        return token
    account = _get_dict(payload.get("account"))
    token = account.get("accessToken") if account else None
    return token if isinstance(token, str) and token else None


def _extract_ploud_model(payload: dict[str, Any]) -> dict[str, Any]:
    account = _get_dict(payload.get("account"))
    candidates = (
        _get_dict(account.get("ploudModel")) if account else None,
        _get_dict(payload.get("ploudModel")),
        _get_dict(account.get("ploud")) if account else None,
        _get_dict(payload.get("ploud")),
    )
    return next((item for item in candidates if item), dict[str, Any]())


async def _post_json(
    session: ClientSession,
    base_url: str,
    endpoint: str,
    payload: dict[str, Any],
    operation: str,
) -> dict[str, Any]:
    """Post a JSON request and validate the API response."""
    url = f"{base_url.rstrip('/')}/{endpoint.lstrip('/')}"
    try:
        async with session.post(
            url,
            json=payload,
            headers={
                "Accept": "application/json",
                "User-Agent": f"PLOC/6.1 (Python; {PLOC_APPLICATION_NAME})",
            },
            timeout=ClientTimeout(total=30),
        ) as response:
            try:
                data: object = await response.json(content_type=None)
            except (ValueError, TypeError):
                data = None
            detail = _response_detail(data)
            context = _http_context(response, url, detail)
            if response.status in (401, 403):
                raise PlocAuthError(f"{operation} was rejected ({context})")
            if response.status in (408, 425, 429) or response.status >= 500:
                raise PlocConnectionError(
                    f"{operation} endpoint returned an error ({context})"
                )
            if not 200 <= response.status < 300:
                raise PlocAuthError(f"{operation} failed ({context})")
    except (ClientError, TimeoutError) as err:
        raise PlocConnectionError(f"{operation} endpoint is unavailable") from err

    result = _get_dict(data)
    if result is None:
        raise PlocAuthError(
            f"{operation} returned an invalid JSON object "
            f"({_http_context(response, url, '')})"
        )
    return result


async def async_authenticate(
    session: ClientSession, email: str, password: str, language: str
) -> str:
    """Sign in to PLOC and return the PLOUD access token for this installation."""
    account = await _post_json(
        session,
        AUTH_API_BASE,
        "signin",
        _build_signin_payload(email.strip(), password),
        "PLOC sign-in",
    )
    account_token = _extract_access_token(account)
    if not account_token:
        response_keys = ", ".join(sorted(account)) or "(none)"
        raise PlocAuthError(
            "PLOC sign-in response has no account access token "
            f"(response fields: {response_keys})"
        )

    initial_model = _extract_ploud_model(account)
    current_ploud_token = initial_model.get("token")
    ploud_token = (
        current_ploud_token
        if isinstance(current_ploud_token, str) and current_ploud_token
        else "PLOUD"
    )
    timestamp = int(time.time())
    signing_material = "".join(
        (
            _sha_repeat(str(timestamp), 15),
            _sha_repeat(account_token, 10),
            _sha_repeat(ploud_token, 20),
            _sha_repeat(PLOC_APPLICATION_NAME, 20),
        )
    )
    activation = await _post_json(
        session,
        GATEWAY_API_BASE,
        "ploud/activate",
        {
            "timestamp": timestamp,
            "apnsToken": "",
            "accessToken": account_token,
            "ploudToken": ploud_token,
            "application": PLOC_APPLICATION_NAME,
            "language": language,
            "version": PLOC_VERSION,
            "signature": _hmac_b64(signing_material),
        },
        "PLOUD activation",
    )

    activated_model = _extract_ploud_model(activation)
    merged = {**initial_model, **activated_model}
    access_token = merged.get("accessToken")
    if not isinstance(access_token, str) or not access_token:
        sign_in_keys = ", ".join(sorted(account)) or "(none)"
        activation_keys = ", ".join(sorted(activation)) or "(none)"
        initial_keys = ", ".join(sorted(initial_model)) or "(none)"
        activated_keys = ", ".join(sorted(activated_model)) or "(none)"
        raise PlocAuthError(
            "PLOUD activation succeeded but no accessToken was found "
            f"(sign-in response fields: {sign_in_keys}; "
            f"sign-in PLOUD fields: {initial_keys}; "
            f"activation response fields: {activation_keys}; "
            f"activation PLOUD fields: {activated_keys})"
        )
    # The server URL is intentionally supplied by the user in the config flow.
    # It must not be required from the API response or silently replace the
    # explicitly selected server.
    return access_token
