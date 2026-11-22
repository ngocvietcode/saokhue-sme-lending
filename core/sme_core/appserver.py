"""The HTTP plumbing every SME app backend shares: gateway signatures and routing.

The gateway starts an app backend with `PORT` and `KIROCREW_PROXY_SECRET` and
reaches it through `/apps/<app>/api/...`. Every `/api` request must carry a
valid `X-KiroCrew-Proxy` signature; a write also carries `X-KiroCrew-Principal`,
whose `kind` says who is calling. Standard library only.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import threading
import time
from http.server import BaseHTTPRequestHandler
from typing import Any, Callable

FRESH_SECONDS = 60
_PRINCIPAL_FIELDS = {"issuedAt", "kind", "ownerId", "requestId", "version"}
_PRINCIPAL_KINDS = {"agent-tool", "app-token", "owner-session", "none"}

# (method, compiled path pattern, handler name, max body bytes)
Route = tuple[str, "re.Pattern[str]", str, int]


def _sha256(body: bytes) -> str:
    return hashlib.sha256(body).hexdigest()


def verify_proxy(header: str, *, method: str, target: str, body: bytes, secret: str, now: float) -> bool:
    """`X-KiroCrew-Proxy: <ts>:<hmac>` over `ts:method:target:sha256(body)`."""
    ts, _, sig = header.partition(":")
    if not ts.isdigit() or not sig or abs(now - int(ts)) > FRESH_SECONDS:
        return False
    msg = f"{ts}:{method}:{target}:{_sha256(body)}".encode()
    expected = hmac.new(secret.encode(), msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig)


class ReplayCache:
    """Accepted principal `requestId`s, each kept until its window closes."""

    def __init__(self, max_entries: int = 4096):
        self._seen: dict[str, float] = {}
        self._lock = threading.Lock()
        self._max = max_entries

    def accept(self, request_id: str, now: float) -> bool:
        with self._lock:
            self._seen = {k: v for k, v in self._seen.items() if v > now}
            if request_id in self._seen or len(self._seen) >= self._max:
                return False
            self._seen[request_id] = now + FRESH_SECONDS
            return True


def verify_principal(header: str, *, method: str, target: str, body: bytes, secret: str,
                     now: float, replays: ReplayCache) -> dict[str, Any] | None:
    """The nine-step check of the App Kit "Signed principal claim" contract."""
    if not header or not secret or "." not in header:
        return None
    encoded, _, sig = header.rpartition(".")
    try:
        claim = json.loads(base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4)))
    except (ValueError, UnicodeDecodeError):
        return None
    if not isinstance(claim, dict) or set(claim) != _PRINCIPAL_FIELDS:
        return None
    if claim["version"] != 1 or claim["kind"] not in _PRINCIPAL_KINDS:
        return None
    if not isinstance(claim["requestId"], str) or not re.fullmatch(r"[0-9a-f]{32}", claim["requestId"]):
        return None
    owner = claim["ownerId"]
    if not isinstance(owner, str) or (claim["kind"] == "owner-session") != bool(owner):
        return None
    if not isinstance(claim["issuedAt"], int) or abs(now - claim["issuedAt"]) > FRESH_SECONDS:
        return None
    lines = ["kirocrew-proxy-principal-v1", str(claim["issuedAt"]), method, target, _sha256(body), encoded]
    expected = hmac.new(secret.encode(), "\n".join(lines).encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, sig):
        return None
    if not replays.accept(claim["requestId"], now):
        return None
    return claim


def owner_only(claim: dict | None) -> tuple[int, Any] | None:
    """A 403 unless the request was signed for the signed-in dashboard owner."""
    if claim is None or claim.get("kind") != "owner-session":
        return 403, {"error": "owner_only", "message": "Chỉ người dùng đăng nhập dashboard mới được thao tác này."}
    return None


def make_handler(api: Any, routes: list[Route], secret: str, replays: ReplayCache,
                 clock: Callable[[], float] = time.time, name: str = "sme-app"):
    class Handler(BaseHTTPRequestHandler):
        server_version = name

        def log_message(self, fmt: str, *args: Any) -> None:  # the gateway logs access
            pass

        def _send(self, status: int, payload: Any) -> None:
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)

        def _handle(self, method: str) -> None:
            if method == "GET" and self.path == "/health":
                self._send(200, {"ok": True})
                return
            path = self.path.split("?", 1)[0]
            route = next(((r, r[1].match(path)) for r in routes if r[0] == method and r[1].match(path)), None)
            length = int(self.headers.get("Content-Length") or 0)
            limit = route[0][3] if route else 64 * 1024
            if length > limit:
                self._send(413, {"error": "body_too_large"})
                return
            raw = self.rfile.read(length) if length else b""
            now = clock()
            if not secret or not verify_proxy(self.headers.get("X-KiroCrew-Proxy", ""), method=method,
                                              target=self.path, body=raw, secret=secret, now=now):
                self._send(401, {"error": "unsigned"})
                return
            if route is None:
                self._send(404, {"error": "no_route"})
                return
            (_, _, handler_name, _), match = route
            claim = None
            if method != "GET":
                claim = verify_principal(self.headers.get("X-KiroCrew-Principal", ""), method=method,
                                         target=self.path, body=raw, secret=secret, now=now, replays=replays)
            try:
                body = json.loads(raw or b"{}")
                if not isinstance(body, dict):
                    raise ValueError("body must be a JSON object")
                status, payload = getattr(api, handler_name)(body, claim, *match.groups())
            except KeyError as exc:
                status, payload = 404, {"error": "not_found", "message": str(exc).strip("'\"")}
            except (ValueError, TimeoutError) as exc:
                status, payload = 400, {"error": "bad_request", "message": str(exc)}
            self._send(status, payload)

        def do_GET(self) -> None:
            self._handle("GET")

        def do_POST(self) -> None:
            self._handle("POST")

    return Handler
