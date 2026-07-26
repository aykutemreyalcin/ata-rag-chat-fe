export type HealthResponse = {
  status: string
  service: string
}

export type ChatSource = {
  title: string
  url: string
  section?: string
}

/** Matches backend crawl run serialization in AdminController. */
export type CrawlRun = {
  id: string
  run_type?: string
  started_at: string | null
  finished_at: string | null
  status: string
  pages_discovered: number
  pages_updated: number
  pages_failed: number
  pages_removed: number
  error_summary?: string | null
}

/** Matches GET /api/admin/summary (AdminController.summary). */
export type AdminSummary = {
  page_count: number
  chunk_count: number
  chunks_by_source_type?: Record<string, number>
  last_crawl: CrawlRun | null
  last_pricing_sync?: CrawlRun | null
  failed_page_count: number
  avg_confidence: number | null
  avg_latency_ms: number | null
  total_questions?: number
  answered_questions?: number
  unanswered_questions?: number
  active_sync_job?: string | null
}

/** Matches GET /api/admin/failed-pages items. */
export type FailedPage = {
  url: string
  http_status: number
  error_message: string
}

/** Matches AdminQuestionsResponse.java. */
export type AdminQuestionsResponse = {
  top_questions: Array<{ question: string; count: number }>
  unanswered: Array<{ question: string; created_at: string }>
}

/** Matches SyncJobResponse.java. */
export type SyncJobResponse = {
  job: string
  status: string
  submitted_at: string
}

export type ApiError = {
  timestamp?: string
  status: number
  error: string
  message: string
  path?: string
}
