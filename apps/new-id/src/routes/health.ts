import { createServerFileRoute } from '@tanstack/react-start/server'

export const ServerRoute = createServerFileRoute('/health').methods({
  GET: async () => Response.json({ message: 'OK', version: __APP_VERSION__ }),
})
