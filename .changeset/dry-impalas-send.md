---
"porto": minor
---

**Breaking:**

- Renamed `merchantRpcUrl` to `merchantUrl`.

- Removed automatic `merchantUrl` inference to enhance clarity and avoid astonishment. If you have set up a Merchant API route via `Route.merchant`, you will need to explicitly pass the URL to `Porto.create(){:js}` or the `porto` Connector.

See `config.ts` below (that uses the `api/worker.ts` server):

### `config.ts`

```diff
const porto = Porto.create({
+ merchantUrl: '/porto/merchant'
})
```

### `api/worker.ts`

```ts
import { env } from 'cloudflare:workers'
import { Router, Route } from 'porto/server'

export default Router({ basePath: '/porto' })
  .route('/merchant', Route.merchant({
    address: env.MERCHANT_ADDRESS,
    key: env.MERCHANT_PRIVATE_KEY,
  }),
) satisfies ExportedHandler<Env>
```
