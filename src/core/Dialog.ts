import type { RpcRequest, RpcResponse } from 'ox'
import * as Provider from 'ox/Provider'
import { logger } from './internal/logger.js'
import type { Internal } from './internal/porto.js'
import * as UserAgent from './internal/userAgent.js'
import * as Messenger from './Messenger.js'
import type { QueuedRequest, Store } from './Porto.js'

/** Dialog interface. */
export type Dialog = {
  name: string
  setup: (parameters: { host: string; internal: Internal }) => {
    close: () => void
    destroy: () => void
    open: (parameters: any) => void
    syncRequests: (requests: readonly QueuedRequest[]) => Promise<void>
  }
}

/** Dialog UI states.
 *
 * @remarks
 * - Host app opens the dialog:
 *   => initial = no dialog
 *   => opening = initiates opening animation
 *   => opened = opening animation finished ("loading…" window)
 *   => revealing = opened state + ready message received + first resize received => revealing animation
 *   => revealed = revealing animation finished
 */
type DialogStatus = 'initial' | 'opened' | 'opening' | 'revealed' | 'revealing'

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
      const { host, internal } = parameters
      const { store } = internal

      const fallback = popup().setup(parameters)
      const referrer = getReferrer()

      let open = false

      const hostUrl = new URL(host)

      const root = document.createElement('dialog')
      root.dataset.porto = ''
      root.style.top = '-100vh'
      root.style.margin = '0'
      root.style.padding = '100vh 0 0 0'
      document.body.appendChild(root)

      const loader = document.createElement('div')
      loader.dataset.portoLoader = ''

      const icon =
        referrer.icon === undefined
          ? ''
          : typeof referrer.icon === 'string'
            ? { dark: referrer.icon, light: referrer.icon }
            : referrer.icon

      const iconHtml =
        icon &&
        `<picture>
           <source
             srcset="${icon.dark}"
             media="(prefers-color-scheme: dark)">
           <img alt="" src="${icon.light}">
         </picture>`

      loader.innerHTML = `
        <div data-porto-loader-window>
          <div data-porto-loader-bar>
            <div data-porto-loader-logo>
              ${iconHtml}
            </div>
            <div data-porto-loader-text>loading…</div>
            <div data-porto-loader-border></div>
          </div>
        </div>
      `

      const iframe = document.createElement('iframe')
      iframe.setAttribute('data-testid', 'porto')
      iframe.setAttribute(
        'allow',
        `publickey-credentials-get ${hostUrl.origin}; publickey-credentials-create ${hostUrl.origin}; clipboard-write`,
      )
      iframe.setAttribute('aria-label', 'Porto Wallet')
      iframe.setAttribute('role', 'dialog')
      iframe.setAttribute('tabindex', '0')
      iframe.setAttribute(
        'sandbox',
        'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
      )

      iframe.setAttribute('src', getDialogUrl(host))
      iframe.setAttribute('title', 'Porto')

      const setIframeVisibility = (visible: boolean) => {
        if (visible) {
          iframe.style.display = 'block'
          iframe.removeAttribute('hidden')
          iframe.removeAttribute('aria-closed')
        } else {
          iframe.style.display = 'none'
          iframe.setAttribute('hidden', 'until-found')
          iframe.setAttribute('aria-closed', 'true')
        }
      }

      setIframeVisibility(false)

      Object.assign(iframe.style, {
        ...styles.iframe,
        position: 'fixed',
      })

      root.appendChild(document.createElement('style')).textContent = `
        [data-porto] {
          --porto-dialog-height: ${animations.loaderHeight}px;
        }
        [data-porto]::backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
        [data-porto] iframe {
          background-color: transparent;
          border-radius: 14px;
        }
        [data-porto-loader] {
          pointer-events: none;
          user-select: none;
        }
        [data-porto-loader-window] {
          width: calc(100% - 2px);
          overflow: hidden;
          color: #8d8d8d;
          background: #f9f9f9;
          border: 1px solid #e8e8e8;
          border-radius: 14px;
        }
        [data-porto-loader-bar] {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: 37px;
          padding-left: 12px;
          font-size: 14px;
          font-family: -system-ui, sans-serif;
          background: #f0f0f0;
        }
        [data-porto-loader-border] {
          position: absolute;
          inset: auto 0 0;
          height: 1px;
          background: #e8e8e8;
        }
        [data-porto-loader-logo] {
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          background: #d9d9d9;
          border-radius: 5px;
        }
        [data-porto-loader-logo] picture {
          display: flex;
        }
        [data-porto-loader-logo] img {
          width: 14px;
          height: 14px;
        }
        @media (prefers-color-scheme: dark) {
          [data-porto-loader-window] {
            color: rgb(110, 110, 110);
            background: #191919;
            border-color: #2a2a2a;
          }
          [data-porto-loader-bar] {
            background: #222222;
          }
          [data-porto-loader-border] {
            background: #2a2a2a;
          }
          [data-porto-loader-logo] {
            background: #3a3a3a;
          }
        }
        @media (min-width: 460px) {
          [data-porto] {
            background: none;
            border: 0;
          }
          [data-porto-loader] {
            opacity: 0;
            position: fixed;
            top: 16px;
            inset-inline-end: calc(50% - ${width}px / 2);
            width: ${width}px;
            height: ${animations.loaderHeight}px;
            transform-origin: 50% 100%;
            animation:
              ${animations.openDuration}ms
              ${animations.animFn}
              forwards
              porto_opening_loader;
          }
          [data-porto-loader-window] {
            position: absolute;
            inset: 0;
            transform-origin: 50% 0%;
            transform: scale3d(1, 1, 1);
          }
          [data-porto] iframe {
            opacity: 0;
            top: 16px;
            inset-inline-end: calc(50% - ${width}px / 2);
            width: ${width}px;
          }
          [data-porto-reveal] [data-porto-loader] {
            opacity: 1;
            animation:
              ${animations.revealDuration1}ms
              ${animations.animFn}
              forwards
              porto_reveal_loader_size;
          }
          [data-porto-reveal] [data-porto-loader-window] {
            animation:
              ${animations.revealDuration2}ms
              ${animations.animFn}
              ${animations.revealDuration1 - animations.revealDuration2}ms
              forwards
              porto_reveal_loader_window;
          }
          [data-porto-reveal] [data-porto-loader-text] {
            animation:
              ${animations.revealDuration2}ms
              ${animations.animFn}
              forwards
              porto_reveal_loader_text;
          }
          [data-porto-reveal] iframe {
            animation:
              0ms /* instant */
              ${animations.animFn}
              ${animations.revealDuration1 - animations.revealDuration2}ms
              forwards
              porto_reveal_iframe;
          }
        }

        @media (max-width: 460px) {
          [data-porto] {
            background: none;
            border: 0;
          }
          [data-porto-loader] {
            opacity: 1;
            position: fixed;
            inset: auto 0 0;
            width: 100%;
            height: ${animations.loaderHeight}px;
            transform-origin: 50% 100%;
            animation:
              ${animations.openDuration}ms
              ${animations.animFn}
              forwards
              porto_opening_loader_small;
          }
          [data-porto-loader-window] {
            position: absolute;
            inset: 0;
            transform-origin: 50% 100%;
            transform: scale3d(1, 1, 1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          [data-porto] iframe {
            opacity: 0;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100% !important;
          }
          [data-porto-reveal] [data-porto-loader] {
            animation:
              ${animations.revealDrawerDuration}ms
              ${animations.animFn}
              forwards
              porto_reveal_loader_small;
          }
          [data-porto-reveal] iframe {
            opacity: 1;
            animation:
              ${animations.revealDrawerDuration}ms
              ${animations.animFn}
              forwards
              porto_reveal_iframe_small;
          }
        }

        @keyframes porto_reveal_iframe {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes porto_opening_loader {
          from {
            opacity: 0;
            transform:
              scale3d(
                ${animations.scaleLoaderFrom},
                ${animations.scaleLoaderFrom},
                1
              )
              translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: scale3d(1, 1, 1) translate3d(0, 40px, 0);
          }
        }

        @keyframes porto_reveal_loader_size {
          from {
            height: ${animations.loaderHeight}px;
            transform: scale3d(1, 1, 1) translate3d(0, 40px, 0);
          }
          to {
            height: var(--porto-dialog-height);
            transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
          }
        }

        @keyframes porto_reveal_loader_window {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes porto_reveal_loader_text {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        /* on small viewports, slide drawer from the bottom */
        @keyframes porto_reveal_iframe_small {
          from {
            transform: translate3d(0, calc(8px + var(--porto-dialog-height) - ${animations.loaderHeight}px), 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes porto_opening_loader_small {
          from {
            transform: translate3d(0, 100%, 0);
          }
          to {
            transform: translate3d(0, 8px, 0);
          }
        }

        @keyframes porto_reveal_loader_small {
          from {
            opacity: 1;
            transform: translate3d(0, 8px, 0);
          }
          to {
            opacity: 0;
            transform: translate3d(0, calc(8px - var(--porto-dialog-height) + ${animations.loaderHeight}px), 0);
          }
        }
      `

      root.appendChild(iframe)
      root.appendChild(loader)

      let dialogHeight: number | null = null
      let hasReceivedReady = false
      let openingAt: number | null = null

      const dialogState = {
        initial() {
          this.status = 'initial'
          dialogHeight = null

          setIframeVisibility(true)
          loader.style.display = 'block'
          root.style.setProperty(
            '--porto-dialog-height',
            `${animations.loaderHeight}px`,
          )
          delete root.dataset.portoReveal
        },
        opened() {
          this.status = 'opened'

          root.style.setProperty(
            '--porto-dialog-height',
            `${animations.loaderHeight}px`,
          )
          delete root.dataset.portoReveal
        },
        opening() {
          this.status = 'opening'

          dialogHeight = null
          openingAt = Date.now()

          root.style.setProperty(
            '--porto-dialog-height',
            `${animations.loaderHeight}px`,
          )
          delete root.dataset.portoReveal
        },
        revealed() {
          this.status = 'revealed'
        },
        revealing(dialogHeight: number) {
          const elapsed = openingAt ? Date.now() - openingAt : 0

          // the minimum delay prevents to interrupt the opening animation
          const delay = Math.max(0, animations.minRevealDelay - elapsed)

          setTimeout(() => {
            this.status = 'revealing'

            setIframeVisibility(true)
            iframe.style.height = `${dialogHeight}px`
            root.style.setProperty('--porto-dialog-height', `${dialogHeight}px`)
            root.dataset.portoReveal = ''
          }, delay)
        },
        status: 'initial' as DialogStatus,
      }

      dialogState.initial()

      const setDialogHeight = (height: number) => {
        if (dialogHeight === height) return
        dialogHeight = height

        iframe.style.height = `${height}px`
        root.style.setProperty('--porto-dialog-height', `${height}px`)

        // loader opened + ready received: reveal the iframe
        if (dialogState.status === 'opened' && hasReceivedReady) {
          dialogState.revealing(dialogHeight)
        }
      }

      loader.addEventListener('animationend', (event) => {
        if (
          dialogState.status === 'opening' &&
          (event.animationName === 'porto_opening_loader' ||
            event.animationName === 'porto_opening_loader_small')
        ) {
          dialogState.opened()

          // non null dialog height + ready received: reveal the iframe
          if (hasReceivedReady && dialogHeight !== null) {
            dialogState.revealing(dialogHeight)
          }
        }
      })

      iframe.addEventListener('animationend', (event) => {
        if (
          dialogState.status === 'revealing' &&
          (event.animationName === 'porto_reveal_iframe' ||
            event.animationName === 'porto_reveal_iframe_small')
        ) {
          dialogState.revealed()
        }
      })

      function onBlur() {
        handleBlur(store)
      }
      root.addEventListener('click', onBlur)

      const messenger = Messenger.bridge({
        from: Messenger.fromWindow(window, { targetOrigin: hostUrl.origin }),
        to: Messenger.fromWindow(iframe.contentWindow!, {
          targetOrigin: hostUrl.origin,
        }),
        waitForReady: true,
      })

      messenger.on('ready', (options) => {
        const { chainId } = options

        store.setState((x) => ({
          ...x,
          chainId,
        }))

        hasReceivedReady = true

        if (dialogState.status === 'opened' && dialogHeight !== null) {
          dialogState.revealing(dialogHeight)
        }

        messenger.send('__internal', {
          mode: 'iframe',
          referrer,
          type: 'init',
        })
      })
      messenger.on('rpc-response', (response) => {
        if (includesUnsupported([response._request])) {
          // reload iframe to rehydrate storage state if an
          // unsupported request routed via another renderer.
          const src = iframe.src
          iframe.src = src
          hasReceivedReady = false
        }
        handleResponse(store, response)
      })
      messenger.on('__internal', (payload) => {
        if (payload.type === 'resize') {
          iframe.style.height = `${payload.height}px`
          if (payload.height !== undefined) setDialogHeight(payload.height)
          if (!isMobile() && payload.width)
            iframe.style.width = `${payload.width}px`
        }

        if (payload.type === 'switch' && payload.mode === 'popup') {
          fallback.open()
          fallback.syncRequests(store.getState().requestQueue)
        }
      })

      function onEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') handleBlur(store)
      }

      const bodyStyle = Object.assign({}, document.body.style)

      // 1password extension adds `inert` attribute to `dialog` and inserts itself (`<com-1password-notification />`) there
      // rendering itself unusable: watch for `inert` on `dialog` and remove it
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== 'attributes') continue
          const name = mutation.attributeName
          if (!name) continue
          if (name !== 'inert') continue
          root.removeAttribute(name)
        }
      })
      observer.observe(root, { attributeOldValue: true, attributes: true })

      return {
        close() {
          fallback.close()
          open = false
          root.close()
          Object.assign(document.body.style, bodyStyle ?? '')
          // firefox: explicitly restore/clear `overflow` directly
          document.body.style.overflow = bodyStyle.overflow ?? ''
          setIframeVisibility(false)

          // reset dialog state
          dialogState.initial()

          // 1password extension sometimes adds `inert` attribute to `dialog` siblings and does not clean up
          // remove when `dialog` closes (after `<com-1password-notification />` closes)
          for (const sibling of root.parentNode
            ? Array.from(root.parentNode.children)
            : []) {
            if (sibling === root) continue
            if (!sibling.hasAttribute('inert')) continue
            sibling.removeAttribute('inert')
          }
        },
        destroy() {
          fallback.destroy()
          this.close()
          document.removeEventListener('keydown', onEscape)
          messenger.destroy()
          root.remove()
        },
        open() {
          if (open) return
          open = true

          dialogState.opening()

          messenger.send('__internal', {
            mode: 'iframe',
            referrer,
            type: 'init',
          })

          root.showModal()
          document.addEventListener('keydown', onEscape)
          document.body.style.overflow = 'hidden'

          setIframeVisibility(true)
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

          if (!headless && (unsupported || insecureProtocol))
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
  })
}

