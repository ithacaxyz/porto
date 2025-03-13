---
"porto": patch
---

**Breaking:** Renamed `"contract"` to `"address"` on `key.type` on the `grantPermissions` capability & `wallet_grantPermissions` method.

Example:

```diff
type Request = {
  method: 'experimental_grantPermissions',
  params: [{
    // ...
    key?: {
      publicKey?: `0x${string}`,
-     type?: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256', 
+     type?: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256', 
    }
  }]
}
```
