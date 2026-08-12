import axios from 'axios'
import { getApiBaseUrl, getHealthUrl } from '../config/env'
import type {
  ChatFeedbackRequest,
  ChatFeedbackResponse,
  HealthResponse,
} from './types'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await axios.get<HealthResponse>(getHealthUrl(), {
    timeout: 4000,
  })
  return data
}

export async function submitChatFeedback(
  request: ChatFeedbackRequest,
): Promise<ChatFeedbackResponse> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(`${getApiBaseUrl()}/chat/feedback`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    })

    if (!response.ok) {
      let message = `Feedback request failed (${response.status})`
      try {
        const payload = (await response.json()) as { message?: string }
        if (typeof payload.message === 'string' && payload.message.trim()) {
          message = payload.message
        }
      } catch {
        // ignore malformed error payloads
      }
      throw new Error(message)
    }

    return (await response.json()) as ChatFeedbackResponse
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Feedback request timed out')
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export { streamChat } from './sseClient'
