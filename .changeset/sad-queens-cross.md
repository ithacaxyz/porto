---
"porto": patch
---

**Breaking:** Removed `wallet_createAccount`. Use `wallet_connect` with the `createAccount` capability instead.

```diff
provider.request({
- method: 'wallet_createAccount',
+ method: 'wallet_connect',
+ params: [
+   {
+     capabilities: {
+       createAccount: true,
+     },
+   },
+ ],
})
```
