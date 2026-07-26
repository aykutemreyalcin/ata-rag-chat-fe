import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { ChatLocale } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type ChatInputProps = {
  locale: ChatLocale
  isStreaming: boolean
  onSubmit: (question: string) => void
  onStop: () => void
  initialValue?: string
}

export function ChatInput({
  locale,
  isStreaming,
  onSubmit,
  onStop,
  initialValue = '',
}: ChatInputProps) {
  const copy = getChatCopy(locale)
  const [value, setValue] = useState(initialValue)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSubmit(trimmed)
    setValue('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      const trimmed = value.trim()
      if (!trimmed || isStreaming) return
      onSubmit(trimmed)
      setValue('')
    }
  }

  return (
    <form
      className="chat-input"
      onSubmit={handleSubmit}
      aria-busy={isStreaming}
    >
      <label htmlFor="question">{copy.questionLabel}</label>
      <textarea
        id="question"
        rows={3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={copy.questionPlaceholder}
        disabled={isStreaming}
        aria-describedby="question-hint"
      />
      <p id="question-hint" className="chat-input__hint">
        {copy.questionHint}
      </p>
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
