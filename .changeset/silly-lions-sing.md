---
"porto": patch
---

**Breaking:** Removed non-version attributes from `RpcServer.health`. It now returns a `string` indicating the current version of the RPC Server. To get the previous behavior, use `RpcServer.getCapabilities` instead.
