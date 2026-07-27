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
  const cards = copy.suggestions.map((question, index) => ({
    question,
    icon: ['€', '↗', '▤', '⌖'][index] ?? '✦',
    label:
      locale === 'pl'
        ? ['Czesne', 'Rekrutacja', 'Dokumenty', 'Kampus'][index]
        : ['Tuition', 'Admissions', 'Documents', 'Campus'][index],
  }))

  return (
    <section className="suggestions-section" aria-labelledby="suggested-heading">
      <div className="suggestions-section__heading">
        <h2 id="suggested-heading">{copy.suggestedHeading}</h2>
        <span>{locale === 'pl' ? 'Kliknij, aby zapytać' : 'Click to ask'}</span>
      </div>
      <ul className="suggestions">
        {cards.map((card) => (
          <li key={card.question}>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Ask: ${card.question}`}
              onClick={() => onSelect(card.question)}
            >
              <span className="suggestions__icon" aria-hidden>
                {card.icon}
              </span>
              <span className="suggestions__content">
                <strong>{card.label}</strong>
                <span>{card.question}</span>
              </span>
              <span className="suggestions__arrow" aria-hidden>
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
