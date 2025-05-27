import { Address } from 'ox'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export function useErc20Info(address?: Address.Address | undefined) {
  return useReadContracts({
    allowFailure: false,
    contracts: [
      { abi: erc20Abi, address, functionName: 'name' },
      { abi: erc20Abi, address, functionName: 'symbol' },
      { abi: erc20Abi, address, functionName: 'decimals' },
      { abi: erc20Abi, address, functionName: 'totalSupply' },
    ],
    query: {
      enabled: !!address && Address.validate(address),
      refetchInterval: 10_000,
      select: ([name, symbol, decimals, totalSupply]) => ({
        decimals,
        name,
        symbol,
        totalSupply,
      }),
    },
    scopeKey: address,
  })
}
