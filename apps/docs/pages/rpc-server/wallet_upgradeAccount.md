# `wallet_upgradeAccount`

Completes the upgrade of a counterfactual¹ Porto Account. 

¹: The upgrade is not performed on-chain immediately, sparing the user the gas cost. Instead, the signed upgrade is sent to the RPC server, which stores it and automatically executes and finalizes the upgrade when the user submits their next transaction (e.g., a send call). 

:::tip
This method is intended to be used in conjunction with [`wallet_prepareUpgradeAccount`](/rpc-server/wallet_prepareUpgradeAccount).
:::

## Request

```ts
type Request = {
  method: 'wallet_upgradeAccount',
  params: [{
    // Context that includes the prepared pre-call. 
    // As returned by `wallet_prepareUpgradeAccount`
    context: {
      authorization: {
        chainId: `0x${string}`,
        address: `0x${string}`,
        nonce: `0x${string}`,
      },
      preCall: {
        eoa: `0x${string}`,
        executionData: `0x${string}`,
        nonce: `0x${string}`,
        signature: `0x${string}`,
      },
    },
    // Tuple of signatures over the digests from `wallet_prepareUpgradeAccount`
    signatures: [authSignature: `0x${string}`, preCallSignature: `0x${string}`],
  }],
}
```

## Response

```ts
type Response = void
```

