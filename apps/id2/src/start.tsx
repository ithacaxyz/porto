import { createStart } from '@tanstack/react-start'

declare module '@tanstack/react-start' {
  interface Register {
    server: {
      requestContext: {
        fromFetch: boolean
      }
    }
  }
}

export const startInstance = createStart(() => ({
  defaultSsr: true,
}))

startInstance.createMiddleware().server((options) => {
  return options.next({
    context: {
      ...options.context,
      fromStartInstanceMw: true,
    },
  })
})
