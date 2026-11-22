export const API = '/apps/sme-lending/api'

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'muted' | 'accent'
export type AgentState = 'passed' | 'blocked' | 'unverified'

export type Finding = { id: string; topic: string; statement: string; severity: string; evidence_refs: string[] }
export type Verification = { passed: boolean; errors: string[]; version?: number; checked_at?: string } | null
export type Calculation = { kind: string; inputs: Record<string, any>; outputs: Record<string, any> }
export type AgentResult = {
  agent: string; summary: string; findings: Finding[]; missing_information?: string[]; open_issues?: string[]
  calculations?: Calculation[]; confidence: string; _version: number; _saved_at: string; verification: Verification
}
export type ReviewItem = {
  id: string; reason_code: string; detail: string; source_agent: string; evidence_refs: string[]
  status: string; created_at: string; note?: string; decided_by?: string; decided_at?: string
}
export type Evidence = { id: string; source: string; value: unknown; added_by: string; added_at: string; [k: string]: unknown }
export type CaseSummary = {
  case_id: string; created_at: string; updated_at?: string; flow: string; customer_name?: string; industry_code?: string
  amount?: number; term_months?: number; purpose?: string; agents: Record<string, AgentState>; high_findings: number
  agents_done: number; agents_passed: number; agents_blocked: number; review_open: number
}
export type CaseDetail = {
  case: {
    case_id: string; flow: string; created_at: string; customer: Record<string, any>
    request: Record<string, any>; documents: { id: string; name: string; type?: string }[]
  }
  results: Record<string, AgentResult>
  evidence: Record<string, Evidence>
  review: ReviewItem[]
  audit: { ts: string; action: string; [k: string]: unknown }[]
}

// Workflow phases, in the order sme-credit-assessment runs them.
export const PHASES: { name: string; agents: string[] }[] = [
  { name: 'Chứng từ', agents: ['document-evidence'] },
  { name: 'Sản phẩm', agents: ['product-match'] },
  { name: 'Chuyên môn', agents: ['financial-analysis', 'risk-compliance', 'collateral', 'industry'] },
  { name: 'Chính sách', agents: ['policy-exception'] },
  { name: 'Tổng hợp', agents: ['consolidation'] },
]
export const AGENT_ORDER = PHASES.flatMap((p) => p.agents)
export const AGENT_LABEL: Record<string, string> = {
  'document-evidence': 'Chứng từ & bằng chứng',
  'product-match': 'Nhận diện sản phẩm',
  'financial-analysis': 'Phân tích tài chính',
  'risk-compliance': 'Rủi ro & tuân thủ',
  collateral: 'Tài sản bảo đảm',
  industry: 'Ngành & cạnh tranh',
  'policy-exception': 'Chính sách & ngoại lệ',
  consolidation: 'Tổng hợp tờ trình',
}
export const agentLabel = (id: string) => AGENT_LABEL[id] ?? id

export const STATE_META: Record<AgentState | 'none', { label: string; tone: Tone }> = {
  passed: { label: 'Đã kiểm chứng', tone: 'ok' },
  blocked: { label: 'Bị chặn', tone: 'danger' },
  unverified: { label: 'Chưa kiểm chứng', tone: 'warn' },
  none: { label: 'Chưa chạy', tone: 'muted' },
}
export const SEVERITY: Record<string, { label: string; tone: Tone; rank: number }> = {
  high: { label: 'Cao', tone: 'danger', rank: 0 },
  medium: { label: 'Trung bình', tone: 'warn', rank: 1 },
  low: { label: 'Thấp', tone: 'info', rank: 2 },
  info: { label: 'Thông tin', tone: 'muted', rank: 3 },
}
export const CONFIDENCE: Record<string, string> = { high: 'cao', medium: 'trung bình', low: 'thấp' }
export const REASON: Record<string, { label: string; tone: Tone }> = {
  missing_document: { label: 'Thiếu chứng từ', tone: 'warn' },
  data_conflict: { label: 'Dữ liệu mâu thuẫn', tone: 'danger' },
  rule_fail: { label: 'Không đạt điều kiện', tone: 'danger' },
  low_confidence: { label: 'Độ tin cậy thấp', tone: 'info' },
  exception_needed: { label: 'Cần ngoại lệ', tone: 'danger' },
  expert_review: { label: 'Cần chuyên gia', tone: 'info' },
  system_error: { label: 'Lỗi hệ thống', tone: 'muted' },
}
export const REVIEW_STATUS: Record<string, { label: string; tone: Tone }> = {
  open: { label: 'Chờ xử lý', tone: 'warn' },
  confirmed: { label: 'Đã xác nhận', tone: 'ok' },
  needs_info: { label: 'Yêu cầu bổ sung', tone: 'info' },
}
export const AUDIT_LABEL: Record<string, string> = {
  case_create: 'Tạo hồ sơ',
  evidence_add: 'Thêm bằng chứng',
  result_put: 'Lưu kết quả',
  verification: 'Kiểm chứng',
  review_add: 'Thêm mục rà soát',
  review_decide: 'Cán bộ quyết định',
}
export const PURPOSE: Record<string, string> = {
  working_capital: 'Vốn lưu động', fixed_asset: 'Đầu tư TSCĐ', expansion: 'Mở rộng', trade_finance: 'Tài trợ thương mại',
}

