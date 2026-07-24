import { describe, expect, it } from 'vitest'
import { getApiBaseUrl, getHealthUrl } from '../config/env'

describe('env helpers', () => {
  it('defaults api base url', () => {
    expect(getApiBaseUrl()).toContain('/api')
  })

  it('derives health url from api base', () => {
    expect(getHealthUrl()).toMatch(/\/health$/)
  })
})
