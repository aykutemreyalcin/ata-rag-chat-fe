import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CitationList } from '../components/chat/CitationList'
import { ConfidenceBadge } from '../components/chat/ConfidenceBadge'

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
})
