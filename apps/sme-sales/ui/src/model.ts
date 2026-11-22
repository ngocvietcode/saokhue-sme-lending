import { PURPOSE, day, money, moneyShort, num, type Tone } from '@sme-ui/format'
export * from '@sme-ui/format'

export const API = '/apps/sme-sales/api'

export type Stage = 'draft' | 'collecting' | 'ready' | 'submitted'
export type ItemStatus = 'open' | 'requested' | 'waived' | 'resolved' | 'ok'

export type CheckItem = {
  key: string; kind: string; group: string; title: string; ok: boolean; blocking: boolean
  reason: string; ask: string; alternatives: string[]; document_refs: string[]; status: ItemStatus
  note?: string; due_date?: string; requested_at?: string; resolved_at?: string; updated_by?: string
}
export type PolicyCheckRow = {
  id: string; fact: string; label: string; op: string; threshold: number
  actual?: number | string | null; status: 'met' | 'not_met' | 'missing' | 'na'; clause: string
}
export type ActionKind = 'submit' | 'first_upload' | 'remind' | 'request_docs' | 'fill_info' | 'classify' | 'extract'
  | 'review_proposal' | 'follow_up' | 'advisory' | 'waiting'
export type Action = {
  id: string; kind: ActionKind; tone: Tone; title: string; detail: string[]; keys: string[]
  cta: 'draft' | 'chat' | 'submit' | 'none'; prompt: string
}
export type GroupProgress = { group: string; label: string; done: number; total: number; blocked: number }
export type ProfileField = { path: string; section: string; label: string; value: unknown }
export type Overview = {
  case_id: string; as_of: string; stage: Stage
  readiness: {
    score: number; ready: boolean; blocking_open: string[]; waived: string[]
    actionable_blocking?: string[]; waiting_blocking?: string[]
  }
  items: CheckItem[]; policy_checks?: PolicyCheckRow[]
  actions: Action[]; groups: GroupProgress[]; profile: ProfileField[]
}
export type Doc = {
  id: string; name: string; type?: string; issued_date?: string; file?: string; size?: number
  summary?: string; added_by?: string; added_at?: string; not_stated?: string[]
}
export type DocumentFilePayload = {
  id: string; name: string; mime: string; size: number; content_b64: string
}
export type CaseRec = {
  case_id: string; flow: string; created_at: string
  customer: Record<string, any>; request: Record<string, any>; facts?: Record<string, any>
  documents: Doc[]; submitted?: { by: string; at: string; note: string }
}
export type Today = {
  ready: string[]; overdue: string[]; blocked: string[]; waiting: number; no_documents: string[]
  action_needed?: string[]; waiting_cases?: string[]; attention?: string[]
}
export type DraftChannel = 'email' | 'zalo' | 'phone_script'
export type Draft = {
  id: string; channel: DraftChannel; subject: string; body: string
  requirement_keys: string[]; status: 'draft' | 'sent'; author: string; created_at: string; sent_at?: string
}
export type DossierRow = {
  case_id: string; created_at: string; updated_at?: string; flow: string; customer_name?: string
  tax_id?: string | null; product_code?: string | null
  amount?: number; term_months?: number; purpose?: string; stage: Stage; score: number; ready: boolean
  blocking_open: number; actionable_blocking?: number; requested: number; overdue: number; stale?: number
  unclassified_docs?: number; policy_breaches?: number; next_due_date?: string | null; pending_drafts?: number
  open_items: number; groups: GroupProgress[]
  next_action: Pick<Action, 'kind' | 'tone' | 'title' | 'cta'> | null
  actions: Action[]
  items_open: (Pick<CheckItem, 'key' | 'title' | 'status' | 'blocking' | 'group' | 'kind'> & { due_date?: string })[]
  profile: ProfileField[]
  documents: Pick<Doc, 'id' | 'name' | 'type' | 'issued_date' | 'summary'>[]
}
export type CaseDetail = { case: CaseRec; overview: Overview; drafts: Draft[]; audit: { ts: string; action: string; [k: string]: unknown }[] }
export type DocType = { label: string; group: string; validity_months: number | null; ask: string; alternatives: string[]; extract?: string[] }
export type Catalog = {
  documents: {
    groups: Record<string, string>; types: Record<string, DocType>
    fields: Record<string, { label: string; group: string }>; sales_facts: Record<string, { label: string; group: string }>
    extra_fields?: Record<string, string>
  }
  products: { products: { code: string; name: string; purposes: string[]; max_term_months: number }[] }
}

