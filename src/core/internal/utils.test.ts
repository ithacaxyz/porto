import { describe, expect, it } from 'vitest'
import * as Utils from './utils.js'

describe('uniqBy', () => {
  it('default', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }]
    const result = Utils.uniqBy(data, (item) => item.id)
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
})
