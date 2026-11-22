import { useChatLauncher } from '@kirocrew/app-sdk'
import { useCallback } from 'react'

/** The agent's spec `name`, which a person's chat resolves; must match `permissions.chatLaunch.agents`. */
export const ASSISTANT_AGENT = 'sme-assistant'
/** Must match `permissions.chatLaunch.keyPrefix`. */
const KEY_PREFIX = 'sme-lending-chat-'

const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 100)

/**
 * Open a chat with the SME assistant agent, staging `message` for the officer to send.
 *
 * `openChat({ agent })` names a Bot (crew member), and the assistant is an app agent,
 * not a Bot, so the chat is created with `createChat` (the agent this app declares in
 * `permissions.chatLaunch`) and then opened by its key. One case keeps one chat.
 */
export function useAssistantChat(onError?: (message: string) => void) {
  const launcher = useChatLauncher()
  return useCallback(
    async (message: string, topic: string, title: string) => {
      const { openChat } = launcher
      const createChat = (launcher as { createChat?: (o: Record<string, unknown>) => Promise<string> }).createChat
      if (!createChat) {
        // A host before App Kit seam level 10: an ordinary chat with the message staged.
        openChat({ autoSend: false, message })
        return
      }
      try {
        const slotKey = await createChat({ slotKey: KEY_PREFIX + safe(topic), agent: ASSISTANT_AGENT, title })
        openChat({ slotKey, autoSend: false, message })
      } catch (e) {
        onError?.(`Không mở được chat với trợ lý SME: ${e instanceof Error ? e.message : String(e)}`)
      }
    },
    [launcher, onError],
  )
}
