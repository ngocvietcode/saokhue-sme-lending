import { jsxs as n, jsx as e, Fragment as Se } from "react/jsx-runtime";
import * as et from "@kirocrew/app-sdk";
import { useChatLauncher as Ft, useAppApi as rt } from "@kirocrew/app-sdk";
import { useRef as J, useCallback as se, useState as N, useMemo as F, useEffect as re, Fragment as Ct } from "react";
import { Btn as S, PageHeader as Ut, ErrorNotice as _t } from "@kirocrew/app-sdk/ui";
import { MessageSquare as Te, Plus as tt, ExternalLink as Je, PanelRightClose as Gt, ArrowRight as Xt, AlertTriangle as jt, FileText as St, Mail as at, Calendar as Vt, CheckCircle2 as Tt, XCircle as Wt, CircleDot as Qt, CircleDashed as Yt, RefreshCw as $t, FolderOpen as pt, ClipboardCheck as Ee, ShieldAlert as Zt, Clock as Jt, Search as gt, EyeOff as en, Eye as It, X as tn, Send as zt, Check as Ue, Copy as Ge, SkipForward as nn, RotateCcw as sn, FileSearch as rn, Download as an, Trash2 as on, History as ln, ArrowLeft as cn, Unlock as ft, Landmark as dn, ClipboardList as mn, ShieldCheck as hn, Activity as un } from "lucide-react";
const pn = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function gn(t, s, r) {
  const i = Ft(), h = J(i);
  h.current = i;
  const c = J(r);
  return c.current = r, se(
    async (g, v, m) => {
      var T;
      const k = h.current, { openChat: p } = k, u = k.createChat;
      if (!u) {
        p({ autoSend: !1, message: g });
        return;
      }
      try {
        const I = await u({ slotKey: s + pn(v), agent: t, title: m });
        p({ slotKey: I, autoSend: !1, message: g });
      } catch (I) {
        (T = c.current) == null || T.call(c, `Không mở được chat với trợ lý: ${I instanceof Error ? I.message : String(I)}`);
      }
    },
    [t, s]
  );
}
const it = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, Fe = new Intl.NumberFormat("vi-VN"), Et = (t) => typeof t == "number" ? Fe.format(t) + " đ" : "—", ot = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? Fe.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? Fe.format(Math.round(t / 1e4) / 100) + " triệu" : Fe.format(t) + " đ", _e = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", Me = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, he = (t) => {
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
async function lt(t) {
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
const De = (t) => t instanceof Error ? t.message : String(t), nt = "kirocrew_prefill", vt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), fn = (t, s) => {
};
function ct(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function bn(t) {
  try {
    const s = localStorage.getItem(t);
    if (s === "1") return !0;
    if (s === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function vn(t, s) {
  try {
    localStorage.setItem(t, s ? "1" : "0");
  } catch {
  }
}
function xn(t, s = 420) {
  try {
    const r = Number(localStorage.getItem(t));
    if (Number.isFinite(r) && r >= 360 && r <= 620) return Math.round(r);
  } catch {
  }
  return s;
}
function yn(t, s) {
  try {
    localStorage.setItem(t, String(ct(s)));
  } catch {
  }
}
function kn(t, s = 4e3) {
  const r = et.useAppEvents ?? fn, [i, h] = N(0), c = se(() => h((g) => g + 1), []);
  return r("tool_result", c), r("chat_done", c), re(() => {
    if (!t) return;
    const g = window.setInterval(() => {
      document.visibilityState !== "hidden" && h((v) => v + 1);
    }, s);
    return () => window.clearInterval(g);
  }, [t, s]), { syncTick: i, bumpSync: c };
}
function wn(t) {
  try {
    const s = sessionStorage.getItem(t);
    if (s) return s;
    const r = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, r), r;
  } catch {
    return "intake-default";
  }
}
function Nn(t, s) {
  try {
    sessionStorage.setItem(t, s);
  } catch {
  }
}
function Ne(t) {
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
    sessionStorage.setItem(nt, JSON.stringify({ slotKey: t, prompt: s, ts: r }));
  } catch {
  }
  return r;
}
function Cn({
  storagePrefix: t,
  chatPrefix: s,
  agent: r,
  panelLabel: i,
  newIntakePrompt: h,
  newSessionTitle: c,
  caseTitlePrefix: g = "Hồ sơ",
  chips: v = [],
  showNewSessionButton: m,
  attachDefaultPrefix: k,
  embedPlaceholder: p,
  width: u,
  onWidthChange: T,
  onClose: I,
  caseId: $,
  customerName: M,
  intent: d,
  onConsumeIntent: y,
  createdCase: a,
  onOpenCase: z,
  onDismissCreatedCase: q
}) {
  const W = et, A = W.ChatPanel, U = W.ChatEmbed, Q = et.useChatLauncher(), R = gn(r, s), L = `${t}:intake-id`, [b, K] = N(() => wn(L)), j = $ ?? b, x = s + vt(j), _ = F(() => $ ? M ? `${g} ${M} (${$})` : `${g} ${$}` : c, [$, M, c, g]), [H, V] = N(null), [G, ae] = N(null), oe = J(null);
  oe.current = H;
  const le = J(Q);
  le.current = Q, re(() => {
    let C = !1;
    ae(null);
    const E = oe.current === x, O = le.current.createChat;
    if (!O) {
      E || V(x);
      return;
    }
    return E || V(null), O({ slotKey: x, agent: r, title: _ }).then((B) => {
      if (C) return;
      const Z = B || x;
      oe.current !== Z && V(Z);
    }).catch((B) => {
      C || E || ae(De(B));
    }), () => {
      C = !0;
    };
  }, [x, r, _]);
  const l = J(null), P = J(0), w = J(null), f = J(!1), [ie, ee] = N(0), Y = se((C, E) => {
    const O = E.trim();
    if (!O) return;
    const B = Ne(l.current);
    if (oe.current === C && B) {
      Be(B).trim().includes(O) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: E } })), requestAnimationFrame(() => Pe(Ne(l.current)));
      return;
    }
    const Z = xt(C, E);
    w.current = { slotKey: C, prompt: E, ts: Z }, ee((Ie) => Ie + 1);
  }, []);
  re(() => {
    const C = w.current;
    if (!C || H !== C.slotKey) return;
    let E = 0, O = 0;
    const B = window.setInterval(() => {
      E += 1;
      const Z = Ne(l.current);
      if (!Z) {
        E >= 20 && (window.clearInterval(B), w.current = null);
        return;
      }
      if (Be(Z).trim().includes(C.prompt.trim())) {
        w.current = null, window.clearInterval(B), Pe(Z);
        return;
      }
      if (O += 1, O >= 3) {
        try {
          const ue = sessionStorage.getItem(nt);
          if (ue) {
            const de = JSON.parse(ue);
            de.slotKey === C.slotKey && de.ts === C.ts && sessionStorage.removeItem(nt);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: C.prompt } })), w.current = null, window.clearInterval(B), requestAnimationFrame(() => Pe(Ne(l.current)));
      }
    }, 60);
    return () => window.clearInterval(B);
  }, [H, ie]), re(() => {
    if (!f.current || !H) return;
    let C = 0;
    const E = () => {
      var Z;
      const B = (Z = l.current) == null ? void 0 : Z.querySelector('input[type="file"]');
      return B ? (f.current = !1, B.click(), !0) : !1;
    };
    if (E()) return;
    const O = window.setInterval(() => {
      C += 1, (E() || C >= 16) && (f.current = !1, window.clearInterval(O));
    }, 50);
    return () => window.clearInterval(O);
  }, [H, ie]);
  const fe = se((C) => {
    const E = `intake-${Date.now().toString(36)}`, O = s + vt(E);
    if (Nn(L, E), q(), C) {
      const B = xt(O, C);
      w.current = { slotKey: O, prompt: C, ts: B }, ee((Z) => Z + 1);
    }
    K(E);
  }, [s, L, q]);
  re(() => {
    var C;
    if (!(!d || d.id === P.current)) {
      if (P.current = d.id, d.mode === "new_intake") {
        const E = Ne(l.current), O = Be(E).trim(), B = (d.prompt || h).trim();
        $ === null && O === B && E ? Pe(E) : fe(d.prompt || h), y();
        return;
      }
      if (d.mode === "attach") {
        const E = Ne(l.current), O = k ?? ($ ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${$}: ` : "");
        O && !Be(E).trim() && Y(x, O);
        const B = (C = l.current) == null ? void 0 : C.querySelector('input[type="file"]');
        B ? (f.current = !1, B.click()) : (f.current = !0, ee((Z) => Z + 1)), y();
        return;
      }
      Y(x, d.prompt), y();
    }
  }, [
    d,
    $,
    x,
    h,
    k,
    y,
    Y,
    fe
  ]);
  const [Ve, $e] = N(!1), ce = J(null), We = (C) => {
    C.preventDefault(), C.currentTarget.setPointerCapture(C.pointerId), ce.current = { startX: C.clientX, startW: u, pointerId: C.pointerId }, $e(!0);
  }, Re = (C) => {
    const E = ce.current;
    !E || E.pointerId !== C.pointerId || T(ct(E.startW + (E.startX - C.clientX)));
  }, te = (C) => {
    var E;
    ((E = ce.current) == null ? void 0 : E.pointerId) === C.pointerId && (ce.current = null, $e(!1));
  }, ye = m ?? !$;
  return /* @__PURE__ */ n("aside", { ref: l, className: "sme-dock", style: { width: u }, "aria-label": i, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${Ve ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: We,
        onPointerMove: Re,
        onPointerUp: te,
        onPointerCancel: te
      }
    ),
    /* @__PURE__ */ n("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ n("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e(Te, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          $ ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: $ }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: i })
        ] }),
        v.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: v.map((C) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              C.onClick ? C.onClick() : C.prompt && Y(x, C.prompt);
            },
            children: C.label
          },
          C.label
        )) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        ye && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => fe(), children: /* @__PURE__ */ e(tt, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => R("", j, _),
            children: /* @__PURE__ */ e(Je, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: I, children: /* @__PURE__ */ e(Gt, { size: 15 }) })
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
      /* @__PURE__ */ n(S, { primary: !0, onClick: () => z(a.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(Xt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: G ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: G }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(S, { onClick: () => R("", j, _), children: [
        /* @__PURE__ */ e(Je, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : H ? A ? /* @__PURE__ */ e(A, { slotKey: H, conversationOnly: !0 }, H) : U ? /* @__PURE__ */ e(
      U,
      {
        slotKey: H,
        agent: r,
        frameless: !0,
        startAtBottom: !0,
        placeholder: p
      },
      H
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(S, { primary: !0, onClick: () => R("", j, _), children: [
        /* @__PURE__ */ e(Je, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const _n = `
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
function Sn() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = _n, document.head.appendChild(s);
}
const Tn = (t, s) => s && t[s] || { label: s ?? "—", tone: "muted" }, qt = {
  PASS: { label: "Đạt", tone: "ok" },
  MISSING_REQUIRED: { label: "Còn thiếu", tone: "warn" },
  FAIL: { label: "Không đạt", tone: "danger" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" },
  UNDETERMINED_CONDITION: { label: "Chưa xác định điều kiện", tone: "info" }
}, $n = {
  PASS: { label: "Khớp", tone: "ok" },
  FAIL: { label: "Không khớp", tone: "danger" },
  MISSING_DATA: { label: "Thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, In = {
  COMPLETE: { label: "Checklist đầy đủ", tone: "ok" },
  INCOMPLETE: { label: "Checklist chưa đủ", tone: "warn" },
  PASS: { label: "Đối chiếu khớp", tone: "ok" },
  FAIL: { label: "Đối chiếu có lệch", tone: "danger" },
  MISSING_DATA: { label: "Đối chiếu thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, Xe = (t) => Tn(In, t);
function zn(t, s = [
  "PASS",
  "MISSING_REQUIRED",
  "FAIL",
  "UNDETERMINED_CONDITION"
]) {
  if (!t) return "—";
  const r = s.filter((i) => (t[i] ?? 0) > 0).map((i) => `${t[i]} ${qt[i].label.toLowerCase()}`);
  return r.length ? r.join(" · ") : "Chưa có mục nào";
}
const qe = "/apps/sme-sales/api", yt = {
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
}, dt = { email: "Email", zalo: "Zalo", phone_script: "Kịch bản gọi" }, En = {
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
}, Ae = (t) => t.rule_status === "SKIPPED" || t.applicable === !1, Ke = (t) => !Ae(t) && (t.owner_role ?? "CUSTOMER") === "CUSTOMER" && t.rule_status !== "UNDETERMINED_CONDITION" && !!t.ask, Ht = (t) => t ? t.startsWith("agent:") || t === "dossier-coach" ? "Trợ lý AI" : "ĐVKD" : "Hệ thống", Dn = "dossier-coach", qn = "sme-sales-chat-";
function Kn(t) {
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
  if (t === "request.purpose" && typeof s == "string") return it[s] ?? s;
  if (t === "request.product_code" && typeof s == "string") {
    const i = r == null ? void 0 : r.products.products.find((h) => h.code === s);
    return i ? `${i.code} · ${i.name}` : s;
  }
  return typeof s == "number" ? /fiscal_year/.test(t) ? String(s) : /_pct$|ty_le/.test(t) ? `${_e(s, 2)}%` : /term_months|so_thang/.test(t) ? `${s} tháng` : /years_in_operation|so_nam/.test(t) ? `${_e(s, 1)} năm` : /amount|capital|revenue|income|assets|equity|investment|value|exposure|so_tien|gia_tri|doanh_thu|von|tai_san|loi_nhuan/.test(t) ? Et(s) : s.toLocaleString("vi-VN") : typeof s == "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) ? he(s) : String(s);
}
function je(t, s) {
  return s == null || s === "" ? "—" : t === "loan_amount" ? ot(s) : t === "term_months" ? `${_e(s, 0)} tháng` : t === "years_in_operation" ? `${_e(s, 1)} năm` : t === "equity_contribution_pct" ? `${_e(s, 1)}%` : typeof s == "number" ? _e(s) : String(s);
}
function Hn(t, s, r = "email", i = !1) {
  const h = dt[r], c = i ? "nhắc khách bổ sung (giọng nhắc lịch sự các mục đã yêu cầu)" : "xin khách bổ sung", g = s.map((v) => `- ${v.title} [${v.key}]`).join(`
`);
  return `Soạn ${h} ${c} cho hồ sơ ${t} (kênh: ${r}) gồm các hạng mục sau:
${g}`;
}
function Mn(t, s) {
  var I, $, M, d, y;
  const { case: r, overview: i } = t, h = (s == null ? void 0 : s.documents.types) ?? {}, c = i.items.filter((a) => !Ae(a)), g = c.filter((a) => a.blocking).length, v = c.filter((a) => a.blocking && ["ok", "resolved", "waived"].includes(a.status)).length, m = [
    `PHIẾU BÀN GIAO HỒ SƠ THẨM ĐỊNH: ${r.case_id}`,
    `Khách hàng: ${((I = r.customer) == null ? void 0 : I.name) ?? "Chưa rõ"} | MST: ${(($ = r.customer) == null ? void 0 : $.tax_id) ?? "—"} | Luồng: ${r.flow}`,
    `Master Checklist: ${i.checklist_overall ?? "INCOMPLETE"} | Hạng mục áp dụng: ${v}/${g}`,
    `Trạng thái: ${i.readiness.ready ? "Đủ điều kiện trình" : `Còn ${i.readiness.blocking_open.length} mục chặn`}`,
    "",
    "1. THÔNG TIN KHÁCH HÀNG & ĐỀ XUẤT"
  ];
  for (const a of i.profile)
    m.push(`- ${a.label}: ${He(a.path, a.value, s)}`);
  m.push("", `2. CHỨNG TỪ ĐỐI CHIẾU (${r.documents.length})`), r.documents.length === 0 && m.push("- Chưa có chứng từ");
  for (const a of r.documents) {
    const z = a.type ? ((M = h[a.type]) == null ? void 0 : M.label) ?? a.type : "Chưa phân loại";
    m.push(`- ${a.id}: ${z} (${a.name}${a.issued_date ? `, lập ${he(a.issued_date)}` : ""})${a.summary ? ` — ${a.summary}` : ""}`);
  }
  const k = ((d = i.crosschecks) == null ? void 0 : d.rules) ?? [];
  if (k.length > 0) {
    m.push("", `3. ĐỐI CHIẾU CHÉO 7 RULE (${((y = i.crosschecks) == null ? void 0 : y.overall_status) ?? "—"})`);
    for (const a of k.filter((z) => z.status !== "SKIPPED"))
      m.push(`- [${a.id}] ${a.title}: ${a.status} — ${a.detail}`);
  }
  const p = (i.policy_checks ?? []).filter((a) => a.status === "not_met");
  if (p.length > 0) {
    m.push("", "4. LƯU Ý ĐIỀU KIỆN CHÍNH SÁCH SƠ BỘ");
    for (const a of p)
      m.push(`- ${a.label}: thực tế ${je(a.fact, a.actual)}, yêu cầu ${a.op} ${je(a.fact, a.threshold)} (${a.clause})`);
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
      m.push(`- [${a.owner_role ?? "CUSTOMER"}] ${a.title}: ${a.rule_status ?? Kt[a.status].label}${a.due_date ? ` (hạn ${he(a.due_date)})` : ""}`);
  }
  return m.join(`
`);
}
function An({
  width: t,
  onWidthChange: s,
  onClose: r,
  caseId: i,
  customerName: h,
  readOnly: c = !1,
  hasOpenItems: g = !1,
  intent: v,
  onConsumeIntent: m,
  createdCase: k,
  onOpenCase: p,
  onDismissCreatedCase: u,
  onQuickDraft: T
}) {
  const I = F(() => {
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
    Cn,
    {
      storagePrefix: "sme-sales",
      chatPrefix: qn,
      agent: Dn,
      panelLabel: "Trợ lý hồ sơ",
      newIntakePrompt: "Tạo hồ sơ mới cho khách hàng: ",
      newSessionTitle: "Hồ sơ SME mới",
      caseTitlePrefix: "Hồ sơ",
      chips: I,
      embedPlaceholder: i ? `Nhắn trợ lý hoặc kéo chứng từ vào cho ${i}...` : "Kể về khách hàng mới hoặc kéo bộ chứng từ vào đây...",
      width: t,
      onWidthChange: s,
      onClose: r,
      caseId: i,
      customerName: h,
      intent: v,
      onConsumeIntent: m,
      createdCase: k,
      onOpenCase: p,
      onDismissCreatedCase: u
    }
  );
}
const ge = (t) => `t-${t}`;
function X({ t, children: s, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${ge(t)}`, title: r, children: s });
}
function pe({ icon: t, label: s, value: r, hint: i, t: h = "accent" }) {
  return /* @__PURE__ */ n("div", { className: `sme-kpi ${ge(h)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      i && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: i })
    ] })
  ] });
}
function xe({ icon: t, title: s, hint: r, action: i }) {
  return /* @__PURE__ */ n("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    i && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: i })
  ] });
}
function st({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${ge(t)}`, children: [
    /* @__PURE__ */ e(jt, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function Mt(t) {
  var r;
  if (t.stage === "submitted") return { label: "Đã bàn giao", t: "info" };
  if (t.overdue > 0) return { label: `${t.overdue} quá hạn`, t: "danger" };
  if (t.ready) return { label: "Đủ điều kiện trình", t: "ok" };
  const s = ((r = t.progress) == null ? void 0 : r.to_request) ?? t.actionable_blocking ?? t.blocking_open;
  return s > 0 ? { label: `Thiếu ${s} mục chặn`, t: "warn" } : t.requested > 0 ? { label: `Chờ KH (${t.requested})`, t: "info" } : { label: "Khởi tạo", t: "muted" };
}
function At(t) {
  if (t.progress) return { done: t.progress.mandatory_done, total: t.progress.mandatory_total };
  let s = 0, r = 0;
  for (const i of t.groups)
    s += i.done, r += i.total;
  return { done: s, total: r };
}
function Rn({ rows: t, onOpen: s }) {
  return t.length === 0 ? /* @__PURE__ */ e(xe, { icon: /* @__PURE__ */ e(St, { size: 28 }), title: "Không có hồ sơ phù hợp" }) : /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
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
      var v;
      const i = Mt(r), { done: h, total: c } = At(r), g = ((v = r.progress) == null ? void 0 : v.to_request) ?? r.actionable_blocking ?? r.blocking_open;
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
        /* @__PURE__ */ e("td", { className: "sme-num sme-strong", children: ot(r.amount) }),
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
            r.next_due_date ? ` (hạn ${he(r.next_due_date)})` : ""
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
function Rt(t) {
  return t.done === t.total && t.total > 0 ? "ok" : t.blocked > 0 ? "danger" : t.done > 0 ? "warn" : "muted";
}
function Ln({ g: t, size: s = 12 }) {
  return t.done === t.total && t.total > 0 ? /* @__PURE__ */ e(Tt, { size: s }) : t.blocked > 0 ? /* @__PURE__ */ e(Wt, { size: s }) : t.done > 0 ? /* @__PURE__ */ e(Qt, { size: s }) : /* @__PURE__ */ e(Yt, { size: s });
}
function Bn({ groups: t, activeGroup: s, onSelectGroup: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: t.map((i) => {
    const h = Rt(i), c = s === i.group;
    return /* @__PURE__ */ n("div", { className: "sme-phase", children: [
      /* @__PURE__ */ e("span", { className: "sme-phase-name", children: i.label }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${ge(h)} ${c ? "ss-active-node" : ""}`,
          title: `${i.label}: ${i.done}/${i.total} hạng mục đạt${i.blocked ? `, ${i.blocked} chặn` : ""}${i.skipped ? `, ${i.skipped} không áp dụng (ẩn)` : ""}`,
          onClick: () => r(c ? null : i.group),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(Ln, { g: i }) }),
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
const Pn = [2, 3, 5, 7];
function mt({ label: t = "Hạn cam kết bổ sung", confirmLabel: s = "Xác nhận", busy: r, onConfirm: i, onCancel: h }) {
  const [c, g] = N(() => bt(3));
  return /* @__PURE__ */ n("div", { className: "ss-due-row", children: [
    /* @__PURE__ */ n("span", { className: "sme-small sme-muted sme-row", style: { gap: 5 }, children: [
      /* @__PURE__ */ e(Vt, { size: 13 }),
      " ",
      t,
      ":"
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-filters", role: "group", "aria-label": "Chọn nhanh số ngày", children: Pn.map((v) => {
      const m = bt(v);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-filter ${c === m ? "on" : ""}`,
          onClick: () => g(m),
          children: [
            "+",
            v,
            " ngày"
          ]
        },
        v
      );
    }) }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "date",
        className: "sme-input",
        style: { width: 148, padding: "4px 8px", fontSize: 12 },
        value: c,
        onChange: (v) => g(v.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 6, marginLeft: "auto" }, children: [
      h && /* @__PURE__ */ e(S, { onClick: h, children: "Huỷ" }),
      /* @__PURE__ */ e(S, { primary: !0, busy: r, disabled: !c, onClick: () => i(c), children: s })
    ] })
  ] });
}
function Lt({ onPick: t }) {
  return /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: ["email", "zalo", "phone_script"].map((s) => /* @__PURE__ */ n(S, { onClick: () => t(s), children: [
    /* @__PURE__ */ e(at, { size: 13 }),
    " ",
    dt[s]
  ] }, s)) });
}
const On = `
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
function Fn() {
  const t = "sme-sales-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = On, document.head.appendChild(s);
}
const Bt = "sme-sales:view", Un = () => {
  try {
    return localStorage.getItem(Bt) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
};
function Gn({ r: t, onOpen: s }) {
  const r = Mt(t), { done: i, total: h } = At(t);
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
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: ot(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.product_code, t.term_months ? `${t.term_months} tháng` : null, t.purpose ? it[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${i}/${h} hạng mục bắt buộc đã đạt`, children: t.groups.map((c) => {
          const g = Rt(c);
          return /* @__PURE__ */ e(
            "span",
            {
              className: g === "muted" ? "none" : ge(g),
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
            /* @__PURE__ */ n("span", { className: "sme-mono", title: "Hạng mục bắt buộc đã đạt", children: [
              i,
              "/",
              h,
              " bắt buộc"
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
function Xn({
  onOpen: t,
  catalog: s,
  coachOpen: r,
  syncTick: i,
  onToggleCoach: h,
  onAskCoach: c,
  onCreatedCase: g
}) {
  const v = rt(), [m, k] = N(null), [p, u] = N(null), [T, I] = N(null), [$, M] = N(!1), [d, y] = N("all"), [a, z] = N(""), [q, W] = N(Un), A = J(0), U = J(!1), Q = J(null), R = (x) => {
    W(x);
    try {
      localStorage.setItem(Bt, x);
    } catch {
    }
  }, L = se(async (x = !1) => {
    if (!(x && U.current)) {
      x ? U.current = !0 : M(!0);
      try {
        const _ = await v.get(`${qe}/cases`);
        if (Q.current === null)
          Q.current = new Set(_.cases.map((H) => H.case_id));
        else {
          const H = _.cases.find((V) => !Q.current.has(V.case_id));
          _.cases.forEach((V) => Q.current.add(V.case_id)), H && g({ caseId: H.case_id, name: H.customer_name || H.case_id });
        }
        k(_.cases), u(_.today), I(null), A.current = Date.now();
      } catch (_) {
        x || I(De(_));
      } finally {
        x ? U.current = !1 : M(!1);
      }
    }
  }, [v, g]);
  re(() => {
    L();
  }, [L]), re(() => {
    i > 0 && L(!0);
  }, [i, L]), re(() => {
    const x = () => {
      document.visibilityState !== "hidden" && Date.now() - A.current >= 3e3 && L(!0);
    };
    return window.addEventListener("focus", x), document.addEventListener("visibilitychange", x), () => {
      window.removeEventListener("focus", x), document.removeEventListener("visibilitychange", x);
    };
  }, [L]);
  const b = F(() => {
    const x = m ?? [], _ = x.filter((l) => l.stage !== "submitted"), H = x.length - _.length, V = _.filter((l) => l.ready).length, G = _.filter((l) => {
      var P;
      return (((P = l.progress) == null ? void 0 : P.to_request) ?? l.actionable_blocking ?? l.blocking_open) > 0 || (l.unclassified_docs ?? 0) > 0;
    }).length, ae = _.reduce((l, P) => {
      var w;
      return l + (((w = P.progress) == null ? void 0 : w.to_request) ?? P.actionable_blocking ?? P.blocking_open);
    }, 0), oe = _.filter((l) => l.requested > 0 && l.overdue === 0).length, le = _.filter((l) => l.overdue > 0).length;
    return { live: _.length, submitted: H, ready: V, actionNeeded: G, actionableItems: ae, waitingCases: oe, overdueCases: le };
  }, [m]), K = F(() => {
    const x = a.trim().toLowerCase();
    return (m ?? []).filter((_) => {
      var H;
      return d === "submitted" && _.stage !== "submitted" || d !== "submitted" && d !== "all" && _.stage === "submitted" || d === "action" && (((H = _.progress) == null ? void 0 : H.to_request) ?? _.actionable_blocking ?? _.blocking_open) === 0 && (_.unclassified_docs ?? 0) === 0 || d === "waiting" && _.requested === 0 || d === "overdue" && _.overdue === 0 || d === "ready" && !_.ready ? !1 : x ? [_.customer_name, _.case_id, _.tax_id, _.product_code].some((V) => V == null ? void 0 : V.toLowerCase().includes(x)) : !0;
    });
  }, [m, d, a]), j = () => c("Tạo hồ sơ mới cho khách hàng: ", "new_intake");
  return /* @__PURE__ */ n(Se, { children: [
    /* @__PURE__ */ e(
      Ut,
      {
        title: "Hoàn thiện hồ sơ Tín dụng SME",
        subtitle: "Quản lý danh mục hồ sơ ĐVKD, kiểm soát chứng từ bắt buộc, đối chiếu điều kiện sơ bộ và bàn giao Thẩm định",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(S, { onClick: () => L(), busy: $, children: [
            /* @__PURE__ */ e($t, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ n(
            S,
            {
              className: r ? "sme-toggle-on" : void 0,
              "aria-pressed": r,
              onClick: h,
              title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
              children: [
                /* @__PURE__ */ e(Te, { size: 14 }),
                " Trợ lý hồ sơ"
              ]
            }
          ),
          /* @__PURE__ */ n(S, { primary: !0, onClick: j, children: [
            /* @__PURE__ */ e(tt, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      T && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(_t, { title: "Không tải được danh sách hồ sơ", children: T }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(
          pe,
          {
            icon: /* @__PURE__ */ e(pt, { size: 18 }),
            label: "Hồ sơ đang thu thập",
            value: m ? b.live : "…",
            hint: m ? `${b.submitted} hồ sơ đã bàn giao` : void 0
          }
        ),
        /* @__PURE__ */ e(
          pe,
          {
            t: b.ready ? "ok" : "muted",
            icon: /* @__PURE__ */ e(Ee, { size: 18 }),
            label: "Đủ điều kiện trình",
            value: m ? b.ready : "…",
            hint: "Hoàn tất mục bắt buộc"
          }
        ),
        /* @__PURE__ */ e(
          pe,
          {
            t: b.actionNeeded ? "warn" : "ok",
            icon: /* @__PURE__ */ e(Zt, { size: 18 }),
            label: "Cần ĐVKD xử lý",
            value: m ? b.actionNeeded : "…",
            hint: m ? `${b.actionableItems} mục chặn chưa yêu cầu` : void 0
          }
        ),
        /* @__PURE__ */ e(
          pe,
          {
            t: b.overdueCases ? "danger" : b.waitingCases ? "info" : "muted",
            icon: /* @__PURE__ */ e(Jt, { size: 18 }),
            label: "Chờ khách hàng",
            value: p ? p.waiting : "…",
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
        ].map(([x, _]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": d === x,
            className: `sme-filter ${d === x ? "on" : ""}`,
            onClick: () => y(x),
            children: _
          },
          x
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ n("div", { className: "sme-filters", role: "tablist", "aria-label": "Chế độ hiển thị", children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": q === "cards",
                className: `sme-filter ${q === "cards" ? "on" : ""}`,
                onClick: () => R("cards"),
                children: "Thẻ hồ sơ"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": q === "table",
                className: `sme-filter ${q === "table" ? "on" : ""}`,
                onClick: () => R("table"),
                children: "Bảng danh mục"
              }
            )
          ] }),
          /* @__PURE__ */ n("label", { className: "sme-search", children: [
            /* @__PURE__ */ e(gt, { size: 14, className: "sme-muted" }),
            /* @__PURE__ */ e("input", { value: a, onChange: (x) => z(x.target.value), placeholder: "Tìm doanh nghiệp, MST, mã hồ sơ, sản phẩm" })
          ] })
        ] })
      ] }),
      m === null && !T && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((x) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, x)) }),
      m && m.length === 0 && /* @__PURE__ */ e(
        xe,
        {
          icon: /* @__PURE__ */ e(pt, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Khởi tạo hồ sơ với trợ lý trong chat: cung cấp thông tin khách hàng và đính kèm chứng từ.",
          action: /* @__PURE__ */ n(S, { primary: !0, onClick: j, children: [
            /* @__PURE__ */ e(tt, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      m && m.length > 0 && K.length === 0 && /* @__PURE__ */ e(xe, { icon: /* @__PURE__ */ e(gt, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      K.length > 0 && q === "cards" && /* @__PURE__ */ e("div", { className: "sme-cases", children: K.map((x) => /* @__PURE__ */ e(Gn, { r: x, onOpen: () => t(x.case_id) }, x.case_id)) }),
      K.length > 0 && q === "table" && /* @__PURE__ */ e(Rn, { rows: K, onOpen: t })
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
function jn({ it: t, asOf: s, groupLabel: r, checked: i, selectable: h, skippedView: c, readOnly: g, onToggle: v, onSet: m, onOpenDoc: k }) {
  const [p, u] = N("none"), [T, I] = N(""), [$, M] = N(!1), [d, y] = N(!1), a = Kt[t.status], z = t.rule_status ? qt[t.rule_status] : null, q = t.status === "open", W = t.status === "requested" && !!t.due_date && t.due_date < s, A = t.owner_role === "RM_INTERNAL", U = async (R, L) => {
    M(!0), await m(t.key, R, T, L) && (u("none"), I("")), M(!1);
  }, Q = async () => {
    t.ask && await lt(t.ask) && (y(!0), setTimeout(() => y(!1), 1500));
  };
  return /* @__PURE__ */ n(Ct, { children: [
    /* @__PURE__ */ n("tr", { children: [
      !g && !c && /* @__PURE__ */ e("td", { style: { width: 28 }, children: h && /* @__PURE__ */ e(
        "input",
        {
          type: "checkbox",
          className: "ss-check",
          checked: i,
          onChange: v,
          "aria-label": `Chọn ${t.title}`
        }
      ) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-strong", children: t.title }),
          /* @__PURE__ */ e(X, { t: A ? "accent" : "muted", children: A ? "ĐVKD nội bộ" : "Khách hàng" }),
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
        !c && (q || t.status === "requested") && t.ask && /* @__PURE__ */ n("div", { className: "sme-item-ask sme-between", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ e("b", { children: "Nội dung yêu cầu KH:" }),
            " ",
            t.ask
          ] }),
          /* @__PURE__ */ n(S, { onClick: Q, title: "Sao chép nội dung yêu cầu", children: [
            d ? /* @__PURE__ */ e(Ue, { size: 12 }) : /* @__PURE__ */ e(Ge, { size: 12 }),
            " ",
            d ? "Đã chép" : "Chép"
          ] })
        ] }),
        !c && (q || t.status === "requested") && t.alternatives.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Chứng từ thay thế: ",
          t.alternatives.join("; ")
        ] })
      ] }),
      /* @__PURE__ */ e("td", { children: t.document_refs.length > 0 ? /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: t.document_refs.map((R) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: () => k(R), children: R }, R)) }) : /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: [
          z ? /* @__PURE__ */ e(X, { t: z.tone, children: z.label }) : /* @__PURE__ */ e(X, { t: a.tone, children: a.label }),
          !c && t.status === "requested" && /* @__PURE__ */ e(X, { t: "info", children: "Đã yêu cầu KH" }),
          !c && t.status === "waived" && /* @__PURE__ */ e(X, { t: "muted", children: "Xin miễn" }),
          W && /* @__PURE__ */ n(X, { t: "danger", children: [
            "Quá hạn (",
            he(t.due_date),
            ")"
          ] })
        ] }),
        t.status === "requested" && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Đã yêu cầu ",
          he(t.requested_at),
          t.due_date ? ` · hạn ${he(t.due_date)}` : ""
        ] }),
        t.status === "waived" && t.note && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Lý do: ",
          t.note
        ] })
      ] }),
      !g && !c && /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
        q && Ke(t) && /* @__PURE__ */ n(S, { busy: $, onClick: () => u(p === "request" ? "none" : "request"), title: "Đánh dấu đã yêu cầu khách", children: [
          /* @__PURE__ */ e(zt, { size: 13 }),
          " Đã yêu cầu"
        ] }),
        q && t.kind !== "policy_precheck" && /* @__PURE__ */ n(
          S,
          {
            onClick: () => {
              u(p === "waive" ? "none" : "waive"), p === "waive" && I("");
            },
            title: "Xin miễn / bổ sung sau",
            children: [
              /* @__PURE__ */ e(nn, { size: 13 }),
              " Xin miễn"
            ]
          }
        ),
        (t.status === "waived" || t.status === "requested") && /* @__PURE__ */ n(S, { busy: $, onClick: () => U("open"), title: "Mở lại hạng mục", children: [
          /* @__PURE__ */ e(sn, { size: 13 }),
          " Mở lại"
        ] })
      ] }) })
    ] }),
    !g && !c && p === "request" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ e(
      mt,
      {
        label: "Hạn khách hàng bổ sung",
        confirmLabel: "Xác nhận đã yêu cầu",
        busy: $,
        onCancel: () => u("none"),
        onConfirm: (R) => U("requested", R)
      }
    ) }) }),
    !g && !c && p === "waive" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ n("div", { className: "sme-stack", style: { gap: 8 }, children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          className: "sme-textarea",
          value: T,
          onChange: (R) => I(R.target.value),
          placeholder: "Ghi rõ căn cứ xin miễn hoặc cam kết bổ sung sau (đi kèm phiếu bàn giao Thẩm định)"
        }
      ),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ e(S, { onClick: () => {
          u("none"), I("");
        }, children: "Huỷ" }),
        /* @__PURE__ */ e(S, { primary: !0, busy: $, disabled: !T.trim(), onClick: () => U("waived"), children: "Xác nhận xin miễn" })
      ] })
    ] }) }) })
  ] });
}
function Vn({
  items: t,
  asOf: s,
  catalog: r,
  groupFilter: i,
  onClearGroup: h,
  readOnly: c,
  onSet: g,
  onBatchRequested: v,
  onDraft: m,
  onOpenDoc: k
}) {
  var le;
  const p = F(() => i ? t.filter((l) => l.group === i) : t, [t, i]), u = F(() => p.filter((l) => !Ae(l)), [p]), T = F(() => p.filter(Ae), [p]), I = Object.fromEntries(Oe.map(([l, , P]) => [l, u.filter(P).length])), $ = ((le = Oe.find(([l]) => l !== "all" && I[l] > 0)) == null ? void 0 : le[0]) ?? "all", [M, d] = N(null), [y, a] = N(!1), z = M ?? $, q = y ? T : u.filter(Oe.find(([l]) => l === z)[2]), [W, A] = N(/* @__PURE__ */ new Set()), [U, Q] = N(!1), [R, L] = N(!1), b = F(
    () => y ? [] : q.filter((l) => Ke(l) && (l.status === "open" || l.status === "requested")),
    [q, y]
  ), K = F(
    () => new Set(u.filter((l) => Ke(l) && (l.status === "open" || l.status === "requested")).map((l) => l.key)),
    [u]
  ), j = F(() => [...W].filter((l) => K.has(l)), [W, K]), x = (l) => {
    A((P) => {
      const w = new Set(P);
      return w.has(l) ? w.delete(l) : w.add(l), w;
    });
  }, _ = b.length > 0 && b.every((l) => W.has(l.key)), H = () => {
    A((l) => {
      const P = new Set(l);
      return _ ? b.forEach((w) => P.delete(w.key)) : b.forEach((w) => P.add(w.key)), P;
    });
  }, V = async (l) => {
    L(!0), await v(j, l) && (A(/* @__PURE__ */ new Set()), Q(!1)), L(!1);
  }, G = (r == null ? void 0 : r.documents.groups) ?? {}, ae = u.filter((l) => j.includes(l.key)), oe = ae.length > 0 && ae.every((l) => l.status === "requested");
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hạng mục", children: Oe.map(([l, P]) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": !y && z === l,
          className: `sme-filter ${!y && z === l ? "on" : ""}`,
          onClick: () => {
            a(!1), d(l);
          },
          children: [
            P,
            " (",
            I[l],
            ")"
          ]
        },
        l
      )) }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        T.length > 0 && /* @__PURE__ */ n(
          S,
          {
            className: y ? "sme-toggle-on" : void 0,
            onClick: () => a((l) => !l),
            title: "Các mục không áp dụng được ẩn mặc định; bấm để xem lý do không áp dụng",
            children: [
              y ? /* @__PURE__ */ e(en, { size: 13 }) : /* @__PURE__ */ e(It, { size: 13 }),
              y ? "Quay lại mục áp dụng" : `Mục không áp dụng (${T.length})`
            ]
          }
        ),
        i && /* @__PURE__ */ n(S, { onClick: h, title: "Bỏ lọc nhóm", children: [
          G[i] ?? i,
          " ",
          /* @__PURE__ */ e(tn, { size: 12 })
        ] }),
        !c && !y && b.length > 0 && /* @__PURE__ */ e(S, { onClick: H, children: _ ? "Bỏ chọn" : `Chọn KH (${b.length})` })
      ] })
    ] }),
    y && /* @__PURE__ */ n(st, { t: "info", children: [
      "Đang hiển thị ",
      /* @__PURE__ */ n("b", { children: [
        T.length,
        " hạng mục không áp dụng"
      ] }),
      " (mặc định ẩn vì điều kiện Lớp 1 không kích hoạt cho bộ hồ sơ này)."
    ] }),
    !c && !y && j.length > 0 && /* @__PURE__ */ n("div", { className: "ss-bulk", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
        /* @__PURE__ */ n("span", { className: "sme-strong sme-small", children: [
          "Đã chọn ",
          j.length,
          " hạng mục xin khách hàng"
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e(Lt, { onPick: (l) => m(j, l, oe) }),
          /* @__PURE__ */ n(S, { onClick: () => Q((l) => !l), children: [
            /* @__PURE__ */ e(zt, { size: 13 }),
            " Đã yêu cầu"
          ] }),
          /* @__PURE__ */ e(S, { onClick: () => {
            A(/* @__PURE__ */ new Set()), Q(!1);
          }, children: "Bỏ chọn" })
        ] })
      ] }),
      U && /* @__PURE__ */ e(
        mt,
        {
          label: `Đặt hạn cho ${j.length} hạng mục`,
          confirmLabel: "Xác nhận đã yêu cầu",
          busy: R,
          onCancel: () => Q(!1),
          onConfirm: V
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: q.length === 0 ? /* @__PURE__ */ e(xe, { icon: /* @__PURE__ */ e(Tt, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        !c && !y && /* @__PURE__ */ e("th", { "aria-label": "Chọn", style: { width: 28 } }),
        /* @__PURE__ */ e("th", { children: "Hạng mục, Điều kiện (Lớp 1) & Rule (Lớp 2)" }),
        /* @__PURE__ */ e("th", { children: "Chứng từ" }),
        /* @__PURE__ */ e("th", { children: "Kết quả" }),
        !c && !y && /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: q.map((l) => /* @__PURE__ */ e(
        jn,
        {
          it: l,
          asOf: s,
          groupLabel: G[l.group] ?? l.group,
          selectable: Ke(l) && (l.status === "open" || l.status === "requested"),
          checked: W.has(l.key),
          skippedView: y,
          readOnly: c,
          onToggle: () => x(l.key),
          onSet: g,
          onOpenDoc: k
        },
        l.key
      )) })
    ] }) })
  ] });
}
const Wn = {
  customer: "Pháp lý & Định danh (Lớp 1)",
  request: "Phương án đề xuất vay",
  facts: "Điều kiện kích hoạt & Tài chính / TSBĐ"
}, Qn = {
  met: { label: "Đạt", t: "ok" },
  not_met: { label: "Không đạt", t: "danger" },
  missing: { label: "Thiếu dữ liệu", t: "warn" },
  na: { label: "Không áp dụng", t: "muted" }
};
function Yn({
  detail: t,
  catalog: s,
  pendingDraftsCount: r,
  purposeWarn: i,
  readOnly: h,
  goDrafts: c,
  onAction: g,
  onChat: v
}) {
  var I, $, M, d, y;
  const { case: m, overview: k } = t, p = [...new Set(k.profile.map((a) => a.section))], u = k.policy_checks ?? [], T = u.some((a) => a.status === "not_met") || i && i.status === "open";
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    m.submitted && /* @__PURE__ */ n(st, { t: "info", children: [
      "Hồ sơ đã bàn giao Thẩm định lúc ",
      /* @__PURE__ */ e("b", { children: Me(m.submitted.at) }),
      " bởi ",
      Ht(m.submitted.by),
      m.submitted.note ? ` · Ghi chú: ${m.submitted.note}` : "",
      ".",
      ((I = m.submitted.handover) == null ? void 0 : I.status) === "transferred" ? ` Đã đồng bộ sang app Thẩm định SME (${m.submitted.handover.files_copied ?? 0} file đính kèm).` : ($ = m.submitted.handover) != null && $.message ? ` ${m.submitted.handover.message}` : ""
    ] }),
    !m.submitted && r > 0 && /* @__PURE__ */ n(st, { t: "warn", children: [
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
        !h && /* @__PURE__ */ n(S, { onClick: () => v(`Cập nhật thông tin hồ sơ ${m.case_id}: `), children: [
          /* @__PURE__ */ e(Te, { size: 13 }),
          " Cập nhật qua trợ lý"
        ] })
      ] }),
      k.profile.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Chưa có dữ liệu định danh hoặc phương án vay. Trao đổi với trợ lý để ghi nhận hoặc trích xuất từ chứng từ." }) : /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 12 }, children: p.map((a) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 6 }, children: Wn[a] ?? a }),
        /* @__PURE__ */ e("dl", { className: "ss-kv", children: k.profile.filter((z) => z.section === a).map((z) => /* @__PURE__ */ n(Ct, { children: [
          /* @__PURE__ */ e("dt", { children: z.label }),
          /* @__PURE__ */ e("dd", { children: He(z.path, z.value, s) })
        ] }, z.path)) })
      ] }, a)) })
    ] }),
    (u.length > 0 || i) && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ n("h3", { className: "sme-h3", children: [
          "Điều kiện chính sách sơ bộ ",
          ((M = m.request) == null ? void 0 : M.product_code) ?? ""
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
          const z = Qn[a.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              a.label,
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: a.clause })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-num", children: [
              a.op,
              " ",
              je(a.fact, a.threshold)
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-num", children: je(a.fact, a.actual) }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: z.t, children: z.label }) })
          ] }, a.id);
        }) })
      ] }),
      T && !h && /* @__PURE__ */ e("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ n(S, { onClick: () => v(`Hồ sơ ${m.case_id} đang vướng điều kiện chính sách sơ bộ. Gợi ý các phương án cơ cấu lại đề xuất.`), children: [
        /* @__PURE__ */ e(Te, { size: 13 }),
        " Đề xuất cơ cấu lại qua trợ lý"
      ] }) })
    ] }),
    (((y = (d = k.crosschecks) == null ? void 0 : d.rules) == null ? void 0 : y.length) ?? 0) > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "7 Quy tắc đối chiếu chéo trọng yếu" }),
        /* @__PURE__ */ e(X, { t: Xe(k.crosschecks.overall_status).tone, children: Xe(k.crosschecks.overall_status).label })
      ] }),
      /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 48 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Nội dung đối chiếu" }),
          /* @__PURE__ */ e("th", { children: "Chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: k.crosschecks.rules.filter((a) => a.status !== "SKIPPED").map((a) => {
          const z = $n[a.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: a.id }),
            /* @__PURE__ */ n("td", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: a.title }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: a.detail })
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-mono sme-small", children: a.document_refs.length ? a.document_refs.join(", ") : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: z.tone, children: z.label }) })
          ] }, a.id);
        }) })
      ] })
    ] }),
    k.actions.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: [
        "Hành động đề xuất (",
        k.actions.length,
        ")"
      ] }),
      k.actions.map((a) => /* @__PURE__ */ n("div", { className: `sme-finding ${ge(a.tone)}`, children: [
        /* @__PURE__ */ e("div", { className: "bar" }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-finding-topic", children: a.title }),
            a.detail.length > 0 && /* @__PURE__ */ e("div", { className: "sme-finding-text sme-muted", children: a.detail.slice(0, 4).join(" · ") })
          ] }),
          a.cta !== "none" && /* @__PURE__ */ e(S, { onClick: () => g(a), children: a.cta === "draft" ? /* @__PURE__ */ n(Se, { children: [
            /* @__PURE__ */ e(at, { size: 13 }),
            " Soạn thư"
          ] }) : a.cta === "submit" ? /* @__PURE__ */ n(Se, { children: [
            /* @__PURE__ */ e(Ee, { size: 13 }),
            " Bàn giao"
          ] }) : /* @__PURE__ */ n(Se, { children: [
            /* @__PURE__ */ e(Te, { size: 13 }),
            " Trợ lý"
          ] }) })
        ] })
      ] }, a.id))
    ] })
  ] });
}
function Zn(t, s, r) {
  var g;
  if (!t.type) return { label: "Chưa phân loại", t: "warn" };
  if (s.some(
    (v) => v.rule_status === "FAIL" && v.document_refs.includes(t.id) && (v.fail_reasons ?? []).some((m) => /hết hiệu lực/i.test(m))
  )) return { label: "Hết hiệu lực", t: "danger" };
  const h = s.find((v) => v.key === `date:${t.type}`);
  if (h && (h.status === "open" || h.status === "requested")) return { label: "Thiếu ngày lập", t: "warn" };
  const c = (g = r == null ? void 0 : r.documents.types[t.type]) == null ? void 0 : g.validity_months;
  return c ? { label: `Hiệu lực ${c} tháng`, t: "ok" } : { label: "Không giới hạn", t: "muted" };
}
function Jn({ docs: t, items: s, profile: r, catalog: i, focusDocId: h, readOnly: c, onDownload: g, onRemove: v, onExtractDoc: m, onUpload: k }) {
  const p = (i == null ? void 0 : i.documents.types) ?? {}, u = new Set(r.map((d) => d.path)), [T, I] = N(null), [$, M] = N(null);
  return re(() => {
    h && requestAnimationFrame(() => {
      var d;
      return (d = document.getElementById(`doc-${h}`)) == null ? void 0 : d.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [h]), t.length === 0 ? /* @__PURE__ */ e(
    xe,
    {
      icon: /* @__PURE__ */ e(rn, { size: 30 }),
      title: "Chưa có chứng từ nào",
      hint: "Đính kèm PDF, ảnh chụp, Word hoặc Excel trong chat với trợ lý để phân loại và trích xuất thông tin.",
      action: c ? void 0 : /* @__PURE__ */ e(S, { primary: !0, onClick: k, children: "Gửi chứng từ cho trợ lý" })
    }
  ) : /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Tổng cộng ",
        t.length,
        " chứng từ đã tiếp nhận vào hồ sơ."
      ] }),
      !c && /* @__PURE__ */ e(S, { onClick: k, children: "Gửi bổ sung qua trợ lý" })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
        /* @__PURE__ */ e("th", { children: "Loại chứng từ & Tệp" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Ngày lập" }),
        /* @__PURE__ */ e("th", { children: "Hiệu lực" }),
        /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((d) => {
        const y = d.type ? p[d.type] : void 0, a = Zn(d, s, i), z = new Set(d.not_stated ?? []), q = ((y == null ? void 0 : y.extract) ?? []).filter((A) => !u.has(A) && !z.has(A)), W = $ === d.id;
        return /* @__PURE__ */ n("tr", { id: `doc-${d.id}`, className: h === d.id ? "focus" : void 0, children: [
          /* @__PURE__ */ e("td", { className: "sme-mono", children: d.id }),
          /* @__PURE__ */ n("td", { children: [
            /* @__PURE__ */ e("div", { className: "sme-strong", children: (y == null ? void 0 : y.label) ?? (d.type || d.name) }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              d.name,
              d.size ? ` · ${Math.max(1, Math.round(d.size / 1024))} KB` : ""
            ] }),
            d.summary && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3 }, children: d.summary }),
            (!d.type || q.length > 0) && !c && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: "var(--warn)" }, children: d.type ? `Còn ${q.length} chỉ tiêu chưa trích xuất.` : "Chứng từ chưa được phân loại." })
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: d.issued_date ? he(d.issued_date) : "—" }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(X, { t: a.t, children: a.label }) }),
          /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
            d.file && /* @__PURE__ */ n(S, { busy: T === `dl:${d.id}`, onClick: async () => {
              I(`dl:${d.id}`), await g(d.id), I(null);
            }, children: [
              /\.(pdf|png|jpe?g|webp|txt)$/i.test(d.name) ? /* @__PURE__ */ e(It, { size: 13 }) : /* @__PURE__ */ e(an, { size: 13 }),
              " Xem / Tải"
            ] }),
            (!d.type || q.length > 0) && !c && /* @__PURE__ */ e(S, { onClick: () => m(d.id), children: "Đọc lại" }),
            !c && !W && /* @__PURE__ */ e(S, { onClick: () => M(d.id), title: "Gỡ chứng từ gửi nhầm", children: /* @__PURE__ */ e(on, { size: 13 }) }),
            !c && W && /* @__PURE__ */ n(Se, { children: [
              /* @__PURE__ */ e(S, { onClick: () => M(null), children: "Huỷ" }),
              /* @__PURE__ */ e(S, { primary: !0, busy: T === `rm:${d.id}`, onClick: async () => {
                I(`rm:${d.id}`), await v(d.id) && M(null), I(null);
              }, children: "Xác nhận gỡ" })
            ] })
          ] }) })
        ] }, d.id);
      }) })
    ] }) })
  ] });
}
function es({ d: t, items: s, readOnly: r, onSent: i }) {
  const [h, c] = N(!1), [g, v] = N(!1), m = async () => {
    await lt(t.subject ? `${t.subject}

${t.body}` : t.body) && (c(!0), setTimeout(() => c(!1), 1500));
  };
  return /* @__PURE__ */ n("div", { className: `sme-card sme-review ${ge(t.status === "sent" ? "ok" : "warn")}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("span", { className: "sme-row", children: [
        /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: t.id }),
        /* @__PURE__ */ e(X, { t: "accent", children: dt[t.channel] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Me(t.created_at) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(X, { t: t.status === "sent" ? "ok" : "warn", children: t.status === "sent" ? `Đã gửi ${he(t.sent_at)}` : "Chờ ĐVKD gửi" }),
        /* @__PURE__ */ n(S, { onClick: m, children: [
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
      t.requirement_keys.map((k) => {
        var p;
        return ((p = s.get(k)) == null ? void 0 : p.title) ?? k;
      }).join("; ")
    ] }),
    t.status === "draft" && !r && /* @__PURE__ */ e(
      mt,
      {
        label: "Hạn cam kết KH gửi",
        confirmLabel: "Tôi đã gửi",
        busy: g,
        onConfirm: async (k) => {
          v(!0), await i(t.id, k), v(!1);
        }
      }
    )
  ] });
}
function ts({ drafts: t, items: s, readOnly: r, hasOpenItems: i, onSent: h, onCompose: c }) {
  const [g, v] = N("all"), m = new Map(s.map((u) => [u.key, u])), k = t.filter((u) => u.status === "draft").length, p = [...t].reverse().filter((u) => g === "all" || u.status === g);
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["all", `Tất cả (${t.length})`], ["draft", `Chờ gửi (${k})`], ["sent", `Đã gửi (${t.length - k})`]].map(([u, T]) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": g === u,
          className: `sme-filter ${g === u ? "on" : ""}`,
          onClick: () => v(u),
          children: T
        },
        u
      )) }),
      !r && i && /* @__PURE__ */ e(Lt, { onPick: c })
    ] }),
    p.length === 0 && /* @__PURE__ */ e(
      xe,
      {
        icon: /* @__PURE__ */ e(at, { size: 28 }),
        title: "Chưa có thư yêu cầu khách hàng",
        hint: i ? "Chọn kênh ở trên hoặc tích chọn hạng mục ở tab Danh mục kiểm tra để trợ lý soạn nháp." : "Không còn hạng mục thiếu cần yêu cầu khách hàng."
      }
    ),
    p.map((u) => /* @__PURE__ */ e(es, { d: u, items: m, readOnly: r, onSent: h }, u.id))
  ] });
}
function ns({ audit: t }) {
  if (t.length === 0) return /* @__PURE__ */ e(xe, { icon: /* @__PURE__ */ e(ln, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (r) => r === "case_submitted" ? "ok" : r === "case_reopened" || r === "document_remove" ? "warn" : r === "requirement_set" ? "accent" : "muted";
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t].reverse().map((r, i) => {
    const h = Kn(r);
    return /* @__PURE__ */ n("div", { className: `sme-tl-item ${ge(s(r.action))}`, children: [
      /* @__PURE__ */ n("div", { className: "sme-between", children: [
        /* @__PURE__ */ n("span", { className: "sme-strong", style: { fontSize: 13 }, children: [
          En[r.action] ?? r.action,
          h ? ` · ${h}` : ""
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Me(r.ts) })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: Ht(String(r.actor ?? r.agent ?? r.author ?? "")) })
    ] }, i);
  }) }) });
}
function Ce({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function ss({
  caseId: t,
  catalog: s,
  coachOpen: r,
  syncTick: i,
  onBack: h,
  onToggleCoach: c,
  onAskCoach: g,
  onCaseMetaChange: v,
  onRegisterQuickDraft: m
}) {
  const k = rt(), [p, u] = N(null), [T, I] = N(null), [$, M] = N(!1), [d, y] = N("overview"), [a, z] = N(null), [q, W] = N(null), [A, U] = N(null), [Q, R] = N(!1), [L, b] = N(null), [K, j] = N(!1), [x, _] = N(!1), H = J(0), V = J(!1), G = se(async (o = !1) => {
    if (!(o && V.current)) {
      o ? V.current = !0 : M(!0);
      try {
        u(await k.get(`${qe}/cases/${t}`)), I(null), H.current = Date.now();
      } catch (D) {
        o || I(De(D));
      } finally {
        o ? V.current = !1 : M(!1);
      }
    }
  }, [k, t]);
  re(() => {
    G();
  }, [G]), re(() => {
    i > 0 && G(!0);
  }, [i, G]), re(() => {
    const o = () => {
      document.visibilityState !== "hidden" && Date.now() - H.current >= 3e3 && G(!0);
    };
    return window.addEventListener("focus", o), document.addEventListener("visibilitychange", o), () => {
      window.removeEventListener("focus", o), document.removeEventListener("visibilitychange", o);
    };
  }, [G]);
  const ae = async (o, D) => {
    try {
      return await k.post(`${qe}/cases/${t}${o}`, D), !0;
    } catch (ne) {
      return I(De(ne)), !1;
    }
  }, oe = async (o, D, ne = "", be) => {
    const we = { key: o, status: D, note: ne };
    be !== void 0 && (we.due_date = be);
    const ve = await ae("/requirements", we);
    return ve && await G(), ve;
  }, le = async (o, D) => {
    const ne = await ae("/requirements", { keys: o, status: "requested", note: "", due_date: D });
    return ne && await G(), ne;
  }, l = async (o) => {
    const D = await ae(`/documents/${o}/remove`, {});
    return D && await G(), D;
  }, P = async (o) => {
    try {
      const D = await k.get(`${qe}/cases/${t}/documents/${o}/file`), ne = atob(D.content_b64), be = new Uint8Array(ne.length);
      for (let me = 0; me < ne.length; me++) be[me] = ne.charCodeAt(me);
      const we = new Blob([be], { type: D.mime || "application/octet-stream" }), ve = URL.createObjectURL(we);
      if (D.mime.startsWith("image/") || D.mime === "application/pdf" || D.mime.startsWith("text/")) {
        if (!window.open(ve, "_blank", "noopener")) {
          const Ze = document.createElement("a");
          Ze.href = ve, Ze.download = D.name, Ze.click();
        }
      } else {
        const me = document.createElement("a");
        me.href = ve, me.download = D.name, me.click();
      }
      setTimeout(() => URL.revokeObjectURL(ve), 6e4);
    } catch (D) {
      I(De(D));
    }
  }, w = p == null ? void 0 : p.case, f = p == null ? void 0 : p.overview, ie = !!(w != null && w.submitted), ee = (w == null ? void 0 : w.customer) ?? {}, Y = (w == null ? void 0 : w.request) ?? {}, fe = ee.name ? String(ee.name) : void 0, Ve = fe || t, $e = (o) => g(o || `Hồ sơ ${t}: `, "prefill"), ce = (o, D = "email", ne = !1) => {
    const be = ((f == null ? void 0 : f.items) ?? []).filter((we) => o.includes(we.key));
    g(Hn(t, be, D, ne), "prefill");
  }, We = (o) => {
    o.cta === "draft" ? ce(o.keys, "email", o.kind === "remind" || o.kind === "follow_up") : o.cta === "submit" ? (U(""), b(null)) : o.cta === "chat" && $e(o.prompt);
  }, Re = async () => {
    p && await lt(Mn(p, s)) && (_(!0), setTimeout(() => _(!1), 1800));
  }, te = F(() => ((f == null ? void 0 : f.items) ?? []).filter((o) => !Ae(o)), [f]), ye = F(() => {
    if (f != null && f.progress) return f.progress;
    const o = te.filter((D) => D.kind !== "policy_precheck" && D.blocking);
    return {
      mandatory_total: o.length,
      mandatory_done: o.filter((D) => ["ok", "resolved", "waived"].includes(D.status)).length,
      to_request: o.filter((D) => D.status === "open").length,
      waiting: o.filter((D) => D.status === "requested").length
    };
  }, [f, te]), C = ye.mandatory_total, E = ye.mandatory_done, O = ye.to_request, B = ye.waiting, Z = F(() => te.filter((o) => o.status === "open" || o.status === "requested").length, [te]), Ie = F(() => ((p == null ? void 0 : p.drafts) ?? []).filter((o) => o.status === "draft"), [p]), ue = F(() => te.filter((o) => o.status === "waived"), [te]), de = (f == null ? void 0 : f.policy_checks) ?? [], Le = F(() => de.filter((o) => o.status === "not_met"), [de]), Pt = F(() => ((f == null ? void 0 : f.items) ?? []).find((o) => o.key === "policy:purpose"), [f]), Qe = F(
    () => te.filter((o) => o.rule_status === "FAIL" && o.status === "open").length,
    [te]
  ), Ye = F(() => ((w == null ? void 0 : w.documents) ?? []).filter((o) => !o.type).length, [w]), ke = F(
    () => te.filter((o) => o.status === "open" && o.blocking || o.status === "requested" && o.due_date && o.due_date < ((f == null ? void 0 : f.as_of) ?? "")),
    [te, f]
  ), ze = F(
    () => te.filter((o) => Ke(o) && (o.status === "open" || o.status === "requested")).map((o) => o.key),
    [te]
  );
  re(() => {
    v({ customerName: fe, readOnly: ie, hasOpenItems: ze.length > 0 });
  }, [fe, ie, ze.length, v]);
  const ht = J(() => {
  });
  ht.current = () => ce(ze, "email", !1), re(() => (m(() => ht.current()), () => m(null)), [m]);
  const ut = F(() => new Map(((f == null ? void 0 : f.profile) ?? []).map((o) => [o.path, o.value])), [f]), Ot = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Danh mục kiểm tra", count: Z || void 0 },
    { key: "docs", label: "Chứng từ", count: (w == null ? void 0 : w.documents.length) || void 0 },
    { key: "drafts", label: "Thư yêu cầu KH", count: Ie.length || (p == null ? void 0 : p.drafts.length) || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: h, children: [
          /* @__PURE__ */ e(cn, { size: 14 }),
          " Danh mục hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: Ve }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          f && /* @__PURE__ */ e(kt, { stage: f.stage }),
          (f == null ? void 0 : f.checklist_overall) && /* @__PURE__ */ e(
            X,
            {
              t: Xe(f.checklist_overall).tone,
              title: `Kiểm tra quy tắc Master Checklist: ${zn(f.checklist_counts)}`,
              children: Xe(f.checklist_overall).label
            }
          ),
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          w && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            w.flow
          ] }),
          ee.tax_id && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "MST ",
            String(ee.tax_id)
          ] }),
          ee.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(ee.industry_code)
          ] }),
          Y.product_code && /* @__PURE__ */ e("span", { className: "sme-chip", children: String(Y.product_code) }),
          Y.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: it[Y.purpose] ?? Y.purpose }),
          w && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Khởi tạo ",
            Me(w.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(S, { onClick: () => G(), busy: $, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e($t, { size: 14 }) }),
        /* @__PURE__ */ n(
          S,
          {
            className: r ? "sme-toggle-on" : void 0,
            "aria-pressed": r,
            onClick: c,
            title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
            children: [
              /* @__PURE__ */ e(Te, { size: 14 }),
              " Trợ lý hồ sơ"
            ]
          }
        ),
        ie ? /* @__PURE__ */ n(S, { onClick: () => b(""), children: [
          /* @__PURE__ */ e(ft, { size: 14 }),
          " Mở lại hồ sơ"
        ] }) : /* @__PURE__ */ n(S, { primary: !0, onClick: () => {
          U(""), b(null);
        }, children: [
          /* @__PURE__ */ e(Ee, { size: 14 }),
          " ",
          f != null && f.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
        ] })
      ] })
    ] }),
    T && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(_t, { title: "Có lỗi khi làm việc với hồ sơ", children: T }) }),
    !p && !T && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" })
    ] }),
    p && w && f && /* @__PURE__ */ n(Se, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          pe,
          {
            icon: /* @__PURE__ */ e(dn, { size: 18 }),
            label: "Số tiền đề nghị",
            value: Y.amount ? Et(Y.amount).replace(" đ", "") : "—",
            hint: [Y.term_months ? `${Y.term_months} tháng` : null, Y.product_code, "VND"].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e(
          pe,
          {
            t: f.readiness.ready ? "ok" : O > 0 ? "danger" : "warn",
            icon: /* @__PURE__ */ e(mn, { size: 18 }),
            label: "Hạng mục bắt buộc (A–I)",
            value: `${E} / ${C}`,
            hint: `${O} cần bổ sung · ${B} chờ KH`
          }
        ),
        /* @__PURE__ */ e(
          pe,
          {
            t: Qe ? "danger" : Ye ? "warn" : w.documents.length ? "ok" : "muted",
            icon: /* @__PURE__ */ e(St, { size: 18 }),
            label: "Chứng từ lưu trữ",
            value: w.documents.length,
            hint: Qe ? `${Qe} không đạt rule` : Ye ? `${Ye} chưa phân loại` : "Đã đối chiếu danh mục"
          }
        ),
        /* @__PURE__ */ e(
          pe,
          {
            t: de.length === 0 ? "muted" : Le.length > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(hn, { size: 18 }),
            label: "Điều kiện chính sách",
            value: de.length === 0 ? "—" : Le.length > 0 ? `${Le.length} chưa đạt` : "Đạt sơ bộ",
            hint: de.length > 0 ? `${de.length} tiêu chí · ${Y.product_code ?? ""}` : "Chưa chọn mã sản phẩm"
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(
        Bn,
        {
          groups: f.groups,
          activeGroup: a,
          onSelectGroup: (o) => {
            z(o), y("checklist");
          }
        }
      ) }),
      L !== null && w.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-warn", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Mở lại hồ sơ đã bàn giao" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: "Chỉ mở lại khi bộ phận Thẩm định yêu cầu bổ sung chứng từ mới. Ghi rõ lý do để lưu nhật ký kiểm toán." }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: L,
            onChange: (o) => b(o.target.value),
            placeholder: "Ví dụ: Thẩm định yêu cầu bổ sung BCTC quý gần nhất"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(S, { onClick: () => b(null), children: "Huỷ" }),
          /* @__PURE__ */ n(S, { primary: !0, busy: K, disabled: !L.trim(), onClick: async () => {
            j(!0), await ae("/reopen", { note: L }) && (b(null), await G()), j(!1);
          }, children: [
            /* @__PURE__ */ e(ft, { size: 14 }),
            " Xác nhận mở lại"
          ] })
        ] })
      ] }),
      A !== null && !w.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: "Xác nhận bàn giao hồ sơ sang Thẩm định (LOS)" }),
          /* @__PURE__ */ n(S, { onClick: Re, children: [
            x ? /* @__PURE__ */ e(Ue, { size: 13 }) : /* @__PURE__ */ e(Ge, { size: 13 }),
            " ",
            x ? "Đã chép phiếu" : "Sao chép phiếu bàn giao LOS"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { margin: "6px 0 8px" }, children: [
          "Hạng mục áp dụng: ",
          /* @__PURE__ */ n("b", { children: [
            E,
            "/",
            C
          ] }),
          " · Chứng từ: ",
          /* @__PURE__ */ e("b", { children: w.documents.length }),
          " · Xin miễn: ",
          /* @__PURE__ */ e("b", { children: ue.length }),
          " · Cảnh báo sơ bộ: ",
          /* @__PURE__ */ e("b", { children: Le.length }),
          ". Hệ thống sẽ đồng bộ hồ sơ và chứng từ sang ứng dụng ",
          /* @__PURE__ */ e("b", { children: "Thẩm định SME" }),
          " qua Handover Adapter.",
          f.readiness.ready ? " Ghi chú bàn giao không bắt buộc." : ` Còn ${f.readiness.blocking_open.length} mục chặn nên bắt buộc ghi giải trình.`
        ] }),
        ue.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ e("b", { children: "Mục xin miễn:" }),
          " ",
          ue.map((o) => `${o.title} (${o.note})`).join("; ")
        ] }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: A,
            onChange: (o) => U(o.target.value),
            placeholder: f.readiness.ready ? "Ghi chú bàn giao (tuỳ chọn)" : "Ghi rõ giải trình khi trình dù còn hạng mục chặn (bắt buộc)"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(S, { onClick: () => U(null), children: "Huỷ" }),
          /* @__PURE__ */ n(
            S,
            {
              primary: !0,
              busy: Q,
              disabled: !f.readiness.ready && !A.trim(),
              onClick: async () => {
                R(!0), await ae("/submitted", { note: A }) && (U(null), await G()), R(!1);
              },
              children: [
                /* @__PURE__ */ e(Ee, { size: 14 }),
                " Xác nhận đã bàn giao"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Ot.map((o) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": d === o.key,
              className: `sme-tab ${d === o.key ? "on" : ""}`,
              onClick: () => y(o.key),
              children: [
                o.label,
                o.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: o.count })
              ]
            },
            o.key
          )) }),
          d === "overview" && /* @__PURE__ */ e(
            Yn,
            {
              detail: p,
              catalog: s,
              pendingDraftsCount: Ie.length,
              purposeWarn: Pt,
              readOnly: ie,
              goDrafts: () => y("drafts"),
              onAction: We,
              onChat: $e
            }
          ),
          d === "checklist" && /* @__PURE__ */ e(
            Vn,
            {
              items: f.items,
              asOf: f.as_of,
              catalog: s,
              groupFilter: a,
              onClearGroup: () => z(null),
              readOnly: ie,
              onSet: oe,
              onBatchRequested: le,
              onDraft: ce,
              onOpenDoc: (o) => {
                W(o), y("docs");
              }
            }
          ),
          d === "docs" && /* @__PURE__ */ e(
            Jn,
            {
              docs: w.documents,
              items: f.items,
              profile: f.profile,
              catalog: s,
              focusDocId: q,
              readOnly: ie,
              onDownload: P,
              onRemove: l,
              onExtractDoc: (o) => g(`Đọc lại và cập nhật thông tin từ chứng từ ${o} của hồ sơ ${t}.`, "prefill"),
              onUpload: () => g("", "attach")
            }
          ),
          d === "drafts" && /* @__PURE__ */ e(
            ts,
            {
              drafts: p.drafts,
              items: f.items,
              readOnly: ie,
              hasOpenItems: ze.length > 0,
              onCompose: (o) => ce(ze, o, !1),
              onSent: async (o, D) => {
                const ne = await ae(`/drafts/${o}/sent`, { due_date: D });
                return ne && await G(), ne;
              }
            }
          ),
          d === "audit" && /* @__PURE__ */ e(ns, { audit: p.audit })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Hạng mục cần xử lý" }),
              /* @__PURE__ */ e(X, { t: ke.length ? "warn" : "ok", children: ke.length })
            ] }),
            ke.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn hạng mục chặn mở." }),
            ke.slice(0, 6).map((o) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "sme-todo",
                onClick: () => {
                  z(o.group), y("checklist");
                },
                children: [
                  /* @__PURE__ */ e(X, { t: o.status === "requested" ? "danger" : "warn", children: o.status === "requested" ? "Quá hạn" : "Thiếu" }),
                  /* @__PURE__ */ e("span", { className: "sme-todo-text", children: o.title })
                ]
              },
              o.key
            )),
            ke.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => y("checklist"), children: [
              "Xem thêm ",
              ke.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Định danh & Tóm tắt" }),
            /* @__PURE__ */ e(Ce, { label: "Mã số thuế", children: String(ee.tax_id ?? "—") }),
            /* @__PURE__ */ e(Ce, { label: "CIF", children: String(ee.cif ?? "—") }),
            /* @__PURE__ */ e(Ce, { label: "Người đại diện", children: String(ee.legal_rep ?? "—") }),
            /* @__PURE__ */ e(Ce, { label: "Số năm hoạt động", children: He("facts.years_in_operation", ut.get("facts.years_in_operation") ?? ee.years_in_operation, s) }),
            /* @__PURE__ */ e(Ce, { label: "Vốn điều lệ", children: He("customer.charter_capital", ee.charter_capital, s) }),
            /* @__PURE__ */ e(Ce, { label: "Doanh thu gần nhất", children: He("facts.revenue_last_year", ut.get("facts.revenue_last_year"), s) }),
            Y.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(Y.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 8 }, children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Bàn giao LOS" }),
              /* @__PURE__ */ e(kt, { stage: f.stage })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: ue.length > 0 ? `${ue.length} mục xin miễn kèm giải trình.` : "Chưa có mục xin miễn." }),
            /* @__PURE__ */ n(S, { onClick: Re, children: [
              x ? /* @__PURE__ */ e(Ue, { size: 13 }) : /* @__PURE__ */ e(Ge, { size: 13 }),
              " ",
              x ? "Đã chép phiếu" : "Chép phiếu bàn giao"
            ] }),
            !ie && /* @__PURE__ */ n(S, { primary: !0, onClick: () => {
              U(""), b(null);
            }, children: [
              /* @__PURE__ */ e(Ee, { size: 13 }),
              " ",
              f.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
            ] })
          ] }),
          p.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(un, { size: 13 }),
            " Hoạt động gần nhất ",
            Me(p.audit[p.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
Sn();
Fn();
const wt = "sme-sales:coach-open", Nt = "sme-sales:coach-width";
function ds() {
  const t = rt(), [s, r] = N(null), [i, h] = N(null), [c, g] = N(() => bn(wt)), [v, m] = N(() => xn(Nt)), [k, p] = N(null), [u, T] = N(null), [I, $] = N(null), M = J(0), d = J(null), { syncTick: y } = kn(c, 4e3);
  re(() => {
    t.get(`${qe}/catalog`).then(h).catch(() => h(null));
  }, [t]);
  const a = se((b) => {
    g((K) => {
      const j = typeof b == "function" ? b(K) : b;
      return vn(wt, j), j;
    });
  }, []), z = se((b) => {
    const K = ct(b);
    m(K), yn(Nt, K);
  }, []), q = se((b, K = "prefill") => {
    a(!0), p({ id: ++M.current, prompt: b, mode: K });
  }, [a]), W = se(() => {
    p(null);
  }, []), A = se((b) => {
    $(null), T(null), r(b);
  }, []), U = se(() => {
    T(null), r(null);
  }, []), Q = se((b) => {
    T((K) => K === b || K && b && K.customerName === b.customerName && K.readOnly === b.readOnly && K.hasOpenItems === b.hasOpenItems ? K : b);
  }, []), R = se((b) => {
    d.current = b;
  }, []), L = se(() => {
    var b;
    (b = d.current) == null || b.call(d);
  }, []);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: s ? /* @__PURE__ */ e(
      ss,
      {
        caseId: s,
        catalog: i,
        coachOpen: c,
        syncTick: y,
        onBack: U,
        onToggleCoach: () => a((b) => !b),
        onAskCoach: q,
        onCaseMetaChange: Q,
        onRegisterQuickDraft: R
      }
    ) : /* @__PURE__ */ e(
      Xn,
      {
        onOpen: A,
        catalog: i,
        coachOpen: c,
        syncTick: y,
        onToggleCoach: () => a((b) => !b),
        onAskCoach: q,
        onCreatedCase: $
      }
    ) }),
    c && /* @__PURE__ */ e(
      An,
      {
        width: v,
        onWidthChange: z,
        onClose: () => a(!1),
        caseId: s,
        customerName: s ? u == null ? void 0 : u.customerName : void 0,
        readOnly: s ? !!(u != null && u.readOnly) : !1,
        hasOpenItems: s ? !!(u != null && u.hasOpenItems) : !1,
        intent: k,
        onConsumeIntent: W,
        createdCase: I,
        onOpenCase: A,
        onDismissCreatedCase: () => $(null),
        onQuickDraft: s && (u != null && u.hasOpenItems) && !u.readOnly ? L : void 0
      }
    )
  ] }) });
}
export {
  ds as default
};
