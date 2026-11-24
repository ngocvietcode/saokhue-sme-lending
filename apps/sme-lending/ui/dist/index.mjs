import { jsxs as n, jsx as e, Fragment as $e } from "react/jsx-runtime";
import { MessageSquare as xe, Plus as We, ExternalLink as kt, PanelRightClose as Rn, ArrowRight as qn, AlertTriangle as Mn, RefreshCw as dt, FolderOpen as lt, ClipboardList as Ct, ShieldAlert as Zt, AlertOctagon as Bn, Search as He, CheckCircle2 as mt, XCircle as en, CircleDot as tn, CircleDashed as St, TriangleAlert as Hn, Loader2 as Pn, EyeOff as nn, Eye as ht, ClipboardCheck as Ne, Play as sn, FileSearch as ut, History as an, ChevronRight as On, ArrowLeft as ln, Landmark as rn, Gauge as Fn, ShieldCheck as cn, FileText as $t, Download as on, Activity as dn, Mail as Tt, Calendar as jn, Clock as Gn, X as Un, Send as mn, Check as rt, Copy as ct, SkipForward as Vn, RotateCcw as Xn, Trash2 as Wn, Unlock as Pt } from "lucide-react";
import { useRef as te, useCallback as Z, useState as w, useMemo as P, useEffect as Q, Fragment as hn } from "react";
import * as Nt from "@kirocrew/app-sdk";
import { useChatLauncher as Qn, useAppApi as Oe } from "@kirocrew/app-sdk";
import { Btn as T, PageHeader as un, ErrorNotice as pt } from "@kirocrew/app-sdk/ui";
const Yn = `
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

.sme-spin { animation: sme-spin 1s linear infinite; }
@keyframes sme-spin { to { transform: rotate(360deg); } }
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
.sme-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); row-gap: 12px; }
.sme-phase { min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 0 10px; position: relative; }
.sme-phase + .sme-phase { border-left: 1px dashed var(--border); }
.sme-phase-name { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 600; }
.sme-node { display: flex; align-items: flex-start; gap: 6px; font-size: 12.5px; line-height: 1.35; color: var(--text); border: 0; background: none; padding: 0; cursor: pointer; text-align: left; overflow-wrap: anywhere; }
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
.sme-modebar { margin: 0; padding: 0 16px; flex-shrink: 0; }
.sme-modebar .sme-tab { display: inline-flex; align-items: center; gap: 6px; }
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

/* Split workspace with collapsible right-hand assistant panel */
.sme-workspace { display: flex; flex: 1; min-height: 0; height: 100%; overflow: hidden; position: relative; }
.sme-main { flex: 1; min-width: 0; min-height: 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; container-type: inline-size; }
@container (max-width: 1020px) {
  .sme-detail { grid-template-columns: minmax(0, 1fr); }
  .sme-aside { position: static; }
}
@container (max-width: 680px) {
  .sme-hero { grid-template-columns: minmax(0, 1fr); gap: 10px; }
}

.sme-toggle-on { border-color: color-mix(in srgb, var(--accent) 55%, var(--border)) !important;
  background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
  color: var(--text-strong, var(--text)) !important; font-weight: 600; }

.sme-dock { position: relative; flex: none; height: 100%; min-height: 0; display: flex; flex-direction: column;
  background: var(--card); border-left: 1px solid var(--border); }
.sme-dock-resizer { position: absolute; left: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 5;
  background: transparent; transition: background .15s; touch-action: none; }
.sme-dock-resizer:hover, .sme-dock-resizer.dragging { background: color-mix(in srgb, var(--accent) 35%, transparent); }

.sme-dock-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-height: 38px;
  padding: 5px 8px 5px 12px; border-bottom: 1px solid var(--border); background: var(--card); flex: none; }
.sme-dock-left { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; }
.sme-dock-chips { display: flex; align-items: center; gap: 5px; overflow-x: auto; scrollbar-width: none; min-width: 0; }
.sme-dock-chips::-webkit-scrollbar { display: none; }
.sme-icon-btn { width: 28px; height: 28px; display: inline-grid; place-items: center; border-radius: 6px;
  border: 1px solid transparent; background: transparent; color: var(--muted); cursor: pointer; flex: none; }
.sme-icon-btn:hover { color: var(--text); background: var(--bg-hover, color-mix(in srgb, var(--muted) 12%, transparent));
  border-color: var(--border); }

.sme-dock-new-banner { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px;
  border-bottom: 1px solid var(--border); font-size: 12px; flex: none;
  background: color-mix(in srgb, var(--ok) 10%, var(--card)); }
.sme-dock-body { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
.sme-dock-fallback { padding: 16px; display: flex; flex-direction: column; gap: 10px; }

.sme-quick-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--bg-elevated, var(--bg)); color: var(--text); font-size: 11.5px;
  white-space: nowrap; cursor: pointer; flex: none; }
.sme-quick-chip:hover { border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--card)); }

@media (max-width: 920px) {
  .sme-dock { position: absolute; right: 0; top: 0; bottom: 0; width: min(440px, 100%) !important;
    z-index: 30; box-shadow: -8px 0 24px rgba(0, 0, 0, .14); }
  .sme-dock-resizer { display: none; }
}
`;
function It() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = Yn, document.head.appendChild(s);
}
const Jn = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function Zn(t, s, i) {
  const a = Qn(), c = te(a);
  c.current = a;
  const r = te(i);
  return r.current = i, Z(
    async (u, y, l) => {
      var N;
      const o = c.current, { openChat: p } = o, m = o.createChat;
      if (!m) {
        p({ autoSend: !1, message: u });
        return;
      }
      try {
        const b = await m({ slotKey: s + Jn(y), agent: t, title: l });
        p({ slotKey: b, autoSend: !1, message: u });
      } catch (b) {
        (N = r.current) == null || N.call(r, `Không mở được chat với trợ lý: ${b instanceof Error ? b.message : String(b)}`);
      }
    },
    [t, s]
  );
}
const et = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, at = new Intl.NumberFormat("vi-VN"), Et = (t) => typeof t == "number" ? at.format(t) + " đ" : "—", ze = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? at.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? at.format(Math.round(t / 1e4) / 100) + " triệu" : at.format(t) + " đ", re = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", Re = (t) => typeof t == "number" ? (t * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "%" : "—", ge = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, _e = (t) => {
  if (!t) return "—";
  const s = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t.trim());
  if (s) return `${Number(s[3])}/${Number(s[2])}/${s[1]}`;
  const i = new Date(t);
  return Number.isNaN(i.getTime()) ? "—" : i.toLocaleDateString("vi-VN");
}, zt = (t) => {
  if (!t) return "—";
  const s = new Date(t).getTime();
  if (Number.isNaN(s)) return "—";
  const i = Math.round((Date.now() - s) / 1e3);
  return i < 60 ? "vừa xong" : i < 3600 ? `${Math.floor(i / 60)} phút trước` : i < 86400 ? `${Math.floor(i / 3600)} giờ trước` : `${Math.floor(i / 86400)} ngày trước`;
}, Ot = (t) => {
  const s = /* @__PURE__ */ new Date();
  s.setDate(s.getDate() + t);
  const i = s.getFullYear(), a = String(s.getMonth() + 1).padStart(2, "0"), c = String(s.getDate()).padStart(2, "0");
  return `${i}-${a}-${c}`;
};
async function At(t) {
  var s;
  try {
    if ((s = navigator.clipboard) != null && s.writeText)
      return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const i = document.createElement("textarea");
    i.value = t, i.style.position = "fixed", i.style.opacity = "0", document.body.appendChild(i), i.select();
    const a = document.execCommand("copy");
    return document.body.removeChild(i), a;
  } catch {
    return !1;
  }
}
const Ft = (t) => typeof t == "string" ? t : JSON.stringify(t, null, 2), Ce = (t) => t instanceof Error ? t.message : String(t), _t = "kirocrew_prefill", jt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), es = (t, s) => {
};
function gt(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function pn(t) {
  try {
    const s = localStorage.getItem(t);
    if (s === "1") return !0;
    if (s === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function gn(t, s) {
  try {
    localStorage.setItem(t, s ? "1" : "0");
  } catch {
  }
}
function bn(t, s = 420) {
  try {
    const i = Number(localStorage.getItem(t));
    if (Number.isFinite(i) && i >= 360 && i <= 620) return Math.round(i);
  } catch {
  }
  return s;
}
function fn(t, s) {
  try {
    localStorage.setItem(t, String(gt(s)));
  } catch {
  }
}
function vn(t, s = 4e3) {
  const i = Nt.useAppEvents ?? es, [a, c] = w(0), r = Z(() => c((u) => u + 1), []);
  return i("tool_result", r), i("chat_done", r), Q(() => {
    if (!t) return;
    const u = window.setInterval(() => {
      document.visibilityState !== "hidden" && c((y) => y + 1);
    }, s);
    return () => window.clearInterval(u);
  }, [t, s]), { syncTick: a, bumpSync: r };
}
function ts(t) {
  try {
    const s = sessionStorage.getItem(t);
    if (s) return s;
    const i = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, i), i;
  } catch {
    return "intake-default";
  }
}
function ns(t, s) {
  try {
    sessionStorage.setItem(t, s);
  } catch {
  }
}
function qe(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function nt(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function st(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const i = t.value.length;
    t.setSelectionRange(i, i);
    return;
  }
  const s = window.getSelection();
  s && (s.selectAllChildren(t), s.collapseToEnd());
}
function Gt(t, s) {
  const i = Date.now();
  try {
    sessionStorage.setItem(_t, JSON.stringify({ slotKey: t, prompt: s, ts: i }));
  } catch {
  }
  return i;
}
function yn({
  storagePrefix: t,
  chatPrefix: s,
  agent: i,
  panelLabel: a,
  newIntakePrompt: c,
  newSessionTitle: r,
  caseTitlePrefix: u = "Hồ sơ",
  chips: y = [],
  showNewSessionButton: l,
  attachDefaultPrefix: o,
  embedPlaceholder: p,
  width: m,
  onWidthChange: N,
  onClose: b,
  caseId: k,
  customerName: I,
  intent: v,
  onConsumeIntent: h,
  createdCase: d,
  onOpenCase: K,
  onDismissCreatedCase: H
}) {
  const V = Nt, O = V.ChatPanel, E = V.ChatEmbed, B = Nt.useChatLauncher(), S = Zn(i, s), L = `${t}:intake-id`, [x, q] = w(() => ts(L)), G = k ?? x, z = s + jt(G), D = P(() => k ? I ? `${u} ${I} (${k})` : `${u} ${k}` : r, [k, I, r, u]), [U, J] = w(null), [ee, ce] = w(null), be = te(null);
  be.current = U;
  const X = te(B);
  X.current = B, Q(() => {
    let _ = !1;
    ce(null);
    const M = be.current === z, W = X.current.createChat;
    if (!W) {
      M || J(z);
      return;
    }
    return M || J(null), W({ slotKey: z, agent: i, title: D }).then((Y) => {
      if (_) return;
      const ne = Y || z;
      be.current !== ne && J(ne);
    }).catch((Y) => {
      _ || M || ce(Ce(Y));
    }), () => {
      _ = !0;
    };
  }, [z, i, D]);
  const f = te(null), F = te(0), A = te(null), $ = te(!1), [ue, ie] = w(0), se = Z((_, M) => {
    const W = M.trim();
    if (!W) return;
    const Y = qe(f.current);
    if (be.current === _ && Y) {
      nt(Y).trim().includes(W) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: M } })), requestAnimationFrame(() => st(qe(f.current)));
      return;
    }
    const ne = Gt(_, M);
    A.current = { slotKey: _, prompt: M, ts: ne }, ie((De) => De + 1);
  }, []);
  Q(() => {
    const _ = A.current;
    if (!_ || U !== _.slotKey) return;
    let M = 0, W = 0;
    const Y = window.setInterval(() => {
      M += 1;
      const ne = qe(f.current);
      if (!ne) {
        M >= 20 && (window.clearInterval(Y), A.current = null);
        return;
      }
      if (nt(ne).trim().includes(_.prompt.trim())) {
        A.current = null, window.clearInterval(Y), st(ne);
        return;
      }
      if (W += 1, W >= 3) {
        try {
          const le = sessionStorage.getItem(_t);
          if (le) {
            const pe = JSON.parse(le);
            pe.slotKey === _.slotKey && pe.ts === _.ts && sessionStorage.removeItem(_t);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: _.prompt } })), A.current = null, window.clearInterval(Y), requestAnimationFrame(() => st(qe(f.current)));
      }
    }, 60);
    return () => window.clearInterval(Y);
  }, [U, ue]), Q(() => {
    if (!$.current || !U) return;
    let _ = 0;
    const M = () => {
      var ne;
      const Y = (ne = f.current) == null ? void 0 : ne.querySelector('input[type="file"]');
      return Y ? ($.current = !1, Y.click(), !0) : !1;
    };
    if (M()) return;
    const W = window.setInterval(() => {
      _ += 1, (M() || _ >= 16) && ($.current = !1, window.clearInterval(W));
    }, 50);
    return () => window.clearInterval(W);
  }, [U, ue]);
  const ke = Z((_) => {
    const M = `intake-${Date.now().toString(36)}`, W = s + jt(M);
    if (ns(L, M), H(), _) {
      const Y = Gt(W, _);
      A.current = { slotKey: W, prompt: _, ts: Y }, ie((ne) => ne + 1);
    }
    q(M);
  }, [s, L, H]);
  Q(() => {
    var _;
    if (!(!v || v.id === F.current)) {
      if (F.current = v.id, v.mode === "new_intake") {
        const M = qe(f.current), W = nt(M).trim(), Y = (v.prompt || c).trim();
        k === null && W === Y && M ? st(M) : ke(v.prompt || c), h();
        return;
      }
      if (v.mode === "attach") {
        const M = qe(f.current), W = o ?? (k ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${k}: ` : "");
        W && !nt(M).trim() && se(z, W);
        const Y = (_ = f.current) == null ? void 0 : _.querySelector('input[type="file"]');
        Y ? ($.current = !1, Y.click()) : ($.current = !0, ie((ne) => ne + 1)), h();
        return;
      }
      se(z, v.prompt), h();
    }
  }, [
    v,
    k,
    z,
    c,
    o,
    h,
    se,
    ke
  ]);
  const [Fe, Se] = w(!1), fe = te(null), Ae = (_) => {
    _.preventDefault(), _.currentTarget.setPointerCapture(_.pointerId), fe.current = { startX: _.clientX, startW: m, pointerId: _.pointerId }, Se(!0);
  }, Te = (_) => {
    const M = fe.current;
    !M || M.pointerId !== _.pointerId || N(gt(M.startW + (M.startX - _.clientX)));
  }, ae = (_) => {
    var M;
    ((M = fe.current) == null ? void 0 : M.pointerId) === _.pointerId && (fe.current = null, Se(!1));
  }, C = l ?? !k;
  return /* @__PURE__ */ n("aside", { ref: f, className: "sme-dock", style: { width: m }, "aria-label": a, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${Fe ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: Ae,
        onPointerMove: Te,
        onPointerUp: ae,
        onPointerCancel: ae
      }
    ),
    /* @__PURE__ */ n("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ n("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e(xe, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          k ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: k }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: a })
        ] }),
        y.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: y.map((_) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              _.onClick ? _.onClick() : _.prompt && se(z, _.prompt);
            },
            children: _.label
          },
          _.label
        )) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        C && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => ke(), children: /* @__PURE__ */ e(We, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => S("", G, D),
            children: /* @__PURE__ */ e(kt, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: b, children: /* @__PURE__ */ e(Rn, { size: 15 }) })
      ] })
    ] }),
    !k && d && /* @__PURE__ */ n("div", { className: "sme-dock-new-banner", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: d.name }),
        " ",
        /* @__PURE__ */ n("span", { className: "sme-mono", children: [
          "(",
          d.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ n(T, { primary: !0, onClick: () => K(d.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(qn, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: ee ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: ee }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(T, { onClick: () => S("", G, D), children: [
        /* @__PURE__ */ e(kt, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : U ? O ? /* @__PURE__ */ e(O, { slotKey: U, conversationOnly: !0 }, U) : E ? /* @__PURE__ */ e(
      E,
      {
        slotKey: U,
        agent: i,
        frameless: !0,
        startAtBottom: !0,
        placeholder: p
      },
      U
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(T, { primary: !0, onClick: () => S("", G, D), children: [
        /* @__PURE__ */ e(kt, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const ss = "sme-assistant", is = (t, s) => s && t[s] || { label: s ?? "—", tone: "muted" }, Dt = {
  PASS: { label: "Đạt", tone: "ok" },
  MISSING_REQUIRED: { label: "Còn thiếu", tone: "warn" },
  FAIL: { label: "Không đạt", tone: "danger" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" },
  UNDETERMINED_CONDITION: { label: "Chưa xác định điều kiện", tone: "info" }
}, kn = {
  PASS: { label: "Khớp", tone: "ok" },
  FAIL: { label: "Không khớp", tone: "danger" },
  MISSING_DATA: { label: "Thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, as = {
  COMPLETE: { label: "Checklist đầy đủ", tone: "ok" },
  INCOMPLETE: { label: "Checklist chưa đủ", tone: "warn" },
  PASS: { label: "Đối chiếu khớp", tone: "ok" },
  FAIL: { label: "Đối chiếu có lệch", tone: "danger" },
  MISSING_DATA: { label: "Đối chiếu thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, ve = (t) => is(as, t);
function Lt(t, s = [
  "PASS",
  "MISSING_REQUIRED",
  "FAIL",
  "UNDETERMINED_CONDITION"
]) {
  if (!t) return "—";
  const i = s.filter((a) => (t[a] ?? 0) > 0).map((a) => `${t[a]} ${Dt[a].label.toLowerCase()}`);
  return i.length ? i.join(" · ") : "Chưa có mục nào";
}
const Ge = "/apps/sme-lending/api", wn = [
  { name: "Chứng từ", agents: ["document-evidence"] },
  { name: "Sản phẩm", agents: ["product-match"] },
  { name: "Chuyên môn", agents: ["financial-analysis", "risk-compliance", "collateral", "industry"] },
  { name: "Chính sách", agents: ["policy-exception"] },
  { name: "Tổng hợp", agents: ["consolidation"] }
], Qe = wn.flatMap((t) => t.agents), ls = {
  "document-evidence": "Chứng từ & bằng chứng",
  "product-match": "Nhận diện sản phẩm",
  "financial-analysis": "Phân tích tài chính",
  "risk-compliance": "Rủi ro & tuân thủ",
  collateral: "Tài sản bảo đảm",
  industry: "Ngành & cạnh tranh",
  "policy-exception": "Chính sách & ngoại lệ",
  consolidation: "Tổng hợp tờ trình",
  "document-product": "Chứng từ & sản phẩm",
  "credit-analysis": "Thẩm định chuyên môn"
}, ye = (t) => ls[t] ?? t, Ye = {
  passed: { label: "Đã kiểm chứng", tone: "ok" },
  blocked: { label: "Bị chặn", tone: "danger" },
  unverified: { label: "Chưa kiểm chứng", tone: "warn" },
  none: { label: "Chưa chạy", tone: "muted" }
}, Pe = {
  high: { label: "Cao", tone: "danger", rank: 0 },
  medium: { label: "Trung bình", tone: "warn", rank: 1 },
  low: { label: "Thấp", tone: "info", rank: 2 },
  info: { label: "Thông tin", tone: "muted", rank: 3 }
}, rs = { high: "cao", medium: "trung bình", low: "thấp" }, Kt = {
  missing_document: { label: "Thiếu chứng từ", tone: "warn" },
  data_conflict: { label: "Dữ liệu mâu thuẫn", tone: "danger" },
  rule_fail: { label: "Không đạt điều kiện", tone: "danger" },
  low_confidence: { label: "Độ tin cậy thấp", tone: "info" },
  exception_needed: { label: "Cần ngoại lệ", tone: "danger" },
  expert_review: { label: "Cần chuyên gia", tone: "info" },
  system_error: { label: "Lỗi hệ thống", tone: "muted" }
}, xn = {
  open: { label: "Chờ xử lý", tone: "warn" },
  confirmed: { label: "Đã xác nhận", tone: "ok" },
  needs_info: { label: "Yêu cầu bổ sung", tone: "info" }
}, cs = {
  case_create: "Tạo hồ sơ",
  case_handover_received: "Nhận bàn giao từ ĐVKD",
  evidence_add: "Thêm bằng chứng",
  result_put: "Lưu kết quả",
  verification: "Kiểm chứng",
  review_add: "Thêm mục rà soát",
  review_decide: "Cán bộ quyết định"
}, os = (t) => [...t].sort((s, i) => {
  var a, c;
  return (((a = Pe[s.severity]) == null ? void 0 : a.rank) ?? 9) - (((c = Pe[i.severity]) == null ? void 0 : c.rank) ?? 9);
});
function bt(t) {
  return t ? t.verification ? t.verification.passed ? "passed" : "blocked" : "unverified" : "none";
}
function Me(t, s, i) {
  var a, c;
  return (c = (a = t.results[s]) == null ? void 0 : a.calculations) == null ? void 0 : c.find((r) => r.kind === i);
}
function ds(t) {
  var y, l, o, p, m, N, b;
  const s = {}, i = Me(t, "policy-exception", "policy_check") ?? Me(t, "risk-compliance", "policy_check");
  (y = i == null ? void 0 : i.outputs) != null && y.matrix && (s.policy = { version: i.outputs.policy_version, product: i.outputs.product_code ?? ((l = i.inputs) == null ? void 0 : l.product_code) ?? ((o = t.case.request) == null ? void 0 : o.product_code), rows: i.outputs.matrix });
  const a = Me(t, "financial-analysis", "repayment_capacity");
  if ((p = a == null ? void 0 : a.outputs) != null && p.scenarios) {
    const k = (m = s.policy) == null ? void 0 : m.rows.find((I) => I.fact === "dscr");
    s.dscr = {
      scenarios: a.outputs.scenarios,
      threshold: typeof (k == null ? void 0 : k.threshold) == "number" ? k.threshold : void 0,
      debtService: a.outputs.total_debt_service_annual,
      cash: (N = a.inputs) == null ? void 0 : N.cash_available_annual
    };
  }
  const c = Me(t, "collateral", "collateral_ltv");
  c != null && c.outputs && (s.ltv = { ltv: c.outputs.ltv_pct ?? null, cap: c.outputs.max_ltv_pct ?? null, eligible: c.outputs.eligible_value });
  const r = Me(t, "financial-analysis", "fin_ratios");
  (b = r == null ? void 0 : r.outputs) != null && b.periods && (s.ratios = r.outputs.periods);
  const u = Me(t, "consolidation", "genform");
  return u != null && u.outputs && (s.genform = u.outputs), s;
}
const wt = {
  gross_margin: { label: "Biên lợi nhuận gộp", fmt: Re },
  net_margin: { label: "Biên lợi nhuận ròng", fmt: Re },
  ebitda_margin: { label: "Biên EBITDA", fmt: Re },
  current_ratio: { label: "Thanh toán hiện hành", fmt: (t) => re(t) },
  debt_to_equity: { label: "Nợ vay / Vốn chủ", fmt: (t) => re(t) },
  liabilities_to_assets: { label: "Nợ phải trả / Tài sản", fmt: Re },
  roa: { label: "ROA", fmt: Re },
  roe: { label: "ROE", fmt: Re },
  interest_coverage: { label: "Khả năng trả lãi", fmt: (t) => re(t, 1) + (typeof t == "number" ? " lần" : "") },
  receivable_days: { label: "Số ngày phải thu", fmt: (t) => re(t, 0) },
  inventory_days: { label: "Số ngày tồn kho", fmt: (t) => re(t, 0) }
}, ms = {
  years_in_operation: "Số năm hoạt động",
  loan_amount: "Số tiền vay",
  term_months: "Kỳ hạn (tháng)",
  dscr: "DSCR",
  cic_debt_group: "Nhóm nợ CIC",
  ltv_pct: "LTV (%)",
  equity_contribution_pct: "Vốn tự có (%)"
}, hs = {
  met: { label: "Đạt", tone: "ok" },
  not_met: { label: "Không đạt", tone: "danger" },
  missing: { label: "Thiếu dữ liệu", tone: "warn" },
  na: { label: "Không áp dụng", tone: "muted" }
}, he = (t) => `t-${t}`;
function R({ t, children: s, title: i }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${he(t)}`, title: i, children: s });
}
function oe({ icon: t, label: s, value: i, hint: a, t: c = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${he(c)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: i }),
      a && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: a })
    ] })
  ] });
}
function de({ icon: t, title: s, hint: i, action: a }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    i && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: i }),
    a && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: a })
  ] });
}
function Je({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${he(t)}`, children: [
    /* @__PURE__ */ e(Mn, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function Rt({ refs: t, onOpen: s }) {
  return t != null && t.length ? /* @__PURE__ */ e("span", { className: "sme-row sme-wrap", style: { gap: 4, display: "inline-flex", marginLeft: 4 }, children: t.map((i) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", title: "Xem bằng chứng", onClick: () => s(i), children: i }, i)) }) : null;
}
function us({ c: t, onOpen: s }) {
  const i = t.agents ?? {}, a = Object.keys(i).length;
  return /* @__PURE__ */ n(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: s,
      onKeyDown: (c) => {
        (c.key === "Enter" || c.key === " ") && (c.preventDefault(), s());
      },
      children: [
        /* @__PURE__ */ n("div", { className: "sme-between", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.customer_name ?? "Chưa có tên khách hàng" }),
            /* @__PURE__ */ e("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: t.case_id })
          ] }),
          t.review_open > 0 ? /* @__PURE__ */ n(R, { t: "warn", children: [
            t.review_open,
            " chờ rà soát"
          ] }) : a > 0 ? /* @__PURE__ */ e(R, { t: "ok", children: "Đã rà soát" }) : /* @__PURE__ */ e(R, { t: "muted", children: "Mới" })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: ze(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.term_months ? `${t.term_months} tháng` : null, t.purpose ? et[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${a}/${Qe.length} agent đã chạy`, children: Qe.map((c) => {
          const r = i[c];
          return /* @__PURE__ */ e(
            "span",
            {
              className: r ? he(Ye[r].tone) : "none",
              title: `${ye(c)}: ${Ye[r ?? "none"].label}`
            },
            c
          );
        }) }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ n("span", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
            /* @__PURE__ */ n("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            t.from_sales && /* @__PURE__ */ e(R, { t: "accent", children: "Từ ĐVKD" }),
            t.checklist_overall && /* @__PURE__ */ e(R, { t: t.checklist_overall === "COMPLETE" ? "ok" : "warn", children: t.checklist_overall }),
            (t.high_findings ?? 0) > 0 && /* @__PURE__ */ n(R, { t: "danger", children: [
              t.high_findings,
              " cảnh báo cao"
            ] }),
            t.agents_blocked > 0 && /* @__PURE__ */ n(R, { t: "danger", children: [
              t.agents_blocked,
              " bị chặn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            zt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function ps({
  onOpen: t,
  assistantOpen: s,
  syncTick: i,
  onToggleAssistant: a,
  onAskAssistant: c,
  onCreatedCase: r,
  onNewDossier: u
}) {
  const y = Oe(), [l, o] = w(null), [p, m] = w(null), [N, b] = w(""), [k, I] = w("all"), [v, h] = w(!1), d = te(0), K = te(!1), H = te(null), V = Z(async (S = !1) => {
    if (!(S && K.current)) {
      S ? K.current = !0 : h(!0);
      try {
        const L = (await y.get(`${Ge}/cases`)).cases;
        if (H.current === null)
          H.current = new Set(L.map((x) => x.case_id));
        else {
          const x = L.find((q) => !H.current.has(q.case_id));
          L.forEach((q) => H.current.add(q.case_id)), x && r({ caseId: x.case_id, name: x.customer_name ?? x.case_id });
        }
        o(L), m(null), d.current = Date.now();
      } catch (L) {
        S || m(Ce(L));
      } finally {
        S ? K.current = !1 : h(!1);
      }
    }
  }, [y, r]);
  Q(() => {
    V();
  }, [V]), Q(() => {
    i > 0 && V(!0);
  }, [i, V]), Q(() => {
    const S = () => {
      document.visibilityState !== "hidden" && Date.now() - d.current >= 3e3 && V(!0);
    };
    return window.addEventListener("focus", S), document.addEventListener("visibilitychange", S), () => {
      window.removeEventListener("focus", S), document.removeEventListener("visibilitychange", S);
    };
  }, [V]);
  const O = P(() => ({
    open: (l == null ? void 0 : l.reduce((S, L) => S + L.review_open, 0)) ?? 0,
    blocked: (l == null ? void 0 : l.reduce((S, L) => S + L.agents_blocked, 0)) ?? 0,
    high: (l == null ? void 0 : l.reduce((S, L) => S + (L.high_findings ?? 0), 0)) ?? 0
  }), [l]), E = P(() => {
    const S = N.trim().toLowerCase();
    return (l ?? []).filter((L) => k === "review" && L.review_open === 0 || k === "blocked" && L.agents_blocked === 0 ? !1 : S ? [L.customer_name, L.case_id, L.industry_code].some((x) => x == null ? void 0 : x.toLowerCase().includes(S)) : !0);
  }, [l, N, k]), B = u;
  return /* @__PURE__ */ n($e, { children: [
    /* @__PURE__ */ e(
      un,
      {
        title: "Thẩm định SME",
        subtitle: "Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(T, { onClick: () => V(), busy: v, children: [
            /* @__PURE__ */ e(dt, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            T,
            {
              className: s ? "sme-toggle-on" : void 0,
              "aria-pressed": s,
              onClick: a,
              title: s ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
              children: [
                /* @__PURE__ */ e(xe, { size: 14 }),
                " Trợ lý thẩm định"
              ]
            }
          ),
          /* @__PURE__ */ n(T, { primary: !0, onClick: B, children: [
            /* @__PURE__ */ e(We, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      p && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(pt, { title: "Không tải được danh sách hồ sơ", children: p }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(oe, { icon: /* @__PURE__ */ e(lt, { size: 18 }), label: "Hồ sơ", value: (l == null ? void 0 : l.length) ?? "…" }),
        /* @__PURE__ */ e(
          oe,
          {
            t: "warn",
            icon: /* @__PURE__ */ e(Ct, { size: 18 }),
            label: "Mục chờ rà soát",
            value: l ? O.open : "…",
            hint: "Cần cán bộ xác nhận"
          }
        ),
        /* @__PURE__ */ e(oe, { t: "danger", icon: /* @__PURE__ */ e(Zt, { size: 18 }), label: "Cảnh báo mức cao", value: l ? O.high : "…" }),
        /* @__PURE__ */ e(
          oe,
          {
            t: O.blocked ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Bn, { size: 18 }),
            label: "Kết quả bị chặn",
            value: l ? O.blocked : "…",
            hint: "Không qua kiểm chứng"
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hồ sơ", children: [["all", "Tất cả"], ["review", "Chờ rà soát"], ["blocked", "Bị chặn"]].map(([S, L]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": k === S,
            className: `sme-filter ${k === S ? "on" : ""}`,
            onClick: () => I(S),
            children: L
          },
          S
        )) }),
        /* @__PURE__ */ n("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(He, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: N, onChange: (S) => b(S.target.value), placeholder: "Tìm khách hàng, mã hồ sơ, mã ngành" })
        ] })
      ] }),
      l === null && !p && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((S) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, S)) }),
      l && l.length === 0 && /* @__PURE__ */ e(
        de,
        {
          icon: /* @__PURE__ */ e(lt, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn.",
          action: /* @__PURE__ */ n(T, { primary: !0, onClick: B, children: [
            /* @__PURE__ */ e(We, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      l && l.length > 0 && E.length === 0 && /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(He, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      E.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: E.map((S) => /* @__PURE__ */ e(us, { c: S, onOpen: () => t(S.case_id) }, S.case_id)) })
    ] })
  ] });
}
function Nn({ state: t, size: s = 13 }) {
  return t === "passed" ? /* @__PURE__ */ e(mt, { size: s }) : t === "blocked" ? /* @__PURE__ */ e(en, { size: s }) : t === "unverified" ? /* @__PURE__ */ e(tn, { size: s }) : /* @__PURE__ */ e(St, { size: s });
}
function _n({ state: t }) {
  const s = Ye[t];
  return /* @__PURE__ */ n(R, { t: s.tone, children: [
    /* @__PURE__ */ e(Nn, { state: t, size: 12 }),
    s.label
  ] });
}
const gs = 9e4, bs = (t) => Math.max(0, Math.round(t / 1e3)), Ut = (t) => {
  const s = bs(t);
  return s < 60 ? `${s} giây` : `${Math.floor(s / 60)} phút ${String(s % 60).padStart(2, "0")} giây`;
}, fs = 18e4;
function vs(t) {
  const s = /* @__PURE__ */ new Map();
  for (const i of t) s.set(i.agent, [...s.get(i.agent) ?? [], i]);
  return [...s].map(([i, a]) => {
    let c = 0;
    for (let l = 1; l < a.length; l++)
      Date.parse(a[l].ts) - Date.parse(a[l - 1].ts) > fs && (c = l);
    const r = a.slice(c), u = r[r.length - 1], y = u.state === "failed" ? "failed" : r.some((l) => l.state === "done") ? "done" : u.state;
    return { agent: i, rows: r, state: y, startedAt: Date.parse(r[0].ts), lastAt: Date.parse(u.ts) };
  });
}
function ys({ caseId: t, syncTick: s }) {
  const i = Oe(), [a, c] = w([]), [r, u] = w(Date.now()), y = P(() => vs(a), [a]), l = y.some((o) => o.state === "running");
  return Q(() => {
    let o = !0;
    const p = async () => {
      if (document.visibilityState !== "hidden")
        try {
          const N = await i.get(`${Ge}/cases/${t}/progress`);
          o && c(N.rows ?? []);
        } catch {
        }
    };
    p();
    const m = window.setInterval(() => {
      u(Date.now()), p();
    }, l ? 3e3 : 15e3);
    return () => {
      o = !1, window.clearInterval(m);
    };
  }, [i, t, l, s]), y.length === 0 ? null : /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tiến độ thẩm định" }),
      /* @__PURE__ */ e(R, { t: l ? "accent" : "ok", children: l ? "Đang chạy" : "Đã xong các bước đã báo" })
    ] }),
    /* @__PURE__ */ e("p", { className: "sme-small sme-muted", style: { margin: "0 0 8px" }, children: "Các bước do agent tự báo khi làm việc; thời gian tính từ lúc bước đầu tiên được báo." }),
    y.map((o) => {
      const p = o.rows[o.rows.length - 1], m = o.state === "running" && r - o.lastAt > gs, N = (o.state === "running" ? r : o.lastAt) - o.startedAt;
      return /* @__PURE__ */ n("div", { style: { padding: "8px 0", borderTop: "1px solid var(--border)" }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between", children: [
          /* @__PURE__ */ n("span", { style: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13 }, children: [
            o.state === "done" ? /* @__PURE__ */ e(mt, { size: 15, color: "var(--ok)" }) : o.state === "failed" ? /* @__PURE__ */ e(Hn, { size: 15, color: "var(--danger)" }) : m ? /* @__PURE__ */ e(St, { size: 15, color: "var(--warn, var(--muted))" }) : /* @__PURE__ */ e(Pn, { size: 15, className: "sme-spin", color: "var(--accent)" }),
            ye(o.agent)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Ut(N) })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small", style: { margin: "4px 0 0 23px" }, children: [
          p.step,
          p.detail ? /* @__PURE__ */ n("span", { className: "sme-muted", children: [
            " · ",
            p.detail
          ] }) : null,
          m && /* @__PURE__ */ n("span", { style: { color: "var(--warn, var(--muted))" }, children: [
            " · chưa có cập nhật mới ",
            Ut(r - o.lastAt)
          ] })
        ] }),
        o.rows.length > 1 && /* @__PURE__ */ e("ol", { className: "sme-small sme-muted", style: { margin: "4px 0 0 23px", paddingLeft: 16 }, children: o.rows.slice(0, -1).map((b, k) => /* @__PURE__ */ e("li", { children: b.step }, k)) })
      ] }, o.agent);
    })
  ] });
}
function Cn({ f: t, onEvidence: s }) {
  const i = Pe[t.severity] ?? Pe.info;
  return /* @__PURE__ */ n("div", { className: `sme-finding ${he(i.tone)}`, children: [
    /* @__PURE__ */ e("div", { className: "bar" }),
    /* @__PURE__ */ n("div", { children: [
      /* @__PURE__ */ n("div", { className: "sme-finding-topic sme-row", style: { gap: 6 }, children: [
        /* @__PURE__ */ e(R, { t: i.tone, children: i.label }),
        /* @__PURE__ */ e("span", { children: t.topic.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-finding-text", children: [
        t.statement,
        /* @__PURE__ */ e(Rt, { refs: t.evidence_refs, onOpen: s })
      ] })
    ] })
  ] });
}
function ks({ m: t }) {
  const s = Math.max(1.6, (t.threshold ?? 0) * 1.3, ...t.scenarios.map((i) => i.dscr ?? 0));
  return /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Khả năng trả nợ (DSCR)" }),
      t.threshold !== void 0 && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Ngưỡng chính sách ≥ ",
        re(t.threshold)
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-bars", children: t.scenarios.map((i) => {
      const a = t.threshold === void 0 || (i.dscr ?? 0) >= t.threshold;
      return /* @__PURE__ */ n("div", { className: `sme-bar-row ${he(a ? "ok" : "danger")}`, children: [
        /* @__PURE__ */ e("span", { className: "sme-muted", children: i.stress_pct ? `Stress −${i.stress_pct}%` : "Cơ sở" }),
        /* @__PURE__ */ n("div", { className: "sme-bar-track", children: [
          /* @__PURE__ */ e("div", { className: "sme-bar-fill", style: { width: `${Math.min(100, (i.dscr ?? 0) / s * 100)}%` } }),
          t.threshold !== void 0 && /* @__PURE__ */ e("div", { className: "sme-bar-mark", style: { left: `${t.threshold / s * 100}%` } })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-num sme-strong", children: re(i.dscr) })
      ] }, i.stress_pct);
    }) }),
    (t.cash !== void 0 || t.debtService !== void 0) && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 10 }, children: [
      "Dòng tiền trả nợ ",
      ze(t.cash),
      " / năm · Nghĩa vụ trả nợ ",
      ze(t.debtService),
      " / năm"
    ] })
  ] });
}
function ws({ m: t }) {
  return /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", children: [
        "Điều kiện chính sách ",
        t.product
      ] }),
      t.version && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Phiên bản ",
        t.version
      ] })
    ] }),
    /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Điều kiện" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
        /* @__PURE__ */ e("th", { children: "Kết quả" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.rows.map((s) => {
        const i = hs[s.status] ?? { label: s.status, tone: "muted" }, a = (c) => s.fact === "loan_amount" ? ze(c) : typeof c == "number" ? re(c) : "—";
        return /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ n("td", { children: [
            ms[s.fact] ?? s.fact,
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: s.clause })
          ] }),
          /* @__PURE__ */ n("td", { className: "sme-num", children: [
            s.op,
            " ",
            a(s.threshold)
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: a(s.actual) }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: i.tone, children: i.label }) })
        ] }, s.id);
      }) })
    ] })
  ] });
}
function xs({ periods: t }) {
  const s = Object.keys(wt).filter((i) => t.some((a) => {
    var c;
    return ((c = a.ratios) == null ? void 0 : c[i]) != null;
  }));
  return s.length ? /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 8 }, children: "Chỉ số tài chính" }),
    /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Chỉ số" }),
        t.map((i) => /* @__PURE__ */ e("th", { className: "sme-num", children: i.period }, i.period))
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: s.map((i) => /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("td", { children: wt[i].label }),
        t.map((a) => {
          var c;
          return /* @__PURE__ */ e("td", { className: "sme-num", children: wt[i].fmt((c = a.ratios) == null ? void 0 : c[i]) }, a.period);
        })
      ] }, i)) })
    ] })
  ] }) : null;
}
function Ns({ detail: t, m: s, syncTick: i, onEvidence: a, goAgents: c }) {
  const r = t.results.consolidation, u = Qe.flatMap((l) => {
    var o;
    return (((o = t.results[l]) == null ? void 0 : o.findings) ?? []).filter((p) => p.severity === "high").map((p) => ({ ...p, agent: l }));
  }), y = Object.values(t.evidence).some((l) => /MẪU|sample/i.test(String(l.source)));
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    y && /* @__PURE__ */ n(Je, { children: [
      "Hồ sơ đang dùng ",
      /* @__PURE__ */ e("b", { children: "dữ liệu mẫu" }),
      " (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng."
    ] }),
    /* @__PURE__ */ e(ys, { caseId: t.case.case_id, syncTick: i }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tóm tắt thẩm định" }),
        r ? /* @__PURE__ */ e(_n, { state: bt(r) }) : /* @__PURE__ */ e(R, { t: "muted", children: "Chưa tổng hợp" })
      ] }),
      r ? /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: r.summary }) : /* @__PURE__ */ n("p", { className: "sme-muted", style: { margin: 0 }, children: [
        "Agent Tổng hợp chưa chạy. Kết quả từng agent xem ở tab ",
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-ref",
            onClick: c,
            children: "Kết quả agent"
          }
        ),
        "."
      ] })
    ] }),
    u.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 4 }, children: [
        "Cảnh báo mức cao (",
        u.length,
        ")"
      ] }),
      u.map((l) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: ye(l.agent) }),
        /* @__PURE__ */ e(Cn, { f: l, onEvidence: a })
      ] }, l.agent + l.id))
    ] }),
    s.dscr && /* @__PURE__ */ e(ks, { m: s.dscr }),
    s.policy && /* @__PURE__ */ e(ws, { m: s.policy }),
    s.ratios && /* @__PURE__ */ e(xs, { periods: s.ratios })
  ] });
}
function _s({ id: t, r: s, open: i, onToggle: a, onEvidence: c, onAsk: r }) {
  var y, l;
  const u = ["high", "medium", "low"].map((o) => [o, s.findings.filter((p) => p.severity === o).length]);
  return /* @__PURE__ */ n("div", { className: "sme-card", id: `agent-${t}`, children: [
    /* @__PURE__ */ n("button", { type: "button", className: `sme-acc-head ${i ? "open" : ""}`, onClick: a, "aria-expanded": i, children: [
      /* @__PURE__ */ e(On, { size: 16, className: "chev" }),
      /* @__PURE__ */ n("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: ye(t) }),
          /* @__PURE__ */ e(_n, { state: bt(s) })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-small sme-muted", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ n("span", { children: [
            "v",
            s._version,
            " · độ tin cậy ",
            rs[s.confidence] ?? s.confidence,
            " · ",
            ge(s._saved_at)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-sev-counts", children: u.filter(([, o]) => o > 0).map(([o, p]) => /* @__PURE__ */ n(R, { t: Pe[o].tone, children: [
            p,
            " ",
            Pe[o].label.toLowerCase()
          ] }, o)) })
        ] })
      ] })
    ] }),
    i && /* @__PURE__ */ n("div", { className: "sme-acc-body sme-stack", children: [
      /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: s.summary }),
      s.verification && !s.verification.passed && /* @__PURE__ */ n(Je, { t: "danger", children: [
        /* @__PURE__ */ e("b", { children: "Lý do bị chặn:" }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: s.verification.errors.slice(0, 8).map((o, p) => /* @__PURE__ */ e("li", { children: o }, p)) })
      ] }),
      s.findings.length > 0 && /* @__PURE__ */ e("div", { children: os(s.findings).map((o) => /* @__PURE__ */ e(Cn, { f: o, onEvidence: c }, o.id)) }),
      (((y = s.missing_information) == null ? void 0 : y.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Còn thiếu" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.missing_information.map((o, p) => /* @__PURE__ */ e("li", { children: o }, p)) })
      ] }),
      (((l = s.open_issues) == null ? void 0 : l.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Vấn đề mở" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.open_issues.map((o, p) => /* @__PURE__ */ e("li", { children: o }, p)) })
      ] }),
      r && /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ n(T, { onClick: r, children: [
        /* @__PURE__ */ e(xe, { size: 13 }),
        " Hỏi trợ lý về phần này"
      ] }) })
    ] })
  ] });
}
function Cs({ detail: t, openAgent: s, onEvidence: i, onRunAssessment: a, onAskAgent: c }) {
  const r = Qe.filter((o) => t.results[o]), [u, y] = w(() => new Set(s ? [s] : []));
  if (Q(() => {
    s && (y((o) => new Set(o).add(s)), requestAnimationFrame(() => {
      var o;
      return (o = document.getElementById(`agent-${s}`)) == null ? void 0 : o.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
  }, [s]), !r.length)
    return /* @__PURE__ */ e(
      de,
      {
        icon: /* @__PURE__ */ e(ut, { size: 30 }),
        title: "Chưa có kết quả",
        hint: "Chạy thẩm định để các agent ghi kết quả vào hồ sơ.",
        action: a ? /* @__PURE__ */ n(T, { primary: !0, onClick: a, children: [
          /* @__PURE__ */ e(sn, { size: 13 }),
          " Chạy thẩm định"
        ] }) : void 0
      }
    );
  const l = (o) => y((p) => {
    const m = new Set(p);
    return m.has(o) ? m.delete(o) : m.add(o), m;
  });
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ e(T, { onClick: () => y(u.size === r.length ? /* @__PURE__ */ new Set() : new Set(r)), children: u.size === r.length ? "Thu gọn tất cả" : "Mở tất cả" }) }),
    r.map((o) => /* @__PURE__ */ e(
      _s,
      {
        id: o,
        r: t.results[o],
        open: u.has(o),
        onToggle: () => l(o),
        onEvidence: i,
        onAsk: c ? () => c(o, ye(o)) : void 0
      },
      o
    ))
  ] });
}
function Ss({ detail: t, focus: s }) {
  const i = Object.values(t.evidence), [a, c] = w(""), [r, u] = w("all"), [y, l] = w(s);
  Q(() => {
    s && (l(s), c(""), u("all"), requestAnimationFrame(() => {
      var m;
      return (m = document.getElementById(`ev-${s}`)) == null ? void 0 : m.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const o = P(() => Array.from(new Set(i.map((m) => m.added_by))), [i]), p = i.filter((m) => (r === "all" || m.added_by === r) && (!a.trim() || `${m.id} ${m.source} ${Ft(m.value)}`.toLowerCase().includes(a.trim().toLowerCase())));
  return i.length ? /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("div", { className: "sme-filters", children: [
        /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${r === "all" ? "on" : ""}`, onClick: () => u("all"), children: "Tất cả" }),
        o.map((m) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${r === m ? "on" : ""}`, onClick: () => u(m), children: ye(m) }, m))
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-search", children: [
        /* @__PURE__ */ e(He, { size: 14, className: "sme-muted" }),
        /* @__PURE__ */ e("input", { value: a, onChange: (m) => c(m.target.value), placeholder: "Tìm mã, nguồn, giá trị" })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-card tight", children: [
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Nguồn" }),
          /* @__PURE__ */ e("th", { children: "Giá trị" }),
          /* @__PURE__ */ e("th", { style: { width: 150 }, children: "Agent" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: p.map((m) => {
          const N = Ft(m.value), b = y === m.id;
          return /* @__PURE__ */ n(
            "tr",
            {
              id: `ev-${m.id}`,
              className: `click ${s === m.id ? "focus" : ""}`,
              onClick: () => l(b ? null : m.id),
              children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: m.id }),
                /* @__PURE__ */ e("td", { children: m.source }),
                /* @__PURE__ */ n("td", { children: [
                  /* @__PURE__ */ e("span", { className: "sme-mono", style: { wordBreak: "break-word" }, children: N.length > 90 && !b ? N.slice(0, 88) + "…" : b ? "" : N }),
                  b && /* @__PURE__ */ e("pre", { className: "sme-pre", children: N })
                ] }),
                /* @__PURE__ */ n("td", { className: "sme-muted sme-small", children: [
                  ye(m.added_by),
                  /* @__PURE__ */ e("div", { children: ge(m.added_at) })
                ] })
              ]
            },
            m.id
          );
        }) })
      ] }),
      p.length === 0 && /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(He, { size: 24 }), title: "Không có bằng chứng phù hợp" })
    ] })
  ] }) : /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(ut, { size: 30 }), title: "Chưa có bằng chứng" });
}
function $s({ detail: t, focus: s, onDecide: i, onEvidence: a }) {
  const [c, r] = w("open"), [u, y] = w({}), [l, o] = w(null);
  Q(() => {
    s && (r("all"), requestAnimationFrame(() => {
      var b;
      return (b = document.getElementById(`rv-${s}`)) == null ? void 0 : b.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const p = t.review.filter((b) => b.status === "open").length, m = t.review.filter((b) => c === "all" || c === "open" == (b.status === "open")), N = async (b, k) => {
    o(b + k);
    try {
      await i(b, k, u[b] ?? "") && y((I) => ({ ...I, [b]: "" }));
    } finally {
      o(null);
    }
  };
  return t.review.length ? /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [["open", `Chờ xử lý (${p})`], ["done", `Đã xử lý (${t.review.length - p})`], ["all", "Tất cả"]].map(([b, k]) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === b ? "on" : ""}`, onClick: () => r(b), children: k }, b)) }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: "Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát." })
    ] }),
    m.length === 0 && /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(Ne, { size: 30 }), title: c === "open" ? "Đã xử lý hết các mục" : "Không có mục nào" }),
    m.map((b) => {
      const k = Kt[b.reason_code] ?? { label: b.reason_code, tone: "muted" }, I = xn[b.status] ?? { label: b.status, tone: "muted" }, v = u[b.id] ?? "";
      return /* @__PURE__ */ n(
        "div",
        {
          id: `rv-${b.id}`,
          className: `sme-card sme-review ${he(k.tone)}`,
          style: s === b.id ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)" } : void 0,
          children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ n("span", { className: "sme-row", children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: b.id }),
                /* @__PURE__ */ e(R, { t: k.tone, children: k.label })
              ] }),
              /* @__PURE__ */ e(R, { t: I.tone, children: I.label })
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "10px 0 6px", fontSize: 13.5, lineHeight: 1.55 }, children: b.detail }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              ye(b.source_agent),
              " · ",
              ge(b.created_at),
              /* @__PURE__ */ e(Rt, { refs: b.evidence_refs, onOpen: a })
            ] }),
            b.status === "open" ? /* @__PURE__ */ n("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ e(
                "textarea",
                {
                  className: "sme-textarea",
                  value: v,
                  placeholder: "Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…",
                  onChange: (h) => y({ ...u, [b.id]: h.target.value })
                }
              ),
              /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ e(T, { disabled: !v.trim(), busy: l === b.id + "needs_info", onClick: () => N(b.id, "needs_info"), children: "Yêu cầu bổ sung" }),
                /* @__PURE__ */ e(T, { primary: !0, disabled: !v.trim(), busy: l === b.id + "confirmed", onClick: () => N(b.id, "confirmed"), children: "Xác nhận" })
              ] })
            ] }) : /* @__PURE__ */ n("div", { className: `sme-decision ${he(I.tone)}`, children: [
              /* @__PURE__ */ e("b", { children: I.label }),
              " bởi ",
              b.decided_by,
              " · ",
              ge(b.decided_at),
              /* @__PURE__ */ e("div", { style: { marginTop: 2 }, children: b.note })
            ] })
          ]
        },
        b.id
      );
    })
  ] }) : /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(Ne, { size: 30 }), title: "Không có mục cần rà soát" });
}
function Ts({ detail: t, onEvidence: s }) {
  const i = t.checklist, a = t.crosschecks, c = t.case.sales_handover, [r, u] = w("open"), [y, l] = w("ALL"), [o, p] = w(!1), m = (i == null ? void 0 : i.items) ?? [], N = P(() => m.filter((h) => h.rule_status !== "SKIPPED"), [m]), b = P(() => m.filter((h) => h.rule_status === "SKIPPED"), [m]), k = P(
    () => N.filter((h) => h.rule_status !== "PASS").length,
    [N]
  );
  Q(() => {
    k === 0 && r === "open" && u("all");
  }, [k, r]);
  const I = P(() => (o ? b : N).filter((d) => y !== "ALL" && d.group !== y ? !1 : o ? !0 : r === "open" ? d.rule_status !== "PASS" : r === "pass" ? d.rule_status === "PASS" : !0), [o, b, N, y, r]), v = P(
    () => ((a == null ? void 0 : a.rules) ?? []).filter((h) => o || h.status !== "SKIPPED"),
    [a, o]
  );
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    c && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Phiếu bàn giao từ ĐVKD (Sale)" }),
        /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          c.submitted_by,
          " · ",
          ge(c.submitted_at)
        ] })
      ] }),
      c.submission_note && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 6 }, children: [
        /* @__PURE__ */ e("b", { children: "Giải trình ĐVKD:" }),
        " ",
        c.submission_note
      ] }),
      (c.waivers ?? []).length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 6 }, children: [
        /* @__PURE__ */ n("b", { children: [
          "Các mục ĐVKD xin miễn / bổ sung sau (",
          c.waivers.length,
          "):"
        ] }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: c.waivers.map((h) => /* @__PURE__ */ n("li", { children: [
          /* @__PURE__ */ e("b", { children: h.title }),
          ": ",
          h.note || "Không có ghi chú"
        ] }, h.key)) })
      ] })
    ] }),
    a && /* @__PURE__ */ n("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "12px 14px 8px" }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "7 Quy tắc đối chiếu chéo trọng yếu (R1 → R7)" }),
        /* @__PURE__ */ e(R, { t: ve(a.overall_status).tone, children: ve(a.overall_status).label })
      ] }),
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 52 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Quy tắc đối chiếu" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ & Bằng chứng" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: v.map((h) => {
          const d = kn[h.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: h.id }),
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: h.title }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: h.detail })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-small", children: [
              h.document_refs.length > 0 && /* @__PURE__ */ e("span", { className: "sme-mono", children: h.document_refs.join(", ") }),
              h.evidence_refs.length > 0 && /* @__PURE__ */ e(Rt, { refs: h.evidence_refs, onOpen: s }),
              h.document_refs.length === 0 && h.evidence_refs.length === 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" })
            ] }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: d.tone, children: d.label }) })
          ] }, h.id);
        }) })
      ] })
    ] }),
    i && /* @__PURE__ */ n("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "12px 14px 8px", gap: 8 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ e("h3", { className: "sme-h3", children: "SME Master Checklist 2 lớp (Nhóm A → I)" }),
          /* @__PURE__ */ e(R, { t: ve(i.overall_status).tone, children: ve(i.overall_status).label }),
          /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Lt(i.counts) })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: b.length > 0 && /* @__PURE__ */ n(
          T,
          {
            className: o ? "sme-toggle-on" : void 0,
            onClick: () => p((h) => !h),
            title: "Các mục không áp dụng được ẩn mặc định",
            children: [
              o ? /* @__PURE__ */ e(nn, { size: 13 }) : /* @__PURE__ */ e(ht, { size: 13 }),
              o ? "Quay lại mục áp dụng" : `Hiện mục không áp dụng (${b.length})`
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "0 14px 10px", gap: 8 }, children: [
        o ? /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          "Đang hiển thị ",
          b.length,
          " mục không áp dụng (mặc định ẩn vì điều kiện Lớp 1 không kích hoạt)."
        ] }) : /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["open", `Cần lưu ý (${k})`], ["pass", `Đạt (${i.counts.PASS ?? 0})`], ["all", `Tất cả áp dụng (${N.length})`]].map(([h, d]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": r === h,
            className: `sme-filter ${r === h ? "on" : ""}`,
            onClick: () => u(h),
            children: d
          },
          h
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-filters", role: "group", "aria-label": "Nhóm checklist", children: [
          /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${y === "ALL" ? "on" : ""}`, onClick: () => l("ALL"), children: "A–I" }),
          i.groups.filter((h) => o ? h.counts.SKIPPED > 0 : h.total_applicable > 0).map((h) => /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: `sme-filter ${y === h.group ? "on" : ""}`,
              onClick: () => l(h.group),
              title: h.label,
              children: h.group
            },
            h.group
          ))
        ] })
      ] }),
      I.length === 0 ? /* @__PURE__ */ e("div", { style: { padding: 16 }, children: /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(Ne, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Hạng mục, Điều kiện (Lớp 1) & Rule (Lớp 2)" }),
          /* @__PURE__ */ e("th", { children: "Nguồn" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Trạng thái" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: I.map((h) => {
          const d = Dt[h.rule_status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-small", children: h.group }),
                /* @__PURE__ */ e("span", { className: "sme-strong", children: h.title }),
                h.crosscheck_refs.length > 0 && /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: h.crosscheck_refs.join(", ") })
              ] }),
              /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
                "ĐK: ",
                h.condition_label
              ] }),
              /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
                "Rule: ",
                h.rule_label
              ] }),
              h.fail_reasons.length > 0 && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: h.rule_status === "FAIL" ? "var(--danger)" : void 0 }, children: h.fail_reasons.join("; ") })
            ] }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: h.owner_role === "RM_INTERNAL" ? "accent" : "muted", children: h.owner_role === "RM_INTERNAL" ? "ĐVKD nội bộ" : "Khách hàng" }) }),
            /* @__PURE__ */ e("td", { className: "sme-mono sme-small", children: h.document_refs.length ? h.document_refs.join(", ") : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: d.tone, children: d.label }) })
          ] }, h.key);
        }) })
      ] })
    ] })
  ] });
}
function Is({ detail: t }) {
  if (!t.audit.length) return /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(an, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (a) => a.action === "verification" ? a.passed ? "ok" : "danger" : a.action === "review_decide" || a.action === "case_handover_received" ? "accent" : a.action === "review_add" ? "warn" : "muted", i = (a) => {
    var r, u;
    const c = a.agent ? ye(a.agent) : a.actor ?? a.by ?? "";
    switch (a.action) {
      case "result_put":
        return `${c} lưu kết quả v${a.version}${a.rerun_reason ? ` (chạy lại: ${a.rerun_reason})` : ""}`;
      case "verification":
        return `${c} v${a.version}: ${a.passed ? "đạt kiểm chứng" : "bị chặn"}`;
      case "evidence_add":
        return `${c} thêm ${(a.ids ?? []).join(", ")}`;
      case "review_add":
        return `${c} thêm ${a.id} (${((r = Kt[a.reason_code]) == null ? void 0 : r.label) ?? a.reason_code})`;
      case "review_decide":
        return `${a.actor} ${((u = xn[a.status]) == null ? void 0 : u.label.toLowerCase()) ?? a.status} ${a.id}`;
      case "case_handover_received":
        return `Nhận từ ${["sale", "sme-sales"].includes(a.from_app ?? "sale") ? "bước Hoàn thiện hồ sơ" : a.from_app} bởi ${a.by ?? ""}, ${a.documents ?? 0} chứng từ (${a.files_copied ?? 0} file)`;
      case "case_create":
        return `Luồng ${a.flow}, ${a.documents} chứng từ`;
      default:
        return c;
    }
  };
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t.audit].reverse().map((a, c) => /* @__PURE__ */ n("div", { className: `sme-tl-item ${he(s(a))}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", style: { fontSize: 13 }, children: cs[a.action] ?? a.action }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: ge(a.ts) })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: i(a) })
  ] }, c)) }) });
}
function Es({ detail: t, flow: s, onAgent: i }) {
  return /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: wn.map((a) => /* @__PURE__ */ n("div", { className: "sme-phase", children: [
    /* @__PURE__ */ e("span", { className: "sme-phase-name", children: a.name }),
    a.agents.map((c) => {
      const r = c === "industry" && s !== "B" && !t.results[c], u = r ? "none" : bt(t.results[c]);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${he(Ye[u].tone)} ${r || u === "none" ? "skip" : ""}`,
          disabled: r || u === "none",
          title: r ? "Chỉ chạy ở luồng B" : Ye[u].label,
          onClick: () => i(c),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(Nn, { state: u, size: 12 }) }),
            /* @__PURE__ */ n("span", { children: [
              ye(c),
              r ? " (luồng B)" : ""
            ] })
          ]
        },
        c
      );
    })
  ] }, a.name)) }) });
}
function xt({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function zs({
  caseId: t,
  assistantOpen: s,
  syncTick: i,
  onBack: a,
  onToggleAssistant: c,
  onAskAssistant: r,
  onCaseMetaChange: u
}) {
  var Se, fe, Ae, Te, ae;
  const y = Oe(), [l, o] = w(null), [p, m] = w(null), [N, b] = w(!1), [k, I] = w("overview"), [v, h] = w(null), [d, K] = w(null), [H, V] = w(null), [O, E] = w(null), B = te(0), S = te(!1), L = async (C) => {
    E(C);
    try {
      const _ = await y.get(`${Ge}/cases/${t}/documents/${C}/file`), M = atob(_.content_b64), W = new Uint8Array(M.length);
      for (let le = 0; le < M.length; le++) W[le] = M.charCodeAt(le);
      const Y = new Blob([W], { type: _.mime || "application/octet-stream" }), ne = URL.createObjectURL(Y);
      if (_.mime.startsWith("image/") || _.mime === "application/pdf" || _.mime.startsWith("text/")) {
        if (!window.open(ne, "_blank", "noopener")) {
          const pe = document.createElement("a");
          pe.href = ne, pe.download = _.name, pe.click();
        }
      } else {
        const le = document.createElement("a");
        le.href = ne, le.download = _.name, le.click();
      }
      setTimeout(() => URL.revokeObjectURL(ne), 6e4);
    } catch (_) {
      m(Ce(_));
    } finally {
      E(null);
    }
  }, x = Z(async (C = !1) => {
    if (!(C && S.current)) {
      C ? S.current = !0 : b(!0);
      try {
        o(await y.get(`${Ge}/cases/${t}`)), m(null), B.current = Date.now();
      } catch (_) {
        C || m(Ce(_));
      } finally {
        C ? S.current = !1 : b(!1);
      }
    }
  }, [y, t]);
  Q(() => {
    x();
  }, [x]), Q(() => {
    i > 0 && x(!0);
  }, [i, x]), Q(() => {
    const C = () => {
      document.visibilityState !== "hidden" && Date.now() - B.current >= 3e3 && x(!0);
    };
    return window.addEventListener("focus", C), document.addEventListener("visibilitychange", C), () => {
      window.removeEventListener("focus", C), document.removeEventListener("visibilitychange", C);
    };
  }, [x]);
  const q = P(() => l ? ds(l) : {}, [l]), G = (l == null ? void 0 : l.review.filter((C) => C.status === "open")) ?? [], z = P(
    () => l ? Qe.filter((C) => bt(l.results[C]) === "blocked").length : 0,
    [l]
  ), D = (Se = q.policy) == null ? void 0 : Se.rows.filter((C) => C.status === "not_met").length, U = ((Ae = (fe = q.dscr) == null ? void 0 : fe.scenarios.find((C) => C.stress_pct === 0)) == null ? void 0 : Ae.dscr) ?? null, J = (C) => {
    h(C), I("evidence");
  }, ee = (C) => {
    K(C), I("review");
  }, ce = (C) => {
    V(C), I("agents");
  }, be = async (C, _, M) => {
    try {
      return await y.post(`${Ge}/cases/${t}/review/${C}`, { status: _, note: M }), await x(), !0;
    } catch (W) {
      return m(Ce(W)), !1;
    }
  }, X = l == null ? void 0 : l.case, f = (X == null ? void 0 : X.customer) ?? {}, F = (X == null ? void 0 : X.request) ?? {}, A = f.name ? String(f.name) : void 0, $ = (X == null ? void 0 : X.flow) ?? "A", ue = G.length > 0 || z > 0;
  Q(() => {
    u({ customerName: A, flow: $, hasIssues: ue });
  }, [A, $, ue, u]);
  const ie = () => r(`Chạy thẩm định hồ sơ ${t}, luồng ${$}.`, "prefill"), se = (C, _) => r(
    `Giải thích chi tiết kết quả, bằng chứng và điểm cần lưu ý của agent ${_} (${C}) trên hồ sơ ${t}.`,
    "prefill"
  ), ke = P(() => {
    var _;
    const C = (_ = l == null ? void 0 : l.checklist) == null ? void 0 : _.counts;
    return C ? (C.MISSING_REQUIRED ?? 0) + (C.FAIL ?? 0) + (C.UNDETERMINED_CONDITION ?? 0) : 0;
  }, [l]), Fe = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Checklist & Đối chiếu", count: ke || void 0 },
    { key: "agents", label: "Kết quả agent", count: l ? Object.keys(l.results).length : void 0 },
    { key: "evidence", label: "Bằng chứng", count: l ? Object.keys(l.evidence).length : void 0 },
    { key: "review", label: "Rà soát", count: G.length || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: a, children: [
          /* @__PURE__ */ e(ln, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: String(f.name ?? t) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          X && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            X.flow
          ] }),
          (X == null ? void 0 : X.sales_handover) && /* @__PURE__ */ e(R, { t: "accent", children: "Nhận từ ĐVKD" }),
          (l == null ? void 0 : l.checklist) && /* @__PURE__ */ e(
            R,
            {
              t: ve(l.checklist.overall_status).tone,
              title: `Kiểm tra quy tắc Master Checklist: ${Lt(l.checklist.counts)}`,
              children: ve(l.checklist.overall_status).label
            }
          ),
          f.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(f.industry_code)
          ] }),
          F.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: et[F.purpose] ?? F.purpose }),
          X && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Tạo ",
            ge(X.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(T, { onClick: () => x(), busy: N, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(dt, { size: 14 }) }),
        /* @__PURE__ */ n(
          T,
          {
            className: s ? "sme-toggle-on" : void 0,
            "aria-pressed": s,
            onClick: c,
            title: s ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
            children: [
              /* @__PURE__ */ e(xe, { size: 14 }),
              " Trợ lý thẩm định"
            ]
          }
        ),
        /* @__PURE__ */ n(T, { primary: !0, onClick: ie, children: [
          /* @__PURE__ */ e(sn, { size: 14 }),
          " Chạy thẩm định"
        ] })
      ] })
    ] }),
    p && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(pt, { title: "Có lỗi khi làm việc với hồ sơ", children: p }) }),
    !l && !p && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "70%" } })
    ] }),
    l && X && /* @__PURE__ */ n($e, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          oe,
          {
            icon: /* @__PURE__ */ e(rn, { size: 18 }),
            label: "Số tiền đề nghị",
            value: Et(F.amount).replace(" đ", ""),
            hint: [F.term_months ? `${F.term_months} tháng` : null, F.annual_rate_pct ? `lãi ${re(F.annual_rate_pct)}%/năm` : null].filter(Boolean).join(" · ") || "VND"
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: U == null ? "muted" : ((Te = q.dscr) == null ? void 0 : Te.threshold) !== void 0 && U < q.dscr.threshold ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Fn, { size: 18 }),
            label: "DSCR cơ sở",
            value: re(U),
            hint: ((ae = q.dscr) == null ? void 0 : ae.threshold) !== void 0 ? `Ngưỡng ≥ ${re(q.dscr.threshold)}` : "Chưa có phân tích"
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: D == null ? "muted" : D > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(cn, { size: 18 }),
            label: "Điều kiện không đạt",
            value: D ?? "—",
            hint: q.policy ? [`${q.policy.rows.length} điều kiện`, q.policy.product].filter(Boolean).join(" · ") : "Chưa kiểm tra chính sách"
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: G.length ? "warn" : "ok",
            icon: /* @__PURE__ */ e(Ct, { size: 18 }),
            label: "Chờ cán bộ rà soát",
            value: G.length,
            hint: `${l.review.length} mục tổng cộng`
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(Es, { detail: l, flow: X.flow, onAgent: ce }) }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Fe.map((C) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": k === C.key,
              className: `sme-tab ${k === C.key ? "on" : ""}`,
              onClick: () => I(C.key),
              children: [
                C.label,
                C.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: C.count })
              ]
            },
            C.key
          )) }),
          k === "overview" && /* @__PURE__ */ e(Ns, { detail: l, m: q, syncTick: i, onEvidence: J, goAgents: () => I("agents") }),
          k === "checklist" && /* @__PURE__ */ e(Ts, { detail: l, onEvidence: J }),
          k === "agents" && /* @__PURE__ */ e(
            Cs,
            {
              detail: l,
              openAgent: H,
              onEvidence: J,
              onRunAssessment: ie,
              onAskAgent: se
            }
          ),
          k === "evidence" && /* @__PURE__ */ e(Ss, { detail: l, focus: v }),
          k === "review" && /* @__PURE__ */ e($s, { detail: l, focus: d, onDecide: be, onEvidence: J }),
          k === "audit" && /* @__PURE__ */ e(Is, { detail: l })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Cần xử lý" }),
              /* @__PURE__ */ e(R, { t: G.length ? "warn" : "ok", children: G.length })
            ] }),
            G.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn mục chờ rà soát." }),
            G.slice(0, 6).map((C) => {
              const _ = Kt[C.reason_code] ?? { label: C.reason_code, tone: "muted" };
              return /* @__PURE__ */ n("button", { type: "button", className: "sme-todo", onClick: () => ee(C.id), children: [
                /* @__PURE__ */ e(R, { t: _.tone, children: C.id }),
                /* @__PURE__ */ n("span", { className: "sme-todo-text", children: [
                  /* @__PURE__ */ n("b", { children: [
                    _.label,
                    "."
                  ] }),
                  " ",
                  C.detail
                ] })
              ] }, C.id);
            }),
            G.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => I("review"), children: [
              "Xem thêm ",
              G.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Khách hàng" }),
            /* @__PURE__ */ e(xt, { label: "CIF", children: String(f.cif ?? "—") }),
            /* @__PURE__ */ e(xt, { label: "Mã số thuế", children: String(f.tax_id ?? "—") }),
            /* @__PURE__ */ e(xt, { label: "Số năm hoạt động", children: f.years_in_operation ?? "—" }),
            F.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(F.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Chứng từ" }),
              /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: X.documents.length })
            ] }),
            X.documents.map((C) => /* @__PURE__ */ n("div", { className: "sme-row sme-small", style: { padding: "5px 0", gap: 6 }, children: [
              /* @__PURE__ */ e($t, { size: 14, className: "sme-muted" }),
              /* @__PURE__ */ e("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, title: C.name, children: C.name }),
              /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: C.id }),
              C.file && /* @__PURE__ */ e(T, { busy: O === C.id, onClick: () => L(C.id), title: "Xem hoặc tải chứng từ", children: /\.(pdf|png|jpe?g|webp|txt)$/i.test(C.name) ? /* @__PURE__ */ e(ht, { size: 12 }) : /* @__PURE__ */ e(on, { size: 12 }) })
            ] }, C.id))
          ] }),
          l.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(dn, { size: 13 }),
            " Hoạt động gần nhất ",
            ge(l.audit[l.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
It();
const Vt = "sme-lending:assistant-open", Xt = "sme-lending:assistant-width", As = "sme-lending-chat-";
function Ds({ onNewDossier: t }) {
  const [s, i] = w(null), [a, c] = w(() => pn(Vt)), [r, u] = w(() => bn(Xt)), [y, l] = w(null), [o, p] = w(null), [m, N] = w(null), b = te(0), { syncTick: k } = vn(a, 3500), I = Z((E) => {
    c((B) => {
      const S = typeof E == "function" ? E(B) : E;
      return gn(Vt, S), S;
    });
  }, []), v = Z((E) => {
    const B = gt(E);
    u(B), fn(Xt, B);
  }, []), h = Z((E, B = "prefill") => {
    I(!0), l({ id: ++b.current, prompt: E, mode: B });
  }, [I]), d = Z(() => {
    l(null);
  }, []), K = Z((E) => {
    N(null), p(null), i(E);
  }, []), H = Z(() => {
    p(null), i(null);
  }, []), V = Z((E) => {
    p((B) => B === E || B && E && B.customerName === E.customerName && B.flow === E.flow && B.hasIssues === E.hasIssues ? B : E);
  }, []), O = P(() => {
    if (!s)
      return [{
        label: "Hồ sơ chờ xử lý",
        prompt: "Rà soát danh sách các hồ sơ thẩm định đang có mục chờ cán bộ xử lý hoặc kết quả bị chặn kiểm chứng."
      }];
    const E = [
      {
        label: "Chạy thẩm định",
        prompt: `Chạy thẩm định hồ sơ ${s}, luồng ${(o == null ? void 0 : o.flow) ?? "A"}.`
      },
      {
        label: "Giải thích kết quả",
        prompt: `Giải thích tóm tắt kết quả thẩm định, các cảnh báo mức cao và mã bằng chứng chính của hồ sơ ${s}.`
      }
    ];
    return o != null && o.hasIssues && E.push({
      label: "Phân tích mục chặn",
      prompt: `Phân tích các mục chờ rà soát và kết quả bị chặn kiểm chứng của hồ sơ ${s}, nêu rõ chứng từ cần đối chiếu.`
    }), E;
  }, [s, o]);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: s ? /* @__PURE__ */ e(
      zs,
      {
        caseId: s,
        assistantOpen: a,
        syncTick: k,
        onBack: H,
        onToggleAssistant: () => I((E) => !E),
        onAskAssistant: h,
        onCaseMetaChange: V
      }
    ) : /* @__PURE__ */ e(
      ps,
      {
        onOpen: K,
        assistantOpen: a,
        syncTick: k,
        onToggleAssistant: () => I((E) => !E),
        onAskAssistant: h,
        onCreatedCase: N,
        onNewDossier: t
      }
    ) }),
    a && /* @__PURE__ */ e(
      yn,
      {
        storagePrefix: "sme-lending",
        chatPrefix: As,
        agent: ss,
        panelLabel: "Trợ lý thẩm định",
        newIntakePrompt: "Chạy thẩm định hồ sơ: ",
        newSessionTitle: "Hồ sơ SME mới",
        caseTitlePrefix: "Thẩm định",
        chips: O,
        attachDefaultPrefix: s ? `Tôi gửi thêm chứng từ cho hồ sơ thẩm định ${s}: ` : void 0,
        embedPlaceholder: s ? `Hỏi trợ lý hoặc chạy thẩm định cho ${s}...` : "Hỏi trợ lý về hồ sơ đã bàn giao hoặc nhờ chạy thẩm định...",
        width: r,
        onWidthChange: v,
        onClose: () => I(!1),
        caseId: s,
        customerName: s ? o == null ? void 0 : o.customerName : void 0,
        intent: y,
        onConsumeIntent: d,
        createdCase: m,
        onOpenCase: K,
        onDismissCreatedCase: () => N(null)
      }
    )
  ] }) });
}
const Ue = "/apps/sme-lending/api/sales", Wt = {
  draft: { label: "Khởi tạo", tone: "muted" },
  collecting: { label: "Đang thu thập", tone: "warn" },
  ready: { label: "Đủ điều kiện trình", tone: "ok" },
  submitted: { label: "Đã bàn giao", tone: "info" }
}, Sn = {
  open: { label: "Chưa bổ sung", tone: "danger" },
  requested: { label: "Chờ khách hàng", tone: "info" },
  waived: { label: "Xin miễn / Bổ sung sau", tone: "muted" },
  resolved: { label: "Đạt", tone: "ok" },
  ok: { label: "Đạt", tone: "ok" }
}, qt = { email: "Email", zalo: "Zalo", phone_script: "Kịch bản gọi" }, Ls = {
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
}, Ze = (t) => t.rule_status === "SKIPPED" || t.applicable === !1, Ve = (t) => !Ze(t) && (t.owner_role ?? "CUSTOMER") === "CUSTOMER" && t.rule_status !== "UNDETERMINED_CONDITION" && !!t.ask, $n = (t) => t ? t.startsWith("agent:") || t === "sme-assistant" || t === "dossier-coach" ? "Trợ lý AI" : "ĐVKD" : "Hệ thống", Ks = "sme-assistant", Rs = "sme-lending-chat-sale-";
function qs(t) {
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
function Xe(t, s, i) {
  if (s == null || s === "") return "—";
  if (typeof s == "boolean") return s ? "Có" : "Không";
  if (t === "request.purpose" && typeof s == "string") return et[s] ?? s;
  if (t === "request.product_code" && typeof s == "string") {
    const a = i == null ? void 0 : i.products.products.find((c) => c.code === s);
    return a ? `${a.code} · ${a.name}` : s;
  }
  return typeof s == "number" ? /fiscal_year/.test(t) ? String(s) : /_pct$|ty_le/.test(t) ? `${re(s, 2)}%` : /term_months|so_thang/.test(t) ? `${s} tháng` : /years_in_operation|so_nam/.test(t) ? `${re(s, 1)} năm` : /amount|capital|revenue|income|assets|equity|investment|value|exposure|so_tien|gia_tri|doanh_thu|von|tai_san|loi_nhuan/.test(t) ? Et(s) : s.toLocaleString("vi-VN") : typeof s == "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) ? _e(s) : String(s);
}
function ot(t, s) {
  return s == null || s === "" ? "—" : t === "loan_amount" ? ze(s) : t === "term_months" ? `${re(s, 0)} tháng` : t === "years_in_operation" ? `${re(s, 1)} năm` : t === "equity_contribution_pct" ? `${re(s, 1)}%` : typeof s == "number" ? re(s) : String(s);
}
function Ms(t, s, i = "email", a = !1) {
  const c = qt[i], r = a ? "nhắc khách bổ sung (giọng nhắc lịch sự các mục đã yêu cầu)" : "xin khách bổ sung", u = s.map((y) => `- ${y.title} [${y.key}]`).join(`
`);
  return `Soạn ${c} ${r} cho hồ sơ ${t} (kênh: ${i}) gồm các hạng mục sau:
${u}`;
}
function Bs(t, s) {
  var b, k, I, v, h;
  const { case: i, overview: a } = t, c = (s == null ? void 0 : s.documents.types) ?? {}, r = a.items.filter((d) => !Ze(d)), u = r.filter((d) => d.blocking).length, y = r.filter((d) => d.blocking && ["ok", "resolved", "waived"].includes(d.status)).length, l = [
    `PHIẾU BÀN GIAO HỒ SƠ THẨM ĐỊNH: ${i.case_id}`,
    `Khách hàng: ${((b = i.customer) == null ? void 0 : b.name) ?? "Chưa rõ"} | MST: ${((k = i.customer) == null ? void 0 : k.tax_id) ?? "—"} | Luồng: ${i.flow}`,
    `Master Checklist: ${a.checklist_overall ?? "INCOMPLETE"} | Hạng mục áp dụng: ${y}/${u}`,
    `Trạng thái: ${a.readiness.ready ? "Đủ điều kiện trình" : `Còn ${a.readiness.blocking_open.length} mục chặn`}`,
    "",
    "1. THÔNG TIN KHÁCH HÀNG & ĐỀ XUẤT"
  ];
  for (const d of a.profile)
    l.push(`- ${d.label}: ${Xe(d.path, d.value, s)}`);
  l.push("", `2. CHỨNG TỪ ĐỐI CHIẾU (${i.documents.length})`), i.documents.length === 0 && l.push("- Chưa có chứng từ");
  for (const d of i.documents) {
    const K = d.type ? ((I = c[d.type]) == null ? void 0 : I.label) ?? d.type : "Chưa phân loại";
    l.push(`- ${d.id}: ${K} (${d.name}${d.issued_date ? `, lập ${_e(d.issued_date)}` : ""})${d.summary ? ` — ${d.summary}` : ""}`);
  }
  const o = ((v = a.crosschecks) == null ? void 0 : v.rules) ?? [];
  if (o.length > 0) {
    l.push("", `3. ĐỐI CHIẾU CHÉO 7 RULE (${((h = a.crosschecks) == null ? void 0 : h.overall_status) ?? "—"})`);
    for (const d of o.filter((K) => K.status !== "SKIPPED"))
      l.push(`- [${d.id}] ${d.title}: ${d.status} — ${d.detail}`);
  }
  const p = (a.policy_checks ?? []).filter((d) => d.status === "not_met");
  if (p.length > 0) {
    l.push("", "4. LƯU Ý ĐIỀU KIỆN CHÍNH SÁCH SƠ BỘ");
    for (const d of p)
      l.push(`- ${d.label}: thực tế ${ot(d.fact, d.actual)}, yêu cầu ${d.op} ${ot(d.fact, d.threshold)} (${d.clause})`);
  }
  const m = r.filter((d) => d.status === "waived");
  if (m.length > 0) {
    l.push("", "5. CÁC HẠNG MỤC XIN MIỄN / BỔ SUNG SAU KÈM GIẢI TRÌNH");
    for (const d of m)
      l.push(`- ${d.title}: ${d.note || "Không có ghi chú"}`);
  }
  const N = r.filter((d) => d.blocking && (d.status === "open" || d.status === "requested"));
  if (N.length > 0) {
    l.push("", "6. CÁC HẠNG MỤC CHẶN CHƯA ĐẠT (TRÌNH KÈM GIẢI TRÌNH)");
    for (const d of N)
      l.push(`- [${d.owner_role ?? "CUSTOMER"}] ${d.title}: ${d.rule_status ?? Sn[d.status].label}${d.due_date ? ` (hạn ${_e(d.due_date)})` : ""}`);
  }
  return l.join(`
`);
}
function Hs({
  width: t,
  onWidthChange: s,
  onClose: i,
  caseId: a,
  customerName: c,
  readOnly: r = !1,
  hasOpenItems: u = !1,
  intent: y,
  onConsumeIntent: l,
  createdCase: o,
  onOpenCase: p,
  onDismissCreatedCase: m,
  onQuickDraft: N
}) {
  const b = P(() => {
    if (!a)
      return [{
        label: "Việc hôm nay",
        prompt: "Rà soát danh sách hồ sơ đang mở hôm nay, nêu các hồ sơ quá hạn hoặc sắp đủ điều kiện trình."
      }];
    if (r) return [];
    const k = [{
      label: "Cập nhật",
      prompt: `Cập nhật thông tin hồ sơ ${a}: `
    }];
    return u && N && k.push({ label: "Soạn thư", onClick: N }), k.push({
      label: "Rà soát",
      prompt: `Rà soát các hạng mục chặn và điều kiện chính sách còn thiếu của hồ sơ ${a}, đề xuất phương án xử lý.`
    }), k;
  }, [a, r, u, N]);
  return /* @__PURE__ */ e(
    yn,
    {
      storagePrefix: "sme-lending-sale",
      chatPrefix: Rs,
      agent: Ks,
      panelLabel: "Trợ lý hồ sơ",
      newIntakePrompt: "Tạo hồ sơ mới cho khách hàng: ",
      newSessionTitle: "Hồ sơ SME mới",
      caseTitlePrefix: "Hồ sơ",
      chips: b,
      embedPlaceholder: a ? `Nhắn trợ lý hoặc kéo chứng từ vào cho ${a}...` : "Kể về khách hàng mới hoặc kéo bộ chứng từ vào đây...",
      width: t,
      onWidthChange: s,
      onClose: i,
      caseId: a,
      customerName: c,
      intent: y,
      onConsumeIntent: l,
      createdCase: o,
      onOpenCase: p,
      onDismissCreatedCase: m
    }
  );
}
function Tn(t) {
  var i;
  if (t.stage === "submitted") return { label: "Đã bàn giao", t: "info" };
  if (t.overdue > 0) return { label: `${t.overdue} quá hạn`, t: "danger" };
  if (t.ready) return { label: "Đủ điều kiện trình", t: "ok" };
  const s = ((i = t.progress) == null ? void 0 : i.to_request) ?? t.actionable_blocking ?? t.blocking_open;
  return s > 0 ? { label: `Thiếu ${s} mục chặn`, t: "warn" } : t.requested > 0 ? { label: `Chờ KH (${t.requested})`, t: "info" } : { label: "Khởi tạo", t: "muted" };
}
function In(t) {
  if (t.progress) return { done: t.progress.mandatory_done, total: t.progress.mandatory_total };
  let s = 0, i = 0;
  for (const a of t.groups)
    s += a.done, i += a.total;
  return { done: s, total: i };
}
function Ps({ rows: t, onOpen: s }) {
  return t.length === 0 ? /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e($t, { size: 28 }), title: "Không có hồ sơ phù hợp" }) : /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
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
    /* @__PURE__ */ e("tbody", { children: t.map((i) => {
      var y;
      const a = Tn(i), { done: c, total: r } = In(i), u = ((y = i.progress) == null ? void 0 : y.to_request) ?? i.actionable_blocking ?? i.blocking_open;
      return /* @__PURE__ */ n("tr", { className: "click", onClick: () => s(i.case_id), children: [
        /* @__PURE__ */ e("td", { className: "sme-mono", style: { whiteSpace: "nowrap" }, children: i.case_id }),
        /* @__PURE__ */ n("td", { children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: i.customer_name || "Chưa có tên doanh nghiệp" }),
          /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
            i.tax_id ? `MST ${i.tax_id}` : "Chưa có MST",
            " · Luồng ",
            i.flow
          ] })
        ] }),
        /* @__PURE__ */ e("td", { children: i.product_code || /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
        /* @__PURE__ */ e("td", { className: "sme-num sme-strong", children: ze(i.amount) }),
        /* @__PURE__ */ e("td", { className: "sme-num", children: i.term_months ? `${i.term_months} tháng` : "—" }),
        /* @__PURE__ */ n("td", { className: "sme-num sme-mono", children: [
          c,
          "/",
          r
        ] }),
        /* @__PURE__ */ n("td", { className: "sme-small", children: [
          u > 0 && /* @__PURE__ */ n("span", { children: [
            u,
            " cần xử lý"
          ] }),
          u > 0 && i.requested > 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: " · " }),
          i.requested > 0 && /* @__PURE__ */ n("span", { className: "sme-muted", children: [
            i.requested,
            " chờ KH",
            i.next_due_date ? ` (hạn ${_e(i.next_due_date)})` : ""
          ] }),
          u === 0 && i.requested === 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" })
        ] }),
        /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: a.t, children: a.label }) }),
        /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: zt(i.updated_at) })
      ] }, i.case_id);
    }) })
  ] }) });
}
const Qt = ({ stage: t }) => /* @__PURE__ */ e(R, { t: Wt[t].tone, children: Wt[t].label });
function En(t) {
  return t.done === t.total && t.total > 0 ? "ok" : t.blocked > 0 ? "danger" : t.done > 0 ? "warn" : "muted";
}
function Os({ g: t, size: s = 12 }) {
  return t.done === t.total && t.total > 0 ? /* @__PURE__ */ e(mt, { size: s }) : t.blocked > 0 ? /* @__PURE__ */ e(en, { size: s }) : t.done > 0 ? /* @__PURE__ */ e(tn, { size: s }) : /* @__PURE__ */ e(St, { size: s });
}
function Fs({ groups: t, activeGroup: s, onSelectGroup: i }) {
  return t.length === 0 ? null : /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: t.map((a) => {
    const c = En(a), r = s === a.group;
    return /* @__PURE__ */ n("div", { className: "sme-phase", children: [
      /* @__PURE__ */ e("span", { className: "sme-phase-name", children: a.label }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${he(c)} ${r ? "ss-active-node" : ""}`,
          title: `${a.label}: ${a.done}/${a.total} hạng mục đạt${a.blocked ? `, ${a.blocked} chặn` : ""}${a.skipped ? `, ${a.skipped} không áp dụng (ẩn)` : ""}`,
          onClick: () => i(r ? null : a.group),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(Os, { g: a }) }),
            /* @__PURE__ */ n("span", { children: [
              a.done,
              "/",
              a.total,
              r ? " · lọc" : ""
            ] })
          ]
        }
      )
    ] }, a.group);
  }) }) });
}
const js = [2, 3, 5, 7];
function Mt({ label: t = "Hạn cam kết bổ sung", confirmLabel: s = "Xác nhận", busy: i, onConfirm: a, onCancel: c }) {
  const [r, u] = w(() => Ot(3));
  return /* @__PURE__ */ n("div", { className: "ss-due-row", children: [
    /* @__PURE__ */ n("span", { className: "sme-small sme-muted sme-row", style: { gap: 5 }, children: [
      /* @__PURE__ */ e(jn, { size: 13 }),
      " ",
      t,
      ":"
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-filters", role: "group", "aria-label": "Chọn nhanh số ngày", children: js.map((y) => {
      const l = Ot(y);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-filter ${r === l ? "on" : ""}`,
          onClick: () => u(l),
          children: [
            "+",
            y,
            " ngày"
          ]
        },
        y
      );
    }) }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "date",
        className: "sme-input",
        style: { width: 148, padding: "4px 8px", fontSize: 12 },
        value: r,
        onChange: (y) => u(y.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 6, marginLeft: "auto" }, children: [
      c && /* @__PURE__ */ e(T, { onClick: c, children: "Huỷ" }),
      /* @__PURE__ */ e(T, { primary: !0, busy: i, disabled: !r, onClick: () => a(r), children: s })
    ] })
  ] });
}
function zn({ onPick: t }) {
  return /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: ["email", "zalo", "phone_script"].map((s) => /* @__PURE__ */ n(T, { onClick: () => t(s), children: [
    /* @__PURE__ */ e(Tt, { size: 13 }),
    " ",
    qt[s]
  ] }, s)) });
}
const Gs = `
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
`;
function Us() {
  const t = "sme-sales-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = Gs, document.head.appendChild(s);
}
const An = "sme-lending:sale-view", Vs = () => {
  try {
    return localStorage.getItem(An) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
};
function Xs({ r: t, onOpen: s }) {
  const i = Tn(t), { done: a, total: c } = In(t);
  return /* @__PURE__ */ n(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: s,
      onKeyDown: (r) => {
        (r.key === "Enter" || r.key === " ") && (r.preventDefault(), s());
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
          /* @__PURE__ */ e(R, { t: i.t, children: i.label })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: ze(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.product_code, t.term_months ? `${t.term_months} tháng` : null, t.purpose ? et[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${a}/${c} hạng mục bắt buộc đã đạt`, children: t.groups.map((r) => {
          const u = En(r);
          return /* @__PURE__ */ e(
            "span",
            {
              className: u === "muted" ? "none" : he(u),
              title: `${r.label}: ${r.done}/${r.total} hạng mục`
            },
            r.group
          );
        }) }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ n("span", { className: "sme-row", style: { gap: 6 }, children: [
            /* @__PURE__ */ n("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            /* @__PURE__ */ n("span", { className: "sme-mono", title: "Hạng mục bắt buộc đã đạt", children: [
              a,
              "/",
              c,
              " bắt buộc"
            ] }),
            (t.policy_breaches ?? 0) > 0 && /* @__PURE__ */ n(R, { t: "danger", children: [
              t.policy_breaches,
              " lệch chuẩn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            zt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function Ws({
  onOpen: t,
  catalog: s,
  coachOpen: i,
  syncTick: a,
  onToggleCoach: c,
  onAskCoach: r,
  onCreatedCase: u
}) {
  const y = Oe(), [l, o] = w(null), [p, m] = w(null), [N, b] = w(null), [k, I] = w(!1), [v, h] = w("all"), [d, K] = w(""), [H, V] = w(Vs), O = te(0), E = te(!1), B = te(null), S = (z) => {
    V(z);
    try {
      localStorage.setItem(An, z);
    } catch {
    }
  }, L = Z(async (z = !1) => {
    if (!(z && E.current)) {
      z ? E.current = !0 : I(!0);
      try {
        const D = await y.get(`${Ue}/cases`);
        if (B.current === null)
          B.current = new Set(D.cases.map((U) => U.case_id));
        else {
          const U = D.cases.find((J) => !B.current.has(J.case_id));
          D.cases.forEach((J) => B.current.add(J.case_id)), U && u({ caseId: U.case_id, name: U.customer_name || U.case_id });
        }
        o(D.cases), m(D.today), b(null), O.current = Date.now();
      } catch (D) {
        z || b(Ce(D));
      } finally {
        z ? E.current = !1 : I(!1);
      }
    }
  }, [y, u]);
  Q(() => {
    L();
  }, [L]), Q(() => {
    a > 0 && L(!0);
  }, [a, L]), Q(() => {
    const z = () => {
      document.visibilityState !== "hidden" && Date.now() - O.current >= 3e3 && L(!0);
    };
    return window.addEventListener("focus", z), document.addEventListener("visibilitychange", z), () => {
      window.removeEventListener("focus", z), document.removeEventListener("visibilitychange", z);
    };
  }, [L]);
  const x = P(() => {
    const z = l ?? [], D = z.filter((f) => f.stage !== "submitted"), U = z.length - D.length, J = D.filter((f) => f.ready).length, ee = D.filter((f) => {
      var F;
      return (((F = f.progress) == null ? void 0 : F.to_request) ?? f.actionable_blocking ?? f.blocking_open) > 0 || (f.unclassified_docs ?? 0) > 0;
    }).length, ce = D.reduce((f, F) => {
      var A;
      return f + (((A = F.progress) == null ? void 0 : A.to_request) ?? F.actionable_blocking ?? F.blocking_open);
    }, 0), be = D.filter((f) => f.requested > 0 && f.overdue === 0).length, X = D.filter((f) => f.overdue > 0).length;
    return { live: D.length, submitted: U, ready: J, actionNeeded: ee, actionableItems: ce, waitingCases: be, overdueCases: X };
  }, [l]), q = P(() => {
    const z = d.trim().toLowerCase();
    return (l ?? []).filter((D) => {
      var U;
      return v === "submitted" && D.stage !== "submitted" || v !== "submitted" && v !== "all" && D.stage === "submitted" || v === "action" && (((U = D.progress) == null ? void 0 : U.to_request) ?? D.actionable_blocking ?? D.blocking_open) === 0 && (D.unclassified_docs ?? 0) === 0 || v === "waiting" && D.requested === 0 || v === "overdue" && D.overdue === 0 || v === "ready" && !D.ready ? !1 : z ? [D.customer_name, D.case_id, D.tax_id, D.product_code].some((J) => J == null ? void 0 : J.toLowerCase().includes(z)) : !0;
    });
  }, [l, v, d]), G = () => r("Tạo hồ sơ mới cho khách hàng: ", "new_intake");
  return /* @__PURE__ */ n($e, { children: [
    /* @__PURE__ */ e(
      un,
      {
        title: "Hoàn thiện hồ sơ Tín dụng SME",
        subtitle: "Quản lý danh mục hồ sơ ĐVKD, kiểm soát chứng từ bắt buộc, đối chiếu điều kiện sơ bộ và bàn giao Thẩm định",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(T, { onClick: () => L(), busy: k, children: [
            /* @__PURE__ */ e(dt, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            T,
            {
              className: i ? "sme-toggle-on" : void 0,
              "aria-pressed": i,
              onClick: c,
              title: i ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
              children: [
                /* @__PURE__ */ e(xe, { size: 14 }),
                " Trợ lý hồ sơ"
              ]
            }
          ),
          /* @__PURE__ */ n(T, { primary: !0, onClick: G, children: [
            /* @__PURE__ */ e(We, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      N && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(pt, { title: "Không tải được danh sách hồ sơ", children: N }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(
          oe,
          {
            icon: /* @__PURE__ */ e(lt, { size: 18 }),
            label: "Hồ sơ đang thu thập",
            value: l ? x.live : "…",
            hint: l ? `${x.submitted} hồ sơ đã bàn giao` : void 0
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: x.ready ? "ok" : "muted",
            icon: /* @__PURE__ */ e(Ne, { size: 18 }),
            label: "Đủ điều kiện trình",
            value: l ? x.ready : "…",
            hint: "Hoàn tất mục bắt buộc"
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: x.actionNeeded ? "warn" : "ok",
            icon: /* @__PURE__ */ e(Zt, { size: 18 }),
            label: "Cần ĐVKD xử lý",
            value: l ? x.actionNeeded : "…",
            hint: l ? `${x.actionableItems} mục chặn chưa yêu cầu` : void 0
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: x.overdueCases ? "danger" : x.waitingCases ? "info" : "muted",
            icon: /* @__PURE__ */ e(Gn, { size: 18 }),
            label: "Chờ khách hàng",
            value: p ? p.waiting : "…",
            hint: l ? x.overdueCases ? `${x.overdueCases} hồ sơ quá hạn cam kết` : `${x.waitingCases} hồ sơ đang theo dõi` : void 0
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
        ].map(([z, D]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": v === z,
            className: `sme-filter ${v === z ? "on" : ""}`,
            onClick: () => h(z),
            children: D
          },
          z
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ n("div", { className: "sme-filters", role: "tablist", "aria-label": "Chế độ hiển thị", children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": H === "cards",
                className: `sme-filter ${H === "cards" ? "on" : ""}`,
                onClick: () => S("cards"),
                children: "Thẻ hồ sơ"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": H === "table",
                className: `sme-filter ${H === "table" ? "on" : ""}`,
                onClick: () => S("table"),
                children: "Bảng danh mục"
              }
            )
          ] }),
          /* @__PURE__ */ n("label", { className: "sme-search", children: [
            /* @__PURE__ */ e(He, { size: 14, className: "sme-muted" }),
            /* @__PURE__ */ e("input", { value: d, onChange: (z) => K(z.target.value), placeholder: "Tìm doanh nghiệp, MST, mã hồ sơ, sản phẩm" })
          ] })
        ] })
      ] }),
      l === null && !N && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((z) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, z)) }),
      l && l.length === 0 && /* @__PURE__ */ e(
        de,
        {
          icon: /* @__PURE__ */ e(lt, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Khởi tạo hồ sơ với trợ lý trong chat: cung cấp thông tin khách hàng và đính kèm chứng từ.",
          action: /* @__PURE__ */ n(T, { primary: !0, onClick: G, children: [
            /* @__PURE__ */ e(We, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      l && l.length > 0 && q.length === 0 && /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(He, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      q.length > 0 && H === "cards" && /* @__PURE__ */ e("div", { className: "sme-cases", children: q.map((z) => /* @__PURE__ */ e(Xs, { r: z, onOpen: () => t(z.case_id) }, z.case_id)) }),
      q.length > 0 && H === "table" && /* @__PURE__ */ e(Ps, { rows: q, onOpen: t })
    ] })
  ] });
}
const it = [
  ["customer", "Cần xin KH", (t) => t.status === "open" && t.blocking && (t.owner_role ?? "CUSTOMER") === "CUSTOMER" && t.rule_status !== "UNDETERMINED_CONDITION"],
  ["rm", "ĐVKD nội bộ", (t) => t.status === "open" && t.blocking && t.owner_role === "RM_INTERNAL"],
  ["undetermined", "Chờ XĐ điều kiện", (t) => t.status === "open" && t.rule_status === "UNDETERMINED_CONDITION"],
  ["fail", "Không đạt rule", (t) => t.status === "open" && t.rule_status === "FAIL"],
  ["waiting", "Chờ khách", (t) => t.status === "requested"],
  ["done", "Đã đạt / Miễn", (t) => ["ok", "resolved", "waived"].includes(t.status)],
  ["all", "Tất cả áp dụng", () => !0]
];
function Qs({ it: t, asOf: s, groupLabel: i, checked: a, selectable: c, skippedView: r, readOnly: u, onToggle: y, onSet: l, onOpenDoc: o }) {
  const [p, m] = w("none"), [N, b] = w(""), [k, I] = w(!1), [v, h] = w(!1), d = Sn[t.status], K = t.rule_status ? Dt[t.rule_status] : null, H = t.status === "open", V = t.status === "requested" && !!t.due_date && t.due_date < s, O = t.owner_role === "RM_INTERNAL", E = async (S, L) => {
    I(!0), await l(t.key, S, N, L) && (m("none"), b("")), I(!1);
  }, B = async () => {
    t.ask && await At(t.ask) && (h(!0), setTimeout(() => h(!1), 1500));
  };
  return /* @__PURE__ */ n(hn, { children: [
    /* @__PURE__ */ n("tr", { children: [
      !u && !r && /* @__PURE__ */ e("td", { style: { width: 28 }, children: c && /* @__PURE__ */ e(
        "input",
        {
          type: "checkbox",
          className: "ss-check",
          checked: a,
          onChange: y,
          "aria-label": `Chọn ${t.title}`
        }
      ) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-strong", children: t.title }),
          /* @__PURE__ */ e(R, { t: O ? "accent" : "muted", children: O ? "ĐVKD nội bộ" : "Khách hàng" }),
          (t.crosscheck_refs ?? []).length > 0 && /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", title: "Rule đối chiếu chéo liên quan", children: t.crosscheck_refs.join(", ") })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 2 }, children: [
          i,
          t.condition_label ? ` · ĐK: ${t.condition_label}` : ""
        ] }),
        t.rule_label && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 2 }, children: [
          "Rule kiểm tra: ",
          t.rule_label
        ] }),
        t.reason && t.rule_status !== "MISSING_REQUIRED" && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: t.rule_status === "FAIL" ? "var(--danger)" : void 0 }, children: t.reason }),
        !r && (H || t.status === "requested") && t.ask && /* @__PURE__ */ n("div", { className: "sme-item-ask sme-between", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ e("b", { children: "Nội dung yêu cầu KH:" }),
            " ",
            t.ask
          ] }),
          /* @__PURE__ */ n(T, { onClick: B, title: "Sao chép nội dung yêu cầu", children: [
            v ? /* @__PURE__ */ e(rt, { size: 12 }) : /* @__PURE__ */ e(ct, { size: 12 }),
            " ",
            v ? "Đã chép" : "Chép"
          ] })
        ] }),
        !r && (H || t.status === "requested") && t.alternatives.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Chứng từ thay thế: ",
          t.alternatives.join("; ")
        ] })
      ] }),
      /* @__PURE__ */ e("td", { children: t.document_refs.length > 0 ? /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: t.document_refs.map((S) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: () => o(S), children: S }, S)) }) : /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: [
          K ? /* @__PURE__ */ e(R, { t: K.tone, children: K.label }) : /* @__PURE__ */ e(R, { t: d.tone, children: d.label }),
          !r && t.status === "requested" && /* @__PURE__ */ e(R, { t: "info", children: "Đã yêu cầu KH" }),
          !r && t.status === "waived" && /* @__PURE__ */ e(R, { t: "muted", children: "Xin miễn" }),
          V && /* @__PURE__ */ n(R, { t: "danger", children: [
            "Quá hạn (",
            _e(t.due_date),
            ")"
          ] })
        ] }),
        t.status === "requested" && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Đã yêu cầu ",
          _e(t.requested_at),
          t.due_date ? ` · hạn ${_e(t.due_date)}` : ""
        ] }),
        t.status === "waived" && t.note && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Lý do: ",
          t.note
        ] })
      ] }),
      !u && !r && /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
        H && Ve(t) && /* @__PURE__ */ n(T, { busy: k, onClick: () => m(p === "request" ? "none" : "request"), title: "Đánh dấu đã yêu cầu khách", children: [
          /* @__PURE__ */ e(mn, { size: 13 }),
          " Đã yêu cầu"
        ] }),
        H && t.kind !== "policy_precheck" && /* @__PURE__ */ n(
          T,
          {
            onClick: () => {
              m(p === "waive" ? "none" : "waive"), p === "waive" && b("");
            },
            title: "Xin miễn / bổ sung sau",
            children: [
              /* @__PURE__ */ e(Vn, { size: 13 }),
              " Xin miễn"
            ]
          }
        ),
        (t.status === "waived" || t.status === "requested") && /* @__PURE__ */ n(T, { busy: k, onClick: () => E("open"), title: "Mở lại hạng mục", children: [
          /* @__PURE__ */ e(Xn, { size: 13 }),
          " Mở lại"
        ] })
      ] }) })
    ] }),
    !u && !r && p === "request" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ e(
      Mt,
      {
        label: "Hạn khách hàng bổ sung",
        confirmLabel: "Xác nhận đã yêu cầu",
        busy: k,
        onCancel: () => m("none"),
        onConfirm: (S) => E("requested", S)
      }
    ) }) }),
    !u && !r && p === "waive" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ n("div", { className: "sme-stack", style: { gap: 8 }, children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          className: "sme-textarea",
          value: N,
          onChange: (S) => b(S.target.value),
          placeholder: "Ghi rõ căn cứ xin miễn hoặc cam kết bổ sung sau (đi kèm phiếu bàn giao Thẩm định)"
        }
      ),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ e(T, { onClick: () => {
          m("none"), b("");
        }, children: "Huỷ" }),
        /* @__PURE__ */ e(T, { primary: !0, busy: k, disabled: !N.trim(), onClick: () => E("waived"), children: "Xác nhận xin miễn" })
      ] })
    ] }) }) })
  ] });
}
function Ys({
  items: t,
  asOf: s,
  catalog: i,
  groupFilter: a,
  onClearGroup: c,
  readOnly: r,
  onSet: u,
  onBatchRequested: y,
  onDraft: l,
  onOpenDoc: o
}) {
  var X;
  const p = P(() => a ? t.filter((f) => f.group === a) : t, [t, a]), m = P(() => p.filter((f) => !Ze(f)), [p]), N = P(() => p.filter(Ze), [p]), b = Object.fromEntries(it.map(([f, , F]) => [f, m.filter(F).length])), k = ((X = it.find(([f]) => f !== "all" && b[f] > 0)) == null ? void 0 : X[0]) ?? "all", [I, v] = w(null), [h, d] = w(!1), K = I ?? k, H = h ? N : m.filter(it.find(([f]) => f === K)[2]), [V, O] = w(/* @__PURE__ */ new Set()), [E, B] = w(!1), [S, L] = w(!1), x = P(
    () => h ? [] : H.filter((f) => Ve(f) && (f.status === "open" || f.status === "requested")),
    [H, h]
  ), q = P(
    () => new Set(m.filter((f) => Ve(f) && (f.status === "open" || f.status === "requested")).map((f) => f.key)),
    [m]
  ), G = P(() => [...V].filter((f) => q.has(f)), [V, q]), z = (f) => {
    O((F) => {
      const A = new Set(F);
      return A.has(f) ? A.delete(f) : A.add(f), A;
    });
  }, D = x.length > 0 && x.every((f) => V.has(f.key)), U = () => {
    O((f) => {
      const F = new Set(f);
      return D ? x.forEach((A) => F.delete(A.key)) : x.forEach((A) => F.add(A.key)), F;
    });
  }, J = async (f) => {
    L(!0), await y(G, f) && (O(/* @__PURE__ */ new Set()), B(!1)), L(!1);
  }, ee = (i == null ? void 0 : i.documents.groups) ?? {}, ce = m.filter((f) => G.includes(f.key)), be = ce.length > 0 && ce.every((f) => f.status === "requested");
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hạng mục", children: it.map(([f, F]) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": !h && K === f,
          className: `sme-filter ${!h && K === f ? "on" : ""}`,
          onClick: () => {
            d(!1), v(f);
          },
          children: [
            F,
            " (",
            b[f],
            ")"
          ]
        },
        f
      )) }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        N.length > 0 && /* @__PURE__ */ n(
          T,
          {
            className: h ? "sme-toggle-on" : void 0,
            onClick: () => d((f) => !f),
            title: "Các mục không áp dụng được ẩn mặc định; bấm để xem lý do không áp dụng",
            children: [
              h ? /* @__PURE__ */ e(nn, { size: 13 }) : /* @__PURE__ */ e(ht, { size: 13 }),
              h ? "Quay lại mục áp dụng" : `Mục không áp dụng (${N.length})`
            ]
          }
        ),
        a && /* @__PURE__ */ n(T, { onClick: c, title: "Bỏ lọc nhóm", children: [
          ee[a] ?? a,
          " ",
          /* @__PURE__ */ e(Un, { size: 12 })
        ] }),
        !r && !h && x.length > 0 && /* @__PURE__ */ e(T, { onClick: U, children: D ? "Bỏ chọn" : `Chọn KH (${x.length})` })
      ] })
    ] }),
    h && /* @__PURE__ */ n(Je, { t: "info", children: [
      "Đang hiển thị ",
      /* @__PURE__ */ n("b", { children: [
        N.length,
        " hạng mục không áp dụng"
      ] }),
      " (mặc định ẩn vì điều kiện Lớp 1 không kích hoạt cho bộ hồ sơ này)."
    ] }),
    !r && !h && G.length > 0 && /* @__PURE__ */ n("div", { className: "ss-bulk", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
        /* @__PURE__ */ n("span", { className: "sme-strong sme-small", children: [
          "Đã chọn ",
          G.length,
          " hạng mục xin khách hàng"
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e(zn, { onPick: (f) => l(G, f, be) }),
          /* @__PURE__ */ n(T, { onClick: () => B((f) => !f), children: [
            /* @__PURE__ */ e(mn, { size: 13 }),
            " Đã yêu cầu"
          ] }),
          /* @__PURE__ */ e(T, { onClick: () => {
            O(/* @__PURE__ */ new Set()), B(!1);
          }, children: "Bỏ chọn" })
        ] })
      ] }),
      E && /* @__PURE__ */ e(
        Mt,
        {
          label: `Đặt hạn cho ${G.length} hạng mục`,
          confirmLabel: "Xác nhận đã yêu cầu",
          busy: S,
          onCancel: () => B(!1),
          onConfirm: J
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: H.length === 0 ? /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(mt, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        !r && !h && /* @__PURE__ */ e("th", { "aria-label": "Chọn", style: { width: 28 } }),
        /* @__PURE__ */ e("th", { children: "Hạng mục, Điều kiện (Lớp 1) & Rule (Lớp 2)" }),
        /* @__PURE__ */ e("th", { children: "Chứng từ" }),
        /* @__PURE__ */ e("th", { children: "Kết quả" }),
        !r && !h && /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: H.map((f) => /* @__PURE__ */ e(
        Qs,
        {
          it: f,
          asOf: s,
          groupLabel: ee[f.group] ?? f.group,
          selectable: Ve(f) && (f.status === "open" || f.status === "requested"),
          checked: V.has(f.key),
          skippedView: h,
          readOnly: r,
          onToggle: () => z(f.key),
          onSet: u,
          onOpenDoc: o
        },
        f.key
      )) })
    ] }) })
  ] });
}
const Js = {
  customer: "Pháp lý & Định danh (Lớp 1)",
  request: "Phương án đề xuất vay",
  facts: "Điều kiện kích hoạt & Tài chính / TSBĐ"
}, Zs = {
  met: { label: "Đạt", t: "ok" },
  not_met: { label: "Không đạt", t: "danger" },
  missing: { label: "Thiếu dữ liệu", t: "warn" },
  na: { label: "Không áp dụng", t: "muted" }
};
function ei({
  detail: t,
  catalog: s,
  pendingDraftsCount: i,
  purposeWarn: a,
  readOnly: c,
  goDrafts: r,
  onAction: u,
  onChat: y
}) {
  var b, k, I, v, h;
  const { case: l, overview: o } = t, p = [...new Set(o.profile.map((d) => d.section))], m = o.policy_checks ?? [], N = m.some((d) => d.status === "not_met") || a && a.status === "open";
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    l.submitted && /* @__PURE__ */ n(Je, { t: "info", children: [
      "Hồ sơ đã bàn giao Thẩm định lúc ",
      /* @__PURE__ */ e("b", { children: ge(l.submitted.at) }),
      " bởi ",
      $n(l.submitted.by),
      l.submitted.note ? ` · Ghi chú: ${l.submitted.note}` : "",
      ".",
      ((b = l.submitted.handover) == null ? void 0 : b.status) === "transferred" ? ` Đã chuyển sang tab Thẩm định (${l.submitted.handover.files_copied ?? 0} file đính kèm).` : (k = l.submitted.handover) != null && k.message ? ` ${l.submitted.handover.message}` : ""
    ] }),
    !l.submitted && i > 0 && /* @__PURE__ */ n(Je, { t: "warn", children: [
      "Có ",
      /* @__PURE__ */ n("b", { children: [
        i,
        " thư nháp"
      ] }),
      " yêu cầu bổ sung đang chờ ĐVKD gửi khách hàng. Xem tại tab",
      " ",
      /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: r, children: "Thư yêu cầu KH" }),
      "."
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Thông tin khách hàng & Phương án đề xuất" }),
        !c && /* @__PURE__ */ n(T, { onClick: () => y(`Cập nhật thông tin hồ sơ ${l.case_id}: `), children: [
          /* @__PURE__ */ e(xe, { size: 13 }),
          " Cập nhật qua trợ lý"
        ] })
      ] }),
      o.profile.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Chưa có dữ liệu định danh hoặc phương án vay. Trao đổi với trợ lý để ghi nhận hoặc trích xuất từ chứng từ." }) : /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 12 }, children: p.map((d) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 6 }, children: Js[d] ?? d }),
        /* @__PURE__ */ e("dl", { className: "ss-kv", children: o.profile.filter((K) => K.section === d).map((K) => /* @__PURE__ */ n(hn, { children: [
          /* @__PURE__ */ e("dt", { children: K.label }),
          /* @__PURE__ */ e("dd", { children: Xe(K.path, K.value, s) })
        ] }, K.path)) })
      ] }, d)) })
    ] }),
    (m.length > 0 || a) && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ n("h3", { className: "sme-h3", children: [
          "Điều kiện chính sách sơ bộ ",
          ((I = l.request) == null ? void 0 : I.product_code) ?? ""
        ] }),
        N ? /* @__PURE__ */ e(R, { t: "danger", children: "Có tiêu chí chưa đạt" }) : /* @__PURE__ */ e(R, { t: "ok", children: "Đạt điều kiện sơ bộ" })
      ] }),
      a && a.status === "open" && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8, color: "var(--danger)" }, children: [
        a.title,
        ": ",
        a.reason
      ] }),
      m.length > 0 && /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Điều kiện" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: m.map((d) => {
          const K = Zs[d.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              d.label,
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: d.clause })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-num", children: [
              d.op,
              " ",
              ot(d.fact, d.threshold)
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-num", children: ot(d.fact, d.actual) }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: K.t, children: K.label }) })
          ] }, d.id);
        }) })
      ] }),
      N && !c && /* @__PURE__ */ e("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ n(T, { onClick: () => y(`Hồ sơ ${l.case_id} đang vướng điều kiện chính sách sơ bộ. Gợi ý các phương án cơ cấu lại đề xuất.`), children: [
        /* @__PURE__ */ e(xe, { size: 13 }),
        " Đề xuất cơ cấu lại qua trợ lý"
      ] }) })
    ] }),
    (((h = (v = o.crosschecks) == null ? void 0 : v.rules) == null ? void 0 : h.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "7 Quy tắc đối chiếu chéo trọng yếu" }),
        /* @__PURE__ */ e(R, { t: ve(o.crosschecks.overall_status).tone, children: ve(o.crosschecks.overall_status).label })
      ] }),
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 48 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Nội dung đối chiếu" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: o.crosschecks.rules.filter((d) => d.status !== "SKIPPED").map((d) => {
          const K = kn[d.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: d.id }),
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: d.title }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: d.detail })
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-mono sme-small", children: d.document_refs.length ? d.document_refs.join(", ") : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: K.tone, children: K.label }) })
          ] }, d.id);
        }) })
      ] })
    ] }),
    o.actions.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: [
        "Hành động đề xuất (",
        o.actions.length,
        ")"
      ] }),
      o.actions.map((d) => /* @__PURE__ */ n("div", { className: `sme-finding ${he(d.tone)}`, children: [
        /* @__PURE__ */ e("div", { className: "bar" }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-finding-topic", children: d.title }),
            d.detail.length > 0 && /* @__PURE__ */ e("div", { className: "sme-finding-text sme-muted", children: d.detail.slice(0, 4).join(" · ") })
          ] }),
          d.cta !== "none" && /* @__PURE__ */ e(T, { onClick: () => u(d), children: d.cta === "draft" ? /* @__PURE__ */ n($e, { children: [
            /* @__PURE__ */ e(Tt, { size: 13 }),
            " Soạn thư"
          ] }) : d.cta === "submit" ? /* @__PURE__ */ n($e, { children: [
            /* @__PURE__ */ e(Ne, { size: 13 }),
            " Bàn giao"
          ] }) : /* @__PURE__ */ n($e, { children: [
            /* @__PURE__ */ e(xe, { size: 13 }),
            " Trợ lý"
          ] }) })
        ] })
      ] }, d.id))
    ] })
  ] });
}
function ti(t, s, i) {
  var u;
  if (!t.type) return { label: "Chưa phân loại", t: "warn" };
  if (s.some(
    (y) => y.rule_status === "FAIL" && y.document_refs.includes(t.id) && (y.fail_reasons ?? []).some((l) => /hết hiệu lực/i.test(l))
  )) return { label: "Hết hiệu lực", t: "danger" };
  const c = s.find((y) => y.key === `date:${t.type}`);
  if (c && (c.status === "open" || c.status === "requested")) return { label: "Thiếu ngày lập", t: "warn" };
  const r = (u = i == null ? void 0 : i.documents.types[t.type]) == null ? void 0 : u.validity_months;
  return r ? { label: `Hiệu lực ${r} tháng`, t: "ok" } : { label: "Không giới hạn", t: "muted" };
}
function ni({ docs: t, items: s, profile: i, catalog: a, focusDocId: c, readOnly: r, onDownload: u, onRemove: y, onExtractDoc: l, onUpload: o }) {
  const p = (a == null ? void 0 : a.documents.types) ?? {}, m = new Set(i.map((v) => v.path)), [N, b] = w(null), [k, I] = w(null);
  return Q(() => {
    c && requestAnimationFrame(() => {
      var v;
      return (v = document.getElementById(`doc-${c}`)) == null ? void 0 : v.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [c]), t.length === 0 ? /* @__PURE__ */ e(
    de,
    {
      icon: /* @__PURE__ */ e(ut, { size: 30 }),
      title: "Chưa có chứng từ nào",
      hint: "Đính kèm PDF, ảnh chụp, Word hoặc Excel trong chat với trợ lý để phân loại và trích xuất thông tin.",
      action: r ? void 0 : /* @__PURE__ */ e(T, { primary: !0, onClick: o, children: "Gửi chứng từ cho trợ lý" })
    }
  ) : /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Tổng cộng ",
        t.length,
        " chứng từ đã tiếp nhận vào hồ sơ."
      ] }),
      !r && /* @__PURE__ */ e(T, { onClick: o, children: "Gửi bổ sung qua trợ lý" })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
        /* @__PURE__ */ e("th", { children: "Loại chứng từ & Tệp" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Ngày lập" }),
        /* @__PURE__ */ e("th", { children: "Hiệu lực" }),
        /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((v) => {
        const h = v.type ? p[v.type] : void 0, d = ti(v, s, a), K = new Set(v.not_stated ?? []), H = ((h == null ? void 0 : h.extract) ?? []).filter((O) => !m.has(O) && !K.has(O)), V = k === v.id;
        return /* @__PURE__ */ n("tr", { id: `doc-${v.id}`, className: c === v.id ? "focus" : void 0, children: [
          /* @__PURE__ */ e("td", { className: "sme-mono", children: v.id }),
          /* @__PURE__ */ n("td", { children: [
            /* @__PURE__ */ e("div", { className: "sme-strong", children: (h == null ? void 0 : h.label) ?? (v.type || v.name) }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              v.name,
              v.size ? ` · ${Math.max(1, Math.round(v.size / 1024))} KB` : ""
            ] }),
            v.summary && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3 }, children: v.summary }),
            (!v.type || H.length > 0) && !r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: "var(--warn)" }, children: v.type ? `Còn ${H.length} chỉ tiêu chưa trích xuất.` : "Chứng từ chưa được phân loại." })
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: v.issued_date ? _e(v.issued_date) : "—" }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(R, { t: d.t, children: d.label }) }),
          /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
            v.file && /* @__PURE__ */ n(T, { busy: N === `dl:${v.id}`, onClick: async () => {
              b(`dl:${v.id}`), await u(v.id), b(null);
            }, children: [
              /\.(pdf|png|jpe?g|webp|txt)$/i.test(v.name) ? /* @__PURE__ */ e(ht, { size: 13 }) : /* @__PURE__ */ e(on, { size: 13 }),
              " Xem / Tải"
            ] }),
            (!v.type || H.length > 0) && !r && /* @__PURE__ */ e(T, { onClick: () => l(v.id), children: "Đọc lại" }),
            !r && !V && /* @__PURE__ */ e(T, { onClick: () => I(v.id), title: "Gỡ chứng từ gửi nhầm", children: /* @__PURE__ */ e(Wn, { size: 13 }) }),
            !r && V && /* @__PURE__ */ n($e, { children: [
              /* @__PURE__ */ e(T, { onClick: () => I(null), children: "Huỷ" }),
              /* @__PURE__ */ e(T, { primary: !0, busy: N === `rm:${v.id}`, onClick: async () => {
                b(`rm:${v.id}`), await y(v.id) && I(null), b(null);
              }, children: "Xác nhận gỡ" })
            ] })
          ] }) })
        ] }, v.id);
      }) })
    ] }) })
  ] });
}
function si({ d: t, items: s, readOnly: i, onSent: a }) {
  const [c, r] = w(!1), [u, y] = w(!1), l = async () => {
    await At(t.subject ? `${t.subject}

${t.body}` : t.body) && (r(!0), setTimeout(() => r(!1), 1500));
  };
  return /* @__PURE__ */ n("div", { className: `sme-card sme-review ${he(t.status === "sent" ? "ok" : "warn")}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("span", { className: "sme-row", children: [
        /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: t.id }),
        /* @__PURE__ */ e(R, { t: "accent", children: qt[t.channel] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: ge(t.created_at) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(R, { t: t.status === "sent" ? "ok" : "warn", children: t.status === "sent" ? `Đã gửi ${_e(t.sent_at)}` : "Chờ ĐVKD gửi" }),
        /* @__PURE__ */ n(T, { onClick: l, children: [
          c ? /* @__PURE__ */ e(rt, { size: 13 }) : /* @__PURE__ */ e(ct, { size: 13 }),
          " ",
          c ? "Đã chép" : "Sao chép"
        ] })
      ] })
    ] }),
    t.subject && /* @__PURE__ */ e("div", { className: "sme-strong", style: { marginTop: 8 }, children: t.subject }),
    /* @__PURE__ */ e("pre", { className: "sme-pre", children: t.body }),
    t.requirement_keys.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: [
      "Hạng mục đính kèm: ",
      t.requirement_keys.map((o) => {
        var p;
        return ((p = s.get(o)) == null ? void 0 : p.title) ?? o;
      }).join("; ")
    ] }),
    t.status === "draft" && !i && /* @__PURE__ */ e(
      Mt,
      {
        label: "Hạn cam kết KH gửi",
        confirmLabel: "Tôi đã gửi",
        busy: u,
        onConfirm: async (o) => {
          y(!0), await a(t.id, o), y(!1);
        }
      }
    )
  ] });
}
function ii({ drafts: t, items: s, readOnly: i, hasOpenItems: a, onSent: c, onCompose: r }) {
  const [u, y] = w("all"), l = new Map(s.map((m) => [m.key, m])), o = t.filter((m) => m.status === "draft").length, p = [...t].reverse().filter((m) => u === "all" || m.status === u);
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["all", `Tất cả (${t.length})`], ["draft", `Chờ gửi (${o})`], ["sent", `Đã gửi (${t.length - o})`]].map(([m, N]) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": u === m,
          className: `sme-filter ${u === m ? "on" : ""}`,
          onClick: () => y(m),
          children: N
        },
        m
      )) }),
      !i && a && /* @__PURE__ */ e(zn, { onPick: r })
    ] }),
    p.length === 0 && /* @__PURE__ */ e(
      de,
      {
        icon: /* @__PURE__ */ e(Tt, { size: 28 }),
        title: "Chưa có thư yêu cầu khách hàng",
        hint: a ? "Chọn kênh ở trên hoặc tích chọn hạng mục ở tab Danh mục kiểm tra để trợ lý soạn nháp." : "Không còn hạng mục thiếu cần yêu cầu khách hàng."
      }
    ),
    p.map((m) => /* @__PURE__ */ e(si, { d: m, items: l, readOnly: i, onSent: c }, m.id))
  ] });
}
function ai({ audit: t }) {
  if (t.length === 0) return /* @__PURE__ */ e(de, { icon: /* @__PURE__ */ e(an, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (i) => i === "case_submitted" ? "ok" : i === "case_reopened" || i === "document_remove" ? "warn" : i === "requirement_set" ? "accent" : "muted";
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t].reverse().map((i, a) => {
    const c = qs(i);
    return /* @__PURE__ */ n("div", { className: `sme-tl-item ${he(s(i.action))}`, children: [
      /* @__PURE__ */ n("div", { className: "sme-between", children: [
        /* @__PURE__ */ n("span", { className: "sme-strong", style: { fontSize: 13 }, children: [
          Ls[i.action] ?? i.action,
          c ? ` · ${c}` : ""
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: ge(i.ts) })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: $n(String(i.actor ?? i.agent ?? i.author ?? "")) })
    ] }, a);
  }) }) });
}
function Be({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function li({
  caseId: t,
  catalog: s,
  coachOpen: i,
  syncTick: a,
  onBack: c,
  onToggleCoach: r,
  onAskCoach: u,
  onCaseMetaChange: y,
  onRegisterQuickDraft: l
}) {
  const o = Oe(), [p, m] = w(null), [N, b] = w(null), [k, I] = w(!1), [v, h] = w("overview"), [d, K] = w(null), [H, V] = w(null), [O, E] = w(null), [B, S] = w(!1), [L, x] = w(null), [q, G] = w(!1), [z, D] = w(!1), U = te(0), J = te(!1), ee = Z(async (g = !1) => {
    if (!(g && J.current)) {
      g ? J.current = !0 : I(!0);
      try {
        m(await o.get(`${Ue}/cases/${t}`)), b(null), U.current = Date.now();
      } catch (j) {
        g || b(Ce(j));
      } finally {
        g ? J.current = !1 : I(!1);
      }
    }
  }, [o, t]);
  Q(() => {
    ee();
  }, [ee]), Q(() => {
    a > 0 && ee(!0);
  }, [a, ee]), Q(() => {
    const g = () => {
      document.visibilityState !== "hidden" && Date.now() - U.current >= 3e3 && ee(!0);
    };
    return window.addEventListener("focus", g), document.addEventListener("visibilitychange", g), () => {
      window.removeEventListener("focus", g), document.removeEventListener("visibilitychange", g);
    };
  }, [ee]);
  const ce = async (g, j) => {
    try {
      return await o.post(`${Ue}/cases/${t}${g}`, j), !0;
    } catch (me) {
      return b(Ce(me)), !1;
    }
  }, be = async (g, j, me = "", Ie) => {
    const Ke = { key: g, status: j, note: me };
    Ie !== void 0 && (Ke.due_date = Ie);
    const Ee = await ce("/requirements", Ke);
    return Ee && await ee(), Ee;
  }, X = async (g, j) => {
    const me = await ce("/requirements", { keys: g, status: "requested", note: "", due_date: j });
    return me && await ee(), me;
  }, f = async (g) => {
    const j = await ce(`/documents/${g}/remove`, {});
    return j && await ee(), j;
  }, F = async (g) => {
    try {
      const j = await o.get(`${Ue}/cases/${t}/documents/${g}/file`), me = atob(j.content_b64), Ie = new Uint8Array(me.length);
      for (let we = 0; we < me.length; we++) Ie[we] = me.charCodeAt(we);
      const Ke = new Blob([Ie], { type: j.mime || "application/octet-stream" }), Ee = URL.createObjectURL(Ke);
      if (j.mime.startsWith("image/") || j.mime === "application/pdf" || j.mime.startsWith("text/")) {
        if (!window.open(Ee, "_blank", "noopener")) {
          const yt = document.createElement("a");
          yt.href = Ee, yt.download = j.name, yt.click();
        }
      } else {
        const we = document.createElement("a");
        we.href = Ee, we.download = j.name, we.click();
      }
      setTimeout(() => URL.revokeObjectURL(Ee), 6e4);
    } catch (j) {
      b(Ce(j));
    }
  }, A = p == null ? void 0 : p.case, $ = p == null ? void 0 : p.overview, ue = !!(A != null && A.submitted), ie = (A == null ? void 0 : A.customer) ?? {}, se = (A == null ? void 0 : A.request) ?? {}, ke = ie.name ? String(ie.name) : void 0, Fe = ke || t, Se = (g) => u(g || `Hồ sơ ${t}: `, "prefill"), fe = (g, j = "email", me = !1) => {
    const Ie = (($ == null ? void 0 : $.items) ?? []).filter((Ke) => g.includes(Ke.key));
    u(Ms(t, Ie, j, me), "prefill");
  }, Ae = (g) => {
    g.cta === "draft" ? fe(g.keys, "email", g.kind === "remind" || g.kind === "follow_up") : g.cta === "submit" ? (E(""), x(null)) : g.cta === "chat" && Se(g.prompt);
  }, Te = async () => {
    p && await At(Bs(p, s)) && (D(!0), setTimeout(() => D(!1), 1800));
  }, ae = P(() => (($ == null ? void 0 : $.items) ?? []).filter((g) => !Ze(g)), [$]), C = P(() => {
    if ($ != null && $.progress) return $.progress;
    const g = ae.filter((j) => j.kind !== "policy_precheck" && j.blocking);
    return {
      mandatory_total: g.length,
      mandatory_done: g.filter((j) => ["ok", "resolved", "waived"].includes(j.status)).length,
      to_request: g.filter((j) => j.status === "open").length,
      waiting: g.filter((j) => j.status === "requested").length
    };
  }, [$, ae]), _ = C.mandatory_total, M = C.mandatory_done, W = C.to_request, Y = C.waiting, ne = P(() => ae.filter((g) => g.status === "open" || g.status === "requested").length, [ae]), De = P(() => ((p == null ? void 0 : p.drafts) ?? []).filter((g) => g.status === "draft"), [p]), le = P(() => ae.filter((g) => g.status === "waived"), [ae]), pe = ($ == null ? void 0 : $.policy_checks) ?? [], tt = P(() => pe.filter((g) => g.status === "not_met"), [pe]), Ln = P(() => (($ == null ? void 0 : $.items) ?? []).find((g) => g.key === "policy:purpose"), [$]), ft = P(
    () => ae.filter((g) => g.rule_status === "FAIL" && g.status === "open").length,
    [ae]
  ), vt = P(() => ((A == null ? void 0 : A.documents) ?? []).filter((g) => !g.type).length, [A]), Le = P(
    () => ae.filter((g) => g.status === "open" && g.blocking || g.status === "requested" && g.due_date && g.due_date < (($ == null ? void 0 : $.as_of) ?? "")),
    [ae, $]
  ), je = P(
    () => ae.filter((g) => Ve(g) && (g.status === "open" || g.status === "requested")).map((g) => g.key),
    [ae]
  );
  Q(() => {
    y({ customerName: ke, readOnly: ue, hasOpenItems: je.length > 0 });
  }, [ke, ue, je.length, y]);
  const Bt = te(() => {
  });
  Bt.current = () => fe(je, "email", !1), Q(() => (l(() => Bt.current()), () => l(null)), [l]);
  const Ht = P(() => new Map((($ == null ? void 0 : $.profile) ?? []).map((g) => [g.path, g.value])), [$]), Kn = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Danh mục kiểm tra", count: ne || void 0 },
    { key: "docs", label: "Chứng từ", count: (A == null ? void 0 : A.documents.length) || void 0 },
    { key: "drafts", label: "Thư yêu cầu KH", count: De.length || (p == null ? void 0 : p.drafts.length) || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: c, children: [
          /* @__PURE__ */ e(ln, { size: 14 }),
          " Danh mục hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: Fe }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          $ && /* @__PURE__ */ e(Qt, { stage: $.stage }),
          ($ == null ? void 0 : $.checklist_overall) && /* @__PURE__ */ e(
            R,
            {
              t: ve($.checklist_overall).tone,
              title: `Kiểm tra quy tắc Master Checklist: ${Lt($.checklist_counts)}`,
              children: ve($.checklist_overall).label
            }
          ),
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          A && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            A.flow
          ] }),
          ie.tax_id && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "MST ",
            String(ie.tax_id)
          ] }),
          ie.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(ie.industry_code)
          ] }),
          se.product_code && /* @__PURE__ */ e("span", { className: "sme-chip", children: String(se.product_code) }),
          se.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: et[se.purpose] ?? se.purpose }),
          A && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Khởi tạo ",
            ge(A.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(T, { onClick: () => ee(), busy: k, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(dt, { size: 14 }) }),
        /* @__PURE__ */ n(
          T,
          {
            className: i ? "sme-toggle-on" : void 0,
            "aria-pressed": i,
            onClick: r,
            title: i ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
            children: [
              /* @__PURE__ */ e(xe, { size: 14 }),
              " Trợ lý hồ sơ"
            ]
          }
        ),
        ue ? /* @__PURE__ */ n(T, { onClick: () => x(""), children: [
          /* @__PURE__ */ e(Pt, { size: 14 }),
          " Mở lại hồ sơ"
        ] }) : /* @__PURE__ */ n(T, { primary: !0, onClick: () => {
          E(""), x(null);
        }, children: [
          /* @__PURE__ */ e(Ne, { size: 14 }),
          " ",
          $ != null && $.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
        ] })
      ] })
    ] }),
    N && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(pt, { title: "Có lỗi khi làm việc với hồ sơ", children: N }) }),
    !p && !N && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" })
    ] }),
    p && A && $ && /* @__PURE__ */ n($e, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          oe,
          {
            icon: /* @__PURE__ */ e(rn, { size: 18 }),
            label: "Số tiền đề nghị",
            value: se.amount ? Et(se.amount).replace(" đ", "") : "—",
            hint: [se.term_months ? `${se.term_months} tháng` : null, se.product_code, "VND"].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: $.readiness.ready ? "ok" : W > 0 ? "danger" : "warn",
            icon: /* @__PURE__ */ e(Ct, { size: 18 }),
            label: "Hạng mục bắt buộc (A–I)",
            value: `${M} / ${_}`,
            hint: `${W} cần bổ sung · ${Y} chờ KH`
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: ft ? "danger" : vt ? "warn" : A.documents.length ? "ok" : "muted",
            icon: /* @__PURE__ */ e($t, { size: 18 }),
            label: "Chứng từ lưu trữ",
            value: A.documents.length,
            hint: ft ? `${ft} không đạt rule` : vt ? `${vt} chưa phân loại` : "Đã đối chiếu danh mục"
          }
        ),
        /* @__PURE__ */ e(
          oe,
          {
            t: pe.length === 0 ? "muted" : tt.length > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(cn, { size: 18 }),
            label: "Điều kiện chính sách",
            value: pe.length === 0 ? "—" : tt.length > 0 ? `${tt.length} chưa đạt` : "Đạt sơ bộ",
            hint: pe.length > 0 ? `${pe.length} tiêu chí · ${se.product_code ?? ""}` : "Chưa chọn mã sản phẩm"
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(
        Fs,
        {
          groups: $.groups,
          activeGroup: d,
          onSelectGroup: (g) => {
            K(g), h("checklist");
          }
        }
      ) }),
      L !== null && A.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-warn", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Mở lại hồ sơ đã bàn giao" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: "Chỉ mở lại khi bộ phận Thẩm định yêu cầu bổ sung chứng từ mới. Ghi rõ lý do để lưu nhật ký kiểm toán." }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: L,
            onChange: (g) => x(g.target.value),
            placeholder: "Ví dụ: Thẩm định yêu cầu bổ sung BCTC quý gần nhất"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(T, { onClick: () => x(null), children: "Huỷ" }),
          /* @__PURE__ */ n(T, { primary: !0, busy: q, disabled: !L.trim(), onClick: async () => {
            G(!0), await ce("/reopen", { note: L }) && (x(null), await ee()), G(!1);
          }, children: [
            /* @__PURE__ */ e(Pt, { size: 14 }),
            " Xác nhận mở lại"
          ] })
        ] })
      ] }),
      O !== null && !A.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: "Xác nhận bàn giao hồ sơ sang Thẩm định (LOS)" }),
          /* @__PURE__ */ n(T, { onClick: Te, children: [
            z ? /* @__PURE__ */ e(rt, { size: 13 }) : /* @__PURE__ */ e(ct, { size: 13 }),
            " ",
            z ? "Đã chép phiếu" : "Sao chép phiếu bàn giao LOS"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { margin: "6px 0 8px" }, children: [
          "Hạng mục áp dụng: ",
          /* @__PURE__ */ n("b", { children: [
            M,
            "/",
            _
          ] }),
          " · Chứng từ: ",
          /* @__PURE__ */ e("b", { children: A.documents.length }),
          " · Xin miễn: ",
          /* @__PURE__ */ e("b", { children: le.length }),
          " · Cảnh báo sơ bộ: ",
          /* @__PURE__ */ e("b", { children: tt.length }),
          ". Hệ thống sẽ chuyển hồ sơ và chứng từ sang tab ",
          /* @__PURE__ */ e("b", { children: "Thẩm định" }),
          ".",
          $.readiness.ready ? " Ghi chú bàn giao không bắt buộc." : ` Còn ${$.readiness.blocking_open.length} mục chặn nên bắt buộc ghi giải trình.`
        ] }),
        le.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ e("b", { children: "Mục xin miễn:" }),
          " ",
          le.map((g) => `${g.title} (${g.note})`).join("; ")
        ] }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: O,
            onChange: (g) => E(g.target.value),
            placeholder: $.readiness.ready ? "Ghi chú bàn giao (tuỳ chọn)" : "Ghi rõ giải trình khi trình dù còn hạng mục chặn (bắt buộc)"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(T, { onClick: () => E(null), children: "Huỷ" }),
          /* @__PURE__ */ n(
            T,
            {
              primary: !0,
              busy: B,
              disabled: !$.readiness.ready && !O.trim(),
              onClick: async () => {
                S(!0), await ce("/submitted", { note: O }) && (E(null), await ee()), S(!1);
              },
              children: [
                /* @__PURE__ */ e(Ne, { size: 14 }),
                " Xác nhận đã bàn giao"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Kn.map((g) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": v === g.key,
              className: `sme-tab ${v === g.key ? "on" : ""}`,
              onClick: () => h(g.key),
              children: [
                g.label,
                g.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: g.count })
              ]
            },
            g.key
          )) }),
          v === "overview" && /* @__PURE__ */ e(
            ei,
            {
              detail: p,
              catalog: s,
              pendingDraftsCount: De.length,
              purposeWarn: Ln,
              readOnly: ue,
              goDrafts: () => h("drafts"),
              onAction: Ae,
              onChat: Se
            }
          ),
          v === "checklist" && /* @__PURE__ */ e(
            Ys,
            {
              items: $.items,
              asOf: $.as_of,
              catalog: s,
              groupFilter: d,
              onClearGroup: () => K(null),
              readOnly: ue,
              onSet: be,
              onBatchRequested: X,
              onDraft: fe,
              onOpenDoc: (g) => {
                V(g), h("docs");
              }
            }
          ),
          v === "docs" && /* @__PURE__ */ e(
            ni,
            {
              docs: A.documents,
              items: $.items,
              profile: $.profile,
              catalog: s,
              focusDocId: H,
              readOnly: ue,
              onDownload: F,
              onRemove: f,
              onExtractDoc: (g) => u(`Đọc lại và cập nhật thông tin từ chứng từ ${g} của hồ sơ ${t}.`, "prefill"),
              onUpload: () => u("", "attach")
            }
          ),
          v === "drafts" && /* @__PURE__ */ e(
            ii,
            {
              drafts: p.drafts,
              items: $.items,
              readOnly: ue,
              hasOpenItems: je.length > 0,
              onCompose: (g) => fe(je, g, !1),
              onSent: async (g, j) => {
                const me = await ce(`/drafts/${g}/sent`, { due_date: j });
                return me && await ee(), me;
              }
            }
          ),
          v === "audit" && /* @__PURE__ */ e(ai, { audit: p.audit })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Hạng mục cần xử lý" }),
              /* @__PURE__ */ e(R, { t: Le.length ? "warn" : "ok", children: Le.length })
            ] }),
            Le.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn hạng mục chặn mở." }),
            Le.slice(0, 6).map((g) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "sme-todo",
                onClick: () => {
                  K(g.group), h("checklist");
                },
                children: [
                  /* @__PURE__ */ e(R, { t: g.status === "requested" ? "danger" : "warn", children: g.status === "requested" ? "Quá hạn" : "Thiếu" }),
                  /* @__PURE__ */ e("span", { className: "sme-todo-text", children: g.title })
                ]
              },
              g.key
            )),
            Le.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => h("checklist"), children: [
              "Xem thêm ",
              Le.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Định danh & Tóm tắt" }),
            /* @__PURE__ */ e(Be, { label: "Mã số thuế", children: String(ie.tax_id ?? "—") }),
            /* @__PURE__ */ e(Be, { label: "CIF", children: String(ie.cif ?? "—") }),
            /* @__PURE__ */ e(Be, { label: "Người đại diện", children: String(ie.legal_rep ?? "—") }),
            /* @__PURE__ */ e(Be, { label: "Số năm hoạt động", children: Xe("facts.years_in_operation", Ht.get("facts.years_in_operation") ?? ie.years_in_operation, s) }),
            /* @__PURE__ */ e(Be, { label: "Vốn điều lệ", children: Xe("customer.charter_capital", ie.charter_capital, s) }),
            /* @__PURE__ */ e(Be, { label: "Doanh thu gần nhất", children: Xe("facts.revenue_last_year", Ht.get("facts.revenue_last_year"), s) }),
            se.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(se.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 8 }, children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Bàn giao LOS" }),
              /* @__PURE__ */ e(Qt, { stage: $.stage })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: le.length > 0 ? `${le.length} mục xin miễn kèm giải trình.` : "Chưa có mục xin miễn." }),
            /* @__PURE__ */ n(T, { onClick: Te, children: [
              z ? /* @__PURE__ */ e(rt, { size: 13 }) : /* @__PURE__ */ e(ct, { size: 13 }),
              " ",
              z ? "Đã chép phiếu" : "Chép phiếu bàn giao"
            ] }),
            !ue && /* @__PURE__ */ n(T, { primary: !0, onClick: () => {
              E(""), x(null);
            }, children: [
              /* @__PURE__ */ e(Ne, { size: 13 }),
              " ",
              $.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
            ] })
          ] }),
          p.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(dn, { size: 13 }),
            " Hoạt động gần nhất ",
            ge(p.audit[p.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
It();
Us();
const Yt = "sme-lending:sale-coach-open", Jt = "sme-lending:sale-coach-width";
function ri() {
  const t = Oe(), [s, i] = w(null), [a, c] = w(null), [r, u] = w(() => pn(Yt)), [y, l] = w(() => bn(Jt)), [o, p] = w(null), [m, N] = w(null), [b, k] = w(null), I = te(0), v = te(null), { syncTick: h } = vn(r, 4e3);
  Q(() => {
    t.get(`${Ue}/catalog`).then(c).catch(() => c(null));
  }, [t]);
  const d = Z((x) => {
    u((q) => {
      const G = typeof x == "function" ? x(q) : x;
      return gn(Yt, G), G;
    });
  }, []), K = Z((x) => {
    const q = gt(x);
    l(q), fn(Jt, q);
  }, []), H = Z((x, q = "prefill") => {
    d(!0), p({ id: ++I.current, prompt: x, mode: q });
  }, [d]), V = Z(() => {
    p(null);
  }, []), O = Z((x) => {
    k(null), N(null), i(x);
  }, []), E = Z(() => {
    N(null), i(null);
  }, []), B = Z((x) => {
    N((q) => q === x || q && x && q.customerName === x.customerName && q.readOnly === x.readOnly && q.hasOpenItems === x.hasOpenItems ? q : x);
  }, []), S = Z((x) => {
    v.current = x;
  }, []), L = Z(() => {
    var x;
    (x = v.current) == null || x.call(v);
  }, []);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: s ? /* @__PURE__ */ e(
      li,
      {
        caseId: s,
        catalog: a,
        coachOpen: r,
        syncTick: h,
        onBack: E,
        onToggleCoach: () => d((x) => !x),
        onAskCoach: H,
        onCaseMetaChange: B,
        onRegisterQuickDraft: S
      }
    ) : /* @__PURE__ */ e(
      Ws,
      {
        onOpen: O,
        catalog: a,
        coachOpen: r,
        syncTick: h,
        onToggleCoach: () => d((x) => !x),
        onAskCoach: H,
        onCreatedCase: k
      }
    ) }),
    r && /* @__PURE__ */ e(
      Hs,
      {
        width: y,
        onWidthChange: K,
        onClose: () => d(!1),
        caseId: s,
        customerName: s ? m == null ? void 0 : m.customerName : void 0,
        readOnly: s ? !!(m != null && m.readOnly) : !1,
        hasOpenItems: s ? !!(m != null && m.hasOpenItems) : !1,
        intent: o,
        onConsumeIntent: V,
        createdCase: b,
        onOpenCase: O,
        onDismissCreatedCase: () => k(null),
        onQuickDraft: s && (m != null && m.hasOpenItems) && !m.readOnly ? L : void 0
      }
    )
  ] }) });
}
It();
const Dn = "sme-lending:mode";
function ci() {
  try {
    return localStorage.getItem(Dn) === "assessment" ? "assessment" : "sale";
  } catch {
    return "sale";
  }
}
function gi() {
  const [t, s] = w(ci), i = (a) => {
    s(a);
    try {
      localStorage.setItem(Dn, a);
    } catch {
    }
  };
  return /* @__PURE__ */ n("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: [
    /* @__PURE__ */ n("div", { className: "sme-tabs sme-modebar", role: "tablist", "aria-label": "Bước hồ sơ", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": t === "sale",
          className: `sme-tab ${t === "sale" ? "on" : ""}`,
          onClick: () => i("sale"),
          children: [
            /* @__PURE__ */ e(Ne, { size: 14 }),
            " Hoàn thiện hồ sơ"
          ]
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": t === "assessment",
          className: `sme-tab ${t === "assessment" ? "on" : ""}`,
          onClick: () => i("assessment"),
          children: [
            /* @__PURE__ */ e(ut, { size: 14 }),
            " Thẩm định"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: t === "sale" ? /* @__PURE__ */ e(ri, {}) : /* @__PURE__ */ e(Ds, { onNewDossier: () => i("sale") }) })
  ] });
}
export {
  gi as default
};
