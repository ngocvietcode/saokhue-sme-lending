import * as sdk from '@kirocrew/app-sdk'
import { Btn } from '@kirocrew/app-sdk/ui'
import { ArrowRight, ExternalLink, MessageSquare, PanelRightClose, Plus } from 'lucide-react'
import {
  useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent,
} from 'react'
import { useAgentChat } from '@sme-ui/chat'
import { CHAT_PREFIX, COACH, errMsg } from './model'

export type CoachIntent = {
  id: number
  prompt: string
  mode: 'prefill' | 'new_intake' | 'attach'
}

export type CreatedCaseBanner = {
  caseId: string
  name: string
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

const INTAKE_STORAGE_KEY = 'sme-sales:intake-id'
const PREFILL_STORAGE_KEY = 'kirocrew_prefill'
const NEW_CASE_PROMPT = 'Tạo hồ sơ mới cho khách hàng: '

const safeTopic = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 100)

function readIntakeId(): string {
  try {
    const existing = sessionStorage.getItem(INTAKE_STORAGE_KEY)
    if (existing) return existing
    const fresh = `intake-${Date.now().toString(36)}`
    sessionStorage.setItem(INTAKE_STORAGE_KEY, fresh)
    return fresh
  } catch {
    return 'intake-default'
  }
}

