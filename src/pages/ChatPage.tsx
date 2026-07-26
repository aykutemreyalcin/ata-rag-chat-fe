import { useState } from 'react'
import type { ChatLocale } from '../api/types'
import { ChatInput } from '../components/chat/ChatInput'
import { LocaleToggle } from '../components/chat/LocaleToggle'
import { MessageList } from '../components/chat/MessageList'
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions'
import { useChat } from '../hooks/useChat'
import { getChatCopy } from '../i18n/chatLocale'
import './ChatPage.css'

export function ChatPage() {
  const [locale, setLocale] = useState<ChatLocale>('en')
  const copy = getChatCopy(locale)
  const { messages, isStreaming, submitQuestion, stopStreaming } = useChat()

  return (
    <section className="panel" aria-labelledby="chat-heading">
      <div className="panel__header">
        <div>
          <h1 id="chat-heading">{copy.heading}</h1>
          <p className="panel__lead">{copy.lead}</p>
        </div>
        <LocaleToggle locale={locale} onChange={setLocale} />
      </div>

      <MessageList messages={messages} locale={locale} />

      {isStreaming && (
        <div className="chat-status" role="status">
          {copy.streaming}
        </div>
      )}

      <ChatInput
        locale={locale}
        isStreaming={isStreaming}
        onSubmit={submitQuestion}
        onStop={stopStreaming}
      />

      <SuggestedQuestions
        locale={locale}
        disabled={isStreaming}
        onSelect={submitQuestion}
      />
    </section>
  )
}
