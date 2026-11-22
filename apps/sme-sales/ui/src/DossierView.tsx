import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, ErrorNotice } from '@kirocrew/app-sdk/ui'
import { ArrowLeft, ClipboardCheck, FileText, Landmark, Mail, MessageSquare, RefreshCw, Send } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useAgentChat } from '@sme-ui/chat'
import { Banner, Kpi } from '@sme-ui/ui'
import DocumentsTab from './DocumentsTab'
import DraftsTab from './DraftsTab'
import GapsTab from './GapsTab'
import InfoTab from './InfoTab'
import {
  API, AUDIT_LABEL, PURPOSE, actor, errMsg, isOpen, moneyShort, when, type CaseDetail, type Catalog, type Overview,
} from './model'
import { Score, StagePill } from './parts'

type Tab = 'gaps' | 'documents' | 'info' | 'drafts' | 'audit'
const COACH = 'dossier-coach'

export default function DossierView({ caseId, catalog, onBack }: { caseId: string; catalog: Catalog | null; onBack: () => void }) {
  const api = useAppApi()
  const [detail, setDetail] = useState<CaseDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<Tab>('gaps')
  const [submitNote, setSubmitNote] = useState<string | null>(null)
  const openCoach = useAgentChat(COACH, 'sme-sales-chat-', setError)

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

  /** Run a write; on success reload, so the gap list always reflects the server. */
  const write = async (path: string, body: object): Promise<boolean> => {
    try {
      await api.post<{ overview: Overview }>(`${API}/cases/${caseId}${path}`, body)
      await load()
      return true
    } catch (e) {
      setError(errMsg(e))
      return false
    }
  }

  const c = detail?.case
  const ov = detail?.overview
  const name = String(c?.customer?.name || caseId)
  const title = `Hồ sơ ${name}`
  const review = () => openCoach(`Rà soát hồ sơ ${caseId}: đọc chứng từ, điền thông tin còn trống và cho tôi biết còn thiếu gì.`, caseId, title)
  const draft = (keys: string[]) => {
    const labels = (ov?.items ?? []).filter((i) => keys.includes(i.key)).map((i) => `- ${i.title} [${i.key}]`).join('\n')
    openCoach(`Soạn email xin khách bổ sung cho hồ sơ ${caseId} các mục sau:\n${labels}`, caseId, title)
  }
  const openCount = ov?.items.filter(isOpen).length ?? 0

  return (
    <div className="sme-scroll" style={{ paddingTop: 16 }}>
      <div className="sme-hero">
        <div style={{ minWidth: 0 }}>
          <button type="button" className="sme-back" onClick={onBack}><ArrowLeft size={14} /> Tất cả hồ sơ</button>
          <h1 className="sme-title">{name}</h1>
          <div className="sme-row sme-wrap" style={{ gap: 6 }}>
            <span className="sme-chip sme-mono">{caseId}</span>
            {c && <span className="sme-chip">Luồng {c.flow}</span>}
            {c?.request?.product_code && <span className="sme-chip">{String(c.request.product_code)}</span>}
            {c?.request?.purpose && <span className="sme-chip">{PURPOSE[c.request.purpose] ?? c.request.purpose}</span>}
            {ov && <StagePill stage={ov.stage} />}
          </div>
        </div>
        <div className="sme-row sme-wrap">
          <Btn onClick={load} busy={busy} title="Tải lại"><RefreshCw size={14} /></Btn>
          <Btn onClick={() => draft(ov?.items.filter((i) => isOpen(i) && i.blocking && i.ask).map((i) => i.key) ?? [])}>
            <Mail size={14} /> Soạn thư cho khách</Btn>
          <Btn primary onClick={review}><MessageSquare size={14} /> Rà soát với trợ lý</Btn>
        </div>
      </div>

      {error && <div style={{ marginBottom: 16 }}><ErrorNotice title="Có lỗi khi làm việc với hồ sơ">{error}</ErrorNotice></div>}
      {!detail && !error && <div className="sme-card sme-stack"><div className="sme-skel" style={{ width: '50%' }} /><div className="sme-skel" /></div>}

      {detail && c && ov && (
        <>
          <div className="sme-kpis" style={{ marginBottom: 12 }}>
            <Kpi icon={<ClipboardCheck size={18} />} label="Điểm hoàn thiện" value={<Score value={ov.readiness.score} />}
              hint={ov.readiness.ready ? 'Đủ để nộp' : `${ov.readiness.blocking_open.length} mục chặn nộp`}
              t={ov.readiness.ready ? 'ok' : 'warn'} />
            <Kpi t={openCount ? 'warn' : 'ok'} icon={<Send size={18} />} label="Mục còn mở" value={openCount}
              hint={`${ov.items.filter((i) => i.status === 'requested').length} đang chờ khách`} />
            <Kpi icon={<FileText size={18} />} label="Chứng từ" value={c.documents.length} />
            <Kpi icon={<Landmark size={18} />} label="Số tiền đề nghị" value={moneyShort(c.request?.amount)}
              hint={c.request?.term_months ? `${c.request.term_months} tháng` : undefined} />
          </div>

          {c.submitted
            ? <div style={{ marginBottom: 12 }}><Banner t="info">Đã đánh dấu nộp ngày {when(c.submitted.at)}{c.submitted.note ? ` · ${c.submitted.note}` : ''}.</Banner></div>
            : submitNote !== null
              ? (
                <div className="sme-card" style={{ marginBottom: 12 }}>
                  <div className="sme-strong">Đánh dấu đã nộp Thẩm định</div>
                  <div className="sme-small sme-muted" style={{ margin: '4px 0 8px' }}>
                    Nộp trên hệ thống trung tâm vẫn làm thủ công. {ov.readiness.ready ? 'Ghi chú không bắt buộc.' : 'Hồ sơ còn mục chặn nộp: bắt buộc ghi lý do.'}
                  </div>
                  <textarea className="sme-textarea" value={submitNote} onChange={(e) => setSubmitNote(e.target.value)} />
                  <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                    <Btn onClick={() => setSubmitNote(null)}>Huỷ</Btn>
                    <Btn primary disabled={!ov.readiness.ready && !submitNote.trim()}
                      onClick={async () => { if (await write('/submitted', { note: submitNote })) setSubmitNote(null) }}>Xác nhận đã nộp</Btn>
                  </div>
                </div>
              )
              : (
                <div className="sme-row" style={{ justifyContent: 'flex-end', marginBottom: 12 }}>
                  <Btn primary={ov.readiness.ready} onClick={() => setSubmitNote('')}><Send size={14} /> Đánh dấu đã nộp</Btn>
                </div>
              )}

          <div className="sme-tabs" role="tablist">
            {([['gaps', 'Còn thiếu', openCount], ['documents', 'Chứng từ', c.documents.length], ['info', 'Thông tin', null],
              ['drafts', 'Thư khách hàng', detail.drafts.filter((d) => d.status === 'draft').length], ['audit', 'Nhật ký', null]] as [Tab, string, number | null][])
              .map(([k, l, n]) => (
                <button key={k} type="button" role="tab" aria-selected={tab === k} className={`sme-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>
                  {l}{n ? <span className="sme-count">{n}</span> : null}
                </button>
              ))}
          </div>

          {tab === 'gaps' && <GapsTab overview={ov} catalog={catalog} onDraft={draft}
            onSet={(key, status, note, due) => write('/requirements', { key, status, note, due_date: due ?? '' })} />}
          {tab === 'documents' && <DocumentsTab docs={c.documents} catalog={catalog}
            onUpload={(doc) => write('/documents', doc)} onSave={(id, patch) => write(`/documents/${id}`, patch)} />}
          {tab === 'info' && <InfoTab key={JSON.stringify([c.customer, c.request, c.facts])} c={c} catalog={catalog} onSave={(p) => write('/fields', p)} />}
          {tab === 'drafts' && <DraftsTab drafts={detail.drafts} items={ov.items} onNew={() => setTab('gaps')}
            onSent={(id) => write(`/drafts/${id}/sent`, {})} />}
          {tab === 'audit' && (
            <div className="sme-card"><div className="sme-tl">
              {[...detail.audit].reverse().map((a, i) => (
                <div key={i} className="sme-tl-item">
                  <div className="sme-strong sme-small">{AUDIT_LABEL[a.action] ?? a.action}</div>
                  <div className="sme-small sme-muted">{when(a.ts)} · {actor(String(a.actor ?? a.agent ?? a.author ?? ''))}
                    {a.key ? ` · ${String(a.key)}` : ''}{a.status ? ` → ${String(a.status)}` : ''}{a.id ? ` · ${String(a.id)}` : ''}</div>
                </div>
              ))}
            </div></div>
          )}
        </>
      )}
    </div>
  )
}
