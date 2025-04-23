import { Query } from '@porto/apps'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '~/routeTree.gen.ts'

export const router = createRouter({
  context: {
    queryClient: Query.client,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  /**
   * Since we're using React Query, we don't want loader calls to ever be stale
   * This will ensure that the loader is always called when the route is preloaded or visited
   */
  routeTree,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
