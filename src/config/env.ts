const DEFAULT_API_BASE_URL = 'http://localhost:8080/api'

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  return configured && configured.length > 0 ? configured : DEFAULT_API_BASE_URL
}

export function getHealthUrl(): string {
  const apiBase = getApiBaseUrl()
  if (apiBase.startsWith('/')) {
    return '/health'
  }
  return apiBase.replace(/\/api\/?$/, '/health')
}
