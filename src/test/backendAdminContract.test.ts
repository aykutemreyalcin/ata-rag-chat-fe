import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const BACKEND_ROOT = resolve(__dirname, '../../../ata-rag-chat-be')

function readBackend(relativePath: string): string {
  return readFileSync(resolve(BACKEND_ROOT, relativePath), 'utf8')
}

describe('backend admin contract alignment', () => {
  it('documents admin summary fields', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/controller/AdminController.java',
    )

    expect(source).toContain('@GetMapping("/summary")')
    expect(source).toContain('page_count')
    expect(source).toContain('chunk_count')
    expect(source).toContain('last_crawl')
    expect(source).toContain('last_pricing_sync')
    expect(source).toContain('failed_page_count')
    expect(source).toContain('active_sync_job')
  })

  it('documents failed pages endpoint', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/controller/AdminController.java',
    )

    expect(source).toContain('@GetMapping("/failed-pages")')
    expect(source).toContain('"url"')
    expect(source).toContain('"http_status"')
    expect(source).toContain('"error_message"')
  })

  it('documents questions endpoint response', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/dto/AdminQuestionsResponse.java',
    )

    expect(source).toContain('@JsonProperty("top_questions")')
    expect(source).toContain('@JsonProperty("created_at")')
  })

  it('documents sync endpoints', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/controller/AdminController.java',
    )

    expect(source).toContain('@PostMapping("/sync")')
    expect(source).toContain('@PostMapping("/prices/sync")')
    expect(source).toContain('HttpStatus.ACCEPTED')
  })

  it('documents chat analytics fields on admin summary', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/controller/AdminController.java',
    )

    expect(source).toContain('avg_confidence')
    expect(source).toContain('avg_latency_ms')
    expect(source).toContain('total_questions')
    expect(source).toContain('answered_questions')
    expect(source).toContain('unanswered_questions')
  })

  it('requires basic auth for admin routes', () => {
    const source = readBackend(
      'src/main/java/com/ata/rag/config/SecurityConfig.java',
    )

    expect(source).toContain('"/api/admin/**"')
    expect(source).toContain('hasRole("ADMIN")')
  })
})