export const STAGE: Record<Stage, { label: string; tone: Tone }> = {
  draft: { label: 'Khởi tạo', tone: 'muted' },
  collecting: { label: 'Đang thu thập', tone: 'warn' },
  ready: { label: 'Đủ điều kiện trình', tone: 'ok' },
  submitted: { label: 'Đã bàn giao', tone: 'info' },
}
export const ITEM_STATUS: Record<ItemStatus, { label: string; tone: Tone }> = {
  open: { label: 'Chưa bổ sung', tone: 'danger' },
  requested: { label: 'Chờ khách hàng', tone: 'info' },
  waived: { label: 'Xin miễn / Bổ sung sau', tone: 'muted' },
  resolved: { label: 'Đạt', tone: 'ok' },
  ok: { label: 'Đạt', tone: 'ok' },
}
export const CHANNEL: Record<DraftChannel, string> = { email: 'Email', zalo: 'Zalo', phone_script: 'Kịch bản gọi' }
export const AUDIT_LABEL: Record<string, string> = {
  case_create: 'Khởi tạo hồ sơ', case_update: 'Cập nhật hồ sơ', document_add: 'Tiếp nhận chứng từ',
  document_update: 'Phân loại chứng từ', document_remove: 'Gỡ chứng từ',
  requirement_set: 'Cập nhật hạng mục', requirement_resolved: 'Tự động hoàn tất hạng mục',
  draft_save: 'Tạo thư nháp', draft_sent: 'Đã gửi yêu cầu KH',
  case_submitted: 'Bàn giao Thẩm định', case_reopened: 'Mở lại hồ sơ', evidence_add: 'Thêm bằng chứng',
}

export const isOpen = (i: CheckItem) => i.status === 'open' || i.status === 'requested'
export const actor = (a?: string) => (!a ? 'Hệ thống' : a.startsWith('agent:') || a === 'dossier-coach' ? 'Trợ lý AI' : 'ĐVKD')
export const COACH = 'dossier-coach'
export const CHAT_PREFIX = 'sme-sales-chat-'

export function describeAudit(a: { ts: string; action: string; [k: string]: unknown }): string {
  switch (a.action) {
    case 'document_add':
    case 'document_update':
    case 'document_remove':
      return [a.id, a.name].filter(Boolean).join(' · ')
    case 'case_update':
      return Array.isArray(a.fields) ? `${a.fields.length} chỉ tiêu` : ''
    case 'requirement_set':
      return `${String(a.key ?? '')} → ${String(a.status ?? '')}`
    case 'requirement_resolved':
      return Array.isArray(a.keys) ? `${a.keys.length} hạng mục đạt` : ''
    case 'draft_save':
    case 'draft_sent':
      return String(a.id ?? '')
    case 'case_reopened':
      return String(a.note ?? '')
    default:
      return ''
  }
}

