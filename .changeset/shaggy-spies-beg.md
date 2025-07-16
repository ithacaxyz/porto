---
"porto": patch
---

**Breaking:** Removed `credentialId` from `Mode#loadAccounts`. Use `key` instead.

```diff
const mode = Mode.from({
  actions: {
    loadAccounts(parameters) {
      const { 
        address, 
-       credentialId
+       key: { credentialId } 
      } = parameters

      // ...
    }
  },
  ...
})
```
