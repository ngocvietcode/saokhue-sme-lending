"""Packaging checks for every app, the core-sync check, and the Sales backend routes."""

from __future__ import annotations

import ast
import base64
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPS = ROOT / "apps"
sys.path.insert(0, str(ROOT / "core"))

from sme_core.sales import SalesService  # noqa: E402

_spec = importlib.util.spec_from_file_location("sales_backend", APPS / "sme-sales" / "backend" / "server.py")
sales_backend = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sales_backend)

OWNER = {"kind": "owner-session", "ownerId": "sale-1"}
AGENT = {"kind": "agent-tool", "ownerId": ""}


class CoreSyncTest(unittest.TestCase):
    def test_every_app_carries_the_current_core(self):
        out = subprocess.run([sys.executable, "-I", str(ROOT / "tools" / "sync_core.py"), "--check"],
                             capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(out.returncode, 0, "run python tools/sync_core.py\n" + out.stdout)


class PackagingTest(unittest.TestCase):
    """Each app's manifest, agents, skills, MCP tools and chat launch agree."""

    def _apps(self):
        return [d for d in sorted(APPS.iterdir()) if (d / "app.json").is_file()]

    def test_manifests_agents_skills_and_tools_agree(self):
        for app in self._apps():
            with self.subTest(app=app.name):
                manifest = json.loads((app / "app.json").read_text(encoding="utf-8"))
                server = next(iter(manifest["mcpServers"]))
                tree = ast.parse((app / "server" / "server.py").read_text(encoding="utf-8"))
                tools = {n.name for n in tree.body if isinstance(n, ast.FunctionDef) and n.name.startswith("sme_")}
                prefix = f"@{manifest['name']}:{server}/"
                names = set()
                for rel in manifest["agents"]:
                    spec = json.loads((app / rel).read_text(encoding="utf-8"))
                    names.add(spec["name"])
                    self.assertEqual(spec["model"], "auto", rel)
                    for ref in spec["tools"]:
                        if ref.startswith("@" + manifest["name"]):
                            self.assertTrue(ref.startswith(prefix), ref)
                            self.assertIn(ref[len(prefix):], tools, ref)
                    for res in spec.get("resources", []):
                        self.assertTrue(res.startswith("skill://{APP_ROOT}/skills/"), res)
                        self.assertTrue((app / res[len("skill://{APP_ROOT}/"):]).is_file(), res)
                for s in manifest["skills"]:
                    desc = next(x for x in (app / s / "SKILL.md").read_text(encoding="utf-8").splitlines()
                                if x.startswith("description: "))
                    json.loads(desc[13:])
                launch = manifest.get("permissions", {}).get("chatLaunch")
                if launch:
                    self.assertTrue(launch["keyPrefix"].startswith(manifest["name"] + "-"))
                    self.assertTrue(set(launch["agents"]) <= names, "chatLaunch names an agent's spec name")

    def test_no_agent_can_waive_send_or_submit(self):
        tree = ast.parse((APPS / "sme-sales" / "server" / "server.py").read_text(encoding="utf-8"))
        src = ast.unparse(tree)
        for forbidden in ("set_requirement", "mark_draft_sent", "mark_submitted", "add_document"):
            self.assertNotIn(forbidden, src)


class SalesBackendTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.svc = SalesService(Path(self.tmp.name), ROOT / "core" / "knowledge")
        self.svc.store.clock = lambda: "2026-11-21T08:00:00+00:00"
        self.api = sales_backend.Api(self.svc)

    def tearDown(self):
        self.tmp.cleanup()

    def _create(self):
        status, body = self.api.create_case({"customer": {"name": "Cong ty B"}, "request": {"product_code": "SME-WC"}}, OWNER)
        self.assertEqual(status, 200)
        return body["case_id"]

    def test_writes_need_the_signed_in_user(self):
        cid = self._create()
        for call in (
            lambda c: self.api.create_case({}, c),
            lambda c: self.api.update_fields({"customer": {"name": "x"}}, c, cid),
            lambda c: self.api.set_requirement({"key": "doc:dkkd", "status": "waived", "note": "x"}, c, cid),
            lambda c: self.api.upload_document({"name": "a.pdf"}, c, cid),
            lambda c: self.api.mark_submitted({"note": "x"}, c, cid),
        ):
            self.assertEqual(call(AGENT)[0], 403)
            self.assertEqual(call(None)[0], 403)

    def test_upload_resolves_and_submit_needs_a_reason_when_not_ready(self):
        cid = self._create()
        status, body = self.api.upload_document(
            {"name": "dkkd.pdf", "type": "dkkd", "content_b64": base64.b64encode(b"%PDF-1.4").decode()}, OWNER, cid)
        self.assertEqual(status, 200)
        items = {i["key"]: i for i in body["overview"]["items"]}
        self.assertEqual(items["doc:dkkd"]["status"], "resolved")
        with self.assertRaises(ValueError):
            self.api.mark_submitted({"note": ""}, OWNER, cid)
        status, body = self.api.mark_submitted({"note": "Khách bổ sung sau, đã báo Thẩm định"}, OWNER, cid)
        self.assertEqual(body["overview"]["stage"], "submitted")

    def test_list_and_detail(self):
        cid = self._create()
        self.assertEqual(self.api.list_cases({}, None)[1]["cases"][0]["case_id"], cid)
        detail = self.api.get_case({}, None, cid)[1]
        self.assertEqual(set(detail), {"case", "overview", "drafts", "audit"})
        self.assertIn("types", self.api.catalog({}, None)[1]["documents"])


if __name__ == "__main__":
    unittest.main()
