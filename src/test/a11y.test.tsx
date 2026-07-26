import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatInput } from '../components/chat/ChatInput'
import { FailedPagesTable } from '../components/admin/FailedPagesTable'

describe('accessibility polish', () => {
  it('links chat textarea to keyboard hint', () => {
    render(
      <ChatInput
        locale="en"
        isStreaming={false}
        onSubmit={() => undefined}
        onStop={() => undefined}
      />,
    )

    expect(screen.getByLabelText('Your question')).toHaveAttribute(
      'aria-describedby',
      'question-hint',
    )
    expect(screen.getByText('Press Ctrl+Enter to send.')).toBeInTheDocument()
  })

  it('labels failed pages table for assistive tech', () => {
    render(
      <FailedPagesTable
        isLoading={false}
        pages={[
          {
            url: 'https://akademiata.pl/broken',
            http_status: 500,
            error_message: 'Server error',
          },
        ]}
      />,
    )

    expect(
      screen.getByRole('table', {
        name: 'Pages that failed during the latest crawl',
      }),
    ).toBeInTheDocument()
  })
})
