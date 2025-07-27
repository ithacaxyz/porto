---
"porto": patch
---

Added ability to individually pass authentication endpoints to `signInWithEthereum.authUrl`, instead
of defining the group path (e.g. `/auth/*`).

```diff
connect({
  signInWithEthereum: {
-   authUrl: '/auth'
+   authUrl: {
+     logout: '/logout',
+     nonce: '/auth/nonce',
+     verify: '/auth',
+   },
  },
})
```
