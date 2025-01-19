import {
  QueryCache,
  QueryClient,
  MutationCache,
  QueryClientProvider,
} from '@tanstack/svelte-query'
import { browser } from '$app/environment'
import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export function createQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnReconnect: () => !queryClient.isMutating(),
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (import.meta.env.MODE !== 'development') return
        if (query.state.data !== undefined) {
          console.info('Tanstack Query Error: ', error)
        }
      },
    }),
    mutationCache: new MutationCache({
      // @ts-ignore
      onSettled: () => {
        if (queryClient.isMutating() === 1) {
          return queryClient.invalidateQueries()
        }
      },
    }),
  })

  const localStoragePersister = createSyncStoragePersister({
    key: 'SVELTE_QUERY',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined, // Use local storage if in browser
  })

  return {
    queryClient,
    QueryClientProvider,
    localStoragePersister,
    PersistQueryClientProvider,
  }
}
