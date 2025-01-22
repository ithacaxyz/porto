---
"porto": patch
---

**Breaking:** Modified `wallet_authorizeKey` and `authorizeKey` capability APIs.

- Removed `key` property, and moved `key` properties to root level:

```diff
{
  address: '0x...',
- key: {
    expiry: 1716537600,
    publicKey: '0x...',
    role: 'admin',
    type: 'p256',
- },
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

