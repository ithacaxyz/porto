---
"porto": patch
---

**Breaking:** Modified `wallet_authorizeKey` and `authorizeKey` capability APIs.

- Moved `key.expiry` & `key.role` properties to root level:

```diff
{
  address: '0x...',
+ expiry: 1716537600,
  key: {
-   expiry: 1716537600,
    publicKey: '0x...',
    type: 'p256',
-   role: 'admin',
  },
+ role: 'admin',
}
```

- Removed `callScopes` property in favor of `permissions.calls`:

```diff
{
- callScopes: [
+ permissions: {
+   calls: [
      {
        signature: 'mint(address,uint256)',
        to: '0x...',
      },
    ],
+ }
}
```

