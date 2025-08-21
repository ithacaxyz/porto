# `wallet_getCapabilities`

Gets supported [EIP-5792 Capabilities](https://eips.ethereum.org/EIPS/eip-5792#wallet_getcapabilities) of the Relay.

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

A map of chain IDs to the capabilities supported by the Relay on those chains, which includes:

- contract addresses (`contracts`)
- fee configuration (`fees`), such as supported fee tokens (`fees.tokens`), and quote lifetimes (`fees.quoteConfig.ttl`)

```ts twoslash
import { Address, Hex } from 'viem'

// ---cut---
type Response = {
  // the chain ID as hex
  [chainId: Hex]: {
    contracts: {
      /** Account implementation address. */
      accountImplementation: {
        address: Address,
        version?: string | null,
      },
      /** Account proxy address. */
      accountProxy: {
        address: Address,
        version?: string | null,
      },
      /** Legacy account implementation addresses. */
      legacyAccountImplementations: {
        address: Address,
        version?: string | null,
      }[],
      /** Legacy orchestrator addresses. */
      legacyOrchestrators: {
        address: Address,
        version?: string | null,
      }[],
      /** Orchestrator address. */
      orchestrator: {
        address: Address,
        version?: string | null,
      },
      /** Simulator address. */
      simulator: {
        address: Address,
        version?: string | null,
      },
      /** Funder contract address. */
      funder: {
        address: Address,
        version?: string | null,
      },
      /** Escrow contract address. */
      escrow: {
        address: Address,
        version?: string | null,
      },
    },
    fees: {
      quoteConfig: {
        /** Sets a constant rate for the price oracle. Used for testing. */
        constantRate?: number | null,
        /** Gas estimate configuration. */
        gas: {
          /** Extra buffer added to Intent gas estimates. */
          intentBuffer: number,
          /** Extra buffer added to transaction gas estimates. */
          txBuffer: number,
        },
        /** The lifetime of a price rate. */
        rateTtl: number,
        /** The lifetime of a fee quote. */
        ttl: number,
      },
      /** Fee recipient address. */
      recipient: Address,
      /** Tokens the fees can be paid in. */
      tokens: {
        address: Address,
        decimals: number,
        interop?: boolean,
        /** The rate of the fee token to native tokens. */
        nativeRate?: bigint,
        symbol: string,
        uid: string
      }[],
    },
  }
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.ithaca.xyz wallet_getCapabilities '["0x8453"]'
```

```json
{
  "0x8453": {
    "contracts": {
        "accountImplementation": {
          "address": "0xb292da8879c26ecd558bbea87f581cdd608ffc3c",
          "version": "0.2.0"
        },
        "accountProxy": {
          "address": "0x96e9ded822ffd4c65d8e09340ee95d2dc8fa209f",
          "version": null
        },
        "orchestrator": {
          "address": "0x883ac1afd6bf920755ccee253669515683634930",
          "version": "0.2.0"
        },
        "legacyAccountImplementations": [],
        "legacyOrchestrators": [],
        "simulator": {
          "address": "0x21d83f97fff3e35ab42d02e4bec8d61a9b645852",
          "version": null
        },
        "funder": {
          "address": "0x1234567890123456789012345678901234567890",
          "version": null
        },
        "escrow": {
          "address": "0x0987654321098765432109876543210987654321",
          "version": null
        }
    },
    "fees": {
      "quoteConfig": {
        "gas": {
          "txBuffer": 10000,
          "intentBuffer": 20000
        },
        "rateTtl": 300,
        "ttl": 30
      },
      "recipient": "0x0000000000000000000000000000000000000000",
      "tokens": [
        {
          "address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
          "decimals": 6,
          "nativeRate": "0x8ac7230489e80000",
          "symbol": "USDC",
          "uid": "usdc"
        },
        {
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "nativeRate": "0xde0b6b3a7640000",
          "symbol": "ETH",
          "uid": "ethereum"
        }
      ]
    }
  }
}
```
