# `wallet_disconnect`

Disconnects the Application from Porto.

## Request

```ts
type Request = {
  method: 'wallet_disconnect',
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

await provider.request({ // [!code focus]
  method: 'wallet_disconnect', // [!code focus]
}) // [!code focus]
```