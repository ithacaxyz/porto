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
cast rpc --rpc-url https://rpc.porto.sh wallet_getCapabilities '["0x14a34"]'
```

```json
{
  "0x14a34": {
    "contracts": {
      "orchestrator": {
        "address": "0xb447ba5a2fb841406cdac4585fdc28027d7ae503",
        "version": "0.4.6"
      },
      "accountImplementation": {
        "address": "0xc4e1dc6045234b913db45e8f51e770d6d12e42a1",
        "version": "0.4.11"
      },
      "legacyOrchestrators": [],
      "legacyAccountImplementations": [],
      "accountProxy": {
        "address": "0x5874f358359ee96d2b3520409018f1a6f59a2cdc",
        "version": null
      },
      "simulator": {
        "address": "0xcb80788813c39d90c48c2733b43b3e47e23a2d3f",
        "version": null
      },
      "funder": {
        "address": "0x665efbf4b831aac6b712471c6bbfdb11e1721b4f",
        "version": null
      },
      "escrow": {
        "address": "0x55626138525a47af075322aafe1df8f68993b11d",
        "version": null
      }
    },
    "fees": {
      "recipient": "0x665efbf4b831aac6b712471c6bbfdb11e1721b4f",
      "quoteConfig": {
        "constantRate": null,
        "gas": {
          "intentBuffer": 20000,
          "txBuffer": 10000
        },
        "ttl": 30,
        "rateTtl": 300
      },
      "tokens": [
        {
          "uid": "exp2",
          "address": "0x2ace05bcb50b49953aaa4c00f318db908a512d99",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "symbol": "EXP2",
          "nativeRate": "0xc536acbc02a4"
        },
        {
          "uid": "exp1",
          "address": "0x74e294e9d05bace256796040ca6dc0c47efb9fff",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "symbol": "EXP",
          "nativeRate": "0xc536acbc02a4"
        },
        {
          "uid": "teth",
          "address": "0x0000000000000000000000000000000000000000",
          "decimals": 18,
          "feeToken": true,
          "interop": true,
          "symbol": "ETH",
          "nativeRate": "0xde0b6b3a7640000"
        }
      ]
    }
  }
}
```
