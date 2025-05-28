# `wallet_getAccounts`

Get all accounts a key is authorized on.

A key can be associated with multiple accounts.

## Request

```ts
type Request = {
  method: 'wallet_getAccounts',
  params: [{
    id: `0x${string}`,
    chainId: number,
  }],
}
```

## Response

The response is an array of accounts (with the account's address and delegation) and keys associated with the accounts.

```ts
type Response = {
  address: `0x${string}`,
  delegation: `0x${string}`,
  keys: {
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
}[]
```
