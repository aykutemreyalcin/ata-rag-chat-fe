import axios, { isAxiosError } from 'axios'
import { adminAuthHeaders, getAdminApiBaseUrl } from '../config/adminAuth'
import type {
  AdminQuestionsResponse,
  AdminSummary,
  FailedPage,
  SyncJobResponse,
} from './types'

function adminClient() {
  return axios.create({
    baseURL: getAdminApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
      ...adminAuthHeaders(),
    },
  })
}

export function getAdminErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message

    if (status === 401) {
      return 'Admin authentication failed. Set VITE_ADMIN_USER and VITE_ADMIN_PASSWORD.'
    }
    if (status === 409 && message) {
      return message
    }
    if (message) {
      return message
    }
    if (status) {
      return `Admin request failed (${status})`
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Admin request failed'
}

export async function fetchAdminSummary(): Promise<AdminSummary> {
  const { data } = await adminClient().get<AdminSummary>('/admin/summary')
  return data
}

export async function fetchFailedPages(): Promise<FailedPage[]> {
  const { data } = await adminClient().get<FailedPage[]>('/admin/failed-pages')
  return data
}

export async function fetchAdminQuestions(
  limit = 10,
): Promise<AdminQuestionsResponse> {
  const { data } = await adminClient().get<AdminQuestionsResponse>(
    '/admin/questions',
    { params: { limit } },
  )
  return data
}

export async function triggerWebsiteSync(): Promise<SyncJobResponse> {
  const { data } = await adminClient().post<SyncJobResponse>('/admin/sync')
  return data
}

export async function triggerPricingSync(): Promise<SyncJobResponse> {
  const { data } =
    await adminClient().post<SyncJobResponse>('/admin/prices/sync')
  return data
}
