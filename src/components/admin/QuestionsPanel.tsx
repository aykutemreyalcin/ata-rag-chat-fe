import type { AdminQuestionsResponse } from '../../api/types'
import './admin.css'

type QuestionsPanelProps = {
  questions: AdminQuestionsResponse | undefined
  isLoading: boolean
  errorMessage?: string
}

export function QuestionsPanel({
  questions,
  isLoading,
  errorMessage,
}: QuestionsPanelProps) {
  if (isLoading) {
    return <div className="admin-loading">Loading questions…</div>
  }

  if (errorMessage) {
    return (
      <div className="admin-notice admin-notice--error" role="alert">
        {errorMessage}
      </div>
    )
  }

  if (!questions) {
    return null
  }

  return (
    <div className="admin-grid">
      <section className="admin-section" aria-labelledby="top-questions-heading">
        <h2 id="top-questions-heading">Top questions</h2>
        {questions.top_questions.length === 0 ? (
          <p className="admin-empty">No questions logged yet.</p>
        ) : (
          <ul className="admin-list">
            {questions.top_questions.map((item) => (
              <li key={item.question}>
                {item.question}
                <span className="admin-list__meta">{item.count} asks</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="admin-section"
        aria-labelledby="unanswered-questions-heading"
      >
        <h2 id="unanswered-questions-heading">Unanswered questions</h2>
        {questions.unanswered.length === 0 ? (
          <p className="admin-empty">No unanswered questions.</p>
        ) : (
          <ul className="admin-list">
            {questions.unanswered.map((item) => (
              <li key={`${item.question}-${item.created_at}`}>
                {item.question}
                <span className="admin-list__meta">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
