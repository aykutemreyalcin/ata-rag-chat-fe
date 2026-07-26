import type { FailedPage } from '../../api/types'
import './admin.css'

type FailedPagesTableProps = {
  pages: FailedPage[] | undefined
  isLoading: boolean
  errorMessage?: string
}

export function FailedPagesTable({
  pages,
  isLoading,
  errorMessage,
}: FailedPagesTableProps) {
  if (isLoading) {
    return <div className="admin-loading">Loading failed pages…</div>
  }

  if (errorMessage) {
    return (
      <div className="admin-notice admin-notice--error" role="alert">
        {errorMessage}
      </div>
    )
  }

  if (!pages || pages.length === 0) {
    return <p className="admin-empty">No failed pages reported.</p>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <caption className="admin-table__caption">
          Pages that failed during the latest crawl
        </caption>
        <thead>
          <tr>
            <th scope="col">URL</th>
            <th scope="col">HTTP</th>
            <th scope="col">Error</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.url}>
              <td>
                <a href={page.url} target="_blank" rel="noopener noreferrer">
                  {page.url}
                </a>
              </td>
              <td>{page.http_status || '—'}</td>
              <td>{page.error_message || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
