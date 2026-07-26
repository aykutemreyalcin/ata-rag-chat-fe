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

export { streamChat } from './sseClient'
