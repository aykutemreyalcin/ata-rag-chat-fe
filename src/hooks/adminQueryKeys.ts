export const adminQueryKeys = {
  summary: ['admin', 'summary'] as const,
  failedPages: ['admin', 'failed-pages'] as const,
  questions: (limit: number) => ['admin', 'questions', limit] as const,
  feedback: (limit: number) => ['admin', 'feedback', limit] as const,
}
