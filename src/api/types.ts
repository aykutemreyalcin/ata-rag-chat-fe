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
export type ChatRequest = {
  question: string
  top_k?: number
}

/** Matches SSE `done` event payload (ChatDoneEvent.java). Wired in FE-1.2. */
export type ChatDoneEvent = {
  confidence: number
  answered: boolean
  source_count: number
  latency_ms: number
  model: string
}

export type ChatLocale = 'en' | 'pl'

export type ChatMessageRole = 'user' | 'assistant'

export type ChatMessageStatus = 'streaming' | 'complete' | 'error'

export type ChatMessage = {
  id: string
  role: ChatMessageRole
  content: string
  status: ChatMessageStatus
  error?: string
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
