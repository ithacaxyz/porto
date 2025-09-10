---
"porto": minor
---

**Breaking:** The `feeLimit` property on the `wallet_grantPermissions` request has been repurposed to `feeToken`, and is now required.

Instead of `feeLimit`'s currency automatically being matched with a fee token, you must now manually specify the fee token. This fee token will be used for calls that use this permission. In the future, we may have automatic inference of fee tokens for permissioned calls.

```diff
provider.request({
  method: 'wallet_grantPermissions',
  params: [{
    expiry: 1715328000,
-   feeLimit: {
-     currency: 'USD',
-     value: '1',
-   },
+   feeToken: {
+     limit: '1',
+     symbol: 'USDC',
+   },
    permissions: { ... }
  }],
})
```
