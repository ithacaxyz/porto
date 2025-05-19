# `wallet_getCapabilities`

Gets supported capabilities of the RPC server.

## Request

```ts
type Request = {
  method: 'wallet_getCapabilities',
}
```

## Response

```ts
type Response = {
  contracts: {
    accountRegistry: `0x${string}`,
    delegationImplementation: `0x${string}`,
    delegationProxy: `0x${string}`,
    entrypoint: `0x${string}`,
    simulator: `0x${string}`,
  },
  fees: {
    quoteConfig: {
      // only present on development environments
      constantRate?: number,
      gas: {
        txBuffer: number,
        userOpBuffer: number,
      },
      // price feed ttl
      rateTtl: number,
      // the ttl of RPC quotes
      ttl: number,
    },
    // the recipient of fees
    // if this is the zero address, fees are accumulated in the entrypoint
    recipient: `0x${string}`,
    tokens: {
      // the chain ID as hex
      [chainId: `0x${string}`]: {
        address: `0x${string}`,
        decimals: number,
        kind: 'USDC' | 'USDT' | 'ETH',
        // the rate of the fee token to native tokens
        nativeRate: `0x${string}`,
        symbol: string,
      }[],
    },
  },
}
```

## Example

```sh
cast rpc --rpc-url https://porto-dev.rpc.ithaca.xyz wallet_getCapabilities
```

```ts
{
  "contracts": {
    "accountRegistry": "0xa0a7aafba3ad1907411b3a9c8a3b78b930742c49",
    "delegationImplementation": "0xbf4071ff956582ee9d10c4b85509fdfefd08784e",
    "delegationProxy": "0x562ee13464552ac4900a5aeee79caf115d8a8566",
    "entrypoint": "0x48ce2fa2d650c253aa0228e63ad719f2cb2d0de8",
    "simulator": "0x695333ee240764065501d5181c94d99373d68bfb"
  },
  "fees": {
    "quoteConfig": {
      "constantRate": null,
      "gas": {
        "txBuffer": 100000,
        "userOpBuffer": 100000
      },
      "rateTtl": 300,
      "ttl": 30
    },
    "recipient": "0x0000000000000000000000000000000000000000",
    "tokens": {
      "0x6ef4": [
        {
          "address": "0x29f45fc3ed1d0ffafb5e2af9cc6c3ab1555cd5a2",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": "0x17a503c0a7000",
          "symbol": "EXP"
        },
        {
          "address": "0x502ff46e72c47b8c3183db8919700377eed66d2e",
          "decimals": 18,
          "kind": "USDT",
          "nativeRate": "0x17a503c0a7000",
          "symbol": "EXP"
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "kind": "ETH",
          "nativeRate": "0xde0b6b3a7640000",
          "symbol": "ETH"
        }
      ]
    }
  }
}
```
