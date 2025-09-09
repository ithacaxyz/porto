import * as UI from '@porto/ui'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from '@tanstack/react-router'
import { Json } from 'ox'
import { useAccount, WagmiProvider } from 'wagmi'

import * as Router from '~/lib/Router.tsx'
import * as Wagmi from '~/lib/Wagmi.ts'

export function App() {
  const account = useAccount()
  return <RouterProvider context={{ account }} router={Router.router} />
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      queryKeyHashFn: Json.stringify,
    },
  },
})

const persister = createSyncStoragePersister({
  key: 'porto.id',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

export function Providers(props: React.PropsWithChildren) {
  return (
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={client}
        persistOptions={{ persister }}
      >
        <UI.Ui>{props.children}</UI.Ui>
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