const nf = new Intl.NumberFormat('vi-VN')
export const money = (v: unknown) => (typeof v === 'number' ? nf.format(v) + ' đ' : '—')
export const moneyShort = (v: unknown) => {
  if (typeof v !== 'number') return '—'
  if (Math.abs(v) >= 1e9) return nf.format(Math.round(v / 1e7) / 100) + ' tỷ'
  if (Math.abs(v) >= 1e6) return nf.format(Math.round(v / 1e4) / 100) + ' triệu'
  return nf.format(v) + ' đ'
}
export const num = (v: unknown, digits = 2) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN', { maximumFractionDigits: digits }) : '—'
export const pct = (v: unknown) =>
  typeof v === 'number' ? (v * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%' : '—'
export const when = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—')
export const ago = (iso?: string) => {
  if (!iso) return '—'
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'vừa xong'
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`
  return `${Math.floor(s / 86400)} ngày trước`
}
export const text = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2))
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e))

export const sortFindings = (f: Finding[]) =>
  [...f].sort((a, b) => (SEVERITY[a.severity]?.rank ?? 9) - (SEVERITY[b.severity]?.rank ?? 9))

export function agentState(r?: AgentResult): AgentState | 'none' {
  if (!r) return 'none'
  if (!r.verification) return 'unverified'
  return r.verification.passed ? 'passed' : 'blocked'
}

function calc(detail: CaseDetail, agent: string, kind: string): Calculation | undefined {
  return detail.results[agent]?.calculations?.find((c) => c.kind === kind)
}

export type PolicyRow = { id: string; fact: string; op: string; threshold: unknown; actual?: unknown; status: string; clause?: string }
export type Metrics = {
  dscr?: { scenarios: { stress_pct: number; dscr: number | null }[]; threshold?: number; debtService?: number; cash?: number }
  ltv?: { ltv: number | null; cap: number | null; eligible?: number }
  policy?: { version?: string; product?: string; rows: PolicyRow[] }
  ratios?: { period: string; ratios: Record<string, number | null> }[]
  genform?: Record<string, unknown>
}

/** What the overview shows, read from the calculations the agents reported. */
export function metrics(detail: CaseDetail): Metrics {
  const m: Metrics = {}
  const policy = calc(detail, 'policy-exception', 'policy_check') ?? calc(detail, 'risk-compliance', 'policy_check')
  if (policy?.outputs?.matrix) {
    m.policy = { version: policy.outputs.policy_version, product: policy.outputs.product_code, rows: policy.outputs.matrix }
  }
  const rc = calc(detail, 'financial-analysis', 'repayment_capacity')
  if (rc?.outputs?.scenarios) {
    const dscrRow = m.policy?.rows.find((r) => r.fact === 'dscr')
    m.dscr = {
      scenarios: rc.outputs.scenarios,
      threshold: typeof dscrRow?.threshold === 'number' ? dscrRow.threshold : undefined,
      debtService: rc.outputs.total_debt_service_annual,
      cash: rc.inputs?.cash_available_annual,
    }
  }
  const col = calc(detail, 'collateral', 'collateral_ltv')
  if (col?.outputs) m.ltv = { ltv: col.outputs.ltv_pct ?? null, cap: col.outputs.max_ltv_pct ?? null, eligible: col.outputs.eligible_value }
  const fr = calc(detail, 'financial-analysis', 'fin_ratios')
  if (fr?.outputs?.periods) m.ratios = fr.outputs.periods
  const gf = calc(detail, 'consolidation', 'genform')
  if (gf?.outputs) m.genform = gf.outputs
  return m
}

export const RATIO_LABEL: Record<string, { label: string; fmt: (v: unknown) => string }> = {
  gross_margin: { label: 'Biên lợi nhuận gộp', fmt: pct },
  net_margin: { label: 'Biên lợi nhuận ròng', fmt: pct },
  ebitda_margin: { label: 'Biên EBITDA', fmt: pct },
  current_ratio: { label: 'Thanh toán hiện hành', fmt: (v) => num(v) },
  debt_to_equity: { label: 'Nợ vay / Vốn chủ', fmt: (v) => num(v) },
  liabilities_to_assets: { label: 'Nợ phải trả / Tài sản', fmt: pct },
  roa: { label: 'ROA', fmt: pct },
  roe: { label: 'ROE', fmt: pct },
  interest_coverage: { label: 'Khả năng trả lãi', fmt: (v) => num(v, 1) + (typeof v === 'number' ? ' lần' : '') },
  receivable_days: { label: 'Số ngày phải thu', fmt: (v) => num(v, 0) },
  inventory_days: { label: 'Số ngày tồn kho', fmt: (v) => num(v, 0) },
}
export const FACT_LABEL: Record<string, string> = {
  years_in_operation: 'Số năm hoạt động', loan_amount: 'Số tiền vay', term_months: 'Kỳ hạn (tháng)', dscr: 'DSCR',
  cic_debt_group: 'Nhóm nợ CIC', ltv_pct: 'LTV (%)', equity_contribution_pct: 'Vốn tự có (%)',
}
export const POLICY_STATUS: Record<string, { label: string; tone: Tone }> = {
  met: { label: 'Đạt', tone: 'ok' }, not_met: { label: 'Không đạt', tone: 'danger' },
  missing: { label: 'Thiếu dữ liệu', tone: 'warn' }, na: { label: 'Không áp dụng', tone: 'muted' },
}
