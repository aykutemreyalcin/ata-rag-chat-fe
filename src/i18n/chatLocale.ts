import type { ChatLocale } from '../api/types'

type ChatCopy = {
  heading: string
  lead: string
  questionLabel: string
  questionPlaceholder: string
  send: string
  sending: string
  stop: string
  suggestedHeading: string
  sourcesHeading: string
  lowConfidenceTitle: string
  lowConfidenceBody: string
  unknownConfidenceTitle: string
  unknownConfidenceBody: string
  streaming: string
  errorPrefix: string
  emptyAssistant: string
  localeLabel: string
  confidenceLabels: Record<'high' | 'medium' | 'low' | 'unknown', string>
  suggestions: string[]
}

export const CHAT_COPY: Record<ChatLocale, ChatCopy> = {
  en: {
    heading: 'Chat',
    lead: 'Ask questions about admissions, programmes, and tuition. Answers cite akademiata.pl sources.',
    questionLabel: 'Your question',
    questionPlaceholder: 'What is the tuition for Computer Science?',
    send: 'Send',
    sending: 'Sending…',
    stop: 'Stop',
    suggestedHeading: 'Suggested questions',
    sourcesHeading: 'Sources',
    lowConfidenceTitle: 'Low confidence answer',
    lowConfidenceBody:
      'This answer may be incomplete. Check the sources or rephrase your question.',
    unknownConfidenceTitle: 'Unable to verify',
    unknownConfidenceBody:
      'We could not find enough reliable information. Try a more specific question.',
    streaming: 'Assistant is typing…',
    errorPrefix: 'Something went wrong',
    emptyAssistant: 'Waiting for a response…',
    localeLabel: 'Language',
    confidenceLabels: {
      high: 'High confidence',
      medium: 'Medium confidence',
      low: 'Low confidence',
      unknown: 'Unknown confidence',
    },
    suggestions: [
      'What is the tuition for Computer Science?',
      'How do I apply?',
      'What documents are required?',
      'Where is the Dean’s Office?',
    ],
  },
  pl: {
    heading: 'Czat',
    lead: 'Zadawaj pytania o rekrutację, kierunki i czesne. Odpowiedzi zawierają źródła z akademiata.pl.',
    questionLabel: 'Twoje pytanie',
    questionPlaceholder: 'Ile wynosi czesne na Informatyce?',
    send: 'Wyślij',
    sending: 'Wysyłanie…',
    stop: 'Zatrzymaj',
    suggestedHeading: 'Proponowane pytania',
    sourcesHeading: 'Źródła',
    lowConfidenceTitle: 'Niska pewność odpowiedzi',
    lowConfidenceBody:
      'Ta odpowiedź może być niepełna. Sprawdź źródła lub przeformułuj pytanie.',
    unknownConfidenceTitle: 'Nie udało się zweryfikować',
    unknownConfidenceBody:
      'Nie znaleźliśmy wystarczająco wiarygodnych informacji. Spróbuj zadać bardziej szczegółowe pytanie.',
    streaming: 'Asystent pisze…',
    errorPrefix: 'Coś poszło nie tak',
    emptyAssistant: 'Oczekiwanie na odpowiedź…',
    localeLabel: 'Język',
    confidenceLabels: {
      high: 'Wysoka pewność',
      medium: 'Średnia pewność',
      low: 'Niska pewność',
      unknown: 'Nieznana pewność',
    },
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
