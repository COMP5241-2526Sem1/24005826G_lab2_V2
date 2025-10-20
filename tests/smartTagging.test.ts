import { describe, it, expect } from 'vitest'
import { autoTags } from '../src/lib/smartTagging'

describe('autoTags', () => {
  it('tags shopping and urgent', () => {
    const t = autoTags('Buy milk ASAP!')
    expect(t).toContain('shopping')
    expect(t).toContain('urgent')
  })
  it('tags stocks and crypto', () => {
    const t = autoTags('Check AAPL and BTC prices')
    expect(t).toContain('stocks')
    expect(t).toContain('crypto')
  })
})
