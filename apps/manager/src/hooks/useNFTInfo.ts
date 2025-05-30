import { Address } from 'ox'
import { erc721Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export function useNFTInfo(address?: Address.Address | undefined) {
  return useReadContracts({
    allowFailure: false,
    contracts: [
      { abi: erc721Abi, address, functionName: 'name' },
      { abi: erc721Abi, address, functionName: 'symbol' },
    ],
    query: {
      enabled: !!address && Address.validate(address),
      refetchInterval: 10_000,
      select: ([name, symbol]) => ({
        name,
        symbol,
      }),
    },
    scopeKey: address,
  })
}
