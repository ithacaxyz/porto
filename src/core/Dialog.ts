import type { RpcRequest, RpcResponse } from 'ox'
import * as Provider from 'ox/Provider'
import type { ThemeFragment } from '../theme/Theme.js'
import { logger } from './internal/logger.js'
import type { Internal } from './internal/porto.js'
import * as UserAgent from './internal/userAgent.js'
import * as Messenger from './Messenger.js'
import type { QueuedRequest, Store } from './Porto.js'

export const hostUrls = {
  local: 'http://localhost:5175/dialog/',
  prod: 'https://id.porto.sh/dialog',
  stg: 'https://stg.id.porto.sh/dialog',
} as const

/** Dialog interface. */
export type Dialog = {
  name: string
  setup: (parameters: {
    host: string
    internal: Internal
    theme?: ThemeFragment | undefined
    themeController?: ThemeController | undefined
  }) => {
    close: () => void
    destroy: () => void
    open: (parameters: any) => void
    syncRequests: (requests: readonly QueuedRequest[]) => Promise<void>
  }
  supportsHeadless: boolean
}

/**
 * Instantiates a dialog.
 *
 * @param dialog - Dialog.
 * @returns Instantiated dialog.
 */
export function from<const dialog extends Dialog>(dialog: dialog): dialog {
  return dialog
}

/**
 * Instantiates an iframe dialog.
 *
 * @returns iframe dialog.
 */
