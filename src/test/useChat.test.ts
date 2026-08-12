import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useChat } from '../hooks/useChat'

vi.mock('../api/sseClient', () => ({
  confidenceFromDone: vi.fn(() => ({
    score: 0.9,
    level: 'high',
    answered: true,
  })),
  streamChat: vi.fn(),
}))

vi.mock('../api/client', () => ({
  submitChatFeedback: vi.fn(),
}))

import { submitChatFeedback } from '../api/client'
import { streamChat } from '../api/sseClient'

describe('useChat feedback', () => {
  it('submits feedback using the stored query id', async () => {
    vi.mocked(submitChatFeedback).mockResolvedValue({
      query_id: '11111111-1111-1111-1111-111111111111',
      helpful: true,
      feedback_at: '2026-08-12T12:00:00Z',
    })
    vi.mocked(streamChat).mockImplementation(async (_request, handlers) => {
      handlers.onDone({
        query_id: '11111111-1111-1111-1111-111111111111',
        confidence: 0.9,
        answered: true,
        source_count: 1,
        latency_ms: 100,
        model: 'test',
      })
    })

    const { result } = renderHook(() => useChat())

    await act(async () => {
      await result.current.submitQuestion('What is tuition?')
    })

    const assistant = result.current.messages.find(
      (message) => message.role === 'assistant',
    )
    expect(assistant?.queryId).toBe('11111111-1111-1111-1111-111111111111')

    await act(async () => {
      await result.current.submitFeedback(assistant!.id, true)
    })

    await waitFor(() => {
      expect(submitChatFeedback).toHaveBeenCalledWith({
        query_id: '11111111-1111-1111-1111-111111111111',
        helpful: true,
      })
    })

    expect(
      result.current.messages.find((message) => message.id === assistant!.id)
        ?.feedbackStatus,
    ).toBe('success')
  })
})
