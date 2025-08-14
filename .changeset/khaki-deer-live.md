---
"porto": patch
---

**Breaking:** Split RPC calls into relay and public RPC URLs. Calls to methods prefixed with `wallet_` and `account_` are sent to the transport defined by `relay` while other methods are sent to RPCs defined by `chains` and `transports`. There is a new optional `relay` property for `Porto.create` (for most users, you will not need to set this on your own and instead just use the defaults):

```ts
import { Porto } from 'porto'
import { http } from 'viem'
 
const porto = Porto.create({ relay: http("https://rpc.ithaca.xyz") })
```

**Note:** `relay` supports multiple chains via `chainId`. If using your own relay implementation, make sure you take this into consideration.
