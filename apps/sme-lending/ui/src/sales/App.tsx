import { useAppApi } from '@kirocrew/app-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clampDockWidth, readDockOpen, readDockWidth, useAssistantSync, writeDockOpen, writeDockWidth,
} from '@sme-ui/AssistantDock'
import { ensureStyles } from '@sme-ui/styles'
import CoachPanel, { type CoachIntent, type CreatedCaseBanner } from './CoachPanel'
import DossierList from './DossierList'
import DossierView from './DossierView'
import { API, type Catalog } from './model'
import { ensureSalesStyles } from './parts'

ensureStyles()
ensureSalesStyles()

const OPEN_KEY = 'sme-lending:sale-coach-open'
const WIDTH_KEY = 'sme-lending:sale-coach-width'

type CaseMeta = {
  customerName?: string
  readOnly: boolean
  hasOpenItems: boolean
}

export default function SmeSalesPage() {
  const api = useAppApi()
  const [caseId, setCaseId] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [coachOpen, setCoachOpenState] = useState<boolean>(() => readDockOpen(OPEN_KEY))
  const [coachWidth, setCoachWidthState] = useState<number>(() => readDockWidth(WIDTH_KEY))
  const [coachIntent, setCoachIntent] = useState<CoachIntent | null>(null)
  const [caseMeta, setCaseMeta] = useState<CaseMeta | null>(null)
  const [createdCase, setCreatedCase] = useState<CreatedCaseBanner | null>(null)

  const intentSeqRef = useRef(0)
  const quickDraftRef = useRef<(() => void) | null>(null)
  const { syncTick } = useAssistantSync(coachOpen, 4000)

  useEffect(() => {
    // The catalog only labels things; the page still works if it fails to load.
    api.get<Catalog>(`${API}/catalog`).then(setCatalog).catch(() => setCatalog(null))
  }, [api])

  const setCoachOpen = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setCoachOpenState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next
      writeDockOpen(OPEN_KEY, val)
      return val
    })
  }, [])

  const setCoachWidth = useCallback((w: number) => {
    const clamped = clampDockWidth(w)
    setCoachWidthState(clamped)
    writeDockWidth(WIDTH_KEY, clamped)
  }, [])

  const askCoach = useCallback((prompt: string, mode: CoachIntent['mode'] = 'prefill') => {
    setCoachOpen(true)
    setCoachIntent({ id: ++intentSeqRef.current, prompt, mode })
  }, [setCoachOpen])

  const consumeIntent = useCallback(() => {
    setCoachIntent(null)
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
        && prev.readOnly === next.readOnly
        && prev.hasOpenItems === next.hasOpenItems
      ) {
        return prev
      }
      return next
    })
  }, [])

  const registerQuickDraft = useCallback((fn: (() => void) | null) => {
    quickDraftRef.current = fn
  }, [])

  const triggerQuickDraft = useCallback(() => {
    quickDraftRef.current?.()
  }, [])

  return (
    <div className="sme" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="sme-workspace">
        <div className="sme-main">
          {caseId ? (
            <DossierView
              caseId={caseId}
              catalog={catalog}
              coachOpen={coachOpen}
              syncTick={syncTick}
              onBack={goBackToList}
              onToggleCoach={() => setCoachOpen((v) => !v)}
              onAskCoach={askCoach}
              onCaseMetaChange={handleCaseMetaChange}
              onRegisterQuickDraft={registerQuickDraft}
            />
          ) : (
            <DossierList
              onOpen={openCase}
              catalog={catalog}
              coachOpen={coachOpen}
              syncTick={syncTick}
              onToggleCoach={() => setCoachOpen((v) => !v)}
              onAskCoach={askCoach}
              onCreatedCase={setCreatedCase}
            />
          )}
        </div>

        {coachOpen && (
          <CoachPanel
            width={coachWidth}
            onWidthChange={setCoachWidth}
            onClose={() => setCoachOpen(false)}
            caseId={caseId}
            customerName={caseId ? caseMeta?.customerName : undefined}
            readOnly={caseId ? Boolean(caseMeta?.readOnly) : false}
            hasOpenItems={caseId ? Boolean(caseMeta?.hasOpenItems) : false}
            intent={coachIntent}
            onConsumeIntent={consumeIntent}
            createdCase={createdCase}
            onOpenCase={openCase}
            onDismissCreatedCase={() => setCreatedCase(null)}
            onQuickDraft={caseId && caseMeta?.hasOpenItems && !caseMeta.readOnly ? triggerQuickDraft : undefined}
          />
        )}
      </div>
    </div>
  )
}
