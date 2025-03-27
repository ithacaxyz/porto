import type { Address } from 'ox'
import { erc20Abi } from 'viem'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import { defaultAssets, ethAsset } from '~/lib/Constants'

export function useReadBalances({
  address,
  chain,
}: {
  address?: Address.Address
  chain: 'base'
}) {
  const assets = defaultAssets[chain]
  if (!assets) throw new Error(`Unsupported chain: ${chain}`)

  const account = useAccount()
  const accountAddress = address ?? account.address
  const { data: ethBalance } = useBalance({ address: accountAddress })

  const { data, isLoading, isPending, refetch } = useReadContracts({
    contracts: assets.map((asset) => ({
      abi: erc20Abi,
      address: asset.address,
      args: [accountAddress],
      functionName: 'balanceOf',
    })),
    query: {
      select: (data) => {
        const result = data.map((datum, index) => ({
          balance: BigInt(datum.result!),
          ...assets[index],
        }))

        result.unshift({ balance: ethBalance?.value ?? 0n, ...ethAsset })

        return result as ReadonlyArray<{
          balance: bigint
          logo: string
          symbol: string
          name: string
          address: string
        }>
      },
    },
  })

  return {
    data,
    refetch,
    isLoading,
    isPending,
  }
}
