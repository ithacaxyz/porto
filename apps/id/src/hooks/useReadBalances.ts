import type { Address } from 'ox'
import { erc20Abi } from 'viem'
import { useAccount, useReadContracts, useWatchBlockNumber } from 'wagmi'
import { defaultAssets } from '~/lib/Constants'

export function useReadBalances({
  address,
}: {
  address?: Address.Address | undefined
}) {
  const assets = Object.values(defaultAssets)
    .flat()
    .filter(
      (asset) => asset.address !== '0x0000000000000000000000000000000000000000',
    )

  const account = useAccount()
  const accountAddress = address ?? account.address
  // const { data: ethBalance } = useBalance({ address: accountAddress, chainId })

  const { data, isLoading, isPending, refetch } = useReadContracts({
    contracts: assets.map((asset) => ({
      abi: erc20Abi,
      address: asset.address,
      args: [accountAddress],
      functionName: 'balanceOf',
    })),
    query: {
      select: (data) => {
        return data.map((datum, index) => {
          return {
            balance:
              typeof datum.result === 'bigint'
                ? datum.result
                : BigInt(datum.result ?? 0),
            ...assets[index],
          }
        })
      },
    },
  })

  useWatchBlockNumber({
    enabled: account.status === 'connected',
    onBlockNumber: () => refetch(),
  })

  return {
    data,
    isLoading,
    isPending,
    refetch,
  }
}
