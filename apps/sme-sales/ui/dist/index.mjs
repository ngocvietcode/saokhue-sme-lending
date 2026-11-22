import { jsxs as n, jsx as e, Fragment as _e } from "react/jsx-runtime";
import * as Ze from "@kirocrew/app-sdk";
import { useChatLauncher as Ot, useAppApi as nt } from "@kirocrew/app-sdk";
import { useCallback as ne, useState as N, useMemo as P, useRef as ie, useEffect as se, Fragment as Ct } from "react";
import { Btn as C, PageHeader as Ft, ErrorNotice as _t } from "@kirocrew/app-sdk/ui";
import { MessageSquare as Se, Plus as Je, ExternalLink as Ye, PanelRightClose as Ut, ArrowRight as Gt, AlertTriangle as Xt, FileText as St, Mail as st, Calendar as jt, CheckCircle2 as $t, XCircle as Vt, CircleDot as Wt, CircleDashed as Qt, RefreshCw as Tt, FolderOpen as pt, ClipboardCheck as ze, ShieldAlert as Yt, Clock as Zt, Search as gt, EyeOff as Jt, Eye as It, X as en, Send as Et, Check as Ue, Copy as Ge, SkipForward as tn, RotateCcw as nn, FileSearch as sn, Download as rn, Trash2 as an, History as ln, ArrowLeft as on, Unlock as ft, Landmark as cn, ClipboardList as dn, ShieldCheck as mn, Activity as hn } from "lucide-react";
const un = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function pn(t, s, r) {
  const i = Ot();
  return ne(
    async (h, c, g) => {
      const { openChat: x } = i, m = i.createChat;
      if (!m) {
        x({ autoSend: !1, message: h });
        return;
      }
      try {
        const w = await m({ slotKey: s + un(c), agent: t, title: g });
        x({ slotKey: w, autoSend: !1, message: h });
      } catch {
      }
    },
    [i, t, s, r]
  );
}
const rt = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, Fe = new Intl.NumberFormat("vi-VN"), zt = (t) => typeof t == "number" ? Fe.format(t) + " đ" : "—", at = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? Fe.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? Fe.format(Math.round(t / 1e4) / 100) + " triệu" : Fe.format(t) + " đ", Ce = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", qe = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, me = (t) => {
  if (!t) return "—";
  const s = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t.trim());
  if (s) return `${Number(s[3])}/${Number(s[2])}/${s[1]}`;
  const r = new Date(t);
  return Number.isNaN(r.getTime()) ? "—" : r.toLocaleDateString("vi-VN");
}, Dt = (t) => {
  if (!t) return "—";
  const s = new Date(t).getTime();
  if (Number.isNaN(s)) return "—";
  const r = Math.round((Date.now() - s) / 1e3);
  return r < 60 ? "vừa xong" : r < 3600 ? `${Math.floor(r / 60)} phút trước` : r < 86400 ? `${Math.floor(r / 3600)} giờ trước` : `${Math.floor(r / 86400)} ngày trước`;
}, bt = (t) => {
  const s = /* @__PURE__ */ new Date();
  s.setDate(s.getDate() + t);
  const r = s.getFullYear(), i = String(s.getMonth() + 1).padStart(2, "0"), h = String(s.getDate()).padStart(2, "0");
  return `${r}-${i}-${h}`;
};
async function it(t) {
  var s;
  try {
    if ((s = navigator.clipboard) != null && s.writeText)
      return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const r = document.createElement("textarea");
    r.value = t, r.style.position = "fixed", r.style.opacity = "0", document.body.appendChild(r), r.select();
    const i = document.execCommand("copy");
    return document.body.removeChild(r), i;
  } catch {
    return !1;
  }
}
const De = (t) => t instanceof Error ? t.message : String(t), et = "kirocrew_prefill", vt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), gn = (t, s) => {
};
function lt(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function fn(t) {
  try {
    const s = localStorage.getItem(t);
    if (s === "1") return !0;
    if (s === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function bn(t, s) {
  try {
    localStorage.setItem(t, s ? "1" : "0");
  } catch {
  }
}
function vn(t, s = 420) {
  try {
    const r = Number(localStorage.getItem(t));
    if (Number.isFinite(r) && r >= 360 && r <= 620) return Math.round(r);
  } catch {
  }
  return s;
}
function xn(t, s) {
  try {
    localStorage.setItem(t, String(lt(s)));
  } catch {
  }
}
function yn(t, s = 4e3) {
  const r = Ze.useAppEvents ?? gn, [i, h] = N(0), c = ne(() => h((g) => g + 1), []);
  return r("tool_result", c), r("chat_done", c), se(() => {
    if (!t) return;
    const g = window.setInterval(() => {
      document.visibilityState !== "hidden" && h((x) => x + 1);
    }, s);
    return () => window.clearInterval(g);
  }, [t, s]), { syncTick: i, bumpSync: c };
}
function kn(t) {
  try {
    const s = sessionStorage.getItem(t);
    if (s) return s;
    const r = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, r), r;
  } catch {
    return "intake-default";
  }
}
function wn(t, s) {
  try {
    sessionStorage.setItem(t, s);
  } catch {
  }
}
function we(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function Be(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function Pe(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const r = t.value.length;
    t.setSelectionRange(r, r);
    return;
  }
  const s = window.getSelection();
  s && (s.selectAllChildren(t), s.collapseToEnd());
}
function xt(t, s) {
  const r = Date.now();
  try {
    sessionStorage.setItem(et, JSON.stringify({ slotKey: t, prompt: s, ts: r }));
  } catch {
  }
  return r;
}
function Nn({
  storagePrefix: t,
  chatPrefix: s,
  agent: r,
  panelLabel: i,
  newIntakePrompt: h,
  newSessionTitle: c,
  caseTitlePrefix: g = "Hồ sơ",
  chips: x = [],
  showNewSessionButton: m,
  attachDefaultPrefix: w,
  embedPlaceholder: f,
  width: u,
  onWidthChange: T,
  onClose: z,
  caseId: $,
  customerName: H,
  intent: o,
  onConsumeIntent: k,
  createdCase: a,
  onOpenCase: I,
  onDismissCreatedCase: D
}) {
  const V = Ze, q = V.ChatPanel, U = V.ChatEmbed, W = Ze.useChatLauncher(), R = pn(r, s), L = `${t}:intake-id`, [b, M] = N(() => kn(L)), j = $ ?? b, y = s + vt(j), _ = P(() => $ ? H ? `${g} ${H} (${$})` : `${g} ${$}` : c, [$, H, c, g]), [K, ee] = N(null), [G, re] = N(null), oe = ie(null);
  oe.current = K, se(() => {
    let v = !1;
    re(null);
    const E = oe.current === y, F = W.createChat;
    if (!F) {
      E || ee(y);
      return;
    }
    return E || ee(null), F({ slotKey: y, agent: r, title: _ }).then((B) => {
      if (v) return;
      const Y = B || y;
      oe.current !== Y && ee(Y);
    }).catch((B) => {
      v || E || re(De(B));
    }), () => {
      v = !0;
    };
  }, [y, r, _, W]);
  const Z = ie(null), d = ie(0), O = ie(null), S = ie(!1), [p, le] = N(0), J = ne((v, E) => {
    const F = E.trim();
    if (!F) return;
    const B = we(Z.current);
    if (oe.current === v && B) {
      Be(B).trim().includes(F) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: E } })), requestAnimationFrame(() => Pe(we(Z.current)));
      return;
    }
    const Y = xt(v, E);
    O.current = { slotKey: v, prompt: E, ts: Y }, le((Ie) => Ie + 1);
  }, []);
  se(() => {
    const v = O.current;
    if (!v || K !== v.slotKey) return;
    let E = 0, F = 0;
    const B = window.setInterval(() => {
      E += 1;
      const Y = we(Z.current);
      if (!Y) {
        E >= 20 && (window.clearInterval(B), O.current = null);
        return;
      }
      if (Be(Y).trim().includes(v.prompt.trim())) {
        O.current = null, window.clearInterval(B), Pe(Y);
        return;
      }
      if (F += 1, F >= 3) {
        try {
          const he = sessionStorage.getItem(et);
          if (he) {
            const ce = JSON.parse(he);
            ce.slotKey === v.slotKey && ce.ts === v.ts && sessionStorage.removeItem(et);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: v.prompt } })), O.current = null, window.clearInterval(B), requestAnimationFrame(() => Pe(we(Z.current)));
      }
    }, 60);
    return () => window.clearInterval(B);
  }, [K, p]), se(() => {
    if (!S.current || !K) return;
    let v = 0;
    const E = () => {
      var Y;
      const B = (Y = Z.current) == null ? void 0 : Y.querySelector('input[type="file"]');
      return B ? (S.current = !1, B.click(), !0) : !1;
    };
    if (E()) return;
    const F = window.setInterval(() => {
      v += 1, (E() || v >= 16) && (S.current = !1, window.clearInterval(F));
    }, 50);
    return () => window.clearInterval(F);
  }, [K, p]);
  const Q = ne((v) => {
    const E = `intake-${Date.now().toString(36)}`, F = s + vt(E);
    if (wn(L, E), D(), v) {
      const B = xt(F, v);
      O.current = { slotKey: F, prompt: v, ts: B }, le((Y) => Y + 1);
    }
    M(E);
  }, [s, L, D]);
  se(() => {
    var v;
    if (!(!o || o.id === d.current)) {
      if (d.current = o.id, o.mode === "new_intake") {
        const E = we(Z.current), F = Be(E).trim(), B = (o.prompt || h).trim();
        $ === null && F === B && E ? Pe(E) : Q(o.prompt || h), k();
        return;
      }
      if (o.mode === "attach") {
        const E = we(Z.current), F = w ?? ($ ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${$}: ` : "");
        F && !Be(E).trim() && J(y, F);
        const B = (v = Z.current) == null ? void 0 : v.querySelector('input[type="file"]');
        B ? (S.current = !1, B.click()) : (S.current = !0, le((Y) => Y + 1)), k();
        return;
      }
      J(y, o.prompt), k();
    }
  }, [
    o,
    $,
    y,
    h,
    w,
    k,
    J,
    Q
  ]);
  const [$e, Re] = N(!1), ge = ie(null), xe = (v) => {
    v.preventDefault(), v.currentTarget.setPointerCapture(v.pointerId), ge.current = { startX: v.clientX, startW: u, pointerId: v.pointerId }, Re(!0);
  }, je = (v) => {
    const E = ge.current;
    !E || E.pointerId !== v.pointerId || T(lt(E.startW + (E.startX - v.clientX)));
  }, Te = (v) => {
    var E;
    ((E = ge.current) == null ? void 0 : E.pointerId) === v.pointerId && (ge.current = null, Re(!1));
  }, ae = m ?? !$;
  return /* @__PURE__ */ n("aside", { ref: Z, className: "sme-dock", style: { width: u }, "aria-label": i, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${$e ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: xe,
        onPointerMove: je,
        onPointerUp: Te,
        onPointerCancel: Te
      }
    ),
    /* @__PURE__ */ n("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ n("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e(Se, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          $ ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: $ }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: i })
        ] }),
        x.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: x.map((v) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              v.onClick ? v.onClick() : v.prompt && J(y, v.prompt);
            },
            children: v.label
          },
          v.label
        )) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        ae && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => Q(), children: /* @__PURE__ */ e(Je, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => R("", j, _),
            children: /* @__PURE__ */ e(Ye, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: z, children: /* @__PURE__ */ e(Ut, { size: 15 }) })
      ] })
    ] }),
    !$ && a && /* @__PURE__ */ n("div", { className: "sme-dock-new-banner", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: a.name }),
        " ",
        /* @__PURE__ */ n("span", { className: "sme-mono", children: [
          "(",
          a.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ n(C, { primary: !0, onClick: () => I(a.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(Gt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: G ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: G }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(C, { onClick: () => R("", j, _), children: [
        /* @__PURE__ */ e(Ye, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : K ? q ? /* @__PURE__ */ e(q, { slotKey: K, conversationOnly: !0 }, K) : U ? /* @__PURE__ */ e(
      U,
      {
        slotKey: K,
        agent: r,
        frameless: !0,
        startAtBottom: !0,
        placeholder: f
      },
      K
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(C, { primary: !0, onClick: () => R("", j, _), children: [
        /* @__PURE__ */ e(Ye, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const Cn = `
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
function _n() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = Cn, document.head.appendChild(s);
}
const Ke = "/apps/sme-sales/api", yt = {
  draft: { label: "Khởi tạo", tone: "muted" },
  collecting: { label: "Đang thu thập", tone: "warn" },
  ready: { label: "Đủ điều kiện trình", tone: "ok" },
  submitted: { label: "Đã bàn giao", tone: "info" }
}, Kt = {
  open: { label: "Chưa bổ sung", tone: "danger" },
  requested: { label: "Chờ khách hàng", tone: "info" },
  waived: { label: "Xin miễn / Bổ sung sau", tone: "muted" },
  resolved: { label: "Đạt", tone: "ok" },
  ok: { label: "Đạt", tone: "ok" }
}, Sn = {
  PASS: { label: "PASS", tone: "ok" },
  MISSING_REQUIRED: { label: "MISSING_REQUIRED", tone: "warn" },
  FAIL: { label: "FAIL", tone: "danger" },
  SKIPPED: { label: "SKIPPED", tone: "muted" },
  UNDETERMINED_CONDITION: { label: "UNDETERMINED_CONDITION", tone: "info" }
}, $n = {
  PASS: { label: "Khớp", tone: "ok" },
  FAIL: { label: "Không đạt", tone: "danger" },
  MISSING_DATA: { label: "Thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, ot = { email: "Email", zalo: "Zalo", phone_script: "Kịch bản gọi" }, Tn = {
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
}, Ae = (t) => t.rule_status === "SKIPPED" || t.applicable === !1, Me = (t) => !Ae(t) && (t.owner_role ?? "CUSTOMER") === "CUSTOMER" && t.rule_status !== "UNDETERMINED_CONDITION" && !!t.ask, Mt = (t) => t ? t.startsWith("agent:") || t === "dossier-coach" ? "Trợ lý AI" : "ĐVKD" : "Hệ thống", In = "dossier-coach", En = "sme-sales-chat-";
function zn(t) {
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
function He(t, s, r) {
  if (s == null || s === "") return "—";
  if (typeof s == "boolean") return s ? "Có" : "Không";
  if (t === "request.purpose" && typeof s == "string") return rt[s] ?? s;
  if (t === "request.product_code" && typeof s == "string") {
    const i = r == null ? void 0 : r.products.products.find((h) => h.code === s);
    return i ? `${i.code} · ${i.name}` : s;
  }
  return typeof s == "number" ? /fiscal_year/.test(t) ? String(s) : /_pct$|ty_le/.test(t) ? `${Ce(s, 2)}%` : /term_months|so_thang/.test(t) ? `${s} tháng` : /years_in_operation|so_nam/.test(t) ? `${Ce(s, 1)} năm` : /amount|capital|revenue|income|assets|equity|investment|value|exposure|so_tien|gia_tri|doanh_thu|von|tai_san|loi_nhuan/.test(t) ? zt(s) : s.toLocaleString("vi-VN") : typeof s == "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) ? me(s) : String(s);
}
function Xe(t, s) {
  return s == null || s === "" ? "—" : t === "loan_amount" ? at(s) : t === "term_months" ? `${Ce(s, 0)} tháng` : t === "years_in_operation" ? `${Ce(s, 1)} năm` : t === "equity_contribution_pct" ? `${Ce(s, 1)}%` : typeof s == "number" ? Ce(s) : String(s);
}
function Dn(t, s, r = "email", i = !1) {
  const h = ot[r], c = i ? "nhắc khách bổ sung (giọng nhắc lịch sự các mục đã yêu cầu)" : "xin khách bổ sung", g = s.map((x) => `- ${x.title} [${x.key}]`).join(`
`);
  return `Soạn ${h} ${c} cho hồ sơ ${t} (kênh: ${r}) gồm các hạng mục sau:
${g}`;
}
function Kn(t, s) {
  var z, $, H, o, k;
  const { case: r, overview: i } = t, h = (s == null ? void 0 : s.documents.types) ?? {}, c = i.items.filter((a) => !Ae(a)), g = c.filter((a) => a.blocking).length, x = c.filter((a) => a.blocking && ["ok", "resolved", "waived"].includes(a.status)).length, m = [
    `PHIẾU BÀN GIAO HỒ SƠ THẨM ĐỊNH: ${r.case_id}`,
    `Khách hàng: ${((z = r.customer) == null ? void 0 : z.name) ?? "Chưa rõ"} | MST: ${(($ = r.customer) == null ? void 0 : $.tax_id) ?? "—"} | Luồng: ${r.flow}`,
    `Master Checklist: ${i.checklist_overall ?? "INCOMPLETE"} | Hạng mục áp dụng: ${x}/${g}`,
    `Trạng thái: ${i.readiness.ready ? "Đủ điều kiện trình" : `Còn ${i.readiness.blocking_open.length} mục chặn`}`,
    "",
    "1. THÔNG TIN KHÁCH HÀNG & ĐỀ XUẤT"
  ];
  for (const a of i.profile)
    m.push(`- ${a.label}: ${He(a.path, a.value, s)}`);
  m.push("", `2. CHỨNG TỪ ĐỐI CHIẾU (${r.documents.length})`), r.documents.length === 0 && m.push("- Chưa có chứng từ");
  for (const a of r.documents) {
    const I = a.type ? ((H = h[a.type]) == null ? void 0 : H.label) ?? a.type : "Chưa phân loại";
    m.push(`- ${a.id}: ${I} (${a.name}${a.issued_date ? `, lập ${me(a.issued_date)}` : ""})${a.summary ? ` — ${a.summary}` : ""}`);
  }
  const w = ((o = i.crosschecks) == null ? void 0 : o.rules) ?? [];
  if (w.length > 0) {
    m.push("", `3. ĐỐI CHIẾU CHÉO 7 RULE (${((k = i.crosschecks) == null ? void 0 : k.overall_status) ?? "—"})`);
    for (const a of w.filter((I) => I.status !== "SKIPPED"))
      m.push(`- [${a.id}] ${a.title}: ${a.status} — ${a.detail}`);
  }
  const f = (i.policy_checks ?? []).filter((a) => a.status === "not_met");
  if (f.length > 0) {
    m.push("", "4. LƯU Ý ĐIỀU KIỆN CHÍNH SÁCH SƠ BỘ");
    for (const a of f)
      m.push(`- ${a.label}: thực tế ${Xe(a.fact, a.actual)}, yêu cầu ${a.op} ${Xe(a.fact, a.threshold)} (${a.clause})`);
  }
  const u = c.filter((a) => a.status === "waived");
  if (u.length > 0) {
    m.push("", "5. CÁC HẠNG MỤC XIN MIỄN / BỔ SUNG SAU KÈM GIẢI TRÌNH");
    for (const a of u)
      m.push(`- ${a.title}: ${a.note || "Không có ghi chú"}`);
  }
  const T = c.filter((a) => a.blocking && (a.status === "open" || a.status === "requested"));
  if (T.length > 0) {
    m.push("", "6. CÁC HẠNG MỤC CHẶN CHƯA ĐẠT (TRÌNH KÈM GIẢI TRÌNH)");
    for (const a of T)
      m.push(`- [${a.owner_role ?? "CUSTOMER"}] ${a.title}: ${a.rule_status ?? Kt[a.status].label}${a.due_date ? ` (hạn ${me(a.due_date)})` : ""}`);
  }
  return m.join(`
`);
}
function Mn({
  width: t,
  onWidthChange: s,
  onClose: r,
  caseId: i,
  customerName: h,
  readOnly: c = !1,
  hasOpenItems: g = !1,
  intent: x,
  onConsumeIntent: m,
  createdCase: w,
  onOpenCase: f,
  onDismissCreatedCase: u,
  onQuickDraft: T
}) {
  const z = P(() => {
    if (!i)
      return [{
        label: "Việc hôm nay",
        prompt: "Rà soát danh sách hồ sơ đang mở hôm nay, nêu các hồ sơ quá hạn hoặc sắp đủ điều kiện trình."
      }];
    if (c) return [];
    const $ = [{
      label: "Cập nhật",
      prompt: `Cập nhật thông tin hồ sơ ${i}: `
    }];
    return g && T && $.push({ label: "Soạn thư", onClick: T }), $.push({
      label: "Rà soát",
      prompt: `Rà soát các hạng mục chặn và điều kiện chính sách còn thiếu của hồ sơ ${i}, đề xuất phương án xử lý.`
    }), $;
  }, [i, c, g, T]);
  return /* @__PURE__ */ e(
    Nn,
    {
      storagePrefix: "sme-sales",
      chatPrefix: En,
      agent: In,
      panelLabel: "Trợ lý hồ sơ",
      newIntakePrompt: "Tạo hồ sơ mới cho khách hàng: ",
      newSessionTitle: "Hồ sơ SME mới",
      caseTitlePrefix: "Hồ sơ",
      chips: z,
      embedPlaceholder: i ? `Nhắn trợ lý hoặc kéo chứng từ vào cho ${i}...` : "Kể về khách hàng mới hoặc kéo bộ chứng từ vào đây...",
      width: t,
      onWidthChange: s,
      onClose: r,
      caseId: i,
      customerName: h,
      intent: x,
      onConsumeIntent: m,
      createdCase: w,
      onOpenCase: f,
      onDismissCreatedCase: u
    }
  );
}
const pe = (t) => `t-${t}`;
function X({ t, children: s, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${pe(t)}`, title: r, children: s });
}
function ue({ icon: t, label: s, value: r, hint: i, t: h = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${pe(h)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      i && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: i })
    ] })
  ] });
}
function ve({ icon: t, title: s, hint: r, action: i }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    i && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: i })
  ] });
}
function tt({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${pe(t)}`, children: [
    /* @__PURE__ */ e(Xt, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function Ht(t) {
  if (t.stage === "submitted") return { label: "Đã bàn giao", t: "info" };
  if (t.overdue > 0) return { label: `${t.overdue} quá hạn`, t: "danger" };
  if (t.ready) return { label: "Đủ điều kiện trình", t: "ok" };
  const s = t.actionable_blocking ?? t.blocking_open;
  return s > 0 ? { label: `Thiếu ${s} mục chặn`, t: "warn" } : t.requested > 0 ? { label: `Chờ KH (${t.requested})`, t: "info" } : { label: "Khởi tạo", t: "muted" };
}
function qt(t) {
  let s = 0, r = 0;
  for (const i of t.groups)
    s += i.done, r += i.total;
  return { done: s, total: r };
}
function Hn({ rows: t, onOpen: s }) {
  return t.length === 0 ? /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(St, { size: 28 }), title: "Không có hồ sơ phù hợp" }) : /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
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
      const i = Ht(r), { done: h, total: c } = qt(r), g = r.actionable_blocking ?? r.blocking_open;
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
        /* @__PURE__ */ e("td", { className: "sme-num sme-strong", children: at(r.amount) }),
        /* @__PURE__ */ e("td", { className: "sme-num", children: r.term_months ? `${r.term_months} tháng` : "—" }),
        /* @__PURE__ */ n("td", { className: "sme-num sme-mono", children: [
          h,
          "/",
          c
        ] }),
        /* @__PURE__ */ n("td", { className: "sme-small", children: [
          g > 0 && /* @__PURE__ */ n("span", { children: [
            g,
            " cần xử lý"
          ] }),
          g > 0 && r.requested > 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: " · " }),
          r.requested > 0 && /* @__PURE__ */ n("span", { className: "sme-muted", children: [
            r.requested,
            " chờ KH",
            r.next_due_date ? ` (hạn ${me(r.next_due_date)})` : ""
          ] }),
          g === 0 && r.requested === 0 && /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" })
        ] }),
        /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: i.t, children: i.label }) }),
        /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: Dt(r.updated_at) })
      ] }, r.case_id);
    }) })
  ] }) });
}
const kt = ({ stage: t }) => /* @__PURE__ */ e(X, { t: yt[t].tone, children: yt[t].label });
function At(t) {
  return t.done === t.total && t.total > 0 ? "ok" : t.blocked > 0 ? "danger" : t.done > 0 ? "warn" : "muted";
}
function qn({ g: t, size: s = 12 }) {
  return t.done === t.total && t.total > 0 ? /* @__PURE__ */ e($t, { size: s }) : t.blocked > 0 ? /* @__PURE__ */ e(Vt, { size: s }) : t.done > 0 ? /* @__PURE__ */ e(Wt, { size: s }) : /* @__PURE__ */ e(Qt, { size: s });
}
function An({ groups: t, activeGroup: s, onSelectGroup: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: t.map((i) => {
    const h = At(i), c = s === i.group;
    return /* @__PURE__ */ n("div", { className: "sme-phase", children: [
      /* @__PURE__ */ e("span", { className: "sme-phase-name", children: i.label }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${pe(h)} ${c ? "ss-active-node" : ""}`,
          title: `${i.label}: ${i.done}/${i.total} hạng mục đạt${i.blocked ? `, ${i.blocked} chặn` : ""}${i.skipped ? `, ${i.skipped} không áp dụng (ẩn)` : ""}`,
          onClick: () => r(c ? null : i.group),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(qn, { g: i }) }),
            /* @__PURE__ */ n("span", { children: [
              i.done,
              "/",
              i.total,
              c ? " · lọc" : ""
            ] })
          ]
        }
      )
    ] }, i.group);
  }) }) });
}
const Rn = [2, 3, 5, 7];
function ct({ label: t = "Hạn cam kết bổ sung", confirmLabel: s = "Xác nhận", busy: r, onConfirm: i, onCancel: h }) {
  const [c, g] = N(() => bt(3));
  return /* @__PURE__ */ n("div", { className: "ss-due-row", children: [
    /* @__PURE__ */ n("span", { className: "sme-small sme-muted sme-row", style: { gap: 5 }, children: [
      /* @__PURE__ */ e(jt, { size: 13 }),
      " ",
      t,
      ":"
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-filters", role: "group", "aria-label": "Chọn nhanh số ngày", children: Rn.map((x) => {
      const m = bt(x);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-filter ${c === m ? "on" : ""}`,
          onClick: () => g(m),
          children: [
            "+",
            x,
            " ngày"
          ]
        },
        x
      );
    }) }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "date",
        className: "sme-input",
        style: { width: 148, padding: "4px 8px", fontSize: 12 },
        value: c,
        onChange: (x) => g(x.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 6, marginLeft: "auto" }, children: [
      h && /* @__PURE__ */ e(C, { onClick: h, children: "Huỷ" }),
      /* @__PURE__ */ e(C, { primary: !0, busy: r, disabled: !c, onClick: () => i(c), children: s })
    ] })
  ] });
}
function Rt({ onPick: t }) {
  return /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: ["email", "zalo", "phone_script"].map((s) => /* @__PURE__ */ n(C, { onClick: () => t(s), children: [
    /* @__PURE__ */ e(st, { size: 13 }),
    " ",
    ot[s]
  ] }, s)) });
}
const Ln = `
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
function Bn() {
  const t = "sme-sales-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = Ln, document.head.appendChild(s);
}
const Lt = "sme-sales:view", Pn = () => {
  try {
    return localStorage.getItem(Lt) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
};
function On({ r: t, onOpen: s }) {
  const r = Ht(t), { done: i, total: h } = qt(t);
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
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.customer_name || "Chưa có tên doanh nghiệp" }),
            /* @__PURE__ */ n("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: [
              t.case_id,
              t.tax_id ? ` · MST ${t.tax_id}` : ""
            ] })
          ] }),
          /* @__PURE__ */ e(X, { t: r.t, children: r.label })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: at(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.product_code, t.term_months ? `${t.term_months} tháng` : null, t.purpose ? rt[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${i}/${h} hạng mục đạt`, children: t.groups.map((c) => {
          const g = At(c);
          return /* @__PURE__ */ e(
            "span",
            {
              className: g === "muted" ? "none" : pe(g),
              title: `${c.label}: ${c.done}/${c.total} hạng mục`
            },
            c.group
          );
        }) }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ n("span", { className: "sme-row", style: { gap: 6 }, children: [
            /* @__PURE__ */ n("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            /* @__PURE__ */ n("span", { className: "sme-mono", children: [
              i,
              "/",
              h,
              " mục"
            ] }),
            (t.policy_breaches ?? 0) > 0 && /* @__PURE__ */ n(X, { t: "danger", children: [
              t.policy_breaches,
              " lệch chuẩn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            Dt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function Fn({
  onOpen: t,
  catalog: s,
  coachOpen: r,
  syncTick: i,
  onToggleCoach: h,
  onAskCoach: c,
  onCreatedCase: g
}) {
  const x = nt(), [m, w] = N(null), [f, u] = N(null), [T, z] = N(null), [$, H] = N(!1), [o, k] = N("all"), [a, I] = N(""), [D, V] = N(Pn), q = ie(0), U = ie(!1), W = ie(null), R = (y) => {
    V(y);
    try {
      localStorage.setItem(Lt, y);
    } catch {
    }
  }, L = ne(async (y = !1) => {
    if (!(y && U.current)) {
      y ? U.current = !0 : H(!0);
      try {
        const _ = await x.get(`${Ke}/cases`);
        if (W.current === null)
          W.current = new Set(_.cases.map((K) => K.case_id));
        else {
          const K = _.cases.find((ee) => !W.current.has(ee.case_id));
          _.cases.forEach((ee) => W.current.add(ee.case_id)), K && g({ caseId: K.case_id, name: K.customer_name || K.case_id });
        }
        w(_.cases), u(_.today), z(null), q.current = Date.now();
      } catch (_) {
        y || z(De(_));
      } finally {
        y ? U.current = !1 : H(!1);
      }
    }
  }, [x, g]);
  se(() => {
    L();
  }, [L]), se(() => {
    i > 0 && L(!0);
  }, [i, L]), se(() => {
    const y = () => {
      document.visibilityState !== "hidden" && Date.now() - q.current >= 3e3 && L(!0);
    };
    return window.addEventListener("focus", y), document.addEventListener("visibilitychange", y), () => {
      window.removeEventListener("focus", y), document.removeEventListener("visibilitychange", y);
    };
  }, [L]);
  const b = P(() => {
    const y = m ?? [], _ = y.filter((d) => d.stage !== "submitted"), K = y.length - _.length, ee = _.filter((d) => d.ready).length, G = _.filter((d) => (d.actionable_blocking ?? d.blocking_open) > 0 || (d.unclassified_docs ?? 0) > 0).length, re = _.reduce((d, O) => d + (O.actionable_blocking ?? O.blocking_open), 0), oe = _.filter((d) => d.requested > 0 && d.overdue === 0).length, Z = _.filter((d) => d.overdue > 0).length;
    return { live: _.length, submitted: K, ready: ee, actionNeeded: G, actionableItems: re, waitingCases: oe, overdueCases: Z };
  }, [m]), M = P(() => {
    const y = a.trim().toLowerCase();
    return (m ?? []).filter((_) => o === "submitted" && _.stage !== "submitted" || o !== "submitted" && o !== "all" && _.stage === "submitted" || o === "action" && (_.actionable_blocking ?? _.blocking_open) === 0 && (_.unclassified_docs ?? 0) === 0 || o === "waiting" && _.requested === 0 || o === "overdue" && _.overdue === 0 || o === "ready" && !_.ready ? !1 : y ? [_.customer_name, _.case_id, _.tax_id, _.product_code].some((K) => K == null ? void 0 : K.toLowerCase().includes(y)) : !0);
  }, [m, o, a]), j = () => c("Tạo hồ sơ mới cho khách hàng: ", "new_intake");
  return /* @__PURE__ */ n(_e, { children: [
    /* @__PURE__ */ e(
      Ft,
      {
        title: "Hoàn thiện hồ sơ Tín dụng SME",
        subtitle: "Quản lý danh mục hồ sơ ĐVKD, kiểm soát chứng từ bắt buộc, đối chiếu điều kiện sơ bộ và bàn giao Thẩm định",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(C, { onClick: () => L(), busy: $, children: [
            /* @__PURE__ */ e(Tt, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            C,
            {
              className: r ? "sme-toggle-on" : void 0,
              "aria-pressed": r,
              onClick: h,
              title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
              children: [
                /* @__PURE__ */ e(Se, { size: 14 }),
                " Trợ lý hồ sơ"
              ]
            }
          ),
          /* @__PURE__ */ n(C, { primary: !0, onClick: j, children: [
            /* @__PURE__ */ e(Je, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      T && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(_t, { title: "Không tải được danh sách hồ sơ", children: T }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(
          ue,
          {
            icon: /* @__PURE__ */ e(pt, { size: 18 }),
            label: "Hồ sơ đang thu thập",
            value: m ? b.live : "…",
            hint: m ? `${b.submitted} hồ sơ đã bàn giao` : void 0
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: b.ready ? "ok" : "muted",
            icon: /* @__PURE__ */ e(ze, { size: 18 }),
            label: "Đủ điều kiện trình",
            value: m ? b.ready : "…",
            hint: "Hoàn tất mục bắt buộc"
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: b.actionNeeded ? "warn" : "ok",
            icon: /* @__PURE__ */ e(Yt, { size: 18 }),
            label: "Cần ĐVKD xử lý",
            value: m ? b.actionNeeded : "…",
            hint: m ? `${b.actionableItems} mục chặn chưa yêu cầu` : void 0
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: b.overdueCases ? "danger" : b.waitingCases ? "info" : "muted",
            icon: /* @__PURE__ */ e(Zt, { size: 18 }),
            label: "Chờ khách hàng",
            value: f ? f.waiting : "…",
            hint: m ? b.overdueCases ? `${b.overdueCases} hồ sơ quá hạn cam kết` : `${b.waitingCases} hồ sơ đang theo dõi` : void 0
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
        ].map(([y, _]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": o === y,
            className: `sme-filter ${o === y ? "on" : ""}`,
            onClick: () => k(y),
            children: _
          },
          y
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ n("div", { className: "sme-filters", role: "tablist", "aria-label": "Chế độ hiển thị", children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": D === "cards",
                className: `sme-filter ${D === "cards" ? "on" : ""}`,
                onClick: () => R("cards"),
                children: "Thẻ hồ sơ"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": D === "table",
                className: `sme-filter ${D === "table" ? "on" : ""}`,
                onClick: () => R("table"),
                children: "Bảng danh mục"
              }
            )
          ] }),
          /* @__PURE__ */ n("label", { className: "sme-search", children: [
            /* @__PURE__ */ e(gt, { size: 14, className: "sme-muted" }),
            /* @__PURE__ */ e("input", { value: a, onChange: (y) => I(y.target.value), placeholder: "Tìm doanh nghiệp, MST, mã hồ sơ, sản phẩm" })
          ] })
        ] })
      ] }),
      m === null && !T && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((y) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, y)) }),
      m && m.length === 0 && /* @__PURE__ */ e(
        ve,
        {
          icon: /* @__PURE__ */ e(pt, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Khởi tạo hồ sơ với trợ lý trong chat: cung cấp thông tin khách hàng và đính kèm chứng từ.",
          action: /* @__PURE__ */ n(C, { primary: !0, onClick: j, children: [
            /* @__PURE__ */ e(Je, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      m && m.length > 0 && M.length === 0 && /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(gt, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      M.length > 0 && D === "cards" && /* @__PURE__ */ e("div", { className: "sme-cases", children: M.map((y) => /* @__PURE__ */ e(On, { r: y, onOpen: () => t(y.case_id) }, y.case_id)) }),
      M.length > 0 && D === "table" && /* @__PURE__ */ e(Hn, { rows: M, onOpen: t })
    ] })
  ] });
}
const Oe = [
  ["customer", "Cần xin KH", (t) => t.status === "open" && t.blocking && (t.owner_role ?? "CUSTOMER") === "CUSTOMER" && t.rule_status !== "UNDETERMINED_CONDITION"],
  ["rm", "ĐVKD nội bộ", (t) => t.status === "open" && t.blocking && t.owner_role === "RM_INTERNAL"],
  ["undetermined", "Chờ XĐ điều kiện", (t) => t.status === "open" && t.rule_status === "UNDETERMINED_CONDITION"],
  ["fail", "Không đạt rule", (t) => t.status === "open" && t.rule_status === "FAIL"],
  ["waiting", "Chờ khách", (t) => t.status === "requested"],
  ["done", "Đã đạt / Miễn", (t) => ["ok", "resolved", "waived"].includes(t.status)],
  ["all", "Tất cả áp dụng", () => !0]
];
function Un({ it: t, asOf: s, groupLabel: r, checked: i, selectable: h, skippedView: c, readOnly: g, onToggle: x, onSet: m, onOpenDoc: w }) {
  const [f, u] = N("none"), [T, z] = N(""), [$, H] = N(!1), [o, k] = N(!1), a = Kt[t.status], I = t.rule_status ? Sn[t.rule_status] : null, D = t.status === "open", V = t.status === "requested" && !!t.due_date && t.due_date < s, q = t.owner_role === "RM_INTERNAL", U = async (R, L) => {
    H(!0), await m(t.key, R, T, L) && (u("none"), z("")), H(!1);
  }, W = async () => {
    t.ask && await it(t.ask) && (k(!0), setTimeout(() => k(!1), 1500));
  };
  return /* @__PURE__ */ n(Ct, { children: [
    /* @__PURE__ */ n("tr", { children: [
      !g && !c && /* @__PURE__ */ e("td", { style: { width: 28 }, children: h && /* @__PURE__ */ e(
        "input",
        {
          type: "checkbox",
          className: "ss-check",
          checked: i,
          onChange: x,
          "aria-label": `Chọn ${t.title}`
        }
      ) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-strong", children: t.title }),
          /* @__PURE__ */ e(X, { t: q ? "accent" : "muted", children: q ? "ĐVKD nội bộ" : "Khách hàng" }),
          (t.crosscheck_refs ?? []).length > 0 && /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", title: "Rule đối chiếu chéo liên quan", children: t.crosscheck_refs.join(", ") })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 2 }, children: [
          r,
          t.condition_label ? ` · ĐK: ${t.condition_label}` : ""
        ] }),
        t.rule_label && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 2 }, children: [
          "Rule kiểm tra: ",
          t.rule_label
        ] }),
        t.reason && t.rule_status !== "MISSING_REQUIRED" && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: t.rule_status === "FAIL" ? "var(--danger)" : void 0 }, children: t.reason }),
        !c && (D || t.status === "requested") && t.ask && /* @__PURE__ */ n("div", { className: "sme-item-ask sme-between", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ e("b", { children: "Nội dung yêu cầu KH:" }),
            " ",
            t.ask
          ] }),
          /* @__PURE__ */ n(C, { onClick: W, title: "Sao chép nội dung yêu cầu", children: [
            o ? /* @__PURE__ */ e(Ue, { size: 12 }) : /* @__PURE__ */ e(Ge, { size: 12 }),
            " ",
            o ? "Đã chép" : "Chép"
          ] })
        ] }),
        !c && (D || t.status === "requested") && t.alternatives.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Chứng từ thay thế: ",
          t.alternatives.join("; ")
        ] })
      ] }),
      /* @__PURE__ */ e("td", { children: t.document_refs.length > 0 ? /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: t.document_refs.map((R) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: () => w(R), children: R }, R)) }) : /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: [
          I ? /* @__PURE__ */ e(X, { t: I.tone, children: I.label }) : /* @__PURE__ */ e(X, { t: a.tone, children: a.label }),
          !c && t.status === "requested" && /* @__PURE__ */ e(X, { t: "info", children: "Đã yêu cầu KH" }),
          !c && t.status === "waived" && /* @__PURE__ */ e(X, { t: "muted", children: "Xin miễn" }),
          V && /* @__PURE__ */ n(X, { t: "danger", children: [
            "Quá hạn (",
            me(t.due_date),
            ")"
          ] })
        ] }),
        t.status === "requested" && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Đã yêu cầu ",
          me(t.requested_at),
          t.due_date ? ` · hạn ${me(t.due_date)}` : ""
        ] }),
        t.status === "waived" && t.note && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Lý do: ",
          t.note
        ] })
      ] }),
      !g && !c && /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
        D && Me(t) && /* @__PURE__ */ n(C, { busy: $, onClick: () => u(f === "request" ? "none" : "request"), title: "Đánh dấu đã yêu cầu khách", children: [
          /* @__PURE__ */ e(Et, { size: 13 }),
          " Đã yêu cầu"
        ] }),
        D && t.kind !== "policy_precheck" && /* @__PURE__ */ n(
          C,
          {
            onClick: () => {
              u(f === "waive" ? "none" : "waive"), f === "waive" && z("");
            },
            title: "Xin miễn / bổ sung sau",
            children: [
              /* @__PURE__ */ e(tn, { size: 13 }),
              " Xin miễn"
            ]
          }
        ),
        (t.status === "waived" || t.status === "requested") && /* @__PURE__ */ n(C, { busy: $, onClick: () => U("open"), title: "Mở lại hạng mục", children: [
          /* @__PURE__ */ e(nn, { size: 13 }),
          " Mở lại"
        ] })
      ] }) })
    ] }),
    !g && !c && f === "request" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ e(
      ct,
      {
        label: "Hạn khách hàng bổ sung",
        confirmLabel: "Xác nhận đã yêu cầu",
        busy: $,
        onCancel: () => u("none"),
        onConfirm: (R) => U("requested", R)
      }
    ) }) }),
    !g && !c && f === "waive" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ n("div", { className: "sme-stack", style: { gap: 8 }, children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          className: "sme-textarea",
          value: T,
          onChange: (R) => z(R.target.value),
          placeholder: "Ghi rõ căn cứ xin miễn hoặc cam kết bổ sung sau (đi kèm phiếu bàn giao Thẩm định)"
        }
      ),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ e(C, { onClick: () => {
          u("none"), z("");
        }, children: "Huỷ" }),
        /* @__PURE__ */ e(C, { primary: !0, busy: $, disabled: !T.trim(), onClick: () => U("waived"), children: "Xác nhận xin miễn" })
      ] })
    ] }) }) })
  ] });
}
function Gn({
  items: t,
  asOf: s,
  catalog: r,
  groupFilter: i,
  onClearGroup: h,
  readOnly: c,
  onSet: g,
  onBatchRequested: x,
  onDraft: m,
  onOpenDoc: w
}) {
  var Z;
  const f = P(() => i ? t.filter((d) => d.group === i) : t, [t, i]), u = P(() => f.filter((d) => !Ae(d)), [f]), T = P(() => f.filter(Ae), [f]), z = Object.fromEntries(Oe.map(([d, , O]) => [d, u.filter(O).length])), $ = ((Z = Oe.find(([d]) => d !== "all" && z[d] > 0)) == null ? void 0 : Z[0]) ?? "all", [H, o] = N(null), [k, a] = N(!1), I = H ?? $, D = k ? T : u.filter(Oe.find(([d]) => d === I)[2]), [V, q] = N(/* @__PURE__ */ new Set()), [U, W] = N(!1), [R, L] = N(!1), b = P(
    () => k ? [] : D.filter((d) => Me(d) && (d.status === "open" || d.status === "requested")),
    [D, k]
  ), M = P(
    () => new Set(u.filter((d) => Me(d) && (d.status === "open" || d.status === "requested")).map((d) => d.key)),
    [u]
  ), j = P(() => [...V].filter((d) => M.has(d)), [V, M]), y = (d) => {
    q((O) => {
      const S = new Set(O);
      return S.has(d) ? S.delete(d) : S.add(d), S;
    });
  }, _ = b.length > 0 && b.every((d) => V.has(d.key)), K = () => {
    q((d) => {
      const O = new Set(d);
      return _ ? b.forEach((S) => O.delete(S.key)) : b.forEach((S) => O.add(S.key)), O;
    });
  }, ee = async (d) => {
    L(!0), await x(j, d) && (q(/* @__PURE__ */ new Set()), W(!1)), L(!1);
  }, G = (r == null ? void 0 : r.documents.groups) ?? {}, re = u.filter((d) => j.includes(d.key)), oe = re.length > 0 && re.every((d) => d.status === "requested");
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hạng mục", children: Oe.map(([d, O]) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": !k && I === d,
          className: `sme-filter ${!k && I === d ? "on" : ""}`,
          onClick: () => {
            a(!1), o(d);
          },
          children: [
            O,
            " (",
            z[d],
            ")"
          ]
        },
        d
      )) }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        T.length > 0 && /* @__PURE__ */ n(
          C,
          {
            className: k ? "sme-toggle-on" : void 0,
            onClick: () => a((d) => !d),
            title: "Các mục SKIPPED được ẩn mặc định; bấm để xem lý do không áp dụng",
            children: [
              k ? /* @__PURE__ */ e(Jt, { size: 13 }) : /* @__PURE__ */ e(It, { size: 13 }),
              k ? "Quay lại mục áp dụng" : `Mục không áp dụng (${T.length})`
            ]
          }
        ),
        i && /* @__PURE__ */ n(C, { onClick: h, title: "Bỏ lọc nhóm", children: [
          G[i] ?? i,
          " ",
          /* @__PURE__ */ e(en, { size: 12 })
        ] }),
        !c && !k && b.length > 0 && /* @__PURE__ */ e(C, { onClick: K, children: _ ? "Bỏ chọn" : `Chọn KH (${b.length})` })
      ] })
    ] }),
    k && /* @__PURE__ */ n(tt, { t: "info", children: [
      "Đang hiển thị ",
      /* @__PURE__ */ n("b", { children: [
        T.length,
        " hạng mục SKIPPED"
      ] }),
      " (mặc định ẩn vì điều kiện Lớp 1 không kích hoạt cho bộ hồ sơ này)."
    ] }),
    !c && !k && j.length > 0 && /* @__PURE__ */ n("div", { className: "ss-bulk", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
        /* @__PURE__ */ n("span", { className: "sme-strong sme-small", children: [
          "Đã chọn ",
          j.length,
          " hạng mục xin khách hàng"
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e(Rt, { onPick: (d) => m(j, d, oe) }),
          /* @__PURE__ */ n(C, { onClick: () => W((d) => !d), children: [
            /* @__PURE__ */ e(Et, { size: 13 }),
            " Đã yêu cầu"
          ] }),
          /* @__PURE__ */ e(C, { onClick: () => {
            q(/* @__PURE__ */ new Set()), W(!1);
          }, children: "Bỏ chọn" })
        ] })
      ] }),
      U && /* @__PURE__ */ e(
        ct,
        {
          label: `Đặt hạn cho ${j.length} hạng mục`,
          confirmLabel: "Xác nhận đã yêu cầu",
          busy: R,
          onCancel: () => W(!1),
          onConfirm: ee
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: D.length === 0 ? /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e($t, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        !c && !k && /* @__PURE__ */ e("th", { "aria-label": "Chọn", style: { width: 28 } }),
        /* @__PURE__ */ e("th", { children: "Hạng mục, Điều kiện (Lớp 1) & Rule (Lớp 2)" }),
        /* @__PURE__ */ e("th", { children: "Chứng từ" }),
        /* @__PURE__ */ e("th", { children: "Kết quả" }),
        !c && !k && /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: D.map((d) => /* @__PURE__ */ e(
        Un,
        {
          it: d,
          asOf: s,
          groupLabel: G[d.group] ?? d.group,
          selectable: Me(d) && (d.status === "open" || d.status === "requested"),
          checked: V.has(d.key),
          skippedView: k,
          readOnly: c,
          onToggle: () => y(d.key),
          onSet: g,
          onOpenDoc: w
        },
        d.key
      )) })
    ] }) })
  ] });
}
const Xn = {
  customer: "Pháp lý & Định danh (Lớp 1)",
  request: "Phương án đề xuất vay",
  facts: "Điều kiện kích hoạt & Tài chính / TSBĐ"
}, jn = { PASS: "ok", INCOMPLETE: "warn", FAIL: "danger" }, Vn = {
  met: { label: "Đạt", t: "ok" },
  not_met: { label: "Không đạt", t: "danger" },
  missing: { label: "Thiếu dữ liệu", t: "warn" },
  na: { label: "Không áp dụng", t: "muted" }
};
function Wn({
  detail: t,
  catalog: s,
  pendingDraftsCount: r,
  purposeWarn: i,
  readOnly: h,
  goDrafts: c,
  onAction: g,
  onChat: x
}) {
  var z, $, H, o, k;
  const { case: m, overview: w } = t, f = [...new Set(w.profile.map((a) => a.section))], u = w.policy_checks ?? [], T = u.some((a) => a.status === "not_met") || i && i.status === "open";
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    m.submitted && /* @__PURE__ */ n(tt, { t: "info", children: [
      "Hồ sơ đã bàn giao Thẩm định lúc ",
      /* @__PURE__ */ e("b", { children: qe(m.submitted.at) }),
      " bởi ",
      Mt(m.submitted.by),
      m.submitted.note ? ` · Ghi chú: ${m.submitted.note}` : "",
      ".",
      ((z = m.submitted.handover) == null ? void 0 : z.status) === "transferred" ? ` Đã đồng bộ sang app Thẩm định SME (${m.submitted.handover.files_copied ?? 0} file đính kèm).` : ($ = m.submitted.handover) != null && $.message ? ` ${m.submitted.handover.message}` : ""
    ] }),
    !m.submitted && r > 0 && /* @__PURE__ */ n(tt, { t: "warn", children: [
      "Có ",
      /* @__PURE__ */ n("b", { children: [
        r,
        " thư nháp"
      ] }),
      " yêu cầu bổ sung đang chờ ĐVKD gửi khách hàng. Xem tại tab",
      " ",
      /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: c, children: "Thư yêu cầu KH" }),
      "."
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Thông tin khách hàng & Phương án đề xuất" }),
        !h && /* @__PURE__ */ n(C, { onClick: () => x(`Cập nhật thông tin hồ sơ ${m.case_id}: `), children: [
          /* @__PURE__ */ e(Se, { size: 13 }),
          " Cập nhật qua trợ lý"
        ] })
      ] }),
      w.profile.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Chưa có dữ liệu định danh hoặc phương án vay. Trao đổi với trợ lý để ghi nhận hoặc trích xuất từ chứng từ." }) : /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 12 }, children: f.map((a) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 6 }, children: Xn[a] ?? a }),
        /* @__PURE__ */ e("dl", { className: "ss-kv", children: w.profile.filter((I) => I.section === a).map((I) => /* @__PURE__ */ n(Ct, { children: [
          /* @__PURE__ */ e("dt", { children: I.label }),
          /* @__PURE__ */ e("dd", { children: He(I.path, I.value, s) })
        ] }, I.path)) })
      ] }, a)) })
    ] }),
    (u.length > 0 || i) && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ n("h3", { className: "sme-h3", children: [
          "Điều kiện chính sách sơ bộ ",
          ((H = m.request) == null ? void 0 : H.product_code) ?? ""
        ] }),
        T ? /* @__PURE__ */ e(X, { t: "danger", children: "Có tiêu chí chưa đạt" }) : /* @__PURE__ */ e(X, { t: "ok", children: "Đạt điều kiện sơ bộ" })
      ] }),
      i && i.status === "open" && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8, color: "var(--danger)" }, children: [
        i.title,
        ": ",
        i.reason
      ] }),
      u.length > 0 && /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Điều kiện" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: u.map((a) => {
          const I = Vn[a.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              a.label,
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: a.clause })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-num", children: [
              a.op,
              " ",
              Xe(a.fact, a.threshold)
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-num", children: Xe(a.fact, a.actual) }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: I.t, children: I.label }) })
          ] }, a.id);
        }) })
      ] }),
      T && !h && /* @__PURE__ */ e("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ n(C, { onClick: () => x(`Hồ sơ ${m.case_id} đang vướng điều kiện chính sách sơ bộ. Gợi ý các phương án cơ cấu lại đề xuất.`), children: [
        /* @__PURE__ */ e(Se, { size: 13 }),
        " Đề xuất cơ cấu lại qua trợ lý"
      ] }) })
    ] }),
    (((k = (o = w.crosschecks) == null ? void 0 : o.rules) == null ? void 0 : k.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "7 Quy tắc đối chiếu chéo trọng yếu" }),
        /* @__PURE__ */ e(X, { t: jn[w.crosschecks.overall_status], children: w.crosschecks.overall_status })
      ] }),
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 48 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Nội dung đối chiếu" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: w.crosschecks.rules.filter((a) => a.status !== "SKIPPED").map((a) => {
          const I = $n[a.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: a.id }),
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: a.title }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: a.detail })
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-mono sme-small", children: a.document_refs.length ? a.document_refs.join(", ") : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: I.tone, children: I.label }) })
          ] }, a.id);
        }) })
      ] })
    ] }),
    w.actions.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: [
        "Hành động đề xuất (",
        w.actions.length,
        ")"
      ] }),
      w.actions.map((a) => /* @__PURE__ */ n("div", { className: `sme-finding ${pe(a.tone)}`, children: [
        /* @__PURE__ */ e("div", { className: "bar" }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-finding-topic", children: a.title }),
            a.detail.length > 0 && /* @__PURE__ */ e("div", { className: "sme-finding-text sme-muted", children: a.detail.slice(0, 4).join(" · ") })
          ] }),
          a.cta !== "none" && /* @__PURE__ */ e(C, { onClick: () => g(a), children: a.cta === "draft" ? /* @__PURE__ */ n(_e, { children: [
            /* @__PURE__ */ e(st, { size: 13 }),
            " Soạn thư"
          ] }) : a.cta === "submit" ? /* @__PURE__ */ n(_e, { children: [
            /* @__PURE__ */ e(ze, { size: 13 }),
            " Bàn giao"
          ] }) : /* @__PURE__ */ n(_e, { children: [
            /* @__PURE__ */ e(Se, { size: 13 }),
            " Trợ lý"
          ] }) })
        ] })
      ] }, a.id))
    ] })
  ] });
}
function Qn(t, s, r) {
  var g;
  if (!t.type) return { label: "Chưa phân loại", t: "warn" };
  if (s.some(
    (x) => x.rule_status === "FAIL" && x.document_refs.includes(t.id) && (x.fail_reasons ?? []).some((m) => /hết hiệu lực/i.test(m))
  )) return { label: "Hết hiệu lực", t: "danger" };
  const h = s.find((x) => x.key === `date:${t.type}`);
  if (h && (h.status === "open" || h.status === "requested")) return { label: "Thiếu ngày lập", t: "warn" };
  const c = (g = r == null ? void 0 : r.documents.types[t.type]) == null ? void 0 : g.validity_months;
  return c ? { label: `Hiệu lực ${c} tháng`, t: "ok" } : { label: "Không giới hạn", t: "muted" };
}
function Yn({ docs: t, items: s, profile: r, catalog: i, focusDocId: h, readOnly: c, onDownload: g, onRemove: x, onExtractDoc: m, onUpload: w }) {
  const f = (i == null ? void 0 : i.documents.types) ?? {}, u = new Set(r.map((o) => o.path)), [T, z] = N(null), [$, H] = N(null);
  return se(() => {
    h && requestAnimationFrame(() => {
      var o;
      return (o = document.getElementById(`doc-${h}`)) == null ? void 0 : o.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [h]), t.length === 0 ? /* @__PURE__ */ e(
    ve,
    {
      icon: /* @__PURE__ */ e(sn, { size: 30 }),
      title: "Chưa có chứng từ nào",
      hint: "Đính kèm PDF, ảnh chụp, Word hoặc Excel trong chat với trợ lý để phân loại và trích xuất thông tin.",
      action: c ? void 0 : /* @__PURE__ */ e(C, { primary: !0, onClick: w, children: "Gửi chứng từ cho trợ lý" })
    }
  ) : /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Tổng cộng ",
        t.length,
        " chứng từ đã tiếp nhận vào hồ sơ."
      ] }),
      !c && /* @__PURE__ */ e(C, { onClick: w, children: "Gửi bổ sung qua trợ lý" })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
        /* @__PURE__ */ e("th", { children: "Loại chứng từ & Tệp" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Ngày lập" }),
        /* @__PURE__ */ e("th", { children: "Hiệu lực" }),
        /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((o) => {
        const k = o.type ? f[o.type] : void 0, a = Qn(o, s, i), I = new Set(o.not_stated ?? []), D = ((k == null ? void 0 : k.extract) ?? []).filter((q) => !u.has(q) && !I.has(q)), V = $ === o.id;
        return /* @__PURE__ */ n("tr", { id: `doc-${o.id}`, className: h === o.id ? "focus" : void 0, children: [
          /* @__PURE__ */ e("td", { className: "sme-mono", children: o.id }),
          /* @__PURE__ */ n("td", { children: [
            /* @__PURE__ */ e("div", { className: "sme-strong", children: (k == null ? void 0 : k.label) ?? (o.type || o.name) }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              o.name,
              o.size ? ` · ${Math.max(1, Math.round(o.size / 1024))} KB` : ""
            ] }),
            o.summary && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3 }, children: o.summary }),
            (!o.type || D.length > 0) && !c && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: "var(--warn)" }, children: o.type ? `Còn ${D.length} chỉ tiêu chưa trích xuất.` : "Chứng từ chưa được phân loại." })
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: o.issued_date ? me(o.issued_date) : "—" }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: a.t, children: a.label }) }),
          /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
            o.file && /* @__PURE__ */ n(C, { busy: T === `dl:${o.id}`, onClick: async () => {
              z(`dl:${o.id}`), await g(o.id), z(null);
            }, children: [
              /\.(pdf|png|jpe?g|webp|txt)$/i.test(o.name) ? /* @__PURE__ */ e(It, { size: 13 }) : /* @__PURE__ */ e(rn, { size: 13 }),
              " Xem / Tải"
            ] }),
            (!o.type || D.length > 0) && !c && /* @__PURE__ */ e(C, { onClick: () => m(o.id), children: "Đọc lại" }),
            !c && !V && /* @__PURE__ */ e(C, { onClick: () => H(o.id), title: "Gỡ chứng từ gửi nhầm", children: /* @__PURE__ */ e(an, { size: 13 }) }),
            !c && V && /* @__PURE__ */ n(_e, { children: [
              /* @__PURE__ */ e(C, { onClick: () => H(null), children: "Huỷ" }),
              /* @__PURE__ */ e(C, { primary: !0, busy: T === `rm:${o.id}`, onClick: async () => {
                z(`rm:${o.id}`), await x(o.id) && H(null), z(null);
              }, children: "Xác nhận gỡ" })
            ] })
          ] }) })
        ] }, o.id);
      }) })
    ] }) })
  ] });
}
function Zn({ d: t, items: s, readOnly: r, onSent: i }) {
  const [h, c] = N(!1), [g, x] = N(!1), m = async () => {
    await it(t.subject ? `${t.subject}

${t.body}` : t.body) && (c(!0), setTimeout(() => c(!1), 1500));
  };
  return /* @__PURE__ */ n("div", { className: `sme-card sme-review ${pe(t.status === "sent" ? "ok" : "warn")}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("span", { className: "sme-row", children: [
        /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: t.id }),
        /* @__PURE__ */ e(X, { t: "accent", children: ot[t.channel] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: qe(t.created_at) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(X, { t: t.status === "sent" ? "ok" : "warn", children: t.status === "sent" ? `Đã gửi ${me(t.sent_at)}` : "Chờ ĐVKD gửi" }),
        /* @__PURE__ */ n(C, { onClick: m, children: [
          h ? /* @__PURE__ */ e(Ue, { size: 13 }) : /* @__PURE__ */ e(Ge, { size: 13 }),
          " ",
          h ? "Đã chép" : "Sao chép"
        ] })
      ] })
    ] }),
    t.subject && /* @__PURE__ */ e("div", { className: "sme-strong", style: { marginTop: 8 }, children: t.subject }),
    /* @__PURE__ */ e("pre", { className: "sme-pre", children: t.body }),
    t.requirement_keys.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: [
      "Hạng mục đính kèm: ",
      t.requirement_keys.map((w) => {
        var f;
        return ((f = s.get(w)) == null ? void 0 : f.title) ?? w;
      }).join("; ")
    ] }),
    t.status === "draft" && !r && /* @__PURE__ */ e(
      ct,
      {
        label: "Hạn cam kết KH gửi",
        confirmLabel: "Tôi đã gửi",
        busy: g,
        onConfirm: async (w) => {
          x(!0), await i(t.id, w), x(!1);
        }
      }
    )
  ] });
}
function Jn({ drafts: t, items: s, readOnly: r, hasOpenItems: i, onSent: h, onCompose: c }) {
  const [g, x] = N("all"), m = new Map(s.map((u) => [u.key, u])), w = t.filter((u) => u.status === "draft").length, f = [...t].reverse().filter((u) => g === "all" || u.status === g);
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["all", `Tất cả (${t.length})`], ["draft", `Chờ gửi (${w})`], ["sent", `Đã gửi (${t.length - w})`]].map(([u, T]) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": g === u,
          className: `sme-filter ${g === u ? "on" : ""}`,
          onClick: () => x(u),
          children: T
        },
        u
      )) }),
      !r && i && /* @__PURE__ */ e(Rt, { onPick: c })
    ] }),
    f.length === 0 && /* @__PURE__ */ e(
      ve,
      {
        icon: /* @__PURE__ */ e(st, { size: 28 }),
        title: "Chưa có thư yêu cầu khách hàng",
        hint: i ? "Chọn kênh ở trên hoặc tích chọn hạng mục ở tab Danh mục kiểm tra để trợ lý soạn nháp." : "Không còn hạng mục thiếu cần yêu cầu khách hàng."
      }
    ),
    f.map((u) => /* @__PURE__ */ e(Zn, { d: u, items: m, readOnly: r, onSent: h }, u.id))
  ] });
}
function es({ audit: t }) {
  if (t.length === 0) return /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(ln, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (r) => r === "case_submitted" ? "ok" : r === "case_reopened" || r === "document_remove" ? "warn" : r === "requirement_set" ? "accent" : "muted";
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t].reverse().map((r, i) => {
    const h = zn(r);
    return /* @__PURE__ */ n("div", { className: `sme-tl-item ${pe(s(r.action))}`, children: [
      /* @__PURE__ */ n("div", { className: "sme-between", children: [
        /* @__PURE__ */ n("span", { className: "sme-strong", style: { fontSize: 13 }, children: [
          Tn[r.action] ?? r.action,
          h ? ` · ${h}` : ""
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: qe(r.ts) })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: Mt(String(r.actor ?? r.agent ?? r.author ?? "")) })
    ] }, i);
  }) }) });
}
function Ne({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function ts({
  caseId: t,
  catalog: s,
  coachOpen: r,
  syncTick: i,
  onBack: h,
  onToggleCoach: c,
  onAskCoach: g,
  onCaseMetaChange: x,
  onRegisterQuickDraft: m
}) {
  var ht, ut;
  const w = nt(), [f, u] = N(null), [T, z] = N(null), [$, H] = N(!1), [o, k] = N("overview"), [a, I] = N(null), [D, V] = N(null), [q, U] = N(null), [W, R] = N(!1), [L, b] = N(null), [M, j] = N(!1), [y, _] = N(!1), K = ie(0), ee = ie(!1), G = ne(async (l = !1) => {
    if (!(l && ee.current)) {
      l ? ee.current = !0 : H(!0);
      try {
        u(await w.get(`${Ke}/cases/${t}`)), z(null), K.current = Date.now();
      } catch (A) {
        l || z(De(A));
      } finally {
        l ? ee.current = !1 : H(!1);
      }
    }
  }, [w, t]);
  se(() => {
    G();
  }, [G]), se(() => {
    i > 0 && G(!0);
  }, [i, G]), se(() => {
    const l = () => {
      document.visibilityState !== "hidden" && Date.now() - K.current >= 3e3 && G(!0);
    };
    return window.addEventListener("focus", l), document.addEventListener("visibilitychange", l), () => {
      window.removeEventListener("focus", l), document.removeEventListener("visibilitychange", l);
    };
  }, [G]);
  const re = async (l, A) => {
    try {
      return await w.post(`${Ke}/cases/${t}${l}`, A), !0;
    } catch (te) {
      return z(De(te)), !1;
    }
  }, oe = async (l, A, te = "", fe) => {
    const ke = { key: l, status: A, note: te };
    fe !== void 0 && (ke.due_date = fe);
    const be = await re("/requirements", ke);
    return be && await G(), be;
  }, Z = async (l, A) => {
    const te = await re("/requirements", { keys: l, status: "requested", note: "", due_date: A });
    return te && await G(), te;
  }, d = async (l) => {
    const A = await re(`/documents/${l}/remove`, {});
    return A && await G(), A;
  }, O = async (l) => {
    try {
      const A = await w.get(`${Ke}/cases/${t}/documents/${l}/file`), te = atob(A.content_b64), fe = new Uint8Array(te.length);
      for (let de = 0; de < te.length; de++) fe[de] = te.charCodeAt(de);
      const ke = new Blob([fe], { type: A.mime || "application/octet-stream" }), be = URL.createObjectURL(ke);
      if (A.mime.startsWith("image/") || A.mime === "application/pdf" || A.mime.startsWith("text/")) {
        if (!window.open(be, "_blank", "noopener")) {
          const Qe = document.createElement("a");
          Qe.href = be, Qe.download = A.name, Qe.click();
        }
      } else {
        const de = document.createElement("a");
        de.href = be, de.download = A.name, de.click();
      }
      setTimeout(() => URL.revokeObjectURL(be), 6e4);
    } catch (A) {
      z(De(A));
    }
  }, S = f == null ? void 0 : f.case, p = f == null ? void 0 : f.overview, le = !!(S != null && S.submitted), J = (S == null ? void 0 : S.customer) ?? {}, Q = (S == null ? void 0 : S.request) ?? {}, $e = J.name ? String(J.name) : void 0, Re = $e || t, ge = (l) => g(l || `Hồ sơ ${t}: `, "prefill"), xe = (l, A = "email", te = !1) => {
    const fe = ((p == null ? void 0 : p.items) ?? []).filter((ke) => l.includes(ke.key));
    g(Dn(t, fe, A, te), "prefill");
  }, je = (l) => {
    l.cta === "draft" ? xe(l.keys, "email", l.kind === "remind" || l.kind === "follow_up") : l.cta === "submit" ? (U(""), b(null)) : l.cta === "chat" && ge(l.prompt);
  }, Te = async () => {
    f && await it(Kn(f, s)) && (_(!0), setTimeout(() => _(!1), 1800));
  }, ae = P(() => ((p == null ? void 0 : p.items) ?? []).filter((l) => !Ae(l)), [p]), v = P(() => ae.filter((l) => l.blocking), [ae]), E = P(
    () => v.filter((l) => ["ok", "resolved", "waived"].includes(l.status)).length,
    [v]
  ), F = ((ht = p == null ? void 0 : p.readiness.actionable_blocking) == null ? void 0 : ht.length) ?? v.filter((l) => l.status === "open").length, B = ((ut = p == null ? void 0 : p.readiness.waiting_blocking) == null ? void 0 : ut.length) ?? v.filter((l) => l.status === "requested").length, Y = P(() => ae.filter((l) => l.status === "open" || l.status === "requested").length, [ae]), Ie = P(() => ((f == null ? void 0 : f.drafts) ?? []).filter((l) => l.status === "draft"), [f]), he = P(() => ae.filter((l) => l.status === "waived"), [ae]), ce = (p == null ? void 0 : p.policy_checks) ?? [], Le = P(() => ce.filter((l) => l.status === "not_met"), [ce]), Bt = P(() => ((p == null ? void 0 : p.items) ?? []).find((l) => l.key === "policy:purpose"), [p]), Ve = P(
    () => ae.filter((l) => l.rule_status === "FAIL" && l.status === "open").length,
    [ae]
  ), We = P(() => ((S == null ? void 0 : S.documents) ?? []).filter((l) => !l.type).length, [S]), ye = P(
    () => ae.filter((l) => l.status === "open" && l.blocking || l.status === "requested" && l.due_date && l.due_date < ((p == null ? void 0 : p.as_of) ?? "")),
    [ae, p]
  ), Ee = P(
    () => ae.filter((l) => Me(l) && (l.status === "open" || l.status === "requested")).map((l) => l.key),
    [ae]
  );
  se(() => {
    x({ customerName: $e, readOnly: le, hasOpenItems: Ee.length > 0 });
  }, [$e, le, Ee.length, x]);
  const dt = ie(() => {
  });
  dt.current = () => xe(Ee, "email", !1), se(() => (m(() => dt.current()), () => m(null)), [m]);
  const mt = P(() => new Map(((p == null ? void 0 : p.profile) ?? []).map((l) => [l.path, l.value])), [p]), Pt = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Danh mục kiểm tra", count: Y || void 0 },
    { key: "docs", label: "Chứng từ", count: (S == null ? void 0 : S.documents.length) || void 0 },
    { key: "drafts", label: "Thư yêu cầu KH", count: Ie.length || (f == null ? void 0 : f.drafts.length) || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: h, children: [
          /* @__PURE__ */ e(on, { size: 14 }),
          " Danh mục hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: Re }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          p && /* @__PURE__ */ e(kt, { stage: p.stage }),
          (p == null ? void 0 : p.checklist_overall) && /* @__PURE__ */ n(X, { t: p.checklist_overall === "COMPLETE" ? "ok" : "warn", children: [
            "Checklist ",
            p.checklist_overall
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          S && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            S.flow
          ] }),
          J.tax_id && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "MST ",
            String(J.tax_id)
          ] }),
          J.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(J.industry_code)
          ] }),
          Q.product_code && /* @__PURE__ */ e("span", { className: "sme-chip", children: String(Q.product_code) }),
          Q.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: rt[Q.purpose] ?? Q.purpose }),
          S && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Khởi tạo ",
            qe(S.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(C, { onClick: () => G(), busy: $, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(Tt, { size: 14 }) }),
        /* @__PURE__ */ n(
          C,
          {
            className: r ? "sme-toggle-on" : void 0,
            "aria-pressed": r,
            onClick: c,
            title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
            children: [
              /* @__PURE__ */ e(Se, { size: 14 }),
              " Trợ lý hồ sơ"
            ]
          }
        ),
        le ? /* @__PURE__ */ n(C, { onClick: () => b(""), children: [
          /* @__PURE__ */ e(ft, { size: 14 }),
          " Mở lại hồ sơ"
        ] }) : /* @__PURE__ */ n(C, { primary: !0, onClick: () => {
          U(""), b(null);
        }, children: [
          /* @__PURE__ */ e(ze, { size: 14 }),
          " ",
          p != null && p.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
        ] })
      ] })
    ] }),
    T && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(_t, { title: "Có lỗi khi làm việc với hồ sơ", children: T }) }),
    !f && !T && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" })
    ] }),
    f && S && p && /* @__PURE__ */ n(_e, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          ue,
          {
            icon: /* @__PURE__ */ e(cn, { size: 18 }),
            label: "Số tiền đề nghị",
            value: Q.amount ? zt(Q.amount).replace(" đ", "") : "—",
            hint: [Q.term_months ? `${Q.term_months} tháng` : null, Q.product_code, "VND"].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: p.readiness.ready ? "ok" : F > 0 ? "danger" : "warn",
            icon: /* @__PURE__ */ e(dn, { size: 18 }),
            label: "Master Checklist (A-I)",
            value: `${E} / ${v.length}`,
            hint: p.checklist_counts ? `PASS ${p.checklist_counts.PASS} · MISSING ${p.checklist_counts.MISSING_REQUIRED} · FAIL ${p.checklist_counts.FAIL}` : `${F} cần bổ sung · ${B} chờ KH`
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: Ve ? "danger" : We ? "warn" : S.documents.length ? "ok" : "muted",
            icon: /* @__PURE__ */ e(St, { size: 18 }),
            label: "Chứng từ lưu trữ",
            value: S.documents.length,
            hint: Ve ? `${Ve} không đạt rule` : We ? `${We} chưa phân loại` : "Đã đối chiếu danh mục"
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: ce.length === 0 ? "muted" : Le.length > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(mn, { size: 18 }),
            label: "Điều kiện chính sách",
            value: ce.length === 0 ? "—" : Le.length > 0 ? `${Le.length} chưa đạt` : "Đạt sơ bộ",
            hint: ce.length > 0 ? `${ce.length} tiêu chí · ${Q.product_code ?? ""}` : "Chưa chọn mã sản phẩm"
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(
        An,
        {
          groups: p.groups,
          activeGroup: a,
          onSelectGroup: (l) => {
            I(l), k("checklist");
          }
        }
      ) }),
      L !== null && S.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-warn", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Mở lại hồ sơ đã bàn giao" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: "Chỉ mở lại khi bộ phận Thẩm định yêu cầu bổ sung chứng từ mới. Ghi rõ lý do để lưu nhật ký kiểm toán." }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: L,
            onChange: (l) => b(l.target.value),
            placeholder: "Ví dụ: Thẩm định yêu cầu bổ sung BCTC quý gần nhất"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(C, { onClick: () => b(null), children: "Huỷ" }),
          /* @__PURE__ */ n(C, { primary: !0, busy: M, disabled: !L.trim(), onClick: async () => {
            j(!0), await re("/reopen", { note: L }) && (b(null), await G()), j(!1);
          }, children: [
            /* @__PURE__ */ e(ft, { size: 14 }),
            " Xác nhận mở lại"
          ] })
        ] })
      ] }),
      q !== null && !S.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: "Xác nhận bàn giao hồ sơ sang Thẩm định (LOS)" }),
          /* @__PURE__ */ n(C, { onClick: Te, children: [
            y ? /* @__PURE__ */ e(Ue, { size: 13 }) : /* @__PURE__ */ e(Ge, { size: 13 }),
            " ",
            y ? "Đã chép phiếu" : "Sao chép phiếu bàn giao LOS"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { margin: "6px 0 8px" }, children: [
          "Hạng mục áp dụng: ",
          /* @__PURE__ */ n("b", { children: [
            E,
            "/",
            v.length
          ] }),
          " · Chứng từ: ",
          /* @__PURE__ */ e("b", { children: S.documents.length }),
          " · Xin miễn: ",
          /* @__PURE__ */ e("b", { children: he.length }),
          " · Cảnh báo sơ bộ: ",
          /* @__PURE__ */ e("b", { children: Le.length }),
          ". Hệ thống sẽ đồng bộ hồ sơ và chứng từ sang ứng dụng ",
          /* @__PURE__ */ e("b", { children: "Thẩm định SME" }),
          " qua Handover Adapter.",
          p.readiness.ready ? " Ghi chú bàn giao không bắt buộc." : ` Còn ${p.readiness.blocking_open.length} mục chặn nên bắt buộc ghi giải trình.`
        ] }),
        he.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ e("b", { children: "Mục xin miễn:" }),
          " ",
          he.map((l) => `${l.title} (${l.note})`).join("; ")
        ] }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: q,
            onChange: (l) => U(l.target.value),
            placeholder: p.readiness.ready ? "Ghi chú bàn giao (tuỳ chọn)" : "Ghi rõ giải trình khi trình dù còn hạng mục chặn (bắt buộc)"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(C, { onClick: () => U(null), children: "Huỷ" }),
          /* @__PURE__ */ n(
            C,
            {
              primary: !0,
              busy: W,
              disabled: !p.readiness.ready && !q.trim(),
              onClick: async () => {
                R(!0), await re("/submitted", { note: q }) && (U(null), await G()), R(!1);
              },
              children: [
                /* @__PURE__ */ e(ze, { size: 14 }),
                " Xác nhận đã bàn giao"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Pt.map((l) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": o === l.key,
              className: `sme-tab ${o === l.key ? "on" : ""}`,
              onClick: () => k(l.key),
              children: [
                l.label,
                l.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: l.count })
              ]
            },
            l.key
          )) }),
          o === "overview" && /* @__PURE__ */ e(
            Wn,
            {
              detail: f,
              catalog: s,
              pendingDraftsCount: Ie.length,
              purposeWarn: Bt,
              readOnly: le,
              goDrafts: () => k("drafts"),
              onAction: je,
              onChat: ge
            }
          ),
          o === "checklist" && /* @__PURE__ */ e(
            Gn,
            {
              items: p.items,
              asOf: p.as_of,
              catalog: s,
              groupFilter: a,
              onClearGroup: () => I(null),
              readOnly: le,
              onSet: oe,
              onBatchRequested: Z,
              onDraft: xe,
              onOpenDoc: (l) => {
                V(l), k("docs");
              }
            }
          ),
          o === "docs" && /* @__PURE__ */ e(
            Yn,
            {
              docs: S.documents,
              items: p.items,
              profile: p.profile,
              catalog: s,
              focusDocId: D,
              readOnly: le,
              onDownload: O,
              onRemove: d,
              onExtractDoc: (l) => g(`Đọc lại và cập nhật thông tin từ chứng từ ${l} của hồ sơ ${t}.`, "prefill"),
              onUpload: () => g("", "attach")
            }
          ),
          o === "drafts" && /* @__PURE__ */ e(
            Jn,
            {
              drafts: f.drafts,
              items: p.items,
              readOnly: le,
              hasOpenItems: Ee.length > 0,
              onCompose: (l) => xe(Ee, l, !1),
              onSent: async (l, A) => {
                const te = await re(`/drafts/${l}/sent`, { due_date: A });
                return te && await G(), te;
              }
            }
          ),
          o === "audit" && /* @__PURE__ */ e(es, { audit: f.audit })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Hạng mục cần xử lý" }),
              /* @__PURE__ */ e(X, { t: ye.length ? "warn" : "ok", children: ye.length })
            ] }),
            ye.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn hạng mục chặn mở." }),
            ye.slice(0, 6).map((l) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "sme-todo",
                onClick: () => {
                  I(l.group), k("checklist");
                },
                children: [
                  /* @__PURE__ */ e(X, { t: l.status === "requested" ? "danger" : "warn", children: l.status === "requested" ? "Quá hạn" : "Thiếu" }),
                  /* @__PURE__ */ e("span", { className: "sme-todo-text", children: l.title })
                ]
              },
              l.key
            )),
            ye.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => k("checklist"), children: [
              "Xem thêm ",
              ye.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Định danh & Tóm tắt" }),
            /* @__PURE__ */ e(Ne, { label: "Mã số thuế", children: String(J.tax_id ?? "—") }),
            /* @__PURE__ */ e(Ne, { label: "CIF", children: String(J.cif ?? "—") }),
            /* @__PURE__ */ e(Ne, { label: "Người đại diện", children: String(J.legal_rep ?? "—") }),
            /* @__PURE__ */ e(Ne, { label: "Số năm hoạt động", children: He("facts.years_in_operation", mt.get("facts.years_in_operation") ?? J.years_in_operation, s) }),
            /* @__PURE__ */ e(Ne, { label: "Vốn điều lệ", children: He("customer.charter_capital", J.charter_capital, s) }),
            /* @__PURE__ */ e(Ne, { label: "Doanh thu gần nhất", children: He("facts.revenue_last_year", mt.get("facts.revenue_last_year"), s) }),
            Q.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(Q.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 8 }, children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Bàn giao LOS" }),
              /* @__PURE__ */ e(kt, { stage: p.stage })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: he.length > 0 ? `${he.length} mục xin miễn kèm giải trình.` : "Chưa có mục xin miễn." }),
            /* @__PURE__ */ n(C, { onClick: Te, children: [
              y ? /* @__PURE__ */ e(Ue, { size: 13 }) : /* @__PURE__ */ e(Ge, { size: 13 }),
              " ",
              y ? "Đã chép phiếu" : "Chép phiếu bàn giao"
            ] }),
            !le && /* @__PURE__ */ n(C, { primary: !0, onClick: () => {
              U(""), b(null);
            }, children: [
              /* @__PURE__ */ e(ze, { size: 13 }),
              " ",
              p.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
            ] })
          ] }),
          f.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(hn, { size: 13 }),
            " Hoạt động gần nhất ",
            qe(f.audit[f.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
_n();
Bn();
const wt = "sme-sales:coach-open", Nt = "sme-sales:coach-width";
function os() {
  const t = nt(), [s, r] = N(null), [i, h] = N(null), [c, g] = N(() => fn(wt)), [x, m] = N(() => vn(Nt)), [w, f] = N(null), [u, T] = N(null), [z, $] = N(null), H = ie(0), o = ie(null), { syncTick: k } = yn(c, 4e3);
  se(() => {
    t.get(`${Ke}/catalog`).then(h).catch(() => h(null));
  }, [t]);
  const a = ne((b) => {
    g((M) => {
      const j = typeof b == "function" ? b(M) : b;
      return bn(wt, j), j;
    });
  }, []), I = ne((b) => {
    const M = lt(b);
    m(M), xn(Nt, M);
  }, []), D = ne((b, M = "prefill") => {
    a(!0), f({ id: ++H.current, prompt: b, mode: M });
  }, [a]), V = ne(() => {
    f(null);
  }, []), q = ne((b) => {
    $(null), T(null), r(b);
  }, []), U = ne(() => {
    T(null), r(null);
  }, []), W = ne((b) => {
    T((M) => M === b || M && b && M.customerName === b.customerName && M.readOnly === b.readOnly && M.hasOpenItems === b.hasOpenItems ? M : b);
  }, []), R = ne((b) => {
    o.current = b;
  }, []), L = ne(() => {
    var b;
    (b = o.current) == null || b.call(o);
  }, []);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: s ? /* @__PURE__ */ e(
      ts,
      {
        caseId: s,
        catalog: i,
        coachOpen: c,
        syncTick: k,
        onBack: U,
        onToggleCoach: () => a((b) => !b),
        onAskCoach: D,
        onCaseMetaChange: W,
        onRegisterQuickDraft: R
      }
    ) : /* @__PURE__ */ e(
      Fn,
      {
        onOpen: q,
        catalog: i,
        coachOpen: c,
        syncTick: k,
        onToggleCoach: () => a((b) => !b),
        onAskCoach: D,
        onCreatedCase: $
      }
    ) }),
    c && /* @__PURE__ */ e(
      Mn,
      {
        width: x,
        onWidthChange: I,
        onClose: () => a(!1),
        caseId: s,
        customerName: s ? u == null ? void 0 : u.customerName : void 0,
        readOnly: s ? !!(u != null && u.readOnly) : !1,
        hasOpenItems: s ? !!(u != null && u.hasOpenItems) : !1,
        intent: w,
        onConsumeIntent: V,
        createdCase: z,
        onOpenCase: q,
        onDismissCreatedCase: () => $(null),
        onQuickDraft: s && (u != null && u.hasOpenItems) && !u.readOnly ? L : void 0
      }
    )
  ] }) });
}
export {
  os as default
};
