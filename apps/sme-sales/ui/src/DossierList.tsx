import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, ErrorNotice, PageHeader } from '@kirocrew/app-sdk/ui'
import { CheckCircle2, ClipboardCheck, Clock, FolderOpen, Plus, RefreshCw, Search, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Empty, Kpi, Pill } from '@sme-ui/ui'
import { API, PURPOSE, STAGE, ago, errMsg, moneyShort, type Catalog, type DossierRow, type Stage } from './model'
import { Score, StagePill } from './parts'

type Filter = 'all' | Stage

function Row({ c, onOpen }: { c: DossierRow; onOpen: () => void }) {
  return (
    <button type="button" className="sme-card" style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }} onClick={onOpen}>
      <div className="sme-between sme-wrap" style={{ gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="sme-strong">{c.customer_name || 'Chưa có tên khách hàng'}</div>
          <div className="sme-small sme-muted sme-mono">{c.case_id}</div>
        </div>
        <StagePill stage={c.stage} />
      </div>
      <div className="sme-row sme-wrap sme-small" style={{ gap: 10, marginTop: 8 }}>
        <span className="sme-strong">{moneyShort(c.amount)}</span>
        {c.term_months ? <span>{c.term_months} tháng</span> : null}
        {c.purpose ? <span>{PURPOSE[c.purpose] ?? c.purpose}</span> : null}
        <span className="sme-muted">Luồng {c.flow}</span>
      </div>
      <div style={{ marginTop: 10 }}><Score value={c.score} /></div>
      <div className="sme-row sme-wrap" style={{ gap: 6, marginTop: 8 }}>
        {c.blocking_open > 0 && <Pill t="danger">{c.blocking_open} mục chặn nộp</Pill>}
        {c.requested > 0 && <Pill t="info">{c.requested} đang chờ khách</Pill>}
        {c.ready && c.stage !== 'submitted' && <Pill t="ok"><CheckCircle2 size={12} /> Đủ để nộp</Pill>}
        <span className="sme-small sme-muted" style={{ marginLeft: 'auto' }}>Cập nhật {ago(c.updated_at)}</span>
      </div>
    </button>
  )
}

