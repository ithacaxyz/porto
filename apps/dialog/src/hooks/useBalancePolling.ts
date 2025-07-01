import type Address from 'ox/Address'
import { Chains } from 'porto'
import * as React from 'react'
import { erc20Abi } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

export function useBalancePolling(props: useBalancePolling.Props) {
  const {
    enabled = false,
    onBalanceUpdate,
    pollingInterval = 3000, // Start with 3 seconds
    maxPollingDuration = 300000, // 5 minutes max
    tokenAddress = BASE_USDC_ADDRESS,
    chainId = Chains.base.id,
  } = props

  const account = useAccount()

  const [startTime] = React.useState(() => Date.now())
  const [currentInterval, setCurrentInterval] = React.useState(pollingInterval)
  const previousBalanceRef = React.useRef<bigint | null>(null)

  // Calculate if we should still be polling
  const shouldPoll = enabled && Date.now() - startTime < maxPollingDuration

  const { data, refetch } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    args: account.address ? [account.address] : undefined,
    // @ts-expect-error - wagmi types are wrong
    chainId,
    functionName: 'balanceOf',
    query: {
      enabled: shouldPoll && !!account.address,
      refetchInterval: shouldPoll ? currentInterval : false,
    },
  })

  // Check for balance updates
  React.useEffect(() => {
    if (data !== null && data !== undefined) {
      if (
        previousBalanceRef.current !== null &&
        data > previousBalanceRef.current
      ) {
        onBalanceUpdate?.(data, previousBalanceRef.current)
      }
      previousBalanceRef.current = data
    }
  }, [data, onBalanceUpdate])

  // Implement exponential backoff
  React.useEffect(() => {
    if (!shouldPoll) return

    const timer = setTimeout(() => {
      // Increase interval with exponential backoff (max 30 seconds)
      setCurrentInterval((prev) => Math.min(prev * 1.5, 30000))
    }, currentInterval)

    return () => clearTimeout(timer)
  }, [currentInterval, shouldPoll])

  return {
    balance: data,
    isPolling: shouldPoll,
    refetch,
  }
}

export declare namespace useBalancePolling {
  export type Props = {
    enabled?: boolean
    onBalanceUpdate?: (newBalance: bigint, previousBalance: bigint) => void
    pollingInterval?: number
    maxPollingDuration?: number
    tokenAddress?: Address.Address
    chainId?: number
  }
}
