import { useState, type FormEvent } from 'react'
import type { ChatLocale } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type ChatInputProps = {
  locale: ChatLocale
  isStreaming: boolean
  onSubmit: (question: string) => void
  onStop: () => void
}

export function ChatInput({
  locale,
  isStreaming,
  onSubmit,
  onStop,
}: ChatInputProps) {
  const copy = getChatCopy(locale)
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <label htmlFor="question">{copy.questionLabel}</label>
      <textarea
        id="question"
        rows={3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={copy.questionPlaceholder}
        disabled={isStreaming}
      />
      <div className="chat-input__actions">
        {isStreaming ? (
          <button type="button" className="secondary" onClick={onStop}>
            {copy.stop}
          </button>
        ) : (
          <button type="submit" disabled={!value.trim()}>
            {copy.send}
          </button>
        )}
      </div>
    </form>
  )
}
