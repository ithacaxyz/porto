# `wallet_feeTokens`

Get supported fee tokens for all chains.

## Request

```ts
type Request = {
  method: 'wallet_feeTokens',
}
```

## Response

```ts
type Response = {
  [chainId: `0x${string}`]: {
    address: `0x${string}`,
    decimals: number,
    nativeRate?: bigint,
    symbol: string,
  }[]
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.ithaca.xyz wallet_feeTokens
```

```json
{
  "0x8453": [
    {
      "address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "decimals": 6,
      "nativeRate": "0x8ac7230489e80000",
      "symbol": "USDC"
    },
    {
      "address": "0x0000000000000000000000000000000000000000",
      "decimals": 18,
      "nativeRate": "0xde0b6b3a7640000",
      "symbol": "ETH"
    }
  ]
}
```