// import * as focusTrap from 'focus-trap'
import type { RpcResponse } from 'ox'
import * as Provider from 'ox/Provider'

import * as Messenger from './Messenger.js'
import type { QueuedRequest, Store } from './Porto.js'
import type { Internal } from './internal/porto.js'

/** Dialog interface. */
export type Dialog = {
  setup: (parameters: { host: string; internal: Internal }) => {
    close: () => void
    destroy: () => void
    open: () => void
    syncRequests: (requests: readonly QueuedRequest[]) => Promise<void>
  }
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
export function iframe() {
  // Safari does not support WebAuthn credential creation in iframes.
  // Fall back to popup dialog.
  // Tracking: https://github.com/WebKit/standards-positions/issues/304
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('safari') && !ua.includes('chrome')) return popup()

  return from({
    setup(parameters) {
      const { host, internal } = parameters
      const { store } = internal

      let open = false

      const hostUrl = new URL(host)

      // TODO: Use <dialog> element instead.
      //       https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
      const root = document.createElement('div')
      Object.assign(root.style, styles.root)
      document.body.appendChild(root)

      const backdrop = document.createElement('div')
      Object.assign(backdrop.style, styles.backdrop)
      root.appendChild(backdrop)

      const iframe = document.createElement('iframe')
      iframe.setAttribute(
        'allow',
        `publickey-credentials-get ${hostUrl.origin}; publickey-credentials-create ${hostUrl.origin}`,
      )
      iframe.setAttribute('aria-closed', 'true')
      iframe.setAttribute('aria-label', 'Porto Wallet')
      iframe.setAttribute('hidden', 'true')
      iframe.setAttribute('role', 'dialog')
      iframe.setAttribute('tabindex', '0')
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')
      iframe.setAttribute('src', host)
      iframe.setAttribute('title', 'Porto')
      Object.assign(iframe.style, styles.iframe)

      root.appendChild(document.createElement('style')).textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `
      root.appendChild(iframe)

      function onBlur() {
        handleBlur(store)
      }
      backdrop.addEventListener('click', onBlur)

      const messenger = Messenger.bridge({
        from: Messenger.fromWindow(window, { targetOrigin: hostUrl.origin }),
        to: Messenger.fromWindow(iframe.contentWindow!),
      })

      messenger.on('rpc-response', (response) =>
        handleResponse(store, response),
      )

      function onEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') handleBlur(store)
      }

      const bodyStyle = Object.assign({}, document.body.style)

      // TODO: Programmatic dismissal via "Escape" key is broken when
      //       focus trap is enabled. Need to fix.
      // const trap = focusTrap.createFocusTrap(root, {
      //   clickOutsideDeactivates: true,
      //   escapeDeactivates: true,
      // })

      return {
        open() {
          if (open) return
          open = true

          root.style.display = 'block'
          backdrop.style.display = 'block'
          document.body.style.overflow = 'hidden'
          document.addEventListener('keydown', onEscape)

          iframe.style.display = 'block'
          iframe.setAttribute('aria-closed', 'true')
          iframe.setAttribute('hidden', 'true')
          iframe.removeAttribute('aria-modal')
          iframe.removeAttribute('aria-open')

          // trap.activate()
        },
        close() {
          open = false

          root.style.display = 'none'
          backdrop.style.display = 'none'
          Object.assign(document.body.style, bodyStyle)

          iframe.style.display = 'none'
          iframe.setAttribute('aria-modal', 'true')
          iframe.setAttribute('aria-open', 'true')
          iframe.removeAttribute('hidden')
          iframe.removeAttribute('aria-closed')

          // trap.deactivate()
        },
        destroy() {
          this.close()
          backdrop.removeEventListener('click', onBlur)
          document.removeEventListener('keydown', onEscape)
          messenger.destroy()
        },
        async syncRequests(requests) {
          if (!open) this.open()
          messenger.send('rpc-requests', requests)
        },
      }
    },
  })
}

/**
 * Instantiates a popup dialog.
 *
 * @returns Popup dialog.
 */
export function popup() {
  return from({
    setup(parameters) {
      const { host, internal } = parameters
      const { store } = internal

      const hostUrl = new URL(host)

      let popup: Window | null = null

      const root = document.createElement('div')
      document.body.appendChild(root)

      const backdrop = document.createElement('div')
      Object.assign(backdrop.style, styles.backdrop)
      root.appendChild(backdrop)

      function onBlur() {
        handleBlur(store)
      }

      let messenger: Messenger.Messenger | undefined

      return {
        open() {
          const left = (window.innerWidth - width) / 2 + window.screenX
          const top = window.screenY + 100

          popup = window.open(
            host,
            '_blank',
            `width=${width},height=${height},left=${left},top=${top}`,
          )
          if (!popup) throw new Error('Failed to open popup')

          messenger = Messenger.bridge({
            from: Messenger.fromWindow(window, {
              targetOrigin: hostUrl.origin,
            }),
            to: Messenger.fromWindow(popup),
            waitForReady: true,
          })

          messenger.on('rpc-response', (response) =>
            handleResponse(store, response),
          )

          window.addEventListener('focus', onBlur)

          backdrop.style.display = 'block'
        },
        close() {
          if (!popup) return
          popup.close()
          popup = null
          backdrop.style.display = 'none'
        },
        destroy() {
          this.close()
          window.removeEventListener('focus', onBlur)
          messenger?.destroy()
        },
        async syncRequests(requests) {
          if (!popup || popup.closed) this.open()
          popup?.focus()
          messenger?.send('rpc-requests', requests)
        },
      }
    },
  })
}

const width = 320
const height = 180

const styles = {
  root: {
    display: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    // TODO: Maybe use <dialog> element instead so we don't need to
    //       rely on z-index.
    //       https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    zIndex: '999999999998',
  },
  backdrop: {
    display: 'none',
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iframe: {
    animation: 'fadeIn 0.1s ease-in-out',
    display: 'none',
    border: 'none',
    borderRadius: '8px',
    position: 'fixed',
    top: '16px',
    left: `calc(50% - ${width / 2}px)`,
    width: `${width}px`,
    height: `${height}px`,
    // TODO: Maybe use <dialog> element instead so we don't need to
    //       rely on z-index.
    //       https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    zIndex: '999999999999',
  },
} as const satisfies Record<string, Partial<CSSStyleDeclaration>>

/////////////////////////////////////////////////////////////////////
// Internal
/////////////////////////////////////////////////////////////////////

function handleBlur(store: Store) {
  store.setState((x) => ({
    ...x,
    requestQueue: x.requestQueue.map((x) => ({
      error: new Provider.UserRejectedRequestError(),
      request: x.request,
      status: 'error',
    })),
  }))
}

function handleResponse(store: Store, response: RpcResponse.RpcResponse) {
  store.setState((x) => ({
    ...x,
    requestQueue: x.requestQueue.map((queued) => {
      if (queued.request.id !== response.id) return queued
      if (response.error)
        return {
          request: queued.request,
          status: 'error',
          error: response.error,
        } satisfies QueuedRequest
      return {
        request: queued.request,
        status: 'success',
        result: response.result,
      } satisfies QueuedRequest
    }),
  }))
}
