import type { ChatConfidence } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import type { ChatLocale } from '../../api/types'
import './chat.css'

type ConfidenceBadgeProps = {
  confidence: ChatConfidence
  locale: ChatLocale
}

export function ConfidenceBadge({ confidence, locale }: ConfidenceBadgeProps) {
  const copy = getChatCopy(locale)
  const label = copy.confidenceLabels[confidence.level]

  return (
    <span className={`confidence confidence--${confidence.level}`}>
      {label}
      {confidence.score !== null && (
        <span className="confidence__score">
          {Math.round(confidence.score * 100)}%
        </span>
      )}
    </span>
  )
}
