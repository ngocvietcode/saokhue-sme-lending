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
export const when = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—')
export const day = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—')
export const ago = (iso?: string) => {
  if (!iso) return '—'
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'vừa xong'
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`
  return `${Math.floor(s / 86400)} ngày trước`
}
export const text = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2))
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e))
