# `wallet_upgradeAccount`

Finalizes an account upgrade and broadcasts it on-chain.

:::tip
This method is intended to be used in conjunction with [`wallet_prepareUpgradeAccount`](/rpc-server/wallet_prepareUpgradeAccount).
:::

## Request

```ts twoslash
import { Address, Hash, Hex } from 'viem'

// ---cut---
type Request = {
  method: 'wallet_upgradeAccount',
  params: [{
    // As returned by `wallet_prepareUpgradeAccount`
    context: {
      quote: {
        chainId: Hex,
        intent: {
          eoa: Address,
          executionData: Hex,
          nonce: Hex,
          payer: Address,
          paymentToken: Address,
          prePaymentMaxAmount: Hex,
          totalPaymentMaxAmount: Hex,
          combinedGas: Hex,
          encodedPreCalls: Hex[],
          initData: Hex,
          prePaymentAmount: Hex,
          totalPaymentAmount: Hex,
          paymentRecipient: Address,
          signature: Hex,
          paymentSignature: Hex,
          supportedAccountImplementation: Address,
        },
        txGas: Hex,
        nativeFeeEstimate: {
          maxFeePerGas: number,
          maxPriorityFeePerGas: number,
        },
        // UNIX timestamp the quote expires at.
        ttl: number,
        authorizationAddress?: Address,
        entrypoint: Address,
        // The RPC servers signature over the quote.
        signature: {
          y_parity: boolean,
          r: Hex,
          s: Hex,
        },
        // The hash of the quote.
        hash: Hash,
      },
    },
    // signature over the intent digest from `wallet_prepareUpgradeAccount`
    signature: Hex,
    // The EIP-7702 authorization signed with the root EOA key.
    authorization: {
      // usually 0 to allow for replayability
      chainId: Hex,
      // the contract the account delegates to
      address: Address,
      nonce: Hex,
      yParity: Hex,
      r: Hex,
      s: Hex,
    },
  }],
}
```

## Response

A series of bundle IDs for use with [`wallet_getCallsStatus`].

```ts twoslash
import { Hex } from 'viem'

// ---cut---
type Response = {
  bundles: {
    id: Hex
  }[],
}
```

[`wallet_getCallsStatus`]: /rpc-server/wallet_getCallsStatus
