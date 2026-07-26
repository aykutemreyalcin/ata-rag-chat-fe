import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CitationList } from '../components/chat/CitationList'
import { ConfidenceBadge } from '../components/chat/ConfidenceBadge'
import { MessageBubble } from '../components/chat/MessageBubble'

describe('chat components', () => {
  it('renders citations with external links', () => {
    render(
      <CitationList
        locale="en"
        sources={[
          {
            title: 'Admissions',
            url: 'https://akademiata.pl/admissions',
            section: 'Apply',
          },
        ]}
      />,
    )

    const link = screen.getByRole('link', { name: 'Admissions' })
    expect(link).toHaveAttribute('href', 'https://akademiata.pl/admissions')
    expect(link).toHaveAttribute('target', '_blank')
    expect(screen.getByText('Apply')).toBeInTheDocument()
  })

  it('renders source type from backend citation payload', () => {
    render(
      <CitationList
        locale="en"
        sources={[
          {
            title: 'Tuition',
            url: 'https://akademiata.pl/tuition',
            sourceType: 'pricing',
            score: 0.9,
          },
        ]}
      />,
    )

    expect(screen.getByText('pricing')).toBeInTheDocument()
  })

  it('renders confidence badge with score', () => {
    render(
      <ConfidenceBadge
        locale="en"
        confidence={{ score: 0.84, level: 'high' }}
      />,
    )

    expect(screen.getByText('High confidence')).toBeInTheDocument()
    expect(screen.getByText('84%')).toBeInTheDocument()
  })

  it('renders unknown confidence notice when answered is false', () => {
    render(
      <MessageBubble
        locale="en"
        message={{
          id: '1',
          role: 'assistant',
          content:
            "I couldn't find this information on the AkademiaTA website.",
          status: 'complete',
          confidence: { score: 0.35, level: 'unknown', answered: false },
        }}
      />,
    )

    expect(screen.getByText('Unable to verify')).toBeInTheDocument()
  })
})
