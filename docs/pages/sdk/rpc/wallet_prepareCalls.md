# `wallet_prepareCalls`

Prepares a call bundle. 

It returns a `digest` of the call bundle to sign over, as well as the parameters required to fulfil a [`wallet_sendPreparedCalls`](/sdk/rpc/wallet_sendPreparedCalls) request (`context`).

:::tip
This method is intended to be used in conjunction with [`wallet_sendPreparedCalls`](/sdk/rpc/wallet_sendPreparedCalls).
:::

## Request

:::info
The request is identical to that of [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls).
:::

```ts
type Request = {
  method: 'wallet_prepareCalls',
  params: [{
    /** Calls to prepare. */
    calls: {
      /** Recipient. */
      to: `0x${string}`;
      /** Calldata. */
      data?: `0x${string}`;
      /** Value to transfer. */
      value?: `0x${string}`;
    }[];
    /** 
     * Chain ID to send the calls to.
     * If not provided, the current chain will be used.
     */
    chainId?: `0x${string}`;
    /** 
     * Address of the account to send the calls from.
     * If not provided, the Account will be filled by the Wallet.
     */
    from?: `0x${string}`;
    /** Capabilities. */
    capabilities?: {
      permissions?: {
        /** ID of the permission to use. */
        id: `0x${string}`;
      };
    };
  }]
}
```

## Response

:::info
The response is intended to be forwarded to [`wallet_sendPreparedCalls`](/sdk/rpc/wallet_sendPreparedCalls) (minus the `digest`).
:::

```ts
type Response = {
  /** Chain ID the calls were prepared for. */
  chainId: `0x${string}`;
  /** 
   * Data to be forwarded to `wallet_sendPreparedCalls`.
   * For Porto, this will include the signed quote. 
   */
  context: { quote: unknown };
  /** Digest to sign over. */
  digest: `0x${string}`;
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const response = await provider.request({ // [!code focus]
  method: 'wallet_prepareCalls', // [!code focus]
  params: [{ // [!code focus]
    calls: [{ // [!code focus]
      to: '0xcafebabecafebabecafebabecafebabecafebabe', // [!code focus]
      value: '0x12345678', // [!code focus]
    }], // [!code focus]
  }] // [!code focus]
}) // [!code focus]
``` 
