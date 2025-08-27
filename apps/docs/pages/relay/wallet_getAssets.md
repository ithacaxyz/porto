# `wallet_getAssets`

Get assets for an account across supported chains.

Implements [EIP-7811](https://eips.ethereum.org/EIPS/eip-7811) asset discovery standard.

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
    chainFilter?: `0x${string}`[],
  }],
}
```

## Response

```ts
type Response = {
  [chainId: `0x${string}`]: {
    address: `0x${string}` | 'native',
    balance: bigint,
    metadata: {
      decimals: number,
      name: string,
      symbol: string,
    } | null,
    type: 'native' | 'erc20' | 'erc721' | string,
  }[]
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.porto.sh wallet_getAssets '[{"account": "0x1234567890123456789012345678901234567890"}]' --raw
```

```json
{
  "0x2105": [
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
