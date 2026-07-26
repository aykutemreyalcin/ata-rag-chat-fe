export type HealthResponse = {
  status: string
  service: string
}

/** Matches be/rag-chat-api SourceCitation (camelCase JSON). */
export type ChatSourceType = 'html' | 'pdf' | 'pricing'

export type ChatSource = {
  title: string
  url: string
  section?: string | null
  sourceType?: ChatSourceType
  score?: number
}

/** Matches POST /api/chat request body (ChatRequest.java). */
export type ChatLocale = 'en' | 'pl'

export type ChatRequest = {
  question: string
  top_k?: number
}

/** Matches SSE `done` event payload (ChatDoneEvent.java). */
export type ChatDoneEvent = {
  confidence: number
  answered: boolean
  source_count: number
  latency_ms: number
  model: string
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown'

export type ChatConfidence = {
  score: number | null
  level: ConfidenceLevel
  answered?: boolean
}

export type ChatMessageRole = 'user' | 'assistant'

export type ChatMessageStatus = 'streaming' | 'complete' | 'error'

export type ChatMessage = {
  id: string
  role: ChatMessageRole
  content: string
  sources?: ChatSource[]
  confidence?: ChatConfidence
  status?: ChatMessageStatus
  error?: string
  model?: string
  latencyMs?: number
}

export type ChatStreamEventType = 'token' | 'sources' | 'error' | 'done'

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
