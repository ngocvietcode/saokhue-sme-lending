import { jsxs as s, jsx as e, Fragment as ue } from "react/jsx-runtime";
import { useCallback as ee, useState as b, useEffect as F, useMemo as P } from "react";
import { useChatLauncher as Oe, useAppApi as ge } from "@kirocrew/app-sdk";
import { PageHeader as Re, Btn as z, ErrorNotice as be } from "@kirocrew/app-sdk/ui";
import { CheckCircle2 as qe, XCircle as Fe, CircleDot as Ie, CircleDashed as Ve, AlertTriangle as Pe, RefreshCw as ve, Plus as de, FolderOpen as me, ClipboardList as fe, ShieldAlert as je, AlertOctagon as He, Search as j, FileSearch as xe, ClipboardCheck as he, History as Ge, ChevronRight as We, ArrowLeft as Ye, MessageSquare as Ue, Play as Xe, Landmark as Qe, Gauge as Je, ShieldCheck as Ze, FileText as et, Activity as tt } from "lucide-react";
const J = "/apps/sme-lending/api", ye = [
  { name: "Chứng từ", agents: ["document-evidence"] },
  { name: "Sản phẩm", agents: ["product-match"] },
  { name: "Chuyên môn", agents: ["financial-analysis", "risk-compliance", "collateral", "industry"] },
  { name: "Chính sách", agents: ["policy-exception"] },
  { name: "Tổng hợp", agents: ["consolidation"] }
], H = ye.flatMap((t) => t.agents), nt = {
  "document-evidence": "Chứng từ & bằng chứng",
  "product-match": "Nhận diện sản phẩm",
  "financial-analysis": "Phân tích tài chính",
  "risk-compliance": "Rủi ro & tuân thủ",
  collateral: "Tài sản bảo đảm",
  industry: "Ngành & cạnh tranh",
  "policy-exception": "Chính sách & ngoại lệ",
  consolidation: "Tổng hợp tờ trình"
}, B = (t) => nt[t] ?? t, q = {
  passed: { label: "Đã kiểm chứng", tone: "ok" },
  blocked: { label: "Bị chặn", tone: "danger" },
  unverified: { label: "Chưa kiểm chứng", tone: "warn" },
  none: { label: "Chưa chạy", tone: "muted" }
}, R = {
  high: { label: "Cao", tone: "danger", rank: 0 },
  medium: { label: "Trung bình", tone: "warn", rank: 1 },
  low: { label: "Thấp", tone: "info", rank: 2 },
  info: { label: "Thông tin", tone: "muted", rank: 3 }
}, st = { high: "cao", medium: "trung bình", low: "thấp" }, te = {
  missing_document: { label: "Thiếu chứng từ", tone: "warn" },
  data_conflict: { label: "Dữ liệu mâu thuẫn", tone: "danger" },
  rule_fail: { label: "Không đạt điều kiện", tone: "danger" },
  low_confidence: { label: "Độ tin cậy thấp", tone: "info" },
  exception_needed: { label: "Cần ngoại lệ", tone: "danger" },
  expert_review: { label: "Cần chuyên gia", tone: "info" },
  system_error: { label: "Lỗi hệ thống", tone: "muted" }
}, we = {
  open: { label: "Chờ xử lý", tone: "warn" },
  confirmed: { label: "Đã xác nhận", tone: "ok" },
  needs_info: { label: "Yêu cầu bổ sung", tone: "info" }
}, at = {
  case_create: "Tạo hồ sơ",
  evidence_add: "Thêm bằng chứng",
  result_put: "Lưu kết quả",
  verification: "Kiểm chứng",
  review_add: "Thêm mục rà soát",
  review_decide: "Cán bộ quyết định"
}, Ne = {
  working_capital: "Vốn lưu động",
  fixed_asset: "Đầu tư TSCĐ",
  expansion: "Mở rộng",
  trade_finance: "Tài trợ thương mại"
}, V = new Intl.NumberFormat("vi-VN"), it = (t) => typeof t == "number" ? V.format(t) + " đ" : "—", G = (t) => typeof t != "number" ? "—" : Math.abs(t) >= 1e9 ? V.format(Math.round(t / 1e7) / 100) + " tỷ" : Math.abs(t) >= 1e6 ? V.format(Math.round(t / 1e4) / 100) + " triệu" : V.format(t) + " đ", C = (t, n = 2) => typeof t == "number" ? t.toLocaleString("vi-VN", { maximumFractionDigits: n }) : "—", D = (t) => typeof t == "number" ? (t * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "%" : "—", K = (t) => t ? new Date(t).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—", rt = (t) => {
  if (!t) return "—";
  const n = Math.round((Date.now() - new Date(t).getTime()) / 1e3);
  return n < 60 ? "vừa xong" : n < 3600 ? `${Math.floor(n / 60)} phút trước` : n < 86400 ? `${Math.floor(n / 3600)} giờ trước` : `${Math.floor(n / 86400)} ngày trước`;
}, pe = (t) => typeof t == "string" ? t : JSON.stringify(t, null, 2), Z = (t) => t instanceof Error ? t.message : String(t), lt = (t) => [...t].sort((n, i) => {
  var a, r;
  return (((a = R[n.severity]) == null ? void 0 : a.rank) ?? 9) - (((r = R[i.severity]) == null ? void 0 : r.rank) ?? 9);
});
function ne(t) {
  return t ? t.verification ? t.verification.passed ? "passed" : "blocked" : "unverified" : "none";
}
function O(t, n, i) {
  var a, r;
  return (r = (a = t.results[n]) == null ? void 0 : a.calculations) == null ? void 0 : r.find((c) => c.kind === i);
}
function ot(t) {
  var o, h, p, v, d;
  const n = {}, i = O(t, "policy-exception", "policy_check") ?? O(t, "risk-compliance", "policy_check");
  (o = i == null ? void 0 : i.outputs) != null && o.matrix && (n.policy = { version: i.outputs.policy_version, product: i.outputs.product_code, rows: i.outputs.matrix });
  const a = O(t, "financial-analysis", "repayment_capacity");
  if ((h = a == null ? void 0 : a.outputs) != null && h.scenarios) {
    const x = (p = n.policy) == null ? void 0 : p.rows.find((l) => l.fact === "dscr");
    n.dscr = {
      scenarios: a.outputs.scenarios,
      threshold: typeof (x == null ? void 0 : x.threshold) == "number" ? x.threshold : void 0,
      debtService: a.outputs.total_debt_service_annual,
      cash: (v = a.inputs) == null ? void 0 : v.cash_available_annual
    };
  }
  const r = O(t, "collateral", "collateral_ltv");
  r != null && r.outputs && (n.ltv = { ltv: r.outputs.ltv_pct ?? null, cap: r.outputs.max_ltv_pct ?? null, eligible: r.outputs.eligible_value });
  const c = O(t, "financial-analysis", "fin_ratios");
  (d = c == null ? void 0 : c.outputs) != null && d.periods && (n.ratios = c.outputs.periods);
  const m = O(t, "consolidation", "genform");
  return m != null && m.outputs && (n.genform = m.outputs), n;
}
const X = {
  gross_margin: { label: "Biên lợi nhuận gộp", fmt: D },
  net_margin: { label: "Biên lợi nhuận ròng", fmt: D },
  ebitda_margin: { label: "Biên EBITDA", fmt: D },
  current_ratio: { label: "Thanh toán hiện hành", fmt: (t) => C(t) },
  debt_to_equity: { label: "Nợ vay / Vốn chủ", fmt: (t) => C(t) },
  liabilities_to_assets: { label: "Nợ phải trả / Tài sản", fmt: D },
  roa: { label: "ROA", fmt: D },
  roe: { label: "ROE", fmt: D },
  interest_coverage: { label: "Khả năng trả lãi", fmt: (t) => C(t, 1) + (typeof t == "number" ? " lần" : "") },
  receivable_days: { label: "Số ngày phải thu", fmt: (t) => C(t, 0) },
  inventory_days: { label: "Số ngày tồn kho", fmt: (t) => C(t, 0) }
}, ct = {
  years_in_operation: "Số năm hoạt động",
  loan_amount: "Số tiền vay",
  term_months: "Kỳ hạn (tháng)",
  dscr: "DSCR",
  cic_debt_group: "Nhóm nợ CIC",
  ltv_pct: "LTV (%)",
  equity_contribution_pct: "Vốn tự có (%)"
}, dt = {
  met: { label: "Đạt", tone: "ok" },
  not_met: { label: "Không đạt", tone: "danger" },
  missing: { label: "Thiếu dữ liệu", tone: "warn" },
  na: { label: "Không áp dụng", tone: "muted" }
}, mt = "sme-assistant", ht = "sme-lending-chat-", pt = (t) => t.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 100);
function ke(t) {
  const n = Oe();
  return ee(
    async (i, a, r) => {
      const { openChat: c } = n, m = n.createChat;
      if (!m) {
        c({ autoSend: !1, message: i });
        return;
      }
      try {
        const o = await m({ slotKey: ht + pt(a), agent: mt, title: r });
        c({ slotKey: o, autoSend: !1, message: i });
      } catch (o) {
        t == null || t(`Không mở được chat với trợ lý SME: ${o instanceof Error ? o.message : String(o)}`);
      }
    },
    [n, t]
  );
}
const T = (t) => `t-${t}`;
function k({ t, children: n, title: i }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${T(t)}`, title: i, children: n });
}
function E({ icon: t, label: n, value: i, hint: a, t: r = "accent" }) {
  return /* @__PURE__ */ s("div", { className: `sme-kpi ${T(r)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: t }),
    /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: n }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: i }),
      a && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: a })
    ] })
  ] });
}
function _e({ state: t, size: n = 13 }) {
  return t === "passed" ? /* @__PURE__ */ e(qe, { size: n }) : t === "blocked" ? /* @__PURE__ */ e(Fe, { size: n }) : t === "unverified" ? /* @__PURE__ */ e(Ie, { size: n }) : /* @__PURE__ */ e(Ve, { size: n });
}
function Ce({ state: t }) {
  const n = q[t];
  return /* @__PURE__ */ s(k, { t: n.tone, children: [
    /* @__PURE__ */ e(_e, { state: t, size: 12 }),
    n.label
  ] });
}
function L({ icon: t, title: n, hint: i, action: a }) {
  return /* @__PURE__ */ s("div", { className: "sme-empty", children: [
    t,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: n }),
    i && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: i }),
    a && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: a })
  ] });
}
function Se({ t = "warn", children: n }) {
  return /* @__PURE__ */ s("div", { className: `sme-banner ${T(t)}`, children: [
    /* @__PURE__ */ e(Pe, { size: 15 }),
    /* @__PURE__ */ e("div", { children: n })
  ] });
}
function Te({ refs: t, onOpen: n }) {
  return t != null && t.length ? /* @__PURE__ */ e("span", { className: "sme-row sme-wrap", style: { gap: 4, display: "inline-flex", marginLeft: 4 }, children: t.map((i) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", title: "Xem bằng chứng", onClick: () => n(i), children: i }, i)) }) : null;
}
function ut({ c: t, onOpen: n }) {
  const i = t.agents ?? {}, a = Object.keys(i).length;
  return /* @__PURE__ */ s(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: n,
      onKeyDown: (r) => {
        (r.key === "Enter" || r.key === " ") && (r.preventDefault(), n());
      },
      children: [
        /* @__PURE__ */ s("div", { className: "sme-between", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.customer_name ?? "Chưa có tên khách hàng" }),
            /* @__PURE__ */ e("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: t.case_id })
          ] }),
          t.review_open > 0 ? /* @__PURE__ */ s(k, { t: "warn", children: [
            t.review_open,
            " chờ rà soát"
          ] }) : a > 0 ? /* @__PURE__ */ e(k, { t: "ok", children: "Đã rà soát" }) : /* @__PURE__ */ e(k, { t: "muted", children: "Mới" })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: G(t.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [t.term_months ? `${t.term_months} tháng` : null, t.purpose ? Ne[t.purpose] ?? t.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${a}/${H.length} agent đã chạy`, children: H.map((r) => {
          const c = i[r];
          return /* @__PURE__ */ e(
            "span",
            {
              className: c ? T(q[c].tone) : "none",
              title: `${B(r)}: ${q[c ?? "none"].label}`
            },
            r
          );
        }) }),
        /* @__PURE__ */ s("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ s("span", { className: "sme-row", style: { gap: 6 }, children: [
            /* @__PURE__ */ s("span", { className: "sme-chip", children: [
              "Luồng ",
              t.flow
            ] }),
            (t.high_findings ?? 0) > 0 && /* @__PURE__ */ s(k, { t: "danger", children: [
              t.high_findings,
              " cảnh báo cao"
            ] }),
            t.agents_blocked > 0 && /* @__PURE__ */ s(k, { t: "danger", children: [
              t.agents_blocked,
              " bị chặn"
            ] })
          ] }),
          /* @__PURE__ */ s("span", { title: t.updated_at, children: [
            "Cập nhật ",
            rt(t.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function gt({ onOpen: t }) {
  const n = ge(), [i, a] = b(null), [r, c] = b(null), m = ke(c), [o, h] = b(""), [p, v] = b("all"), [d, x] = b(!1), l = ee(async () => {
    x(!0);
    try {
      a((await n.get(`${J}/cases`)).cases), c(null);
    } catch (g) {
      c(Z(g));
    } finally {
      x(!1);
    }
  }, [n]);
  F(() => {
    l();
  }, [l]);
  const y = P(() => ({
    open: (i == null ? void 0 : i.reduce((g, f) => g + f.review_open, 0)) ?? 0,
    blocked: (i == null ? void 0 : i.reduce((g, f) => g + f.agents_blocked, 0)) ?? 0,
    high: (i == null ? void 0 : i.reduce((g, f) => g + (f.high_findings ?? 0), 0)) ?? 0
  }), [i]), _ = P(() => {
    const g = o.trim().toLowerCase();
    return (i ?? []).filter((f) => p === "review" && f.review_open === 0 || p === "blocked" && f.agents_blocked === 0 ? !1 : g ? [f.customer_name, f.case_id, f.industry_code].some((w) => w == null ? void 0 : w.toLowerCase().includes(g)) : !0);
  }, [i, o, p]), A = () => m("Tạo hồ sơ thẩm định SME mới.", `new-${Date.now()}`, "Hồ sơ SME mới");
  return /* @__PURE__ */ s(ue, { children: [
    /* @__PURE__ */ e(
      Re,
      {
        title: "Thẩm định SME",
        subtitle: "Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ",
        actions: /* @__PURE__ */ s("div", { className: "sme-row", children: [
          /* @__PURE__ */ s(z, { onClick: l, busy: d, children: [
            /* @__PURE__ */ e(ve, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ s(z, { primary: !0, onClick: A, children: [
            /* @__PURE__ */ e(de, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ s("div", { className: "sme-scroll", children: [
      r && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(be, { title: "Không tải được danh sách hồ sơ", children: r }) }),
      /* @__PURE__ */ s("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(E, { icon: /* @__PURE__ */ e(me, { size: 18 }), label: "Hồ sơ", value: (i == null ? void 0 : i.length) ?? "…" }),
        /* @__PURE__ */ e(
          E,
          {
            t: "warn",
            icon: /* @__PURE__ */ e(fe, { size: 18 }),
            label: "Mục chờ rà soát",
            value: i ? y.open : "…",
            hint: "Cần cán bộ xác nhận"
          }
        ),
        /* @__PURE__ */ e(E, { t: "danger", icon: /* @__PURE__ */ e(je, { size: 18 }), label: "Cảnh báo mức cao", value: i ? y.high : "…" }),
        /* @__PURE__ */ e(
          E,
          {
            t: y.blocked ? "danger" : "ok",
            icon: /* @__PURE__ */ e(He, { size: 18 }),
            label: "Kết quả bị chặn",
            value: i ? y.blocked : "…",
            hint: "Không qua kiểm chứng"
          }
        )
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e("div", { className: "sme-filters", role: "tablist", "aria-label": "Lọc hồ sơ", children: [["all", "Tất cả"], ["review", "Chờ rà soát"], ["blocked", "Bị chặn"]].map(([g, f]) => /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": p === g,
            className: `sme-filter ${p === g ? "on" : ""}`,
            onClick: () => v(g),
            children: f
          },
          g
        )) }),
        /* @__PURE__ */ s("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(j, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: o, onChange: (g) => h(g.target.value), placeholder: "Tìm khách hàng, mã hồ sơ, mã ngành" })
        ] })
      ] }),
      i === null && !r && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((g) => /* @__PURE__ */ s("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, g)) }),
      i && i.length === 0 && /* @__PURE__ */ e(
        L,
        {
          icon: /* @__PURE__ */ e(me, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn.",
          action: /* @__PURE__ */ s(z, { primary: !0, onClick: A, children: [
            /* @__PURE__ */ e(de, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      i && i.length > 0 && _.length === 0 && /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(j, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      _.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: _.map((g) => /* @__PURE__ */ e(ut, { c: g, onOpen: () => t(g.case_id) }, g.case_id)) })
    ] })
  ] });
}
function $e({ f: t, onEvidence: n }) {
  const i = R[t.severity] ?? R.info;
  return /* @__PURE__ */ s("div", { className: `sme-finding ${T(i.tone)}`, children: [
    /* @__PURE__ */ e("div", { className: "bar" }),
    /* @__PURE__ */ s("div", { children: [
      /* @__PURE__ */ s("div", { className: "sme-finding-topic sme-row", style: { gap: 6 }, children: [
        /* @__PURE__ */ e(k, { t: i.tone, children: i.label }),
        /* @__PURE__ */ e("span", { children: t.topic.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-finding-text", children: [
        t.statement,
        /* @__PURE__ */ e(Te, { refs: t.evidence_refs, onOpen: n })
      ] })
    ] })
  ] });
}
function bt({ m: t }) {
  const n = Math.max(1.6, (t.threshold ?? 0) * 1.3, ...t.scenarios.map((i) => i.dscr ?? 0));
  return /* @__PURE__ */ s("div", { className: "sme-card", children: [
    /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Khả năng trả nợ (DSCR)" }),
      t.threshold !== void 0 && /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
        "Ngưỡng chính sách ≥ ",
        C(t.threshold)
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-bars", children: t.scenarios.map((i) => {
      const a = t.threshold === void 0 || (i.dscr ?? 0) >= t.threshold;
      return /* @__PURE__ */ s("div", { className: `sme-bar-row ${T(a ? "ok" : "danger")}`, children: [
        /* @__PURE__ */ e("span", { className: "sme-muted", children: i.stress_pct ? `Stress −${i.stress_pct}%` : "Cơ sở" }),
        /* @__PURE__ */ s("div", { className: "sme-bar-track", children: [
          /* @__PURE__ */ e("div", { className: "sme-bar-fill", style: { width: `${Math.min(100, (i.dscr ?? 0) / n * 100)}%` } }),
          t.threshold !== void 0 && /* @__PURE__ */ e("div", { className: "sme-bar-mark", style: { left: `${t.threshold / n * 100}%` } })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-num sme-strong", children: C(i.dscr) })
      ] }, i.stress_pct);
    }) }),
    (t.cash !== void 0 || t.debtService !== void 0) && /* @__PURE__ */ s("div", { className: "sme-small sme-muted", style: { marginTop: 10 }, children: [
      "Dòng tiền trả nợ ",
      G(t.cash),
      " / năm · Nghĩa vụ trả nợ ",
      G(t.debtService),
      " / năm"
    ] })
  ] });
}
function vt({ m: t }) {
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
        const i = dt[n.status] ?? { label: n.status, tone: "muted" }, a = (r) => n.fact === "loan_amount" ? G(r) : typeof r == "number" ? C(r) : "—";
        return /* @__PURE__ */ s("tr", { children: [
          /* @__PURE__ */ s("td", { children: [
            ct[n.fact] ?? n.fact,
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: n.clause })
          ] }),
          /* @__PURE__ */ s("td", { className: "sme-num", children: [
            n.op,
            " ",
            a(n.threshold)
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: a(n.actual) }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(k, { t: i.tone, children: i.label }) })
        ] }, n.id);
      }) })
    ] })
  ] });
}
function ft({ periods: t }) {
  const n = Object.keys(X).filter((i) => t.some((a) => {
    var r;
    return ((r = a.ratios) == null ? void 0 : r[i]) != null;
  }));
  return n.length ? /* @__PURE__ */ s("div", { className: "sme-card", children: [
    /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 8 }, children: "Chỉ số tài chính" }),
    /* @__PURE__ */ s("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ s("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Chỉ số" }),
        t.map((i) => /* @__PURE__ */ e("th", { className: "sme-num", children: i.period }, i.period))
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: n.map((i) => /* @__PURE__ */ s("tr", { children: [
        /* @__PURE__ */ e("td", { children: X[i].label }),
        t.map((a) => {
          var r;
          return /* @__PURE__ */ e("td", { className: "sme-num", children: X[i].fmt((r = a.ratios) == null ? void 0 : r[i]) }, a.period);
        })
      ] }, i)) })
    ] })
  ] }) : null;
}
function xt({ detail: t, m: n, onEvidence: i, goAgents: a }) {
  const r = t.results.consolidation, c = H.flatMap((o) => {
    var h;
    return (((h = t.results[o]) == null ? void 0 : h.findings) ?? []).filter((p) => p.severity === "high").map((p) => ({ ...p, agent: o }));
  }), m = Object.values(t.evidence).some((o) => /MẪU|sample/i.test(String(o.source)));
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    m && /* @__PURE__ */ s(Se, { children: [
      "Hồ sơ đang dùng ",
      /* @__PURE__ */ e("b", { children: "dữ liệu mẫu" }),
      " (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng."
    ] }),
    /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tóm tắt thẩm định" }),
        r ? /* @__PURE__ */ e(Ce, { state: ne(r) }) : /* @__PURE__ */ e(k, { t: "muted", children: "Chưa tổng hợp" })
      ] }),
      r ? /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: r.summary }) : /* @__PURE__ */ s("p", { className: "sme-muted", style: { margin: 0 }, children: [
        "Agent Tổng hợp chưa chạy. Kết quả từng agent xem ở tab ",
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "sme-ref",
            onClick: a,
            children: "Kết quả agent"
          }
        ),
        "."
      ] })
    ] }),
    c.length > 0 && /* @__PURE__ */ s("div", { className: "sme-card", children: [
      /* @__PURE__ */ s("h3", { className: "sme-h3", style: { marginBottom: 4 }, children: [
        "Cảnh báo mức cao (",
        c.length,
        ")"
      ] }),
      c.map((o) => /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: B(o.agent) }),
        /* @__PURE__ */ e($e, { f: o, onEvidence: i })
      ] }, o.agent + o.id))
    ] }),
    n.dscr && /* @__PURE__ */ e(bt, { m: n.dscr }),
    n.policy && /* @__PURE__ */ e(vt, { m: n.policy }),
    n.ratios && /* @__PURE__ */ e(ft, { periods: n.ratios })
  ] });
}
function yt({ id: t, r: n, open: i, onToggle: a, onEvidence: r }) {
  var m, o;
  const c = ["high", "medium", "low"].map((h) => [h, n.findings.filter((p) => p.severity === h).length]);
  return /* @__PURE__ */ s("div", { className: "sme-card", id: `agent-${t}`, children: [
    /* @__PURE__ */ s("button", { type: "button", className: `sme-acc-head ${i ? "open" : ""}`, onClick: a, "aria-expanded": i, children: [
      /* @__PURE__ */ e(We, { size: 16, className: "chev" }),
      /* @__PURE__ */ s("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ s("div", { className: "sme-between", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: B(t) }),
          /* @__PURE__ */ e(Ce, { state: ne(n) })
        ] }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-small sme-muted", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ s("span", { children: [
            "v",
            n._version,
            " · độ tin cậy ",
            st[n.confidence] ?? n.confidence,
            " · ",
            K(n._saved_at)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-sev-counts", children: c.filter(([, h]) => h > 0).map(([h, p]) => /* @__PURE__ */ s(k, { t: R[h].tone, children: [
            p,
            " ",
            R[h].label.toLowerCase()
          ] }, h)) })
        ] })
      ] })
    ] }),
    i && /* @__PURE__ */ s("div", { className: "sme-acc-body sme-stack", children: [
      /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: n.summary }),
      n.verification && !n.verification.passed && /* @__PURE__ */ s(Se, { t: "danger", children: [
        /* @__PURE__ */ e("b", { children: "Lý do bị chặn:" }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: n.verification.errors.slice(0, 8).map((h, p) => /* @__PURE__ */ e("li", { children: h }, p)) })
      ] }),
      n.findings.length > 0 && /* @__PURE__ */ e("div", { children: lt(n.findings).map((h) => /* @__PURE__ */ e($e, { f: h, onEvidence: r }, h.id)) }),
      (((m = n.missing_information) == null ? void 0 : m.length) ?? 0) > 0 && /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Còn thiếu" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: n.missing_information.map((h, p) => /* @__PURE__ */ e("li", { children: h }, p)) })
      ] }),
      (((o = n.open_issues) == null ? void 0 : o.length) ?? 0) > 0 && /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Vấn đề mở" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: n.open_issues.map((h, p) => /* @__PURE__ */ e("li", { children: h }, p)) })
      ] })
    ] })
  ] });
}
function wt({ detail: t, openAgent: n, onEvidence: i }) {
  const a = H.filter((o) => t.results[o]), [r, c] = b(() => new Set(n ? [n] : []));
  if (F(() => {
    n && (c((o) => new Set(o).add(n)), requestAnimationFrame(() => {
      var o;
      return (o = document.getElementById(`agent-${n}`)) == null ? void 0 : o.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
  }, [n]), !a.length) return /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(xe, { size: 30 }), title: "Chưa có kết quả", hint: "Chạy thẩm định để các agent ghi kết quả vào hồ sơ." });
  const m = (o) => c((h) => {
    const p = new Set(h);
    return p.has(o) ? p.delete(o) : p.add(o), p;
  });
  return /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ e(z, { onClick: () => c(r.size === a.length ? /* @__PURE__ */ new Set() : new Set(a)), children: r.size === a.length ? "Thu gọn tất cả" : "Mở tất cả" }) }),
    a.map((o) => /* @__PURE__ */ e(yt, { id: o, r: t.results[o], open: r.has(o), onToggle: () => m(o), onEvidence: i }, o))
  ] });
}
function Nt({ detail: t, focus: n }) {
  const i = Object.values(t.evidence), [a, r] = b(""), [c, m] = b("all"), [o, h] = b(n);
  F(() => {
    n && (h(n), r(""), m("all"), requestAnimationFrame(() => {
      var d;
      return (d = document.getElementById(`ev-${n}`)) == null ? void 0 : d.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [n]);
  const p = P(() => Array.from(new Set(i.map((d) => d.added_by))), [i]), v = i.filter((d) => (c === "all" || d.added_by === c) && (!a.trim() || `${d.id} ${d.source} ${pe(d.value)}`.toLowerCase().includes(a.trim().toLowerCase())));
  return i.length ? /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ s("div", { className: "sme-filters", children: [
        /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === "all" ? "on" : ""}`, onClick: () => m("all"), children: "Tất cả" }),
        p.map((d) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === d ? "on" : ""}`, onClick: () => m(d), children: B(d) }, d))
      ] }),
      /* @__PURE__ */ s("label", { className: "sme-search", children: [
        /* @__PURE__ */ e(j, { size: 14, className: "sme-muted" }),
        /* @__PURE__ */ e("input", { value: a, onChange: (d) => r(d.target.value), placeholder: "Tìm mã, nguồn, giá trị" })
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
        /* @__PURE__ */ e("tbody", { children: v.map((d) => {
          const x = pe(d.value), l = o === d.id;
          return /* @__PURE__ */ s(
            "tr",
            {
              id: `ev-${d.id}`,
              className: `click ${n === d.id ? "focus" : ""}`,
              onClick: () => h(l ? null : d.id),
              children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: d.id }),
                /* @__PURE__ */ e("td", { children: d.source }),
                /* @__PURE__ */ s("td", { children: [
                  /* @__PURE__ */ e("span", { className: "sme-mono", style: { wordBreak: "break-word" }, children: x.length > 90 && !l ? x.slice(0, 88) + "…" : l ? "" : x }),
                  l && /* @__PURE__ */ e("pre", { className: "sme-pre", children: x })
                ] }),
                /* @__PURE__ */ s("td", { className: "sme-muted sme-small", children: [
                  B(d.added_by),
                  /* @__PURE__ */ e("div", { children: K(d.added_at) })
                ] })
              ]
            },
            d.id
          );
        }) })
      ] }),
      v.length === 0 && /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(j, { size: 24 }), title: "Không có bằng chứng phù hợp" })
    ] })
  ] }) : /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(xe, { size: 30 }), title: "Chưa có bằng chứng" });
}
function kt({ detail: t, focus: n, onDecide: i, onEvidence: a }) {
  const [r, c] = b("open"), [m, o] = b({}), [h, p] = b(null);
  F(() => {
    n && (c("all"), requestAnimationFrame(() => {
      var l;
      return (l = document.getElementById(`rv-${n}`)) == null ? void 0 : l.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [n]);
  const v = t.review.filter((l) => l.status === "open").length, d = t.review.filter((l) => r === "all" || r === "open" == (l.status === "open")), x = async (l, y) => {
    p(l + y);
    try {
      await i(l, y, m[l] ?? "") && o((_) => ({ ..._, [l]: "" }));
    } finally {
      p(null);
    }
  };
  return t.review.length ? /* @__PURE__ */ s("div", { className: "sme-stack", children: [
    /* @__PURE__ */ s("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [["open", `Chờ xử lý (${v})`], ["done", `Đã xử lý (${t.review.length - v})`], ["all", "Tất cả"]].map(([l, y]) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${r === l ? "on" : ""}`, onClick: () => c(l), children: y }, l)) }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: "Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát." })
    ] }),
    d.length === 0 && /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(he, { size: 30 }), title: r === "open" ? "Đã xử lý hết các mục" : "Không có mục nào" }),
    d.map((l) => {
      const y = te[l.reason_code] ?? { label: l.reason_code, tone: "muted" }, _ = we[l.status] ?? { label: l.status, tone: "muted" }, A = m[l.id] ?? "";
      return /* @__PURE__ */ s(
        "div",
        {
          id: `rv-${l.id}`,
          className: `sme-card sme-review ${T(y.tone)}`,
          style: n === l.id ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)" } : void 0,
          children: [
            /* @__PURE__ */ s("div", { className: "sme-between", children: [
              /* @__PURE__ */ s("span", { className: "sme-row", children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: l.id }),
                /* @__PURE__ */ e(k, { t: y.tone, children: y.label })
              ] }),
              /* @__PURE__ */ e(k, { t: _.tone, children: _.label })
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "10px 0 6px", fontSize: 13.5, lineHeight: 1.55 }, children: l.detail }),
            /* @__PURE__ */ s("div", { className: "sme-small sme-muted", children: [
              B(l.source_agent),
              " · ",
              K(l.created_at),
              /* @__PURE__ */ e(Te, { refs: l.evidence_refs, onOpen: a })
            ] }),
            l.status === "open" ? /* @__PURE__ */ s("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ e(
                "textarea",
                {
                  className: "sme-textarea",
                  value: A,
                  placeholder: "Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…",
                  onChange: (g) => o({ ...m, [l.id]: g.target.value })
                }
              ),
              /* @__PURE__ */ s("div", { className: "sme-row", style: { marginTop: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ e(z, { disabled: !A.trim(), busy: h === l.id + "needs_info", onClick: () => x(l.id, "needs_info"), children: "Yêu cầu bổ sung" }),
                /* @__PURE__ */ e(z, { primary: !0, disabled: !A.trim(), busy: h === l.id + "confirmed", onClick: () => x(l.id, "confirmed"), children: "Xác nhận" })
              ] })
            ] }) : /* @__PURE__ */ s("div", { className: `sme-decision ${T(_.tone)}`, children: [
              /* @__PURE__ */ e("b", { children: _.label }),
              " bởi ",
              l.decided_by,
              " · ",
              K(l.decided_at),
              /* @__PURE__ */ e("div", { style: { marginTop: 2 }, children: l.note })
            ] })
          ]
        },
        l.id
      );
    })
  ] }) : /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(he, { size: 30 }), title: "Không có mục cần rà soát" });
}
function _t({ detail: t }) {
  if (!t.audit.length) return /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(Ge, { size: 30 }), title: "Chưa có nhật ký" });
  const n = (a) => a.action === "verification" ? a.passed ? "ok" : "danger" : a.action === "review_decide" ? "accent" : a.action === "review_add" ? "warn" : "muted", i = (a) => {
    var c, m;
    const r = a.agent ? B(a.agent) : a.actor ?? "";
    switch (a.action) {
      case "result_put":
        return `${r} lưu kết quả v${a.version}${a.rerun_reason ? ` (chạy lại: ${a.rerun_reason})` : ""}`;
      case "verification":
        return `${r} v${a.version}: ${a.passed ? "đạt kiểm chứng" : "bị chặn"}`;
      case "evidence_add":
        return `${r} thêm ${(a.ids ?? []).join(", ")}`;
      case "review_add":
        return `${r} thêm ${a.id} (${((c = te[a.reason_code]) == null ? void 0 : c.label) ?? a.reason_code})`;
      case "review_decide":
        return `${a.actor} ${((m = we[a.status]) == null ? void 0 : m.label.toLowerCase()) ?? a.status} ${a.id}`;
      case "case_create":
        return `Luồng ${a.flow}, ${a.documents} chứng từ`;
      default:
        return r;
    }
  };
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...t.audit].reverse().map((a, r) => /* @__PURE__ */ s("div", { className: `sme-tl-item ${T(n(a))}`, children: [
    /* @__PURE__ */ s("div", { className: "sme-between", children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", style: { fontSize: 13 }, children: at[a.action] ?? a.action }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: K(a.ts) })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: i(a) })
  ] }, r)) }) });
}
function Ct({ detail: t, flow: n, onAgent: i }) {
  return /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: ye.map((a) => /* @__PURE__ */ s("div", { className: "sme-phase", children: [
    /* @__PURE__ */ e("span", { className: "sme-phase-name", children: a.name }),
    a.agents.map((r) => {
      const c = r === "industry" && n !== "B" && !t.results[r], m = c ? "none" : ne(t.results[r]);
      return /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: `sme-node ${T(q[m].tone)} ${c || m === "none" ? "skip" : ""}`,
          disabled: c || m === "none",
          title: c ? "Chỉ chạy ở luồng B" : q[m].label,
          onClick: () => i(r),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(_e, { state: m, size: 12 }) }),
            /* @__PURE__ */ s("span", { children: [
              B(r),
              c ? " (luồng B)" : ""
            ] })
          ]
        },
        r
      );
    })
  ] }, a.name)) }) });
}
function Q({ label: t, children: n }) {
  return /* @__PURE__ */ s("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: t }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: n })
  ] });
}
function St({ caseId: t, onBack: n }) {
  var ae, ie, re, le, oe, ce;
  const i = ge(), [a, r] = b(null), [c, m] = b(null), o = ke(m), [h, p] = b(!1), [v, d] = b("overview"), [x, l] = b(null), [y, _] = b(null), [A, g] = b(null), f = ee(async () => {
    p(!0);
    try {
      r(await i.get(`${J}/cases/${t}`)), m(null);
    } catch (u) {
      m(Z(u));
    } finally {
      p(!1);
    }
  }, [i, t]);
  F(() => {
    f();
  }, [f]);
  const w = P(() => a ? ot(a) : {}, [a]), $ = (a == null ? void 0 : a.review.filter((u) => u.status === "open")) ?? [], W = (ae = w.policy) == null ? void 0 : ae.rows.filter((u) => u.status === "not_met").length, Y = ((re = (ie = w.dscr) == null ? void 0 : ie.scenarios.find((u) => u.stress_pct === 0)) == null ? void 0 : re.dscr) ?? null, U = (u) => {
    l(u), d("evidence");
  }, ze = (u) => {
    _(u), d("review");
  }, Ae = (u) => {
    g(u), d("agents");
  }, Ee = async (u, I, Me) => {
    try {
      return await i.post(`${J}/cases/${t}/review/${u}`, { status: I, note: Me }), await f(), !0;
    } catch (De) {
      return m(Z(De)), !1;
    }
  }, se = `Thẩm định ${((le = a == null ? void 0 : a.case.customer) == null ? void 0 : le.name) ?? t}`, Be = () => o(
    `Chạy thẩm định hồ sơ ${t}, luồng ${(a == null ? void 0 : a.case.flow) ?? "A"}.`,
    t,
    se
  ), Le = () => o(`Giải thích kết quả thẩm định hồ sơ ${t}: `, t, se), N = a == null ? void 0 : a.case, M = (N == null ? void 0 : N.customer) ?? {}, S = (N == null ? void 0 : N.request) ?? {}, Ke = [
    { key: "overview", label: "Tổng quan" },
    { key: "agents", label: "Kết quả agent", count: a ? Object.keys(a.results).length : void 0 },
    { key: "evidence", label: "Bằng chứng", count: a ? Object.keys(a.evidence).length : void 0 },
    { key: "review", label: "Rà soát", count: $.length || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ s("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ s("div", { className: "sme-hero", children: [
      /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ s("button", { type: "button", className: "sme-back", onClick: n, children: [
          /* @__PURE__ */ e(Ye, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: String(M.name ?? t) }),
        /* @__PURE__ */ s("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: t }),
          N && /* @__PURE__ */ s("span", { className: "sme-chip", children: [
            "Luồng ",
            N.flow
          ] }),
          M.industry_code && /* @__PURE__ */ s("span", { className: "sme-chip", children: [
            "Ngành ",
            String(M.industry_code)
          ] }),
          S.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: Ne[S.purpose] ?? S.purpose }),
          N && /* @__PURE__ */ s("span", { className: "sme-small sme-muted", children: [
            "Tạo ",
            K(N.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(z, { onClick: f, busy: h, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(ve, { size: 14 }) }),
        /* @__PURE__ */ s(z, { onClick: Le, children: [
          /* @__PURE__ */ e(Ue, { size: 14 }),
          " Hỏi trợ lý"
        ] }),
        /* @__PURE__ */ s(z, { primary: !0, onClick: Be, children: [
          /* @__PURE__ */ e(Xe, { size: 14 }),
          " Chạy thẩm định"
        ] })
      ] })
    ] }),
    c && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(be, { title: "Có lỗi khi làm việc với hồ sơ", children: c }) }),
    !a && !c && /* @__PURE__ */ s("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "70%" } })
    ] }),
    a && N && /* @__PURE__ */ s(ue, { children: [
      /* @__PURE__ */ s("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          E,
          {
            icon: /* @__PURE__ */ e(Qe, { size: 18 }),
            label: "Số tiền đề nghị",
            value: it(S.amount).replace(" đ", ""),
            hint: [S.term_months ? `${S.term_months} tháng` : null, S.annual_rate_pct ? `lãi ${C(S.annual_rate_pct)}%/năm` : null].filter(Boolean).join(" · ") || "VND"
          }
        ),
        /* @__PURE__ */ e(
          E,
          {
            t: Y == null ? "muted" : ((oe = w.dscr) == null ? void 0 : oe.threshold) !== void 0 && Y < w.dscr.threshold ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Je, { size: 18 }),
            label: "DSCR cơ sở",
            value: C(Y),
            hint: ((ce = w.dscr) == null ? void 0 : ce.threshold) !== void 0 ? `Ngưỡng ≥ ${C(w.dscr.threshold)}` : "Chưa có phân tích"
          }
        ),
        /* @__PURE__ */ e(
          E,
          {
            t: W == null ? "muted" : W > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Ze, { size: 18 }),
            label: "Điều kiện không đạt",
            value: W ?? "—",
            hint: w.policy ? `${w.policy.rows.length} điều kiện · ${w.policy.product}` : "Chưa kiểm tra chính sách"
          }
        ),
        /* @__PURE__ */ e(
          E,
          {
            t: $.length ? "warn" : "ok",
            icon: /* @__PURE__ */ e(fe, { size: 18 }),
            label: "Chờ cán bộ rà soát",
            value: $.length,
            hint: `${a.review.length} mục tổng cộng`
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(Ct, { detail: a, flow: N.flow, onAgent: Ae }) }),
      /* @__PURE__ */ s("div", { className: "sme-detail", children: [
        /* @__PURE__ */ s("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Ke.map((u) => /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": v === u.key,
              className: `sme-tab ${v === u.key ? "on" : ""}`,
              onClick: () => d(u.key),
              children: [
                u.label,
                u.count !== void 0 && /* @__PURE__ */ e("span", { className: "sme-count", children: u.count })
              ]
            },
            u.key
          )) }),
          v === "overview" && /* @__PURE__ */ e(xt, { detail: a, m: w, onEvidence: U, goAgents: () => d("agents") }),
          v === "agents" && /* @__PURE__ */ e(wt, { detail: a, openAgent: A, onEvidence: U }),
          v === "evidence" && /* @__PURE__ */ e(Nt, { detail: a, focus: x }),
          v === "review" && /* @__PURE__ */ e(kt, { detail: a, focus: y, onDecide: Ee, onEvidence: U }),
          v === "audit" && /* @__PURE__ */ e(_t, { detail: a })
        ] }),
        /* @__PURE__ */ s("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Cần xử lý" }),
              /* @__PURE__ */ e(k, { t: $.length ? "warn" : "ok", children: $.length })
            ] }),
            $.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn mục chờ rà soát." }),
            $.slice(0, 6).map((u) => {
              const I = te[u.reason_code] ?? { label: u.reason_code, tone: "muted" };
              return /* @__PURE__ */ s("button", { type: "button", className: "sme-todo", onClick: () => ze(u.id), children: [
                /* @__PURE__ */ e(k, { t: I.tone, children: u.id }),
                /* @__PURE__ */ s("span", { className: "sme-todo-text", children: [
                  /* @__PURE__ */ s("b", { children: [
                    I.label,
                    "."
                  ] }),
                  " ",
                  u.detail
                ] })
              ] }, u.id);
            }),
            $.length > 6 && /* @__PURE__ */ s("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => d("review"), children: [
              "Xem thêm ",
              $.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Khách hàng" }),
            /* @__PURE__ */ e(Q, { label: "CIF", children: String(M.cif ?? "—") }),
            /* @__PURE__ */ e(Q, { label: "Mã số thuế", children: String(M.tax_id ?? "—") }),
            /* @__PURE__ */ e(Q, { label: "Số năm hoạt động", children: M.years_in_operation ?? "—" }),
            S.proposal && /* @__PURE__ */ s("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(S.proposal)
            ] })
          ] }),
          /* @__PURE__ */ s("div", { className: "sme-card", children: [
            /* @__PURE__ */ s("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Chứng từ" }),
              /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: N.documents.length })
            ] }),
            N.documents.map((u) => /* @__PURE__ */ s("div", { className: "sme-row sme-small", style: { padding: "5px 0" }, children: [
              /* @__PURE__ */ e(et, { size: 14, className: "sme-muted" }),
              /* @__PURE__ */ e("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, children: u.name }),
              /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: u.id })
            ] }, u.id))
          ] }),
          a.audit.length > 0 && /* @__PURE__ */ s("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(tt, { size: 13 }),
            " Hoạt động gần nhất ",
            K(a.audit[a.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Tt = `
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
`;
function $t() {
  const t = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(t)) return;
  const n = document.createElement("style");
  n.id = t, n.textContent = Tt, document.head.appendChild(n);
}
$t();
function Kt() {
  const [t, n] = b(null);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: t ? /* @__PURE__ */ e(St, { caseId: t, onBack: () => n(null) }) : /* @__PURE__ */ e(gt, { onOpen: n }) });
}
export {
  Kt as default
};
