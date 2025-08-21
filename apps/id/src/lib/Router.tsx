import { Query } from '@porto/apps'
import { createRouter, ErrorComponent } from '@tanstack/react-router'
import { routeTree } from '~/routeTree.gen.ts'

export const router = createRouter({
  context: {
    queryClient: Query.client,
  },
  // TODO: add custom 404 and error pages once design is ready
  defaultErrorComponent: (props) => {
    if (props.error instanceof Error) return <div>{props.error.message}</div>

    return <ErrorComponent error={props.error} />
  },
  defaultNotFoundComponent: (_props) => <div>Not found</div>,
  /**
   * Since we're using React Query, we don't want loader calls to ever be stale
   * This will ensure that the loader is always called when the route is preloaded or visited
   */
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  routeTree,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
