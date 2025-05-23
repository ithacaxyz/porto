# `wallet_upgradeAccount`

Finalizes an account upgrade and broadcasts it on-chain.

:::tip
This method is intended to be used in conjunction with [`wallet_prepareUpgradeAccount`](/rpc-server/wallet_prepareUpgradeAccount).
:::

## Request

```ts
type Request = {
  method: 'wallet_upgradeAccount',
  params: [{
    // As returned by `wallet_prepareUpgradeAccount`
    context: {
      quote: {
        chainId: `0x${string}`,
        op: {
          eoa: `0x${string}`,
          executionData: `0x${string}`,
          nonce: `0x${string}`,
          payer: `0x${string}`,
          paymentToken: `0x${string}`,
          prePaymentMaxAmount: `0x${string}`,
          totalPaymentMaxAmount: `0x${string}`,
          combinedGas: `0x${string}`,
          encodedPreOps: `0x${string}`[],
          initData: `0x${string}`,
          prePaymentAmount: `0x${string}`,
          totalPaymentAmount: `0x${string}`,
          paymentRecipient: `0x${string}`,
          signature: `0x${string}`,
          paymentSignature: `0x${string}`,
          supportedDelegationImplementation: `0x${string}`,
        },
        txGas: `0x${string}`,
        nativeFeeEstimate: {
          maxFeePerGas: number,
          maxPriorityFeePerGas: number,
        },
        // UNIX timestamp the quote expires at.
        ttl: number,
        authorizationAddress?: `0x${string}`,
        entrypoint: `0x${string}`,
        // The RPC servers signature over the quote.
        signature: {
          y_parity: bool,
          r: `0x${string}`,
          s: `0x${string}`,
        },
        // The hash of the quote.
        hash: `0x${string}`,
      },
    },
    // signature over the intent digest from `wallet_prepareUpgradeAccount`
    signature: `0x${string}`,
    // The EIP-7702 authorization signed with the root EOA key.
    authorization: {
      // usually 0 to allow for replayability
      chainId: `0x${string}`,
      // the contract the account delegates to
      address: `0x${string}`,
      nonce: `0x${string}`,
      yParity: `0x${string}`,
      r: `0x${string}`,
      s: `0x${string}`,
    },
  }],
}
```

## Response

A series of bundle IDs for use with [`wallet_getCallsStatus`].

```ts
type Response = {
  bundles: {
    id: `0x${string}`
  }[],
}
```

[`wallet_getCallsStatus`]: /rpc-server/wallet_getCallsStatus
