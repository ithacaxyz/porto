import { Address } from 'ox'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export type TokenStandard = { standard: 'ERC20' } | { standard: 'ERC721' }

/**
 * Simplified: call `decimals()` via useReadContracts.
 * If it returns a number → ERC-20, otherwise → ERC-721.
 */
export function useTokenStandard(address?: Address.Address) {
  const response = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address,
        functionName: 'decimals',
      },
    ],
    query: {
      enabled: !!address && Address.validate(address),
      refetchInterval: 10_000,
      select: ([decimals]) =>
        decimals != null
          ? ({ standard: 'ERC20' } as TokenStandard)
          : ({ standard: 'ERC721' } as TokenStandard),
    },
    scopeKey: address,
  })

  if (response.data?.standard === 'ERC20') {
    return { standard: 'ERC20' } as TokenStandard
  }
  return { standard: 'ERC721' } as TokenStandard
}
