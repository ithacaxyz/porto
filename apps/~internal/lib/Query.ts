import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { Json } from 'ox'

export const client: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      queryKeyHashFn: Json.stringify,
      refetchOnReconnect: () => !client.isMutating(),
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      if (import.meta.env.MODE !== 'development') return
      console.error(error)
    },
  }),
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (import.meta.env.MODE !== 'development') return
      if (query.state.data !== undefined) console.error(error)
    },
  }),
})

export const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})
