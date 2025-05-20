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
    accountRegistry: {
      address: `0x${string}`,
      version?: string,
    },
    delegationImplementation: {
      address: `0x${string}`,
      version?: string,
    },
    delegationProxy: {
      address: `0x${string}`,
      version?: string,
    },
    entrypoint: {
      address: `0x${string}`,
      version?: string,
    },
    legacyDelegations?: {
      address: `0x${string}`,
      version?: string,
    }[],
    legacyEntrypoints?: {
      address: `0x${string}`,
      version?: string,
    }[],
    simulator: {
      address: `0x${string}`,
      version?: string,
    },
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
      "accountRegistry": {
        "address": "0x623b5b44647871268d481d2930f60d5d7f37a1fe",
        "version": null
      },
      "delegationImplementation": {
        "address": "0x5c4fd1f648a89802b7fcd0bced8a35567d99cf15",
        "version": "0.1.2"
      },
      "delegationProxy": {
        "address": "0xc49cc88a576cf77053ba11b1c3a3011b42da0f34",
        "version": null
      },
      "entrypoint": {
        "address": "0x2e71297e895fd480019810605360cd09dbb8783b",
        "version": "0.1.2"
      },
      "legacyDelegations": [],
      "legacyEntrypoints": [],
      "simulator": {
        "address": "0x45b65d48e60a9414872ecd092ddf5b37c6bf4d06",
        "version": null
      }
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
