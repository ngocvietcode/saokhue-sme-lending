import { Btn } from '@kirocrew/app-sdk/ui'
import { ChevronRight, ClipboardCheck, FileSearch, History, MessageSquare, Play, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  AGENT_ORDER, AUDIT_LABEL, CONFIDENCE, FACT_LABEL, POLICY_STATUS, RATIO_LABEL, REASON, REVIEW_STATUS, SEVERITY,
  agentLabel, agentState, moneyShort, num, sortFindings, text, when,
  type AgentResult, type CaseDetail, type Finding, type Metrics,
} from './model'
import { Banner, Empty, Pill, Refs, tone } from '@sme-ui/ui'
import { StatePill } from './agentUi'

function FindingRow({ f, onEvidence }: { f: Finding; onEvidence: (id: string) => void }) {
  const s = SEVERITY[f.severity] ?? SEVERITY.info
  return (
    <div className={`sme-finding ${tone(s.tone)}`}>
      <div className="bar" />
      <div>
        <div className="sme-finding-topic sme-row" style={{ gap: 6 }}>
          <Pill t={s.tone}>{s.label}</Pill><span>{f.topic.replace(/_/g, ' ')}</span>
        </div>
        <div className="sme-finding-text">{f.statement}<Refs refs={f.evidence_refs} onOpen={onEvidence} /></div>
      </div>
    </div>
  )
}

/* ---------- Tổng quan ---------- */

function DscrCard({ m }: { m: NonNullable<Metrics['dscr']> }) {
  const max = Math.max(1.6, (m.threshold ?? 0) * 1.3, ...m.scenarios.map((s) => s.dscr ?? 0))
  return (
    <div className="sme-card">
      <div className="sme-between" style={{ marginBottom: 12 }}>
        <h3 className="sme-h3">Khả năng trả nợ (DSCR)</h3>
        {m.threshold !== undefined && <span className="sme-small sme-muted">Ngưỡng chính sách ≥ {num(m.threshold)}</span>}
      </div>
      <div className="sme-bars">
        {m.scenarios.map((s) => {
          const ok = m.threshold === undefined || (s.dscr ?? 0) >= m.threshold
          return (
            <div key={s.stress_pct} className={`sme-bar-row ${tone(ok ? 'ok' : 'danger')}`}>
              <span className="sme-muted">{s.stress_pct ? `Stress −${s.stress_pct}%` : 'Cơ sở'}</span>
              <div className="sme-bar-track">
                <div className="sme-bar-fill" style={{ width: `${Math.min(100, ((s.dscr ?? 0) / max) * 100)}%` }} />
                {m.threshold !== undefined && <div className="sme-bar-mark" style={{ left: `${(m.threshold / max) * 100}%` }} />}
              </div>
              <span className="sme-num sme-strong">{num(s.dscr)}</span>
            </div>
          )
        })}
      </div>
      {(m.cash !== undefined || m.debtService !== undefined) && (
        <div className="sme-small sme-muted" style={{ marginTop: 10 }}>
          Dòng tiền trả nợ {moneyShort(m.cash)} / năm · Nghĩa vụ trả nợ {moneyShort(m.debtService)} / năm
        </div>
      )}
    </div>
  )
}

