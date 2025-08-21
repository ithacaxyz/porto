# `wallet_upgradeAccount`

Completes the upgrade of a counterfactual¹ Porto Account.

¹: The upgrade is not performed on-chain immediately, sparing the user the gas cost. Instead, the signed upgrade is sent to the Relay, which stores it and automatically executes and finalizes the upgrade when the user submits their next transaction (e.g., a send call).

:::tip
This method is intended to be used in conjunction with [`wallet_prepareUpgradeAccount`](/relay/wallet_prepareUpgradeAccount).
:::

## Request

```ts twoslash
import { Address, Hash, Hex } from 'viem'

// ---cut---
type Request = {
  method: 'wallet_upgradeAccount',
  params: [{
    // Context that includes the prepared pre-call. 
    // As returned by `wallet_prepareUpgradeAccount`
    context: {
      address: Address,
      authorization: {
        address: Address,
        chainId: Hex,
        nonce: Hex,
      },
      preCall: {
        eoa: Address,
        executionData: Hex,
        nonce: Hex,
        signature: Hex,
      },
    },
    // Object of signatures over the digests from `wallet_prepareUpgradeAccount`
    signatures: {
      auth: Hex,
      exec: Hex,
    },
  }],
}
```

## Response

```ts
type Response = {
  /** Call bundles that were executed */
  bundles: {
    /** The ID of the call bundle */
    id: Hex,
  }[]
}
```
