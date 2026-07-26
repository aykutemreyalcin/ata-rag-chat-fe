import type { ChatLocale, ChatMessage } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import { CitationList } from './CitationList'
import { ConfidenceBadge } from './ConfidenceBadge'
import './chat.css'

type MessageBubbleProps = {
  message: ChatMessage
  locale: ChatLocale
}

function ConfidenceNotice({
  message,
  locale,
}: {
  message: ChatMessage
  locale: ChatLocale
}) {
  const copy = getChatCopy(locale)
  const level = message.confidence?.level

  if (message.confidence?.answered === false || level === 'unknown') {
    return (
      <div
        className="confidence-notice confidence-notice--unknown"
        role="note"
      >
        <strong>{copy.unknownConfidenceTitle}</strong>
        <p>{copy.unknownConfidenceBody}</p>
      </div>
    )
  }

  if (level === 'low') {
    return (
      <div className="confidence-notice confidence-notice--low" role="note">
        <strong>{copy.lowConfidenceTitle}</strong>
        <p>{copy.lowConfidenceBody}</p>
      </div>
    )
  }

  return null
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
        {!isUser && message.confidence && (
          <ConfidenceBadge confidence={message.confidence} locale={locale} />
        )}
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

      {!isUser && message.confidence && (
        <ConfidenceNotice message={message} locale={locale} />
      )}

      {!isUser && message.sources && (
        <CitationList sources={message.sources} locale={locale} />
      )}
    </article>
  )
}
