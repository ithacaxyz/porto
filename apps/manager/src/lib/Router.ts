import { createRouter } from '@tanstack/react-router'

import { routeTree } from '~/routeTree.gen.ts'

export const router = createRouter({
  context: {
    account: undefined as never,
  },
  defaultPreload: 'intent',
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