function PolicyCard({ m }: { m: NonNullable<Metrics['policy']> }) {
  return (
    <div className="sme-card">
      <div className="sme-between" style={{ marginBottom: 8 }}>
        <h3 className="sme-h3">Điều kiện chính sách {m.product}</h3>
        {m.version && <span className="sme-small sme-muted">Phiên bản {m.version}</span>}
      </div>
      <table className="sme-table">
        <thead><tr><th>Điều kiện</th><th className="sme-num">Yêu cầu</th><th className="sme-num">Thực tế</th><th>Kết quả</th></tr></thead>
        <tbody>
          {m.rows.map((r) => {
            const st = POLICY_STATUS[r.status] ?? { label: r.status, tone: 'muted' as const }
            const fmt = (v: unknown) => (r.fact === 'loan_amount' ? moneyShort(v) : typeof v === 'number' ? num(v) : '—')
            return (
              <tr key={r.id}>
                <td>{FACT_LABEL[r.fact] ?? r.fact}<div className="sme-small sme-muted">{r.clause}</div></td>
                <td className="sme-num">{r.op} {fmt(r.threshold)}</td>
                <td className="sme-num">{fmt(r.actual)}</td>
                <td><Pill t={st.tone}>{st.label}</Pill></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function RatiosCard({ periods }: { periods: NonNullable<Metrics['ratios']> }) {
  const keys = Object.keys(RATIO_LABEL).filter((k) => periods.some((p) => p.ratios?.[k] != null))
  if (!keys.length) return null
  return (
    <div className="sme-card">
      <h3 className="sme-h3" style={{ marginBottom: 8 }}>Chỉ số tài chính</h3>
      <table className="sme-table">
        <thead><tr><th>Chỉ số</th>{periods.map((p) => <th key={p.period} className="sme-num">{p.period}</th>)}</tr></thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k}>
              <td>{RATIO_LABEL[k].label}</td>
              {periods.map((p) => <td key={p.period} className="sme-num">{RATIO_LABEL[k].fmt(p.ratios?.[k])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function OverviewTab({ detail, m, onEvidence, goAgents }: {
  detail: CaseDetail; m: Metrics; onEvidence: (id: string) => void; goAgents: () => void
}) {
  const report = detail.results['consolidation']
  const high = AGENT_ORDER.flatMap((a) => (detail.results[a]?.findings ?? [])
    .filter((f) => f.severity === 'high').map((f) => ({ ...f, agent: a })))
  const sample = Object.values(detail.evidence).some((e) => /MẪU|sample/i.test(String(e.source)))
  return (
    <div className="sme-stack">
      {sample && (
        <Banner>Hồ sơ đang dùng <b>dữ liệu mẫu</b> (OCR, CIC hoặc NCLOS chưa nối hệ thống thật). Không dùng kết quả này cho quyết định tín dụng.</Banner>
      )}
      <div className="sme-card">
        <div className="sme-between" style={{ marginBottom: 8 }}>
          <h3 className="sme-h3">Tóm tắt thẩm định</h3>
          {report ? <StatePill state={agentState(report)} /> : <Pill t="muted">Chưa tổng hợp</Pill>}
        </div>
        {report
          ? <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{report.summary}</p>
          : <p className="sme-muted" style={{ margin: 0 }}>Agent Tổng hợp chưa chạy. Kết quả từng agent xem ở tab <button
              type="button" className="sme-ref" onClick={goAgents}>Kết quả agent</button>.</p>}
      </div>
      {high.length > 0 && (
        <div className="sme-card">
          <h3 className="sme-h3" style={{ marginBottom: 4 }}>Cảnh báo mức cao ({high.length})</h3>
          {high.map((f) => (
            <div key={f.agent + f.id}>
              <div className="sme-small sme-muted" style={{ marginTop: 8 }}>{agentLabel(f.agent)}</div>
              <FindingRow f={f} onEvidence={onEvidence} />
            </div>
          ))}
        </div>
      )}
      {m.dscr && <DscrCard m={m.dscr} />}
      {m.policy && <PolicyCard m={m.policy} />}
      {m.ratios && <RatiosCard periods={m.ratios} />}
    </div>
  )
}

/* ---------- Kết quả agent ---------- */

function AgentCard({ id, r, open, onToggle, onEvidence, onAsk }: {
  id: string; r: AgentResult; open: boolean; onToggle: () => void; onEvidence: (id: string) => void; onAsk?: () => void
}) {
  const counts = (['high', 'medium', 'low'] as const).map((s) => [s, r.findings.filter((f) => f.severity === s).length] as const)
  return (
    <div className="sme-card" id={`agent-${id}`}>
      <button type="button" className={`sme-acc-head ${open ? 'open' : ''}`} onClick={onToggle} aria-expanded={open}>
        <ChevronRight size={16} className="chev" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sme-between">
            <span className="sme-h3">{agentLabel(id)}</span>
            <StatePill state={agentState(r)} />
          </div>
          <div className="sme-row sme-small sme-muted" style={{ marginTop: 4 }}>
            <span>v{r._version} · độ tin cậy {CONFIDENCE[r.confidence] ?? r.confidence} · {when(r._saved_at)}</span>
            <span className="sme-sev-counts">
              {counts.filter(([, n]) => n > 0).map(([s, n]) => <Pill key={s} t={SEVERITY[s].tone}>{n} {SEVERITY[s].label.toLowerCase()}</Pill>)}
            </span>
          </div>
        </div>
      </button>
      {open && (
        <div className="sme-acc-body sme-stack">
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{r.summary}</p>
          {r.verification && !r.verification.passed && (
            <Banner t="danger"><b>Lý do bị chặn:</b>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{r.verification.errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}</ul>
            </Banner>
          )}
          {r.findings.length > 0 && <div>{sortFindings(r.findings).map((f) => <FindingRow key={f.id} f={f} onEvidence={onEvidence} />)}</div>}
          {(r.missing_information?.length ?? 0) > 0 && (
            <div><div className="sme-section-title">Còn thiếu</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>{r.missing_information!.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          )}
          {(r.open_issues?.length ?? 0) > 0 && (
            <div><div className="sme-section-title">Vấn đề mở</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>{r.open_issues!.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          )}
          {onAsk && (
            <div className="sme-row" style={{ justifyContent: 'flex-end' }}>
              <Btn onClick={onAsk}><MessageSquare size={13} /> Hỏi trợ lý về phần này</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AgentsTab({ detail, openAgent, onEvidence, onRunAssessment, onAskAgent }: {
  detail: CaseDetail; openAgent: string | null; onEvidence: (id: string) => void
  onRunAssessment?: () => void; onAskAgent?: (agentId: string, label: string) => void
}) {
  const ran = AGENT_ORDER.filter((a) => detail.results[a])
  const [open, setOpen] = useState<Set<string>>(() => new Set(openAgent ? [openAgent] : []))
  useEffect(() => {
    if (!openAgent) return
    setOpen((s) => new Set(s).add(openAgent))
    requestAnimationFrame(() => document.getElementById(`agent-${openAgent}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
  }, [openAgent])
  if (!ran.length) {
    return (
      <Empty
        icon={<FileSearch size={30} />}
        title="Chưa có kết quả"
        hint="Chạy thẩm định để các agent ghi kết quả vào hồ sơ."
        action={onRunAssessment ? <Btn primary onClick={onRunAssessment}><Play size={13} /> Chạy thẩm định</Btn> : undefined}
      />
    )
  }
  const toggle = (a: string) => setOpen((s) => { const n = new Set(s); n.has(a) ? n.delete(a) : n.add(a); return n })
  return (
    <div className="sme-stack">
      <div className="sme-row" style={{ justifyContent: 'flex-end' }}>
        <Btn onClick={() => setOpen(open.size === ran.length ? new Set() : new Set(ran))}>
          {open.size === ran.length ? 'Thu gọn tất cả' : 'Mở tất cả'}
        </Btn>
      </div>
      {ran.map((a) => (
        <AgentCard
          key={a}
          id={a}
          r={detail.results[a]}
          open={open.has(a)}
          onToggle={() => toggle(a)}
          onEvidence={onEvidence}
          onAsk={onAskAgent ? () => onAskAgent(a, agentLabel(a)) : undefined}
        />
      ))}
    </div>
  )
}

/* ---------- Bằng chứng ---------- */

export function EvidenceTab({ detail, focus }: { detail: CaseDetail; focus: string | null }) {
  const rows = Object.values(detail.evidence)
  const [q, setQ] = useState('')
  const [agent, setAgent] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(focus)
  useEffect(() => {
    if (!focus) return
    setExpanded(focus); setQ(''); setAgent('all')
    requestAnimationFrame(() => document.getElementById(`ev-${focus}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }, [focus])
  const agents = useMemo(() => Array.from(new Set(rows.map((r) => r.added_by))), [rows])
  const shown = rows.filter((r) => (agent === 'all' || r.added_by === agent)
    && (!q.trim() || `${r.id} ${r.source} ${text(r.value)}`.toLowerCase().includes(q.trim().toLowerCase())))
  if (!rows.length) return <Empty icon={<FileSearch size={30} />} title="Chưa có bằng chứng" />
  return (
    <div className="sme-stack">
      <div className="sme-between sme-wrap">
        <div className="sme-filters">
          <button type="button" className={`sme-filter ${agent === 'all' ? 'on' : ''}`} onClick={() => setAgent('all')}>Tất cả</button>
          {agents.map((a) => (
            <button key={a} type="button" className={`sme-filter ${agent === a ? 'on' : ''}`} onClick={() => setAgent(a)}>{agentLabel(a)}</button>
          ))}
        </div>
        <label className="sme-search"><Search size={14} className="sme-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, nguồn, giá trị" /></label>
      </div>
      <div className="sme-card tight">
        <table className="sme-table">
          <thead><tr><th style={{ width: 64 }}>Mã</th><th>Nguồn</th><th>Giá trị</th><th style={{ width: 150 }}>Agent</th></tr></thead>
          <tbody>
            {shown.map((e) => {
              const full = text(e.value)
              const isOpen = expanded === e.id
              return (
                <tr key={e.id} id={`ev-${e.id}`} className={`click ${focus === e.id ? 'focus' : ''}`}
                  onClick={() => setExpanded(isOpen ? null : e.id)}>
                  <td className="sme-mono">{e.id}</td>
                  <td>{e.source}</td>
                  <td>
                    <span className="sme-mono" style={{ wordBreak: 'break-word' }}>{full.length > 90 && !isOpen ? full.slice(0, 88) + '…' : (isOpen ? '' : full)}</span>
                    {isOpen && <pre className="sme-pre">{full}</pre>}
                  </td>
                  <td className="sme-muted sme-small">{agentLabel(e.added_by)}<div>{when(e.added_at)}</div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {shown.length === 0 && <Empty icon={<Search size={24} />} title="Không có bằng chứng phù hợp" />}
      </div>
    </div>
  )
}

/* ---------- Rà soát ---------- */

type RFilter = 'open' | 'done' | 'all'

export function ReviewTab({ detail, focus, onDecide, onEvidence }: {
  detail: CaseDetail; focus: string | null
  onDecide: (id: string, status: string, note: string) => Promise<boolean>; onEvidence: (id: string) => void
}) {
  const [filter, setFilter] = useState<RFilter>('open')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => {
    if (!focus) return
    setFilter('all')
    requestAnimationFrame(() => document.getElementById(`rv-${focus}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }, [focus])
  const open = detail.review.filter((r) => r.status === 'open').length
  const shown = detail.review.filter((r) => filter === 'all' || (filter === 'open') === (r.status === 'open'))
  const decide = async (id: string, status: string) => {
    setBusy(id + status)
    try {
      if (await onDecide(id, status, notes[id] ?? '')) setNotes((n) => ({ ...n, [id]: '' }))
    } finally { setBusy(null) }
  }
  if (!detail.review.length) return <Empty icon={<ClipboardCheck size={30} />} title="Không có mục cần rà soát" />
  return (
    <div className="sme-stack">
      <div className="sme-between sme-wrap">
        <div className="sme-filters">
          {([['open', `Chờ xử lý (${open})`], ['done', `Đã xử lý (${detail.review.length - open})`], ['all', 'Tất cả']] as [RFilter, string][]).map(([k, l]) => (
            <button key={k} type="button" className={`sme-filter ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <span className="sme-small sme-muted">Quyết định chỉ dành cho cán bộ; agent không đóng được mục rà soát.</span>
      </div>
      {shown.length === 0 && <Empty icon={<ClipboardCheck size={30} />} title={filter === 'open' ? 'Đã xử lý hết các mục' : 'Không có mục nào'} />}
      {shown.map((r) => {
        const reason = REASON[r.reason_code] ?? { label: r.reason_code, tone: 'muted' as const }
        const st = REVIEW_STATUS[r.status] ?? { label: r.status, tone: 'muted' as const }
        const note = notes[r.id] ?? ''
        return (
          <div key={r.id} id={`rv-${r.id}`} className={`sme-card sme-review ${tone(reason.tone)}`}
            style={focus === r.id ? { boxShadow: '0 0 0 2px color-mix(in srgb, var(--accent) 50%, transparent)' } : undefined}>
            <div className="sme-between">
              <span className="sme-row"><span className="sme-mono sme-muted">{r.id}</span><Pill t={reason.tone}>{reason.label}</Pill></span>
              <Pill t={st.tone}>{st.label}</Pill>
            </div>
            <p style={{ margin: '10px 0 6px', fontSize: 13.5, lineHeight: 1.55 }}>{r.detail}</p>
            <div className="sme-small sme-muted">
              {agentLabel(r.source_agent)} · {when(r.created_at)}<Refs refs={r.evidence_refs} onOpen={onEvidence} />
            </div>
            {r.status === 'open' ? (
              <div style={{ marginTop: 12 }}>
                <textarea className="sme-textarea" value={note} placeholder="Ghi chú của cán bộ (bắt buộc): căn cứ, chứng từ đã đối chiếu, việc cần ĐVKD bổ sung…"
                  onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} />
                <div className="sme-row" style={{ marginTop: 8, justifyContent: 'flex-end' }}>
                  <Btn disabled={!note.trim()} busy={busy === r.id + 'needs_info'} onClick={() => decide(r.id, 'needs_info')}>Yêu cầu bổ sung</Btn>
                  <Btn primary disabled={!note.trim()} busy={busy === r.id + 'confirmed'} onClick={() => decide(r.id, 'confirmed')}>Xác nhận</Btn>
                </div>
              </div>
            ) : (
              <div className={`sme-decision ${tone(st.tone)}`}>
                <b>{st.label}</b> bởi {r.decided_by} · {when(r.decided_at)}
                <div style={{ marginTop: 2 }}>{r.note}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Audit ---------- */

export function AuditTab({ detail }: { detail: CaseDetail }) {
  if (!detail.audit.length) return <Empty icon={<History size={30} />} title="Chưa có nhật ký" />
  const toneOf = (a: { action: string; passed?: unknown }) =>
    a.action === 'verification' ? (a.passed ? 'ok' : 'danger')
      : a.action === 'review_decide' ? 'accent' : a.action === 'review_add' ? 'warn' : 'muted'
  const describe = (a: Record<string, any>) => {
    const who = a.agent ? agentLabel(a.agent) : a.actor ?? ''
    switch (a.action) {
      case 'result_put': return `${who} lưu kết quả v${a.version}${a.rerun_reason ? ` (chạy lại: ${a.rerun_reason})` : ''}`
      case 'verification': return `${who} v${a.version}: ${a.passed ? 'đạt kiểm chứng' : 'bị chặn'}`
      case 'evidence_add': return `${who} thêm ${(a.ids ?? []).join(', ')}`
      case 'review_add': return `${who} thêm ${a.id} (${REASON[a.reason_code]?.label ?? a.reason_code})`
      case 'review_decide': return `${a.actor} ${REVIEW_STATUS[a.status]?.label.toLowerCase() ?? a.status} ${a.id}`
      case 'case_create': return `Luồng ${a.flow}, ${a.documents} chứng từ`
      default: return who
    }
  }
  return (
    <div className="sme-card">
      <div className="sme-tl">
        {[...detail.audit].reverse().map((a, i) => (
          <div key={i} className={`sme-tl-item ${tone(toneOf(a) as any)}`}>
            <div className="sme-between"><span className="sme-strong" style={{ fontSize: 13 }}>{AUDIT_LABEL[a.action] ?? a.action}</span>
              <span className="sme-small sme-muted">{when(a.ts)}</span></div>
            <div className="sme-small sme-muted">{describe(a)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