export function iframe(options: iframe.Options = {}) {
  const { skipProtocolCheck, skipUnsupported } = options

  // Safari does not support WebAuthn credential creation in iframes.
  // Fall back to popup dialog.
  // Tracking: https://github.com/WebKit/standards-positions/issues/304
  const includesUnsupported = (
    requests: readonly RpcRequest.RpcRequest[] | undefined,
  ) =>
    !skipUnsupported &&
    UserAgent.isSafari() &&
    requests?.some((x) =>
      ['wallet_connect', 'eth_requestAccounts'].includes(x.method),
    )

  if (typeof window === 'undefined') return noop()
  return from({
    name: 'iframe',
    setup(parameters) {
      const { host, internal, theme, themeController } = parameters
      const { store } = internal

      const fallback = popup().setup(parameters)

      let open = false

      const hostUrl = new URL(host)

      const root = document.createElement('dialog')
      root.dataset.porto = ''

      root.setAttribute('role', 'dialog')
      root.setAttribute('aria-closed', 'true')
      root.setAttribute('aria-label', 'Porto Wallet')
      root.setAttribute('hidden', 'until-found')

      Object.assign(root.style, {
        background: 'transparent',
        border: '0',
        inset: '0',
        outline: '0',
        padding: '0',
        position: 'fixed',
        top: '-10000px',
      })

      document.body.appendChild(root)

      const iframe = document.createElement('iframe')
      iframe.setAttribute('data-testid', 'porto')
      iframe.setAttribute(
        'allow',
        `publickey-credentials-get ${hostUrl.origin}; publickey-credentials-create ${hostUrl.origin}; clipboard-write`,
      )
      iframe.setAttribute('tabindex', '0')
      iframe.setAttribute(
        'sandbox',
        'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
      )
      iframe.setAttribute('src', getDialogUrl(host))
      iframe.setAttribute('title', 'Porto')
      Object.assign(iframe.style, {
        backgroundColor: 'transparent',
        border: '0',
        colorScheme: 'light dark',
        height: '100%',
        left: '0',
        position: 'fixed',
        top: '0',
        width: '100%',
      })

      root.appendChild(iframe)

      const messenger = Messenger.bridge({
        from: Messenger.fromWindow(window, { targetOrigin: hostUrl.origin }),
        to: Messenger.fromWindow(iframe.contentWindow!, {
          targetOrigin: hostUrl.origin,
        }),
        waitForReady: true,
      })

      themeController?._setup(messenger, true)

      const drawerModeQuery = window.matchMedia('(max-width: 460px)')
      const onDrawerModeChange = () => {
        messenger.send('__internal', {
          type: 'resize',
          // 460 = drawer mode, 461 = floating mode
          width: drawerModeQuery.matches ? 460 : 461,
        })
      }
      drawerModeQuery.addEventListener('change', onDrawerModeChange)

      messenger.on('ready', (options) => {
        const { feeToken } = options

        const chainIds = parameters.internal.store.getState().chainIds

        // Derive the compatible chain IDs between the dialog and the application.
        let compatibleChainIds = chainIds.filter((id) =>
          options.chainIds.includes(id),
        )

        // If the consumer has no compatible chain IDs with the dialog,
        // fall back to the dialog's chain IDs.
        if (compatibleChainIds.length === 0)
          compatibleChainIds = options.chainIds as [number, ...number[]]

        store.setState((x) => ({
          ...x,
          chainIds: compatibleChainIds as [number, ...number[]],
          feeToken,
        }))

        messenger.send('__internal', {
          chainIds: compatibleChainIds,
          mode: 'iframe',
          referrer: getReferrer(),
          theme,
          type: 'init',
        })

        onDrawerModeChange()
      })

      messenger.on('rpc-response', (response) => {
        if (includesUnsupported([response._request])) {
          // reload iframe to rehydrate storage state if an
          // unsupported request routed via another renderer.
          const src = iframe.src
          iframe.src = src
        }
        handleResponse(store, response)
      })
      messenger.on('__internal', (payload) => {
        if (payload.type === 'switch' && payload.mode === 'popup') {
          fallback.open()
          fallback.syncRequests(store.getState().requestQueue)
        }

        if (
          payload.type === 'dialog-lifecycle' &&
          payload.action === 'done:close' &&
          !open
        ) {
          hideDialog()
          messenger.send('__internal', {
            mode: 'iframe',
            referrer: getReferrer(),
            type: 'init',
          })
        }
      })

      let bodyStyle: CSSStyleDeclaration | null = null

      // store the opening element to restore the focus
      let opener: HTMLElement | null = null

      const onBlur = () => handleBlur(store)
      const onEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') handleBlur(store)
      }

      // 1password extension adds `inert` attribute to `dialog` and inserts
      // itself (`<com-1password-notification />`) there rendering itself unusable:
      // watch for `inert` on `dialog` and remove it
      const inertObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== 'attributes') continue
          const name = mutation.attributeName
          if (!name) continue
          if (name !== 'inert') continue
          root.removeAttribute(name)
        }
      })
      inertObserver.observe(root, {
        attributeOldValue: true,
        attributes: true,
      })

      // dialog/page interactivity (no visibility change)
      let dialogActive = false
      const activatePage = () => {
        if (!dialogActive) return
        dialogActive = false

        root.removeEventListener('click', onBlur)
        document.removeEventListener('keydown', onEscape)
        root.style.pointerEvents = 'none'
        opener?.focus()
        opener = null

        Object.assign(document.body.style, bodyStyle ?? '')
        // firefox: explicitly restore/clear `overflow` directly
        document.body.style.overflow = bodyStyle?.overflow ?? ''
      }
      const activateDialog = () => {
        if (dialogActive) return
        dialogActive = true

        root.addEventListener('click', onBlur)
        document.addEventListener('keydown', onEscape)
        iframe.focus()
        root.style.pointerEvents = 'auto'

        bodyStyle = Object.assign({}, document.body.style)
        document.body.style.overflow = 'hidden'
      }

      // dialog visibility
      let visible = false
      const showDialog = () => {
        if (visible) return
        visible = true
        cancelForceHideDelay()

        if (document.activeElement instanceof HTMLElement)
          opener = document.activeElement

        root.removeAttribute('hidden')
        root.removeAttribute('aria-closed')
        root.showModal()
      }
      const hideDialog = () => {
        if (!visible) return
        visible = false
        cancelForceHideDelay()
        root.setAttribute('hidden', 'true')
        root.setAttribute('aria-closed', 'true')
        root.close()

        // 1password extension sometimes adds `inert` attribute to `dialog`
        // siblings and does not clean up remove when `dialog` closes
        // (after `<com-1password-notification />` closes)
        for (const sibling of root.parentNode
          ? Array.from(root.parentNode.children)
          : []) {
          if (sibling === root) continue
          if (!sibling.hasAttribute('inert')) continue
          sibling.removeAttribute('inert')
        }
      }

      // let the iframe a second to send the done:close
      // event, otherwise we force close the dialog.
      let forceHideTimer: ReturnType<typeof setTimeout>
      const startForceHideDelay = () => {
        clearTimeout(forceHideTimer)
        forceHideTimer = setTimeout(() => {
          hideDialog()
          messenger.send('__internal', {
            mode: 'iframe',
            referrer: getReferrer(),
            type: 'init',
          })
        }, 1000)
      }
      const cancelForceHideDelay = () => {
        clearTimeout(forceHideTimer)
      }

      return {
        close() {
          fallback.close()
          open = false

          messenger.send('__internal', {
            action: 'request:close',
            type: 'dialog-lifecycle',
          })

          activatePage()
          startForceHideDelay()
        },
        destroy() {
          fallback.close()
          open = false

          activatePage()
          hideDialog()

          fallback.destroy()
          messenger.destroy()
          root.remove()
          inertObserver.disconnect()

          drawerModeQuery.removeEventListener('change', onDrawerModeChange)
        },
        open() {
          if (open) return
          open = true

          showDialog()
          activateDialog()

          messenger.send('__internal', {
            mode: 'iframe',
            referrer: getReferrer(),
            type: 'init',
          })
          messenger.send('__internal', {
            action: 'request:open',
            type: 'dialog-lifecycle',
          })
        },
        async syncRequests(requests) {
          const { methodPolicies } = await messenger.waitForReady()

          const headless = requests?.every(
            (request) =>
              methodPolicies?.find(
                (policy) => policy.method === request.request.method,
              )?.modes?.headless === true,
          )
          const insecureProtocol = (() => {
            if (skipProtocolCheck) return false
            const insecure = !window.location.protocol.startsWith('https')
            if (insecure)
              logger.warnOnce(
                'Detected insecure protocol (HTTP).',
                `\n\nThe Porto iframe is not supported on HTTP origins (${window.location.origin})`,
                'due to lack of WebAuthn support.',
                'See https://porto.sh/sdk#secure-origins-https for more information.',
              )
            return insecure
          })()
          const unsupported = includesUnsupported(
            requests.map((x) => x.request),
          )

          if (
            !headless &&
            (unsupported ||
              insecureProtocol ||
              (requests.some((x) => x.request.method === 'wallet_addFunds') &&
                internal.config.experimental?.applePayOnramp === true))
          )
            fallback.syncRequests(requests)
          else {
            const requiresConfirm = requests.some((x) =>
              requiresConfirmation(x.request, {
                methodPolicies,
                targetOrigin: hostUrl.origin,
              }),
            )
            if (!open && requiresConfirm) this.open()
            messenger.send('rpc-requests', requests)
          }
        },
      }
    },
    supportsHeadless: true,
  })
}

