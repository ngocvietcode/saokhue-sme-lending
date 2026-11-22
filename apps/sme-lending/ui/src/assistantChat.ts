import { useAgentChat } from '@sme-ui/chat'

/** The agent's spec `name`, which a person's chat resolves; must match `permissions.chatLaunch.agents`. */
export const ASSISTANT_AGENT = 'sme-assistant'

/** Open (or reopen) the SME assistant's chat for one topic, with `message` staged. */
export const useAssistantChat = (onError?: (message: string) => void) =>
  useAgentChat(ASSISTANT_AGENT, 'sme-lending-chat-', onError)
