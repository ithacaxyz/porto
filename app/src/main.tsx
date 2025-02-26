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

if (import.meta.hot)
  import.meta.hot.on('vite:beforeUpdate', () => {
    offInitialized()
    offRequests()
  })

if (import.meta.env.DEV) {
  let theme = 'system'
  document.addEventListener('keydown', (event) => {
    // ⌥ + 1: light/dark mode
    if (event.altKey && event.code === 'Digit1') {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme = isDark ? 'dark' : 'light'
      } else theme = theme === 'dark' ? 'light' : 'dark'

      document.documentElement.classList.remove('scheme-light-dark')
      document.documentElement.classList.remove('scheme-light')
      if (theme === 'dark')
        document.documentElement.classList.add('scheme-light')
      else document.documentElement.classList.add('scheme-light-dark')
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
      if (!devToolsElement) return

      devToolsElement.hidden = !devToolsElement.hidden
    }
  })
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
