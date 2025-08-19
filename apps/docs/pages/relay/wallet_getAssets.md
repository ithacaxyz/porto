# `wallet_getAssets`

Get assets for an account across supported chains.

## Request

```ts
type Request = {
  method: 'wallet_getAssets',
  params: [{
    /** Account address */
    account: `0x${string}`,
    /** Optional filter for specific assets */
    assetFilter?: {
      [chainId: `0x${string}`]: {
        address: `0x${string}` | 'native',
        type: 'native' | 'erc20' | 'erc721' | string,
      }[],
    },
    /** Optional filter for asset types */
    assetTypeFilter?: ('native' | 'erc20' | 'erc721' | string)[],
    /** Optional filter for specific chains */
    chainFilter?: number[],
  }],
}
```

## Response

```ts
type Response = {
  [chainId: string]: {
    address: `0x${string}` | 'native' | null,
    balance: bigint,
    metadata: {
      decimals: number,
      name: string,
      symbol: string,
    } | null,
    type: string,
  }[]
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.ithaca.xyz wallet_getAssets '[{"account": "0x1234567890123456789012345678901234567890"}]'
```

```json
{
  "8453": [
    {
      "address": "native",
      "balance": "0x1bc16d674ec80000",
      "metadata": {
        "decimals": 18,
        "name": "Ethereum",
        "symbol": "ETH"
      },
      "type": "native"
    },
    {
      "address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "balance": "0xf4240",
      "metadata": {
        "decimals": 6,
        "name": "USD Coin",
        "symbol": "USDC"
      },
      "type": "erc20"
    }
  ]
}
```