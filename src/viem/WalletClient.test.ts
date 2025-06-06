import { Porto } from 'porto'
import { WalletClient } from 'porto/viem'
import { describe, expect, test } from 'vitest'

describe('fromPorto', () => {
  test('default', async () => {
    const porto = Porto.create()
    const client = WalletClient.fromPorto(porto)
    expect({ ...client, uid: null }).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 1000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 1000,
        "request": [Function],
        "transport": {
          "key": "custom",
          "methods": undefined,
          "name": "Custom Provider",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "custom",
        },
        "type": "base",
        "uid": null,
      }
    `)
  })
})
