"""Extensible Sale -> Underwriting / Central LOS handover adapters.

Short-term demo: `LocalLendingHandoverAdapter` pushes the standardized dossier
package (fields, facts, documents with meta, copied files, and Sales waivers)
directly into the `sme-lending` CaseStore so Underwriting sees it immediately.

Long-term architecture: configure `SME_HANDOVER_ADAPTER=central_los` and
implement the HTTP transport inside `CentralLosHandoverAdapter.handover` using
the exact same `sme-handover-1.0` contract.
"""

from __future__ import annotations

import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Protocol

from .store import CaseStore, _read_json, _write_json

SCHEMA_VERSION = "sme-handover-1.0"


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class HandoverAdapter(Protocol):
    name: str

    def handover(self, package: dict[str, Any], source_case_dir: Path) -> dict[str, Any]:
        ...


def build_handover_package(
    case: dict[str, Any],
    overview: dict[str, Any],
    *,
    submitted_by: str,
    submitted_at: str,
    note: str = "",
) -> dict[str, Any]:
    """Build the canonical `sme-handover-1.0` payload shared across adapters."""
    waivers = [
        {
            "key": i["key"],
            "title": i["title"],
            "rule_status": i.get("rule_status"),
            "note": i.get("note", ""),
            "updated_by": i.get("updated_by", ""),
        }
        for i in (overview.get("items") or [])
        if i.get("status") == "waived"
    ]
    open_blockers = [
        {
            "key": i["key"],
            "title": i["title"],
            "owner_role": i.get("owner_role"),
            "rule_status": i.get("rule_status"),
            "reason": i.get("reason", ""),
        }
        for i in (overview.get("items") or [])
        if i.get("blocking") and i.get("status") in ("open", "requested")
    ]
    xcheck = overview.get("crosschecks") or {}
    return {
        "schema_version": SCHEMA_VERSION,
        "case_id": case["case_id"],
        "created_at": case.get("created_at", submitted_at),
        "flow": case.get("flow", "A"),
        "customer": dict(case.get("customer") or {}),
        "request": dict(case.get("request") or {}),
        "facts": dict(case.get("facts") or {}),
        "labels": dict(case.get("labels") or {}),
        "documents": [dict(d) for d in (case.get("documents") or [])],
        "sales_handover": {
            "submitted_by": submitted_by,
            "submitted_at": submitted_at,
            "submission_note": note.strip(),
            "checklist_overall": overview.get("checklist_overall", "INCOMPLETE"),
            "checklist_counts": dict(overview.get("checklist_counts") or {}),
            "crosscheck_overall": xcheck.get("overall_status"),
            "waivers": waivers,
            "open_blockers": open_blockers,
        },
    }


