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
              "apiUrl": "https://api.basescan.org/api",
              "name": "Basescan",
              "url": "https://basescan.org",
            },
          },
          "blockTime": 2000,
          "contracts": {
            "disputeGameFactory": {
              "1": {
                "address": "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e",
              },
            },
            "gasPriceOracle": {
              "address": "0x420000000000000000000000000000000000000F",
            },
            "l1Block": {
              "address": "0x4200000000000000000000000000000000000015",
            },
            "l1StandardBridge": {
              "1": {
                "address": "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
                "blockCreated": 17482143,
              },
            },
            "l2CrossDomainMessenger": {
              "address": "0x4200000000000000000000000000000000000007",
            },
            "l2Erc721Bridge": {
              "address": "0x4200000000000000000000000000000000000014",
            },
            "l2OutputOracle": {
              "1": {
                "address": "0x56315b90c40730925ec5485cf004d835058518A0",
              },
            },
            "l2StandardBridge": {
              "address": "0x4200000000000000000000000000000000000010",
            },
            "l2ToL1MessagePasser": {
              "address": "0x4200000000000000000000000000000000000016",
            },
            "multicall3": {
              "address": "0xca11bde05977b3631167028862be2a173976ca11",
              "blockCreated": 5022,
            },
            "portal": {
              "1": {
                "address": "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e",
                "blockCreated": 17482143,
              },
            },
          },
          "fees": undefined,
          "formatters": {
            "block": {
              "exclude": undefined,
              "format": [Function],
              "type": "block",
            },
            "transaction": {
              "exclude": undefined,
              "format": [Function],
              "type": "transaction",
            },
            "transactionReceipt": {
              "exclude": undefined,
              "format": [Function],
              "type": "transactionReceipt",
            },
          },
          "id": 8453,
          "name": "Base",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "https://mainnet.base.org",
              ],
            },
          },
          "serializers": {
            "transaction": [Function],
          },
          "sourceId": 1,
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
