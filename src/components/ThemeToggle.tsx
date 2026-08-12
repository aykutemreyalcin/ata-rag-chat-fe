import { useEffect, useState } from 'react'
import {
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type Theme,
} from '../hooks/useTheme'
import './ThemeToggle.css'

type ThemeToggleProps = {
  compact?: boolean
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? ' theme-toggle--compact' : ''}`}
      onClick={() => setTheme((current) => toggleTheme(current))}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <span className="theme-toggle__icon" aria-hidden>
        {isDark ? '☀' : '☾'}
      </span>
      {!compact && (
        <span className="theme-toggle__label">{isDark ? 'Light' : 'Dark'}</span>
      )}
    </button>
  )
}
