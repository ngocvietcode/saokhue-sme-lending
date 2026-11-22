import { useAppApi } from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import {
  Building2, CheckCircle2, CloudDownload, FileSpreadsheet, FolderKanban,
  MessageSquare, Plus, Search, ShieldCheck, Sparkles, X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ago, errMsg, moneyShort } from '@sme-ui/format'
import {
  API, type CaseSummary, type Catalog, type FullCase, type SmecProductCatalog,
} from './model'

type Props = {
  catalog: Catalog | null
  assistantOpen: boolean
  syncTick: number
  onOpen: (caseId: string) => void
  onToggleAssistant: () => void
  onAskAssistant: (prompt: string) => void
}

export default function CaseListView({
  catalog, assistantOpen, syncTick, onOpen, onToggleAssistant, onAskAssistant,
}: Props) {
  const api = useAppApi()
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [query, setQuery] = useState('')

  // Creation / NCLOS Pull Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [createTab, setCreateTab] = useState<'new' | 'nclos'>('new')
  const [dkkdNo, setDkkdNo] = useState('0108924510')
  const [reqAmountBillion, setReqAmountBillion] = useState('17')
  const [hasCollateral, setHasCollateral] = useState(true)
  const [lookupRes, setLookupRes] = useState<{
    enterprise: Record<string, unknown>
    branch_check: { branch_code: string; dao_code: string; is_badbranch: boolean }
    recommendations: SmecProductCatalog[]
  } | null>(null)
  const [selectedCodes, setSelectedCodes] = useState<Record<string, number>>({})
  const [commitmentsOk, setCommitmentsOk] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    api.get<{ cases: CaseSummary[] }>(`${API}/cases`)
      .then((r) => { setCases(r.cases || []); setError('') })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false))
  }, [api])

  useEffect(() => { load() }, [load, syncTick])

  const counts = useMemo(() => {
    const c = { ALL: cases.length, DRAFT: 0, INITIATING: 0, APPROVED: 0, REJECTED: 0 }
    for (const row of cases) {
      if (row.list_status in c) c[row.list_status as keyof typeof c] += 1
    }
    return c
  }, [cases])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cases.filter((r) => {
      if (statusFilter !== 'ALL' && r.list_status !== statusFilter) return false
      if (!q) return true
      return (
        r.customer_name.toLowerCase().includes(q)
        || r.smec_id.toLowerCase().includes(q)
        || (r.nclos_id || '').toLowerCase().includes(q)
        || r.tax_id.toLowerCase().includes(q)
        || r.cif.toLowerCase().includes(q)
      )
    })
  }, [cases, statusFilter, query])

  const runLookup = async () => {
    setBusy(true)
    setError('')
    try {
      const amt = Math.max(Number(reqAmountBillion) || 10, 1) * 1_000_000_000
      const res = await api.post<NonNullable<typeof lookupRes>>(`${API}/lookup`, {
        dkkd_no: dkkdNo.trim(),
        requested_amount: amt,
        has_collateral: hasCollateral,
      })
      setLookupRes(res)
      const initSel: Record<string, number> = {}
      const initCom: Record<string, boolean> = {}
      res.recommendations.filter((p) => p.eligible).slice(0, 2).forEach((p) => {
        initSel[p.code] = p.suggested_limit || 5_000_000_000
        initCom[p.code] = true
      })
      setSelectedCodes(initSel)
      setCommitmentsOk(initCom)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const submitCreate = async () => {
    if (!lookupRes) return
    const chosen = lookupRes.recommendations.filter((p) => selectedCodes[p.code] !== undefined)
    if (!chosen.length) {
      setError('Vui lòng chọn ít nhất 01 sản phẩm đề xuất.')
      return
    }
    if (chosen.some((p) => !commitmentsOk[p.code])) {
      setError('Vui lòng xác nhận đủ Cam kết của CBBH cho từng sản phẩm được chọn.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const proposed_products = chosen.map((p) => ({
        code: p.code,
        match_score: p.match_score || 88,
        proposed_limit: selectedCodes[p.code],
        term_months: p.default_term_months,
        commitments_checked: true,
      }))
      const total = proposed_products.reduce((s, x) => s + x.proposed_limit, 0)
      const created = await api.post<FullCase>(`${API}/cases`, {
        dkkd_no: dkkdNo.trim(),
        company_name: lookupRes.enterprise.company_name,
        requested_amount: total,
        has_collateral: hasCollateral,
        proposed_products,
      })
      setModalOpen(false)
      onOpen(created.case.case_id)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const handlePullNclos = async (nclosId: string) => {
    setBusy(true)
    setError('')
    try {
      const pulled = await api.post<FullCase>(`${API}/cases/pull-nclos`, { nclos_id: nclosId })
      setModalOpen(false)
      onOpen(pulled.case.case_id)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const sellerSample = cases[0]?.seller || {
    user_id: 'Namcvt123',
    dao_code: 'DAO8821',
    branch_name: 'VPBank CN Đông Đô — Phòng SME 1',
    is_badbranch: false,
  }

  return (
    <div className="sme-scroll">
      {/* Top Seller Context Bar */}
      <div className="smec-seller-bar">
        <div className="sme-row sme-wrap" style={{ gap: 14 }}>
          <span className="sme-row sme-strong">
            <Sparkles size={16} /> SME Connect · AI Lending Portal (Dual-Mode)
          </span>
          <span className="sme-chip">CBBH: <b>{sellerSample.user_id || 'Namcvt123'}</b></span>
          <span className="sme-chip">Mã DAO: <b>{sellerSample.dao_code || 'DAO8821'}</b></span>
          <span className="sme-chip">{sellerSample.branch_name || 'CN Đông Đô'}</span>
          <span className={`sme-pill ${sellerSample.is_badbranch ? 't-danger' : 't-ok'}`}>
            <ShieldCheck size={12} /> {sellerSample.is_badbranch ? 'ĐVKD thuộc Badbranch' : 'Badbranch: Không vi phạm'}
          </span>
        </div>
        <div className="sme-row">
          <Btn variant="secondary" onClick={() => { setCreateTab('nclos'); setModalOpen(true) }}>
            <CloudDownload size={14} /> Kéo hồ sơ từ NCLOS
          </Btn>
          <Btn variant="primary" onClick={() => { setCreateTab('new'); setModalOpen(true) }}>
            <Plus size={14} /> Tạo mới hồ sơ (Luồng A)
          </Btn>
          <Btn variant="ghost" onClick={onToggleAssistant}>
            <MessageSquare size={14} /> {assistantOpen ? 'Ẩn Copilot' : 'Mở Copilot'}
          </Btn>
        </div>
      </div>

      {/* KPI Strip matching SME Connect List Statuses */}
      <div className="sme-kpis">
        <div className="sme-kpi t-accent" onClick={() => setStatusFilter('ALL')} style={{ cursor: 'pointer' }}>
          <div className="sme-kpi-icon"><FolderKanban size={18} /></div>
          <div>
            <div className="sme-kpi-label">Tổng hồ sơ SME Connect</div>
            <div className="sme-kpi-value">{counts.ALL}</div>
            <div className="sme-kpi-hint">Kho dữ liệu độc lập 100%</div>
          </div>
        </div>
        <div className="sme-kpi t-muted" onClick={() => setStatusFilter('DRAFT')} style={{ cursor: 'pointer' }}>
          <div className="sme-kpi-icon"><FileSpreadsheet size={18} /></div>
          <div>
            <div className="sme-kpi-label">Lưu nháp / Đang xử lý</div>
            <div className="sme-kpi-value">{counts.DRAFT}</div>
            <div className="sme-kpi-hint">Kiểm tra OCR, Mẫu B4 & 9 Agents</div>
          </div>
        </div>
        <div className="sme-kpi t-info" onClick={() => setStatusFilter('INITIATING')} style={{ cursor: 'pointer' }}>
          <div className="sme-kpi-icon"><Building2 size={18} /></div>
          <div>
            <div className="sme-kpi-label">Đang khởi tạo / Thương lượng</div>
            <div className="sme-kpi-value">{counts.INITIATING}</div>
            <div className="sme-kpi-hint">Đồng bộ NCLOS / ELOS & CPC</div>
          </div>
        </div>
        <div className="sme-kpi t-ok" onClick={() => setStatusFilter('APPROVED')} style={{ cursor: 'pointer' }}>
          <div className="sme-kpi-icon"><CheckCircle2 size={18} /></div>
          <div>
            <div className="sme-kpi-label">Đã phê duyệt / Hoàn tất B2B</div>
            <div className="sme-kpi-value">{counts.APPROVED}</div>
            <div className="sme-kpi-hint">Chuyển Soạn thảo hợp đồng</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="sme-card" style={{ borderColor: 'var(--danger)', marginBottom: 12, color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* Search & Status Filter Toolbar */}
      <div className="sme-between sme-wrap" style={{ marginBottom: 14 }}>
        <div className="sme-filters">
          {[
            ['ALL', `Tất cả (${counts.ALL})`],
            ['DRAFT', `Lưu nháp (${counts.DRAFT})`],
            ['INITIATING', `Đang khởi tạo (${counts.INITIATING})`],
            ['APPROVED', `Đã phê duyệt (${counts.APPROVED})`],
            ['REJECTED', `Bị từ chối / Huỷ (${counts.REJECTED})`],
          ].map(([k, label]) => (
            <button
              key={k}
              className={`sme-filter ${statusFilter === k ? 'on' : ''}`}
              onClick={() => setStatusFilter(k)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sme-row">
          <div className="sme-search">
            <Search size={14} className="sme-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm Mã HS-..., NCLOS-..., Tên DN, MST, CIF..."
            />
          </div>
          <Btn
            variant="ghost"
            onClick={() => onAskAssistant('Tổng hợp danh sách hồ sơ trên SME Connect, nêu rõ hồ sơ nào đang chờ xác nhận OCR/Mẫu B4 và hồ sơ nào đang chờ thương lượng Nghị quyết ELOS.')}
          >
            Nhờ Copilot rà soát
          </Btn>
        </div>
      </div>

      {/* Case Grid */}
      {loading ? (
        <div className="sme-card sme-muted">Đang tải danh sách hồ sơ SME Connect...</div>
      ) : filtered.length === 0 ? (
        <div className="sme-card sme-muted">Không có hồ sơ khớp bộ lọc hiện tại.</div>
      ) : (
        <div className="sme-cases">
          {filtered.map((c) => (
            <div key={c.case_id} className="sme-card hover" onClick={() => onOpen(c.case_id)}>
              <div className="sme-between" style={{ marginBottom: 6 }}>
                <div className="sme-row sme-wrap">
                  <span className="sme-mono sme-strong">{c.smec_id}</span>
                  {c.nclos_id && <span className="sme-chip sme-mono">{c.nclos_id}</span>}
                </div>
                <span className={`sme-pill t-${c.status_tone}`}>• {c.detail_status_label}</span>
              </div>

              <div className="sme-h2" style={{ marginBottom: 4 }}>{c.customer_name}</div>
              <div className="sme-small sme-muted" style={{ marginBottom: 10 }}>
                ĐKKD/MST: <span className="sme-mono">{c.tax_id}</span> · CIF: <span className="sme-mono">{c.cif}</span>
              </div>

              <div className="sme-between">
                <div className="sme-case-amount">{moneyShort(c.total_proposed_limit)}</div>
                <span className="sme-small sme-muted">{c.documents_count} tài liệu · Bước {c.wizard_step}/5</span>
              </div>

              {/* 5-step Wizard mini progress bar */}
              <div className={`sme-pipe t-${c.status_tone}`}>
                {[1, 2, 3, 4, 5].map((step) => (
                  <span key={step} className={step <= c.wizard_step ? '' : 'none'} />
                ))}
              </div>

              <div className="sme-row sme-wrap" style={{ marginTop: 8 }}>
                {c.proposed_products.map((p) => (
                  <span key={p.code} className="sme-chip">
                    {p.name.split('—').pop()?.trim() || p.code}: <b>{moneyShort(p.proposed_limit)}</b>
                  </span>
                ))}
                {c.b2b_confirmed && <span className="sme-pill t-ok">✓ Đã có B2B</span>}
              </div>

              <div className="sme-between sme-small sme-muted" style={{ marginTop: 10 }}>
                <span>Trạng thái DS: <b>{c.list_status_label}</b></span>
                <span>Cập nhật {ago(c.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Tạo mới Đề xuất Đa sản phẩm HOẶC Tải về từ NCLOS */}
      {modalOpen && (
        <div className="smec-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="smec-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sme-between" style={{ marginBottom: 12 }}>
              <h2 className="sme-h2">Khởi tạo Hồ sơ Cấp tín dụng — SME Connect (Luồng A)</h2>
              <button className="sme-back" onClick={() => setModalOpen(false)}><X size={16} /></button>
            </div>

            <div className="sme-tabs">
              <button className={`sme-tab ${createTab === 'new' ? 'on' : ''}`} onClick={() => setCreateTab('new')}>
                <Sparkles size={14} /> Tạo mới & Đề xuất gói đa sản phẩm
              </button>
              <button className={`sme-tab ${createTab === 'nclos' ? 'on' : ''}`} onClick={() => setCreateTab('nclos')}>
                <CloudDownload size={14} /> Tải về hồ sơ đã có trên NCLOS
              </button>
            </div>

            {createTab === 'new' ? (
              <div className="sme-stack">
                <div className="smec-field-grid">
                  <div>
                    <label className="sme-small sme-muted">Số ĐKKD / Mã số thuế *</label>
                    <input
                      className="smec-input"
                      value={dkkdNo}
                      onChange={(e) => setDkkdNo(e.target.value)}
                      placeholder="VD: 0108924510 hoặc nhập MST bất kỳ"
                    />
                  </div>
                  <div>
                    <label className="sme-small sme-muted">Tổng nhu cầu vốn dự kiến (Tỷ VNĐ) *</label>
                    <input
                      className="smec-input"
                      type="number"
                      value={reqAmountBillion}
                      onChange={(e) => setReqAmountBillion(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
                    <label className="sme-row sme-small" style={{ cursor: 'pointer', paddingBottom: 6 }}>
                      <input
                        type="checkbox"
                        checked={hasCollateral}
                        onChange={(e) => setHasCollateral(e.target.checked)}
                      />
                      Có tài sản bảo đảm (BĐS / Tiền gửi / PTVT)
                    </label>
                  </div>
                </div>

                <div className="sme-row">
                  <Btn variant="primary" onClick={runLookup} disabled={busy || !dkkdNo.trim()}>
                    {busy ? 'Đang tra cứu CIF & chấm điểm...' : 'Tra cứu CIF & Đề xuất sản phẩm AI'}
                  </Btn>
                  <span className="sme-small sme-muted">
                    Gợi ý thử nhanh: <code>0108924510</code> (Minh Phát) hoặc <code>0109412800</code> (Sao Việt)
                  </span>
                </div>

                {lookupRes && (
                  <div className="sme-stack" style={{ marginTop: 6 }}>
                    <div className="sme-card tight" style={{ background: 'color-mix(in srgb, var(--ok) 7%, var(--card))' }}>
                      <div className="sme-between sme-wrap">
                        <div>
                          <div className="sme-strong">{String(lookupRes.enterprise.company_name)}</div>
                          <div className="sme-small sme-muted">
                            ĐKKD (khóa cứng): <b className="sme-mono">{String(lookupRes.enterprise.dkkd_no)}</b> ·
                            Mã CIF (khóa cứng): <b className="sme-mono">{String(lookupRes.enterprise.cif)}</b> ·
                            ĐDPL: <b>{String(lookupRes.enterprise.legal_rep_name || '—')}</b>
                          </div>
                        </div>
                        <span className="sme-pill t-ok">Đủ điều kiện phân luồng A</span>
                      </div>
                    </div>

                    <div className="sme-section-title">Gói sản phẩm AI đề xuất (Chọn 1 hoặc nhiều sản phẩm dùng chung bộ hồ sơ)</div>
                    {lookupRes.recommendations.map((prod) => {
                      const checked = selectedCodes[prod.code] !== undefined
                      return (
                        <div
                          key={prod.code}
                          className="sme-card tight"
                          style={{
                            opacity: prod.eligible ? 1 : 0.55,
                            borderColor: checked ? 'var(--accent)' : undefined,
                          }}
                        >
                          <div className="sme-between sme-wrap">
                            <label className="sme-row sme-strong" style={{ cursor: prod.eligible ? 'pointer' : 'not-allowed' }}>
                              <input
                                type="checkbox"
                                disabled={!prod.eligible}
                                checked={checked}
                                onChange={(e) => {
                                  const next = { ...selectedCodes }
                                  if (e.target.checked) next[prod.code] = prod.suggested_limit || 2_000_000_000
                                  else delete next[prod.code]
                                  setSelectedCodes(next)
                                }}
                              />
                              {prod.name}
                              {!prod.requires_collateral && <span className="sme-pill t-info">Tín chấp</span>}
                            </label>
                            <div className="sme-row">
                              <span className={`sme-pill ${(prod.match_score || 0) >= 85 ? 't-ok' : 't-warn'}`}>
                                Độ phù hợp: {prod.match_score}%
                              </span>
                            </div>
                          </div>
                          <div className="sme-small sme-muted" style={{ margin: '4px 0 8px' }}>{prod.highlights}</div>

                          {checked && (
                            <div className="sme-stack" style={{ paddingTop: 6, borderTop: '1px dashed var(--border)' }}>
                              <div className="sme-row sme-wrap">
                                <span className="sme-small">Hạn mức đề xuất (VNĐ):</span>
                                <input
                                  className="smec-input"
                                  style={{ maxWidth: 220 }}
                                  type="number"
                                  step={100_000_000}
                                  value={selectedCodes[prod.code]}
                                  onChange={(e) => setSelectedCodes({
                                    ...selectedCodes,
                                    [prod.code]: Number(e.target.value) || 0,
                                  })}
                                />
                                <span className="sme-small sme-muted">({moneyShort(selectedCodes[prod.code])})</span>
                              </div>
                              <label className="sme-row sme-small" style={{ cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(commitmentsOk[prod.code])}
                                  onChange={(e) => setCommitmentsOk({ ...commitmentsOk, [prod.code]: e.target.checked })}
                                />
                                <span><b>Cam kết CBBH:</b> {prod.commitments.join(' ')}</span>
                              </label>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    <div className="sme-between" style={{ marginTop: 6 }}>
                      <span className="sme-small sme-muted">
                        Tổng hạn mức gói đã chọn:{' '}
                        <b>{moneyShort(Object.values(selectedCodes).reduce((a, b) => a + b, 0))}</b>
                      </span>
                      <Btn variant="primary" onClick={submitCreate} disabled={busy}>
                        Khởi tạo hồ sơ & chuyển bước Upload →
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="sme-stack">
                <div className="sme-small sme-muted">
                  Chọn bộ hồ sơ đã mở trên <b>NCLOS</b> để kéo tự động thông tin khách hàng, mã CIF, danh mục sản phẩm và toàn bộ chứng từ đã tải lên về SME Connect:
                </div>
                {(catalog?.nclos_importable || []).map((nc) => (
                  <div key={nc.nclos_id} className="sme-card tight">
                    <div className="sme-between sme-wrap">
                      <div>
                        <div className="sme-row">
                          <span className="sme-mono sme-strong">{nc.nclos_id}</span>
                          <span className="sme-chip sme-mono">{nc.elos_id}</span>
                        </div>
                        <div className="sme-strong" style={{ marginTop: 4 }}>{nc.company_name}</div>
                        <div className="sme-small sme-muted">
                          MST: {nc.dkkd_no} · CIF: {nc.cif} · Đã có {nc.documents_count} tài liệu trên NCLOS · Tổng nhu cầu: <b>{moneyShort(nc.requested_total)}</b>
                        </div>
                      </div>
                      <Btn variant="primary" disabled={busy} onClick={() => handlePullNclos(nc.nclos_id)}>
                        <CloudDownload size={14} /> Kéo về SME Connect
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
