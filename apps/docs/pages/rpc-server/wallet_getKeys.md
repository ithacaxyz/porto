# `wallet_getKeys`

Get all keys for an account.

## Request

```ts
type Request = {
  method: 'wallet_getKeys',
  params: [{
    address: `0x${string}`,
    chainId: `0x${string}`,
  }],
}
```

## Response

Each key associated with an account, along with the permissions set on the keys.

```ts
type Response = {
  // key hash
  hash: `0x${string}`,
  key: {
    expiry?: number,
    type: 'p256' | 'webauthnp256' | 'secp256k1',
    role: 'admin' | 'normal' | 'session',
    publicKey: `0x${string}`,
  },
  permissions: ({
    type: 'call',
    selector: string,
    to: `0x${string}`,
  } | {
    type: 'spend',
    limit: number,
    period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year',
    // defaults to the native token (address zero)
    token?: `0x${string}`,
  })[],
}[]
```
