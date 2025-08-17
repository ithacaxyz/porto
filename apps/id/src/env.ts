import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  client: {
    VITE_VERCEL_ENV: z
      .enum(['production', 'preview', 'development'])
      .optional(),
  },
  clientPrefix: 'VITE_',
  emptyStringAsUndefined: true,
  runtimeEnv: {
    SENTRY_AUTH_TOKEN: import.meta.env.SENTRY_AUTH_TOKEN,
    VERCEL_ENV: import.meta.env.VERCEL_ENV,
    VERCEL_GIT_COMMIT_SHA: import.meta.env.VERCEL_GIT_COMMIT_SHA,
    VITE_VERCEL_ENV: import.meta.env.VITE_VERCEL_ENV,
  },
  server: {
    SENTRY_AUTH_TOKEN: z.string().optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  },
})
