import { describe, it, expect, vi, beforeEach } from 'vitest'
import categoriesFixture from '../fixtures/contentful-categories.json'

const mockGetEntries = vi.fn().mockResolvedValue(categoriesFixture)

vi.mock('@/services/contentful/client', () => ({
  contentfulClient: {
    getEntries: mockGetEntries,
  },
}))

// Import after mocks are in place
const { getCategories } = await import('@/services/contentful/categories')

describe('getCategories()', () => {
  beforeEach(() => {
    mockGetEntries.mockClear()
  })

  it('returns the items array from the Contentful response', async () => {
    const items = await getCategories()
    expect(items).toHaveLength(2)
  })

  it('queries Contentful with content_type "product"', async () => {
    await getCategories()
    expect(mockGetEntries).toHaveBeenCalledWith({ content_type: 'product' })
  })

  it('each item has a sys.id', async () => {
    const items = await getCategories()
    for (const item of items) {
      expect(item.sys.id).toBeTruthy()
    }
  })

  it('each item has a fields object', async () => {
    const items = await getCategories()
    for (const item of items) {
      expect(item.fields).toBeDefined()
    }
  })

  it('each item sys.contentType.sys.id is "product"', async () => {
    const items = await getCategories()
    for (const item of items) {
      expect(item.sys.contentType.sys.id).toBe('product')
    }
  })
})
