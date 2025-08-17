import {
  createMiddleware,
  registerGlobalMiddleware,
} from '@tanstack/react-start'

const middleware = createMiddleware({ type: 'function' })
  .client(async (options) => {
    console.info('client', options)
    return options.next({
      sendContext: { foo: 'bar' },
    })
  })
  .server(async (options) => {
    console.info('server', options)
    return options.next()
  })

registerGlobalMiddleware({
  middleware: [middleware],
})