export declare namespace iframe {
  export type Options = {
    size?: { width: number; height?: number | undefined } | undefined
    /**
     * Skips check for insecure protocol (HTTP).
     * @default false
     */
    skipProtocolCheck?: boolean | undefined
    /**
     * Skips check for unsupported iframe requests that result
     * to a popup.
     * @default false
     */
    skipUnsupported?: boolean | undefined
  }
}

/**
 * Instantiates a popup dialog.
 *
 * @returns Popup dialog.
 */
export function popup(options: popup.Options = {}) {
  if (typeof window === 'undefined') return noop()
  const { type = 'auto', size = defaultSize } = options
  return from({
    name: 'popup',
    setup(parameters) {
      const { host, internal, themeController } = parameters
      const { store } = internal

      const hostUrl = new URL(host)

      let popup: Window | null = null

      const resolvedType =
        type === 'page' || (type === 'auto' && UserAgent.isMobile())
          ? 'page'
          : 'popup'

      function onBlur() {
        if (popup) handleBlur(store)
      }

      const offDetectClosed = (() => {
        const timer = setInterval(() => {
          if (popup?.closed) handleBlur(store)
        }, 100)
        return () => clearInterval(timer)
      })()

      let messenger: Messenger.Bridge | undefined

      themeController?._setup(null, true)

      return {
        close() {
          if (!popup) return
          popup.close()
          popup = null
        },
        destroy() {
          this.close()
          window.removeEventListener('focus', onBlur)
          messenger?.destroy()
          offDetectClosed()
        },
        open() {
          if (resolvedType === 'popup') {
            const left = (window.innerWidth - size.width) / 2 + window.screenX
            const top = window.screenY + 100

            popup = window.open(
              getDialogUrl(host),
              '_blank',
              `width=${size.width},height=${size.height},left=${left},top=${top}`,
            )
          } else {
            popup = window.open(getDialogUrl(host), '_blank')
          }

          if (!popup) throw new Error('Failed to open popup')

          messenger = Messenger.bridge({
            from: Messenger.fromWindow(window, {
              targetOrigin: hostUrl.origin,
            }),
            to: Messenger.fromWindow(popup, {
              targetOrigin: hostUrl.origin,
            }),
            waitForReady: true,
          })

          themeController?._setup(messenger, false)

          messenger.send('__internal', {
            mode: resolvedType === 'page' ? 'page' : 'popup',
            referrer: getReferrer(),
            theme: themeController?.getTheme() ?? parameters.theme,
            type: 'init',
          })

          messenger.on('rpc-response', (response) =>
            handleResponse(store, response),
          )

          window.removeEventListener('focus', onBlur)
          window.addEventListener('focus', onBlur)
        },
        async syncRequests(requests) {
          const requiresConfirm = requests.some((x) =>
            requiresConfirmation(x.request),
          )
          if (requiresConfirm) {
            if (!popup || popup.closed) this.open()
            popup?.focus()
          }
          messenger?.send('rpc-requests', requests)
        },
      }
    },
    supportsHeadless: false,
  })
}

