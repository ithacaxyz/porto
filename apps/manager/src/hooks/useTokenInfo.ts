import { Address } from 'ox'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export function useErc20Info(address?: Address.Address | undefined) {
  const { data, error, isLoading, isError, isSuccess, refetch } =
    useReadContracts({
      scopeKey: address,
      allowFailure: false,
      query: {
        refetchInterval: 10_000,
        enabled: !!address && Address.validate(address),
        select: ([name, symbol, decimals, totalSupply]) => ({
          name,
          symbol,
          decimals,
          totalSupply,
        }),
      },
      contracts: [
        { address, abi: erc20Abi, functionName: 'name' },
        { address, abi: erc20Abi, functionName: 'symbol' },
        { address, abi: erc20Abi, functionName: 'decimals' },
        { address, abi: erc20Abi, functionName: 'totalSupply' },
      ],
    })

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    refetch,
  }
}
