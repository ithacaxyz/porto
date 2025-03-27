import { useQuery } from '@tanstack/react-query'
import type { Address } from 'ox'
import type { Prettify } from 'viem'
import { defaultAssets, ethAsset } from '~/lib/Constants'
import { useReadBalances } from './use-read-balances'

/** returns assets with prices: default assets + assets from balances */
export function useSwapAssets({ chain }: { chain: 'base' }) {
  const { data: balances } = useReadBalances({ chain })

  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['swap-assets', 'base'] as const,
    queryFn: async ({ queryKey: [, chain] }) => {
      const defaultAssets_ = defaultAssets[chain]
      if (!defaultAssets_) return []
      if (!balances) return []

      const balancesAssets = balances.map((balance) => ({
        address: balance.address,
        symbol: balance.symbol,
        name: balance.name,
        logo: balance.logo,
        balance: balance.balance,
      }))

      try {
        const prices = await getAssetsPrices({
          chain,
          ids: defaultAssets_.map((asset) => ({
            address: asset.address,
          })),
        })

        const assets = defaultAssets_.map((asset) => ({
          ...asset,
          ...prices.coins[`${chain}:${asset.address}`],
        }))

        assets.unshift({
          ...ethAsset,
          ...(prices.coins['coingecko:ethereum'] as LlamaFiPrice),
        })

        return assets.map((_, index) => ({
          ...assets[index],
          ...balancesAssets[index],
        })) as ReadonlyArray<Prettify<AssetWithPrice>>
      } catch (error) {
        console.error(error instanceof Error ? error.message : 'Unknown error')
        return [ethAsset, ...defaultAssets_].map((asset) => ({
          ...asset,
          balance: 0n,
          price: 0,
          timestamp: 0,
          confidence: 0,
        }))
      }
    },
  })

  return { data, isLoading, isPending, refetch }
}

export interface AssetWithPrice extends LlamaFiPrice {
  logo: string
  symbol: string
  name: string
  address: Address.Address
  balance: bigint
}

async function getAssetsPrices({
  chain,
  ids,
}: { chain: 'base'; ids: Array<{ address: string }> }) {
  const searchParams = ids
    .filter(
      (asset) => asset.address !== '0x0000000000000000000000000000000000000000',
    )
    .map((asset) => `${chain}:${asset.address}`)
    .join(',')
  const response = await fetch(
    `https://coins.llama.fi/prices/current/coingecko:ethereum,${searchParams}?searchWidth=1m`,
  )

  const data = (await response.json()) as LlamaFiPrices
  return data
}

interface LlamaFiPrice {
  price: number
  symbol: string
  decimals: number
  timestamp: number
  confidence: number
}

interface LlamaFiPrices {
  coins: {
    [key: `${string}:${string}`]: LlamaFiPrice
  }
}
