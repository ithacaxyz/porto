import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, UseQueryResult } from '@tanstack/react-query'
import * as React from 'react'

export const client: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnReconnect: () => !client.isMutating(),
      retry: 0,
    },
  },
})

export const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

export function useQueryWithPersistedError<data, error>(
  query: UseQueryResult<data, error>,
) {
  const previousError = React.useRef<error | null>(null)
  React.useEffect(() => {
    previousError.current = query.error
  }, [query.error])
  const error = (query.isFetching && previousError.current) || query.error

  // Return a proxy to the query to keep React Query's tracked values.
  return new Proxy(query, {
    get(target, prop) {
      if (prop === 'error') return error
      if (prop === 'isError') return !!error
      return target[prop as keyof typeof target]
    },
  })
}
