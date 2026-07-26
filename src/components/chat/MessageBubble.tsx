import type { ChatLocale, ChatMessage } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type MessageBubbleProps = {
  message: ChatMessage
  locale: ChatLocale
}

export function MessageBubble({ message, locale }: MessageBubbleProps) {
  const copy = getChatCopy(locale)
  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'
  const hasContent = message.content.trim().length > 0

  return (
    <article
      className={`message message--${message.role}${
        message.status === 'error' ? ' message--error' : ''
      }`}
      aria-live={isStreaming ? 'polite' : undefined}
    >
      <header className="message__meta">
        <span className="message__role">
          {isUser ? copy.roleUser : copy.roleAssistant}
        </span>
      </header>

      <div className="message__body">
        {message.status === 'error' ? (
          <p className="message__error">
            <strong>{copy.errorPrefix}:</strong> {message.error}
          </p>
        ) : hasContent ? (
          <p>{message.content}</p>
        ) : isStreaming ? (
          <p className="message__placeholder">{copy.emptyAssistant}</p>
        ) : null}

        {isStreaming && hasContent && (
          <span className="message__cursor" aria-hidden>
            ▍
          </span>
        )}
      </div>
    </article>
  )
}
