import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const BACKEND_ROOT = resolve(
  'C:/Users/alvin/Desktop/ATA Builders/Project 3/ata-rag-chat-be',
)

function readBackend(relativePath: string): string {
  return readFileSync(resolve(BACKEND_ROOT, relativePath), 'utf8')
}

describe('backend chat contract alignment', () => {
  it('matches ChatRequest fields from backend DTO', () => {
    const source = readBackend('src/main/java/com/ata/rag/dto/ChatRequest.java')

    expect(source).toContain('@NotBlank String question')
    expect(source).toContain('@JsonProperty("top_k")')
    expect(source).toContain('topK = 5')
  })

  it('matches SourceCitation fields from backend DTO', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/dto/SourceCitation.java',
    )

    expect(source).toContain('String title')
    expect(source).toContain('String url')
    expect(source).toContain('String section')
    expect(source).toContain('String sourceType')
    expect(source).toContain('double score')
  })

  it('matches SSE done payload from backend DTO', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/dto/ChatDoneEvent.java',
    )

    expect(source).toContain('double confidence')
    expect(source).toContain('boolean answered')
    expect(source).toContain('@JsonProperty("source_count")')
    expect(source).toContain('@JsonProperty("latency_ms")')
    expect(source).toContain('String model')
  })

  it('documents chat SSE sequence from backend service', () => {
    const source = readBackend('src/main/java/com/ata/rag/chat/ChatService.java')

    expect(source).toContain('send(emitter, "sources"')
    expect(source).toContain('send(emitter, "token"')
    expect(source).toContain('"done"')
    expect(source).toContain('send(emitter, "error"')
  })

  it('matches health endpoint from backend controller', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/controller/HealthController.java',
    )

    expect(source).toContain('@GetMapping("/health")')
    expect(source).toContain('"ok"')
    expect(source).toContain('"ata-rag-chat-be"')
  })
})
