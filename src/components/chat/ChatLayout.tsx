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
  return (
    <div className="chat-layout">
      <div className="chat-toolbar">
        <LocaleToggle locale={locale} onChange={onLocaleChange} />
      </div>

      <header className="chat-hero">
        <h1 id="chat-heading">{heading}</h1>
        <p className="panel__lead">{lead}</p>
      </header>

      <MessageList
        messages={messages}
        locale={locale}
        onFeedback={onFeedback}
      />
      <ChatLoadingStatus locale={locale} visible={isStreaming} />
      <ChatInput
        locale={locale}
        isStreaming={isStreaming}
        onSubmit={onSubmit}
        onStop={onStop}
      />
      <SuggestedQuestions
        locale={locale}
        disabled={isStreaming}
        onSelect={onSubmit}
      />
    </div>
  )
}
