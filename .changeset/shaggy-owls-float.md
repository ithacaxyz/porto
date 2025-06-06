---
"porto": patch
---

**Breaking (`porto/viem`):** Modified `ContractActions.execute#signatures` parameter to be an object instead of an array.

```diff
ContractActions.execute({
  ...
- signatures: ['0x...', '0x...']
+ signatures: {
+   auth: '0x...',
+   exec: '0x...',
+ },
})
```
