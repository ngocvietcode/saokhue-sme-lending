import { useCallback, useMemo, useRef, useState } from 'react'
import AssistantDock, {
  clampDockWidth, readDockOpen, readDockWidth, useAssistantSync, writeDockOpen, writeDockWidth,
  type AssistantIntent, type CreatedCaseBanner, type DockChip,
} from '@sme-ui/AssistantDock'
import { ensureStyles } from '@sme-ui/styles'
import { ASSISTANT_AGENT } from './assistantChat'
import CaseList from './CaseList'
import CaseView from './CaseView'

ensureStyles()

const OPEN_KEY = 'sme-lending:assistant-open'
const WIDTH_KEY = 'sme-lending:assistant-width'
const CHAT_PREFIX = 'sme-lending-chat-'

type CaseMeta = {
  customerName?: string
  flow: string
  hasIssues: boolean
}

export default function SmeLendingPage() {
  const [caseId, setCaseId] = useState<string | null>(null)
  const [assistantOpen, setAssistantOpenState] = useState<boolean>(() => readDockOpen(OPEN_KEY))
  const [assistantWidth, setAssistantWidthState] = useState<number>(() => readDockWidth(WIDTH_KEY))
  const [assistantIntent, setAssistantIntent] = useState<AssistantIntent | null>(null)
  const [caseMeta, setCaseMeta] = useState<CaseMeta | null>(null)
  const [createdCase, setCreatedCase] = useState<CreatedCaseBanner | null>(null)

  const intentSeqRef = useRef(0)
  const { syncTick } = useAssistantSync(assistantOpen, 3500)

  const setAssistantOpen = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setAssistantOpenState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next
      writeDockOpen(OPEN_KEY, val)
      return val
    })
  }, [])

  const setAssistantWidth = useCallback((w: number) => {
    const clamped = clampDockWidth(w)
    setAssistantWidthState(clamped)
    writeDockWidth(WIDTH_KEY, clamped)
  }, [])

  const askAssistant = useCallback((prompt: string, mode: AssistantIntent['mode'] = 'prefill') => {
    setAssistantOpen(true)
    setAssistantIntent({ id: ++intentSeqRef.current, prompt, mode })
  }, [setAssistantOpen])

  const consumeIntent = useCallback(() => {
    setAssistantIntent(null)
  }, [])

  const openCase = useCallback((id: string) => {
    setCreatedCase(null)
    setCaseMeta(null)
    setCaseId(id)
  }, [])

  const goBackToList = useCallback(() => {
    setCaseMeta(null)
    setCaseId(null)
  }, [])

  const handleCaseMetaChange = useCallback((next: CaseMeta | null) => {
    setCaseMeta((prev) => {
      if (prev === next) return prev
      if (
        prev && next
        && prev.customerName === next.customerName
        && prev.flow === next.flow
        && prev.hasIssues === next.hasIssues
      ) {
        return prev
      }
      return next
    })
  }, [])

  const chips = useMemo<DockChip[]>(() => {
    if (!caseId) {
      return [{
        label: 'Hồ sơ chờ xử lý',
        prompt: 'Rà soát danh sách các hồ sơ thẩm định đang có mục chờ cán bộ xử lý hoặc kết quả bị chặn kiểm chứng.',
      }]
    }
    const out: DockChip[] = [
      {
        label: 'Chạy thẩm định',
        prompt: `Chạy thẩm định hồ sơ ${caseId}, luồng ${caseMeta?.flow ?? 'A'}.`,
      },
      {
        label: 'Giải thích kết quả',
        prompt: `Giải thích tóm tắt kết quả thẩm định, các cảnh báo mức cao và mã bằng chứng chính của hồ sơ ${caseId}.`,
      },
    ]
    if (caseMeta?.hasIssues) {
      out.push({
        label: 'Phân tích mục chặn',
        prompt: `Phân tích các mục chờ rà soát và kết quả bị chặn kiểm chứng của hồ sơ ${caseId}, nêu rõ chứng từ cần đối chiếu.`,
      })
    }
    return out
  }, [caseId, caseMeta])

  return (
    <div className="sme" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="sme-workspace">
        <div className="sme-main">
          {caseId ? (
            <CaseView
              caseId={caseId}
              assistantOpen={assistantOpen}
              syncTick={syncTick}
              onBack={goBackToList}
              onToggleAssistant={() => setAssistantOpen((v) => !v)}
              onAskAssistant={askAssistant}
              onCaseMetaChange={handleCaseMetaChange}
            />
          ) : (
            <CaseList
              onOpen={openCase}
              assistantOpen={assistantOpen}
              syncTick={syncTick}
              onToggleAssistant={() => setAssistantOpen((v) => !v)}
              onAskAssistant={askAssistant}
              onCreatedCase={setCreatedCase}
            />
          )}
        </div>

        {assistantOpen && (
          <AssistantDock
            storagePrefix="sme-lending"
            chatPrefix={CHAT_PREFIX}
            agent={ASSISTANT_AGENT}
            panelLabel="Trợ lý thẩm định"
            newIntakePrompt="Tạo hồ sơ thẩm định SME mới: "
            newSessionTitle="Hồ sơ SME mới"
            caseTitlePrefix="Thẩm định"
            chips={chips}
            attachDefaultPrefix={caseId ? `Tôi gửi thêm chứng từ cho hồ sơ thẩm định ${caseId}: ` : undefined}
            embedPlaceholder={caseId
              ? `Hỏi trợ lý hoặc chạy thẩm định cho ${caseId}...`
              : 'Cung cấp thông tin khách hàng hoặc chứng từ để tạo hồ sơ thẩm định...'}
            width={assistantWidth}
            onWidthChange={setAssistantWidth}
            onClose={() => setAssistantOpen(false)}
            caseId={caseId}
            customerName={caseId ? caseMeta?.customerName : undefined}
            intent={assistantIntent}
            onConsumeIntent={consumeIntent}
            createdCase={createdCase}
            onOpenCase={openCase}
            onDismissCreatedCase={() => setCreatedCase(null)}
          />
        )}
      </div>
    </div>
  )
}
