import { useQuery } from '@tanstack/react-query'
import type { Address } from 'ox'
import * as React from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { useAccount } from 'wagmi'
import { ExperimentERC20 } from '~/lib/Constants'

export function useTokenBalance({
  chainId,
  contractAddress,
}: {
  chainId: number
  contractAddress: Address.Address
}) {
  const account = useAccount()

  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        address: account.address,
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
      },
      {
        address: contractAddress,
        abi: ExperimentERC20.abi,
        functionName: 'decimals',
      },
      {
        address: contractAddress,
        abi: ExperimentERC20.abi,
        functionName: 'symbol',
      },
    ],
  })
}
