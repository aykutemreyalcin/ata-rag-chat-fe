import './AdminPage.css'

export function AdminPage() {
  return (
    <section className="panel" aria-labelledby="admin-heading">
      <h1 id="admin-heading">Admin dashboard</h1>
      <p className="panel__lead">
        Crawl status, failed pages, pricing ingest, and unanswered questions
        will appear here.
      </p>

      <div className="notice" role="status">
        <strong>Scaffold only.</strong> Live metrics and sync actions land in
        branch <code>fe/admin-dashboard</code>. Backend admin routes currently
        return HTTP 501.
      </div>

      <div className="cards">
        <article className="card">
          <h2>Pages</h2>
          <p>—</p>
        </article>
        <article className="card">
          <h2>Chunks</h2>
          <p>—</p>
        </article>
        <article className="card">
          <h2>Last crawl</h2>
          <p>—</p>
        </article>
        <article className="card">
          <h2>Failed pages</h2>
          <p>—</p>
        </article>
      </div>
    </section>
  )
}
