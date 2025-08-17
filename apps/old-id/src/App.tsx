import { Query } from '@porto/apps'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from '@tanstack/react-router'
import { useAccount, WagmiProvider } from 'wagmi'

import * as Router from '~/lib/Router.tsx'
import * as Wagmi from '~/lib/Wagmi.ts'

function InnerApp() {
  const account = useAccount()

  return <RouterProvider context={{ account }} router={Router.router} />
}

export function App() {
  return (
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={Query.client}
        persistOptions={{ persister: Query.persister }}
      >
        <InnerApp />
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
