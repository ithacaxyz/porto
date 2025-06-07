import { useQueries } from '@tanstack/react-query'
import { Address } from 'ox/Address'
import { useMemo } from 'react'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export function useEnsNames(addresses: string[]) {
  const client = useMemo(
    () =>
      createPublicClient({
        chain: mainnet,
        transport: http(),
      }),
    [],
  )

  const uniqueAddrs = useMemo(
    () => Array.from(new Set(addresses.filter(Boolean))),
    [addresses],
  )

  const queries = useQueries({
    queries: uniqueAddrs.map((addr) => ({
      enabled: Boolean(addr),
      queryFn: () => client.getEnsName({ address: addr as Address }),
      queryKey: ['ensName', addr],
      staleTime: 1000 * 60 * 5,
    })),
  })

  return useMemo(() => {
    const map: Record<string, string | null> = {}
    uniqueAddrs.forEach((addr, i) => {
      map[addr] = queries[i]?.data ?? null
    })
    return map
  }, [queries, uniqueAddrs])
}
