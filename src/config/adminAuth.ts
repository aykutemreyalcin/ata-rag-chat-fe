import { getApiBaseUrl } from './env'

export function getAdminAuthHeader(): string | undefined {
  const user = import.meta.env.VITE_ADMIN_USER?.trim()
  const password = import.meta.env.VITE_ADMIN_PASSWORD?.trim()
  if (!user || !password) {
    return undefined
  }
  return `Basic ${btoa(`${user}:${password}`)}`
}

export function hasAdminCredentials(): boolean {
  return getAdminAuthHeader() !== undefined
}

export function adminAuthHeaders(): Record<string, string> {
  const authorization = getAdminAuthHeader()
  return authorization ? { Authorization: authorization } : {}
}

export function getAdminApiBaseUrl(): string {
  return getApiBaseUrl()
}
