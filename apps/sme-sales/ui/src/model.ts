import type { Tone } from '@sme-ui/format'
export * from '@sme-ui/format'

export const API = '/apps/sme-sales/api'

export type Stage = 'draft' | 'collecting' | 'ready' | 'submitted'
export type ItemStatus = 'open' | 'requested' | 'waived' | 'resolved' | 'ok'

export type CheckItem = {
  key: string; kind: string; group: string; title: string; ok: boolean; blocking: boolean
  reason: string; ask: string; alternatives: string[]; document_refs: string[]; status: ItemStatus
  note?: string; due_date?: string; requested_at?: string; resolved_at?: string; updated_by?: string
}
export type Overview = {
  case_id: string; as_of: string; stage: Stage
  readiness: { score: number; ready: boolean; blocking_open: string[]; waived: string[] }
  items: CheckItem[]
}
export type Doc = {
  id: string; name: string; type?: string; issued_date?: string; file?: string; size?: number
  added_by?: string; added_at?: string
}
export type CaseRec = {
  case_id: string; flow: string; created_at: string
  customer: Record<string, any>; request: Record<string, any>; facts?: Record<string, any>
  documents: Doc[]; submitted?: { by: string; at: string; note: string }
}
export type Draft = {
  id: string; channel: 'email' | 'zalo' | 'phone_script'; subject: string; body: string
  requirement_keys: string[]; status: 'draft' | 'sent'; author: string; created_at: string; sent_at?: string
}
export type DossierRow = {
  case_id: string; created_at: string; updated_at?: string; flow: string; customer_name?: string
  amount?: number; term_months?: number; purpose?: string; stage: Stage; score: number; ready: boolean
  blocking_open: number; requested: number; open_items: number
}
export type CaseDetail = { case: CaseRec; overview: Overview; drafts: Draft[]; audit: { ts: string; action: string; [k: string]: unknown }[] }
export type DocType = { label: string; group: string; validity_months: number | null; ask: string; alternatives: string[] }
export type Catalog = {
  documents: {
    groups: Record<string, string>; types: Record<string, DocType>
    fields: Record<string, { label: string; group: string }>; sales_facts: Record<string, { label: string; group: string }>
  }
  products: { products: { code: string; name: string; purposes: string[]; max_term_months: number }[] }
}

export const STAGE: Record<Stage, { label: string; tone: Tone }> = {
  draft: { label: 'Nháp', tone: 'muted' },
  collecting: { label: 'Đang thu thập', tone: 'warn' },
  ready: { label: 'Sẵn sàng nộp', tone: 'ok' },
  submitted: { label: 'Đã nộp', tone: 'info' },
}
export const ITEM_STATUS: Record<ItemStatus, { label: string; tone: Tone }> = {
  open: { label: 'Còn thiếu', tone: 'danger' },
  requested: { label: 'Đã xin khách', tone: 'info' },
  waived: { label: 'Bỏ qua', tone: 'muted' },
  resolved: { label: 'Đã đủ', tone: 'ok' },
  ok: { label: 'Đã đủ', tone: 'ok' },
}
export const CHANNEL: Record<Draft['channel'], string> = { email: 'Email', zalo: 'Zalo', phone_script: 'Kịch bản gọi' }
export const AUDIT_LABEL: Record<string, string> = {
  case_create: 'Tạo hồ sơ', case_update: 'Cập nhật thông tin', document_add: 'Thêm chứng từ',
  document_update: 'Sửa chứng từ', requirement_set: 'Cập nhật mục', requirement_resolved: 'Mục tự đóng',
  draft_save: 'Lưu thư nháp', draft_sent: 'Đã gửi thư', case_submitted: 'Đánh dấu đã nộp', evidence_add: 'Thêm bằng chứng',
}

export const isOpen = (i: CheckItem) => i.status === 'open' || i.status === 'requested'
export const scoreTone = (s: number): Tone => (s >= 90 ? 'ok' : s >= 60 ? 'warn' : 'danger')
export const actor = (a?: string) => (!a ? '—' : a.startsWith('agent:') ? `Trợ lý (${a.slice(6)})` : 'Bạn')
