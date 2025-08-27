# `wallet_addFaucetFunds`

Development-only JSON-RPC to request faucet funds on supported testnets. Intended for local/testing flows and not for production usage.

- Availability: testnets only (subject to rate limits)
- Supported networks: Base Sepolia (`84532`), Optimism Sepolia (`11155420`)

## Request

```ts
import { Address } from 'viem'

type Request = {
  method: 'wallet_addFaucetFunds',
  params: [{
    address: Address
    chainId: number
    /** Token to mint (required) */
    tokenAddress: Address
    /** Amount to mint (defaults to 25) */
    value?: number
  }]
}
```

## Response

```ts
import { Hash } from 'viem'

type Response = {
  /** Mint transaction hash */
  id: Hash
}
```

## Examples

```sh
cast rpc --rpc-url https://rpc.porto.sh \
  wallet_addFaucetFunds '[{"address":"0xYourAddress","chainId":84532,"tokenAddress":"0x3a9b126bf65c518f1e02602bd77bd1288147f94c","value":25}]' --raw
```

```sh
cast rpc --rpc-url https://rpc.porto.sh \
  wallet_addFaucetFunds '[{"address":"0xYourAddress","chainId":11155420,"tokenAddress":"0x6795f10304557a454b94a5c04e9217677cc9b598"}]' --raw
```

## Notes

- Development-only; expect rate limiting per address and IP.
- Backed by the Service faucet. See implementation reference in `apps/service/src/routes/faucet.ts`.
