import { Btn } from '@kirocrew/app-sdk/ui'
import { Check, Copy, Mail } from 'lucide-react'
import { useState } from 'react'
import { Empty, Pill } from '@sme-ui/ui'
import { CHANNEL, actor, when, type CheckItem, type Draft } from './model'

function DraftCard({ d, items, onSent }: { d: Draft; items: Map<string, CheckItem>; onSent: (id: string) => Promise<boolean> }) {
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(d.subject ? `${d.subject}\n\n${d.body}` : d.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="sme-card">
      <div className="sme-between sme-wrap" style={{ gap: 8 }}>
        <div className="sme-row sme-wrap" style={{ gap: 6 }}>
          <span className="sme-mono sme-small">{d.id}</span>
          <Pill t="accent">{CHANNEL[d.channel]}</Pill>
          {d.status === 'sent' ? <Pill t="ok">Đã gửi {when(d.sent_at)}</Pill> : <Pill t="warn">Nháp</Pill>}
          <span className="sme-small sme-muted">{actor(d.author.includes(':') ? d.author : `agent:${d.author}`)} · {when(d.created_at)}</span>
        </div>
        <div className="sme-row">
          <Btn onClick={copy}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Đã chép' : 'Sao chép'}</Btn>
          {d.status === 'draft' && (
            <Btn primary busy={busy} onClick={async () => { setBusy(true); await onSent(d.id); setBusy(false) }}>Đã gửi</Btn>
          )}
        </div>
      </div>
      {d.subject && <div className="sme-strong" style={{ marginTop: 10 }}>{d.subject}</div>}
      <pre className="sme-pre" style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{d.body}</pre>
      {d.requirement_keys.length > 0 && (
        <div className="sme-small sme-muted" style={{ marginTop: 8 }}>
          Xin các mục: {d.requirement_keys.map((k) => items.get(k)?.title ?? k).join('; ')}
        </div>
      )}
    </div>
  )
}

export default function DraftsTab({ drafts, items, onSent, onNew }: {
  drafts: Draft[]; items: CheckItem[]; onSent: (id: string) => Promise<boolean>; onNew: () => void
}) {
  const byKey = new Map(items.map((i) => [i.key, i]))
  if (drafts.length === 0) {
    return <Empty icon={<Mail size={30} />} title="Chưa có thư nháp"
      hint="Chọn các mục ở tab Còn thiếu rồi nhờ trợ lý soạn thư. Bạn sửa, tự gửi, rồi bấm Đã gửi."
      action={<Btn primary onClick={onNew}><Mail size={14} /> Soạn thư xin bổ sung</Btn>} />
  }
  return (
    <div className="sme-stack">
      <div className="sme-small sme-muted">Thư do trợ lý soạn không tự gửi đi. Bấm "Đã gửi" sau khi bạn gửi để các mục chuyển sang "Đã xin khách".</div>
      {[...drafts].reverse().map((d) => <DraftCard key={d.id} d={d} items={byKey} onSent={onSent} />)}
    </div>
  )
}
