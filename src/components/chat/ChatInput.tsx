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
      <label className="chat-input__label" htmlFor="question">
        {copy.questionLabel}
      </label>
      <div className="chat-input__shell">
        <span className="chat-input__spark" aria-hidden>
          ✦
        </span>
        <textarea
          id="question"
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={copy.questionPlaceholder}
          disabled={isStreaming}
          aria-describedby="question-hint"
        />
        <div className="chat-input__actions">
          {isStreaming ? (
            <button
              type="button"
              className="chat-input__stop"
              onClick={onStop}
              aria-label={copy.stop}
            >
              <span aria-hidden>■</span>
              {copy.stop}
            </button>
          ) : (
            <button
              type="submit"
              className="chat-input__send"
              disabled={!value.trim()}
              aria-label={copy.send}
            >
              <span>{copy.send}</span>
              <svg aria-hidden viewBox="0 0 24 24">
                <path d="m4 4 17 8-17 8 3.2-8L4 4Zm3.7 7h7.8L7 7l.7 4Zm-.7 6 8.5-4H7.7L7 17Z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <p id="question-hint" className="chat-input__hint">
        <span>{copy.questionHint}</span>
        <span className="chat-input__shortcut" aria-hidden>
          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
        </span>
      </p>
    </form>
  )
}
