import * as sdk from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import { ArrowRight, ExternalLink, MessageSquare, PanelRightClose, Plus } from 'lucide-react'
import {
  useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent,
} from 'react'
import { useAgentChat } from './chat'
import { errMsg } from './format'

export type AssistantIntent = {
  id: number
  prompt: string
  mode: 'prefill' | 'new_intake' | 'attach'
}

export type CreatedCaseBanner = {
  caseId: string
  name: string
}

export type DockChip = {
  label: string
  prompt?: string
  onClick?: () => void
}

export type AssistantDockProps = {
  storagePrefix: string
  chatPrefix: string
  agent: string
  panelLabel: string
  newIntakePrompt: string
  newSessionTitle: string
  caseTitlePrefix?: string
  chips?: DockChip[]
  showNewSessionButton?: boolean
  attachDefaultPrefix?: string
  embedPlaceholder?: string
  width: number
  onWidthChange: (w: number) => void
  onClose: () => void
  caseId: string | null
  customerName?: string
  intent: AssistantIntent | null
  onConsumeIntent: () => void
  createdCase: CreatedCaseBanner | null
  onOpenCase: (caseId: string) => void
  onDismissCreatedCase: () => void
}

type ChatPanelPropsLike = {
  slotKey: string
  conversationOnly?: boolean
  expandSteps?: boolean
}

type ChatEmbedPropsLike = {
  slotKey: string
  agent?: string
  placeholder?: string
  frameless?: boolean
  startAtBottom?: boolean
}

const PREFILL_STORAGE_KEY = 'kirocrew_prefill'
const safeTopic = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 100)
const noopAppEvents = (_event: string, _cb: (data: unknown) => void) => { /* older host fallback */ }

export function clampDockWidth(w: number): number {
  return Math.min(620, Math.max(360, Math.round(w)))
}

export function readDockOpen(storageKey: string): boolean {
  try {
    const v = localStorage.getItem(storageKey)
    if (v === '1') return true
    if (v === '0') return false
  } catch { /* ignore */ }
  return typeof window === 'undefined' ? true : window.innerWidth >= 1180
}

export function writeDockOpen(storageKey: string, open: boolean): void {
  try { localStorage.setItem(storageKey, open ? '1' : '0') } catch { /* ignore */ }
}

export function readDockWidth(storageKey: string, fallback = 420): number {
  try {
    const raw = Number(localStorage.getItem(storageKey))
    if (Number.isFinite(raw) && raw >= 360 && raw <= 620) return Math.round(raw)
  } catch { /* ignore */ }
  return fallback
}

export function writeDockWidth(storageKey: string, width: number): void {
  try { localStorage.setItem(storageKey, String(clampDockWidth(width))) } catch { /* ignore */ }
}

/** Subscribe to agent activity events and poll gently while the assistant panel is open. */
export function useAssistantSync(dockOpen: boolean, intervalMs = 4000): { syncTick: number; bumpSync: () => void } {
  const useAppEventsHook = (sdk as unknown as {
    useAppEvents?: (event: string, cb: (data: unknown) => void) => void
  }).useAppEvents ?? noopAppEvents

  const [syncTick, setSyncTick] = useState(0)
  const bumpSync = useCallback(() => setSyncTick((t) => t + 1), [])

  useAppEventsHook('tool_result', bumpSync)
  useAppEventsHook('chat_done', bumpSync)

  useEffect(() => {
    if (!dockOpen) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setSyncTick((t) => t + 1)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [dockOpen, intervalMs])

  return { syncTick, bumpSync }
}

function readIntakeId(storageKey: string): string {
  try {
    const existing = sessionStorage.getItem(storageKey)
    if (existing) return existing
    const fresh = `intake-${Date.now().toString(36)}`
    sessionStorage.setItem(storageKey, fresh)
    return fresh
  } catch {
    return 'intake-default'
  }
}

function writeIntakeId(storageKey: string, id: string): void {
  try { sessionStorage.setItem(storageKey, id) } catch { /* ignore */ }
}

function findComposerInput(dock: HTMLElement | null): HTMLElement | null {
  if (!dock) return null
  return dock.querySelector<HTMLElement>('[data-composer-input]') ?? dock.querySelector<HTMLElement>('textarea')
}

function readComposerText(el: HTMLElement | null): string {
  if (!el) return ''
  return el instanceof HTMLTextAreaElement ? el.value : (el.textContent ?? '')
}

function focusComposerAtEnd(el: HTMLElement | null): void {
  if (!el) return
  el.focus()
  if (el instanceof HTMLTextAreaElement) {
    const len = el.value.length
    el.setSelectionRange(len, len)
    return
  }
  const sel = window.getSelection()
  if (sel) {
    sel.selectAllChildren(el)
    sel.collapseToEnd()
  }
}

function writeSlotPrefill(slotKey: string, prompt: string): number {
  const ts = Date.now()
  try {
    sessionStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify({ slotKey, prompt, ts }))
  } catch { /* ignore */ }
  return ts
}

