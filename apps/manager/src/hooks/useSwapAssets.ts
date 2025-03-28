import { useQuery } from '@tanstack/react-query'
import type { Address } from 'ox'
import type { Prettify } from 'viem'

import { defaultAssets, ethAsset } from '~/lib/Constants'
import { type ChainId, getChainConfig } from '~/lib/Wagmi'
import { useReadBalances } from './useReadBalances'

/** returns assets with prices: default assets + assets from balances */
export function useSwapAssets({ chainId }: { chainId: ChainId }) {
  const { data: balances } = useReadBalances({ chainId })

  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ['swap-assets', chainId] as const,
    queryFn: async ({ queryKey: [, chainId] }) => {
      const defaultAssets_ = defaultAssets[chainId]?.filter(
        (asset) =>
          asset.address !== '0x0000000000000000000000000000000000000000',
      )
      if (!defaultAssets_ || !balances) return []

      const balancesAssets = balances.map((balance) => ({
        address: balance.address,
        symbol: balance.symbol,
        name: balance.name,
        logo: balance.logo,
        balance: balance.balance,
      }))

      try {
        const prices = await getAssetsPrices({
          chainId,
          ids: defaultAssets_.map((asset) => ({
            address: asset.address,
          })),
        })

        const assets = defaultAssets_.map((asset) => ({
          ...asset,
          ...prices.coins[`${chainId}:${asset.address}`],
        }))

        assets.unshift({
          ...ethAsset,
          ...(prices.coins['coingecko:ethereum'] as LlamaFiPrice),
        })

        const balancesMap = new Map(
          balancesAssets.map((asset) => [asset.address, asset]),
        )
        return assets.map((asset) => ({
          ...asset,
          ...balancesMap.get(asset.address),
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

export type AssetWithPrice = LlamaFiPrice & {
  address: Address.Address
  balance: bigint
  logo: string
  name: string
  symbol: string
}

async function getAssetsPrices({
  chainId,
  ids,
}: { chainId: ChainId; ids: Array<{ address: string }> }) {
  const chain = getChainConfig(chainId)
  if (!chain) throw new Error(`Unsupported chainId: ${chainId}`)
  const searchParams = ids
    .filter(
      (asset) => asset.address !== '0x0000000000000000000000000000000000000000',
    )
    .map((asset) => `${chain.name.toLowerCase()}:${asset.address}`)
    .join(',')
  const response = await fetch(
    `https://coins.llama.fi/prices/current/coingecko:ethereum,${searchParams}?searchWidth=1m`,
  )

  const data = (await response.json()) as LlamaFiPrices
  return data
}

type LlamaFiPrice = {
  confidence: number
  decimals: number
  price: number
  symbol: string
  timestamp: number
}

type LlamaFiPrices = {
  coins: {
    [key: `${string}:${string}`]: LlamaFiPrice
  }
}
