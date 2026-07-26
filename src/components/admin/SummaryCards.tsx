import type { AdminSummary } from '../../api/types'
import './admin.css'

type SummaryCardsProps = {
  summary: AdminSummary | undefined
  isLoading: boolean
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—'
  }
  return value.toLocaleString()
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—'
  }
  return `${Math.round(value * 100)}%`
}

function formatRunStatus(run: AdminSummary['last_crawl']): string {
  if (!run) return 'No runs yet'
  const finished = run.finished_at
    ? new Date(run.finished_at).toLocaleString()
    : 'in progress'
  return `${run.status} · ${finished}`
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return <div className="admin-loading">Loading summary…</div>
  }

  if (!summary) {
    return null
  }

  const pricingStatus = summary.last_pricing_sync
    ? `${summary.last_pricing_sync.status} · ${
        summary.last_pricing_sync.finished_at
          ? new Date(summary.last_pricing_sync.finished_at).toLocaleString()
          : 'in progress'
      }`
    : 'No pricing sync yet'

  return (
    <div className="admin-cards">
      <article className="admin-card">
        <h2>Pages</h2>
        <p className="admin-card__value">{formatNumber(summary.page_count)}</p>
      </article>
      <article className="admin-card">
        <h2>Chunks</h2>
        <p className="admin-card__value">{formatNumber(summary.chunk_count)}</p>
        {summary.chunks_by_source_type && (
          <p className="admin-card__meta">
            {Object.entries(summary.chunks_by_source_type)
              .map(([type, count]) => `${type}: ${count}`)
              .join(' · ') || 'No chunk breakdown'}
          </p>
        )}
      </article>
      <article className="admin-card">
        <h2>Last crawl</h2>
        <p className="admin-card__value">
          {summary.last_crawl?.pages_updated ?? '—'}
        </p>
        <p className="admin-card__meta">{formatRunStatus(summary.last_crawl)}</p>
      </article>
      <article className="admin-card">
        <h2>Failed pages</h2>
        <p className="admin-card__value">
          {formatNumber(summary.failed_page_count)}
        </p>
      </article>
      <article className="admin-card">
        <h2>Avg confidence</h2>
        <p className="admin-card__value">
          {formatPercent(summary.avg_confidence)}
        </p>
      </article>
      <article className="admin-card">
        <h2>Avg latency</h2>
        <p className="admin-card__value">
          {summary.avg_latency_ms != null
            ? `${Math.round(summary.avg_latency_ms)} ms`
            : '—'}
        </p>
      </article>
      <article className="admin-card">
        <h2>Questions</h2>
        <p className="admin-card__value">
          {formatNumber(summary.total_questions)}
        </p>
        <p className="admin-card__meta">
          {formatNumber(summary.answered_questions)} answered ·{' '}
          {formatNumber(summary.unanswered_questions)} unanswered
        </p>
      </article>
      <article className="admin-card">
        <h2>Pricing ingest</h2>
        <p className="admin-card__value">
          {summary.last_pricing_sync?.status ?? '—'}
        </p>
        <p className="admin-card__meta">{pricingStatus}</p>
      </article>
      {summary.active_sync_job && (
        <article className="admin-card">
          <h2>Active sync</h2>
          <p className="admin-card__value">{summary.active_sync_job}</p>
        </article>
      )}
    </div>
  )
}
