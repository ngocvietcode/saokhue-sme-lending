import { jsxs as n, jsx as e, Fragment as nt } from "react/jsx-runtime";
import { useRef as B, useCallback as V, useState as w, useMemo as H, useEffect as R } from "react";
import * as qe from "@kirocrew/app-sdk";
import { useChatLauncher as yt, useAppApi as Ve } from "@kirocrew/app-sdk";
import { Btn as K, PageHeader as wt, ErrorNotice as st } from "@kirocrew/app-sdk/ui";
import { MessageSquare as De, Plus as Fe, ExternalLink as Pe, PanelRightClose as kt, ArrowRight as Nt, AlertTriangle as _t, RefreshCw as rt, FolderOpen as Xe, ClipboardList as it, ShieldAlert as Ct, AlertOctagon as St, Search as Ie, CheckCircle2 as at, XCircle as Tt, CircleDot as Et, CircleDashed as lt, TriangleAlert as At, Loader2 as $t, EyeOff as zt, Eye as ot, ClipboardCheck as He, Play as ct, FileSearch as dt, History as It, ChevronRight as Lt, ArrowLeft as Dt, Landmark as Rt, Gauge as Kt, ShieldCheck as Mt, FileText as Pt, Download as Bt, Activity as Ot } from "lucide-react";
const qt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function Ft(t, s, r) {
  const i = yt(), l = B(i);
  l.current = i;
  const c = B(r);
  return c.current = r, V(
    async (f, p, o) => {
      var N;
      const a = l.current, { openChat: v } = a, h = a.createChat;
      if (!h) {
        v({ autoSend: !1, message: f });
        return;
      }
      try {
        const d = await h({ slotKey: s + qt(p), agent: t, title: o });
        v({ slotKey: d, autoSend: !1, message: f });
      } catch (d) {
        (N = c.current) == null || N.call(c, `Không mở được chat với trợ lý: ${d instanceof Error ? d.message : String(d)}`);
      }
    },
    [t, s]
  );
}
const mt = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, ze = new Intl.NumberFormat("vi-VN"), Ht = (t) => typeof t == "number" ? ze.format(t) + " đ" : "—", Le = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? ze.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? ze.format(Math.round(t / 1e4) / 100) + " triệu" : ze.format(t) + " đ", Q = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", he = (t) => typeof t == "number" ? (t * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "%" : "—", ae = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, jt = (t) => {
  if (!t) return "—";
  const s = new Date(t).getTime();
  if (Number.isNaN(s)) return "—";
  const r = Math.round((Date.now() - s) / 1e3);
  return r < 60 ? "vừa xong" : r < 3600 ? `${Math.floor(r / 60)} phút trước` : r < 86400 ? `${Math.floor(r / 3600)} giờ trước` : `${Math.floor(r / 86400)} ngày trước`;
}, Qe = (t) => typeof t == "string" ? t : JSON.stringify(t, null, 2), we = (t) => t instanceof Error ? t.message : String(t), je = "kirocrew_prefill", Ye = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), Vt = (t, s) => {
};
function We(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function Wt(t) {
  try {
    const s = localStorage.getItem(t);
    if (s === "1") return !0;
    if (s === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function Ut(t, s) {
  try {
    localStorage.setItem(t, s ? "1" : "0");
  } catch {
  }
}
function Gt(t, s = 420) {
  try {
    const r = Number(localStorage.getItem(t));
    if (Number.isFinite(r) && r >= 360 && r <= 620) return Math.round(r);
  } catch {
  }
  return s;
}
function Xt(t, s) {
  try {
    localStorage.setItem(t, String(We(s)));
  } catch {
  }
}
function Qt(t, s = 4e3) {
  const r = qe.useAppEvents ?? Vt, [i, l] = w(0), c = V(() => l((f) => f + 1), []);
  return r("tool_result", c), r("chat_done", c), R(() => {
    if (!t) return;
    const f = window.setInterval(() => {
      document.visibilityState !== "hidden" && l((p) => p + 1);
    }, s);
    return () => window.clearInterval(f);
  }, [t, s]), { syncTick: i, bumpSync: c };
}
function Yt(t) {
  try {
    const s = sessionStorage.getItem(t);
    if (s) return s;
    const r = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, r), r;
  } catch {
    return "intake-default";
  }
}
function Jt(t, s) {
  try {
    sessionStorage.setItem(t, s);
  } catch {
  }
}
function pe(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function Ae(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function $e(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const r = t.value.length;
    t.setSelectionRange(r, r);
    return;
  }
  const s = window.getSelection();
  s && (s.selectAllChildren(t), s.collapseToEnd());
}
function Je(t, s) {
  const r = Date.now();
  try {
    sessionStorage.setItem(je, JSON.stringify({ slotKey: t, prompt: s, ts: r }));
  } catch {
  }
  return r;
}
function Zt({
  storagePrefix: t,
  chatPrefix: s,
  agent: r,
  panelLabel: i,
  newIntakePrompt: l,
  newSessionTitle: c,
  caseTitlePrefix: f = "Hồ sơ",
  chips: p = [],
  showNewSessionButton: o,
  attachDefaultPrefix: a,
  embedPlaceholder: v,
  width: h,
  onWidthChange: N,
  onClose: d,
  caseId: b,
  customerName: C,
  intent: A,
  onConsumeIntent: m,
  createdCase: S,
  onOpenCase: Y,
  onDismissCreatedCase: O
}) {
  const G = qe, k = G.ChatPanel, $ = G.ChatEmbed, x = qe.useChatLauncher(), _ = Ft(r, s), M = `${t}:intake-id`, [q, W] = w(() => Yt(M)), P = b ?? q, X = s + Ye(P), ee = H(() => b ? C ? `${f} ${C} (${b})` : `${f} ${b}` : c, [b, C, c, f]), [F, re] = w(null), [Ce, Se] = w(null), oe = B(null);
  oe.current = F;
  const z = B(x);
  z.current = x, R(() => {
    let u = !1;
    Se(null);
    const y = oe.current === X, T = z.current.createChat;
    if (!T) {
      y || re(X);
      return;
    }
    return y || re(null), T({ slotKey: X, agent: r, title: ee }).then((I) => {
      if (u) return;
      const L = I || X;
      oe.current !== L && re(L);
    }).catch((I) => {
      u || y || Se(we(I));
    }), () => {
      u = !0;
    };
  }, [X, r, ee]);
  const D = B(null), j = B(0), te = B(null), ne = B(!1), [be, ce] = w(0), de = V((u, y) => {
    const T = y.trim();
    if (!T) return;
    const I = pe(D.current);
    if (oe.current === u && I) {
      Ae(I).trim().includes(T) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: y } })), requestAnimationFrame(() => $e(pe(D.current)));
      return;
    }
    const L = Je(u, y);
    te.current = { slotKey: u, prompt: y, ts: L }, ce((Me) => Me + 1);
  }, []);
  R(() => {
    const u = te.current;
    if (!u || F !== u.slotKey) return;
    let y = 0, T = 0;
    const I = window.setInterval(() => {
      y += 1;
      const L = pe(D.current);
      if (!L) {
        y >= 20 && (window.clearInterval(I), te.current = null);
        return;
      }
      if (Ae(L).trim().includes(u.prompt.trim())) {
        te.current = null, window.clearInterval(I), $e(L);
        return;
      }
      if (T += 1, T >= 3) {
        try {
          const U = sessionStorage.getItem(je);
          if (U) {
            const me = JSON.parse(U);
            me.slotKey === u.slotKey && me.ts === u.ts && sessionStorage.removeItem(je);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: u.prompt } })), te.current = null, window.clearInterval(I), requestAnimationFrame(() => $e(pe(D.current)));
      }
    }, 60);
    return () => window.clearInterval(I);
  }, [F, be]), R(() => {
    if (!ne.current || !F) return;
    let u = 0;
    const y = () => {
      var L;
      const I = (L = D.current) == null ? void 0 : L.querySelector('input[type="file"]');
      return I ? (ne.current = !1, I.click(), !0) : !1;
    };
    if (y()) return;
    const T = window.setInterval(() => {
      u += 1, (y() || u >= 16) && (ne.current = !1, window.clearInterval(T));
    }, 50);
    return () => window.clearInterval(T);
  }, [F, be]);
  const ve = V((u) => {
    const y = `intake-${Date.now().toString(36)}`, T = s + Ye(y);
    if (Jt(M, y), O(), u) {
      const I = Je(T, u);
      te.current = { slotKey: T, prompt: u, ts: I }, ce((L) => L + 1);
    }
    W(y);
  }, [s, M, O]);
  R(() => {
    var u;
    if (!(!A || A.id === j.current)) {
      if (j.current = A.id, A.mode === "new_intake") {
        const y = pe(D.current), T = Ae(y).trim(), I = (A.prompt || l).trim();
        b === null && T === I && y ? $e(y) : ve(A.prompt || l), m();
        return;
      }
      if (A.mode === "attach") {
        const y = pe(D.current), T = a ?? (b ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${b}: ` : "");
        T && !Ae(y).trim() && de(X, T);
        const I = (u = D.current) == null ? void 0 : u.querySelector('input[type="file"]');
        I ? (ne.current = !1, I.click()) : (ne.current = !0, ce((L) => L + 1)), m();
        return;
      }
      de(X, A.prompt), m();
    }
  }, [
    A,
    b,
    X,
    l,
    a,
    m,
    de,
    ve
  ]);
  const [Ke, xe] = w(!1), le = B(null), Te = (u) => {
    u.preventDefault(), u.currentTarget.setPointerCapture(u.pointerId), le.current = { startX: u.clientX, startW: h, pointerId: u.pointerId }, xe(!0);
  }, Ee = (u) => {
    const y = le.current;
    !y || y.pointerId !== u.pointerId || N(We(y.startW + (y.startX - u.clientX)));
  }, ye = (u) => {
    var y;
    ((y = le.current) == null ? void 0 : y.pointerId) === u.pointerId && (le.current = null, xe(!1));
  }, g = o ?? !b;
  return /* @__PURE__ */ n("aside", { ref: D, className: "sme-dock", style: { width: h }, "aria-label": i, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${Ke ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: Te,
        onPointerMove: Ee,
        onPointerUp: ye,
        onPointerCancel: ye
      }
    ),
    /* @__PURE__ */ n("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ n("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e(De, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          b ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: b }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: i })
        ] }),
        p.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: p.map((u) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              u.onClick ? u.onClick() : u.prompt && de(X, u.prompt);
            },
            children: u.label
          },
          u.label
        )) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        g && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => ve(), children: /* @__PURE__ */ e(Fe, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => _("", P, ee),
            children: /* @__PURE__ */ e(Pe, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: d, children: /* @__PURE__ */ e(kt, { size: 15 }) })
      ] })
    ] }),
    !b && S && /* @__PURE__ */ n("div", { className: "sme-dock-new-banner", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: S.name }),
        " ",
        /* @__PURE__ */ n("span", { className: "sme-mono", children: [
          "(",
          S.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ n(K, { primary: !0, onClick: () => Y(S.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(Nt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: Ce ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: Ce }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(K, { onClick: () => _("", P, ee), children: [
        /* @__PURE__ */ e(Pe, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : F ? k ? /* @__PURE__ */ e(k, { slotKey: F, conversationOnly: !0 }, F) : $ ? /* @__PURE__ */ e(
      $,
      {
        slotKey: F,
        agent: r,
        frameless: !0,
        startAtBottom: !0,
        placeholder: v
      },
      F
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(K, { primary: !0, onClick: () => _("", P, ee), children: [
        /* @__PURE__ */ e(Pe, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const en = `
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
function tn() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = en, document.head.appendChild(s);
}
const nn = "sme-assistant", sn = (t, s) => s && t[s] || { label: s ?? "—", tone: "muted" }, ht = {
  PASS: { label: "Đạt", tone: "ok" },
  MISSING_REQUIRED: { label: "Còn thiếu", tone: "warn" },
  FAIL: { label: "Không đạt", tone: "danger" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" },
  UNDETERMINED_CONDITION: { label: "Chưa xác định điều kiện", tone: "info" }
}, rn = {
  PASS: { label: "Khớp", tone: "ok" },
  FAIL: { label: "Không khớp", tone: "danger" },
  MISSING_DATA: { label: "Thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, an = {
  COMPLETE: { label: "Checklist đầy đủ", tone: "ok" },
  INCOMPLETE: { label: "Checklist chưa đủ", tone: "warn" },
  PASS: { label: "Đối chiếu khớp", tone: "ok" },
  FAIL: { label: "Đối chiếu có lệch", tone: "danger" },
  MISSING_DATA: { label: "Đối chiếu thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, ge = (t) => sn(an, t);
function pt(t, s = [
  "PASS",
  "MISSING_REQUIRED",
  "FAIL",
  "UNDETERMINED_CONDITION"
]) {
  if (!t) return "—";
  const r = s.filter((i) => (t[i] ?? 0) > 0).map((i) => `${t[i]} ${ht[i].label.toLowerCase()}`);
  return r.length ? r.join(" · ") : "Chưa có mục nào";
}
const ke = "/apps/sme-lending/api", ut = [
  { name: "Chứng từ", agents: ["document-evidence"] },
  { name: "Sản phẩm", agents: ["product-match"] },
  { name: "Chuyên môn", agents: ["financial-analysis", "risk-compliance", "collateral", "industry"] },
  { name: "Chính sách", agents: ["policy-exception"] },
  { name: "Tổng hợp", agents: ["consolidation"] }
], Ne = ut.flatMap((t) => t.agents), ln = {
  "document-evidence": "Chứng từ & bằng chứng",
  "product-match": "Nhận diện sản phẩm",
  "financial-analysis": "Phân tích tài chính",
  "risk-compliance": "Rủi ro & tuân thủ",
  collateral: "Tài sản bảo đảm",
  industry: "Ngành & cạnh tranh",
  "policy-exception": "Chính sách & ngoại lệ",
  consolidation: "Tổng hợp tờ trình"
}, J = (t) => ln[t] ?? t, _e = {
  passed: { label: "Đã kiểm chứng", tone: "ok" },
  blocked: { label: "Bị chặn", tone: "danger" },
  unverified: { label: "Chưa kiểm chứng", tone: "warn" },
  none: { label: "Chưa chạy", tone: "muted" }
}, fe = {
  high: { label: "Cao", tone: "danger", rank: 0 },
  medium: { label: "Trung bình", tone: "warn", rank: 1 },
  low: { label: "Thấp", tone: "info", rank: 2 },
  info: { label: "Thông tin", tone: "muted", rank: 3 }
}, on = { high: "cao", medium: "trung bình", low: "thấp" }, Ue = {
  missing_document: { label: "Thiếu chứng từ", tone: "warn" },
  data_conflict: { label: "Dữ liệu mâu thuẫn", tone: "danger" },
  rule_fail: { label: "Không đạt điều kiện", tone: "danger" },
  low_confidence: { label: "Độ tin cậy thấp", tone: "info" },
  exception_needed: { label: "Cần ngoại lệ", tone: "danger" },
  expert_review: { label: "Cần chuyên gia", tone: "info" },
  system_error: { label: "Lỗi hệ thống", tone: "muted" }
}, gt = {
  open: { label: "Chờ xử lý", tone: "warn" },
  confirmed: { label: "Đã xác nhận", tone: "ok" },
  needs_info: { label: "Yêu cầu bổ sung", tone: "info" }
}, cn = {
  case_create: "Tạo hồ sơ",
  case_handover_received: "Nhận bàn giao từ ĐVKD",
  evidence_add: "Thêm bằng chứng",
  result_put: "Lưu kết quả",
  verification: "Kiểm chứng",
  review_add: "Thêm mục rà soát",
  review_decide: "Cán bộ quyết định"
}, dn = (t) => [...t].sort((s, r) => {
  var i, l;
  return (((i = fe[s.severity]) == null ? void 0 : i.rank) ?? 9) - (((l = fe[r.severity]) == null ? void 0 : l.rank) ?? 9);
});
function Re(t) {
  return t ? t.verification ? t.verification.passed ? "passed" : "blocked" : "unverified" : "none";
}
function ue(t, s, r) {
  var i, l;
  return (l = (i = t.results[s]) == null ? void 0 : i.calculations) == null ? void 0 : l.find((c) => c.kind === r);
}
function mn(t) {
  var p, o, a, v, h, N, d;
  const s = {}, r = ue(t, "policy-exception", "policy_check") ?? ue(t, "risk-compliance", "policy_check");
  (p = r == null ? void 0 : r.outputs) != null && p.matrix && (s.policy = { version: r.outputs.policy_version, product: r.outputs.product_code ?? ((o = r.inputs) == null ? void 0 : o.product_code) ?? ((a = t.case.request) == null ? void 0 : a.product_code), rows: r.outputs.matrix });
  const i = ue(t, "financial-analysis", "repayment_capacity");
  if ((v = i == null ? void 0 : i.outputs) != null && v.scenarios) {
    const b = (h = s.policy) == null ? void 0 : h.rows.find((C) => C.fact === "dscr");
    s.dscr = {
      scenarios: i.outputs.scenarios,
      threshold: typeof (b == null ? void 0 : b.threshold) == "number" ? b.threshold : void 0,
      debtService: i.outputs.total_debt_service_annual,
      cash: (N = i.inputs) == null ? void 0 : N.cash_available_annual
    };
  }
  const l = ue(t, "collateral", "collateral_ltv");
  l != null && l.outputs && (s.ltv = { ltv: l.outputs.ltv_pct ?? null, cap: l.outputs.max_ltv_pct ?? null, eligible: l.outputs.eligible_value });
  const c = ue(t, "financial-analysis", "fin_ratios");
  (d = c == null ? void 0 : c.outputs) != null && d.periods && (s.ratios = c.outputs.periods);
  const f = ue(t, "consolidation", "genform");
  return f != null && f.outputs && (s.genform = f.outputs), s;
}
const Be = {
  gross_margin: { label: "Biên lợi nhuận gộp", fmt: he },
  net_margin: { label: "Biên lợi nhuận ròng", fmt: he },
  ebitda_margin: { label: "Biên EBITDA", fmt: he },
  current_ratio: { label: "Thanh toán hiện hành", fmt: (t) => Q(t) },
  debt_to_equity: { label: "Nợ vay / Vốn chủ", fmt: (t) => Q(t) },
  liabilities_to_assets: { label: "Nợ phải trả / Tài sản", fmt: he },
  roa: { label: "ROA", fmt: he },
  roe: { label: "ROE", fmt: he },
  interest_coverage: { label: "Khả năng trả lãi", fmt: (t) => Q(t, 1) + (typeof t == "number" ? " lần" : "") },
  receivable_days: { label: "Số ngày phải thu", fmt: (t) => Q(t, 0) },
  inventory_days: { label: "Số ngày tồn kho", fmt: (t) => Q(t, 0) }
}, hn = {
  years_in_operation: "Số năm hoạt động",
  loan_amount: "Số tiền vay",
  term_months: "Kỳ hạn (tháng)",
  dscr: "DSCR",
  cic_debt_group: "Nhóm nợ CIC",
  ltv_pct: "LTV (%)",
  equity_contribution_pct: "Vốn tự có (%)"
}, pn = {
  met: { label: "Đạt", tone: "ok" },
  not_met: { label: "Không đạt", tone: "danger" },
  missing: { label: "Thiếu dữ liệu", tone: "warn" },
  na: { label: "Không áp dụng", tone: "muted" }
}, Z = (t) => `t-${t}`;
function E({ t, children: s, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${Z(t)}`, title: r, children: s });
}
function ie({ icon: t, label: s, value: r, hint: i, t: l = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${Z(l)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      i && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: i })
    ] })
  ] });
}
function se({ icon: t, title: s, hint: r, action: i }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    i && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: i })
  ] });
}
function ft({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${Z(t)}`, children: [
    /* @__PURE__ */ e(_t, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function Ge({ refs: t, onOpen: s }) {
  return t != null && t.length ? /* @__PURE__ */ e("span", { className: "sme-row sme-wrap", style: { gap: 4, display: "inline-flex", marginLeft: 4 }, children: t.map((r) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", title: "Xem bằng chứng", onClick: () => s(r), children: r }, r)) }) : null;
}
function un({ c: t, onOpen: s }) {
  const r = t.agents ?? {}, i = Object.keys(r).length;
  return /* @__PURE__ */ n(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: s,
      onKeyDown: (l) => {
        (l.key === "Enter" || l.key === " ") && (l.preventDefault(), s());
      },
      children: [
        /* @__PURE__ */ n("div", { className: "sme-between", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.customer_name ?? "Chưa có tên khách hàng" }),
            /* @__PURE__ */ e("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: t.case_id })
          ] }),
          t.review_open > 0 ? /* @__PURE__ */ n(E, { t: "warn", children: [
            t.review_open,
            " chờ rà soát"
          ] }) : i > 0 ? /* @__PURE__ */ e(E, { t: "ok", children: "Đã rà soát" }) : /* @__PURE__ */ e(E, { t: "muted", children: "Mới" })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: Le(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.term_months ? `${t.term_months} tháng` : null, t.purpose ? mt[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${i}/${Ne.length} agent đã chạy`, children: Ne.map((l) => {
          const c = r[l];
          return /* @__PURE__ */ e(
            "span",
            {
              className: c ? Z(_e[c].tone) : "none",
              title: `${J(l)}: ${_e[c ?? "none"].label}`
            },
            l
          );
        }) }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ n("span", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
            /* @__PURE__ */ n("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            t.from_sales && /* @__PURE__ */ e(E, { t: "accent", children: "Từ ĐVKD" }),
            t.checklist_overall && /* @__PURE__ */ e(E, { t: t.checklist_overall === "COMPLETE" ? "ok" : "warn", children: t.checklist_overall }),
            (t.high_findings ?? 0) > 0 && /* @__PURE__ */ n(E, { t: "danger", children: [
              t.high_findings,
              " cảnh báo cao"
            ] }),
            t.agents_blocked > 0 && /* @__PURE__ */ n(E, { t: "danger", children: [
              t.agents_blocked,
              " bị chặn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            jt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function gn({
  onOpen: t,
  assistantOpen: s,
  syncTick: r,
  onToggleAssistant: i,
  onAskAssistant: l,
  onCreatedCase: c
}) {
  const f = Ve(), [p, o] = w(null), [a, v] = w(null), [h, N] = w(""), [d, b] = w("all"), [C, A] = w(!1), m = B(0), S = B(!1), Y = B(null), O = V(async (x = !1) => {
    if (!(x && S.current)) {
      x ? S.current = !0 : A(!0);
      try {
        const _ = (await f.get(`${ke}/cases`)).cases;
        if (Y.current === null)
          Y.current = new Set(_.map((M) => M.case_id));
        else {
          const M = _.find((q) => !Y.current.has(q.case_id));
          _.forEach((q) => Y.current.add(q.case_id)), M && c({ caseId: M.case_id, name: M.customer_name ?? M.case_id });
        }
        o(_), v(null), m.current = Date.now();
      } catch (_) {
        x || v(we(_));
      } finally {
        x ? S.current = !1 : A(!1);
      }
    }
  }, [f, c]);
  R(() => {
    O();
  }, [O]), R(() => {
    r > 0 && O(!0);
  }, [r, O]), R(() => {
    const x = () => {
      document.visibilityState !== "hidden" && Date.now() - m.current >= 3e3 && O(!0);
    };
    return window.addEventListener("focus", x), document.addEventListener("visibilitychange", x), () => {
      window.removeEventListener("focus", x), document.removeEventListener("visibilitychange", x);
    };
  }, [O]);
  const G = H(() => ({
    open: (p == null ? void 0 : p.reduce((x, _) => x + _.review_open, 0)) ?? 0,
    blocked: (p == null ? void 0 : p.reduce((x, _) => x + _.agents_blocked, 0)) ?? 0,
    high: (p == null ? void 0 : p.reduce((x, _) => x + (_.high_findings ?? 0), 0)) ?? 0
  }), [p]), k = H(() => {
    const x = h.trim().toLowerCase();
    return (p ?? []).filter((_) => d === "review" && _.review_open === 0 || d === "blocked" && _.agents_blocked === 0 ? !1 : x ? [_.customer_name, _.case_id, _.industry_code].some((M) => M == null ? void 0 : M.toLowerCase().includes(x)) : !0);
  }, [p, h, d]), $ = () => l("Tạo hồ sơ thẩm định SME mới: ", "new_intake");
  return /* @__PURE__ */ n(nt, { children: [
    /* @__PURE__ */ e(
      wt,
      {
        title: "Thẩm định SME",
        subtitle: "Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(K, { onClick: () => O(), busy: C, children: [
            /* @__PURE__ */ e(rt, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            K,
            {
              className: s ? "sme-toggle-on" : void 0,
              "aria-pressed": s,
              onClick: i,
              title: s ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
              children: [
                /* @__PURE__ */ e(De, { size: 14 }),
                " Trợ lý thẩm định"
              ]
            }
          ),
          /* @__PURE__ */ n(K, { primary: !0, onClick: $, children: [
            /* @__PURE__ */ e(Fe, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      a && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(st, { title: "Không tải được danh sách hồ sơ", children: a }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(ie, { icon: /* @__PURE__ */ e(Xe, { size: 18 }), label: "Hồ sơ", value: (p == null ? void 0 : p.length) ?? "…" }),
        /* @__PURE__ */ e(
          ie,
          {
            t: "warn",
            icon: /* @__PURE__ */ e(it, { size: 18 }),
            label: "Mục chờ rà soát",
            value: p ? G.open : "…",
            hint: "Cần cán bộ xác nhận"
          }
        ),
        /* @__PURE__ */ e(ie, { t: "danger", icon: /* @__PURE__ */ e(Ct, { size: 18 }), label: "Cảnh báo mức cao", value: p ? G.high : "…" }),
        /* @__PURE__ */ e(
          ie,
          {
            t: G.blocked ? "danger" : "ok",
            icon: /* @__PURE__ */ e(St, { size: 18 }),
            label: "Kết quả bị chặn",
            value: p ? G.blocked : "…",
            hint: "Không qua kiểm chứng"
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hồ sơ", children: [["all", "Tất cả"], ["review", "Chờ rà soát"], ["blocked", "Bị chặn"]].map(([x, _]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": d === x,
            className: `sme-filter ${d === x ? "on" : ""}`,
            onClick: () => b(x),
            children: _
          },
          x
        )) }),
        /* @__PURE__ */ n("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(Ie, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: h, onChange: (x) => N(x.target.value), placeholder: "Tìm khách hàng, mã hồ sơ, mã ngành" })
        ] })
      ] }),
      p === null && !a && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((x) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, x)) }),
      p && p.length === 0 && /* @__PURE__ */ e(
        se,
        {
          icon: /* @__PURE__ */ e(Xe, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn.",
          action: /* @__PURE__ */ n(K, { primary: !0, onClick: $, children: [
            /* @__PURE__ */ e(Fe, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      p && p.length > 0 && k.length === 0 && /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(Ie, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      k.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: k.map((x) => /* @__PURE__ */ e(un, { c: x, onOpen: () => t(x.case_id) }, x.case_id)) })
    ] })
  ] });
}
function bt({ state: t, size: s = 13 }) {
  return t === "passed" ? /* @__PURE__ */ e(at, { size: s }) : t === "blocked" ? /* @__PURE__ */ e(Tt, { size: s }) : t === "unverified" ? /* @__PURE__ */ e(Et, { size: s }) : /* @__PURE__ */ e(lt, { size: s });
}
function vt({ state: t }) {
  const s = _e[t];
  return /* @__PURE__ */ n(E, { t: s.tone, children: [
    /* @__PURE__ */ e(bt, { state: t, size: 12 }),
    s.label
  ] });
}
const fn = 9e4, bn = (t) => Math.max(0, Math.round(t / 1e3)), Ze = (t) => {
  const s = bn(t);
  return s < 60 ? `${s} giây` : `${Math.floor(s / 60)} phút ${String(s % 60).padStart(2, "0")} giây`;
};
function vn(t) {
  const s = /* @__PURE__ */ new Map();
  for (const r of t) s.set(r.agent, [...s.get(r.agent) ?? [], r]);
  return [...s].map(([r, i]) => {
    let l = 0;
    for (let c = 0; c < i.length - 1; c++) i[c].state !== "running" && (l = c + 1);
    return [r, i.slice(l)];
  }).map(([r, i]) => ({
    agent: r,
    rows: i,
    state: i[i.length - 1].state,
    startedAt: Date.parse(i[0].ts),
    lastAt: Date.parse(i[i.length - 1].ts)
  }));
}
function xn({ caseId: t, syncTick: s }) {
  const r = Ve(), [i, l] = w([]), [c, f] = w(Date.now()), p = H(() => vn(i), [i]), o = p.some((a) => a.state === "running");
  return R(() => {
    let a = !0;
    const v = async () => {
      if (document.visibilityState !== "hidden")
        try {
          const N = await r.get(`${ke}/cases/${t}/progress`);
          a && l(N.rows ?? []);
        } catch {
        }
    };
    v();
    const h = window.setInterval(() => {
      f(Date.now()), v();
    }, o ? 3e3 : 15e3);
    return () => {
      a = !1, window.clearInterval(h);
    };
  }, [r, t, o, s]), p.length === 0 ? null : /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tiến độ thẩm định" }),
      /* @__PURE__ */ e(E, { t: o ? "accent" : "ok", children: o ? "Đang chạy" : "Đã xong các bước đã báo" })
    ] }),
    /* @__PURE__ */ e("p", { className: "sme-small sme-muted", style: { margin: "0 0 8px" }, children: "Các bước do agent tự báo khi làm việc; thời gian tính từ lúc bước đầu tiên được báo." }),
    p.map((a) => {
      const v = a.rows[a.rows.length - 1], h = a.state === "running" && c - a.lastAt > fn, N = (a.state === "running" ? c : a.lastAt) - a.startedAt;
      return /* @__PURE__ */ n("div", { style: { padding: "8px 0", borderTop: "1px solid var(--border)" }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between", children: [
          /* @__PURE__ */ n("span", { style: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13 }, children: [
            a.state === "done" ? /* @__PURE__ */ e(at, { size: 15, color: "var(--ok)" }) : a.state === "failed" ? /* @__PURE__ */ e(At, { size: 15, color: "var(--danger)" }) : h ? /* @__PURE__ */ e(lt, { size: 15, color: "var(--warn, var(--muted))" }) : /* @__PURE__ */ e($t, { size: 15, className: "sme-spin", color: "var(--accent)" }),
            J(a.agent)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Ze(N) })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small", style: { margin: "4px 0 0 23px" }, children: [
          v.step,
          v.detail ? /* @__PURE__ */ n("span", { className: "sme-muted", children: [
            " · ",
            v.detail
          ] }) : null,
          h && /* @__PURE__ */ n("span", { style: { color: "var(--warn, var(--muted))" }, children: [
            " · chưa có cập nhật mới ",
            Ze(c - a.lastAt)
          ] })
        ] }),
        a.rows.length > 1 && /* @__PURE__ */ e("ol", { className: "sme-small sme-muted", style: { margin: "4px 0 0 23px", paddingLeft: 16 }, children: a.rows.slice(0, -1).map((d, b) => /* @__PURE__ */ e("li", { children: d.step }, b)) })
      ] }, a.agent);
    })
  ] });
}
function xt({ f: t, onEvidence: s }) {
  const r = fe[t.severity] ?? fe.info;
  return /* @__PURE__ */ n("div", { className: `sme-finding ${Z(r.tone)}`, children: [
    /* @__PURE__ */ e("div", { className: "bar" }),
    /* @__PURE__ */ n("div", { children: [
      /* @__PURE__ */ n("div", { className: "sme-finding-topic sme-row", style: { gap: 6 }, children: [
        /* @__PURE__ */ e(E, { t: r.tone, children: r.label }),
        /* @__PURE__ */ e("span", { children: t.topic.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-finding-text", children: [
        t.statement,
        /* @__PURE__ */ e(Ge, { refs: t.evidence_refs, onOpen: s })
      ] })
    ] })
  ] });
}
function yn({ m: t }) {
  const s = Math.max(1.6, (t.threshold ?? 0) * 1.3, ...t.scenarios.map((r) => r.dscr ?? 0));
  return /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Khả năng trả nợ (DSCR)" }),
      t.threshold !== void 0 && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Ngưỡng chính sách ≥ ",
        Q(t.threshold)
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-bars", children: t.scenarios.map((r) => {
      const i = t.threshold === void 0 || (r.dscr ?? 0) >= t.threshold;
      return /* @__PURE__ */ n("div", { className: `sme-bar-row ${Z(i ? "ok" : "danger")}`, children: [
        /* @__PURE__ */ e("span", { className: "sme-muted", children: r.stress_pct ? `Stress −${r.stress_pct}%` : "Cơ sở" }),
        /* @__PURE__ */ n("div", { className: "sme-bar-track", children: [
          /* @__PURE__ */ e("div", { className: "sme-bar-fill", style: { width: `${Math.min(100, (r.dscr ?? 0) / s * 100)}%` } }),
          t.threshold !== void 0 && /* @__PURE__ */ e("div", { className: "sme-bar-mark", style: { left: `${t.threshold / s * 100}%` } })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-num sme-strong", children: Q(r.dscr) })
      ] }, r.stress_pct);
    }) }),
    (t.cash !== void 0 || t.debtService !== void 0) && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 10 }, children: [
      "Dòng tiền trả nợ ",
      Le(t.cash),
      " / năm · Nghĩa vụ trả nợ ",
      Le(t.debtService),
      " / năm"
    ] })
  ] });
}
function wn({ m: t }) {
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
        const r = pn[s.status] ?? { label: s.status, tone: "muted" }, i = (l) => s.fact === "loan_amount" ? Le(l) : typeof l == "number" ? Q(l) : "—";
        return /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ n("td", { children: [
            hn[s.fact] ?? s.fact,
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: s.clause })
          ] }),
          /* @__PURE__ */ n("td", { className: "sme-num", children: [
            s.op,
            " ",
            i(s.threshold)
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: i(s.actual) }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(E, { t: r.tone, children: r.label }) })
        ] }, s.id);
      }) })
    ] })
  ] });
}
function kn({ periods: t }) {
  const s = Object.keys(Be).filter((r) => t.some((i) => {
    var l;
    return ((l = i.ratios) == null ? void 0 : l[r]) != null;
  }));
  return s.length ? /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 8 }, children: "Chỉ số tài chính" }),
    /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Chỉ số" }),
        t.map((r) => /* @__PURE__ */ e("th", { className: "sme-num", children: r.period }, r.period))
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: s.map((r) => /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("td", { children: Be[r].label }),
        t.map((i) => {
          var l;
          return /* @__PURE__ */ e("td", { className: "sme-num", children: Be[r].fmt((l = i.ratios) == null ? void 0 : l[r]) }, i.period);
        })
      ] }, r)) })
    ] })
  ] }) : null;
}
function Nn({ detail: t, m: s, syncTick: r, onEvidence: i, goAgents: l }) {
  const c = t.results.consolidation, f = Ne.flatMap((o) => {
    var a;
    return (((a = t.results[o]) == null ? void 0 : a.findings) ?? []).filter((v) => v.severity === "high").map((v) => ({ ...v, agent: o }));
  }), p = Object.values(t.evidence).some((o) => /MẪU|sample/i.test(String(o.source)));
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    p && /* @__PURE__ */ n(ft, { children: [
      "Hồ sơ đang dùng ",
      /* @__PURE__ */ e("b", { children: "dữ liệu mẫu" }),
      " (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng."
    ] }),
    /* @__PURE__ */ e(xn, { caseId: t.case.case_id, syncTick: r }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tóm tắt thẩm định" }),
        c ? /* @__PURE__ */ e(vt, { state: Re(c) }) : /* @__PURE__ */ e(E, { t: "muted", children: "Chưa tổng hợp" })
      ] }),
      c ? /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: c.summary }) : /* @__PURE__ */ n("p", { className: "sme-muted", style: { margin: 0 }, children: [
        "Agent Tổng hợp chưa chạy. Kết quả từng agent xem ở tab ",
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-ref",
            onClick: l,
            children: "Kết quả agent"
          }
        ),
        "."
      ] })
    ] }),
    f.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 4 }, children: [
        "Cảnh báo mức cao (",
        f.length,
        ")"
      ] }),
      f.map((o) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: J(o.agent) }),
        /* @__PURE__ */ e(xt, { f: o, onEvidence: i })
      ] }, o.agent + o.id))
    ] }),
    s.dscr && /* @__PURE__ */ e(yn, { m: s.dscr }),
    s.policy && /* @__PURE__ */ e(wn, { m: s.policy }),
    s.ratios && /* @__PURE__ */ e(kn, { periods: s.ratios })
  ] });
}
function _n({ id: t, r: s, open: r, onToggle: i, onEvidence: l, onAsk: c }) {
  var p, o;
  const f = ["high", "medium", "low"].map((a) => [a, s.findings.filter((v) => v.severity === a).length]);
  return /* @__PURE__ */ n("div", { className: "sme-card", id: `agent-${t}`, children: [
    /* @__PURE__ */ n("button", { type: "button", className: `sme-acc-head ${r ? "open" : ""}`, onClick: i, "aria-expanded": r, children: [
      /* @__PURE__ */ e(Lt, { size: 16, className: "chev" }),
      /* @__PURE__ */ n("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: J(t) }),
          /* @__PURE__ */ e(vt, { state: Re(s) })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-small sme-muted", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ n("span", { children: [
            "v",
            s._version,
            " · độ tin cậy ",
            on[s.confidence] ?? s.confidence,
            " · ",
            ae(s._saved_at)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-sev-counts", children: f.filter(([, a]) => a > 0).map(([a, v]) => /* @__PURE__ */ n(E, { t: fe[a].tone, children: [
            v,
            " ",
            fe[a].label.toLowerCase()
          ] }, a)) })
        ] })
      ] })
    ] }),
    r && /* @__PURE__ */ n("div", { className: "sme-acc-body sme-stack", children: [
      /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: s.summary }),
      s.verification && !s.verification.passed && /* @__PURE__ */ n(ft, { t: "danger", children: [
        /* @__PURE__ */ e("b", { children: "Lý do bị chặn:" }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: s.verification.errors.slice(0, 8).map((a, v) => /* @__PURE__ */ e("li", { children: a }, v)) })
      ] }),
      s.findings.length > 0 && /* @__PURE__ */ e("div", { children: dn(s.findings).map((a) => /* @__PURE__ */ e(xt, { f: a, onEvidence: l }, a.id)) }),
      (((p = s.missing_information) == null ? void 0 : p.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Còn thiếu" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.missing_information.map((a, v) => /* @__PURE__ */ e("li", { children: a }, v)) })
      ] }),
      (((o = s.open_issues) == null ? void 0 : o.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Vấn đề mở" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.open_issues.map((a, v) => /* @__PURE__ */ e("li", { children: a }, v)) })
      ] }),
      c && /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ n(K, { onClick: c, children: [
        /* @__PURE__ */ e(De, { size: 13 }),
        " Hỏi trợ lý về phần này"
      ] }) })
    ] })
  ] });
}
function Cn({ detail: t, openAgent: s, onEvidence: r, onRunAssessment: i, onAskAgent: l }) {
  const c = Ne.filter((a) => t.results[a]), [f, p] = w(() => new Set(s ? [s] : []));
  if (R(() => {
    s && (p((a) => new Set(a).add(s)), requestAnimationFrame(() => {
      var a;
      return (a = document.getElementById(`agent-${s}`)) == null ? void 0 : a.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
  }, [s]), !c.length)
    return /* @__PURE__ */ e(
      se,
      {
        icon: /* @__PURE__ */ e(dt, { size: 30 }),
        title: "Chưa có kết quả",
        hint: "Chạy thẩm định để các agent ghi kết quả vào hồ sơ.",
        action: i ? /* @__PURE__ */ n(K, { primary: !0, onClick: i, children: [
          /* @__PURE__ */ e(ct, { size: 13 }),
          " Chạy thẩm định"
        ] }) : void 0
      }
    );
  const o = (a) => p((v) => {
    const h = new Set(v);
    return h.has(a) ? h.delete(a) : h.add(a), h;
  });
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ e(K, { onClick: () => p(f.size === c.length ? /* @__PURE__ */ new Set() : new Set(c)), children: f.size === c.length ? "Thu gọn tất cả" : "Mở tất cả" }) }),
    c.map((a) => /* @__PURE__ */ e(
      _n,
      {
        id: a,
        r: t.results[a],
        open: f.has(a),
        onToggle: () => o(a),
        onEvidence: r,
        onAsk: l ? () => l(a, J(a)) : void 0
      },
      a
    ))
  ] });
}
function Sn({ detail: t, focus: s }) {
  const r = Object.values(t.evidence), [i, l] = w(""), [c, f] = w("all"), [p, o] = w(s);
  R(() => {
    s && (o(s), l(""), f("all"), requestAnimationFrame(() => {
      var h;
      return (h = document.getElementById(`ev-${s}`)) == null ? void 0 : h.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const a = H(() => Array.from(new Set(r.map((h) => h.added_by))), [r]), v = r.filter((h) => (c === "all" || h.added_by === c) && (!i.trim() || `${h.id} ${h.source} ${Qe(h.value)}`.toLowerCase().includes(i.trim().toLowerCase())));
  return r.length ? /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("div", { className: "sme-filters", children: [
        /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === "all" ? "on" : ""}`, onClick: () => f("all"), children: "Tất cả" }),
        a.map((h) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === h ? "on" : ""}`, onClick: () => f(h), children: J(h) }, h))
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-search", children: [
        /* @__PURE__ */ e(Ie, { size: 14, className: "sme-muted" }),
        /* @__PURE__ */ e("input", { value: i, onChange: (h) => l(h.target.value), placeholder: "Tìm mã, nguồn, giá trị" })
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
        /* @__PURE__ */ e("tbody", { children: v.map((h) => {
          const N = Qe(h.value), d = p === h.id;
          return /* @__PURE__ */ n(
            "tr",
            {
              id: `ev-${h.id}`,
              className: `click ${s === h.id ? "focus" : ""}`,
              onClick: () => o(d ? null : h.id),
              children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: h.id }),
                /* @__PURE__ */ e("td", { children: h.source }),
                /* @__PURE__ */ n("td", { children: [
                  /* @__PURE__ */ e("span", { className: "sme-mono", style: { wordBreak: "break-word" }, children: N.length > 90 && !d ? N.slice(0, 88) + "…" : d ? "" : N }),
                  d && /* @__PURE__ */ e("pre", { className: "sme-pre", children: N })
                ] }),
                /* @__PURE__ */ n("td", { className: "sme-muted sme-small", children: [
                  J(h.added_by),
                  /* @__PURE__ */ e("div", { children: ae(h.added_at) })
                ] })
              ]
            },
            h.id
          );
        }) })
      ] }),
      v.length === 0 && /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(Ie, { size: 24 }), title: "Không có bằng chứng phù hợp" })
    ] })
  ] }) : /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(dt, { size: 30 }), title: "Chưa có bằng chứng" });
}
function Tn({ detail: t, focus: s, onDecide: r, onEvidence: i }) {
  const [l, c] = w("open"), [f, p] = w({}), [o, a] = w(null);
  R(() => {
    s && (c("all"), requestAnimationFrame(() => {
      var d;
      return (d = document.getElementById(`rv-${s}`)) == null ? void 0 : d.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const v = t.review.filter((d) => d.status === "open").length, h = t.review.filter((d) => l === "all" || l === "open" == (d.status === "open")), N = async (d, b) => {
    a(d + b);
    try {
      await r(d, b, f[d] ?? "") && p((C) => ({ ...C, [d]: "" }));
    } finally {
      a(null);
    }
  };
  return t.review.length ? /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [["open", `Chờ xử lý (${v})`], ["done", `Đã xử lý (${t.review.length - v})`], ["all", "Tất cả"]].map(([d, b]) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${l === d ? "on" : ""}`, onClick: () => c(d), children: b }, d)) }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: "Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát." })
    ] }),
    h.length === 0 && /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(He, { size: 30 }), title: l === "open" ? "Đã xử lý hết các mục" : "Không có mục nào" }),
    h.map((d) => {
      const b = Ue[d.reason_code] ?? { label: d.reason_code, tone: "muted" }, C = gt[d.status] ?? { label: d.status, tone: "muted" }, A = f[d.id] ?? "";
      return /* @__PURE__ */ n(
        "div",
        {
          id: `rv-${d.id}`,
          className: `sme-card sme-review ${Z(b.tone)}`,
          style: s === d.id ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)" } : void 0,
          children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ n("span", { className: "sme-row", children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: d.id }),
                /* @__PURE__ */ e(E, { t: b.tone, children: b.label })
              ] }),
              /* @__PURE__ */ e(E, { t: C.tone, children: C.label })
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "10px 0 6px", fontSize: 13.5, lineHeight: 1.55 }, children: d.detail }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              J(d.source_agent),
              " · ",
              ae(d.created_at),
              /* @__PURE__ */ e(Ge, { refs: d.evidence_refs, onOpen: i })
            ] }),
            d.status === "open" ? /* @__PURE__ */ n("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ e(
                "textarea",
                {
                  className: "sme-textarea",
                  value: A,
                  placeholder: "Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…",
                  onChange: (m) => p({ ...f, [d.id]: m.target.value })
                }
              ),
              /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ e(K, { disabled: !A.trim(), busy: o === d.id + "needs_info", onClick: () => N(d.id, "needs_info"), children: "Yêu cầu bổ sung" }),
                /* @__PURE__ */ e(K, { primary: !0, disabled: !A.trim(), busy: o === d.id + "confirmed", onClick: () => N(d.id, "confirmed"), children: "Xác nhận" })
              ] })
            ] }) : /* @__PURE__ */ n("div", { className: `sme-decision ${Z(C.tone)}`, children: [
              /* @__PURE__ */ e("b", { children: C.label }),
              " bởi ",
              d.decided_by,
              " · ",
              ae(d.decided_at),
              /* @__PURE__ */ e("div", { style: { marginTop: 2 }, children: d.note })
            ] })
          ]
        },
        d.id
      );
    })
  ] }) : /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(He, { size: 30 }), title: "Không có mục cần rà soát" });
}
function En({ detail: t, onEvidence: s }) {
  const r = t.checklist, i = t.crosschecks, l = t.case.sales_handover, [c, f] = w("open"), [p, o] = w("ALL"), [a, v] = w(!1), h = (r == null ? void 0 : r.items) ?? [], N = H(() => h.filter((m) => m.rule_status !== "SKIPPED"), [h]), d = H(() => h.filter((m) => m.rule_status === "SKIPPED"), [h]), b = H(
    () => N.filter((m) => m.rule_status !== "PASS").length,
    [N]
  );
  R(() => {
    b === 0 && c === "open" && f("all");
  }, [b, c]);
  const C = H(() => (a ? d : N).filter((S) => p !== "ALL" && S.group !== p ? !1 : a ? !0 : c === "open" ? S.rule_status !== "PASS" : c === "pass" ? S.rule_status === "PASS" : !0), [a, d, N, p, c]), A = H(
    () => ((i == null ? void 0 : i.rules) ?? []).filter((m) => a || m.status !== "SKIPPED"),
    [i, a]
  );
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    l && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Phiếu bàn giao từ ĐVKD (Sale)" }),
        /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          l.submitted_by,
          " · ",
          ae(l.submitted_at)
        ] })
      ] }),
      l.submission_note && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 6 }, children: [
        /* @__PURE__ */ e("b", { children: "Giải trình ĐVKD:" }),
        " ",
        l.submission_note
      ] }),
      (l.waivers ?? []).length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 6 }, children: [
        /* @__PURE__ */ n("b", { children: [
          "Các mục ĐVKD xin miễn / bổ sung sau (",
          l.waivers.length,
          "):"
        ] }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: l.waivers.map((m) => /* @__PURE__ */ n("li", { children: [
          /* @__PURE__ */ e("b", { children: m.title }),
          ": ",
          m.note || "Không có ghi chú"
        ] }, m.key)) })
      ] })
    ] }),
    i && /* @__PURE__ */ n("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "12px 14px 8px" }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "7 Quy tắc đối chiếu chéo trọng yếu (R1 → R7)" }),
        /* @__PURE__ */ e(E, { t: ge(i.overall_status).tone, children: ge(i.overall_status).label })
      ] }),
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 52 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Quy tắc đối chiếu" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ & Bằng chứng" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: A.map((m) => {
          const S = rn[m.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: m.id }),
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: m.title }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: m.detail })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-small", children: [
              m.document_refs.length > 0 && /* @__PURE__ */ e("span", { className: "sme-mono", children: m.document_refs.join(", ") }),
              m.evidence_refs.length > 0 && /* @__PURE__ */ e(Ge, { refs: m.evidence_refs, onOpen: s }),
              m.document_refs.length === 0 && m.evidence_refs.length === 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" })
            ] }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(E, { t: S.tone, children: S.label }) })
          ] }, m.id);
        }) })
      ] })
    ] }),
    r && /* @__PURE__ */ n("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "12px 14px 8px", gap: 8 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ e("h3", { className: "sme-h3", children: "SME Master Checklist 2 lớp (Nhóm A → I)" }),
          /* @__PURE__ */ e(E, { t: ge(r.overall_status).tone, children: ge(r.overall_status).label }),
          /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: pt(r.counts) })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: d.length > 0 && /* @__PURE__ */ n(
          K,
          {
            className: a ? "sme-toggle-on" : void 0,
            onClick: () => v((m) => !m),
            title: "Các mục không áp dụng được ẩn mặc định",
            children: [
              a ? /* @__PURE__ */ e(zt, { size: 13 }) : /* @__PURE__ */ e(ot, { size: 13 }),
              a ? "Quay lại mục áp dụng" : `Hiện mục không áp dụng (${d.length})`
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "0 14px 10px", gap: 8 }, children: [
        a ? /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          "Đang hiển thị ",
          d.length,
          " mục không áp dụng (mặc định ẩn vì điều kiện Lớp 1 không kích hoạt)."
        ] }) : /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["open", `Cần lưu ý (${b})`], ["pass", `Đạt (${r.counts.PASS ?? 0})`], ["all", `Tất cả áp dụng (${N.length})`]].map(([m, S]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": c === m,
            className: `sme-filter ${c === m ? "on" : ""}`,
            onClick: () => f(m),
            children: S
          },
          m
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-filters", role: "group", "aria-label": "Nhóm checklist", children: [
          /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${p === "ALL" ? "on" : ""}`, onClick: () => o("ALL"), children: "A–I" }),
          r.groups.filter((m) => a ? m.counts.SKIPPED > 0 : m.total_applicable > 0).map((m) => /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: `sme-filter ${p === m.group ? "on" : ""}`,
              onClick: () => o(m.group),
              title: m.label,
              children: m.group
            },
            m.group
          ))
        ] })
      ] }),
      C.length === 0 ? /* @__PURE__ */ e("div", { style: { padding: 16 }, children: /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(He, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Hạng mục, Điều kiện (Lớp 1) & Rule (Lớp 2)" }),
          /* @__PURE__ */ e("th", { children: "Nguồn" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Trạng thái" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: C.map((m) => {
          const S = ht[m.rule_status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-small", children: m.group }),
                /* @__PURE__ */ e("span", { className: "sme-strong", children: m.title }),
                m.crosscheck_refs.length > 0 && /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: m.crosscheck_refs.join(", ") })
              ] }),
              /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
                "ĐK: ",
                m.condition_label
              ] }),
              /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
                "Rule: ",
                m.rule_label
              ] }),
              m.fail_reasons.length > 0 && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: m.rule_status === "FAIL" ? "var(--danger)" : void 0 }, children: m.fail_reasons.join("; ") })
            ] }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(E, { t: m.owner_role === "RM_INTERNAL" ? "accent" : "muted", children: m.owner_role === "RM_INTERNAL" ? "ĐVKD nội bộ" : "Khách hàng" }) }),
            /* @__PURE__ */ e("td", { className: "sme-mono sme-small", children: m.document_refs.length ? m.document_refs.join(", ") : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(E, { t: S.tone, children: S.label }) })
          ] }, m.key);
        }) })
      ] })
    ] })
  ] });
}
function An({ detail: t }) {
  if (!t.audit.length) return /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(It, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (i) => i.action === "verification" ? i.passed ? "ok" : "danger" : i.action === "review_decide" || i.action === "case_handover_received" ? "accent" : i.action === "review_add" ? "warn" : "muted", r = (i) => {
    var c, f;
    const l = i.agent ? J(i.agent) : i.actor ?? i.by ?? "";
    switch (i.action) {
      case "result_put":
        return `${l} lưu kết quả v${i.version}${i.rerun_reason ? ` (chạy lại: ${i.rerun_reason})` : ""}`;
      case "verification":
        return `${l} v${i.version}: ${i.passed ? "đạt kiểm chứng" : "bị chặn"}`;
      case "evidence_add":
        return `${l} thêm ${(i.ids ?? []).join(", ")}`;
      case "review_add":
        return `${l} thêm ${i.id} (${((c = Ue[i.reason_code]) == null ? void 0 : c.label) ?? i.reason_code})`;
      case "review_decide":
        return `${i.actor} ${((f = gt[i.status]) == null ? void 0 : f.label.toLowerCase()) ?? i.status} ${i.id}`;
      case "case_handover_received":
        return `Nhận từ ${i.from_app ?? "sme-sales"} bởi ${i.by ?? ""}, ${i.documents ?? 0} chứng từ (${i.files_copied ?? 0} file)`;
      case "case_create":
        return `Luồng ${i.flow}, ${i.documents} chứng từ`;
      default:
        return l;
    }
  };
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t.audit].reverse().map((i, l) => /* @__PURE__ */ n("div", { className: `sme-tl-item ${Z(s(i))}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", style: { fontSize: 13 }, children: cn[i.action] ?? i.action }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: ae(i.ts) })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: r(i) })
  ] }, l)) }) });
}
function $n({ detail: t, flow: s, onAgent: r }) {
  return /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: ut.map((i) => /* @__PURE__ */ n("div", { className: "sme-phase", children: [
    /* @__PURE__ */ e("span", { className: "sme-phase-name", children: i.name }),
    i.agents.map((l) => {
      const c = l === "industry" && s !== "B" && !t.results[l], f = c ? "none" : Re(t.results[l]);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${Z(_e[f].tone)} ${c || f === "none" ? "skip" : ""}`,
          disabled: c || f === "none",
          title: c ? "Chỉ chạy ở luồng B" : _e[f].label,
          onClick: () => r(l),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(bt, { state: f, size: 12 }) }),
            /* @__PURE__ */ n("span", { children: [
              J(l),
              c ? " (luồng B)" : ""
            ] })
          ]
        },
        l
      );
    })
  ] }, i.name)) }) });
}
function Oe({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function zn({
  caseId: t,
  assistantOpen: s,
  syncTick: r,
  onBack: i,
  onToggleAssistant: l,
  onAskAssistant: c,
  onCaseMetaChange: f
}) {
  var xe, le, Te, Ee, ye;
  const p = Ve(), [o, a] = w(null), [v, h] = w(null), [N, d] = w(!1), [b, C] = w("overview"), [A, m] = w(null), [S, Y] = w(null), [O, G] = w(null), [k, $] = w(null), x = B(0), _ = B(!1), M = async (g) => {
    $(g);
    try {
      const u = await p.get(`${ke}/cases/${t}/documents/${g}/file`), y = atob(u.content_b64), T = new Uint8Array(y.length);
      for (let U = 0; U < y.length; U++) T[U] = y.charCodeAt(U);
      const I = new Blob([T], { type: u.mime || "application/octet-stream" }), L = URL.createObjectURL(I);
      if (u.mime.startsWith("image/") || u.mime === "application/pdf" || u.mime.startsWith("text/")) {
        if (!window.open(L, "_blank", "noopener")) {
          const me = document.createElement("a");
          me.href = L, me.download = u.name, me.click();
        }
      } else {
        const U = document.createElement("a");
        U.href = L, U.download = u.name, U.click();
      }
      setTimeout(() => URL.revokeObjectURL(L), 6e4);
    } catch (u) {
      h(we(u));
    } finally {
      $(null);
    }
  }, q = V(async (g = !1) => {
    if (!(g && _.current)) {
      g ? _.current = !0 : d(!0);
      try {
        a(await p.get(`${ke}/cases/${t}`)), h(null), x.current = Date.now();
      } catch (u) {
        g || h(we(u));
      } finally {
        g ? _.current = !1 : d(!1);
      }
    }
  }, [p, t]);
  R(() => {
    q();
  }, [q]), R(() => {
    r > 0 && q(!0);
  }, [r, q]), R(() => {
    const g = () => {
      document.visibilityState !== "hidden" && Date.now() - x.current >= 3e3 && q(!0);
    };
    return window.addEventListener("focus", g), document.addEventListener("visibilitychange", g), () => {
      window.removeEventListener("focus", g), document.removeEventListener("visibilitychange", g);
    };
  }, [q]);
  const W = H(() => o ? mn(o) : {}, [o]), P = (o == null ? void 0 : o.review.filter((g) => g.status === "open")) ?? [], X = H(
    () => o ? Ne.filter((g) => Re(o.results[g]) === "blocked").length : 0,
    [o]
  ), ee = (xe = W.policy) == null ? void 0 : xe.rows.filter((g) => g.status === "not_met").length, F = ((Te = (le = W.dscr) == null ? void 0 : le.scenarios.find((g) => g.stress_pct === 0)) == null ? void 0 : Te.dscr) ?? null, re = (g) => {
    m(g), C("evidence");
  }, Ce = (g) => {
    Y(g), C("review");
  }, Se = (g) => {
    G(g), C("agents");
  }, oe = async (g, u, y) => {
    try {
      return await p.post(`${ke}/cases/${t}/review/${g}`, { status: u, note: y }), await q(), !0;
    } catch (T) {
      return h(we(T)), !1;
    }
  }, z = o == null ? void 0 : o.case, D = (z == null ? void 0 : z.customer) ?? {}, j = (z == null ? void 0 : z.request) ?? {}, te = D.name ? String(D.name) : void 0, ne = (z == null ? void 0 : z.flow) ?? "A", be = P.length > 0 || X > 0;
  R(() => {
    f({ customerName: te, flow: ne, hasIssues: be });
  }, [te, ne, be, f]);
  const ce = () => c(`Chạy thẩm định hồ sơ ${t}, luồng ${ne}.`, "prefill"), de = (g, u) => c(
    `Giải thích chi tiết kết quả, bằng chứng và điểm cần lưu ý của agent ${u} (${g}) trên hồ sơ ${t}.`,
    "prefill"
  ), ve = H(() => {
    var u;
    const g = (u = o == null ? void 0 : o.checklist) == null ? void 0 : u.counts;
    return g ? (g.MISSING_REQUIRED ?? 0) + (g.FAIL ?? 0) + (g.UNDETERMINED_CONDITION ?? 0) : 0;
  }, [o]), Ke = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Checklist & Đối chiếu", count: ve || void 0 },
    { key: "agents", label: "Kết quả agent", count: o ? Object.keys(o.results).length : void 0 },
    { key: "evidence", label: "Bằng chứng", count: o ? Object.keys(o.evidence).length : void 0 },
    { key: "review", label: "Rà soát", count: P.length || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: i, children: [
          /* @__PURE__ */ e(Dt, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: String(D.name ?? t) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          z && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            z.flow
          ] }),
          (z == null ? void 0 : z.sales_handover) && /* @__PURE__ */ e(E, { t: "accent", children: "Nhận từ ĐVKD" }),
          (o == null ? void 0 : o.checklist) && /* @__PURE__ */ e(
            E,
            {
              t: ge(o.checklist.overall_status).tone,
              title: `Kiểm tra quy tắc Master Checklist: ${pt(o.checklist.counts)}`,
              children: ge(o.checklist.overall_status).label
            }
          ),
          D.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(D.industry_code)
          ] }),
          j.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: mt[j.purpose] ?? j.purpose }),
          z && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Tạo ",
            ae(z.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(K, { onClick: () => q(), busy: N, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(rt, { size: 14 }) }),
        /* @__PURE__ */ n(
          K,
          {
            className: s ? "sme-toggle-on" : void 0,
            "aria-pressed": s,
            onClick: l,
            title: s ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
            children: [
              /* @__PURE__ */ e(De, { size: 14 }),
              " Trợ lý thẩm định"
            ]
          }
        ),
        /* @__PURE__ */ n(K, { primary: !0, onClick: ce, children: [
          /* @__PURE__ */ e(ct, { size: 14 }),
          " Chạy thẩm định"
        ] })
      ] })
    ] }),
    v && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(st, { title: "Có lỗi khi làm việc với hồ sơ", children: v }) }),
    !o && !v && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "70%" } })
    ] }),
    o && z && /* @__PURE__ */ n(nt, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          ie,
          {
            icon: /* @__PURE__ */ e(Rt, { size: 18 }),
            label: "Số tiền đề nghị",
            value: Ht(j.amount).replace(" đ", ""),
            hint: [j.term_months ? `${j.term_months} tháng` : null, j.annual_rate_pct ? `lãi ${Q(j.annual_rate_pct)}%/năm` : null].filter(Boolean).join(" · ") || "VND"
          }
        ),
        /* @__PURE__ */ e(
          ie,
          {
            t: F == null ? "muted" : ((Ee = W.dscr) == null ? void 0 : Ee.threshold) !== void 0 && F < W.dscr.threshold ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Kt, { size: 18 }),
            label: "DSCR cơ sở",
            value: Q(F),
            hint: ((ye = W.dscr) == null ? void 0 : ye.threshold) !== void 0 ? `Ngưỡng ≥ ${Q(W.dscr.threshold)}` : "Chưa có phân tích"
          }
        ),
        /* @__PURE__ */ e(
          ie,
          {
            t: ee == null ? "muted" : ee > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Mt, { size: 18 }),
            label: "Điều kiện không đạt",
            value: ee ?? "—",
            hint: W.policy ? [`${W.policy.rows.length} điều kiện`, W.policy.product].filter(Boolean).join(" · ") : "Chưa kiểm tra chính sách"
          }
        ),
        /* @__PURE__ */ e(
          ie,
          {
            t: P.length ? "warn" : "ok",
            icon: /* @__PURE__ */ e(it, { size: 18 }),
            label: "Chờ cán bộ rà soát",
            value: P.length,
            hint: `${o.review.length} mục tổng cộng`
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e($n, { detail: o, flow: z.flow, onAgent: Se }) }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Ke.map((g) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": b === g.key,
              className: `sme-tab ${b === g.key ? "on" : ""}`,
              onClick: () => C(g.key),
              children: [
                g.label,
                g.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: g.count })
              ]
            },
            g.key
          )) }),
          b === "overview" && /* @__PURE__ */ e(Nn, { detail: o, m: W, syncTick: r, onEvidence: re, goAgents: () => C("agents") }),
          b === "checklist" && /* @__PURE__ */ e(En, { detail: o, onEvidence: re }),
          b === "agents" && /* @__PURE__ */ e(
            Cn,
            {
              detail: o,
              openAgent: O,
              onEvidence: re,
              onRunAssessment: ce,
              onAskAgent: de
            }
          ),
          b === "evidence" && /* @__PURE__ */ e(Sn, { detail: o, focus: A }),
          b === "review" && /* @__PURE__ */ e(Tn, { detail: o, focus: S, onDecide: oe, onEvidence: re }),
          b === "audit" && /* @__PURE__ */ e(An, { detail: o })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Cần xử lý" }),
              /* @__PURE__ */ e(E, { t: P.length ? "warn" : "ok", children: P.length })
            ] }),
            P.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn mục chờ rà soát." }),
            P.slice(0, 6).map((g) => {
              const u = Ue[g.reason_code] ?? { label: g.reason_code, tone: "muted" };
              return /* @__PURE__ */ n("button", { type: "button", className: "sme-todo", onClick: () => Ce(g.id), children: [
                /* @__PURE__ */ e(E, { t: u.tone, children: g.id }),
                /* @__PURE__ */ n("span", { className: "sme-todo-text", children: [
                  /* @__PURE__ */ n("b", { children: [
                    u.label,
                    "."
                  ] }),
                  " ",
                  g.detail
                ] })
              ] }, g.id);
            }),
            P.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => C("review"), children: [
              "Xem thêm ",
              P.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Khách hàng" }),
            /* @__PURE__ */ e(Oe, { label: "CIF", children: String(D.cif ?? "—") }),
            /* @__PURE__ */ e(Oe, { label: "Mã số thuế", children: String(D.tax_id ?? "—") }),
            /* @__PURE__ */ e(Oe, { label: "Số năm hoạt động", children: D.years_in_operation ?? "—" }),
            j.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(j.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Chứng từ" }),
              /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: z.documents.length })
            ] }),
            z.documents.map((g) => /* @__PURE__ */ n("div", { className: "sme-row sme-small", style: { padding: "5px 0", gap: 6 }, children: [
              /* @__PURE__ */ e(Pt, { size: 14, className: "sme-muted" }),
              /* @__PURE__ */ e("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, title: g.name, children: g.name }),
              /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: g.id }),
              g.file && /* @__PURE__ */ e(K, { busy: k === g.id, onClick: () => M(g.id), title: "Xem hoặc tải chứng từ", children: /\.(pdf|png|jpe?g|webp|txt)$/i.test(g.name) ? /* @__PURE__ */ e(ot, { size: 12 }) : /* @__PURE__ */ e(Bt, { size: 12 }) })
            ] }, g.id))
          ] }),
          o.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(Ot, { size: 13 }),
            " Hoạt động gần nhất ",
            ae(o.audit[o.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
tn();
const et = "sme-lending:assistant-open", tt = "sme-lending:assistant-width", In = "sme-lending-chat-";
function Pn() {
  const [t, s] = w(null), [r, i] = w(() => Wt(et)), [l, c] = w(() => Gt(tt)), [f, p] = w(null), [o, a] = w(null), [v, h] = w(null), N = B(0), { syncTick: d } = Qt(r, 3500), b = V((k) => {
    i(($) => {
      const x = typeof k == "function" ? k($) : k;
      return Ut(et, x), x;
    });
  }, []), C = V((k) => {
    const $ = We(k);
    c($), Xt(tt, $);
  }, []), A = V((k, $ = "prefill") => {
    b(!0), p({ id: ++N.current, prompt: k, mode: $ });
  }, [b]), m = V(() => {
    p(null);
  }, []), S = V((k) => {
    h(null), a(null), s(k);
  }, []), Y = V(() => {
    a(null), s(null);
  }, []), O = V((k) => {
    a(($) => $ === k || $ && k && $.customerName === k.customerName && $.flow === k.flow && $.hasIssues === k.hasIssues ? $ : k);
  }, []), G = H(() => {
    if (!t)
      return [{
        label: "Hồ sơ chờ xử lý",
        prompt: "Rà soát danh sách các hồ sơ thẩm định đang có mục chờ cán bộ xử lý hoặc kết quả bị chặn kiểm chứng."
      }];
    const k = [
      {
        label: "Chạy thẩm định",
        prompt: `Chạy thẩm định hồ sơ ${t}, luồng ${(o == null ? void 0 : o.flow) ?? "A"}.`
      },
      {
        label: "Giải thích kết quả",
        prompt: `Giải thích tóm tắt kết quả thẩm định, các cảnh báo mức cao và mã bằng chứng chính của hồ sơ ${t}.`
      }
    ];
    return o != null && o.hasIssues && k.push({
      label: "Phân tích mục chặn",
      prompt: `Phân tích các mục chờ rà soát và kết quả bị chặn kiểm chứng của hồ sơ ${t}, nêu rõ chứng từ cần đối chiếu.`
    }), k;
  }, [t, o]);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: t ? /* @__PURE__ */ e(
      zn,
      {
        caseId: t,
        assistantOpen: r,
        syncTick: d,
        onBack: Y,
        onToggleAssistant: () => b((k) => !k),
        onAskAssistant: A,
        onCaseMetaChange: O
      }
    ) : /* @__PURE__ */ e(
      gn,
      {
        onOpen: S,
        assistantOpen: r,
        syncTick: d,
        onToggleAssistant: () => b((k) => !k),
        onAskAssistant: A,
        onCreatedCase: h
      }
    ) }),
    r && /* @__PURE__ */ e(
      Zt,
      {
        storagePrefix: "sme-lending",
        chatPrefix: In,
        agent: nn,
        panelLabel: "Trợ lý thẩm định",
        newIntakePrompt: "Tạo hồ sơ thẩm định SME mới: ",
        newSessionTitle: "Hồ sơ SME mới",
        caseTitlePrefix: "Thẩm định",
        chips: G,
        attachDefaultPrefix: t ? `Tôi gửi thêm chứng từ cho hồ sơ thẩm định ${t}: ` : void 0,
        embedPlaceholder: t ? `Hỏi trợ lý hoặc chạy thẩm định cho ${t}...` : "Cung cấp thông tin khách hàng hoặc chứng từ để tạo hồ sơ thẩm định...",
        width: l,
        onWidthChange: C,
        onClose: () => b(!1),
        caseId: t,
        customerName: t ? o == null ? void 0 : o.customerName : void 0,
        intent: f,
        onConsumeIntent: m,
        createdCase: v,
        onOpenCase: S,
        onDismissCreatedCase: () => h(null)
      }
    )
  ] }) });
}
export {
  Pn as default
};
