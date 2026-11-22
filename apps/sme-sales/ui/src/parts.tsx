import { Btn } from '@kirocrew/app-sdk/ui'
import { Calendar, CheckCircle2, CircleDashed, CircleDot, Mail, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Pill, tone } from '@sme-ui/ui'
import { CHANNEL, STAGE, plusDaysIso, type DraftChannel, type GroupProgress, type Stage, type Tone } from './model'

export const StagePill = ({ stage }: { stage: Stage }) => <Pill t={STAGE[stage].tone}>{STAGE[stage].label}</Pill>

export function groupTone(g: GroupProgress): Tone {
  if (g.done === g.total && g.total > 0) return 'ok'
  if (g.blocked > 0) return 'danger'
  if (g.done > 0) return 'warn'
  return 'muted'
}

export function GroupStateIcon({ g, size = 12 }: { g: GroupProgress; size?: number }) {
  if (g.done === g.total && g.total > 0) return <CheckCircle2 size={size} />
  if (g.blocked > 0) return <XCircle size={size} />
  if (g.done > 0) return <CircleDot size={size} />
  return <CircleDashed size={size} />
}

/** Stepper identical in structure to sme-lending's CaseView Stepper. */
export function GroupStepper({ groups, activeGroup, onSelectGroup }: {
  groups: GroupProgress[]; activeGroup: string | null; onSelectGroup: (group: string | null) => void
}) {
  if (groups.length === 0) return null
  return (
    <div className="sme-card tight">
      <div className="sme-steps">
        {groups.map((g) => {
          const t = groupTone(g)
          const on = activeGroup === g.group
          return (
            <div key={g.group} className="sme-phase">
              <span className="sme-phase-name">{g.label}</span>
              <button type="button"
                className={`sme-node ${tone(t)} ${on ? 'ss-active-node' : ''}`}
                title={`${g.label}: ${g.done}/${g.total} hạng mục đạt${g.blocked ? `, ${g.blocked} chặn` : ''}${g.skipped ? `, ${g.skipped} không áp dụng (ẩn)` : ''}`}
                onClick={() => onSelectGroup(on ? null : g.group)}>
                <span className="dot"><GroupStateIcon g={g} /></span>
                <span>{g.done}/{g.total}{on ? ' · lọc' : ''}</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PRESET_DAYS = [2, 3, 5, 7]

/** Sober banking inline due-date selector (default +3 days). */
export function DueDateInline({ label = 'Hạn cam kết bổ sung', confirmLabel = 'Xác nhận', busy, onConfirm, onCancel }: {
  label?: string; confirmLabel?: string; busy?: boolean
  onConfirm: (dueDate: string) => void; onCancel?: () => void
}) {
  const [date, setDate] = useState(() => plusDaysIso(3))
  return (
    <div className="ss-due-row">
      <span className="sme-small sme-muted sme-row" style={{ gap: 5 }}>
        <Calendar size={13} /> {label}:
      </span>
      <div className="sme-filters" role="group" aria-label="Chọn nhanh số ngày">
        {PRESET_DAYS.map((d) => {
          const val = plusDaysIso(d)
          return (
            <button key={d} type="button" className={`sme-filter ${date === val ? 'on' : ''}`}
              onClick={() => setDate(val)}>+{d} ngày</button>
          )
        })}
      </div>
      <input type="date" className="sme-input" style={{ width: 148, padding: '4px 8px', fontSize: 12 }}
        value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="sme-row" style={{ gap: 6, marginLeft: 'auto' }}>
        {onCancel && <Btn onClick={onCancel}>Huỷ</Btn>}
        <Btn primary busy={busy} disabled={!date} onClick={() => onConfirm(date)}>{confirmLabel}</Btn>
      </div>
    </div>
  )
}

export function ChannelSelect({ onPick }: { onPick: (ch: DraftChannel) => void }) {
  return (
    <div className="sme-row sme-wrap" style={{ gap: 6 }}>
      {(['email', 'zalo', 'phone_script'] as DraftChannel[]).map((ch) => (
        <Btn key={ch} onClick={() => onPick(ch)}>
          <Mail size={13} /> {CHANNEL[ch]}
        </Btn>
      ))}
    </div>
  )
}

const CSS = `
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
`

export function ensureSalesStyles(): void {
  const id = 'sme-sales-css'
  if (typeof document === 'undefined' || document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = CSS
  document.head.appendChild(el)
}
