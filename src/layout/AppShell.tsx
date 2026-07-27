import { NavLink, Outlet } from 'react-router-dom'
import { BackendStatus } from '../components/BackendStatus'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="shell__header">
        <div className="shell__brand">
          <span className="shell__logo">
            <img
              src="/logo-akademiata.png"
              alt="Akademia Techniczno-Artystyczna"
              width={271}
              height={56}
            />
          </span>
          <div>
            <p className="shell__title">AkademiaTA Assistant</p>
            <p className="shell__subtitle">
              Grounded answers from akademiata.pl
            </p>
          </div>
        </div>
        <nav className="shell__nav" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Chat
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Admin
          </NavLink>
        </nav>
        <BackendStatus />
      </header>
      <main id="main-content" className="shell__main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
