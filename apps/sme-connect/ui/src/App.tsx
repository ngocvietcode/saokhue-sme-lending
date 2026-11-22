import { useAppApi } from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import {
  ArrowLeft, Ban, CheckCircle2, FileOutput, History, Layers,
  MessageSquare, RefreshCw, Save, Send, Shuffle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AssistantDock, {
  clampDockWidth, readDockOpen, readDockWidth, useAssistantSync, writeDockOpen, writeDockWidth,
  type AssistantIntent, type CreatedCaseBanner, type DockChip,
} from '@sme-ui/AssistantDock'
import { errMsg, moneyShort, when } from '@sme-ui/format'
import { ensureStyles } from '@sme-ui/styles'
import CaseListView from './CaseListView'
import { StepEvaluation, StepProposalAndDiff } from './StepEvaluationAndProposal'
import StepNegotiationAndDrafting from './StepNegotiationAndDetail'
import StepOcrAndB4 from './StepOcrAndB4'
import StepUploadAndChecklist from './StepUploadAndChecklist'
import { API, CHAT_PREFIX, COPILOT_AGENT, type Catalog, type FullCase } from './model'
import { ensureSmecStyles } from './smecStyles'

ensureStyles()
ensureSmecStyles()

const OPEN_KEY = 'sme-connect:copilot-open'
const WIDTH_KEY = 'sme-connect:copilot-width'

const WIZARD_STEPS = [
  { step: 1, title: 'Tải lên hồ sơ', hint: 'Phân loại & Check chéo' },
  { step: 2, title: 'Kiểm tra OCR', hint: '6 nhóm & Mẫu Excel B4' },
  { step: 3, title: 'Hệ thống đánh giá', hint: '9 Agents + Verifier' },
  { step: 4, title: 'Tạo tờ trình', hint: 'MB02.PL03 QR & Diff' },
  { step: 5, title: 'Thương lượng', hint: 'Nghị quyết ELOS & B2B' },
]

export default function SmeConnectApp() {
  const api = useAppApi()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [activeCase, setActiveCase] = useState<FullCase | null>(null)
  const [viewMode, setViewMode] = useState<'wizard' | 'tabs'>('wizard')
  const [wizardStep, setWizardStep] = useState<number>(1)
  const [detailTab, setDetailTab] = useState<'demand' | 'docs' | 'customer' | 'negotiation' | 'history'>('demand')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [actionErr, setActionErr] = useState('')

  // Embedded Copilot Dock
  const [dockOpen, setDockOpenState] = useState<boolean>(() => readDockOpen(OPEN_KEY))
  const [dockWidth, setDockWidthState] = useState<number>(() => readDockWidth(WIDTH_KEY))
  const [intent, setIntent] = useState<AssistantIntent | null>(null)
  const [createdBanner, setCreatedBanner] = useState<CreatedCaseBanner | null>(null)
  const intentSeq = useRef(0)
  const { syncTick } = useAssistantSync(dockOpen, 4000)

  useEffect(() => {
    api.get<Catalog>(`${API}/catalog`).then(setCatalog).catch(() => setCatalog(null))
  }, [api])

  const loadCase = useCallback((id: string) => {
    api.get<FullCase>(`${API}/cases/${id}`)
      .then((res) => {
        setActiveCase(res)
        setWizardStep(res.case.smec.wizard_step || 1)
        setActionErr('')
      })
      .catch((e) => setActionErr(errMsg(e)))
  }, [api])

  useEffect(() => {
    if (caseId) loadCase(caseId)
  }, [caseId, syncTick, loadCase])

  const setDockOpen = useCallback((next: boolean | ((p: boolean) => boolean)) => {
    setDockOpenState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next
      writeDockOpen(OPEN_KEY, val)
      return val
    })
  }, [])

  const setDockWidth = useCallback((w: number) => {
    const c = clampDockWidth(w)
    setDockWidthState(c)
    writeDockWidth(WIDTH_KEY, c)
  }, [])

  const askCopilot = useCallback((prompt: string, mode: AssistantIntent['mode'] = 'prefill') => {
    setDockOpen(true)
    setIntent({ id: ++intentSeq.current, prompt, mode })
  }, [setDockOpen])

  const runLifecycleAction = async (action: string, payload: Record<string, unknown> = {}) => {
    if (!caseId) return
    setActionErr('')
    setActionMsg('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/action`, {
        action,
        payload: { ...payload, wizard_step: wizardStep },
      })
      setActiveCase(next)
      setWizardStep(next.case.smec.wizard_step || wizardStep)
      setActionMsg(`Đã thực hiện hành động: ${action}`)
      if (action === 'generate_proposal') setWizardStep(4)
      if (action === 'submit_approval' || action === 'submit_los') setWizardStep(5)
    } catch (e) {
      setActionErr(errMsg(e))
    }
  }

  const chips = useMemo<DockChip[]>(() => {
    if (!caseId || !activeCase) {
      return [
        { label: 'Tổng quan hồ sơ', prompt: 'Liệt kê các hồ sơ trên SME Connect và chỉ ra việc cần làm tiếp theo cho CBBH.' },
        { label: 'Gợi ý gói sản phẩm', prompt: 'Tra cứu MST 0108924510 với nhu cầu 17 tỷ có TSBĐ và tư vấn gói đa sản phẩm phù hợp.' },
      ]
    }
    return [
      {
        label: 'Rà soát OCR & Mẫu B4',
        prompt: `Kiểm tra hồ sơ ${caseId}: liệt kê các trường OCR Chưa đủ tin cậy/Thiếu, trạng thái file Excel Mẫu B4 và 7 rule đối chiếu chéo.`,
      },
      {
        label: 'Soạn thư xin chứng từ',
        prompt: `Soạn thư gửi khách hàng ${String(activeCase.case.customer.name || '')} bổ sung các chứng từ còn thiếu và làm rõ điểm chênh lệch hồ sơ ${caseId}.`,
      },
      {
        label: 'Chạy 9 Agents',
        prompt: `Chạy workflow smec-credit-assessment cho hồ sơ ${caseId} và tóm tắt căn cứ lập Tờ trình MB02.PL03.`,
      },
    ]
  }, [caseId, activeCase])

  return (
    <div className="sme" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="sme-workspace">
        <div className="sme-main">
          {!caseId ? (
            <CaseListView
              catalog={catalog}
              assistantOpen={dockOpen}
              syncTick={syncTick}
              onOpen={(id) => { setActiveCase(null); setCaseId(id) }}
              onToggleAssistant={() => setDockOpen((v) => !v)}
              onAskAssistant={askCopilot}
            />
          ) : !activeCase ? (
            <div className="sme-scroll">
              <button className="sme-back" onClick={() => setCaseId(null)}><ArrowLeft size={14} /> Danh sách hồ sơ</button>
              <div className="sme-card sme-muted">{actionErr || 'Đang tải chi tiết hồ sơ SME Connect...'}</div>
            </div>
          ) : (
            <div className="sme-scroll">
              {/* Case Header with Dual IDs & Mode Switcher */}
              <div className="sme-hero">
                <div>
                  <button className="sme-back" onClick={() => { setCaseId(null); setActiveCase(null) }}>
                    <ArrowLeft size={14} /> Danh sách hồ sơ SME Connect
                  </button>
                  <div className="sme-row sme-wrap" style={{ marginBottom: 4 }}>
                    <span className="sme-mono sme-strong">{activeCase.case.smec.smec_id}</span>
                    {activeCase.case.smec.nclos_id && (
                      <span className="sme-chip sme-mono">NCLOS: {activeCase.case.smec.nclos_id}</span>
                    )}
                    {activeCase.case.smec.elos_id && (
                      <span className="sme-chip sme-mono">ELOS: {activeCase.case.smec.elos_id}</span>
                    )}
                    <span className={`sme-pill t-${activeCase.case.status_meta.tone}`}>
                      • {activeCase.case.status_meta.detail_status_label}
                    </span>
                    <span className="sme-chip">DS: {activeCase.case.status_meta.list_status_label}</span>
                  </div>
                  <h1 className="sme-title">{String(activeCase.case.customer.name || '')}</h1>
                  <div className="sme-small sme-muted">
                    ĐKKD/MST: <b className="sme-mono">{String(activeCase.case.customer.tax_id || '')}</b> ·
                    CIF: <b className="sme-mono">{String(activeCase.case.customer.cif || '')}</b> ·
                    Tổng hạn mức đề xuất: <b>{moneyShort((activeCase.case.smec?.proposed_products || []).reduce((s, p) => s + (p.proposed_limit || 0), 0))}</b>
                  </div>
                </div>

                <div className="sme-row sme-wrap">
                  <div className="sme-filters">
                    <button className={`sme-filter ${viewMode === 'wizard' ? 'on' : ''}`} onClick={() => setViewMode('wizard')}>
                      Luồng A · Wizard 5 bước
                    </button>
                    <button className={`sme-filter ${viewMode === 'tabs' ? 'on' : ''}`} onClick={() => setViewMode('tabs')}>
                      Quản lý · 5 Tab chi tiết
                    </button>
                  </div>
                  <Btn variant="ghost" onClick={() => setDockOpen((v) => !v)}>
                    <MessageSquare size={14} /> {dockOpen ? 'Ẩn Copilot' : 'Copilot'}
                  </Btn>
                </div>
              </div>

              {/* 9 Standard Lifecycle Actions Bar (`node-id=9:2201` List hành động) */}
              <div className="smec-action-bar">
                <Btn variant="secondary" onClick={() => runLifecycleAction('generate_proposal')}>
                  <FileOutput size={13} /> Tạo tờ trình
                </Btn>
                <Btn variant="ghost" onClick={() => runLifecycleAction('save_draft')}>
                  <Save size={13} /> Lưu
                </Btn>
                <Btn variant="ghost" onClick={() => runLifecycleAction('update_case')}>
                  <RefreshCw size={13} /> Cập nhật
                </Btn>
                <Btn variant="primary" onClick={() => runLifecycleAction('submit_approval')}>
                  <Send size={13} /> Trình duyệt hồ sơ
                </Btn>
                <Btn variant="secondary" onClick={() => runLifecycleAction('submit_los')}>
                  Submit LOS
                </Btn>
                <Btn variant="secondary" onClick={() => runLifecycleAction('send_b2b_confirm')}>
                  Chuyển KH xác nhận
                </Btn>
                <Btn variant="ghost" onClick={() => runLifecycleAction('mark_b2b_done')}>
                  <CheckCircle2 size={13} /> Đã có B2B
                </Btn>
                <Btn variant="ghost" onClick={() => runLifecycleAction('switch_offline')}>
                  <Shuffle size={13} /> Chuyển luồng offline
                </Btn>
                <Btn variant="ghost" onClick={() => setCancelModalOpen(true)}>
                  <Ban size={13} /> Huỷ hồ sơ
                </Btn>
              </div>

              {actionErr && (
                <div className="sme-card tight" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: 12 }}>
                  {actionErr}
                </div>
              )}
              {actionMsg && (
                <div className="sme-card tight" style={{ borderColor: 'var(--ok)', color: 'var(--ok)', marginBottom: 12 }}>
                  {actionMsg}
                </div>
              )}
              {(activeCase.case.smec.cancel_reason || activeCase.case.smec.reject_reason) && (
                <div className="sme-card tight" style={{ borderColor: 'var(--danger)', marginBottom: 12 }}>
                  <b>Lý do hủy / từ chối:</b> {activeCase.case.smec.cancel_reason || activeCase.case.smec.reject_reason}
                </div>
              )}

              {viewMode === 'wizard' ? (
                <>
                  {/* 5-Step Wizard Navigation */}
                  <div className="smec-wizard-bar">
                    {WIZARD_STEPS.map((ws) => {
                      const isDone = ws.step < (activeCase.case.smec.wizard_step || 1)
                      const isActive = ws.step === wizardStep
                      return (
                        <button
                          key={ws.step}
                          className={`smec-wiz-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                          onClick={() => setWizardStep(ws.step)}
                        >
                          <span className="smec-wiz-num">{isDone ? '✓' : ws.step}</span>
                          <div>
                            <div className="sme-strong" style={{ fontSize: 12.5 }}>{ws.title}</div>
                            <div className="sme-small sme-muted" style={{ fontSize: 11 }}>{ws.hint}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {wizardStep === 1 && (
                    <StepUploadAndChecklist
                      data={activeCase}
                      catalog={catalog}
                      onRefresh={setActiveCase}
                      onNextStep={() => setWizardStep(2)}
                      onAskAssistant={askCopilot}
                    />
                  )}
                  {wizardStep === 2 && (
                    <StepOcrAndB4
                      data={activeCase}
                      agentGroups={catalog?.agent_groups || []}
                      onRefresh={setActiveCase}
                      onNextStep={() => setWizardStep(3)}
                    />
                  )}
                  {wizardStep === 3 && (
                    <StepEvaluation
                      data={activeCase}
                      onRefresh={setActiveCase}
                      onNextStep={() => setWizardStep(4)}
                      onAskAssistant={askCopilot}
                    />
                  )}
                  {wizardStep === 4 && (
                    <StepProposalAndDiff
                      data={activeCase}
                      onRefresh={setActiveCase}
                      onSubmitLos={() => runLifecycleAction('submit_approval')}
                    />
                  )}
                  {wizardStep === 5 && (
                    <StepNegotiationAndDrafting
                      data={activeCase}
                      onRefresh={setActiveCase}
                    />
                  )}
                </>
              ) : (
                /* 5-Tab Case Management View (`node-id=9:2201`) */
                <div className="sme-stack">
                  <div className="sme-tabs">
                    <button className={`sme-tab ${detailTab === 'demand' ? 'on' : ''}`} onClick={() => setDetailTab('demand')}>
                      <Layers size={14} /> Nhu cầu cấp tín dụng
                    </button>
                    <button className={`sme-tab ${detailTab === 'docs' ? 'on' : ''}`} onClick={() => setDetailTab('docs')}>
                      Hồ sơ tải lên <span className="sme-count">{activeCase.case.documents.length}</span>
                    </button>
                    <button className={`sme-tab ${detailTab === 'customer' ? 'on' : ''}`} onClick={() => setDetailTab('customer')}>
                      Thông tin chi tiết khách hàng
                    </button>
                    <button className={`sme-tab ${detailTab === 'negotiation' ? 'on' : ''}`} onClick={() => setDetailTab('negotiation')}>
                      Thương lượng nghị quyết <span className="sme-count">{activeCase.resolution.comments.length}</span>
                    </button>
                    <button className={`sme-tab ${detailTab === 'history' ? 'on' : ''}`} onClick={() => setDetailTab('history')}>
                      <History size={14} /> Lịch sử hồ sơ <span className="sme-count">{activeCase.audit.length}</span>
                    </button>
                  </div>

                  {detailTab === 'demand' && (
                    <div className="sme-card">
                      <div className="sme-h2" style={{ marginBottom: 10 }}>Gói Đa sản phẩm & Cam kết CBBH</div>
                      <table className="smec-table">
                        <thead>
                          <tr>
                            <th>Mã SP</th>
                            <th>Tên sản phẩm trên SME Connect</th>
                            <th>Độ phù hợp AI</th>
                            <th>Hạn mức đề xuất</th>
                            <th>Thời hạn</th>
                            <th>Bảo đảm</th>
                            <th>Cam kết CBBH</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeCase.case.smec.proposed_products.map((p) => (
                            <tr key={p.code}>
                              <td className="sme-mono">{p.code}</td>
                              <td className="sme-strong">{p.name}</td>
                              <td><span className="sme-pill t-ok">{p.match_score}%</span></td>
                              <td className="sme-strong">{moneyShort(p.proposed_limit)}</td>
                              <td>{p.term_months} tháng</td>
                              <td>{p.requires_collateral ? 'Có TSBĐ' : 'Tín chấp'}</td>
                              <td><span className="sme-pill t-ok">✓ Đã cam kết</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {detailTab === 'docs' && (
                    <StepUploadAndChecklist
                      data={activeCase}
                      catalog={catalog}
                      onRefresh={setActiveCase}
                      onNextStep={() => { setViewMode('wizard'); setWizardStep(2) }}
                      onAskAssistant={askCopilot}
                    />
                  )}
                  {detailTab === 'customer' && (
                    <StepOcrAndB4
                      data={activeCase}
                      agentGroups={catalog?.agent_groups || []}
                      onRefresh={setActiveCase}
                      onNextStep={() => { setViewMode('wizard'); setWizardStep(3) }}
                    />
                  )}
                  {detailTab === 'negotiation' && (
                    <StepNegotiationAndDrafting data={activeCase} onRefresh={setActiveCase} />
                  )}
                  {detailTab === 'history' && (
                    <div className="sme-card">
                      <div className="sme-h2" style={{ marginBottom: 10 }}>Nhật ký Kiểm toán & Lịch sử Vòng đời Hồ sơ</div>
                      <table className="smec-table">
                        <thead>
                          <tr><th>Thời điểm</th><th>Sự kiện</th><th>Chi tiết</th></tr>
                        </thead>
                        <tbody>
                          {[...activeCase.audit].reverse().map((a, idx) => (
                            <tr key={idx}>
                              <td className="sme-small sme-muted">{when(a.ts)}</td>
                              <td className="sme-mono sme-strong">{a.action}</td>
                              <td className="sme-small sme-muted">
                                {JSON.stringify(Object.fromEntries(Object.entries(a).filter(([k]) => k !== 'ts' && k !== 'action')))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Cancel Case Confirmation Modal (`CBB huỷ hồ sơ`) */}
              {cancelModalOpen && (
                <div className="smec-modal-backdrop" onClick={() => setCancelModalOpen(false)}>
                  <div className="smec-modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
                    <div className="sme-h2" style={{ marginBottom: 8 }}>Bạn có chắc chắn muốn Hủy hồ sơ này?</div>
                    <div className="sme-small sme-muted" style={{ marginBottom: 10 }}>
                      Trạng thái hồ sơ sẽ chuyển sang <b>Sale Huỷ hồ sơ</b>. Vui lòng nhập rõ lý do hủy:
                    </div>
                    <textarea
                      className="smec-textarea"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Nhập lý do hủy hồ sơ (VD: Khách hàng tạm dừng kế hoạch nhập hàng)..."
                    />
                    <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
                      <Btn variant="ghost" onClick={() => setCancelModalOpen(false)}>Đóng</Btn>
                      <Btn
                        variant="primary"
                        disabled={!cancelReason.trim()}
                        onClick={() => {
                          setCancelModalOpen(false)
                          runLifecycleAction('cancel_case', { reason: cancelReason })
                          setCancelReason('')
                        }}
                      >
                        Xác nhận hủy hồ sơ
                      </Btn>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {dockOpen && (
          <AssistantDock
            storagePrefix="sme-connect"
            chatPrefix={CHAT_PREFIX}
            agent={COPILOT_AGENT}
            panelLabel="Trợ lý SME Connect"
            newIntakePrompt="Tra cứu MST và khởi tạo bộ hồ sơ SME Connect mới cho khách hàng: "
            newSessionTitle="SME Connect Copilot"
            caseTitlePrefix="SMEC"
            chips={chips}
            showNewSessionButton
            embedPlaceholder="Hỏi Copilot về OCR, Mẫu B4, 9 Agents hoặc soạn thư xin chứng từ..."
            width={dockWidth}
            onWidthChange={setDockWidth}
            onClose={() => setDockOpen(false)}
            caseId={caseId}
            customerName={activeCase ? String(activeCase.case.customer.name || '') : undefined}
            intent={intent}
            onConsumeIntent={() => setIntent(null)}
            createdCase={createdBanner}
            onOpenCase={(id) => { setCreatedBanner(null); setCaseId(id) }}
            onDismissCreatedCase={() => setCreatedBanner(null)}
          />
        )}
      </div>
    </div>
  )
}
