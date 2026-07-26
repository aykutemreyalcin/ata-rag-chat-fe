import type { ChatLocale, ChatMessage } from '../../api/types'
import { MessageBubble } from './MessageBubble'
import './chat.css'

type MessageListProps = {
  messages: ChatMessage[]
  locale: ChatLocale
}

export function MessageList({ messages, locale }: MessageListProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <div className="message-list" aria-live="polite" aria-label="Chat messages">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} locale={locale} />
      ))}
    </div>
  )
}