function writeIntakeId(id: string): void {
  try { sessionStorage.setItem(INTAKE_STORAGE_KEY, id) } catch { /* ignore */ }
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
  const sdkAny = sdk as unknown as {
    ChatPanel?: ComponentType<ChatPanelPropsLike>
    ChatEmbed?: ComponentType<ChatEmbedPropsLike>
  }
  const ChatPanelComp = sdkAny.ChatPanel
  const ChatEmbedComp = sdkAny.ChatEmbed
  const launcher = sdk.useChatLauncher()
  const openFullCoach = useAgentChat(COACH, CHAT_PREFIX)

  const [intakeId, setIntakeId] = useState<string>(readIntakeId)
  const topic = caseId ?? intakeId
  const desiredSlot = CHAT_PREFIX + safeTopic(topic)
  const sessionTitle = useMemo(() => {
    if (!caseId) return 'Hồ sơ SME mới'
    return customerName ? `Hồ sơ ${customerName} (${caseId})` : `Hồ sơ ${caseId}`
  }, [caseId, customerName])

  const [readySlot, setReadySlot] = useState<string | null>(null)
  const [slotError, setSlotError] = useState<string | null>(null)
  const readySlotRef = useRef<string | null>(null)
  readySlotRef.current = readySlot

  useEffect(() => {
    let cancelled = false
    setSlotError(null)
    const isSameSlot = readySlotRef.current === desiredSlot
    const createChat = (launcher as { createChat?: (o: Record<string, unknown>) => Promise<string> }).createChat
    if (!createChat) {
      if (!isSameSlot) setReadySlot(desiredSlot)
      return
    }
    if (!isSameSlot) setReadySlot(null)
    createChat({ slotKey: desiredSlot, agent: COACH, title: sessionTitle })
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
  }, [desiredSlot, sessionTitle, launcher])

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

  // Safety check after slot activation so a pending prefill always lands in the single native composer.
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

  // Poll briefly if file upload picker was requested before ChatPanel finished mounting.
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
    const nextSlot = CHAT_PREFIX + safeTopic(fresh)
    writeIntakeId(fresh)
    onDismissCreatedCase()
    if (prefillPrompt) {
      const ts = writeSlotPrefill(nextSlot, prefillPrompt)
      pendingPrefillRef.current = { slotKey: nextSlot, prompt: prefillPrompt, ts }
      setSafetyNonce((n) => n + 1)
    }
    setIntakeId(fresh)
  }, [onDismissCreatedCase])

  useEffect(() => {
    if (!intent || intent.id === lastIntentIdRef.current) return
    lastIntentIdRef.current = intent.id
    if (intent.mode === 'new_intake') {
      const el = findComposerInput(dockRef.current)
      const current = readComposerText(el).trim()
      if (caseId === null && current === NEW_CASE_PROMPT.trim() && el) {
        focusComposerAtEnd(el)
      } else {
        startNewIntake(intent.prompt || NEW_CASE_PROMPT)
      }
      onConsumeIntent()
      return
    }
    if (intent.mode === 'attach') {
      const el = findComposerInput(dockRef.current)
      if (caseId && !readComposerText(el).trim()) {
        prefillIntoSlot(desiredSlot, `Tôi gửi chứng từ bổ sung cho hồ sơ ${caseId}: `)
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
  }, [intent, caseId, desiredSlot, onConsumeIntent, prefillIntoSlot, startNewIntake])

  /* Resize drag on left border */
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
    const next = Math.min(620, Math.max(360, Math.round(st.startW + (st.startX - e.clientX))))
    onWidthChange(next)
  }
  const onResizeEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null
      setDragging(false)
    }
  }

  return (
    <aside ref={dockRef} className="ss-coach-dock" style={{ width }} aria-label="Trợ lý hồ sơ SME">
      <div
        className={`ss-coach-resizer ${dragging ? 'dragging' : ''}`}
        role="separator"
        aria-orientation="vertical"
        aria-label="Kéo để đổi độ rộng bảng trợ lý"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
      />

      <header className="ss-coach-head">
        <div className="ss-head-left">
          <div className="sme-row" style={{ gap: 5, flex: 'none' }}>
            <MessageSquare size={14} style={{ color: 'var(--accent)', flex: 'none' }} />
            {caseId ? (
              <span className="sme-mono sme-small sme-muted">{caseId}</span>
            ) : (
              <span className="sme-small sme-strong">Trợ lý hồ sơ</span>
            )}
          </div>
          <div className="ss-head-chips">
            {caseId && !readOnly && (
              <>
                <button type="button" className="ss-quick-chip"
                  onClick={() => prefillIntoSlot(desiredSlot, `Cập nhật thông tin hồ sơ ${caseId}: `)}>
                  Cập nhật
                </button>
                {hasOpenItems && onQuickDraft && (
                  <button type="button" className="ss-quick-chip" onClick={onQuickDraft}>
                    Soạn thư
                  </button>
                )}
                <button type="button" className="ss-quick-chip"
                  onClick={() => prefillIntoSlot(desiredSlot, `Rà soát các hạng mục chặn và điều kiện chính sách còn thiếu của hồ sơ ${caseId}, đề xuất phương án xử lý.`)}>
                  Rà soát
                </button>
              </>
            )}
            {!caseId && (
              <button type="button" className="ss-quick-chip"
                onClick={() => prefillIntoSlot(desiredSlot, 'Rà soát danh sách hồ sơ đang mở hôm nay, nêu các hồ sơ quá hạn hoặc sắp đủ điều kiện trình.')}>
                Việc hôm nay
              </button>
            )}
          </div>
        </div>
        <div className="sme-row" style={{ gap: 2, flex: 'none' }}>
          {!caseId && (
            <button type="button" className="ss-icon-btn" title="Phiên tạo hồ sơ mới" onClick={() => startNewIntake()}>
              <Plus size={15} />
            </button>
          )}
          <button
            type="button"
            className="ss-icon-btn"
            title="Mở toàn màn hình trong Chat"
            onClick={() => openFullCoach('', topic, sessionTitle)}
          >
            <ExternalLink size={14} />
          </button>
          <button type="button" className="ss-icon-btn" title="Thu gọn trợ lý" onClick={onClose}>
            <PanelRightClose size={15} />
          </button>
        </div>
      </header>

      {!caseId && createdCase && (
        <div className="ss-coach-new-banner">
          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Hồ sơ mới: <b>{createdCase.name}</b> <span className="sme-mono">({createdCase.caseId})</span>
          </div>
          <Btn primary onClick={() => onOpenCase(createdCase.caseId)}>
            Mở hồ sơ <ArrowRight size={12} />
          </Btn>
        </div>
      )}

      <div className="ss-coach-body">
        {slotError ? (
          <div className="ss-coach-fallback">
            <div className="sme-card sme-stack" style={{ gap: 10 }}>
              <div className="sme-h3">Không khởi tạo được phiên trợ lý</div>
              <div className="sme-small sme-muted">{slotError}</div>
              <div className="sme-row">
                <Btn onClick={() => openFullCoach('', topic, sessionTitle)}>
                  <ExternalLink size={13} /> Mở Trợ lý ở trang Chat
                </Btn>
              </div>
            </div>
          </div>
        ) : !readySlot ? (
          <div className="ss-coach-fallback">
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
            agent={COACH}
            frameless
            startAtBottom
            placeholder={caseId
              ? `Nhắn trợ lý hoặc kéo chứng từ vào cho ${caseId}...`
              : 'Kể về khách hàng mới hoặc kéo bộ chứng từ vào đây...'}
          />
        ) : (
          <div className="ss-coach-fallback">
            <div className="sme-card sme-stack" style={{ gap: 10 }}>
              <div className="sme-h3">Host chưa hỗ trợ nhúng khung chat tại trang</div>
              <div className="sme-row">
                <Btn primary onClick={() => openFullCoach('', topic, sessionTitle)}>
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
