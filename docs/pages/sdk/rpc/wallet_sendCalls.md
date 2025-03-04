# `wallet_sendCalls`

Requests for the Wallet to broadcast a bundle of calls to the network.

## Request

```ts
type Request = {
  method: 'wallet_sendCalls',
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

```ts
type Response = {
  /** ID of the bundle. */
  id: string;
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const response = await provider.request({ // [!code focus]
  method: 'wallet_sendCalls', // [!code focus]
  params: [{ // [!code focus]
    calls: [{ // [!code focus]
      to: '0xcafebabecafebabecafebabecafebabecafebabe', // [!code focus]
      value: '0x12345678', // [!code focus]
    }], // [!code focus]
  }] // [!code focus]
}) // [!code focus]
```

