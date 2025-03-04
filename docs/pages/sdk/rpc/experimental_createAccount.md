# `experimental_createAccount`

Creates a new Account.

## Request

```ts
type Request = {
  method: 'experimental_createAccount',
  params: [{ 
    /** Chain ID to create the account on. */
    chainId?: Hex.Hex
    /** Label for the account. Used as the Passkey credential display name. */
    label?: string 
  }]
}
```

## Response

Address of the created account.

```ts
type Response = `0x${string}`
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const address = await provider.request({ // [!code focus]
  method: 'experimental_createAccount', // [!code focus]
  params: [{ label: 'My Example Account' }], // [!code focus]
}) // [!code focus]
```
