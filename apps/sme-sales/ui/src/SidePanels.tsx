import { Btn } from '@kirocrew/app-sdk/ui'
import { Check, ClipboardCheck, Copy, Download, Eye, FileSearch, History, Mail, MessageSquare, Trash2 } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { Banner, Empty, Pill, tone } from '@sme-ui/ui'
import {
  AUDIT_LABEL, CHANNEL, RULE_STATUS_META, XCHECK_META, actor, copyText, day, describeAudit, formatFactValue, showValue, when,
  type Action, type CaseDetail, type Catalog, type CheckItem, type Doc, type Draft, type DraftChannel,
  type PolicyCheckRow, type ProfileField,
  overallStatus,
} from './model'
import { ChannelSelect, DueDateInline } from './parts'

const SECTION: Record<string, string> = {
  customer: 'Pháp lý & Định danh (Lớp 1)',
  request: 'Phương án đề xuất vay',
  facts: 'Điều kiện kích hoạt & Tài chính / TSBĐ',
}


const POLICY_ST: Record<PolicyCheckRow['status'], { label: string; t: 'ok' | 'danger' | 'warn' | 'muted' }> = {
  met: { label: 'Đạt', t: 'ok' },
  not_met: { label: 'Không đạt', t: 'danger' },
  missing: { label: 'Thiếu dữ liệu', t: 'warn' },
  na: { label: 'Không áp dụng', t: 'muted' },
}

/* ---------- Tổng quan ---------- */

