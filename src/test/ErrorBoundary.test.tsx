import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '../components/ErrorBoundary'

function BrokenChild(): ReactNode {
  throw new Error('Test explosion')
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Test explosion')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reload page' }),
    ).toBeInTheDocument()

    consoleError.mockRestore()
  })
})
