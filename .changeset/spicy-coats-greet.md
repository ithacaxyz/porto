---
"porto": patch
---

**Breaking:** Modified SIWE `authUrl` to verify & authenticate against `${path}/verify` instead of `${path}`.

```diff
- server.post('/siwe', ...
+ server.post('/siwe/verify', ...
```
