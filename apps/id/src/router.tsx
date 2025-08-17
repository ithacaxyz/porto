import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'
import * as RootProviders from './components/Providers'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const context = RootProviders.getContext()
  const router = createTanstackRouter({
    context: {
      account: undefined!,
      queryClient: context.queryClient,
    },
    defaultErrorComponent: (props) => {
      console.info('[router.tsx] defaultErrorComponent', props)
      return <DefaultCatchBoundary {...props} />
    },
    defaultNotFoundComponent: (props) => {
      console.info('[router.tsx] defaultNotFoundComponent', props)
      return <NotFound />
    },
    defaultPendingComponent: (props) => {
      console.info('[router.tsx] defaultPendingComponent', props)
      return <div>[router.tsx] Loading…</div>
    },
    /**
     * Since we're using React Query, we don't want loader calls to ever be stale
     * This will ensure that the loader is always called when the route is preloaded or visited
     */
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultSsr: 'data-only',
    routeTree,
    scrollRestoration: true,
    Wrap: (props) => (
      <RootProviders.RootProvider queryClient={context.queryClient}>
        {props.children}
      </RootProviders.RootProvider>
    ),
  })

  setupRouterSsrQueryIntegration({
    handleRedirects: true,
    queryClient: context.queryClient,
    router,
    wrapQueryClient: true,
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
