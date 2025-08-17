import * as Sentry from '@sentry/react'
import { StartClient } from '@tanstack/react-start'
import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createRouter } from '~/router.tsx'

const router = createRouter()

hydrateRoot(
  document,
  <React.StrictMode>
    <StartClient router={router} />
  </React.StrictMode>,
  {
    identifierPrefix: 'porto_id_',
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.warn('Uncaught error', error, errorInfo.componentStack)
    }),
  },
)
