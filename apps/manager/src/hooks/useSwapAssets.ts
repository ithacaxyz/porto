import { exp1Config, exp2Config } from '@porto/apps/contracts'
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
    queryFn: async ({ queryKey: [, chainId] }) => {
      const defaultAssets_ = defaultAssets[chainId]?.filter(
        (asset) =>
          asset.address !== '0x0000000000000000000000000000000000000000',
      )
      if (!defaultAssets_ || !balances) return []

      const balancesAssets = balances.map((balance) => ({
        address: balance.address,
        balance: balance.balance,
        logo: balance.logo,
        name: balance.name,
        symbol: balance.symbol,
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
        return [ethAsset, ...defaultAssets_].map((asset) => ({
          ...asset,
          balance: 0n,
          confidence: 0,
          price: 0,
          timestamp: 0,
        }))
      }
    },
    queryKey: ['swap-assets', chainId] as const,
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

/**
 * if EXP, price is 1 USD. If EXP2 price is 100 USD
 */
async function getAssetsPrices({
  chainId,
  ids,
}: {
  chainId: ChainId
  ids: Array<{ address: string }>
}) {
  const chain = getChainConfig(chainId)
  if (!chain) throw new Error(`Unsupported chainId: ${chainId}`)
  const chainName = chain.testnet ? 'ethereum' : chain.name.toLowerCase()
  const searchParams = ids
    .filter((asset) =>
      [
        '0x0000000000000000000000000000000000000000',
        exp1Config.address.toLowerCase(),
        exp2Config.address.toLowerCase(),
      ].includes(asset.address.toLowerCase()),
    )
    .map((asset) => `${chainName}:${asset.address}`)
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
