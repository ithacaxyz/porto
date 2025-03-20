import { Query } from '@porto/apps'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from '@tanstack/react-router'

import * as Router from '~/lib/Router'

export function App() {
  return (
    <PersistQueryClientProvider
      client={Query.client}
      persistOptions={{ persister: Query.persister }}
    >
      <RouterProvider router={Router.router} />
    </PersistQueryClientProvider>
  )
}
