import './ChatPage.css'

const SUGGESTED = [
  'What is the tuition for Computer Science?',
  'How do I apply?',
  'What documents are required?',
  'Where is the Dean’s Office?',
]

export function ChatPage() {
  return (
    <section className="panel" aria-labelledby="chat-heading">
      <h1 id="chat-heading">Chat</h1>
      <p className="panel__lead">
        Ask questions about admissions, programmes, and tuition. Answers will
        cite akademiata.pl sources once the RAG API is ready.
      </p>

      <div className="notice" role="status">
        <strong>Not implemented yet.</strong> Streaming chat, citations, and
        confidence badges land in branch <code>fe/chat-experience</code>. The
        backend endpoint currently returns HTTP 501.
      </div>

      <div className="chat-placeholder">
        <label htmlFor="question">Your question</label>
        <textarea
          id="question"
          rows={3}
          disabled
          placeholder="What is the tuition for Computer Science?"
        />
        <button type="button" disabled>
          Send
        </button>
      </div>

      <div>
        <h2>Suggested questions</h2>
        <ul className="suggestions">
          {SUGGESTED.map((item) => (
            <li key={item}>
              <button type="button" disabled>
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
