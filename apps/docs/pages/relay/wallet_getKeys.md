# `wallet_getKeys`

Get all keys for an account.

## Request

```ts twoslash
import { Address, Hex } from 'viem'

// ---cut---
type Request = {
  method: 'wallet_getKeys',
  params: [{
    address: Address,
    chainIds?: Hex[] | undefined,
  }],
}
```

## Response

Each key associated with an account, along with the permissions set on the keys.

```ts twoslash
import { Address, Hash, Hex } from 'viem'

// ---cut---
type Response = {
  [chainId: `0x${string}`]: {
    // key hash
    hash: Hash
    key: {
      expiry?: number
      type: 'p256' | 'webauthnp256' | 'secp256k1'
      role: 'admin' | 'normal' | 'session'
      publicKey: Hex
    }
    permissions: (
      | {
          type: 'call'
          selector: string
          to: Address
        }
      | {
          type: 'spend'
          limit: number
          period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
          // defaults to the native token (address zero)
          token?: Address
        }
    )[]
  }[]
}
```
