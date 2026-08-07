import type { AdminFeedbackResponse } from '../../api/types'
import './admin.css'

type FeedbackPanelProps = {
  feedback: AdminFeedbackResponse | undefined
  isLoading: boolean
  errorMessage?: string
}

function excerpt(value: string | null | undefined, max = 140): string {
  if (!value) return '—'
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

function formatRate(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return `${Math.round(value * 100)}%`
}

export function FeedbackPanel({
  feedback,
  isLoading,
  errorMessage,
}: FeedbackPanelProps) {
  if (errorMessage) {
    return (
      <div className="admin-notice admin-notice--error" role="alert">
        {errorMessage}
      </div>
    )
  }

  if (isLoading) {
    return <div className="admin-loading">Loading feedback…</div>
  }

  if (!feedback) {
    return null
  }

  return (
    <section className="admin-section" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading">Answer feedback</h2>
      <div className="admin-cards admin-cards--compact">
        <article className="admin-card">
          <h3>Helpful</h3>
          <p className="admin-card__value">{feedback.helpful_count}</p>
        </article>
        <article className="admin-card">
          <h3>Not helpful</h3>
          <p className="admin-card__value">{feedback.not_helpful_count}</p>
        </article>
        <article className="admin-card">
          <h3>Response rate</h3>
          <p className="admin-card__value">
            {formatRate(feedback.feedback_rate)}
          </p>
        </article>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <caption className="admin-table__caption">Recent ratings</caption>
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Answer</th>
              <th scope="col">Rating</th>
              <th scope="col">Rated at</th>
            </tr>
          </thead>
          <tbody>
            {feedback.recent.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-empty">
                  No feedback yet.
                </td>
              </tr>
            ) : (
              feedback.recent.map((item) => (
                <tr key={item.id}>
                  <td>{excerpt(item.question, 90)}</td>
                  <td>{excerpt(item.answer)}</td>
                  <td>
                    <span
                      className={`admin-pill admin-pill--${
                        item.helpful ? 'good' : 'bad'
                      }`}
                    >
                      {item.helpful ? 'Helpful' : 'Not helpful'}
                    </span>
                  </td>
                  <td>
                    {item.feedback_at
                      ? new Date(item.feedback_at).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
