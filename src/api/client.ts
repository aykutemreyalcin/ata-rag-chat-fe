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
  const { data } = await apiClient.post<ChatFeedbackResponse>(
    '/chat/feedback',
    request,
  )
  return data
}

export { streamChat } from './sseClient'
