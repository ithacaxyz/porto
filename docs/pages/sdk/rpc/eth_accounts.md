# `eth_accounts`

Returns an array of all **connected** Account addresses.

## Request

```ts
type Request = {
  method: 'eth_accounts',
}
```

## Response

Array of connected Account addresses.

```ts
type Response = `0x${string}`[]
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const accounts = await provider.request({ method: 'eth_accounts' }) // [!code focus]
```

