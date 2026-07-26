import { useCallback, useRef, useState } from 'react'
import { confidenceFromDone, streamChat } from '../api/sseClient'
import type { ChatMessage } from '../api/types'

function createMessageId(): string {
  return crypto.randomUUID()
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsStreaming(false)
    setMessages((current) =>
      current.map((message) =>
        message.status === 'streaming'
          ? { ...message, status: 'complete' as const }
          : message,
      ),
    )
  }, [])

  const submitQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (!trimmed || isStreaming) return

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

      setMessages((current) => [...current, userMessage, assistantMessage])
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      await streamChat(
        { question: trimmed, top_k: 5 },
        {
          onToken: (token) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + token }
                  : message,
              ),
            )
          },
          onSources: (sources) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId ? { ...message, sources } : message,
              ),
            )
          },
          onDone: (result) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      status: 'complete',
                      confidence: confidenceFromDone(result),
                      model: result.model,
                      latencyMs: result.latency_ms,
                    }
                  : message,
              ),
            )
            setIsStreaming(false)
            abortRef.current = null
          },
          onError: (message) => {
            setMessages((current) =>
              current.map((entry) =>
                entry.id === assistantId
                  ? {
                      ...entry,
                      status: 'error',
                      error: message,
                    }
                  : entry,
              ),
            )
            setIsStreaming(false)
            abortRef.current = null
          },
        },
        controller.signal,
      )
    },
    [isStreaming],
  )

  return {
    messages,
    isStreaming,
    submitQuestion,
    stopStreaming,
  }
}
