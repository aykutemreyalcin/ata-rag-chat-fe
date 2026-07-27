import type { ChatLocale, ChatMessage } from '../../api/types'
import { ChatInput } from './ChatInput'
import { ChatLoadingStatus } from './ChatLoadingStatus'
import { LocaleToggle } from './LocaleToggle'
import { MessageList } from './MessageList'
import { SuggestedQuestions } from './SuggestedQuestions'
import './chat.css'

type ChatLayoutProps = {
  locale: ChatLocale
  onLocaleChange: (locale: ChatLocale) => void
  heading: string
  lead: string
  messages: ChatMessage[]
  isStreaming: boolean
  onSubmit: (question: string) => void
  onStop: () => void
  onFeedback?: (messageId: string, helpful: boolean) => void
}

export function ChatLayout({
  locale,
  onLocaleChange,
  heading,
  lead,
  messages,
  isStreaming,
  onSubmit,
  onStop,
  onFeedback,
}: ChatLayoutProps) {
  const hasMessages = messages.length > 0

  return (
    <div className={`chat-layout${hasMessages ? ' chat-layout--active' : ''}`}>
      <div className="chat-topbar">
        <div className="chat-topbar__identity">
          <span className="chat-topbar__avatar" aria-hidden>
            <span>AI</span>
          </span>
          <div>
            <strong>AkademiaTA Assistant</strong>
            <span className="chat-topbar__presence">
              <i aria-hidden />
              {locale === 'pl' ? 'Gotowy do pomocy' : 'Ready to help'}
            </span>
          </div>
        </div>
        <LocaleToggle locale={locale} onChange={onLocaleChange} />
      </div>

      <div className="chat-stage">
        <header className="chat-hero">
          <span className="chat-hero__eyebrow">
            {locale === 'pl'
              ? 'OFICJALNY ASYSTENT AKADEMIATA'
              : 'OFFICIAL AKADEMIATA ASSISTANT'}
          </span>
          <h1 id="chat-heading">
            <span className="chat-heading-sr">{heading}</span>
            <span aria-hidden>
              {hasMessages
                ? locale === 'pl'
                  ? 'Twoja rozmowa'
                  : 'Your conversation'
                : locale === 'pl'
                  ? 'Jak możemy Ci dziś pomóc?'
                  : 'How can we help you today?'}
            </span>
          </h1>
          <p className="panel__lead">{lead}</p>
          {!hasMessages && (
            <div className="chat-hero__trust" aria-label="Assistant features">
              <span>
                <i className="chat-hero__check" aria-hidden>
                  ✓
                </i>
                {locale === 'pl'
                  ? 'Zweryfikowane źródła'
                  : 'Verified sources'}
              </span>
              <span>
                <i className="chat-hero__check" aria-hidden>
                  ✓
                </i>
                {locale === 'pl' ? 'Aktualne czesne' : 'Current tuition'}
              </span>
              <span>
                <i className="chat-hero__check" aria-hidden>
                  ✓
                </i>
                EN / PL
              </span>
            </div>
          )}
        </header>

        <MessageList
          messages={messages}
          locale={locale}
          onFeedback={onFeedback}
        />
        <ChatLoadingStatus locale={locale} visible={isStreaming} />

        <div className="chat-composer-zone">
          <ChatInput
            locale={locale}
            isStreaming={isStreaming}
            onSubmit={onSubmit}
            onStop={onStop}
          />
          <p className="chat-disclaimer">
            {locale === 'pl'
              ? 'Odpowiedzi są generowane na podstawie oficjalnych treści AkademiaTA. Zawsze sprawdź podane źródła.'
              : 'Answers are grounded in official AkademiaTA content. Always review the cited sources.'}
          </p>
        </div>

        {!hasMessages && (
          <SuggestedQuestions
            locale={locale}
            disabled={isStreaming}
            onSelect={onSubmit}
          />
        )}
      </div>
    </div>
  )
}
