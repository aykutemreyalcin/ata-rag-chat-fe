import type { ChatLocale } from '../../api/types'
import { getChatCopy } from '../../i18n/chatLocale'
import './chat.css'

type ChatLoadingStatusProps = {
  locale: ChatLocale
  visible: boolean
}

export function ChatLoadingStatus({ locale, visible }: ChatLoadingStatusProps) {
  const copy = getChatCopy(locale)

  if (!visible) {
    return null
  }

  return (
    <div className="chat-loading" role="status">
      <span className="chat-loading__spinner" aria-hidden />
      {copy.streaming}
    </div>
  )
}
