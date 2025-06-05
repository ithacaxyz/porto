---
"porto": patch
---

**Breaking (`porto/viem`):** Renamed `ContractActions.prepareExecute#signPayloads` to `ContractActions.prepareExecute#digests` parameter, and changed the type to be an object instead of an array.

```diff
ContractActions.prepareExecute({
  ...
- digests: ['0x...', '0x...']
+ digests: {
+   auth: '0x...',
+   exec: '0x...',
+ },
})
```
