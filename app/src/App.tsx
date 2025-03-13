import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from '@tanstack/react-router'
import { WagmiProvider } from 'wagmi'

import * as Query from './lib/Query.ts'
import * as Router from './lib/Router.ts'
import * as Wagmi from './lib/Wagmi.ts'

export function App() {
  return (
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={Query.client}
        persistOptions={{ persister: Query.persister }}
      >
        <RouterProvider router={Router.router} />
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
