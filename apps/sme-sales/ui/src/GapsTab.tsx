import { Btn } from '@kirocrew/app-sdk/ui'
import { CheckCircle2, Mail, RotateCcw, Send, SkipForward } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Banner, Empty, Pill } from '@sme-ui/ui'
import { ITEM_STATUS, day, isOpen, type Catalog, type CheckItem, type Overview } from './model'

type Setter = (key: string, status: 'open' | 'requested' | 'waived', note: string, due?: string) => Promise<boolean>

function Item({ it, selected, onSelect, onSet }: {
  it: CheckItem; selected: boolean; onSelect: (on: boolean) => void; onSet: Setter
}) {
  const [mode, setMode] = useState<'none' | 'waive' | 'request'>('none')
  const [note, setNote] = useState('')
  const [due, setDue] = useState('')
  const [busy, setBusy] = useState(false)
  const st = ITEM_STATUS[it.status]
  const act = async (status: 'open' | 'requested' | 'waived') => {
    setBusy(true)
    if (await onSet(it.key, status, note, due || undefined)) { setMode('none'); setNote(''); setDue('') }
    setBusy(false)
  }
  const open = isOpen(it)
  return (
    <div className="sme-item">
      {open ? <input type="checkbox" aria-label="Chọn để soạn thư" checked={selected} onChange={(e) => onSelect(e.target.checked)}
        style={{ marginTop: 3 }} /> : <CheckCircle2 size={15} className="sme-muted" style={{ marginTop: 2 }} />}
      <div className="sme-item-body">
        <div className="sme-row sme-wrap" style={{ gap: 6 }}>
          <span className="sme-item-title">{it.title}</span>
          <Pill t={st.tone}>{st.label}</Pill>
          {it.blocking && open && <Pill t="danger">Chặn nộp</Pill>}
          {!it.blocking && open && <Pill t="muted">{it.kind === 'policy_precheck' ? 'Cảnh báo sơ bộ' : 'Nên có'}</Pill>}
        </div>
        {it.reason && <div className="sme-small sme-muted" style={{ marginTop: 4 }}>{it.reason}</div>}
        {open && it.ask && <div className="sme-item-ask">Xin khách: {it.ask}</div>}
        {open && it.alternatives.length > 0 && (
          <div className="sme-small" style={{ marginTop: 4 }}>Có thể thay bằng: {it.alternatives.join('; ')}</div>
        )}
        {it.status === 'requested' && (
          <div className="sme-small sme-muted" style={{ marginTop: 4 }}>
            Đã xin ngày {day(it.requested_at)}{it.due_date ? ` · hạn ${day(it.due_date)}` : ''}{it.note ? ` · ${it.note}` : ''}
          </div>
        )}
        {it.status === 'waived' && <div className="sme-decision t-muted">Lý do bỏ qua: {it.note}</div>}
        {mode !== 'none' && (
          <div className="sme-stack" style={{ marginTop: 8 }}>
            <textarea className="sme-textarea" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={mode === 'waive' ? 'Lý do bỏ qua (bắt buộc, đi kèm hồ sơ khi nộp)' : 'Ghi chú (không bắt buộc)'} />
            {mode === 'request' && (
              <label className="sme-field" style={{ maxWidth: 220 }}>Hạn khách gửi
                <input className="sme-input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
              </label>
            )}
            <div className="sme-row">
              <Btn onClick={() => setMode('none')}>Huỷ</Btn>
              {mode === 'waive'
                ? <Btn primary busy={busy} disabled={!note.trim()} onClick={() => act('waived')}>Bỏ qua mục này</Btn>
                : <Btn primary busy={busy} onClick={() => act('requested')}>Lưu</Btn>}
            </div>
          </div>
        )}
      </div>
      {mode === 'none' && (
        <div className="sme-row" style={{ flex: 'none' }}>
          {it.status === 'open' && <Btn onClick={() => setMode('request')} title="Đánh dấu đã xin khách"><Send size={13} /></Btn>}
          {open && it.kind !== 'policy_precheck' && <Btn onClick={() => setMode('waive')} title="Bỏ qua (cần lý do)"><SkipForward size={13} /></Btn>}
          {(it.status === 'waived' || it.status === 'requested') && (
            <Btn busy={busy} onClick={() => act('open')} title="Mở lại"><RotateCcw size={13} /></Btn>
          )}
        </div>
      )}
    </div>
  )
}

export default function GapsTab({ overview, catalog, onSet, onDraft }: {
  overview: Overview; catalog: Catalog | null; onSet: Setter; onDraft: (keys: string[]) => void
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showDone, setShowDone] = useState(false)
  const groups = catalog?.documents.groups ?? {}
  const visible = overview.items.filter((i) => showDone || isOpen(i) || i.status === 'waived')
  const byGroup = useMemo(() => {
    const m = new Map<string, CheckItem[]>()
    for (const it of [...visible].sort((a, b) => Number(b.blocking) - Number(a.blocking))) {
      m.set(it.group, [...(m.get(it.group) ?? []), it])
    }
    return [...m.entries()]
  }, [visible])
  const toggle = (k: string, on: boolean) => {
    const s = new Set(selected); if (on) s.add(k); else s.delete(k); setSelected(s)
  }
  const openCount = overview.items.filter(isOpen).length
  const blockingKeys = overview.items.filter((i) => isOpen(i) && i.blocking && i.ask).map((i) => i.key)

  return (
    <div>
      {overview.readiness.ready
        ? <Banner t="ok">Không còn mục chặn nộp. Hồ sơ đủ điều kiện để nộp Thẩm định
          {overview.readiness.waived.length ? `; ${overview.readiness.waived.length} mục đã bỏ qua sẽ đi kèm giải trình.` : '.'}</Banner>
        : <Banner t="warn">Còn {overview.readiness.blocking_open.length} mục chặn nộp. Bổ sung hoặc bỏ qua có lý do trước khi nộp.</Banner>}
      <div className="sme-between sme-wrap" style={{ margin: '12px 0' }}>
        <label className="sme-check">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Hiện cả mục đã đủ
        </label>
        <div className="sme-row">
          {blockingKeys.length > 0 && selected.size === 0 && (
            <Btn onClick={() => onDraft(blockingKeys)}><Mail size={14} /> Soạn thư xin các mục chặn</Btn>
          )}
          {selected.size > 0 && <Btn primary onClick={() => onDraft([...selected])}><Mail size={14} /> Soạn thư cho {selected.size} mục đã chọn</Btn>}
        </div>
      </div>
      {openCount === 0 && !showDone && overview.readiness.waived.length === 0 && (
        <Empty icon={<CheckCircle2 size={30} />} title="Hồ sơ đã đủ" hint="Không còn mục nào cần bổ sung." />
      )}
      {byGroup.map(([g, items]) => (
        <div key={g}>
          <div className="sme-group-title">{groups[g] ?? g}</div>
          <div>{items.map((it) => <Item key={it.key} it={it} selected={selected.has(it.key)} onSelect={(on) => toggle(it.key, on)} onSet={onSet} />)}</div>
        </div>
      ))}
    </div>
  )
}
