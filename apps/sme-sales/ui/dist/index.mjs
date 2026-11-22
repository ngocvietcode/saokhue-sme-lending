import { jsxs as n, jsx as e, Fragment as Se } from "react/jsx-runtime";
import * as We from "@kirocrew/app-sdk";
import { useChatLauncher as Lt, useAppApi as Ze } from "@kirocrew/app-sdk";
import { useCallback as te, useState as w, useMemo as F, useRef as re, useEffect as ne, Fragment as kt } from "react";
import { Btn as C, PageHeader as Mt, ErrorNotice as wt } from "@kirocrew/app-sdk/ui";
import { MessageSquare as $e, Plus as Ye, ExternalLink as Ue, PanelRightClose as Rt, ArrowRight as Pt, AlertTriangle as Ft, FileText as Nt, Mail as Je, Calendar as Gt, CheckCircle2 as Ct, XCircle as Xt, CircleDot as jt, CircleDashed as Vt, RefreshCw as _t, FolderOpen as dt, ClipboardCheck as Ie, ShieldAlert as Ot, Clock as Ut, Search as mt, X as Wt, Send as St, Check as Pe, Copy as Fe, SkipForward as Yt, RotateCcw as Qt, FileSearch as Zt, Eye as Jt, Download as en, Trash2 as tn, History as nn, ArrowLeft as sn, Unlock as ht, Landmark as rn, ClipboardList as an, ShieldCheck as on, Activity as ln } from "lucide-react";
const cn = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function dn(t, s, r) {
  const i = Lt();
  return te(
    async (h, c, g) => {
      const { openChat: p } = i, f = i.createChat;
      if (!f) {
        p({ autoSend: !1, message: h });
        return;
      }
      try {
        const y = await f({ slotKey: s + cn(c), agent: t, title: g });
        p({ slotKey: y, autoSend: !1, message: h });
      } catch {
      }
    },
    [i, t, s, r]
  );
}
const et = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, Re = new Intl.NumberFormat("vi-VN"), $t = (t) => typeof t == "number" ? Re.format(t) + " đ" : "—", tt = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? Re.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? Re.format(Math.round(t / 1e4) / 100) + " triệu" : Re.format(t) + " đ", _e = (t, s = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", Be = (t) => {
  if (!t) return "—";
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "—" : s.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}, me = (t) => {
  if (!t) return "—";
  const s = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t.trim());
  if (s) return `${Number(s[3])}/${Number(s[2])}/${s[1]}`;
  const r = new Date(t);
  return Number.isNaN(r.getTime()) ? "—" : r.toLocaleDateString("vi-VN");
}, Tt = (t) => {
  if (!t) return "—";
  const s = new Date(t).getTime();
  if (Number.isNaN(s)) return "—";
  const r = Math.round((Date.now() - s) / 1e3);
  return r < 60 ? "vừa xong" : r < 3600 ? `${Math.floor(r / 60)} phút trước` : r < 86400 ? `${Math.floor(r / 3600)} giờ trước` : `${Math.floor(r / 86400)} ngày trước`;
}, ut = (t) => {
  const s = /* @__PURE__ */ new Date();
  s.setDate(s.getDate() + t);
  const r = s.getFullYear(), i = String(s.getMonth() + 1).padStart(2, "0"), h = String(s.getDate()).padStart(2, "0");
  return `${r}-${i}-${h}`;
};
async function nt(t) {
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
const De = (t) => t instanceof Error ? t.message : String(t), Qe = "kirocrew_prefill", pt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100), mn = (t, s) => {
};
function st(t) {
  return Math.min(620, Math.max(360, Math.round(t)));
}
function hn(t) {
  try {
    const s = localStorage.getItem(t);
    if (s === "1") return !0;
    if (s === "0") return !1;
  } catch {
  }
  return typeof window > "u" ? !0 : window.innerWidth >= 1180;
}
function un(t, s) {
  try {
    localStorage.setItem(t, s ? "1" : "0");
  } catch {
  }
}
function pn(t, s = 420) {
  try {
    const r = Number(localStorage.getItem(t));
    if (Number.isFinite(r) && r >= 360 && r <= 620) return Math.round(r);
  } catch {
  }
  return s;
}
function gn(t, s) {
  try {
    localStorage.setItem(t, String(st(s)));
  } catch {
  }
}
function fn(t, s = 4e3) {
  const r = We.useAppEvents ?? mn, [i, h] = w(0), c = te(() => h((g) => g + 1), []);
  return r("tool_result", c), r("chat_done", c), ne(() => {
    if (!t) return;
    const g = window.setInterval(() => {
      document.visibilityState !== "hidden" && h((p) => p + 1);
    }, s);
    return () => window.clearInterval(g);
  }, [t, s]), { syncTick: i, bumpSync: c };
}
function bn(t) {
  try {
    const s = sessionStorage.getItem(t);
    if (s) return s;
    const r = `intake-${Date.now().toString(36)}`;
    return sessionStorage.setItem(t, r), r;
  } catch {
    return "intake-default";
  }
}
function xn(t, s) {
  try {
    sessionStorage.setItem(t, s);
  } catch {
  }
}
function Ne(t) {
  return t ? t.querySelector("[data-composer-input]") ?? t.querySelector("textarea") : null;
}
function Ae(t) {
  return t ? t instanceof HTMLTextAreaElement ? t.value : t.textContent ?? "" : "";
}
function Le(t) {
  if (!t) return;
  if (t.focus(), t instanceof HTMLTextAreaElement) {
    const r = t.value.length;
    t.setSelectionRange(r, r);
    return;
  }
  const s = window.getSelection();
  s && (s.selectAllChildren(t), s.collapseToEnd());
}
function gt(t, s) {
  const r = Date.now();
  try {
    sessionStorage.setItem(Qe, JSON.stringify({ slotKey: t, prompt: s, ts: r }));
  } catch {
  }
  return r;
}
function vn({
  storagePrefix: t,
  chatPrefix: s,
  agent: r,
  panelLabel: i,
  newIntakePrompt: h,
  newSessionTitle: c,
  caseTitlePrefix: g = "Hồ sơ",
  chips: p = [],
  showNewSessionButton: f,
  attachDefaultPrefix: y,
  embedPlaceholder: u,
  width: b,
  onWidthChange: _,
  onClose: z,
  caseId: a,
  customerName: $,
  intent: l,
  onConsumeIntent: q,
  createdCase: I,
  onOpenCase: Y,
  onDismissCreatedCase: E
}) {
  const Q = We, D = Q.ChatPanel, K = Q.ChatEmbed, Z = We.useChatLauncher(), X = dn(r, s), P = `${t}:intake-id`, [x, B] = w(() => bn(P)), J = a ?? x, v = s + pt(J), N = F(() => a ? $ ? `${g} ${$} (${a})` : `${g} ${a}` : c, [a, $, c, g]), [H, U] = w(null), [d, M] = w(null), V = re(null);
  V.current = H, ne(() => {
    let k = !1;
    M(null);
    const S = V.current === v, R = Z.createChat;
    if (!R) {
      S || U(v);
      return;
    }
    return S || U(null), R({ slotKey: v, agent: r, title: N }).then((L) => {
      if (k) return;
      const j = L || v;
      V.current !== j && U(j);
    }).catch((L) => {
      k || S || M(De(L));
    }), () => {
      k = !0;
    };
  }, [v, r, N, Z]);
  const ie = re(null), G = re(0), oe = re(null), T = re(!1), [m, ae] = w(0), W = te((k, S) => {
    const R = S.trim();
    if (!R) return;
    const L = Ne(ie.current);
    if (V.current === k && L) {
      Ae(L).trim().includes(R) || window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: S } })), requestAnimationFrame(() => Le(Ne(ie.current)));
      return;
    }
    const j = gt(k, S);
    oe.current = { slotKey: k, prompt: S, ts: j }, ae((le) => le + 1);
  }, []);
  ne(() => {
    const k = oe.current;
    if (!k || H !== k.slotKey) return;
    let S = 0, R = 0;
    const L = window.setInterval(() => {
      S += 1;
      const j = Ne(ie.current);
      if (!j) {
        S >= 20 && (window.clearInterval(L), oe.current = null);
        return;
      }
      if (Ae(j).trim().includes(k.prompt.trim())) {
        oe.current = null, window.clearInterval(L), Le(j);
        return;
      }
      if (R += 1, R >= 3) {
        try {
          const ce = sessionStorage.getItem(Qe);
          if (ce) {
            const fe = JSON.parse(ce);
            fe.slotKey === k.slotKey && fe.ts === k.ts && sessionStorage.removeItem(Qe);
          }
        } catch {
        }
        window.dispatchEvent(new CustomEvent("mc-widget-send", { detail: { text: k.prompt } })), oe.current = null, window.clearInterval(L), requestAnimationFrame(() => Le(Ne(ie.current)));
      }
    }, 60);
    return () => window.clearInterval(L);
  }, [H, m]), ne(() => {
    if (!T.current || !H) return;
    let k = 0;
    const S = () => {
      var j;
      const L = (j = ie.current) == null ? void 0 : j.querySelector('input[type="file"]');
      return L ? (T.current = !1, L.click(), !0) : !1;
    };
    if (S()) return;
    const R = window.setInterval(() => {
      k += 1, (S() || k >= 16) && (T.current = !1, window.clearInterval(R));
    }, 50);
    return () => window.clearInterval(R);
  }, [H, m]);
  const O = te((k) => {
    const S = `intake-${Date.now().toString(36)}`, R = s + pt(S);
    if (xn(P, S), E(), k) {
      const L = gt(R, k);
      oe.current = { slotKey: R, prompt: k, ts: L }, ae((j) => j + 1);
    }
    B(S);
  }, [s, P, E]);
  ne(() => {
    var k;
    if (!(!l || l.id === G.current)) {
      if (G.current = l.id, l.mode === "new_intake") {
        const S = Ne(ie.current), R = Ae(S).trim(), L = (l.prompt || h).trim();
        a === null && R === L && S ? Le(S) : O(l.prompt || h), q();
        return;
      }
      if (l.mode === "attach") {
        const S = Ne(ie.current), R = y ?? (a ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${a}: ` : "");
        R && !Ae(S).trim() && W(v, R);
        const L = (k = ie.current) == null ? void 0 : k.querySelector('input[type="file"]');
        L ? (T.current = !1, L.click()) : (T.current = !0, ae((j) => j + 1)), q();
        return;
      }
      W(v, l.prompt), q();
    }
  }, [
    l,
    a,
    v,
    h,
    y,
    q,
    W,
    O
  ]);
  const [Te, Ke] = w(!1), ge = re(null), ye = (k) => {
    k.preventDefault(), k.currentTarget.setPointerCapture(k.pointerId), ge.current = { startX: k.clientX, startW: b, pointerId: k.pointerId }, Ke(!0);
  }, Xe = (k) => {
    const S = ge.current;
    !S || S.pointerId !== k.pointerId || _(st(S.startW + (S.startX - k.clientX)));
  }, ze = (k) => {
    var S;
    ((S = ge.current) == null ? void 0 : S.pointerId) === k.pointerId && (ge.current = null, Ke(!1));
  }, he = f ?? !a;
  return /* @__PURE__ */ n("aside", { ref: ie, className: "sme-dock", style: { width: b }, "aria-label": i, children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `sme-dock-resizer ${Te ? "dragging" : ""}`,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": "Kéo để đổi độ rộng bảng trợ lý",
        onPointerDown: ye,
        onPointerMove: Xe,
        onPointerUp: ze,
        onPointerCancel: ze
      }
    ),
    /* @__PURE__ */ n("header", { className: "sme-dock-head", children: [
      /* @__PURE__ */ n("div", { className: "sme-dock-left", children: [
        /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 5, flex: "none" }, children: [
          /* @__PURE__ */ e($e, { size: 14, style: { color: "var(--accent)", flex: "none" } }),
          a ? /* @__PURE__ */ e("span", { className: "sme-mono sme-small sme-muted", children: a }) : /* @__PURE__ */ e("span", { className: "sme-small sme-strong", children: i })
        ] }),
        p.length > 0 && /* @__PURE__ */ e("div", { className: "sme-dock-chips", children: p.map((k) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-quick-chip",
            onClick: () => {
              k.onClick ? k.onClick() : k.prompt && W(v, k.prompt);
            },
            children: k.label
          },
          k.label
        )) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 2, flex: "none" }, children: [
        he && /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Phiên tạo hồ sơ mới", onClick: () => O(), children: /* @__PURE__ */ e(Ye, { size: 15 }) }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-icon-btn",
            title: "Mở toàn màn hình trong Chat",
            onClick: () => X("", J, N),
            children: /* @__PURE__ */ e(Ue, { size: 14 })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "sme-icon-btn", title: "Thu gọn trợ lý", onClick: z, children: /* @__PURE__ */ e(Rt, { size: 15 }) })
      ] })
    ] }),
    !a && I && /* @__PURE__ */ n("div", { className: "sme-dock-new-banner", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "Hồ sơ mới: ",
        /* @__PURE__ */ e("b", { children: I.name }),
        " ",
        /* @__PURE__ */ n("span", { className: "sme-mono", children: [
          "(",
          I.caseId,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ n(C, { primary: !0, onClick: () => Y(I.caseId), children: [
        "Mở hồ sơ ",
        /* @__PURE__ */ e(Pt, { size: 12 })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-dock-body", children: d ? /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Không khởi tạo được phiên trợ lý" }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: d }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(C, { onClick: () => X("", J, N), children: [
        /* @__PURE__ */ e(Ue, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : H ? D ? /* @__PURE__ */ e(D, { slotKey: H, conversationOnly: !0 }, H) : K ? /* @__PURE__ */ e(
      K,
      {
        slotKey: H,
        agent: r,
        frameless: !0,
        startAtBottom: !0,
        placeholder: u
      },
      H
    ) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 10 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-h3", children: "Host chưa hỗ trợ nhúng khung chat tại trang" }),
      /* @__PURE__ */ e("div", { className: "sme-row", children: /* @__PURE__ */ n(C, { primary: !0, onClick: () => X("", J, N), children: [
        /* @__PURE__ */ e(Ue, { size: 13 }),
        " Mở Trợ lý ở trang Chat"
      ] }) })
    ] }) }) : /* @__PURE__ */ e("div", { className: "sme-dock-fallback", children: /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "55%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "75%" } })
    ] }) }) })
  ] });
}
const yn = `
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
function kn() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = yn, document.head.appendChild(s);
}
const He = "/apps/sme-sales/api", ft = {
  draft: { label: "Khởi tạo", tone: "muted" },
  collecting: { label: "Đang thu thập", tone: "warn" },
  ready: { label: "Đủ điều kiện trình", tone: "ok" },
  submitted: { label: "Đã bàn giao", tone: "info" }
}, zt = {
  open: { label: "Chưa bổ sung", tone: "danger" },
  requested: { label: "Chờ khách hàng", tone: "info" },
  waived: { label: "Xin miễn / Bổ sung sau", tone: "muted" },
  resolved: { label: "Đạt", tone: "ok" },
  ok: { label: "Đạt", tone: "ok" }
}, rt = { email: "Email", zalo: "Zalo", phone_script: "Kịch bản gọi" }, wn = {
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
}, qt = (t) => t ? t.startsWith("agent:") || t === "dossier-coach" ? "Trợ lý AI" : "ĐVKD" : "Hệ thống", Nn = "dossier-coach", Cn = "sme-sales-chat-";
function _n(t) {
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
function Ee(t, s, r) {
  if (s == null || s === "") return "—";
  if (t === "request.purpose" && typeof s == "string") return et[s] ?? s;
  if (t === "request.product_code" && typeof s == "string") {
    const i = r == null ? void 0 : r.products.products.find((h) => h.code === s);
    return i ? `${i.code} · ${i.name}` : s;
  }
  return typeof s == "number" ? /fiscal_year/.test(t) ? String(s) : /_pct$|ty_le/.test(t) ? `${_e(s, 2)}%` : /term_months|so_thang/.test(t) ? `${s} tháng` : /years_in_operation|so_nam/.test(t) ? `${_e(s, 1)} năm` : /amount|capital|revenue|income|assets|equity|investment|value|so_tien|gia_tri|doanh_thu|von|tai_san|loi_nhuan/.test(t) ? $t(s) : s.toLocaleString("vi-VN") : typeof s == "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) ? me(s) : String(s);
}
function Ge(t, s) {
  return s == null || s === "" ? "—" : t === "loan_amount" ? tt(s) : t === "term_months" ? `${_e(s, 0)} tháng` : t === "years_in_operation" ? `${_e(s, 1)} năm` : t === "equity_contribution_pct" ? `${_e(s, 1)}%` : typeof s == "number" ? _e(s) : String(s);
}
function Sn(t, s, r = "email", i = !1) {
  const h = rt[r], c = i ? "nhắc khách bổ sung (giọng nhắc lịch sự các mục đã yêu cầu)" : "xin khách bổ sung", g = s.map((p) => `- ${p.title} [${p.key}]`).join(`
`);
  return `Soạn ${h} ${c} cho hồ sơ ${t} (kênh: ${r}) gồm các hạng mục sau:
${g}`;
}
function $n(t, s) {
  var b, _, z;
  const { case: r, overview: i } = t, h = (s == null ? void 0 : s.documents.types) ?? {}, c = i.items.filter((a) => a.blocking).length, g = i.items.filter((a) => a.blocking && ["ok", "resolved", "waived"].includes(a.status)).length, p = [
    `PHIẾU BÀN GIAO HỒ SƠ THẨM ĐỊNH: ${r.case_id}`,
    `Khách hàng: ${((b = r.customer) == null ? void 0 : b.name) ?? "Chưa rõ"} | MST: ${((_ = r.customer) == null ? void 0 : _.tax_id) ?? "—"} | Luồng: ${r.flow}`,
    `Hạng mục bắt buộc: ${g}/${c} | Trạng thái: ${i.readiness.ready ? "Đủ điều kiện trình" : `Còn ${i.readiness.blocking_open.length} mục chặn`}`,
    "",
    "1. THÔNG TIN KHÁCH HÀNG & ĐỀ XUẤT"
  ];
  for (const a of i.profile)
    p.push(`- ${a.label}: ${Ee(a.path, a.value, s)}`);
  p.push("", `2. CHỨNG TỪ ĐỐI CHIẾU (${r.documents.length})`), r.documents.length === 0 && p.push("- Chưa có chứng từ");
  for (const a of r.documents) {
    const $ = a.type ? ((z = h[a.type]) == null ? void 0 : z.label) ?? a.type : "Chưa phân loại";
    p.push(`- ${a.id}: ${$} (${a.name}${a.issued_date ? `, lập ${me(a.issued_date)}` : ""})${a.summary ? ` — ${a.summary}` : ""}`);
  }
  const f = (i.policy_checks ?? []).filter((a) => a.status === "not_met");
  if (f.length > 0) {
    p.push("", "3. LƯU Ý ĐIỀU KIỆN CHÍNH SÁCH SƠ BỘ");
    for (const a of f)
      p.push(`- ${a.label}: thực tế ${Ge(a.fact, a.actual)}, yêu cầu ${a.op} ${Ge(a.fact, a.threshold)} (${a.clause})`);
  }
  const y = i.items.filter((a) => a.status === "waived");
  if (y.length > 0) {
    p.push("", "4. CÁC HẠNG MỤC XIN MIỄN / BỔ SUNG SAU KÈM GIẢI TRÌNH");
    for (const a of y)
      p.push(`- ${a.title}: ${a.note || "Không có ghi chú"}`);
  }
  const u = i.items.filter((a) => a.blocking && (a.status === "open" || a.status === "requested"));
  if (u.length > 0) {
    p.push("", "5. CÁC HẠNG MỤC CHẶN CHƯA ĐẠT (TRÌNH KÈM GIẢI TRÌNH)");
    for (const a of u)
      p.push(`- ${a.title} (${zt[a.status].label}${a.due_date ? `, hạn ${me(a.due_date)}` : ""})`);
  }
  return p.join(`
`);
}
function Tn({
  width: t,
  onWidthChange: s,
  onClose: r,
  caseId: i,
  customerName: h,
  readOnly: c = !1,
  hasOpenItems: g = !1,
  intent: p,
  onConsumeIntent: f,
  createdCase: y,
  onOpenCase: u,
  onDismissCreatedCase: b,
  onQuickDraft: _
}) {
  const z = F(() => {
    if (!i)
      return [{
        label: "Việc hôm nay",
        prompt: "Rà soát danh sách hồ sơ đang mở hôm nay, nêu các hồ sơ quá hạn hoặc sắp đủ điều kiện trình."
      }];
    if (c) return [];
    const a = [{
      label: "Cập nhật",
      prompt: `Cập nhật thông tin hồ sơ ${i}: `
    }];
    return g && _ && a.push({ label: "Soạn thư", onClick: _ }), a.push({
      label: "Rà soát",
      prompt: `Rà soát các hạng mục chặn và điều kiện chính sách còn thiếu của hồ sơ ${i}, đề xuất phương án xử lý.`
    }), a;
  }, [i, c, g, _]);
  return /* @__PURE__ */ e(
    vn,
    {
      storagePrefix: "sme-sales",
      chatPrefix: Cn,
      agent: Nn,
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
      intent: p,
      onConsumeIntent: f,
      createdCase: y,
      onOpenCase: u,
      onDismissCreatedCase: b
    }
  );
}
const pe = (t) => `t-${t}`;
function se({ t, children: s, title: r }) {
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
function bt({ t = "warn", children: s }) {
  return /* @__PURE__ */ n("div", { className: `sme-banner ${pe(t)}`, children: [
    /* @__PURE__ */ e(Ft, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function It(t) {
  if (t.stage === "submitted") return { label: "Đã bàn giao", t: "info" };
  if (t.overdue > 0) return { label: `${t.overdue} quá hạn`, t: "danger" };
  if (t.ready) return { label: "Đủ điều kiện trình", t: "ok" };
  const s = t.actionable_blocking ?? t.blocking_open;
  return s > 0 ? { label: `Thiếu ${s} mục chặn`, t: "warn" } : t.requested > 0 ? { label: `Chờ KH (${t.requested})`, t: "info" } : { label: "Khởi tạo", t: "muted" };
}
function Dt(t) {
  let s = 0, r = 0;
  for (const i of t.groups)
    s += i.done, r += i.total;
  return { done: s, total: r };
}
function zn({ rows: t, onOpen: s }) {
  return t.length === 0 ? /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(Nt, { size: 28 }), title: "Không có hồ sơ phù hợp" }) : /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
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
      const i = It(r), { done: h, total: c } = Dt(r), g = r.actionable_blocking ?? r.blocking_open;
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
        /* @__PURE__ */ e("td", { className: "sme-num sme-strong", children: tt(r.amount) }),
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
        /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(se, { t: i.t, children: i.label }) }),
        /* @__PURE__ */ e("td", { className: "sme-small sme-muted", children: Tt(r.updated_at) })
      ] }, r.case_id);
    }) })
  ] }) });
}
const xt = ({ stage: t }) => /* @__PURE__ */ e(se, { t: ft[t].tone, children: ft[t].label });
function Ht(t) {
  return t.done === t.total && t.total > 0 ? "ok" : t.blocked > 0 ? "danger" : t.done > 0 ? "warn" : "muted";
}
function qn({ g: t, size: s = 12 }) {
  return t.done === t.total && t.total > 0 ? /* @__PURE__ */ e(Ct, { size: s }) : t.blocked > 0 ? /* @__PURE__ */ e(Xt, { size: s }) : t.done > 0 ? /* @__PURE__ */ e(jt, { size: s }) : /* @__PURE__ */ e(Vt, { size: s });
}
function In({ groups: t, activeGroup: s, onSelectGroup: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: t.map((i) => {
    const h = Ht(i), c = s === i.group;
    return /* @__PURE__ */ n("div", { className: "sme-phase", children: [
      /* @__PURE__ */ e("span", { className: "sme-phase-name", children: i.label }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-node ${pe(h)} ${c ? "ss-active-node" : ""}`,
          title: `${i.label}: ${i.done}/${i.total} hạng mục đạt${i.blocked ? `, ${i.blocked} chặn` : ""}`,
          onClick: () => r(c ? null : i.group),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(qn, { g: i }) }),
            /* @__PURE__ */ n("span", { children: [
              i.done,
              "/",
              i.total,
              " hạng mục",
              c ? " · lọc" : ""
            ] })
          ]
        }
      )
    ] }, i.group);
  }) }) });
}
const Dn = [2, 3, 5, 7];
function it({ label: t = "Hạn cam kết bổ sung", confirmLabel: s = "Xác nhận", busy: r, onConfirm: i, onCancel: h }) {
  const [c, g] = w(() => ut(3));
  return /* @__PURE__ */ n("div", { className: "ss-due-row", children: [
    /* @__PURE__ */ n("span", { className: "sme-small sme-muted sme-row", style: { gap: 5 }, children: [
      /* @__PURE__ */ e(Gt, { size: 13 }),
      " ",
      t,
      ":"
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-filters", role: "group", "aria-label": "Chọn nhanh số ngày", children: Dn.map((p) => {
      const f = ut(p);
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: `sme-filter ${c === f ? "on" : ""}`,
          onClick: () => g(f),
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
        value: c,
        onChange: (p) => g(p.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 6, marginLeft: "auto" }, children: [
      h && /* @__PURE__ */ e(C, { onClick: h, children: "Huỷ" }),
      /* @__PURE__ */ e(C, { primary: !0, busy: r, disabled: !c, onClick: () => i(c), children: s })
    ] })
  ] });
}
function Et({ onPick: t }) {
  return /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: ["email", "zalo", "phone_script"].map((s) => /* @__PURE__ */ n(C, { onClick: () => t(s), children: [
    /* @__PURE__ */ e(Je, { size: 13 }),
    " ",
    rt[s]
  ] }, s)) });
}
const Hn = `
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
function En() {
  const t = "sme-sales-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const s = document.createElement("style");
  s.id = t, s.textContent = Hn, document.head.appendChild(s);
}
const Bt = "sme-sales:view", Bn = () => {
  try {
    return localStorage.getItem(Bt) === "table" ? "table" : "cards";
  } catch {
    return "cards";
  }
};
function Kn({ r: t, onOpen: s }) {
  const r = It(t), { done: i, total: h } = Dt(t);
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
          /* @__PURE__ */ e(se, { t: r.t, children: r.label })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: tt(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.product_code, t.term_months ? `${t.term_months} tháng` : null, t.purpose ? et[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${i}/${h} hạng mục đạt`, children: t.groups.map((c) => {
          const g = Ht(c);
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
            (t.policy_breaches ?? 0) > 0 && /* @__PURE__ */ n(se, { t: "danger", children: [
              t.policy_breaches,
              " lệch chuẩn"
            ] })
          ] }),
          /* @__PURE__ */ n("span", { title: t.updated_at, children: [
            "Cập nhật ",
            Tt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function An({
  onOpen: t,
  catalog: s,
  coachOpen: r,
  syncTick: i,
  onToggleCoach: h,
  onAskCoach: c,
  onCreatedCase: g
}) {
  const p = Ze(), [f, y] = w(null), [u, b] = w(null), [_, z] = w(null), [a, $] = w(!1), [l, q] = w("all"), [I, Y] = w(""), [E, Q] = w(Bn), D = re(0), K = re(!1), Z = re(null), X = (v) => {
    Q(v);
    try {
      localStorage.setItem(Bt, v);
    } catch {
    }
  }, P = te(async (v = !1) => {
    if (!(v && K.current)) {
      v ? K.current = !0 : $(!0);
      try {
        const N = await p.get(`${He}/cases`);
        if (Z.current === null)
          Z.current = new Set(N.cases.map((H) => H.case_id));
        else {
          const H = N.cases.find((U) => !Z.current.has(U.case_id));
          N.cases.forEach((U) => Z.current.add(U.case_id)), H && g({ caseId: H.case_id, name: H.customer_name || H.case_id });
        }
        y(N.cases), b(N.today), z(null), D.current = Date.now();
      } catch (N) {
        v || z(De(N));
      } finally {
        v ? K.current = !1 : $(!1);
      }
    }
  }, [p, g]);
  ne(() => {
    P();
  }, [P]), ne(() => {
    i > 0 && P(!0);
  }, [i, P]), ne(() => {
    const v = () => {
      document.visibilityState !== "hidden" && Date.now() - D.current >= 3e3 && P(!0);
    };
    return window.addEventListener("focus", v), document.addEventListener("visibilitychange", v), () => {
      window.removeEventListener("focus", v), document.removeEventListener("visibilitychange", v);
    };
  }, [P]);
  const x = F(() => {
    const v = f ?? [], N = v.filter((G) => G.stage !== "submitted"), H = v.length - N.length, U = N.filter((G) => G.ready).length, d = N.filter((G) => (G.actionable_blocking ?? G.blocking_open) > 0 || (G.unclassified_docs ?? 0) > 0).length, M = N.reduce((G, oe) => G + (oe.actionable_blocking ?? oe.blocking_open), 0), V = N.filter((G) => G.requested > 0 && G.overdue === 0).length, ie = N.filter((G) => G.overdue > 0).length;
    return { live: N.length, submitted: H, ready: U, actionNeeded: d, actionableItems: M, waitingCases: V, overdueCases: ie };
  }, [f]), B = F(() => {
    const v = I.trim().toLowerCase();
    return (f ?? []).filter((N) => l === "submitted" && N.stage !== "submitted" || l !== "submitted" && l !== "all" && N.stage === "submitted" || l === "action" && (N.actionable_blocking ?? N.blocking_open) === 0 && (N.unclassified_docs ?? 0) === 0 || l === "waiting" && N.requested === 0 || l === "overdue" && N.overdue === 0 || l === "ready" && !N.ready ? !1 : v ? [N.customer_name, N.case_id, N.tax_id, N.product_code].some((H) => H == null ? void 0 : H.toLowerCase().includes(v)) : !0);
  }, [f, l, I]), J = () => c("Tạo hồ sơ mới cho khách hàng: ", "new_intake");
  return /* @__PURE__ */ n(Se, { children: [
    /* @__PURE__ */ e(
      Mt,
      {
        title: "Hoàn thiện hồ sơ Tín dụng SME",
        subtitle: "Quản lý danh mục hồ sơ ĐVKD, kiểm soát chứng từ bắt buộc, đối chiếu điều kiện sơ bộ và bàn giao Thẩm định",
        actions: /* @__PURE__ */ n("div", { className: "sme-row", children: [
          /* @__PURE__ */ n(C, { onClick: () => P(), busy: a, children: [
            /* @__PURE__ */ e(_t, { size: 14 }),
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
                /* @__PURE__ */ e($e, { size: 14 }),
                " Trợ lý hồ sơ"
              ]
            }
          ),
          /* @__PURE__ */ n(C, { primary: !0, onClick: J, children: [
            /* @__PURE__ */ e(Ye, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "sme-scroll", children: [
      _ && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(wt, { title: "Không tải được danh sách hồ sơ", children: _ }) }),
      /* @__PURE__ */ n("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(
          ue,
          {
            icon: /* @__PURE__ */ e(dt, { size: 18 }),
            label: "Hồ sơ đang thu thập",
            value: f ? x.live : "…",
            hint: f ? `${x.submitted} hồ sơ đã bàn giao` : void 0
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: x.ready ? "ok" : "muted",
            icon: /* @__PURE__ */ e(Ie, { size: 18 }),
            label: "Đủ điều kiện trình",
            value: f ? x.ready : "…",
            hint: "Hoàn tất mục bắt buộc"
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: x.actionNeeded ? "warn" : "ok",
            icon: /* @__PURE__ */ e(Ot, { size: 18 }),
            label: "Cần ĐVKD xử lý",
            value: f ? x.actionNeeded : "…",
            hint: f ? `${x.actionableItems} mục chặn chưa yêu cầu` : void 0
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: x.overdueCases ? "danger" : x.waitingCases ? "info" : "muted",
            icon: /* @__PURE__ */ e(Ut, { size: 18 }),
            label: "Chờ khách hàng",
            value: u ? u.waiting : "…",
            hint: f ? x.overdueCases ? `${x.overdueCases} hồ sơ quá hạn cam kết` : `${x.waitingCases} hồ sơ đang theo dõi` : void 0
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
        ].map(([v, N]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": l === v,
            className: `sme-filter ${l === v ? "on" : ""}`,
            onClick: () => q(v),
            children: N
          },
          v
        )) }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
          /* @__PURE__ */ n("div", { className: "sme-filters", role: "tablist", "aria-label": "Chế độ hiển thị", children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": E === "cards",
                className: `sme-filter ${E === "cards" ? "on" : ""}`,
                onClick: () => X("cards"),
                children: "Thẻ hồ sơ"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": E === "table",
                className: `sme-filter ${E === "table" ? "on" : ""}`,
                onClick: () => X("table"),
                children: "Bảng danh mục"
              }
            )
          ] }),
          /* @__PURE__ */ n("label", { className: "sme-search", children: [
            /* @__PURE__ */ e(mt, { size: 14, className: "sme-muted" }),
            /* @__PURE__ */ e("input", { value: I, onChange: (v) => Y(v.target.value), placeholder: "Tìm doanh nghiệp, MST, mã hồ sơ, sản phẩm" })
          ] })
        ] })
      ] }),
      f === null && !_ && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((v) => /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, v)) }),
      f && f.length === 0 && /* @__PURE__ */ e(
        ve,
        {
          icon: /* @__PURE__ */ e(dt, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Khởi tạo hồ sơ với trợ lý trong chat: cung cấp thông tin khách hàng và đính kèm chứng từ.",
          action: /* @__PURE__ */ n(C, { primary: !0, onClick: J, children: [
            /* @__PURE__ */ e(Ye, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      f && f.length > 0 && B.length === 0 && /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(mt, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      B.length > 0 && E === "cards" && /* @__PURE__ */ e("div", { className: "sme-cases", children: B.map((v) => /* @__PURE__ */ e(Kn, { r: v, onOpen: () => t(v.case_id) }, v.case_id)) }),
      B.length > 0 && E === "table" && /* @__PURE__ */ e(zn, { rows: B, onOpen: t })
    ] })
  ] });
}
const Me = [
  ["blocked", "Cần bổ sung", (t) => t.status === "open" && t.blocking],
  ["waiting", "Chờ khách", (t) => t.status === "requested"],
  ["advisory", "Khuyến nghị", (t) => t.status === "open" && !t.blocking],
  ["done", "Đã đạt / Miễn", (t) => ["ok", "resolved", "waived"].includes(t.status)],
  ["all", "Tất cả", () => !0]
];
function Ln({ it: t, asOf: s, groupLabel: r, checked: i, selectable: h, readOnly: c, onToggle: g, onSet: p, onOpenDoc: f }) {
  const [y, u] = w("none"), [b, _] = w(""), [z, a] = w(!1), [$, l] = w(!1), q = zt[t.status], I = t.status === "open", Y = t.status === "requested" && !!t.due_date && t.due_date < s, E = async (D, K) => {
    a(!0), await p(t.key, D, b, K) && (u("none"), _("")), a(!1);
  }, Q = async () => {
    t.ask && await nt(t.ask) && (l(!0), setTimeout(() => l(!1), 1500));
  };
  return /* @__PURE__ */ n(kt, { children: [
    /* @__PURE__ */ n("tr", { children: [
      !c && /* @__PURE__ */ e("td", { style: { width: 28 }, children: h && /* @__PURE__ */ e(
        "input",
        {
          type: "checkbox",
          className: "ss-check",
          checked: i,
          onChange: g,
          "aria-label": `Chọn ${t.title}`
        }
      ) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: t.title }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
          r,
          t.reason ? ` · ${t.reason}` : ""
        ] }),
        (I || t.status === "requested") && t.ask && /* @__PURE__ */ n("div", { className: "sme-item-ask sme-between", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("span", { children: [
            /* @__PURE__ */ e("b", { children: "Nội dung yêu cầu KH:" }),
            " ",
            t.ask
          ] }),
          /* @__PURE__ */ n(C, { onClick: Q, title: "Sao chép nội dung yêu cầu", children: [
            $ ? /* @__PURE__ */ e(Pe, { size: 12 }) : /* @__PURE__ */ e(Fe, { size: 12 }),
            " ",
            $ ? "Đã chép" : "Chép"
          ] })
        ] }),
        (I || t.status === "requested") && t.alternatives.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 4 }, children: [
          "Chứng từ thay thế: ",
          t.alternatives.join("; ")
        ] })
      ] }),
      /* @__PURE__ */ e("td", { children: t.document_refs.length > 0 ? /* @__PURE__ */ e("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: t.document_refs.map((D) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: () => f(D), children: D }, D)) }) : /* @__PURE__ */ e("span", { className: "sme-muted", children: "—" }) }),
      /* @__PURE__ */ n("td", { children: [
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 4 }, children: [
          /* @__PURE__ */ e(se, { t: q.tone, children: q.label }),
          t.blocking && (I || t.status === "requested") && /* @__PURE__ */ e(se, { t: "danger", children: "Bắt buộc" }),
          Y && /* @__PURE__ */ n(se, { t: "danger", children: [
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
      !c && /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
        I && t.ask && /* @__PURE__ */ n(C, { busy: z, onClick: () => u(y === "request" ? "none" : "request"), title: "Đánh dấu đã yêu cầu khách", children: [
          /* @__PURE__ */ e(St, { size: 13 }),
          " Đã yêu cầu"
        ] }),
        I && t.kind !== "policy_precheck" && /* @__PURE__ */ n(
          C,
          {
            onClick: () => {
              u(y === "waive" ? "none" : "waive"), y === "waive" && _("");
            },
            title: "Xin miễn / bổ sung sau",
            children: [
              /* @__PURE__ */ e(Yt, { size: 13 }),
              " Xin miễn"
            ]
          }
        ),
        (t.status === "waived" || t.status === "requested") && /* @__PURE__ */ n(C, { busy: z, onClick: () => E("open"), title: "Mở lại hạng mục", children: [
          /* @__PURE__ */ e(Qt, { size: 13 }),
          " Mở lại"
        ] })
      ] }) })
    ] }),
    !c && y === "request" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ e(
      it,
      {
        label: "Hạn khách hàng bổ sung",
        confirmLabel: "Xác nhận đã yêu cầu",
        busy: z,
        onCancel: () => u("none"),
        onConfirm: (D) => E("requested", D)
      }
    ) }) }),
    !c && y === "waive" && /* @__PURE__ */ e("tr", { className: "ss-inline-panel", children: /* @__PURE__ */ e("td", { colSpan: 5, children: /* @__PURE__ */ n("div", { className: "sme-stack", style: { gap: 8 }, children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          className: "sme-textarea",
          value: b,
          onChange: (D) => _(D.target.value),
          placeholder: "Ghi rõ căn cứ xin miễn hoặc cam kết bổ sung sau (đi kèm phiếu bàn giao Thẩm định)"
        }
      ),
      /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ e(C, { onClick: () => {
          u("none"), _("");
        }, children: "Huỷ" }),
        /* @__PURE__ */ e(C, { primary: !0, busy: z, disabled: !b.trim(), onClick: () => E("waived"), children: "Xác nhận xin miễn" })
      ] })
    ] }) }) })
  ] });
}
function Mn({
  items: t,
  asOf: s,
  catalog: r,
  groupFilter: i,
  onClearGroup: h,
  readOnly: c,
  onSet: g,
  onBatchRequested: p,
  onDraft: f,
  onOpenDoc: y
}) {
  var U;
  const u = F(() => i ? t.filter((d) => d.group === i) : t, [t, i]), b = Object.fromEntries(Me.map(([d, , M]) => [d, u.filter(M).length])), _ = ((U = Me.find(([d]) => d !== "all" && b[d] > 0)) == null ? void 0 : U[0]) ?? "done", [z, a] = w(null), $ = z ?? _, l = u.filter(Me.find(([d]) => d === $)[2]), [q, I] = w(/* @__PURE__ */ new Set()), [Y, E] = w(!1), [Q, D] = w(!1), K = F(() => l.filter((d) => d.status === "open" || d.status === "requested"), [l]), Z = F(() => new Set(u.filter((d) => d.status === "open" || d.status === "requested").map((d) => d.key)), [u]), X = F(() => [...q].filter((d) => Z.has(d)), [q, Z]), P = (d) => {
    I((M) => {
      const V = new Set(M);
      return V.has(d) ? V.delete(d) : V.add(d), V;
    });
  }, x = K.length > 0 && K.every((d) => q.has(d.key)), B = () => {
    I((d) => {
      const M = new Set(d);
      return x ? K.forEach((V) => M.delete(V.key)) : K.forEach((V) => M.add(V.key)), M;
    });
  }, J = async (d) => {
    D(!0), await p(X, d) && (I(/* @__PURE__ */ new Set()), E(!1)), D(!1);
  }, v = (r == null ? void 0 : r.documents.groups) ?? {}, N = u.filter((d) => X.includes(d.key)), H = N.length > 0 && N.every((d) => d.status === "requested");
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hạng mục", children: Me.map(([d, M]) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": $ === d,
          className: `sme-filter ${$ === d ? "on" : ""}`,
          onClick: () => a(d),
          children: [
            M,
            " (",
            b[d],
            ")"
          ]
        },
        d
      )) }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
        i && /* @__PURE__ */ n(C, { onClick: h, title: "Bỏ lọc nhóm", children: [
          "Nhóm: ",
          v[i] ?? i,
          " ",
          /* @__PURE__ */ e(Wt, { size: 12 })
        ] }),
        !c && K.length > 0 && /* @__PURE__ */ e(C, { onClick: B, children: x ? "Bỏ chọn" : `Chọn tất cả (${K.length})` })
      ] })
    ] }),
    !c && X.length > 0 && /* @__PURE__ */ n("div", { className: "ss-bulk", children: [
      /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
        /* @__PURE__ */ n("span", { className: "sme-strong sme-small", children: [
          "Đã chọn ",
          X.length,
          " hạng mục"
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e(Et, { onPick: (d) => f(X, d, H) }),
          /* @__PURE__ */ n(C, { onClick: () => E((d) => !d), children: [
            /* @__PURE__ */ e(St, { size: 13 }),
            " Đã yêu cầu"
          ] }),
          /* @__PURE__ */ e(C, { onClick: () => {
            I(/* @__PURE__ */ new Set()), E(!1);
          }, children: "Bỏ chọn" })
        ] })
      ] }),
      Y && /* @__PURE__ */ e(
        it,
        {
          label: `Đặt hạn cho ${X.length} hạng mục`,
          confirmLabel: "Xác nhận đã yêu cầu",
          busy: Q,
          onCancel: () => E(!1),
          onConfirm: J
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: l.length === 0 ? /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(Ct, { size: 26 }), title: "Không có hạng mục nào ở bộ lọc này" }) : /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        !c && /* @__PURE__ */ e("th", { "aria-label": "Chọn", style: { width: 28 } }),
        /* @__PURE__ */ e("th", { children: "Hạng mục & Quy định" }),
        /* @__PURE__ */ e("th", { children: "Chứng từ" }),
        /* @__PURE__ */ e("th", { children: "Trạng thái" }),
        !c && /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: l.map((d) => /* @__PURE__ */ e(
        Ln,
        {
          it: d,
          asOf: s,
          groupLabel: v[d.group] ?? d.group,
          selectable: d.status === "open" || d.status === "requested",
          checked: q.has(d.key),
          readOnly: c,
          onToggle: () => P(d.key),
          onSet: g,
          onOpenDoc: y
        },
        d.key
      )) })
    ] }) })
  ] });
}
const Rn = {
  customer: "Pháp lý & Định danh",
  request: "Phương án đề xuất vay",
  facts: "Chỉ tiêu tài chính & TSBĐ"
}, Pn = {
  met: { label: "Đạt", t: "ok" },
  not_met: { label: "Không đạt", t: "danger" },
  missing: { label: "Thiếu dữ liệu", t: "warn" },
  na: { label: "Không áp dụng", t: "muted" }
};
function Fn({
  detail: t,
  catalog: s,
  pendingDraftsCount: r,
  purposeWarn: i,
  readOnly: h,
  goDrafts: c,
  onAction: g,
  onChat: p
}) {
  var z;
  const { case: f, overview: y } = t, u = [...new Set(y.profile.map((a) => a.section))], b = y.policy_checks ?? [], _ = b.some((a) => a.status === "not_met") || i && i.status === "open";
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    f.submitted && /* @__PURE__ */ n(bt, { t: "info", children: [
      "Hồ sơ đã bàn giao Thẩm định lúc ",
      /* @__PURE__ */ e("b", { children: Be(f.submitted.at) }),
      " bởi ",
      qt(f.submitted.by),
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
      /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", onClick: c, children: "Thư yêu cầu KH" }),
      "."
    ] }),
    /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Thông tin khách hàng & Phương án đề xuất" }),
        !h && /* @__PURE__ */ n(C, { onClick: () => p(`Cập nhật thông tin hồ sơ ${f.case_id}: `), children: [
          /* @__PURE__ */ e($e, { size: 13 }),
          " Cập nhật qua trợ lý"
        ] })
      ] }),
      y.profile.length === 0 ? /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: "Chưa có dữ liệu định danh hoặc phương án vay. Trao đổi với trợ lý để ghi nhận hoặc trích xuất từ chứng từ." }) : /* @__PURE__ */ e("div", { className: "sme-stack", style: { gap: 12 }, children: u.map((a) => /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 6 }, children: Rn[a] ?? a }),
        /* @__PURE__ */ e("dl", { className: "ss-kv", children: y.profile.filter(($) => $.section === a).map(($) => /* @__PURE__ */ n(kt, { children: [
          /* @__PURE__ */ e("dt", { children: $.label }),
          /* @__PURE__ */ e("dd", { children: Ee($.path, $.value, s) })
        ] }, $.path)) })
      ] }, a)) })
    ] }),
    (b.length > 0 || i) && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ n("h3", { className: "sme-h3", children: [
          "Điều kiện chính sách sơ bộ ",
          ((z = f.request) == null ? void 0 : z.product_code) ?? ""
        ] }),
        _ ? /* @__PURE__ */ e(se, { t: "danger", children: "Có tiêu chí chưa đạt" }) : /* @__PURE__ */ e(se, { t: "ok", children: "Đạt điều kiện sơ bộ" })
      ] }),
      i && i.status === "open" && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8, color: "var(--danger)" }, children: [
        i.title,
        ": ",
        i.reason
      ] }),
      b.length > 0 && /* @__PURE__ */ n("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Điều kiện" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
          /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
          /* @__PURE__ */ e("th", { children: "Kết quả" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: b.map((a) => {
          const $ = Pn[a.status];
          return /* @__PURE__ */ n("tr", { children: [
            /* @__PURE__ */ n("td", { children: [
              a.label,
              /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: a.clause })
            ] }),
            /* @__PURE__ */ n("td", { className: "sme-num", children: [
              a.op,
              " ",
              Ge(a.fact, a.threshold)
            ] }),
            /* @__PURE__ */ e("td", { className: "sme-num", children: Ge(a.fact, a.actual) }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(se, { t: $.t, children: $.label }) })
          ] }, a.id);
        }) })
      ] }),
      _ && !h && /* @__PURE__ */ e("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ n(C, { onClick: () => p(`Hồ sơ ${f.case_id} đang vướng điều kiện chính sách sơ bộ. Gợi ý các phương án cơ cấu lại đề xuất.`), children: [
        /* @__PURE__ */ e($e, { size: 13 }),
        " Đề xuất cơ cấu lại qua trợ lý"
      ] }) })
    ] }),
    y.actions.length > 0 && /* @__PURE__ */ n("div", { className: "sme-card", children: [
      /* @__PURE__ */ n("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: [
        "Hành động đề xuất (",
        y.actions.length,
        ")"
      ] }),
      y.actions.map((a) => /* @__PURE__ */ n("div", { className: `sme-finding ${pe(a.tone)}`, children: [
        /* @__PURE__ */ e("div", { className: "bar" }),
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", style: { gap: 8 }, children: [
          /* @__PURE__ */ n("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-finding-topic", children: a.title }),
            a.detail.length > 0 && /* @__PURE__ */ e("div", { className: "sme-finding-text sme-muted", children: a.detail.slice(0, 4).join(" · ") })
          ] }),
          a.cta !== "none" && /* @__PURE__ */ e(C, { onClick: () => g(a), children: a.cta === "draft" ? /* @__PURE__ */ n(Se, { children: [
            /* @__PURE__ */ e(Je, { size: 13 }),
            " Soạn thư"
          ] }) : a.cta === "submit" ? /* @__PURE__ */ n(Se, { children: [
            /* @__PURE__ */ e(Ie, { size: 13 }),
            " Bàn giao"
          ] }) : /* @__PURE__ */ n(Se, { children: [
            /* @__PURE__ */ e($e, { size: 13 }),
            " Trợ lý"
          ] }) })
        ] })
      ] }, a.id))
    ] })
  ] });
}
function Gn(t, s, r) {
  var g;
  if (!t.type) return { label: "Chưa phân loại", t: "warn" };
  const i = s.find((p) => p.key === `expired:${t.type}`);
  if (i) return i.status === "open" || i.status === "requested" ? { label: "Hết hiệu lực", t: "danger" } : { label: "Còn hiệu lực", t: "ok" };
  const h = s.find((p) => p.key === `date:${t.type}`);
  if (h && (h.status === "open" || h.status === "requested")) return { label: "Thiếu ngày lập", t: "warn" };
  const c = (g = r == null ? void 0 : r.documents.types[t.type]) == null ? void 0 : g.validity_months;
  return c ? { label: `Hiệu lực ${c} tháng`, t: "ok" } : { label: "Không giới hạn", t: "muted" };
}
function Xn({ docs: t, items: s, profile: r, catalog: i, focusDocId: h, readOnly: c, onDownload: g, onRemove: p, onExtractDoc: f, onUpload: y }) {
  const u = (i == null ? void 0 : i.documents.types) ?? {}, b = new Set(r.map((l) => l.path)), [_, z] = w(null), [a, $] = w(null);
  return ne(() => {
    h && requestAnimationFrame(() => {
      var l;
      return (l = document.getElementById(`doc-${h}`)) == null ? void 0 : l.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [h]), t.length === 0 ? /* @__PURE__ */ e(
    ve,
    {
      icon: /* @__PURE__ */ e(Zt, { size: 30 }),
      title: "Chưa có chứng từ nào",
      hint: "Đính kèm PDF, ảnh chụp, Word hoặc Excel trong chat với trợ lý để phân loại và trích xuất thông tin.",
      action: c ? void 0 : /* @__PURE__ */ e(C, { primary: !0, onClick: y, children: "Gửi chứng từ cho trợ lý" })
    }
  ) : /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between", children: [
      /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
        "Tổng cộng ",
        t.length,
        " chứng từ đã tiếp nhận vào hồ sơ."
      ] }),
      !c && /* @__PURE__ */ e(C, { onClick: y, children: "Gửi bổ sung qua trợ lý" })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-card tight", style: { overflowX: "auto" }, children: /* @__PURE__ */ n("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ n("tr", { children: [
        /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
        /* @__PURE__ */ e("th", { children: "Loại chứng từ & Tệp" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Ngày lập" }),
        /* @__PURE__ */ e("th", { children: "Hiệu lực" }),
        /* @__PURE__ */ e("th", { children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((l) => {
        const q = l.type ? u[l.type] : void 0, I = Gn(l, s, i), Y = new Set(l.not_stated ?? []), E = ((q == null ? void 0 : q.extract) ?? []).filter((D) => !b.has(D) && !Y.has(D)), Q = a === l.id;
        return /* @__PURE__ */ n("tr", { id: `doc-${l.id}`, className: h === l.id ? "focus" : void 0, children: [
          /* @__PURE__ */ e("td", { className: "sme-mono", children: l.id }),
          /* @__PURE__ */ n("td", { children: [
            /* @__PURE__ */ e("div", { className: "sme-strong", children: (q == null ? void 0 : q.label) ?? (l.type || l.name) }),
            /* @__PURE__ */ n("div", { className: "sme-small sme-muted", children: [
              l.name,
              l.size ? ` · ${Math.max(1, Math.round(l.size / 1024))} KB` : ""
            ] }),
            l.summary && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3 }, children: l.summary }),
            (!l.type || E.length > 0) && !c && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 3, color: "var(--warn)" }, children: l.type ? `Còn ${E.length} chỉ tiêu chưa trích xuất.` : "Chứng từ chưa được phân loại." })
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: l.issued_date ? me(l.issued_date) : "—" }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(se, { t: I.t, children: I.label }) }),
          /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ n("div", { className: "sme-row", style: { gap: 4 }, children: [
            l.file && /* @__PURE__ */ n(C, { busy: _ === `dl:${l.id}`, onClick: async () => {
              z(`dl:${l.id}`), await g(l.id), z(null);
            }, children: [
              /\.(pdf|png|jpe?g|webp|txt)$/i.test(l.name) ? /* @__PURE__ */ e(Jt, { size: 13 }) : /* @__PURE__ */ e(en, { size: 13 }),
              " Xem / Tải"
            ] }),
            (!l.type || E.length > 0) && !c && /* @__PURE__ */ e(C, { onClick: () => f(l.id), children: "Đọc lại" }),
            !c && !Q && /* @__PURE__ */ e(C, { onClick: () => $(l.id), title: "Gỡ chứng từ gửi nhầm", children: /* @__PURE__ */ e(tn, { size: 13 }) }),
            !c && Q && /* @__PURE__ */ n(Se, { children: [
              /* @__PURE__ */ e(C, { onClick: () => $(null), children: "Huỷ" }),
              /* @__PURE__ */ e(C, { primary: !0, busy: _ === `rm:${l.id}`, onClick: async () => {
                z(`rm:${l.id}`), await p(l.id) && $(null), z(null);
              }, children: "Xác nhận gỡ" })
            ] })
          ] }) })
        ] }, l.id);
      }) })
    ] }) })
  ] });
}
function jn({ d: t, items: s, readOnly: r, onSent: i }) {
  const [h, c] = w(!1), [g, p] = w(!1), f = async () => {
    await nt(t.subject ? `${t.subject}

${t.body}` : t.body) && (c(!0), setTimeout(() => c(!1), 1500));
  };
  return /* @__PURE__ */ n("div", { className: `sme-card sme-review ${pe(t.status === "sent" ? "ok" : "warn")}`, children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ n("span", { className: "sme-row", children: [
        /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: t.id }),
        /* @__PURE__ */ e(se, { t: "accent", children: rt[t.channel] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Be(t.created_at) })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(se, { t: t.status === "sent" ? "ok" : "warn", children: t.status === "sent" ? `Đã gửi ${me(t.sent_at)}` : "Chờ ĐVKD gửi" }),
        /* @__PURE__ */ n(C, { onClick: f, children: [
          h ? /* @__PURE__ */ e(Pe, { size: 13 }) : /* @__PURE__ */ e(Fe, { size: 13 }),
          " ",
          h ? "Đã chép" : "Sao chép"
        ] })
      ] })
    ] }),
    t.subject && /* @__PURE__ */ e("div", { className: "sme-strong", style: { marginTop: 8 }, children: t.subject }),
    /* @__PURE__ */ e("pre", { className: "sme-pre", children: t.body }),
    t.requirement_keys.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: [
      "Hạng mục đính kèm: ",
      t.requirement_keys.map((y) => {
        var u;
        return ((u = s.get(y)) == null ? void 0 : u.title) ?? y;
      }).join("; ")
    ] }),
    t.status === "draft" && !r && /* @__PURE__ */ e(
      it,
      {
        label: "Hạn cam kết KH gửi",
        confirmLabel: "Tôi đã gửi",
        busy: g,
        onConfirm: async (y) => {
          p(!0), await i(t.id, y), p(!1);
        }
      }
    )
  ] });
}
function Vn({ drafts: t, items: s, readOnly: r, hasOpenItems: i, onSent: h, onCompose: c }) {
  const [g, p] = w("all"), f = new Map(s.map((b) => [b.key, b])), y = t.filter((b) => b.status === "draft").length, u = [...t].reverse().filter((b) => g === "all" || b.status === g);
  return /* @__PURE__ */ n("div", { className: "sme-stack", children: [
    /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", children: [["all", `Tất cả (${t.length})`], ["draft", `Chờ gửi (${y})`], ["sent", `Đã gửi (${t.length - y})`]].map(([b, _]) => /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": g === b,
          className: `sme-filter ${g === b ? "on" : ""}`,
          onClick: () => p(b),
          children: _
        },
        b
      )) }),
      !r && i && /* @__PURE__ */ e(Et, { onPick: c })
    ] }),
    u.length === 0 && /* @__PURE__ */ e(
      ve,
      {
        icon: /* @__PURE__ */ e(Je, { size: 28 }),
        title: "Chưa có thư yêu cầu khách hàng",
        hint: i ? "Chọn kênh ở trên hoặc tích chọn hạng mục ở tab Danh mục kiểm tra để trợ lý soạn nháp." : "Không còn hạng mục thiếu cần yêu cầu khách hàng."
      }
    ),
    u.map((b) => /* @__PURE__ */ e(jn, { d: b, items: f, readOnly: r, onSent: h }, b.id))
  ] });
}
function On({ audit: t }) {
  if (t.length === 0) return /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(nn, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (r) => r === "case_submitted" ? "ok" : r === "case_reopened" || r === "document_remove" ? "warn" : r === "requirement_set" ? "accent" : "muted";
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t].reverse().map((r, i) => {
    const h = _n(r);
    return /* @__PURE__ */ n("div", { className: `sme-tl-item ${pe(s(r.action))}`, children: [
      /* @__PURE__ */ n("div", { className: "sme-between", children: [
        /* @__PURE__ */ n("span", { className: "sme-strong", style: { fontSize: 13 }, children: [
          wn[r.action] ?? r.action,
          h ? ` · ${h}` : ""
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: Be(r.ts) })
      ] }),
      /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: qt(String(r.actor ?? r.agent ?? r.author ?? "")) })
    ] }, i);
  }) }) });
}
function Ce({ label: t, children: s }) {
  return /* @__PURE__ */ n("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function Un({
  caseId: t,
  catalog: s,
  coachOpen: r,
  syncTick: i,
  onBack: h,
  onToggleCoach: c,
  onAskCoach: g,
  onCaseMetaChange: p,
  onRegisterQuickDraft: f
}) {
  var lt, ct;
  const y = Ze(), [u, b] = w(null), [_, z] = w(null), [a, $] = w(!1), [l, q] = w("overview"), [I, Y] = w(null), [E, Q] = w(null), [D, K] = w(null), [Z, X] = w(!1), [P, x] = w(null), [B, J] = w(!1), [v, N] = w(!1), H = re(0), U = re(!1), d = te(async (o = !1) => {
    if (!(o && U.current)) {
      o ? U.current = !0 : $(!0);
      try {
        b(await y.get(`${He}/cases/${t}`)), z(null), H.current = Date.now();
      } catch (A) {
        o || z(De(A));
      } finally {
        o ? U.current = !1 : $(!1);
      }
    }
  }, [y, t]);
  ne(() => {
    d();
  }, [d]), ne(() => {
    i > 0 && d(!0);
  }, [i, d]), ne(() => {
    const o = () => {
      document.visibilityState !== "hidden" && Date.now() - H.current >= 3e3 && d(!0);
    };
    return window.addEventListener("focus", o), document.addEventListener("visibilitychange", o), () => {
      window.removeEventListener("focus", o), document.removeEventListener("visibilitychange", o);
    };
  }, [d]);
  const M = async (o, A) => {
    try {
      return await y.post(`${He}/cases/${t}${o}`, A), !0;
    } catch (ee) {
      return z(De(ee)), !1;
    }
  }, V = async (o, A, ee = "", be) => {
    const we = { key: o, status: A, note: ee };
    be !== void 0 && (we.due_date = be);
    const xe = await M("/requirements", we);
    return xe && await d(), xe;
  }, ie = async (o, A) => {
    const ee = await M("/requirements", { keys: o, status: "requested", note: "", due_date: A });
    return ee && await d(), ee;
  }, G = async (o) => {
    const A = await M(`/documents/${o}/remove`, {});
    return A && await d(), A;
  }, oe = async (o) => {
    try {
      const A = await y.get(`${He}/cases/${t}/documents/${o}/file`), ee = atob(A.content_b64), be = new Uint8Array(ee.length);
      for (let de = 0; de < ee.length; de++) be[de] = ee.charCodeAt(de);
      const we = new Blob([be], { type: A.mime || "application/octet-stream" }), xe = URL.createObjectURL(we);
      if (A.mime.startsWith("image/") || A.mime === "application/pdf" || A.mime.startsWith("text/")) {
        if (!window.open(xe, "_blank", "noopener")) {
          const Oe = document.createElement("a");
          Oe.href = xe, Oe.download = A.name, Oe.click();
        }
      } else {
        const de = document.createElement("a");
        de.href = xe, de.download = A.name, de.click();
      }
      setTimeout(() => URL.revokeObjectURL(xe), 6e4);
    } catch (A) {
      z(De(A));
    }
  }, T = u == null ? void 0 : u.case, m = u == null ? void 0 : u.overview, ae = !!(T != null && T.submitted), W = (T == null ? void 0 : T.customer) ?? {}, O = (T == null ? void 0 : T.request) ?? {}, Te = W.name ? String(W.name) : void 0, Ke = Te || t, ge = (o) => g(o || `Hồ sơ ${t}: `, "prefill"), ye = (o, A = "email", ee = !1) => {
    const be = ((m == null ? void 0 : m.items) ?? []).filter((we) => o.includes(we.key));
    g(Sn(t, be, A, ee), "prefill");
  }, Xe = (o) => {
    o.cta === "draft" ? ye(o.keys, "email", o.kind === "remind" || o.kind === "follow_up") : o.cta === "submit" ? (K(""), x(null)) : o.cta === "chat" && ge(o.prompt);
  }, ze = async () => {
    u && await nt($n(u, s)) && (N(!0), setTimeout(() => N(!1), 1800));
  }, he = F(() => ((m == null ? void 0 : m.items) ?? []).filter((o) => o.blocking), [m]), k = F(
    () => he.filter((o) => ["ok", "resolved", "waived"].includes(o.status)).length,
    [he]
  ), S = ((lt = m == null ? void 0 : m.readiness.actionable_blocking) == null ? void 0 : lt.length) ?? he.filter((o) => o.status === "open").length, R = ((ct = m == null ? void 0 : m.readiness.waiting_blocking) == null ? void 0 : ct.length) ?? he.filter((o) => o.status === "requested").length, L = F(() => ((m == null ? void 0 : m.items) ?? []).filter((o) => o.status === "open" || o.status === "requested").length, [m]), j = F(() => ((u == null ? void 0 : u.drafts) ?? []).filter((o) => o.status === "draft"), [u]), le = F(() => ((m == null ? void 0 : m.items) ?? []).filter((o) => o.status === "waived"), [m]), ce = (m == null ? void 0 : m.policy_checks) ?? [], fe = F(() => ce.filter((o) => o.status === "not_met"), [ce]), Kt = F(() => ((m == null ? void 0 : m.items) ?? []).find((o) => o.key === "policy:purpose"), [m]), je = F(
    () => ((m == null ? void 0 : m.items) ?? []).filter((o) => o.kind === "document_expired" && (o.status === "open" || o.status === "requested")).length,
    [m]
  ), Ve = F(() => ((T == null ? void 0 : T.documents) ?? []).filter((o) => !o.type).length, [T]), ke = F(
    () => ((m == null ? void 0 : m.items) ?? []).filter((o) => o.status === "open" && o.blocking || o.status === "requested" && o.due_date && o.due_date < ((m == null ? void 0 : m.as_of) ?? "")),
    [m]
  ), qe = F(
    () => ((m == null ? void 0 : m.items) ?? []).filter((o) => (o.status === "open" || o.status === "requested") && o.ask).map((o) => o.key),
    [m]
  );
  ne(() => {
    p({ customerName: Te, readOnly: ae, hasOpenItems: qe.length > 0 });
  }, [Te, ae, qe.length, p]);
  const at = re(() => {
  });
  at.current = () => ye(qe, "email", !1), ne(() => (f(() => at.current()), () => f(null)), [f]);
  const ot = F(() => new Map(((m == null ? void 0 : m.profile) ?? []).map((o) => [o.path, o.value])), [m]), At = [
    { key: "overview", label: "Tổng quan" },
    { key: "checklist", label: "Danh mục kiểm tra", count: L || void 0 },
    { key: "docs", label: "Chứng từ", count: (T == null ? void 0 : T.documents.length) || void 0 },
    { key: "drafts", label: "Thư yêu cầu KH", count: j.length || (u == null ? void 0 : u.drafts.length) || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ n("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ n("div", { className: "sme-hero", children: [
      /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ n("button", { type: "button", className: "sme-back", onClick: h, children: [
          /* @__PURE__ */ e(sn, { size: 14 }),
          " Danh mục hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: Ke }),
        /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          m && /* @__PURE__ */ e(xt, { stage: m.stage }),
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          T && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Luồng ",
            T.flow
          ] }),
          W.tax_id && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "MST ",
            String(W.tax_id)
          ] }),
          W.industry_code && /* @__PURE__ */ n("span", { className: "sme-chip", children: [
            "Ngành ",
            String(W.industry_code)
          ] }),
          O.product_code && /* @__PURE__ */ e("span", { className: "sme-chip", children: String(O.product_code) }),
          O.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: et[O.purpose] ?? O.purpose }),
          T && /* @__PURE__ */ n("span", { className: "sme-small sme-muted", children: [
            "Khởi tạo ",
            Be(T.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-row sme-wrap", children: [
        /* @__PURE__ */ e(C, { onClick: () => d(), busy: a, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(_t, { size: 14 }) }),
        /* @__PURE__ */ n(
          C,
          {
            className: r ? "sme-toggle-on" : void 0,
            "aria-pressed": r,
            onClick: c,
            title: r ? "Thu gọn trợ lý hồ sơ" : "Mở trợ lý hồ sơ bên phải",
            children: [
              /* @__PURE__ */ e($e, { size: 14 }),
              " Trợ lý hồ sơ"
            ]
          }
        ),
        ae ? /* @__PURE__ */ n(C, { onClick: () => x(""), children: [
          /* @__PURE__ */ e(ht, { size: 14 }),
          " Mở lại hồ sơ"
        ] }) : /* @__PURE__ */ n(C, { primary: !0, onClick: () => {
          K(""), x(null);
        }, children: [
          /* @__PURE__ */ e(Ie, { size: 14 }),
          " ",
          m != null && m.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
        ] })
      ] })
    ] }),
    _ && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(wt, { title: "Có lỗi khi làm việc với hồ sơ", children: _ }) }),
    !u && !_ && /* @__PURE__ */ n("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" })
    ] }),
    u && T && m && /* @__PURE__ */ n(Se, { children: [
      /* @__PURE__ */ n("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          ue,
          {
            icon: /* @__PURE__ */ e(rn, { size: 18 }),
            label: "Số tiền đề nghị",
            value: O.amount ? $t(O.amount).replace(" đ", "") : "—",
            hint: [O.term_months ? `${O.term_months} tháng` : null, O.product_code, "VND"].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: m.readiness.ready ? "ok" : S > 0 ? "danger" : "warn",
            icon: /* @__PURE__ */ e(an, { size: 18 }),
            label: "Hạng mục bắt buộc",
            value: `${k} / ${he.length}`,
            hint: m.readiness.ready ? le.length ? `Đủ đk (${le.length} xin miễn)` : "Đủ điều kiện trình" : `${S} cần bổ sung · ${R} chờ KH`
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: je ? "danger" : Ve ? "warn" : T.documents.length ? "ok" : "muted",
            icon: /* @__PURE__ */ e(Nt, { size: 18 }),
            label: "Chứng từ lưu trữ",
            value: T.documents.length,
            hint: je ? `${je} chứng từ hết hạn` : Ve ? `${Ve} chưa phân loại` : "Đã đối chiếu danh mục"
          }
        ),
        /* @__PURE__ */ e(
          ue,
          {
            t: ce.length === 0 ? "muted" : fe.length > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(on, { size: 18 }),
            label: "Điều kiện chính sách",
            value: ce.length === 0 ? "—" : fe.length > 0 ? `${fe.length} chưa đạt` : "Đạt sơ bộ",
            hint: ce.length > 0 ? `${ce.length} tiêu chí · ${O.product_code ?? ""}` : "Chưa chọn mã sản phẩm"
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(
        In,
        {
          groups: m.groups,
          activeGroup: I,
          onSelectGroup: (o) => {
            Y(o), q("checklist");
          }
        }
      ) }),
      P !== null && T.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-warn", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-strong", children: "Mở lại hồ sơ đã bàn giao" }),
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { margin: "4px 0 8px" }, children: "Chỉ mở lại khi bộ phận Thẩm định yêu cầu bổ sung chứng từ mới. Ghi rõ lý do để lưu nhật ký kiểm toán." }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: P,
            onChange: (o) => x(o.target.value),
            placeholder: "Ví dụ: Thẩm định yêu cầu bổ sung BCTC quý gần nhất"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(C, { onClick: () => x(null), children: "Huỷ" }),
          /* @__PURE__ */ n(C, { primary: !0, busy: B, disabled: !P.trim(), onClick: async () => {
            J(!0), await M("/reopen", { note: P }) && (x(null), await d()), J(!1);
          }, children: [
            /* @__PURE__ */ e(ht, { size: 14 }),
            " Xác nhận mở lại"
          ] })
        ] })
      ] }),
      D !== null && !T.submitted && /* @__PURE__ */ n("div", { className: "sme-card sme-review t-accent", style: { marginBottom: 16 }, children: [
        /* @__PURE__ */ n("div", { className: "sme-between sme-wrap", children: [
          /* @__PURE__ */ e("div", { className: "sme-strong", children: "Xác nhận bàn giao hồ sơ sang Thẩm định (LOS)" }),
          /* @__PURE__ */ n(C, { onClick: ze, children: [
            v ? /* @__PURE__ */ e(Pe, { size: 13 }) : /* @__PURE__ */ e(Fe, { size: 13 }),
            " ",
            v ? "Đã chép phiếu" : "Sao chép phiếu bàn giao LOS"
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "sme-small sme-muted", style: { margin: "6px 0 8px" }, children: [
          "Hạng mục bắt buộc: ",
          /* @__PURE__ */ n("b", { children: [
            k,
            "/",
            he.length
          ] }),
          " · Chứng từ: ",
          /* @__PURE__ */ e("b", { children: T.documents.length }),
          " · Xin miễn: ",
          /* @__PURE__ */ e("b", { children: le.length }),
          " · Cảnh báo sơ bộ: ",
          /* @__PURE__ */ e("b", { children: fe.length }),
          ".",
          m.readiness.ready ? " Ghi chú bàn giao không bắt buộc." : ` Còn ${m.readiness.blocking_open.length} mục chặn nên bắt buộc ghi giải trình.`
        ] }),
        le.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ e("b", { children: "Mục xin miễn:" }),
          " ",
          le.map((o) => `${o.title} (${o.note})`).join("; ")
        ] }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "sme-textarea",
            value: D,
            onChange: (o) => K(o.target.value),
            placeholder: m.readiness.ready ? "Ghi chú bàn giao (tuỳ chọn)" : "Ghi rõ giải trình khi trình dù còn hạng mục chặn (bắt buộc)"
          }
        ),
        /* @__PURE__ */ n("div", { className: "sme-row", style: { justifyContent: "flex-end", marginTop: 8 }, children: [
          /* @__PURE__ */ e(C, { onClick: () => K(null), children: "Huỷ" }),
          /* @__PURE__ */ n(
            C,
            {
              primary: !0,
              busy: Z,
              disabled: !m.readiness.ready && !D.trim(),
              onClick: async () => {
                X(!0), await M("/submitted", { note: D }) && (K(null), await d()), X(!1);
              },
              children: [
                /* @__PURE__ */ e(Ie, { size: 14 }),
                " Xác nhận đã bàn giao"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "sme-detail", children: [
        /* @__PURE__ */ n("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: At.map((o) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": l === o.key,
              className: `sme-tab ${l === o.key ? "on" : ""}`,
              onClick: () => q(o.key),
              children: [
                o.label,
                o.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: o.count })
              ]
            },
            o.key
          )) }),
          l === "overview" && /* @__PURE__ */ e(
            Fn,
            {
              detail: u,
              catalog: s,
              pendingDraftsCount: j.length,
              purposeWarn: Kt,
              readOnly: ae,
              goDrafts: () => q("drafts"),
              onAction: Xe,
              onChat: ge
            }
          ),
          l === "checklist" && /* @__PURE__ */ e(
            Mn,
            {
              items: m.items,
              asOf: m.as_of,
              catalog: s,
              groupFilter: I,
              onClearGroup: () => Y(null),
              readOnly: ae,
              onSet: V,
              onBatchRequested: ie,
              onDraft: ye,
              onOpenDoc: (o) => {
                Q(o), q("docs");
              }
            }
          ),
          l === "docs" && /* @__PURE__ */ e(
            Xn,
            {
              docs: T.documents,
              items: m.items,
              profile: m.profile,
              catalog: s,
              focusDocId: E,
              readOnly: ae,
              onDownload: oe,
              onRemove: G,
              onExtractDoc: (o) => g(`Đọc lại và cập nhật thông tin từ chứng từ ${o} của hồ sơ ${t}.`, "prefill"),
              onUpload: () => g("", "attach")
            }
          ),
          l === "drafts" && /* @__PURE__ */ e(
            Vn,
            {
              drafts: u.drafts,
              items: m.items,
              readOnly: ae,
              hasOpenItems: qe.length > 0,
              onCompose: (o) => ye(qe, o, !1),
              onSent: async (o, A) => {
                const ee = await M(`/drafts/${o}/sent`, { due_date: A });
                return ee && await d(), ee;
              }
            }
          ),
          l === "audit" && /* @__PURE__ */ e(On, { audit: u.audit })
        ] }),
        /* @__PURE__ */ n("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ n("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Hạng mục cần xử lý" }),
              /* @__PURE__ */ e(se, { t: ke.length ? "warn" : "ok", children: ke.length })
            ] }),
            ke.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn hạng mục chặn mở." }),
            ke.slice(0, 6).map((o) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "sme-todo",
                onClick: () => {
                  Y(o.group), q("checklist");
                },
                children: [
                  /* @__PURE__ */ e(se, { t: o.status === "requested" ? "danger" : "warn", children: o.status === "requested" ? "Quá hạn" : "Thiếu" }),
                  /* @__PURE__ */ e("span", { className: "sme-todo-text", children: o.title })
                ]
              },
              o.key
            )),
            ke.length > 6 && /* @__PURE__ */ n("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => q("checklist"), children: [
              "Xem thêm ",
              ke.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Định danh & Tóm tắt" }),
            /* @__PURE__ */ e(Ce, { label: "Mã số thuế", children: String(W.tax_id ?? "—") }),
            /* @__PURE__ */ e(Ce, { label: "CIF", children: String(W.cif ?? "—") }),
            /* @__PURE__ */ e(Ce, { label: "Người đại diện", children: String(W.legal_rep ?? "—") }),
            /* @__PURE__ */ e(Ce, { label: "Số năm hoạt động", children: Ee("facts.years_in_operation", ot.get("facts.years_in_operation") ?? W.years_in_operation, s) }),
            /* @__PURE__ */ e(Ce, { label: "Vốn điều lệ", children: Ee("customer.charter_capital", W.charter_capital, s) }),
            /* @__PURE__ */ e(Ce, { label: "Doanh thu gần nhất", children: Ee("facts.revenue_last_year", ot.get("facts.revenue_last_year"), s) }),
            O.proposal && /* @__PURE__ */ n("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(O.proposal)
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "sme-card sme-stack", style: { gap: 8 }, children: [
            /* @__PURE__ */ n("div", { className: "sme-between", children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Bàn giao LOS" }),
              /* @__PURE__ */ e(xt, { stage: m.stage })
            ] }),
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: le.length > 0 ? `${le.length} mục xin miễn kèm giải trình.` : "Chưa có mục xin miễn." }),
            /* @__PURE__ */ n(C, { onClick: ze, children: [
              v ? /* @__PURE__ */ e(Pe, { size: 13 }) : /* @__PURE__ */ e(Fe, { size: 13 }),
              " ",
              v ? "Đã chép phiếu" : "Chép phiếu bàn giao"
            ] }),
            !ae && /* @__PURE__ */ n(C, { primary: !0, onClick: () => {
              K(""), x(null);
            }, children: [
              /* @__PURE__ */ e(Ie, { size: 13 }),
              " ",
              m.readiness.ready ? "Bàn giao Thẩm định" : "Trình kèm giải trình"
            ] })
          ] }),
          u.audit.length > 0 && /* @__PURE__ */ n("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(ln, { size: 13 }),
            " Hoạt động gần nhất ",
            Be(u.audit[u.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
kn();
En();
const vt = "sme-sales:coach-open", yt = "sme-sales:coach-width";
function ts() {
  const t = Ze(), [s, r] = w(null), [i, h] = w(null), [c, g] = w(() => hn(vt)), [p, f] = w(() => pn(yt)), [y, u] = w(null), [b, _] = w(null), [z, a] = w(null), $ = re(0), l = re(null), { syncTick: q } = fn(c, 4e3);
  ne(() => {
    t.get(`${He}/catalog`).then(h).catch(() => h(null));
  }, [t]);
  const I = te((x) => {
    g((B) => {
      const J = typeof x == "function" ? x(B) : x;
      return un(vt, J), J;
    });
  }, []), Y = te((x) => {
    const B = st(x);
    f(B), gn(yt, B);
  }, []), E = te((x, B = "prefill") => {
    I(!0), u({ id: ++$.current, prompt: x, mode: B });
  }, [I]), Q = te(() => {
    u(null);
  }, []), D = te((x) => {
    a(null), _(null), r(x);
  }, []), K = te(() => {
    _(null), r(null);
  }, []), Z = te((x) => {
    _((B) => B === x || B && x && B.customerName === x.customerName && B.readOnly === x.readOnly && B.hasOpenItems === x.hasOpenItems ? B : x);
  }, []), X = te((x) => {
    l.current = x;
  }, []), P = te(() => {
    var x;
    (x = l.current) == null || x.call(l);
  }, []);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: /* @__PURE__ */ n("div", { className: "sme-workspace", children: [
    /* @__PURE__ */ e("div", { className: "sme-main", children: s ? /* @__PURE__ */ e(
      Un,
      {
        caseId: s,
        catalog: i,
        coachOpen: c,
        syncTick: q,
        onBack: K,
        onToggleCoach: () => I((x) => !x),
        onAskCoach: E,
        onCaseMetaChange: Z,
        onRegisterQuickDraft: X
      }
    ) : /* @__PURE__ */ e(
      An,
      {
        onOpen: D,
        catalog: i,
        coachOpen: c,
        syncTick: q,
        onToggleCoach: () => I((x) => !x),
        onAskCoach: E,
        onCreatedCase: a
      }
    ) }),
    c && /* @__PURE__ */ e(
      Tn,
      {
        width: p,
        onWidthChange: Y,
        onClose: () => I(!1),
        caseId: s,
        customerName: s ? b == null ? void 0 : b.customerName : void 0,
        readOnly: s ? !!(b != null && b.readOnly) : !1,
        hasOpenItems: s ? !!(b != null && b.hasOpenItems) : !1,
        intent: y,
        onConsumeIntent: Q,
        createdCase: z,
        onOpenCase: D,
        onDismissCreatedCase: () => a(null),
        onQuickDraft: s && (b != null && b.hasOpenItems) && !b.readOnly ? P : void 0
      }
    )
  ] }) });
}
export {
  ts as default
};
