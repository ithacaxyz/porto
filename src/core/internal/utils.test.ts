import { describe, expect, test } from 'vitest'
import * as Utils from './utils.js'

describe('normalizeValue', () => {
  test('default', () => {
    const value = {
      id: '1',
      payload: { a: 1, b: new Function(), c: [new Date('2025-05-29'), 'foo'] },
      topic: 'test',
    }
    const normalized = Utils.normalizeValue(value)
    expect(normalized).toMatchInlineSnapshot(`
      {
        "id": "1",
        "payload": {
          "a": 1,
          "b": undefined,
          "c": [
            2025-05-29T00:00:00.000Z,
            "foo",
          ],
        },
        "topic": "test",
      }
    `)
  })
})

describe('uniqBy', () => {
  test('default', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }]
    const result = Utils.uniqBy(data, (item) => item.id)
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
})
