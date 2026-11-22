import { CheckCircle2, CircleDashed, CircleDot, XCircle } from 'lucide-react'
import { Pill } from '@sme-ui/ui'
import { STATE_META, type AgentState } from './model'

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
