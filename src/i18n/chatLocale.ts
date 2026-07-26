import type { ChatLocale } from '../api/types'

type ChatCopy = {
  heading: string
  lead: string
  questionLabel: string
  questionPlaceholder: string
  send: string
  stop: string
  suggestedHeading: string
  streaming: string
  errorPrefix: string
  emptyAssistant: string
  localeLabel: string
  roleUser: string
  roleAssistant: string
  suggestions: string[]
}

export const CHAT_COPY: Record<ChatLocale, ChatCopy> = {
  en: {
    heading: 'Chat',
    lead: 'Ask questions about admissions, programmes, and tuition. Answers cite akademiata.pl sources.',
    questionLabel: 'Your question',
    questionPlaceholder: 'What is the tuition for Computer Science?',
    send: 'Send',
    stop: 'Stop',
    suggestedHeading: 'Suggested questions',
    streaming: 'Assistant is typing…',
    errorPrefix: 'Something went wrong',
    emptyAssistant: 'Waiting for a response…',
    localeLabel: 'Language',
    roleUser: 'You',
    roleAssistant: 'Assistant',
    suggestions: [
      'What is the tuition for Computer Science?',
      'How do I apply?',
      'What documents are required?',
      "Where is the Dean's Office?",
    ],
  },
  pl: {
    heading: 'Czat',
    lead: 'Zadawaj pytania o rekrutację, kierunki i czesne. Odpowiedzi zawierają źródła z akademiata.pl.',
    questionLabel: 'Twoje pytanie',
    questionPlaceholder: 'Ile wynosi czesne na Informatyce?',
    send: 'Wyślij',
    stop: 'Zatrzymaj',
    suggestedHeading: 'Proponowane pytania',
    streaming: 'Asystent pisze…',
    errorPrefix: 'Coś poszło nie tak',
    emptyAssistant: 'Oczekiwanie na odpowiedź…',
    localeLabel: 'Język',
    roleUser: 'Ty',
    roleAssistant: 'Asystent',
    suggestions: [
      'Ile wynosi czesne na Informatyce?',
      'Jak się zapisać?',
      'Jakie dokumenty są wymagane?',
      'Gdzie znajduje się dziekanat?',
    ],
  },
}

export function getChatCopy(locale: ChatLocale): ChatCopy {
  return CHAT_COPY[locale]
}