/** Shared collapsible & resizable right-hand side panel backed by KiroCrew's native ChatPanel. */
export default function AssistantDock({
  storagePrefix,
  chatPrefix,
  agent,
  panelLabel,
  newIntakePrompt,
  newSessionTitle,
  caseTitlePrefix = 'Hồ sơ',
  chips = [],
  showNewSessionButton,
  attachDefaultPrefix,
  embedPlaceholder,
  width,
  onWidthChange,
  onClose,
  caseId,
  customerName,
  intent,
  onConsumeIntent,
  createdCase,
  onOpenCase,
  onDismissCreatedCase,
}: AssistantDockProps) {
  const sdkAny = sdk as unknown as {
    ChatPanel?: ComponentType<ChatPanelPropsLike>
    ChatEmbed?: ComponentType<ChatEmbedPropsLike>
  }
  const ChatPanelComp = sdkAny.ChatPanel
  const ChatEmbedComp = sdkAny.ChatEmbed
  const launcher = sdk.useChatLauncher()
  const openFullChat = useAgentChat(agent, chatPrefix)

  const intakeStorageKey = `${storagePrefix}:intake-id`
  const [intakeId, setIntakeId] = useState<string>(() => readIntakeId(intakeStorageKey))
  const topic = caseId ?? intakeId
  const desiredSlot = chatPrefix + safeTopic(topic)
  const sessionTitle = useMemo(() => {
    if (!caseId) return newSessionTitle
    return customerName
      ? `${caseTitlePrefix} ${customerName} (${caseId})`
      : `${caseTitlePrefix} ${caseId}`
  }, [caseId, customerName, newSessionTitle, caseTitlePrefix])

  const [readySlot, setReadySlot] = useState<string | null>(null)
  const [slotError, setSlotError] = useState<string | null>(null)
  const readySlotRef = useRef<string | null>(null)
  readySlotRef.current = readySlot
  // useChatLauncher() returns a new object on every render, so it must not be an
  // effect dependency: the page re-renders on each data refresh, and depending on
  // it re-sent POST /api/chat/slots every time. Read it through a ref instead.
  const launcherRef = useRef(launcher)
  launcherRef.current = launcher

  useEffect(() => {
    let cancelled = false
    setSlotError(null)
    const isSameSlot = readySlotRef.current === desiredSlot
    const createChat = (launcherRef.current as { createChat?: (o: Record<string, unknown>) => Promise<string> }).createChat
    if (!createChat) {
      if (!isSameSlot) setReadySlot(desiredSlot)
      return
    }
    if (!isSameSlot) setReadySlot(null)
    createChat({ slotKey: desiredSlot, agent, title: sessionTitle })
      .then((resolved) => {
        if (cancelled) return
        const nextKey = resolved || desiredSlot
        if (readySlotRef.current !== nextKey) setReadySlot(nextKey)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        if (!isSameSlot) setSlotError(errMsg(e))
      })
    return () => { cancelled = true }
  }, [desiredSlot, agent, sessionTitle])

  const dockRef = useRef<HTMLElement>(null)
  const lastIntentIdRef = useRef<number>(0)
  const pendingPrefillRef = useRef<{ slotKey: string; prompt: string; ts: number } | null>(null)
  const pendingAttachRef = useRef(false)
  const [safetyNonce, setSafetyNonce] = useState(0)

  const prefillIntoSlot = useCallback((targetSlot: string, prompt: string) => {
    const trimmed = prompt.trim()
    if (!trimmed) return
    const existingEl = findComposerInput(dockRef.current)
    if (readySlotRef.current === targetSlot && existingEl) {
      if (!readComposerText(existingEl).trim().includes(trimmed)) {
        window.dispatchEvent(new CustomEvent('mc-widget-send', { detail: { text: prompt } }))
      }
      requestAnimationFrame(() => focusComposerAtEnd(findComposerInput(dockRef.current)))
      return
    }
    const ts = writeSlotPrefill(targetSlot, prompt)
    pendingPrefillRef.current = { slotKey: targetSlot, prompt, ts }
    setSafetyNonce((n) => n + 1)
  }, [])

  // Safety check so prefill lands even when the slot was already active in the host store.
  useEffect(() => {
    const pending = pendingPrefillRef.current
    if (!pending || readySlot !== pending.slotKey) return
    let attempts = 0
    let seenComposerTicks = 0
    const timer = window.setInterval(() => {
      attempts += 1
      const el = findComposerInput(dockRef.current)
      if (!el) {
        if (attempts >= 20) {
          window.clearInterval(timer)
          pendingPrefillRef.current = null
        }
        return
      }
      const cur = readComposerText(el).trim()
      if (cur.includes(pending.prompt.trim())) {
        pendingPrefillRef.current = null
        window.clearInterval(timer)
        focusComposerAtEnd(el)
        return
      }
      seenComposerTicks += 1
      if (seenComposerTicks >= 3) {
        try {
          const raw = sessionStorage.getItem(PREFILL_STORAGE_KEY)
          if (raw) {
            const parsed = JSON.parse(raw) as { ts?: number; slotKey?: string }
            if (parsed.slotKey === pending.slotKey && parsed.ts === pending.ts) {
              sessionStorage.removeItem(PREFILL_STORAGE_KEY)
            }
          }
        } catch { /* ignore */ }
        window.dispatchEvent(new CustomEvent('mc-widget-send', { detail: { text: pending.prompt } }))
        pendingPrefillRef.current = null
        window.clearInterval(timer)
        requestAnimationFrame(() => focusComposerAtEnd(findComposerInput(dockRef.current)))
      }
    }, 60)
    return () => window.clearInterval(timer)
  }, [readySlot, safetyNonce])

  useEffect(() => {
    if (!pendingAttachRef.current || !readySlot) return
    let attempts = 0
    const tryClick = () => {
      const input = dockRef.current?.querySelector<HTMLInputElement>('input[type="file"]')
      if (input) {
        pendingAttachRef.current = false
        input.click()
        return true
      }
      return false
    }
    if (tryClick()) return
    const timer = window.setInterval(() => {
      attempts += 1
      if (tryClick() || attempts >= 16) {
        pendingAttachRef.current = false
        window.clearInterval(timer)
      }
    }, 50)
    return () => window.clearInterval(timer)
  }, [readySlot, safetyNonce])

  const startNewIntake = useCallback((prefillPrompt?: string) => {
    const fresh = `intake-${Date.now().toString(36)}`
    const nextSlot = chatPrefix + safeTopic(fresh)
    writeIntakeId(intakeStorageKey, fresh)
    onDismissCreatedCase()
    if (prefillPrompt) {
      const ts = writeSlotPrefill(nextSlot, prefillPrompt)
      pendingPrefillRef.current = { slotKey: nextSlot, prompt: prefillPrompt, ts }
      setSafetyNonce((n) => n + 1)
    }
    setIntakeId(fresh)
  }, [chatPrefix, intakeStorageKey, onDismissCreatedCase])

  useEffect(() => {
    if (!intent || intent.id === lastIntentIdRef.current) return
    lastIntentIdRef.current = intent.id
    if (intent.mode === 'new_intake') {
      const el = findComposerInput(dockRef.current)
      const current = readComposerText(el).trim()
      const expected = (intent.prompt || newIntakePrompt).trim()
      if (caseId === null && current === expected && el) {
        focusComposerAtEnd(el)
      } else {
        startNewIntake(intent.prompt || newIntakePrompt)
      }
      onConsumeIntent()
      return
    }
    if (intent.mode === 'attach') {
      const el = findComposerInput(dockRef.current)
      const fallbackAttach = attachDefaultPrefix ?? (caseId ? `Tôi gửi chứng từ bổ sung cho hồ sơ ${caseId}: ` : '')
      if (fallbackAttach && !readComposerText(el).trim()) {
        prefillIntoSlot(desiredSlot, fallbackAttach)
      }
      const input = dockRef.current?.querySelector<HTMLInputElement>('input[type="file"]')
      if (input) {
        pendingAttachRef.current = false
        input.click()
      } else {
        pendingAttachRef.current = true
        setSafetyNonce((n) => n + 1)
      }
      onConsumeIntent()
      return
    }
    prefillIntoSlot(desiredSlot, intent.prompt)
    onConsumeIntent()
  }, [
    intent, caseId, desiredSlot, newIntakePrompt, attachDefaultPrefix,
    onConsumeIntent, prefillIntoSlot, startNewIntake,
  ])

  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startW: number; pointerId: number } | null>(null)
  const onResizeDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startW: width, pointerId: e.pointerId }
    setDragging(true)
  }
  const onResizeMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = dragRef.current
    if (!st || st.pointerId !== e.pointerId) return
    onWidthChange(clampDockWidth(st.startW + (st.startX - e.clientX)))
  }
  const onResizeEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null
      setDragging(false)
    }
  }

  const canNewSession = showNewSessionButton ?? !caseId

  return (
    <aside ref={dockRef} className="sme-dock" style={{ width }} aria-label={panelLabel}>
      <div
        className={`sme-dock-resizer ${dragging ? 'dragging' : ''}`}
        role="separator"
        aria-orientation="vertical"
        aria-label="Kéo để đổi độ rộng bảng trợ lý"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      />

      <header className="sme-dock-head">
        <div className="sme-dock-left">
          <div className="sme-row" style={{ gap: 5, flex: 'none' }}>
            <MessageSquare size={14} style={{ color: 'var(--accent)', flex: 'none' }} />
            {caseId ? (
              <span className="sme-mono sme-small sme-muted">{caseId}</span>
            ) : (
              <span className="sme-small sme-strong">{panelLabel}</span>
            )}
          </div>
          {chips.length > 0 && (
            <div className="sme-dock-chips">
              {chips.map((ch) => (
                <button
                  key={ch.label}
                  type="button"
                  className="sme-quick-chip"
                  onClick={() => {
                    if (ch.onClick) ch.onClick()
                    else if (ch.prompt) prefillIntoSlot(desiredSlot, ch.prompt)
                  }}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="sme-row" style={{ gap: 2, flex: 'none' }}>
          {canNewSession && (
            <button type="button" className="sme-icon-btn" title="Phiên tạo hồ sơ mới" onClick={() => startNewIntake()}>
              <Plus size={15} />
            </button>
          )}
          <button
            type="button"
            className="sme-icon-btn"
            title="Mở toàn màn hình trong Chat"
            onClick={() => openFullChat('', topic, sessionTitle)}
          >
            <ExternalLink size={14} />
          </button>
          <button type="button" className="sme-icon-btn" title="Thu gọn trợ lý" onClick={onClose}>
            <PanelRightClose size={15} />
          </button>
        </div>
      </header>

      {!caseId && createdCase && (
        <div className="sme-dock-new-banner">
          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Hồ sơ mới: <b>{createdCase.name}</b> <span className="sme-mono">({createdCase.caseId})</span>
          </div>
          <Btn primary onClick={() => onOpenCase(createdCase.caseId)}>
            Mở hồ sơ <ArrowRight size={12} />
          </Btn>
        </div>
      )}

      <div className="sme-dock-body">
        {slotError ? (
          <div className="sme-dock-fallback">
            <div className="sme-card sme-stack" style={{ gap: 10 }}>
              <div className="sme-h3">Không khởi tạo được phiên trợ lý</div>
              <div className="sme-small sme-muted">{slotError}</div>
              <div className="sme-row">
                <Btn onClick={() => openFullChat('', topic, sessionTitle)}>
                  <ExternalLink size={13} /> Mở Trợ lý ở trang Chat
                </Btn>
              </div>
            </div>
          </div>
        ) : !readySlot ? (
          <div className="sme-dock-fallback">
            <div className="sme-card sme-stack">
              <div className="sme-skel" style={{ width: '55%' }} />
              <div className="sme-skel" />
              <div className="sme-skel" style={{ width: '75%' }} />
            </div>
          </div>
        ) : ChatPanelComp ? (
          <ChatPanelComp key={readySlot} slotKey={readySlot} conversationOnly />
        ) : ChatEmbedComp ? (
          <ChatEmbedComp
            key={readySlot}
            slotKey={readySlot}
            agent={agent}
            frameless
            startAtBottom
            placeholder={embedPlaceholder}
          />
        ) : (
          <div className="sme-dock-fallback">
            <div className="sme-card sme-stack" style={{ gap: 10 }}>
              <div className="sme-h3">Host chưa hỗ trợ nhúng khung chat tại trang</div>
              <div className="sme-row">
                <Btn primary onClick={() => openFullChat('', topic, sessionTitle)}>
                  <ExternalLink size={13} /> Mở Trợ lý ở trang Chat
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
