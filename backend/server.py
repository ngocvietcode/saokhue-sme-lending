"""HTTP backend for the "Thẩm định SME" dashboard page.

The gateway starts this process with `PORT` and `KIROCREW_PROXY_SECRET` and
reaches it through `/apps/sme-lending/api/...`. Standard library only, so the
desktop build needs no extra dependency.

Every `/api` request must carry a valid `X-KiroCrew-Proxy` signature. A write
(an officer's decision on a review item) also needs `X-KiroCrew-Principal` of
kind `owner-session`: the gateway signs agents, MCP tools and crons as
`agent-tool`, so no agent can close an item it raised.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import re
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP_ROOT / "server"))

from sme_core.service import LendingService  # noqa: E402

FRESH_SECONDS = 60
MAX_BODY = 64 * 1024
_CASE = r"(SME-[0-9]{8}-[0-9a-f]{8})"
_ROUTES = [
    ("GET", re.compile(r"^/api/cases$"), "list_cases"),
    ("GET", re.compile(rf"^/api/cases/{_CASE}$"), "get_case"),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/review/(R[0-9]{{3}})$"), "decide_review"),
]
_PRINCIPAL_FIELDS = {"issuedAt", "kind", "ownerId", "requestId", "version"}
_PRINCIPAL_KINDS = {"agent-tool", "app-token", "owner-session", "none"}


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


class Api:
    """Route handlers; independent of the HTTP server so tests call them directly."""

    def __init__(self, svc: LendingService):
        self.svc = svc

    def list_cases(self, _body: dict, _claim: dict | None) -> tuple[int, Any]:
        return 200, {"cases": self.svc.store.list_cases()}

    def get_case(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        store = self.svc.store
        case = store.get_case(case_id)
        return 200, {
            "case": {k: v for k, v in case.items() if k not in ("results", "review_open")},
            "results": store.get_results(case_id),
            "evidence": store.get_evidence(case_id),
            "review": store.list_review(case_id),
            "audit": store.read_audit(case_id),
        }

    def decide_review(self, body: dict, claim: dict | None, case_id: str, review_id: str) -> tuple[int, Any]:
        if claim is None or claim.get("kind") != "owner-session":
            return 403, {"error": "owner_only", "message": "Chỉ cán bộ đăng nhập dashboard mới được quyết định."}
        item = self.svc.store.resolve_review(case_id, review_id, str(body.get("status", "")),
                                             str(body.get("note", "")), actor=claim["ownerId"])
        return 200, {"item": item}


def make_handler(api: Api, secret: str, replays: ReplayCache, clock=time.time):
    class Handler(BaseHTTPRequestHandler):
        server_version = "sme-lending"

        def log_message(self, fmt: str, *args: Any) -> None:  # keep stdout quiet; the gateway logs access
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
            length = int(self.headers.get("Content-Length") or 0)
            if length > MAX_BODY:
                self._send(413, {"error": "body_too_large"})
                return
            raw = self.rfile.read(length) if length else b""
            now = clock()
            if not secret or not verify_proxy(self.headers.get("X-KiroCrew-Proxy", ""), method=method,
                                              target=self.path, body=raw, secret=secret, now=now):
                self._send(401, {"error": "unsigned"})
                return
            path = self.path.split("?", 1)[0]
            for m, pattern, name in _ROUTES:
                match = pattern.match(path)
                if m != method or not match:
                    continue
                claim = None
                if method != "GET":
                    claim = verify_principal(self.headers.get("X-KiroCrew-Principal", ""), method=method,
                                             target=self.path, body=raw, secret=secret, now=now,
                                             replays=replays)
                try:
                    body = json.loads(raw or b"{}")
                    if not isinstance(body, dict):
                        raise ValueError("body must be a JSON object")
                    status, payload = getattr(api, name)(body, claim, *match.groups())
                except KeyError as exc:
                    status, payload = 404, {"error": "not_found", "message": str(exc).strip("'\"")}
                except (ValueError, TimeoutError) as exc:
                    status, payload = 400, {"error": "bad_request", "message": str(exc)}
                self._send(status, payload)
                return
            self._send(404, {"error": "no_route"})

        def do_GET(self) -> None:
            self._handle("GET")

        def do_POST(self) -> None:
            self._handle("POST")

    return Handler


def main() -> None:
    svc = LendingService(
        data_root=Path(os.environ.get("SME_LENDING_DATA") or APP_ROOT / "data"),
        knowledge_root=Path(os.environ.get("SME_LENDING_KNOWLEDGE") or APP_ROOT / "knowledge"),
    )
    secret = os.environ.get("KIROCREW_PROXY_SECRET", "")
    handler = make_handler(Api(svc), secret, ReplayCache())
    server = ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("PORT", "0"))), handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
