export const API = '/apps/sme-connect/api'
export const COPILOT_AGENT = 'smec-copilot'
export const CHAT_PREFIX = 'sme-connect-chat-'

export type SmecProductCatalog = {
  code: string
  core_product_code: string
  name: string
  short_name: string
  purpose: string
  requires_collateral: boolean
  max_limit_vnd: number
  default_term_months: number
  highlights: string
  commitments: string[]
  eligible?: boolean
  match_score?: number
  suggested_limit?: number
}

export type AgentGroupSpec = {
  id: string
  label: string
  description: string
  agents: string[]
}

export type NclosImportable = {
  nclos_id: string
  elos_id: string
  dkkd_no: string
  cif: string
  company_name: string
  requested_total: number
  documents_count: number
  proposed_products: Array<{ code: string; proposed_limit: number; match_score: number }>
}

export type Catalog = {
  smec_products: SmecProductCatalog[]
  documents: { version: string; types: Record<string, { label: string; group?: string }> }
  agent_groups: AgentGroupSpec[]
  list_statuses: Record<string, { label: string; tone: string }>
  detail_statuses: Record<string, { label: string; tone: string; list_status: string }>
  nclos_importable: NclosImportable[]
  form_code: string
}

export type ProposedProduct = {
  code: string
  core_product_code: string
  name: string
  requires_collateral: boolean
  match_score: number
  proposed_limit: number
  term_months: number
  commitments_checked: boolean
}

export type SellerInfo = {
  user_id?: string
  full_name?: string
  dao_code?: string
  branch_code?: string
  branch_name?: string
  is_badbranch?: boolean
}

export type CaseSummary = {
  case_id: string
  smec_id: string
  nclos_id?: string | null
  elos_id?: string | null
  created_at: string
  updated_at: string
  flow: string
  list_status: string
  list_status_label: string
  detail_status: string
  detail_status_label: string
  status_tone: string
  wizard_step: number
  customer_name: string
  tax_id: string
  cif: string
  total_proposed_limit: number
  proposed_products: ProposedProduct[]
  documents_count: number
  seller: SellerInfo
  b2b_confirmed: boolean
  cancel_reason?: string
  reject_reason?: string
}

export type OcrSource = {
  kind?: string
  doc_id?: string | null
  doc_name?: string
  page?: number
  bbox?: [number, number, number, number]
  snippet?: string
  cell?: string
  note?: string
}

export type OcrField = {
  path: string
  label: string
  value: unknown
  confidence_tier: 'trusted' | 'needs_confirm' | 'missing'
  raw_tier: string
  readonly: boolean
  confirmed: boolean
  confirmed_by?: string | null
  confirmed_at?: string | null
  conflict_note?: string
  source?: OcrSource | null
}

export type OcrCategory = {
  id: string
  code: string
  title: string
  subtitle: string
  requires_collateral: boolean
  counts: { total: number; trusted: number; needs_confirm: number; missing: number }
  fields: OcrField[]
  tables: Record<string, Array<Record<string, unknown>>>
}

export type PavvB4Summary = {
  source_file: string
  readonly_locked: boolean
  values: Record<string, number>
  rows: Array<{ code: string; key: string; section: string; label: string; value: number; unit: string; cell: string }>
  computed_checks: {
    recomputed_wc_turnover: number
    recomputed_wc_need: number
    recomputed_max_vpb_limit: number
    effective_dscr: number
    annual_new_interest: number
    formula_passed: boolean
    warnings: string[]
  }
}

