export type HealthResponse = {
  status: string
  service: string
}

export type ChatSource = {
  title: string
  url: string
  section?: string
}

export type AdminSummary = {
  page_count: number
  chunk_count: number
  failed_page_count: number
  avg_confidence: number | null
  avg_latency_ms: number | null
  last_crawl: {
    id: string
    started_at: string
    finished_at: string | null
    status: string
    pages_discovered: number
    pages_updated: number
    pages_failed: number
    pages_removed: number
  } | null
}

export type ApiError = {
  timestamp?: string
  status: number
  error: string
  message: string
  path?: string
}
