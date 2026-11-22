// Formatting helpers shared by every SME app page.

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'muted' | 'accent'

export const PURPOSE: Record<string, string> = {
  working_capital: 'Vốn lưu động', fixed_asset: 'Đầu tư TSCĐ', expansion: 'Mở rộng', trade_finance: 'Tài trợ thương mại',
}

const nf = new Intl.NumberFormat('vi-VN')
export const money = (v: unknown) => (typeof v === 'number' ? nf.format(v) + ' đ' : '—')
export const moneyShort = (v: unknown) => {
  if (typeof v !== 'number') return '—'
  if (Math.abs(v) >= 1e9) return nf.format(Math.round(v / 1e7) / 100) + ' tỷ'
  if (Math.abs(v) >= 1e6) return nf.format(Math.round(v / 1e4) / 100) + ' triệu'
  return nf.format(v) + ' đ'
}
export const num = (v: unknown, digits = 2) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN', { maximumFractionDigits: digits }) : '—'
export const pct = (v: unknown) =>
  typeof v === 'number' ? (v * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%' : '—'
export const when = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}
export const day = (iso?: string) => {
  if (!iso) return '—'
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (m) return `${Number(m[3])}/${Number(m[2])}/${m[1]}`
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN')
}
export const ago = (iso?: string) => {
  if (!iso) return '—'
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return '—'
  const s = Math.round((Date.now() - t) / 1000)
  if (s < 60) return 'vừa xong'
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`
  return `${Math.floor(s / 86400)} ngày trước`
}
export const plusDaysIso = (days: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch { /* fallback below */ }
  try {
    const el = document.createElement('textarea')
    el.value = value
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}
export const text = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2))
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e))
