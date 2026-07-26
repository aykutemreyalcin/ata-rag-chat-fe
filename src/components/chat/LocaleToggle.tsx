import type { ChatLocale } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type LocaleToggleProps = {
  locale: ChatLocale
  onChange: (locale: ChatLocale) => void
}

export function LocaleToggle({ locale, onChange }: LocaleToggleProps) {
  const copy = getChatCopy(locale)

  return (
    <div className="locale-toggle" role="group" aria-label={copy.localeLabel}>
      <button
        type="button"
        className={locale === 'en' ? 'active' : undefined}
        aria-pressed={locale === 'en'}
        onClick={() => onChange('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === 'pl' ? 'active' : undefined}
        aria-pressed={locale === 'pl'}
        onClick={() => onChange('pl')}
      >
        PL
      </button>
    </div>
  )
}
