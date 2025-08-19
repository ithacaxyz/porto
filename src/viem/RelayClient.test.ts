import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import { describe, expect, test } from 'vitest'

describe('fromPorto', () => {
  test('default', async () => {
    const porto = Porto.create()
    const client = RelayClient.fromPorto(porto)
    expect({ ...client, uid: null }).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 1000,
        "ccipRead": undefined,
        "chain": {
          "blockExplorers": {
            "default": {
              "apiUrl": "https://api.arbiscan.io/api",
              "name": "Arbiscan",
              "url": "https://arbiscan.io",
            },
          },
          "blockTime": 250,
          "contracts": {
            "multicall3": {
              "address": "0xca11bde05977b3631167028862be2a173976ca11",
              "blockCreated": 7654707,
            },
          },
          "fees": undefined,
          "formatters": undefined,
          "id": 42161,
          "name": "Arbitrum One",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "https://arb1.arbitrum.io/rpc",
              ],
            },
          },
          "serializers": undefined,
        },
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 1000,
        "request": [Function],
        "transport": {
          "key": "relayProxy",
          "methods": undefined,
          "name": "Relay Proxy",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "relayProxy",
        },
        "type": "base",
        "uid": null,
      }
    `)
  })
})
