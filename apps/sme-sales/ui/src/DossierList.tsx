import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, ErrorNotice, PageHeader } from '@kirocrew/app-sdk/ui'
import { ClipboardCheck, Clock, FolderOpen, MessageSquare, Plus, RefreshCw, Search, ShieldAlert } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Empty, Kpi, Pill, tone } from '@sme-ui/ui'
import type { CreatedCaseBanner } from './CoachPanel'
import {
  API, PURPOSE, ago, errMsg, moneyShort, type Catalog, type DossierRow, type Today,
} from './model'
import { DetailTable, dossierStatus, groupTotals } from './Overview'
import { groupTone } from './parts'

type Filter = 'all' | 'action' | 'waiting' | 'overdue' | 'ready' | 'submitted'
type ViewMode = 'cards' | 'table'

const VIEW_KEY = 'sme-sales:view'
const readView = (): ViewMode => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'table' ? 'table' : 'cards'
  } catch { return 'cards' }
}

function DossierCard({ r, onOpen }: { r: DossierRow; onOpen: () => void }) {
  const st = dossierStatus(r)
  const { done, total } = groupTotals(r)
  return (
    <div className="sme-card hover" role="button" tabIndex={0} onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}>
      <div className="sme-between" style={{ alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div className="sme-h2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.customer_name || 'Chưa có tên doanh nghiệp'}
          </div>
          <div className="sme-mono sme-muted" style={{ marginTop: 2 }}>
            {r.case_id}{r.tax_id ? ` · MST ${r.tax_id}` : ''}
          </div>
        </div>
        <Pill t={st.t}>{st.label}</Pill>
      </div>
      <div className="sme-row" style={{ marginTop: 12, alignItems: 'baseline', gap: 10 }}>
        <span className="sme-case-amount">{moneyShort(r.amount)}</span>
        <span className="sme-muted sme-small">
          {[r.product_code, r.term_months ? `${r.term_months} tháng` : null, r.purpose ? PURPOSE[r.purpose] ?? r.purpose : null]
            .filter(Boolean).join(' · ')}
        </span>
      </div>
      <div className="sme-pipe" aria-label={`${done}/${total} hạng mục đạt`}>
        {r.groups.map((g) => {
          const gt = groupTone(g)
          return (
            <span key={g.group} className={gt === 'muted' ? 'none' : tone(gt)}
              title={`${g.label}: ${g.done}/${g.total} hạng mục`} />
          )
        })}
      </div>
      <div className="sme-between sme-small sme-muted">
        <span className="sme-row" style={{ gap: 6 }}>
          <span className="sme-chip">Luồng {r.flow}</span>
          <span className="sme-mono">{done}/{total} mục</span>
          {(r.policy_breaches ?? 0) > 0 && <Pill t="danger">{r.policy_breaches} lệch chuẩn</Pill>}
        </span>
        <span title={r.updated_at}>Cập nhật {ago(r.updated_at)}</span>
      </div>
    </div>
  )
}

export default function DossierList({
  onOpen, catalog: _catalog, coachOpen, syncTick, onToggleCoach, onAskCoach, onCreatedCase,
}: {
  onOpen: (id: string) => void
  catalog: Catalog | null
  coachOpen: boolean
  syncTick: number
  onToggleCoach: () => void
  onAskCoach: (prompt: string, mode?: 'prefill' | 'new_intake' | 'attach') => void
  onCreatedCase: (created: CreatedCaseBanner) => void
}) {
  const api = useAppApi()
  const [rows, setRows] = useState<DossierRow[] | null>(null)
  const [today, setToday] = useState<Today | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const [view, setViewState] = useState<ViewMode>(readView)
  const lastSyncRef = useRef(0)
  const silentInFlightRef = useRef(false)
  const knownIdsRef = useRef<Set<string> | null>(null)

  const setView = (v: ViewMode) => {
    setViewState(v)
    try { localStorage.setItem(VIEW_KEY, v) } catch { /* viewer convenience */ }
  }

  const load = useCallback(async (silent = false) => {
    if (silent && silentInFlightRef.current) return
    if (silent) silentInFlightRef.current = true
    else setBusy(true)
    try {
      const res = await api.get<{ cases: DossierRow[]; today: Today }>(`${API}/cases`)
      if (knownIdsRef.current === null) {
        knownIdsRef.current = new Set(res.cases.map((r) => r.case_id))
      } else {
        const created = res.cases.find((r) => !knownIdsRef.current!.has(r.case_id))
        res.cases.forEach((r) => knownIdsRef.current!.add(r.case_id))
        if (created) {
          onCreatedCase({ caseId: created.case_id, name: created.customer_name || created.case_id })
        }
      }
      setRows(res.cases)
      setToday(res.today)
      setError(null)
      lastSyncRef.current = Date.now()
    } catch (e) {
      if (!silent) setError(errMsg(e))
    } finally {
      if (silent) silentInFlightRef.current = false
      else setBusy(false)
    }
  }, [api, onCreatedCase])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (syncTick > 0) void load(true)
  }, [syncTick, load])

  useEffect(() => {
    const syncIfStale = () => {
      if (document.visibilityState === 'hidden') return
      if (Date.now() - lastSyncRef.current >= 3000) void load(true)
    }
    window.addEventListener('focus', syncIfStale)
    document.addEventListener('visibilitychange', syncIfStale)
    return () => {
      window.removeEventListener('focus', syncIfStale)
      document.removeEventListener('visibilitychange', syncIfStale)
    }
  }, [load])

  const stats = useMemo(() => {
    const list = rows ?? []
    const live = list.filter((r) => r.stage !== 'submitted')
    const submitted = list.length - live.length
    const ready = live.filter((r) => r.ready).length
    const actionNeeded = live.filter((r) => (r.actionable_blocking ?? r.blocking_open) > 0 || (r.unclassified_docs ?? 0) > 0).length
    const actionableItems = live.reduce((n, r) => n + (r.actionable_blocking ?? r.blocking_open), 0)
    const waitingCases = live.filter((r) => r.requested > 0 && r.overdue === 0).length
    const overdueCases = live.filter((r) => r.overdue > 0).length
    return { live: live.length, submitted, ready, actionNeeded, actionableItems, waitingCases, overdueCases }
  }, [rows])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (rows ?? []).filter((r) => {
      if (filter === 'submitted' && r.stage !== 'submitted') return false
      if (filter !== 'submitted' && filter !== 'all' && r.stage === 'submitted') return false
      if (filter === 'action' && (r.actionable_blocking ?? r.blocking_open) === 0 && (r.unclassified_docs ?? 0) === 0) return false
      if (filter === 'waiting' && r.requested === 0) return false
      if (filter === 'overdue' && r.overdue === 0) return false
      if (filter === 'ready' && !r.ready) return false
      if (!needle) return true
      return [r.customer_name, r.case_id, r.tax_id, r.product_code].some((v) => v?.toLowerCase().includes(needle))
    })
  }, [rows, filter, q])

  const newDossier = () => onAskCoach('Tạo hồ sơ mới cho khách hàng: ', 'new_intake')

  return (
    <>
      <PageHeader
        title="Hoàn thiện hồ sơ Tín dụng SME"
        subtitle="Quản lý danh mục hồ sơ ĐVKD, kiểm soát chứng từ bắt buộc, đối chiếu điều kiện sơ bộ và bàn giao Thẩm định"
        actions={
          <div className="sme-row">
            <Btn onClick={() => load()} busy={busy}><RefreshCw size={14} /> Làm mới</Btn>
            <Btn
              className={coachOpen ? 'ss-toggle-on' : undefined}
              aria-pressed={coachOpen}
              onClick={onToggleCoach}
              title={coachOpen ? 'Thu gọn trợ lý hồ sơ' : 'Mở trợ lý hồ sơ bên phải'}
            >
              <MessageSquare size={14} /> Trợ lý hồ sơ
            </Btn>
            <Btn primary onClick={newDossier}><Plus size={14} /> Hồ sơ mới</Btn>
          </div>
        }
      />
      <div className="sme-scroll">
        {error && <div style={{ marginBottom: 16 }}><ErrorNotice title="Không tải được danh sách hồ sơ">{error}</ErrorNotice></div>}

        <div className="sme-kpis">
          <Kpi icon={<FolderOpen size={18} />} label="Hồ sơ đang thu thập" value={rows ? stats.live : '…'}
            hint={rows ? `${stats.submitted} hồ sơ đã bàn giao` : undefined} />
          <Kpi t={stats.ready ? 'ok' : 'muted'} icon={<ClipboardCheck size={18} />} label="Đủ điều kiện trình"
            value={rows ? stats.ready : '…'} hint="Hoàn tất mục bắt buộc" />
          <Kpi t={stats.actionNeeded ? 'warn' : 'ok'} icon={<ShieldAlert size={18} />} label="Cần ĐVKD xử lý"
            value={rows ? stats.actionNeeded : '…'}
            hint={rows ? `${stats.actionableItems} mục chặn chưa yêu cầu` : undefined} />
          <Kpi t={stats.overdueCases ? 'danger' : stats.waitingCases ? 'info' : 'muted'} icon={<Clock size={18} />}
            label="Chờ khách hàng" value={today ? today.waiting : '…'}
            hint={rows ? (stats.overdueCases ? `${stats.overdueCases} hồ sơ quá hạn cam kết` : `${stats.waitingCases} hồ sơ đang theo dõi`) : undefined} />
        </div>

        <div className="sme-between sme-wrap" style={{ marginBottom: 12 }}>
          <div className="sme-filters" role="tablist" aria-label="Lọc hồ sơ">
            {([['all', 'Tất cả'], ['action', 'Cần xử lý'], ['waiting', 'Chờ khách'], ['overdue', 'Quá hạn'],
              ['ready', 'Đủ điều kiện'], ['submitted', 'Đã bàn giao']] as [Filter, string][]).map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k}
                className={`sme-filter ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
          <div className="sme-row sme-wrap">
            <div className="sme-filters" role="tablist" aria-label="Chế độ hiển thị">
              <button type="button" role="tab" aria-selected={view === 'cards'}
                className={`sme-filter ${view === 'cards' ? 'on' : ''}`} onClick={() => setView('cards')}>Thẻ hồ sơ</button>
              <button type="button" role="tab" aria-selected={view === 'table'}
                className={`sme-filter ${view === 'table' ? 'on' : ''}`} onClick={() => setView('table')}>Bảng danh mục</button>
            </div>
            <label className="sme-search">
              <Search size={14} className="sme-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm doanh nghiệp, MST, mã hồ sơ, sản phẩm" />
            </label>
          </div>
        </div>

        {rows === null && !error && (
          <div className="sme-cases">{[0, 1, 2].map((i) => (
            <div key={i} className="sme-card sme-stack"><div className="sme-skel" style={{ width: '60%' }} />
              <div className="sme-skel" style={{ width: '40%' }} /><div className="sme-skel" /></div>
          ))}</div>
        )}
        {rows && rows.length === 0 && (
          <Empty icon={<FolderOpen size={32} />} title="Chưa có hồ sơ nào"
            hint="Khởi tạo hồ sơ với trợ lý trong chat: cung cấp thông tin khách hàng và đính kèm chứng từ."
            action={<Btn primary onClick={newDossier}><Plus size={14} /> Tạo hồ sơ đầu tiên</Btn>} />
        )}
        {rows && rows.length > 0 && shown.length === 0 && (
          <Empty icon={<Search size={28} />} title="Không có hồ sơ phù hợp" hint="Thử bỏ bộ lọc hoặc đổi từ khoá." />
        )}
        {shown.length > 0 && view === 'cards' && (
          <div className="sme-cases">{shown.map((r) => <DossierCard key={r.case_id} r={r} onOpen={() => onOpen(r.case_id)} />)}</div>
        )}
        {shown.length > 0 && view === 'table' && <DetailTable rows={shown} onOpen={onOpen} />}
      </div>
    </>
  )
}
