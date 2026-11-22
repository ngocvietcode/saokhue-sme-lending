import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, ErrorNotice } from '@kirocrew/app-sdk/ui'
import {
  Activity, ArrowLeft, Check, ClipboardCheck, ClipboardList, Copy, FileText, Landmark,
  MessageSquare, RefreshCw, ShieldCheck, Unlock,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Kpi, Pill } from '@sme-ui/ui'
import ItemsPanel from './ItemsPanel'
import {
  API, PURPOSE, buildDraftPrompt, buildLosHandoverText, copyText, errMsg, isCustomerRequestable, isSkipped,
  money, showValue, when, type Action, type CaseDetail, type Catalog, type DocumentFilePayload, type DraftChannel,
  checklistSummary, overallStatus,
} from './model'
import { GroupStepper, StagePill } from './parts'
import { AuditTab, DocsTab, DraftsTab, OverviewTab } from './SidePanels'

type Tab = 'overview' | 'checklist' | 'docs' | 'drafts' | 'audit'

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="sme-between sme-small" style={{ padding: '5px 0' }}>
      <span className="sme-muted">{label}</span><span style={{ textAlign: 'right' }}>{children}</span>
    </div>
  )
}

export default function DossierView({
  caseId, catalog, coachOpen, syncTick, onBack, onToggleCoach, onAskCoach, onCaseMetaChange, onRegisterQuickDraft,
}: {
  caseId: string
  catalog: Catalog | null
  coachOpen: boolean
  syncTick: number
  onBack: () => void
  onToggleCoach: () => void
  onAskCoach: (prompt: string, mode?: 'prefill' | 'new_intake' | 'attach') => void
  onCaseMetaChange: (meta: { customerName?: string; readOnly: boolean; hasOpenItems: boolean } | null) => void
  onRegisterQuickDraft: (fn: (() => void) | null) => void
}) {
  const api = useAppApi()
  const [detail, setDetail] = useState<CaseDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [groupFilter, setGroupFilter] = useState<string | null>(null)
  const [focusDocId, setFocusDocId] = useState<string | null>(null)
  const [submitNote, setSubmitNote] = useState<string | null>(null)
  const [submitBusy, setSubmitBusy] = useState(false)
  const [reopenNote, setReopenNote] = useState<string | null>(null)
  const [reopenBusy, setReopenBusy] = useState(false)
  const [copiedHandover, setCopiedHandover] = useState(false)
  const lastSyncRef = useRef(0)
  const silentInFlightRef = useRef(false)

  const load = useCallback(async (silent = false) => {
    if (silent && silentInFlightRef.current) return
    if (silent) silentInFlightRef.current = true
    else setBusy(true)
    try {
      setDetail(await api.get<CaseDetail>(`${API}/cases/${caseId}`))
      setError(null)
      lastSyncRef.current = Date.now()
    } catch (e) {
      if (!silent) setError(errMsg(e))
    } finally {
      if (silent) silentInFlightRef.current = false
      else setBusy(false)
    }
  }, [api, caseId])

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

  const post = async (path: string, body: object): Promise<boolean> => {
    try {
      await api.post(`${API}/cases/${caseId}${path}`, body)
      return true
    } catch (e) {
      setError(errMsg(e))
      return false
    }
  }

  const setStatus = async (key: string, status: string, note = '', dueDate?: string) => {
    const payload: Record<string, unknown> = { key, status, note }
    if (dueDate !== undefined) payload.due_date = dueDate
    const ok = await post('/requirements', payload)
    if (ok) await load()
    return ok
  }

  const batchRequested = async (keys: string[], dueDate: string) => {
    const ok = await post('/requirements', { keys, status: 'requested', note: '', due_date: dueDate })
    if (ok) await load()
    return ok
  }

  const removeDocument = async (docId: string) => {
    const ok = await post(`/documents/${docId}/remove`, {})
    if (ok) await load()
    return ok
  }

  const downloadDocument = async (docId: string) => {
    try {
      const res = await api.get<DocumentFilePayload>(`${API}/cases/${caseId}/documents/${docId}/file`)
      const bin = atob(res.content_b64)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
      const blob = new Blob([bytes], { type: res.mime || 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const previewable = res.mime.startsWith('image/') || res.mime === 'application/pdf' || res.mime.startsWith('text/')
      if (previewable) {
        const win = window.open(url, '_blank', 'noopener')
        if (!win) {
          const a = document.createElement('a')
          a.href = url
          a.download = res.name
          a.click()
        }
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = res.name
        a.click()
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  const c = detail?.case
  const ov = detail?.overview
  const readOnly = Boolean(c?.submitted)
  const customer = c?.customer ?? {}
  const request = c?.request ?? {}
  const customerName = customer.name ? String(customer.name) : undefined
  const name = customerName || caseId

  const chat = (prompt: string) => onAskCoach(prompt || `Hồ sơ ${caseId}: `, 'prefill')
  const draft = (keys: string[], channel: DraftChannel = 'email', isReminder = false) => {
    const picked = (ov?.items ?? []).filter((i) => keys.includes(i.key))
    onAskCoach(buildDraftPrompt(caseId, picked, channel, isReminder), 'prefill')
  }
  const runAction = (a: Action) => {
    if (a.cta === 'draft') draft(a.keys, 'email', a.kind === 'remind' || a.kind === 'follow_up')
    else if (a.cta === 'submit') { setSubmitNote(''); setReopenNote(null) }
    else if (a.cta === 'chat') chat(a.prompt)
  }

  const copyHandover = async () => {
    if (!detail) return
    if (await copyText(buildLosHandoverText(detail, catalog))) {
      setCopiedHandover(true)
      setTimeout(() => setCopiedHandover(false), 1800)
    }
  }

  const applicableItems = useMemo(() => (ov?.items ?? []).filter((i) => !isSkipped(i)), [ov])
  // One completion figure, computed by the backend (`completion()`), so this page,
  // the dossier card and the table can never disagree.
  // An older backend sends no `progress`; recompute it the same way (`_counted`) then.
  const progress = useMemo(() => {
    if (ov?.progress) return ov.progress
    const mand = applicableItems.filter((i) => i.kind !== 'policy_precheck' && i.blocking)
    return {
      mandatory_total: mand.length,
      mandatory_done: mand.filter((i) => ['ok', 'resolved', 'waived'].includes(i.status)).length,
      to_request: mand.filter((i) => i.status === 'open').length,
      waiting: mand.filter((i) => i.status === 'requested').length,
    }
  }, [ov, applicableItems])
  const mandatoryTotal = progress.mandatory_total
  const mandatoryDone = progress.mandatory_done
  const actionableCount = progress.to_request
  const waitingCount = progress.waiting
  const openTabCount = useMemo(() => applicableItems.filter((i) => i.status === 'open' || i.status === 'requested').length, [applicableItems])
  const pendingDrafts = useMemo(() => (detail?.drafts ?? []).filter((d) => d.status === 'draft'), [detail])
  const waivedItems = useMemo(() => applicableItems.filter((i) => i.status === 'waived'), [applicableItems])
  const policyChecks = ov?.policy_checks ?? []
  const policyBreaches = useMemo(() => policyChecks.filter((p) => p.status === 'not_met'), [policyChecks])
  const purposeWarn = useMemo(() => (ov?.items ?? []).find((i) => i.key === 'policy:purpose'), [ov])
  const expiredDocs = useMemo(
    () => applicableItems.filter((i) => i.rule_status === 'FAIL' && i.status === 'open').length,
    [applicableItems],
  )
  const unclassifiedDocs = useMemo(() => (c?.documents ?? []).filter((d) => !d.type).length, [c])
  const todoItems = useMemo(
    () => applicableItems.filter((i) => (i.status === 'open' && i.blocking) || (i.status === 'requested' && i.due_date && i.due_date < (ov?.as_of ?? ''))),
    [applicableItems, ov],
  )
  const selectableOpenKeys = useMemo(
    () => applicableItems.filter((i) => isCustomerRequestable(i) && (i.status === 'open' || i.status === 'requested')).map((i) => i.key),
    [applicableItems],
  )

  useEffect(() => {
    onCaseMetaChange({ customerName, readOnly, hasOpenItems: selectableOpenKeys.length > 0 })
  }, [customerName, readOnly, selectableOpenKeys.length, onCaseMetaChange])

  const quickDraftFnRef = useRef<() => void>(() => {})
  quickDraftFnRef.current = () => draft(selectableOpenKeys, 'email', false)
  useEffect(() => {
    onRegisterQuickDraft(() => quickDraftFnRef.current())
    return () => onRegisterQuickDraft(null)
  }, [onRegisterQuickDraft])

  const profileMap = useMemo(() => new Map((ov?.profile ?? []).map((p) => [p.path, p.value])), [ov])

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'checklist', label: 'Danh mục kiểm tra', count: openTabCount || undefined },
    { key: 'docs', label: 'Chứng từ', count: c?.documents.length || undefined },
    { key: 'drafts', label: 'Thư yêu cầu KH', count: pendingDrafts.length || detail?.drafts.length || undefined },
    { key: 'audit', label: 'Audit' },
  ]

  return (
    <div className="sme-scroll" style={{ paddingTop: 16 }}>
      <div className="sme-hero">
        <div style={{ minWidth: 0 }}>
          <button type="button" className="sme-back" onClick={onBack}><ArrowLeft size={14} /> Danh mục hồ sơ</button>
          <h1 className="sme-title">{name}</h1>
          <div className="sme-row sme-wrap" style={{ gap: 6 }}>
            {ov && <StagePill stage={ov.stage} />}
            {ov?.checklist_overall && (
              <Pill t={overallStatus(ov.checklist_overall).tone}
                title={`Kiểm tra quy tắc Master Checklist: ${checklistSummary(ov.checklist_counts)}`}>
                {overallStatus(ov.checklist_overall).label}
              </Pill>
            )}
            <span className="sme-chip sme-mono">{caseId}</span>
            {c && <span className="sme-chip">Luồng {c.flow}</span>}
            {customer.tax_id && <span className="sme-chip">MST {String(customer.tax_id)}</span>}
            {customer.industry_code && <span className="sme-chip">Ngành {String(customer.industry_code)}</span>}
            {request.product_code && <span className="sme-chip">{String(request.product_code)}</span>}
            {request.purpose && <span className="sme-chip">{PURPOSE[request.purpose] ?? request.purpose}</span>}
            {c && <span className="sme-small sme-muted">Khởi tạo {when(c.created_at)}</span>}
          </div>
        </div>
        <div className="sme-row sme-wrap">
          <Btn onClick={() => load()} busy={busy} title="Tải lại dữ liệu"><RefreshCw size={14} /></Btn>
          <Btn
            className={coachOpen ? 'sme-toggle-on' : undefined}
            aria-pressed={coachOpen}
            onClick={onToggleCoach}
            title={coachOpen ? 'Thu gọn trợ lý hồ sơ' : 'Mở trợ lý hồ sơ bên phải'}
          >
            <MessageSquare size={14} /> Trợ lý hồ sơ
          </Btn>
          {!readOnly ? (
            <Btn primary onClick={() => { setSubmitNote(''); setReopenNote(null) }}>
              <ClipboardCheck size={14} /> {ov?.readiness.ready ? 'Bàn giao Thẩm định' : 'Trình kèm giải trình'}
            </Btn>
          ) : (
            <Btn onClick={() => setReopenNote('')}><Unlock size={14} /> Mở lại hồ sơ</Btn>
          )}
        </div>
      </div>

      {error && <div style={{ marginBottom: 16 }}><ErrorNotice title="Có lỗi khi làm việc với hồ sơ">{error}</ErrorNotice></div>}
      {!detail && !error && (
        <div className="sme-card sme-stack"><div className="sme-skel" style={{ width: '50%' }} /><div className="sme-skel" /></div>
      )}

      {detail && c && ov && (
        <>
          <div className="sme-kpis" style={{ marginBottom: 12 }}>
            <Kpi icon={<Landmark size={18} />} label="Số tiền đề nghị"
              value={request.amount ? money(request.amount).replace(' đ', '') : '—'}
              hint={[request.term_months ? `${request.term_months} tháng` : null, request.product_code, 'VND'].filter(Boolean).join(' · ')} />
            <Kpi t={ov.readiness.ready ? 'ok' : actionableCount > 0 ? 'danger' : 'warn'}
              icon={<ClipboardList size={18} />} label="Hạng mục bắt buộc (A–I)"
              value={`${mandatoryDone} / ${mandatoryTotal}`}
              hint={`${actionableCount} cần bổ sung · ${waitingCount} chờ KH`} />
            <Kpi t={expiredDocs ? 'danger' : unclassifiedDocs ? 'warn' : c.documents.length ? 'ok' : 'muted'}
              icon={<FileText size={18} />} label="Chứng từ lưu trữ" value={c.documents.length}
              hint={expiredDocs ? `${expiredDocs} không đạt rule` : unclassifiedDocs ? `${unclassifiedDocs} chưa phân loại` : 'Đã đối chiếu danh mục'} />
            <Kpi t={policyChecks.length === 0 ? 'muted' : policyBreaches.length > 0 ? 'danger' : 'ok'}
              icon={<ShieldCheck size={18} />} label="Điều kiện chính sách"
              value={policyChecks.length === 0 ? '—' : policyBreaches.length > 0 ? `${policyBreaches.length} chưa đạt` : 'Đạt sơ bộ'}
              hint={policyChecks.length > 0 ? `${policyChecks.length} tiêu chí · ${request.product_code ?? ''}` : 'Chưa chọn mã sản phẩm'} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <GroupStepper groups={ov.groups} activeGroup={groupFilter}
              onSelectGroup={(g) => { setGroupFilter(g); setTab('checklist') }} />
          </div>

          {reopenNote !== null && c.submitted && (
            <div className="sme-card sme-review t-warn" style={{ marginBottom: 16 }}>
              <div className="sme-strong">Mở lại hồ sơ đã bàn giao</div>
              <div className="sme-small sme-muted" style={{ margin: '4px 0 8px' }}>
                Chỉ mở lại khi bộ phận Thẩm định yêu cầu bổ sung chứng từ mới. Ghi rõ lý do để lưu nhật ký kiểm toán.
              </div>
              <textarea className="sme-textarea" value={reopenNote} onChange={(e) => setReopenNote(e.target.value)}
                placeholder="Ví dụ: Thẩm định yêu cầu bổ sung BCTC quý gần nhất" />
              <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                <Btn onClick={() => setReopenNote(null)}>Huỷ</Btn>
                <Btn primary busy={reopenBusy} disabled={!reopenNote.trim()} onClick={async () => {
                  setReopenBusy(true)
                  const ok = await post('/reopen', { note: reopenNote })
                  if (ok) { setReopenNote(null); await load() }
                  setReopenBusy(false)
                }}><Unlock size={14} /> Xác nhận mở lại</Btn>
              </div>
            </div>
          )}

          {submitNote !== null && !c.submitted && (
            <div className="sme-card sme-review t-accent" style={{ marginBottom: 16 }}>
              <div className="sme-between sme-wrap">
                <div className="sme-strong">Xác nhận bàn giao hồ sơ sang Thẩm định (LOS)</div>
                <Btn onClick={copyHandover}>
                  {copiedHandover ? <Check size={13} /> : <Copy size={13} />} {copiedHandover ? 'Đã chép phiếu' : 'Sao chép phiếu bàn giao LOS'}
                </Btn>
              </div>
              <div className="sme-small sme-muted" style={{ margin: '6px 0 8px' }}>
                Hạng mục áp dụng: <b>{mandatoryDone}/{mandatoryTotal}</b> · Chứng từ: <b>{c.documents.length}</b> ·
                Xin miễn: <b>{waivedItems.length}</b> · Cảnh báo sơ bộ: <b>{policyBreaches.length}</b>.
                Hệ thống sẽ đồng bộ hồ sơ và chứng từ sang ứng dụng <b>Thẩm định SME</b> qua Handover Adapter.
                {ov.readiness.ready ? ' Ghi chú bàn giao không bắt buộc.' : ` Còn ${ov.readiness.blocking_open.length} mục chặn nên bắt buộc ghi giải trình.`}
              </div>
              {waivedItems.length > 0 && (
                <div className="sme-small" style={{ marginBottom: 8 }}>
                  <b>Mục xin miễn:</b> {waivedItems.map((w) => `${w.title} (${w.note})`).join('; ')}
                </div>
              )}
              <textarea className="sme-textarea" value={submitNote} onChange={(e) => setSubmitNote(e.target.value)}
                placeholder={ov.readiness.ready ? 'Ghi chú bàn giao (tuỳ chọn)' : 'Ghi rõ giải trình khi trình dù còn hạng mục chặn (bắt buộc)'} />
              <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                <Btn onClick={() => setSubmitNote(null)}>Huỷ</Btn>
                <Btn primary busy={submitBusy} disabled={!ov.readiness.ready && !submitNote.trim()}
                  onClick={async () => {
                    setSubmitBusy(true)
                    const ok = await post('/submitted', { note: submitNote })
                    if (ok) { setSubmitNote(null); await load() }
                    setSubmitBusy(false)
                  }}><ClipboardCheck size={14} /> Xác nhận đã bàn giao</Btn>
              </div>
            </div>
          )}

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

              {tab === 'overview' && (
                <OverviewTab detail={detail} catalog={catalog} pendingDraftsCount={pendingDrafts.length}
                  purposeWarn={purposeWarn} readOnly={readOnly}
                  goDrafts={() => setTab('drafts')} onAction={runAction} onChat={chat} />
              )}
              {tab === 'checklist' && (
                <ItemsPanel items={ov.items} asOf={ov.as_of} catalog={catalog} groupFilter={groupFilter}
                  onClearGroup={() => setGroupFilter(null)} readOnly={readOnly}
                  onSet={setStatus} onBatchRequested={batchRequested} onDraft={draft}
                  onOpenDoc={(id) => { setFocusDocId(id); setTab('docs') }} />
              )}
              {tab === 'docs' && (
                <DocsTab docs={c.documents} items={ov.items} profile={ov.profile} catalog={catalog}
                  focusDocId={focusDocId} readOnly={readOnly}
                  onDownload={downloadDocument} onRemove={removeDocument}
                  onExtractDoc={(docId) => onAskCoach(`Đọc lại và cập nhật thông tin từ chứng từ ${docId} của hồ sơ ${caseId}.`, 'prefill')}
                  onUpload={() => onAskCoach('', 'attach')} />
              )}
              {tab === 'drafts' && (
                <DraftsTab drafts={detail.drafts} items={ov.items} readOnly={readOnly}
                  hasOpenItems={selectableOpenKeys.length > 0}
                  onCompose={(ch) => draft(selectableOpenKeys, ch, false)}
                  onSent={async (id, dueDate) => {
                    const ok = await post(`/drafts/${id}/sent`, { due_date: dueDate })
                    if (ok) await load()
                    return ok
                  }} />
              )}
              {tab === 'audit' && <AuditTab audit={detail.audit} />}
            </div>

            <aside className="sme-aside">
              <div className="sme-card">
                <div className="sme-between" style={{ marginBottom: 4 }}>
                  <h3 className="sme-h3">Hạng mục cần xử lý</h3>
                  <Pill t={todoItems.length ? 'warn' : 'ok'}>{todoItems.length}</Pill>
                </div>
                {todoItems.length === 0 && (
                  <div className="sme-small sme-muted" style={{ padding: '8px 0' }}>Không còn hạng mục chặn mở.</div>
                )}
                {todoItems.slice(0, 6).map((i) => (
                  <button key={i.key} type="button" className="sme-todo"
                    onClick={() => { setGroupFilter(i.group); setTab('checklist') }}>
                    <Pill t={i.status === 'requested' ? 'danger' : 'warn'}>
                      {i.status === 'requested' ? 'Quá hạn' : 'Thiếu'}
                    </Pill>
                    <span className="sme-todo-text">{i.title}</span>
                  </button>
                ))}
                {todoItems.length > 6 && (
                  <button type="button" className="sme-ref" style={{ marginTop: 6 }} onClick={() => setTab('checklist')}>
                    Xem thêm {todoItems.length - 6} mục
                  </button>
                )}
              </div>

              <div className="sme-card">
                <h3 className="sme-h3" style={{ marginBottom: 6 }}>Định danh &amp; Tóm tắt</h3>
                <Fact label="Mã số thuế">{String(customer.tax_id ?? '—')}</Fact>
                <Fact label="CIF">{String(customer.cif ?? '—')}</Fact>
                <Fact label="Người đại diện">{String(customer.legal_rep ?? '—')}</Fact>
                <Fact label="Số năm hoạt động">{showValue('facts.years_in_operation', profileMap.get('facts.years_in_operation') ?? customer.years_in_operation, catalog)}</Fact>
                <Fact label="Vốn điều lệ">{showValue('customer.charter_capital', customer.charter_capital, catalog)}</Fact>
                <Fact label="Doanh thu gần nhất">{showValue('facts.revenue_last_year', profileMap.get('facts.revenue_last_year'), catalog)}</Fact>
                {request.proposal && (
                  <div className="sme-small" style={{ marginTop: 8 }}>
                    <div className="sme-section-title" style={{ marginBottom: 4 }}>Đề xuất ĐVKD</div>
                    {String(request.proposal)}
                  </div>
                )}
              </div>

              <div className="sme-card sme-stack" style={{ gap: 8 }}>
                <div className="sme-between">
                  <h3 className="sme-h3">Bàn giao LOS</h3>
                  <StagePill stage={ov.stage} />
                </div>
                <div className="sme-small sme-muted">
                  {waivedItems.length > 0 ? `${waivedItems.length} mục xin miễn kèm giải trình.` : 'Chưa có mục xin miễn.'}
                </div>
                <Btn onClick={copyHandover}>
                  {copiedHandover ? <Check size={13} /> : <Copy size={13} />} {copiedHandover ? 'Đã chép phiếu' : 'Chép phiếu bàn giao'}
                </Btn>
                {!readOnly && (
                  <Btn primary onClick={() => { setSubmitNote(''); setReopenNote(null) }}>
                    <ClipboardCheck size={13} /> {ov.readiness.ready ? 'Bàn giao Thẩm định' : 'Trình kèm giải trình'}
                  </Btn>
                )}
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