function NewDossier({ catalog, onCancel, onCreated }: {
  catalog: Catalog | null; onCancel: () => void; onCreated: (id: string) => void
}) {
  const api = useAppApi()
  const [f, setF] = useState({ name: '', tax_id: '', product_code: '', amount: '', purpose: 'working_capital', term_months: '', flow: 'A' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const create = async () => {
    setBusy(true)
    try {
      const request: Record<string, unknown> = { purpose: f.purpose }
      if (f.product_code) request.product_code = f.product_code
      if (f.amount) request.amount = Number(f.amount)
      if (f.term_months) request.term_months = Number(f.term_months)
      const customer: Record<string, unknown> = { name: f.name.trim() }
      if (f.tax_id.trim()) customer.tax_id = f.tax_id.trim()
      const res = await api.post<{ case_id: string }>(`${API}/cases`, { customer, request, flow: f.flow })
      onCreated(res.case_id)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="sme-card" style={{ marginBottom: 16 }}>
      <div className="sme-between" style={{ marginBottom: 12 }}>
        <div className="sme-h3">Hồ sơ mới</div>
        <Btn onClick={onCancel} title="Đóng"><X size={14} /></Btn>
      </div>
      {error && <div style={{ marginBottom: 12 }}><ErrorNotice title="Không tạo được hồ sơ">{error}</ErrorNotice></div>}
      <div className="sme-form">
        <label className="sme-field">Tên khách hàng *<input className="sme-input" value={f.name} onChange={set('name')} /></label>
        <label className="sme-field">Mã số thuế<input className="sme-input" value={f.tax_id} onChange={set('tax_id')} /></label>
        <label className="sme-field">Sản phẩm
          <select className="sme-input" value={f.product_code} onChange={set('product_code')}>
            <option value="">Chưa chọn</option>
            {catalog?.products.products.map((p) => <option key={p.code} value={p.code}>{p.code} · {p.name}</option>)}
          </select>
        </label>
        <label className="sme-field">Số tiền vay (đồng)<input className="sme-input" inputMode="numeric" value={f.amount} onChange={set('amount')} /></label>
        <label className="sme-field">Mục đích
          <select className="sme-input" value={f.purpose} onChange={set('purpose')}>
            {Object.entries(PURPOSE).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="sme-field">Kỳ hạn (tháng)<input className="sme-input" inputMode="numeric" value={f.term_months} onChange={set('term_months')} /></label>
        <label className="sme-field">Luồng
          <select className="sme-input" value={f.flow} onChange={set('flow')}>
            <option value="A">Luồng A</option><option value="B">Luồng B</option>
          </select>
        </label>
      </div>
      <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
        <Btn onClick={onCancel}>Huỷ</Btn>
        <Btn primary busy={busy} disabled={!f.name.trim()} onClick={create}><Plus size={14} /> Tạo hồ sơ</Btn>
      </div>
    </div>
  )
}

export default function DossierList({ onOpen, catalog }: { onOpen: (id: string) => void; catalog: Catalog | null }) {
  const api = useAppApi()
  const [rows, setRows] = useState<DossierRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    try {
      setRows((await api.get<{ cases: DossierRow[] }>(`${API}/cases`)).cases)
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }, [api])
  useEffect(() => { load() }, [load])

  const count = (s: Stage) => rows?.filter((r) => r.stage === s).length ?? 0
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (rows ?? []).filter((r) => (filter === 'all' || r.stage === filter)
      && (!needle || [r.customer_name, r.case_id].some((v) => v?.toLowerCase().includes(needle))))
  }, [rows, filter, q])

  return (
    <>
      <PageHeader
        title="Hoàn thiện hồ sơ"
        subtitle="Bộ hồ sơ khách hàng đang chuẩn bị, còn thiếu gì và đã đủ để nộp Thẩm định chưa"
        actions={
          <div className="sme-row">
            <Btn onClick={load} busy={busy}><RefreshCw size={14} /> Làm mới</Btn>
            <Btn primary onClick={() => setCreating(true)}><Plus size={14} /> Hồ sơ mới</Btn>
          </div>
        }
      />
      <div className="sme-scroll">
        {error && <div style={{ marginBottom: 16 }}><ErrorNotice title="Không tải được danh sách hồ sơ">{error}</ErrorNotice></div>}
        {creating && <NewDossier catalog={catalog} onCancel={() => setCreating(false)}
          onCreated={(id) => { setCreating(false); onOpen(id) }} />}
        <div className="sme-kpis">
          <Kpi icon={<FolderOpen size={18} />} label="Đang chuẩn bị" value={rows ? count('draft') + count('collecting') : '…'} />
          <Kpi t="warn" icon={<Clock size={18} />} label="Mục chờ khách" value={rows ? rows.reduce((n, r) => n + r.requested, 0) : '…'} />
          <Kpi t="ok" icon={<ClipboardCheck size={18} />} label="Sẵn sàng nộp" value={rows ? count('ready') : '…'} />
          <Kpi t="info" icon={<CheckCircle2 size={18} />} label="Đã nộp" value={rows ? count('submitted') : '…'} />
        </div>
        <div className="sme-between sme-wrap" style={{ marginBottom: 12 }}>
          <div className="sme-filters" role="tablist" aria-label="Lọc theo giai đoạn">
            {(['all', 'draft', 'collecting', 'ready', 'submitted'] as Filter[]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k}
                className={`sme-filter ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>
                {k === 'all' ? 'Tất cả' : STAGE[k].label}{k !== 'all' && rows ? ` (${count(k)})` : ''}
              </button>
            ))}
          </div>
          <label className="sme-search">
            <Search size={14} className="sme-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm khách hàng hoặc mã hồ sơ" />
          </label>
        </div>
        {rows && rows.length === 0 && !creating && (
          <Empty icon={<FolderOpen size={32} />} title="Chưa có hồ sơ nào" hint="Tạo hồ sơ rồi tải chứng từ khách gửi lên để xem còn thiếu gì."
            action={<Btn primary onClick={() => setCreating(true)}><Plus size={14} /> Tạo hồ sơ đầu tiên</Btn>} />
        )}
        {rows && rows.length > 0 && shown.length === 0 && (
          <Empty icon={<Search size={28} />} title="Không có hồ sơ phù hợp" hint="Thử bỏ bộ lọc hoặc đổi từ khoá." />
        )}
        {shown.length > 0 && <div className="sme-cases">{shown.map((r) => <Row key={r.case_id} c={r} onOpen={() => onOpen(r.case_id)} />)}</div>}
      </div>
    </>
  )
}
