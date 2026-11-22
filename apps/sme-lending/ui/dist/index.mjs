import { jsxs as n, jsx as e, Fragment as Ze } from "react/jsx-runtime";
import { useCallback as q, useState as x, useMemo as F, useRef as j, useEffect as K } from "react";
import * as Be from "@kirocrew/app-sdk";
import { useChatLauncher as ut, useAppApi as et } from "@kirocrew/app-sdk";
import { Btn as L, PageHeader as gt, ErrorNotice as tt } from "@kirocrew/app-sdk/ui";
import { MessageSquare as $e, Plus as qe, ExternalLink as Me, PanelRightClose as ft, ArrowRight as bt, AlertTriangle as vt, RefreshCw as nt, FolderOpen as We, ClipboardList as st, ShieldAlert as xt, AlertOctagon as yt, Search as Ae, CheckCircle2 as wt, XCircle as kt, CircleDot as Nt, CircleDashed as _t, EyeOff as Ct, Eye as rt, ClipboardCheck as Fe, Play as it, FileSearch as at, History as St, ChevronRight as Tt, ArrowLeft as Et, Landmark as It, Gauge as At, ShieldCheck as zt, FileText as $t, Download as Dt, Activity as Lt } from "lucide-react";
const Rt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function Kt(t, s, r) {
  const i = ut();
  return q(
    async (l, h, f) => {
      const { openChat: d } = i, o = i.createChat;
      if (!o) {
        d({ autoSend: !1, message: l });
        return;
      }
      try {
        const c = await o({ slotKey: s + Rt(h), agent: t, title: f });
        d({ slotKey: c, autoSend: !1, message: l });
      } catch {
      }
    },
    [i, t, s, r]
  );
}
const lt = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, Ee = new Intl.NumberFormat("vi-VN"), Mt = (t) => typeof t == "number" ? Ee.format(t) + " đ" : "—", ze = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? Ee.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? Ee.format(Math.round(t / 1e4) / 100) + " triệu" : Ee.format(t) + " đ", X = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", me = (t) => typeof t == "number" ? (t * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "%" : "—", re = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, Pt = (t) => {
  if (!t) return "—";
  const s = new Date(t).getTime();
  if (Number.isNaN(s)) return "—";
  const r = Math.round((Date.now() - s) / 1e3);
  return r < 60 ? "vừa xong" : r < 3600 ? `${Math.floor(r / 60)} phút trước` : r < 86400 ? `${Math.floor(r / 3600)} giờ trước` : `${Math.floor(r / 86400)} ngày trước`;
}, Ge = (t) => typeof t == "string" ? t : JSON.stringify(t, null, 2), be = (t) => t instanceof Error ? t.message : String(t), He = "kirocrew_prefill", Xe = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), Ot = (t, s) => {
};
function Ve(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function Bt(t) {
  try {
    const s = localStorage.getItem(t);
    if (s === "1") return !0;
    if (s === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function qt(t, s) {
  try {
    localStorage.setItem(t, s ? "1" : "0");
  } catch {
  }
}
function Ft(t, s = 420) {
  try {
    const r = Number(localStorage.getItem(t));
    if (Number.isFinite(r) && r >= 360 && r <= 620) return Math.round(r);
  } catch {
  }
  return s;
}
function Ht(t, s) {
  try {
    localStorage.setItem(t, String(Ve(s)));
  } catch {
  }
}
function Vt(t, s = 4e3) {
  const r = Be.useAppEvents ?? Ot, [i, l] = x(0), h = q(() => l((f) => f + 1), []);
  return r("tool_result", h), r("chat_done", h), K(() => {
    if (!t) return;
    const f = window.setInterval(() => {
      document.visibilityState !== "hidden" && l((d) => d + 1);
    }, s);
    return () => window.clearInterval(f);
  }, [t, s]), { syncTick: i, bumpSync: h };
}
function jt(t) {
  try {
    const s = sessionStorage.getItem(t);
    if (s) return s;
    const r = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, r), r;
  } catch {
    return "intake-default";
  }
}
function Ut(t, s) {
  try {
    sessionStorage.setItem(t, s);
  } catch {
  }
}
function he(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function Se(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function Te(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const r = t.value.length;
    t.setSelectionRange(r, r);
    return;
  }
  const s = window.getSelection();
  s && (s.selectAllChildren(t), s.collapseToEnd());
}
function Qe(t, s) {
  const r = Date.now();
  try {
    sessionStorage.setItem(He, JSON.stringify({ slotKey: t, prompt: s, ts: r }));
  } catch {
  }
  return r;
}
function Wt({
  storagePrefix: t,
  chatPrefix: s,
  agent: r,
  panelLabel: i,
  newIntakePrompt: l,
  newSessionTitle: h,
  caseTitlePrefix: f = "Hồ sơ",
  chips: d = [],
  showNewSessionButton: o,
  attachDefaultPrefix: c,
  embedPlaceholder: y,
  width: u,
  onWidthChange: _,
  onClose: p,
  caseId: b,
  customerName: E,
  intent: I,
  onConsumeIntent: m,
  createdCase: S,
  onOpenCase: Q,
  onDismissCreatedCase: P
}) {
  const U = Be, w = U.ChatPanel, A = U.ChatEmbed, v = Be.useChatLauncher(), N = Kt(r, s), R = `${t}:intake-id`, [O, H] = x(() => jt(R)), M = b ?? O, W = s + Xe(M), J = F(() => b ? E ? `${f} ${E} (${b})` : `${f} ${b}` : h, [b, E, h, f]), [B, te] = x(null), [ye, we] = x(null), oe = j(null);
  oe.current = B, K(() => {
    let a = !1;
    we(null);
    const g = oe.current === W, T = v.createChat;
    if (!T) {
      g || te(W);
      return;
    }
    return g || te(null), T({ slotKey: W, agent: r, title: J }).then((C) => {
      if (a) return;
      const D = C || W;
      oe.current !== D && te(D);
    }).catch((C) => {
      a || g || we(be(C));
    }), () => {
      a = !0;
    };
  }, [W, r, J, v]);
  const k = j(null), G = j(0), $ = j(null), ne = j(!1), [ce, de] = x(0), ie = q((a, g) => {
    const T = g.trim();
    if (!T) return;
    const C = he(k.current);
    if (oe.current === a && C) {
      Se(C).trim().includes(T) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: g } })), requestAnimationFrame(() => Te(he(k.current)));
      return;
    }
    const D = Qe(a, g);
    $.current = { slotKey: a, prompt: g, ts: D }, de((le) => le + 1);
  }, []);
  K(() => {
    const a = $.current;
    if (!a || B !== a.slotKey) return;
    let g = 0, T = 0;
    const C = window.setInterval(() => {
      g += 1;
      const D = he(k.current);
      if (!D) {
        g >= 20 && (window.clearInterval(C), $.current = null);
        return;
      }
      if (Se(D).trim().includes(a.prompt.trim())) {
        $.current = null, window.clearInterval(C), Te(D);
        return;
      }
      if (T += 1, T >= 3) {
        try {
          const Re = sessionStorage.getItem(He);
          if (Re) {
            const V = JSON.parse(Re);
            V.slotKey === a.slotKey && V.ts === a.ts && sessionStorage.removeItem(He);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: a.prompt } })), $.current = null, window.clearInterval(C), requestAnimationFrame(() => Te(he(k.current)));
      }
    }, 60);
    return () => window.clearInterval(C);
  }, [B, ce]), K(() => {
    if (!ne.current || !B) return;
    let a = 0;
    const g = () => {
      var D;
      const C = (D = k.current) == null ? void 0 : D.querySelector('input[type="file"]');
      return C ? (ne.current = !1, C.click(), !0) : !1;
    };
    if (g()) return;
    const T = window.setInterval(() => {
      a += 1, (g() || a >= 16) && (ne.current = !1, window.clearInterval(T));
    }, 50);
    return () => window.clearInterval(T);
  }, [B, ce]);
  const ge = q((a) => {
    const g = `intake-${Date.now().toString(36)}`, T = s + Xe(g);
    if (Ut(R, g), P(), a) {
      const C = Qe(T, a);
      $.current = { slotKey: T, prompt: a, ts: C }, de((D) => D + 1);
    }
    H(g);
  }, [s, R, P]);
  K(() => {
    var a;
    if (!(!I || I.id === G.current)) {
      if (G.current = I.id, I.mode === "new_intake") {
        const g = he(k.current), T = Se(g).trim(), C = (I.prompt || l).trim();
        b === null && T === C && g ? Te(g) : ge(I.prompt || l), m();
        return;
      }
      if (I.mode === "attach") {
        const g = he(k.current), T = c ?? (b ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${b}: ` : "");
        T && !Se(g).trim() && ie(W, T);
        const C = (a = k.current) == null ? void 0 : a.querySelector('input[type="file"]');
        C ? (ne.current = !1, C.click()) : (ne.current = !0, de((D) => D + 1)), m();
        return;
      }
      ie(W, I.prompt), m();
    }
  }, [
    I,
    b,
    W,
    l,
    c,
    m,
    ie,
    ge
  ]);
  const [Le, ke] = x(!1), ae = j(null), Ne = (a) => {
    a.preventDefault(), a.currentTarget.setPointerCapture(a.pointerId), ae.current = { startX: a.clientX, startW: u, pointerId: a.pointerId }, ke(!0);
  }, _e = (a) => {
    const g = ae.current;
    !g || g.pointerId !== a.pointerId || _(Ve(g.startW + (g.startX - a.clientX)));
  }, fe = (a) => {
    var g;
    ((g = ae.current) == null ? void 0 : g.pointerId) === a.pointerId && (ae.current = null, ke(!1));
  }, Ce = o ?? !b;
  return /* @__PURE__ */ n("aside", { ref: k, className: "sme-dock", style: { width: u }, "aria-label": i, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${Le ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: Ne,
        onPointerMove: _e,
        onPointerUp: fe,
        onPointerCancel: fe
      }
    ),
    /* @__PURE__ */ n("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ n("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e($e, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          b ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: b }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: i })
        ] }),
        d.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: d.map((a) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              a.onClick ? a.onClick() : a.prompt && ie(W, a.prompt);
            },
            children: a.label
          },
          a.label
        )) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        Ce && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => ge(), children: /* @__PURE__ */ e(qe, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => N("", M, J),
            children: /* @__PURE__ */ e(Me, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: p, children: /* @__PURE__ */ e(ft, { size: 15 }) })
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
      /* @__PURE__ */ n(L, { primary: !0, onClick: () => Q(S.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(bt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: ye ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: ye }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(L, { onClick: () => N("", M, J), children: [
        /* @__PURE__ */ e(Me, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : B ? w ? /* @__PURE__ */ e(w, { slotKey: B, conversationOnly: !0 }, B) : A ? /* @__PURE__ */ e(
      A,
      {
        slotKey: B,
        agent: r,
        frameless: !0,
        startAtBottom: !0,
        placeholder: y
      },
      B
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(L, { primary: !0, onClick: () => N("", M, J), children: [
        /* @__PURE__ */ e(Me, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const Gt = `
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
function Xt() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = Gt, document.head.appendChild(s);
}
const Qt = "sme-assistant", Ie = "/apps/sme-lending/api", ot = [
  { name: "Chứng từ", agents: ["document-evidence"] },
  { name: "Sản phẩm", agents: ["product-match"] },
  { name: "Chuyên môn", agents: ["financial-analysis", "risk-compliance", "collateral", "industry"] },
  { name: "Chính sách", agents: ["policy-exception"] },
  { name: "Tổng hợp", agents: ["consolidation"] }
], ve = ot.flatMap((t) => t.agents), Yt = {
  "document-evidence": "Chứng từ & bằng chứng",
  "product-match": "Nhận diện sản phẩm",
  "financial-analysis": "Phân tích tài chính",
  "risk-compliance": "Rủi ro & tuân thủ",
  collateral: "Tài sản bảo đảm",
  industry: "Ngành & cạnh tranh",
  "policy-exception": "Chính sách & ngoại lệ",
  consolidation: "Tổng hợp tờ trình"
}, Z = (t) => Yt[t] ?? t, xe = {
  passed: { label: "Đã kiểm chứng", tone: "ok" },
  blocked: { label: "Bị chặn", tone: "danger" },
  unverified: { label: "Chưa kiểm chứng", tone: "warn" },
  none: { label: "Chưa chạy", tone: "muted" }
}, Jt = {
  PASS: { label: "PASS", tone: "ok" },
  MISSING_REQUIRED: { label: "MISSING_REQUIRED", tone: "warn" },
  FAIL: { label: "FAIL", tone: "danger" },
  SKIPPED: { label: "SKIPPED", tone: "muted" },
  UNDETERMINED_CONDITION: { label: "UNDETERMINED_CONDITION", tone: "info" }
}, Zt = {
  PASS: { label: "PASS", tone: "ok" },
  FAIL: { label: "FAIL", tone: "danger" },
  MISSING_DATA: { label: "MISSING_DATA", tone: "warn" },
  SKIPPED: { label: "SKIPPED", tone: "muted" }
}, ue = {
  high: { label: "Cao", tone: "danger", rank: 0 },
  medium: { label: "Trung bình", tone: "warn", rank: 1 },
  low: { label: "Thấp", tone: "info", rank: 2 },
  info: { label: "Thông tin", tone: "muted", rank: 3 }
}, en = { high: "cao", medium: "trung bình", low: "thấp" }, je = {
  missing_document: { label: "Thiếu chứng từ", tone: "warn" },
  data_conflict: { label: "Dữ liệu mâu thuẫn", tone: "danger" },
  rule_fail: { label: "Không đạt điều kiện", tone: "danger" },
  low_confidence: { label: "Độ tin cậy thấp", tone: "info" },
  exception_needed: { label: "Cần ngoại lệ", tone: "danger" },
  expert_review: { label: "Cần chuyên gia", tone: "info" },
  system_error: { label: "Lỗi hệ thống", tone: "muted" }
}, ct = {
  open: { label: "Chờ xử lý", tone: "warn" },
  confirmed: { label: "Đã xác nhận", tone: "ok" },
  needs_info: { label: "Yêu cầu bổ sung", tone: "info" }
}, tn = {
  case_create: "Tạo hồ sơ",
  case_handover_received: "Nhận bàn giao từ ĐVKD",
  evidence_add: "Thêm bằng chứng",
  result_put: "Lưu kết quả",
  verification: "Kiểm chứng",
  review_add: "Thêm mục rà soát",
  review_decide: "Cán bộ quyết định"
}, nn = (t) => [...t].sort((s, r) => {
  var i, l;
  return (((i = ue[s.severity]) == null ? void 0 : i.rank) ?? 9) - (((l = ue[r.severity]) == null ? void 0 : l.rank) ?? 9);
});
function De(t) {
  return t ? t.verification ? t.verification.passed ? "passed" : "blocked" : "unverified" : "none";
}
function pe(t, s, r) {
  var i, l;
  return (l = (i = t.results[s]) == null ? void 0 : i.calculations) == null ? void 0 : l.find((h) => h.kind === r);
}
function sn(t) {
  var d, o, c, y, u;
  const s = {}, r = pe(t, "policy-exception", "policy_check") ?? pe(t, "risk-compliance", "policy_check");
  (d = r == null ? void 0 : r.outputs) != null && d.matrix && (s.policy = { version: r.outputs.policy_version, product: r.outputs.product_code, rows: r.outputs.matrix });
  const i = pe(t, "financial-analysis", "repayment_capacity");
  if ((o = i == null ? void 0 : i.outputs) != null && o.scenarios) {
    const _ = (c = s.policy) == null ? void 0 : c.rows.find((p) => p.fact === "dscr");
    s.dscr = {
      scenarios: i.outputs.scenarios,
      threshold: typeof (_ == null ? void 0 : _.threshold) == "number" ? _.threshold : void 0,
      debtService: i.outputs.total_debt_service_annual,
      cash: (y = i.inputs) == null ? void 0 : y.cash_available_annual
    };
  }
  const l = pe(t, "collateral", "collateral_ltv");
  l != null && l.outputs && (s.ltv = { ltv: l.outputs.ltv_pct ?? null, cap: l.outputs.max_ltv_pct ?? null, eligible: l.outputs.eligible_value });
  const h = pe(t, "financial-analysis", "fin_ratios");
  (u = h == null ? void 0 : h.outputs) != null && u.periods && (s.ratios = h.outputs.periods);
  const f = pe(t, "consolidation", "genform");
  return f != null && f.outputs && (s.genform = f.outputs), s;
}
const Pe = {
  gross_margin: { label: "Biên lợi nhuận gộp", fmt: me },
  net_margin: { label: "Biên lợi nhuận ròng", fmt: me },
  ebitda_margin: { label: "Biên EBITDA", fmt: me },
  current_ratio: { label: "Thanh toán hiện hành", fmt: (t) => X(t) },
  debt_to_equity: { label: "Nợ vay / Vốn chủ", fmt: (t) => X(t) },
  liabilities_to_assets: { label: "Nợ phải trả / Tài sản", fmt: me },
  roa: { label: "ROA", fmt: me },
  roe: { label: "ROE", fmt: me },
  interest_coverage: { label: "Khả năng trả lãi", fmt: (t) => X(t, 1) + (typeof t == "number" ? " lần" : "") },
  receivable_days: { label: "Số ngày phải thu", fmt: (t) => X(t, 0) },
  inventory_days: { label: "Số ngày tồn kho", fmt: (t) => X(t, 0) }
}, rn = {
  years_in_operation: "Số năm hoạt động",
  loan_amount: "Số tiền vay",
  term_months: "Kỳ hạn (tháng)",
  dscr: "DSCR",
  cic_debt_group: "Nhóm nợ CIC",
  ltv_pct: "LTV (%)",
  equity_contribution_pct: "Vốn tự có (%)"
}, an = {
  met: { label: "Đạt", tone: "ok" },
  not_met: { label: "Không đạt", tone: "danger" },
  missing: { label: "Thiếu dữ liệu", tone: "warn" },
  na: { label: "Không áp dụng", tone: "muted" }
}, Y = (t) => `t-${t}`;
function z({ t, children: s, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${Y(t)}`, title: r, children: s });
}
function se({ icon: t, label: s, value: r, hint: i, t: l = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${Y(l)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      i && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: i })
    ] })
  ] });
}
function ee({ icon: t, title: s, hint: r, action: i }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    i && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: i })
  ] });
}
function dt({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${Y(t)}`, children: [
    /* @__PURE__ */ e(vt, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function Ue({ refs: t, onOpen: s }) {
  return t != null && t.length ? /* @__PURE__ */ e("span", { className: "sme-row sme-wrap", style: { gap: 4, display: "inline-flex", marginLeft: 4 }, children: t.map((r) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", title: "Xem bằng chứng", onClick: () => s(r), children: r }, r)) }) : null;
}
function ln({ c: t, onOpen: s }) {
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
          t.review_open > 0 ? /* @__PURE__ */ n(z, { t: "warn", children: [
            t.review_open,
            " chờ rà soát"
          ] }) : i > 0 ? /* @__PURE__ */ e(z, { t: "ok", children: "Đã rà soát" }) : /* @__PURE__ */ e(z, { t: "muted", children: "Mới" })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: ze(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.term_months ? `${t.term_months} tháng` : null, t.purpose ? lt[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${i}/${ve.length} agent đã chạy`, children: ve.map((l) => {
          const h = r[l];
          return /* @__PURE__ */ e(
            "span",
            {
              className: h ? Y(xe[h].tone) : "none",
              title: `${Z(l)}: ${xe[h ?? "none"].label}`
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
            t.from_sales && /* @__PURE__ */ e(z, { t: "accent", children: "Từ ĐVKD" }),
            t.checklist_overall && /* @__PURE__ */ e(z, { t: t.checklist_overall === "COMPLETE" ? "ok" : "warn", children: t.checklist_overall }),
            (t.high_findings ?? 0) > 0 && /* @__PURE__ */ n(z, { t: "danger", children: [
              t.high_findings,
              " cảnh báo cao"
            ] }),
            t.agents_blocked > 0 && /* @__PURE__ */ n(z, { t: "danger", children: [
              t.agents_blocked,
              " bị chặn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            Pt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function on({
  onOpen: t,
  assistantOpen: s,
  syncTick: r,
  onToggleAssistant: i,
  onAskAssistant: l,
  onCreatedCase: h
}) {
  const f = et(), [d, o] = x(null), [c, y] = x(null), [u, _] = x(""), [p, b] = x("all"), [E, I] = x(!1), m = j(0), S = j(!1), Q = j(null), P = q(async (v = !1) => {
    if (!(v && S.current)) {
      v ? S.current = !0 : I(!0);
      try {
        const N = (await f.get(`${Ie}/cases`)).cases;
        if (Q.current === null)
          Q.current = new Set(N.map((R) => R.case_id));
        else {
          const R = N.find((O) => !Q.current.has(O.case_id));
          N.forEach((O) => Q.current.add(O.case_id)), R && h({ caseId: R.case_id, name: R.customer_name ?? R.case_id });
        }
        o(N), y(null), m.current = Date.now();
      } catch (N) {
        v || y(be(N));
      } finally {
        v ? S.current = !1 : I(!1);
      }
    }
  }, [f, h]);
  K(() => {
    P();
  }, [P]), K(() => {
    r > 0 && P(!0);
  }, [r, P]), K(() => {
    const v = () => {
      document.visibilityState !== "hidden" && Date.now() - m.current >= 3e3 && P(!0);
    };
    return window.addEventListener("focus", v), document.addEventListener("visibilitychange", v), () => {
      window.removeEventListener("focus", v), document.removeEventListener("visibilitychange", v);
    };
  }, [P]);
  const U = F(() => ({
    open: (d == null ? void 0 : d.reduce((v, N) => v + N.review_open, 0)) ?? 0,
    blocked: (d == null ? void 0 : d.reduce((v, N) => v + N.agents_blocked, 0)) ?? 0,
    high: (d == null ? void 0 : d.reduce((v, N) => v + (N.high_findings ?? 0), 0)) ?? 0
  }), [d]), w = F(() => {
    const v = u.trim().toLowerCase();
    return (d ?? []).filter((N) => p === "review" && N.review_open === 0 || p === "blocked" && N.agents_blocked === 0 ? !1 : v ? [N.customer_name, N.case_id, N.industry_code].some((R) => R == null ? void 0 : R.toLowerCase().includes(v)) : !0);
  }, [d, u, p]), A = () => l("Tạo hồ sơ thẩm định SME mới: ", "new_intake");
  return /* @__PURE__ */ n(Ze, { children: [
    /* @__PURE__ */ e(
      gt,
      {
        title: "Thẩm định SME",
        subtitle: "Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(L, { onClick: () => P(), busy: E, children: [
            /* @__PURE__ */ e(nt, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            L,
            {
              className: s ? "sme-toggle-on" : void 0,
              "aria-pressed": s,
              onClick: i,
              title: s ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
              children: [
                /* @__PURE__ */ e($e, { size: 14 }),
                " Trợ lý thẩm định"
              ]
            }
          ),
          /* @__PURE__ */ n(L, { primary: !0, onClick: A, children: [
            /* @__PURE__ */ e(qe, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      c && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(tt, { title: "Không tải được danh sách hồ sơ", children: c }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(se, { icon: /* @__PURE__ */ e(We, { size: 18 }), label: "Hồ sơ", value: (d == null ? void 0 : d.length) ?? "…" }),
        /* @__PURE__ */ e(
          se,
          {
            t: "warn",
            icon: /* @__PURE__ */ e(st, { size: 18 }),
            label: "Mục chờ rà soát",
            value: d ? U.open : "…",
            hint: "Cần cán bộ xác nhận"
          }
        ),
        /* @__PURE__ */ e(se, { t: "danger", icon: /* @__PURE__ */ e(xt, { size: 18 }), label: "Cảnh báo mức cao", value: d ? U.high : "…" }),
        /* @__PURE__ */ e(
          se,
          {
            t: U.blocked ? "danger" : "ok",
            icon: /* @__PURE__ */ e(yt, { size: 18 }),
            label: "Kết quả bị chặn",
            value: d ? U.blocked : "…",
            hint: "Không qua kiểm chứng"
          }
        )
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hồ sơ", children: [["all", "Tất cả"], ["review", "Chờ rà soát"], ["blocked", "Bị chặn"]].map(([v, N]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": p === v,
            className: `sme-filter ${p === v ? "on" : ""}`,
            onClick: () => b(v),
            children: N
          },
          v
        )) }),
        /* @__PURE__ */ n("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(Ae, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: u, onChange: (v) => _(v.target.value), placeholder: "Tìm khách hàng, mã hồ sơ, mã ngành" })
        ] })
      ] }),
      d === null && !c && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((v) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, v)) }),
      d && d.length === 0 && /* @__PURE__ */ e(
        ee,
        {
          icon: /* @__PURE__ */ e(We, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn.",
          action: /* @__PURE__ */ n(L, { primary: !0, onClick: A, children: [
            /* @__PURE__ */ e(qe, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      d && d.length > 0 && w.length === 0 && /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(Ae, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      w.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: w.map((v) => /* @__PURE__ */ e(ln, { c: v, onOpen: () => t(v.case_id) }, v.case_id)) })
    ] })
  ] });
}
function mt({ state: t, size: s = 13 }) {
  return t === "passed" ? /* @__PURE__ */ e(wt, { size: s }) : t === "blocked" ? /* @__PURE__ */ e(kt, { size: s }) : t === "unverified" ? /* @__PURE__ */ e(Nt, { size: s }) : /* @__PURE__ */ e(_t, { size: s });
}
function ht({ state: t }) {
  const s = xe[t];
  return /* @__PURE__ */ n(z, { t: s.tone, children: [
    /* @__PURE__ */ e(mt, { state: t, size: 12 }),
    s.label
  ] });
}
function pt({ f: t, onEvidence: s }) {
  const r = ue[t.severity] ?? ue.info;
  return /* @__PURE__ */ n("div", { className: `sme-finding ${Y(r.tone)}`, children: [
    /* @__PURE__ */ e("div", { className: "bar" }),
    /* @__PURE__ */ n("div", { children: [
      /* @__PURE__ */ n("div", { className: "sme-finding-topic sme-row", style: { gap: 6 }, children: [
        /* @__PURE__ */ e(z, { t: r.tone, children: r.label }),
        /* @__PURE__ */ e("span", { children: t.topic.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-finding-text", children: [
        t.statement,
        /* @__PURE__ */ e(Ue, { refs: t.evidence_refs, onOpen: s })
      ] })
    ] })
  ] });
}
function cn({ m: t }) {
  const s = Math.max(1.6, (t.threshold ?? 0) * 1.3, ...t.scenarios.map((r) => r.dscr ?? 0));
  return /* @__PURE__ */ n("div", { className: "sme-card", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Khả năng trả nợ (DSCR)" }),
      t.threshold !== void 0 && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Ngưỡng chính sách ≥ ",
        X(t.threshold)
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-bars", children: t.scenarios.map((r) => {
      const i = t.threshold === void 0 || (r.dscr ?? 0) >= t.threshold;
      return /* @__PURE__ */ n("div", { className: `sme-bar-row ${Y(i ? "ok" : "danger")}`, children: [
        /* @__PURE__ */ e("span", { className: "sme-muted", children: r.stress_pct ? `Stress −${r.stress_pct}%` : "Cơ sở" }),
        /* @__PURE__ */ n("div", { className: "sme-bar-track", children: [
          /* @__PURE__ */ e("div", { className: "sme-bar-fill", style: { width: `${Math.min(100, (r.dscr ?? 0) / s * 100)}%` } }),
          t.threshold !== void 0 && /* @__PURE__ */ e("div", { className: "sme-bar-mark", style: { left: `${t.threshold / s * 100}%` } })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-num sme-strong", children: X(r.dscr) })
      ] }, r.stress_pct);
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
function dn({ m: t }) {
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
        const r = an[s.status] ?? { label: s.status, tone: "muted" }, i = (l) => s.fact === "loan_amount" ? ze(l) : typeof l == "number" ? X(l) : "—";
        return /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ n("td", { children: [
            rn[s.fact] ?? s.fact,
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: s.clause })
          ] }),
          /* @__PURE__ */ n("td", { className: "sme-num", children: [
            s.op,
            " ",
            i(s.threshold)
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: i(s.actual) }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(z, { t: r.tone, children: r.label }) })
        ] }, s.id);
      }) })
    ] })
  ] });
}
function mn({ periods: t }) {
  const s = Object.keys(Pe).filter((r) => t.some((i) => {
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
        /* @__PURE__ */ e("td", { children: Pe[r].label }),
        t.map((i) => {
          var l;
          return /* @__PURE__ */ e("td", { className: "sme-num", children: Pe[r].fmt((l = i.ratios) == null ? void 0 : l[r]) }, i.period);
        })
      ] }, r)) })
    ] })
  ] }) : null;
}
function hn({ detail: t, m: s, onEvidence: r, goAgents: i }) {
  const l = t.results.consolidation, h = ve.flatMap((d) => {
    var o;
    return (((o = t.results[d]) == null ? void 0 : o.findings) ?? []).filter((c) => c.severity === "high").map((c) => ({ ...c, agent: d }));
  }), f = Object.values(t.evidence).some((d) => /MẪU|sample/i.test(String(d.source)));
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    f && /* @__PURE__ */ n(dt, { children: [
      "Hồ sơ đang dùng ",
      /* @__PURE__ */ e("b", { children: "dữ liệu mẫu" }),
      " (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng."
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tóm tắt thẩm định" }),
        l ? /* @__PURE__ */ e(ht, { state: De(l) }) : /* @__PURE__ */ e(z, { t: "muted", children: "Chưa tổng hợp" })
      ] }),
      l ? /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: l.summary }) : /* @__PURE__ */ n("p", { className: "sme-muted", style: { margin: 0 }, children: [
        "Agent Tổng hợp chưa chạy. Kết quả từng agent xem ở tab ",
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-ref",
            onClick: i,
            children: "Kết quả agent"
          }
        ),
        "."
      ] })
    ] }),
    h.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 4 }, children: [
        "Cảnh báo mức cao (",
        h.length,
        ")"
      ] }),
      h.map((d) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: Z(d.agent) }),
        /* @__PURE__ */ e(pt, { f: d, onEvidence: r })
      ] }, d.agent + d.id))
    ] }),
    s.dscr && /* @__PURE__ */ e(cn, { m: s.dscr }),
    s.policy && /* @__PURE__ */ e(dn, { m: s.policy }),
    s.ratios && /* @__PURE__ */ e(mn, { periods: s.ratios })
  ] });
}
function pn({ id: t, r: s, open: r, onToggle: i, onEvidence: l, onAsk: h }) {
  var d, o;
  const f = ["high", "medium", "low"].map((c) => [c, s.findings.filter((y) => y.severity === c).length]);
  return /* @__PURE__ */ n("div", { className: "sme-card", id: `agent-${t}`, children: [
    /* @__PURE__ */ n("button", { type: "button", className: `sme-acc-head ${r ? "open" : ""}`, onClick: i, "aria-expanded": r, children: [
      /* @__PURE__ */ e(Tt, { size: 16, className: "chev" }),
      /* @__PURE__ */ n("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: Z(t) }),
          /* @__PURE__ */ e(ht, { state: De(s) })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-small sme-muted", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ n("span", { children: [
            "v",
            s._version,
            " · độ tin cậy ",
            en[s.confidence] ?? s.confidence,
            " · ",
            re(s._saved_at)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-sev-counts", children: f.filter(([, c]) => c > 0).map(([c, y]) => /* @__PURE__ */ n(z, { t: ue[c].tone, children: [
            y,
            " ",
            ue[c].label.toLowerCase()
          ] }, c)) })
        ] })
      ] })
    ] }),
    r && /* @__PURE__ */ n("div", { className: "sme-acc-body sme-stack", children: [
      /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: s.summary }),
      s.verification && !s.verification.passed && /* @__PURE__ */ n(dt, { t: "danger", children: [
        /* @__PURE__ */ e("b", { children: "Lý do bị chặn:" }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: s.verification.errors.slice(0, 8).map((c, y) => /* @__PURE__ */ e("li", { children: c }, y)) })
      ] }),
      s.findings.length > 0 && /* @__PURE__ */ e("div", { children: nn(s.findings).map((c) => /* @__PURE__ */ e(pt, { f: c, onEvidence: l }, c.id)) }),
      (((d = s.missing_information) == null ? void 0 : d.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Còn thiếu" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.missing_information.map((c, y) => /* @__PURE__ */ e("li", { children: c }, y)) })
      ] }),
      (((o = s.open_issues) == null ? void 0 : o.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Vấn đề mở" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.open_issues.map((c, y) => /* @__PURE__ */ e("li", { children: c }, y)) })
      ] }),
      h && /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ n(L, { onClick: h, children: [
        /* @__PURE__ */ e($e, { size: 13 }),
        " Hỏi trợ lý về phần này"
      ] }) })
    ] })
  ] });
}
function un({ detail: t, openAgent: s, onEvidence: r, onRunAssessment: i, onAskAgent: l }) {
  const h = ve.filter((c) => t.results[c]), [f, d] = x(() => new Set(s ? [s] : []));
  if (K(() => {
    s && (d((c) => new Set(c).add(s)), requestAnimationFrame(() => {
      var c;
      return (c = document.getElementById(`agent-${s}`)) == null ? void 0 : c.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
  }, [s]), !h.length)
    return /* @__PURE__ */ e(
      ee,
      {
        icon: /* @__PURE__ */ e(at, { size: 30 }),
        title: "Chưa có kết quả",
        hint: "Chạy thẩm định để các agent ghi kết quả vào hồ sơ.",
        action: i ? /* @__PURE__ */ n(L, { primary: !0, onClick: i, children: [
          /* @__PURE__ */ e(it, { size: 13 }),
          " Chạy thẩm định"
        ] }) : void 0
      }
    );
  const o = (c) => d((y) => {
    const u = new Set(y);
    return u.has(c) ? u.delete(c) : u.add(c), u;
  });
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ e(L, { onClick: () => d(f.size === h.length ? /* @__PURE__ */ new Set() : new Set(h)), children: f.size === h.length ? "Thu gọn tất cả" : "Mở tất cả" }) }),
    h.map((c) => /* @__PURE__ */ e(
      pn,
      {
        id: c,
        r: t.results[c],
        open: f.has(c),
        onToggle: () => o(c),
        onEvidence: r,
        onAsk: l ? () => l(c, Z(c)) : void 0
      },
      c
    ))
  ] });
}
function gn({ detail: t, focus: s }) {
  const r = Object.values(t.evidence), [i, l] = x(""), [h, f] = x("all"), [d, o] = x(s);
  K(() => {
    s && (o(s), l(""), f("all"), requestAnimationFrame(() => {
      var u;
      return (u = document.getElementById(`ev-${s}`)) == null ? void 0 : u.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const c = F(() => Array.from(new Set(r.map((u) => u.added_by))), [r]), y = r.filter((u) => (h === "all" || u.added_by === h) && (!i.trim() || `${u.id} ${u.source} ${Ge(u.value)}`.toLowerCase().includes(i.trim().toLowerCase())));
  return r.length ? /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("div", { className: "sme-filters", children: [
        /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${h === "all" ? "on" : ""}`, onClick: () => f("all"), children: "Tất cả" }),
        c.map((u) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${h === u ? "on" : ""}`, onClick: () => f(u), children: Z(u) }, u))
      ] }),
      /* @__PURE__ */ n("label", { className: "sme-search", children: [
        /* @__PURE__ */ e(Ae, { size: 14, className: "sme-muted" }),
        /* @__PURE__ */ e("input", { value: i, onChange: (u) => l(u.target.value), placeholder: "Tìm mã, nguồn, giá trị" })
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
        /* @__PURE__ */ e("tbody", { children: y.map((u) => {
          const _ = Ge(u.value), p = d === u.id;
          return /* @__PURE__ */ n(
            "tr",
            {
              id: `ev-${u.id}`,
              className: `click ${s === u.id ? "focus" : ""}`,
              onClick: () => o(p ? null : u.id),
              children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: u.id }),
                /* @__PURE__ */ e("td", { children: u.source }),
                /* @__PURE__ */ n("td", { children: [
                  /* @__PURE__ */ e("span", { className: "sme-mono", style: { wordBreak: "break-word" }, children: _.length > 90 && !p ? _.slice(0, 88) + "…" : p ? "" : _ }),
                  p && /* @__PURE__ */ e("pre", { className: "sme-pre", children: _ })
                ] }),
                /* @__PURE__ */ n("td", { className: "sme-muted sme-small", children: [
                  Z(u.added_by),
                  /* @__PURE__ */ e("div", { children: re(u.added_at) })
                ] })
              ]
            },
            u.id
          );
        }) })
      ] }),
      y.length === 0 && /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(Ae, { size: 24 }), title: "Không có bằng chứng phù hợp" })
    ] })
  ] }) : /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(at, { size: 30 }), title: "Chưa có bằng chứng" });
}
function fn({ detail: t, focus: s, onDecide: r, onEvidence: i }) {
  const [l, h] = x("open"), [f, d] = x({}), [o, c] = x(null);
  K(() => {
    s && (h("all"), requestAnimationFrame(() => {
      var p;
      return (p = document.getElementById(`rv-${s}`)) == null ? void 0 : p.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const y = t.review.filter((p) => p.status === "open").length, u = t.review.filter((p) => l === "all" || l === "open" == (p.status === "open")), _ = async (p, b) => {
    c(p + b);
    try {
      await r(p, b, f[p] ?? "") && d((E) => ({ ...E, [p]: "" }));
    } finally {
      c(null);
    }
  };
  return t.review.length ? /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [["open", `Chờ xử lý (${y})`], ["done", `Đã xử lý (${t.review.length - y})`], ["all", "Tất cả"]].map(([p, b]) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${l === p ? "on" : ""}`, onClick: () => h(p), children: b }, p)) }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: "Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát." })
    ] }),
    u.length === 0 && /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(Fe, { size: 30 }), title: l === "open" ? "Đã xử lý hết các mục" : "Không có mục nào" }),
    u.map((p) => {
      const b = je[p.reason_code] ?? { label: p.reason_code, tone: "muted" }, E = ct[p.status] ?? { label: p.status, tone: "muted" }, I = f[p.id] ?? "";
      return /* @__PURE__ */ n(
        "div",
        {
          id: `rv-${p.id}`,
          className: `sme-card sme-review ${Y(b.tone)}`,
          style: s === p.id ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)" } : void 0,
          children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ n("span", { className: "sme-row", children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: p.id }),
                /* @__PURE__ */ e(z, { t: b.tone, children: b.label })
              ] }),
              /* @__PURE__ */ e(z, { t: E.tone, children: E.label })
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "10px 0 6px", fontSize: 13.5, lineHeight: 1.55 }, children: p.detail }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              Z(p.source_agent),
              " · ",
              re(p.created_at),
              /* @__PURE__ */ e(Ue, { refs: p.evidence_refs, onOpen: i })
            ] }),
            p.status === "open" ? /* @__PURE__ */ n("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ e(
                "textarea",
                {
                  className: "sme-textarea",
                  value: I,
                  placeholder: "Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…",
                  onChange: (m) => d({ ...f, [p.id]: m.target.value })
                }
              ),
              /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ e(L, { disabled: !I.trim(), busy: o === p.id + "needs_info", onClick: () => _(p.id, "needs_info"), children: "Yêu cầu bổ sung" }),
                /* @__PURE__ */ e(L, { primary: !0, disabled: !I.trim(), busy: o === p.id + "confirmed", onClick: () => _(p.id, "confirmed"), children: "Xác nhận" })
              ] })
            ] }) : /* @__PURE__ */ n("div", { className: `sme-decision ${Y(E.tone)}`, children: [
              /* @__PURE__ */ e("b", { children: E.label }),
              " bởi ",
              p.decided_by,
              " · ",
              re(p.decided_at),
              /* @__PURE__ */ e("div", { style: { marginTop: 2 }, children: p.note })
            ] })
          ]
        },
        p.id
      );
    })
  ] }) : /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(Fe, { size: 30 }), title: "Không có mục cần rà soát" });
}
function bn({ detail: t, onEvidence: s }) {
  const r = t.checklist, i = t.crosschecks, l = t.case.sales_handover, [h, f] = x("open"), [d, o] = x("ALL"), [c, y] = x(!1), u = (r == null ? void 0 : r.items) ?? [], _ = F(() => u.filter((m) => m.rule_status !== "SKIPPED"), [u]), p = F(() => u.filter((m) => m.rule_status === "SKIPPED"), [u]), b = F(
    () => _.filter((m) => m.rule_status !== "PASS").length,
    [_]
  );
  K(() => {
    b === 0 && h === "open" && f("all");
  }, [b, h]);
  const E = F(() => (c ? p : _).filter((S) => d !== "ALL" && S.group !== d ? !1 : c ? !0 : h === "open" ? S.rule_status !== "PASS" : h === "pass" ? S.rule_status === "PASS" : !0), [c, p, _, d, h]), I = F(
    () => ((i == null ? void 0 : i.rules) ?? []).filter((m) => c || m.status !== "SKIPPED"),
    [i, c]
  );
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    l && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Phiếu bàn giao từ ĐVKD (Sale)" }),
        /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          l.submitted_by,
          " · ",
          re(l.submitted_at)
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
        /* @__PURE__ */ e(z, { t: i.overall_status === "PASS" ? "ok" : i.overall_status === "FAIL" ? "danger" : "warn", children: i.overall_status })
      ] }),
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 52 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Quy tắc đối chiếu" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ & Bằng chứng" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: I.map((m) => {
          const S = Zt[m.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: m.id }),
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: m.title }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: m.detail })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-small", children: [
              m.document_refs.length > 0 && /* @__PURE__ */ e("span", { className: "sme-mono", children: m.document_refs.join(", ") }),
              m.evidence_refs.length > 0 && /* @__PURE__ */ e(Ue, { refs: m.evidence_refs, onOpen: s }),
              m.document_refs.length === 0 && m.evidence_refs.length === 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" })
            ] }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(z, { t: S.tone, children: S.label }) })
          ] }, m.id);
        }) })
      ] })
    ] }),
    r && /* @__PURE__ */ n("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "12px 14px 8px", gap: 8 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ e("h3", { className: "sme-h3", children: "SME Master Checklist 2 lớp (Nhóm A → I)" }),
          /* @__PURE__ */ e(z, { t: r.overall_status === "COMPLETE" ? "ok" : "danger", children: r.overall_status }),
          /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "PASS ",
            r.counts.PASS,
            " · MISSING ",
            r.counts.MISSING_REQUIRED,
            " · FAIL ",
            r.counts.FAIL,
            " · UNDETERMINED ",
            r.counts.UNDETERMINED_CONDITION
          ] })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: p.length > 0 && /* @__PURE__ */ n(
          L,
          {
            className: c ? "sme-toggle-on" : void 0,
            onClick: () => y((m) => !m),
            title: "Các mục SKIPPED được ẩn mặc định",
            children: [
              c ? /* @__PURE__ */ e(Ct, { size: 13 }) : /* @__PURE__ */ e(rt, { size: 13 }),
              c ? "Quay lại mục áp dụng" : `Hiện mục không áp dụng (${p.length})`
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { padding: "0 14px 10px", gap: 8 }, children: [
        c ? /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
          "Đang hiển thị ",
          p.length,
          " mục SKIPPED (mặc định ẩn vì điều kiện Lớp 1 không kích hoạt)."
        ] }) : /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["open", `Cần lưu ý (${b})`], ["pass", `PASS (${r.counts.PASS})`], ["all", `Tất cả áp dụng (${_.length})`]].map(([m, S]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": h === m,
            className: `sme-filter ${h === m ? "on" : ""}`,
            onClick: () => f(m),
            children: S
          },
          m
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-filters", role: "group", "aria-label": "Nhóm checklist", children: [
          /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${d === "ALL" ? "on" : ""}`, onClick: () => o("ALL"), children: "A–I" }),
          r.groups.filter((m) => c ? m.counts.SKIPPED > 0 : m.total_applicable > 0).map((m) => /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: `sme-filter ${d === m.group ? "on" : ""}`,
              onClick: () => o(m.group),
              title: m.label,
              children: m.group
            },
            m.group
          ))
        ] })
      ] }),
      E.length === 0 ? /* @__PURE__ */ e("div", { style: { padding: 16 }, children: /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(Fe, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Hạng mục, Điều kiện (Lớp 1) & Rule (Lớp 2)" }),
          /* @__PURE__ */ e("th", { children: "Nguồn" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Trạng thái" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: E.map((m) => {
          const S = Jt[m.rule_status];
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
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(z, { t: m.owner_role === "RM_INTERNAL" ? "accent" : "muted", children: m.owner_role === "RM_INTERNAL" ? "ĐVKD nội bộ" : "Khách hàng" }) }),
            /* @__PURE__ */ e("td", { className: "sme-mono sme-small", children: m.document_refs.length ? m.document_refs.join(", ") : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(z, { t: S.tone, children: S.label }) })
          ] }, m.key);
        }) })
      ] })
    ] })
  ] });
}
function vn({ detail: t }) {
  if (!t.audit.length) return /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(St, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (i) => i.action === "verification" ? i.passed ? "ok" : "danger" : i.action === "review_decide" || i.action === "case_handover_received" ? "accent" : i.action === "review_add" ? "warn" : "muted", r = (i) => {
    var h, f;
    const l = i.agent ? Z(i.agent) : i.actor ?? i.by ?? "";
    switch (i.action) {
      case "result_put":
        return `${l} lưu kết quả v${i.version}${i.rerun_reason ? ` (chạy lại: ${i.rerun_reason})` : ""}`;
      case "verification":
        return `${l} v${i.version}: ${i.passed ? "đạt kiểm chứng" : "bị chặn"}`;
      case "evidence_add":
        return `${l} thêm ${(i.ids ?? []).join(", ")}`;
      case "review_add":
        return `${l} thêm ${i.id} (${((h = je[i.reason_code]) == null ? void 0 : h.label) ?? i.reason_code})`;
      case "review_decide":
        return `${i.actor} ${((f = ct[i.status]) == null ? void 0 : f.label.toLowerCase()) ?? i.status} ${i.id}`;
      case "case_handover_received":
        return `Nhận từ ${i.from_app ?? "sme-sales"} bởi ${i.by ?? ""}, ${i.documents ?? 0} chứng từ (${i.files_copied ?? 0} file)`;
      case "case_create":
        return `Luồng ${i.flow}, ${i.documents} chứng từ`;
      default:
        return l;
    }
  };
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t.audit].reverse().map((i, l) => /* @__PURE__ */ n("div", { className: `sme-tl-item ${Y(s(i))}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", style: { fontSize: 13 }, children: tn[i.action] ?? i.action }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: re(i.ts) })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: r(i) })
  ] }, l)) }) });
}
function xn({ detail: t, flow: s, onAgent: r }) {
  return /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: ot.map((i) => /* @__PURE__ */ n("div", { className: "sme-phase", children: [
    /* @__PURE__ */ e("span", { className: "sme-phase-name", children: i.name }),
    i.agents.map((l) => {
      const h = l === "industry" && s !== "B" && !t.results[l], f = h ? "none" : De(t.results[l]);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${Y(xe[f].tone)} ${h || f === "none" ? "skip" : ""}`,
          disabled: h || f === "none",
          title: h ? "Chỉ chạy ở luồng B" : xe[f].label,
          onClick: () => r(l),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(mt, { state: f, size: 12 }) }),
            /* @__PURE__ */ n("span", { children: [
              Z(l),
              h ? " (luồng B)" : ""
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
function yn({
  caseId: t,
  assistantOpen: s,
  syncTick: r,
  onBack: i,
  onToggleAssistant: l,
  onAskAssistant: h,
  onCaseMetaChange: f
}) {
  var ae, Ne, _e, fe, Ce;
  const d = et(), [o, c] = x(null), [y, u] = x(null), [_, p] = x(!1), [b, E] = x("overview"), [I, m] = x(null), [S, Q] = x(null), [P, U] = x(null), [w, A] = x(null), v = j(0), N = j(!1), R = async (a) => {
    A(a);
    try {
      const g = await d.get(`${Ie}/cases/${t}/documents/${a}/file`), T = atob(g.content_b64), C = new Uint8Array(T.length);
      for (let V = 0; V < T.length; V++) C[V] = T.charCodeAt(V);
      const D = new Blob([C], { type: g.mime || "application/octet-stream" }), le = URL.createObjectURL(D);
      if (g.mime.startsWith("image/") || g.mime === "application/pdf" || g.mime.startsWith("text/")) {
        if (!window.open(le, "_blank", "noopener")) {
          const Ke = document.createElement("a");
          Ke.href = le, Ke.download = g.name, Ke.click();
        }
      } else {
        const V = document.createElement("a");
        V.href = le, V.download = g.name, V.click();
      }
      setTimeout(() => URL.revokeObjectURL(le), 6e4);
    } catch (g) {
      u(be(g));
    } finally {
      A(null);
    }
  }, O = q(async (a = !1) => {
    if (!(a && N.current)) {
      a ? N.current = !0 : p(!0);
      try {
        c(await d.get(`${Ie}/cases/${t}`)), u(null), v.current = Date.now();
      } catch (g) {
        a || u(be(g));
      } finally {
        a ? N.current = !1 : p(!1);
      }
    }
  }, [d, t]);
  K(() => {
    O();
  }, [O]), K(() => {
    r > 0 && O(!0);
  }, [r, O]), K(() => {
    const a = () => {
      document.visibilityState !== "hidden" && Date.now() - v.current >= 3e3 && O(!0);
    };
    return window.addEventListener("focus", a), document.addEventListener("visibilitychange", a), () => {
      window.removeEventListener("focus", a), document.removeEventListener("visibilitychange", a);
    };
  }, [O]);
  const H = F(() => o ? sn(o) : {}, [o]), M = (o == null ? void 0 : o.review.filter((a) => a.status === "open")) ?? [], W = F(
    () => o ? ve.filter((a) => De(o.results[a]) === "blocked").length : 0,
    [o]
  ), J = (ae = H.policy) == null ? void 0 : ae.rows.filter((a) => a.status === "not_met").length, B = ((_e = (Ne = H.dscr) == null ? void 0 : Ne.scenarios.find((a) => a.stress_pct === 0)) == null ? void 0 : _e.dscr) ?? null, te = (a) => {
    m(a), E("evidence");
  }, ye = (a) => {
    Q(a), E("review");
  }, we = (a) => {
    U(a), E("agents");
  }, oe = async (a, g, T) => {
    try {
      return await d.post(`${Ie}/cases/${t}/review/${a}`, { status: g, note: T }), await O(), !0;
    } catch (C) {
      return u(be(C)), !1;
    }
  }, k = o == null ? void 0 : o.case, G = (k == null ? void 0 : k.customer) ?? {}, $ = (k == null ? void 0 : k.request) ?? {}, ne = G.name ? String(G.name) : void 0, ce = (k == null ? void 0 : k.flow) ?? "A", de = M.length > 0 || W > 0;
  K(() => {
    f({ customerName: ne, flow: ce, hasIssues: de });
  }, [ne, ce, de, f]);
  const ie = () => h(`Chạy thẩm định hồ sơ ${t}, luồng ${ce}.`, "prefill"), ge = (a, g) => h(
    `Giải thích chi tiết kết quả, bằng chứng và điểm cần lưu ý của agent ${g} (${a}) trên hồ sơ ${t}.`,
    "prefill"
  ), Le = F(() => {
    var g;
    const a = (g = o == null ? void 0 : o.checklist) == null ? void 0 : g.counts;
    return a ? (a.MISSING_REQUIRED ?? 0) + (a.FAIL ?? 0) + (a.UNDETERMINED_CONDITION ?? 0) : 0;
  }, [o]), ke = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Checklist & Đối chiếu", count: Le || void 0 },
    { key: "agents", label: "Kết quả agent", count: o ? Object.keys(o.results).length : void 0 },
    { key: "evidence", label: "Bằng chứng", count: o ? Object.keys(o.evidence).length : void 0 },
    { key: "review", label: "Rà soát", count: M.length || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: i, children: [
          /* @__PURE__ */ e(Et, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: String(G.name ?? t) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          k && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            k.flow
          ] }),
          (k == null ? void 0 : k.sales_handover) && /* @__PURE__ */ e(z, { t: "accent", children: "Nhận từ ĐVKD" }),
          (o == null ? void 0 : o.checklist) && /* @__PURE__ */ n(z, { t: o.checklist.overall_status === "COMPLETE" ? "ok" : "warn", children: [
            "Checklist ",
            o.checklist.overall_status
          ] }),
          G.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(G.industry_code)
          ] }),
          $.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: lt[$.purpose] ?? $.purpose }),
          k && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Tạo ",
            re(k.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(L, { onClick: () => O(), busy: _, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(nt, { size: 14 }) }),
        /* @__PURE__ */ n(
          L,
          {
            className: s ? "sme-toggle-on" : void 0,
            "aria-pressed": s,
            onClick: l,
            title: s ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
            children: [
              /* @__PURE__ */ e($e, { size: 14 }),
              " Trợ lý thẩm định"
            ]
          }
        ),
        /* @__PURE__ */ n(L, { primary: !0, onClick: ie, children: [
          /* @__PURE__ */ e(it, { size: 14 }),
          " Chạy thẩm định"
        ] })
      ] })
    ] }),
    y && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(tt, { title: "Có lỗi khi làm việc với hồ sơ", children: y }) }),
    !o && !y && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "70%" } })
    ] }),
    o && k && /* @__PURE__ */ n(Ze, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          se,
          {
            icon: /* @__PURE__ */ e(It, { size: 18 }),
            label: "Số tiền đề nghị",
            value: Mt($.amount).replace(" đ", ""),
            hint: [$.term_months ? `${$.term_months} tháng` : null, $.annual_rate_pct ? `lãi ${X($.annual_rate_pct)}%/năm` : null].filter(Boolean).join(" · ") || "VND"
          }
        ),
        /* @__PURE__ */ e(
          se,
          {
            t: B == null ? "muted" : ((fe = H.dscr) == null ? void 0 : fe.threshold) !== void 0 && B < H.dscr.threshold ? "danger" : "ok",
            icon: /* @__PURE__ */ e(At, { size: 18 }),
            label: "DSCR cơ sở",
            value: X(B),
            hint: ((Ce = H.dscr) == null ? void 0 : Ce.threshold) !== void 0 ? `Ngưỡng ≥ ${X(H.dscr.threshold)}` : "Chưa có phân tích"
          }
        ),
        /* @__PURE__ */ e(
          se,
          {
            t: J == null ? "muted" : J > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(zt, { size: 18 }),
            label: "Điều kiện không đạt",
            value: J ?? "—",
            hint: H.policy ? `${H.policy.rows.length} điều kiện · ${H.policy.product}` : "Chưa kiểm tra chính sách"
          }
        ),
        /* @__PURE__ */ e(
          se,
          {
            t: M.length ? "warn" : "ok",
            icon: /* @__PURE__ */ e(st, { size: 18 }),
            label: "Chờ cán bộ rà soát",
            value: M.length,
            hint: `${o.review.length} mục tổng cộng`
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(xn, { detail: o, flow: k.flow, onAgent: we }) }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: ke.map((a) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": b === a.key,
              className: `sme-tab ${b === a.key ? "on" : ""}`,
              onClick: () => E(a.key),
              children: [
                a.label,
                a.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: a.count })
              ]
            },
            a.key
          )) }),
          b === "overview" && /* @__PURE__ */ e(hn, { detail: o, m: H, onEvidence: te, goAgents: () => E("agents") }),
          b === "checklist" && /* @__PURE__ */ e(bn, { detail: o, onEvidence: te }),
          b === "agents" && /* @__PURE__ */ e(
            un,
            {
              detail: o,
              openAgent: P,
              onEvidence: te,
              onRunAssessment: ie,
              onAskAgent: ge
            }
          ),
          b === "evidence" && /* @__PURE__ */ e(gn, { detail: o, focus: I }),
          b === "review" && /* @__PURE__ */ e(fn, { detail: o, focus: S, onDecide: oe, onEvidence: te }),
          b === "audit" && /* @__PURE__ */ e(vn, { detail: o })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Cần xử lý" }),
              /* @__PURE__ */ e(z, { t: M.length ? "warn" : "ok", children: M.length })
            ] }),
            M.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn mục chờ rà soát." }),
            M.slice(0, 6).map((a) => {
              const g = je[a.reason_code] ?? { label: a.reason_code, tone: "muted" };
              return /* @__PURE__ */ n("button", { type: "button", className: "sme-todo", onClick: () => ye(a.id), children: [
                /* @__PURE__ */ e(z, { t: g.tone, children: a.id }),
                /* @__PURE__ */ n("span", { className: "sme-todo-text", children: [
                  /* @__PURE__ */ n("b", { children: [
                    g.label,
                    "."
                  ] }),
                  " ",
                  a.detail
                ] })
              ] }, a.id);
            }),
            M.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => E("review"), children: [
              "Xem thêm ",
              M.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Khách hàng" }),
            /* @__PURE__ */ e(Oe, { label: "CIF", children: String(G.cif ?? "—") }),
            /* @__PURE__ */ e(Oe, { label: "Mã số thuế", children: String(G.tax_id ?? "—") }),
            /* @__PURE__ */ e(Oe, { label: "Số năm hoạt động", children: G.years_in_operation ?? "—" }),
            $.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String($.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Chứng từ" }),
              /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: k.documents.length })
            ] }),
            k.documents.map((a) => /* @__PURE__ */ n("div", { className: "sme-row sme-small", style: { padding: "5px 0", gap: 6 }, children: [
              /* @__PURE__ */ e($t, { size: 14, className: "sme-muted" }),
              /* @__PURE__ */ e("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, title: a.name, children: a.name }),
              /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: a.id }),
              a.file && /* @__PURE__ */ e(L, { busy: w === a.id, onClick: () => R(a.id), title: "Xem hoặc tải chứng từ", children: /\.(pdf|png|jpe?g|webp|txt)$/i.test(a.name) ? /* @__PURE__ */ e(rt, { size: 12 }) : /* @__PURE__ */ e(Dt, { size: 12 }) })
            ] }, a.id))
          ] }),
          o.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(Lt, { size: 13 }),
            " Hoạt động gần nhất ",
            re(o.audit[o.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
Xt();
const Ye = "sme-lending:assistant-open", Je = "sme-lending:assistant-width", wn = "sme-lending-chat-";
function Tn() {
  const [t, s] = x(null), [r, i] = x(() => Bt(Ye)), [l, h] = x(() => Ft(Je)), [f, d] = x(null), [o, c] = x(null), [y, u] = x(null), _ = j(0), { syncTick: p } = Vt(r, 3500), b = q((w) => {
    i((A) => {
      const v = typeof w == "function" ? w(A) : w;
      return qt(Ye, v), v;
    });
  }, []), E = q((w) => {
    const A = Ve(w);
    h(A), Ht(Je, A);
  }, []), I = q((w, A = "prefill") => {
    b(!0), d({ id: ++_.current, prompt: w, mode: A });
  }, [b]), m = q(() => {
    d(null);
  }, []), S = q((w) => {
    u(null), c(null), s(w);
  }, []), Q = q(() => {
    c(null), s(null);
  }, []), P = q((w) => {
    c((A) => A === w || A && w && A.customerName === w.customerName && A.flow === w.flow && A.hasIssues === w.hasIssues ? A : w);
  }, []), U = F(() => {
    if (!t)
      return [{
        label: "Hồ sơ chờ xử lý",
        prompt: "Rà soát danh sách các hồ sơ thẩm định đang có mục chờ cán bộ xử lý hoặc kết quả bị chặn kiểm chứng."
      }];
    const w = [
      {
        label: "Chạy thẩm định",
        prompt: `Chạy thẩm định hồ sơ ${t}, luồng ${(o == null ? void 0 : o.flow) ?? "A"}.`
      },
      {
        label: "Giải thích kết quả",
        prompt: `Giải thích tóm tắt kết quả thẩm định, các cảnh báo mức cao và mã bằng chứng chính của hồ sơ ${t}.`
      }
    ];
    return o != null && o.hasIssues && w.push({
      label: "Phân tích mục chặn",
      prompt: `Phân tích các mục chờ rà soát và kết quả bị chặn kiểm chứng của hồ sơ ${t}, nêu rõ chứng từ cần đối chiếu.`
    }), w;
  }, [t, o]);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: t ? /* @__PURE__ */ e(
      yn,
      {
        caseId: t,
        assistantOpen: r,
        syncTick: p,
        onBack: Q,
        onToggleAssistant: () => b((w) => !w),
        onAskAssistant: I,
        onCaseMetaChange: P
      }
    ) : /* @__PURE__ */ e(
      on,
      {
        onOpen: S,
        assistantOpen: r,
        syncTick: p,
        onToggleAssistant: () => b((w) => !w),
        onAskAssistant: I,
        onCreatedCase: u
      }
    ) }),
    r && /* @__PURE__ */ e(
      Wt,
      {
        storagePrefix: "sme-lending",
        chatPrefix: wn,
        agent: Qt,
        panelLabel: "Trợ lý thẩm định",
        newIntakePrompt: "Tạo hồ sơ thẩm định SME mới: ",
        newSessionTitle: "Hồ sơ SME mới",
        caseTitlePrefix: "Thẩm định",
        chips: U,
        attachDefaultPrefix: t ? `Tôi gửi thêm chứng từ cho hồ sơ thẩm định ${t}: ` : void 0,
        embedPlaceholder: t ? `Hỏi trợ lý hoặc chạy thẩm định cho ${t}...` : "Cung cấp thông tin khách hàng hoặc chứng từ để tạo hồ sơ thẩm định...",
        width: l,
        onWidthChange: E,
        onClose: () => b(!1),
        caseId: t,
        customerName: t ? o == null ? void 0 : o.customerName : void 0,
        intent: f,
        onConsumeIntent: m,
        createdCase: y,
        onOpenCase: S,
        onDismissCreatedCase: () => u(null)
      }
    )
  ] }) });
}
export {
  Tn as default
};
