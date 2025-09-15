import * as UI from '@porto/ui'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from '@tanstack/react-router'
import { useAccount, WagmiProvider } from 'wagmi'
import * as Query from '~/lib/Query.ts'

import * as Router from '~/lib/Router.tsx'
import * as Wagmi from '~/lib/Wagmi.ts'

export function App() {
  const account = useAccount()
  return <RouterProvider context={{ account }} router={Router.router} />
}

export function Providers(props: React.PropsWithChildren) {
  return (
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={Query.client}
        persistOptions={{ persister: Query.persister }}
      >
        <UI.Ui>{props.children}</UI.Ui>
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
