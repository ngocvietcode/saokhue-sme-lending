import { jsxs as s, jsx as e, Fragment as Je } from "react/jsx-runtime";
import { useCallback as O, useState as k, useMemo as ae, useRef as H, useEffect as L } from "react";
import * as De from "@kirocrew/app-sdk";
import { useChatLauncher as ht, useAppApi as Qe } from "@kirocrew/app-sdk";
import { Btn as R, PageHeader as pt, ErrorNotice as Ze } from "@kirocrew/app-sdk/ui";
import { MessageSquare as $e, Plus as Be, ExternalLink as Ie, PanelRightClose as ut, ArrowRight as gt, AlertTriangle as ft, RefreshCw as et, FolderOpen as We, ClipboardList as tt, ShieldAlert as bt, AlertOctagon as vt, Search as Se, CheckCircle2 as xt, XCircle as yt, CircleDot as wt, CircleDashed as kt, Play as nt, FileSearch as st, ClipboardCheck as Ve, History as Nt, ChevronRight as Ct, ArrowLeft as _t, Landmark as St, Gauge as Tt, ShieldCheck as zt, FileText as $t, Activity as Et } from "lucide-react";
const At = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function It(t, n, r) {
  const i = ht();
  return O(
    async (a, m, u) => {
      const { openChat: l } = i, c = i.createChat;
      if (!c) {
        l({ autoSend: !1, message: a });
        return;
      }
      try {
        const o = await c({ slotKey: n + At(m), agent: t, title: u });
        l({ slotKey: o, autoSend: !1, message: a });
      } catch {
      }
    },
    [i, t, n, r]
  );
}
const rt = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, _e = new Intl.NumberFormat("vi-VN"), Lt = (t) => typeof t == "number" ? _e.format(t) + " đ" : "—", Te = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? _e.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? _e.format(Math.round(t / 1e4) / 100) + " triệu" : _e.format(t) + " đ", j = (t, n = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: n }) : "—", de = (t) => typeof t == "number" ? (t * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "%" : "—", oe = (t) => {
  if (!t) return "—";
  const n = new Date(t);
  return Number.isNaN(n.getTime()) ? "—" : n.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, Rt = (t) => {
  if (!t) return "—";
  const n = new Date(t).getTime();
  if (Number.isNaN(n)) return "—";
  const r = Math.round((Date.now() - n) / 1e3);
  return r < 60 ? "vừa xong" : r < 3600 ? `${Math.floor(r / 60)} phút trước` : r < 86400 ? `${Math.floor(r / 3600)} giờ trước` : `${Math.floor(r / 86400)} ngày trước`;
}, je = (t) => typeof t == "string" ? t : JSON.stringify(t, null, 2), ze = (t) => t instanceof Error ? t.message : String(t), Ke = "kirocrew_prefill", Ge = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), Dt = (t, n) => {
};
function Me(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function Bt(t) {
  try {
    const n = localStorage.getItem(t);
    if (n === "1") return !0;
    if (n === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function Kt(t, n) {
  try {
    localStorage.setItem(t, n ? "1" : "0");
  } catch {
  }
}
function qt(t, n = 420) {
  try {
    const r = Number(localStorage.getItem(t));
    if (Number.isFinite(r) && r >= 360 && r <= 620) return Math.round(r);
  } catch {
  }
  return n;
}
function Mt(t, n) {
  try {
    localStorage.setItem(t, String(Me(n)));
  } catch {
  }
}
function Ot(t, n = 4e3) {
  const r = De.useAppEvents ?? Dt, [i, a] = k(0), m = O(() => a((u) => u + 1), []);
  return r("tool_result", m), r("chat_done", m), L(() => {
    if (!t) return;
    const u = window.setInterval(() => {
      document.visibilityState !== "hidden" && a((l) => l + 1);
    }, n);
    return () => window.clearInterval(u);
  }, [t, n]), { syncTick: i, bumpSync: m };
}
function Ft(t) {
  try {
    const n = sessionStorage.getItem(t);
    if (n) return n;
    const r = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, r), r;
  } catch {
    return "intake-default";
  }
}
function Pt(t, n) {
  try {
    sessionStorage.setItem(t, n);
  } catch {
  }
}
function me(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function Ne(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function Ce(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const r = t.value.length;
    t.setSelectionRange(r, r);
    return;
  }
  const n = window.getSelection();
  n && (n.selectAllChildren(t), n.collapseToEnd());
}
function Xe(t, n) {
  const r = Date.now();
  try {
    sessionStorage.setItem(Ke, JSON.stringify({ slotKey: t, prompt: n, ts: r }));
  } catch {
  }
  return r;
}
function Ht({
  storagePrefix: t,
  chatPrefix: n,
  agent: r,
  panelLabel: i,
  newIntakePrompt: a,
  newSessionTitle: m,
  caseTitlePrefix: u = "Hồ sơ",
  chips: l = [],
  showNewSessionButton: c,
  attachDefaultPrefix: o,
  embedPlaceholder: w,
  width: h,
  onWidthChange: z,
  onClose: d,
  caseId: b,
  customerName: _,
  intent: S,
  onConsumeIntent: K,
  createdCase: q,
  onOpenCase: G,
  onDismissCreatedCase: D
}) {
  const W = De, x = W.ChatPanel, C = W.ChatEmbed, g = De.useChatLauncher(), v = It(r, n), N = `${t}:intake-id`, [ne, ue] = k(() => Ft(N)), Q = b ?? ne, M = n + Ge(Q), se = ae(() => b ? _ ? `${u} ${_} (${b})` : `${u} ${b}` : m, [b, _, m, u]), [F, ge] = k(null), [$, V] = k(null), A = H(null);
  A.current = F, L(() => {
    let f = !1;
    V(null);
    const y = A.current === M, E = g.createChat;
    if (!E) {
      y || ge(M);
      return;
    }
    return y || ge(null), E({ slotKey: M, agent: r, title: se }).then((T) => {
      if (f) return;
      const I = T || M;
      A.current !== I && ge(I);
    }).catch((T) => {
      f || y || V(ze(T));
    }), () => {
      f = !0;
    };
  }, [M, r, se, g]);
  const P = H(null), le = H(0), U = H(null), Z = H(!1), [ye, fe] = k(0), re = O((f, y) => {
    const E = y.trim();
    if (!E) return;
    const T = me(P.current);
    if (A.current === f && T) {
      Ne(T).trim().includes(E) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: y } })), requestAnimationFrame(() => Ce(me(P.current)));
      return;
    }
    const I = Xe(f, y);
    U.current = { slotKey: f, prompt: y, ts: I }, fe((Fe) => Fe + 1);
  }, []);
  L(() => {
    const f = U.current;
    if (!f || F !== f.slotKey) return;
    let y = 0, E = 0;
    const T = window.setInterval(() => {
      y += 1;
      const I = me(P.current);
      if (!I) {
        y >= 20 && (window.clearInterval(T), U.current = null);
        return;
      }
      if (Ne(I).trim().includes(f.prompt.trim())) {
        U.current = null, window.clearInterval(T), Ce(I);
        return;
      }
      if (E += 1, E >= 3) {
        try {
          const Pe = sessionStorage.getItem(Ke);
          if (Pe) {
            const He = JSON.parse(Pe);
            He.slotKey === f.slotKey && He.ts === f.ts && sessionStorage.removeItem(Ke);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: f.prompt } })), U.current = null, window.clearInterval(T), requestAnimationFrame(() => Ce(me(P.current)));
      }
    }, 60);
    return () => window.clearInterval(T);
  }, [F, ye]), L(() => {
    if (!Z.current || !F) return;
    let f = 0;
    const y = () => {
      var I;
      const T = (I = P.current) == null ? void 0 : I.querySelector('input[type="file"]');
      return T ? (Z.current = !1, T.click(), !0) : !1;
    };
    if (y()) return;
    const E = window.setInterval(() => {
      f += 1, (y() || f >= 16) && (Z.current = !1, window.clearInterval(E));
    }, 50);
    return () => window.clearInterval(E);
  }, [F, ye]);
  const ce = O((f) => {
    const y = `intake-${Date.now().toString(36)}`, E = n + Ge(y);
    if (Pt(N, y), D(), f) {
      const T = Xe(E, f);
      U.current = { slotKey: E, prompt: f, ts: T }, fe((I) => I + 1);
    }
    ue(y);
  }, [n, N, D]);
  L(() => {
    var f;
    if (!(!S || S.id === le.current)) {
      if (le.current = S.id, S.mode === "new_intake") {
        const y = me(P.current), E = Ne(y).trim(), T = (S.prompt || a).trim();
        b === null && E === T && y ? Ce(y) : ce(S.prompt || a), K();
        return;
      }
      if (S.mode === "attach") {
        const y = me(P.current), E = o ?? (b ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${b}: ` : "");
        E && !Ne(y).trim() && re(M, E);
        const T = (f = P.current) == null ? void 0 : f.querySelector('input[type="file"]');
        T ? (Z.current = !1, T.click()) : (Z.current = !0, fe((I) => I + 1)), K();
        return;
      }
      re(M, S.prompt), K();
    }
  }, [
    S,
    b,
    M,
    a,
    o,
    K,
    re,
    ce
  ]);
  const [we, be] = k(!1), ie = H(null), p = (f) => {
    f.preventDefault(), f.currentTarget.setPointerCapture(f.pointerId), ie.current = { startX: f.clientX, startW: h, pointerId: f.pointerId }, be(!0);
  }, X = (f) => {
    const y = ie.current;
    !y || y.pointerId !== f.pointerId || z(Me(y.startW + (y.startX - f.clientX)));
  }, ke = (f) => {
    var y;
    ((y = ie.current) == null ? void 0 : y.pointerId) === f.pointerId && (ie.current = null, be(!1));
  }, Ae = c ?? !b;
  return /* @__PURE__ */ s("aside", { ref: P, className: "sme-dock", style: { width: h }, "aria-label": i, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${we ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: p,
        onPointerMove: X,
        onPointerUp: ke,
        onPointerCancel: ke
      }
    ),
    /* @__PURE__ */ s("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ s("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ s("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e($e, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          b ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: b }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: i })
        ] }),
        l.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: l.map((f) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              f.onClick ? f.onClick() : f.prompt && re(M, f.prompt);
            },
            children: f.label
          },
          f.label
        )) })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        Ae && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => ce(), children: /* @__PURE__ */ e(Be, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => v("", Q, se),
            children: /* @__PURE__ */ e(Ie, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: d, children: /* @__PURE__ */ e(ut, { size: 15 }) })
      ] })
    ] }),
    !b && q && /* @__PURE__ */ s("div", { className: "sme-dock-new-banner", children: [
      /* @__PURE__ */ s("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: q.name }),
        " ",
        /* @__PURE__ */ s("span", { className: "sme-mono", children: [
          "(",
          q.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ s(R, { primary: !0, onClick: () => G(q.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(gt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: $ ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ s("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: $ }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ s(R, { onClick: () => v("", Q, se), children: [
        /* @__PURE__ */ e(Ie, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : F ? x ? /* @__PURE__ */ e(x, { slotKey: F, conversationOnly: !0 }, F) : C ? /* @__PURE__ */ e(
      C,
      {
        slotKey: F,
        agent: r,
        frameless: !0,
        startAtBottom: !0,
        placeholder: w
      },
      F
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ s("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ s(R, { primary: !0, onClick: () => v("", Q, se), children: [
        /* @__PURE__ */ e(Ie, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ s("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const Wt = `
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
function Vt() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const n = document.createElement("style");
  n.id = t, n.textContent = Wt, document.head.appendChild(n);
}
const jt = "sme-assistant", qe = "/apps/sme-lending/api", it = [
  { name: "Chứng từ", agents: ["document-evidence"] },
  { name: "Sản phẩm", agents: ["product-match"] },
  { name: "Chuyên môn", agents: ["financial-analysis", "risk-compliance", "collateral", "industry"] },
  { name: "Chính sách", agents: ["policy-exception"] },
  { name: "Tổng hợp", agents: ["consolidation"] }
], ve = it.flatMap((t) => t.agents), Gt = {
  "document-evidence": "Chứng từ & bằng chứng",
  "product-match": "Nhận diện sản phẩm",
  "financial-analysis": "Phân tích tài chính",
  "risk-compliance": "Rủi ro & tuân thủ",
  collateral: "Tài sản bảo đảm",
  industry: "Ngành & cạnh tranh",
  "policy-exception": "Chính sách & ngoại lệ",
  consolidation: "Tổng hợp tờ trình"
}, J = (t) => Gt[t] ?? t, xe = {
  passed: { label: "Đã kiểm chứng", tone: "ok" },
  blocked: { label: "Bị chặn", tone: "danger" },
  unverified: { label: "Chưa kiểm chứng", tone: "warn" },
  none: { label: "Chưa chạy", tone: "muted" }
}, pe = {
  high: { label: "Cao", tone: "danger", rank: 0 },
  medium: { label: "Trung bình", tone: "warn", rank: 1 },
  low: { label: "Thấp", tone: "info", rank: 2 },
  info: { label: "Thông tin", tone: "muted", rank: 3 }
}, Xt = { high: "cao", medium: "trung bình", low: "thấp" }, Oe = {
  missing_document: { label: "Thiếu chứng từ", tone: "warn" },
  data_conflict: { label: "Dữ liệu mâu thuẫn", tone: "danger" },
  rule_fail: { label: "Không đạt điều kiện", tone: "danger" },
  low_confidence: { label: "Độ tin cậy thấp", tone: "info" },
  exception_needed: { label: "Cần ngoại lệ", tone: "danger" },
  expert_review: { label: "Cần chuyên gia", tone: "info" },
  system_error: { label: "Lỗi hệ thống", tone: "muted" }
}, at = {
  open: { label: "Chờ xử lý", tone: "warn" },
  confirmed: { label: "Đã xác nhận", tone: "ok" },
  needs_info: { label: "Yêu cầu bổ sung", tone: "info" }
}, Yt = {
  case_create: "Tạo hồ sơ",
  evidence_add: "Thêm bằng chứng",
  result_put: "Lưu kết quả",
  verification: "Kiểm chứng",
  review_add: "Thêm mục rà soát",
  review_decide: "Cán bộ quyết định"
}, Ut = (t) => [...t].sort((n, r) => {
  var i, a;
  return (((i = pe[n.severity]) == null ? void 0 : i.rank) ?? 9) - (((a = pe[r.severity]) == null ? void 0 : a.rank) ?? 9);
});
function Ee(t) {
  return t ? t.verification ? t.verification.passed ? "passed" : "blocked" : "unverified" : "none";
}
function he(t, n, r) {
  var i, a;
  return (a = (i = t.results[n]) == null ? void 0 : i.calculations) == null ? void 0 : a.find((m) => m.kind === r);
}
function Jt(t) {
  var l, c, o, w, h;
  const n = {}, r = he(t, "policy-exception", "policy_check") ?? he(t, "risk-compliance", "policy_check");
  (l = r == null ? void 0 : r.outputs) != null && l.matrix && (n.policy = { version: r.outputs.policy_version, product: r.outputs.product_code, rows: r.outputs.matrix });
  const i = he(t, "financial-analysis", "repayment_capacity");
  if ((c = i == null ? void 0 : i.outputs) != null && c.scenarios) {
    const z = (o = n.policy) == null ? void 0 : o.rows.find((d) => d.fact === "dscr");
    n.dscr = {
      scenarios: i.outputs.scenarios,
      threshold: typeof (z == null ? void 0 : z.threshold) == "number" ? z.threshold : void 0,
      debtService: i.outputs.total_debt_service_annual,
      cash: (w = i.inputs) == null ? void 0 : w.cash_available_annual
    };
  }
  const a = he(t, "collateral", "collateral_ltv");
  a != null && a.outputs && (n.ltv = { ltv: a.outputs.ltv_pct ?? null, cap: a.outputs.max_ltv_pct ?? null, eligible: a.outputs.eligible_value });
  const m = he(t, "financial-analysis", "fin_ratios");
  (h = m == null ? void 0 : m.outputs) != null && h.periods && (n.ratios = m.outputs.periods);
  const u = he(t, "consolidation", "genform");
  return u != null && u.outputs && (n.genform = u.outputs), n;
}
const Le = {
  gross_margin: { label: "Biên lợi nhuận gộp", fmt: de },
  net_margin: { label: "Biên lợi nhuận ròng", fmt: de },
  ebitda_margin: { label: "Biên EBITDA", fmt: de },
  current_ratio: { label: "Thanh toán hiện hành", fmt: (t) => j(t) },
  debt_to_equity: { label: "Nợ vay / Vốn chủ", fmt: (t) => j(t) },
  liabilities_to_assets: { label: "Nợ phải trả / Tài sản", fmt: de },
  roa: { label: "ROA", fmt: de },
  roe: { label: "ROE", fmt: de },
  interest_coverage: { label: "Khả năng trả lãi", fmt: (t) => j(t, 1) + (typeof t == "number" ? " lần" : "") },
  receivable_days: { label: "Số ngày phải thu", fmt: (t) => j(t, 0) },
  inventory_days: { label: "Số ngày tồn kho", fmt: (t) => j(t, 0) }
}, Qt = {
  years_in_operation: "Số năm hoạt động",
  loan_amount: "Số tiền vay",
  term_months: "Kỳ hạn (tháng)",
  dscr: "DSCR",
  cic_debt_group: "Nhóm nợ CIC",
  ltv_pct: "LTV (%)",
  equity_contribution_pct: "Vốn tự có (%)"
}, Zt = {
  met: { label: "Đạt", tone: "ok" },
  not_met: { label: "Không đạt", tone: "danger" },
  missing: { label: "Thiếu dữ liệu", tone: "warn" },
  na: { label: "Không áp dụng", tone: "muted" }
}, Y = (t) => `t-${t}`;
function B({ t, children: n, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${Y(t)}`, title: r, children: n });
}
function ee({ icon: t, label: n, value: r, hint: i, t: a = "accent" }) {
  return /* @__PURE__ */ s("div", { className: `sme-kpi ${Y(a)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: n }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      i && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: i })
    ] })
  ] });
}
function te({ icon: t, title: n, hint: r, action: i }) {
  return /* @__PURE__ */ s("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: n }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    i && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: i })
  ] });
}
function ot({ t = "warn", children: n }) {
  return /* @__PURE__ */ s("div", { className: `sme-banner ${Y(t)}`, children: [
    /* @__PURE__ */ e(ft, { size: 15 }),
    /* @__PURE__ */ e("div", { children: n })
  ] });
}
function lt({ refs: t, onOpen: n }) {
  return t != null && t.length ? /* @__PURE__ */ e("span", { className: "sme-row sme-wrap", style: { gap: 4, display: "inline-flex", marginLeft: 4 }, children: t.map((r) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", title: "Xem bằng chứng", onClick: () => n(r), children: r }, r)) }) : null;
}
function en({ c: t, onOpen: n }) {
  const r = t.agents ?? {}, i = Object.keys(r).length;
  return /* @__PURE__ */ s(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: n,
      onKeyDown: (a) => {
        (a.key === "Enter" || a.key === " ") && (a.preventDefault(), n());
      },
      children: [
        /* @__PURE__ */ s("div", { className: "sme-between", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.customer_name ?? "Chưa có tên khách hàng" }),
            /* @__PURE__ */ e("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: t.case_id })
          ] }),
          t.review_open > 0 ? /* @__PURE__ */ s(B, { t: "warn", children: [
            t.review_open,
            " chờ rà soát"
          ] }) : i > 0 ? /* @__PURE__ */ e(B, { t: "ok", children: "Đã rà soát" }) : /* @__PURE__ */ e(B, { t: "muted", children: "Mới" })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: Te(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.term_months ? `${t.term_months} tháng` : null, t.purpose ? rt[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${i}/${ve.length} agent đã chạy`, children: ve.map((a) => {
          const m = r[a];
          return /* @__PURE__ */ e(
            "span",
            {
              className: m ? Y(xe[m].tone) : "none",
              title: `${J(a)}: ${xe[m ?? "none"].label}`
            },
            a
          );
        }) }),
        /* @__PURE__ */ s("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ s("span", { className: "sme-row", style: { gap: 6 }, children: [
            /* @__PURE__ */ s("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            (t.high_findings ?? 0) > 0 && /* @__PURE__ */ s(B, { t: "danger", children: [
              t.high_findings,
              " cảnh báo cao"
            ] }),
            t.agents_blocked > 0 && /* @__PURE__ */ s(B, { t: "danger", children: [
              t.agents_blocked,
              " bị chặn"
            ] })
          ] }),
          /* @__PURE__ */ s("span", { title: t.updated_at, children: [
            "Cập nhật ",
            Rt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function tn({
  onOpen: t,
  assistantOpen: n,
  syncTick: r,
  onToggleAssistant: i,
  onAskAssistant: a,
  onCreatedCase: m
}) {
  const u = Qe(), [l, c] = k(null), [o, w] = k(null), [h, z] = k(""), [d, b] = k("all"), [_, S] = k(!1), K = H(0), q = H(!1), G = H(null), D = O(async (g = !1) => {
    if (!(g && q.current)) {
      g ? q.current = !0 : S(!0);
      try {
        const v = (await u.get(`${qe}/cases`)).cases;
        if (G.current === null)
          G.current = new Set(v.map((N) => N.case_id));
        else {
          const N = v.find((ne) => !G.current.has(ne.case_id));
          v.forEach((ne) => G.current.add(ne.case_id)), N && m({ caseId: N.case_id, name: N.customer_name ?? N.case_id });
        }
        c(v), w(null), K.current = Date.now();
      } catch (v) {
        g || w(ze(v));
      } finally {
        g ? q.current = !1 : S(!1);
      }
    }
  }, [u, m]);
  L(() => {
    D();
  }, [D]), L(() => {
    r > 0 && D(!0);
  }, [r, D]), L(() => {
    const g = () => {
      document.visibilityState !== "hidden" && Date.now() - K.current >= 3e3 && D(!0);
    };
    return window.addEventListener("focus", g), document.addEventListener("visibilitychange", g), () => {
      window.removeEventListener("focus", g), document.removeEventListener("visibilitychange", g);
    };
  }, [D]);
  const W = ae(() => ({
    open: (l == null ? void 0 : l.reduce((g, v) => g + v.review_open, 0)) ?? 0,
    blocked: (l == null ? void 0 : l.reduce((g, v) => g + v.agents_blocked, 0)) ?? 0,
    high: (l == null ? void 0 : l.reduce((g, v) => g + (v.high_findings ?? 0), 0)) ?? 0
  }), [l]), x = ae(() => {
    const g = h.trim().toLowerCase();
    return (l ?? []).filter((v) => d === "review" && v.review_open === 0 || d === "blocked" && v.agents_blocked === 0 ? !1 : g ? [v.customer_name, v.case_id, v.industry_code].some((N) => N == null ? void 0 : N.toLowerCase().includes(g)) : !0);
  }, [l, h, d]), C = () => a("Tạo hồ sơ thẩm định SME mới: ", "new_intake");
  return /* @__PURE__ */ s(Je, { children: [
    /* @__PURE__ */ e(
      pt,
      {
        title: "Thẩm định SME",
        subtitle: "Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ",
        actions: /* @__PURE__ */ s("div", { className: "sme-row", children: [
          /* @__PURE__ */ s(R, { onClick: () => D(), busy: _, children: [
            /* @__PURE__ */ e(et, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ s(
            R,
            {
              className: n ? "sme-toggle-on" : void 0,
              "aria-pressed": n,
              onClick: i,
              title: n ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
              children: [
                /* @__PURE__ */ e($e, { size: 14 }),
                " Trợ lý thẩm định"
              ]
            }
          ),
          /* @__PURE__ */ s(R, { primary: !0, onClick: C, children: [
            /* @__PURE__ */ e(Be, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ s("div", { className: "sme-scroll", children: [
      o && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(Ze, { title: "Không tải được danh sách hồ sơ", children: o }) }),
      /* @__PURE__ */ s("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(ee, { icon: /* @__PURE__ */ e(We, { size: 18 }), label: "Hồ sơ", value: (l == null ? void 0 : l.length) ?? "…" }),
        /* @__PURE__ */ e(
          ee,
          {
            t: "warn",
            icon: /* @__PURE__ */ e(tt, { size: 18 }),
            label: "Mục chờ rà soát",
            value: l ? W.open : "…",
            hint: "Cần cán bộ xác nhận"
          }
        ),
        /* @__PURE__ */ e(ee, { t: "danger", icon: /* @__PURE__ */ e(bt, { size: 18 }), label: "Cảnh báo mức cao", value: l ? W.high : "…" }),
        /* @__PURE__ */ e(
          ee,
          {
            t: W.blocked ? "danger" : "ok",
            icon: /* @__PURE__ */ e(vt, { size: 18 }),
            label: "Kết quả bị chặn",
            value: l ? W.blocked : "…",
            hint: "Không qua kiểm chứng"
          }
        )
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hồ sơ", children: [["all", "Tất cả"], ["review", "Chờ rà soát"], ["blocked", "Bị chặn"]].map(([g, v]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": d === g,
            className: `sme-filter ${d === g ? "on" : ""}`,
            onClick: () => b(g),
            children: v
          },
          g
        )) }),
        /* @__PURE__ */ s("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(Se, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: h, onChange: (g) => z(g.target.value), placeholder: "Tìm khách hàng, mã hồ sơ, mã ngành" })
        ] })
      ] }),
      l === null && !o && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((g) => /* @__PURE__ */ s("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, g)) }),
      l && l.length === 0 && /* @__PURE__ */ e(
        te,
        {
          icon: /* @__PURE__ */ e(We, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn.",
          action: /* @__PURE__ */ s(R, { primary: !0, onClick: C, children: [
            /* @__PURE__ */ e(Be, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      l && l.length > 0 && x.length === 0 && /* @__PURE__ */ e(te, { icon: /* @__PURE__ */ e(Se, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      x.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: x.map((g) => /* @__PURE__ */ e(en, { c: g, onOpen: () => t(g.case_id) }, g.case_id)) })
    ] })
  ] });
}
function ct({ state: t, size: n = 13 }) {
  return t === "passed" ? /* @__PURE__ */ e(xt, { size: n }) : t === "blocked" ? /* @__PURE__ */ e(yt, { size: n }) : t === "unverified" ? /* @__PURE__ */ e(wt, { size: n }) : /* @__PURE__ */ e(kt, { size: n });
}
function dt({ state: t }) {
  const n = xe[t];
  return /* @__PURE__ */ s(B, { t: n.tone, children: [
    /* @__PURE__ */ e(ct, { state: t, size: 12 }),
    n.label
  ] });
}
function mt({ f: t, onEvidence: n }) {
  const r = pe[t.severity] ?? pe.info;
  return /* @__PURE__ */ s("div", { className: `sme-finding ${Y(r.tone)}`, children: [
    /* @__PURE__ */ e("div", { className: "bar" }),
    /* @__PURE__ */ s("div", { children: [
      /* @__PURE__ */ s("div", { className: "sme-finding-topic sme-row", style: { gap: 6 }, children: [
        /* @__PURE__ */ e(B, { t: r.tone, children: r.label }),
        /* @__PURE__ */ e("span", { children: t.topic.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-finding-text", children: [
        t.statement,
        /* @__PURE__ */ e(lt, { refs: t.evidence_refs, onOpen: n })
      ] })
    ] })
  ] });
}
function nn({ m: t }) {
  const n = Math.max(1.6, (t.threshold ?? 0) * 1.3, ...t.scenarios.map((r) => r.dscr ?? 0));
  return /* @__PURE__ */ s("div", { className: "sme-card", children: [
    /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Khả năng trả nợ (DSCR)" }),
      t.threshold !== void 0 && /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
        "Ngưỡng chính sách ≥ ",
        j(t.threshold)
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-bars", children: t.scenarios.map((r) => {
      const i = t.threshold === void 0 || (r.dscr ?? 0) >= t.threshold;
      return /* @__PURE__ */ s("div", { className: `sme-bar-row ${Y(i ? "ok" : "danger")}`, children: [
        /* @__PURE__ */ e("span", { className: "sme-muted", children: r.stress_pct ? `Stress −${r.stress_pct}%` : "Cơ sở" }),
        /* @__PURE__ */ s("div", { className: "sme-bar-track", children: [
          /* @__PURE__ */ e("div", { className: "sme-bar-fill", style: { width: `${Math.min(100, (r.dscr ?? 0) / n * 100)}%` } }),
          t.threshold !== void 0 && /* @__PURE__ */ e("div", { className: "sme-bar-mark", style: { left: `${t.threshold / n * 100}%` } })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-num sme-strong", children: j(r.dscr) })
      ] }, r.stress_pct);
    }) }),
    (t.cash !== void 0 || t.debtService !== void 0) && /* @__PURE__ */ s("div", { className: "sme-small sme-muted", style: { marginTop: 10 }, children: [
      "Dòng tiền trả nợ ",
      Te(t.cash),
      " / năm · Nghĩa vụ trả nợ ",
      Te(t.debtService),
      " / năm"
    ] })
  ] });
}
function sn({ m: t }) {
  return /* @__PURE__ */ s("div", { className: "sme-card", children: [
    /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s("h3", { className: "sme-h3", children: [
        "Điều kiện chính sách ",
        t.product
      ] }),
      t.version && /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
        "Phiên bản ",
        t.version
      ] })
    ] }),
    /* @__PURE__ */ s("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Điều kiện" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
        /* @__PURE__ */ e("th", { children: "Kết quả" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.rows.map((n) => {
        const r = Zt[n.status] ?? { label: n.status, tone: "muted" }, i = (a) => n.fact === "loan_amount" ? Te(a) : typeof a == "number" ? j(a) : "—";
        return /* @__PURE__ */ s("tr", { children: [
          /* @__PURE__ */ s("td", { children: [
            Qt[n.fact] ?? n.fact,
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: n.clause })
          ] }),
          /* @__PURE__ */ s("td", { className: "sme-num", children: [
            n.op,
            " ",
            i(n.threshold)
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: i(n.actual) }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(B, { t: r.tone, children: r.label }) })
        ] }, n.id);
      }) })
    ] })
  ] });
}
function rn({ periods: t }) {
  const n = Object.keys(Le).filter((r) => t.some((i) => {
    var a;
    return ((a = i.ratios) == null ? void 0 : a[r]) != null;
  }));
  return n.length ? /* @__PURE__ */ s("div", { className: "sme-card", children: [
    /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 8 }, children: "Chỉ số tài chính" }),
    /* @__PURE__ */ s("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Chỉ số" }),
        t.map((r) => /* @__PURE__ */ e("th", { className: "sme-num", children: r.period }, r.period))
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: n.map((r) => /* @__PURE__ */ s("tr", { children: [
        /* @__PURE__ */ e("td", { children: Le[r].label }),
        t.map((i) => {
          var a;
          return /* @__PURE__ */ e("td", { className: "sme-num", children: Le[r].fmt((a = i.ratios) == null ? void 0 : a[r]) }, i.period);
        })
      ] }, r)) })
    ] })
  ] }) : null;
}
function an({ detail: t, m: n, onEvidence: r, goAgents: i }) {
  const a = t.results.consolidation, m = ve.flatMap((l) => {
    var c;
    return (((c = t.results[l]) == null ? void 0 : c.findings) ?? []).filter((o) => o.severity === "high").map((o) => ({ ...o, agent: l }));
  }), u = Object.values(t.evidence).some((l) => /MẪU|sample/i.test(String(l.source)));
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    u && /* @__PURE__ */ s(ot, { children: [
      "Hồ sơ đang dùng ",
      /* @__PURE__ */ e("b", { children: "dữ liệu mẫu" }),
      " (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng."
    ] }),
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tóm tắt thẩm định" }),
        a ? /* @__PURE__ */ e(dt, { state: Ee(a) }) : /* @__PURE__ */ e(B, { t: "muted", children: "Chưa tổng hợp" })
      ] }),
      a ? /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: a.summary }) : /* @__PURE__ */ s("p", { className: "sme-muted", style: { margin: 0 }, children: [
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
    m.length > 0 && /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("h3", { className: "sme-h3", style: { marginBottom: 4 }, children: [
        "Cảnh báo mức cao (",
        m.length,
        ")"
      ] }),
      m.map((l) => /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: J(l.agent) }),
        /* @__PURE__ */ e(mt, { f: l, onEvidence: r })
      ] }, l.agent + l.id))
    ] }),
    n.dscr && /* @__PURE__ */ e(nn, { m: n.dscr }),
    n.policy && /* @__PURE__ */ e(sn, { m: n.policy }),
    n.ratios && /* @__PURE__ */ e(rn, { periods: n.ratios })
  ] });
}
function on({ id: t, r: n, open: r, onToggle: i, onEvidence: a, onAsk: m }) {
  var l, c;
  const u = ["high", "medium", "low"].map((o) => [o, n.findings.filter((w) => w.severity === o).length]);
  return /* @__PURE__ */ s("div", { className: "sme-card", id: `agent-${t}`, children: [
    /* @__PURE__ */ s("button", { type: "button", className: `sme-acc-head ${r ? "open" : ""}`, onClick: i, "aria-expanded": r, children: [
      /* @__PURE__ */ e(Ct, { size: 16, className: "chev" }),
      /* @__PURE__ */ s("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ s("div", { className: "sme-between", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: J(t) }),
          /* @__PURE__ */ e(dt, { state: Ee(n) })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-small sme-muted", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ s("span", { children: [
            "v",
            n._version,
            " · độ tin cậy ",
            Xt[n.confidence] ?? n.confidence,
            " · ",
            oe(n._saved_at)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-sev-counts", children: u.filter(([, o]) => o > 0).map(([o, w]) => /* @__PURE__ */ s(B, { t: pe[o].tone, children: [
            w,
            " ",
            pe[o].label.toLowerCase()
          ] }, o)) })
        ] })
      ] })
    ] }),
    r && /* @__PURE__ */ s("div", { className: "sme-acc-body sme-stack", children: [
      /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: n.summary }),
      n.verification && !n.verification.passed && /* @__PURE__ */ s(ot, { t: "danger", children: [
        /* @__PURE__ */ e("b", { children: "Lý do bị chặn:" }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: n.verification.errors.slice(0, 8).map((o, w) => /* @__PURE__ */ e("li", { children: o }, w)) })
      ] }),
      n.findings.length > 0 && /* @__PURE__ */ e("div", { children: Ut(n.findings).map((o) => /* @__PURE__ */ e(mt, { f: o, onEvidence: a }, o.id)) }),
      (((l = n.missing_information) == null ? void 0 : l.length) ?? 0) > 0 && /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Còn thiếu" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: n.missing_information.map((o, w) => /* @__PURE__ */ e("li", { children: o }, w)) })
      ] }),
      (((c = n.open_issues) == null ? void 0 : c.length) ?? 0) > 0 && /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Vấn đề mở" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: n.open_issues.map((o, w) => /* @__PURE__ */ e("li", { children: o }, w)) })
      ] }),
      m && /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ s(R, { onClick: m, children: [
        /* @__PURE__ */ e($e, { size: 13 }),
        " Hỏi trợ lý về phần này"
      ] }) })
    ] })
  ] });
}
function ln({ detail: t, openAgent: n, onEvidence: r, onRunAssessment: i, onAskAgent: a }) {
  const m = ve.filter((o) => t.results[o]), [u, l] = k(() => new Set(n ? [n] : []));
  if (L(() => {
    n && (l((o) => new Set(o).add(n)), requestAnimationFrame(() => {
      var o;
      return (o = document.getElementById(`agent-${n}`)) == null ? void 0 : o.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
  }, [n]), !m.length)
    return /* @__PURE__ */ e(
      te,
      {
        icon: /* @__PURE__ */ e(st, { size: 30 }),
        title: "Chưa có kết quả",
        hint: "Chạy thẩm định để các agent ghi kết quả vào hồ sơ.",
        action: i ? /* @__PURE__ */ s(R, { primary: !0, onClick: i, children: [
          /* @__PURE__ */ e(nt, { size: 13 }),
          " Chạy thẩm định"
        ] }) : void 0
      }
    );
  const c = (o) => l((w) => {
    const h = new Set(w);
    return h.has(o) ? h.delete(o) : h.add(o), h;
  });
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ e(R, { onClick: () => l(u.size === m.length ? /* @__PURE__ */ new Set() : new Set(m)), children: u.size === m.length ? "Thu gọn tất cả" : "Mở tất cả" }) }),
    m.map((o) => /* @__PURE__ */ e(
      on,
      {
        id: o,
        r: t.results[o],
        open: u.has(o),
        onToggle: () => c(o),
        onEvidence: r,
        onAsk: a ? () => a(o, J(o)) : void 0
      },
      o
    ))
  ] });
}
function cn({ detail: t, focus: n }) {
  const r = Object.values(t.evidence), [i, a] = k(""), [m, u] = k("all"), [l, c] = k(n);
  L(() => {
    n && (c(n), a(""), u("all"), requestAnimationFrame(() => {
      var h;
      return (h = document.getElementById(`ev-${n}`)) == null ? void 0 : h.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [n]);
  const o = ae(() => Array.from(new Set(r.map((h) => h.added_by))), [r]), w = r.filter((h) => (m === "all" || h.added_by === m) && (!i.trim() || `${h.id} ${h.source} ${je(h.value)}`.toLowerCase().includes(i.trim().toLowerCase())));
  return r.length ? /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ s("div", { className: "sme-filters", children: [
        /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${m === "all" ? "on" : ""}`, onClick: () => u("all"), children: "Tất cả" }),
        o.map((h) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${m === h ? "on" : ""}`, onClick: () => u(h), children: J(h) }, h))
      ] }),
      /* @__PURE__ */ s("label", { className: "sme-search", children: [
        /* @__PURE__ */ e(Se, { size: 14, className: "sme-muted" }),
        /* @__PURE__ */ e("input", { value: i, onChange: (h) => a(h.target.value), placeholder: "Tìm mã, nguồn, giá trị" })
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
      /* @__PURE__ */ s("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Nguồn" }),
          /* @__PURE__ */ e("th", { children: "Giá trị" }),
          /* @__PURE__ */ e("th", { style: { width: 150 }, children: "Agent" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: w.map((h) => {
          const z = je(h.value), d = l === h.id;
          return /* @__PURE__ */ s(
            "tr",
            {
              id: `ev-${h.id}`,
              className: `click ${n === h.id ? "focus" : ""}`,
              onClick: () => c(d ? null : h.id),
              children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: h.id }),
                /* @__PURE__ */ e("td", { children: h.source }),
                /* @__PURE__ */ s("td", { children: [
                  /* @__PURE__ */ e("span", { className: "sme-mono", style: { wordBreak: "break-word" }, children: z.length > 90 && !d ? z.slice(0, 88) + "…" : d ? "" : z }),
                  d && /* @__PURE__ */ e("pre", { className: "sme-pre", children: z })
                ] }),
                /* @__PURE__ */ s("td", { className: "sme-muted sme-small", children: [
                  J(h.added_by),
                  /* @__PURE__ */ e("div", { children: oe(h.added_at) })
                ] })
              ]
            },
            h.id
          );
        }) })
      ] }),
      w.length === 0 && /* @__PURE__ */ e(te, { icon: /* @__PURE__ */ e(Se, { size: 24 }), title: "Không có bằng chứng phù hợp" })
    ] })
  ] }) : /* @__PURE__ */ e(te, { icon: /* @__PURE__ */ e(st, { size: 30 }), title: "Chưa có bằng chứng" });
}
function dn({ detail: t, focus: n, onDecide: r, onEvidence: i }) {
  const [a, m] = k("open"), [u, l] = k({}), [c, o] = k(null);
  L(() => {
    n && (m("all"), requestAnimationFrame(() => {
      var d;
      return (d = document.getElementById(`rv-${n}`)) == null ? void 0 : d.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [n]);
  const w = t.review.filter((d) => d.status === "open").length, h = t.review.filter((d) => a === "all" || a === "open" == (d.status === "open")), z = async (d, b) => {
    o(d + b);
    try {
      await r(d, b, u[d] ?? "") && l((_) => ({ ..._, [d]: "" }));
    } finally {
      o(null);
    }
  };
  return t.review.length ? /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [["open", `Chờ xử lý (${w})`], ["done", `Đã xử lý (${t.review.length - w})`], ["all", "Tất cả"]].map(([d, b]) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${a === d ? "on" : ""}`, onClick: () => m(d), children: b }, d)) }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: "Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát." })
    ] }),
    h.length === 0 && /* @__PURE__ */ e(te, { icon: /* @__PURE__ */ e(Ve, { size: 30 }), title: a === "open" ? "Đã xử lý hết các mục" : "Không có mục nào" }),
    h.map((d) => {
      const b = Oe[d.reason_code] ?? { label: d.reason_code, tone: "muted" }, _ = at[d.status] ?? { label: d.status, tone: "muted" }, S = u[d.id] ?? "";
      return /* @__PURE__ */ s(
        "div",
        {
          id: `rv-${d.id}`,
          className: `sme-card sme-review ${Y(b.tone)}`,
          style: n === d.id ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)" } : void 0,
          children: [
            /* @__PURE__ */ s("div", { className: "sme-between", children: [
              /* @__PURE__ */ s("span", { className: "sme-row", children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: d.id }),
                /* @__PURE__ */ e(B, { t: b.tone, children: b.label })
              ] }),
              /* @__PURE__ */ e(B, { t: _.tone, children: _.label })
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "10px 0 6px", fontSize: 13.5, lineHeight: 1.55 }, children: d.detail }),
            /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
              J(d.source_agent),
              " · ",
              oe(d.created_at),
              /* @__PURE__ */ e(lt, { refs: d.evidence_refs, onOpen: i })
            ] }),
            d.status === "open" ? /* @__PURE__ */ s("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ e(
                "textarea",
                {
                  className: "sme-textarea",
                  value: S,
                  placeholder: "Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…",
                  onChange: (K) => l({ ...u, [d.id]: K.target.value })
                }
              ),
              /* @__PURE__ */ s("div", { className: "sme-row", style: { marginTop: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ e(R, { disabled: !S.trim(), busy: c === d.id + "needs_info", onClick: () => z(d.id, "needs_info"), children: "Yêu cầu bổ sung" }),
                /* @__PURE__ */ e(R, { primary: !0, disabled: !S.trim(), busy: c === d.id + "confirmed", onClick: () => z(d.id, "confirmed"), children: "Xác nhận" })
              ] })
            ] }) : /* @__PURE__ */ s("div", { className: `sme-decision ${Y(_.tone)}`, children: [
              /* @__PURE__ */ e("b", { children: _.label }),
              " bởi ",
              d.decided_by,
              " · ",
              oe(d.decided_at),
              /* @__PURE__ */ e("div", { style: { marginTop: 2 }, children: d.note })
            ] })
          ]
        },
        d.id
      );
    })
  ] }) : /* @__PURE__ */ e(te, { icon: /* @__PURE__ */ e(Ve, { size: 30 }), title: "Không có mục cần rà soát" });
}
function mn({ detail: t }) {
  if (!t.audit.length) return /* @__PURE__ */ e(te, { icon: /* @__PURE__ */ e(Nt, { size: 30 }), title: "Chưa có nhật ký" });
  const n = (i) => i.action === "verification" ? i.passed ? "ok" : "danger" : i.action === "review_decide" ? "accent" : i.action === "review_add" ? "warn" : "muted", r = (i) => {
    var m, u;
    const a = i.agent ? J(i.agent) : i.actor ?? "";
    switch (i.action) {
      case "result_put":
        return `${a} lưu kết quả v${i.version}${i.rerun_reason ? ` (chạy lại: ${i.rerun_reason})` : ""}`;
      case "verification":
        return `${a} v${i.version}: ${i.passed ? "đạt kiểm chứng" : "bị chặn"}`;
      case "evidence_add":
        return `${a} thêm ${(i.ids ?? []).join(", ")}`;
      case "review_add":
        return `${a} thêm ${i.id} (${((m = Oe[i.reason_code]) == null ? void 0 : m.label) ?? i.reason_code})`;
      case "review_decide":
        return `${i.actor} ${((u = at[i.status]) == null ? void 0 : u.label.toLowerCase()) ?? i.status} ${i.id}`;
      case "case_create":
        return `Luồng ${i.flow}, ${i.documents} chứng từ`;
      default:
        return a;
    }
  };
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t.audit].reverse().map((i, a) => /* @__PURE__ */ s("div", { className: `sme-tl-item ${Y(n(i))}`, children: [
    /* @__PURE__ */ s("div", { className: "sme-between", children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", style: { fontSize: 13 }, children: Yt[i.action] ?? i.action }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: oe(i.ts) })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: r(i) })
  ] }, a)) }) });
}
function hn({ detail: t, flow: n, onAgent: r }) {
  return /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: it.map((i) => /* @__PURE__ */ s("div", { className: "sme-phase", children: [
    /* @__PURE__ */ e("span", { className: "sme-phase-name", children: i.name }),
    i.agents.map((a) => {
      const m = a === "industry" && n !== "B" && !t.results[a], u = m ? "none" : Ee(t.results[a]);
      return /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: `sme-node ${Y(xe[u].tone)} ${m || u === "none" ? "skip" : ""}`,
          disabled: m || u === "none",
          title: m ? "Chỉ chạy ở luồng B" : xe[u].label,
          onClick: () => r(a),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(ct, { state: u, size: 12 }) }),
            /* @__PURE__ */ s("span", { children: [
              J(a),
              m ? " (luồng B)" : ""
            ] })
          ]
        },
        a
      );
    })
  ] }, i.name)) }) });
}
function Re({ label: t, children: n }) {
  return /* @__PURE__ */ s("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: n })
  ] });
}
function pn({
  caseId: t,
  assistantOpen: n,
  syncTick: r,
  onBack: i,
  onToggleAssistant: a,
  onAskAssistant: m,
  onCaseMetaChange: u
}) {
  var re, ce, we, be, ie;
  const l = Qe(), [c, o] = k(null), [w, h] = k(null), [z, d] = k(!1), [b, _] = k("overview"), [S, K] = k(null), [q, G] = k(null), [D, W] = k(null), x = H(0), C = H(!1), g = O(async (p = !1) => {
    if (!(p && C.current)) {
      p ? C.current = !0 : d(!0);
      try {
        o(await l.get(`${qe}/cases/${t}`)), h(null), x.current = Date.now();
      } catch (X) {
        p || h(ze(X));
      } finally {
        p ? C.current = !1 : d(!1);
      }
    }
  }, [l, t]);
  L(() => {
    g();
  }, [g]), L(() => {
    r > 0 && g(!0);
  }, [r, g]), L(() => {
    const p = () => {
      document.visibilityState !== "hidden" && Date.now() - x.current >= 3e3 && g(!0);
    };
    return window.addEventListener("focus", p), document.addEventListener("visibilitychange", p), () => {
      window.removeEventListener("focus", p), document.removeEventListener("visibilitychange", p);
    };
  }, [g]);
  const v = ae(() => c ? Jt(c) : {}, [c]), N = (c == null ? void 0 : c.review.filter((p) => p.status === "open")) ?? [], ne = ae(
    () => c ? ve.filter((p) => Ee(c.results[p]) === "blocked").length : 0,
    [c]
  ), ue = (re = v.policy) == null ? void 0 : re.rows.filter((p) => p.status === "not_met").length, Q = ((we = (ce = v.dscr) == null ? void 0 : ce.scenarios.find((p) => p.stress_pct === 0)) == null ? void 0 : we.dscr) ?? null, M = (p) => {
    K(p), _("evidence");
  }, se = (p) => {
    G(p), _("review");
  }, F = (p) => {
    W(p), _("agents");
  }, ge = async (p, X, ke) => {
    try {
      return await l.post(`${qe}/cases/${t}/review/${p}`, { status: X, note: ke }), await g(), !0;
    } catch (Ae) {
      return h(ze(Ae)), !1;
    }
  }, $ = c == null ? void 0 : c.case, V = ($ == null ? void 0 : $.customer) ?? {}, A = ($ == null ? void 0 : $.request) ?? {}, P = V.name ? String(V.name) : void 0, le = ($ == null ? void 0 : $.flow) ?? "A", U = N.length > 0 || ne > 0;
  L(() => {
    u({ customerName: P, flow: le, hasIssues: U });
  }, [P, le, U, u]);
  const Z = () => m(`Chạy thẩm định hồ sơ ${t}, luồng ${le}.`, "prefill"), ye = (p, X) => m(
    `Giải thích chi tiết kết quả, bằng chứng và điểm cần lưu ý của agent ${X} (${p}) trên hồ sơ ${t}.`,
    "prefill"
  ), fe = [
    { key: "overview", label: "Tổng quan" },
    { key: "agents", label: "Kết quả agent", count: c ? Object.keys(c.results).length : void 0 },
    { key: "evidence", label: "Bằng chứng", count: c ? Object.keys(c.evidence).length : void 0 },
    { key: "review", label: "Rà soát", count: N.length || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ s("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ s("div", { className: "sme-hero", children: [
      /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ s("button", { type: "button", className: "sme-back", onClick: i, children: [
          /* @__PURE__ */ e(_t, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: String(V.name ?? t) }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          $ && /* @__PURE__ */ s("span", { className: "sme-chip", children: [
            "Luồng ",
            $.flow
          ] }),
          V.industry_code && /* @__PURE__ */ s("span", { className: "sme-chip", children: [
            "Ngành ",
            String(V.industry_code)
          ] }),
          A.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: rt[A.purpose] ?? A.purpose }),
          $ && /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
            "Tạo ",
            oe($.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(R, { onClick: () => g(), busy: z, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(et, { size: 14 }) }),
        /* @__PURE__ */ s(
          R,
          {
            className: n ? "sme-toggle-on" : void 0,
            "aria-pressed": n,
            onClick: a,
            title: n ? "Thu gọn trợ lý thẩm định" : "Mở trợ lý thẩm định bên phải",
            children: [
              /* @__PURE__ */ e($e, { size: 14 }),
              " Trợ lý thẩm định"
            ]
          }
        ),
        /* @__PURE__ */ s(R, { primary: !0, onClick: Z, children: [
          /* @__PURE__ */ e(nt, { size: 14 }),
          " Chạy thẩm định"
        ] })
      ] })
    ] }),
    w && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(Ze, { title: "Có lỗi khi làm việc với hồ sơ", children: w }) }),
    !c && !w && /* @__PURE__ */ s("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "70%" } })
    ] }),
    c && $ && /* @__PURE__ */ s(Je, { children: [
      /* @__PURE__ */ s("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          ee,
          {
            icon: /* @__PURE__ */ e(St, { size: 18 }),
            label: "Số tiền đề nghị",
            value: Lt(A.amount).replace(" đ", ""),
            hint: [A.term_months ? `${A.term_months} tháng` : null, A.annual_rate_pct ? `lãi ${j(A.annual_rate_pct)}%/năm` : null].filter(Boolean).join(" · ") || "VND"
          }
        ),
        /* @__PURE__ */ e(
          ee,
          {
            t: Q == null ? "muted" : ((be = v.dscr) == null ? void 0 : be.threshold) !== void 0 && Q < v.dscr.threshold ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Tt, { size: 18 }),
            label: "DSCR cơ sở",
            value: j(Q),
            hint: ((ie = v.dscr) == null ? void 0 : ie.threshold) !== void 0 ? `Ngưỡng ≥ ${j(v.dscr.threshold)}` : "Chưa có phân tích"
          }
        ),
        /* @__PURE__ */ e(
          ee,
          {
            t: ue == null ? "muted" : ue > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(zt, { size: 18 }),
            label: "Điều kiện không đạt",
            value: ue ?? "—",
            hint: v.policy ? `${v.policy.rows.length} điều kiện · ${v.policy.product}` : "Chưa kiểm tra chính sách"
          }
        ),
        /* @__PURE__ */ e(
          ee,
          {
            t: N.length ? "warn" : "ok",
            icon: /* @__PURE__ */ e(tt, { size: 18 }),
            label: "Chờ cán bộ rà soát",
            value: N.length,
            hint: `${c.review.length} mục tổng cộng`
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(hn, { detail: c, flow: $.flow, onAgent: F }) }),
      /* @__PURE__ */ s("div", { className: "sme-detail", children: [
        /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: fe.map((p) => /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": b === p.key,
              className: `sme-tab ${b === p.key ? "on" : ""}`,
              onClick: () => _(p.key),
              children: [
                p.label,
                p.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: p.count })
              ]
            },
            p.key
          )) }),
          b === "overview" && /* @__PURE__ */ e(an, { detail: c, m: v, onEvidence: M, goAgents: () => _("agents") }),
          b === "agents" && /* @__PURE__ */ e(
            ln,
            {
              detail: c,
              openAgent: D,
              onEvidence: M,
              onRunAssessment: Z,
              onAskAgent: ye
            }
          ),
          b === "evidence" && /* @__PURE__ */ e(cn, { detail: c, focus: S }),
          b === "review" && /* @__PURE__ */ e(dn, { detail: c, focus: q, onDecide: ge, onEvidence: M }),
          b === "audit" && /* @__PURE__ */ e(mn, { detail: c })
        ] }),
        /* @__PURE__ */ s("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Cần xử lý" }),
              /* @__PURE__ */ e(B, { t: N.length ? "warn" : "ok", children: N.length })
            ] }),
            N.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn mục chờ rà soát." }),
            N.slice(0, 6).map((p) => {
              const X = Oe[p.reason_code] ?? { label: p.reason_code, tone: "muted" };
              return /* @__PURE__ */ s("button", { type: "button", className: "sme-todo", onClick: () => se(p.id), children: [
                /* @__PURE__ */ e(B, { t: X.tone, children: p.id }),
                /* @__PURE__ */ s("span", { className: "sme-todo-text", children: [
                  /* @__PURE__ */ s("b", { children: [
                    X.label,
                    "."
                  ] }),
                  " ",
                  p.detail
                ] })
              ] }, p.id);
            }),
            N.length > 6 && /* @__PURE__ */ s("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => _("review"), children: [
              "Xem thêm ",
              N.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Khách hàng" }),
            /* @__PURE__ */ e(Re, { label: "CIF", children: String(V.cif ?? "—") }),
            /* @__PURE__ */ e(Re, { label: "Mã số thuế", children: String(V.tax_id ?? "—") }),
            /* @__PURE__ */ e(Re, { label: "Số năm hoạt động", children: V.years_in_operation ?? "—" }),
            A.proposal && /* @__PURE__ */ s("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(A.proposal)
            ] })
          ] }),
          /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Chứng từ" }),
              /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: $.documents.length })
            ] }),
            $.documents.map((p) => /* @__PURE__ */ s("div", { className: "sme-row sme-small", style: { padding: "5px 0" }, children: [
              /* @__PURE__ */ e($t, { size: 14, className: "sme-muted" }),
              /* @__PURE__ */ e("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, children: p.name }),
              /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: p.id })
            ] }, p.id))
          ] }),
          c.audit.length > 0 && /* @__PURE__ */ s("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(Et, { size: 13 }),
            " Hoạt động gần nhất ",
            oe(c.audit[c.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
Vt();
const Ye = "sme-lending:assistant-open", Ue = "sme-lending:assistant-width", un = "sme-lending-chat-";
function yn() {
  const [t, n] = k(null), [r, i] = k(() => Bt(Ye)), [a, m] = k(() => qt(Ue)), [u, l] = k(null), [c, o] = k(null), [w, h] = k(null), z = H(0), { syncTick: d } = Ot(r, 3500), b = O((x) => {
    i((C) => {
      const g = typeof x == "function" ? x(C) : x;
      return Kt(Ye, g), g;
    });
  }, []), _ = O((x) => {
    const C = Me(x);
    m(C), Mt(Ue, C);
  }, []), S = O((x, C = "prefill") => {
    b(!0), l({ id: ++z.current, prompt: x, mode: C });
  }, [b]), K = O(() => {
    l(null);
  }, []), q = O((x) => {
    h(null), o(null), n(x);
  }, []), G = O(() => {
    o(null), n(null);
  }, []), D = O((x) => {
    o((C) => C === x || C && x && C.customerName === x.customerName && C.flow === x.flow && C.hasIssues === x.hasIssues ? C : x);
  }, []), W = ae(() => {
    if (!t)
      return [{
        label: "Hồ sơ chờ xử lý",
        prompt: "Rà soát danh sách các hồ sơ thẩm định đang có mục chờ cán bộ xử lý hoặc kết quả bị chặn kiểm chứng."
      }];
    const x = [
      {
        label: "Chạy thẩm định",
        prompt: `Chạy thẩm định hồ sơ ${t}, luồng ${(c == null ? void 0 : c.flow) ?? "A"}.`
      },
      {
        label: "Giải thích kết quả",
        prompt: `Giải thích tóm tắt kết quả thẩm định, các cảnh báo mức cao và mã bằng chứng chính của hồ sơ ${t}.`
      }
    ];
    return c != null && c.hasIssues && x.push({
      label: "Phân tích mục chặn",
      prompt: `Phân tích các mục chờ rà soát và kết quả bị chặn kiểm chứng của hồ sơ ${t}, nêu rõ chứng từ cần đối chiếu.`
    }), x;
  }, [t, c]);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ s("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: t ? /* @__PURE__ */ e(
      pn,
      {
        caseId: t,
        assistantOpen: r,
        syncTick: d,
        onBack: G,
        onToggleAssistant: () => b((x) => !x),
        onAskAssistant: S,
        onCaseMetaChange: D
      }
    ) : /* @__PURE__ */ e(
      tn,
      {
        onOpen: q,
        assistantOpen: r,
        syncTick: d,
        onToggleAssistant: () => b((x) => !x),
        onAskAssistant: S,
        onCreatedCase: h
      }
    ) }),
    r && /* @__PURE__ */ e(
      Ht,
      {
        storagePrefix: "sme-lending",
        chatPrefix: un,
        agent: jt,
        panelLabel: "Trợ lý thẩm định",
        newIntakePrompt: "Tạo hồ sơ thẩm định SME mới: ",
        newSessionTitle: "Hồ sơ SME mới",
        caseTitlePrefix: "Thẩm định",
        chips: W,
        attachDefaultPrefix: t ? `Tôi gửi thêm chứng từ cho hồ sơ thẩm định ${t}: ` : void 0,
        embedPlaceholder: t ? `Hỏi trợ lý hoặc chạy thẩm định cho ${t}...` : "Cung cấp thông tin khách hàng hoặc chứng từ để tạo hồ sơ thẩm định...",
        width: a,
        onWidthChange: _,
        onClose: () => b(!1),
        caseId: t,
        customerName: t ? c == null ? void 0 : c.customerName : void 0,
        intent: u,
        onConsumeIntent: K,
        createdCase: w,
        onOpenCase: q,
        onDismissCreatedCase: () => h(null)
      }
    )
  ] }) });
}
export {
  yn as default
};
