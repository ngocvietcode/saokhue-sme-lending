"""What a Sale should do next on a dossier, and how far each part has come.

Pure functions over the dossier overview, so the page and the dossier coach
show the same next steps. Every action names a `cta` the page knows:

    draft   open the coach to write a customer request for `keys`
    chat    open the coach with `prompt` staged
    submit  open the mark-as-submitted step
    none    information only
"""

from __future__ import annotations

from datetime import date
from typing import Any

WAIT_NUDGE_DAYS = 3


def _days_since(iso: str | None, today: date) -> int | None:
    if not iso:
        return None
    try:
        return (today - date.fromisoformat(iso[:10])).days
    except ValueError:
        return None


def _humanize(key: str) -> str:
    return key.replace("_", " ").strip().capitalize()


def _catalog_labels(catalog: dict[str, Any]) -> dict[str, str]:
    return {**{k: v["label"] for k, v in catalog.get("fields", {}).items()},
            **{f"facts.{k}": v["label"] for k, v in catalog.get("sales_facts", {}).items()},
            **catalog.get("extra_fields", {})}


def field_label(path: str, case: dict[str, Any], catalog: dict[str, Any]) -> str:
    return (case.get("labels") or {}).get(path) or _catalog_labels(catalog).get(path) or _humanize(path.split(".")[-1])


def profile(case: dict[str, Any], catalog: dict[str, Any]) -> list[dict[str, Any]]:
    """Every field the dossier holds, labelled; nothing is assumed about which exist."""
    out = []
    for section in ("customer", "request", "facts"):
        for key, value in (case.get(section) or {}).items():
            path = f"{section}.{key}"
            out.append({"path": path, "section": section, "label": field_label(path, case, catalog), "value": value})
    return out


def _has(case: dict[str, Any], path: str) -> bool:
    section, _, key = path.partition(".")
    v = (case.get(section) or {}).get(key)
    return v is not None and v != ""


def extraction(case: dict[str, Any], catalog: dict[str, Any], doc_id: str | None = None) -> list[dict[str, Any]]:
    """Per classified document, the catalogue fields it should yield that the dossier still lacks.

    A field counts as done when the dossier holds it, or when the coach marked it
    `not_stated` on that document (the document does not say it).
    """
    types = catalog.get("types", {})
    out = []
    for d in case.get("documents") or []:
        if doc_id and d.get("id") != doc_id:
            continue
        meta = types.get(d.get("type") or "")
        if not meta:
            continue
        skipped = set(d.get("not_stated") or [])
        missing = [{"path": p, "label": field_label(p, case, catalog)}
                   for p in meta.get("extract", []) if not _has(case, p) and p not in skipped]
        if missing or doc_id:
            out.append({"document_id": d["id"], "document": meta["label"], "missing": missing})
    return out


def group_progress(items: list[dict[str, Any]], catalog: dict[str, Any]) -> list[dict[str, Any]]:
    """Done / total per document group, in catalogue order."""
    names = catalog.get("groups", {})
    order = list(names) + sorted({i["group"] for i in items} - set(names))
    out = []
    for g in order:
        mine = [i for i in items if i["group"] == g and i["kind"] != "policy_precheck"]
        if not mine:
            continue
        done = sum(1 for i in mine if i["status"] in ("ok", "resolved", "waived"))
        blocked = sum(1 for i in mine if i["status"] == "open" and i["blocking"])
        out.append({"group": g, "label": names.get(g, _humanize(g)), "done": done, "total": len(mine), "blocked": blocked})
    return out


