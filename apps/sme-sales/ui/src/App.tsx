import * as sdk from '@kirocrew/app-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ensureStyles } from '@sme-ui/styles'
import CoachPanel, { type CoachIntent, type CreatedCaseBanner } from './CoachPanel'
import DossierList from './DossierList'
import DossierView from './DossierView'
import { API, type Catalog } from './model'
import { ensureSalesStyles } from './parts'

ensureStyles()
ensureSalesStyles()

const OPEN_KEY = 'sme-sales:coach-open'
const WIDTH_KEY = 'sme-sales:coach-width'

function readCoachOpen(): boolean {
  try {
    const v = localStorage.getItem(OPEN_KEY)
    if (v === '1') return true
    if (v === '0') return false
  } catch { /* ignore */ }
  return typeof window === 'undefined' ? true : window.innerWidth >= 1180
}

function readCoachWidth(): number {
  try {
    const raw = Number(localStorage.getItem(WIDTH_KEY))
    if (Number.isFinite(raw) && raw >= 360 && raw <= 620) return Math.round(raw)
  } catch { /* ignore */ }
  return 420
}

type CaseMeta = {
  customerName?: string
  readOnly: boolean
  hasOpenItems: boolean
}

const noopAppEvents = (_event: string, _cb: (data: unknown) => void) => { /* older host fallback */ }

export default function SmeSalesPage() {
  const api = sdk.useAppApi()
  const useAppEventsHook = (sdk as unknown as {
    useAppEvents?: (event: string, cb: (data: unknown) => void) => void
  }).useAppEvents ?? noopAppEvents

  const [caseId, setCaseId] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [coachOpen, setCoachOpenState] = useState<boolean>(readCoachOpen)
  const [coachWidth, setCoachWidthState] = useState<number>(readCoachWidth)
  const [coachIntent, setCoachIntent] = useState<CoachIntent | null>(null)
  const [caseMeta, setCaseMeta] = useState<CaseMeta | null>(null)
  const [createdCase, setCreatedCase] = useState<CreatedCaseBanner | null>(null)
  const [syncTick, setSyncTick] = useState(0)

  const intentSeqRef = useRef(0)
  const quickDraftRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // The catalog only labels things; the page still works if it fails to load.
    api.get<Catalog>(`${API}/catalog`).then(setCatalog).catch(() => setCatalog(null))
  }, [api])

  const setCoachOpen = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setCoachOpenState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next
      try { localStorage.setItem(OPEN_KEY, val ? '1' : '0') } catch { /* ignore */ }
      return val
    })
  }, [])

  const setCoachWidth = useCallback((w: number) => {
    const clamped = Math.min(620, Math.max(360, Math.round(w)))
    setCoachWidthState(clamped)
    try { localStorage.setItem(WIDTH_KEY, String(clamped)) } catch { /* ignore */ }
  }, [])

  const bumpSync = useCallback(() => {
    setSyncTick((t) => t + 1)
  }, [])

  useAppEventsHook('tool_result', bumpSync)
  useAppEventsHook('chat_done', bumpSync)

  useEffect(() => {
    if (!coachOpen) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setSyncTick((t) => t + 1)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [coachOpen])

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
      <div className="ss-workspace">
        <div className="ss-main">
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
