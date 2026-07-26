import { getApiBaseUrl } from '../config/env'
import type {
  ChatConfidence,
  ChatDoneEvent,
  ChatRequest,
  ChatSource,
  ChatSourceType,
  ChatStreamEventType,
  ConfidenceLevel,
} from './types'

export type StreamChatHandlers = {
  onToken: (token: string) => void
  onSources: (sources: ChatSource[]) => void
  onDone: (result: ChatDoneEvent) => void
  onError: (message: string) => void
}

type ParsedSseMessage = {
  event: ChatStreamEventType | 'message'
  data: string
}

const BACKEND_CONFIDENCE_THRESHOLD = 0.55

export function normalizeConfidenceLevel(
  score: number | null,
  answered = true,
): ConfidenceLevel {
  if (!answered) {
    return 'unknown'
  }
  if (score === null || Number.isNaN(score)) {
    return 'unknown'
  }
  if (score >= 0.7) return 'high'
  if (score >= BACKEND_CONFIDENCE_THRESHOLD) return 'medium'
  if (score >= 0.1) return 'low'
  return 'unknown'
}

export function confidenceFromDone(result: ChatDoneEvent): ChatConfidence {
  return {
    score: result.confidence,
    level: normalizeConfidenceLevel(result.confidence, result.answered),
    answered: result.answered,
  }
}

function parseJsonPayload(data: string): unknown {
  try {
    return JSON.parse(data) as unknown
  } catch {
    return data
  }
}

export function parseTokenPayload(data: string): string {
  const payload = parseJsonPayload(data)
  if (typeof payload === 'string') {
    return payload
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    for (const key of ['text', 'content', 'token', 'delta']) {
      const value = record[key]
      if (typeof value === 'string') {
        return value
      }
    }
  }
  return data
}

function parseSourceType(value: unknown): ChatSourceType | undefined {
  if (value === 'html' || value === 'pdf' || value === 'pricing') {
    return value
  }
  return undefined
}

export function parseSourcesPayload(data: string): ChatSource[] {
  const payload = parseJsonPayload(data)
  const rawSources = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === 'object' &&
        Array.isArray((payload as { sources?: unknown }).sources)
      ? (payload as { sources: unknown[] }).sources
      : []

  return rawSources
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === 'object',
    )
    .filter(
      (item) =>
        typeof item.title === 'string' && typeof item.url === 'string',
    )
    .map((item) => ({
      title: item.title as string,
      url: item.url as string,
      section: typeof item.section === 'string' ? item.section : null,
      sourceType: parseSourceType(item.sourceType),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
}

export function parseDonePayload(data: string): ChatDoneEvent {
  const payload = parseJsonPayload(data)
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    return {
      confidence:
        typeof record.confidence === 'number' ? record.confidence : 0,
      answered: record.answered === true,
      source_count:
        typeof record.source_count === 'number' ? record.source_count : 0,
      latency_ms:
        typeof record.latency_ms === 'number' ? record.latency_ms : 0,
      model: typeof record.model === 'string' ? record.model : 'unknown',
    }
  }

  return {
    confidence: 0,
    answered: false,
    source_count: 0,
    latency_ms: 0,
    model: 'unknown',
  }
}

export function parseErrorPayload(data: string): string {
  const payload = parseJsonPayload(data)
  if (typeof payload === 'string') {
    return payload
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (typeof record.message === 'string') return record.message
    if (typeof record.error === 'string') return record.error
  }
  return data || 'Chat request failed'
}

export function parseSseBlock(block: string): ParsedSseMessage | null {
  const lines = block.split(/\r?\n/)
  let event: ParsedSseMessage['event'] = 'message'
  const dataLines: string[] = []

  for (const line of lines) {
    if (!line || line.startsWith(':')) continue
    if (line.startsWith('event:')) {
      const name = line.slice(6).trim()
      if (
        name === 'token' ||
        name === 'sources' ||
        name === 'error' ||
        name === 'done'
      ) {
        event = name
      }
      continue
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart())
    }
  }

  if (dataLines.length === 0 && event === 'message') {
    return null
  }

  return {
    event,
    data: dataLines.join('\n'),
  }
}

export function dispatchSseMessage(
  message: ParsedSseMessage,
  handlers: StreamChatHandlers,
): void {
  switch (message.event) {
    case 'token':
      if (message.data) {
        handlers.onToken(parseTokenPayload(message.data))
      }
      break
    case 'sources':
      handlers.onSources(parseSourcesPayload(message.data))
      break
    case 'error':
      handlers.onError(parseErrorPayload(message.data))
      break
    case 'done':
      handlers.onDone(parseDonePayload(message.data))
      break
    case 'message':
      if (message.data) {
        handlers.onToken(parseTokenPayload(message.data))
      }
      break
  }
}

export function createSseParser(handlers: StreamChatHandlers) {
  let buffer = ''

  return {
    push(chunk: string) {
      buffer += chunk
      const blocks = buffer.split(/\r?\n\r?\n/)
      buffer = blocks.pop() ?? ''

      for (const block of blocks) {
        const message = parseSseBlock(block)
        if (message) {
          dispatchSseMessage(message, handlers)
        }
      }
    },
    flush() {
      if (!buffer.trim()) return
      const message = parseSseBlock(buffer)
      buffer = ''
      if (message) {
        dispatchSseMessage(message, handlers)
      }
    },
  }
}

async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string }
    if (typeof payload.message === 'string') {
      return payload.message
    }
  } catch {
    // fall through
  }
  return `Chat request failed (${response.status})`
}

export async function streamChat(
  request: ChatRequest,
  handlers: StreamChatHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/chat`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: request.question,
      top_k: request.top_k ?? 5,
    }),
    signal,
  })

  if (!response.ok) {
    handlers.onError(await readApiErrorMessage(response))
    return
  }

  if (!response.body) {
    handlers.onError('Chat response stream was empty')
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let doneCalled = false

  const finish = (result?: ChatDoneEvent) => {
    if (doneCalled) return
    doneCalled = true
    handlers.onDone(
      result ?? {
        confidence: 0,
        answered: false,
        source_count: 0,
        latency_ms: 0,
        model: 'unknown',
      },
    )
  }

  const activeParser = createSseParser({
    ...handlers,
    onDone: (result) => finish(result),
  })

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      activeParser.push(decoder.decode(value, { stream: true }))
    }
    activeParser.flush()
    finish()
  } catch (error) {
    if (signal?.aborted) {
      return
    }
    handlers.onError(
      error instanceof Error ? error.message : 'Chat stream interrupted',
    )
  } finally {
    reader.releaseLock()
  }
}
