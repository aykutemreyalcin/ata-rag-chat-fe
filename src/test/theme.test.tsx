import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { ThemeToggle } from '../components/ThemeToggle'
import { applyTheme, getStoredTheme } from '../hooks/useTheme'

const SHARED_ROOT_VARIABLES = [
  '--ata-orange',
  '--ata-orange-dark',
  '--ata-black',
  '--ata-white',
  '--ata-accent',
  '--ata-accent-contrast',
  '--ata-focus',
] as const

const THEME_SEMANTIC_VARIABLES = [
  '--ata-orange-light',
  '--ata-orange-muted',
  '--ata-text',
  '--ata-heading',
  '--ata-muted',
  '--ata-bg',
  '--ata-surface',
  '--ata-border',
  '--ata-border-strong',
  '--ata-header-bg',
  '--ata-header-text',
  '--ata-header-border',
  '--ata-nav-text',
  '--ata-nav-active-bg',
  '--ata-link',
  '--ata-link-hover',
  '--ata-focus-ring',
  '--ata-btn-secondary-bg',
  '--ata-success',
  '--ata-success-bg',
  '--ata-warning',
  '--ata-warning-bg',
  '--ata-error',
  '--ata-error-bg',
  '--ata-shadow-sm',
  '--ata-shadow-md',
  '--ata-shadow-header',
] as const

function extractBlock(source: string, selector: string) {
  const start = source.indexOf(selector)
  expect(start).toBeGreaterThanOrEqual(0)

  const braceStart = source.indexOf('{', start)
  let depth = 0
  for (let i = braceStart; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1
    if (source[i] === '}') {
      depth -= 1
      if (depth === 0) {
        return source.slice(braceStart + 1, i)
      }
    }
  }

  throw new Error(`Could not parse CSS block for ${selector}`)
}

function blockDefines(source: string, variable: string) {
  return new RegExp(`${variable}\\s*:`).test(source)
}

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

describe('ata-theme.css', () => {
  const themeSource = readFileSync(
    resolve(process.cwd(), 'src/styles/ata-theme.css'),
    'utf8',
  )

  it('keeps shared brand tokens on :root', () => {
    const rootBlock = extractBlock(themeSource, ':root {')
    for (const variable of SHARED_ROOT_VARIABLES) {
      expect(blockDefines(rootBlock, variable)).toBe(true)
    }
  })

  it('defines complete semantic tokens for light and dark themes', () => {
    const lightBlock = extractBlock(themeSource, "[data-theme='light']")
    const darkBlock = extractBlock(themeSource, "[data-theme='dark']")

    for (const variable of THEME_SEMANTIC_VARIABLES) {
      expect(blockDefines(lightBlock, variable)).toBe(true)
      expect(blockDefines(darkBlock, variable)).toBe(true)
    }
  })

  it('does not bind light semantic tokens to bare :root', () => {
    const rootBlock = extractBlock(themeSource, ':root {')
    expect(blockDefines(rootBlock, '--ata-text')).toBe(false)
    expect(blockDefines(rootBlock, '--ata-bg')).toBe(false)
  })
})
