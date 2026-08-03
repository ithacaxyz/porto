# `wallet_getKeys`

Get all keys for an account.

When [`wallet_prepareUpgradeAccount`](/relay/wallet_prepareUpgradeAccount) & [`wallet_upgradeAccount`](/relay/wallet_upgradeAccount) are called with a key, it gets stored by the Relay. This allows `wallet_getKeys` to return keys for chains where the account has not yet been deployed. For example, if an account is prepared with an admin key but only deployed on Chain A, calling `wallet_getKeys` for Chain B (where the account is not deployed) will still return the admin key that was authorized during account preparation.

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
