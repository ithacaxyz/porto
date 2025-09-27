import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { Json } from 'ox'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { routeTree } from '~/routeTree.gen.ts'

export function getRouter() {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1_000 * 60 * 60 * 24, // 24 hours
        queryKeyHashFn: Json.stringify,
        refetchOnReconnect: () => !queryClient.isMutating(),
        retry: 0,
        staleTime: (_) => 60 * 1_000, // 1 minute
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

  const router = createRouter({
    context: {
      queryClient,
    },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    defaultPreload: 'intent',
    routeTree,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
