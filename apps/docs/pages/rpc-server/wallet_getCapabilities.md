# `wallet_getCapabilities`

Gets supported [EIP-5792 Capabilities](https://eips.ethereum.org/EIPS/eip-5792#wallet_getcapabilities) of the RPC server.

## Request

```ts twoslash
import { Hex } from 'viem'

// ---cut---
type Request = {
  method: 'wallet_getCapabilities',
  // the chain ids
  params: Hex[],
}
```

## Response

A map of chain IDs to the capabilities supported by the RPC server on those chains, which includes:

- contract addresses (`contracts`)
- fee configuration (`fees`), such as supported fee tokens (`fees.tokens`), and quote lifetimes (`fees.quoteConfig.ttl`)

```ts twoslash
import { Address, Hex } from 'viem'

// ---cut---
type Response = {
  // the chain ID as hex
  [chainId: Hex]: {
    contracts: {
      accountRegistry: {
        address: Address,
        version?: string,
      },
      delegationImplementation: {
        address: Address,
        version?: string,
      },
      delegationProxy: {
        address: Address,
        version?: string,
      },
      entrypoint: {
        address: Address,
        version?: string,
      },
      legacyDelegations?: {
        address: Address,
        version?: string,
      }[],
      legacyEntrypoints?: {
        address: Address,
        version?: string,
      }[],
      simulator: {
        address: Address,
        version?: string,
      },
    },
    fees: {
      quoteConfig: {
        // only present on development environments
        constantRate?: number,
        gas: {
          txBuffer: number,
          intentBuffer: number,
        },
        // price feed ttl
        rateTtl: number,
        // the ttl of RPC quotes
        ttl: number,
      },
      // the recipient of fees
      // if this is the zero address, fees are accumulated in the entrypoint
      recipient: Address,
      tokens: {
        address: Address,
        decimals: number,
        kind: 'USDC' | 'USDT' | 'ETH',
        // the rate of the fee token to native tokens
        nativeRate: Hex,
        symbol: string,
      }[],
    },
  }
}
```

## Example

```sh
cast rpc --rpc-url https://porto-dev.rpc.ithaca.xyz wallet_getCapabilities '[28404]'
```

```ts
{
  "0x14a34": {
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
          "intentBuffer": 100000
        },
        "rateTtl": 300,
        "ttl": 30
      },
      "recipient": "0x0000000000000000000000000000000000000000",
      "tokens": [
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
