import { Porto } from 'porto'
import { ServerClient } from 'porto/viem'
import { describe, expect, test } from 'vitest'

describe('fromPorto', () => {
  test('default', async () => {
    const porto = Porto.create()
    const client = ServerClient.fromPorto(porto)
    expect({ ...client, uid: null }).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 1000,
        "ccipRead": undefined,
        "chain": {
          "blockExplorers": {
            "default": {
              "apiUrl": "https://api-sepolia.basescan.org/api",
              "name": "Basescan",
              "url": "https://sepolia.basescan.org",
            },
          },
          "contracts": {
            "disputeGameFactory": {
              "11155111": {
                "address": "0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1",
              },
            },
            "gasPriceOracle": {
              "address": "0x420000000000000000000000000000000000000F",
            },
            "l1Block": {
              "address": "0x4200000000000000000000000000000000000015",
            },
            "l1StandardBridge": {
              "11155111": {
                "address": "0xfd0Bf71F60660E2f608ed56e1659C450eB113120",
                "blockCreated": 4446677,
              },
            },
            "l2CrossDomainMessenger": {
              "address": "0x4200000000000000000000000000000000000007",
            },
            "l2Erc721Bridge": {
              "address": "0x4200000000000000000000000000000000000014",
            },
            "l2OutputOracle": {
              "11155111": {
                "address": "0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254",
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
              "blockCreated": 1059647,
            },
            "portal": {
              "11155111": {
                "address": "0x49f53e41452c74589e85ca1677426ba426459e85",
                "blockCreated": 4446677,
              },
            },
            "portoAccount": {
              "address": "0x623b5b44647871268d481d2930f60d5d7f37a1fe",
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
          "id": 84532,
          "name": "Base Sepolia",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Sepolia Ether",
            "symbol": "ETH",
          },
          "network": "base-sepolia",
          "rpcUrls": {
            "default": {
              "http": [
                "https://base-sepolia.rpc.ithaca.xyz",
              ],
            },
          },
          "serializers": {
            "transaction": [Function],
          },
          "sourceId": 11155111,
          "testnet": true,
        },
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 1000,
        "request": [Function],
        "transport": {
          "fetchOptions": undefined,
          "key": "http",
          "methods": undefined,
          "name": "HTTP JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "http",
          "url": "https://base-sepolia.rpc.ithaca.xyz",
        },
        "type": "base",
        "uid": null,
      }
    `)
  })
})
