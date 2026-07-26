import axios from 'axios'
import { getApiBaseUrl, getHealthUrl } from '../config/env'
import type { HealthResponse } from './types'

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

/**
 * POST /api/chat SSE client — implemented in FE-1.2.
 * Request body matches be/rag-chat-api ChatRequest: { question, top_k? }.
 */
export async function postChatNotImplemented(question: string): Promise<never> {
  await apiClient.post('/chat', { question, top_k: 5 })
  throw new Error('Unexpected success from unimplemented chat endpoint')
}
