# `experimental_grantPermissions`

Grants permissions for an Application to perform actions on behalf of the account.

Applications MUST provide at least one spend permission and one scoped call permission.

:::warning
Alternative to the draft [ERC-7715](https://github.com/ethereum/ERCs/blob/23fa3603c6181849f61d219f75e8a16d6624ac60/ERCS/erc-7715.md) specification with a tighter API. We hope to upstream concepts from this method and eventually use ERC-7715 or similar.
:::

## Request

```ts
type Request = {
  method: 'experimental_grantPermissions',
  params: [{
    /** 
     * Address of the account to grant permissions on. 
     * Defaults to the current account. 
     */
    address?: `0x${string}`

    /** Chain ID to grant permissions on. */
    chainId?: `0x${string}`

    /** Expiry of the permissions. */
    expiry: number

    /** Key to grant permissions to. Defaults to a wallet-managed key. */
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
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

// Grant a spend limit permission.
const permissions_1 = await provider.request({
  method: 'experimental_grantPermissions',
  params: [{
    expiry: 123456789,
    permissions: {
      calls: [{ signature: 'subscribe()' }],
      spend: [{
        limit: '0x5f5e100', // 100 USDC,
        period: 'day',
        token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      }]
    },
  }],
})

// Grant a contract address to verify signatures (via ERC-1271).
const permissions_2 = await provider.request({
  method: 'experimental_grantPermissions',
  params: [{
    expiry: 123456789,
    permissions: {
      calls: [{ signature: 'foo()' }],
      signatureVerification: {
        addresses: ['0xb3030d74b87321d620f2d0cdf3f97cc4598b9248'],
      },
    },
  }],
})

// Grant spend & call scope permissions to a specific key.
const permissions_3 = await provider.request({
  method: 'experimental_grantPermissions',
  params: [{
    expiry: 123456789,
    key: {
      publicKey: '0x...',
      type: 'p256',
    },
    permissions: {
      calls: [{ 
        signature: 'transfer(address,uint256)', 
        to: '0xcafebabecafebabecafebabecafebabecafebabe' 
      }],
      spend: [{
        limit: '0x5f5e100', // 100 USDC,
        period: 'day',
        token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      }]
    },
  }],
})
```