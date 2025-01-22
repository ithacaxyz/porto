---
"porto": patch
---

Added Spend Permissions via `permissions.spend` property on `wallet_authorizeKey` RPC and the `authorizeKey` capability.

Example:

```ts
const key = await porto.provider.request({
  method: 'experimental_authorizeKey',
  params: [{ 
    permissions: {
      spend: [{
        limit: 100_000_000n, // 100 USDC
        period: 'day',
        token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      }]
    },
  }],
})
```