/** A field value formatted for corporate banking display. */
export function showValue(path: string, value: unknown, catalog: Catalog | null): string {
  if (value === null || value === undefined || value === '') return '—'
  if (path === 'request.purpose' && typeof value === 'string') return PURPOSE[value] ?? value
  if (path === 'request.product_code' && typeof value === 'string') {
    const p = catalog?.products.products.find((x) => x.code === value)
    return p ? `${p.code} · ${p.name}` : value
  }
  if (typeof value === 'number') {
    if (/fiscal_year/.test(path)) return String(value)
    if (/_pct$|ty_le/.test(path)) return `${num(value, 2)}%`
    if (/term_months|so_thang/.test(path)) return `${value} tháng`
    if (/years_in_operation|so_nam/.test(path)) return `${num(value, 1)} năm`
    if (/amount|capital|revenue|income|assets|equity|investment|value|so_tien|gia_tri|doanh_thu|von|tai_san|loi_nhuan/.test(path)) {
      return money(value)
    }
    return value.toLocaleString('vi-VN')
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return day(value)
  return String(value)
}

export function formatFactValue(fact: string, val: unknown): string {
  if (val === null || val === undefined || val === '') return '—'
  if (fact === 'loan_amount') return moneyShort(val)
  if (fact === 'term_months') return `${num(val, 0)} tháng`
  if (fact === 'years_in_operation') return `${num(val, 1)} năm`
  if (fact === 'equity_contribution_pct') return `${num(val, 1)}%`
  return typeof val === 'number' ? num(val) : String(val)
}

export function buildDraftPrompt(
  caseId: string,
  items: { key: string; title: string; status?: string }[],
  channel: DraftChannel = 'email',
  isReminder = false,
): string {
  const ch = CHANNEL[channel]
  const verb = isReminder ? 'nhắc khách bổ sung (giọng nhắc lịch sự các mục đã yêu cầu)' : 'xin khách bổ sung'
  const list = items.map((i) => `- ${i.title} [${i.key}]`).join('\n')
  return `Soạn ${ch} ${verb} cho hồ sơ ${caseId} (kênh: ${channel}) gồm các hạng mục sau:\n${list}`
}

export function buildLosHandoverText(detail: CaseDetail, catalog: Catalog | null): string {
  const { case: c, overview: ov } = detail
  const types = catalog?.documents.types ?? {}
  const mandatoryTotal = ov.items.filter((i) => i.blocking).length
  const mandatoryDone = ov.items.filter((i) => i.blocking && ['ok', 'resolved', 'waived'].includes(i.status)).length
  const lines: string[] = [
    `PHIẾU BÀN GIAO HỒ SƠ THẨM ĐỊNH: ${c.case_id}`,
    `Khách hàng: ${c.customer?.name ?? 'Chưa rõ'} | MST: ${c.customer?.tax_id ?? '—'} | Luồng: ${c.flow}`,
    `Hạng mục bắt buộc: ${mandatoryDone}/${mandatoryTotal} | Trạng thái: ${ov.readiness.ready ? 'Đủ điều kiện trình' : `Còn ${ov.readiness.blocking_open.length} mục chặn`}`,
    '',
    '1. THÔNG TIN KHÁCH HÀNG & ĐỀ XUẤT',
  ]
  for (const f of ov.profile) {
    lines.push(`- ${f.label}: ${showValue(f.path, f.value, catalog)}`)
  }
  lines.push('', `2. CHỨNG TỪ ĐỐI CHIẾU (${c.documents.length})`)
  if (c.documents.length === 0) lines.push('- Chưa có chứng từ')
  for (const d of c.documents) {
    const label = d.type ? (types[d.type]?.label ?? d.type) : 'Chưa phân loại'
    lines.push(`- ${d.id}: ${label} (${d.name}${d.issued_date ? `, lập ${day(d.issued_date)}` : ''})${d.summary ? ` — ${d.summary}` : ''}`)
  }
  const breaches = (ov.policy_checks ?? []).filter((p) => p.status === 'not_met')
  if (breaches.length > 0) {
    lines.push('', '3. LƯU Ý ĐIỀU KIỆN CHÍNH SÁCH SƠ BỘ')
    for (const b of breaches) {
      lines.push(`- ${b.label}: thực tế ${formatFactValue(b.fact, b.actual)}, yêu cầu ${b.op} ${formatFactValue(b.fact, b.threshold)} (${b.clause})`)
    }
  }
  const waived = ov.items.filter((i) => i.status === 'waived')
  if (waived.length > 0) {
    lines.push('', '4. CÁC HẠNG MỤC XIN MIỄN / BỔ SUNG SAU KÈM GIẢI TRÌNH')
    for (const w of waived) {
      lines.push(`- ${w.title}: ${w.note || 'Không có ghi chú'}`)
    }
  }
  const openBlock = ov.items.filter((i) => i.blocking && (i.status === 'open' || i.status === 'requested'))
  if (openBlock.length > 0) {
    lines.push('', '5. CÁC HẠNG MỤC CHẶN CHƯA ĐẠT (TRÌNH KÈM GIẢI TRÌNH)')
    for (const o of openBlock) {
      lines.push(`- ${o.title} (${ITEM_STATUS[o.status].label}${o.due_date ? `, hạn ${day(o.due_date)}` : ''})`)
    }
  }
  return lines.join('\n')
}
