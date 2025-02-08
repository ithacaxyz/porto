import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Address, type Hex, Json, Value } from 'ox'
import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { ExperimentERC20 } from './contracts.ts'

const APP_SERVER_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:6900'
  : 'https://offline-server-example.evm.workers.dev'

export function useBalance() {
  const { address } = useAccount()
  const { data: balance } = useReadContract({
    args: [address!],
    ...ExperimentERC20,
    functionName: 'balanceOf',
    query: { enabled: !!address, refetchInterval: 2_000 },
  })

  return `${Value.formatEther(balance ?? 0n)} EXP`
}

export interface DebugData {
  transactions: Array<{
    id: number
    role: 'session' | 'admin'
    created_at: string
    address: Address.Address
    hash: Address.Address
    public_key: Hex.Hex
  }>
  key: {
    account: Address.Address
    privateKey: Address.Address
  }
}

export function useDebug({
  address,
  enabled = false,
}: {
  address?: Address.Address
  enabled?: boolean
}) {
  const { address: _address = address } = useAccount()
  return useQuery<DebugData>({
    queryKey: ['debug', address],
    refetchInterval: (_) => 5_000,
    enabled: !!address && Address.validate(address) && enabled,
    queryFn: async () => {
      const response = await fetch(`${APP_SERVER_URL}/debug?address=${address}`)
      const result = await Json.parse(await response.text())
      return result as DebugData
    },
  })
}

export function useClearLocalStorage() {
  const queryClient = useQueryClient()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // on `d` press
    window.addEventListener('keydown', (event) => {
      if (event.key === 'd') {
        // clear everything
        queryClient.clear()
        queryClient.resetQueries()
        queryClient.removeQueries()
        queryClient.invalidateQueries()
        queryClient.unmount()
        window.localStorage.clear()
        window.sessionStorage.clear()
        window.location.reload()
      }
    })
  }, [])
}
