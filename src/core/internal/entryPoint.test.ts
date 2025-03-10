import { describe, expect, test } from 'vitest'
import { getPorto } from '../../../test/src/porto.js'
import { getEip712Domain } from './entryPoint.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

describe('getEip712Domain', () => {
  test('default', () => {
    const domain = getEip712Domain(client)
    expect(domain).toMatchInlineSnapshot(`
      {
        "chainId": 911867,
        "name": "EntryPoint",
        "verifyingContract": "0x307AF7d28AfEE82092aA95D35644898311CA5360",
        "version": "0.0.1",
      }
    `)
  })
})
