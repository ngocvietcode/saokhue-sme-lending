import { FileText } from 'lucide-react'
import { Empty, Pill, type Tone } from '@sme-ui/ui'
import { ago, day, moneyShort, type DossierRow } from './model'

export function dossierStatus(r: DossierRow): { label: string; t: Tone } {
  if (r.stage === 'submitted') return { label: 'Đã bàn giao', t: 'info' }
  if (r.overdue > 0) return { label: `${r.overdue} quá hạn`, t: 'danger' }
  if (r.ready) return { label: 'Đủ điều kiện trình', t: 'ok' }
  const actionable = r.progress?.to_request ?? r.actionable_blocking ?? r.blocking_open
  if (actionable > 0) return { label: `Thiếu ${actionable} mục chặn`, t: 'warn' }
  if (r.requested > 0) return { label: `Chờ KH (${r.requested})`, t: 'info' }
  return { label: 'Khởi tạo', t: 'muted' }
}

/** Mandatory items done / total: the same figure the dossier page shows. */
export function groupTotals(r: DossierRow): { done: number; total: number } {
  if (r.progress) return { done: r.progress.mandatory_done, total: r.progress.mandatory_total }
  let done = 0
  let total = 0
  for (const g of r.groups) {
    done += g.done
    total += g.total
  }
  return { done, total }
}

/** Institutional banking portfolio table for dossiers. */
export function DetailTable({ rows, onOpen }: { rows: DossierRow[]; onOpen: (caseId: string) => void }) {
  if (rows.length === 0) return <Empty icon={<FileText size={28} />} title="Không có hồ sơ phù hợp" />
  return (
    <div className="sme-card tight" style={{ overflowX: 'auto' }}>
      <table className="sme-table">
        <thead>
          <tr>
            <th>Mã hồ sơ</th>
            <th>Doanh nghiệp &amp; MST</th>
            <th>Sản phẩm</th>
            <th className="sme-num">Số tiền đề nghị</th>
            <th className="sme-num">Kỳ hạn</th>
            <th className="sme-num">Hạng mục đạt</th>
            <th>Cần xử lý / Chờ KH</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const st = dossierStatus(r)
            const { done, total } = groupTotals(r)
            const actionable = r.progress?.to_request ?? r.actionable_blocking ?? r.blocking_open
            return (
              <tr key={r.case_id} className="click" onClick={() => onOpen(r.case_id)}>
                <td className="sme-mono" style={{ whiteSpace: 'nowrap' }}>{r.case_id}</td>
                <td>
                  <div className="sme-strong">{r.customer_name || 'Chưa có tên doanh nghiệp'}</div>
                  <div className="sme-small sme-muted">{r.tax_id ? `MST ${r.tax_id}` : 'Chưa có MST'} · Luồng {r.flow}</div>
                </td>
                <td>{r.product_code || <span className="sme-muted">—</span>}</td>
                <td className="sme-num sme-strong">{moneyShort(r.amount)}</td>
                <td className="sme-num">{r.term_months ? `${r.term_months} tháng` : '—'}</td>
                <td className="sme-num sme-mono">{done}/{total}</td>
                <td className="sme-small">
                  {actionable > 0 && <span>{actionable} cần xử lý</span>}
                  {actionable > 0 && r.requested > 0 && <span className="sme-muted"> · </span>}
                  {r.requested > 0 && (
                    <span className="sme-muted">
                      {r.requested} chờ KH{r.next_due_date ? ` (hạn ${day(r.next_due_date)})` : ''}
                    </span>
                  )}
                  {actionable === 0 && r.requested === 0 && <span className="sme-muted">—</span>}
                </td>
                <td><Pill t={st.t}>{st.label}</Pill></td>
                <td className="sme-small sme-muted">{ago(r.updated_at)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
