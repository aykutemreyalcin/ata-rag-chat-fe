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
        '{"confidence":0.82,"answered":true,"source_count":1,"latency_ms":1240,"model":"gpt-4.1-mini"}',
      ),
    ).toEqual({
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
    expect(parseErrorPayload('Service unavailable')).toBe(
      'Service unavailable',
    )
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
