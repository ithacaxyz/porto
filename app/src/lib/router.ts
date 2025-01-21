import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen.ts'

export const router = createRouter({
  defaultPreload: 'intent',
  context: {
    portoState: undefined as never,
  },
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
