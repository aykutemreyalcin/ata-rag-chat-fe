import { describe, expect, it, vi } from 'vitest'
import {
  confidenceFromDone,
  createSseParser,
  normalizeConfidenceLevel,
  parseDonePayload,
  parseErrorPayload,
  parseSourcesPayload,
  parseSseBlock,
  parseTokenPayload,
} from '../api/sseClient'

describe('sseClient parsers', () => {
  it('parses plain and JSON token payloads', () => {
    expect(parseTokenPayload('Hello')).toBe('Hello')
    expect(parseTokenPayload('{"text":"World"}')).toBe('World')
    expect(parseTokenPayload('{"content":"Again"}')).toBe('Again')
  })

  it('parses backend source payloads with metadata', () => {
    expect(
      parseSourcesPayload(
        '{"sources":[{"title":"Fees","url":"https://akademiata.pl/fees","section":"Tuition","sourceType":"pricing","score":0.82}]}',
      ),
    ).toEqual([
      {
        title: 'Fees',
        url: 'https://akademiata.pl/fees',
        section: 'Tuition',
        sourceType: 'pricing',
        score: 0.82,
      },
    ])
  })

  it('parses done payloads from backend contract', () => {
    expect(
      parseDonePayload(
        '{"query_id":"11111111-1111-1111-1111-111111111111","confidence":0.82,"answered":true,"source_count":1,"latency_ms":1240,"model":"gpt-4.1-mini"}',
      ),
    ).toEqual({
      query_id: '11111111-1111-1111-1111-111111111111',
      confidence: 0.82,
      answered: true,
      source_count: 1,
      latency_ms: 1240,
      model: 'gpt-4.1-mini',
    })
  })

  it('derives confidence levels using backend threshold', () => {
    expect(normalizeConfidenceLevel(0.82, true)).toBe('high')
    expect(normalizeConfidenceLevel(0.6, true)).toBe('medium')
    expect(normalizeConfidenceLevel(0.35, true)).toBe('low')
    expect(normalizeConfidenceLevel(0.35, false)).toBe('unknown')
  })

  it('maps done events to chat confidence', () => {
    expect(
      confidenceFromDone({
        query_id: null,
        confidence: 0.35,
        answered: false,
        source_count: 0,
        latency_ms: 900,
        model: 'confidence-fallback',
      }),
    ).toEqual({
      score: 0.35,
      level: 'unknown',
      answered: false,
    })
  })

  it('parses error payloads', () => {
    expect(parseErrorPayload('Service unavailable')).toBe('Service unavailable')
    expect(
      parseErrorPayload(
        '{"message":"The chat request could not be completed.","code":"CHAT_FAILED"}',
      ),
    ).toBe('The chat request could not be completed.')
  })

  it('parses SSE blocks and dispatches backend event order', () => {
    const onToken = vi.fn()
    const onSources = vi.fn()
    const onDone = vi.fn()
    const parser = createSseParser({
      onToken,
      onSources,
      onError: vi.fn(),
      onDone,
    })

    parser.push(
      'event: sources\ndata: {"sources":[{"title":"Docs","url":"https://example.com","sourceType":"html","score":0.7}]}\n\n',
    )
    parser.push('event: token\ndata: {"text":"Hello "}\n\n')
    parser.push(
      'event: done\ndata: {"confidence":0.7,"answered":true,"source_count":1,"latency_ms":500,"model":"extractive-fallback"}\n\n',
    )
    parser.flush()

    expect(onSources).toHaveBeenCalledWith([
      {
        title: 'Docs',
        url: 'https://example.com',
        section: null,
        sourceType: 'html',
        score: 0.7,
      },
    ])
    expect(onToken).toHaveBeenCalledWith('Hello ')
    expect(onDone).toHaveBeenCalledWith({
      query_id: null,
      confidence: 0.7,
      answered: true,
      source_count: 1,
      latency_ms: 500,
      model: 'extractive-fallback',
    })
  })

  it('reads named SSE events from blocks', () => {
    expect(parseSseBlock('event: done\ndata: {"confidence":0.9}\n')).toEqual({
      event: 'done',
      data: '{"confidence":0.9}',
    })
  })
})

describe('streamChat', () => {
  it('does not call onDone after an in-stream error event', async () => {
    const onDone = vi.fn()
    const onError = vi.fn()
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'event: error\ndata: {"message":"The chat request could not be completed.","code":"CHAT_FAILED"}\n\n',
          ),
        )
        controller.close()
      },
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        body,
      }),
    )

    const { streamChat } = await import('../api/sseClient')
    await streamChat(
      { question: 'test' },
      {
        onToken: vi.fn(),
        onSources: vi.fn(),
        onDone,
        onError,
      },
    )

    expect(onError).toHaveBeenCalledWith(
      'The chat request could not be completed.',
    )
    expect(onDone).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
