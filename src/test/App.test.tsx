import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  it('renders chat layout', async () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Your question' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Suggested questions')).toBeInTheDocument()
    expect(await screen.findByText(/Backend unavailable/i)).toBeInTheDocument()
  })

  it('shows loading state after submitting a question', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.type(
      screen.getByRole('textbox', { name: 'Your question' }),
      'How do I apply?',
    )
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(screen.getByText('You')).toBeInTheDocument()
    expect(
      screen.getByText('Waiting for a response…'),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Assistant is typing…',
    )
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('renders admin scaffold', () => {
    renderApp('/admin')
    expect(
      screen.getByRole('heading', { name: 'Admin dashboard' }),
    ).toBeInTheDocument()
  })
})
