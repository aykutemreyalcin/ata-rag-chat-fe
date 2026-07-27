import { useState } from 'react'
import type { ChatLocale, ChatMessage } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import { CitationList } from './CitationList'
import { ConfidenceBadge } from './ConfidenceBadge'
import './chat.css'

type MessageBubbleProps = {
  message: ChatMessage
  locale: ChatLocale
  onFeedback?: (messageId: string, helpful: boolean) => void
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
      <div className="confidence-notice confidence-notice--unknown" role="note">
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

function MessageActions({
  message,
  locale,
  onFeedback,
}: {
  message: ChatMessage
  locale: ChatLocale
  onFeedback?: (messageId: string, helpful: boolean) => void
}) {
  const copy = getChatCopy(locale)
  const [copied, setCopied] = useState(false)
  const canRate =
    Boolean(message.queryId) &&
    message.status === 'complete' &&
    typeof onFeedback === 'function'
  const pending = message.feedbackStatus === 'pending'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <footer className="message__footer">
      <div className="message__actions">
        <button
          type="button"
          className="message__action"
          onClick={handleCopy}
          disabled={!message.content.trim()}
        >
          {copied ? copy.copied : copy.copy}
        </button>
        {canRate && (
          <>
            <button
              type="button"
              className={`message__action${
                message.helpful === true ? ' message__action--selected' : ''
              }`}
              aria-pressed={message.helpful === true}
              disabled={pending}
              onClick={() => onFeedback?.(message.id, true)}
            >
              {copy.helpful}
            </button>
            <button
              type="button"
              className={`message__action${
                message.helpful === false ? ' message__action--selected' : ''
              }`}
              aria-pressed={message.helpful === false}
              disabled={pending}
              onClick={() => onFeedback?.(message.id, false)}
            >
              {copy.notHelpful}
            </button>
          </>
        )}
      </div>
      {message.feedbackStatus === 'success' && (
        <p className="message__feedback-status" role="status">
          {copy.feedbackThanks}
        </p>
      )}
      {message.feedbackStatus === 'error' && (
        <p className="message__feedback-status message__feedback-status--error" role="alert">
          {message.feedbackError ?? copy.feedbackError}
        </p>
      )}
      {(message.model || message.latencyMs != null) && (
        <p className="message__meta-line">
          {[
            message.model,
            message.latencyMs != null ? `${message.latencyMs} ms` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </footer>
  )
}

export function MessageBubble({
  message,
  locale,
  onFeedback,
}: MessageBubbleProps) {
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

      {!isUser && message.status === 'complete' && (
        <MessageActions
          message={message}
          locale={locale}
          onFeedback={onFeedback}
        />
      )}
    </article>
  )
}
