"""PLOC account authentication and PLOUD device activation."""
from __future__ import annotations

import base64
import hashlib
import hmac
import os
import time
from typing import Any, cast
from urllib.parse import urlsplit

from aiohttp import ClientError, ClientSession, ClientTimeout
from cryptography.hazmat.primitives import padding as sym_padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from .const import (
    PLOC_API_BASE,
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
    return next((item for item in candidates if item), {})


async def _post_json(
    session: ClientSession, endpoint: str, payload: dict[str, Any], operation: str
) -> dict[str, Any]:
    """Post a JSON request and validate the API response."""
    try:
        async with session.post(
            f"{PLOC_API_BASE}/{endpoint}",
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
            if response.status in (401, 403):
                raise PlocAuthError(f"{operation} was rejected")
            if not 200 <= response.status < 300:
                raise PlocAuthError(
                    f"{operation} failed with HTTP {response.status}"
                )
    except (ClientError, TimeoutError) as err:
        raise PlocConnectionError(f"{operation} endpoint is unavailable") from err

    result = _get_dict(data)
    if result is None:
        raise PlocAuthError(f"{operation} returned an invalid response")
    return result


async def async_authenticate(
    session: ClientSession, email: str, password: str, language: str
) -> tuple[str, str]:
    """Sign in to PLOC and activate PLOUD for this Home Assistant installation."""
    account = await _post_json(
        session,
        "signin",
        _build_signin_payload(email.strip(), password),
        "PLOC sign-in",
    )
    account_token = _extract_access_token(account)
    if not account_token:
        raise PlocAuthError("PLOC sign-in response has no account access token")

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
    server = merged.get("server")
    access_token = merged.get("accessToken")
    if (
        not isinstance(server, str)
        or not isinstance(access_token, str)
        or not access_token
    ):
        raise PlocAuthError(
            "PLOUD activation did not return a valid server and access token"
        )
    try:
        parsed_server = urlsplit(server)
        _ = parsed_server.port
    except ValueError as err:
        raise PlocAuthError("PLOUD activation returned an invalid server URL") from err
    if (
        parsed_server.scheme not in {"https", "http"}
        or not parsed_server.hostname
        or parsed_server.username is not None
        or parsed_server.password is not None
        or parsed_server.query
        or parsed_server.fragment
    ):
        raise PlocAuthError("PLOUD activation returned an invalid server URL")
    return server.rstrip("/"), access_token