export type FullCase = {
  case: {
    case_id: string
    created_at: string
    flow: string
    customer: Record<string, unknown>
    request: Record<string, unknown>
    facts?: Record<string, unknown>
    documents: Array<{ id: string; name: string; type: string; issued_date?: string; size?: number; summary?: string }>
    smec: {
      smec_id: string
      nclos_id?: string | null
      elos_id?: string | null
      list_status: string
      detail_status: string
      wizard_step: number
      updated_at: string
      seller: SellerInfo
      proposed_products: ProposedProduct[]
      selected_agent_groups: string[]
      b2b_confirmed?: boolean
      b2b_requested_at?: string | null
      cancel_reason?: string
      reject_reason?: string
      offline_reason?: string
    }
    status_meta: {
      list_status: string
      list_status_label: string
      detail_status: string
      detail_status_label: string
      tone: string
    }
  }
  ocr: {
    has_collateral: boolean
    hidden_categories: string[]
    pavv_b4_loaded: boolean
    pavv_b4_summary?: PavvB4Summary | null
    summary: { total: number; trusted: number; needs_confirm: number; missing: number }
    categories: OcrCategory[]
  }
  checklist: {
    overall_status: string
    counts: Record<string, number>
    groups: Array<{
      group: string
      label: string
      status: string
      counts: Record<string, number>
      total_applicable: number
    }>
    items: Array<{
      code: string
      key: string
      group: string
      title: string
      owner_role?: string
      condition_label?: string
      rule_label?: string
      applicable?: boolean
      rule_status: string
      document_refs?: string[]
      fail_reasons?: string[]
    }>
  }
  crosschecks: {
    overall_status: string
    rules: Array<{ id: string; code: string; title: string; status: string; detail: string }>
  }
  evaluation?: {
    evaluated_at: string
    evaluated_by: string
    selected_groups: string[]
    agents_total: number
    agents_completed: number
    product_readiness: Array<{ code: string; name: string; proposed_limit: number; match_score: number; readiness: string; tone: string }>
    sections: {
      financial: {
        enabled: boolean
        score: number
        rating: string
        summary: string
        metrics: Array<{ label: string; value: string; trend: string }>
        accounting_checks: Array<{ rule: string; status: string }>
        traceability: Array<{ ref: string; source: string; detail: string }>
      }
      industry: {
        enabled: boolean
        sector_name: string
        swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }
        traceability: Array<{ ref: string; source: string; detail: string }>
      }
      risk: {
        enabled: boolean
        summary: string
        mode: string
        badbranch: { branch_code: string; dao_code: string; is_badbranch: boolean; groups: Array<{ group: string; flagged: boolean }> }
        internal_watchlists: Array<{ code: string; label: string; status: string; detail: string }>
        kssv_post_loan: { status: string; active_sanctions: number; summary: string }
        cic_subjects: Array<{
          role: string; name: string; id_no: string; vpb_loan: number; other_loan: number;
          vpb_card: number; other_card: number; cic_group: number; history_24m: string
        }>
        traceability: Array<{ ref: string; source: string; detail: string }>
      }
      collateral: {
        enabled: boolean
        has_collateral: boolean
        summary: string
        ltv_pct?: number | null
        assets: Array<Record<string, unknown>>
        guarantors: Array<Record<string, unknown>>
        traceability: Array<{ ref: string; source: string; detail: string }>
      }
    }
  } | null
  proposal?: {
    form_code: string
    current_version: number
    generated_at: string
    generated_by: string
    active_file: string
    qr_meta: { sha256: string; qr_payload: string; qr_svg: string; version: number }
    system_fields: Record<string, string>
    active_fields: Record<string, string>
    diffs: Array<{ key: string; label: string; system_value: string; cbbh_value: string; confirmed: boolean; confirmed_by?: string | null }>
    all_diffs_confirmed: boolean
  } | null
  resolution: {
    resolution_no?: string
    resolution_doc?: { id: string; name: string; issued_date?: string } | null
    issued_at?: string
    cpc_officer?: string
    conditions_summary?: string
    accepted: boolean
    accepted_by?: string
    accepted_at?: string
    comments: Array<{ id: string; role: 'CPC' | 'CBBH'; author: string; message: string; created_at: string }>
    drafting_info: Record<string, unknown>
  }
  results: Record<string, { summary: string; confidence: string; _version?: number; verification?: { passed: boolean } }>
  evidence: Record<string, { id: string; source: string; field?: string; value: unknown; document_id?: string; page?: number }>
  review: Array<{ id: string; reason_code: string; detail: string; status: string }>
  audit: Array<{ ts: string; action: string; [k: string]: unknown }>
}

export async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function downloadBase64File(name: string, mime: string, contentB64: string): void {
  const raw = atob(contentB64)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  const blob = new Blob([bytes], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