export declare namespace popup {
  export type Options = {
    /**
     * The type of popup window to create.
     * - 'auto': Automatically decide based on context (default)
     * - 'popup': Popup window with controlled height
     * - 'page': Full page/tab
     * @default 'auto'
     */
    type?: 'auto' | 'popup' | 'page' | undefined
    /**
     * Initial size of the popup window when type is 'popup' or 'auto' resolves to popup.
     * @default { width: 360, height: 282 }
     */
    size?: { width: number; height: number } | undefined
  }
}

/**
 * Instantiates a noop dialog.
 *
 * @returns Noop dialog.
 */
export function noop() {
  return from({
    name: 'noop',
    setup() {
      return {
        close() {},
        destroy() {},
        open() {},
        async syncRequests() {},
      }
    },
    supportsHeadless: true,
  })
}

/**
 * Instantiates an inline iframe dialog rendered on a provided `element`.
 *
 * @param options - Options.
 * @returns Inline iframe dialog.
 */
export function experimental_inline(options: inline.Options) {
  const { element } = options
  if (typeof window === 'undefined') return noop()
  return from({
    name: 'inline',
    setup(parameters) {
      const { host, internal, theme, themeController } = parameters
      const { store } = internal

      let open = false

      const hostUrl = new URL(host)

      const root = document.createElement('div')
      root.dataset.porto = ''
      root.style.height = '100%'
      element().appendChild(root)

      const iframe = document.createElement('iframe')
      iframe.setAttribute(
        'allow',
        `publickey-credentials-get ${hostUrl.origin}; publickey-credentials-create ${hostUrl.origin}`,
      )
      iframe.setAttribute('aria-label', 'Porto Wallet')
      iframe.setAttribute('tabindex', '0')
      iframe.setAttribute(
        'sandbox',
        'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
      )

      iframe.setAttribute('src', getDialogUrl(host))
      iframe.setAttribute('title', 'Porto')
      Object.assign(iframe.style, {
        border: '0',
        height: '100%',
        width: '100%',
      })

      root.appendChild(iframe)

      const messenger = Messenger.bridge({
        from: Messenger.fromWindow(window, { targetOrigin: hostUrl.origin }),
        to: Messenger.fromWindow(iframe.contentWindow!, {
          targetOrigin: hostUrl.origin,
        }),
        waitForReady: true,
      })

      themeController?._setup(messenger, true)

      messenger.on('ready', () => {
        messenger.send('__internal', {
          mode: 'inline-iframe',
          referrer: getReferrer(),
          theme,
          type: 'init',
        })
      })

      messenger.on('rpc-response', (response) =>
        handleResponse(store, response),
      )

      return {
        close() {},
        destroy() {
          messenger.destroy()
          root.remove()
        },
        open() {
          if (open) return
          open = true

          messenger.send('__internal', {
            mode: 'iframe',
            referrer: getReferrer(),
            type: 'init',
          })
        },
        async syncRequests(requests) {
          messenger.send('rpc-requests', requests)
        },
      }
    },
    supportsHeadless: true,
  })
}

