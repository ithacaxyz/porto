import { StartClient } from '@tanstack/react-start/client'
import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(
  document,
  <React.StrictMode>
    <StartClient />
  </React.StrictMode>,
)

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

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

  // ⌥ + d: clear all stores, local storage, cookies, sessions, and indexeddb
  if (event.altKey && event.code === 'KeyD') {
    console.info(
      'Clearing all stores, local storage, cookies, sessions, and indexeddb',
    )

    window.localStorage.clear()
    window.sessionStorage.clear()
    window.indexedDB
      .databases()
      .then((databases) =>
        databases.forEach((database) => {
          if (!database.name) return
          window.indexedDB.deleteDatabase(database.name)
        }),
      )
      .catch((error) => console.error('Error clearing indexeddb', error))
  }

  // ⌥ + h: hide dev tools
  if (event.altKey && event.code === 'KeyH') {
    try {
      const tsqDevToolsContainer = document.querySelector(
        'div.tsqd-parent-container',
      )
      if (tsqDevToolsContainer)
        tsqDevToolsContainer.hidden = !tsqDevToolsContainer.hidden
      const tsrDevToolsContainer = document.querySelector(
        'footer.TanStackRouterDevtools',
      )
      if (tsrDevToolsContainer)
        tsrDevToolsContainer.hidden = !tsrDevToolsContainer.hidden
    } catch {}
  }
})
