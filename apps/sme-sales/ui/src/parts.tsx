import { Pill, tone } from '@sme-ui/ui'
import { STAGE, scoreTone, type Stage } from './model'

export function Score({ value }: { value: number }) {
  return (
    <div className="sme-score" title={`Điểm hoàn thiện ${value}%`}>
      <div className="sme-bar-track">
        <div className={`sme-bar-fill ${tone(scoreTone(value))}`} style={{ width: `${Math.max(2, value)}%` }} />
      </div>
      <span className="sme-score-num">{value}%</span>
    </div>
  )
}

export const StagePill = ({ stage }: { stage: Stage }) => <Pill t={STAGE[stage].tone}>{STAGE[stage].label}</Pill>

/** A file as base64 (no data-URL prefix), for the JSON upload route. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',', 2)[1] ?? '')
    r.onerror = () => reject(r.error ?? new Error('Không đọc được file'))
    r.readAsDataURL(file)
  })
}
