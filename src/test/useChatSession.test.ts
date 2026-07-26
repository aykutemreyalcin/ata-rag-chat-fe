import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useChatSession } from '../hooks/useChatSession'

describe('useChatSession', () => {
  it('begins a turn with user and streaming assistant messages', () => {
    const { result } = renderHook(() => useChatSession())

    act(() => {
      result.current.beginTurn('Hello?')
    })

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0]).toMatchObject({
      role: 'user',
      content: 'Hello?',
      status: 'complete',
    })
    expect(result.current.messages[1]).toMatchObject({
      role: 'assistant',
      content: '',
      status: 'streaming',
    })
    expect(result.current.isStreaming).toBe(true)
  })

  it('appends tokens and completes the assistant turn', () => {
    const { result } = renderHook(() => useChatSession())
    let assistantId = ''

    act(() => {
      assistantId = result.current.beginTurn('Fees?') ?? ''
    })

    act(() => {
      result.current.appendAssistantToken(assistantId, 'The ')
      result.current.appendAssistantToken(assistantId, 'fee is ')
      result.current.completeAssistant(assistantId)
    })

    expect(result.current.messages[1]?.content).toBe('The fee is ')
    expect(result.current.messages[1]?.status).toBe('complete')
    expect(result.current.isStreaming).toBe(false)
  })

  it('stops an in-progress stream', () => {
    const { result } = renderHook(() => useChatSession())

    act(() => {
      result.current.beginTurn('Stop me')
      result.current.stopStreaming()
    })

    expect(result.current.messages[1]?.status).toBe('complete')
    expect(result.current.isStreaming).toBe(false)
  })
})
