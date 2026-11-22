import { AlertTriangle, CheckCircle2, CircleDashed, CircleDot, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { STATE_META, type AgentState, type Tone } from './model'

export const tone = (t: Tone) => `t-${t}`

export function Pill({ t, children, title }: { t: Tone; children: ReactNode; title?: string }) {
  return <span className={`sme-pill ${tone(t)}`} title={title}>{children}</span>
}

export function Kpi({ icon, label, value, hint, t = 'accent' }: {
  icon: ReactNode; label: string; value: ReactNode; hint?: ReactNode; t?: Tone
}) {
  return (
    <div className={`sme-kpi ${tone(t)}`}>
      <div className="sme-kpi-icon">{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div className="sme-kpi-label">{label}</div>
        <div className="sme-kpi-value">{value}</div>
        {hint && <div className="sme-kpi-hint">{hint}</div>}
      </div>
    </div>
  )
}

export function StateIcon({ state, size = 13 }: { state: AgentState | 'none'; size?: number }) {
  if (state === 'passed') return <CheckCircle2 size={size} />
  if (state === 'blocked') return <XCircle size={size} />
  if (state === 'unverified') return <CircleDot size={size} />
  return <CircleDashed size={size} />
}

export function StatePill({ state }: { state: AgentState | 'none' }) {
  const m = STATE_META[state]
  return <Pill t={m.tone}><StateIcon state={state} size={12} />{m.label}</Pill>
}

export function Empty({ icon, title, hint, action }: { icon: ReactNode; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="sme-empty">
      {icon}
      <div className="sme-strong">{title}</div>
      {hint && <div className="sme-small" style={{ marginTop: 4 }}>{hint}</div>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  )
}

export function Banner({ t = 'warn', children }: { t?: Tone; children: ReactNode }) {
  return <div className={`sme-banner ${tone(t)}`}><AlertTriangle size={15} /><div>{children}</div></div>
}

export function Refs({ refs, onOpen }: { refs: string[]; onOpen: (id: string) => void }) {
  if (!refs?.length) return null
  return (
    <span className="sme-row sme-wrap" style={{ gap: 4, display: 'inline-flex', marginLeft: 4 }}>
      {refs.map((r) => (
        <button key={r} type="button" className="sme-ref" title="Xem bằng chứng" onClick={() => onOpen(r)}>{r}</button>
      ))}
    </span>
  )
}
