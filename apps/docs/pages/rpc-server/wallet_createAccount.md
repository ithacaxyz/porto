# `wallet_createAccount`

Finalizes an account creation.

Accounts created using the RPC server use [PREP](https://blog.biconomy.io/prep-deep-dive/) to generate an address. Using PREP, it is proven that no one knows the Secp256k1 private key of the account, even the RPC server.

:::tip
This method is intended to be used in conjunction with [`wallet_prepareCreateAccount`](/rpc-server/wallet_prepareCreateAccount).
:::

## Request

```ts
type Request = {
  method: 'wallet_createAccount',
  params: [{
    context: {
      account: {
        address: `0x${string}`,
        signedAuthorization: {
          // usually 0 to allow for replayability
          chainId: `0x${string}`,
          // the contract the account delegates to
          address: `0x${string}`,
          nonce: `0x${string}`,
          yParity: `0x${string}`,
          r: `0x${string}`,
          s: `0x${string}`,
        },
        // the salt used to generate the prep account
        salt: number,
        // calls performed on account creation
        initCalls: {
          to: `0x${string}`,
          value: `0x${string}`,
          bytes: `0x${string}`,
        }[],
      },
      chainId: `0x${string}`,
    },
    signatures: {
      publicKey: `0x${string}`,
      type: 'p256' | 'webauthnp256' | 'secp256k1',
      value: `0x${string}`,
      prehash?: boolean,
      }[]
  }],
}
```

## Response

```ts
type Response = {
  hash: `0x${string}`,
  id: `0x${string}`,
  signature: `0x${string}`,
}[]
```
