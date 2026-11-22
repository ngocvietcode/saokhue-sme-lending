// Vietnamese labels for the master checklist and cross-check vocabulary.
// The backend keeps the English codes (PASS, MISSING_REQUIRED, ...) as stable
// keys; the page only ever shows these labels.
import type { Tone } from './format'

export type RuleStatus = 'PASS' | 'MISSING_REQUIRED' | 'FAIL' | 'SKIPPED' | 'UNDETERMINED_CONDITION'
export type CrossCheckStatus = 'PASS' | 'FAIL' | 'MISSING_DATA' | 'SKIPPED'
export type ChecklistCounts = Partial<Record<RuleStatus, number>>

type Meta = { label: string; tone: Tone }
const meta = (table: Record<string, Meta>, code: string | undefined): Meta =>
  (code && table[code]) || { label: code ?? '—', tone: 'muted' }

export const RULE_STATUS_META: Record<RuleStatus, Meta> = {
  PASS: { label: 'Đạt', tone: 'ok' },
  MISSING_REQUIRED: { label: 'Còn thiếu', tone: 'warn' },
  FAIL: { label: 'Không đạt', tone: 'danger' },
  SKIPPED: { label: 'Không áp dụng', tone: 'muted' },
  UNDETERMINED_CONDITION: { label: 'Chưa xác định điều kiện', tone: 'info' },
}
export const XCHECK_META: Record<CrossCheckStatus, Meta> = {
  PASS: { label: 'Khớp', tone: 'ok' },
  FAIL: { label: 'Không khớp', tone: 'danger' },
  MISSING_DATA: { label: 'Thiếu căn cứ', tone: 'warn' },
  SKIPPED: { label: 'Không áp dụng', tone: 'muted' },
}
/** Overall verdict of the checklist (COMPLETE/INCOMPLETE) or of the cross-checks (PASS/FAIL/...). */
export const OVERALL_META: Record<string, Meta> = {
  COMPLETE: { label: 'Checklist đầy đủ', tone: 'ok' },
  INCOMPLETE: { label: 'Checklist chưa đủ', tone: 'warn' },
  PASS: { label: 'Đối chiếu khớp', tone: 'ok' },
  FAIL: { label: 'Đối chiếu có lệch', tone: 'danger' },
  MISSING_DATA: { label: 'Đối chiếu thiếu căn cứ', tone: 'warn' },
  SKIPPED: { label: 'Không áp dụng', tone: 'muted' },
}

export const ruleStatus = (code: string | undefined) => meta(RULE_STATUS_META, code)
export const xcheckStatus = (code: string | undefined) => meta(XCHECK_META, code)
export const overallStatus = (code: string | undefined) => meta(OVERALL_META, code)

/** "12 đạt · 5 còn thiếu · 1 không đạt", leaving out zero counts unless all are zero. */
export function checklistSummary(counts: ChecklistCounts | undefined, include: RuleStatus[] = [
  'PASS', 'MISSING_REQUIRED', 'FAIL', 'UNDETERMINED_CONDITION',
]): string {
  if (!counts) return '—'
  const parts = include
    .filter((k) => (counts[k] ?? 0) > 0)
    .map((k) => `${counts[k]} ${RULE_STATUS_META[k].label.toLowerCase()}`)
  return parts.length ? parts.join(' · ') : 'Chưa có mục nào'
}
