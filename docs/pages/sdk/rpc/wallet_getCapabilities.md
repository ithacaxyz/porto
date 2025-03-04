# `wallet_getCapabilities`

Gets supported capabilities of Porto.

## Request

```ts
type Request = {
  method: 'wallet_getCapabilities',
}
```

## Response

```ts
type Response = {
  capabilities: {
    atomicBatch: {
      supported: true
    }
    createAccount: {
      supported: true
    },
    permissions: {
      supported: true
    }
  }
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const capabilities = await provider.request({ // [!code focus]
  method: 'wallet_getCapabilities', // [!code focus]
}) // [!code focus]
```