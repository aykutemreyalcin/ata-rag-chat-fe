import { useCallback, useRef, useState } from 'react'
import type { ChatMessage } from '../api/types'

function createMessageId(): string {
  return crypto.randomUUID()
}

export function useChatSession() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const activeAssistantId = useRef<string | null>(null)

  const beginTurn = useCallback(
    (question: string): string | null => {
      const trimmed = question.trim()
      if (!trimmed || isStreaming) return null

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: 'user',
        content: trimmed,
        status: 'complete',
      }
      const assistantId = createMessageId()
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        status: 'streaming',
      }

      activeAssistantId.current = assistantId
      setMessages((current) => [...current, userMessage, assistantMessage])
      setIsStreaming(true)
      return assistantId
    },
    [isStreaming],
  )

  const appendAssistantToken = useCallback(
    (assistantId: string, token: string) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: message.content + token }
            : message,
        ),
      )
    },
    [],
  )

  const completeAssistant = useCallback((assistantId: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === assistantId
          ? { ...message, status: 'complete' }
          : message,
      ),
    )
    if (activeAssistantId.current === assistantId) {
      activeAssistantId.current = null
      setIsStreaming(false)
    }
  }, [])

  const failAssistant = useCallback((assistantId: string, error: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === assistantId
          ? { ...message, status: 'error', error }
          : message,
      ),
    )
    if (activeAssistantId.current === assistantId) {
      activeAssistantId.current = null
      setIsStreaming(false)
    }
  }, [])

  const stopStreaming = useCallback(() => {
    const assistantId = activeAssistantId.current
    if (!assistantId) return

    setMessages((current) =>
      current.map((message) =>
        message.id === assistantId
          ? { ...message, status: 'complete' }
          : message,
      ),
    )
    activeAssistantId.current = null
    setIsStreaming(false)
  }, [])

  return {
    messages,
    isStreaming,
    beginTurn,
    appendAssistantToken,
    completeAssistant,
    failAssistant,
    stopStreaming,
  }
}
