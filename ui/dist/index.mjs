import { jsxs as t, jsx as e, Fragment as he } from "react/jsx-runtime";
import { useState as b, useCallback as pe, useEffect as F, useMemo as P } from "react";
import { useAppApi as ue, useChatLauncher as ge } from "@kirocrew/app-sdk";
import { PageHeader as Oe, Btn as z, ErrorNotice as be } from "@kirocrew/app-sdk/ui";
import { CheckCircle2 as qe, XCircle as Ke, CircleDot as Re, CircleDashed as Fe, AlertTriangle as Ie, RefreshCw as ve, Plus as oe, FolderOpen as ce, ClipboardList as fe, ShieldAlert as Ve, AlertOctagon as Pe, Search as j, FileSearch as xe, ClipboardCheck as de, History as je, ChevronRight as He, ArrowLeft as We, MessageSquare as Ge, Play as Ue, Landmark as Ye, Gauge as Xe, ShieldCheck as Qe, FileText as Je, Activity as Ze } from "lucide-react";
const J = "/apps/sme-lending/api", Z = "sme-lending--sme-assistant", ye = [
  { name: "Chứng từ", agents: ["document-evidence"] },
  { name: "Sản phẩm", agents: ["product-match"] },
  { name: "Chuyên môn", agents: ["financial-analysis", "risk-compliance", "collateral", "industry"] },
  { name: "Chính sách", agents: ["policy-exception"] },
  { name: "Tổng hợp", agents: ["consolidation"] }
], H = ye.flatMap((n) => n.agents), en = {
  "document-evidence": "Chứng từ & bằng chứng",
  "product-match": "Nhận diện sản phẩm",
  "financial-analysis": "Phân tích tài chính",
  "risk-compliance": "Rủi ro & tuân thủ",
  collateral: "Tài sản bảo đảm",
  industry: "Ngành & cạnh tranh",
  "policy-exception": "Chính sách & ngoại lệ",
  consolidation: "Tổng hợp tờ trình"
}, B = (n) => en[n] ?? n, R = {
  passed: { label: "Đã kiểm chứng", tone: "ok" },
  blocked: { label: "Bị chặn", tone: "danger" },
  unverified: { label: "Chưa kiểm chứng", tone: "warn" },
  none: { label: "Chưa chạy", tone: "muted" }
}, K = {
  high: { label: "Cao", tone: "danger", rank: 0 },
  medium: { label: "Trung bình", tone: "warn", rank: 1 },
  low: { label: "Thấp", tone: "info", rank: 2 },
  info: { label: "Thông tin", tone: "muted", rank: 3 }
}, nn = { high: "cao", medium: "trung bình", low: "thấp" }, ne = {
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
}, tn = {
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
}, V = new Intl.NumberFormat("vi-VN"), sn = (n) => typeof n == "number" ? V.format(n) + " đ" : "—", W = (n) => typeof n != "number" ? "—" : Math.abs(n) >= 1e9 ? V.format(Math.round(n / 1e7) / 100) + " tỷ" : Math.abs(n) >= 1e6 ? V.format(Math.round(n / 1e4) / 100) + " triệu" : V.format(n) + " đ", C = (n, s = 2) => typeof n == "number" ? n.toLocaleString("vi-VN", { maximumFractionDigits: s }) : "—", O = (n) => typeof n == "number" ? (n * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + "%" : "—", D = (n) => n ? new Date(n).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—", an = (n) => {
  if (!n) return "—";
  const s = Math.round((Date.now() - new Date(n).getTime()) / 1e3);
  return s < 60 ? "vừa xong" : s < 3600 ? `${Math.floor(s / 60)} phút trước` : s < 86400 ? `${Math.floor(s / 3600)} giờ trước` : `${Math.floor(s / 86400)} ngày trước`;
}, me = (n) => typeof n == "string" ? n : JSON.stringify(n, null, 2), ee = (n) => n instanceof Error ? n.message : String(n), rn = (n) => [...n].sort((s, r) => {
  var a, i;
  return (((a = K[s.severity]) == null ? void 0 : a.rank) ?? 9) - (((i = K[r.severity]) == null ? void 0 : i.rank) ?? 9);
});
function te(n) {
  return n ? n.verification ? n.verification.passed ? "passed" : "blocked" : "unverified" : "none";
}
function q(n, s, r) {
  var a, i;
  return (i = (a = n.results[s]) == null ? void 0 : a.calculations) == null ? void 0 : i.find((c) => c.kind === r);
}
function ln(n) {
  var o, h, p, v, d;
  const s = {}, r = q(n, "policy-exception", "policy_check") ?? q(n, "risk-compliance", "policy_check");
  (o = r == null ? void 0 : r.outputs) != null && o.matrix && (s.policy = { version: r.outputs.policy_version, product: r.outputs.product_code, rows: r.outputs.matrix });
  const a = q(n, "financial-analysis", "repayment_capacity");
  if ((h = a == null ? void 0 : a.outputs) != null && h.scenarios) {
    const x = (p = s.policy) == null ? void 0 : p.rows.find((l) => l.fact === "dscr");
    s.dscr = {
      scenarios: a.outputs.scenarios,
      threshold: typeof (x == null ? void 0 : x.threshold) == "number" ? x.threshold : void 0,
      debtService: a.outputs.total_debt_service_annual,
      cash: (v = a.inputs) == null ? void 0 : v.cash_available_annual
    };
  }
  const i = q(n, "collateral", "collateral_ltv");
  i != null && i.outputs && (s.ltv = { ltv: i.outputs.ltv_pct ?? null, cap: i.outputs.max_ltv_pct ?? null, eligible: i.outputs.eligible_value });
  const c = q(n, "financial-analysis", "fin_ratios");
  (d = c == null ? void 0 : c.outputs) != null && d.periods && (s.ratios = c.outputs.periods);
  const m = q(n, "consolidation", "genform");
  return m != null && m.outputs && (s.genform = m.outputs), s;
}
const X = {
  gross_margin: { label: "Biên lợi nhuận gộp", fmt: O },
  net_margin: { label: "Biên lợi nhuận ròng", fmt: O },
  ebitda_margin: { label: "Biên EBITDA", fmt: O },
  current_ratio: { label: "Thanh toán hiện hành", fmt: (n) => C(n) },
  debt_to_equity: { label: "Nợ vay / Vốn chủ", fmt: (n) => C(n) },
  liabilities_to_assets: { label: "Nợ phải trả / Tài sản", fmt: O },
  roa: { label: "ROA", fmt: O },
  roe: { label: "ROE", fmt: O },
  interest_coverage: { label: "Khả năng trả lãi", fmt: (n) => C(n, 1) + (typeof n == "number" ? " lần" : "") },
  receivable_days: { label: "Số ngày phải thu", fmt: (n) => C(n, 0) },
  inventory_days: { label: "Số ngày tồn kho", fmt: (n) => C(n, 0) }
}, on = {
  years_in_operation: "Số năm hoạt động",
  loan_amount: "Số tiền vay",
  term_months: "Kỳ hạn (tháng)",
  dscr: "DSCR",
  cic_debt_group: "Nhóm nợ CIC",
  ltv_pct: "LTV (%)",
  equity_contribution_pct: "Vốn tự có (%)"
}, cn = {
  met: { label: "Đạt", tone: "ok" },
  not_met: { label: "Không đạt", tone: "danger" },
  missing: { label: "Thiếu dữ liệu", tone: "warn" },
  na: { label: "Không áp dụng", tone: "muted" }
}, T = (n) => `t-${n}`;
function k({ t: n, children: s, title: r }) {
  return /* @__PURE__ */ e("span", { className: `sme-pill ${T(n)}`, title: r, children: s });
}
function E({ icon: n, label: s, value: r, hint: a, t: i = "accent" }) {
  return /* @__PURE__ */ t("div", { className: `sme-kpi ${T(i)}`, children: [
    /* @__PURE__ */ e("div", { className: "sme-kpi-icon", children: n }),
    /* @__PURE__ */ t("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e("div", { className: "sme-kpi-label", children: s }),
      /* @__PURE__ */ e("div", { className: "sme-kpi-value", children: r }),
      a && /* @__PURE__ */ e("div", { className: "sme-kpi-hint", children: a })
    ] })
  ] });
}
function ke({ state: n, size: s = 13 }) {
  return n === "passed" ? /* @__PURE__ */ e(qe, { size: s }) : n === "blocked" ? /* @__PURE__ */ e(Ke, { size: s }) : n === "unverified" ? /* @__PURE__ */ e(Re, { size: s }) : /* @__PURE__ */ e(Fe, { size: s });
}
function _e({ state: n }) {
  const s = R[n];
  return /* @__PURE__ */ t(k, { t: s.tone, children: [
    /* @__PURE__ */ e(ke, { state: n, size: 12 }),
    s.label
  ] });
}
function L({ icon: n, title: s, hint: r, action: a }) {
  return /* @__PURE__ */ t("div", { className: "sme-empty", children: [
    n,
    /* @__PURE__ */ e("div", { className: "sme-strong", children: s }),
    r && /* @__PURE__ */ e("div", { className: "sme-small", style: { marginTop: 4 }, children: r }),
    a && /* @__PURE__ */ e("div", { style: { marginTop: 12 }, children: a })
  ] });
}
function Ce({ t: n = "warn", children: s }) {
  return /* @__PURE__ */ t("div", { className: `sme-banner ${T(n)}`, children: [
    /* @__PURE__ */ e(Ie, { size: 15 }),
    /* @__PURE__ */ e("div", { children: s })
  ] });
}
function Se({ refs: n, onOpen: s }) {
  return n != null && n.length ? /* @__PURE__ */ e("span", { className: "sme-row sme-wrap", style: { gap: 4, display: "inline-flex", marginLeft: 4 }, children: n.map((r) => /* @__PURE__ */ e("button", { type: "button", className: "sme-ref", title: "Xem bằng chứng", onClick: () => s(r), children: r }, r)) }) : null;
}
function dn({ c: n, onOpen: s }) {
  const r = n.agents ?? {}, a = Object.keys(r).length;
  return /* @__PURE__ */ t(
    "div",
    {
      className: "sme-card hover",
      role: "button",
      tabIndex: 0,
      onClick: s,
      onKeyDown: (i) => {
        (i.key === "Enter" || i.key === " ") && (i.preventDefault(), s());
      },
      children: [
        /* @__PURE__ */ t("div", { className: "sme-between", style: { alignItems: "flex-start" }, children: [
          /* @__PURE__ */ t("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ e("div", { className: "sme-h2", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.customer_name ?? "Chưa có tên khách hàng" }),
            /* @__PURE__ */ e("div", { className: "sme-mono sme-muted", style: { marginTop: 2 }, children: n.case_id })
          ] }),
          n.review_open > 0 ? /* @__PURE__ */ t(k, { t: "warn", children: [
            n.review_open,
            " chờ rà soát"
          ] }) : a > 0 ? /* @__PURE__ */ e(k, { t: "ok", children: "Đã rà soát" }) : /* @__PURE__ */ e(k, { t: "muted", children: "Mới" })
        ] }),
        /* @__PURE__ */ t("div", { className: "sme-row", style: { marginTop: 12, alignItems: "baseline", gap: 10 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-case-amount", children: W(n.amount) }),
          /* @__PURE__ */ e("span", { className: "sme-muted sme-small", children: [n.term_months ? `${n.term_months} tháng` : null, n.purpose ? Ne[n.purpose] ?? n.purpose : null].filter(Boolean).join(" · ") })
        ] }),
        /* @__PURE__ */ e("div", { className: "sme-pipe", "aria-label": `${a}/${H.length} agent đã chạy`, children: H.map((i) => {
          const c = r[i];
          return /* @__PURE__ */ e(
            "span",
            {
              className: c ? T(R[c].tone) : "none",
              title: `${B(i)}: ${R[c ?? "none"].label}`
            },
            i
          );
        }) }),
        /* @__PURE__ */ t("div", { className: "sme-between sme-small sme-muted", children: [
          /* @__PURE__ */ t("span", { className: "sme-row", style: { gap: 6 }, children: [
            /* @__PURE__ */ t("span", { className: "sme-chip", children: [
              "Luồng ",
              n.flow
            ] }),
            (n.high_findings ?? 0) > 0 && /* @__PURE__ */ t(k, { t: "danger", children: [
              n.high_findings,
              " cảnh báo cao"
            ] }),
            n.agents_blocked > 0 && /* @__PURE__ */ t(k, { t: "danger", children: [
              n.agents_blocked,
              " bị chặn"
            ] })
          ] }),
          /* @__PURE__ */ t("span", { title: n.updated_at, children: [
            "Cập nhật ",
            an(n.updated_at)
          ] })
        ] })
      ]
    }
  );
}
function mn({ onOpen: n }) {
  const s = ue(), { openChat: r } = ge(), [a, i] = b(null), [c, m] = b(null), [o, h] = b(""), [p, v] = b("all"), [d, x] = b(!1), l = pe(async () => {
    x(!0);
    try {
      i((await s.get(`${J}/cases`)).cases), m(null);
    } catch (g) {
      m(ee(g));
    } finally {
      x(!1);
    }
  }, [s]);
  F(() => {
    l();
  }, [l]);
  const y = P(() => ({
    open: (a == null ? void 0 : a.reduce((g, f) => g + f.review_open, 0)) ?? 0,
    blocked: (a == null ? void 0 : a.reduce((g, f) => g + f.agents_blocked, 0)) ?? 0,
    high: (a == null ? void 0 : a.reduce((g, f) => g + (f.high_findings ?? 0), 0)) ?? 0
  }), [a]), _ = P(() => {
    const g = o.trim().toLowerCase();
    return (a ?? []).filter((f) => p === "review" && f.review_open === 0 || p === "blocked" && f.agents_blocked === 0 ? !1 : g ? [f.customer_name, f.case_id, f.industry_code].some((w) => w == null ? void 0 : w.toLowerCase().includes(g)) : !0);
  }, [a, o, p]), A = () => r({ agent: Z, autoSend: !1, message: "Tạo hồ sơ thẩm định SME mới." });
  return /* @__PURE__ */ t(he, { children: [
    /* @__PURE__ */ e(
      Oe,
      {
        title: "Thẩm định SME",
        subtitle: "Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ",
        actions: /* @__PURE__ */ t("div", { className: "sme-row", children: [
          /* @__PURE__ */ t(z, { onClick: l, busy: d, children: [
            /* @__PURE__ */ e(ve, { size: 14 }),
            " Làm mới"
          ] }),
          /* @__PURE__ */ t(z, { primary: !0, onClick: A, children: [
            /* @__PURE__ */ e(oe, { size: 14 }),
            " Hồ sơ mới"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ t("div", { className: "sme-scroll", children: [
      c && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(be, { title: "Không tải được danh sách hồ sơ", children: c }) }),
      /* @__PURE__ */ t("div", { className: "sme-kpis", children: [
        /* @__PURE__ */ e(E, { icon: /* @__PURE__ */ e(ce, { size: 18 }), label: "Hồ sơ", value: (a == null ? void 0 : a.length) ?? "…" }),
        /* @__PURE__ */ e(
          E,
          {
            t: "warn",
            icon: /* @__PURE__ */ e(fe, { size: 18 }),
            label: "Mục chờ rà soát",
            value: a ? y.open : "…",
            hint: "Cần cán bộ xác nhận"
          }
        ),
        /* @__PURE__ */ e(E, { t: "danger", icon: /* @__PURE__ */ e(Ve, { size: 18 }), label: "Cảnh báo mức cao", value: a ? y.high : "…" }),
        /* @__PURE__ */ e(
          E,
          {
            t: y.blocked ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Pe, { size: 18 }),
            label: "Kết quả bị chặn",
            value: a ? y.blocked : "…",
            hint: "Không qua kiểm chứng"
          }
        )
      ] }),
      /* @__PURE__ */ t("div", { className: "sme-between sme-wrap", style: { marginBottom: 12 }, children: [
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
        /* @__PURE__ */ t("label", { className: "sme-search", children: [
          /* @__PURE__ */ e(j, { size: 14, className: "sme-muted" }),
          /* @__PURE__ */ e("input", { value: o, onChange: (g) => h(g.target.value), placeholder: "Tìm khách hàng, mã hồ sơ, mã ngành" })
        ] })
      ] }),
      a === null && !c && /* @__PURE__ */ e("div", { className: "sme-cases", children: [0, 1, 2].map((g) => /* @__PURE__ */ t("div", { className: "sme-card sme-stack", children: [
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "60%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "40%" } }),
        /* @__PURE__ */ e("div", { className: "sme-skel" })
      ] }, g)) }),
      a && a.length === 0 && /* @__PURE__ */ e(
        L,
        {
          icon: /* @__PURE__ */ e(ce, { size: 32 }),
          title: "Chưa có hồ sơ nào",
          hint: "Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn.",
          action: /* @__PURE__ */ t(z, { primary: !0, onClick: A, children: [
            /* @__PURE__ */ e(oe, { size: 14 }),
            " Tạo hồ sơ đầu tiên"
          ] })
        }
      ),
      a && a.length > 0 && _.length === 0 && /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(j, { size: 28 }), title: "Không có hồ sơ phù hợp", hint: "Thử bỏ bộ lọc hoặc đổi từ khoá." }),
      _.length > 0 && /* @__PURE__ */ e("div", { className: "sme-cases", children: _.map((g) => /* @__PURE__ */ e(dn, { c: g, onOpen: () => n(g.case_id) }, g.case_id)) })
    ] })
  ] });
}
function Te({ f: n, onEvidence: s }) {
  const r = K[n.severity] ?? K.info;
  return /* @__PURE__ */ t("div", { className: `sme-finding ${T(r.tone)}`, children: [
    /* @__PURE__ */ e("div", { className: "bar" }),
    /* @__PURE__ */ t("div", { children: [
      /* @__PURE__ */ t("div", { className: "sme-finding-topic sme-row", style: { gap: 6 }, children: [
        /* @__PURE__ */ e(k, { t: r.tone, children: r.label }),
        /* @__PURE__ */ e("span", { children: n.topic.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ t("div", { className: "sme-finding-text", children: [
        n.statement,
        /* @__PURE__ */ e(Se, { refs: n.evidence_refs, onOpen: s })
      ] })
    ] })
  ] });
}
function hn({ m: n }) {
  const s = Math.max(1.6, (n.threshold ?? 0) * 1.3, ...n.scenarios.map((r) => r.dscr ?? 0));
  return /* @__PURE__ */ t("div", { className: "sme-card", children: [
    /* @__PURE__ */ t("div", { className: "sme-between", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Khả năng trả nợ (DSCR)" }),
      n.threshold !== void 0 && /* @__PURE__ */ t("span", { className: "sme-small sme-muted", children: [
        "Ngưỡng chính sách ≥ ",
        C(n.threshold)
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-bars", children: n.scenarios.map((r) => {
      const a = n.threshold === void 0 || (r.dscr ?? 0) >= n.threshold;
      return /* @__PURE__ */ t("div", { className: `sme-bar-row ${T(a ? "ok" : "danger")}`, children: [
        /* @__PURE__ */ e("span", { className: "sme-muted", children: r.stress_pct ? `Stress −${r.stress_pct}%` : "Cơ sở" }),
        /* @__PURE__ */ t("div", { className: "sme-bar-track", children: [
          /* @__PURE__ */ e("div", { className: "sme-bar-fill", style: { width: `${Math.min(100, (r.dscr ?? 0) / s * 100)}%` } }),
          n.threshold !== void 0 && /* @__PURE__ */ e("div", { className: "sme-bar-mark", style: { left: `${n.threshold / s * 100}%` } })
        ] }),
        /* @__PURE__ */ e("span", { className: "sme-num sme-strong", children: C(r.dscr) })
      ] }, r.stress_pct);
    }) }),
    (n.cash !== void 0 || n.debtService !== void 0) && /* @__PURE__ */ t("div", { className: "sme-small sme-muted", style: { marginTop: 10 }, children: [
      "Dòng tiền trả nợ ",
      W(n.cash),
      " / năm · Nghĩa vụ trả nợ ",
      W(n.debtService),
      " / năm"
    ] })
  ] });
}
function pn({ m: n }) {
  return /* @__PURE__ */ t("div", { className: "sme-card", children: [
    /* @__PURE__ */ t("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ t("h3", { className: "sme-h3", children: [
        "Điều kiện chính sách ",
        n.product
      ] }),
      n.version && /* @__PURE__ */ t("span", { className: "sme-small sme-muted", children: [
        "Phiên bản ",
        n.version
      ] })
    ] }),
    /* @__PURE__ */ t("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ t("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Điều kiện" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Yêu cầu" }),
        /* @__PURE__ */ e("th", { className: "sme-num", children: "Thực tế" }),
        /* @__PURE__ */ e("th", { children: "Kết quả" })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: n.rows.map((s) => {
        const r = cn[s.status] ?? { label: s.status, tone: "muted" }, a = (i) => s.fact === "loan_amount" ? W(i) : typeof i == "number" ? C(i) : "—";
        return /* @__PURE__ */ t("tr", { children: [
          /* @__PURE__ */ t("td", { children: [
            on[s.fact] ?? s.fact,
            /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: s.clause })
          ] }),
          /* @__PURE__ */ t("td", { className: "sme-num", children: [
            s.op,
            " ",
            a(s.threshold)
          ] }),
          /* @__PURE__ */ e("td", { className: "sme-num", children: a(s.actual) }),
          /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(k, { t: r.tone, children: r.label }) })
        ] }, s.id);
      }) })
    ] })
  ] });
}
function un({ periods: n }) {
  const s = Object.keys(X).filter((r) => n.some((a) => {
    var i;
    return ((i = a.ratios) == null ? void 0 : i[r]) != null;
  }));
  return s.length ? /* @__PURE__ */ t("div", { className: "sme-card", children: [
    /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 8 }, children: "Chỉ số tài chính" }),
    /* @__PURE__ */ t("table", { className: "sme-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ t("tr", { children: [
        /* @__PURE__ */ e("th", { children: "Chỉ số" }),
        n.map((r) => /* @__PURE__ */ e("th", { className: "sme-num", children: r.period }, r.period))
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: s.map((r) => /* @__PURE__ */ t("tr", { children: [
        /* @__PURE__ */ e("td", { children: X[r].label }),
        n.map((a) => {
          var i;
          return /* @__PURE__ */ e("td", { className: "sme-num", children: X[r].fmt((i = a.ratios) == null ? void 0 : i[r]) }, a.period);
        })
      ] }, r)) })
    ] })
  ] }) : null;
}
function gn({ detail: n, m: s, onEvidence: r, goAgents: a }) {
  const i = n.results.consolidation, c = H.flatMap((o) => {
    var h;
    return (((h = n.results[o]) == null ? void 0 : h.findings) ?? []).filter((p) => p.severity === "high").map((p) => ({ ...p, agent: o }));
  }), m = Object.values(n.evidence).some((o) => /MẪU|sample/i.test(String(o.source)));
  return /* @__PURE__ */ t("div", { className: "sme-stack", children: [
    m && /* @__PURE__ */ t(Ce, { children: [
      "Hồ sơ đang dùng ",
      /* @__PURE__ */ e("b", { children: "dữ liệu mẫu" }),
      " (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng."
    ] }),
    /* @__PURE__ */ t("div", { className: "sme-card", children: [
      /* @__PURE__ */ t("div", { className: "sme-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Tóm tắt thẩm định" }),
        i ? /* @__PURE__ */ e(_e, { state: te(i) }) : /* @__PURE__ */ e(k, { t: "muted", children: "Chưa tổng hợp" })
      ] }),
      i ? /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: i.summary }) : /* @__PURE__ */ t("p", { className: "sme-muted", style: { margin: 0 }, children: [
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
    c.length > 0 && /* @__PURE__ */ t("div", { className: "sme-card", children: [
      /* @__PURE__ */ t("h3", { className: "sme-h3", style: { marginBottom: 4 }, children: [
        "Cảnh báo mức cao (",
        c.length,
        ")"
      ] }),
      c.map((o) => /* @__PURE__ */ t("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { marginTop: 8 }, children: B(o.agent) }),
        /* @__PURE__ */ e(Te, { f: o, onEvidence: r })
      ] }, o.agent + o.id))
    ] }),
    s.dscr && /* @__PURE__ */ e(hn, { m: s.dscr }),
    s.policy && /* @__PURE__ */ e(pn, { m: s.policy }),
    s.ratios && /* @__PURE__ */ e(un, { periods: s.ratios })
  ] });
}
function bn({ id: n, r: s, open: r, onToggle: a, onEvidence: i }) {
  var m, o;
  const c = ["high", "medium", "low"].map((h) => [h, s.findings.filter((p) => p.severity === h).length]);
  return /* @__PURE__ */ t("div", { className: "sme-card", id: `agent-${n}`, children: [
    /* @__PURE__ */ t("button", { type: "button", className: `sme-acc-head ${r ? "open" : ""}`, onClick: a, "aria-expanded": r, children: [
      /* @__PURE__ */ e(He, { size: 16, className: "chev" }),
      /* @__PURE__ */ t("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ t("div", { className: "sme-between", children: [
          /* @__PURE__ */ e("span", { className: "sme-h3", children: B(n) }),
          /* @__PURE__ */ e(_e, { state: te(s) })
        ] }),
        /* @__PURE__ */ t("div", { className: "sme-row sme-small sme-muted", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ t("span", { children: [
            "v",
            s._version,
            " · độ tin cậy ",
            nn[s.confidence] ?? s.confidence,
            " · ",
            D(s._saved_at)
          ] }),
          /* @__PURE__ */ e("span", { className: "sme-sev-counts", children: c.filter(([, h]) => h > 0).map(([h, p]) => /* @__PURE__ */ t(k, { t: K[h].tone, children: [
            p,
            " ",
            K[h].label.toLowerCase()
          ] }, h)) })
        ] })
      ] })
    ] }),
    r && /* @__PURE__ */ t("div", { className: "sme-acc-body sme-stack", children: [
      /* @__PURE__ */ e("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6 }, children: s.summary }),
      s.verification && !s.verification.passed && /* @__PURE__ */ t(Ce, { t: "danger", children: [
        /* @__PURE__ */ e("b", { children: "Lý do bị chặn:" }),
        /* @__PURE__ */ e("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: s.verification.errors.slice(0, 8).map((h, p) => /* @__PURE__ */ e("li", { children: h }, p)) })
      ] }),
      s.findings.length > 0 && /* @__PURE__ */ e("div", { children: rn(s.findings).map((h) => /* @__PURE__ */ e(Te, { f: h, onEvidence: i }, h.id)) }),
      (((m = s.missing_information) == null ? void 0 : m.length) ?? 0) > 0 && /* @__PURE__ */ t("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Còn thiếu" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.missing_information.map((h, p) => /* @__PURE__ */ e("li", { children: h }, p)) })
      ] }),
      (((o = s.open_issues) == null ? void 0 : o.length) ?? 0) > 0 && /* @__PURE__ */ t("div", { children: [
        /* @__PURE__ */ e("div", { className: "sme-section-title", children: "Vấn đề mở" }),
        /* @__PURE__ */ e("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 13 }, children: s.open_issues.map((h, p) => /* @__PURE__ */ e("li", { children: h }, p)) })
      ] })
    ] })
  ] });
}
function vn({ detail: n, openAgent: s, onEvidence: r }) {
  const a = H.filter((o) => n.results[o]), [i, c] = b(() => new Set(s ? [s] : []));
  if (F(() => {
    s && (c((o) => new Set(o).add(s)), requestAnimationFrame(() => {
      var o;
      return (o = document.getElementById(`agent-${s}`)) == null ? void 0 : o.scrollIntoView({ block: "start", behavior: "smooth" });
    }));
  }, [s]), !a.length) return /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(xe, { size: 30 }), title: "Chưa có kết quả", hint: "Chạy thẩm định để các agent ghi kết quả vào hồ sơ." });
  const m = (o) => c((h) => {
    const p = new Set(h);
    return p.has(o) ? p.delete(o) : p.add(o), p;
  });
  return /* @__PURE__ */ t("div", { className: "sme-stack", children: [
    /* @__PURE__ */ e("div", { className: "sme-row", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ e(z, { onClick: () => c(i.size === a.length ? /* @__PURE__ */ new Set() : new Set(a)), children: i.size === a.length ? "Thu gọn tất cả" : "Mở tất cả" }) }),
    a.map((o) => /* @__PURE__ */ e(bn, { id: o, r: n.results[o], open: i.has(o), onToggle: () => m(o), onEvidence: r }, o))
  ] });
}
function fn({ detail: n, focus: s }) {
  const r = Object.values(n.evidence), [a, i] = b(""), [c, m] = b("all"), [o, h] = b(s);
  F(() => {
    s && (h(s), i(""), m("all"), requestAnimationFrame(() => {
      var d;
      return (d = document.getElementById(`ev-${s}`)) == null ? void 0 : d.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const p = P(() => Array.from(new Set(r.map((d) => d.added_by))), [r]), v = r.filter((d) => (c === "all" || d.added_by === c) && (!a.trim() || `${d.id} ${d.source} ${me(d.value)}`.toLowerCase().includes(a.trim().toLowerCase())));
  return r.length ? /* @__PURE__ */ t("div", { className: "sme-stack", children: [
    /* @__PURE__ */ t("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ t("div", { className: "sme-filters", children: [
        /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === "all" ? "on" : ""}`, onClick: () => m("all"), children: "Tất cả" }),
        p.map((d) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${c === d ? "on" : ""}`, onClick: () => m(d), children: B(d) }, d))
      ] }),
      /* @__PURE__ */ t("label", { className: "sme-search", children: [
        /* @__PURE__ */ e(j, { size: 14, className: "sme-muted" }),
        /* @__PURE__ */ e("input", { value: a, onChange: (d) => i(d.target.value), placeholder: "Tìm mã, nguồn, giá trị" })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "sme-card tight", children: [
      /* @__PURE__ */ t("table", { className: "sme-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ t("tr", { children: [
          /* @__PURE__ */ e("th", { style: { width: 64 }, children: "Mã" }),
          /* @__PURE__ */ e("th", { children: "Nguồn" }),
          /* @__PURE__ */ e("th", { children: "Giá trị" }),
          /* @__PURE__ */ e("th", { style: { width: 150 }, children: "Agent" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: v.map((d) => {
          const x = me(d.value), l = o === d.id;
          return /* @__PURE__ */ t(
            "tr",
            {
              id: `ev-${d.id}`,
              className: `click ${s === d.id ? "focus" : ""}`,
              onClick: () => h(l ? null : d.id),
              children: [
                /* @__PURE__ */ e("td", { className: "sme-mono", children: d.id }),
                /* @__PURE__ */ e("td", { children: d.source }),
                /* @__PURE__ */ t("td", { children: [
                  /* @__PURE__ */ e("span", { className: "sme-mono", style: { wordBreak: "break-word" }, children: x.length > 90 && !l ? x.slice(0, 88) + "…" : l ? "" : x }),
                  l && /* @__PURE__ */ e("pre", { className: "sme-pre", children: x })
                ] }),
                /* @__PURE__ */ t("td", { className: "sme-muted sme-small", children: [
                  B(d.added_by),
                  /* @__PURE__ */ e("div", { children: D(d.added_at) })
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
function xn({ detail: n, focus: s, onDecide: r, onEvidence: a }) {
  const [i, c] = b("open"), [m, o] = b({}), [h, p] = b(null);
  F(() => {
    s && (c("all"), requestAnimationFrame(() => {
      var l;
      return (l = document.getElementById(`rv-${s}`)) == null ? void 0 : l.scrollIntoView({ block: "center", behavior: "smooth" });
    }));
  }, [s]);
  const v = n.review.filter((l) => l.status === "open").length, d = n.review.filter((l) => i === "all" || i === "open" == (l.status === "open")), x = async (l, y) => {
    p(l + y);
    try {
      await r(l, y, m[l] ?? "") && o((_) => ({ ..._, [l]: "" }));
    } finally {
      p(null);
    }
  };
  return n.review.length ? /* @__PURE__ */ t("div", { className: "sme-stack", children: [
    /* @__PURE__ */ t("div", { className: "sme-between sme-wrap", children: [
      /* @__PURE__ */ e("div", { className: "sme-filters", children: [["open", `Chờ xử lý (${v})`], ["done", `Đã xử lý (${n.review.length - v})`], ["all", "Tất cả"]].map(([l, y]) => /* @__PURE__ */ e("button", { type: "button", className: `sme-filter ${i === l ? "on" : ""}`, onClick: () => c(l), children: y }, l)) }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: "Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát." })
    ] }),
    d.length === 0 && /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(de, { size: 30 }), title: i === "open" ? "Đã xử lý hết các mục" : "Không có mục nào" }),
    d.map((l) => {
      const y = ne[l.reason_code] ?? { label: l.reason_code, tone: "muted" }, _ = we[l.status] ?? { label: l.status, tone: "muted" }, A = m[l.id] ?? "";
      return /* @__PURE__ */ t(
        "div",
        {
          id: `rv-${l.id}`,
          className: `sme-card sme-review ${T(y.tone)}`,
          style: s === l.id ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)" } : void 0,
          children: [
            /* @__PURE__ */ t("div", { className: "sme-between", children: [
              /* @__PURE__ */ t("span", { className: "sme-row", children: [
                /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: l.id }),
                /* @__PURE__ */ e(k, { t: y.tone, children: y.label })
              ] }),
              /* @__PURE__ */ e(k, { t: _.tone, children: _.label })
            ] }),
            /* @__PURE__ */ e("p", { style: { margin: "10px 0 6px", fontSize: 13.5, lineHeight: 1.55 }, children: l.detail }),
            /* @__PURE__ */ t("div", { className: "sme-small sme-muted", children: [
              B(l.source_agent),
              " · ",
              D(l.created_at),
              /* @__PURE__ */ e(Se, { refs: l.evidence_refs, onOpen: a })
            ] }),
            l.status === "open" ? /* @__PURE__ */ t("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ e(
                "textarea",
                {
                  className: "sme-textarea",
                  value: A,
                  placeholder: "Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…",
                  onChange: (g) => o({ ...m, [l.id]: g.target.value })
                }
              ),
              /* @__PURE__ */ t("div", { className: "sme-row", style: { marginTop: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ e(z, { disabled: !A.trim(), busy: h === l.id + "needs_info", onClick: () => x(l.id, "needs_info"), children: "Yêu cầu bổ sung" }),
                /* @__PURE__ */ e(z, { primary: !0, disabled: !A.trim(), busy: h === l.id + "confirmed", onClick: () => x(l.id, "confirmed"), children: "Xác nhận" })
              ] })
            ] }) : /* @__PURE__ */ t("div", { className: `sme-decision ${T(_.tone)}`, children: [
              /* @__PURE__ */ e("b", { children: _.label }),
              " bởi ",
              l.decided_by,
              " · ",
              D(l.decided_at),
              /* @__PURE__ */ e("div", { style: { marginTop: 2 }, children: l.note })
            ] })
          ]
        },
        l.id
      );
    })
  ] }) : /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(de, { size: 30 }), title: "Không có mục cần rà soát" });
}
function yn({ detail: n }) {
  if (!n.audit.length) return /* @__PURE__ */ e(L, { icon: /* @__PURE__ */ e(je, { size: 30 }), title: "Chưa có nhật ký" });
  const s = (a) => a.action === "verification" ? a.passed ? "ok" : "danger" : a.action === "review_decide" ? "accent" : a.action === "review_add" ? "warn" : "muted", r = (a) => {
    var c, m;
    const i = a.agent ? B(a.agent) : a.actor ?? "";
    switch (a.action) {
      case "result_put":
        return `${i} lưu kết quả v${a.version}${a.rerun_reason ? ` (chạy lại: ${a.rerun_reason})` : ""}`;
      case "verification":
        return `${i} v${a.version}: ${a.passed ? "đạt kiểm chứng" : "bị chặn"}`;
      case "evidence_add":
        return `${i} thêm ${(a.ids ?? []).join(", ")}`;
      case "review_add":
        return `${i} thêm ${a.id} (${((c = ne[a.reason_code]) == null ? void 0 : c.label) ?? a.reason_code})`;
      case "review_decide":
        return `${a.actor} ${((m = we[a.status]) == null ? void 0 : m.label.toLowerCase()) ?? a.status} ${a.id}`;
      case "case_create":
        return `Luồng ${a.flow}, ${a.documents} chứng từ`;
      default:
        return i;
    }
  };
  return /* @__PURE__ */ e("div", { className: "sme-card", children: /* @__PURE__ */ e("div", { className: "sme-tl", children: [...n.audit].reverse().map((a, i) => /* @__PURE__ */ t("div", { className: `sme-tl-item ${T(s(a))}`, children: [
    /* @__PURE__ */ t("div", { className: "sme-between", children: [
      /* @__PURE__ */ e("span", { className: "sme-strong", style: { fontSize: 13 }, children: tn[a.action] ?? a.action }),
      /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: D(a.ts) })
    ] }),
    /* @__PURE__ */ e("div", { className: "sme-small sme-muted", children: r(a) })
  ] }, i)) }) });
}
function wn({ detail: n, flow: s, onAgent: r }) {
  return /* @__PURE__ */ e("div", { className: "sme-card tight", children: /* @__PURE__ */ e("div", { className: "sme-steps", children: ye.map((a) => /* @__PURE__ */ t("div", { className: "sme-phase", children: [
    /* @__PURE__ */ e("span", { className: "sme-phase-name", children: a.name }),
    a.agents.map((i) => {
      const c = i === "industry" && s !== "B" && !n.results[i], m = c ? "none" : te(n.results[i]);
      return /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          className: `sme-node ${T(R[m].tone)} ${c || m === "none" ? "skip" : ""}`,
          disabled: c || m === "none",
          title: c ? "Chỉ chạy ở luồng B" : R[m].label,
          onClick: () => r(i),
          children: [
            /* @__PURE__ */ e("span", { className: "dot", children: /* @__PURE__ */ e(ke, { state: m, size: 12 }) }),
            /* @__PURE__ */ t("span", { children: [
              B(i),
              c ? " (luồng B)" : ""
            ] })
          ]
        },
        i
      );
    })
  ] }, a.name)) }) });
}
function Q({ label: n, children: s }) {
  return /* @__PURE__ */ t("div", { className: "sme-between sme-small", style: { padding: "5px 0" }, children: [
    /* @__PURE__ */ e("span", { className: "sme-muted", children: n }),
    /* @__PURE__ */ e("span", { style: { textAlign: "right" }, children: s })
  ] });
}
function Nn({ caseId: n, onBack: s }) {
  var se, ae, ie, re, le;
  const r = ue(), { openChat: a } = ge(), [i, c] = b(null), [m, o] = b(null), [h, p] = b(!1), [v, d] = b("overview"), [x, l] = b(null), [y, _] = b(null), [A, g] = b(null), f = pe(async () => {
    p(!0);
    try {
      c(await r.get(`${J}/cases/${n}`)), o(null);
    } catch (u) {
      o(ee(u));
    } finally {
      p(!1);
    }
  }, [r, n]);
  F(() => {
    f();
  }, [f]);
  const w = P(() => i ? ln(i) : {}, [i]), $ = (i == null ? void 0 : i.review.filter((u) => u.status === "open")) ?? [], G = (se = w.policy) == null ? void 0 : se.rows.filter((u) => u.status === "not_met").length, U = ((ie = (ae = w.dscr) == null ? void 0 : ae.scenarios.find((u) => u.stress_pct === 0)) == null ? void 0 : ie.dscr) ?? null, Y = (u) => {
    l(u), d("evidence");
  }, $e = (u) => {
    _(u), d("review");
  }, ze = (u) => {
    g(u), d("agents");
  }, Ae = async (u, I, De) => {
    try {
      return await r.post(`${J}/cases/${n}/review/${u}`, { status: I, note: De }), await f(), !0;
    } catch (Me) {
      return o(ee(Me)), !1;
    }
  }, Ee = () => a({
    agent: Z,
    autoSend: !1,
    message: `Chạy thẩm định hồ sơ ${n}, luồng ${(i == null ? void 0 : i.case.flow) ?? "A"}.`
  }), Be = () => a({
    agent: Z,
    autoSend: !1,
    message: `Giải thích kết quả thẩm định hồ sơ ${n}: `
  }), N = i == null ? void 0 : i.case, M = (N == null ? void 0 : N.customer) ?? {}, S = (N == null ? void 0 : N.request) ?? {}, Le = [
    { key: "overview", label: "Tổng quan" },
    { key: "agents", label: "Kết quả agent", count: i ? Object.keys(i.results).length : void 0 },
    { key: "evidence", label: "Bằng chứng", count: i ? Object.keys(i.evidence).length : void 0 },
    { key: "review", label: "Rà soát", count: $.length || void 0 },
    { key: "audit", label: "Audit" }
  ];
  return /* @__PURE__ */ t("div", { className: "sme-scroll", style: { paddingTop: 16 }, children: [
    /* @__PURE__ */ t("div", { className: "sme-hero", children: [
      /* @__PURE__ */ t("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ t("button", { type: "button", className: "sme-back", onClick: s, children: [
          /* @__PURE__ */ e(We, { size: 14 }),
          " Tất cả hồ sơ"
        ] }),
        /* @__PURE__ */ e("h1", { className: "sme-title", children: String(M.name ?? n) }),
        /* @__PURE__ */ t("div", { className: "sme-row sme-wrap", style: { gap: 6 }, children: [
          /* @__PURE__ */ e("span", { className: "sme-chip sme-mono", children: n }),
          N && /* @__PURE__ */ t("span", { className: "sme-chip", children: [
            "Luồng ",
            N.flow
          ] }),
          M.industry_code && /* @__PURE__ */ t("span", { className: "sme-chip", children: [
            "Ngành ",
            String(M.industry_code)
          ] }),
          S.purpose && /* @__PURE__ */ e("span", { className: "sme-chip", children: Ne[S.purpose] ?? S.purpose }),
          N && /* @__PURE__ */ t("span", { className: "sme-small sme-muted", children: [
            "Tạo ",
            D(N.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "sme-row", children: [
        /* @__PURE__ */ e(z, { onClick: f, busy: h, title: "Tải lại dữ liệu", children: /* @__PURE__ */ e(ve, { size: 14 }) }),
        /* @__PURE__ */ t(z, { onClick: Be, children: [
          /* @__PURE__ */ e(Ge, { size: 14 }),
          " Hỏi trợ lý"
        ] }),
        /* @__PURE__ */ t(z, { primary: !0, onClick: Ee, children: [
          /* @__PURE__ */ e(Ue, { size: 14 }),
          " Chạy thẩm định"
        ] })
      ] })
    ] }),
    m && /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(be, { title: "Có lỗi khi làm việc với hồ sơ", children: m }) }),
    !i && !m && /* @__PURE__ */ t("div", { className: "sme-card sme-stack", children: [
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "50%" } }),
      /* @__PURE__ */ e("div", { className: "sme-skel" }),
      /* @__PURE__ */ e("div", { className: "sme-skel", style: { width: "70%" } })
    ] }),
    i && N && /* @__PURE__ */ t(he, { children: [
      /* @__PURE__ */ t("div", { className: "sme-kpis", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ e(
          E,
          {
            icon: /* @__PURE__ */ e(Ye, { size: 18 }),
            label: "Số tiền đề nghị",
            value: sn(S.amount).replace(" đ", ""),
            hint: [S.term_months ? `${S.term_months} tháng` : null, S.annual_rate_pct ? `lãi ${C(S.annual_rate_pct)}%/năm` : null].filter(Boolean).join(" · ") || "VND"
          }
        ),
        /* @__PURE__ */ e(
          E,
          {
            t: U == null ? "muted" : ((re = w.dscr) == null ? void 0 : re.threshold) !== void 0 && U < w.dscr.threshold ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Xe, { size: 18 }),
            label: "DSCR cơ sở",
            value: C(U),
            hint: ((le = w.dscr) == null ? void 0 : le.threshold) !== void 0 ? `Ngưỡng ≥ ${C(w.dscr.threshold)}` : "Chưa có phân tích"
          }
        ),
        /* @__PURE__ */ e(
          E,
          {
            t: G == null ? "muted" : G > 0 ? "danger" : "ok",
            icon: /* @__PURE__ */ e(Qe, { size: 18 }),
            label: "Điều kiện không đạt",
            value: G ?? "—",
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
            hint: `${i.review.length} mục tổng cộng`
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ e(wn, { detail: i, flow: N.flow, onAgent: ze }) }),
      /* @__PURE__ */ t("div", { className: "sme-detail", children: [
        /* @__PURE__ */ t("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ e("div", { className: "sme-tabs", role: "tablist", children: Le.map((u) => /* @__PURE__ */ t(
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
          v === "overview" && /* @__PURE__ */ e(gn, { detail: i, m: w, onEvidence: Y, goAgents: () => d("agents") }),
          v === "agents" && /* @__PURE__ */ e(vn, { detail: i, openAgent: A, onEvidence: Y }),
          v === "evidence" && /* @__PURE__ */ e(fn, { detail: i, focus: x }),
          v === "review" && /* @__PURE__ */ e(xn, { detail: i, focus: y, onDecide: Ae, onEvidence: Y }),
          v === "audit" && /* @__PURE__ */ e(yn, { detail: i })
        ] }),
        /* @__PURE__ */ t("aside", { className: "sme-aside", children: [
          /* @__PURE__ */ t("div", { className: "sme-card", children: [
            /* @__PURE__ */ t("div", { className: "sme-between", style: { marginBottom: 4 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Cần xử lý" }),
              /* @__PURE__ */ e(k, { t: $.length ? "warn" : "ok", children: $.length })
            ] }),
            $.length === 0 && /* @__PURE__ */ e("div", { className: "sme-small sme-muted", style: { padding: "8px 0" }, children: "Không còn mục chờ rà soát." }),
            $.slice(0, 6).map((u) => {
              const I = ne[u.reason_code] ?? { label: u.reason_code, tone: "muted" };
              return /* @__PURE__ */ t("button", { type: "button", className: "sme-todo", onClick: () => $e(u.id), children: [
                /* @__PURE__ */ e(k, { t: I.tone, children: u.id }),
                /* @__PURE__ */ t("span", { className: "sme-todo-text", children: [
                  /* @__PURE__ */ t("b", { children: [
                    I.label,
                    "."
                  ] }),
                  " ",
                  u.detail
                ] })
              ] }, u.id);
            }),
            $.length > 6 && /* @__PURE__ */ t("button", { type: "button", className: "sme-ref", style: { marginTop: 6 }, onClick: () => d("review"), children: [
              "Xem thêm ",
              $.length - 6,
              " mục"
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "sme-card", children: [
            /* @__PURE__ */ e("h3", { className: "sme-h3", style: { marginBottom: 6 }, children: "Khách hàng" }),
            /* @__PURE__ */ e(Q, { label: "CIF", children: String(M.cif ?? "—") }),
            /* @__PURE__ */ e(Q, { label: "Mã số thuế", children: String(M.tax_id ?? "—") }),
            /* @__PURE__ */ e(Q, { label: "Số năm hoạt động", children: M.years_in_operation ?? "—" }),
            S.proposal && /* @__PURE__ */ t("div", { className: "sme-small", style: { marginTop: 8 }, children: [
              /* @__PURE__ */ e("div", { className: "sme-section-title", style: { marginBottom: 4 }, children: "Đề xuất ĐVKD" }),
              String(S.proposal)
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "sme-card", children: [
            /* @__PURE__ */ t("div", { className: "sme-between", style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ e("h3", { className: "sme-h3", children: "Chứng từ" }),
              /* @__PURE__ */ e("span", { className: "sme-small sme-muted", children: N.documents.length })
            ] }),
            N.documents.map((u) => /* @__PURE__ */ t("div", { className: "sme-row sme-small", style: { padding: "5px 0" }, children: [
              /* @__PURE__ */ e(Je, { size: 14, className: "sme-muted" }),
              /* @__PURE__ */ e("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, children: u.name }),
              /* @__PURE__ */ e("span", { className: "sme-mono sme-muted", children: u.id })
            ] }, u.id))
          ] }),
          i.audit.length > 0 && /* @__PURE__ */ t("div", { className: "sme-small sme-muted sme-row", style: { padding: "0 4px" }, children: [
            /* @__PURE__ */ e(Ze, { size: 13 }),
            " Hoạt động gần nhất ",
            D(i.audit[i.audit.length - 1].ts)
          ] })
        ] })
      ] })
    ] })
  ] });
}
const kn = `
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
function _n() {
  const n = "sme-lending-css";
  if (typeof document > "u" || document.getElementById(n)) return;
  const s = document.createElement("style");
  s.id = n, s.textContent = kn, document.head.appendChild(s);
}
_n();
function An() {
  const [n, s] = b(null);
  return /* @__PURE__ */ e("div", { className: "sme", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }, children: n ? /* @__PURE__ */ e(Nn, { caseId: n, onBack: () => s(null) }) : /* @__PURE__ */ e(mn, { onOpen: s }) });
}
export {
  An as default
};
