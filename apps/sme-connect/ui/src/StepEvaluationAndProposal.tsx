import { useAppApi } from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import {
  ArrowRight, Bot, CheckCircle2, Download, FileCheck2, FileDiff,
  Play, QrCode, ShieldCheck, Upload, Wand2,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { errMsg, money, moneyShort, when } from '@sme-ui/format'
import { API, downloadBase64File, fileToBase64, type FullCase } from './model'

type EvalProps = {
  data: FullCase
  onRefresh: (next: FullCase) => void
  onNextStep: () => void
  onAskAssistant: (prompt: string) => void
}

export function StepEvaluation({ data, onRefresh, onNextStep, onAskAssistant }: EvalProps) {
  const api = useAppApi()
  const [subTab, setSubTab] = useState<'financial' | 'industry' | 'risk' | 'collateral'>('financial')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const caseId = data.case.case_id
  const ev = data.evaluation

  const runEvaluation = async () => {
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/evaluate`, {
        selected_groups: data.case.smec.selected_agent_groups,
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sme-stack">
      {/* Top Evaluation Orchestrator Card */}
      <div className="sme-card">
        <div className="sme-between sme-wrap">
          <div>
            <div className="sme-h2">Bước 3 · Hệ thống Tự động Đánh giá (Multi-Agent + Deterministic Verifier)</div>
            <div className="sme-small sme-muted">
              {ev
                ? `Đã hoàn thành ${ev.agents_completed}/${ev.agents_total} Agent chuyên môn lúc ${when(ev.evaluated_at)} · Nhóm kích hoạt: ${ev.selected_groups.join(', ').toUpperCase()}`
                : 'Bấm chạy hệ thống đánh giá để kích hoạt các Agent đã chọn ở Bước 2 kèm kiểm chứng bằng chứng tất định.'}
            </div>
          </div>

          <div className="sme-row sme-wrap">
            <Btn variant="secondary" onClick={runEvaluation} disabled={busy}>
              <Play size={14} /> {busy ? 'Đang chạy đánh giá...' : ev ? 'Chạy lại đánh giá tức thì' : 'Chạy hệ thống đánh giá'}
            </Btn>
            <Btn
              variant="ghost"
              onClick={() =>
                onAskAssistant(
                  `Chạy workflow smec-credit-assessment cho hồ sơ ${caseId} với các nhóm agent ${JSON.stringify(data.case.smec.selected_agent_groups)} và tóm tắt kết quả kèm mã bằng chứng.`
                )
              }
            >
              <Bot size={14} /> Chạy sâu qua Copilot (9 Agents)
            </Btn>
            {ev && (
              <Btn variant="primary" onClick={onNextStep}>
                Sang Bước 4 · Tạo Tờ trình <ArrowRight size={14} />
              </Btn>
            )}
          </div>
        </div>
        {error && <div className="sme-small" style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}

        {/* Product Readiness Matrix */}
        {ev && (
          <div className="sme-kpis" style={{ marginTop: 14, marginBottom: 0 }}>
            {ev.product_readiness.map((pr) => (
              <div key={pr.code} className={`sme-kpi t-${pr.tone}`}>
                <div>
                  <div className="sme-kpi-label">{pr.name}</div>
                  <div className="sme-kpi-value">{moneyShort(pr.proposed_limit)}</div>
                  <div className="sme-kpi-hint">Độ phù hợp {pr.match_score}% · <b>{pr.readiness}</b></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!ev ? (
        <div className="sme-card sme-muted">
          Chưa có kết quả đánh giá cho hồ sơ này. Bấm <b>“Chạy hệ thống đánh giá”</b> ở góc trên để tổng hợp đầy đủ 4 chuyên đề (Tài chính, Ngành, CIC & Rủi ro, Tài sản bảo đảm) và căn cứ truy vết.
        </div>
      ) : (
        <div className="sme-detail">
          {/* Left Main Report Area */}
          <div className="sme-card">
            <div className="sme-tabs">
              <button className={`sme-tab ${subTab === 'financial' ? 'on' : ''}`} onClick={() => setSubTab('financial')}>
                01 · Phân tích tài chính ({ev.sections.financial.score}/100)
              </button>
              <button className={`sme-tab ${subTab === 'industry' ? 'on' : ''}`} onClick={() => setSubTab('industry')}>
                02 · Ngành & Vị thế KH
              </button>
              <button className={`sme-tab ${subTab === 'risk' ? 'on' : ''}`} onClick={() => setSubTab('risk')}>
                03 · CIC & Rủi ro
              </button>
              {ev.sections.collateral.has_collateral && (
                <button className={`sme-tab ${subTab === 'collateral' ? 'on' : ''}`} onClick={() => setSubTab('collateral')}>
                  04 · Tài sản bảo đảm
                </button>
              )}
            </div>

            {subTab === 'financial' && (
              <div className="sme-stack">
                <div className="sme-between sme-wrap">
                  <div>
                    <div className="sme-h3">Điểm sức khỏe tài chính AI: {ev.sections.financial.score}/100 — {ev.sections.financial.rating}</div>
                    <div className="sme-small sme-muted">{ev.sections.financial.summary}</div>
                  </div>
                  <span className="sme-pill t-ok"><ShieldCheck size={12} /> Đã kiểm chứng phép tính tất định</span>
                </div>

                <div className="smec-field-grid">
                  {ev.sections.financial.metrics.map((m, i) => (
                    <div key={i} className="sme-card tight">
                      <div className="sme-small sme-muted">{m.label}</div>
                      <div className="sme-strong" style={{ fontSize: 15, margin: '4px 0' }}>{m.value}</div>
                      <div className="sme-small" style={{ color: 'var(--ok)' }}>{m.trend}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="sme-section-title">Kiểm tra quy tắc kế toán & đối chiếu chéo</div>
                  <table className="smec-table">
                    <thead>
                      <tr><th>Quy tắc kiểm chứng</th><th>Kết quả</th></tr>
                    </thead>
                    <tbody>
                      {ev.sections.financial.accounting_checks.map((chk, idx) => (
                        <tr key={idx}>
                          <td>{chk.rule}</td>
                          <td>
                            <span className={`sme-pill ${chk.status === 'PASS' ? 't-ok' : 't-warn'}`}>{chk.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subTab === 'industry' && (
              <div className="sme-stack">
                <div className="sme-h3">Ngành hoạt động: {ev.sections.industry.sector_name}</div>
                <div className="smec-field-grid">
                  <div className="sme-card tight">
                    <div className="sme-strong" style={{ color: 'var(--ok)', marginBottom: 6 }}>Điểm mạnh (Strengths)</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
                      {ev.sections.industry.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="sme-card tight">
                    <div className="sme-strong" style={{ color: 'var(--warn)', marginBottom: 6 }}>Điểm yếu (Weaknesses)</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
                      {ev.sections.industry.swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="sme-card tight">
                    <div className="sme-strong" style={{ color: 'var(--info)', marginBottom: 6 }}>Cơ hội (Opportunities)</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
                      {ev.sections.industry.swot.opportunities.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="sme-card tight">
                    <div className="sme-strong" style={{ color: 'var(--danger)', marginBottom: 6 }}>Thách thức (Threats)</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
                      {ev.sections.industry.swot.threats.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'risk' && (
              <div className="sme-stack">
                {/* Badbranch + KSSV */}
                <div className="smec-field-grid">
                  <div className="sme-card tight">
                    <div className="sme-between">
                      <span className="sme-strong">Kiểm tra ĐVKD Badbranch (5 nhóm)</span>
                      <span className={`sme-pill ${ev.sections.risk.badbranch.is_badbranch ? 't-danger' : 't-ok'}`}>
                        {ev.sections.risk.badbranch.is_badbranch ? 'Thuộc Badbranch' : 'Không thuộc Badbranch'}
                      </span>
                    </div>
                    <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12 }}>
                      {ev.sections.risk.badbranch.groups.map((g, i) => (
                        <li key={i}>{g.group}: <b>{g.flagged ? 'Vi phạm' : 'Không'}</b></li>
                      ))}
                    </ul>
                  </div>

                  <div className="sme-card tight">
                    <div className="sme-between">
                      <span className="sme-strong">Kiểm soát sau vay (KSSV)</span>
                      <span className="sme-pill t-ok">0 chế tài hiệu lực</span>
                    </div>
                    <div className="sme-small sme-muted" style={{ marginTop: 6 }}>
                      {ev.sections.risk.kssv_post_loan.summary}
                    </div>
                  </div>
                </div>

                {/* 7 Internal Watchlists & EWS Topdown */}
                <div>
                  <div className="sme-section-title">Danh sách Cảnh báo Nội bộ & EWS Topdown</div>
                  <div className="sme-row sme-wrap">
                    {ev.sections.risk.internal_watchlists.map((w) => (
                      <span key={w.code} className={`sme-pill ${w.status === 'CLEAR' ? 't-ok' : 't-danger'}`} title={w.detail}>
                        ✓ {w.label}: {w.status}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Multi-subject CIC Table */}
                <div>
                  <div className="sme-section-title">Quan hệ Tín dụng CIC Đa chủ thể (VPBank vs TCTD khác)</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="smec-table">
                      <thead>
                        <tr>
                          <th>Vai trò</th>
                          <th>Chủ thể</th>
                          <th>Dư nợ vay VPB</th>
                          <th>Dư nợ vay TCTD khác</th>
                          <th>Thẻ TD (VPB / Khác)</th>
                          <th>Nhóm nợ</th>
                          <th>Lịch sử 24T</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ev.sections.risk.cic_subjects.map((s, idx) => (
                          <tr key={idx}>
                            <td>{s.role}</td>
                            <td className="sme-strong">{s.name}</td>
                            <td>{moneyShort(s.vpb_loan)}</td>
                            <td>{moneyShort(s.other_loan)}</td>
                            <td>{moneyShort(s.vpb_card)} / {moneyShort(s.other_card)}</td>
                            <td><span className="sme-pill t-ok">Nhóm {s.cic_group}</span></td>
                            <td className="sme-small sme-muted">{s.history_24m}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'collateral' && (
              <div className="sme-stack">
                <div className="sme-between">
                  <div className="sme-h3">{ev.sections.collateral.summary}</div>
                  {ev.sections.collateral.ltv_pct != null && (
                    <span className="sme-pill t-ok">LTV: {ev.sections.collateral.ltv_pct}%</span>
                  )}
                </div>
                {ev.sections.collateral.assets.map((a, idx) => (
                  <div key={idx} className="sme-card tight">
                    <div className="sme-between">
                      <span className="sme-strong">{String(a.type_label || a.asset_type)} — {String(a.asset_id || '')}</span>
                      <span className="sme-strong">{money(a.valuation_vnd)}</span>
                    </div>
                    <div className="sme-small sme-muted" style={{ marginTop: 4 }}>
                      {String(a.description || '')} · Chủ sở hữu: {String(a.owner || '')} · Định giá: {String(a.valuation_agency || 'Prosland')} ({String(a.valuation_date || '')})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Căn cứ đánh giá (Nguồn & khả năng truy vết) */}
          <div className="sme-aside">
            <div className="sme-card tight">
              <div className="sme-section-title">Căn cứ đánh giá (Nguồn & truy vết)</div>
              <div className="sme-stack" style={{ gap: 8 }}>
                {(ev.sections[subTab]?.traceability || []).map((t, i) => (
                  <div key={i} className="sme-card tight">
                    <div className="sme-between">
                      <span className="sme-mono sme-strong" style={{ color: 'var(--accent)' }}>{t.ref}</span>
                      <span className="sme-pill t-ok">Đã xác minh</span>
                    </div>
                    <div className="sme-small sme-strong" style={{ marginTop: 4 }}>{t.source}</div>
                    <div className="sme-small sme-muted">{t.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sme-card tight">
              <div className="sme-section-title">Trạng thái Kiểm chứng 9 Agents</div>
              <div className="sme-stack" style={{ gap: 6 }}>
                {Object.entries(data.results || {}).map(([ag, meta]) => (
                  <div key={ag} className="sme-between sme-small">
                    <span className="sme-mono">{ag}</span>
                    <span className={`sme-pill ${meta.verification?.passed ? 't-ok' : 't-warn'}`}>
                      {meta.verification?.passed ? `v${meta._version || 1} PASS` : 'UNVERIFIED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type PropProps = {
  data: FullCase
  onRefresh: (next: FullCase) => void
  onSubmitLos: () => void
}

export function StepProposalAndDiff({ data, onRefresh, onSubmitLos }: PropProps) {
  const api = useAppApi()
  const uploadRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const caseId = data.case.case_id
  const prop = data.proposal

  const handleGenerate = async () => {
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/proposal/generate`, {})
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = async () => {
    setError('')
    try {
      const doc = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/proposal/download`
      )
      downloadBase64File(doc.name, doc.mime, doc.content_b64)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  const handleUploadEdited = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const content_b64 = await fileToBase64(file)
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/proposal/upload`, {
        name: file.name,
        content_b64,
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
      if (uploadRef.current) uploadRef.current.value = ''
    }
  }

  const handleSimulateCbbhEditUpload = async () => {
    setBusy(true)
    setError('')
    try {
      const edited = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/proposal/sample-edit`
      )
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/proposal/upload`, {
        name: edited.name,
        content_b64: edited.content_b64,
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleConfirmDiffs = async (keys?: string[]) => {
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/proposal/confirm-diff`, {
        keys: keys || null,
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sme-stack">
      <div className="sme-card">
        <div className="sme-between sme-wrap">
          <div>
            <div className="sme-h2">Bước 4 · Khởi tạo Tờ trình Đề xuất Cấp tín dụng & Đối sánh Thay đổi</div>
            <div className="sme-small sme-muted">
              Biểu mẫu chuẩn VPBank <b>MB02.PL03.HDM-TD-CV.NA/05</b> đính kèm mã QR xác thực bản gốc AI. Hỗ trợ tải về chỉnh sửa Word (.docx) và tải lên lại để hệ thống đối sánh tự động.
            </div>
          </div>

          <div className="sme-row sme-wrap">
            <input
              ref={uploadRef}
              type="file"
              accept=".docx"
              style={{ display: 'none' }}
              onChange={(e) => handleUploadEdited(e.target.files?.[0])}
            />
            <Btn variant={prop ? 'secondary' : 'primary'} onClick={handleGenerate} disabled={busy}>
              <FileCheck2 size={14} /> {prop ? 'Tạo lại Tờ trình gốc (v1)' : 'Khởi tạo Tờ trình tự động'}
            </Btn>
            {prop && (
              <>
                <Btn variant="secondary" onClick={handleDownload}>
                  <Download size={14} /> Tải Word (.docx)
                </Btn>
                <Btn variant="secondary" onClick={() => uploadRef.current?.click()} disabled={busy}>
                  <Upload size={14} /> Upload bản CBBH sửa (.docx)
                </Btn>
                <Btn variant="ghost" onClick={handleSimulateCbbhEditUpload} disabled={busy}>
                  <Wand2 size={14} /> Giả lập CBBH upload bản sửa
                </Btn>
                <Btn
                  variant="primary"
                  disabled={busy || !prop.all_diffs_confirmed}
                  onClick={onSubmitLos}
                >
                  Trình duyệt hồ sơ lên LOS <ArrowRight size={14} />
                </Btn>
              </>
            )}
          </div>
        </div>
        {error && <div className="sme-small" style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      </div>

      {/* Diff Engine Panel (`6.1 - Đối sánh thay đổi Tờ trình`) */}
      {prop && prop.diffs.length > 0 && (
        <div
          className="sme-card"
          style={{
            borderColor: prop.all_diffs_confirmed ? 'var(--ok)' : 'var(--warn)',
            background: prop.all_diffs_confirmed
              ? 'color-mix(in srgb, var(--ok) 6%, var(--card))'
              : 'color-mix(in srgb, var(--warn) 7%, var(--card))',
          }}
        >
          <div className="sme-between sme-wrap" style={{ marginBottom: 10 }}>
            <div className="sme-row sme-strong">
              <FileDiff size={16} />
              Hệ thống đã thực hiện đối sánh ({prop.diffs.length} trường thay đổi giữa Hệ thống tạo và CBBH cập nhật)
            </div>
            {!prop.all_diffs_confirmed ? (
              <Btn variant="primary" onClick={() => handleConfirmDiffs()} disabled={busy}>
                <CheckCircle2 size={14} /> Xác nhận toàn bộ thay đổi
              </Btn>
            ) : (
              <span className="sme-pill t-ok">✓ Đã xác nhận đủ thay đổi — Sẵn sàng trình duyệt</span>
            )}
          </div>

          <table className="smec-table">
            <thead>
              <tr>
                <th>Chỉ tiêu trên Tờ trình</th>
                <th>Hệ thống tạo (v1 AI)</th>
                <th>CBBH cập nhật (v{prop.current_version})</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {prop.diffs.map((d) => (
                <tr key={d.key}>
                  <td className="sme-strong">{d.label}</td>
                  <td className="sme-small sme-muted">{d.system_value}</td>
                  <td className="sme-small" style={{ fontWeight: 600 }}>{d.cbbh_value}</td>
                  <td>
                    {d.confirmed ? (
                      <span className="sme-pill t-ok">✓ Đã xác nhận ({d.confirmed_by})</span>
                    ) : (
                      <button className="sme-ref" onClick={() => handleConfirmDiffs([d.key])}>
                        Xác nhận dòng này
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Proposal Preview + QR Verification Matrix */}
      {prop && (
        <div className="sme-card">
          <div className="sme-between sme-wrap" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 14 }}>
            <div>
              <div className="sme-small sme-muted">NGÂN HÀNG TMCP VIỆT NAM THỊNH VƯỢNG (VPBANK) — KHỐI SME</div>
              <div className="sme-h2" style={{ fontSize: 17, margin: '4px 0' }}>
                BÁO CÁO ĐÁNH GIÁ & TỜ TRÌNH ĐỀ XUẤT CẤP TÍN DỤNG
              </div>
              <div className="sme-small sme-muted">
                Biểu mẫu: <span className="sme-mono">{prop.form_code}</span> · Phiên bản hiện hành: <b>v{prop.current_version}</b> ·
                File: <span className="sme-mono">{prop.active_file}</span>
              </div>
            </div>

            <div className="smec-qr-box">
              <div
                style={{ color: 'var(--text-strong, var(--text))', lineHeight: 0 }}
                dangerouslySetInnerHTML={{ __html: prop.qr_meta.qr_svg }}
              />
              <span className="sme-mono" style={{ fontSize: 10 }}>
                <QrCode size={10} /> SHA: {prop.qr_meta.sha256.slice(0, 10)}
              </span>
            </div>
          </div>

          <table className="smec-table">
            <thead>
              <tr>
                <th style={{ width: 280 }}>Mục thông tin Tờ trình</th>
                <th>Nội dung chi tiết đang hiệu lực</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(prop.active_fields).map(([k, val]) => (
                <tr key={k}>
                  <td className="sme-strong">{k}</td>
                  <td>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
