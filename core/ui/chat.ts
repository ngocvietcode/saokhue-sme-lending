import { useChatLauncher } from '@kirocrew/app-sdk'
import { useCallback } from 'react'

const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 100)

/**
 * Open a chat with one of this app's agents, staging `message` for the user to send.
 *
 * `openChat({ agent })` names a Bot (crew member), and an app agent is not one, so
 * the chat is created with `createChat` (the agent the manifest declares in
 * `permissions.chatLaunch`) and opened by its key. One `topic` keeps one chat.
 *
 * `agent` is the agent's spec `name`; `keyPrefix` must equal `chatLaunch.keyPrefix`.
 */
export function useAgentChat(agent: string, keyPrefix: string, onError?: (message: string) => void) {
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
        const slotKey = await createChat({ slotKey: keyPrefix + safe(topic), agent, title })
        openChat({ slotKey, autoSend: false, message })
      } catch (e) {
        onError?.(`Không mở được chat với trợ lý: ${e instanceof Error ? e.message : String(e)}`)
      }
    },
    [launcher, agent, keyPrefix, onError],
  )
}
