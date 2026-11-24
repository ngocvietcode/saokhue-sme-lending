"""The dashboard backend: signatures, owner-only writes, payloads."""

from __future__ import annotations

import base64
import hashlib
import hmac
import importlib.util
import json
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
import uuid
from http.server import ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "core"))

from sme_core.sales import SalesService  # noqa: E402
from sme_core.service import LendingService  # noqa: E402

# Loaded by path: `server` alone is also the MCP server module under server/.
_spec = importlib.util.spec_from_file_location("sme_backend", ROOT / "apps" / "sme-lending" / "backend" / "server.py")
backend = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(backend)

SECRET = "test-secret"
NOW = 1_795_000_000.0


def _proxy(method: str, target: str, body: bytes) -> str:
    ts = str(int(NOW))
    msg = f"{ts}:{method}:{target}:{hashlib.sha256(body).hexdigest()}".encode()
    return f"{ts}:{hmac.new(SECRET.encode(), msg, hashlib.sha256).hexdigest()}"


def _principal(method: str, target: str, body: bytes, kind: str, owner: str = "", request_id: str = "") -> str:
    claim = {"issuedAt": int(NOW), "kind": kind, "ownerId": owner,
             "requestId": request_id or uuid.uuid4().hex, "version": 1}
    encoded = base64.urlsafe_b64encode(json.dumps(claim, sort_keys=True, separators=(",", ":")).encode())
    encoded = encoded.decode().rstrip("=")
    lines = ["kirocrew-proxy-principal-v1", str(int(NOW)), method, target,
             hashlib.sha256(body).hexdigest(), encoded]
    return encoded + "." + hmac.new(SECRET.encode(), "\n".join(lines).encode(), hashlib.sha256).hexdigest()


class BackendTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.svc = LendingService(Path(self.tmp.name), ROOT / "core" / "knowledge")
        self.svc.store.clock = lambda: "2026-11-21T08:00:00+00:00"
        self.case_id = self.svc.case_create({"name": "Cong ty A"}, {"amount": 5e9}, [], "A")["case_id"]
        self.svc.review_add(self.case_id, "data_conflict", "Doanh thu lệch", "financial-analysis")
        handler = backend.make_handler(backend.Api(self.svc, SalesService(Path(self.tmp.name) / "sales", ROOT / "core" / "knowledge")), SECRET, backend.ReplayCache(), clock=lambda: NOW)
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base = f"http://127.0.0.1:{self.httpd.server_address[1]}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=5)
        self.tmp.cleanup()

    def _call(self, method: str, target: str, body: dict | None = None, *, signed: bool = True,
              principal: str = "") -> tuple[int, dict]:
        raw = json.dumps(body).encode() if body is not None else b""
        req = urllib.request.Request(self.base + target, data=raw or None, method=method)
        if signed:
            req.add_header("X-KiroCrew-Proxy", _proxy(method, target, raw))
        if principal:
            req.add_header("X-KiroCrew-Principal", principal)
        if raw:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status, json.loads(resp.read())
        except urllib.error.HTTPError as exc:
            return exc.code, json.loads(exc.read())

    def test_unsigned_request_is_refused(self):
        self.assertEqual(self._call("GET", "/api/cases", signed=False)[0], 401)

    def test_list_and_detail(self):
        status, data = self._call("GET", "/api/cases")
        self.assertEqual(status, 200)
        self.assertEqual(data["cases"][0]["case_id"], self.case_id)
        self.assertEqual(data["cases"][0]["review_open"], 1)
        status, data = self._call("GET", f"/api/cases/{self.case_id}")
        self.assertEqual(status, 200)
        self.assertEqual(data["review"][0]["id"], "R001")
        self.assertEqual([a["action"] for a in data["audit"]], ["case_create", "review_add"])

    def test_dossier_routes_reach_the_sale_store_not_the_assessment(self):
        status, data = self._call("GET", "/api/sales/cases")
        self.assertEqual(status, 200)
        self.assertEqual(data["cases"], [], "the assessment case is not a Sale dossier")
        self.assertIn("types", self._call("GET", "/api/sales/catalog")[1]["documents"])
        self.assertEqual(self._call("GET", f"/api/sales/cases/{self.case_id}")[0], 404)

    def test_unknown_case_is_404(self):
        self.assertEqual(self._call("GET", "/api/cases/SME-20260101-00000000")[0], 404)

    def test_decision_needs_the_owner(self):
        target = f"/api/cases/{self.case_id}/review/R001"
        body = {"status": "confirmed", "note": "Đã đối chiếu sao kê"}
        raw = json.dumps(body).encode()
        self.assertEqual(self._call("POST", target, body)[0], 403)
        agent = _principal("POST", target, raw, "agent-tool")
        self.assertEqual(self._call("POST", target, body, principal=agent)[0], 403)
        owner = _principal("POST", target, raw, "owner-session", owner="owner-1")
        status, data = self._call("POST", target, body, principal=owner)
        self.assertEqual(status, 200)
        self.assertEqual(data["item"]["status"], "confirmed")
        self.assertEqual(data["item"]["decided_by"], "owner-1")

    def test_replayed_or_tampered_claim_is_refused(self):
        target = f"/api/cases/{self.case_id}/review/R001"
        body = {"status": "needs_info", "note": "Bổ sung tờ khai VAT"}
        raw = json.dumps(body).encode()
        rid = uuid.uuid4().hex
        claim = _principal("POST", target, raw, "owner-session", owner="owner-1", request_id=rid)
        self.assertEqual(self._call("POST", target, body, principal=claim)[0], 200)
        self.assertEqual(self._call("POST", target, body, principal=claim)[0], 403)
        other = {"status": "confirmed", "note": "x"}
        forged = _principal("POST", target, raw, "owner-session", owner="owner-1")
        self.assertEqual(self._call("POST", target, other, principal=forged)[0], 403)

    def test_bad_decision_is_400(self):
        target = f"/api/cases/{self.case_id}/review/R001"
        body = {"status": "approved", "note": "x"}
        owner = _principal("POST", target, json.dumps(body).encode(), "owner-session", owner="o")
        self.assertEqual(self._call("POST", target, body, principal=owner)[0], 400)


if __name__ == "__main__":
    unittest.main()
