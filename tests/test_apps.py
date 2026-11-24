"""Packaging checks for the app, the core-sync check, and the dossier (Sale) backend routes."""

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

_spec = importlib.util.spec_from_file_location("app_backend", APPS / "sme-lending" / "backend" / "server.py")
app_backend = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(app_backend)

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
                if app.name == "sme-lending":
                    expected = {f"/apps/{app.name}/api", "/api/chat", "/api/upload/file", "/api/workflows"}
                    self.assertLessEqual(
                        expected,
                        set(manifest.get("permissions", {}).get("api", [])),
                    )

    def test_no_agent_can_waive_send_submit_or_decide(self):
        tree = ast.parse((APPS / "sme-lending" / "server" / "server.py").read_text(encoding="utf-8"))
        src = ast.unparse(tree)
        for forbidden in ("set_requirement", "mark_draft_sent", "mark_submitted", "submit_dossier", "add_document",
                          "remove_document", "reopen_case", "resolve_review"):
            self.assertNotIn(forbidden, src)

    def test_the_assistant_reads_attachments_with_the_model_not_ocr(self):
        app = APPS / "sme-lending"
        spec = json.loads((app / "agents" / "sme-assistant.json").read_text(encoding="utf-8"))
        self.assertFalse([t for t in spec["tools"] + spec["allowedTools"] if "ocr" in t.rsplit("/", 1)[-1].lower()])
        self.assertIn("KHÔNG dùng code", spec["prompt"])
        skill = (app / "skills" / "sme-dossier-coach" / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("**Không** dùng code", skill)
        tree = ast.parse((app / "server" / "server.py").read_text(encoding="utf-8"))
        dossier_tools = {n.name for n in tree.body if isinstance(n, ast.FunctionDef)
                         and n.name.startswith(("sme_dossier_", "sme_document_import", "sme_document_classify"))}
        self.assertFalse([t for t in dossier_tools if "ocr" in t])

    def test_four_agents_and_every_result_section_has_a_producer(self):
        app = APPS / "sme-lending"
        manifest = json.loads((app / "app.json").read_text(encoding="utf-8"))
        names = {json.loads((app / rel).read_text(encoding="utf-8"))["name"] for rel in manifest["agents"]}
        self.assertEqual(names, {"sme-assistant", "document-product", "credit-analysis", "consolidation"})
        from sme_core.store import AGENTS
        workflow = (app / "workflows" / "sme_credit_assessment.py").read_text(encoding="utf-8")
        for section in AGENTS:
            self.assertIn(f'"{section}"', workflow, section)


class SalesBackendTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.svc = SalesService(Path(self.tmp.name), ROOT / "core" / "knowledge")
        self.svc.store.clock = lambda: "2026-11-21T08:00:00+00:00"
        self.api = app_backend.SalesApi(self.svc)

    def tearDown(self):
        self.tmp.cleanup()

    def _create(self):
        cid = self.svc.case_create({"name": "Cong ty B"}, {"product_code": "SME-WC"}, [], "A")["case_id"]
        self.svc.overview(cid)
        return cid

    def test_the_page_takes_no_data_entry(self):
        names = {r[2][len("sales_"):] for r in app_backend.ROUTES if r[2].startswith("sales_")}
        self.assertEqual(names, {"catalog", "list_cases", "get_case", "document_file",
                                 "set_requirement", "remove_document", "draft_sent",
                                 "mark_submitted", "reopen_case"})
        for _method, pattern, name, _limit in app_backend.ROUTES:
            self.assertEqual(name.startswith("sales_"), pattern.pattern.startswith("^/api/sales/"), name)

    def test_decisions_need_the_signed_in_user(self):
        cid = self._create()
        for call in (
            lambda c: self.api.set_requirement({"key": "doc:dkkd", "status": "waived", "note": "x"}, c, cid),
            lambda c: self.api.remove_document({}, c, cid, "D1"),
            lambda c: self.api.draft_sent({}, c, cid, "M001"),
            lambda c: self.api.mark_submitted({"note": "x"}, c, cid),
            lambda c: self.api.reopen_case({"note": "x"}, c, cid),
        ):
            self.assertEqual(call(AGENT)[0], 403)
            self.assertEqual(call(None)[0], 403)

    def test_waive_resolves_and_submit_needs_a_reason_when_not_ready(self):
        cid = self._create()
        self.svc.store.add_document(cid, name="dkkd.pdf", doc_type="dkkd", issued_date=None,
                                    content_b64=base64.b64encode(b"%PDF-1.4").decode(), actor="agent:x")
        status, body = self.api.set_requirement({"key": "doc:dieu_le", "status": "waived", "note": "TNHH MTV"},
                                                OWNER, cid)
        self.assertEqual(status, 200)
        items = {i["key"]: i for i in body["overview"]["items"]}
        self.assertEqual((items["doc:dkkd"]["status"], items["doc:dieu_le"]["status"]), ("resolved", "waived"))
        with self.assertRaises(ValueError):
            self.api.mark_submitted({"note": ""}, OWNER, cid)
        status, body = self.api.mark_submitted({"note": "Khách bổ sung sau, đã báo Thẩm định"}, OWNER, cid)
        self.assertEqual(body["overview"]["stage"], "submitted")
        self.assertEqual(body["overview"]["actions"], [])
        with self.assertRaises(ValueError):
            self.api.set_requirement({"key": "doc:bctc_2_ky", "status": "waived", "note": "x"}, OWNER, cid)
        with self.assertRaises(ValueError):
            self.api.reopen_case({"note": "  "}, OWNER, cid)
        status, body = self.api.reopen_case({"note": "Thẩm định yêu cầu bổ sung BCTC"}, OWNER, cid)
        self.assertEqual(status, 200)
        self.assertEqual(body["overview"]["stage"], "collecting")

    def test_batch_requirements_document_file_and_remove(self):
        cid = self._create()
        self.svc.store.add_document(cid, name="Hồ sơ công ty dài tên rất nhiều ký tự.pdf", doc_type="dkkd",
                                    issued_date=None, content_b64=base64.b64encode(b"%PDF-1.4").decode(),
                                    actor="agent:x")
        status, fbody = self.api.document_file({}, None, cid, "D1")
        self.assertEqual(status, 200)
        self.assertEqual(base64.b64decode(fbody["content_b64"]), b"%PDF-1.4")
        self.assertTrue(self.svc.store.document_path(cid, "D1").name.endswith(".pdf"))

        status, body = self.api.set_requirement(
            {"keys": ["doc:dieu_le", "doc:bctc_2_ky"], "status": "requested", "due_date": "2026-11-25"}, OWNER, cid
        )
        self.assertEqual(status, 200)
        items = {i["key"]: i for i in body["overview"]["items"]}
        self.assertEqual(items["doc:dieu_le"]["due_date"], "2026-11-25")
        self.assertEqual(items["doc:bctc_2_ky"]["status"], "requested")

        with self.assertRaises(ValueError):
            self.api.set_requirement({"keys": ["doc:nope"], "status": "requested"}, OWNER, cid)

        status, rbody = self.api.remove_document({"note": "nhầm file"}, OWNER, cid, "D1")
        self.assertEqual(status, 200)
        self.assertEqual(rbody["documents"], [])
        self.assertIsNone(self.svc.store.document_path(cid, "D1"))

    def test_list_detail_and_today(self):
        cid = self._create()
        body = self.api.list_cases({}, None)[1]
        self.assertEqual(body["cases"][0]["case_id"], cid)
        self.assertEqual(body["cases"][0]["next_action"]["kind"], "first_upload")
        self.assertEqual(body["today"]["no_documents"], [cid])
        detail = self.api.get_case({}, None, cid)[1]
        self.assertEqual(set(detail), {"case", "overview", "drafts", "audit"})
        self.assertTrue({"actions", "groups", "profile"} <= set(detail["overview"]))
        self.assertIn("types", self.api.catalog({}, None)[1]["documents"])


if __name__ == "__main__":
    unittest.main()
