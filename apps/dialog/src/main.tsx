import { Env, Porto } from '@porto/apps'
import * as Sentry from '@sentry/react'
import { Dialog as Dialog_porto } from 'porto'
import { Actions, Events } from 'porto/remote'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import * as Dialog from '~/lib/Dialog.ts'
import * as Router from '~/lib/Router.ts'
import { App } from './App.js'
import './styles.css'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://457697aad11614a3f667c8e61f6b9e20@o4509056062849024.ingest.us.sentry.io/4509080285741056',
    environment: Env.get(),
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(Router.router),
    ],
  })
}

const porto = Porto.porto

const offInitialized = Events.onInitialized(porto, (payload) => {
  const { mode, referrer } = payload
  Dialog.store.setState({
    mode,
    referrer: {
      ...referrer,
      origin: new URL(referrer.origin),
    },
  })
})

const offRequests = Events.onRequests(porto, (requests) => {
  const request = requests[0]?.request
  if (request && !Dialog_porto.requiresConfirmation(request)) {
    Actions.respond(porto, request)
    return
  }
  Router.router.navigate({
    search: request as never,
    to: '/dialog/' + (request?.method ?? ''),
  })
})

porto.ready()

const rootElement = document.querySelector('div#root')

if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement, {
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack)
  }),
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.hot)
  import.meta.hot.on('vite:beforeUpdate', () => {
    offInitialized()
    offRequests()
  })

document.addEventListener('keydown', (event) => {
  // ⌥ + 1: light/dark mode
  if (event.altKey && event.code === 'Digit1') {
    if (document.documentElement.classList.contains('scheme-light-dark')) {
      document.documentElement.classList.replace(
        'scheme-light-dark',
        'scheme-dark',
      )
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: '__porto_theme',
          newValue: 'light',
          storageArea: window.localStorage,
        }),
      )
    }
    if (document.documentElement.classList.contains('scheme-light')) {
      document.documentElement.classList.replace(
        'scheme-light',
        'scheme-light-dark',
      )
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: '__porto_theme',
          newValue: 'dark',
          storageArea: window.localStorage,
        }),
      )
    } else if (document.documentElement.classList.contains('scheme-dark')) {
      document.documentElement.classList.replace('scheme-dark', 'scheme-light')
    } else {
      let themePreference = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      themePreference = themePreference === 'dark' ? 'light' : 'dark'
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: '__porto_theme',
          newValue: themePreference,
          storageArea: window.localStorage,
        }),
      )

      document.documentElement.classList.remove(
        'scheme-light',
        'scheme-light-dark',
      )
      document.documentElement.classList.add('scheme-light')
    }
  }

  // ⌥ + 2: toggle dialog mode
  if (event.altKey && event.code === 'Digit2') {
    document.documentElement.toggleAttribute('data-dialog')
  }

  // ⌥ + h: hide dev tools
  if (event.altKey && event.code === 'KeyH') {
    const devToolsElement = document.querySelector(
      'button[aria-label="Open TanStack Router Devtools"]',
    )
    if (devToolsElement) devToolsElement.hidden = !devToolsElement.hidden

    const devTools = document.querySelector('div[data-item="dev-tools"]')
    if (devTools) devTools.hidden = !devTools.hidden
  }
})

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
