import { jsxs as n, jsx as e, Fragment as me } from "react/jsx-runtime";
import * as Ke from "@kirocrew/app-sdk";
import { useChatLauncher as Pt, useAppApi as vt } from "@kirocrew/app-sdk";
import { useCallback as Q, useState as y, useMemo as X, useRef as te, useEffect as Z, Fragment as yt } from "react";
import { Btn as C, PageHeader as Gt, ErrorNotice as kt } from "@kirocrew/app-sdk/ui";
import { MessageSquare as we, Plus as Oe, ExternalLink as Fe, PanelRightClose as Ft, ArrowRight as Xt, AlertTriangle as jt, FileText as wt, Mail as We, Calendar as Ot, CheckCircle2 as Nt, XCircle as Vt, CircleDot as Ut, CircleDashed as Wt, RefreshCw as Ct, FolderOpen as ct, ClipboardCheck as _e, ShieldAlert as Yt, Clock as Qt, Search as dt, X as Zt, Send as _t, Check as Me, Copy as Ae, SkipForward as Jt, RotateCcw as en, FileSearch as tn, Eye as nn, Download as sn, Trash2 as rn, History as an, ArrowLeft as on, Unlock as mt, Landmark as ln, ClipboardList as cn, ShieldCheck as dn, Activity as mn } from "lucide-react";
const hn = `
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
function un() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = hn, document.head.appendChild(s);
}
const pn = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function gn(t, s, r) {
  const a = Pt();
  return Q(
    async (g, h, x) => {
      const { openChat: p } = a, f = a.createChat;
      if (!f) {
        p({ autoSend: !1, message: g });
        return;
      }
      try {
        const v = await f({ slotKey: s + pn(h), agent: t, title: x });
        p({ slotKey: v, autoSend: !1, message: g });
      } catch {
      }
    },
    [a, t, s, r]
  );
}
const Ye = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, Be = new Intl.NumberFormat("vi-VN"), St = (t) => typeof t == "number" ? Be.format(t) + " đ" : "—", Qe = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? Be.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? Be.format(Math.round(t / 1e4) / 100) + " triệu" : Be.format(t) + " đ", ke = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", ze = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, re = (t) => {
  if (!t) return "—";
  const s = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t.trim());
  if (s) return `${Number(s[3])}/${Number(s[2])}/${s[1]}`;
  const r = new Date(t);
  return Number.isNaN(r.getTime()) ? "—" : r.toLocaleDateString("vi-VN");
}, $t = (t) => {
  if (!t) return "—";
  const s = new Date(t).getTime();
  if (Number.isNaN(s)) return "—";
  const r = Math.round((Date.now() - s) / 1e3);
  return r < 60 ? "vừa xong" : r < 3600 ? `${Math.floor(r / 60)} phút trước` : r < 86400 ? `${Math.floor(r / 3600)} giờ trước` : `${Math.floor(r / 86400)} ngày trước`;
}, ht = (t) => {
  const s = /* @__PURE__ */ new Date();
  s.setDate(s.getDate() + t);
  const r = s.getFullYear(), a = String(s.getMonth() + 1).padStart(2, "0"), g = String(s.getDate()).padStart(2, "0");
  return `${r}-${a}-${g}`;
};
async function Ze(t) {
  var s;
  try {
    if ((s = navigator.clipboard) != null && s.writeText)
      return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const r = document.createElement("textarea");
    r.value = t, r.style.position = "fixed", r.style.opacity = "0", document.body.appendChild(r), r.select();
    const a = document.execCommand("copy");
    return document.body.removeChild(r), a;
  } catch {
    return !1;
  }
}
const Se = (t) => t instanceof Error ? t.message : String(t), $e = "/apps/sme-sales/api", ut = {
  draft: { label: "Khởi tạo", tone: "muted" },
  collecting: { label: "Đang thu thập", tone: "warn" },
  ready: { label: "Đủ điều kiện trình", tone: "ok" },
  submitted: { label: "Đã bàn giao", tone: "info" }
}, Tt = {
  open: { label: "Chưa bổ sung", tone: "danger" },
  requested: { label: "Chờ khách hàng", tone: "info" },
  waived: { label: "Xin miễn / Bổ sung sau", tone: "muted" },
  resolved: { label: "Đạt", tone: "ok" },
  ok: { label: "Đạt", tone: "ok" }
}, Je = { email: "Email", zalo: "Zalo", phone_script: "Kịch bản gọi" }, fn = {
  case_create: "Khởi tạo hồ sơ",
  case_update: "Cập nhật hồ sơ",
  document_add: "Tiếp nhận chứng từ",
  document_update: "Phân loại chứng từ",
  document_remove: "Gỡ chứng từ",
  requirement_set: "Cập nhật hạng mục",
  requirement_resolved: "Tự động hoàn tất hạng mục",
  draft_save: "Tạo thư nháp",
  draft_sent: "Đã gửi yêu cầu KH",
  case_submitted: "Bàn giao Thẩm định",
  case_reopened: "Mở lại hồ sơ",
  evidence_add: "Thêm bằng chứng"
}, zt = (t) => t ? t.startsWith("agent:") || t === "dossier-coach" ? "Trợ lý AI" : "ĐVKD" : "Hệ thống", Xe = "dossier-coach", je = "sme-sales-chat-";
function bn(t) {
  switch (t.action) {
    case "document_add":
    case "document_update":
    case "document_remove":
      return [t.id, t.name].filter(Boolean).join(" · ");
    case "case_update":
      return Array.isArray(t.fields) ? `${t.fields.length} chỉ tiêu` : "";
    case "requirement_set":
      return `${String(t.key ?? "")} → ${String(t.status ?? "")}`;
    case "requirement_resolved":
      return Array.isArray(t.keys) ? `${t.keys.length} hạng mục đạt` : "";
    case "draft_save":
    case "draft_sent":
      return String(t.id ?? "");
    case "case_reopened":
      return String(t.note ?? "");
    default:
      return "";
  }
}
function Te(t, s, r) {
  if (s == null || s === "") return "—";
  if (t === "request.purpose" && typeof s == "string") return Ye[s] ?? s;
  if (t === "request.product_code" && typeof s == "string") {
    const a = r == null ? void 0 : r.products.products.find((g) => g.code === s);
    return a ? `${a.code} · ${a.name}` : s;
  }
  return typeof s == "number" ? /fiscal_year/.test(t) ? String(s) : /_pct$|ty_le/.test(t) ? `${ke(s, 2)}%` : /term_months|so_thang/.test(t) ? `${s} tháng` : /years_in_operation|so_nam/.test(t) ? `${ke(s, 1)} năm` : /amount|capital|revenue|income|assets|equity|investment|value|so_tien|gia_tri|doanh_thu|von|tai_san|loi_nhuan/.test(t) ? St(s) : s.toLocaleString("vi-VN") : typeof s == "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) ? re(s) : String(s);
}
function Le(t, s) {
  return s == null || s === "" ? "—" : t === "loan_amount" ? Qe(s) : t === "term_months" ? `${ke(s, 0)} tháng` : t === "years_in_operation" ? `${ke(s, 1)} năm` : t === "equity_contribution_pct" ? `${ke(s, 1)}%` : typeof s == "number" ? ke(s) : String(s);
}
function xn(t, s, r = "email", a = !1) {
  const g = Je[r], h = a ? "nhắc khách bổ sung (giọng nhắc lịch sự các mục đã yêu cầu)" : "xin khách bổ sung", x = s.map((p) => `- ${p.title} [${p.key}]`).join(`
`);
  return `Soạn ${g} ${h} cho hồ sơ ${t} (kênh: ${r}) gồm các hạng mục sau:
${x}`;
}
function vn(t, s) {
  var _, N, q;
  const { case: r, overview: a } = t, g = (s == null ? void 0 : s.documents.types) ?? {}, h = a.items.filter((o) => o.blocking).length, x = a.items.filter((o) => o.blocking && ["ok", "resolved", "waived"].includes(o.status)).length, p = [
    `PHIẾU BÀN GIAO HỒ SƠ THẨM ĐỊNH: ${r.case_id}`,
    `Khách hàng: ${((_ = r.customer) == null ? void 0 : _.name) ?? "Chưa rõ"} | MST: ${((N = r.customer) == null ? void 0 : N.tax_id) ?? "—"} | Luồng: ${r.flow}`,
    `Hạng mục bắt buộc: ${x}/${h} | Trạng thái: ${a.readiness.ready ? "Đủ điều kiện trình" : `Còn ${a.readiness.blocking_open.length} mục chặn`}`,
    "",
    "1. THÔNG TIN KHÁCH HÀNG & ĐỀ XUẤT"
  ];
  for (const o of a.profile)
    p.push(`- ${o.label}: ${Te(o.path, o.value, s)}`);
  p.push("", `2. CHỨNG TỪ ĐỐI CHIẾU (${r.documents.length})`), r.documents.length === 0 && p.push("- Chưa có chứng từ");
  for (const o of r.documents) {
    const S = o.type ? ((q = g[o.type]) == null ? void 0 : q.label) ?? o.type : "Chưa phân loại";
    p.push(`- ${o.id}: ${S} (${o.name}${o.issued_date ? `, lập ${re(o.issued_date)}` : ""})${o.summary ? ` — ${o.summary}` : ""}`);
  }
  const f = (a.policy_checks ?? []).filter((o) => o.status === "not_met");
  if (f.length > 0) {
    p.push("", "3. LƯU Ý ĐIỀU KIỆN CHÍNH SÁCH SƠ BỘ");
    for (const o of f)
      p.push(`- ${o.label}: thực tế ${Le(o.fact, o.actual)}, yêu cầu ${o.op} ${Le(o.fact, o.threshold)} (${o.clause})`);
  }
  const v = a.items.filter((o) => o.status === "waived");
  if (v.length > 0) {
    p.push("", "4. CÁC HẠNG MỤC XIN MIỄN / BỔ SUNG SAU KÈM GIẢI TRÌNH");
    for (const o of v)
      p.push(`- ${o.title}: ${o.note || "Không có ghi chú"}`);
  }
  const b = a.items.filter((o) => o.blocking && (o.status === "open" || o.status === "requested"));
  if (b.length > 0) {
    p.push("", "5. CÁC HẠNG MỤC CHẶN CHƯA ĐẠT (TRÌNH KÈM GIẢI TRÌNH)");
    for (const o of b)
      p.push(`- ${o.title} (${Tt[o.status].label}${o.due_date ? `, hạn ${re(o.due_date)}` : ""})`);
  }
  return p.join(`
