import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from '~/router'

function defineHandler(
  handler: (context: { request: Request }) => Promise<Response> | Response,
) {
  return handler
}

export default defineHandler((event) => {
  const startHandler = createStartHandler({
    createRouter,
  })(defaultStreamHandler)

  return startHandler(event)
})
