import type { ChatSource, ChatLocale } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type CitationListProps = {
  sources: ChatSource[]
  locale: ChatLocale
}

export function CitationList({ sources, locale }: CitationListProps) {
  const copy = getChatCopy(locale)

  if (sources.length === 0) {
    return null
  }

  return (
    <div className="citations">
      <h3>{copy.sourcesHeading}</h3>
      <ul>
        {sources.map((source) => (
          <li key={`${source.url}-${source.title}`}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title}
            </a>
            {source.section && (
              <span className="citations__section">{source.section}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
