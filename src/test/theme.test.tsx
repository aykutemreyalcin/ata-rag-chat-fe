import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { ThemeToggle } from '../components/ThemeToggle'
import { applyTheme, getStoredTheme } from '../hooks/useTheme'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    applyTheme('light')
  })

  it('toggles between light and dark mode', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(getStoredTheme()).toBe('light')

    await user.click(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    )

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(getStoredTheme()).toBe('dark')
    expect(
      screen.getByRole('button', { name: 'Switch to light mode' }),
    ).toBeInTheDocument()
  })
})
