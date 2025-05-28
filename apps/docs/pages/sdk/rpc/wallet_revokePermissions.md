# `wallet_revokePermissions`

Revokes a permission.

## Request

```ts
type Request = {
  method: 'wallet_revokePermissions',
  params: [{
    /** Address of the account to revoke a permission on. */
    address?: `0x${string}`
    /** ID of the permission to revoke. */
    id: `0x${string}`
  }]
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

await provider.request({ // [!code focus]
  method: 'wallet_revokePermissions', // [!code focus]
  params: [{ id: '0x...' }], // [!code focus]
}) // [!code focus]
```
