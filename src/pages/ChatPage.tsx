import { useState } from 'react'
import { ChatLayout } from '../components/chat/ChatLayout'
import { useChatSession } from '../hooks/useChatSession'
import { getChatCopy } from '../i18n/chatLocale'
import type { ChatLocale } from '../api/types'
import './ChatPage.css'

export function ChatPage() {
  const [locale, setLocale] = useState<ChatLocale>('en')
  const copy = getChatCopy(locale)
  const {
    messages,
    isStreaming,
    beginTurn,
    stopStreaming,
  } = useChatSession()

  function submitQuestion(question: string) {
    beginTurn(question)
  }

  return (
    <section className="panel" aria-labelledby="chat-heading">
      <ChatLayout
        locale={locale}
        onLocaleChange={setLocale}
        heading={copy.heading}
        lead={copy.lead}
        messages={messages}
        isStreaming={isStreaming}
        onSubmit={submitQuestion}
        onStop={stopStreaming}
      />
    </section>
  )
}
