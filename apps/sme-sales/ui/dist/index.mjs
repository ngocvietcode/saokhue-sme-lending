import { jsxs as n, jsx as e, Fragment as oe } from "react/jsx-runtime";
import { useAppApi as A, useChatLauncher as ve } from "@kirocrew/app-sdk";
import { useState as b, useCallback as X, useEffect as G, useMemo as I } from "react";
import { PageHeader as ye, Btn as w, ErrorNotice as K } from "@kirocrew/app-sdk/ui";
import { AlertTriangle as ke, RefreshCw as le, Plus as P, FolderOpen as se, Clock as we, ClipboardCheck as ce, CheckCircle2 as E, Search as ae, X as Ne, Upload as Ce, FileText as de, Save as me, Mail as B, Check as ze, Copy as _e, Send as U, SkipForward as Te, RotateCcw as Se, ArrowLeft as $e, MessageSquare as qe, Landmark as Be } from "lucide-react";
const Me = `
.sme { --sme-gap: 16px; color: var(--text); font-family: var(--font-body, inherit); }
.sme * { box-sizing: border-box; }
.sme-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 4px 24px 40px; }
.sme-row { display: flex; align-items: center; gap: 8px; }
.sme-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.sme-wrap { flex-wrap: wrap; }
.sme-muted { color: var(--muted); }
.sme-strong { color: var(--text-strong, var(--text)); font-weight: 600; }
.sme-mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12px; }
.sme-small { font-size: 12px; }
.sme-h2 { font-size: 15px; font-weight: 600; color: var(--text-strong, var(--text)); margin: 0; }
.sme-h3 { font-size: 13px; font-weight: 600; color: var(--text-strong, var(--text)); margin: 0; }
.sme-section-title { font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin: 0 0 8px; }

.sme-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
.sme-card.tight { padding: 12px; }
.sme-card.hover:hover { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); background: var(--card-hl, var(--card)); cursor: pointer; }
.sme-stack { display: flex; flex-direction: column; gap: 12px; }

/* KPI tiles */
.sme-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 20px; }
.sme-kpi { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; gap: 12px; align-items: center; }
.sme-kpi-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex: none;
  background: color-mix(in srgb, var(--tone, var(--accent)) 14%, transparent); color: var(--tone, var(--accent)); }
.sme-kpi-label { font-size: 12px; color: var(--muted); }
.sme-kpi-value { font-size: 22px; font-weight: 700; color: var(--text-strong, var(--text)); line-height: 1.15; }
.sme-kpi-hint { font-size: 11px; color: var(--muted); }

/* Tone helpers */
.t-ok { --tone: var(--ok); } .t-warn { --tone: var(--warn); } .t-danger { --tone: var(--danger); }
.t-info { --tone: var(--info); } .t-muted { --tone: var(--muted); } .t-accent { --tone: var(--accent); }

.sme-pill { display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: 600; padding: 2px 8px;
  border-radius: 999px; white-space: nowrap; color: var(--tone, var(--muted));
  background: color-mix(in srgb, var(--tone, var(--muted)) 14%, transparent); }
.sme-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border-radius: 6px;
  border: 1px solid var(--border); color: var(--muted); white-space: nowrap; }
.sme-ref { font-family: var(--mono, monospace); font-size: 11px; padding: 1px 6px; border-radius: 5px; border: 1px solid var(--border);
  background: transparent; color: var(--accent); cursor: pointer; }
.sme-ref:hover { background: color-mix(in srgb, var(--accent) 12%, transparent); }

/* Toolbar */
.sme-search { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px;
  background: var(--card); min-width: 240px; }
.sme-search input { border: 0; outline: 0; background: transparent; color: var(--text); font-size: 13px; width: 100%; }
.sme-filters { display: inline-flex; gap: 4px; padding: 3px; border: 1px solid var(--border); border-radius: 8px; background: var(--card); }
.sme-filter { border: 0; background: transparent; color: var(--muted); font-size: 12.5px; padding: 4px 10px; border-radius: 6px; cursor: pointer; }
.sme-filter.on { background: color-mix(in srgb, var(--accent) 16%, transparent); color: var(--text-strong, var(--text)); font-weight: 600; }

/* Case cards */
.sme-cases { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.sme-case-amount { font-size: 20px; font-weight: 700; color: var(--text-strong, var(--text)); }
.sme-pipe { display: flex; gap: 3px; margin: 12px 0 6px; }
.sme-pipe span { flex: 1; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--tone, var(--muted)) 55%, transparent); }
.sme-pipe span.none { background: var(--border); }

/* Detail header */
.sme-hero { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start; margin-bottom: 16px; }
.sme-back { display: inline-flex; align-items: center; gap: 4px; color: var(--muted); font-size: 12.5px; border: 0; background: none; cursor: pointer; padding: 0; margin-bottom: 6px; }
.sme-back:hover { color: var(--text); }
.sme-title { font-size: 22px; font-weight: 700; color: var(--text-strong, var(--text)); margin: 0 0 6px; }

/* Stepper */
.sme-steps { display: flex; align-items: stretch; gap: 0; overflow-x: auto; padding-bottom: 2px; }
.sme-phase { flex: 1 0 auto; min-width: 120px; display: flex; flex-direction: column; gap: 6px; padding: 0 10px; position: relative; }
.sme-phase + .sme-phase { border-left: 1px dashed var(--border); }
.sme-phase-name { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 600; }
.sme-node { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--text); border: 0; background: none; padding: 0; cursor: pointer; text-align: left; }
.sme-node .dot { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; flex: none;
  color: var(--tone, var(--muted)); background: color-mix(in srgb, var(--tone, var(--muted)) 16%, transparent); }
.sme-node.skip { color: var(--muted); cursor: default; }

/* Layout */
.sme-detail { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; align-items: start; }
@media (max-width: 1100px) { .sme-detail { grid-template-columns: minmax(0, 1fr); } }
.sme-aside { position: sticky; top: 0; display: flex; flex-direction: column; gap: 12px; }

/* Tabs */
.sme-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 14px; overflow-x: auto; }
.sme-tab { border: 0; background: none; color: var(--muted); font-size: 13px; padding: 8px 12px; cursor: pointer; border-bottom: 2px solid transparent;
  margin-bottom: -1px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.sme-tab:hover { color: var(--text); }
.sme-tab.on { color: var(--text-strong, var(--text)); border-bottom-color: var(--accent); font-weight: 600; }
.sme-count { font-size: 11px; padding: 0 6px; border-radius: 999px; background: color-mix(in srgb, var(--muted) 18%, transparent); color: var(--muted); }
.sme-tab.on .sme-count { background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--accent); }

/* Findings */
.sme-finding { display: grid; grid-template-columns: 4px 1fr; gap: 10px; padding: 8px 0; }
.sme-finding + .sme-finding { border-top: 1px solid var(--border); }
.sme-finding .bar { border-radius: 2px; background: var(--tone, var(--muted)); }
.sme-finding-topic { font-size: 11.5px; color: var(--muted); margin-bottom: 2px; }
.sme-finding-text { font-size: 13px; line-height: 1.5; }

/* Agent accordion */
.sme-acc-head { display: flex; align-items: center; gap: 10px; width: 100%; background: none; border: 0; padding: 0; color: inherit; cursor: pointer; text-align: left; }
.sme-acc-head .chev { transition: transform .15s; color: var(--muted); }
.sme-acc-head.open .chev { transform: rotate(90deg); }
.sme-acc-body { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
.sme-sev-counts { display: inline-flex; gap: 4px; }

/* Tables */
.sme-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.sme-table th { text-align: left; font-weight: 600; font-size: 11.5px; color: var(--muted); padding: 6px 8px; border-bottom: 1px solid var(--border); white-space: nowrap; }
.sme-table td { padding: 8px; border-bottom: 1px solid var(--border); vertical-align: top; }
.sme-table tr:last-child td { border-bottom: 0; }
.sme-table tr.focus td { background: color-mix(in srgb, var(--accent) 12%, transparent); }
.sme-table tr.click { cursor: pointer; } .sme-table tr.click:hover td { background: var(--bg-hover, transparent); }
.sme-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sme-pre { margin: 6px 0 0; padding: 8px 10px; border-radius: 8px; background: var(--bg-elevated, var(--bg)); border: 1px solid var(--border);
  font-family: var(--mono, monospace); font-size: 11.5px; white-space: pre-wrap; word-break: break-word; max-height: 260px; overflow: auto; }

/* Metric bars (DSCR scenarios) */
.sme-bars { display: flex; flex-direction: column; gap: 8px; }
.sme-bar-row { display: grid; grid-template-columns: 92px 1fr 56px; gap: 10px; align-items: center; font-size: 12.5px; }
.sme-bar-track { position: relative; height: 10px; border-radius: 5px; background: color-mix(in srgb, var(--muted) 14%, transparent); }
.sme-bar-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 5px; background: var(--tone, var(--accent)); }
.sme-bar-mark { position: absolute; top: -4px; bottom: -4px; width: 2px; background: var(--text-strong, var(--text)); opacity: .55; }

/* Review */
.sme-review { border-left: 3px solid var(--tone, var(--border)); }
.sme-textarea { width: 100%; min-height: 56px; resize: vertical; font: inherit; font-size: 13px; color: var(--text);
  background: var(--bg-elevated, var(--bg)); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
.sme-textarea:focus { outline: 2px solid color-mix(in srgb, var(--accent) 50%, transparent); outline-offset: 0; }
.sme-decision { margin-top: 10px; padding: 8px 10px; border-radius: 8px; font-size: 12.5px;
  background: color-mix(in srgb, var(--tone, var(--muted)) 10%, transparent); }

/* Aside list */
.sme-todo { display: flex; gap: 8px; align-items: flex-start; padding: 8px 0; font-size: 12.5px; border: 0; background: none; color: inherit; text-align: left; width: 100%; cursor: pointer; }
.sme-todo + .sme-todo { border-top: 1px solid var(--border); }
.sme-todo:hover .sme-todo-text { color: var(--text-strong, var(--text)); }
.sme-todo-text { color: var(--text); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Timeline */
.sme-tl { position: relative; padding-left: 18px; }
.sme-tl::before { content: ""; position: absolute; left: 5px; top: 4px; bottom: 4px; width: 2px; background: var(--border); }
.sme-tl-item { position: relative; padding: 0 0 14px; }
.sme-tl-item::before { content: ""; position: absolute; left: -17px; top: 4px; width: 10px; height: 10px; border-radius: 50%;
  background: var(--card); border: 2px solid var(--tone, var(--muted)); }

.sme-empty { text-align: center; padding: 40px 16px; color: var(--muted); }
.sme-empty svg { opacity: .6; margin-bottom: 8px; }
.sme-banner { display: flex; gap: 8px; align-items: flex-start; padding: 10px 12px; border-radius: 10px; font-size: 12.5px;
  background: color-mix(in srgb, var(--tone, var(--warn)) 12%, transparent); color: var(--text); border: 1px solid color-mix(in srgb, var(--tone, var(--warn)) 35%, transparent); }
.sme-banner svg { color: var(--tone, var(--warn)); flex: none; margin-top: 1px; }
.sme-skel { height: 14px; border-radius: 6px; background: color-mix(in srgb, var(--muted) 16%, transparent); }

/* Forms */
.sme-form { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px 16px; }
.sme-field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--muted); min-width: 0; }
.sme-input { font: inherit; font-size: 13px; color: var(--text); background: var(--bg-elevated, var(--bg));
  border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; min-width: 0; width: 100%; box-sizing: border-box; }
.sme-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 50%, transparent); outline-offset: 0; }
.sme-check { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; cursor: pointer; }

/* Readiness score */
.sme-score { display: flex; align-items: center; gap: 8px; min-width: 120px; }
.sme-score .sme-bar-track { flex: 1; }
.sme-score-num { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 13px; min-width: 38px; text-align: right; }

/* Requirement rows */
.sme-item { display: flex; gap: 10px; align-items: flex-start; padding: 12px 0; }
.sme-item + .sme-item { border-top: 1px solid var(--border); }
.sme-item-body { flex: 1; min-width: 0; }
.sme-item-title { font-weight: 600; font-size: 13.5px; color: var(--text-strong, var(--text)); }
.sme-item-ask { margin-top: 6px; padding: 6px 10px; border-radius: 8px; font-size: 12.5px;
  background: color-mix(in srgb, var(--accent) 7%, transparent); }
.sme-group-title { font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); margin: 16px 0 2px; }
`;
function Le() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const a = document.createElement("style");
  a.id = t, a.textContent = Me, document.head.appendChild(a);
}
const H = (t) => `t-${t}`;
function T({ t, children: a, title: p }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${H(t)}`, title: p, children: a });
}
function S({ icon: t, label: a, value: p, hint: r, t: s = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${H(s)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: a }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: p }),
      r && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: r })
    ] })
  ] });
}
function M({ icon: t, title: a, hint: p, action: r }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: a }),
    p && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: p }),
    r && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: r })
  ] });
}
function V({ t = "warn", children: a }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${H(t)}`, children: [
    /* @__PURE__ */ e(ke, { size: 15 }),
    /* @__PURE__ */ e("div", { children: a })
  ] });
}
const R = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, O = new Intl.NumberFormat("vi-VN"), pe = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? O.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? O.format(Math.round(t / 1e4) / 100) + " triệu" : O.format(t) + " đ", j = (t) => t ? new Date(t).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—", re = (t) => t ? new Date(t).toLocaleDateString("vi-VN") : "—", he = (t) => {
  if (!t) return "—";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 1e3);
  return a < 60 ? "vừa xong" : a < 3600 ? `${Math.floor(a / 60)} phút trước` : a < 86400 ? `${Math.floor(a / 3600)} giờ trước` : `${Math.floor(a / 86400)} ngày trước`;
}, L = (t) => t instanceof Error ? t.message : String(t), D = "/apps/sme-sales/api", W = {
  draft: { label: "Nháp", tone: "muted" },
  collecting: { label: "Đang thu thập", tone: "warn" },
  ready: { label: "Sẵn sàng nộp", tone: "ok" },
  submitted: { label: "Đã nộp", tone: "info" }
}, De = {
  open: { label: "Còn thiếu", tone: "danger" },
  requested: { label: "Đã xin khách", tone: "info" },
  waived: { label: "Bỏ qua", tone: "muted" },
  resolved: { label: "Đã đủ", tone: "ok" },
  ok: { label: "Đã đủ", tone: "ok" }
}, je = { email: "Email", zalo: "Zalo", phone_script: "Kịch bản gọi" }, Ae = {
  case_create: "Tạo hồ sơ",
  case_update: "Cập nhật thông tin",
  document_add: "Thêm chứng từ",
  document_update: "Sửa chứng từ",
  requirement_set: "Cập nhật mục",
  requirement_resolved: "Mục tự đóng",
  draft_save: "Lưu thư nháp",
  draft_sent: "Đã gửi thư",
  case_submitted: "Đánh dấu đã nộp",
  evidence_add: "Thêm bằng chứng"
}, q = (t) => t.status === "open" || t.status === "requested", Ke = (t) => t >= 90 ? "ok" : t >= 60 ? "warn" : "danger", Z = (t) => t ? t.startsWith("agent:") ? `Trợ lý (${t.slice(6)})` : "Bạn" : "—";
function ue({ value: t }) {
  return /* @__PURE__ */ n("div", { className: "sme-score", title: `Điểm hoàn thiện ${t}%`, children: [
    /* @__PURE__ */ e("div", { className: "sme-bar-track", children: /* @__PURE__ */ e("div", { className: `sme-bar-fill ${H(Ke(t))}`, style: { width: `${Math.max(2, t)}%` } }) }),
    /* @__PURE__ */ n("span", { className: "sme-score-num", children: [
      t,
      "%"
    ] })
  ] });
}
const ge = ({ stage: t }) => /* @__PURE__ */ e(T, { t: W[t].tone, children: W[t].label });
function Ee(t) {
  return new Promise((a, p) => {
    const r = new FileReader();
    r.onload = () => a(String(r.result).split(",", 2)[1] ?? ""), r.onerror = () => p(r.error ?? new Error("Không đọc được file")), r.readAsDataURL(t);
  });
}
function He({ c: t, onOpen: a }) {
  return /* @__PURE__ */ n("button", { type: "button", className: "sme-card", style: { textAlign: "left", cursor: "pointer", width: "100%" }, onClick: a, children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 12 }, children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0, flex: 1 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: t.customer_name || "Chưa có tên khách hàng" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted sme-mono", children: t.case_id })
      ] }),
      /* @__PURE__ */ e(ge, { stage: t.stage })
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-row sme-wrap sme-small", style: { gap: 10, marginTop: 8 }, children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", children: pe(t.amount) }),
      t.term_months ? /* @__PURE__ */ n("span", { children: [
        t.term_months,
        " tháng"
      ] }) : null,
      t.purpose ? /* @__PURE__ */ e("span", { children: R[t.purpose] ?? t.purpose }) : null,
      /* @__PURE__ */ n("span", { className: "sme-muted", children: [
        "Luồng ",
        t.flow
      ] })
    ] }),
    /* @__PURE__ */ e("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ e(ue, { value: t.score }) }),
    /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6, marginTop: 8 }, children: [
      t.blocking_open > 0 && /* @__PURE__ */ n(T, { t: "danger", children: [
        t.blocking_open,
        " mục chặn nộp"
      ] }),
      t.requested > 0 && /* @__PURE__ */ n(T, { t: "info", children: [
        t.requested,
        " đang chờ khách"
      ] }),
      t.ready && t.stage !== "submitted" && /* @__PURE__ */ n(T, { t: "ok", children: [
        /* @__PURE__ */ e(E, { size: 12 }),
        " Đủ để nộp"
      ] }),
      /* @__PURE__ */ n("span", { className: "sme-small sme-muted", style: { marginLeft: "auto" }, children: [
        "Cập nhật ",
        he(t.updated_at)
      ] })
    ] })
  ] });
}
function Re({ catalog: t, onCancel: a, onCreated: p }) {
  const r = A(), [s, u] = b({ name: "", tax_id: "", product_code: "", amount: "", purpose: "working_capital", term_months: "", flow: "A" }), [f, k] = b(!1), [y, g] = b(null), v = (o) => (m) => u({ ...s, [o]: m.target.value }), N = async () => {
    k(!0);
    try {
      const o = { purpose: s.purpose };
      s.product_code && (o.product_code = s.product_code), s.amount && (o.amount = Number(s.amount)), s.term_months && (o.term_months = Number(s.term_months));
      const m = { name: s.name.trim() };
      s.tax_id.trim() && (m.tax_id = s.tax_id.trim());
      const l = await r.post(`${D}/cases`, { customer: m, request: o, flow: s.flow });
      p(l.case_id);
    } catch (o) {
      g(L(o));
    } finally {
      k(!1);
    }
  };
  return /* @__PURE__ */ n("div", { className: "sme-card", style: { marginBottom: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Hồ sơ mới" }),
      /* @__PURE__ */ e(w, { onClick: a, title: "Đóng", children: /* @__PURE__ */ e(Ne, { size: 14 }) })
    ] }),
    y && /* @__PURE__ */ e("div", { style: { marginBottom: 12 }, children: /* @__PURE__ */ e(K, { title: "Không tạo được hồ sơ", children: y }) }),
    /* @__PURE__ */ n("div", { className: "sme-form", children: [
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Tên khách hàng *",
        /* @__PURE__ */ e("input", { className: "sme-input", value: s.name, onChange: v("name") })
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Mã số thuế",
        /* @__PURE__ */ e("input", { className: "sme-input", value: s.tax_id, onChange: v("tax_id") })
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Sản phẩm",
        /* @__PURE__ */ n("select", { className: "sme-input", value: s.product_code, onChange: v("product_code"), children: [
          /* @__PURE__ */ e("option", { value: "", children: "Chưa chọn" }),
          t == null ? void 0 : t.products.products.map((o) => /* @__PURE__ */ n("option", { value: o.code, children: [
            o.code,
            " · ",
            o.name
          ] }, o.code))
        ] })
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Số tiền vay (đồng)",
        /* @__PURE__ */ e("input", { className: "sme-input", inputMode: "numeric", value: s.amount, onChange: v("amount") })
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Mục đích",
        /* @__PURE__ */ e("select", { className: "sme-input", value: s.purpose, onChange: v("purpose"), children: Object.entries(R).map(([o, m]) => /* @__PURE__ */ e("option", { value: o, children: m }, o)) })
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Kỳ hạn (tháng)",
        /* @__PURE__ */ e("input", { className: "sme-input", inputMode: "numeric", value: s.term_months, onChange: v("term_months") })
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-field", children: [
        "Luồng",
        /* @__PURE__ */ n("select", { className: "sme-input", value: s.flow, onChange: v("flow"), children: [
          /* @__PURE__ */ e("option", { value: "A", children: "Luồng A" }),
          /* @__PURE__ */ e("option", { value: "B", children: "Luồng B" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 14 }, children: [
      /* @__PURE__ */ e(w, { onClick: a, children: "Huỷ" }),
      /* @__PURE__ */ n(w, { primary: !0, busy: f, disabled: !s.name.trim(), onClick: N, children: [
        /* @__PURE__ */ e(P, { size: 14 }),
        " Tạo hồ sơ"
      ] })
    ] })
  ] });
}
function Fe({ onOpen: t, catalog: a }) {
  const p = A(), [r, s] = b(null), [u, f] = b(null), [k, y] = b(!1), [g, v] = b("all"), [N, o] = b(""), [m, l] = b(!1), i = X(async () => {
    y(!0);
    try {
      s((await p.get(`${D}/cases`)).cases), f(null);
    } catch (c) {
      f(L(c));
    } finally {
      y(!1);
    }
  }, [p]);
  G(() => {
    i();
  }, [i]);
  const x = (c) => (r == null ? void 0 : r.filter((_) => _.stage === c).length) ?? 0, h = I(() => {
    const c = N.trim().toLowerCase();
    return (r ?? []).filter((_) => (g === "all" || _.stage === g) && (!c || [_.customer_name, _.case_id].some(($) => $ == null ? void 0 : $.toLowerCase().includes(c))));
  }, [r, g, N]);
  return /* @__PURE__ */ n(oe, { children: [
    /* @__PURE__ */ e(
      ye,
      {
        title: "Hoàn thiện hồ sơ",
        subtitle: "Bộ hồ sơ khách hàng đang chuẩn bị, còn thiếu gì và đã đủ để nộp Thẩm định chưa",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(w, { onClick: i, busy: k, children: [
            /* @__PURE__ */ e(le, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(w, { primary: !0, onClick: () => l(!0), children: [
            /* @__PURE__ */ e(P, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      u && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(K, { title: "Không tải được danh sách hồ sơ", children: u }) }),
      m && /* @__PURE__ */ e(
        Re,
        {
          catalog: a,
          onCancel: () => l(!1),
          onCreated: (c) => {
            l(!1), t(c);
          }
        }
      ),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(S, { icon: /* @__PURE__ */ e(se, { size: 18 }), label: "Đang chuẩn bị", value: r ? x("draft") + x("collecting") : "…" }),
        /* @__PURE__ */ e(S, { t: "warn", icon: /* @__PURE__ */ e(we, { size: 18 }), label: "Mục chờ khách", value: r ? r.reduce((c, _) => c + _.requested, 0) : "…" }),
        /* @__PURE__ */ e(S, { t: "ok", icon: /* @__PURE__ */ e(ce, { size: 18 }), label: "Sẵn sàng nộp", value: r ? x("ready") : "…" }),
        /* @__PURE__ */ e(S, { t: "info", icon: /* @__PURE__ */ e(E, { size: 18 }), label: "Đã nộp", value: r ? x("submitted") : "…" })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc theo giai đoạn", children: ["all", "draft", "collecting", "ready", "submitted"].map((c) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": g === c,
            className: `sme-filter ${g === c ? "on" : ""}`,
            onClick: () => v(c),
            children: [
              c === "all" ? "Tất cả" : W[c].label,
              c !== "all" && r ? ` (${x(c)})` : ""
            ]
          },
          c
        )) }),
        /* @__PURE__ */ n("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(ae, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: N, onChange: (c) => o(c.target.value), placeholder: "Tìm khách hàng hoặc mã hồ sơ" })
        ] })
      ] }),
      r && r.length === 0 && !m && /* @__PURE__ */ e(
        M,
        {
          icon: /* @__PURE__ */ e(se, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Tạo hồ sơ rồi tải chứng từ khách gửi lên để xem còn thiếu gì.",
          action: /* @__PURE__ */ n(w, { primary: !0, onClick: () => l(!0), children: [
            /* @__PURE__ */ e(P, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      r && r.length > 0 && h.length === 0 && /* @__PURE__ */ e(M, { icon: /* @__PURE__ */ e(ae, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      h.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: h.map((c) => /* @__PURE__ */ e(He, { c, onOpen: () => t(c.case_id) }, c.case_id)) })
    ] })
  ] });
}
const Oe = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function Pe(t, a, p) {
  const r = ve();
  return X(
    async (s, u, f) => {
      const { openChat: k } = r, y = r.createChat;
      if (!y) {
        k({ autoSend: !1, message: s });
        return;
      }
      try {
        const g = await y({ slotKey: a + Oe(u), agent: t, title: f });
        k({ slotKey: g, autoSend: !1, message: s });
      } catch (g) {
        p == null || p(`Không mở được chat với trợ lý: ${g instanceof Error ? g.message : String(g)}`);
      }
    },
    [r, t, a, p]
  );
}
const Ue = 10 * 1024 * 1024;
function be({ catalog: t, value: a, onChange: p }) {
  return /* @__PURE__ */ n("select", { className: "sme-input", value: a, onChange: (r) => p(r.target.value), children: [
    /* @__PURE__ */ e("option", { value: "", children: "Chưa phân loại" }),
    Object.entries((t == null ? void 0 : t.documents.types) ?? {}).map(([r, s]) => /* @__PURE__ */ e("option", { value: r, children: s.label }, r))
  ] });
}
function Ve({ d: t, catalog: a, onSave: p }) {
  const [r, s] = b(t.type ?? ""), [u, f] = b(t.issued_date ?? ""), [k, y] = b(!1), g = r !== (t.type ?? "") || u !== (t.issued_date ?? "");
  return /* @__PURE__ */ n("tr", { children: [
    /* @__PURE__ */ e("td", { className: "sme-mono", children: t.id }),
    /* @__PURE__ */ n("td", { children: [
      /* @__PURE__ */ e("div", { className: "sme-strong", children: t.name }),
      /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
        t.size ? `${Math.round(t.size / 1024)} KB · ` : "Chưa có file · ",
        Z(t.added_by),
        " · ",
        he(t.added_at)
      ] })
    ] }),
    /* @__PURE__ */ e("td", { style: { minWidth: 220 }, children: /* @__PURE__ */ e(be, { catalog: a, value: r, onChange: s }) }),
    /* @__PURE__ */ e("td", { style: { minWidth: 150 }, children: /* @__PURE__ */ e("input", { className: "sme-input", type: "date", value: u, onChange: (v) => f(v.target.value) }) }),
    /* @__PURE__ */ e("td", { children: g && /* @__PURE__ */ n(w, { busy: k, onClick: async () => {
      y(!0), await p(t.id, { type: r, issued_date: u }), y(!1);
    }, children: [
      /* @__PURE__ */ e(me, { size: 13 }),
      " Lưu"
    ] }) })
  ] });
}
function We({ docs: t, catalog: a, onUpload: p, onSave: r }) {
  const [s, u] = b(null), [f, k] = b(""), [y, g] = b(""), [v, N] = b(!1), [o, m] = b(null);
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", style: { marginBottom: 10 }, children: "Thêm chứng từ khách gửi" }),
      o && /* @__PURE__ */ e("div", { style: { marginBottom: 10 }, children: /* @__PURE__ */ e(K, { title: "Không tải lên được", children: o }) }),
      /* @__PURE__ */ n("div", { className: "sme-form", children: [
        /* @__PURE__ */ n("label", { className: "sme-field", children: [
          "File (tối đa 10 MB)",
          /* @__PURE__ */ e("input", { className: "sme-input", type: "file", onChange: (i) => {
            var x;
            return u(((x = i.target.files) == null ? void 0 : x[0]) ?? null);
          } })
        ] }),
        /* @__PURE__ */ n("label", { className: "sme-field", children: [
          "Loại chứng từ",
          /* @__PURE__ */ e(be, { catalog: a, value: f, onChange: k })
        ] }),
        /* @__PURE__ */ n("label", { className: "sme-field", children: [
          "Ngày lập",
          /* @__PURE__ */ e("input", { className: "sme-input", type: "date", value: y, onChange: (i) => g(i.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: "Chưa rõ loại hoặc ngày lập thì cứ tải lên; nhờ trợ lý đọc chứng từ để phân loại." }),
      /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 10 }, children: /* @__PURE__ */ n(w, { primary: !0, busy: v, disabled: !s, onClick: async () => {
        if (s) {
          if (s.size > Ue) {
            m("File lớn hơn 10 MB.");
            return;
          }
          N(!0);
          try {
            await p({ name: s.name, type: f, issued_date: y, content_b64: await Ee(s) }) && (u(null), k(""), g(""), m(null));
          } catch (i) {
            m(L(i));
          } finally {
            N(!1);
          }
        }
      }, children: [
        /* @__PURE__ */ e(Ce, { size: 14 }),
        " Tải lên"
      ] }) })
    ] }),
    t.length === 0 ? /* @__PURE__ */ e(M, { icon: /* @__PURE__ */ e(de, { size: 30 }), title: "Chưa có chứng từ", hint: "Tải lên chứng từ khách đã gửi." }) : /* @__PURE__ */ e("div", { className: "sme-card", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Mã" }),
        /* @__PURE__ */ e("th", { children: "Chứng từ" }),
        /* @__PURE__ */ e("th", { children: "Loại" }),
        /* @__PURE__ */ e("th", { children: "Ngày lập" }),
        /* @__PURE__ */ e("th", {})
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((i) => /* @__PURE__ */ e(Ve, { d: i, catalog: a, onSave: r }, i.id + (i.type ?? "") + (i.issued_date ?? ""))) })
    ] }) })
  ] });
}
function Xe({ d: t, items: a, onSent: p }) {
  const [r, s] = b(!1), [u, f] = b(!1), k = async () => {
    await navigator.clipboard.writeText(t.subject ? `${t.subject}

${t.body}` : t.body), s(!0), setTimeout(() => s(!1), 1500);
  };
  return /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        /* @__PURE__ */ e("span", { className: "sme-mono sme-small", children: t.id }),
        /* @__PURE__ */ e(T, { t: "accent", children: je[t.channel] }),
        t.status === "sent" ? /* @__PURE__ */ n(T, { t: "ok", children: [
          "Đã gửi ",
          j(t.sent_at)
        ] }) : /* @__PURE__ */ e(T, { t: "warn", children: "Nháp" }),
        /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          Z(t.author.includes(":") ? t.author : `agent:${t.author}`),
          " · ",
          j(t.created_at)
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        /* @__PURE__ */ n(w, { onClick: k, children: [
          r ? /* @__PURE__ */ e(ze, { size: 13 }) : /* @__PURE__ */ e(_e, { size: 13 }),
          " ",
          r ? "Đã chép" : "Sao chép"
        ] }),
        t.status === "draft" && /* @__PURE__ */ e(w, { primary: !0, busy: u, onClick: async () => {
          f(!0), await p(t.id), f(!1);
        }, children: "Đã gửi" })
      ] })
    ] }),
    t.subject && /* @__PURE__ */ e("div", { className: "sme-strong", style: { marginTop: 10 }, children: t.subject }),
    /* @__PURE__ */ e("pre", { className: "sme-pre", style: { whiteSpace: "pre-wrap", marginTop: 8 }, children: t.body }),
    t.requirement_keys.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: [
      "Xin các mục: ",
      t.requirement_keys.map((y) => {
        var g;
        return ((g = a.get(y)) == null ? void 0 : g.title) ?? y;
      }).join("; ")
    ] })
  ] });
}
function Ge({ drafts: t, items: a, onSent: p, onNew: r }) {
  const s = new Map(a.map((u) => [u.key, u]));
  return t.length === 0 ? /* @__PURE__ */ e(
    M,
    {
      icon: /* @__PURE__ */ e(B, { size: 30 }),
      title: "Chưa có thư nháp",
      hint: "Chọn các mục ở tab Còn thiếu rồi nhờ trợ lý soạn thư. Bạn sửa, tự gửi, rồi bấm Đã gửi.",
      action: /* @__PURE__ */ n(w, { primary: !0, onClick: r, children: [
        /* @__PURE__ */ e(B, { size: 14 }),
        " Soạn thư xin bổ sung"
      ] })
    }
  ) : /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: 'Thư do trợ lý soạn không tự gửi đi. Bấm "Đã gửi" sau khi bạn gửi để các mục chuyển sang "Đã xin khách".' }),
    [...t].reverse().map((u) => /* @__PURE__ */ e(Xe, { d: u, items: s, onSent: p }, u.id))
  ] });
}
function Ie({ it: t, selected: a, onSelect: p, onSet: r }) {
  const [s, u] = b("none"), [f, k] = b(""), [y, g] = b(""), [v, N] = b(!1), o = De[t.status], m = async (i) => {
    N(!0), await r(t.key, i, f, y || void 0) && (u("none"), k(""), g("")), N(!1);
  }, l = q(t);
  return /* @__PURE__ */ n("div", { className: "sme-item", children: [
    l ? /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        "aria-label": "Chọn để soạn thư",
        checked: a,
        onChange: (i) => p(i.target.checked),
        style: { marginTop: 3 }
      }
    ) : /* @__PURE__ */ e(E, { size: 15, className: "sme-muted", style: { marginTop: 2 } }),
    /* @__PURE__ */ n("div", { className: "sme-item-body", children: [
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        /* @__PURE__ */ e("span", { className: "sme-item-title", children: t.title }),
        /* @__PURE__ */ e(T, { t: o.tone, children: o.label }),
        t.blocking && l && /* @__PURE__ */ e(T, { t: "danger", children: "Chặn nộp" }),
        !t.blocking && l && /* @__PURE__ */ e(T, { t: "muted", children: t.kind === "policy_precheck" ? "Cảnh báo sơ bộ" : "Nên có" })
      ] }),
      t.reason && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: t.reason }),
      l && t.ask && /* @__PURE__ */ n("div", { className: "sme-item-ask", children: [
        "Xin khách: ",
        t.ask
      ] }),
      l && t.alternatives.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 4 }, children: [
        "Có thể thay bằng: ",
        t.alternatives.join("; ")
      ] }),
      t.status === "requested" && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
        "Đã xin ngày ",
        re(t.requested_at),
        t.due_date ? ` · hạn ${re(t.due_date)}` : "",
        t.note ? ` · ${t.note}` : ""
      ] }),
      t.status === "waived" && /* @__PURE__ */ n("div", { className: "sme-decision t-muted", children: [
        "Lý do bỏ qua: ",
        t.note
      ] }),
      s !== "none" && /* @__PURE__ */ n("div", { className: "sme-stack", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: f,
            onChange: (i) => k(i.target.value),
            placeholder: s === "waive" ? "Lý do bỏ qua (bắt buộc, đi kèm hồ sơ khi nộp)" : "Ghi chú (không bắt buộc)"
          }
        ),
        s === "request" && /* @__PURE__ */ n("label", { className: "sme-field", style: { maxWidth: 220 }, children: [
          "Hạn khách gửi",
          /* @__PURE__ */ e("input", { className: "sme-input", type: "date", value: y, onChange: (i) => g(i.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ e(w, { onClick: () => u("none"), children: "Huỷ" }),
          s === "waive" ? /* @__PURE__ */ e(w, { primary: !0, busy: v, disabled: !f.trim(), onClick: () => m("waived"), children: "Bỏ qua mục này" }) : /* @__PURE__ */ e(w, { primary: !0, busy: v, onClick: () => m("requested"), children: "Lưu" })
        ] })
      ] })
    ] }),
    s === "none" && /* @__PURE__ */ n("div", { className: "sme-row", style: { flex: "none" }, children: [
      t.status === "open" && /* @__PURE__ */ e(w, { onClick: () => u("request"), title: "Đánh dấu đã xin khách", children: /* @__PURE__ */ e(U, { size: 13 }) }),
      l && t.kind !== "policy_precheck" && /* @__PURE__ */ e(w, { onClick: () => u("waive"), title: "Bỏ qua (cần lý do)", children: /* @__PURE__ */ e(Te, { size: 13 }) }),
      (t.status === "waived" || t.status === "requested") && /* @__PURE__ */ e(w, { busy: v, onClick: () => m("open"), title: "Mở lại", children: /* @__PURE__ */ e(Se, { size: 13 }) })
    ] })
  ] });
}
function Ze({ overview: t, catalog: a, onSet: p, onDraft: r }) {
  const [s, u] = b(/* @__PURE__ */ new Set()), [f, k] = b(!1), y = (a == null ? void 0 : a.documents.groups) ?? {}, g = t.items.filter((l) => f || q(l) || l.status === "waived"), v = I(() => {
    const l = /* @__PURE__ */ new Map();
    for (const i of [...g].sort((x, h) => Number(h.blocking) - Number(x.blocking)))
      l.set(i.group, [...l.get(i.group) ?? [], i]);
    return [...l.entries()];
  }, [g]), N = (l, i) => {
    const x = new Set(s);
    i ? x.add(l) : x.delete(l), u(x);
  }, o = t.items.filter(q).length, m = t.items.filter((l) => q(l) && l.blocking && l.ask).map((l) => l.key);
  return /* @__PURE__ */ n("div", { children: [
    t.readiness.ready ? /* @__PURE__ */ n(V, { t: "ok", children: [
      "Không còn mục chặn nộp. Hồ sơ đủ điều kiện để nộp Thẩm định",
      t.readiness.waived.length ? `; ${t.readiness.waived.length} mục đã bỏ qua sẽ đi kèm giải trình.` : "."
    ] }) : /* @__PURE__ */ n(V, { t: "warn", children: [
      "Còn ",
      t.readiness.blocking_open.length,
      " mục chặn nộp. Bổ sung hoặc bỏ qua có lý do trước khi nộp."
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { margin: "12px 0" }, children: [
      /* @__PURE__ */ n("label", { className: "sme-check", children: [
        /* @__PURE__ */ e("input", { type: "checkbox", checked: f, onChange: (l) => k(l.target.checked) }),
        " Hiện cả mục đã đủ"
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        m.length > 0 && s.size === 0 && /* @__PURE__ */ n(w, { onClick: () => r(m), children: [
          /* @__PURE__ */ e(B, { size: 14 }),
          " Soạn thư xin các mục chặn"
        ] }),
        s.size > 0 && /* @__PURE__ */ n(w, { primary: !0, onClick: () => r([...s]), children: [
          /* @__PURE__ */ e(B, { size: 14 }),
          " Soạn thư cho ",
          s.size,
          " mục đã chọn"
        ] })
      ] })
    ] }),
    o === 0 && !f && t.readiness.waived.length === 0 && /* @__PURE__ */ e(M, { icon: /* @__PURE__ */ e(E, { size: 30 }), title: "Hồ sơ đã đủ", hint: "Không còn mục nào cần bổ sung." }),
    v.map(([l, i]) => /* @__PURE__ */ n("div", { children: [
      /* @__PURE__ */ e("div", { className: "sme-group-title", children: y[l] ?? l }),
      /* @__PURE__ */ e("div", { children: i.map((x) => /* @__PURE__ */ e(Ie, { it: x, selected: s.has(x.key), onSelect: (h) => N(x.key, h), onSet: p }, x.key)) })
    ] }, l))
  ] });
}
const ie = /* @__PURE__ */ new Set([
  "request.amount",
  "request.term_months",
  "request.annual_rate_pct",
  "facts.years_in_operation",
  "facts.equity_contribution_pct"
]), Je = {
  "customer.cif": "CIF",
  "customer.address": "Địa chỉ",
  "customer.legal_rep": "Người đại diện",
  "customer.established": "Ngày thành lập",
  "request.proposal": "Đề xuất của ĐVKD"
};
function Qe({ c: t, catalog: a, onSave: p }) {
  const r = I(() => {
    const o = [];
    for (const [m, l] of Object.entries((a == null ? void 0 : a.documents.fields) ?? {})) o.push([m, l.label]);
    for (const [m, l] of Object.entries(Je)) o.push([m, l]);
    for (const [m, l] of Object.entries((a == null ? void 0 : a.documents.sales_facts) ?? {})) o.push([`facts.${m}`, l.label]);
    return o;
  }, [a]), s = (o) => {
    const [m, l] = o.split("."), i = (t[m] ?? {})[l];
    return i == null ? "" : String(i);
  }, [u, f] = b({}), [k, y] = b(!1), g = Object.keys(u).filter((o) => u[o] !== s(o)), v = async () => {
    const o = {};
    for (const m of g) {
      const [l, i] = m.split("."), x = u[m].trim(), h = x === "" ? null : ie.has(m) ? Number(x) : x;
      o[l] = { ...o[l] ?? {}, [i]: h };
    }
    y(!0), await p(o) && f({}), y(!1);
  }, N = (o) => {
    const m = u[o] ?? s(o), l = (i) => f({ ...u, [o]: i });
    return o === "request.product_code" ? /* @__PURE__ */ n("select", { className: "sme-input", value: m, onChange: (i) => l(i.target.value), children: [
      /* @__PURE__ */ e("option", { value: "", children: "Chưa chọn" }),
      a == null ? void 0 : a.products.products.map((i) => /* @__PURE__ */ n("option", { value: i.code, children: [
        i.code,
        " · ",
        i.name
      ] }, i.code))
    ] }) : o === "request.purpose" ? /* @__PURE__ */ n("select", { className: "sme-input", value: m, onChange: (i) => l(i.target.value), children: [
      /* @__PURE__ */ e("option", { value: "", children: "Chưa chọn" }),
      Object.entries(R).map(([i, x]) => /* @__PURE__ */ e("option", { value: i, children: x }, i))
    ] }) : /* @__PURE__ */ e(
      "input",
      {
        className: "sme-input",
        value: m,
        inputMode: ie.has(o) ? "decimal" : void 0,
        type: o === "customer.established" ? "date" : "text",
        onChange: (i) => l(i.target.value)
      }
    );
  };
  return /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ e("div", { className: "sme-form", children: r.map(([o, m]) => /* @__PURE__ */ n("label", { className: "sme-field", children: [
      m,
      N(o)
    ] }, o)) }),
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 14 }, children: /* @__PURE__ */ n(w, { primary: !0, busy: k, disabled: g.length === 0, onClick: v, children: [
      /* @__PURE__ */ e(me, { size: 14 }),
      " Lưu ",
      g.length || "",
      " thay đổi"
    ] }) })
  ] });
}
const Ye = "dossier-coach";
function et({ caseId: t, catalog: a, onBack: p }) {
  var Q, Y, ee, te, ne;
  const r = A(), [s, u] = b(null), [f, k] = b(null), [y, g] = b(!1), [v, N] = b("gaps"), [o, m] = b(null), l = Pe(Ye, "sme-sales-chat-", k), i = X(async () => {
    g(!0);
    try {
      u(await r.get(`${D}/cases/${t}`)), k(null);
    } catch (d) {
      k(L(d));
    } finally {
      g(!1);
    }
  }, [r, t]);
  G(() => {
    i();
  }, [i]);
  const x = async (d, C) => {
    try {
      return await r.post(`${D}/cases/${t}${d}`, C), await i(), !0;
    } catch (z) {
      return k(L(z)), !1;
    }
  }, h = s == null ? void 0 : s.case, c = s == null ? void 0 : s.overview, _ = String(((Q = h == null ? void 0 : h.customer) == null ? void 0 : Q.name) || t), $ = `Hồ sơ ${_}`, xe = () => l(`Rà soát hồ sơ ${t}: đọc chứng từ, điền thông tin còn trống và cho tôi biết còn thiếu gì.`, t, $), J = (d) => {
    const C = ((c == null ? void 0 : c.items) ?? []).filter((z) => d.includes(z.key)).map((z) => `- ${z.title} [${z.key}]`).join(`
`);
    l(`Soạn email xin khách bổ sung cho hồ sơ ${t} các mục sau:
${C}`, t, $);
  }, F = (c == null ? void 0 : c.items.filter(q).length) ?? 0;
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: p, children: [
          /* @__PURE__ */ e($e, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: _ }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          h && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            h.flow
          ] }),
          ((Y = h == null ? void 0 : h.request) == null ? void 0 : Y.product_code) && /* @__PURE__ */ e("span", { className: "sme-chip", children: String(h.request.product_code) }),
          ((ee = h == null ? void 0 : h.request) == null ? void 0 : ee.purpose) && /* @__PURE__ */ e("span", { className: "sme-chip", children: R[h.request.purpose] ?? h.request.purpose }),
          c && /* @__PURE__ */ e(ge, { stage: c.stage })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(w, { onClick: i, busy: y, title: "Tải lại", children: /* @__PURE__ */ e(le, { size: 14 }) }),
        /* @__PURE__ */ n(w, { onClick: () => J((c == null ? void 0 : c.items.filter((d) => q(d) && d.blocking && d.ask).map((d) => d.key)) ?? []), children: [
          /* @__PURE__ */ e(B, { size: 14 }),
          " Soạn thư cho khách"
        ] }),
        /* @__PURE__ */ n(w, { primary: !0, onClick: xe, children: [
          /* @__PURE__ */ e(qe, { size: 14 }),
          " Rà soát với trợ lý"
        ] })
      ] })
    ] }),
    f && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(K, { title: "Có lỗi khi làm việc với hồ sơ", children: f }) }),
    !s && !f && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" })
    ] }),
    s && h && c && /* @__PURE__ */ n(oe, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          S,
          {
            icon: /* @__PURE__ */ e(ce, { size: 18 }),
            label: "Điểm hoàn thiện",
            value: /* @__PURE__ */ e(ue, { value: c.readiness.score }),
            hint: c.readiness.ready ? "Đủ để nộp" : `${c.readiness.blocking_open.length} mục chặn nộp`,
            t: c.readiness.ready ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ e(
          S,
          {
            t: F ? "warn" : "ok",
            icon: /* @__PURE__ */ e(U, { size: 18 }),
            label: "Mục còn mở",
            value: F,
            hint: `${c.items.filter((d) => d.status === "requested").length} đang chờ khách`
          }
        ),
        /* @__PURE__ */ e(S, { icon: /* @__PURE__ */ e(de, { size: 18 }), label: "Chứng từ", value: h.documents.length }),
        /* @__PURE__ */ e(
          S,
          {
            icon: /* @__PURE__ */ e(Be, { size: 18 }),
            label: "Số tiền đề nghị",
            value: pe((te = h.request) == null ? void 0 : te.amount),
            hint: (ne = h.request) != null && ne.term_months ? `${h.request.term_months} tháng` : void 0
          }
        )
      ] }),
      h.submitted ? /* @__PURE__ */ e("div", { style: { marginBottom: 12 }, children: /* @__PURE__ */ n(V, { t: "info", children: [
        "Đã đánh dấu nộp ngày ",
        j(h.submitted.at),
        h.submitted.note ? ` · ${h.submitted.note}` : "",
        "."
      ] }) }) : o !== null ? /* @__PURE__ */ n("div", { className: "sme-card", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Đánh dấu đã nộp Thẩm định" }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: [
          "Nộp trên hệ thống trung tâm vẫn làm thủ công. ",
          c.readiness.ready ? "Ghi chú không bắt buộc." : "Hồ sơ còn mục chặn nộp: bắt buộc ghi lý do."
        ] }),
        /* @__PURE__ */ e("textarea", { className: "sme-textarea", value: o, onChange: (d) => m(d.target.value) }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(w, { onClick: () => m(null), children: "Huỷ" }),
          /* @__PURE__ */ e(
            w,
            {
              primary: !0,
              disabled: !c.readiness.ready && !o.trim(),
              onClick: async () => {
                await x("/submitted", { note: o }) && m(null);
              },
              children: "Xác nhận đã nộp"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end", marginBottom: 12 }, children: /* @__PURE__ */ n(w, { primary: c.readiness.ready, onClick: () => m(""), children: [
        /* @__PURE__ */ e(U, { size: 14 }),
        " Đánh dấu đã nộp"
      ] }) }),
      /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: [
        ["gaps", "Còn thiếu", F],
        ["documents", "Chứng từ", h.documents.length],
        ["info", "Thông tin", null],
        ["drafts", "Thư khách hàng", s.drafts.filter((d) => d.status === "draft").length],
        ["audit", "Nhật ký", null]
      ].map(([d, C, z]) => /* @__PURE__ */ n("button", { type: "button", role: "tab", "aria-selected": v === d, className: `sme-tab ${v === d ? "on" : ""}`, onClick: () => N(d), children: [
        C,
        z ? /* @__PURE__ */ e("span", { className: "sme-count", children: z }) : null
      ] }, d)) }),
      v === "gaps" && /* @__PURE__ */ e(
        Ze,
        {
          overview: c,
          catalog: a,
          onDraft: J,
          onSet: (d, C, z, fe) => x("/requirements", { key: d, status: C, note: z, due_date: fe ?? "" })
        }
      ),
      v === "documents" && /* @__PURE__ */ e(
        We,
        {
          docs: h.documents,
          catalog: a,
          onUpload: (d) => x("/documents", d),
          onSave: (d, C) => x(`/documents/${d}`, C)
        }
      ),
      v === "info" && /* @__PURE__ */ e(Qe, { c: h, catalog: a, onSave: (d) => x("/fields", d) }, JSON.stringify([h.customer, h.request, h.facts])),
      v === "drafts" && /* @__PURE__ */ e(
        Ge,
        {
          drafts: s.drafts,
          items: c.items,
          onNew: () => N("gaps"),
          onSent: (d) => x(`/drafts/${d}/sent`, {})
        }
      ),
      v === "audit" && /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...s.audit].reverse().map((d, C) => /* @__PURE__ */ n("div", { className: "sme-tl-item", children: [
        /* @__PURE__ */ e("div", { className: "sme-strong sme-small", children: Ae[d.action] ?? d.action }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
          j(d.ts),
          " · ",
          Z(String(d.actor ?? d.agent ?? d.author ?? "")),
          d.key ? ` · ${String(d.key)}` : "",
          d.status ? ` → ${String(d.status)}` : "",
          d.id ? ` · ${String(d.id)}` : ""
        ] })
      ] }, C)) }) })
    ] })
  ] });
}
Le();
function it() {
  const t = A(), [a, p] = b(null), [r, s] = b(null);
  return G(() => {
    t.get(`${D}/catalog`).then(s).catch(() => s(null));
  }, [t]), /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: a ? /* @__PURE__ */ e(et, { caseId: a, catalog: r, onBack: () => p(null) }) : /* @__PURE__ */ e(Fe, { onOpen: p, catalog: r }) });
}
export {
  it as default
};
