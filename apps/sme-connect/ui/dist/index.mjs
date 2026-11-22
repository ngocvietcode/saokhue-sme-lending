import { jsxs as s, jsx as e, Fragment as je } from "react/jsx-runtime";
import * as ke from "@kirocrew/app-sdk";
import { useChatLauncher as cs, useAppApi as oe } from "@kirocrew/app-sdk";
import { Btn as k } from "@kirocrew/app-sdk/ui";
import { MessageSquare as Se, Plus as We, ExternalLink as Ne, PanelRightClose as ls, ArrowRight as ue, Sparkles as we, ShieldCheck as Xe, CloudDownload as ye, FolderKanban as os, FileSpreadsheet as Qe, Building2 as ds, CheckCircle2 as he, Search as Je, X as Ze, Play as ms, Bot as hs, FileCheck2 as ps, Download as fe, Upload as Te, Wand2 as us, FileDiff as gs, QrCode as vs, Zap as Ye, FileSignature as bs, MessageSquarePlus as fs, Send as es, Eye as ss, EyeOff as ns, Lock as Me, ShieldAlert as xs, Check as Le, AlertCircle as Ns, AlertTriangle as ys, FileText as ks, ArrowLeft as Oe, FileOutput as ws, Save as _s, RefreshCw as Cs, Shuffle as Ss, Ban as Ts, Layers as zs, History as Bs } from "lucide-react";
import { useRef as ne, useCallback as ce, useState as x, useMemo as xe, useEffect as le } from "react";
const As = (n) => n.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function Es(n, l, p) {
  const w = cs(), S = ne(w);
  S.current = w;
  const o = ne(p);
  return o.current = p, ce(
    async (m, _, C) => {
      var h;
      const A = S.current, { openChat: f } = A, g = A.createChat;
      if (!g) {
        f({ autoSend: !1, message: m });
        return;
      }
      try {
        const v = await g({ slotKey: l + As(_), agent: n, title: C });
        f({ slotKey: v, autoSend: !1, message: m });
      } catch (v) {
        (h = o.current) == null || h.call(o, `Không mở được chat với trợ lý: ${v instanceof Error ? v.message : String(v)}`);
      }
    },
    [n, l]
  );
}
const be = new Intl.NumberFormat("vi-VN"), _e = (n) => typeof n == "number" ? be.format(n) + " đ" : "—", ae = (n) => typeof n != "number" ? "—" : Math.abs(n) >= 1e9 ? be.format(Math.round(n / 1e7) / 100) + " tỷ" : Math.abs(n) >= 1e6 ? be.format(Math.round(n / 1e4) / 100) + " triệu" : be.format(n) + " đ", ze = (n) => {
  if (!n) return "—";
  const l = new Date(n);
  return Number.isNaN(l.getTime()) ? "—" : l.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, Is = (n) => {
  if (!n) return "—";
  const l = /^(\d{4})-(\d{2})-(\d{2})$/.exec(n.trim());
  if (l) return `${Number(l[3])}/${Number(l[2])}/${l[1]}`;
  const p = new Date(n);
  return Number.isNaN(p.getTime()) ? "—" : p.toLocaleDateString("vi-VN");
}, $s = (n) => {
  if (!n) return "—";
  const l = new Date(n).getTime();
  if (Number.isNaN(l)) return "—";
  const p = Math.round((Date.now() - l) / 1e3);
  return p < 60 ? "vừa xong" : p < 3600 ? `${Math.floor(p / 60)} phút trước` : p < 86400 ? `${Math.floor(p / 3600)} giờ trước` : `${Math.floor(p / 86400)} ngày trước`;
}, R = (n) => n instanceof Error ? n.message : String(n), Ce = "kirocrew_prefill", Pe = (n) => n.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), Ds = (n, l) => {
};
function Be(n) {
  return Math.min(620, Math.max(360, Math.round(n)));
}
function Ms(n) {
  try {
    const l = localStorage.getItem(n);
    if (l === "1") return !0;
    if (l === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function Ls(n, l) {
  try {
    localStorage.setItem(n, l ? "1" : "0");
  } catch {
  }
}
function Os(n, l = 420) {
  try {
    const p = Number(localStorage.getItem(n));
    if (Number.isFinite(p) && p >= 360 && p <= 620) return Math.round(p);
  } catch {
  }
  return l;
}
function Ps(n, l) {
  try {
    localStorage.setItem(n, String(Be(l)));
  } catch {
  }
}
function Ks(n, l = 4e3) {
  const p = ke.useAppEvents ?? Ds, [w, S] = x(0), o = ce(() => S((m) => m + 1), []);
  return p("tool_result", o), p("chat_done", o), le(() => {
    if (!n) return;
    const m = window.setInterval(() => {
      document.visibilityState !== "hidden" && S((_) => _ + 1);
    }, l);
    return () => window.clearInterval(m);
  }, [n, l]), { syncTick: w, bumpSync: o };
}
function Rs(n) {
  try {
    const l = sessionStorage.getItem(n);
    if (l) return l;
    const p = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(n, p), p;
  } catch {
    return "intake-default";
  }
}
function Hs(n, l) {
  try {
    sessionStorage.setItem(n, l);
  } catch {
  }
}
function me(n) {
  return n ? n.querySelector("[data-composer-input]") ?? n.querySelector("textarea") : null;
}
function ge(n) {
  return n ? n instanceof HTMLTextAreaElement ? n.value : n.textContent ?? "" : "";
}
function ve(n) {
  if (!n) return;
  if (n.focus(), n instanceof HTMLTextAreaElement) {
    const p = n.value.length;
    n.setSelectionRange(p, p);
    return;
  }
  const l = window.getSelection();
  l && (l.selectAllChildren(n), l.collapseToEnd());
}
function Ke(n, l) {
  const p = Date.now();
  try {
    sessionStorage.setItem(Ce, JSON.stringify({ slotKey: n, prompt: l, ts: p }));
  } catch {
  }
  return p;
}
function qs({
  storagePrefix: n,
  chatPrefix: l,
  agent: p,
  panelLabel: w,
  newIntakePrompt: S,
  newSessionTitle: o,
  caseTitlePrefix: m = "Hồ sơ",
  chips: _ = [],
  showNewSessionButton: C,
  attachDefaultPrefix: A,
  embedPlaceholder: f,
  width: g,
  onWidthChange: h,
  onClose: v,
  caseId: u,
  customerName: r,
  intent: c,
  onConsumeIntent: z,
  createdCase: E,
  onOpenCase: q,
  onDismissCreatedCase: L
}) {
  const D = ke, b = D.ChatPanel, O = D.ChatEmbed, ie = ke.useChatLauncher(), ee = Es(p, l), Y = `${n}:intake-id`, [U, te] = x(() => Rs(Y)), V = u ?? U, F = l + Pe(V), W = xe(() => u ? r ? `${m} ${r} (${u})` : `${m} ${u}` : o, [u, r, o, m]), [H, Q] = x(null), [d, B] = x(null), P = ne(null);
  P.current = H;
  const a = ne(ie);
  a.current = ie, le(() => {
    let T = !1;
    B(null);
    const $ = P.current === F, j = a.current.createChat;
    if (!j) {
      $ || Q(F);
      return;
    }
    return $ || Q(null), j({ slotKey: F, agent: p, title: W }).then((G) => {
      if (T) return;
      const Z = G || F;
      P.current !== Z && Q(Z);
    }).catch((G) => {
      T || $ || B(R(G));
    }), () => {
      T = !0;
    };
  }, [F, p, W]);
  const t = ne(null), N = ne(0), I = ne(null), K = ne(!1), [se, i] = x(0), y = ce((T, $) => {
    const j = $.trim();
    if (!j) return;
    const G = me(t.current);
    if (P.current === T && G) {
      ge(G).trim().includes(j) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: $ } })), requestAnimationFrame(() => ve(me(t.current)));
      return;
    }
    const Z = Ke(T, $);
    I.current = { slotKey: T, prompt: $, ts: Z }, i((Ie) => Ie + 1);
  }, []);
  le(() => {
    const T = I.current;
    if (!T || H !== T.slotKey) return;
    let $ = 0, j = 0;
    const G = window.setInterval(() => {
      $ += 1;
      const Z = me(t.current);
      if (!Z) {
        $ >= 20 && (window.clearInterval(G), I.current = null);
        return;
      }
      if (ge(Z).trim().includes(T.prompt.trim())) {
        I.current = null, window.clearInterval(G), ve(Z);
        return;
      }
      if (j += 1, j >= 3) {
        try {
          const $e = sessionStorage.getItem(Ce);
          if ($e) {
            const De = JSON.parse($e);
            De.slotKey === T.slotKey && De.ts === T.ts && sessionStorage.removeItem(Ce);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: T.prompt } })), I.current = null, window.clearInterval(G), requestAnimationFrame(() => ve(me(t.current)));
      }
    }, 60);
    return () => window.clearInterval(G);
  }, [H, se]), le(() => {
    if (!K.current || !H) return;
    let T = 0;
    const $ = () => {
      var Z;
      const G = (Z = t.current) == null ? void 0 : Z.querySelector('input[type="file"]');
      return G ? (K.current = !1, G.click(), !0) : !1;
    };
    if ($()) return;
    const j = window.setInterval(() => {
      T += 1, ($() || T >= 16) && (K.current = !1, window.clearInterval(j));
    }, 50);
    return () => window.clearInterval(j);
  }, [H, se]);
  const X = ce((T) => {
    const $ = `intake-${Date.now().toString(36)}`, j = l + Pe($);
    if (Hs(Y, $), L(), T) {
      const G = Ke(j, T);
      I.current = { slotKey: j, prompt: T, ts: G }, i((Z) => Z + 1);
    }
    te($);
  }, [l, Y, L]);
  le(() => {
    var T;
    if (!(!c || c.id === N.current)) {
      if (N.current = c.id, c.mode === "new_intake") {
        const $ = me(t.current), j = ge($).trim(), G = (c.prompt || S).trim();
        u === null && j === G && $ ? ve($) : X(c.prompt || S), z();
        return;
      }
      if (c.mode === "attach") {
        const $ = me(t.current), j = A ?? (u ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${u}: ` : "");
        j && !ge($).trim() && y(F, j);
        const G = (T = t.current) == null ? void 0 : T.querySelector('input[type="file"]');
        G ? (K.current = !1, G.click()) : (K.current = !0, i((Z) => Z + 1)), z();
        return;
      }
      y(F, c.prompt), z();
    }
  }, [
    c,
    u,
    F,
    S,
    A,
    z,
    y,
    X
  ]);
  const [re, J] = x(!1), de = ne(null), as = (T) => {
    T.preventDefault(), T.currentTarget.setPointerCapture(T.pointerId), de.current = { startX: T.clientX, startW: g, pointerId: T.pointerId }, J(!0);
  }, is = (T) => {
    const $ = de.current;
    !$ || $.pointerId !== T.pointerId || h(Be($.startW + ($.startX - T.clientX)));
  }, Ee = (T) => {
    var $;
    (($ = de.current) == null ? void 0 : $.pointerId) === T.pointerId && (de.current = null, J(!1));
  }, rs = C ?? !u;
  return /* @__PURE__ */ s("aside", { ref: t, className: "sme-dock", style: { width: g }, "aria-label": w, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${re ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: as,
        onPointerMove: is,
        onPointerUp: Ee,
        onPointerCancel: Ee
      }
    ),
    /* @__PURE__ */ s("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ s("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ s("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e(Se, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          u ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: u }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: w })
        ] }),
        _.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: _.map((T) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              T.onClick ? T.onClick() : T.prompt && y(F, T.prompt);
            },
            children: T.label
          },
          T.label
        )) })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        rs && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => X(), children: /* @__PURE__ */ e(We, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => ee("", V, W),
            children: /* @__PURE__ */ e(Ne, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: v, children: /* @__PURE__ */ e(ls, { size: 15 }) })
      ] })
    ] }),
    !u && E && /* @__PURE__ */ s("div", { className: "sme-dock-new-banner", children: [
      /* @__PURE__ */ s("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: E.name }),
        " ",
        /* @__PURE__ */ s("span", { className: "sme-mono", children: [
          "(",
          E.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ s(k, { primary: !0, onClick: () => q(E.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(ue, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: d ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ s("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: d }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ s(k, { onClick: () => ee("", V, W), children: [
        /* @__PURE__ */ e(Ne, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : H ? b ? /* @__PURE__ */ e(b, { slotKey: H, conversationOnly: !0 }, H) : O ? /* @__PURE__ */ e(
      O,
      {
        slotKey: H,
        agent: p,
        frameless: !0,
        startAtBottom: !0,
        placeholder: f
      },
      H
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ s("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ s(k, { primary: !0, onClick: () => ee("", V, W), children: [
        /* @__PURE__ */ e(Ne, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ s("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const Fs = `
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
function Vs() {
  const n = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(n)) return;
  const l = document.createElement("style");
  l.id = n, l.textContent = Fs, document.head.appendChild(l);
}
const M = "/apps/sme-connect/api", Gs = "smec-copilot", Us = "sme-connect-chat-";
async function Ae(n) {
  const l = await n.arrayBuffer(), p = new Uint8Array(l);
  let w = "";
  const S = 32768;
  for (let o = 0; o < p.length; o += S)
    w += String.fromCharCode(...p.subarray(o, o + S));
  return btoa(w);
}
function pe(n, l, p) {
  const w = atob(p), S = new Uint8Array(w.length);
  for (let C = 0; C < w.length; C++) S[C] = w.charCodeAt(C);
  const o = new Blob([S], { type: l }), m = URL.createObjectURL(o), _ = document.createElement("a");
  _.href = m, _.download = n, document.body.appendChild(_), _.click(), document.body.removeChild(_), setTimeout(() => URL.revokeObjectURL(m), 1500);
}
function js({
  catalog: n,
  assistantOpen: l,
  syncTick: p,
  onOpen: w,
  onToggleAssistant: S,
  onAskAssistant: o
}) {
  var se;
  const m = oe(), [_, C] = x([]), [A, f] = x(!0), [g, h] = x(""), [v, u] = x("ALL"), [r, c] = x(""), [z, E] = x(!1), [q, L] = x("new"), [D, b] = x("0108924510"), [O, ie] = x("17"), [ee, Y] = x(!0), [U, te] = x(null), [V, F] = x({}), [W, H] = x({}), [Q, d] = x(!1), B = ce(() => {
    m.get(`${M}/cases`).then((i) => {
      C(i.cases || []), h("");
    }).catch((i) => h(R(i))).finally(() => f(!1));
  }, [m]);
  le(() => {
    B();
  }, [B, p]);
  const P = xe(() => {
    const i = { ALL: _.length, DRAFT: 0, INITIATING: 0, APPROVED: 0, REJECTED: 0 };
    for (const y of _)
      y.list_status in i && (i[y.list_status] += 1);
    return i;
  }, [_]), a = xe(() => {
    const i = r.trim().toLowerCase();
    return _.filter((y) => v !== "ALL" && y.list_status !== v ? !1 : i ? y.customer_name.toLowerCase().includes(i) || y.smec_id.toLowerCase().includes(i) || (y.nclos_id || "").toLowerCase().includes(i) || y.tax_id.toLowerCase().includes(i) || y.cif.toLowerCase().includes(i) : !0);
  }, [_, v, r]), t = async () => {
    d(!0), h("");
    try {
      const i = Math.max(Number(O) || 10, 1) * 1e9, y = await m.post(`${M}/lookup`, {
        dkkd_no: D.trim(),
        requested_amount: i,
        has_collateral: ee
      });
      te(y);
      const X = {}, re = {};
      y.recommendations.filter((J) => J.eligible).slice(0, 2).forEach((J) => {
        X[J.code] = J.suggested_limit || 5e9, re[J.code] = !0;
      }), F(X), H(re);
    } catch (i) {
      h(R(i));
    } finally {
      d(!1);
    }
  }, N = async () => {
    if (!U) return;
    const i = U.recommendations.filter((y) => V[y.code] !== void 0);
    if (!i.length) {
      h("Vui lòng chọn ít nhất 01 sản phẩm đề xuất.");
      return;
    }
    if (i.some((y) => !W[y.code])) {
      h("Vui lòng xác nhận đủ Cam kết của CBBH cho từng sản phẩm được chọn.");
      return;
    }
    d(!0), h("");
    try {
      const y = i.map((J) => ({
        code: J.code,
        match_score: J.match_score || 88,
        proposed_limit: V[J.code],
        term_months: J.default_term_months,
        commitments_checked: !0
      })), X = y.reduce((J, de) => J + de.proposed_limit, 0), re = await m.post(`${M}/cases`, {
        dkkd_no: D.trim(),
        company_name: U.enterprise.company_name,
        requested_amount: X,
        has_collateral: ee,
        proposed_products: y
      });
      E(!1), w(re.case.case_id);
    } catch (y) {
      h(R(y));
    } finally {
      d(!1);
    }
  }, I = async (i) => {
    d(!0), h("");
    try {
      const y = await m.post(`${M}/cases/pull-nclos`, { nclos_id: i });
      E(!1), w(y.case.case_id);
    } catch (y) {
      h(R(y));
    } finally {
      d(!1);
    }
  }, K = ((se = _[0]) == null ? void 0 : se.seller) || {
    user_id: "Namcvt123",
    dao_code: "DAO8821",
    branch_name: "VPBank CN Đông Đô — Phòng SME 1",
    is_badbranch: !1
  };
  return /* @__PURE__ */ s("div", { className: "sme-scroll", children: [
    /* @__PURE__ */ s("div", { className: "smec-seller-bar", children: [
      /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", style: { gap: 14 }, children: [
        /* @__PURE__ */ s("span", { className: "sme-row sme-strong", children: [
          /* @__PURE__ */ e(we, { size: 16 }),
          " SME Connect · AI Lending Portal (Dual-Mode)"
        ] }),
        /* @__PURE__ */ s("span", { className: "sme-chip", children: [
          "CBBH: ",
          /* @__PURE__ */ e("b", { children: K.user_id || "Namcvt123" })
        ] }),
        /* @__PURE__ */ s("span", { className: "sme-chip", children: [
          "Mã DAO: ",
          /* @__PURE__ */ e("b", { children: K.dao_code || "DAO8821" })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-chip", children: K.branch_name || "CN Đông Đô" }),
        /* @__PURE__ */ s("span", { className: `sme-pill ${K.is_badbranch ? "t-danger" : "t-ok"}`, children: [
          /* @__PURE__ */ e(Xe, { size: 12 }),
          " ",
          K.is_badbranch ? "ĐVKD thuộc Badbranch" : "Badbranch: Không vi phạm"
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-row", children: [
        /* @__PURE__ */ s(k, { variant: "secondary", onClick: () => {
          L("nclos"), E(!0);
        }, children: [
          /* @__PURE__ */ e(ye, { size: 14 }),
          " Kéo hồ sơ từ NCLOS"
        ] }),
        /* @__PURE__ */ s(k, { variant: "primary", onClick: () => {
          L("new"), E(!0);
        }, children: [
          /* @__PURE__ */ e(We, { size: 14 }),
          " Tạo mới hồ sơ (Luồng A)"
        ] }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: S, children: [
          /* @__PURE__ */ e(Se, { size: 14 }),
          " ",
          l ? "Ẩn Copilot" : "Mở Copilot"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "sme-kpis", children: [
      /* @__PURE__ */ s("div", { className: "sme-kpi t-accent", onClick: () => u("ALL"), style: { cursor: "pointer" }, children: [
        /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: /* @__PURE__ */ e(os, { size: 18 }) }),
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: "Tổng hồ sơ SME Connect" }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: P.ALL }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: "Kho dữ liệu độc lập 100%" })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-kpi t-muted", onClick: () => u("DRAFT"), style: { cursor: "pointer" }, children: [
        /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: /* @__PURE__ */ e(Qe, { size: 18 }) }),
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: "Lưu nháp / Đang xử lý" }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: P.DRAFT }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: "Kiểm tra OCR, Mẫu B4 & 9 Agents" })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-kpi t-info", onClick: () => u("INITIATING"), style: { cursor: "pointer" }, children: [
        /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: /* @__PURE__ */ e(ds, { size: 18 }) }),
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: "Đang khởi tạo / Thương lượng" }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: P.INITIATING }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: "Đồng bộ NCLOS / ELOS & CPC" })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-kpi t-ok", onClick: () => u("APPROVED"), style: { cursor: "pointer" }, children: [
        /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: /* @__PURE__ */ e(he, { size: 18 }) }),
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: "Đã phê duyệt / Hoàn tất B2B" }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: P.APPROVED }),
          /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: "Chuyển Soạn thảo hợp đồng" })
        ] })
      ] })
    ] }),
    g && /* @__PURE__ */ e("div", { className: "sme-card", style: { borderColor: "var(--danger)", marginBottom: 12, color: "var(--danger)" }, children: g }),
    /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 14 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [
        ["ALL", `Tất cả (${P.ALL})`],
        ["DRAFT", `Lưu nháp (${P.DRAFT})`],
        ["INITIATING", `Đang khởi tạo (${P.INITIATING})`],
        ["APPROVED", `Đã phê duyệt (${P.APPROVED})`],
        ["REJECTED", `Bị từ chối / Huỷ (${P.REJECTED})`]
      ].map(([i, y]) => /* @__PURE__ */ e(
        "button",
        {
          className: `sme-filter ${v === i ? "on" : ""}`,
          onClick: () => u(i),
          children: y
        },
        i
      )) }),
      /* @__PURE__ */ s("div", { className: "sme-row", children: [
        /* @__PURE__ */ s("div", { className: "sme-search", children: [
          /* @__PURE__ */ e(Je, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e(
            "input",
            {
              value: r,
              onChange: (i) => c(i.target.value),
              placeholder: "Tìm Mã HS-..., NCLOS-..., Tên DN, MST, CIF..."
            }
          )
        ] }),
        /* @__PURE__ */ e(
          k,
          {
            variant: "ghost",
            onClick: () => o("Tổng hợp danh sách hồ sơ trên SME Connect, nêu rõ hồ sơ nào đang chờ xác nhận OCR/Mẫu B4 và hồ sơ nào đang chờ thương lượng Nghị quyết ELOS."),
            children: "Nhờ Copilot rà soát"
          }
        )
      ] })
    ] }),
    A ? /* @__PURE__ */ e("div", { className: "sme-card sme-muted", children: "Đang tải danh sách hồ sơ SME Connect..." }) : a.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-card sme-muted", children: "Không có hồ sơ khớp bộ lọc hiện tại." }) : /* @__PURE__ */ e("div", { className: "sme-cases", children: a.map((i) => /* @__PURE__ */ s("div", { className: "sme-card hover", onClick: () => w(i.case_id), children: [
      /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ e("span", { className: "sme-mono sme-strong", children: i.smec_id }),
          i.nclos_id && /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: i.nclos_id })
        ] }),
        /* @__PURE__ */ s("span", { className: `sme-pill t-${i.status_tone}`, children: [
          "• ",
          i.detail_status_label
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-h2", style: { marginBottom: 4 }, children: i.customer_name }),
      /* @__PURE__ */ s("div", { className: "sme-small sme-muted", style: { marginBottom: 10 }, children: [
        "ĐKKD/MST: ",
        /* @__PURE__ */ e("span", { className: "sme-mono", children: i.tax_id }),
        " · CIF: ",
        /* @__PURE__ */ e("span", { className: "sme-mono", children: i.cif })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-between", children: [
        /* @__PURE__ */ e("div", { className: "sme-case-amount", children: ae(i.total_proposed_limit) }),
        /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
          i.documents_count,
          " tài liệu · Bước ",
          i.wizard_step,
          "/5"
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: `sme-pipe t-${i.status_tone}`, children: [1, 2, 3, 4, 5].map((y) => /* @__PURE__ */ e("span", { className: y <= i.wizard_step ? "" : "none" }, y)) }),
      /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", style: { marginTop: 8 }, children: [
        i.proposed_products.map((y) => {
          var X;
          return /* @__PURE__ */ s("span", { className: "sme-chip", children: [
            ((X = y.name.split("—").pop()) == null ? void 0 : X.trim()) || y.code,
            ": ",
            /* @__PURE__ */ e("b", { children: ae(y.proposed_limit) })
          ] }, y.code);
        }),
        i.b2b_confirmed && /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "✓ Đã có B2B" })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-between sme-small sme-muted", style: { marginTop: 10 }, children: [
        /* @__PURE__ */ s("span", { children: [
          "Trạng thái DS: ",
          /* @__PURE__ */ e("b", { children: i.list_status_label })
        ] }),
        /* @__PURE__ */ s("span", { children: [
          "Cập nhật ",
          $s(i.updated_at)
        ] })
      ] })
    ] }, i.case_id)) }),
    z && /* @__PURE__ */ e("div", { className: "smec-modal-backdrop", onClick: () => E(!1), children: /* @__PURE__ */ s("div", { className: "smec-modal", onClick: (i) => i.stopPropagation(), children: [
      /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("h2", { className: "sme-h2", children: "Khởi tạo Hồ sơ Cấp tín dụng — SME Connect (Luồng A)" }),
        /* @__PURE__ */ e("button", { className: "sme-back", onClick: () => E(!1), children: /* @__PURE__ */ e(Ze, { size: 16 }) })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-tabs", children: [
        /* @__PURE__ */ s("button", { className: `sme-tab ${q === "new" ? "on" : ""}`, onClick: () => L("new"), children: [
          /* @__PURE__ */ e(we, { size: 14 }),
          " Tạo mới & Đề xuất gói đa sản phẩm"
        ] }),
        /* @__PURE__ */ s("button", { className: `sme-tab ${q === "nclos" ? "on" : ""}`, onClick: () => L("nclos"), children: [
          /* @__PURE__ */ e(ye, { size: 14 }),
          " Tải về hồ sơ đã có trên NCLOS"
        ] })
      ] }),
      q === "new" ? /* @__PURE__ */ s("div", { className: "sme-stack", children: [
        /* @__PURE__ */ s("div", { className: "smec-field-grid", children: [
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("label", { className: "sme-small sme-muted", children: "Số ĐKKD / Mã số thuế *" }),
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                value: D,
                onChange: (i) => b(i.target.value),
                placeholder: "VD: 0108924510 hoặc nhập MST bất kỳ"
              }
            )
          ] }),
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("label", { className: "sme-small sme-muted", children: "Tổng nhu cầu vốn dự kiến (Tỷ VNĐ) *" }),
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                type: "number",
                value: O,
                onChange: (i) => ie(i.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ e("div", { style: { display: "flex", alignItems: "end", gap: 8 }, children: /* @__PURE__ */ s("label", { className: "sme-row sme-small", style: { cursor: "pointer", paddingBottom: 6 }, children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: ee,
                onChange: (i) => Y(i.target.checked)
              }
            ),
            "Có tài sản bảo đảm (BĐS / Tiền gửi / PTVT)"
          ] }) })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row", children: [
          /* @__PURE__ */ e(k, { variant: "primary", onClick: t, disabled: Q || !D.trim(), children: Q ? "Đang tra cứu CIF & chấm điểm..." : "Tra cứu CIF & Đề xuất sản phẩm AI" }),
          /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
            "Gợi ý thử nhanh: ",
            /* @__PURE__ */ e("code", { children: "0108924510" }),
            " (Minh Phát) hoặc ",
            /* @__PURE__ */ e("code", { children: "0109412800" }),
            " (Sao Việt)"
          ] })
        ] }),
        U && /* @__PURE__ */ s("div", { className: "sme-stack", style: { marginTop: 6 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-card tight", style: { background: "color-mix(in srgb, var(--ok) 7%, var(--card))" }, children: /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
            /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", children: String(U.enterprise.company_name) }),
              /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
                "ĐKKD (khóa cứng): ",
                /* @__PURE__ */ e("b", { className: "sme-mono", children: String(U.enterprise.dkkd_no) }),
                " · Mã CIF (khóa cứng): ",
                /* @__PURE__ */ e("b", { className: "sme-mono", children: String(U.enterprise.cif) }),
                " · ĐDPL: ",
                /* @__PURE__ */ e("b", { children: String(U.enterprise.legal_rep_name || "—") })
              ] })
            ] }),
            /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "Đủ điều kiện phân luồng A" })
          ] }) }),
          /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Gói sản phẩm AI đề xuất (Chọn 1 hoặc nhiều sản phẩm dùng chung bộ hồ sơ)" }),
          U.recommendations.map((i) => {
            const y = V[i.code] !== void 0;
            return /* @__PURE__ */ s(
              "div",
              {
                className: "sme-card tight",
                style: {
                  opacity: i.eligible ? 1 : 0.55,
                  borderColor: y ? "var(--accent)" : void 0
                },
                children: [
                  /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
                    /* @__PURE__ */ s("label", { className: "sme-row sme-strong", style: { cursor: i.eligible ? "pointer" : "not-allowed" }, children: [
                      /* @__PURE__ */ e(
                        "input",
                        {
                          type: "checkbox",
                          disabled: !i.eligible,
                          checked: y,
                          onChange: (X) => {
                            const re = { ...V };
                            X.target.checked ? re[i.code] = i.suggested_limit || 2e9 : delete re[i.code], F(re);
                          }
                        }
                      ),
                      i.name,
                      !i.requires_collateral && /* @__PURE__ */ e("span", { className: "sme-pill t-info", children: "Tín chấp" })
                    ] }),
                    /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ s("span", { className: `sme-pill ${(i.match_score || 0) >= 85 ? "t-ok" : "t-warn"}`, children: [
                      "Độ phù hợp: ",
                      i.match_score,
                      "%"
                    ] }) })
                  ] }),
                  /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: i.highlights }),
                  y && /* @__PURE__ */ s("div", { className: "sme-stack", style: { paddingTop: 6, borderTop: "1px dashed var(--border)" }, children: [
                    /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
                      /* @__PURE__ */ e("span", { className: "sme-small", children: "Hạn mức đề xuất (VNĐ):" }),
                      /* @__PURE__ */ e(
                        "input",
                        {
                          className: "smec-input",
                          style: { maxWidth: 220 },
                          type: "number",
                          step: 1e8,
                          value: V[i.code],
                          onChange: (X) => F({
                            ...V,
                            [i.code]: Number(X.target.value) || 0
                          })
                        }
                      ),
                      /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
                        "(",
                        ae(V[i.code]),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ s("label", { className: "sme-row sme-small", style: { cursor: "pointer" }, children: [
                      /* @__PURE__ */ e(
                        "input",
                        {
                          type: "checkbox",
                          checked: !!W[i.code],
                          onChange: (X) => H({ ...W, [i.code]: X.target.checked })
                        }
                      ),
                      /* @__PURE__ */ s("span", { children: [
                        /* @__PURE__ */ e("b", { children: "Cam kết CBBH:" }),
                        " ",
                        i.commitments.join(" ")
                      ] })
                    ] })
                  ] })
                ]
              },
              i.code
            );
          }),
          /* @__PURE__ */ s("div", { className: "sme-between", style: { marginTop: 6 }, children: [
            /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
              "Tổng hạn mức gói đã chọn:",
              " ",
              /* @__PURE__ */ e("b", { children: ae(Object.values(V).reduce((i, y) => i + y, 0)) })
            ] }),
            /* @__PURE__ */ e(k, { variant: "primary", onClick: N, disabled: Q, children: "Khởi tạo hồ sơ & chuyển bước Upload →" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ s("div", { className: "sme-stack", children: [
        /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
          "Chọn bộ hồ sơ đã mở trên ",
          /* @__PURE__ */ e("b", { children: "NCLOS" }),
          " để kéo tự động thông tin khách hàng, mã CIF, danh mục sản phẩm và toàn bộ chứng từ đã tải lên về SME Connect:"
        ] }),
        ((n == null ? void 0 : n.nclos_importable) || []).map((i) => /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ s("div", { className: "sme-row", children: [
              /* @__PURE__ */ e("span", { className: "sme-mono sme-strong", children: i.nclos_id }),
              /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: i.elos_id })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-strong", style: { marginTop: 4 }, children: i.company_name }),
            /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
              "MST: ",
              i.dkkd_no,
              " · CIF: ",
              i.cif,
              " · Đã có ",
              i.documents_count,
              " tài liệu trên NCLOS · Tổng nhu cầu: ",
              /* @__PURE__ */ e("b", { children: ae(i.requested_total) })
            ] })
          ] }),
          /* @__PURE__ */ s(k, { variant: "primary", disabled: Q, onClick: () => I(i.nclos_id), children: [
            /* @__PURE__ */ e(ye, { size: 14 }),
            " Kéo về SME Connect"
          ] })
        ] }) }, i.nclos_id))
      ] })
    ] }) })
  ] });
}
function Ws({ data: n, onRefresh: l, onNextStep: p, onAskAssistant: w }) {
  var u;
  const S = oe(), [o, m] = x("financial"), [_, C] = x(!1), [A, f] = x(""), g = n.case.case_id, h = n.evaluation, v = async () => {
    C(!0), f("");
    try {
      const r = await S.post(`${M}/cases/${g}/evaluate`, {
        selected_groups: n.case.smec.selected_agent_groups
      });
      l(r);
    } catch (r) {
      f(R(r));
    } finally {
      C(!1);
    }
  };
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-h2", children: "Bước 3 · Hệ thống Tự động Đánh giá (Multi-Agent + Deterministic Verifier)" }),
          /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: h ? `Đã hoàn thành ${h.agents_completed}/${h.agents_total} Agent chuyên môn lúc ${ze(h.evaluated_at)} · Nhóm kích hoạt: ${h.selected_groups.join(", ").toUpperCase()}` : "Bấm chạy hệ thống đánh giá để kích hoạt các Agent đã chọn ở Bước 2 kèm kiểm chứng bằng chứng tất định." })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ s(k, { variant: "secondary", onClick: v, disabled: _, children: [
            /* @__PURE__ */ e(ms, { size: 14 }),
            " ",
            _ ? "Đang chạy đánh giá..." : h ? "Chạy lại đánh giá tức thì" : "Chạy hệ thống đánh giá"
          ] }),
          /* @__PURE__ */ s(
            k,
            {
              variant: "ghost",
              onClick: () => w(
                `Chạy workflow smec-credit-assessment cho hồ sơ ${g} với các nhóm agent ${JSON.stringify(n.case.smec.selected_agent_groups)} và tóm tắt kết quả kèm mã bằng chứng.`
              ),
              children: [
                /* @__PURE__ */ e(hs, { size: 14 }),
                " Chạy sâu qua Copilot (9 Agents)"
              ]
            }
          ),
          h && /* @__PURE__ */ s(k, { variant: "primary", onClick: p, children: [
            "Sang Bước 4 · Tạo Tờ trình ",
            /* @__PURE__ */ e(ue, { size: 14 })
          ] })
        ] })
      ] }),
      A && /* @__PURE__ */ e("div", { className: "sme-small", style: { color: "var(--danger)", marginTop: 8 }, children: A }),
      h && /* @__PURE__ */ e("div", { className: "sme-kpis", style: { marginTop: 14, marginBottom: 0 }, children: h.product_readiness.map((r) => /* @__PURE__ */ e("div", { className: `sme-kpi t-${r.tone}`, children: /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: r.name }),
        /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: ae(r.proposed_limit) }),
        /* @__PURE__ */ s("div", { className: "sme-kpi-hint", children: [
          "Độ phù hợp ",
          r.match_score,
          "% · ",
          /* @__PURE__ */ e("b", { children: r.readiness })
        ] })
      ] }) }, r.code)) })
    ] }),
    h ? /* @__PURE__ */ s("div", { className: "sme-detail", children: [
      /* @__PURE__ */ s("div", { className: "sme-card", children: [
        /* @__PURE__ */ s("div", { className: "sme-tabs", children: [
          /* @__PURE__ */ s("button", { className: `sme-tab ${o === "financial" ? "on" : ""}`, onClick: () => m("financial"), children: [
            "01 · Phân tích tài chính (",
            h.sections.financial.score,
            "/100)"
          ] }),
          /* @__PURE__ */ e("button", { className: `sme-tab ${o === "industry" ? "on" : ""}`, onClick: () => m("industry"), children: "02 · Ngành & Vị thế KH" }),
          /* @__PURE__ */ e("button", { className: `sme-tab ${o === "risk" ? "on" : ""}`, onClick: () => m("risk"), children: "03 · CIC & Rủi ro" }),
          h.sections.collateral.has_collateral && /* @__PURE__ */ e("button", { className: `sme-tab ${o === "collateral" ? "on" : ""}`, onClick: () => m("collateral"), children: "04 · Tài sản bảo đảm" })
        ] }),
        o === "financial" && /* @__PURE__ */ s("div", { className: "sme-stack", children: [
          /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
            /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ s("div", { className: "sme-h3", children: [
                "Điểm sức khỏe tài chính AI: ",
                h.sections.financial.score,
                "/100 — ",
                h.sections.financial.rating
              ] }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: h.sections.financial.summary })
            ] }),
            /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
              /* @__PURE__ */ e(Xe, { size: 12 }),
              " Đã kiểm chứng phép tính tất định"
            ] })
          ] }),
          /* @__PURE__ */ e("div", { className: "smec-field-grid", children: h.sections.financial.metrics.map((r, c) => /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: r.label }),
            /* @__PURE__ */ e("div", { className: "sme-strong", style: { fontSize: 15, margin: "4px 0" }, children: r.value }),
            /* @__PURE__ */ e("div", { className: "sme-small", style: { color: "var(--ok)" }, children: r.trend })
          ] }, c)) }),
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Kiểm tra quy tắc kế toán & đối chiếu chéo" }),
            /* @__PURE__ */ s("table", { className: "smec-table", children: [
              /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("th", { children: "Quy tắc kiểm chứng" }),
                /* @__PURE__ */ e("th", { children: "Kết quả" })
              ] }) }),
              /* @__PURE__ */ e("tbody", { children: h.sections.financial.accounting_checks.map((r, c) => /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("td", { children: r.rule }),
                /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("span", { className: `sme-pill ${r.status === "PASS" ? "t-ok" : "t-warn"}`, children: r.status }) })
              ] }, c)) })
            ] })
          ] })
        ] }),
        o === "industry" && /* @__PURE__ */ s("div", { className: "sme-stack", children: [
          /* @__PURE__ */ s("div", { className: "sme-h3", children: [
            "Ngành hoạt động: ",
            h.sections.industry.sector_name
          ] }),
          /* @__PURE__ */ s("div", { className: "smec-field-grid", children: [
            /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", style: { color: "var(--ok)", marginBottom: 6 }, children: "Điểm mạnh (Strengths)" }),
              /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12.5 }, children: h.sections.industry.swot.strengths.map((r, c) => /* @__PURE__ */ e("li", { children: r }, c)) })
            ] }),
            /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", style: { color: "var(--warn)", marginBottom: 6 }, children: "Điểm yếu (Weaknesses)" }),
              /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12.5 }, children: h.sections.industry.swot.weaknesses.map((r, c) => /* @__PURE__ */ e("li", { children: r }, c)) })
            ] }),
            /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", style: { color: "var(--info)", marginBottom: 6 }, children: "Cơ hội (Opportunities)" }),
              /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12.5 }, children: h.sections.industry.swot.opportunities.map((r, c) => /* @__PURE__ */ e("li", { children: r }, c)) })
            ] }),
            /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
              /* @__PURE__ */ e("div", { className: "sme-strong", style: { color: "var(--danger)", marginBottom: 6 }, children: "Thách thức (Threats)" }),
              /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12.5 }, children: h.sections.industry.swot.threats.map((r, c) => /* @__PURE__ */ e("li", { children: r }, c)) })
            ] })
          ] })
        ] }),
        o === "risk" && /* @__PURE__ */ s("div", { className: "sme-stack", children: [
          /* @__PURE__ */ s("div", { className: "smec-field-grid", children: [
            /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
              /* @__PURE__ */ s("div", { className: "sme-between", children: [
                /* @__PURE__ */ e("span", { className: "sme-strong", children: "Kiểm tra ĐVKD Badbranch (5 nhóm)" }),
                /* @__PURE__ */ e("span", { className: `sme-pill ${h.sections.risk.badbranch.is_badbranch ? "t-danger" : "t-ok"}`, children: h.sections.risk.badbranch.is_badbranch ? "Thuộc Badbranch" : "Không thuộc Badbranch" })
              ] }),
              /* @__PURE__ */ e("ul", { style: { margin: "6px 0 0", paddingLeft: 18, fontSize: 12 }, children: h.sections.risk.badbranch.groups.map((r, c) => /* @__PURE__ */ s("li", { children: [
                r.group,
                ": ",
                /* @__PURE__ */ e("b", { children: r.flagged ? "Vi phạm" : "Không" })
              ] }, c)) })
            ] }),
            /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
              /* @__PURE__ */ s("div", { className: "sme-between", children: [
                /* @__PURE__ */ e("span", { className: "sme-strong", children: "Kiểm soát sau vay (KSSV)" }),
                /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "0 chế tài hiệu lực" })
              ] }),
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 6 }, children: h.sections.risk.kssv_post_loan.summary })
            ] })
          ] }),
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Danh sách Cảnh báo Nội bộ & EWS Topdown" }),
            /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", children: h.sections.risk.internal_watchlists.map((r) => /* @__PURE__ */ s("span", { className: `sme-pill ${r.status === "CLEAR" ? "t-ok" : "t-danger"}`, title: r.detail, children: [
              "✓ ",
              r.label,
              ": ",
              r.status
            ] }, r.code)) })
          ] }),
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Quan hệ Tín dụng CIC Đa chủ thể (VPBank vs TCTD khác)" }),
            /* @__PURE__ */ e("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ s("table", { className: "smec-table", children: [
              /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("th", { children: "Vai trò" }),
                /* @__PURE__ */ e("th", { children: "Chủ thể" }),
                /* @__PURE__ */ e("th", { children: "Dư nợ vay VPB" }),
                /* @__PURE__ */ e("th", { children: "Dư nợ vay TCTD khác" }),
                /* @__PURE__ */ e("th", { children: "Thẻ TD (VPB / Khác)" }),
                /* @__PURE__ */ e("th", { children: "Nhóm nợ" }),
                /* @__PURE__ */ e("th", { children: "Lịch sử 24T" })
              ] }) }),
              /* @__PURE__ */ e("tbody", { children: h.sections.risk.cic_subjects.map((r, c) => /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("td", { children: r.role }),
                /* @__PURE__ */ e("td", { className: "sme-strong", children: r.name }),
                /* @__PURE__ */ e("td", { children: ae(r.vpb_loan) }),
                /* @__PURE__ */ e("td", { children: ae(r.other_loan) }),
                /* @__PURE__ */ s("td", { children: [
                  ae(r.vpb_card),
                  " / ",
                  ae(r.other_card)
                ] }),
                /* @__PURE__ */ e("td", { children: /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
                  "Nhóm ",
                  r.cic_group
                ] }) }),
                /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: r.history_24m })
              ] }, c)) })
            ] }) })
          ] })
        ] }),
        o === "collateral" && /* @__PURE__ */ s("div", { className: "sme-stack", children: [
          /* @__PURE__ */ s("div", { className: "sme-between", children: [
            /* @__PURE__ */ e("div", { className: "sme-h3", children: h.sections.collateral.summary }),
            h.sections.collateral.ltv_pct != null && /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
              "LTV: ",
              h.sections.collateral.ltv_pct,
              "%"
            ] })
          ] }),
          h.sections.collateral.assets.map((r, c) => /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
            /* @__PURE__ */ s("div", { className: "sme-between", children: [
              /* @__PURE__ */ s("span", { className: "sme-strong", children: [
                String(r.type_label || r.asset_type),
                " — ",
                String(r.asset_id || "")
              ] }),
              /* @__PURE__ */ e("span", { className: "sme-strong", children: _e(r.valuation_vnd) })
            ] }),
            /* @__PURE__ */ s("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
              String(r.description || ""),
              " · Chủ sở hữu: ",
              String(r.owner || ""),
              " · Định giá: ",
              String(r.valuation_agency || "Prosland"),
              " (",
              String(r.valuation_date || ""),
              ")"
            ] })
          ] }, c))
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-aside", children: [
        /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
          /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Căn cứ đánh giá (Nguồn & truy vết)" }),
          /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 8 }, children: (((u = h.sections[o]) == null ? void 0 : u.traceability) || []).map((r, c) => /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
            /* @__PURE__ */ s("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("span", { className: "sme-mono sme-strong", style: { color: "var(--accent)" }, children: r.ref }),
              /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "Đã xác minh" })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-strong", style: { marginTop: 4 }, children: r.source }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: r.detail })
          ] }, c)) })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
          /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Trạng thái Kiểm chứng 9 Agents" }),
          /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 6 }, children: Object.entries(n.results || {}).map(([r, c]) => {
            var z, E;
            return /* @__PURE__ */ s("div", { className: "sme-between sme-small", children: [
              /* @__PURE__ */ e("span", { className: "sme-mono", children: r }),
              /* @__PURE__ */ e("span", { className: `sme-pill ${(z = c.verification) != null && z.passed ? "t-ok" : "t-warn"}`, children: (E = c.verification) != null && E.passed ? `v${c._version || 1} PASS` : "UNVERIFIED" })
            ] }, r);
          }) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s("div", { className: "sme-card sme-muted", children: [
      "Chưa có kết quả đánh giá cho hồ sơ này. Bấm ",
      /* @__PURE__ */ e("b", { children: "“Chạy hệ thống đánh giá”" }),
      " ở góc trên để tổng hợp đầy đủ 4 chuyên đề (Tài chính, Ngành, CIC & Rủi ro, Tài sản bảo đảm) và căn cứ truy vết."
    ] })
  ] });
}
function Xs({ data: n, onRefresh: l, onSubmitLos: p }) {
  const w = oe(), S = ne(null), [o, m] = x(!1), [_, C] = x(""), A = n.case.case_id, f = n.proposal, g = async () => {
    m(!0), C("");
    try {
      const c = await w.post(`${M}/cases/${A}/proposal/generate`, {});
      l(c);
    } catch (c) {
      C(R(c));
    } finally {
      m(!1);
    }
  }, h = async () => {
    C("");
    try {
      const c = await w.get(
        `${M}/cases/${A}/proposal/download`
      );
      pe(c.name, c.mime, c.content_b64);
    } catch (c) {
      C(R(c));
    }
  }, v = async (c) => {
    if (c) {
      m(!0), C("");
      try {
        const z = await Ae(c), E = await w.post(`${M}/cases/${A}/proposal/upload`, {
          name: c.name,
          content_b64: z
        });
        l(E);
      } catch (z) {
        C(R(z));
      } finally {
        m(!1), S.current && (S.current.value = "");
      }
    }
  }, u = async () => {
    m(!0), C("");
    try {
      const c = await w.get(
        `${M}/cases/${A}/proposal/sample-edit`
      ), z = await w.post(`${M}/cases/${A}/proposal/upload`, {
        name: c.name,
        content_b64: c.content_b64
      });
      l(z);
    } catch (c) {
      C(R(c));
    } finally {
      m(!1);
    }
  }, r = async (c) => {
    m(!0), C("");
    try {
      const z = await w.post(`${M}/cases/${A}/proposal/confirm-diff`, {
        keys: c || null
      });
      l(z);
    } catch (z) {
      C(R(z));
    } finally {
      m(!1);
    }
  };
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-h2", children: "Bước 4 · Khởi tạo Tờ trình Đề xuất Cấp tín dụng & Đối sánh Thay đổi" }),
          /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
            "Biểu mẫu chuẩn VPBank ",
            /* @__PURE__ */ e("b", { children: "MB02.PL03.HDM-TD-CV.NA/05" }),
            " đính kèm mã QR xác thực bản gốc AI. Hỗ trợ tải về chỉnh sửa Word (.docx) và tải lên lại để hệ thống đối sánh tự động."
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ e(
            "input",
            {
              ref: S,
              type: "file",
              accept: ".docx",
              style: { display: "none" },
              onChange: (c) => {
                var z;
                return v((z = c.target.files) == null ? void 0 : z[0]);
              }
            }
          ),
          /* @__PURE__ */ s(k, { variant: f ? "secondary" : "primary", onClick: g, disabled: o, children: [
            /* @__PURE__ */ e(ps, { size: 14 }),
            " ",
            f ? "Tạo lại Tờ trình gốc (v1)" : "Khởi tạo Tờ trình tự động"
          ] }),
          f && /* @__PURE__ */ s(je, { children: [
            /* @__PURE__ */ s(k, { variant: "secondary", onClick: h, children: [
              /* @__PURE__ */ e(fe, { size: 14 }),
              " Tải Word (.docx)"
            ] }),
            /* @__PURE__ */ s(k, { variant: "secondary", onClick: () => {
              var c;
              return (c = S.current) == null ? void 0 : c.click();
            }, disabled: o, children: [
              /* @__PURE__ */ e(Te, { size: 14 }),
              " Upload bản CBBH sửa (.docx)"
            ] }),
            /* @__PURE__ */ s(k, { variant: "ghost", onClick: u, disabled: o, children: [
              /* @__PURE__ */ e(us, { size: 14 }),
              " Giả lập CBBH upload bản sửa"
            ] }),
            /* @__PURE__ */ s(
              k,
              {
                variant: "primary",
                disabled: o || !f.all_diffs_confirmed,
                onClick: p,
                children: [
                  "Trình duyệt hồ sơ lên LOS ",
                  /* @__PURE__ */ e(ue, { size: 14 })
                ]
              }
            )
          ] })
        ] })
      ] }),
      _ && /* @__PURE__ */ e("div", { className: "sme-small", style: { color: "var(--danger)", marginTop: 8 }, children: _ })
    ] }),
    f && f.diffs.length > 0 && /* @__PURE__ */ s(
      "div",
      {
        className: "sme-card",
        style: {
          borderColor: f.all_diffs_confirmed ? "var(--ok)" : "var(--warn)",
          background: f.all_diffs_confirmed ? "color-mix(in srgb, var(--ok) 6%, var(--card))" : "color-mix(in srgb, var(--warn) 7%, var(--card))"
        },
        children: [
          /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 10 }, children: [
            /* @__PURE__ */ s("div", { className: "sme-row sme-strong", children: [
              /* @__PURE__ */ e(gs, { size: 16 }),
              "Hệ thống đã thực hiện đối sánh (",
              f.diffs.length,
              " trường thay đổi giữa Hệ thống tạo và CBBH cập nhật)"
            ] }),
            f.all_diffs_confirmed ? /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "✓ Đã xác nhận đủ thay đổi — Sẵn sàng trình duyệt" }) : /* @__PURE__ */ s(k, { variant: "primary", onClick: () => r(), disabled: o, children: [
              /* @__PURE__ */ e(he, { size: 14 }),
              " Xác nhận toàn bộ thay đổi"
            ] })
          ] }),
          /* @__PURE__ */ s("table", { className: "smec-table", children: [
            /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
              /* @__PURE__ */ e("th", { children: "Chỉ tiêu trên Tờ trình" }),
              /* @__PURE__ */ e("th", { children: "Hệ thống tạo (v1 AI)" }),
              /* @__PURE__ */ s("th", { children: [
                "CBBH cập nhật (v",
                f.current_version,
                ")"
              ] }),
              /* @__PURE__ */ e("th", { children: "Trạng thái" })
            ] }) }),
            /* @__PURE__ */ e("tbody", { children: f.diffs.map((c) => /* @__PURE__ */ s("tr", { children: [
              /* @__PURE__ */ e("td", { className: "sme-strong", children: c.label }),
              /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: c.system_value }),
              /* @__PURE__ */ e("td", { className: "sme-small", style: { fontWeight: 600 }, children: c.cbbh_value }),
              /* @__PURE__ */ e("td", { children: c.confirmed ? /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
                "✓ Đã xác nhận (",
                c.confirmed_by,
                ")"
              ] }) : /* @__PURE__ */ e("button", { className: "sme-ref", onClick: () => r([c.key]), children: "Xác nhận dòng này" }) })
            ] }, c.key)) })
          ] })
        ]
      }
    ),
    f && /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 14 }, children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "NGÂN HÀNG TMCP VIỆT NAM THỊNH VƯỢNG (VPBANK) — KHỐI SME" }),
          /* @__PURE__ */ e("div", { className: "sme-h2", style: { fontSize: 17, margin: "4px 0" }, children: "BÁO CÁO ĐÁNH GIÁ & TỜ TRÌNH ĐỀ XUẤT CẤP TÍN DỤNG" }),
          /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
            "Biểu mẫu: ",
            /* @__PURE__ */ e("span", { className: "sme-mono", children: f.form_code }),
            " · Phiên bản hiện hành: ",
            /* @__PURE__ */ s("b", { children: [
              "v",
              f.current_version
            ] }),
            " · File: ",
            /* @__PURE__ */ e("span", { className: "sme-mono", children: f.active_file })
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: "smec-qr-box", children: [
          /* @__PURE__ */ e(
            "div",
            {
              style: { color: "var(--text-strong, var(--text))", lineHeight: 0 },
              dangerouslySetInnerHTML: { __html: f.qr_meta.qr_svg }
            }
          ),
          /* @__PURE__ */ s("span", { className: "sme-mono", style: { fontSize: 10 }, children: [
            /* @__PURE__ */ e(vs, { size: 10 }),
            " SHA: ",
            f.qr_meta.sha256.slice(0, 10)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s("table", { className: "smec-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 280 }, children: "Mục thông tin Tờ trình" }),
          /* @__PURE__ */ e("th", { children: "Nội dung chi tiết đang hiệu lực" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: Object.entries(f.active_fields).map(([c, z]) => /* @__PURE__ */ s("tr", { children: [
          /* @__PURE__ */ e("td", { className: "sme-strong", children: c }),
          /* @__PURE__ */ e("td", { children: z })
        ] }, c)) })
      ] })
    ] })
  ] });
}
function Re({ data: n, onRefresh: l }) {
  const p = oe(), [w, S] = x(""), [o, m] = x(!1), [_, C] = x(!1), [A, f] = x(""), g = n.resolution || { accepted: !1, comments: [], drafting_info: {} }, h = g.comments || [], v = g.drafting_info || {}, [u, r] = x({
    legal_info_changed: !!(v.legal_info_changed ?? !1),
    has_amended_resolution: !!(v.has_amended_resolution ?? !1),
    resolution_code: String(v.resolution_code || g.resolution_no || "ELOS-NQ-01"),
    drafting_proposal_type: String(v.drafting_proposal_type || "Soạn thảo mới"),
    drafting_need: String(v.drafting_need || "Soạn thảo Hồ sơ tín dụng"),
    has_credit_poa: !!(v.has_credit_poa ?? !1),
    authorized_person: String(v.authorized_person || ""),
    collateral_status: String(v.collateral_status || "Tài sản hiện hữu"),
    is_sole_residence: !!(v.is_sole_residence ?? !1),
    title_matches_actual: !!(v.title_matches_actual ?? !0),
    vehicle_registration_ready: String(v.vehicle_registration_ready || "Đã có"),
    has_overdraft: !!(v.has_overdraft ?? !1),
    overdraft_account: String(v.overdraft_account || ""),
    overdraft_rate_pct: String(v.overdraft_rate_pct || "")
  }), c = n.case.case_id, z = async (b) => {
    C(!0), f("");
    try {
      const O = await p.post(`${M}/cases/${c}/los-event`, {
        event_type: b
      });
      l(O);
    } catch (O) {
      f(R(O));
    } finally {
      C(!1);
    }
  }, E = async () => {
    m(!1), C(!0), f("");
    try {
      const b = await p.post(`${M}/cases/${c}/negotiate`, {
        message: w
      });
      S(""), l(b);
    } catch (b) {
      f(R(b));
    } finally {
      C(!1);
    }
  }, q = async () => {
    C(!0), f("");
    try {
      const b = await p.post(`${M}/cases/${c}/resolution/accept`, {
        drafting_info: {
          ...u,
          resolution_code: u.resolution_code || g.resolution_no || "ELOS-NQ-01"
        }
      });
      l(b);
    } catch (b) {
      f(R(b));
    } finally {
      C(!1);
    }
  }, L = async (b) => {
    C(!0), f("");
    try {
      const O = await p.post(`${M}/cases/${c}/action`, { action: b });
      l(O);
    } catch (O) {
      f(R(O));
    } finally {
      C(!1);
    }
  }, D = async () => {
    var b;
    if ((b = g.resolution_doc) != null && b.id)
      try {
        const O = await p.get(
          `${M}/cases/${c}/documents/${g.resolution_doc.id}/file`
        );
        pe(O.name, O.mime, O.content_b64);
      } catch (O) {
        f(R(O));
      }
  };
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-h2", children: "Bước 5 · Thương lượng Nghị quyết Phê duyệt (ELOS/NCLOS) & Chuyển Xác nhận B2B" }),
          /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Đồng bộ 2 chiều giữa CBBH trên SME Connect và CPC trên NCLOS/ELOS. Khi chạy độc lập trên Sao Khuê, bạn có thể giả lập nhận Nghị quyết từ ELOS ngay bên dưới." })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
          !g.resolution_doc && /* @__PURE__ */ s(k, { variant: "secondary", onClick: () => z("RESOLUTION_ISSUED"), disabled: _, children: [
            /* @__PURE__ */ e(Ye, { size: 14 }),
            " Giả lập ELOS trả Nghị quyết"
          ] }),
          g.resolution_doc && /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => z("CPC_COMMENT"), disabled: _, children: [
            /* @__PURE__ */ e(we, { size: 14 }),
            " Giả lập phản hồi CPC"
          ] })
        ] })
      ] }),
      A && /* @__PURE__ */ e("div", { className: "sme-small", style: { color: "var(--danger)", marginTop: 8 }, children: A })
    ] }),
    /* @__PURE__ */ s("div", { className: "sme-detail", children: [
      /* @__PURE__ */ s("div", { className: "sme-stack", children: [
        /* @__PURE__ */ s("div", { className: "sme-card", children: [
          /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 10 }, children: [
            /* @__PURE__ */ s("div", { className: "sme-row", children: [
              /* @__PURE__ */ e(bs, { size: 18, style: { color: "var(--accent)" } }),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ e("div", { className: "sme-h3", children: g.resolution_doc ? g.resolution_doc.name : "Đang chờ Nghị quyết từ ELOS / NCLOS" }),
                /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
                  "Mã NCLOS: ",
                  /* @__PURE__ */ e("span", { className: "sme-mono", children: n.case.smec.nclos_id || "Chưa cấp" }),
                  " · Mã ELOS: ",
                  /* @__PURE__ */ e("span", { className: "sme-mono", children: n.case.smec.elos_id || "Chưa cấp" })
                ] })
              ] })
            ] }),
            g.accepted ? /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
              "✓ Đã đồng ý nghị quyết (",
              g.accepted_by,
              ")"
            ] }) : g.resolution_doc ? /* @__PURE__ */ e("span", { className: "sme-pill t-warn", children: "Chờ ĐVKD/KH xác nhận" }) : /* @__PURE__ */ e("span", { className: "sme-pill t-muted", children: "Chưa phát hành" })
          ] }),
          g.conditions_summary && /* @__PURE__ */ s("div", { className: "sme-card tight", style: { marginBottom: 12 }, children: [
            /* @__PURE__ */ s("div", { className: "sme-small sme-strong", children: [
              "Điều kiện phê duyệt trên Nghị quyết (",
              g.resolution_no,
              "):"
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: g.conditions_summary })
          ] }),
          g.resolution_doc && /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
            /* @__PURE__ */ s(k, { variant: "secondary", onClick: D, children: [
              /* @__PURE__ */ e(fe, { size: 14 }),
              " Tải file ",
              g.resolution_doc.name
            ] }),
            !g.accepted && /* @__PURE__ */ s(k, { variant: "primary", onClick: q, disabled: _, children: [
              /* @__PURE__ */ e(he, { size: 14 }),
              " Đồng ý Nghị quyết & Mở Thông tin soạn thảo"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-card", children: [
          /* @__PURE__ */ s("div", { className: "sme-h3", style: { marginBottom: 10 }, children: [
            "Luồng trao đổi Thương lượng Nghị quyết (",
            h.length,
            ")"
          ] }),
          /* @__PURE__ */ e("div", { className: "sme-stack", style: { marginBottom: 12 }, children: h.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Chưa có ý kiến trao đổi nào trên hồ sơ này." }) : h.map((b) => /* @__PURE__ */ s(
            "div",
            {
              className: "sme-card tight",
              style: {
                borderLeft: `3px solid ${b.role === "CPC" ? "var(--info)" : "var(--accent)"}`
              },
              children: [
                /* @__PURE__ */ s("div", { className: "sme-between sme-small", children: [
                  /* @__PURE__ */ e("span", { className: "sme-strong", children: b.author }),
                  /* @__PURE__ */ e("span", { className: "sme-muted", children: ze(b.created_at) })
                ] }),
                /* @__PURE__ */ e("div", { style: { fontSize: 13, marginTop: 4 }, children: b.message })
              ]
            },
            b.id
          )) }),
          /* @__PURE__ */ s("div", { className: "sme-stack", style: { gap: 8 }, children: [
            /* @__PURE__ */ e("label", { className: "sme-small sme-strong", children: "Ý kiến của đơn vị kinh doanh (CBBH):" }),
            /* @__PURE__ */ e(
              "textarea",
              {
                className: "smec-textarea",
                value: w,
                onChange: (b) => S(b.target.value),
                placeholder: "Nhập nội dung đề xuất điều chỉnh điều kiện Nghị quyết gửi CPC..."
              }
            ),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ s(
              k,
              {
                variant: "secondary",
                disabled: _ || !w.trim(),
                onClick: () => m(!0),
                children: [
                  /* @__PURE__ */ e(fs, { size: 14 }),
                  " Gửi ý kiến thương lượng"
                ]
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-aside", style: { position: "static" }, children: /* @__PURE__ */ s("div", { className: "sme-card", children: [
        /* @__PURE__ */ e("div", { className: "sme-h3", style: { marginBottom: 4 }, children: "01 · Thông tin soạn thảo Hợp đồng" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginBottom: 12 }, children: "Điền thông tin chuẩn bị cho khâu Soạn thảo Hồ sơ tín dụng / Thế chấp sau khi đồng ý Nghị quyết:" }),
        /* @__PURE__ */ s("div", { className: "sme-stack", style: { gap: 10 }, children: [
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("label", { className: "sme-small sme-muted", children: "Mã số Nghị quyết phê duyệt *" }),
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                value: u.resolution_code,
                onChange: (b) => r({ ...u, resolution_code: b.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ s("label", { className: "sme-row sme-small", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: u.legal_info_changed,
                onChange: (b) => r({ ...u, legal_info_changed: b.target.checked })
              }
            ),
            "Có thay đổi thông tin pháp lý so với lúc trình?"
          ] }),
          /* @__PURE__ */ s("label", { className: "sme-row sme-small", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: u.has_credit_poa,
                onChange: (b) => r({ ...u, has_credit_poa: b.target.checked })
              }
            ),
            "Có ký ủy quyền tín dụng không?"
          ] }),
          u.has_credit_poa && /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("label", { className: "sme-small sme-muted", children: "Người được ủy quyền *" }),
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                value: u.authorized_person,
                onChange: (b) => r({ ...u, authorized_person: b.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("label", { className: "sme-small sme-muted", children: "Phân loại TSBĐ" }),
            /* @__PURE__ */ s(
              "select",
              {
                className: "smec-input",
                value: u.collateral_status,
                onChange: (b) => r({ ...u, collateral_status: b.target.value }),
                children: [
                  /* @__PURE__ */ e("option", { value: "Tài sản hiện hữu", children: "Tài sản hiện hữu" }),
                  /* @__PURE__ */ e("option", { value: "Tài sản mới", children: "Tài sản mới" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s("label", { className: "sme-row sme-small", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: u.is_sole_residence,
                onChange: (b) => r({ ...u, is_sole_residence: b.target.checked })
              }
            ),
            "TSBĐ là chỗ ở duy nhất của chủ tài sản?"
          ] }),
          /* @__PURE__ */ s("label", { className: "sme-row sme-small", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: u.title_matches_actual,
                onChange: (b) => r({ ...u, title_matches_actual: b.target.checked })
              }
            ),
            "Thông tin trên GCN và thực tế nhà đất khớp nhau?"
          ] }),
          /* @__PURE__ */ s("label", { className: "sme-row sme-small", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: u.has_overdraft,
                onChange: (b) => r({ ...u, has_overdraft: b.target.checked })
              }
            ),
            "Hạn mức có cấp thấu chi?"
          ] }),
          u.has_overdraft && /* @__PURE__ */ s("div", { className: "sme-stack", style: { gap: 6 }, children: [
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                placeholder: "Số tài khoản mở hạn mức thấu chi *",
                value: u.overdraft_account,
                onChange: (b) => r({ ...u, overdraft_account: b.target.value })
              }
            ),
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                placeholder: "Lãi suất thấu chi (%/năm) *",
                value: u.overdraft_rate_pct,
                onChange: (b) => r({ ...u, overdraft_rate_pct: b.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ e(k, { variant: "secondary", onClick: q, disabled: _, children: "Lưu Thông tin soạn thảo & Đồng ý Nghị quyết" }),
          /* @__PURE__ */ s("div", { style: { borderTop: "1px dashed var(--border)", paddingTop: 10 }, className: "sme-stack", children: [
            /* @__PURE__ */ s(
              k,
              {
                variant: "primary",
                disabled: _ || !g.accepted,
                onClick: () => L("send_b2b_confirm"),
                children: [
                  /* @__PURE__ */ e(es, { size: 14 }),
                  " Chuyển khách hàng xác nhận (B2B) →"
                ]
              }
            ),
            n.case.smec.b2b_requested_at && !n.case.smec.b2b_confirmed && /* @__PURE__ */ s(k, { variant: "secondary", disabled: _, onClick: () => L("mark_b2b_done"), children: [
              /* @__PURE__ */ e(he, { size: 14 }),
              " Xác nhận: Đã có B2B (Hoàn tất hồ sơ)"
            ] }),
            n.case.smec.b2b_confirmed && /* @__PURE__ */ e("div", { className: "sme-pill t-ok", style: { justifyContent: "center", padding: "6px 10px" }, children: "✓ Khách hàng đã xác nhận B2B — Hồ sơ Đã hoàn tất" })
          ] })
        ] })
      ] }) })
    ] }),
    o && /* @__PURE__ */ e("div", { className: "smec-modal-backdrop", onClick: () => m(!1), children: /* @__PURE__ */ s("div", { className: "smec-modal", style: { maxWidth: 440 }, onClick: (b) => b.stopPropagation(), children: [
      /* @__PURE__ */ e("div", { className: "sme-h2", style: { marginBottom: 8 }, children: "Xác nhận gửi ý kiến thương lượng" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginBottom: 16 }, children: "Bạn chắc chắn gửi ý kiến thương lượng này tới chuyên gia phê duyệt (CPC) trên hệ thống ELOS/NCLOS?" }),
      /* @__PURE__ */ s("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ e(k, { variant: "ghost", onClick: () => m(!1), children: "Đóng" }),
        /* @__PURE__ */ e(k, { variant: "primary", onClick: E, children: "Xác nhận gửi" })
      ] })
    ] }) })
  ] });
}
const Qs = {
  trusted: { label: "Tin cậy", tone: "ok" },
  needs_confirm: { label: "Chưa đủ tin cậy", tone: "warn" },
  missing: { label: "Thiếu", tone: "danger" }
};
function He({ data: n, agentGroups: l, onRefresh: p, onNextStep: w }) {
  var V, F, W, H, Q, d, B, P;
  const S = oe(), o = ne(null), m = ((V = n.ocr) == null ? void 0 : V.categories) || [], [_, C] = x(((F = m[0]) == null ? void 0 : F.id) || "01_customer"), [A, f] = x(!1), [g, h] = x({}), [v, u] = x(null), [r, c] = x(!1), [z, E] = x(""), q = n.case.case_id, L = n.case.smec.selected_agent_groups || ["fin", "col", "risk", "pol"];
  le(() => {
    !m.some((a) => a.id === _) && m[0] && C(m[0].id);
  }, [m, _]);
  const D = m.find((a) => a.id === _) || m[0], b = async (a) => {
    const t = L.includes(a) ? L.filter((N) => N !== a) : [...L, a];
    try {
      const N = await S.post(`${M}/cases/${q}/ocr`, {
        updates: [],
        selected_agent_groups: t
      });
      p(N);
    } catch (N) {
      E(R(N));
    }
  }, O = async (a, t) => {
    c(!0), E("");
    try {
      const N = t !== void 0 ? t : g[a.path] !== void 0 ? g[a.path] : a.value, I = await S.post(`${M}/cases/${q}/ocr`, {
        updates: [{ path: a.path, value: N }]
      });
      if (p(I), (v == null ? void 0 : v.path) === a.path) {
        const K = I.ocr.categories.flatMap((se) => se.fields).find((se) => se.path === a.path);
        u(K || null);
      }
    } catch (N) {
      E(R(N));
    } finally {
      c(!1);
    }
  }, ie = async () => {
    E("");
    try {
      const a = await S.get(
        `${M}/cases/${q}/b4-template`
      );
      pe(a.name, a.mime, a.content_b64);
    } catch (a) {
      E(R(a));
    }
  }, ee = async (a) => {
    if (a) {
      c(!0), E("");
      try {
        const t = await Ae(a), N = await S.post(`${M}/cases/${q}/b4-upload`, {
          name: a.name,
          content_b64: t
        });
        p(N);
      } catch (t) {
        E(R(t));
      } finally {
        c(!1), o.current && (o.current.value = "");
      }
    }
  }, Y = async () => {
    c(!0), E("");
    try {
      const a = await S.get(
        `${M}/cases/${q}/b4-template`
      ), t = await S.post(`${M}/cases/${q}/b4-upload`, {
        name: a.name,
        content_b64: a.content_b64
      });
      p(t);
    } catch (a) {
      E(R(a));
    } finally {
      c(!1);
    }
  }, U = async (a) => {
    if (a)
      try {
        const t = await S.get(
          `${M}/cases/${q}/documents/${a}/file`
        );
        pe(t.name, t.mime, t.content_b64);
      } catch (t) {
        E(R(t));
      }
  }, te = ((D == null ? void 0 : D.fields) || []).filter(
    (a) => !A || a.confidence_tier !== "trusted"
  );
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", style: { gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-h2", children: "Bước 2 · Kiểm tra dữ liệu trích xuất OCR (Bản mới 6 Danh mục)" }),
          /* @__PURE__ */ s("span", { className: "sme-chip", children: [
            "Tổng trường: ",
            /* @__PURE__ */ e("b", { children: n.ocr.summary.total })
          ] }),
          /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
            "Tin cậy: ",
            n.ocr.summary.trusted
          ] }),
          /* @__PURE__ */ s("span", { className: "sme-pill t-warn", children: [
            "Cần xác nhận: ",
            n.ocr.summary.needs_confirm
          ] }),
          /* @__PURE__ */ s("span", { className: "sme-pill t-danger", children: [
            "Còn thiếu: ",
            n.ocr.summary.missing
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row", children: [
          /* @__PURE__ */ s(k, { variant: "secondary", onClick: () => f((a) => !a), children: [
            A ? /* @__PURE__ */ e(ss, { size: 14 }) : /* @__PURE__ */ e(ns, { size: 14 }),
            A ? "Hiện đầy đủ trường Tin cậy" : "Ẩn thông tin OCR (Chế độ rút gọn)"
          ] }),
          /* @__PURE__ */ s(k, { variant: "primary", onClick: w, children: [
            "Chuyển sang Hệ thống đánh giá ",
            /* @__PURE__ */ e(ue, { size: 14 })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-row sme-wrap sme-small sme-muted", style: { marginTop: 8, gap: 14 }, children: [
        /* @__PURE__ */ s("span", { children: [
          /* @__PURE__ */ e(Me, { size: 12, style: { verticalAlign: "middle" } }),
          " ",
          /* @__PURE__ */ e("b", { children: "Mã số ĐKKD" }),
          " và ",
          /* @__PURE__ */ e("b", { children: "Mã CIF" }),
          " đã được khóa cứng (read-only) theo dữ liệu định danh gốc."
        ] }),
        !n.ocr.has_collateral && /* @__PURE__ */ e("span", { className: "sme-pill t-info", children: "Đã tự động ẩn mục 06 · BLCN & TSBĐ do gói sản phẩm đề xuất 100% tín chấp" })
      ] }),
      z && /* @__PURE__ */ e("div", { className: "sme-small", style: { color: "var(--danger)", marginTop: 8 }, children: z })
    ] }),
    /* @__PURE__ */ s("div", { className: `smec-ocr-layout ${v ? "with-viewer" : ""}`, children: [
      /* @__PURE__ */ s("div", { className: "sme-stack", children: [
        /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
          /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Danh mục thông tin tín dụng" }),
          /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 4 }, children: m.map((a) => {
            const t = a.counts.needs_confirm + a.counts.missing;
            return /* @__PURE__ */ s(
              "button",
              {
                className: `smec-cat-btn ${a.id === (D == null ? void 0 : D.id) ? "active" : ""}`,
                onClick: () => C(a.id),
                children: [
                  /* @__PURE__ */ e("span", { children: a.title }),
                  t > 0 ? /* @__PURE__ */ e("span", { className: "sme-pill t-warn", children: t }) : /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "✓" })
                ]
              },
              a.id
            );
          }) })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
          /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Agent hỗ trợ cho CBBH" }),
          /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginBottom: 8 }, children: "Chọn các nhóm chuyên gia AI sẽ tham gia đánh giá hồ sơ ở Bước 3:" }),
          /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 8 }, children: l.map((a) => {
            const t = a.id === "col" && !n.ocr.has_collateral, N = !t && L.includes(a.id);
            return /* @__PURE__ */ s(
              "label",
              {
                className: "sme-row",
                style: {
                  alignItems: "flex-start",
                  cursor: t ? "not-allowed" : "pointer",
                  opacity: t ? 0.5 : 1,
                  fontSize: 12.5
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      disabled: t,
                      checked: N,
                      onChange: () => b(a.id),
                      style: { marginTop: 3 }
                    }
                  ),
                  /* @__PURE__ */ s("div", { children: [
                    /* @__PURE__ */ e("div", { className: "sme-strong", children: a.label }),
                    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: a.description })
                  ] })
                ]
              },
              a.id
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-stack", children: D && /* @__PURE__ */ s("div", { className: "sme-card", children: [
        /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", children: D.title }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: D.subtitle })
          ] }),
          /* @__PURE__ */ s("div", { className: "sme-row", children: [
            /* @__PURE__ */ s("span", { className: "sme-chip", children: [
              "Tổng: ",
              D.counts.total
            ] }),
            /* @__PURE__ */ s("span", { className: "sme-pill t-warn", children: [
              "Cần xác nhận: ",
              D.counts.needs_confirm
            ] }),
            /* @__PURE__ */ s("span", { className: "sme-pill t-danger", children: [
              "Thiếu: ",
              D.counts.missing
            ] })
          ] })
        ] }),
        D.id === "05_pavv" && /* @__PURE__ */ s(
          "div",
          {
            className: "sme-card tight",
            style: {
              marginBottom: 14,
              borderColor: "color-mix(in srgb, var(--accent) 45%, var(--border))",
              background: "color-mix(in srgb, var(--accent) 6%, var(--card))"
            },
            children: [
              /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { gap: 10 }, children: [
                /* @__PURE__ */ s("div", { children: [
                  /* @__PURE__ */ s("div", { className: "sme-row sme-strong", children: [
                    /* @__PURE__ */ e(Qe, { size: 16 }),
                    " Quy tắc Phương án Vay vốn (Mẫu Excel B4 chuẩn SME Connect)"
                  ] }),
                  /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 3 }, children: "1. Không trích xuất bằng OCR · 2. Không gõ chỉnh sửa trực tiếp trên màn hình · 3. CBBH tải file mẫu Excel B4, điền số liệu và tải lên lại để hệ thống đọc tất định 11 chỉ tiêu Hạn mức & Khả năng trả nợ." })
                ] }),
                /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      ref: o,
                      type: "file",
                      accept: ".xlsx",
                      style: { display: "none" },
                      onChange: (a) => {
                        var t;
                        return ee((t = a.target.files) == null ? void 0 : t[0]);
                      }
                    }
                  ),
                  /* @__PURE__ */ s(k, { variant: "secondary", onClick: ie, children: [
                    /* @__PURE__ */ e(fe, { size: 14 }),
                    " Tải mẫu Excel B4 (.xlsx)"
                  ] }),
                  /* @__PURE__ */ s(k, { variant: "primary", onClick: () => {
                    var a;
                    return (a = o.current) == null ? void 0 : a.click();
                  }, disabled: r, children: [
                    /* @__PURE__ */ e(Te, { size: 14 }),
                    " Upload Excel B4 đã điền"
                  ] }),
                  !n.ocr.pavv_b4_loaded && /* @__PURE__ */ s(k, { variant: "ghost", onClick: Y, disabled: r, children: [
                    /* @__PURE__ */ e(Ye, { size: 14 }),
                    " Nạp nhanh Mẫu B4 chuẩn"
                  ] })
                ] })
              ] }),
              n.ocr.pavv_b4_summary && /* @__PURE__ */ s("div", { style: { marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--border)" }, children: [
                /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
                  /* @__PURE__ */ s("span", { className: "sme-small", children: [
                    "Nguồn đã nạp: ",
                    /* @__PURE__ */ e("b", { className: "sme-mono", children: n.ocr.pavv_b4_summary.source_file }),
                    " · HM cho vay tối đa VPB: ",
                    /* @__PURE__ */ e("b", { children: _e(n.ocr.pavv_b4_summary.values.max_vpb_wc_limit) }),
                    " · DSCR dự phóng: ",
                    /* @__PURE__ */ s("b", { children: [
                      n.ocr.pavv_b4_summary.computed_checks.effective_dscr,
                      "x"
                    ] })
                  ] }),
                  /* @__PURE__ */ e("span", { className: `sme-pill ${n.ocr.pavv_b4_summary.computed_checks.formula_passed ? "t-ok" : "t-warn"}`, children: n.ocr.pavv_b4_summary.computed_checks.formula_passed ? "✓ Đạt kiểm tra công thức B4" : `${n.ocr.pavv_b4_summary.computed_checks.warnings.length} cảnh báo công thức` })
                ] }),
                n.ocr.pavv_b4_summary.computed_checks.warnings.map((a, t) => /* @__PURE__ */ s("div", { className: "sme-small", style: { color: "var(--warn)", marginTop: 4 }, children: [
                  "• ",
                  a
                ] }, t))
              ] })
            ]
          }
        ),
        te.length === 0 ? /* @__PURE__ */ s("div", { className: "sme-small sme-muted", style: { padding: "12px 0" }, children: [
          "Tất cả các trường trong danh mục này đều ở trạng thái ",
          /* @__PURE__ */ e("b", { children: "Tin cậy" }),
          " (đang ẩn theo bộ lọc rút gọn)."
        ] }) : /* @__PURE__ */ e("div", { className: "smec-field-grid", children: te.map((a) => {
          var I, K;
          const t = Qs[a.confidence_tier], N = g[a.path] !== void 0 ? g[a.path] : a.value === null || a.value === void 0 ? "" : String(a.value);
          return /* @__PURE__ */ s("div", { className: `smec-field-card tier-${a.confidence_tier}`, children: [
            /* @__PURE__ */ s("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: a.label }),
              /* @__PURE__ */ s("span", { className: `sme-pill t-${t.tone}`, children: [
                a.readonly && /* @__PURE__ */ e(Me, { size: 10 }),
                " ",
                t.label
              ] })
            ] }),
            /* @__PURE__ */ e(
              "input",
              {
                className: "smec-input",
                disabled: a.readonly,
                value: typeof a.value == "number" && g[a.path] === void 0 && a.readonly ? a.value.toLocaleString("vi-VN") : N,
                placeholder: a.confidence_tier === "missing" ? "Chưa có dữ liệu" : "",
                onChange: (se) => h({ ...g, [a.path]: se.target.value })
              }
            ),
            a.confidence_tier === "needs_confirm" && /* @__PURE__ */ s("div", { className: "sme-small", style: { color: "var(--warn)" }, children: [
              /* @__PURE__ */ e(xs, { size: 12, style: { verticalAlign: "middle" } }),
              " ",
              a.conflict_note || "Hệ thống cần bạn xác nhận giá trị này."
            ] }),
            /* @__PURE__ */ s("div", { className: "sme-between sme-small sme-muted", style: { marginTop: 2 }, children: [
              /* @__PURE__ */ e("span", { className: "sme-mono", style: { fontSize: 11 }, children: (I = a.source) != null && I.doc_name ? `${a.source.doc_name}${a.source.cell ? ` (${a.source.cell})` : ` · Tr.${a.source.page || 1}`}` : "Chưa gắn nguồn" }),
              /* @__PURE__ */ s("div", { className: "sme-row", children: [
                ((K = a.source) == null ? void 0 : K.bbox) && /* @__PURE__ */ s("button", { className: "sme-ref", onClick: () => u(a), children: [
                  /* @__PURE__ */ e(Je, { size: 11, style: { verticalAlign: "middle" } }),
                  " Đối chiếu"
                ] }),
                !a.readonly && (a.confidence_tier !== "trusted" || g[a.path] !== void 0) && /* @__PURE__ */ s(
                  "button",
                  {
                    className: "sme-ref",
                    disabled: r,
                    onClick: () => O(a),
                    children: [
                      /* @__PURE__ */ e(Le, { size: 11, style: { verticalAlign: "middle" } }),
                      " Xác nhận"
                    ]
                  }
                )
              ] })
            ] })
          ] }, a.path);
        }) }),
        Object.entries(D.tables || {}).map(([a, t]) => {
          if (!t || t.length === 0) return null;
          const N = Object.keys(t[0]);
          return /* @__PURE__ */ s("div", { style: { marginTop: 16 }, children: [
            /* @__PURE__ */ s("div", { className: "sme-section-title", children: [
              {
                leaders: "Bảng Ban lãnh đạo & Người điều hành",
                shareholders: "Bảng Cổ đông / Thành viên góp vốn",
                related_parties: "Bảng Nhóm Khách hàng liên quan (KHLQ)",
                buyers: "Bảng Đối tác Đầu ra chủ lực (Bên mua)",
                suppliers: "Bảng Đối tác Đầu vào chủ lực (Nhà cung cấp)",
                invoices: "Bảng Đối chiếu Hóa đơn VAT & Hợp đồng",
                guarantors: "Bảng Người Bảo lãnh cá nhân (BLCN)",
                collaterals: "Bảng Danh mục Tài sản bảo đảm & Định giá Prosland"
              }[a] || a,
              " (",
              t.length,
              ")"
            ] }),
            /* @__PURE__ */ e("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ s("table", { className: "smec-table", children: [
              /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ e("tr", { children: N.map((K) => /* @__PURE__ */ e("th", { children: K }, K)) }) }),
              /* @__PURE__ */ e("tbody", { children: t.map((K, se) => /* @__PURE__ */ e("tr", { children: N.map((i) => {
                const y = K[i];
                return /* @__PURE__ */ e("td", { children: typeof y == "number" && y >= 1e6 ? _e(y) : String(y ?? "—") }, i);
              }) }, se)) })
            ] }) })
          ] }, a);
        })
      ] }) }),
      v && /* @__PURE__ */ s("div", { className: "sme-card tight", style: { position: "sticky", top: 0 }, children: [
        /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("div", { className: "sme-strong", children: "🔍 Đối chiếu tài liệu gốc" }),
            /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
              ((W = v.source) == null ? void 0 : W.doc_name) || "Chứng từ",
              " · Trang ",
              ((H = v.source) == null ? void 0 : H.page) || 1
            ] })
          ] }),
          /* @__PURE__ */ e("button", { className: "sme-back", onClick: () => u(null), children: /* @__PURE__ */ e(Ze, { size: 15 }) })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-small", style: { marginBottom: 8 }, children: [
          "Trường đang chọn: ",
          /* @__PURE__ */ e("b", { children: v.label })
        ] }),
        /* @__PURE__ */ s("div", { className: "smec-pdf-stage", children: [
          /* @__PURE__ */ s("div", { style: { fontSize: 11, color: "#64748b", borderBottom: "1px solid #e2e8f0", paddingBottom: 6, marginBottom: 12 }, children: [
            "TRANG ",
            ((Q = v.source) == null ? void 0 : Q.page) || 1,
            " · ",
            (d = v.source) == null ? void 0 : d.doc_name
          ] }),
          /* @__PURE__ */ s("div", { style: { fontSize: 12, lineHeight: 1.65, color: "#334155" }, children: [
            /* @__PURE__ */ e("p", { style: { margin: "0 0 8px", fontWeight: 700 }, children: String(n.case.customer.name || "") }),
            /* @__PURE__ */ s("p", { style: { margin: "0 0 8px" }, children: [
              "Mã số ĐKKD/MST: ",
              String(n.case.customer.tax_id || ""),
              " · CIF: ",
              String(n.case.customer.cif || "")
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "0 0 8px", color: "#94a3b8" }, children: "[Vùng văn bản trích xuất OCR được khoanh sáng màu vàng đúng tọa độ bbox]" })
          ] }),
          ((B = v.source) == null ? void 0 : B.bbox) && (() => {
            var K;
            const [a, t, N, I] = v.source.bbox;
            return /* @__PURE__ */ e(
              "div",
              {
                className: "smec-bbox-highlight",
                style: {
                  left: `${Math.max(4, a * 100)}%`,
                  top: `${Math.max(18, t * 100)}%`,
                  width: `${Math.min(90, Math.max(22, (N - a) * 100))}%`,
                  minHeight: `${Math.max(32, (I - t) * 260)}px`,
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#713f12"
                },
                children: ((K = v.source) == null ? void 0 : K.snippet) || String(v.value ?? "")
              }
            );
          })()
        ] }),
        v.conflict_note && /* @__PURE__ */ s("div", { className: "sme-small", style: { color: "var(--warn)", marginTop: 8 }, children: [
          /* @__PURE__ */ e(Ns, { size: 12, style: { verticalAlign: "middle" } }),
          " ",
          v.conflict_note
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-between", style: { marginTop: 10 }, children: [
          (P = v.source) != null && P.doc_id ? /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => {
            var a;
            return U((a = v.source) == null ? void 0 : a.doc_id);
          }, children: [
            /* @__PURE__ */ e(fe, { size: 13 }),
            " Tải PDF gốc"
          ] }) : /* @__PURE__ */ e("span", {}),
          !v.readonly && /* @__PURE__ */ s(k, { variant: "primary", disabled: r, onClick: () => O(v), children: [
            /* @__PURE__ */ e(Le, { size: 14 }),
            " Xác nhận giá trị"
          ] })
        ] })
      ] })
    ] })
  ] });
}
const ts = (n, l) => l && n[l] || { label: l ?? "—", tone: "muted" }, Js = {
  PASS: { label: "Đạt", tone: "ok" },
  MISSING_REQUIRED: { label: "Còn thiếu", tone: "warn" },
  FAIL: { label: "Không đạt", tone: "danger" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" },
  UNDETERMINED_CONDITION: { label: "Chưa xác định điều kiện", tone: "info" }
}, Zs = {
  PASS: { label: "Khớp", tone: "ok" },
  FAIL: { label: "Không khớp", tone: "danger" },
  MISSING_DATA: { label: "Thiếu căn cứ", tone: "warn" },
  SKIPPED: { label: "Không áp dụng", tone: "muted" }
}, Ys = (n) => ts(Js, n), qe = (n) => ts(Zs, n);
function Fe({
  data: n,
  catalog: l,
  onRefresh: p,
  onNextStep: w,
  onAskAssistant: S
}) {
  var te, V, F, W, H, Q;
  const o = oe(), m = ne(null), [_, C] = x("auto_bulk"), [A, f] = x("auto"), [g, h] = x(!1), [v, u] = x(!1), [r, c] = x(""), z = n.case.case_id, E = ((te = l == null ? void 0 : l.documents) == null ? void 0 : te.types) || {}, q = ((V = n.case) == null ? void 0 : V.documents) || [], L = ((F = n.checklist) == null ? void 0 : F.counts) || {}, D = ((W = n.checklist) == null ? void 0 : W.groups) || [], b = ((H = n.checklist) == null ? void 0 : H.items) || [], O = ((Q = n.crosschecks) == null ? void 0 : Q.rules) || [], ie = async (d, B = "auto") => {
    if (!(!d || d.length === 0)) {
      u(!0), c("");
      try {
        const P = [];
        for (const t of Array.from(d)) {
          const N = await Ae(t);
          P.push({
            name: t.name,
            doc_type: B !== "auto" ? B : A,
            content_b64: N
          });
        }
        const a = await o.post(`${M}/cases/${z}/documents`, {
          mode: _,
          files: P
        });
        p(a);
      } catch (P) {
        c(R(P));
      } finally {
        u(!1), m.current && (m.current.value = "");
      }
    }
  }, ee = async (d) => {
    try {
      const B = await o.get(
        `${M}/cases/${z}/documents/${d}/file`
      );
      pe(B.name, B.mime, B.content_b64);
    } catch (B) {
      c(R(B));
    }
  }, Y = O.filter((d) => d.status !== "PASS" && d.status !== "SKIPPED"), U = b.filter(
    (d) => d.rule_status === "MISSING_REQUIRED" || d.rule_status === "FAIL"
  );
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("div", { className: "sme-h2", children: "Bước 1 · Tải lên & Phân loại Hồ sơ Chứng từ" }),
          /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
            "Hỗ trợ kéo-thả toàn bộ bộ hồ sơ để AI tự phân loại hoặc tải theo từng mục Master Checklist (mặc định ẩn các mục không áp dụng ",
            /* @__PURE__ */ e("code", { children: "SKIPPED" }),
            ")."
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-filters", children: [
          /* @__PURE__ */ e(
            "button",
            {
              className: `sme-filter ${_ === "auto_bulk" ? "on" : ""}`,
              onClick: () => C("auto_bulk"),
              children: "Tải toàn bộ hồ sơ (AI Phân loại)"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              className: `sme-filter ${_ === "checklist" ? "on" : ""}`,
              onClick: () => C("checklist"),
              children: "Tải theo Master Checklist (A–I)"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e(
        "input",
        {
          ref: m,
          type: "file",
          multiple: !0,
          style: { display: "none" },
          onChange: (d) => ie(d.target.files)
        }
      ),
      _ === "auto_bulk" && /* @__PURE__ */ s(
        "div",
        {
          className: "smec-dropzone",
          onClick: () => {
            var d;
            f("auto"), (d = m.current) == null || d.click();
          },
          onDragOver: (d) => d.preventDefault(),
          onDrop: (d) => {
            d.preventDefault(), ie(d.dataTransfer.files, "auto");
          },
          children: [
            /* @__PURE__ */ e(Te, { size: 24, style: { color: "var(--accent)", marginBottom: 6 } }),
            /* @__PURE__ */ e("div", { className: "sme-strong", children: v ? "Đang tải lên, phân loại chứng từ & chạy kiểm tra chéo..." : "Kéo thả toàn bộ chứng từ vào đây hoặc bấm để chọn nhiều file" }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: "Chấp nhận PDF, Ảnh scan, Word, Excel · Tự động ánh xạ vào 53 mã chứng từ Master Checklist" })
          ]
        }
      ),
      r && /* @__PURE__ */ e("div", { className: "sme-small", style: { color: "var(--danger)", marginTop: 8 }, children: r })
    ] }),
    (Y.length > 0 || U.length > 0) && /* @__PURE__ */ s(
      "div",
      {
        className: "sme-card",
        style: {
          borderColor: "color-mix(in srgb, var(--warn) 60%, var(--border))",
          background: "color-mix(in srgb, var(--warn) 7%, var(--card))"
        },
        children: [
          /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ s("div", { className: "sme-row sme-strong", style: { color: "var(--warn)" }, children: [
              /* @__PURE__ */ e(ys, { size: 16 }),
              "Cảnh báo Kiểm tra Chéo & Hồ sơ Thiếu (",
              U.length,
              " chứng từ thiếu/lỗi · ",
              Y.length,
              " lưu ý check chéo)"
            ] }),
            /* @__PURE__ */ e(
              k,
              {
                variant: "secondary",
                onClick: () => S(
                  `Soạn thư xin khách hàng bổ sung ${U.length} chứng từ còn thiếu và làm rõ các điểm kiểm tra chéo của hồ sơ ${z}.`
                ),
                children: "Nhờ Copilot soạn thư xin KH"
              }
            )
          ] }),
          /* @__PURE__ */ s("ul", { style: { margin: "0 0 8px 18px", padding: 0, fontSize: 12.5 }, children: [
            U.slice(0, 6).map((d) => /* @__PURE__ */ s("li", { style: { marginBottom: 3 }, children: [
              /* @__PURE__ */ s("b", { children: [
                "[",
                d.code,
                "] ",
                d.title,
                ":"
              ] }),
              " ",
              (d.fail_reasons || []).join("; ") || d.rule_label || d.condition_label || "Chưa tải lên chứng từ bắt buộc"
            ] }, d.code)),
            Y.map((d) => /* @__PURE__ */ s("li", { style: { marginBottom: 3 }, children: [
              /* @__PURE__ */ s("b", { children: [
                "[",
                d.id || d.code,
                "] ",
                d.title,
                " (",
                qe(d.status).label,
                "):"
              ] }),
              " ",
              d.detail
            ] }, d.id || d.code))
          ] }),
          /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: /* @__PURE__ */ e("i", { children: "Lưu ý (Non-blocking): Bạn vẫn có thể bấm tiếp tục sang bước Kiểm tra dữ liệu trích xuất OCR. Hồ sơ còn thiếu có thể bổ sung trước khi trình phê duyệt." }) })
        ]
      }
    ),
    _ === "checklist" && /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: "Danh mục SME Master Checklist (Nhóm A → I)" }),
          /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
            "Đạt: ",
            L.PASS || 0
          ] }),
          /* @__PURE__ */ s("span", { className: "sme-pill t-warn", children: [
            "Còn thiếu: ",
            L.MISSING_REQUIRED || 0
          ] }),
          (L.FAIL || 0) > 0 && /* @__PURE__ */ s("span", { className: "sme-pill t-danger", children: [
            "Không đạt: ",
            L.FAIL
          ] }),
          /* @__PURE__ */ s("span", { className: "sme-pill t-info", children: [
            "Chưa rõ ĐK: ",
            L.UNDETERMINED_CONDITION || 0
          ] })
        ] }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => h((d) => !d), children: [
          g ? /* @__PURE__ */ e(ns, { size: 14 }) : /* @__PURE__ */ e(ss, { size: 14 }),
          g ? "Ẩn mục không áp dụng" : `Hiện ${L.SKIPPED || 0} mục không áp dụng`
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-stack", children: D.map((d) => {
        const B = b.filter((t) => t.group === d.group), P = g ? B : B.filter((t) => t.rule_status !== "SKIPPED");
        if (!P.length) return null;
        const a = d.status === "COMPLETE";
        return /* @__PURE__ */ s("div", { className: "sme-card tight", children: [
          /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
            /* @__PURE__ */ s("span", { className: "sme-strong", children: [
              "Nhóm ",
              d.group,
              " · ",
              d.label
            ] }),
            /* @__PURE__ */ e("span", { className: `sme-pill ${a ? "t-ok" : d.status === "SKIPPED" ? "t-muted" : "t-warn"}`, children: a ? "Đủ hồ sơ nhóm" : d.status === "SKIPPED" ? "Không áp dụng" : "Chưa đủ" })
          ] }),
          /* @__PURE__ */ s("table", { className: "smec-table", children: [
            /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
              /* @__PURE__ */ e("th", { style: { width: 90 }, children: "Mã" }),
              /* @__PURE__ */ e("th", { children: "Hạng mục chứng từ" }),
              /* @__PURE__ */ e("th", { style: { width: 150 }, children: "Trạng thái" }),
              /* @__PURE__ */ e("th", { children: "Điều kiện áp dụng / Ghi chú" }),
              /* @__PURE__ */ e("th", { style: { width: 110 }, children: "Tải bổ sung" })
            ] }) }),
            /* @__PURE__ */ e("tbody", { children: P.map((t) => {
              const N = Ys(t.rule_status), I = (t.fail_reasons || []).join("; ") || t.rule_label || t.condition_label || "—";
              return /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: t.code }),
                /* @__PURE__ */ e("td", { children: t.title }),
                /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("span", { className: `sme-pill t-${N.tone}`, children: N.label }) }),
                /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: I }),
                /* @__PURE__ */ e("td", { children: t.rule_status !== "SKIPPED" && /* @__PURE__ */ e(
                  "button",
                  {
                    className: "sme-ref",
                    onClick: () => {
                      var K;
                      f(t.code), (K = m.current) == null || K.click();
                    },
                    children: "+ Tải file"
                  }
                ) })
              ] }, t.code);
            }) })
          ] })
        ] }, d.group);
      }) })
    ] }),
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ s("span", { className: "sme-h3", children: [
          "Tài liệu đã tải lên & phân loại (",
          q.length,
          " file)"
        ] }),
        /* @__PURE__ */ s(k, { variant: "primary", onClick: w, children: [
          "Đọc & Kiểm tra dữ liệu trích xuất OCR ",
          /* @__PURE__ */ e(ue, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ s("table", { className: "smec-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Tên file gốc" }),
          /* @__PURE__ */ e("th", { children: "Phân loại AI" }),
          /* @__PURE__ */ e("th", { children: "Ngày chứng từ" }),
          /* @__PURE__ */ e("th", { children: "Tác vụ" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: q.map((d) => {
          var B;
          return /* @__PURE__ */ s("tr", { children: [
            /* @__PURE__ */ e("td", { className: "sme-mono", children: d.id }),
            /* @__PURE__ */ s("td", { className: "sme-row", children: [
              /* @__PURE__ */ e(ks, { size: 14, className: "sme-muted" }),
              " ",
              d.name
            ] }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("span", { className: "sme-chip", children: ((B = E[d.type]) == null ? void 0 : B.label) || d.type }) }),
            /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: Is(d.issued_date) }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("button", { className: "sme-ref", onClick: () => ee(d.id), children: "Tải / Xem file" }) })
          ] }, d.id);
        }) })
      ] }),
      /* @__PURE__ */ s("div", { style: { marginTop: 14 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Kết quả 7 Rule Kiểm tra Chéo Trọng yếu (R1 → R7)" }),
        /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", children: O.map((d) => {
          const B = qe(d.status);
          return /* @__PURE__ */ s(
            "span",
            {
              className: `sme-pill t-${B.tone}`,
              title: `${d.title}: ${d.detail}`,
              children: [
                d.status === "PASS" ? /* @__PURE__ */ e(he, { size: 12 }) : null,
                d.id || d.code,
                ": ",
                B.label
              ]
            },
            d.id || d.code
          );
        }) })
      ] })
    ] })
  ] });
}
const en = `
.smec-seller-bar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 10px 16px; border-radius: 10px; margin-bottom: 16px;
  background: color-mix(in srgb, var(--accent) 8%, var(--card));
  border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
}
.smec-wizard-bar {
  display: grid; grid-template-columns: repeat(5, minmax(130px, 1fr)); gap: 8px; margin-bottom: 16px;
}
@media (max-width: 980px) { .smec-wizard-bar { grid-template-columns: repeat(2, 1fr); } }
.smec-wiz-step {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--card); cursor: pointer; text-align: left;
  color: var(--text); transition: border-color .15s, background .15s;
}
.smec-wiz-step:hover { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); }
.smec-wiz-step.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 11%, var(--card));
}
.smec-wiz-step.done .smec-wiz-num {
  background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok);
}
.smec-wiz-num {
  width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; flex: none;
  font-size: 12px; font-weight: 700;
  background: color-mix(in srgb, var(--muted) 16%, transparent); color: var(--muted);
}
.smec-wiz-step.active .smec-wiz-num { background: var(--accent); color: #fff; }

.smec-ocr-layout {
  display: grid; grid-template-columns: 270px minmax(0, 1fr); gap: 16px; align-items: start;
}
.smec-ocr-layout.with-viewer {
  grid-template-columns: 250px minmax(0, 1fr) 370px;
}
@media (max-width: 1240px) {
  .smec-ocr-layout, .smec-ocr-layout.with-viewer { grid-template-columns: minmax(0, 1fr); }
}

.smec-cat-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 9px 11px; border-radius: 8px; border: 1px solid transparent; background: transparent;
  color: var(--text); cursor: pointer; text-align: left; font-size: 12.5px;
}
.smec-cat-btn:hover { background: color-mix(in srgb, var(--muted) 10%, transparent); }
.smec-cat-btn.active {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  background: color-mix(in srgb, var(--accent) 12%, var(--card));
  font-weight: 600;
}

.smec-field-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 10px; }
.smec-field-card {
  border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; background: var(--card);
  display: flex; flex-direction: column; gap: 6px;
}
.smec-field-card.tier-needs_confirm { border-color: color-mix(in srgb, var(--warn) 55%, var(--border)); }
.smec-field-card.tier-missing { border-color: color-mix(in srgb, var(--danger) 45%, var(--border)); }

.smec-input {
  width: 100%; padding: 6px 9px; border-radius: 7px; border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 92%, var(--text) 3%); color: var(--text); font-size: 13px;
}
.smec-input:disabled { opacity: 0.72; cursor: not-allowed; }
.smec-textarea {
  width: 100%; min-height: 76px; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--card); color: var(--text); font-size: 13px; font-family: inherit; resize: vertical;
}

.smec-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.smec-table th {
  text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
  color: var(--muted); padding: 8px 10px; border-bottom: 1px solid var(--border);
}
.smec-table td { padding: 8px 10px; border-bottom: 1px solid color-mix(in srgb, var(--border) 65%, transparent); vertical-align: top; }

.smec-pdf-stage {
  position: relative; border-radius: 8px; border: 1px solid var(--border);
  background: #fff; color: #1e293b; min-height: 360px; padding: 18px; overflow: hidden;
}
.smec-bbox-highlight {
  position: absolute; border: 2px solid #eab308; background: rgba(250, 204, 21, 0.28);
  border-radius: 4px; pointer-events: none; box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.16);
}

.smec-action-bar {
  display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--card); margin-bottom: 14px;
}

.smec-qr-box {
  display: inline-flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--card);
}

.smec-dropzone {
  border: 1.5px dashed color-mix(in srgb, var(--accent) 50%, var(--border));
  border-radius: 12px; padding: 22px 16px; text-align: center; cursor: pointer;
  background: color-mix(in srgb, var(--accent) 5%, var(--card));
}
.smec-dropzone:hover { background: color-mix(in srgb, var(--accent) 10%, var(--card)); }

.smec-modal-backdrop {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); z-index: 90;
  display: grid; place-items: center; padding: 20px;
}
.smec-modal {
  width: min(860px, 100%); max-height: 88vh; overflow-y: auto;
  background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px;
}
`;
let Ve = !1;
function sn() {
  if (Ve || typeof document > "u") return;
  const n = document.createElement("style");
  n.setAttribute("data-sme-connect-styles", "1"), n.textContent = en, document.head.appendChild(n), Ve = !0;
}
Vs();
sn();
const Ge = "sme-connect:copilot-open", Ue = "sme-connect:copilot-width", nn = [
  { step: 1, title: "Tải lên hồ sơ", hint: "Phân loại & Check chéo" },
  { step: 2, title: "Kiểm tra OCR", hint: "6 nhóm & Mẫu Excel B4" },
  { step: 3, title: "Hệ thống đánh giá", hint: "9 Agents + Verifier" },
  { step: 4, title: "Tạo tờ trình", hint: "MB02.PL03 QR & Diff" },
  { step: 5, title: "Thương lượng", hint: "Nghị quyết ELOS & B2B" }
];
function on() {
  var a;
  const n = oe(), [l, p] = x(null), [w, S] = x(null), [o, m] = x(null), [_, C] = x("wizard"), [A, f] = x(1), [g, h] = x("demand"), [v, u] = x(!1), [r, c] = x(""), [z, E] = x(""), [q, L] = x(""), [D, b] = x(() => Ms(Ge)), [O, ie] = x(() => Os(Ue)), [ee, Y] = x(null), [U, te] = x(null), V = ne(0), { syncTick: F } = Ks(D, 4e3);
  le(() => {
    n.get(`${M}/catalog`).then(p).catch(() => p(null));
  }, [n]);
  const W = ce((t) => {
    n.get(`${M}/cases/${t}`).then((N) => {
      m(N), f(N.case.smec.wizard_step || 1), L("");
    }).catch((N) => L(R(N)));
  }, [n]);
  le(() => {
    w && W(w);
  }, [w, F, W]);
  const H = ce((t) => {
    b((N) => {
      const I = typeof t == "function" ? t(N) : t;
      return Ls(Ge, I), I;
    });
  }, []), Q = ce((t) => {
    const N = Be(t);
    ie(N), Ps(Ue, N);
  }, []), d = ce((t, N = "prefill") => {
    H(!0), Y({ id: ++V.current, prompt: t, mode: N });
  }, [H]), B = async (t, N = {}) => {
    if (w) {
      L(""), E("");
      try {
        const I = await n.post(`${M}/cases/${w}/action`, {
          action: t,
          payload: { ...N, wizard_step: A }
        });
        m(I), f(I.case.smec.wizard_step || A), E(`Đã thực hiện hành động: ${t}`), t === "generate_proposal" && f(4), (t === "submit_approval" || t === "submit_los") && f(5);
      } catch (I) {
        L(R(I));
      }
    }
  }, P = xe(() => !w || !o ? [
    { label: "Tổng quan hồ sơ", prompt: "Liệt kê các hồ sơ trên SME Connect và chỉ ra việc cần làm tiếp theo cho CBBH." },
    { label: "Gợi ý gói sản phẩm", prompt: "Tra cứu MST 0108924510 với nhu cầu 17 tỷ có TSBĐ và tư vấn gói đa sản phẩm phù hợp." }
  ] : [
    {
      label: "Rà soát OCR & Mẫu B4",
      prompt: `Kiểm tra hồ sơ ${w}: liệt kê các trường OCR Chưa đủ tin cậy/Thiếu, trạng thái file Excel Mẫu B4 và 7 rule đối chiếu chéo.`
    },
    {
      label: "Soạn thư xin chứng từ",
      prompt: `Soạn thư gửi khách hàng ${String(o.case.customer.name || "")} bổ sung các chứng từ còn thiếu và làm rõ điểm chênh lệch hồ sơ ${w}.`
    },
    {
      label: "Chạy 9 Agents",
      prompt: `Chạy workflow smec-credit-assessment cho hồ sơ ${w} và tóm tắt căn cứ lập Tờ trình MB02.PL03.`
    }
  ], [w, o]);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ s("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: w ? o ? /* @__PURE__ */ s("div", { className: "sme-scroll", children: [
      /* @__PURE__ */ s("div", { className: "sme-hero", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ s("button", { className: "sme-back", onClick: () => {
            S(null), m(null);
          }, children: [
            /* @__PURE__ */ e(Oe, { size: 14 }),
            " Danh sách hồ sơ SME Connect"
          ] }),
          /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", style: { marginBottom: 4 }, children: [
            /* @__PURE__ */ e("span", { className: "sme-mono sme-strong", children: o.case.smec.smec_id }),
            o.case.smec.nclos_id && /* @__PURE__ */ s("span", { className: "sme-chip sme-mono", children: [
              "NCLOS: ",
              o.case.smec.nclos_id
            ] }),
            o.case.smec.elos_id && /* @__PURE__ */ s("span", { className: "sme-chip sme-mono", children: [
              "ELOS: ",
              o.case.smec.elos_id
            ] }),
            /* @__PURE__ */ s("span", { className: `sme-pill t-${o.case.status_meta.tone}`, children: [
              "• ",
              o.case.status_meta.detail_status_label
            ] }),
            /* @__PURE__ */ s("span", { className: "sme-chip", children: [
              "DS: ",
              o.case.status_meta.list_status_label
            ] })
          ] }),
          /* @__PURE__ */ e("h1", { className: "sme-title", children: String(o.case.customer.name || "") }),
          /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
            "ĐKKD/MST: ",
            /* @__PURE__ */ e("b", { className: "sme-mono", children: String(o.case.customer.tax_id || "") }),
            " · CIF: ",
            /* @__PURE__ */ e("b", { className: "sme-mono", children: String(o.case.customer.cif || "") }),
            " · Tổng hạn mức đề xuất: ",
            /* @__PURE__ */ e("b", { children: ae((((a = o.case.smec) == null ? void 0 : a.proposed_products) || []).reduce((t, N) => t + (N.proposed_limit || 0), 0)) })
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ s("div", { className: "sme-filters", children: [
            /* @__PURE__ */ e("button", { className: `sme-filter ${_ === "wizard" ? "on" : ""}`, onClick: () => C("wizard"), children: "Luồng A · Wizard 5 bước" }),
            /* @__PURE__ */ e("button", { className: `sme-filter ${_ === "tabs" ? "on" : ""}`, onClick: () => C("tabs"), children: "Quản lý · 5 Tab chi tiết" })
          ] }),
          /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => H((t) => !t), children: [
            /* @__PURE__ */ e(Se, { size: 14 }),
            " ",
            D ? "Ẩn Copilot" : "Copilot"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "smec-action-bar", children: [
        /* @__PURE__ */ s(k, { variant: "secondary", onClick: () => B("generate_proposal"), children: [
          /* @__PURE__ */ e(ws, { size: 13 }),
          " Tạo tờ trình"
        ] }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => B("save_draft"), children: [
          /* @__PURE__ */ e(_s, { size: 13 }),
          " Lưu"
        ] }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => B("update_case"), children: [
          /* @__PURE__ */ e(Cs, { size: 13 }),
          " Cập nhật"
        ] }),
        /* @__PURE__ */ s(k, { variant: "primary", onClick: () => B("submit_approval"), children: [
          /* @__PURE__ */ e(es, { size: 13 }),
          " Trình duyệt hồ sơ"
        ] }),
        /* @__PURE__ */ e(k, { variant: "secondary", onClick: () => B("submit_los"), children: "Submit LOS" }),
        /* @__PURE__ */ e(k, { variant: "secondary", onClick: () => B("send_b2b_confirm"), children: "Chuyển KH xác nhận" }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => B("mark_b2b_done"), children: [
          /* @__PURE__ */ e(he, { size: 13 }),
          " Đã có B2B"
        ] }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => B("switch_offline"), children: [
          /* @__PURE__ */ e(Ss, { size: 13 }),
          " Chuyển luồng offline"
        ] }),
        /* @__PURE__ */ s(k, { variant: "ghost", onClick: () => u(!0), children: [
          /* @__PURE__ */ e(Ts, { size: 13 }),
          " Huỷ hồ sơ"
        ] })
      ] }),
      q && /* @__PURE__ */ e("div", { className: "sme-card tight", style: { borderColor: "var(--danger)", color: "var(--danger)", marginBottom: 12 }, children: q }),
      z && /* @__PURE__ */ e("div", { className: "sme-card tight", style: { borderColor: "var(--ok)", color: "var(--ok)", marginBottom: 12 }, children: z }),
      (o.case.smec.cancel_reason || o.case.smec.reject_reason) && /* @__PURE__ */ s("div", { className: "sme-card tight", style: { borderColor: "var(--danger)", marginBottom: 12 }, children: [
        /* @__PURE__ */ e("b", { children: "Lý do hủy / từ chối:" }),
        " ",
        o.case.smec.cancel_reason || o.case.smec.reject_reason
      ] }),
      _ === "wizard" ? /* @__PURE__ */ s(je, { children: [
        /* @__PURE__ */ e("div", { className: "smec-wizard-bar", children: nn.map((t) => {
          const N = t.step < (o.case.smec.wizard_step || 1), I = t.step === A;
          return /* @__PURE__ */ s(
            "button",
            {
              className: `smec-wiz-step ${I ? "active" : ""} ${N ? "done" : ""}`,
              onClick: () => f(t.step),
              children: [
                /* @__PURE__ */ e("span", { className: "smec-wiz-num", children: N ? "✓" : t.step }),
                /* @__PURE__ */ s("div", { children: [
                  /* @__PURE__ */ e("div", { className: "sme-strong", style: { fontSize: 12.5 }, children: t.title }),
                  /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { fontSize: 11 }, children: t.hint })
                ] })
              ]
            },
            t.step
          );
        }) }),
        A === 1 && /* @__PURE__ */ e(
          Fe,
          {
            data: o,
            catalog: l,
            onRefresh: m,
            onNextStep: () => f(2),
            onAskAssistant: d
          }
        ),
        A === 2 && /* @__PURE__ */ e(
          He,
          {
            data: o,
            agentGroups: (l == null ? void 0 : l.agent_groups) || [],
            onRefresh: m,
            onNextStep: () => f(3)
          }
        ),
        A === 3 && /* @__PURE__ */ e(
          Ws,
          {
            data: o,
            onRefresh: m,
            onNextStep: () => f(4),
            onAskAssistant: d
          }
        ),
        A === 4 && /* @__PURE__ */ e(
          Xs,
          {
            data: o,
            onRefresh: m,
            onSubmitLos: () => B("submit_approval")
          }
        ),
        A === 5 && /* @__PURE__ */ e(
          Re,
          {
            data: o,
            onRefresh: m
          }
        )
      ] }) : (
        /* 5-Tab Case Management View (`node-id=9:2201`) */
        /* @__PURE__ */ s("div", { className: "sme-stack", children: [
          /* @__PURE__ */ s("div", { className: "sme-tabs", children: [
            /* @__PURE__ */ s("button", { className: `sme-tab ${g === "demand" ? "on" : ""}`, onClick: () => h("demand"), children: [
              /* @__PURE__ */ e(zs, { size: 14 }),
              " Nhu cầu cấp tín dụng"
            ] }),
            /* @__PURE__ */ s("button", { className: `sme-tab ${g === "docs" ? "on" : ""}`, onClick: () => h("docs"), children: [
              "Hồ sơ tải lên ",
              /* @__PURE__ */ e("span", { className: "sme-count", children: o.case.documents.length })
            ] }),
            /* @__PURE__ */ e("button", { className: `sme-tab ${g === "customer" ? "on" : ""}`, onClick: () => h("customer"), children: "Thông tin chi tiết khách hàng" }),
            /* @__PURE__ */ s("button", { className: `sme-tab ${g === "negotiation" ? "on" : ""}`, onClick: () => h("negotiation"), children: [
              "Thương lượng nghị quyết ",
              /* @__PURE__ */ e("span", { className: "sme-count", children: o.resolution.comments.length })
            ] }),
            /* @__PURE__ */ s("button", { className: `sme-tab ${g === "history" ? "on" : ""}`, onClick: () => h("history"), children: [
              /* @__PURE__ */ e(Bs, { size: 14 }),
              " Lịch sử hồ sơ ",
              /* @__PURE__ */ e("span", { className: "sme-count", children: o.audit.length })
            ] })
          ] }),
          g === "demand" && /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { marginBottom: 10 }, children: "Gói Đa sản phẩm & Cam kết CBBH" }),
            /* @__PURE__ */ s("table", { className: "smec-table", children: [
              /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("th", { children: "Mã SP" }),
                /* @__PURE__ */ e("th", { children: "Tên sản phẩm trên SME Connect" }),
                /* @__PURE__ */ e("th", { children: "Độ phù hợp AI" }),
                /* @__PURE__ */ e("th", { children: "Hạn mức đề xuất" }),
                /* @__PURE__ */ e("th", { children: "Thời hạn" }),
                /* @__PURE__ */ e("th", { children: "Bảo đảm" }),
                /* @__PURE__ */ e("th", { children: "Cam kết CBBH" })
              ] }) }),
              /* @__PURE__ */ e("tbody", { children: o.case.smec.proposed_products.map((t) => /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: t.code }),
                /* @__PURE__ */ e("td", { className: "sme-strong", children: t.name }),
                /* @__PURE__ */ e("td", { children: /* @__PURE__ */ s("span", { className: "sme-pill t-ok", children: [
                  t.match_score,
                  "%"
                ] }) }),
                /* @__PURE__ */ e("td", { className: "sme-strong", children: ae(t.proposed_limit) }),
                /* @__PURE__ */ s("td", { children: [
                  t.term_months,
                  " tháng"
                ] }),
                /* @__PURE__ */ e("td", { children: t.requires_collateral ? "Có TSBĐ" : "Tín chấp" }),
                /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("span", { className: "sme-pill t-ok", children: "✓ Đã cam kết" }) })
              ] }, t.code)) })
            ] })
          ] }),
          g === "docs" && /* @__PURE__ */ e(
            Fe,
            {
              data: o,
              catalog: l,
              onRefresh: m,
              onNextStep: () => {
                C("wizard"), f(2);
              },
              onAskAssistant: d
            }
          ),
          g === "customer" && /* @__PURE__ */ e(
            He,
            {
              data: o,
              agentGroups: (l == null ? void 0 : l.agent_groups) || [],
              onRefresh: m,
              onNextStep: () => {
                C("wizard"), f(3);
              }
            }
          ),
          g === "negotiation" && /* @__PURE__ */ e(Re, { data: o, onRefresh: m }),
          g === "history" && /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { marginBottom: 10 }, children: "Nhật ký Kiểm toán & Lịch sử Vòng đời Hồ sơ" }),
            /* @__PURE__ */ s("table", { className: "smec-table", children: [
              /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("th", { children: "Thời điểm" }),
                /* @__PURE__ */ e("th", { children: "Sự kiện" }),
                /* @__PURE__ */ e("th", { children: "Chi tiết" })
              ] }) }),
              /* @__PURE__ */ e("tbody", { children: [...o.audit].reverse().map((t, N) => /* @__PURE__ */ s("tr", { children: [
                /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: ze(t.ts) }),
                /* @__PURE__ */ e("td", { className: "sme-mono sme-strong", children: t.action }),
                /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: JSON.stringify(Object.fromEntries(Object.entries(t).filter(([I]) => I !== "ts" && I !== "action"))) })
              ] }, N)) })
            ] })
          ] })
        ] })
      ),
      v && /* @__PURE__ */ e("div", { className: "smec-modal-backdrop", onClick: () => u(!1), children: /* @__PURE__ */ s("div", { className: "smec-modal", style: { maxWidth: 460 }, onClick: (t) => t.stopPropagation(), children: [
        /* @__PURE__ */ e("div", { className: "sme-h2", style: { marginBottom: 8 }, children: "Bạn có chắc chắn muốn Hủy hồ sơ này?" }),
        /* @__PURE__ */ s("div", { className: "sme-small sme-muted", style: { marginBottom: 10 }, children: [
          "Trạng thái hồ sơ sẽ chuyển sang ",
          /* @__PURE__ */ e("b", { children: "Sale Huỷ hồ sơ" }),
          ". Vui lòng nhập rõ lý do hủy:"
        ] }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "smec-textarea",
            value: r,
            onChange: (t) => c(t.target.value),
            placeholder: "Nhập lý do hủy hồ sơ (VD: Khách hàng tạm dừng kế hoạch nhập hàng)..."
          }
        ),
        /* @__PURE__ */ s("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 12 }, children: [
          /* @__PURE__ */ e(k, { variant: "ghost", onClick: () => u(!1), children: "Đóng" }),
          /* @__PURE__ */ e(
            k,
            {
              variant: "primary",
              disabled: !r.trim(),
              onClick: () => {
                u(!1), B("cancel_case", { reason: r }), c("");
              },
              children: "Xác nhận hủy hồ sơ"
            }
          )
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ s("div", { className: "sme-scroll", children: [
      /* @__PURE__ */ s("button", { className: "sme-back", onClick: () => S(null), children: [
        /* @__PURE__ */ e(Oe, { size: 14 }),
        " Danh sách hồ sơ"
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-card sme-muted", children: q || "Đang tải chi tiết hồ sơ SME Connect..." })
    ] }) : /* @__PURE__ */ e(
      js,
      {
        catalog: l,
        assistantOpen: D,
        syncTick: F,
        onOpen: (t) => {
          m(null), S(t);
        },
        onToggleAssistant: () => H((t) => !t),
        onAskAssistant: d
      }
    ) }),
    D && /* @__PURE__ */ e(
      qs,
      {
        storagePrefix: "sme-connect",
        chatPrefix: Us,
        agent: Gs,
        panelLabel: "Trợ lý SME Connect",
        newIntakePrompt: "Tra cứu MST và khởi tạo bộ hồ sơ SME Connect mới cho khách hàng: ",
        newSessionTitle: "SME Connect Copilot",
        caseTitlePrefix: "SMEC",
        chips: P,
        showNewSessionButton: !0,
        embedPlaceholder: "Hỏi Copilot về OCR, Mẫu B4, 9 Agents hoặc soạn thư xin chứng từ...",
        width: O,
        onWidthChange: Q,
        onClose: () => H(!1),
        caseId: w,
        customerName: o ? String(o.case.customer.name || "") : void 0,
        intent: ee,
        onConsumeIntent: () => Y(null),
        createdCase: U,
        onOpenCase: (t) => {
          te(null), S(t);
        },
        onDismissCreatedCase: () => te(null)
      }
    )
  ] }) });
}
export {
  on as default
};
