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
                title={`${g.label}: ${g.done}/${g.total} hạng mục đạt${g.blocked ? `, ${g.blocked} chặn` : ''}`}
                onClick={() => onSelectGroup(on ? null : g.group)}>
                <span className="dot"><GroupStateIcon g={g} /></span>
                <span>{g.done}/{g.total} hạng mục{on ? ' · lọc' : ''}</span>
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

/* Split workspace with collapsible right-hand assistant panel */
.ss-workspace { display: flex; flex: 1; min-height: 0; height: 100%; overflow: hidden; position: relative; }
.ss-main { flex: 1; min-width: 0; min-height: 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; container-type: inline-size; }
@container (max-width: 1020px) {
  .sme-detail { grid-template-columns: minmax(0, 1fr); }
  .sme-aside { position: static; }
}
@container (max-width: 680px) {
  .sme-hero { grid-template-columns: minmax(0, 1fr); gap: 10px; }
}

.ss-toggle-on { border-color: color-mix(in srgb, var(--accent) 55%, var(--border)) !important;
  background: color-mix(in srgb, var(--accent) 10%, transparent) !important;
  color: var(--text-strong, var(--text)) !important; font-weight: 600; }

.ss-coach-dock { position: relative; flex: none; height: 100%; min-height: 0; display: flex; flex-direction: column;
  background: var(--card); border-left: 1px solid var(--border); }
.ss-coach-resizer { position: absolute; left: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 5;
  background: transparent; transition: background .15s; touch-action: none; }
.ss-coach-resizer:hover, .ss-coach-resizer.dragging { background: color-mix(in srgb, var(--accent) 35%, transparent); }

.ss-coach-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-height: 38px;
  padding: 5px 8px 5px 12px; border-bottom: 1px solid var(--border); background: var(--card); flex: none; }
.ss-head-left { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; }
.ss-head-chips { display: flex; align-items: center; gap: 5px; overflow-x: auto; scrollbar-width: none; min-width: 0; }
.ss-head-chips::-webkit-scrollbar { display: none; }
.ss-icon-btn { width: 28px; height: 28px; display: inline-grid; place-items: center; border-radius: 6px;
  border: 1px solid transparent; background: transparent; color: var(--muted); cursor: pointer; flex: none; }
.ss-icon-btn:hover { color: var(--text); background: var(--bg-hover, color-mix(in srgb, var(--muted) 12%, transparent));
  border-color: var(--border); }

.ss-coach-new-banner { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px;
  border-bottom: 1px solid var(--border); font-size: 12px; flex: none;
  background: color-mix(in srgb, var(--ok) 10%, var(--card)); }
.ss-coach-body { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
.ss-coach-fallback { padding: 16px; display: flex; flex-direction: column; gap: 10px; }

.ss-quick-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--bg-elevated, var(--bg)); color: var(--text); font-size: 11.5px;
  white-space: nowrap; cursor: pointer; flex: none; }
.ss-quick-chip:hover { border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  background: color-mix(in srgb, var(--accent) 8%, var(--card)); }

@media (max-width: 920px) {
  .ss-coach-dock { position: absolute; right: 0; top: 0; bottom: 0; width: min(440px, 100%) !important;
    z-index: 30; box-shadow: -8px 0 24px rgba(0, 0, 0, .14); }
  .ss-coach-resizer { display: none; }
}
`

export function ensureSalesStyles(): void {
  const id = 'sme-sales-css'
  if (typeof document === 'undefined' || document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = CSS
  document.head.appendChild(el)
}
