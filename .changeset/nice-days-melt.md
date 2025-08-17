---
"porto": patch
---

**Breaking:** Renamed "RPC Server"/"Server" terminology to "Relay".

```diff
import {
  Mode,
- ServerActions,
- ServerClient,
+ RelayActions,
+ RelayClient,
} from 'porto'

- Mode.rpcServer(...)
+ Mode.relay(...)
```
