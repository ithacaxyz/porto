---
"porto": patch
---

Added an inclusive "fee limit" (defaults to **$1 USD**) to all permissions requests. 
This is a spend permission that will be used to pay for fees used by permissions
in the user's selected fee token (e.g. USDC).

This spend permission can be configured via the `permissionsFeeLimit` property on the
Porto config:

```ts
// Assign a $5 USD fee limit (on top of spend permissions) to all permissions requests.
const porto = Porto.create({
  permissionsFeeLimit: {
    currency: 'USD',
    value: '5',
  },
})

// Make the fee limit inclusive with the spend permissions.
const porto = Porto.create({
  permissionsFeeLimit: 'include',
})
```

You can also override the fee limit on the configuration above, or provide it on a per-request basis
using the `feeLimit` property on `wallet_grantPermissions`:

```ts
provider.request({
  method: 'wallet_grantPermissions',
  params: [
    {
      expiry: 1715328000,
      feeLimit: {
        currency: 'USD',
        value: '5',
      },
      permissions: {
        calls: [{ signature: 'mint()' }],
      },
    }
  ]
})
```