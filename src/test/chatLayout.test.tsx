import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatInput } from '../components/chat/ChatInput'
import { ChatLayout } from '../components/chat/ChatLayout'
import { ChatLoadingStatus } from '../components/chat/ChatLoadingStatus'
import { MessageBubble } from '../components/chat/MessageBubble'
import type { ChatMessage } from '../api/types'

describe('chat layout components', () => {
  it('renders streaming placeholder in assistant bubble', () => {
    const message: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: '',
      status: 'streaming',
    }

    render(<MessageBubble message={message} locale="en" />)
    expect(screen.getByText('Waiting for a response…')).toBeInTheDocument()
  })

  it('renders error state in message bubble', () => {
    const message: ChatMessage = {
      id: '2',
      role: 'assistant',
      content: '',
      status: 'error',
      error: 'question must not be blank',
    }

    render(<MessageBubble message={message} locale="en" />)
    expect(screen.getByText(/question must not be blank/i)).toBeInTheDocument()
  })

  it('shows loading status while streaming', () => {
    render(<ChatLoadingStatus locale="en" visible />)
    expect(screen.getByRole('status')).toHaveTextContent('Assistant is typing…')
  })

  it('disables send and shows stop while streaming', async () => {
    const user = userEvent.setup()
    const onStop = vi.fn()

    render(
      <ChatInput locale="en" isStreaming onSubmit={vi.fn()} onStop={onStop} />,
    )

    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('composes chat layout with suggestions', () => {
    render(
      <ChatLayout
        locale="en"
        onLocaleChange={vi.fn()}
        heading="Chat"
        lead="Ask questions."
        messages={[]}
        isStreaming={false}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()
    expect(screen.getByText('Suggested questions')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Your question' }),
    ).toBeInTheDocument()
  })
})
