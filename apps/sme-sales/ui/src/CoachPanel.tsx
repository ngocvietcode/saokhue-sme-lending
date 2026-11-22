import { useMemo } from 'react'
import AssistantDock, {
  type AssistantIntent, type CreatedCaseBanner, type DockChip,
} from '@sme-ui/AssistantDock'
import { CHAT_PREFIX, COACH } from './model'

export type CoachIntent = AssistantIntent
export type { CreatedCaseBanner }

export default function CoachPanel({
  width,
  onWidthChange,
  onClose,
  caseId,
  customerName,
  readOnly = false,
  hasOpenItems = false,
  intent,
  onConsumeIntent,
  createdCase,
  onOpenCase,
  onDismissCreatedCase,
  onQuickDraft,
}: {
  width: number
  onWidthChange: (w: number) => void
  onClose: () => void
  caseId: string | null
  customerName?: string
  readOnly?: boolean
  hasOpenItems?: boolean
  intent: CoachIntent | null
  onConsumeIntent: () => void
  createdCase: CreatedCaseBanner | null
  onOpenCase: (caseId: string) => void
  onDismissCreatedCase: () => void
  onQuickDraft?: () => void
}) {
  const chips = useMemo<DockChip[]>(() => {
    if (!caseId) {
      return [{
        label: 'Việc hôm nay',
        prompt: 'Rà soát danh sách hồ sơ đang mở hôm nay, nêu các hồ sơ quá hạn hoặc sắp đủ điều kiện trình.',
      }]
    }
    if (readOnly) return []
    const out: DockChip[] = [{
      label: 'Cập nhật',
      prompt: `Cập nhật thông tin hồ sơ ${caseId}: `,
    }]
    if (hasOpenItems && onQuickDraft) {
      out.push({ label: 'Soạn thư', onClick: onQuickDraft })
    }
    out.push({
      label: 'Rà soát',
      prompt: `Rà soát các hạng mục chặn và điều kiện chính sách còn thiếu của hồ sơ ${caseId}, đề xuất phương án xử lý.`,
    })
    return out
  }, [caseId, readOnly, hasOpenItems, onQuickDraft])

  return (
    <AssistantDock
      storagePrefix="sme-sales"
      chatPrefix={CHAT_PREFIX}
      agent={COACH}
      panelLabel="Trợ lý hồ sơ"
      newIntakePrompt="Tạo hồ sơ mới cho khách hàng: "
      newSessionTitle="Hồ sơ SME mới"
      caseTitlePrefix="Hồ sơ"
      chips={chips}
      embedPlaceholder={caseId
        ? `Nhắn trợ lý hoặc kéo chứng từ vào cho ${caseId}...`
        : 'Kể về khách hàng mới hoặc kéo bộ chứng từ vào đây...'}
      width={width}
      onWidthChange={onWidthChange}
      onClose={onClose}
      caseId={caseId}
      customerName={customerName}
      intent={intent}
      onConsumeIntent={onConsumeIntent}
      createdCase={createdCase}
      onOpenCase={onOpenCase}
      onDismissCreatedCase={onDismissCreatedCase}
    />
  )
}
