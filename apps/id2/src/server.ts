import Handler from '@tanstack/react-start/server-entry'

console.info('[server-entry]')

export default {
  fetch: async (request: Request): Promise<Response> => Handler.fetch(request),
} satisfies typeof Handler