`);
}
const Ve = "sme-sales:intake-id", Ue = "kirocrew_prefill", pt = "Tạo hồ sơ mới cho khách hàng: ", gt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function yn() {
  try {
    const t = sessionStorage.getItem(Ve);
    if (t) return t;
    const s = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(Ve, s), s;
  } catch {
    return "intake-default";
  }
}
function kn(t) {
  try {
    sessionStorage.setItem(Ve, t);
  } catch {
  }
}
function ve(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function Ee(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function He(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const r = t.value.length;
    t.setSelectionRange(r, r);
    return;
  }
  const s = window.getSelection();
  s && (s.selectAllChildren(t), s.collapseToEnd());
}
function ft(t, s) {
  const r = Date.now();
  try {
    sessionStorage.setItem(Ue, JSON.stringify({ slotKey: t, prompt: s, ts: r }));
  } catch {
  }
  return r;
}
function wn({
  width: t,
  onWidthChange: s,
  onClose: r,
  caseId: a,
  customerName: g,
  readOnly: h = !1,
  hasOpenItems: x = !1,
  intent: p,
  onConsumeIntent: f,
  createdCase: v,
  onOpenCase: b,
  onDismissCreatedCase: _,
  onQuickDraft: N
}) {
  const q = Ke, o = q.ChatPanel, S = q.ChatEmbed, m = Ke.useChatLauncher(), E = gn(Xe, je), [B, j] = y(yn), I = a ?? B, K = je + gt(I), T = X(() => a ? g ? `Hồ sơ ${g} (${a})` : `Hồ sơ ${a}` : "Hồ sơ SME mới", [a, g]), [z, V] = y(null), [O, F] = y(null), H = te(null);
  H.current = z, Z(() => {
    let k = !1;
    F(null);
    const w = H.current === K, $ = m.createChat;
    if (!$) {
      w || V(K);
      return;
    }
    return w || V(null), $({ slotKey: K, agent: Xe, title: T }).then((R) => {
      if (k) return;
      const W = R || K;
      H.current !== W && V(W);
    }).catch((R) => {
      k || w || F(Se(R));
    }), () => {
      k = !0;
    };
  }, [K, T, m]);
  const P = te(null), ne = te(0), l = te(null), u = te(!1), [A, U] = y(0), c = Q((k, w) => {
    const $ = w.trim();
    if (!$) return;
    const R = ve(P.current);
    if (H.current === k && R) {
      Ee(R).trim().includes($) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: w } })), requestAnimationFrame(() => He(ve(P.current)));
      return;
    }
    const W = ft(k, w);
    l.current = { slotKey: k, prompt: w, ts: W }, U((Ne) => Ne + 1);
  }, []);
  Z(() => {
    const k = l.current;
    if (!k || z !== k.slotKey) return;
    let w = 0, $ = 0;
    const R = window.setInterval(() => {
      w += 1;
      const W = ve(P.current);
      if (!W) {
        w >= 20 && (window.clearInterval(R), l.current = null);
        return;
      }
      if (Ee(W).trim().includes(k.prompt.trim())) {
        l.current = null, window.clearInterval(R), He(W);
        return;
      }
      if ($ += 1, $ >= 3) {
        try {
          const oe = sessionStorage.getItem(Ue);
          if (oe) {
            const qe = JSON.parse(oe);
            qe.slotKey === k.slotKey && qe.ts === k.ts && sessionStorage.removeItem(Ue);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: k.prompt } })), l.current = null, window.clearInterval(R), requestAnimationFrame(() => He(ve(P.current)));
      }
    }, 60);
    return () => window.clearInterval(R);
  }, [z, A]), Z(() => {
    if (!u.current || !z) return;
    let k = 0;
    const w = () => {
      var W;
      const R = (W = P.current) == null ? void 0 : W.querySelector('input[type="file"]');
      return R ? (u.current = !1, R.click(), !0) : !1;
    };
    if (w()) return;
    const $ = window.setInterval(() => {
      k += 1, (w() || k >= 16) && (u.current = !1, window.clearInterval($));
    }, 50);
    return () => window.clearInterval($);
  }, [z, A]);
  const L = Q((k) => {
    const w = `intake-${Date.now().toString(36)}`, $ = je + gt(w);
    if (kn(w), _(), k) {
      const R = ft($, k);
      l.current = { slotKey: $, prompt: k, ts: R }, U((W) => W + 1);
    }
    j(w);
  }, [_]);
  Z(() => {
    var k;
    if (!(!p || p.id === ne.current)) {
      if (ne.current = p.id, p.mode === "new_intake") {
        const w = ve(P.current), $ = Ee(w).trim();
        a === null && $ === pt.trim() && w ? He(w) : L(p.prompt || pt), f();
        return;
      }
      if (p.mode === "attach") {
        const w = ve(P.current);
        a && !Ee(w).trim() && c(K, `Tôi gửi chứng từ bổ sung cho hồ sơ ${a}: `);
        const $ = (k = P.current) == null ? void 0 : k.querySelector('input[type="file"]');
        $ ? (u.current = !1, $.click()) : (u.current = !0, U((R) => R + 1)), f();
        return;
      }
      c(K, p.prompt), f();
    }
  }, [p, a, K, f, c, L]);
  const [ee, ue] = y(!1), G = te(null), pe = (k) => {
    k.preventDefault(), k.currentTarget.setPointerCapture(k.pointerId), G.current = { startX: k.clientX, startW: t, pointerId: k.pointerId }, ue(!0);
  }, D = (k) => {
    const w = G.current;
    if (!w || w.pointerId !== k.pointerId) return;
    const $ = Math.min(620, Math.max(360, Math.round(w.startW + (w.startX - k.clientX))));
    s($);
  }, d = (k) => {
    var w;
    ((w = G.current) == null ? void 0 : w.pointerId) === k.pointerId && (G.current = null, ue(!1));
  };
  return /* @__PURE__ */ n("aside", { ref: P, className: "ss-coach-dock", style: { width: t }, "aria-label": "Trợ lý hồ sơ SME", children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `ss-coach-resizer ${ee ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: pe,
        onPointerMove: D,
        onPointerUp: d,
        onPointerCancel: d
      }
    ),
    /* @__PURE__ */ n("header", { className: "ss-coach-head", children: [
      /* @__PURE__ */ n("div", { className: "ss-head-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e(we, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          a ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: a }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: "Trợ lý hồ sơ" })
        ] }),
        /* @__PURE__ */ n("div", { className: "ss-head-chips", children: [
          a && !h && /* @__PURE__ */ n(me, { children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "ss-quick-chip",
                onClick: () => c(K, `Cập nhật thông tin hồ sơ ${a}: `),
                children: "Cập nhật"
              }
            ),
            x && N && /* @__PURE__ */ e("button", { type: "button", className: "ss-quick-chip", onClick: N, children: "Soạn thư" }),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "ss-quick-chip",
                onClick: () => c(K, `Rà soát các hạng mục chặn và điều kiện chính sách còn thiếu của hồ sơ ${a}, đề xuất phương án xử lý.`),
                children: "Rà soát"
              }
            )
          ] }),
          !a && /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "ss-quick-chip",
              onClick: () => c(K, "Rà soát danh sách hồ sơ đang mở hôm nay, nêu các hồ sơ quá hạn hoặc sắp đủ điều kiện trình."),
              children: "Việc hôm nay"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        !a && /* @__PURE__ */ e("button", { type: "button", className: "ss-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => L(), children: /* @__PURE__ */ e(Oe, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ss-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => E("", I, T),
            children: /* @__PURE__ */ e(Fe, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "ss-icon-btn", title: "Thu gọn trợ lý", onClick: r, children: /* @__PURE__ */ e(Ft, { size: 15 }) })
      ] })
    ] }),
    !a && v && /* @__PURE__ */ n("div", { className: "ss-coach-new-banner", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: v.name }),
        " ",
        /* @__PURE__ */ n("span", { className: "sme-mono", children: [
          "(",
          v.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ n(C, { primary: !0, onClick: () => b(v.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(Xt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ss-coach-body", children: O ? /* @__PURE__ */ e("div", { className: "ss-coach-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: O }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(C, { onClick: () => E("", I, T), children: [
        /* @__PURE__ */ e(Fe, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : z ? o ? /* @__PURE__ */ e(o, { slotKey: z, conversationOnly: !0 }, z) : S ? /* @__PURE__ */ e(
      S,
      {
        slotKey: z,
        agent: Xe,
        frameless: !0,
        startAtBottom: !0,
        placeholder: a ? `Nhắn trợ lý hoặc kéo chứng từ vào cho ${a}...` : "Kể về khách hàng mới hoặc kéo bộ chứng từ vào đây..."
      },
      z
    ) : /* @__PURE__ */ e("div", { className: "ss-coach-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(C, { primary: !0, onClick: () => E("", I, T), children: [
        /* @__PURE__ */ e(Fe, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "ss-coach-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const ie = (t) => `t-${t}`;
function J({ t, children: s, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${ie(t)}`, title: r, children: s });
}
function ae({ icon: t, label: s, value: r, hint: a, t: g = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${ie(g)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      a && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: a })
    ] })
  ] });
}
function he({ icon: t, title: s, hint: r, action: a }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    a && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: a })
  ] });
}
function bt({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${ie(t)}`, children: [
    /* @__PURE__ */ e(jt, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function qt(t) {
  if (t.stage === "submitted") return { label: "Đã bàn giao", t: "info" };
  if (t.overdue > 0) return { label: `${t.overdue} quá hạn`, t: "danger" };
  if (t.ready) return { label: "Đủ điều kiện trình", t: "ok" };
  const s = t.actionable_blocking ?? t.blocking_open;
  return s > 0 ? { label: `Thiếu ${s} mục chặn`, t: "warn" } : t.requested > 0 ? { label: `Chờ KH (${t.requested})`, t: "info" } : { label: "Khởi tạo", t: "muted" };
}
function It(t) {
  let s = 0, r = 0;
  for (const a of t.groups)
    s += a.done, r += a.total;
  return { done: s, total: r };
}
function Nn({ rows: t, onOpen: s }) {
  return t.length === 0 ? /* @__PURE__ */ e(he, { icon: /* @__PURE__ */ e(wt, { size: 28 }), title: "Không có hồ sơ phù hợp" }) : /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
    /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
      /* @__PURE__ */ e("th", { children: "Mã hồ sơ" }),
      /* @__PURE__ */ e("th", { children: "Doanh nghiệp & MST" }),
      /* @__PURE__ */ e("th", { children: "Sản phẩm" }),
      /* @__PURE__ */ e("th", { className: "sme-num", children: "Số tiền đề nghị" }),
      /* @__PURE__ */ e("th", { className: "sme-num", children: "Kỳ hạn" }),
      /* @__PURE__ */ e("th", { className: "sme-num", children: "Hạng mục đạt" }),
      /* @__PURE__ */ e("th", { children: "Cần xử lý / Chờ KH" }),
      /* @__PURE__ */ e("th", { children: "Trạng thái" }),
      /* @__PURE__ */ e("th", { children: "Cập nhật" })
    ] }) }),
    /* @__PURE__ */ e("tbody", { children: t.map((r) => {
      const a = qt(r), { done: g, total: h } = It(r), x = r.actionable_blocking ?? r.blocking_open;
      return /* @__PURE__ */ n("tr", { className: "click", onClick: () => s(r.case_id), children: [
        /* @__PURE__ */ e("td", { className: "sme-mono", style: { whiteSpace: "nowrap" }, children: r.case_id }),
        /* @__PURE__ */ n("td", { children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: r.customer_name || "Chưa có tên doanh nghiệp" }),
          /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
            r.tax_id ? `MST ${r.tax_id}` : "Chưa có MST",
            " · Luồng ",
            r.flow
          ] })
        ] }),
        /* @__PURE__ */ e("td", { children: r.product_code || /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
        /* @__PURE__ */ e("td", { className: "sme-num sme-strong", children: Qe(r.amount) }),
        /* @__PURE__ */ e("td", { className: "sme-num", children: r.term_months ? `${r.term_months} tháng` : "—" }),
        /* @__PURE__ */ n("td", { className: "sme-num sme-mono", children: [
          g,
          "/",
          h
        ] }),
        /* @__PURE__ */ n("td", { className: "sme-small", children: [
          x > 0 && /* @__PURE__ */ n("span", { children: [
            x,
            " cần xử lý"
          ] }),
          x > 0 && r.requested > 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: " · " }),
          r.requested > 0 && /* @__PURE__ */ n("span", { className: "sme-muted", children: [
            r.requested,
            " chờ KH",
            r.next_due_date ? ` (hạn ${re(r.next_due_date)})` : ""
          ] }),
          x === 0 && r.requested === 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" })
        ] }),
        /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(J, { t: a.t, children: a.label }) }),
        /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: $t(r.updated_at) })
      ] }, r.case_id);
    }) })
  ] }) });
}
const xt = ({ stage: t }) => /* @__PURE__ */ e(J, { t: ut[t].tone, children: ut[t].label });
function Et(t) {
  return t.done === t.total && t.total > 0 ? "ok" : t.blocked > 0 ? "danger" : t.done > 0 ? "warn" : "muted";
}
function Cn({ g: t, size: s = 12 }) {
  return t.done === t.total && t.total > 0 ? /* @__PURE__ */ e(Nt, { size: s }) : t.blocked > 0 ? /* @__PURE__ */ e(Vt, { size: s }) : t.done > 0 ? /* @__PURE__ */ e(Ut, { size: s }) : /* @__PURE__ */ e(Wt, { size: s });
}
function _n({ groups: t, activeGroup: s, onSelectGroup: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: t.map((a) => {
    const g = Et(a), h = s === a.group;
    return /* @__PURE__ */ n("div", { className: "sme-phase", children: [
      /* @__PURE__ */ e("span", { className: "sme-phase-name", children: a.label }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${ie(g)} ${h ? "ss-active-node" : ""}`,
          title: `${a.label}: ${a.done}/${a.total} hạng mục đạt${a.blocked ? `, ${a.blocked} chặn` : ""}`,
          onClick: () => r(h ? null : a.group),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(Cn, { g: a }) }),
            /* @__PURE__ */ n("span", { children: [
              a.done,
              "/",
              a.total,
              " hạng mục",
              h ? " · lọc" : ""
            ] })
          ]
        }
      )
    ] }, a.group);
  }) }) });
}
const Sn = [2, 3, 5, 7];
function et({ label: t = "Hạn cam kết bổ sung", confirmLabel: s = "Xác nhận", busy: r, onConfirm: a, onCancel: g }) {
  const [h, x] = y(() => ht(3));
  return /* @__PURE__ */ n("div", { className: "ss-due-row", children: [
    /* @__PURE__ */ n("span", { className: "sme-small sme-muted sme-row", style: { gap: 5 }, children: [
      /* @__PURE__ */ e(Ot, { size: 13 }),
      " ",
      t,
      ":"
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-filters", role: "group", "aria-label": "Chọn nhanh số ngày", children: Sn.map((p) => {
      const f = ht(p);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-filter ${h === f ? "on" : ""}`,
          onClick: () => x(f),
          children: [
            "+",
            p,
            " ngày"
          ]
        },
        p
      );
    }) }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "date",
        className: "sme-input",
        style: { width: 148, padding: "4px 8px", fontSize: 12 },
        value: h,
        onChange: (p) => x(p.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 6, marginLeft: "auto" }, children: [
      g && /* @__PURE__ */ e(C, { onClick: g, children: "Huỷ" }),
      /* @__PURE__ */ e(C, { primary: !0, busy: r, disabled: !h, onClick: () => a(h), children: s })
    ] })
  ] });
}
function Ht({ onPick: t }) {
  return /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: ["email", "zalo", "phone_script"].map((s) => /* @__PURE__ */ n(C, { onClick: () => t(s), children: [
    /* @__PURE__ */ e(We, { size: 13 }),
    " ",
    Je[s]
  ] }, s)) });
}
const $n = `
.ss-active-node { font-weight: 600; color: var(--accent); }
.ss-check { width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer; vertical-align: middle; }
.ss-inline-panel td { background: color-mix(in srgb, var(--muted) 4%, transparent); padding: 10px 12px; }
.ss-due-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 10px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg-elevated, var(--bg)); margin-top: 8px; }
.ss-kv { display: grid; grid-template-columns: minmax(120px, 38%) 1fr; gap: 6px 14px; font-size: 13px; margin: 0; }
.ss-kv dt { color: var(--muted); }
.ss-kv dd { margin: 0; color: var(--text); word-break: break-word; }
.ss-bulk { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; margin-bottom: 10px;
  border: 1px solid var(--border); background: color-mix(in srgb, var(--accent) 6%, transparent); }

/* Split workspace with collapsible right-hand assistant panel */
.ss-workspace { display: flex; flex: 1; min-height: 0; height: 100%; overflow: hidden; position: relative; }
.ss-main { flex: 1; min-width: 0; min-height: 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; container-type: inline-size; }
@container (max-width: 1020px) {
  .sme-detail { grid-template-columns: minmax(0, 1fr); }
  .sme-aside { position: static; }
}
@container (max-width: 680px) {
  .sme-hero { grid-template-columns: minmax(0, 1fr); gap: 10px; }
}

.ss-toggle-on { border-color: color-mix(in srgb, var(--accent) 55%, var(--border)) !important;
  background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
  color: var(--text-strong, var(--text)) !important; font-weight: 600; }

.ss-coach-dock { position: relative; flex: none; height: 100%; min-height: 0; display: flex; flex-direction: column;
  background: var(--card); border-left: 1px solid var(--border); }
.ss-coach-resizer { position: absolute; left: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 5;
  background: transparent; transition: background .15s; touch-action: none; }
.ss-coach-resizer:hover, .ss-coach-resizer.dragging { background: color-mix(in srgb, var(--accent) 35%, transparent); }

.ss-coach-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-height: 38px;
  padding: 5px 8px 5px 12px; border-bottom: 1px solid var(--border); background: var(--card); flex: none; }
.ss-head-left { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; }
.ss-head-chips { display: flex; align-items: center; gap: 5px; overflow-x: auto; scrollbar-width: none; min-width: 0; }
.ss-head-chips::-webkit-scrollbar { display: none; }
.ss-icon-btn { width: 28px; height: 28px; display: inline-grid; place-items: center; border-radius: 6px;
  border: 1px solid transparent; background: transparent; color: var(--muted); cursor: pointer; flex: none; }
.ss-icon-btn:hover { color: var(--text); background: var(--bg-hover, color-mix(in srgb, var(--muted) 12%, transparent));
  border-color: var(--border); }

.ss-coach-new-banner { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px;
  border-bottom: 1px solid var(--border); font-size: 12px; flex: none;
  background: color-mix(in srgb, var(--ok) 10%, var(--card)); }
.ss-coach-body { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
.ss-coach-fallback { padding: 16px; display: flex; flex-direction: column; gap: 10px; }

.ss-quick-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--bg-elevated, var(--bg)); color: var(--text); font-size: 11.5px;
  white-space: nowrap; cursor: pointer; flex: none; }
.ss-quick-chip:hover { border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--card)); }

@media (max-width: 920px) {
  .ss-coach-dock { position: absolute; right: 0; top: 0; bottom: 0; width: min(440px, 100%) !important;
    z-index: 30; box-shadow: -8px 0 24px rgba(0, 0, 0, .14); }
  .ss-coach-resizer { display: none; }
}
`;
function Tn() {
  const t = "sme-sales-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = $n, document.head.appendChild(s);
}
const Dt = "sme-sales:view", zn = () => {
  try {
    return localStorage.getItem(Dt) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
};
function qn({ r: t, onOpen: s }) {
  const r = qt(t), { done: a, total: g } = It(t);
  return /* @__PURE__ */ n(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: s,
      onKeyDown: (h) => {
        (h.key === "Enter" || h.key === " ") && (h.preventDefault(), s());
      },
      children: [
        /* @__PURE__ */ n("div", { className: "sme-between", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.customer_name || "Chưa có tên doanh nghiệp" }),
            /* @__PURE__ */ n("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: [
              t.case_id,
              t.tax_id ? ` · MST ${t.tax_id}` : ""
            ] })
          ] }),
          /* @__PURE__ */ e(J, { t: r.t, children: r.label })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: Qe(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.product_code, t.term_months ? `${t.term_months} tháng` : null, t.purpose ? Ye[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${a}/${g} hạng mục đạt`, children: t.groups.map((h) => {
          const x = Et(h);
          return /* @__PURE__ */ e(
            "span",
            {
              className: x === "muted" ? "none" : ie(x),
              title: `${h.label}: ${h.done}/${h.total} hạng mục`
            },
            h.group
          );
        }) }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ n("span", { className: "sme-row", style: { gap: 6 }, children: [
            /* @__PURE__ */ n("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            /* @__PURE__ */ n("span", { className: "sme-mono", children: [
              a,
              "/",
              g,
              " mục"
            ] }),
            (t.policy_breaches ?? 0) > 0 && /* @__PURE__ */ n(J, { t: "danger", children: [
              t.policy_breaches,
              " lệch chuẩn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            $t(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function In({
  onOpen: t,
  catalog: s,
  coachOpen: r,
  syncTick: a,
  onToggleCoach: g,
  onAskCoach: h,
  onCreatedCase: x
}) {
  const p = vt(), [f, v] = y(null), [b, _] = y(null), [N, q] = y(null), [o, S] = y(!1), [m, E] = y("all"), [B, j] = y(""), [I, K] = y(zn), T = te(0), z = te(!1), V = te(null), O = (l) => {
    K(l);
    try {
      localStorage.setItem(Dt, l);
    } catch {
    }
  }, F = Q(async (l = !1) => {
    if (!(l && z.current)) {
      l ? z.current = !0 : S(!0);
      try {
        const u = await p.get(`${$e}/cases`);
        if (V.current === null)
          V.current = new Set(u.cases.map((A) => A.case_id));
        else {
          const A = u.cases.find((U) => !V.current.has(U.case_id));
          u.cases.forEach((U) => V.current.add(U.case_id)), A && x({ caseId: A.case_id, name: A.customer_name || A.case_id });
        }
        v(u.cases), _(u.today), q(null), T.current = Date.now();
      } catch (u) {
        l || q(Se(u));
      } finally {
        l ? z.current = !1 : S(!1);
      }
    }
  }, [p, x]);
  Z(() => {
    F();
  }, [F]), Z(() => {
    a > 0 && F(!0);
  }, [a, F]), Z(() => {
    const l = () => {
      document.visibilityState !== "hidden" && Date.now() - T.current >= 3e3 && F(!0);
    };
    return window.addEventListener("focus", l), document.addEventListener("visibilitychange", l), () => {
      window.removeEventListener("focus", l), document.removeEventListener("visibilitychange", l);
    };
  }, [F]);
  const H = X(() => {
    const l = f ?? [], u = l.filter((G) => G.stage !== "submitted"), A = l.length - u.length, U = u.filter((G) => G.ready).length, c = u.filter((G) => (G.actionable_blocking ?? G.blocking_open) > 0 || (G.unclassified_docs ?? 0) > 0).length, L = u.reduce((G, pe) => G + (pe.actionable_blocking ?? pe.blocking_open), 0), ee = u.filter((G) => G.requested > 0 && G.overdue === 0).length, ue = u.filter((G) => G.overdue > 0).length;
    return { live: u.length, submitted: A, ready: U, actionNeeded: c, actionableItems: L, waitingCases: ee, overdueCases: ue };
  }, [f]), P = X(() => {
    const l = B.trim().toLowerCase();
    return (f ?? []).filter((u) => m === "submitted" && u.stage !== "submitted" || m !== "submitted" && m !== "all" && u.stage === "submitted" || m === "action" && (u.actionable_blocking ?? u.blocking_open) === 0 && (u.unclassified_docs ?? 0) === 0 || m === "waiting" && u.requested === 0 || m === "overdue" && u.overdue === 0 || m === "ready" && !u.ready ? !1 : l ? [u.customer_name, u.case_id, u.tax_id, u.product_code].some((A) => A == null ? void 0 : A.toLowerCase().includes(l)) : !0);
  }, [f, m, B]), ne = () => h("Tạo hồ sơ mới cho khách hàng: ", "new_intake");
  return /* @__PURE__ */ n(me, { children: [
    /* @__PURE__ */ e(
      Gt,
      {
        title: "Hoàn thiện hồ sơ Tín dụng SME",
        subtitle: "Quản lý danh mục hồ sơ ĐVKD, kiểm soát chứng từ bắt buộc, đối chiếu điều kiện sơ bộ và bàn giao Thẩm định",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(C, { onClick: () => F(), busy: o, children: [
            /* @__PURE__ */ e(Ct, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            C,
            {
              className: r ? "ss-toggle-on" : void 0,
              "aria-pressed": r,
              onClick: g,
              title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
              children: [
                /* @__PURE__ */ e(we, { size: 14 }),
                " Trợ lý hồ sơ"
              ]
            }
          ),
          /* @__PURE__ */ n(C, { primary: !0, onClick: ne, children: [
            /* @__PURE__ */ e(Oe, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      N && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(kt, { title: "Không tải được danh sách hồ sơ", children: N }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(
          ae,
          {
            icon: /* @__PURE__ */ e(ct, { size: 18 }),
            label: "Hồ sơ đang thu thập",
            value: f ? H.live : "…",
            hint: f ? `${H.submitted} hồ sơ đã bàn giao` : void 0
          }
        ),
        /* @__PURE__ */ e(
          ae,
          {
            t: H.ready ? "ok" : "muted",
            icon: /* @__PURE__ */ e(_e, { size: 18 }),
            label: "Đủ điều kiện trình",
            value: f ? H.ready : "…",
            hint: "Hoàn tất mục bắt buộc"
          }
        ),
        /* @__PURE__ */ e(
          ae,
          {
            t: H.actionNeeded ? "warn" : "ok",
            icon: /* @__PURE__ */ e(Yt, { size: 18 }),
            label: "Cần ĐVKD xử lý",
            value: f ? H.actionNeeded : "…",
            hint: f ? `${H.actionableItems} mục chặn chưa yêu cầu` : void 0
          }
        ),
        /* @__PURE__ */ e(
          ae,
          {
            t: H.overdueCases ? "danger" : H.waitingCases ? "info" : "muted",
            icon: /* @__PURE__ */ e(Qt, { size: 18 }),
            label: "Chờ khách hàng",
            value: b ? b.waiting : "…",
            hint: f ? H.overdueCases ? `${H.overdueCases} hồ sơ quá hạn cam kết` : `${H.waitingCases} hồ sơ đang theo dõi` : void 0
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hồ sơ", children: [
          ["all", "Tất cả"],
          ["action", "Cần xử lý"],
          ["waiting", "Chờ khách"],
          ["overdue", "Quá hạn"],
          ["ready", "Đủ điều kiện"],
          ["submitted", "Đã bàn giao"]
        ].map(([l, u]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": m === l,
            className: `sme-filter ${m === l ? "on" : ""}`,
            onClick: () => E(l),
            children: u
          },
          l
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ n("div", { className: "sme-filters", role: "tablist", "aria-label": "Chế độ hiển thị", children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": I === "cards",
                className: `sme-filter ${I === "cards" ? "on" : ""}`,
                onClick: () => O("cards"),
                children: "Thẻ hồ sơ"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": I === "table",
                className: `sme-filter ${I === "table" ? "on" : ""}`,
                onClick: () => O("table"),
                children: "Bảng danh mục"
              }
            )
          ] }),
          /* @__PURE__ */ n("label", { className: "sme-search", children: [
            /* @__PURE__ */ e(dt, { size: 14, className: "sme-muted" }),
            /* @__PURE__ */ e("input", { value: B, onChange: (l) => j(l.target.value), placeholder: "Tìm doanh nghiệp, MST, mã hồ sơ, sản phẩm" })
          ] })
        ] })
      ] }),
      f === null && !N && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((l) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, l)) }),
      f && f.length === 0 && /* @__PURE__ */ e(
        he,
        {
          icon: /* @__PURE__ */ e(ct, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Khởi tạo hồ sơ với trợ lý trong chat: cung cấp thông tin khách hàng và đính kèm chứng từ.",
          action: /* @__PURE__ */ n(C, { primary: !0, onClick: ne, children: [
            /* @__PURE__ */ e(Oe, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      f && f.length > 0 && P.length === 0 && /* @__PURE__ */ e(he, { icon: /* @__PURE__ */ e(dt, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      P.length > 0 && I === "cards" && /* @__PURE__ */ e("div", { className: "sme-cases", children: P.map((l) => /* @__PURE__ */ e(qn, { r: l, onOpen: () => t(l.case_id) }, l.case_id)) }),
      P.length > 0 && I === "table" && /* @__PURE__ */ e(Nn, { rows: P, onOpen: t })
    ] })
  ] });
}
const De = [
  ["blocked", "Cần bổ sung", (t) => t.status === "open" && t.blocking],
  ["waiting", "Chờ khách", (t) => t.status === "requested"],
  ["advisory", "Khuyến nghị", (t) => t.status === "open" && !t.blocking],
  ["done", "Đã đạt / Miễn", (t) => ["ok", "resolved", "waived"].includes(t.status)],
  ["all", "Tất cả", () => !0]
];
function En({ it: t, asOf: s, groupLabel: r, checked: a, selectable: g, readOnly: h, onToggle: x, onSet: p, onOpenDoc: f }) {
  const [v, b] = y("none"), [_, N] = y(""), [q, o] = y(!1), [S, m] = y(!1), E = Tt[t.status], B = t.status === "open", j = t.status === "requested" && !!t.due_date && t.due_date < s, I = async (T, z) => {
    o(!0), await p(t.key, T, _, z) && (b("none"), N("")), o(!1);
  }, K = async () => {
    t.ask && await Ze(t.ask) && (m(!0), setTimeout(() => m(!1), 1500));
  };
  return /* @__PURE__ */ n(yt, { children: [
    /* @__PURE__ */ n("tr", { children: [
      !h && /* @__PURE__ */ e("td", { style: { width: 28 }, children: g && /* @__PURE__ */ e(
        "input",
        {
          type: "checkbox",
          className: "ss-check",
          checked: a,
          onChange: x,
          "aria-label": `Chọn ${t.title}`
        }
      ) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: t.title }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
          r,
          t.reason ? ` · ${t.reason}` : ""
        ] }),
        (B || t.status === "requested") && t.ask && /* @__PURE__ */ n("div", { className: "sme-item-ask sme-between", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ e("b", { children: "Nội dung yêu cầu KH:" }),
            " ",
            t.ask
          ] }),
          /* @__PURE__ */ n(C, { onClick: K, title: "Sao chép nội dung yêu cầu", children: [
            S ? /* @__PURE__ */ e(Me, { size: 12 }) : /* @__PURE__ */ e(Ae, { size: 12 }),
            " ",
            S ? "Đã chép" : "Chép"
          ] })
        ] }),
        (B || t.status === "requested") && t.alternatives.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Chứng từ thay thế: ",
          t.alternatives.join("; ")
        ] })
      ] }),
      /* @__PURE__ */ e("td", { children: t.document_refs.length > 0 ? /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: t.document_refs.map((T) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: () => f(T), children: T }, T)) }) : /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: [
          /* @__PURE__ */ e(J, { t: E.tone, children: E.label }),
          t.blocking && (B || t.status === "requested") && /* @__PURE__ */ e(J, { t: "danger", children: "Bắt buộc" }),
          j && /* @__PURE__ */ n(J, { t: "danger", children: [
            "Quá hạn (",
            re(t.due_date),
            ")"
          ] })
        ] }),
        t.status === "requested" && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Đã yêu cầu ",
          re(t.requested_at),
          t.due_date ? ` · hạn ${re(t.due_date)}` : ""
        ] }),
        t.status === "waived" && t.note && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Lý do: ",
          t.note
        ] })
      ] }),
      !h && /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
        B && t.ask && /* @__PURE__ */ n(C, { busy: q, onClick: () => b(v === "request" ? "none" : "request"), title: "Đánh dấu đã yêu cầu khách", children: [
          /* @__PURE__ */ e(_t, { size: 13 }),
          " Đã yêu cầu"
        ] }),
        B && t.kind !== "policy_precheck" && /* @__PURE__ */ n(
          C,
          {
            onClick: () => {
              b(v === "waive" ? "none" : "waive"), v === "waive" && N("");
            },
            title: "Xin miễn / bổ sung sau",
            children: [
              /* @__PURE__ */ e(Jt, { size: 13 }),
              " Xin miễn"
            ]
          }
        ),
        (t.status === "waived" || t.status === "requested") && /* @__PURE__ */ n(C, { busy: q, onClick: () => I("open"), title: "Mở lại hạng mục", children: [
          /* @__PURE__ */ e(en, { size: 13 }),
          " Mở lại"
        ] })
      ] }) })
    ] }),
    !h && v === "request" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ e(
      et,
      {
        label: "Hạn khách hàng bổ sung",
        confirmLabel: "Xác nhận đã yêu cầu",
        busy: q,
        onCancel: () => b("none"),
        onConfirm: (T) => I("requested", T)
      }
    ) }) }),
    !h && v === "waive" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ n("div", { className: "sme-stack", style: { gap: 8 }, children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          className: "sme-textarea",
          value: _,
          onChange: (T) => N(T.target.value),
          placeholder: "Ghi rõ căn cứ xin miễn hoặc cam kết bổ sung sau (đi kèm phiếu bàn giao Thẩm định)"
        }
      ),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ e(C, { onClick: () => {
          b("none"), N("");
        }, children: "Huỷ" }),
        /* @__PURE__ */ e(C, { primary: !0, busy: q, disabled: !_.trim(), onClick: () => I("waived"), children: "Xác nhận xin miễn" })
      ] })
    ] }) }) })
  ] });
}
function Hn({
  items: t,
  asOf: s,
  catalog: r,
  groupFilter: a,
  onClearGroup: g,
  readOnly: h,
  onSet: x,
  onBatchRequested: p,
  onDraft: f,
  onOpenDoc: v
}) {
  var U;
  const b = X(() => a ? t.filter((c) => c.group === a) : t, [t, a]), _ = Object.fromEntries(De.map(([c, , L]) => [c, b.filter(L).length])), N = ((U = De.find(([c]) => c !== "all" && _[c] > 0)) == null ? void 0 : U[0]) ?? "done", [q, o] = y(null), S = q ?? N, m = b.filter(De.find(([c]) => c === S)[2]), [E, B] = y(/* @__PURE__ */ new Set()), [j, I] = y(!1), [K, T] = y(!1), z = X(() => m.filter((c) => c.status === "open" || c.status === "requested"), [m]), V = X(() => new Set(b.filter((c) => c.status === "open" || c.status === "requested").map((c) => c.key)), [b]), O = X(() => [...E].filter((c) => V.has(c)), [E, V]), F = (c) => {
    B((L) => {
      const ee = new Set(L);
      return ee.has(c) ? ee.delete(c) : ee.add(c), ee;
    });
  }, H = z.length > 0 && z.every((c) => E.has(c.key)), P = () => {
    B((c) => {
      const L = new Set(c);
      return H ? z.forEach((ee) => L.delete(ee.key)) : z.forEach((ee) => L.add(ee.key)), L;
    });
  }, ne = async (c) => {
    T(!0), await p(O, c) && (B(/* @__PURE__ */ new Set()), I(!1)), T(!1);
  }, l = (r == null ? void 0 : r.documents.groups) ?? {}, u = b.filter((c) => O.includes(c.key)), A = u.length > 0 && u.every((c) => c.status === "requested");
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hạng mục", children: De.map(([c, L]) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": S === c,
          className: `sme-filter ${S === c ? "on" : ""}`,
          onClick: () => o(c),
          children: [
            L,
            " (",
            _[c],
            ")"
          ]
        },
        c
      )) }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        a && /* @__PURE__ */ n(C, { onClick: g, title: "Bỏ lọc nhóm", children: [
          "Nhóm: ",
          l[a] ?? a,
          " ",
          /* @__PURE__ */ e(Zt, { size: 12 })
        ] }),
        !h && z.length > 0 && /* @__PURE__ */ e(C, { onClick: P, children: H ? "Bỏ chọn" : `Chọn tất cả (${z.length})` })
      ] })
    ] }),
    !h && O.length > 0 && /* @__PURE__ */ n("div", { className: "ss-bulk", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
        /* @__PURE__ */ n("span", { className: "sme-strong sme-small", children: [
          "Đã chọn ",
          O.length,
          " hạng mục"
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e(Ht, { onPick: (c) => f(O, c, A) }),
          /* @__PURE__ */ n(C, { onClick: () => I((c) => !c), children: [
            /* @__PURE__ */ e(_t, { size: 13 }),
            " Đã yêu cầu"
          ] }),
          /* @__PURE__ */ e(C, { onClick: () => {
            B(/* @__PURE__ */ new Set()), I(!1);
          }, children: "Bỏ chọn" })
        ] })
      ] }),
      j && /* @__PURE__ */ e(
        et,
        {
          label: `Đặt hạn cho ${O.length} hạng mục`,
          confirmLabel: "Xác nhận đã yêu cầu",
          busy: K,
          onCancel: () => I(!1),
          onConfirm: ne
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: m.length === 0 ? /* @__PURE__ */ e(he, { icon: /* @__PURE__ */ e(Nt, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        !h && /* @__PURE__ */ e("th", { "aria-label": "Chọn", style: { width: 28 } }),
        /* @__PURE__ */ e("th", { children: "Hạng mục & Quy định" }),
        /* @__PURE__ */ e("th", { children: "Chứng từ" }),
        /* @__PURE__ */ e("th", { children: "Trạng thái" }),
        !h && /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: m.map((c) => /* @__PURE__ */ e(
        En,
        {
          it: c,
          asOf: s,
          groupLabel: l[c.group] ?? c.group,
          selectable: c.status === "open" || c.status === "requested",
          checked: E.has(c.key),
          readOnly: h,
          onToggle: () => F(c.key),
          onSet: x,
          onOpenDoc: v
        },
        c.key
      )) })
    ] }) })
  ] });
}
const Dn = {
  customer: "Pháp lý & Định danh",
  request: "Phương án đề xuất vay",
  facts: "Chỉ tiêu tài chính & TSBĐ"
}, Bn = {
  met: { label: "Đạt", t: "ok" },
  not_met: { label: "Không đạt", t: "danger" },
  missing: { label: "Thiếu dữ liệu", t: "warn" },
  na: { label: "Không áp dụng", t: "muted" }
};
function Kn({
  detail: t,
  catalog: s,
  pendingDraftsCount: r,
  purposeWarn: a,
  readOnly: g,
  goDrafts: h,
  onAction: x,
  onChat: p
}) {
  var q;
  const { case: f, overview: v } = t, b = [...new Set(v.profile.map((o) => o.section))], _ = v.policy_checks ?? [], N = _.some((o) => o.status === "not_met") || a && a.status === "open";
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    f.submitted && /* @__PURE__ */ n(bt, { t: "info", children: [
      "Hồ sơ đã bàn giao Thẩm định lúc ",
      /* @__PURE__ */ e("b", { children: ze(f.submitted.at) }),
      " bởi ",
      zt(f.submitted.by),
      f.submitted.note ? ` · Ghi chú: ${f.submitted.note}` : "",
      ". Dữ liệu ở chế độ chỉ đọc."
    ] }),
    !f.submitted && r > 0 && /* @__PURE__ */ n(bt, { t: "warn", children: [
      "Có ",
      /* @__PURE__ */ n("b", { children: [
        r,
        " thư nháp"
      ] }),
      " yêu cầu bổ sung đang chờ ĐVKD gửi khách hàng. Xem tại tab",
      " ",
      /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: h, children: "Thư yêu cầu KH" }),
      "."
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Thông tin khách hàng & Phương án đề xuất" }),
        !g && /* @__PURE__ */ n(C, { onClick: () => p(`Cập nhật thông tin hồ sơ ${f.case_id}: `), children: [
          /* @__PURE__ */ e(we, { size: 13 }),
          " Cập nhật qua trợ lý"
        ] })
      ] }),
      v.profile.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Chưa có dữ liệu định danh hoặc phương án vay. Trao đổi với trợ lý để ghi nhận hoặc trích xuất từ chứng từ." }) : /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 12 }, children: b.map((o) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 6 }, children: Dn[o] ?? o }),
        /* @__PURE__ */ e("dl", { className: "ss-kv", children: v.profile.filter((S) => S.section === o).map((S) => /* @__PURE__ */ n(yt, { children: [
          /* @__PURE__ */ e("dt", { children: S.label }),
          /* @__PURE__ */ e("dd", { children: Te(S.path, S.value, s) })
        ] }, S.path)) })
      ] }, o)) })
    ] }),
    (_.length > 0 || a) && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ n("h3", { className: "sme-h3", children: [
          "Điều kiện chính sách sơ bộ ",
          ((q = f.request) == null ? void 0 : q.product_code) ?? ""
        ] }),
        N ? /* @__PURE__ */ e(J, { t: "danger", children: "Có tiêu chí chưa đạt" }) : /* @__PURE__ */ e(J, { t: "ok", children: "Đạt điều kiện sơ bộ" })
      ] }),
      a && a.status === "open" && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8, color: "var(--danger)" }, children: [
        a.title,
        ": ",
        a.reason
      ] }),
      _.length > 0 && /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Điều kiện" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: _.map((o) => {
          const S = Bn[o.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              o.label,
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: o.clause })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-num", children: [
              o.op,
              " ",
              Le(o.fact, o.threshold)
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-num", children: Le(o.fact, o.actual) }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(J, { t: S.t, children: S.label }) })
          ] }, o.id);
        }) })
      ] }),
      N && !g && /* @__PURE__ */ e("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ n(C, { onClick: () => p(`Hồ sơ ${f.case_id} đang vướng điều kiện chính sách sơ bộ. Gợi ý các phương án cơ cấu lại đề xuất.`), children: [
        /* @__PURE__ */ e(we, { size: 13 }),
        " Đề xuất cơ cấu lại qua trợ lý"
      ] }) })
    ] }),
    v.actions.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: [
        "Hành động đề xuất (",
        v.actions.length,
        ")"
      ] }),
      v.actions.map((o) => /* @__PURE__ */ n("div", { className: `sme-finding ${ie(o.tone)}`, children: [
        /* @__PURE__ */ e("div", { className: "bar" }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-finding-topic", children: o.title }),
            o.detail.length > 0 && /* @__PURE__ */ e("div", { className: "sme-finding-text sme-muted", children: o.detail.slice(0, 4).join(" · ") })
          ] }),
          o.cta !== "none" && /* @__PURE__ */ e(C, { onClick: () => x(o), children: o.cta === "draft" ? /* @__PURE__ */ n(me, { children: [
            /* @__PURE__ */ e(We, { size: 13 }),
            " Soạn thư"
          ] }) : o.cta === "submit" ? /* @__PURE__ */ n(me, { children: [
            /* @__PURE__ */ e(_e, { size: 13 }),
            " Bàn giao"
          ] }) : /* @__PURE__ */ n(me, { children: [
            /* @__PURE__ */ e(we, { size: 13 }),
            " Trợ lý"
          ] }) })
        ] })
      ] }, o.id))
    ] })
  ] });
}
function Mn(t, s, r) {
  var x;
  if (!t.type) return { label: "Chưa phân loại", t: "warn" };
  const a = s.find((p) => p.key === `expired:${t.type}`);
  if (a) return a.status === "open" || a.status === "requested" ? { label: "Hết hiệu lực", t: "danger" } : { label: "Còn hiệu lực", t: "ok" };
  const g = s.find((p) => p.key === `date:${t.type}`);
  if (g && (g.status === "open" || g.status === "requested")) return { label: "Thiếu ngày lập", t: "warn" };
  const h = (x = r == null ? void 0 : r.documents.types[t.type]) == null ? void 0 : x.validity_months;
  return h ? { label: `Hiệu lực ${h} tháng`, t: "ok" } : { label: "Không giới hạn", t: "muted" };
}
function An({ docs: t, items: s, profile: r, catalog: a, focusDocId: g, readOnly: h, onDownload: x, onRemove: p, onExtractDoc: f, onUpload: v }) {
  const b = (a == null ? void 0 : a.documents.types) ?? {}, _ = new Set(r.map((m) => m.path)), [N, q] = y(null), [o, S] = y(null);
  return Z(() => {
    g && requestAnimationFrame(() => {
      var m;
      return (m = document.getElementById(`doc-${g}`)) == null ? void 0 : m.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [g]), t.length === 0 ? /* @__PURE__ */ e(
    he,
    {
      icon: /* @__PURE__ */ e(tn, { size: 30 }),
      title: "Chưa có chứng từ nào",
      hint: "Đính kèm PDF, ảnh chụp, Word hoặc Excel trong chat với trợ lý để phân loại và trích xuất thông tin.",
      action: h ? void 0 : /* @__PURE__ */ e(C, { primary: !0, onClick: v, children: "Gửi chứng từ cho trợ lý" })
    }
  ) : /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Tổng cộng ",
        t.length,
        " chứng từ đã tiếp nhận vào hồ sơ."
      ] }),
      !h && /* @__PURE__ */ e(C, { onClick: v, children: "Gửi bổ sung qua trợ lý" })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
        /* @__PURE__ */ e("th", { children: "Loại chứng từ & Tệp" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Ngày lập" }),
        /* @__PURE__ */ e("th", { children: "Hiệu lực" }),
        /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((m) => {
        const E = m.type ? b[m.type] : void 0, B = Mn(m, s, a), j = new Set(m.not_stated ?? []), I = ((E == null ? void 0 : E.extract) ?? []).filter((T) => !_.has(T) && !j.has(T)), K = o === m.id;
        return /* @__PURE__ */ n("tr", { id: `doc-${m.id}`, className: g === m.id ? "focus" : void 0, children: [
          /* @__PURE__ */ e("td", { className: "sme-mono", children: m.id }),
          /* @__PURE__ */ n("td", { children: [
            /* @__PURE__ */ e("div", { className: "sme-strong", children: (E == null ? void 0 : E.label) ?? (m.type || m.name) }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              m.name,
              m.size ? ` · ${Math.max(1, Math.round(m.size / 1024))} KB` : ""
            ] }),
            m.summary && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3 }, children: m.summary }),
            (!m.type || I.length > 0) && !h && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: "var(--warn)" }, children: m.type ? `Còn ${I.length} chỉ tiêu chưa trích xuất.` : "Chứng từ chưa được phân loại." })
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: m.issued_date ? re(m.issued_date) : "—" }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(J, { t: B.t, children: B.label }) }),
          /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
            m.file && /* @__PURE__ */ n(C, { busy: N === `dl:${m.id}`, onClick: async () => {
              q(`dl:${m.id}`), await x(m.id), q(null);
            }, children: [
              /\.(pdf|png|jpe?g|webp|txt)$/i.test(m.name) ? /* @__PURE__ */ e(nn, { size: 13 }) : /* @__PURE__ */ e(sn, { size: 13 }),
              " Xem / Tải"
            ] }),
            (!m.type || I.length > 0) && !h && /* @__PURE__ */ e(C, { onClick: () => f(m.id), children: "Đọc lại" }),
            !h && !K && /* @__PURE__ */ e(C, { onClick: () => S(m.id), title: "Gỡ chứng từ gửi nhầm", children: /* @__PURE__ */ e(rn, { size: 13 }) }),
            !h && K && /* @__PURE__ */ n(me, { children: [
              /* @__PURE__ */ e(C, { onClick: () => S(null), children: "Huỷ" }),
              /* @__PURE__ */ e(C, { primary: !0, busy: N === `rm:${m.id}`, onClick: async () => {
                q(`rm:${m.id}`), await p(m.id) && S(null), q(null);
              }, children: "Xác nhận gỡ" })
            ] })
          ] }) })
        ] }, m.id);
      }) })
    ] }) })
  ] });
}
function Ln({ d: t, items: s, readOnly: r, onSent: a }) {
  const [g, h] = y(!1), [x, p] = y(!1), f = async () => {
    await Ze(t.subject ? `${t.subject}

${t.body}` : t.body) && (h(!0), setTimeout(() => h(!1), 1500));
  };
  return /* @__PURE__ */ n("div", { className: `sme-card sme-review ${ie(t.status === "sent" ? "ok" : "warn")}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("span", { className: "sme-row", children: [
        /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: t.id }),
        /* @__PURE__ */ e(J, { t: "accent", children: Je[t.channel] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: ze(t.created_at) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(J, { t: t.status === "sent" ? "ok" : "warn", children: t.status === "sent" ? `Đã gửi ${re(t.sent_at)}` : "Chờ ĐVKD gửi" }),
        /* @__PURE__ */ n(C, { onClick: f, children: [
          g ? /* @__PURE__ */ e(Me, { size: 13 }) : /* @__PURE__ */ e(Ae, { size: 13 }),
          " ",
          g ? "Đã chép" : "Sao chép"
        ] })
      ] })
    ] }),
    t.subject && /* @__PURE__ */ e("div", { className: "sme-strong", style: { marginTop: 8 }, children: t.subject }),
    /* @__PURE__ */ e("pre", { className: "sme-pre", children: t.body }),
    t.requirement_keys.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: [
      "Hạng mục đính kèm: ",
      t.requirement_keys.map((v) => {
        var b;
        return ((b = s.get(v)) == null ? void 0 : b.title) ?? v;
      }).join("; ")
    ] }),
    t.status === "draft" && !r && /* @__PURE__ */ e(
      et,
      {
        label: "Hạn cam kết KH gửi",
        confirmLabel: "Tôi đã gửi",
        busy: x,
        onConfirm: async (v) => {
          p(!0), await a(t.id, v), p(!1);
        }
      }
    )
  ] });
}
function Rn({ drafts: t, items: s, readOnly: r, hasOpenItems: a, onSent: g, onCompose: h }) {
  const [x, p] = y("all"), f = new Map(s.map((_) => [_.key, _])), v = t.filter((_) => _.status === "draft").length, b = [...t].reverse().filter((_) => x === "all" || _.status === x);
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["all", `Tất cả (${t.length})`], ["draft", `Chờ gửi (${v})`], ["sent", `Đã gửi (${t.length - v})`]].map(([_, N]) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": x === _,
          className: `sme-filter ${x === _ ? "on" : ""}`,
          onClick: () => p(_),
          children: N
        },
        _
      )) }),
      !r && a && /* @__PURE__ */ e(Ht, { onPick: h })
    ] }),
    b.length === 0 && /* @__PURE__ */ e(
      he,
      {
        icon: /* @__PURE__ */ e(We, { size: 28 }),
        title: "Chưa có thư yêu cầu khách hàng",
        hint: a ? "Chọn kênh ở trên hoặc tích chọn hạng mục ở tab Danh mục kiểm tra để trợ lý soạn nháp." : "Không còn hạng mục thiếu cần yêu cầu khách hàng."
      }
    ),
    b.map((_) => /* @__PURE__ */ e(Ln, { d: _, items: f, readOnly: r, onSent: g }, _.id))
  ] });
}
function Pn({ audit: t }) {
  if (t.length === 0) return /* @__PURE__ */ e(he, { icon: /* @__PURE__ */ e(an, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (r) => r === "case_submitted" ? "ok" : r === "case_reopened" || r === "document_remove" ? "warn" : r === "requirement_set" ? "accent" : "muted";
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t].reverse().map((r, a) => {
    const g = bn(r);
    return /* @__PURE__ */ n("div", { className: `sme-tl-item ${ie(s(r.action))}`, children: [
      /* @__PURE__ */ n("div", { className: "sme-between", children: [
        /* @__PURE__ */ n("span", { className: "sme-strong", style: { fontSize: 13 }, children: [
          fn[r.action] ?? r.action,
          g ? ` · ${g}` : ""
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: ze(r.ts) })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: zt(String(r.actor ?? r.agent ?? r.author ?? "")) })
    ] }, a);
  }) }) });
}
function ye({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function Gn({
  caseId: t,
  catalog: s,
  coachOpen: r,
  syncTick: a,
  onBack: g,
  onToggleCoach: h,
  onAskCoach: x,
  onCaseMetaChange: p,
  onRegisterQuickDraft: f
}) {
  var ot, lt;
  const v = vt(), [b, _] = y(null), [N, q] = y(null), [o, S] = y(!1), [m, E] = y("overview"), [B, j] = y(null), [I, K] = y(null), [T, z] = y(null), [V, O] = y(!1), [F, H] = y(null), [P, ne] = y(!1), [l, u] = y(!1), A = te(0), U = te(!1), c = Q(async (i = !1) => {
    if (!(i && U.current)) {
      i ? U.current = !0 : S(!0);
      try {
        _(await v.get(`${$e}/cases/${t}`)), q(null), A.current = Date.now();
      } catch (M) {
        i || q(Se(M));
      } finally {
        i ? U.current = !1 : S(!1);
      }
    }
  }, [v, t]);
  Z(() => {
    c();
  }, [c]), Z(() => {
    a > 0 && c(!0);
  }, [a, c]), Z(() => {
    const i = () => {
      document.visibilityState !== "hidden" && Date.now() - A.current >= 3e3 && c(!0);
    };
    return window.addEventListener("focus", i), document.addEventListener("visibilitychange", i), () => {
      window.removeEventListener("focus", i), document.removeEventListener("visibilitychange", i);
    };
  }, [c]);
  const L = async (i, M) => {
    try {
      return await v.post(`${$e}/cases/${t}${i}`, M), !0;
    } catch (Y) {
      return q(Se(Y)), !1;
    }
  }, ee = async (i, M, Y = "", ce) => {
    const xe = { key: i, status: M, note: Y };
    ce !== void 0 && (xe.due_date = ce);
    const de = await L("/requirements", xe);
    return de && await c(), de;
  }, ue = async (i, M) => {
    const Y = await L("/requirements", { keys: i, status: "requested", note: "", due_date: M });
    return Y && await c(), Y;
  }, G = async (i) => {
    const M = await L(`/documents/${i}/remove`, {});
    return M && await c(), M;
  }, pe = async (i) => {
    try {
      const M = await v.get(`${$e}/cases/${t}/documents/${i}/file`), Y = atob(M.content_b64), ce = new Uint8Array(Y.length);
      for (let se = 0; se < Y.length; se++) ce[se] = Y.charCodeAt(se);
      const xe = new Blob([ce], { type: M.mime || "application/octet-stream" }), de = URL.createObjectURL(xe);
      if (M.mime.startsWith("image/") || M.mime === "application/pdf" || M.mime.startsWith("text/")) {
        if (!window.open(de, "_blank", "noopener")) {
          const Ge = document.createElement("a");
          Ge.href = de, Ge.download = M.name, Ge.click();
        }
      } else {
        const se = document.createElement("a");
        se.href = de, se.download = M.name, se.click();
      }
      setTimeout(() => URL.revokeObjectURL(de), 6e4);
    } catch (M) {
      q(Se(M));
    }
  }, D = b == null ? void 0 : b.case, d = b == null ? void 0 : b.overview, k = !!(D != null && D.submitted), w = (D == null ? void 0 : D.customer) ?? {}, $ = (D == null ? void 0 : D.request) ?? {}, R = w.name ? String(w.name) : void 0, W = R || t, Ne = (i) => x(i || `Hồ sơ ${t}: `, "prefill"), oe = (i, M = "email", Y = !1) => {
    const ce = ((d == null ? void 0 : d.items) ?? []).filter((xe) => i.includes(xe.key));
    x(xn(t, ce, M, Y), "prefill");
  }, qe = (i) => {
    i.cta === "draft" ? oe(i.keys, "email", i.kind === "remind" || i.kind === "follow_up") : i.cta === "submit" ? (z(""), H(null)) : i.cta === "chat" && Ne(i.prompt);
  }, tt = async () => {
    b && await Ze(vn(b, s)) && (u(!0), setTimeout(() => u(!1), 1800));
  }, ge = X(() => ((d == null ? void 0 : d.items) ?? []).filter((i) => i.blocking), [d]), nt = X(
    () => ge.filter((i) => ["ok", "resolved", "waived"].includes(i.status)).length,
    [ge]
  ), st = ((ot = d == null ? void 0 : d.readiness.actionable_blocking) == null ? void 0 : ot.length) ?? ge.filter((i) => i.status === "open").length, Mt = ((lt = d == null ? void 0 : d.readiness.waiting_blocking) == null ? void 0 : lt.length) ?? ge.filter((i) => i.status === "requested").length, At = X(() => ((d == null ? void 0 : d.items) ?? []).filter((i) => i.status === "open" || i.status === "requested").length, [d]), rt = X(() => ((b == null ? void 0 : b.drafts) ?? []).filter((i) => i.status === "draft"), [b]), le = X(() => ((d == null ? void 0 : d.items) ?? []).filter((i) => i.status === "waived"), [d]), fe = (d == null ? void 0 : d.policy_checks) ?? [], Ie = X(() => fe.filter((i) => i.status === "not_met"), [fe]), Lt = X(() => ((d == null ? void 0 : d.items) ?? []).find((i) => i.key === "policy:purpose"), [d]), Re = X(
    () => ((d == null ? void 0 : d.items) ?? []).filter((i) => i.kind === "document_expired" && (i.status === "open" || i.status === "requested")).length,
    [d]
  ), Pe = X(() => ((D == null ? void 0 : D.documents) ?? []).filter((i) => !i.type).length, [D]), be = X(
    () => ((d == null ? void 0 : d.items) ?? []).filter((i) => i.status === "open" && i.blocking || i.status === "requested" && i.due_date && i.due_date < ((d == null ? void 0 : d.as_of) ?? "")),
    [d]
  ), Ce = X(
    () => ((d == null ? void 0 : d.items) ?? []).filter((i) => (i.status === "open" || i.status === "requested") && i.ask).map((i) => i.key),
    [d]
  );
  Z(() => {
    p({ customerName: R, readOnly: k, hasOpenItems: Ce.length > 0 });
  }, [R, k, Ce.length, p]);
  const at = te(() => {
  });
  at.current = () => oe(Ce, "email", !1), Z(() => (f(() => at.current()), () => f(null)), [f]);
  const it = X(() => new Map(((d == null ? void 0 : d.profile) ?? []).map((i) => [i.path, i.value])), [d]), Rt = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Danh mục kiểm tra", count: At || void 0 },
    { key: "docs", label: "Chứng từ", count: (D == null ? void 0 : D.documents.length) || void 0 },
    { key: "drafts", label: "Thư yêu cầu KH", count: rt.length || (b == null ? void 0 : b.drafts.length) || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: g, children: [
          /* @__PURE__ */ e(on, { size: 14 }),
          " Danh mục hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: W }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          d && /* @__PURE__ */ e(xt, { stage: d.stage }),
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          D && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            D.flow
          ] }),
          w.tax_id && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "MST ",
            String(w.tax_id)
          ] }),
          w.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(w.industry_code)
          ] }),
          $.product_code && /* @__PURE__ */ e("span", { className: "sme-chip", children: String($.product_code) }),
          $.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: Ye[$.purpose] ?? $.purpose }),
          D && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Khởi tạo ",
            ze(D.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(C, { onClick: () => c(), busy: o, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(Ct, { size: 14 }) }),
        /* @__PURE__ */ n(
          C,
          {
            className: r ? "ss-toggle-on" : void 0,
            "aria-pressed": r,
            onClick: h,
            title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
            children: [
              /* @__PURE__ */ e(we, { size: 14 }),
              " Trợ lý hồ sơ"
            ]
          }
        ),
        k ? /* @__PURE__ */ n(C, { onClick: () => H(""), children: [
          /* @__PURE__ */ e(mt, { size: 14 }),
          " Mở lại hồ sơ"
        ] }) : /* @__PURE__ */ n(C, { primary: !0, onClick: () => {
          z(""), H(null);
        }, children: [
          /* @__PURE__ */ e(_e, { size: 14 }),
          " ",
          d != null && d.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
        ] })
      ] })
    ] }),
    N && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(kt, { title: "Có lỗi khi làm việc với hồ sơ", children: N }) }),
    !b && !N && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" })
    ] }),
    b && D && d && /* @__PURE__ */ n(me, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          ae,
          {
            icon: /* @__PURE__ */ e(ln, { size: 18 }),
            label: "Số tiền đề nghị",
            value: $.amount ? St($.amount).replace(" đ", "") : "—",
            hint: [$.term_months ? `${$.term_months} tháng` : null, $.product_code, "VND"].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e(
          ae,
          {
            t: d.readiness.ready ? "ok" : st > 0 ? "danger" : "warn",
            icon: /* @__PURE__ */ e(cn, { size: 18 }),
            label: "Hạng mục bắt buộc",
            value: `${nt} / ${ge.length}`,
            hint: d.readiness.ready ? le.length ? `Đủ đk (${le.length} xin miễn)` : "Đủ điều kiện trình" : `${st} cần bổ sung · ${Mt} chờ KH`
          }
        ),
        /* @__PURE__ */ e(
          ae,
          {
            t: Re ? "danger" : Pe ? "warn" : D.documents.length ? "ok" : "muted",
            icon: /* @__PURE__ */ e(wt, { size: 18 }),
            label: "Chứng từ lưu trữ",
            value: D.documents.length,
            hint: Re ? `${Re} chứng từ hết hạn` : Pe ? `${Pe} chưa phân loại` : "Đã đối chiếu danh mục"
          }
        ),
        /* @__PURE__ */ e(
          ae,
          {
            t: fe.length === 0 ? "muted" : Ie.length > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(dn, { size: 18 }),
            label: "Điều kiện chính sách",
            value: fe.length === 0 ? "—" : Ie.length > 0 ? `${Ie.length} chưa đạt` : "Đạt sơ bộ",
            hint: fe.length > 0 ? `${fe.length} tiêu chí · ${$.product_code ?? ""}` : "Chưa chọn mã sản phẩm"
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(
        _n,
        {
          groups: d.groups,
          activeGroup: B,
          onSelectGroup: (i) => {
            j(i), E("checklist");
          }
        }
      ) }),
      F !== null && D.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-warn", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Mở lại hồ sơ đã bàn giao" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: "Chỉ mở lại khi bộ phận Thẩm định yêu cầu bổ sung chứng từ mới. Ghi rõ lý do để lưu nhật ký kiểm toán." }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: F,
            onChange: (i) => H(i.target.value),
            placeholder: "Ví dụ: Thẩm định yêu cầu bổ sung BCTC quý gần nhất"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(C, { onClick: () => H(null), children: "Huỷ" }),
          /* @__PURE__ */ n(C, { primary: !0, busy: P, disabled: !F.trim(), onClick: async () => {
            ne(!0), await L("/reopen", { note: F }) && (H(null), await c()), ne(!1);
          }, children: [
            /* @__PURE__ */ e(mt, { size: 14 }),
            " Xác nhận mở lại"
          ] })
        ] })
      ] }),
      T !== null && !D.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: "Xác nhận bàn giao hồ sơ sang Thẩm định (LOS)" }),
          /* @__PURE__ */ n(C, { onClick: tt, children: [
            l ? /* @__PURE__ */ e(Me, { size: 13 }) : /* @__PURE__ */ e(Ae, { size: 13 }),
            " ",
            l ? "Đã chép phiếu" : "Sao chép phiếu bàn giao LOS"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { margin: "6px 0 8px" }, children: [
          "Hạng mục bắt buộc: ",
          /* @__PURE__ */ n("b", { children: [
            nt,
            "/",
            ge.length
          ] }),
          " · Chứng từ: ",
          /* @__PURE__ */ e("b", { children: D.documents.length }),
          " · Xin miễn: ",
          /* @__PURE__ */ e("b", { children: le.length }),
          " · Cảnh báo sơ bộ: ",
          /* @__PURE__ */ e("b", { children: Ie.length }),
          ".",
          d.readiness.ready ? " Ghi chú bàn giao không bắt buộc." : ` Còn ${d.readiness.blocking_open.length} mục chặn nên bắt buộc ghi giải trình.`
        ] }),
        le.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ e("b", { children: "Mục xin miễn:" }),
          " ",
          le.map((i) => `${i.title} (${i.note})`).join("; ")
        ] }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: T,
            onChange: (i) => z(i.target.value),
            placeholder: d.readiness.ready ? "Ghi chú bàn giao (tuỳ chọn)" : "Ghi rõ giải trình khi trình dù còn hạng mục chặn (bắt buộc)"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(C, { onClick: () => z(null), children: "Huỷ" }),
          /* @__PURE__ */ n(
            C,
            {
              primary: !0,
              busy: V,
              disabled: !d.readiness.ready && !T.trim(),
              onClick: async () => {
                O(!0), await L("/submitted", { note: T }) && (z(null), await c()), O(!1);
              },
              children: [
                /* @__PURE__ */ e(_e, { size: 14 }),
                " Xác nhận đã bàn giao"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Rt.map((i) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": m === i.key,
              className: `sme-tab ${m === i.key ? "on" : ""}`,
              onClick: () => E(i.key),
              children: [
                i.label,
                i.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: i.count })
              ]
            },
            i.key
          )) }),
          m === "overview" && /* @__PURE__ */ e(
            Kn,
            {
              detail: b,
              catalog: s,
              pendingDraftsCount: rt.length,
              purposeWarn: Lt,
              readOnly: k,
              goDrafts: () => E("drafts"),
              onAction: qe,
              onChat: Ne
            }
          ),
          m === "checklist" && /* @__PURE__ */ e(
            Hn,
            {
              items: d.items,
              asOf: d.as_of,
              catalog: s,
              groupFilter: B,
              onClearGroup: () => j(null),
              readOnly: k,
              onSet: ee,
              onBatchRequested: ue,
              onDraft: oe,
              onOpenDoc: (i) => {
                K(i), E("docs");
              }
            }
          ),
          m === "docs" && /* @__PURE__ */ e(
            An,
            {
              docs: D.documents,
              items: d.items,
              profile: d.profile,
              catalog: s,
              focusDocId: I,
              readOnly: k,
              onDownload: pe,
              onRemove: G,
              onExtractDoc: (i) => x(`Đọc lại và cập nhật thông tin từ chứng từ ${i} của hồ sơ ${t}.`, "prefill"),
              onUpload: () => x("", "attach")
            }
          ),
          m === "drafts" && /* @__PURE__ */ e(
            Rn,
            {
              drafts: b.drafts,
              items: d.items,
              readOnly: k,
              hasOpenItems: Ce.length > 0,
              onCompose: (i) => oe(Ce, i, !1),
              onSent: async (i, M) => {
                const Y = await L(`/drafts/${i}/sent`, { due_date: M });
                return Y && await c(), Y;
              }
            }
          ),
          m === "audit" && /* @__PURE__ */ e(Pn, { audit: b.audit })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Hạng mục cần xử lý" }),
              /* @__PURE__ */ e(J, { t: be.length ? "warn" : "ok", children: be.length })
            ] }),
            be.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn hạng mục chặn mở." }),
            be.slice(0, 6).map((i) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "sme-todo",
                onClick: () => {
                  j(i.group), E("checklist");
                },
                children: [
                  /* @__PURE__ */ e(J, { t: i.status === "requested" ? "danger" : "warn", children: i.status === "requested" ? "Quá hạn" : "Thiếu" }),
                  /* @__PURE__ */ e("span", { className: "sme-todo-text", children: i.title })
                ]
              },
              i.key
            )),
            be.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => E("checklist"), children: [
              "Xem thêm ",
              be.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Định danh & Tóm tắt" }),
            /* @__PURE__ */ e(ye, { label: "Mã số thuế", children: String(w.tax_id ?? "—") }),
            /* @__PURE__ */ e(ye, { label: "CIF", children: String(w.cif ?? "—") }),
            /* @__PURE__ */ e(ye, { label: "Người đại diện", children: String(w.legal_rep ?? "—") }),
            /* @__PURE__ */ e(ye, { label: "Số năm hoạt động", children: Te("facts.years_in_operation", it.get("facts.years_in_operation") ?? w.years_in_operation, s) }),
            /* @__PURE__ */ e(ye, { label: "Vốn điều lệ", children: Te("customer.charter_capital", w.charter_capital, s) }),
            /* @__PURE__ */ e(ye, { label: "Doanh thu gần nhất", children: Te("facts.revenue_last_year", it.get("facts.revenue_last_year"), s) }),
            $.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String($.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 8 }, children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Bàn giao LOS" }),
              /* @__PURE__ */ e(xt, { stage: d.stage })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: le.length > 0 ? `${le.length} mục xin miễn kèm giải trình.` : "Chưa có mục xin miễn." }),
            /* @__PURE__ */ n(C, { onClick: tt, children: [
              l ? /* @__PURE__ */ e(Me, { size: 13 }) : /* @__PURE__ */ e(Ae, { size: 13 }),
              " ",
              l ? "Đã chép phiếu" : "Chép phiếu bàn giao"
            ] }),
            !k && /* @__PURE__ */ n(C, { primary: !0, onClick: () => {
              z(""), H(null);
            }, children: [
              /* @__PURE__ */ e(_e, { size: 13 }),
              " ",
              d.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
            ] })
          ] }),
          b.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(mn, { size: 13 }),
            " Hoạt động gần nhất ",
            ze(b.audit[b.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
un();
Tn();
const Bt = "sme-sales:coach-open", Kt = "sme-sales:coach-width";
function Fn() {
  try {
    const t = localStorage.getItem(Bt);
    if (t === "1") return !0;
    if (t === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function Xn() {
  try {
    const t = Number(localStorage.getItem(Kt));
    if (Number.isFinite(t) && t >= 360 && t <= 620) return Math.round(t);
  } catch {
  }
  return 420;
}
const jn = (t, s) => {
};
function Zn() {
  const t = Ke.useAppApi(), s = Ke.useAppEvents ?? jn, [r, a] = y(null), [g, h] = y(null), [x, p] = y(Fn), [f, v] = y(Xn), [b, _] = y(null), [N, q] = y(null), [o, S] = y(null), [m, E] = y(0), B = te(0), j = te(null);
  Z(() => {
    t.get(`${$e}/catalog`).then(h).catch(() => h(null));
  }, [t]);
  const I = Q((l) => {
    p((u) => {
      const A = typeof l == "function" ? l(u) : l;
      try {
        localStorage.setItem(Bt, A ? "1" : "0");
      } catch {
      }
      return A;
    });
  }, []), K = Q((l) => {
    const u = Math.min(620, Math.max(360, Math.round(l)));
    v(u);
    try {
      localStorage.setItem(Kt, String(u));
    } catch {
    }
  }, []), T = Q(() => {
    E((l) => l + 1);
  }, []);
  s("tool_result", T), s("chat_done", T), Z(() => {
    if (!x) return;
    const l = window.setInterval(() => {
      document.visibilityState !== "hidden" && E((u) => u + 1);
    }, 4e3);
    return () => window.clearInterval(l);
  }, [x]);
  const z = Q((l, u = "prefill") => {
    I(!0), _({ id: ++B.current, prompt: l, mode: u });
  }, [I]), V = Q(() => {
    _(null);
  }, []), O = Q((l) => {
    S(null), q(null), a(l);
  }, []), F = Q(() => {
    q(null), a(null);
  }, []), H = Q((l) => {
    q((u) => u === l || u && l && u.customerName === l.customerName && u.readOnly === l.readOnly && u.hasOpenItems === l.hasOpenItems ? u : l);
  }, []), P = Q((l) => {
    j.current = l;
  }, []), ne = Q(() => {
    var l;
    (l = j.current) == null || l.call(j);
  }, []);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "ss-workspace", children: [
    /* @__PURE__ */ e("div", { className: "ss-main", children: r ? /* @__PURE__ */ e(
      Gn,
      {
        caseId: r,
        catalog: g,
        coachOpen: x,
        syncTick: m,
        onBack: F,
        onToggleCoach: () => I((l) => !l),
        onAskCoach: z,
        onCaseMetaChange: H,
        onRegisterQuickDraft: P
      }
    ) : /* @__PURE__ */ e(
      In,
      {
        onOpen: O,
        catalog: g,
        coachOpen: x,
        syncTick: m,
        onToggleCoach: () => I((l) => !l),
        onAskCoach: z,
        onCreatedCase: S
      }
    ) }),
    x && /* @__PURE__ */ e(
      wn,
      {
        width: f,
        onWidthChange: K,
        onClose: () => I(!1),
        caseId: r,
        customerName: r ? N == null ? void 0 : N.customerName : void 0,
        readOnly: r ? !!(N != null && N.readOnly) : !1,
        hasOpenItems: r ? !!(N != null && N.hasOpenItems) : !1,
        intent: b,
        onConsumeIntent: V,
        createdCase: o,
        onOpenCase: O,
        onDismissCreatedCase: () => S(null),
        onQuickDraft: r && (N != null && N.hasOpenItems) && !N.readOnly ? ne : void 0
      }
    )
  ] }) });
}
export {
  Zn as default
};
