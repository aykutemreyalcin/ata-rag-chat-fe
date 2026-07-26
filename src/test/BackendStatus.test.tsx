import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { fetchHealth } from '../api/client'
import { BackendStatus } from '../components/BackendStatus'

vi.mock('../api/client', () => ({
  fetchHealth: vi.fn(),
}))

function renderStatus() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <BackendStatus />
    </QueryClientProvider>,
  )
}

describe('BackendStatus', () => {
  it('shows latency when backend is healthy', async () => {
    vi.mocked(fetchHealth).mockResolvedValue({
      status: 'ok',
      service: 'ata-rag-chat-be',
    })

    renderStatus()

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/API ok · \d+ ms/)
    })
  })

  it('announces unavailable state for screen readers', async () => {
    vi.mocked(fetchHealth).mockRejectedValue(new Error('offline'))

    renderStatus()

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Backend unavailable',
      )
    })
  })
})
