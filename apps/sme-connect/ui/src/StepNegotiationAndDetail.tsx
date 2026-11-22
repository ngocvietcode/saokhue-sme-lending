import { useAppApi } from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import {
  CheckCircle2, Download, FileSignature, MessageSquarePlus, Send, Sparkles, Zap,
} from 'lucide-react'
import { useState } from 'react'
import { errMsg, when } from '@sme-ui/format'
import { API, downloadBase64File, type FullCase } from './model'

type Props = {
  data: FullCase
  onRefresh: (next: FullCase) => void
}

export default function StepNegotiationAndDrafting({ data, onRefresh }: Props) {
  const api = useAppApi()
  const [commentText, setCommentText] = useState('')
  const [confirmSendOpen, setConfirmSendOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const res = data.resolution || { accepted: false, comments: [], drafting_info: {} }
  const comments = res.comments || []
  const existingDraft = res.drafting_info || {}
  const [drafting, setDrafting] = useState({
    legal_info_changed: Boolean(existingDraft.legal_info_changed ?? false),
    has_amended_resolution: Boolean(existingDraft.has_amended_resolution ?? false),
    resolution_code: String(existingDraft.resolution_code || res.resolution_no || 'ELOS-NQ-01'),
    drafting_proposal_type: String(existingDraft.drafting_proposal_type || 'Soạn thảo mới'),
    drafting_need: String(existingDraft.drafting_need || 'Soạn thảo Hồ sơ tín dụng'),
    has_credit_poa: Boolean(existingDraft.has_credit_poa ?? false),
    authorized_person: String(existingDraft.authorized_person || ''),
    collateral_status: String(existingDraft.collateral_status || 'Tài sản hiện hữu'),
    is_sole_residence: Boolean(existingDraft.is_sole_residence ?? false),
    title_matches_actual: Boolean(existingDraft.title_matches_actual ?? true),
    vehicle_registration_ready: String(existingDraft.vehicle_registration_ready || 'Đã có'),
    has_overdraft: Boolean(existingDraft.has_overdraft ?? false),
    overdraft_account: String(existingDraft.overdraft_account || ''),
    overdraft_rate_pct: String(existingDraft.overdraft_rate_pct || ''),
  })

  const caseId = data.case.case_id

  const simulateElosEvent = async (eventType: 'RESOLUTION_ISSUED' | 'CPC_COMMENT') => {
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/los-event`, {
        event_type: eventType,
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleSendComment = async () => {
    setConfirmSendOpen(false)
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/negotiate`, {
        message: commentText,
      })
      setCommentText('')
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleAcceptAndSaveDrafting = async () => {
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/resolution/accept`, {
        drafting_info: {
          ...drafting,
          resolution_code: drafting.resolution_code || res.resolution_no || 'ELOS-NQ-01',
        },
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleAction = async (action: 'send_b2b_confirm' | 'mark_b2b_done') => {
    setBusy(true)
    setError('')
    try {
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/action`, { action })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDownloadResolution = async () => {
    if (!res.resolution_doc?.id) return
    try {
      const f = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/documents/${res.resolution_doc.id}/file`
      )
      downloadBase64File(f.name, f.mime, f.content_b64)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  return (
    <div className="sme-stack">
      <div className="sme-card">
        <div className="sme-between sme-wrap">
          <div>
            <div className="sme-h2">Bước 5 · Thương lượng Nghị quyết Phê duyệt (ELOS/NCLOS) & Chuyển Xác nhận B2B</div>
            <div className="sme-small sme-muted">
              Đồng bộ 2 chiều giữa CBBH trên SME Connect và CPC trên NCLOS/ELOS. Khi chạy độc lập trên Sao Khuê, bạn có thể giả lập nhận Nghị quyết từ ELOS ngay bên dưới.
            </div>
          </div>

          <div className="sme-row sme-wrap">
            {!res.resolution_doc && (
              <Btn variant="secondary" onClick={() => simulateElosEvent('RESOLUTION_ISSUED')} disabled={busy}>
                <Zap size={14} /> Giả lập ELOS trả Nghị quyết
              </Btn>
            )}
            {res.resolution_doc && (
              <Btn variant="ghost" onClick={() => simulateElosEvent('CPC_COMMENT')} disabled={busy}>
                <Sparkles size={14} /> Giả lập phản hồi CPC
              </Btn>
            )}
          </div>
        </div>
        {error && <div className="sme-small" style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      </div>

      <div className="sme-detail">
        {/* Left Column: Resolution Document & Status (`8. Thương lượng nghị quyết`) */}
        <div className="sme-stack">
          <div className="sme-card">
            <div className="sme-between sme-wrap" style={{ marginBottom: 10 }}>
              <div className="sme-row">
                <FileSignature size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="sme-h3">
                    {res.resolution_doc ? res.resolution_doc.name : 'Đang chờ Nghị quyết từ ELOS / NCLOS'}
                  </div>
                  <div className="sme-small sme-muted">
                    Mã NCLOS: <span className="sme-mono">{data.case.smec.nclos_id || 'Chưa cấp'}</span> ·
                    Mã ELOS: <span className="sme-mono">{data.case.smec.elos_id || 'Chưa cấp'}</span>
                  </div>
                </div>
              </div>
              {res.accepted ? (
                <span className="sme-pill t-ok">✓ Đã đồng ý nghị quyết ({res.accepted_by})</span>
              ) : res.resolution_doc ? (
                <span className="sme-pill t-warn">Chờ ĐVKD/KH xác nhận</span>
              ) : (
                <span className="sme-pill t-muted">Chưa phát hành</span>
              )}
            </div>

            {res.conditions_summary && (
              <div className="sme-card tight" style={{ marginBottom: 12 }}>
                <div className="sme-small sme-strong">Điều kiện phê duyệt trên Nghị quyết ({res.resolution_no}):</div>
                <div className="sme-small" style={{ marginTop: 4 }}>{res.conditions_summary}</div>
              </div>
            )}

            {res.resolution_doc && (
              <div className="sme-row sme-wrap">
                <Btn variant="secondary" onClick={handleDownloadResolution}>
                  <Download size={14} /> Tải file {res.resolution_doc.name}
                </Btn>
                {!res.accepted && (
                  <Btn variant="primary" onClick={handleAcceptAndSaveDrafting} disabled={busy}>
                    <CheckCircle2 size={14} /> Đồng ý Nghị quyết & Mở Thông tin soạn thảo
                  </Btn>
                )}
              </div>
            )}
          </div>

          {/* 2-Way Negotiation Thread (`Ý kiến CPC` <-> `Ý kiến CBBH`) */}
          <div className="sme-card">
            <div className="sme-h3" style={{ marginBottom: 10 }}>Luồng trao đổi Thương lượng Nghị quyết ({comments.length})</div>
            <div className="sme-stack" style={{ marginBottom: 12 }}>
              {comments.length === 0 ? (
                <div className="sme-small sme-muted">Chưa có ý kiến trao đổi nào trên hồ sơ này.</div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="sme-card tight"
                    style={{
                      borderLeft: `3px solid ${c.role === 'CPC' ? 'var(--info)' : 'var(--accent)'}`,
                    }}
                  >
                    <div className="sme-between sme-small">
                      <span className="sme-strong">{c.author}</span>
                      <span className="sme-muted">{when(c.created_at)}</span>
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>{c.message}</div>
                  </div>
                ))
              )}
            </div>

            <div className="sme-stack" style={{ gap: 8 }}>
              <label className="sme-small sme-strong">Ý kiến của đơn vị kinh doanh (CBBH):</label>
              <textarea
                className="smec-textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Nhập nội dung đề xuất điều chỉnh điều kiện Nghị quyết gửi CPC..."
              />
              <div>
                <Btn
                  variant="secondary"
                  disabled={busy || !commentText.trim()}
                  onClick={() => setConfirmSendOpen(true)}
                >
                  <MessageSquarePlus size={14} /> Gửi ý kiến thương lượng
                </Btn>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: `8.1 - 01 Thông tin soạn thảo` & B2B Customer Confirmation */}
        <div className="sme-aside" style={{ position: 'static' }}>
          <div className="sme-card">
            <div className="sme-h3" style={{ marginBottom: 4 }}>01 · Thông tin soạn thảo Hợp đồng</div>
            <div className="sme-small sme-muted" style={{ marginBottom: 12 }}>
              Điền thông tin chuẩn bị cho khâu Soạn thảo Hồ sơ tín dụng / Thế chấp sau khi đồng ý Nghị quyết:
            </div>

            <div className="sme-stack" style={{ gap: 10 }}>
              <div>
                <label className="sme-small sme-muted">Mã số Nghị quyết phê duyệt *</label>
                <input
                  className="smec-input"
                  value={drafting.resolution_code}
                  onChange={(e) => setDrafting({ ...drafting, resolution_code: e.target.value })}
                />
              </div>

              <label className="sme-row sme-small">
                <input
                  type="checkbox"
                  checked={drafting.legal_info_changed}
                  onChange={(e) => setDrafting({ ...drafting, legal_info_changed: e.target.checked })}
                />
                Có thay đổi thông tin pháp lý so với lúc trình?
              </label>

              <label className="sme-row sme-small">
                <input
                  type="checkbox"
                  checked={drafting.has_credit_poa}
                  onChange={(e) => setDrafting({ ...drafting, has_credit_poa: e.target.checked })}
                />
                Có ký ủy quyền tín dụng không?
              </label>

              {drafting.has_credit_poa && (
                <div>
                  <label className="sme-small sme-muted">Người được ủy quyền *</label>
                  <input
                    className="smec-input"
                    value={drafting.authorized_person}
                    onChange={(e) => setDrafting({ ...drafting, authorized_person: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="sme-small sme-muted">Phân loại TSBĐ</label>
                <select
                  className="smec-input"
                  value={drafting.collateral_status}
                  onChange={(e) => setDrafting({ ...drafting, collateral_status: e.target.value })}
                >
                  <option value="Tài sản hiện hữu">Tài sản hiện hữu</option>
                  <option value="Tài sản mới">Tài sản mới</option>
                </select>
              </div>

              <label className="sme-row sme-small">
                <input
                  type="checkbox"
                  checked={drafting.is_sole_residence}
                  onChange={(e) => setDrafting({ ...drafting, is_sole_residence: e.target.checked })}
                />
                TSBĐ là chỗ ở duy nhất của chủ tài sản?
              </label>

              <label className="sme-row sme-small">
                <input
                  type="checkbox"
                  checked={drafting.title_matches_actual}
                  onChange={(e) => setDrafting({ ...drafting, title_matches_actual: e.target.checked })}
                />
                Thông tin trên GCN và thực tế nhà đất khớp nhau?
              </label>

              <label className="sme-row sme-small">
                <input
                  type="checkbox"
                  checked={drafting.has_overdraft}
                  onChange={(e) => setDrafting({ ...drafting, has_overdraft: e.target.checked })}
                />
                Hạn mức có cấp thấu chi?
              </label>

              {drafting.has_overdraft && (
                <div className="sme-stack" style={{ gap: 6 }}>
                  <input
                    className="smec-input"
                    placeholder="Số tài khoản mở hạn mức thấu chi *"
                    value={drafting.overdraft_account}
                    onChange={(e) => setDrafting({ ...drafting, overdraft_account: e.target.value })}
                  />
                  <input
                    className="smec-input"
                    placeholder="Lãi suất thấu chi (%/năm) *"
                    value={drafting.overdraft_rate_pct}
                    onChange={(e) => setDrafting({ ...drafting, overdraft_rate_pct: e.target.value })}
                  />
                </div>
              )}

              <Btn variant="secondary" onClick={handleAcceptAndSaveDrafting} disabled={busy}>
                Lưu Thông tin soạn thảo & Đồng ý Nghị quyết
              </Btn>

              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 10 }} className="sme-stack">
                <Btn
                  variant="primary"
                  disabled={busy || !res.accepted}
                  onClick={() => handleAction('send_b2b_confirm')}
                >
                  <Send size={14} /> Chuyển khách hàng xác nhận (B2B) →
                </Btn>

                {data.case.smec.b2b_requested_at && !data.case.smec.b2b_confirmed && (
                  <Btn variant="secondary" disabled={busy} onClick={() => handleAction('mark_b2b_done')}>
                    <CheckCircle2 size={14} /> Xác nhận: Đã có B2B (Hoàn tất hồ sơ)
                  </Btn>
                )}

                {data.case.smec.b2b_confirmed && (
                  <div className="sme-pill t-ok" style={{ justifyContent: 'center', padding: '6px 10px' }}>
                    ✓ Khách hàng đã xác nhận B2B — Hồ sơ Đã hoàn tất
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Pop-up matching Figma sticky note `CBB click gửi ý kiến thương lượng` */}
      {confirmSendOpen && (
        <div className="smec-modal-backdrop" onClick={() => setConfirmSendOpen(false)}>
          <div className="smec-modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="sme-h2" style={{ marginBottom: 8 }}>Xác nhận gửi ý kiến thương lượng</div>
            <div className="sme-small sme-muted" style={{ marginBottom: 16 }}>
              Bạn chắc chắn gửi ý kiến thương lượng này tới chuyên gia phê duyệt (CPC) trên hệ thống ELOS/NCLOS?
            </div>
            <div className="sme-row" style={{ justifyContent: 'flex-end' }}>
              <Btn variant="ghost" onClick={() => setConfirmSendOpen(false)}>Đóng</Btn>
              <Btn variant="primary" onClick={handleSendComment}>Xác nhận gửi</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
