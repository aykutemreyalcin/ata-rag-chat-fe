import { hasAdminCredentials } from '../config/adminAuth'
import {
  getAdminErrorMessage,
  useAdminQuestions,
  useAdminSummary,
  useAdminSyncActions,
  useFailedPages,
} from '../hooks/useAdminDashboard'
import { FailedPagesTable } from '../components/admin/FailedPagesTable'
import { QuestionsPanel } from '../components/admin/QuestionsPanel'
import { SummaryCards } from '../components/admin/SummaryCards'
import { SyncActions } from '../components/admin/SyncActions'
import '../components/admin/admin.css'
import './AdminPage.css'

export function AdminPage() {
  const credentialsConfigured = hasAdminCredentials()
  const summaryQuery = useAdminSummary()
  const failedPagesQuery = useFailedPages()
  const questionsQuery = useAdminQuestions()
  const { websiteSync, pricingSync, syncError, syncMessage } =
    useAdminSyncActions()

  const summaryError = summaryQuery.error
    ? getAdminErrorMessage(summaryQuery.error)
    : undefined
  const failedPagesError = failedPagesQuery.error
    ? getAdminErrorMessage(failedPagesQuery.error)
    : undefined
  const questionsError = questionsQuery.error
    ? getAdminErrorMessage(questionsQuery.error)
    : undefined

  return (
    <section className="panel" aria-labelledby="admin-heading">
      <h1 id="admin-heading">Admin dashboard</h1>
      <p className="admin-panel__lead">
        Crawl status, failed pages, pricing ingest, and unanswered questions
        from the RAG backend.
      </p>

      {!credentialsConfigured && (
        <div className="admin-notice admin-notice--info" role="status">
          Set <code>VITE_ADMIN_USER</code> and <code>VITE_ADMIN_PASSWORD</code>{' '}
          in your <code>.env</code> to load admin data and trigger sync jobs.
        </div>
      )}

      {summaryError && (
        <div className="admin-notice admin-notice--error" role="alert">
          {summaryError}
        </div>
      )}

      {syncError && (
        <div className="admin-notice admin-notice--error" role="alert">
          {syncError}
        </div>
      )}

      {syncMessage && (
        <div className="admin-notice admin-notice--success" role="status">
          {syncMessage}
        </div>
      )}

      <SyncActions
        disabled={!credentialsConfigured}
        onWebsiteSync={() => websiteSync.mutate()}
        onPricingSync={() => pricingSync.mutate()}
        isWebsitePending={websiteSync.isPending}
        isPricingPending={pricingSync.isPending}
      />

      <SummaryCards
        summary={summaryQuery.data}
        isLoading={credentialsConfigured && summaryQuery.isLoading}
      />

      <section className="admin-section" aria-labelledby="failed-pages-heading">
        <h2 id="failed-pages-heading">Failed pages</h2>
        <FailedPagesTable
          pages={failedPagesQuery.data}
          isLoading={credentialsConfigured && failedPagesQuery.isLoading}
          errorMessage={failedPagesError}
        />
      </section>

      <QuestionsPanel
        questions={questionsQuery.data}
        isLoading={credentialsConfigured && questionsQuery.isLoading}
        errorMessage={questionsError}
      />
    </section>
  )
}
