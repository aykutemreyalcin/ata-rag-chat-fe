import type { ChatLocale, ChatMessage } from '../../api/types'
import { MessageBubble } from './MessageBubble'
import './chat.css'

type MessageListProps = {
  messages: ChatMessage[]
  locale: ChatLocale
  onFeedback?: (messageId: string, helpful: boolean) => void
}

export function MessageList({
  messages,
  locale,
  onFeedback,
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="chat-empty" role="status">
        <div className="chat-empty__badge">ATA</div>
        <h2>Ask AkademiaTA</h2>
        <p>
          Tuition, admissions, programmes, and campus details — answered with
          citations from akademiata.pl.
        </p>
      </div>
    )
  }

  return (
    <div className="message-list" aria-live="polite" aria-label="Chat messages">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          locale={locale}
          onFeedback={onFeedback}
        />
      ))}
    </div>
  )
}