export declare namespace iframe {
  export type Options = {
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
export function popup() {
  if (typeof window === 'undefined') return noop()
  return from({
    name: 'popup',
    setup(parameters) {
      const { host, internal } = parameters
      const { store } = internal

      const hostUrl = new URL(host)

      let popup: Window | null = null

      function onBlur() {
        if (popup) handleBlur(store)
      }

      let messenger: Messenger.Bridge | undefined

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
        },
        open() {
          const left = (window.innerWidth - width) / 2 + window.screenX
          const top = window.screenY + 100

          popup = window.open(
            getDialogUrl(host),
            '_blank',
            `width=${width},height=${height},left=${left},top=${top}`,
          )
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

          messenger.send('__internal', {
            mode: 'popup',
            referrer: getReferrer(),
            type: 'init',
          })

          messenger.on('rpc-response', (response) =>
            handleResponse(store, response),
          )

          messenger.on('__internal', (_payload) => {})

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
  })
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
      const { host, internal } = parameters
      const { store } = internal

      let open = false

      const hostUrl = new URL(host)

      const root = document.createElement('div')
      root.dataset.porto = ''
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
      Object.assign(iframe.style, styles.iframe)

      root.appendChild(document.createElement('style')).textContent = `
        div iframe {
          background-color: transparent;
          border-radius: 14px;
        }
      `

      root.appendChild(iframe)

      const messenger = Messenger.bridge({
        from: Messenger.fromWindow(window, { targetOrigin: hostUrl.origin }),
        to: Messenger.fromWindow(iframe.contentWindow!, {
          targetOrigin: hostUrl.origin,
        }),
        waitForReady: true,
      })

      messenger.on('ready', () => {
        messenger.send('__internal', {
          mode: 'inline-iframe',
          referrer: getReferrer(),
          type: 'init',
        })
      })
      messenger.on('rpc-response', (response) =>
        handleResponse(store, response),
      )
      messenger.on('__internal', (payload) => {
        if (payload.type === 'resize') {
          iframe.style.height = `${payload.height}px`
        }
      })

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
  })
}

export namespace inline {
  export type Options = {
    element: () => HTMLElement
  }
}

export const width = 360
export const height = 282

export const animations = {
  animFn: 'cubic-bezier(0.32, 0.72, 0, 1)',
  loaderHeight: 80, // height of the window when showing "loading…"
  minRevealDelay: 120, // minimum delay to wait before revealing
  openDuration: 120,
  resizeDuration: 200, // part 1 of the reveal anim: height + scale
  revealDrawerDuration: 300, // part 2 of the reveal anim: opacity
  revealDuration1: 300, // reveal anim in drawer mode
  revealDuration2: 120, // iframe height resize transition
  scaleLoaderFrom: 0.8, // starting scale of the loader
} as const

export const styles = {
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'none',
    height: '100%',
    position: 'fixed',
    width: '100%',
    zIndex: '2147483647',
  },
  iframe: {
    border: 'none',
  },
} as const satisfies Record<string, Partial<CSSStyleDeclaration>>

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

export function isMobile() {
  return (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent,
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
      navigator.userAgent.slice(0, 4),
    )
  )
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