class LocalLendingHandoverAdapter:
    """Demo adapter that upserts the handed-over case directly into sme-lending storage."""

    name = "local_lending"

    def __init__(self, target_data_root: Path | None, clock: Callable[[], str] = _utcnow):
        self.target_data_root = Path(target_data_root) if target_data_root else None
        self.clock = clock

    def handover(self, package: dict[str, Any], source_case_dir: Path) -> dict[str, Any]:
        if self.target_data_root is None:
            return {
                "status": "skipped_no_target",
                "adapter": self.name,
                "schema_version": SCHEMA_VERSION,
                "message": "Chưa cấu hình thư mục dữ liệu Thẩm định cục bộ ($SME_LENDING_DATA).",
            }

        target_store = CaseStore(self.target_data_root, clock=self.clock)
        case_id = package["case_id"]
        target_case_dir = self.target_data_root / "cases" / case_id
        target_case_dir.mkdir(parents=True, exist_ok=True)
        existed = (target_case_dir / "case.json").exists()

        files_copied = 0
        with target_store._lock(target_case_dir):
            existing = _read_json(target_case_dir / "case.json", {}) if existed else {}
            merged = {
                **existing,
                "case_id": case_id,
                "created_at": existing.get("created_at") or package["created_at"],
                "flow": package["flow"],
                "customer": package["customer"],
                "request": package["request"],
                "facts": package["facts"],
                "labels": package["labels"],
                "documents": package["documents"],
                "sales_handover": package["sales_handover"],
            }

            src_files = source_case_dir / "files"
            dst_files = target_case_dir / "files"
            if src_files.is_dir():
                dst_files.mkdir(exist_ok=True)
                wanted_files = {d.get("file") for d in package["documents"] if d.get("file")}
                for fname in wanted_files:
                    src_f = src_files / str(fname)
                    if src_f.is_file():
                        shutil.copy2(src_f, dst_files / str(fname))
                        files_copied += 1

            _write_json(target_case_dir / "case.json", merged)
            if not existed:
                target_store._audit(
                    target_case_dir,
                    "case_create",
                    {"flow": package["flow"], "documents": len(package["documents"]), "source": "sale"},
                )
            target_store._audit(
                target_case_dir,
                "case_handover_received",
                {
                    "from_app": "sale",
                    "by": package["sales_handover"]["submitted_by"],
                    "documents": len(package["documents"]),
                    "files_copied": files_copied,
                    "checklist_overall": package["sales_handover"].get("checklist_overall"),
                },
            )

        return {
            "status": "transferred",
            "adapter": self.name,
            "schema_version": SCHEMA_VERSION,
            "target_app": "sme-lending",
            "case_id": case_id,
            "updated_existing": existed,
            "files_copied": files_copied,
            "transferred_at": self.clock(),
        }


class CentralLosHandoverAdapter:
    """Extensible enterprise adapter for central LOS integration (not yet connected)."""

    name = "central_los"

    def __init__(self, endpoint: str = "", clock: Callable[[], str] = _utcnow):
        self.endpoint = endpoint or os.environ.get("SME_LOS_ENDPOINT", "").strip()
        self.clock = clock

    def handover(self, package: dict[str, Any], source_case_dir: Path) -> dict[str, Any]:
        _ = source_case_dir
        if not self.endpoint:
            return {
                "status": "not_configured",
                "adapter": self.name,
                "schema_version": SCHEMA_VERSION,
                "case_id": package["case_id"],
                "message": "SME_LOS_ENDPOINT chưa được cấu hình; bộ payload chuẩn đã sẵn sàng để tích hợp LOS tập trung.",
            }
        return {
            "status": "not_configured",
            "adapter": self.name,
            "schema_version": SCHEMA_VERSION,
            "endpoint": self.endpoint,
            "case_id": package["case_id"],
            "message": "Cần triển khai HTTP transport trong CentralLosHandoverAdapter.handover theo API contract LOS.",
        }


class NoopHandoverAdapter:
    name = "none"

    def handover(self, package: dict[str, Any], source_case_dir: Path) -> dict[str, Any]:
        _ = source_case_dir
        return {
            "status": "disabled",
            "adapter": self.name,
            "schema_version": SCHEMA_VERSION,
            "case_id": package["case_id"],
        }


def resolve_lending_data_root(
    data_root: Path,
    data_home: Path | None = None,
    explicit: Path | None = None,
) -> Path | None:
    """Locate `sme-lending` data root without escaping into unrelated host directories."""
    if explicit is not None:
        return Path(explicit)
    env_path = os.environ.get("SME_LENDING_DATA", "").strip()
    if env_path:
        return Path(env_path)
    if data_home is not None:
        installed = Path(data_home) / "apps" / "sme-lending"
        if (installed / "app.json").is_file() or (installed / "data").is_dir():
            return installed / "data"
    return None


def resolve_handover_adapter(
    *,
    data_root: Path,
    data_home: Path | None = None,
    lending_data_root: Path | None = None,
    clock: Callable[[], str] = _utcnow,
) -> HandoverAdapter:
    kind = os.environ.get("SME_HANDOVER_ADAPTER", "local_lending").strip().lower()
    if kind == "none":
        return NoopHandoverAdapter()
    if kind == "central_los":
        return CentralLosHandoverAdapter(clock=clock)
    target = resolve_lending_data_root(data_root, data_home=data_home, explicit=lending_data_root)
    return LocalLendingHandoverAdapter(target, clock=clock)
