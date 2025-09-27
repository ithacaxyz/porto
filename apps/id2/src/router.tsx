import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import * as Query from '~/lib/Query.ts'
import { routeTree } from '~/routeTree.gen.ts'

export function getRouter() {
  const router = createRouter({
    context: { queryClient: Query.client },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    defaultPreload: 'intent',
    routeTree,
    scrollRestoration: true,
  })
  setupRouterSsrQueryIntegration({
    queryClient: Query.client,
    router,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
