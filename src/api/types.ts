export type HealthResponse = {
  status: string
  service: string
}

export type ChatSourceType = 'html' | 'pdf' | 'pricing'

export type ChatSource = {
  title: string
  url: string
  section?: string | null
  sourceType?: ChatSourceType
  score?: number
}

export type ChatLocale = 'en' | 'pl'

export type ChatRequest = {
  question: string
  top_k?: number
}

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
