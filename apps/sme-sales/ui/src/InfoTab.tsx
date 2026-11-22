import { Btn } from '@kirocrew/app-sdk/ui'
import { Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PURPOSE, type CaseRec, type Catalog } from './model'

const NUMERIC = new Set(['request.amount', 'request.term_months', 'request.annual_rate_pct',
  'facts.years_in_operation', 'facts.equity_contribution_pct'])
const EXTRA: Record<string, string> = {
  'customer.cif': 'CIF', 'customer.address': 'Địa chỉ', 'customer.legal_rep': 'Người đại diện',
  'customer.established': 'Ngày thành lập', 'request.proposal': 'Đề xuất của ĐVKD',
}

type Patch = { customer?: Record<string, unknown>; request?: Record<string, unknown>; facts?: Record<string, unknown> }

export default function InfoTab({ c, catalog, onSave }: { c: CaseRec; catalog: Catalog | null; onSave: (p: Patch) => Promise<boolean> }) {
  const fields = useMemo(() => {
    const out: [string, string][] = []
    for (const [k, m] of Object.entries(catalog?.documents.fields ?? {})) out.push([k, m.label])
    for (const [k, l] of Object.entries(EXTRA)) out.push([k, l])
    for (const [k, m] of Object.entries(catalog?.documents.sales_facts ?? {})) out.push([`facts.${k}`, m.label])
    return out
  }, [catalog])
  const read = (path: string) => {
    const [sec, key] = path.split('.') as ['customer' | 'request' | 'facts', string]
    const v = (c[sec] ?? {})[key]
    return v === undefined || v === null ? '' : String(v)
  }
  const [vals, setVals] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const changed = Object.keys(vals).filter((k) => vals[k] !== read(k))
  const save = async () => {
    const patch: Patch = {}
    for (const k of changed) {
      const [sec, key] = k.split('.') as ['customer' | 'request' | 'facts', string]
      const raw = vals[k].trim()
      const v = raw === '' ? null : NUMERIC.has(k) ? Number(raw) : raw
      patch[sec] = { ...(patch[sec] ?? {}), [key]: v }
    }
    setBusy(true)
    if (await onSave(patch)) setVals({})
    setBusy(false)
  }
  const input = (k: string) => {
    const v = vals[k] ?? read(k)
    const set = (x: string) => setVals({ ...vals, [k]: x })
    if (k === 'request.product_code') {
      return (
        <select className="sme-input" value={v} onChange={(e) => set(e.target.value)}>
          <option value="">Chưa chọn</option>
          {catalog?.products.products.map((p) => <option key={p.code} value={p.code}>{p.code} · {p.name}</option>)}
        </select>
      )
    }
    if (k === 'request.purpose') {
      return (
        <select className="sme-input" value={v} onChange={(e) => set(e.target.value)}>
          <option value="">Chưa chọn</option>
          {Object.entries(PURPOSE).map(([p, l]) => <option key={p} value={p}>{l}</option>)}
        </select>
      )
    }
    return <input className="sme-input" value={v} inputMode={NUMERIC.has(k) ? 'decimal' : undefined}
      type={k === 'customer.established' ? 'date' : 'text'} onChange={(e) => set(e.target.value)} />
  }
  return (
    <div className="sme-card">
      <div className="sme-form">
        {fields.map(([k, label]) => <label key={k} className="sme-field">{label}{input(k)}</label>)}
      </div>
      <div className="sme-row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
        <Btn primary busy={busy} disabled={changed.length === 0} onClick={save}><Save size={14} /> Lưu {changed.length || ''} thay đổi</Btn>
      </div>
    </div>
  )
}
