import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminFeedback,
  fetchAdminQuestions,
  fetchAdminSummary,
  fetchFailedPages,
  getAdminErrorMessage,
  triggerPricingSync,
  triggerWebsiteSync,
} from '../api/adminClient'
import { hasAdminCredentials } from '../config/adminAuth'
import { adminQueryKeys } from './adminQueryKeys'

const QUESTIONS_LIMIT = 10
const FEEDBACK_LIMIT = 20

export function useAdminSummary() {
  return useQuery({
    queryKey: adminQueryKeys.summary,
    queryFn: fetchAdminSummary,
    enabled: hasAdminCredentials(),
  })
}

export function useFailedPages() {
  return useQuery({
    queryKey: adminQueryKeys.failedPages,
    queryFn: fetchFailedPages,
    enabled: hasAdminCredentials(),
  })
}

export function useAdminQuestions() {
  return useQuery({
    queryKey: adminQueryKeys.questions(QUESTIONS_LIMIT),
    queryFn: () => fetchAdminQuestions(QUESTIONS_LIMIT),
    enabled: hasAdminCredentials(),
  })
}

export function useAdminFeedback() {
  return useQuery({
    queryKey: adminQueryKeys.feedback(FEEDBACK_LIMIT),
    queryFn: () => fetchAdminFeedback(FEEDBACK_LIMIT),
    enabled: hasAdminCredentials(),
  })
}

export function useAdminSyncActions() {
  const queryClient = useQueryClient()

  const invalidateSummary = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.summary }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] }),
    ])
  }

  const websiteSync = useMutation({
    mutationFn: triggerWebsiteSync,
    onSuccess: invalidateSummary,
  })

  const pricingSync = useMutation({
    mutationFn: triggerPricingSync,
    onSuccess: invalidateSummary,
  })

  return {
    websiteSync,
    pricingSync,
    syncError:
      websiteSync.error || pricingSync.error
        ? getAdminErrorMessage(websiteSync.error ?? pricingSync.error)
        : null,
    syncMessage:
      websiteSync.data || pricingSync.data
        ? `Accepted ${(websiteSync.data ?? pricingSync.data)?.job} sync at ${formatTimestamp((websiteSync.data ?? pricingSync.data)?.submitted_at)}`
        : null,
  }
}

function formatTimestamp(value?: string): string {
  if (!value) return 'now'
  return new Date(value).toLocaleString()
}

export { getAdminErrorMessage }