export function OverviewTab({
  detail, catalog, pendingDraftsCount, purposeWarn, readOnly, goDrafts, onAction, onChat,
}: {
  detail: CaseDetail; catalog: Catalog | null; pendingDraftsCount: number; purposeWarn?: CheckItem
  readOnly: boolean; goDrafts: () => void; onAction: (a: Action) => void; onChat: (prompt: string) => void
}) {
  const { case: c, overview: ov } = detail
  const sections = [...new Set(ov.profile.map((f) => f.section))]
  const policyChecks = ov.policy_checks ?? []
  const hasBreach = policyChecks.some((p) => p.status === 'not_met') || (purposeWarn && purposeWarn.status === 'open')

  return (
    <div className="sme-stack">
      {c.submitted && (
        <Banner t="info">
          Hồ sơ đã bàn giao Thẩm định lúc <b>{when(c.submitted.at)}</b> bởi {actor(c.submitted.by)}
          {c.submitted.note ? ` · Ghi chú: ${c.submitted.note}` : ''}.
          {c.submitted.handover?.status === 'transferred'
            ? ` Đã đồng bộ sang app Thẩm định SME (${c.submitted.handover.files_copied ?? 0} file đính kèm).`
            : c.submitted.handover?.message
              ? ` ${c.submitted.handover.message}`
              : ''}
        </Banner>
      )}
      {!c.submitted && pendingDraftsCount > 0 && (
        <Banner t="warn">
          Có <b>{pendingDraftsCount} thư nháp</b> yêu cầu bổ sung đang chờ ĐVKD gửi khách hàng. Xem tại tab{' '}
          <button type="button" className="sme-ref" onClick={goDrafts}>Thư yêu cầu KH</button>.
        </Banner>
      )}

      <div className="sme-card">
        <div className="sme-between" style={{ marginBottom: 10 }}>
          <h3 className="sme-h3">Thông tin khách hàng &amp; Phương án đề xuất</h3>
          {!readOnly && (
            <Btn onClick={() => onChat(`Cập nhật thông tin hồ sơ ${c.case_id}: `)}>
              <MessageSquare size={13} /> Cập nhật qua trợ lý
            </Btn>
          )}
        </div>
        {ov.profile.length === 0 ? (
          <div className="sme-small sme-muted">
            Chưa có dữ liệu định danh hoặc phương án vay. Trao đổi với trợ lý để ghi nhận hoặc trích xuất từ chứng từ.
          </div>
        ) : (
          <div className="sme-stack" style={{ gap: 12 }}>
            {sections.map((s) => (
              <div key={s}>
                <div className="sme-section-title" style={{ marginBottom: 6 }}>{SECTION[s] ?? s}</div>
                <dl className="ss-kv">
                  {ov.profile.filter((f) => f.section === s).map((f) => (
                    <Fragment key={f.path}><dt>{f.label}</dt><dd>{showValue(f.path, f.value, catalog)}</dd></Fragment>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>

      {(policyChecks.length > 0 || purposeWarn) && (
        <div className="sme-card">
          <div className="sme-between" style={{ marginBottom: 8 }}>
            <h3 className="sme-h3">Điều kiện chính sách sơ bộ {c.request?.product_code ?? ''}</h3>
            {hasBreach ? <Pill t="danger">Có tiêu chí chưa đạt</Pill> : <Pill t="ok">Đạt điều kiện sơ bộ</Pill>}
          </div>
          {purposeWarn && purposeWarn.status === 'open' && (
            <div className="sme-small" style={{ marginBottom: 8, color: 'var(--danger)' }}>
              {purposeWarn.title}: {purposeWarn.reason}
            </div>
          )}
          {policyChecks.length > 0 && (
            <table className="sme-table">
              <thead>
                <tr><th>Điều kiện</th><th className="sme-num">Yêu cầu</th><th className="sme-num">Thực tế</th><th>Kết quả</th></tr>
              </thead>
              <tbody>
                {policyChecks.map((p) => {
                  const st = POLICY_ST[p.status]
                  return (
                    <tr key={p.id}>
                      <td>{p.label}<div className="sme-small sme-muted">{p.clause}</div></td>
                      <td className="sme-num">{p.op} {formatFactValue(p.fact, p.threshold)}</td>
                      <td className="sme-num">{formatFactValue(p.fact, p.actual)}</td>
                      <td><Pill t={st.t}>{st.label}</Pill></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {hasBreach && !readOnly && (
            <div style={{ marginTop: 10 }}>
              <Btn onClick={() => onChat(`Hồ sơ ${c.case_id} đang vướng điều kiện chính sách sơ bộ. Gợi ý các phương án cơ cấu lại đề xuất.`)}>
                <MessageSquare size={13} /> Đề xuất cơ cấu lại qua trợ lý
              </Btn>
            </div>
          )}
        </div>
      )}

      {(ov.crosschecks?.rules?.length ?? 0) > 0 && (
        <div className="sme-card">
          <div className="sme-between" style={{ marginBottom: 8 }}>
            <h3 className="sme-h3">7 Quy tắc đối chiếu chéo trọng yếu</h3>
            <Pill t={overallStatus(ov.crosschecks!.overall_status).tone}>
              {overallStatus(ov.crosschecks!.overall_status).label}
            </Pill>
          </div>
          <table className="sme-table">
            <thead>
              <tr><th style={{ width: 48 }}>Mã</th><th>Nội dung đối chiếu</th><th>Chứng từ</th><th>Kết quả</th></tr>
            </thead>
            <tbody>
              {ov.crosschecks!.rules.filter((r) => r.status !== 'SKIPPED').map((r) => {
                const st = XCHECK_META[r.status]
                return (
                  <tr key={r.id}>
                    <td className="sme-mono">{r.id}</td>
                    <td>
                      <div className="sme-strong">{r.title}</div>
                      <div className="sme-small sme-muted">{r.detail}</div>
                    </td>
                    <td className="sme-mono sme-small">{r.document_refs.length ? r.document_refs.join(', ') : '—'}</td>
                    <td><Pill t={st.tone}>{st.label}</Pill></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {ov.actions.length > 0 && (
        <div className="sme-card">
          <h3 className="sme-h3" style={{ marginBottom: 6 }}>Hành động đề xuất ({ov.actions.length})</h3>
          {ov.actions.map((a) => (
            <div key={a.id} className={`sme-finding ${tone(a.tone)}`}>
              <div className="bar" />
              <div className="sme-between sme-wrap" style={{ gap: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="sme-finding-topic">{a.title}</div>
                  {a.detail.length > 0 && (
                    <div className="sme-finding-text sme-muted">{a.detail.slice(0, 4).join(' · ')}</div>
                  )}
                </div>
                {a.cta !== 'none' && (
                  <Btn onClick={() => onAction(a)}>
                    {a.cta === 'draft' ? <><Mail size={13} /> Soạn thư</>
                      : a.cta === 'submit' ? <><ClipboardCheck size={13} /> Bàn giao</>
                        : <><MessageSquare size={13} /> Trợ lý</>}
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Chứng từ ---------- */

function docValidity(d: Doc, items: CheckItem[], catalog: Catalog | null): { label: string; t: 'ok' | 'warn' | 'danger' | 'muted' } {
  if (!d.type) return { label: 'Chưa phân loại', t: 'warn' }
  const expired = items.some(
    (i) => i.rule_status === 'FAIL' && i.document_refs.includes(d.id) && (i.fail_reasons ?? []).some((r) => /hết hiệu lực/i.test(r)),
  )
  if (expired) return { label: 'Hết hiệu lực', t: 'danger' }
  const dt = items.find((i) => i.key === `date:${d.type}`)
  if (dt && (dt.status === 'open' || dt.status === 'requested')) return { label: 'Thiếu ngày lập', t: 'warn' }
  const months = catalog?.documents.types[d.type]?.validity_months
  return months ? { label: `Hiệu lực ${months} tháng`, t: 'ok' } : { label: 'Không giới hạn', t: 'muted' }
}

export function DocsTab({ docs, items, profile, catalog, focusDocId, readOnly, onDownload, onRemove, onExtractDoc, onUpload }: {
  docs: Doc[]; items: CheckItem[]; profile: ProfileField[]; catalog: Catalog | null
  focusDocId: string | null; readOnly: boolean
  onDownload: (docId: string) => Promise<void>
  onRemove: (docId: string) => Promise<boolean>
  onExtractDoc: (docId: string) => void
  onUpload: () => void
}) {
  const types = catalog?.documents.types ?? {}
  const presentPaths = new Set(profile.map((p) => p.path))
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    if (!focusDocId) return
    requestAnimationFrame(() => document.getElementById(`doc-${focusDocId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }, [focusDocId])

  if (docs.length === 0) {
    return (
      <Empty icon={<FileSearch size={30} />} title="Chưa có chứng từ nào"
        hint="Đính kèm PDF, ảnh chụp, Word hoặc Excel trong chat với trợ lý để phân loại và trích xuất thông tin."
        action={!readOnly ? <Btn primary onClick={onUpload}>Gửi chứng từ cho trợ lý</Btn> : undefined} />
    )
  }

  return (
    <div className="sme-stack">
      <div className="sme-between">
        <span className="sme-small sme-muted">Tổng cộng {docs.length} chứng từ đã tiếp nhận vào hồ sơ.</span>
        {!readOnly && <Btn onClick={onUpload}>Gửi bổ sung qua trợ lý</Btn>}
      </div>
      <div className="sme-card tight" style={{ overflowX: 'auto' }}>
        <table className="sme-table">
          <thead>
            <tr><th style={{ width: 64 }}>Mã</th><th>Loại chứng từ &amp; Tệp</th><th className="sme-num">Ngày lập</th><th>Hiệu lực</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {docs.map((d) => {
              const meta = d.type ? types[d.type] : undefined
              const validity = docValidity(d, items, catalog)
              const skipped = new Set(d.not_stated ?? [])
              const missingExtract = (meta?.extract ?? []).filter((p) => !presentPaths.has(p) && !skipped.has(p))
              const isConfirm = confirmId === d.id
              return (
                <tr key={d.id} id={`doc-${d.id}`} className={focusDocId === d.id ? 'focus' : undefined}>
                  <td className="sme-mono">{d.id}</td>
                  <td>
                    <div className="sme-strong">{meta?.label ?? (d.type || d.name)}</div>
                    <div className="sme-small sme-muted">
                      {d.name}{d.size ? ` · ${Math.max(1, Math.round(d.size / 1024))} KB` : ''}
                    </div>
                    {d.summary && <div className="sme-small" style={{ marginTop: 3 }}>{d.summary}</div>}
                    {(!d.type || missingExtract.length > 0) && !readOnly && (
                      <div className="sme-small" style={{ marginTop: 3, color: 'var(--warn)' }}>
                        {!d.type ? 'Chứng từ chưa được phân loại.' : `Còn ${missingExtract.length} chỉ tiêu chưa trích xuất.`}
                      </div>
                    )}
                  </td>
                  <td className="sme-num">{d.issued_date ? day(d.issued_date) : '—'}</td>
                  <td><Pill t={validity.t}>{validity.label}</Pill></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="sme-row" style={{ gap: 4 }}>
                      {d.file && (
                        <Btn busy={busyId === `dl:${d.id}`} onClick={async () => {
                          setBusyId(`dl:${d.id}`)
                          await onDownload(d.id)
                          setBusyId(null)
                        }}>
                          {/\.(pdf|png|jpe?g|webp|txt)$/i.test(d.name) ? <Eye size={13} /> : <Download size={13} />} Xem / Tải
                        </Btn>
                      )}
                      {(!d.type || missingExtract.length > 0) && !readOnly && (
                        <Btn onClick={() => onExtractDoc(d.id)}>Đọc lại</Btn>
                      )}
                      {!readOnly && !isConfirm && (
                        <Btn onClick={() => setConfirmId(d.id)} title="Gỡ chứng từ gửi nhầm"><Trash2 size={13} /></Btn>
                      )}
                      {!readOnly && isConfirm && (
                        <>
                          <Btn onClick={() => setConfirmId(null)}>Huỷ</Btn>
                          <Btn primary busy={busyId === `rm:${d.id}`} onClick={async () => {
                            setBusyId(`rm:${d.id}`)
                            const ok = await onRemove(d.id)
                            if (ok) setConfirmId(null)
                            setBusyId(null)
                          }}>Xác nhận gỡ</Btn>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------- Thư yêu cầu KH ---------- */

type DFilter = 'draft' | 'sent' | 'all'

function DraftCard({ d, items, readOnly, onSent }: {
  d: Draft; items: Map<string, CheckItem>; readOnly: boolean; onSent: (id: string, dueDate: string) => Promise<boolean>
}) {
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const copy = async () => {
    if (await copyText(d.subject ? `${d.subject}\n\n${d.body}` : d.body)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }
  return (
    <div className={`sme-card sme-review ${tone(d.status === 'sent' ? 'ok' : 'warn')}`}>
      <div className="sme-between sme-wrap">
        <span className="sme-row">
          <span className="sme-mono sme-muted">{d.id}</span>
          <Pill t="accent">{CHANNEL[d.channel]}</Pill>
          <span className="sme-small sme-muted">{when(d.created_at)}</span>
        </span>
        <div className="sme-row">
          <Pill t={d.status === 'sent' ? 'ok' : 'warn'}>
            {d.status === 'sent' ? `Đã gửi ${day(d.sent_at)}` : 'Chờ ĐVKD gửi'}
          </Pill>
          <Btn onClick={copy}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Đã chép' : 'Sao chép'}</Btn>
        </div>
      </div>
      {d.subject && <div className="sme-strong" style={{ marginTop: 8 }}>{d.subject}</div>}
      <pre className="sme-pre">{d.body}</pre>
      {d.requirement_keys.length > 0 && (
        <div className="sme-small sme-muted" style={{ marginTop: 8 }}>
          Hạng mục đính kèm: {d.requirement_keys.map((k) => items.get(k)?.title ?? k).join('; ')}
        </div>
      )}
      {d.status === 'draft' && !readOnly && (
        <DueDateInline label="Hạn cam kết KH gửi" confirmLabel="Tôi đã gửi" busy={busy}
          onConfirm={async (dueDate) => {
            setBusy(true)
            await onSent(d.id, dueDate)
            setBusy(false)
          }} />
      )}
    </div>
  )
}

export function DraftsTab({ drafts, items, readOnly, hasOpenItems, onSent, onCompose }: {
  drafts: Draft[]; items: CheckItem[]; readOnly: boolean; hasOpenItems: boolean
  onSent: (id: string, dueDate: string) => Promise<boolean>; onCompose: (ch: DraftChannel) => void
}) {
  const [filter, setFilter] = useState<DFilter>('all')
  const byKey = new Map(items.map((i) => [i.key, i]))
  const pending = drafts.filter((d) => d.status === 'draft').length
  const shown = [...drafts].reverse().filter((d) => filter === 'all' || d.status === filter)

  return (
    <div className="sme-stack">
      <div className="sme-between sme-wrap">
        <div className="sme-filters" role="tablist">
          {([['all', `Tất cả (${drafts.length})`], ['draft', `Chờ gửi (${pending})`], ['sent', `Đã gửi (${drafts.length - pending})`]] as [DFilter, string][])
            .map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k}
                className={`sme-filter ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}</button>
            ))}
        </div>
        {!readOnly && hasOpenItems && <ChannelSelect onPick={onCompose} />}
      </div>
      {shown.length === 0 && (
        <Empty icon={<Mail size={28} />} title="Chưa có thư yêu cầu khách hàng"
          hint={hasOpenItems ? 'Chọn kênh ở trên hoặc tích chọn hạng mục ở tab Danh mục kiểm tra để trợ lý soạn nháp.' : 'Không còn hạng mục thiếu cần yêu cầu khách hàng.'} />
      )}
      {shown.map((d) => (
        <DraftCard key={d.id} d={d} items={byKey} readOnly={readOnly} onSent={onSent} />
      ))}
    </div>
  )
}

/* ---------- Audit ---------- */

export function AuditTab({ audit }: { audit: { ts: string; action: string; [k: string]: unknown }[] }) {
  if (audit.length === 0) return <Empty icon={<History size={30} />} title="Chưa có nhật ký" />
  const toneOf = (action: string) =>
    action === 'case_submitted' ? 'ok'
      : action === 'case_reopened' || action === 'document_remove' ? 'warn'
        : action === 'requirement_set' ? 'accent' : 'muted'
  return (
    <div className="sme-card">
      <div className="sme-tl">
        {[...audit].reverse().map((a, i) => {
          const detail = describeAudit(a)
          return (
            <div key={i} className={`sme-tl-item ${tone(toneOf(a.action))}`}>
              <div className="sme-between">
                <span className="sme-strong" style={{ fontSize: 13 }}>
                  {AUDIT_LABEL[a.action] ?? a.action}{detail ? ` · ${detail}` : ''}
                </span>
                <span className="sme-small sme-muted">{when(a.ts)}</span>
              </div>
              <div className="sme-small sme-muted">{actor(String(a.actor ?? a.agent ?? a.author ?? ''))}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
