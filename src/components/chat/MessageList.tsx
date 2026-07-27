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
    return <span className="chat-empty-sr" role="status">Ask AkademiaTA</span>
  }

  return (
    <div
      className="message-list"
      aria-live="polite"
      aria-label="Chat messages"
    >
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
