import { createMiddleware, createStart } from '@tanstack/react-start'

const globalMiddleware = createMiddleware({ type: 'function' })
  .client((options) => {
    const timestamp = Date.now()
    console.info(`[client-${timestamp}]`, options.functionId)
    return options.next()
  })
  .server((options) => {
    const timestamp = Date.now()
    console.info(`[server-${timestamp}]`, options.functionId)
    return options.next()
  })

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [globalMiddleware],
  }
})
