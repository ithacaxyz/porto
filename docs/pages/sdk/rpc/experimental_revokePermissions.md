# `experimental_revokePermissions`

Revokes a permission.

## Request

```ts
type Request = {
  method: 'experimental_revokePermissions',
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

await provider.request({
  method: 'experimental_revokePermissions',
  params: [{ id: '0x...' }],
})
```
