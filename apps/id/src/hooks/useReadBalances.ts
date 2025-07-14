import type { PortoConfig } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import { type Address, Hex } from 'ox'
import { Hooks } from 'porto/remote'
import { erc20Abi, zeroAddress } from 'viem'
import {
  useAccount,
  useBalance,
  useReadContracts,
  useWatchBlockNumber,
} from 'wagmi'

import { ethAsset } from '~/lib/Constants'
import { porto } from '~/lib/Porto'

export function useWalletCapabilities(props: useWalletCapabilities.Props) {
  const account = useAccount()
  const accountAddress = props.address ?? account.address

  const walletClient = Hooks.useWalletClient(porto as any)
  return useQuery({
    queryFn: async () => {
      const chainId = Hex.fromNumber(props.chainId)
      const result = await walletClient.request({
        method: 'wallet_getCapabilities',
        params: [accountAddress, [chainId]],
      })

      return result[chainId]?.feeToken.tokens ?? []
    },
    queryKey: ['wallet-capabilities', accountAddress],
    select: (data) => data?.filter((token) => token.address !== zeroAddress),
  })
}

export declare namespace useWalletCapabilities {
  type Props = {
    address?: Address.Address | undefined
    chainId: PortoConfig.ChainId
  }
}

export function useReadBalances({
  address,
  chainId,
}: {
  address?: Address.Address | undefined
  chainId: PortoConfig.ChainId
}) {
  const { data: assets } = useWalletCapabilities({ address, chainId })

  const account = useAccount()
  const accountAddress = address ?? account.address
  const { data: ethBalance } = useBalance({ address: accountAddress, chainId })

  const { data, isLoading, isPending, refetch } = useReadContracts({
    contracts: assets?.map((asset) => ({
      abi: erc20Abi,
      address: asset.address,
      args: [accountAddress],
      functionName: 'balanceOf',
    })),
    query: {
      select: (data) => {
        const result = data.map((datum, index) => ({
          balance:
            typeof datum.result === 'bigint'
              ? datum.result
              : BigInt(datum.result ?? 0),
          ...assets?.[index],
        }))

        result.unshift({ balance: ethBalance?.value ?? 0n, ...ethAsset })

        return result
      },
    },
  })

  useWatchBlockNumber({
    enabled: account.status === 'connected',
    onBlockNumber: () => refetch(),
  })

  return {
    data: data ?? [],
    isLoading,
    isPending,
    refetch,
  }
}
