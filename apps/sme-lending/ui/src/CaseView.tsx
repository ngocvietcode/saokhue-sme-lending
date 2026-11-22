import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, ErrorNotice } from '@kirocrew/app-sdk/ui'
import {
  Activity, ArrowLeft, ClipboardList, FileText, Gauge, Landmark, MessageSquare, Play, RefreshCw, ShieldCheck,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  API, PHASES, PURPOSE, REASON, STATE_META, agentLabel, agentState, errMsg, metrics, money, num, when,
  type CaseDetail,
} from './model'
import { useAssistantChat } from './assistantChat'
import { AgentsTab, AuditTab, EvidenceTab, OverviewTab, ReviewTab } from './tabs'
import { Kpi, Pill, tone } from '@sme-ui/ui'
import { StateIcon } from './agentUi'

type Tab = 'overview' | 'agents' | 'evidence' | 'review' | 'audit'

function Stepper({ detail, flow, onAgent }: { detail: CaseDetail; flow: string; onAgent: (a: string) => void }) {
  return (
    <div className="sme-card tight">
      <div className="sme-steps">
        {PHASES.map((p) => (
          <div key={p.name} className="sme-phase">
            <span className="sme-phase-name">{p.name}</span>
            {p.agents.map((a) => {
              const skip = a === 'industry' && flow !== 'B' && !detail.results[a]
              const st = skip ? 'none' : agentState(detail.results[a])
              return (
                <button key={a} type="button" className={`sme-node ${tone(STATE_META[st].tone)} ${skip || st === 'none' ? 'skip' : ''}`}
                  disabled={skip || st === 'none'} title={skip ? 'Chỉ chạy ở luồng B' : STATE_META[st].label}
                  onClick={() => onAgent(a)}>
                  <span className="dot"><StateIcon state={st} size={12} /></span>
                  <span>{agentLabel(a)}{skip ? ' (luồng B)' : ''}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="sme-between sme-small" style={{ padding: '5px 0' }}>
      <span className="sme-muted">{label}</span><span style={{ textAlign: 'right' }}>{children}</span>
    </div>
  )
}

export default function CaseView({ caseId, onBack }: { caseId: string; onBack: () => void }) {
  const api = useAppApi()
  const [detail, setDetail] = useState<CaseDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const openAssistant = useAssistantChat(setError)
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [focusEv, setFocusEv] = useState<string | null>(null)
  const [focusRv, setFocusRv] = useState<string | null>(null)
  const [focusAgent, setFocusAgent] = useState<string | null>(null)

  const load = useCallback(async () => {
    setBusy(true)
    try {
      setDetail(await api.get<CaseDetail>(`${API}/cases/${caseId}`))
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }, [api, caseId])

  useEffect(() => { load() }, [load])

  const m = useMemo(() => (detail ? metrics(detail) : {}), [detail])
  const openReview = detail?.review.filter((r) => r.status === 'open') ?? []
  const notMet = m.policy?.rows.filter((r) => r.status === 'not_met').length
  const baseDscr = m.dscr?.scenarios.find((s) => s.stress_pct === 0)?.dscr ?? null

  const goEvidence = (id: string) => { setFocusEv(id); setTab('evidence') }
  const goReview = (id: string) => { setFocusRv(id); setTab('review') }
  const goAgent = (a: string) => { setFocusAgent(a); setTab('agents') }
  const decide = async (id: string, status: string, note: string) => {
    try {
      await api.post(`${API}/cases/${caseId}/review/${id}`, { status, note })
      await load()
      return true
    } catch (e) {
      setError(errMsg(e))
      return false
    }
  }
  const chatTitle = `Thẩm định ${detail?.case.customer?.name ?? caseId}`
  const run = () => openAssistant(
    `Chạy thẩm định hồ sơ ${caseId}, luồng ${detail?.case.flow ?? 'A'}.`, caseId, chatTitle)
  const ask = () => openAssistant(`Giải thích kết quả thẩm định hồ sơ ${caseId}: `, caseId, chatTitle)

  const c = detail?.case
  const customer = c?.customer ?? {}
  const request = c?.request ?? {}
  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'agents', label: 'Kết quả agent', count: detail ? Object.keys(detail.results).length : undefined },
    { key: 'evidence', label: 'Bằng chứng', count: detail ? Object.keys(detail.evidence).length : undefined },
    { key: 'review', label: 'Rà soát', count: openReview.length || undefined },
    { key: 'audit', label: 'Audit' },
  ]

  return (
    <div className="sme-scroll" style={{ paddingTop: 16 }}>
      <div className="sme-hero">
        <div style={{ minWidth: 0 }}>
          <button type="button" className="sme-back" onClick={onBack}><ArrowLeft size={14} /> Tất cả hồ sơ</button>
          <h1 className="sme-title">{String(customer.name ?? caseId)}</h1>
          <div className="sme-row sme-wrap" style={{ gap: 6 }}>
            <span className="sme-chip sme-mono">{caseId}</span>
            {c && <span className="sme-chip">Luồng {c.flow}</span>}
            {customer.industry_code && <span className="sme-chip">Ngành {String(customer.industry_code)}</span>}
            {request.purpose && <span className="sme-chip">{PURPOSE[request.purpose] ?? request.purpose}</span>}
            {c && <span className="sme-small sme-muted">Tạo {when(c.created_at)}</span>}
          </div>
        </div>
        <div className="sme-row">
          <Btn onClick={load} busy={busy} title="Tải lại dữ liệu"><RefreshCw size={14} /></Btn>
          <Btn onClick={ask}><MessageSquare size={14} /> Hỏi trợ lý</Btn>
          <Btn primary onClick={run}><Play size={14} /> Chạy thẩm định</Btn>
        </div>
      </div>

      {error && <div style={{ marginBottom: 16 }}><ErrorNotice title="Có lỗi khi làm việc với hồ sơ">{error}</ErrorNotice></div>}
      {!detail && !error && <div className="sme-card sme-stack"><div className="sme-skel" style={{ width: '50%' }} /><div className="sme-skel" /><div className="sme-skel" style={{ width: '70%' }} /></div>}

      {detail && c && (
        <>
          <div className="sme-kpis" style={{ marginBottom: 12 }}>
            <Kpi icon={<Landmark size={18} />} label="Số tiền đề nghị" value={money(request.amount).replace(' đ', '')}
              hint={[request.term_months ? `${request.term_months} tháng` : null, request.annual_rate_pct ? `lãi ${num(request.annual_rate_pct)}%/năm` : null].filter(Boolean).join(' · ') || 'VND'} />
            <Kpi t={baseDscr == null ? 'muted' : m.dscr?.threshold !== undefined && baseDscr < m.dscr.threshold ? 'danger' : 'ok'}
              icon={<Gauge size={18} />} label="DSCR cơ sở" value={num(baseDscr)}
              hint={m.dscr?.threshold !== undefined ? `Ngưỡng ≥ ${num(m.dscr.threshold)}` : 'Chưa có phân tích'} />
            <Kpi t={notMet == null ? 'muted' : notMet > 0 ? 'danger' : 'ok'} icon={<ShieldCheck size={18} />}
              label="Điều kiện không đạt" value={notMet ?? '—'}
              hint={m.policy ? `${m.policy.rows.length} điều kiện · ${m.policy.product}` : 'Chưa kiểm tra chính sách'} />
            <Kpi t={openReview.length ? 'warn' : 'ok'} icon={<ClipboardList size={18} />} label="Chờ cán bộ rà soát"
              value={openReview.length} hint={`${detail.review.length} mục tổng cộng`} />
          </div>

          <div style={{ marginBottom: 16 }}><Stepper detail={detail} flow={c.flow} onAgent={goAgent} /></div>

          <div className="sme-detail">
            <div style={{ minWidth: 0 }}>
              <div className="sme-tabs" role="tablist">
                {tabs.map((t) => (
                  <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
                    className={`sme-tab ${tab === t.key ? 'on' : ''}`} onClick={() => setTab(t.key)}>
                    {t.label}{t.count !== undefined && <span className="sme-count">{t.count}</span>}
                  </button>
                ))}
              </div>
              {tab === 'overview' && <OverviewTab detail={detail} m={m} onEvidence={goEvidence} goAgents={() => setTab('agents')} />}
              {tab === 'agents' && <AgentsTab detail={detail} openAgent={focusAgent} onEvidence={goEvidence} />}
              {tab === 'evidence' && <EvidenceTab detail={detail} focus={focusEv} />}
              {tab === 'review' && <ReviewTab detail={detail} focus={focusRv} onDecide={decide} onEvidence={goEvidence} />}
              {tab === 'audit' && <AuditTab detail={detail} />}
            </div>

            <aside className="sme-aside">
              <div className="sme-card">
                <div className="sme-between" style={{ marginBottom: 4 }}>
                  <h3 className="sme-h3">Cần xử lý</h3>
                  <Pill t={openReview.length ? 'warn' : 'ok'}>{openReview.length}</Pill>
                </div>
                {openReview.length === 0 && <div className="sme-small sme-muted" style={{ padding: '8px 0' }}>Không còn mục chờ rà soát.</div>}
                {openReview.slice(0, 6).map((r) => {
                  const reason = REASON[r.reason_code] ?? { label: r.reason_code, tone: 'muted' as const }
                  return (
                    <button key={r.id} type="button" className="sme-todo" onClick={() => goReview(r.id)}>
                      <Pill t={reason.tone}>{r.id}</Pill>
                      <span className="sme-todo-text"><b>{reason.label}.</b> {r.detail}</span>
                    </button>
                  )
                })}
                {openReview.length > 6 && (
                  <button type="button" className="sme-ref" style={{ marginTop: 6 }} onClick={() => setTab('review')}>
                    Xem thêm {openReview.length - 6} mục
                  </button>
                )}
              </div>

              <div className="sme-card">
                <h3 className="sme-h3" style={{ marginBottom: 6 }}>Khách hàng</h3>
                <Fact label="CIF">{String(customer.cif ?? '—')}</Fact>
                <Fact label="Mã số thuế">{String(customer.tax_id ?? '—')}</Fact>
                <Fact label="Số năm hoạt động">{customer.years_in_operation ?? '—'}</Fact>
                {request.proposal && <div className="sme-small" style={{ marginTop: 8 }}>
                  <div className="sme-section-title" style={{ marginBottom: 4 }}>Đề xuất ĐVKD</div>{String(request.proposal)}</div>}
              </div>

              <div className="sme-card">
                <div className="sme-between" style={{ marginBottom: 6 }}>
                  <h3 className="sme-h3">Chứng từ</h3><span className="sme-small sme-muted">{c.documents.length}</span>
                </div>
                {c.documents.map((d) => (
                  <div key={d.id} className="sme-row sme-small" style={{ padding: '5px 0' }}>
                    <FileText size={14} className="sme-muted" />
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span>
                    <span className="sme-mono sme-muted">{d.id}</span>
                  </div>
                ))}
              </div>

              {detail.audit.length > 0 && (
                <div className="sme-small sme-muted sme-row" style={{ padding: '0 4px' }}>
                  <Activity size={13} /> Hoạt động gần nhất {when(detail.audit[detail.audit.length - 1].ts)}
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
