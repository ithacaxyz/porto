import { Events } from 'porto/remote'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.js'
import * as Dialog from './lib/Dialog.ts'
import { porto } from './lib/Porto.ts'
import * as Router from './lib/Router.ts'
import './index.css'

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
  Router.router.navigate({
    to: '/dialog/' + (request?.method ?? ''),
    search: request?.params as never,
  })
})

porto.ready()

const rootElement = document.querySelector('div#root')

if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.hot && import.meta.env.VITE_LAUNCH_MODE !== 'app')
  import.meta.hot.on('vite:beforeUpdate', () => {
    offInitialized()
    offRequests()
  })

if (
  import.meta.env.DEV ||
  import.meta.env.VERCEL_ENV === 'preview' ||
  import.meta.env.VERCEL_ENV === 'development'
) {
  document.addEventListener('keydown', (event) => {
    // ⌥ + 1: light/dark mode
    if (event.altKey && event.code === 'Digit1') {
      if (document.documentElement.classList.contains('scheme-light')) {
        document.documentElement.classList.replace(
          'scheme-light',
          'scheme-light-dark',
        )
      } else if (document.documentElement.classList.contains('scheme-dark')) {
        document.documentElement.classList.replace(
          'scheme-dark',
          'scheme-light',
        )
      } else {
        let themePreference = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        themePreference = themePreference === 'dark' ? 'light' : 'dark'

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
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
