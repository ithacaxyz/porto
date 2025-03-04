# `experimental_permissions`

Returns the active permissions for an account.

## Request

```ts
type Request = {
  method: 'experimental_permissions',
  params: [{
    /** Address of the account to list permissions on. */
    address?: `0x${string}`
  }]
}
```

## Response

```ts
type Response = { 
  address: `0x${string}`,
  chainId: `0x${string}`,
  expiry: number, 
  id: `0x${string}`,
  key: {
    publicKey: `0x${string}`,
    type: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256',
  },
  permissions: {
    calls: {
      signature?: string
      to?: `0x${string}`
    }[],
    spend: {
      limit: bigint
      period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
      token?: `0x${string}`
    }[],
    signatureVerification?: {
      addresses: `0x${string}`[]
    },
  }
  publicKey: `0x${string}`, 
  type: 'p256' | 'secp256k1' | 'webauthn-p256' 
}[]
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const permissions = await provider.request({
  method: 'experimental_permissions',
})
```