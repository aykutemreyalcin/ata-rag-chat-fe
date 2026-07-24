import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'

vi.mock('../api/client', () => ({
  fetchHealth: vi.fn().mockRejectedValue(new Error('offline')),
  apiClient: {},
  postChatNotImplemented: vi.fn(),
}))

function renderApp(path = '/') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App routes', () => {
  it('renders chat scaffold', async () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()
    expect(screen.getByText(/Not implemented yet/i)).toBeInTheDocument()
    expect(await screen.findByText(/Backend unavailable/i)).toBeInTheDocument()
  })

  it('renders admin scaffold', () => {
    renderApp('/admin')
    expect(
      screen.getByRole('heading', { name: 'Admin dashboard' }),
    ).toBeInTheDocument()
  })
})