def next_actions(case: dict[str, Any], items: list[dict[str, Any]], readiness: dict[str, Any], stage: str,
                 as_of: str, catalog: dict[str, Any]) -> list[dict[str, Any]]:
    """The dossier's to-do list, most urgent first."""
    today = date.fromisoformat(as_of)
    cid = case["case_id"]
    docs = case.get("documents") or []
    acts: list[dict[str, Any]] = []

    def add(kind: str, tone: str, title: str, *, detail: list[str] | None = None, keys: list[str] | None = None,
            cta: str = "chat", prompt: str = "") -> None:
        acts.append({"id": f"{kind}-{len(acts) + 1}", "kind": kind, "tone": tone, "title": title,
                     "detail": detail or [], "keys": keys or [], "cta": cta, "prompt": prompt})

    if stage == "submitted":
        return []

    if not docs:
        add("first_upload", "accent", "Gửi chứng từ khách đã có cho trợ lý",
            detail=["Đính kèm file vào chat; trợ lý tự phân loại, đọc thông tin và cập nhật danh sách còn thiếu."],
            prompt=f"Tôi gửi chứng từ của khách cho hồ sơ {cid}: ")

    overdue = [i for i in items if i["status"] == "requested" and i.get("due_date")
               and _days_since(i["due_date"], today) is not None and _days_since(i["due_date"], today) > 0]
    if overdue:
        add("remind", "danger", f"Nhắc khách: {len(overdue)} mục đã quá hạn",
            detail=[f"{i['title']} (hạn {i['due_date']})" for i in overdue], keys=[i["key"] for i in overdue],
            cta="draft")

    to_ask = [i for i in items if i["status"] == "open" and i["blocking"] and i.get("ask")]
    if to_ask:
        add("request_docs", "danger", f"Xin khách {len(to_ask)} chứng từ còn thiếu",
            detail=[i["title"] for i in to_ask], keys=[i["key"] for i in to_ask], cta="draft")

    info = [i for i in items if i["status"] == "open" and i["blocking"] and not i.get("ask")]
    if info:
        add("fill_info", "warn", f"Bổ sung {len(info)} thông tin hồ sơ",
            detail=[i["title"] for i in info], keys=[i["key"] for i in info],
            prompt=f"Hồ sơ {cid} còn thiếu: " + "; ".join(i["title"] for i in info) + ". Thông tin là: ")

    unclassified = [d for d in docs if not d.get("type")]
    if unclassified:
        add("classify", "warn", f"Nhờ trợ lý đọc {len(unclassified)} chứng từ chưa phân loại",
            detail=[d.get("name", d["id"]) for d in unclassified],
            prompt=f"Đọc và phân loại các chứng từ chưa phân loại của hồ sơ {cid}, rồi cập nhật thông tin.")

    pending = [e for e in extraction(case, catalog) if e["missing"]]
    if pending:
        n = sum(len(e["missing"]) for e in pending)
        add("extract", "warn", f"Ghi {n} thông tin từ chứng từ đã nhận",
            detail=[f"{e['document']} ({e['document_id']}): " + ", ".join(m["label"] for m in e["missing"])
                    for e in pending],
            prompt=f"Đọc lại {', '.join(e['document_id'] for e in pending)} của hồ sơ {cid} và ghi các thông tin còn trống; "
                   "thông tin nào chứng từ không ghi thì đánh dấu không có.")

    breaches = [i for i in items if i["kind"] == "policy_precheck" and i["status"] == "open"]
    if breaches:
        add("review_proposal", "warn", "Đề xuất chưa đạt điều kiện sơ bộ",
            detail=[i["reason"] for i in breaches], keys=[i["key"] for i in breaches],
            prompt=f"Hồ sơ {cid} chưa đạt điều kiện sơ bộ: " + "; ".join(i["title"] for i in breaches)
                   + ". Gợi ý cách cơ cấu lại đề xuất.")

    waiting = [i for i in items if i["status"] == "requested" and i not in overdue]
    stale = [i for i in waiting if (_days_since(i.get("requested_at"), today) or 0) >= WAIT_NUDGE_DAYS]
    if stale:
        add("follow_up", "info", f"Theo dõi {len(stale)} mục khách chưa gửi sau {WAIT_NUDGE_DAYS}+ ngày",
            detail=[i["title"] for i in stale], keys=[i["key"] for i in stale], cta="draft")

    advisory = [i for i in items if i["status"] == "open" and not i["blocking"] and i["kind"] != "policy_precheck"]
    if advisory:
        add("advisory", "muted", f"Nên bổ sung {len(advisory)} mục (không chặn nộp)",
            detail=[i["title"] for i in advisory], keys=[i["key"] for i in advisory],
            prompt=f"Hồ sơ {cid}: kiểm tra giúp các mục nên bổ sung: " + "; ".join(i["title"] for i in advisory))

    if readiness["ready"]:
        detail = ["Không còn mục chặn nộp."]
        if readiness["waived"]:
            detail.append(f"{len(readiness['waived'])} mục đã bỏ qua sẽ đi kèm giải trình.")
        if breaches:
            detail.append(f"Lưu ý: có {len(breaches)} cảnh báo điều kiện sơ bộ nên rà lại trước khi nộp.")
        acts.insert(0, {"id": "submit-0", "kind": "submit", "tone": "ok", "title": "Hồ sơ đủ điều kiện: nộp Thẩm định",
                        "detail": detail, "keys": [], "cta": "submit", "prompt": ""})
    elif waiting and not stale and not overdue:
        add("waiting", "info", f"Đang chờ khách {len(waiting)} mục", detail=[i["title"] for i in waiting], cta="none")
    return acts
