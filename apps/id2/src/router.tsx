import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { WagmiProvider } from 'wagmi'

import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary.tsx'
import { NotFound } from '~/components/NotFound.tsx'
import * as Query from '~/lib/Query.tsx'
import * as Wagmi from '~/lib/Wagmi.ts'
import { routeTree } from '~/routeTree.gen.ts'

export function getRouter() {
  const rqContext = Query.getContext()

  const router = createRouter({
    context: {
      ...rqContext,
    },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    defaultPreload: 'intent',
    routeTree,
    scrollRestoration: true,
    Wrap: (props) => (
      <WagmiProvider config={Wagmi.config}>
        <Query.Providers {...rqContext}>{props.children}</Query.Providers>
      </WagmiProvider>
    ),
  })

  setupRouterSsrQueryIntegration({ queryClient: rqContext.queryClient, router })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
