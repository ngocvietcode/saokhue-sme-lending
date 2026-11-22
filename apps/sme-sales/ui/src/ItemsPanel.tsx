import { Btn } from '@kirocrew/app-sdk/ui'
import { Check, CheckCircle2, Copy, RotateCcw, Send, SkipForward, X } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { Empty, Pill } from '@sme-ui/ui'
import { ITEM_STATUS, copyText, day, type Catalog, type CheckItem, type DraftChannel } from './model'
import { ChannelSelect, DueDateInline } from './parts'

export type SetStatus = (key: string, status: 'open' | 'requested' | 'waived', note?: string, dueDate?: string) => Promise<boolean>
type Filter = 'blocked' | 'waiting' | 'advisory' | 'done' | 'all'

const FILTERS: [Filter, string, (i: CheckItem) => boolean][] = [
  ['blocked', 'Cần bổ sung', (i) => i.status === 'open' && i.blocking],
  ['waiting', 'Chờ khách', (i) => i.status === 'requested'],
  ['advisory', 'Khuyến nghị', (i) => i.status === 'open' && !i.blocking],
  ['done', 'Đã đạt / Miễn', (i) => ['ok', 'resolved', 'waived'].includes(i.status)],
  ['all', 'Tất cả', () => true],
]

function ItemRows({ it, asOf, groupLabel, checked, selectable, readOnly, onToggle, onSet, onOpenDoc }: {
  it: CheckItem; asOf: string; groupLabel: string; checked: boolean; selectable: boolean; readOnly: boolean
  onToggle: () => void; onSet: SetStatus; onOpenDoc: (docId: string) => void
}) {
  const [mode, setMode] = useState<'none' | 'request' | 'waive'>('none')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [copiedAsk, setCopiedAsk] = useState(false)
  const st = ITEM_STATUS[it.status]
  const open = it.status === 'open'
  const overdue = it.status === 'requested' && !!it.due_date && it.due_date < asOf

  const run = async (status: 'open' | 'requested' | 'waived', dueDate?: string) => {
    setBusy(true)
    const ok = await onSet(it.key, status, note, dueDate)
    if (ok) {
      setMode('none')
      setNote('')
    }
    setBusy(false)
  }

  const copyAsk = async () => {
    if (!it.ask) return
    if (await copyText(it.ask)) {
      setCopiedAsk(true)
      setTimeout(() => setCopiedAsk(false), 1500)
    }
  }

  return (
    <Fragment>
      <tr>
        {!readOnly && (
          <td style={{ width: 28 }}>
            {selectable && (
              <input type="checkbox" className="ss-check" checked={checked} onChange={onToggle}
                aria-label={`Chọn ${it.title}`} />
            )}
          </td>
        )}
        <td>
          <div className="sme-strong">{it.title}</div>
          <div className="sme-small sme-muted">{groupLabel}{it.reason ? ` · ${it.reason}` : ''}</div>
          {(open || it.status === 'requested') && it.ask && (
            <div className="sme-item-ask sme-between" style={{ gap: 8 }}>
              <span><b>Nội dung yêu cầu KH:</b> {it.ask}</span>
              <Btn onClick={copyAsk} title="Sao chép nội dung yêu cầu">
                {copiedAsk ? <Check size={12} /> : <Copy size={12} />} {copiedAsk ? 'Đã chép' : 'Chép'}
              </Btn>
            </div>
          )}
          {(open || it.status === 'requested') && it.alternatives.length > 0 && (
            <div className="sme-small sme-muted" style={{ marginTop: 4 }}>
              Chứng từ thay thế: {it.alternatives.join('; ')}
            </div>
          )}
        </td>
        <td>
          {it.document_refs.length > 0 ? (
            <div className="sme-row sme-wrap" style={{ gap: 4 }}>
              {it.document_refs.map((ref) => (
                <button key={ref} type="button" className="sme-ref" onClick={() => onOpenDoc(ref)}>{ref}</button>
              ))}
            </div>
          ) : <span className="sme-muted">—</span>}
        </td>
        <td>
          <div className="sme-row sme-wrap" style={{ gap: 4 }}>
            <Pill t={st.tone}>{st.label}</Pill>
            {it.blocking && (open || it.status === 'requested') && <Pill t="danger">Bắt buộc</Pill>}
            {overdue && <Pill t="danger">Quá hạn ({day(it.due_date)})</Pill>}
          </div>
          {it.status === 'requested' && (
            <div className="sme-small sme-muted" style={{ marginTop: 4 }}>
              Đã yêu cầu {day(it.requested_at)}{it.due_date ? ` · hạn ${day(it.due_date)}` : ''}
            </div>
          )}
          {it.status === 'waived' && it.note && (
            <div className="sme-small sme-muted" style={{ marginTop: 4 }}>Lý do: {it.note}</div>
          )}
        </td>
        {!readOnly && (
          <td style={{ whiteSpace: 'nowrap' }}>
            <div className="sme-row" style={{ gap: 4 }}>
              {open && it.ask && (
                <Btn busy={busy} onClick={() => setMode(mode === 'request' ? 'none' : 'request')} title="Đánh dấu đã yêu cầu khách">
                  <Send size={13} /> Đã yêu cầu
                </Btn>
              )}
              {open && it.kind !== 'policy_precheck' && (
                <Btn onClick={() => { setMode(mode === 'waive' ? 'none' : 'waive'); if (mode === 'waive') setNote('') }}
                  title="Xin miễn / bổ sung sau">
                  <SkipForward size={13} /> Xin miễn
                </Btn>
              )}
              {(it.status === 'waived' || it.status === 'requested') && (
                <Btn busy={busy} onClick={() => run('open')} title="Mở lại hạng mục">
                  <RotateCcw size={13} /> Mở lại
                </Btn>
              )}
            </div>
          </td>
        )}
      </tr>
      {!readOnly && mode === 'request' && (
        <tr className="ss-inline-panel">
          <td colSpan={5}>
            <DueDateInline label="Hạn khách hàng bổ sung" confirmLabel="Xác nhận đã yêu cầu" busy={busy}
              onCancel={() => setMode('none')} onConfirm={(d) => run('requested', d)} />
          </td>
        </tr>
      )}
      {!readOnly && mode === 'waive' && (
        <tr className="ss-inline-panel">
          <td colSpan={5}>
            <div className="sme-stack" style={{ gap: 8 }}>
              <textarea className="sme-textarea" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi rõ căn cứ xin miễn hoặc cam kết bổ sung sau (đi kèm phiếu bàn giao Thẩm định)" />
              <div className="sme-row" style={{ justifyContent: 'flex-end' }}>
                <Btn onClick={() => { setMode('none'); setNote('') }}>Huỷ</Btn>
                <Btn primary busy={busy} disabled={!note.trim()} onClick={() => run('waived')}>Xác nhận xin miễn</Btn>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}

export default function ItemsPanel({
  items, asOf, catalog, groupFilter, onClearGroup, readOnly, onSet, onBatchRequested, onDraft, onOpenDoc,
}: {
  items: CheckItem[]; asOf: string; catalog: Catalog | null; groupFilter: string | null; onClearGroup: () => void
  readOnly: boolean; onSet: SetStatus; onBatchRequested: (keys: string[], dueDate: string) => Promise<boolean>
  onDraft: (keys: string[], channel: DraftChannel, isReminder: boolean) => void
  onOpenDoc: (docId: string) => void
}) {
  const baseItems = useMemo(() => (groupFilter ? items.filter((i) => i.group === groupFilter) : items), [items, groupFilter])
  const counts = Object.fromEntries(FILTERS.map(([k, , f]) => [k, baseItems.filter(f).length])) as Record<Filter, number>
  const first = (FILTERS.find(([k]) => k !== 'all' && counts[k] > 0)?.[0] ?? 'done') as Filter
  const [filter, setFilter] = useState<Filter | null>(null)
  const active = filter ?? first
  const shown = baseItems.filter(FILTERS.find(([k]) => k === active)![2])

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDue, setBulkDue] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)

  const selectableShown = useMemo(() => shown.filter((i) => i.status === 'open' || i.status === 'requested'), [shown])
  const selectableKeys = useMemo(() => new Set(baseItems.filter((i) => i.status === 'open' || i.status === 'requested').map((i) => i.key)), [baseItems])
  const activeSelected = useMemo(() => [...selected].filter((k) => selectableKeys.has(k)), [selected, selectableKeys])

  const toggleKey = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }
  const allShownSelected = selectableShown.length > 0 && selectableShown.every((i) => selected.has(i.key))
  const toggleAllShown = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allShownSelected) selectableShown.forEach((i) => next.delete(i.key))
      else selectableShown.forEach((i) => next.add(i.key))
      return next
    })
  }

  const runBatchRequested = async (dueDate: string) => {
    setBulkBusy(true)
    const ok = await onBatchRequested(activeSelected, dueDate)
    if (ok) {
      setSelected(new Set())
      setBulkDue(false)
    }
    setBulkBusy(false)
  }

  const groups = catalog?.documents.groups ?? {}
  const selectedItems = baseItems.filter((i) => activeSelected.includes(i.key))
  const allSelectedRequested = selectedItems.length > 0 && selectedItems.every((i) => i.status === 'requested')

  return (
    <div className="sme-stack">
      <div className="sme-between sme-wrap">
        <div className="sme-filters" role="tablist" aria-label="Lọc hạng mục">
          {FILTERS.map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={active === k}
              className={`sme-filter ${active === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l} ({counts[k]})</button>
          ))}
        </div>
        <div className="sme-row sme-wrap" style={{ gap: 6 }}>
          {groupFilter && (
            <Btn onClick={onClearGroup} title="Bỏ lọc nhóm">
              Nhóm: {groups[groupFilter] ?? groupFilter} <X size={12} />
            </Btn>
          )}
          {!readOnly && selectableShown.length > 0 && (
            <Btn onClick={toggleAllShown}>{allShownSelected ? 'Bỏ chọn' : `Chọn tất cả (${selectableShown.length})`}</Btn>
          )}
        </div>
      </div>

      {!readOnly && activeSelected.length > 0 && (
        <div className="ss-bulk">
          <div className="sme-between sme-wrap" style={{ gap: 8 }}>
            <span className="sme-strong sme-small">Đã chọn {activeSelected.length} hạng mục</span>
            <div className="sme-row sme-wrap" style={{ gap: 6 }}>
              <ChannelSelect onPick={(ch) => onDraft(activeSelected, ch, allSelectedRequested)} />
              <Btn onClick={() => setBulkDue((v) => !v)}><Send size={13} /> Đã yêu cầu</Btn>
              <Btn onClick={() => { setSelected(new Set()); setBulkDue(false) }}>Bỏ chọn</Btn>
            </div>
          </div>
          {bulkDue && (
            <DueDateInline label={`Đặt hạn cho ${activeSelected.length} hạng mục`} confirmLabel="Xác nhận đã yêu cầu"
              busy={bulkBusy} onCancel={() => setBulkDue(false)} onConfirm={runBatchRequested} />
          )}
        </div>
      )}

      <div className="sme-card tight" style={{ overflowX: 'auto' }}>
        {shown.length === 0 ? (
          <Empty icon={<CheckCircle2 size={26} />} title="Không có hạng mục nào ở bộ lọc này" />
        ) : (
          <table className="sme-table">
            <thead>
              <tr>
                {!readOnly && <th aria-label="Chọn" style={{ width: 28 }} />}
                <th>Hạng mục &amp; Quy định</th>
                <th>Chứng từ</th>
                <th>Trạng thái</th>
                {!readOnly && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {shown.map((it) => (
                <ItemRows key={it.key} it={it} asOf={asOf} groupLabel={groups[it.group] ?? it.group}
                  selectable={it.status === 'open' || it.status === 'requested'}
                  checked={selected.has(it.key)} readOnly={readOnly}
                  onToggle={() => toggleKey(it.key)} onSet={onSet} onOpenDoc={onOpenDoc} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
