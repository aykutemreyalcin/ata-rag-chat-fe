import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FailedPagesTable } from '../components/admin/FailedPagesTable'
import { FeedbackPanel } from '../components/admin/FeedbackPanel'
import { QuestionsPanel } from '../components/admin/QuestionsPanel'
import { SummaryCards } from '../components/admin/SummaryCards'
import { SyncActions } from '../components/admin/SyncActions'

describe('admin components', () => {
  it('renders summary cards from backend payload', () => {
    render(
      <SummaryCards
        isLoading={false}
        summary={{
          page_count: 120,
          chunk_count: 450,
          chunks_by_source_type: { html: 400, pricing: 50 },
          last_crawl: {
            id: '1',
            started_at: '2026-07-24T10:00:00Z',
            finished_at: '2026-07-24T10:05:00Z',
            status: 'completed',
            pages_discovered: 130,
            pages_updated: 12,
            pages_failed: 1,
            pages_removed: 0,
          },
          last_pricing_sync: {
            id: '2',
            run_type: 'pricing',
            started_at: '2026-07-24T11:00:00Z',
            finished_at: '2026-07-24T11:01:00Z',
            status: 'completed',
            pages_discovered: 0,
            pages_updated: 3,
            pages_failed: 0,
            pages_removed: 0,
          },
          failed_page_count: 1,
          avg_confidence: 0.82,
          avg_latency_ms: 940,
          total_questions: 15,
          answered_questions: 12,
          unanswered_questions: 3,
          helpful_count: 5,
          not_helpful_count: 1,
          feedback_rate: 0.4,
          active_sync_job: null,
        }}
      />,
    )

    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('450')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
    expect(screen.getByText('940 ms')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/1 not helpful/i)).toBeInTheDocument()
  })

  it('renders feedback panel', () => {
    render(
      <FeedbackPanel
        isLoading={false}
        feedback={{
          helpful_count: 2,
          not_helpful_count: 1,
          feedback_rate: 0.5,
          recent: [
            {
              id: '11111111-1111-1111-1111-111111111111',
              question: 'Tuition in Wrocław?',
              answer: 'EU annual tuition is 2600 EUR.',
              helpful: true,
              created_at: '2026-07-24T12:00:00Z',
              feedback_at: '2026-07-24T12:01:00Z',
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('Answer feedback')).toBeInTheDocument()
    expect(screen.getByText('Tuition in Wrocław?')).toBeInTheDocument()
    expect(screen.getAllByText('Helpful').length).toBeGreaterThan(0)
  })

  it('renders failed pages table', () => {
    render(
      <FailedPagesTable
        isLoading={false}
        pages={[
          {
            url: 'https://akademiata.pl/broken',
            http_status: 404,
            error_message: 'Not found',
          },
        ]}
      />,
    )

    expect(
      screen.getByRole('link', { name: 'https://akademiata.pl/broken' }),
    ).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Not found')).toBeInTheDocument()
  })

  it('renders top and unanswered questions', () => {
    render(
      <QuestionsPanel
        isLoading={false}
        questions={{
          top_questions: [{ question: 'Tuition?', count: 4 }],
          unanswered: [
            {
              question: 'Moon observatory?',
              created_at: '2026-07-24T12:00:00Z',
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('Tuition?')).toBeInTheDocument()
    expect(screen.getByText('4 asks')).toBeInTheDocument()
    expect(screen.getByText('Moon observatory?')).toBeInTheDocument()
  })

  it('triggers sync actions', async () => {
    const user = userEvent.setup()
    const onWebsiteSync = vi.fn()
    const onPricingSync = vi.fn()

    render(
      <SyncActions
        onWebsiteSync={onWebsiteSync}
        onPricingSync={onPricingSync}
        isWebsitePending={false}
        isPricingPending={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sync website' }))
    await user.click(screen.getByRole('button', { name: 'Sync prices' }))

    expect(onWebsiteSync).toHaveBeenCalledOnce()
    expect(onPricingSync).toHaveBeenCalledOnce()
  })
})
