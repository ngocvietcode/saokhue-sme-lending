import { Btn, ErrorNotice } from '@kirocrew/app-sdk/ui'
import { FileText, Save, Upload } from 'lucide-react'
import { useState } from 'react'
import { Empty } from '@sme-ui/ui'
import { actor, ago, errMsg, type Catalog, type Doc } from './model'
import { fileToBase64 } from './parts'

const MAX_BYTES = 10 * 1024 * 1024

function TypeSelect({ catalog, value, onChange }: { catalog: Catalog | null; value: string; onChange: (v: string) => void }) {
  return (
    <select className="sme-input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Chưa phân loại</option>
      {Object.entries(catalog?.documents.types ?? {}).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
    </select>
  )
}

function DocRow({ d, catalog, onSave }: {
  d: Doc; catalog: Catalog | null; onSave: (id: string, patch: { type: string; issued_date: string }) => Promise<boolean>
}) {
  const [type, setType] = useState(d.type ?? '')
  const [date, setDate] = useState(d.issued_date ?? '')
  const [busy, setBusy] = useState(false)
  const dirty = type !== (d.type ?? '') || date !== (d.issued_date ?? '')
  return (
    <tr>
      <td className="sme-mono">{d.id}</td>
      <td><div className="sme-strong">{d.name}</div>
        <div className="sme-small sme-muted">{d.size ? `${Math.round(d.size / 1024)} KB · ` : 'Chưa có file · '}{actor(d.added_by)} · {ago(d.added_at)}</div></td>
      <td style={{ minWidth: 220 }}><TypeSelect catalog={catalog} value={type} onChange={setType} /></td>
      <td style={{ minWidth: 150 }}><input className="sme-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></td>
      <td>{dirty && <Btn busy={busy} onClick={async () => { setBusy(true); await onSave(d.id, { type, issued_date: date }); setBusy(false) }}>
        <Save size={13} /> Lưu</Btn>}</td>
    </tr>
  )
}

export default function DocumentsTab({ docs, catalog, onUpload, onSave }: {
  docs: Doc[]; catalog: Catalog | null
  onUpload: (doc: { name: string; type: string; issued_date: string; content_b64: string }) => Promise<boolean>
  onSave: (id: string, patch: { type: string; issued_date: string }) => Promise<boolean>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const upload = async () => {
    if (!file) return
    if (file.size > MAX_BYTES) { setError('File lớn hơn 10 MB.'); return }
    setBusy(true)
    try {
      const ok = await onUpload({ name: file.name, type, issued_date: date, content_b64: await fileToBase64(file) })
      if (ok) { setFile(null); setType(''); setDate(''); setError(null) }
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="sme-stack">
      <div className="sme-card">
        <div className="sme-h3" style={{ marginBottom: 10 }}>Thêm chứng từ khách gửi</div>
        {error && <div style={{ marginBottom: 10 }}><ErrorNotice title="Không tải lên được">{error}</ErrorNotice></div>}
        <div className="sme-form">
          <label className="sme-field">File (tối đa 10 MB)
            <input className="sme-input" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <label className="sme-field">Loại chứng từ<TypeSelect catalog={catalog} value={type} onChange={setType} /></label>
          <label className="sme-field">Ngày lập<input className="sme-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        </div>
        <div className="sme-small sme-muted" style={{ marginTop: 8 }}>
          Chưa rõ loại hoặc ngày lập thì cứ tải lên; nhờ trợ lý đọc chứng từ để phân loại.
        </div>
        <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 10 }}>
          <Btn primary busy={busy} disabled={!file} onClick={upload}><Upload size={14} /> Tải lên</Btn>
        </div>
      </div>
      {docs.length === 0
        ? <Empty icon={<FileText size={30} />} title="Chưa có chứng từ" hint="Tải lên chứng từ khách đã gửi." />
        : (
          <div className="sme-card" style={{ overflowX: 'auto' }}>
            <table className="sme-table">
              <thead><tr><th>Mã</th><th>Chứng từ</th><th>Loại</th><th>Ngày lập</th><th /></tr></thead>
              <tbody>{docs.map((d) => <DocRow key={d.id + (d.type ?? '') + (d.issued_date ?? '')} d={d} catalog={catalog} onSave={onSave} />)}</tbody>
            </table>
          </div>
        )}
    </div>
  )
}
