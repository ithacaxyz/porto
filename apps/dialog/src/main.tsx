import { Env, Theme } from '@porto/apps'
import * as Sentry from '@sentry/react'
import { TrustedHosts } from 'porto/internal'
import { Events } from 'porto/remote'
import { Actions } from 'porto/wagmi'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getConnectors, switchChain } from 'wagmi/actions'

import * as Dialog from '~/lib/Dialog.ts'
import { porto } from '~/lib/Porto.js'
import * as Router from '~/lib/Router.ts'
import * as Wagmi from '~/lib/Wagmi.ts'
import { App } from './App.js'
import './styles.css'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://457697aad11614a3f667c8e61f6b9e20@o4509056062849024.ingest.us.sentry.io/4509080285741056',
    enabled: document.referrer
      ? TrustedHosts.hostnames.includes(new URL(document.referrer).hostname)
      : true,
    environment: Env.get(),
    integrations: [
      Sentry.replayIntegration(),
      Sentry.tanstackRouterBrowserTracingIntegration(Router.router),
    ],
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  })
}

const offInitialized = Events.onInitialized(porto, async (payload, event) => {
  const { chainIds, mode, referrer, theme } = payload

  // Prevent showing stale route from a previous action.
  const pathname = Router.router.state.location.pathname.replace(/\/+$/, '')
  if (pathname !== '/dialog') await Router.router.navigate({ to: '/dialog' })

  // Ensure we are synced with the Application's active chain.
  const chainId = chainIds?.[0]
  if (chainId) {
    const dialogChainIds = porto._internal.store.getState().chainIds as [
      number,
      ...number[],
    ]

    // Only sync if the dialog supports the active chain.
    if (dialogChainIds.includes(chainId))
      porto._internal.store.setState((x) => ({
        ...x,
        chainIds: [
          chainId,
          ...x.chainIds.filter((id) => id !== chainId),
        ] as never,
      }))
  }

  const referrerUri = document.referrer || event.origin

  Dialog.store.setState({
    mode,
    referrer: {
      ...referrer,
      origin: event.origin,
      url: referrerUri ? new URL(referrerUri) : undefined,
    },

    // Only update `customTheme` if a theme is passed. This prevents overwriting
    // the current theme with initialization messages happening after the
    // initial load (e.g. in the open() method of dialog variants).
    ...(theme
      ? { customTheme: Theme.parseJsonTheme(JSON.stringify(theme)) }
      : {}),
  })
})

const offDialogRequest = Events.onDialogRequest(
  porto,
  async ({ account, request }) => {
    const connectedAccount = porto._internal.store.getState().accounts[0]
    const requireAccountSync =
      account && account.address !== connectedAccount?.address

    // Clear errors when the request is null (i.e. when the dialog is closed).
    if (!request) return Dialog.store.setState({ error: null })

    if (requireAccountSync) {
      await Router.router.navigate({
        to: '/dialog/pending',
      })
      await Actions.connect(Wagmi.config, {
        connector: getConnectors(Wagmi.config)[0]!,
        force: true,
        selectAccount: account,
      }).catch(() => {})
    }

    await Router.router.navigate({
      search: (search) => {
        return {
          ...search,
          _decoded: undefined,
          ...request,
          account,
        } as never
      },
      to: '/dialog/' + (request?.method ?? ''),
    })
  },
)

// TODO: scope "active" chainId by app.
porto._internal.store.subscribe(
  (state) => state.chainIds[0],
  async (chainId) => {
    if (chainId)
      await switchChain(Wagmi.config, {
        chainId,
      }).catch(() => {})
  },
)

porto.messenger.on('success', (payload) => {
  Router.router.navigate({
    search: (search) => ({ ...search, ...payload }) as never,
    to: '/dialog/success',
  })
})

porto.messenger.on('__internal', (payload) => {
  if (
    payload.type === 'resize' &&
    payload.width !== undefined &&
    Dialog.store.getState().mode === 'iframe'
  )
    Dialog.store.setState((state) =>
      payload.width === undefined
        ? state
        : {
            ...state,
            display: payload.width > 460 ? 'floating' : 'drawer',
          },
    )

  if (payload.type === 'set-theme' && payload.theme)
    Dialog.store.setState({
      customTheme: Theme.parseJsonTheme(JSON.stringify(payload.theme)),
    })

  // backward compatibility from 0.2.7 (to be removed in a future version)
  if (payload.type === 'dialog-lifecycle' && payload.action === 'request:close')
    porto.messenger.send('__internal', {
      action: 'done:close',
      type: 'dialog-lifecycle',
    })
})

porto.ready()

const rootElement = document.querySelector('div#root')

if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement, {
  onCaughtError: Sentry.reactErrorHandler((error) => {
    console.error(error)
  }),
  onRecoverableError: Sentry.reactErrorHandler((error) => {
    console.error(error)
  }),
  onUncaughtError: Sentry.reactErrorHandler((error) => {
    console.error(error)
  }),
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.hot)
  import.meta.hot.on('vite:beforeUpdate', () => {
    offInitialized()
    offDialogRequest()
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

      document.documentElement.classList.remove('scheme-light-dark')
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
