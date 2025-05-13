---
"porto": patch
---

**Breaking:** Removed `default` & `relay` attributes from `transports`. Use a single transport instead.

```diff
Porto.create({
  ...
  transports: {
-   1: { 
-     default: http('https://rpc.example.com'),
-     relay: http('https://relay.example.com')
-   },
+   1: http('https://rpc.example.com')
  },
})
```