export namespace inline {
  export type Options = {
    element: () => HTMLElement
  }
}

export type ThemeController = {
  /**
   * Used internally to setup the controller.
   * @deprecated
   */
  _setup: (messenger: Messenger.Messenger | null, resetTheme?: boolean) => void
  /**
   * Update the dialog theme.
   * @param theme - The theme to set.
   */
  setTheme: (theme: ThemeFragment) => void
  /**
   * Get the latest theme set since the controller was initialized.
   * @returns The latest theme or `null` if no theme was set.
   */
  getTheme: () => ThemeFragment | null
}

/**
 * A controller to update the dialog theme.
 */
export function createThemeController(): ThemeController {
  let lastTheme: ThemeFragment | null = null
  let messenger: Messenger.Messenger | null = null
  const controller: ThemeController = {
    _setup(messenger_: Messenger.Messenger | null, resetTheme = false) {
      if (resetTheme) lastTheme = null
      messenger = messenger_
    },
    getTheme() {
      return lastTheme
    },
    setTheme(theme) {
      lastTheme = theme
      messenger
        ?.send('__internal', {
          theme,
          type: 'set-theme',
        })
        .catch(() => {})
    },
  }
  return controller
}

export const defaultSize = { height: 282, width: 360 }

export function requiresConfirmation(
  request: RpcRequest.RpcRequest,
  options: {
    methodPolicies?: Messenger.ReadyOptions['methodPolicies'] | undefined
    targetOrigin?: string | undefined
  } = {},
) {
  const { methodPolicies, targetOrigin } = options
  const policy = methodPolicies?.find((x) => x.method === request.method)
  if (!policy) return true
  if (policy.modes?.headless) {
    if (
      typeof policy.modes.headless === 'object' &&
      policy.modes.headless.sameOrigin &&
      targetOrigin !== window.location.origin
    )
      return true
    return false
  }
  return true
}

export function getReferrer() {
  const icon = (() => {
    const dark = document.querySelector(
      'link[rel="icon"][media="(prefers-color-scheme: dark)"]',
    )?.href
    const light =
      document.querySelector(
        'link[rel="icon"][media="(prefers-color-scheme: light)"]',
      )?.href ?? document.querySelector('link[rel="icon"]')?.href
    if (dark && light && dark !== light) return { dark, light }
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark) return dark
    return light
  })()
  return {
    icon,
    title: document.title,
  }
}

export function handleBlur(store: Store) {
  store.setState((x) => ({
    ...x,
    requestQueue: x.requestQueue.map((x) => ({
      account: x.account,
      error: new Provider.UserRejectedRequestError(),
      request: x.request,
      status: 'error',
    })),
  }))
}

export function handleResponse(
  store: Store,
  response: RpcResponse.RpcResponse,
) {
  store.setState((x) => ({
    ...x,
    requestQueue: x.requestQueue.map((queued) => {
      if (queued.request.id !== response.id) return queued
      if (response.error)
        return {
          account: queued.account,
          error: response.error,
          request: queued.request,
          status: 'error',
        } satisfies QueuedRequest
      return {
        account: queued.account,
        request: queued.request,
        result: response.result,
        status: 'success',
      } satisfies QueuedRequest
    }),
  }))
}

export function getDialogUrl(host: string) {
  const url = new URL(host)
  const parentParams = new URLSearchParams(window.location.search)
  const prefix = 'porto.'
  for (const [key, value] of parentParams.entries()) {
    if (key.startsWith(prefix))
      url.searchParams.set(key.slice(prefix.length), value)
  }
  return url.toString()
}
