import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitChatFeedback } from '../api/client'

describe('submitChatFeedback', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts feedback to the chat feedback endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          query_id: '11111111-1111-1111-1111-111111111111',
          helpful: true,
          feedback_at: '2026-08-12T12:00:00Z',
        }),
      }),
    )

    const response = await submitChatFeedback({
      query_id: '11111111-1111-1111-1111-111111111111',
      helpful: true,
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/chat\/feedback$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          query_id: '11111111-1111-1111-1111-111111111111',
          helpful: true,
        }),
      }),
    )
    expect(response.helpful).toBe(true)
  })
})
