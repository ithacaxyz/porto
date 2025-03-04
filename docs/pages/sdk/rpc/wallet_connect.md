# `wallet_connect`

Requests to connect account(s) with optional capabilities.

## Request

```ts
type Request = {
  method: 'wallet_connect',
  params: [{
    /** Optional capabilities to request. */
    capabilities?: {
      /** Create an account. */
      createAccount?: boolean | {
        /** Chain ID to create the account on. */
        chainId?: number
        /** Label for the account. */
        label?: string
      }

      /** Grant permissions. */
      grantPermissions?: {
        /** Expiry of the permissions. */
        expiry: number

        /** 
         * Key to grant permissions to. 
         * Defaults to a wallet-managed key. 
         */
        key?: {
          /** 
           * Public key. 
           * Accepts an address for `contract` & `secp256k1` types. 
           */
          publicKey?: `0x${string}`,
          /** Key type. */
          type?: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256', 
        }
        
        /** Permissions to grant. */
        permissions: {
          /** Call permissions. */
          calls: {
            /** Function signature or 4-byte signature. */
            signature?: string
            /** Authorized target address. */
            to?: `0x${string}`
          }[],

          /** Spend permissions. */
          spend: {
            /** Spending limit (in wei) per period. */
            limit: `0x${string}`,
            /** Period of the spend limit. */
            period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
            /** 
             * ERC20 token to set the limit on. 
             * If not provided, the limit will be set on the 
             * native token (e.g. ETH).
             */
            token?: `0x${string}`
          }[],

          /** ERC-1271 verification permissions. */
          signatureVerification?: {
            /** 
             * Authorized contract addresses that can call the account's
             * ERC-1271 `isValidSignature` function. 
             */
            addresses: readonly `0x${string}`[]
          },
        },
      }
    }
  }]
}
```

## Response

List of connected accounts.

```ts
type Response = {
  accounts: {
    /** Address of the account. */
    address: `0x${string}`,
    /** Capabilities of the account. */
    capabilities: {
      /** Permissions that were granted. */
      permissions: {
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
            signature?: string,
            to?: `0x${string}`,
          }[],
          spend: {
            limit: `0x${string}`,
            period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year',
            token?: `0x${string}`,
          }[],
          signatureVerification?: {
            addresses: `0x${string}`[]
          },
        },
      }[]
    }
  }[]
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const accounts = await provider.request({ // [!code focus]
  method: 'wallet_connect', // [!code focus]
}) // [!code focus]
```