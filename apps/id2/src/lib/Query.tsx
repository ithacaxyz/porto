import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export function getContext() {
  const queryClient = new QueryClient({
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

  return {
    queryClient,
  }
}

export const persister = createAsyncStoragePersister({
  key: 'porto.id',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

export function Providers(
  props: React.PropsWithChildren & {
    queryClient: QueryClient
  },
) {
  return (
    <PersistQueryClientProvider
      client={props.queryClient}
      persistOptions={{ persister }}
    >
      {props.children}
    </PersistQueryClientProvider>
  )
}
