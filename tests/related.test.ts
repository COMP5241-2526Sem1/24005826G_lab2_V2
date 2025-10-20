import { describe, it, expect } from 'vitest'
import { similarity } from '../src/lib/related'

describe('similarity', () => {
  it('is higher for similar texts', () => {
    const a = 'Meeting notes about project alpha roadmap and tasks'
    const b = 'Project alpha tasks and roadmap for next meeting'
    const c = 'Grocery list: apples, milk, bread'
    expect(similarity(a,b)).toBeGreaterThan(similarity(a,c))
  })
})
