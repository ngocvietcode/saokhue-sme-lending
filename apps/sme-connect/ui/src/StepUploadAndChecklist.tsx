import { useAppApi } from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import {
  AlertTriangle, ArrowRight, CheckCircle2, Eye, EyeOff, FileText, Upload,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { ruleStatus, xcheckStatus } from '@sme-ui/checklist'
import { day, errMsg } from '@sme-ui/format'
import { API, downloadBase64File, fileToBase64, type Catalog, type FullCase } from './model'

type Props = {
  data: FullCase
  catalog: Catalog | null
  onRefresh: (next: FullCase) => void
  onNextStep: () => void
  onAskAssistant: (prompt: string) => void
}

export default function StepUploadAndChecklist({
  data, catalog, onRefresh, onNextStep, onAskAssistant,
}: Props) {
  const api = useAppApi()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadMode, setUploadMode] = useState<'auto_bulk' | 'checklist'>('auto_bulk')
  const [targetDocType, setTargetDocType] = useState<string>('auto')
  const [showSkipped, setShowSkipped] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const caseId = data.case.case_id
  const docLabels = catalog?.documents?.types || {}
  const documents = data.case?.documents || []
  const checklistCounts = data.checklist?.counts || {}
  const checklistGroups = data.checklist?.groups || []
  const allChecklistItems = data.checklist?.items || []
  const crossCheckRules = data.crosschecks?.rules || []

  const handleFilesSelected = async (files: FileList | null, forcedType = 'auto') => {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    try {
      const batch = []
      for (const f of Array.from(files)) {
        const content_b64 = await fileToBase64(f)
        batch.push({
          name: f.name,
          doc_type: forcedType !== 'auto' ? forcedType : targetDocType,
          content_b64,
        })
      }
      const next = await api.post<FullCase>(`${API}/cases/${caseId}/documents`, {
        mode: uploadMode,
        files: batch,
      })
      onRefresh(next)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handlePreviewDoc = async (docId: string) => {
    try {
      const f = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/documents/${docId}/file`
      )
      downloadBase64File(f.name, f.mime, f.content_b64)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  const failedCrossChecks = crossCheckRules.filter((r) => r.status !== 'PASS' && r.status !== 'SKIPPED')
  const missingItems = allChecklistItems.filter(
    (i) => i.rule_status === 'MISSING_REQUIRED' || i.rule_status === 'FAIL'
  )

  return (
    <div className="sme-stack">
      {/* Sub-mode switcher matching Figma Screen 4 / 4.2 */}
      <div className="sme-card">
        <div className="sme-between sme-wrap" style={{ marginBottom: 12 }}>
          <div>
            <div className="sme-h2">Bước 1 · Tải lên & Phân loại Hồ sơ Chứng từ</div>
            <div className="sme-small sme-muted">
              Hỗ trợ kéo-thả toàn bộ bộ hồ sơ để AI tự phân loại hoặc tải theo từng mục Master Checklist (mặc định ẩn các mục không áp dụng <code>SKIPPED</code>).
            </div>
          </div>
          <div className="sme-filters">
            <button
              className={`sme-filter ${uploadMode === 'auto_bulk' ? 'on' : ''}`}
              onClick={() => setUploadMode('auto_bulk')}
            >
              Tải toàn bộ hồ sơ (AI Phân loại)
            </button>
            <button
              className={`sme-filter ${uploadMode === 'checklist' ? 'on' : ''}`}
              onClick={() => setUploadMode('checklist')}
            >
              Tải theo Master Checklist (A–I)
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {uploadMode === 'auto_bulk' && (
          <div
            className="smec-dropzone"
            onClick={() => { setTargetDocType('auto'); fileInputRef.current?.click() }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFilesSelected(e.dataTransfer.files, 'auto')
            }}
          >
            <Upload size={24} style={{ color: 'var(--accent)', marginBottom: 6 }} />
            <div className="sme-strong">
              {busy ? 'Đang tải lên, phân loại chứng từ & chạy kiểm tra chéo...' : 'Kéo thả toàn bộ chứng từ vào đây hoặc bấm để chọn nhiều file'}
            </div>
            <div className="sme-small sme-muted" style={{ marginTop: 4 }}>
              Chấp nhận PDF, Ảnh scan, Word, Excel · Tự động ánh xạ vào 53 mã chứng từ Master Checklist
            </div>
          </div>
        )}

        {error && <div className="sme-small" style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      </div>

      {/* Non-Blocking Instant AI Cross-Check & Missing Checklist Banner (Figma Screen 4.2) */}
      {(failedCrossChecks.length > 0 || missingItems.length > 0) && (
        <div
          className="sme-card"
          style={{
            borderColor: 'color-mix(in srgb, var(--warn) 60%, var(--border))',
            background: 'color-mix(in srgb, var(--warn) 7%, var(--card))',
          }}
        >
          <div className="sme-between sme-wrap" style={{ marginBottom: 8 }}>
            <div className="sme-row sme-strong" style={{ color: 'var(--warn)' }}>
              <AlertTriangle size={16} />
              Cảnh báo Kiểm tra Chéo & Hồ sơ Thiếu ({missingItems.length} chứng từ thiếu/lỗi · {failedCrossChecks.length} lưu ý check chéo)
            </div>
            <Btn
              variant="secondary"
              onClick={() =>
                onAskAssistant(
                  `Soạn thư xin khách hàng bổ sung ${missingItems.length} chứng từ còn thiếu và làm rõ các điểm kiểm tra chéo của hồ sơ ${caseId}.`
                )
              }
            >
              Nhờ Copilot soạn thư xin KH
            </Btn>
          </div>
          <ul style={{ margin: '0 0 8px 18px', padding: 0, fontSize: 12.5 }}>
            {missingItems.slice(0, 6).map((m) => (
              <li key={m.code} style={{ marginBottom: 3 }}>
                <b>[{m.code}] {m.title}:</b> {(m.fail_reasons || []).join('; ') || m.rule_label || m.condition_label || 'Chưa tải lên chứng từ bắt buộc'}
              </li>
            ))}
            {failedCrossChecks.map((r) => (
              <li key={r.id || r.code} style={{ marginBottom: 3 }}>
                <b>[{r.id || r.code}] {r.title} ({xcheckStatus(r.status).label}):</b> {r.detail}
              </li>
            ))}
          </ul>
          <div className="sme-small sme-muted">
            <i>Lưu ý (Non-blocking): Bạn vẫn có thể bấm tiếp tục sang bước Kiểm tra dữ liệu trích xuất OCR. Hồ sơ còn thiếu có thể bổ sung trước khi trình phê duyệt.</i>
          </div>
        </div>
      )}

      {/* Master Checklist Groups A-I */}
      {uploadMode === 'checklist' && (
        <div className="sme-card">
          <div className="sme-between sme-wrap" style={{ marginBottom: 10 }}>
            <div className="sme-row sme-wrap">
              <span className="sme-h3">Danh mục SME Master Checklist (Nhóm A → I)</span>
              <span className="sme-pill t-ok">Đạt: {checklistCounts.PASS || 0}</span>
              <span className="sme-pill t-warn">Còn thiếu: {checklistCounts.MISSING_REQUIRED || 0}</span>
              {(checklistCounts.FAIL || 0) > 0 && <span className="sme-pill t-danger">Không đạt: {checklistCounts.FAIL}</span>}
              <span className="sme-pill t-info">Chưa rõ ĐK: {checklistCounts.UNDETERMINED_CONDITION || 0}</span>
            </div>
            <Btn variant="ghost" onClick={() => setShowSkipped((v) => !v)}>
              {showSkipped ? <EyeOff size={14} /> : <Eye size={14} />}
              {showSkipped ? 'Ẩn mục không áp dụng' : `Hiện ${checklistCounts.SKIPPED || 0} mục không áp dụng`}
            </Btn>
          </div>

          <div className="sme-stack">
            {checklistGroups.map((grp) => {
              const grpItems = allChecklistItems.filter((i) => i.group === grp.group)
              const visibleItems = showSkipped
                ? grpItems
                : grpItems.filter((i) => i.rule_status !== 'SKIPPED')
              if (!visibleItems.length) return null
              const grpOk = grp.status === 'COMPLETE'
              return (
                <div key={grp.group} className="sme-card tight">
                  <div className="sme-between" style={{ marginBottom: 6 }}>
                    <span className="sme-strong">Nhóm {grp.group} · {grp.label}</span>
                    <span className={`sme-pill ${grpOk ? 't-ok' : grp.status === 'SKIPPED' ? 't-muted' : 't-warn'}`}>
                      {grpOk ? 'Đủ hồ sơ nhóm' : grp.status === 'SKIPPED' ? 'Không áp dụng' : 'Chưa đủ'}
                    </span>
                  </div>
                  <table className="smec-table">
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>Mã</th>
                        <th>Hạng mục chứng từ</th>
                        <th style={{ width: 150 }}>Trạng thái</th>
                        <th>Điều kiện áp dụng / Ghi chú</th>
                        <th style={{ width: 110 }}>Tải bổ sung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleItems.map((it) => {
                        const st = ruleStatus(it.rule_status)
                        const noteText = (it.fail_reasons || []).join('; ') || it.rule_label || it.condition_label || '—'
                        return (
                          <tr key={it.code}>
                            <td className="sme-mono">{it.code}</td>
                            <td>{it.title}</td>
                            <td>
                              <span className={`sme-pill t-${st.tone}`}>{st.label}</span>
                            </td>
                            <td className="sme-small sme-muted">{noteText}</td>
                            <td>
                              {it.rule_status !== 'SKIPPED' && (
                                <button
                                  className="sme-ref"
                                  onClick={() => {
                                    setTargetDocType(it.code)
                                    fileInputRef.current?.click()
                                  }}
                                >
                                  + Tải file
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Uploaded Documents Table + 7 Cross-Check Summary */}
      <div className="sme-card">
        <div className="sme-between sme-wrap" style={{ marginBottom: 10 }}>
          <span className="sme-h3">Tài liệu đã tải lên & phân loại ({documents.length} file)</span>
          <Btn variant="primary" onClick={onNextStep}>
            Đọc & Kiểm tra dữ liệu trích xuất OCR <ArrowRight size={14} />
          </Btn>
        </div>

        <table className="smec-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên file gốc</th>
              <th>Phân loại AI</th>
              <th>Ngày chứng từ</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="sme-mono">{doc.id}</td>
                <td className="sme-row"><FileText size={14} className="sme-muted" /> {doc.name}</td>
                <td><span className="sme-chip">{docLabels[doc.type]?.label || doc.type}</span></td>
                <td className="sme-small sme-muted">{day(doc.issued_date)}</td>
                <td>
                  <button className="sme-ref" onClick={() => handlePreviewDoc(doc.id)}>Tải / Xem file</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 14 }}>
          <div className="sme-section-title">Kết quả 7 Rule Kiểm tra Chéo Trọng yếu (R1 → R7)</div>
          <div className="sme-row sme-wrap">
            {crossCheckRules.map((r) => {
              const xs = xcheckStatus(r.status)
              return (
                <span
                  key={r.id || r.code}
                  className={`sme-pill t-${xs.tone}`}
                  title={`${r.title}: ${r.detail}`}
                >
                  {r.status === 'PASS' ? <CheckCircle2 size={12} /> : null}
                  {r.id || r.code}: {xs.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
