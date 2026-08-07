import type { ChatLocale } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type SuggestedQuestionsProps = {
  locale: ChatLocale
  disabled: boolean
  onSelect: (question: string) => void
}

export function SuggestedQuestions({
  locale,
  disabled,
  onSelect,
}: SuggestedQuestionsProps) {
  const copy = getChatCopy(locale)

  return (
    <section
      className="suggestions-section"
      aria-labelledby="suggested-heading"
    >
      <h2 id="suggested-heading">{copy.suggestedHeading}</h2>
      <ul className="suggestions">
        {copy.suggestions.map((item) => (
          <li key={item}>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Ask: ${item}`}
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
