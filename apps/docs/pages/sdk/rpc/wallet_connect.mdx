import { TryItOut } from '../../../components/TryItOut'
import { parseEther, toHex } from 'viem'

# `wallet_connect`

Requests to connect account(s) with optional capabilities.

<TryItOut
  exampleSlug="#example"
  fn={async ({ provider }) => {
    const accounts = await provider.request({
      method: 'wallet_connect',
    })

    return accounts
  }}
  requireConnection={false}
  transformResultCode={(code) => {
    return 'const response = ' + code
  }}
/>

## Request

```ts
type Request = {
  method: 'wallet_connect',
  params: [{
    /** Optional capabilities to request. */
    capabilities?: {
      /** Hide/show email optional email input when creating accounts. */
      email?: boolean
      /** Grant permissions. */
      grantPermissions?: PermissionsRequestCapabilities['grantPermissions']
      /** ERC-4361: Sign-In with Ethereum support. */
      signInWithEthereum?: PermissionsRequestCapabilities['signInWithEthereum']
    }
  }]
}
```

Capabilities:

- [`PermissionsRequestCapabilities`](/sdk/rpc/capabilities#request-capabilities-1)

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
      permissions: PermissionsResponseCapabilities['permissions']
      /** ERC-4361 message and signature. */
      signInWithEthereum: PermissionsResponseCapabilities['signInWithEthereum']
    }
  }[]
}
```

Capabilities:

- [`PermissionsResponseCapabilities`](/sdk/rpc/capabilities#response-capabilities)

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const response = await provider.request({ // [!code focus]
  method: 'wallet_connect', // [!code focus]
}) // [!code focus]
```

<TryItOut
  fn={async ({ provider }) => {
    const accounts = await provider.request({
      method: 'wallet_connect',
    })

    return accounts
  }}
  requireConnection={false}
  transformResultCode={(code) => {
    return 'const response = ' + code
  }}
/>

### Grant Permissions

You can grant permissions for an Application to perform actions on behalf of the account
by providing the `grantPermissions` capability with a value.

In the example below, the Application is granted permission to perform `transfer` calls on the EXP ERC20 contract,
with a spending limit of up to `50 EXP` per minute.

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()
// ---cut---
import { parseEther, toHex } from 'viem'

const token = '0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa'

const response = await provider.request({
  method: 'wallet_connect',
  params: [{
    capabilities: {
      grantPermissions: {
        expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        feeToken: {
          limit: '1',
          symbol: 'USDC',
        },
        permissions: {
          calls: [{ 
            signature: 'transfer(address,uint256)',
            to: token,
          }],
          spend: [{ 
            limit: toHex(parseEther('50')), // 50 EXP
            period: 'minute',
            token: token,
          }],
        },
      },
    },
  }],
})
```

<TryItOut
  fn={async ({ provider }) => {
    const token = '0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa'

    const response = await provider.request({
      method: 'wallet_connect',
      params: [{
        capabilities: {
          grantPermissions: {
            expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            permissions: {
              calls: [{ to: token }],
              spend: [{ 
                limit: toHex(parseEther('50')), // 50 EXP
                period: 'minute',
                token: token,
              }],
            },
          },
        },
      }]
    })

    return response
  }}
  requireConnection={false}
  transformResultCode={(code) => {
    return 'const response = ' + code
  }}
/>
