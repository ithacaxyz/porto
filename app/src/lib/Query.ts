import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

export const client: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 0,
      refetchOnReconnect: () => !client.isMutating(),
    },
  },
  /**
   * @see https://tkdodo.eu/blog/react-query-error-handling#putting-it-all-together
   */
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (import.meta.env.MODE !== 'development') return
      if (query.state.data !== undefined) {
        console.error(error)
      }
    },
  }),
  mutationCache: new MutationCache({
    onSettled: () => {
      if (client.isMutating() === 1) {
        return client.invalidateQueries()
      }
    },
  }),
})

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
})
