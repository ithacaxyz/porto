import { describe, expect, test } from 'vitest'
import * as Messenger from './messenger.js'

describe('normalizeMessage', () => {
  test('default', () => {
    const message = {
      id: '1',
      payload: { a: 1, b: new Function(), c: [new Date('2025-05-29'), 'foo'] },
      topic: 'test',
    }
    const normalized = Messenger.normalizeMessage(message)
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
