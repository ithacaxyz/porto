import { Env } from '@porto/apps'
import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import * as Router from '~/lib/Router.js'
import { App } from './App.js'
import './styles.css'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://1b4e28921c688e2b03d1b63f8d018913@o4509056062849024.ingest.us.sentry.io/4509080371724288',
    environment: Env.get(),
    integrations: [
      Sentry.replayIntegration(),
      Sentry.tanstackRouterBrowserTracingIntegration(Router.router),
    ],
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  })
}

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
