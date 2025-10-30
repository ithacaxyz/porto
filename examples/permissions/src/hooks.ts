import type { Address } from 'ox'
import { useAccount, useReadContract } from 'wagmi'

import { exp1Config } from './contracts'

export function useBalance(props?: { address?: Address.Address | undefined }) {
  const { address } = useAccount()
  const { data: balance, refetch } = useReadContract({
    abi: exp1Config.abi,
    address: exp1Config.address,
    args: [props?.address || address!],
    functionName: 'balanceOf',
  })

  return {
    balance,
    refetch,
  }
}
