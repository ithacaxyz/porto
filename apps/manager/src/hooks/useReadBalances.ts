import { PortoConfig } from '@porto/apps'
import type { Address } from 'ox'
import { erc20Abi } from 'viem'
import {
  useAccount,
  useBalance,
  useReadContracts,
  useWatchBlockNumber,
} from 'wagmi'

import { defaultAssets, ethAsset } from '~/lib/Constants'

export function useReadBalances({
  address,
  chainId,
}: {
  address?: Address.Address | undefined
  chainId: PortoConfig.ChainId
}) {
  const assets = defaultAssets[chainId]?.filter(
    (asset) => asset.address !== '0x0000000000000000000000000000000000000000',
  )
  if (!assets) throw new Error(`Unsupported chainId: ${chainId}`)

  const account = useAccount()
  const accountAddress = address ?? account.address
  const { data: ethBalance } = useBalance({ address: accountAddress, chainId })

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
