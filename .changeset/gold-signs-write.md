---
"porto": patch
---

**Breaking:** Removed `permissionsFeeLimit` on `Mode.rpcServer` in favor of:

- `permissionsFeeLimit` on the `Porto.create` config
- `permissionsFeeLimit` on the `porto` Wagmi connector config
- `feeLimit` on the `wallet_grantPermissions` request
- `feeLimit` on the `grantPermissions` capability