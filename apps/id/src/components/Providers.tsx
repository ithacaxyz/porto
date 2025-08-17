import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Json } from 'ox'
import { WagmiProvider } from 'wagmi'
import * as Wagmi from '~/lib/Wagmi'

export function getContext() {
  const client: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1_000 * 60 * 60 * 24, // 24 hours
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
  return {
    queryClient: client,
  }
}

export const persister = createAsyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

export function RootProvider(props: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={props.queryClient}
        persistOptions={{ persister }}
      >
        {props.children}
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
