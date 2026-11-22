import { useAppApi } from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import {
  AlertCircle, ArrowRight, Check, Download, Eye, EyeOff, FileSpreadsheet,
  Lock, Search, ShieldAlert, Upload, X, Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { errMsg, money } from '@sme-ui/format'
import {
  API, downloadBase64File, fileToBase64,
  type AgentGroupSpec, type FullCase, type OcrField,
} from './model'

type Props = {
  data: FullCase
  agentGroups: AgentGroupSpec[]
  onRefresh: (next: FullCase) => void
  onNextStep: () => void
}

const TIER_META = {
  trusted: { label: 'Tin cậy', tone: 'ok' },
  needs_confirm: { label: 'Chưa đủ tin cậy', tone: 'warn' },
  missing: { label: 'Thiếu', tone: 'danger' },
} as const

export default function StepOcrAndB4({ data, agentGroups, onRefresh, onNextStep }: Props) {
  const api = useAppApi()
  const b4InputRef = useRef<HTMLInputElement | null>(null)
  const categories = data.ocr?.categories || []
  const [activeCatId, setActiveCatId] = useState<string>(categories[0]?.id || '01_customer')
  const [hideTrustedOcr, setHideTrustedOcr] = useState(false)
  const [draftValues, setDraftValues] = useState<Record<string, string>>({})
  const [inspectField, setInspectField] = useState<OcrField | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const caseId = data.case.case_id
  const selectedGroups = data.case.smec.selected_agent_groups || ['fin', 'col', 'risk', 'pol']

  useEffect(() => {
    if (!categories.some((c) => c.id === activeCatId) && categories[0]) {
      setActiveCatId(categories[0].id)
    }
  }, [categories, activeCatId])

  const activeCat = categories.find((c) => c.id === activeCatId) || categories[0]

  const toggleAgentGroup = async (gid: string) => {
    const nextGroups = selectedGroups.includes(gid)
      ? selectedGroups.filter((x) => x !== gid)
      : [...selectedGroups, gid]
    try {
      const res = await api.post<FullCase>(`${API}/cases/${caseId}/ocr`, {
        updates: [],
        selected_agent_groups: nextGroups,
      })
      onRefresh(res)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  const saveFieldConfirm = async (field: OcrField, overrideVal?: unknown) => {
    setBusy(true)
    setError('')
    try {
      const rawVal = overrideVal !== undefined
        ? overrideVal
        : (draftValues[field.path] !== undefined ? draftValues[field.path] : field.value)
      const res = await api.post<FullCase>(`${API}/cases/${caseId}/ocr`, {
        updates: [{ path: field.path, value: rawVal }],
      })
      onRefresh(res)
      if (inspectField?.path === field.path) {
        const refreshed = res.ocr.categories.flatMap((c) => c.fields).find((f) => f.path === field.path)
        setInspectField(refreshed || null)
      }
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDownloadB4 = async () => {
    setError('')
    try {
      const tpl = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/b4-template`
      )
      downloadBase64File(tpl.name, tpl.mime, tpl.content_b64)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  const handleUploadB4File = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const content_b64 = await fileToBase64(file)
      const res = await api.post<FullCase>(`${API}/cases/${caseId}/b4-upload`, {
        name: file.name,
        content_b64,
      })
      onRefresh(res)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
      if (b4InputRef.current) b4InputRef.current.value = ''
    }
  }

  const handleQuickFillStandardB4 = async () => {
    setBusy(true)
    setError('')
    try {
      const tpl = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/b4-template`
      )
      const res = await api.post<FullCase>(`${API}/cases/${caseId}/b4-upload`, {
        name: tpl.name,
        content_b64: tpl.content_b64,
      })
      onRefresh(res)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handleDownloadSourceDoc = async (docId?: string | null) => {
    if (!docId) return
    try {
      const f = await api.get<{ name: string; mime: string; content_b64: string }>(
        `${API}/cases/${caseId}/documents/${docId}/file`
      )
      downloadBase64File(f.name, f.mime, f.content_b64)
    } catch (e) {
      setError(errMsg(e))
    }
  }

  const visibleFields = (activeCat?.fields || []).filter((f) =>
    !hideTrustedOcr || f.confidence_tier !== 'trusted'
  )

  return (
    <div className="sme-stack">
      {/* Summary Header & Compact OCR Toggle (Figma URL 1 `BẢN MỚI`) */}
      <div className="sme-card">
        <div className="sme-between sme-wrap">
          <div className="sme-row sme-wrap" style={{ gap: 10 }}>
            <span className="sme-h2">Bước 2 · Kiểm tra dữ liệu trích xuất OCR (Bản mới 6 Danh mục)</span>
            <span className="sme-chip">Tổng trường: <b>{data.ocr.summary.total}</b></span>
            <span className="sme-pill t-ok">Tin cậy: {data.ocr.summary.trusted}</span>
            <span className="sme-pill t-warn">Cần xác nhận: {data.ocr.summary.needs_confirm}</span>
            <span className="sme-pill t-danger">Còn thiếu: {data.ocr.summary.missing}</span>
          </div>

          <div className="sme-row">
            <Btn variant="secondary" onClick={() => setHideTrustedOcr((v) => !v)}>
              {hideTrustedOcr ? <Eye size={14} /> : <EyeOff size={14} />}
              {hideTrustedOcr ? 'Hiện đầy đủ trường Tin cậy' : 'Ẩn thông tin OCR (Chế độ rút gọn)'}
            </Btn>
            <Btn variant="primary" onClick={onNextStep}>
              Chuyển sang Hệ thống đánh giá <ArrowRight size={14} />
            </Btn>
          </div>
        </div>

        <div className="sme-row sme-wrap sme-small sme-muted" style={{ marginTop: 8, gap: 14 }}>
          <span><Lock size={12} style={{ verticalAlign: 'middle' }} /> <b>Mã số ĐKKD</b> và <b>Mã CIF</b> đã được khóa cứng (read-only) theo dữ liệu định danh gốc.</span>
          {!data.ocr.has_collateral && (
            <span className="sme-pill t-info">
              Đã tự động ẩn mục 06 · BLCN & TSBĐ do gói sản phẩm đề xuất 100% tín chấp
            </span>
          )}
        </div>
        {error && <div className="sme-small" style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      </div>

      {/* 3-Column Layout: Left Category + Agent Rail | Center Fields & Tables | Right Side-by-Side PDF BBox Viewer */}
      <div className={`smec-ocr-layout ${inspectField ? 'with-viewer' : ''}`}>
        {/* Left Navigation + CBBH Support Agents */}
        <div className="sme-stack">
          <div className="sme-card tight">
            <div className="sme-section-title">Danh mục thông tin tín dụng</div>
            <div className="sme-stack" style={{ gap: 4 }}>
              {categories.map((cat) => {
                const needCount = cat.counts.needs_confirm + cat.counts.missing
                return (
                  <button
                    key={cat.id}
                    className={`smec-cat-btn ${cat.id === activeCat?.id ? 'active' : ''}`}
                    onClick={() => setActiveCatId(cat.id)}
                  >
                    <span>{cat.title}</span>
                    {needCount > 0 ? (
                      <span className="sme-pill t-warn">{needCount}</span>
                    ) : (
                      <span className="sme-pill t-ok">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Left Sidebar Block: AGENT HỖ TRỢ CHO CBBH */}
          <div className="sme-card tight">
            <div className="sme-section-title">Agent hỗ trợ cho CBBH</div>
            <div className="sme-small sme-muted" style={{ marginBottom: 8 }}>
              Chọn các nhóm chuyên gia AI sẽ tham gia đánh giá hồ sơ ở Bước 3:
            </div>
            <div className="sme-stack" style={{ gap: 8 }}>
              {agentGroups.map((grp) => {
                const disabledCol = grp.id === 'col' && !data.ocr.has_collateral
                const checked = !disabledCol && selectedGroups.includes(grp.id)
                return (
                  <label
                    key={grp.id}
                    className="sme-row"
                    style={{
                      alignItems: 'flex-start',
                      cursor: disabledCol ? 'not-allowed' : 'pointer',
                      opacity: disabledCol ? 0.5 : 1,
                      fontSize: 12.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      disabled={disabledCol}
                      checked={checked}
                      onChange={() => toggleAgentGroup(grp.id)}
                      style={{ marginTop: 3 }}
                    />
                    <div>
                      <div className="sme-strong">{grp.label}</div>
                      <div className="sme-small sme-muted">{grp.description}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center Content: Category Fields + PAVV B4 Special Upload + 1-N Tables */}
        <div className="sme-stack">
          {activeCat && (
            <div className="sme-card">
              <div className="sme-between sme-wrap" style={{ marginBottom: 12 }}>
                <div>
                  <div className="sme-h2">{activeCat.title}</div>
                  <div className="sme-small sme-muted">{activeCat.subtitle}</div>
                </div>
                <div className="sme-row">
                  <span className="sme-chip">Tổng: {activeCat.counts.total}</span>
                  <span className="sme-pill t-warn">Cần xác nhận: {activeCat.counts.needs_confirm}</span>
                  <span className="sme-pill t-danger">Thiếu: {activeCat.counts.missing}</span>
                </div>
              </div>

              {/* Special Deterministic Excel B4 Banner for `05_pavv` */}
              {activeCat.id === '05_pavv' && (
                <div
                  className="sme-card tight"
                  style={{
                    marginBottom: 14,
                    borderColor: 'color-mix(in srgb, var(--accent) 45%, var(--border))',
                    background: 'color-mix(in srgb, var(--accent) 6%, var(--card))',
                  }}
                >
                  <div className="sme-between sme-wrap" style={{ gap: 10 }}>
                    <div>
                      <div className="sme-row sme-strong">
                        <FileSpreadsheet size={16} /> Quy tắc Phương án Vay vốn (Mẫu Excel B4 chuẩn SME Connect)
                      </div>
                      <div className="sme-small sme-muted" style={{ marginTop: 3 }}>
                        1. Không trích xuất bằng OCR · 2. Không gõ chỉnh sửa trực tiếp trên màn hình · 3. CBBH tải file mẫu Excel B4, điền số liệu và tải lên lại để hệ thống đọc tất định 11 chỉ tiêu Hạn mức & Khả năng trả nợ.
                      </div>
                    </div>
                    <div className="sme-row sme-wrap">
                      <input
                        ref={b4InputRef}
                        type="file"
                        accept=".xlsx"
                        style={{ display: 'none' }}
                        onChange={(e) => handleUploadB4File(e.target.files?.[0])}
                      />
                      <Btn variant="secondary" onClick={handleDownloadB4}>
                        <Download size={14} /> Tải mẫu Excel B4 (.xlsx)
                      </Btn>
                      <Btn variant="primary" onClick={() => b4InputRef.current?.click()} disabled={busy}>
                        <Upload size={14} /> Upload Excel B4 đã điền
                      </Btn>
                      {!data.ocr.pavv_b4_loaded && (
                        <Btn variant="ghost" onClick={handleQuickFillStandardB4} disabled={busy}>
                          <Zap size={14} /> Nạp nhanh Mẫu B4 chuẩn
                        </Btn>
                      )}
                    </div>
                  </div>

                  {data.ocr.pavv_b4_summary && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
                      <div className="sme-between sme-wrap">
                        <span className="sme-small">
                          Nguồn đã nạp: <b className="sme-mono">{data.ocr.pavv_b4_summary.source_file}</b> ·
                          HM cho vay tối đa VPB: <b>{money(data.ocr.pavv_b4_summary.values.max_vpb_wc_limit)}</b> ·
                          DSCR dự phóng: <b>{data.ocr.pavv_b4_summary.computed_checks.effective_dscr}x</b>
                        </span>
                        <span className={`sme-pill ${data.ocr.pavv_b4_summary.computed_checks.formula_passed ? 't-ok' : 't-warn'}`}>
                          {data.ocr.pavv_b4_summary.computed_checks.formula_passed
                            ? '✓ Đạt kiểm tra công thức B4'
                            : `${data.ocr.pavv_b4_summary.computed_checks.warnings.length} cảnh báo công thức`}
                        </span>
                      </div>
                      {data.ocr.pavv_b4_summary.computed_checks.warnings.map((w, idx) => (
                        <div key={idx} className="sme-small" style={{ color: 'var(--warn)', marginTop: 4 }}>
                          • {w}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Field Cards Grid */}
              {visibleFields.length === 0 ? (
                <div className="sme-small sme-muted" style={{ padding: '12px 0' }}>
                  Tất cả các trường trong danh mục này đều ở trạng thái <b>Tin cậy</b> (đang ẩn theo bộ lọc rút gọn).
                </div>
              ) : (
                <div className="smec-field-grid">
                  {visibleFields.map((f) => {
                    const meta = TIER_META[f.confidence_tier]
                    const currentVal = draftValues[f.path] !== undefined
                      ? draftValues[f.path]
                      : (f.value === null || f.value === undefined ? '' : String(f.value))
                    return (
                      <div key={f.path} className={`smec-field-card tier-${f.confidence_tier}`}>
                        <div className="sme-between">
                          <span className="sme-small sme-strong">{f.label}</span>
                          <span className={`sme-pill t-${meta.tone}`}>
                            {f.readonly && <Lock size={10} />} {meta.label}
                          </span>
                        </div>

                        <input
                          className="smec-input"
                          disabled={f.readonly}
                          value={typeof f.value === 'number' && draftValues[f.path] === undefined && f.readonly
                            ? f.value.toLocaleString('vi-VN')
                            : currentVal}
                          placeholder={f.confidence_tier === 'missing' ? 'Chưa có dữ liệu' : ''}
                          onChange={(e) => setDraftValues({ ...draftValues, [f.path]: e.target.value })}
                        />

                        {f.confidence_tier === 'needs_confirm' && (
                          <div className="sme-small" style={{ color: 'var(--warn)' }}>
                            <ShieldAlert size={12} style={{ verticalAlign: 'middle' }} />{' '}
                            {f.conflict_note || 'Hệ thống cần bạn xác nhận giá trị này.'}
                          </div>
                        )}

                        <div className="sme-between sme-small sme-muted" style={{ marginTop: 2 }}>
                          <span className="sme-mono" style={{ fontSize: 11 }}>
                            {f.source?.doc_name
                              ? `${f.source.doc_name}${f.source.cell ? ` (${f.source.cell})` : ` · Tr.${f.source.page || 1}`}`
                              : 'Chưa gắn nguồn'}
                          </span>
                          <div className="sme-row">
                            {f.source?.bbox && (
                              <button className="sme-ref" onClick={() => setInspectField(f)}>
                                <Search size={11} style={{ verticalAlign: 'middle' }} /> Đối chiếu
                              </button>
                            )}
                            {!f.readonly && (f.confidence_tier !== 'trusted' || draftValues[f.path] !== undefined) && (
                              <button
                                className="sme-ref"
                                disabled={busy}
                                onClick={() => saveFieldConfirm(f)}
                              >
                                <Check size={11} style={{ verticalAlign: 'middle' }} /> Xác nhận
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Structured 1-N Entity Sub-tables */}
              {Object.entries(activeCat.tables || {}).map(([tableKey, rows]) => {
                if (!rows || rows.length === 0) return null
                const cols = Object.keys(rows[0])
                const tableLabels: Record<string, string> = {
                  leaders: 'Bảng Ban lãnh đạo & Người điều hành',
                  shareholders: 'Bảng Cổ đông / Thành viên góp vốn',
                  related_parties: 'Bảng Nhóm Khách hàng liên quan (KHLQ)',
                  buyers: 'Bảng Đối tác Đầu ra chủ lực (Bên mua)',
                  suppliers: 'Bảng Đối tác Đầu vào chủ lực (Nhà cung cấp)',
                  invoices: 'Bảng Đối chiếu Hóa đơn VAT & Hợp đồng',
                  guarantors: 'Bảng Người Bảo lãnh cá nhân (BLCN)',
                  collaterals: 'Bảng Danh mục Tài sản bảo đảm & Định giá Prosland',
                }
                return (
                  <div key={tableKey} style={{ marginTop: 16 }}>
                    <div className="sme-section-title">{tableLabels[tableKey] || tableKey} ({rows.length})</div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="smec-table">
                        <thead>
                          <tr>
                            {cols.map((c) => <th key={c}>{c}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r, idx) => (
                            <tr key={idx}>
                              {cols.map((c) => {
                                const v = r[c]
                                return (
                                  <td key={c}>
                                    {typeof v === 'number' && v >= 1_000_000 ? money(v) : String(v ?? '—')}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Side-by-Side PDF Bounding-Box Viewer (`5.1 - Đối chiếu file`) */}
        {inspectField && (
          <div className="sme-card tight" style={{ position: 'sticky', top: 0 }}>
            <div className="sme-between" style={{ marginBottom: 8 }}>
              <div>
                <div className="sme-strong">🔍 Đối chiếu tài liệu gốc</div>
                <div className="sme-small sme-muted">
                  {inspectField.source?.doc_name || 'Chứng từ'} · Trang {inspectField.source?.page || 1}
                </div>
              </div>
              <button className="sme-back" onClick={() => setInspectField(null)}><X size={15} /></button>
            </div>

            <div className="sme-small" style={{ marginBottom: 8 }}>
              Trường đang chọn: <b>{inspectField.label}</b>
            </div>

            {/* Simulated Page Canvas with Exact Proportional Yellow BBox Highlight */}
            <div className="smec-pdf-stage">
              <div style={{ fontSize: 11, color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: 6, marginBottom: 12 }}>
                TRANG {inspectField.source?.page || 1} · {inspectField.source?.doc_name}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.65, color: '#334155' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{String(data.case.customer.name || '')}</p>
                <p style={{ margin: '0 0 8px' }}>Mã số ĐKKD/MST: {String(data.case.customer.tax_id || '')} · CIF: {String(data.case.customer.cif || '')}</p>
                <p style={{ margin: '0 0 8px', color: '#94a3b8' }}>[Vùng văn bản trích xuất OCR được khoanh sáng màu vàng đúng tọa độ bbox]</p>
              </div>

              {inspectField.source?.bbox && (() => {
                const [x0, y0, x1, y1] = inspectField.source.bbox
                return (
                  <div
                    className="smec-bbox-highlight"
                    style={{
                      left: `${Math.max(4, x0 * 100)}%`,
                      top: `${Math.max(18, y0 * 100)}%`,
                      width: `${Math.min(90, Math.max(22, (x1 - x0) * 100))}%`,
                      minHeight: `${Math.max(32, (y1 - y0) * 260)}px`,
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#713f12',
                    }}
                  >
                    {inspectField.source?.snippet || String(inspectField.value ?? '')}
                  </div>
                )
              })()}
            </div>

            {inspectField.conflict_note && (
              <div className="sme-small" style={{ color: 'var(--warn)', marginTop: 8 }}>
                <AlertCircle size={12} style={{ verticalAlign: 'middle' }} /> {inspectField.conflict_note}
              </div>
            )}

            <div className="sme-between" style={{ marginTop: 10 }}>
              {inspectField.source?.doc_id ? (
                <Btn variant="ghost" onClick={() => handleDownloadSourceDoc(inspectField.source?.doc_id)}>
                  <Download size={13} /> Tải PDF gốc
                </Btn>
              ) : <span />}
              {!inspectField.readonly && (
                <Btn variant="primary" disabled={busy} onClick={() => saveFieldConfirm(inspectField)}>
                  <Check size={14} /> Xác nhận giá trị
                </Btn>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
