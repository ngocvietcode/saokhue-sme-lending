import { useAppApi } from '@kirocrew/app-sdk'
import { CheckCircle2, CircleDashed, Loader2, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Pill } from '@sme-ui/ui'
import { API, agentLabel } from './model'

type Row = { ts: string; agent: string; step: string; detail: string; state: 'running' | 'done' | 'failed' }
type Group = { agent: string; rows: Row[]; state: Row['state']; startedAt: number; lastAt: number }

const STALE_MS = 90_000
const secs = (ms: number) => Math.max(0, Math.round(ms / 1000))
const dur = (ms: number) => {
  const s = secs(ms)
  return s < 60 ? `${s} giây` : `${Math.floor(s / 60)} phút ${String(s % 60).padStart(2, '0')} giây`
}

const NEW_ATTEMPT_GAP_MS = 180_000

/** One group per agent, for its current attempt only: a re-run appends to the same file, so rows
 * separated by a long silence belong to an earlier run and are dropped. An accepted result (a `done`
 * row) settles the agent even when it keeps talking afterwards. */
export function groupProgress(rows: Row[]): Group[] {
  const by = new Map<string, Row[]>()
  for (const r of rows) by.set(r.agent, [...(by.get(r.agent) ?? []), r])
  return [...by].map(([agent, all]) => {
    let cut = 0
    for (let i = 1; i < all.length; i++) {
      if (Date.parse(all[i].ts) - Date.parse(all[i - 1].ts) > NEW_ATTEMPT_GAP_MS) cut = i
    }
    const list = all.slice(cut)
    const last = list[list.length - 1]
    const state: Row['state'] = last.state === 'failed' ? 'failed'
      : list.some((r) => r.state === 'done') ? 'done' : last.state
    return { agent, rows: list, state, startedAt: Date.parse(list[0].ts), lastAt: Date.parse(last.ts) }
  })
}

/** Live, self-reported steps of the agents: the officer sees where a long run is instead of waiting. */
export function ProgressPanel({ caseId, syncTick }: { caseId: string; syncTick: number }) {
  const api = useAppApi()
  const [rows, setRows] = useState<Row[]>([])
  const [now, setNow] = useState(Date.now())

  const groups = useMemo(() => groupProgress(rows), [rows])
  const running = groups.some((g) => g.state === 'running')

  useEffect(() => {
    let alive = true
    const pull = async () => {
      if (document.visibilityState === 'hidden') return
      try {
        const r = await api.get<{ rows: Row[] }>(`${API}/cases/${caseId}/progress`)
        if (alive) setRows(r.rows ?? [])
      } catch { /* the next tick retries */ }
    }
    void pull()
    const id = window.setInterval(() => { setNow(Date.now()); void pull() }, running ? 3000 : 15000)
    return () => { alive = false; window.clearInterval(id) }
  }, [api, caseId, running, syncTick])

  if (groups.length === 0) return null
  return (
    <div className="sme-card">
      <div className="sme-between" style={{ marginBottom: 8 }}>
        <h3 className="sme-h3">Tiến độ thẩm định</h3>
        <Pill t={running ? 'accent' : 'ok'}>{running ? 'Đang chạy' : 'Đã xong các bước đã báo'}</Pill>
      </div>
      <p className="sme-small sme-muted" style={{ margin: '0 0 8px' }}>
        Các bước do agent tự báo khi làm việc; thời gian tính từ lúc bước đầu tiên được báo.
      </p>
      {groups.map((g) => {
        const last = g.rows[g.rows.length - 1]
        const stale = g.state === 'running' && now - g.lastAt > STALE_MS
        const elapsed = (g.state === 'running' ? now : g.lastAt) - g.startedAt
        return (
          <div key={g.agent} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
            <div className="sme-between">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13 }}>
                {g.state === 'done' ? <CheckCircle2 size={15} color="var(--ok)" />
                  : g.state === 'failed' ? <TriangleAlert size={15} color="var(--danger)" />
                  : stale ? <CircleDashed size={15} color="var(--warn, var(--muted))" />
                  : <Loader2 size={15} className="sme-spin" color="var(--accent)" />}
                {agentLabel(g.agent)}
              </span>
              <span className="sme-small sme-muted">{dur(elapsed)}</span>
            </div>
            <div className="sme-small" style={{ margin: '4px 0 0 23px' }}>
              {last.step}{last.detail ? <span className="sme-muted"> · {last.detail}</span> : null}
              {stale && <span style={{ color: 'var(--warn, var(--muted))' }}> · chưa có cập nhật mới {dur(now - g.lastAt)}</span>}
            </div>
            {g.rows.length > 1 && (
              <ol className="sme-small sme-muted" style={{ margin: '4px 0 0 23px', paddingLeft: 16 }}>
                {g.rows.slice(0, -1).map((r, i) => <li key={i}>{r.step}</li>)}
              </ol>
            )}
          </div>
        )
      })}
    </div>
  )
}
