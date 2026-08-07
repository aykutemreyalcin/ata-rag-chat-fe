import { NavLink, Outlet } from 'react-router-dom'
import { BackendStatus } from '../components/BackendStatus'
import { ThemeToggle } from '../components/ThemeToggle'
import './AppShell.css'

const ATA_HOME = 'https://akademiata.pl/'

export function AppShell() {
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="shell__header">
        <div className="shell__brand">
          <span className="shell__logo" aria-hidden>
            ATA
          </span>
          <div>
            <p className="shell__title">Akademia Techniczno-Artystyczna</p>
            <p className="shell__subtitle">
              RAG assistant · answers from{' '}
              <a href={ATA_HOME} target="_blank" rel="noopener noreferrer">
                akademiata.pl
              </a>
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
        <div className="shell__actions">
          <ThemeToggle compact />
          <BackendStatus />
        </div>
      </header>
      <main id="main-content" className="shell__main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="shell__footer">
        Powered by content from{' '}
        <a href={ATA_HOME} target="_blank" rel="noopener noreferrer">
          Akademia Techniczno-Artystyczna
        </a>
        . Studia w Warszawie, Wrocławiu i online.
      </footer>
    </div>
  )
}
