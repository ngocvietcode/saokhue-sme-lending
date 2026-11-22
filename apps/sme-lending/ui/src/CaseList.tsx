import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, ErrorNotice, PageHeader } from '@kirocrew/app-sdk/ui'
import { AlertOctagon, ClipboardList, FolderOpen, Plus, RefreshCw, Search, ShieldAlert } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AGENT_ORDER, API, PURPOSE, STATE_META, agentLabel, ago, errMsg, moneyShort, type CaseSummary,
} from './model'
import { useAssistantChat } from './assistantChat'
import { Empty, Kpi, Pill, tone } from '@sme-ui/ui'

type Filter = 'all' | 'review' | 'blocked'

function CaseCard({ c, onOpen }: { c: CaseSummary; onOpen: () => void }) {
  const agents = c.agents ?? {}
  const done = Object.keys(agents).length
  return (
    <div className="sme-card hover" role="button" tabIndex={0} onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}>
      <div className="sme-between" style={{ alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div className="sme-h2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.customer_name ?? 'Chưa có tên khách hàng'}
          </div>
          <div className="sme-mono sme-muted" style={{ marginTop: 2 }}>{c.case_id}</div>
        </div>
        {c.review_open > 0
          ? <Pill t="warn">{c.review_open} chờ rà soát</Pill>
          : done > 0 ? <Pill t="ok">Đã rà soát</Pill> : <Pill t="muted">Mới</Pill>}
      </div>
      <div className="sme-row" style={{ marginTop: 12, alignItems: 'baseline', gap: 10 }}>
        <span className="sme-case-amount">{moneyShort(c.amount)}</span>
        <span className="sme-muted sme-small">
          {[c.term_months ? `${c.term_months} tháng` : null, c.purpose ? PURPOSE[c.purpose] ?? c.purpose : null]
            .filter(Boolean).join(' · ')}
        </span>
      </div>
      <div className="sme-pipe" aria-label={`${done}/${AGENT_ORDER.length} agent đã chạy`}>
        {AGENT_ORDER.map((a) => {
          const s = agents[a]
          return <span key={a} className={s ? tone(STATE_META[s].tone) : 'none'}
            title={`${agentLabel(a)}: ${STATE_META[s ?? 'none'].label}`} />
        })}
      </div>
      <div className="sme-between sme-small sme-muted">
        <span className="sme-row" style={{ gap: 6 }}>
          <span className="sme-chip">Luồng {c.flow}</span>
          {(c.high_findings ?? 0) > 0 && <Pill t="danger">{c.high_findings} cảnh báo cao</Pill>}
          {c.agents_blocked > 0 && <Pill t="danger">{c.agents_blocked} bị chặn</Pill>}
        </span>
        <span title={c.updated_at}>Cập nhật {ago(c.updated_at)}</span>
      </div>
    </div>
  )
}

export default function CaseList({ onOpen }: { onOpen: (id: string) => void }) {
  const api = useAppApi()
  const [cases, setCases] = useState<CaseSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const openAssistant = useAssistantChat(setError)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    try {
      setCases((await api.get<{ cases: CaseSummary[] }>(`${API}/cases`)).cases)
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }, [api])

  useEffect(() => { load() }, [load])

  const totals = useMemo(() => ({
    open: cases?.reduce((n, c) => n + c.review_open, 0) ?? 0,
    blocked: cases?.reduce((n, c) => n + c.agents_blocked, 0) ?? 0,
    high: cases?.reduce((n, c) => n + (c.high_findings ?? 0), 0) ?? 0,
  }), [cases])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (cases ?? []).filter((c) => {
      if (filter === 'review' && c.review_open === 0) return false
      if (filter === 'blocked' && c.agents_blocked === 0) return false
      if (!needle) return true
      return [c.customer_name, c.case_id, c.industry_code].some((v) => v?.toLowerCase().includes(needle))
    })
  }, [cases, q, filter])

  const newCase = () =>
    openAssistant('Tạo hồ sơ thẩm định SME mới.', `new-${Date.now()}`, 'Hồ sơ SME mới')

  return (
    <>
      <PageHeader
        title="Thẩm định SME"
        subtitle="Hồ sơ vay, kết quả các agent, bằng chứng và hàng đợi rà soát của cán bộ"
        actions={
          <div className="sme-row">
            <Btn onClick={load} busy={busy}><RefreshCw size={14} /> Làm mới</Btn>
            <Btn primary onClick={newCase}><Plus size={14} /> Hồ sơ mới</Btn>
          </div>
        }
      />
      <div className="sme-scroll">
        {error && <div style={{ marginBottom: 16 }}><ErrorNotice title="Không tải được danh sách hồ sơ">{error}</ErrorNotice></div>}
        <div className="sme-kpis">
          <Kpi icon={<FolderOpen size={18} />} label="Hồ sơ" value={cases?.length ?? '…'} />
          <Kpi t="warn" icon={<ClipboardList size={18} />} label="Mục chờ rà soát" value={cases ? totals.open : '…'}
            hint="Cần cán bộ xác nhận" />
          <Kpi t="danger" icon={<ShieldAlert size={18} />} label="Cảnh báo mức cao" value={cases ? totals.high : '…'} />
          <Kpi t={totals.blocked ? 'danger' : 'ok'} icon={<AlertOctagon size={18} />} label="Kết quả bị chặn"
            value={cases ? totals.blocked : '…'} hint="Không qua kiểm chứng" />
        </div>

        <div className="sme-between sme-wrap" style={{ marginBottom: 12 }}>
          <div className="sme-filters" role="tablist" aria-label="Lọc hồ sơ">
            {([['all', 'Tất cả'], ['review', 'Chờ rà soát'], ['blocked', 'Bị chặn']] as [Filter, string][]).map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k}
                className={`sme-filter ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
          <label className="sme-search">
            <Search size={14} className="sme-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm khách hàng, mã hồ sơ, mã ngành" />
          </label>
        </div>

        {cases === null && !error && (
          <div className="sme-cases">{[0, 1, 2].map((i) => (
            <div key={i} className="sme-card sme-stack"><div className="sme-skel" style={{ width: '60%' }} />
              <div className="sme-skel" style={{ width: '40%' }} /><div className="sme-skel" /></div>
          ))}</div>
        )}
        {cases && cases.length === 0 && (
          <Empty icon={<FolderOpen size={32} />} title="Chưa có hồ sơ nào"
            hint="Trợ lý thẩm định SME sẽ hỏi thông tin khách hàng và tạo hồ sơ cho bạn."
            action={<Btn primary onClick={newCase}><Plus size={14} /> Tạo hồ sơ đầu tiên</Btn>} />
        )}
        {cases && cases.length > 0 && shown.length === 0 && (
          <Empty icon={<Search size={28} />} title="Không có hồ sơ phù hợp" hint="Thử bỏ bộ lọc hoặc đổi từ khoá." />
        )}
        {shown.length > 0 && (
          <div className="sme-cases">{shown.map((c) => <CaseCard key={c.case_id} c={c} onOpen={() => onOpen(c.case_id)} />)}</div>
        )}
      </div>
    </>
  )
}
