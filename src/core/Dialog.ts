import type { RpcResponse } from 'ox'
import * as Provider from 'ox/Provider'

import type { QueuedRequest, Store } from './Porto.js'
import type { Internal } from './internal/porto.js'
import * as promise from './internal/promise.js'

export type Dialog = {
  setup: (parameters: { host: string; internal: Internal }) => {
    close: () => void
    destroy: () => void
    open: () => void
    syncRequests: (requests: readonly QueuedRequest[]) => Promise<void>
  }
}

const width = 320
const height = 180

const styles = {
  backdrop: {
    display: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '999999999998',
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
    zIndex: '999999999999',
  },
} as const satisfies Record<string, Partial<CSSStyleDeclaration>>

export function from<const dialog extends Dialog>(dialog: dialog): dialog {
  return dialog
}

export function iframe() {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('safari') && !ua.includes('chrome')) return popup()

  return from({
    setup(parameters) {
      const { host, internal } = parameters
      const { store } = internal

      let open = false

      const hostUrl = new URL(host)

      const root = document.createElement('div')
      document.body.appendChild(root)

      const backdrop = document.createElement('div')
      Object.assign(backdrop.style, styles.backdrop)
      root.appendChild(backdrop)

      const iframe = document.createElement('iframe')
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')
      iframe.setAttribute(
        'allow',
        `publickey-credentials-get ${hostUrl.origin}; publickey-credentials-create ${hostUrl.origin}`,
      )
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

      backdrop.addEventListener('click', () =>
        store.setState((x) => ({
          ...x,
          requestQueue: x.requestQueue.map((x) => ({
            error: new Provider.UserRejectedRequestError(),
            request: x.request,
            status: 'error',
          })),
        })),
      )

      function onResponse(event: MessageEvent) {
        if (event.origin !== hostUrl.origin) return
        if (event.data.topic !== 'rpc-response') return
        const response = event.data.response as RpcResponse.RpcResponse
        handleResponse(store, response)
      }
      window.addEventListener('message', onResponse)

      return {
        open() {
          if (open) return
          open = true
          backdrop.style.display = 'block'
          iframe.style.display = 'block'
        },
        close() {
          open = false
          backdrop.style.display = 'none'
          iframe.style.display = 'none'
        },
        destroy() {
          this.close()
          window.removeEventListener('message', onResponse)
        },
        async syncRequests(requests) {
          if (!open) this.open()
          iframe.contentWindow?.postMessage(
            { topic: 'rpc-requests', requests },
            hostUrl.origin,
          )
        },
      }
    },
  })
}

export function popup() {
  return from({
    setup(parameters) {
      const { host, internal } = parameters
      const { store } = internal

      const hostUrl = new URL(host)

      let popup: Window | null = null
      let ready = promise.withResolvers()

      const root = document.createElement('div')
      document.body.appendChild(root)

      const backdrop = document.createElement('div')
      Object.assign(backdrop.style, styles.backdrop)
      root.appendChild(backdrop)

      function onBlur() {
        handleBlur(store)
      }

      function onReady(event: MessageEvent) {
        if (event.origin !== hostUrl.origin) return
        if (event.data.topic !== 'ready') return
        ready.resolve(true)
      }
      window.addEventListener('message', onReady)

      function onResponse(event: MessageEvent) {
        if (event.origin !== hostUrl.origin) return
        if (event.data.topic !== 'rpc-response') return
        const response = event.data.response as RpcResponse.RpcResponse
        handleResponse(store, response)
      }
      window.addEventListener('message', onResponse)

      return {
        open() {
          const left = (window.innerWidth - width) / 2 + window.screenX
          const top = window.screenY + 100

          ready = promise.withResolvers()
          popup = window.open(
            host,
            '_blank',
            `width=${width},height=${height},left=${left},top=${top}`,
          )
          if (!popup) throw new Error('Failed to open popup')

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
          window.removeEventListener('message', onResponse)
          window.removeEventListener('message', onReady)
          ready.reject()
        },
        async syncRequests(requests) {
          if (!popup || popup.closed) this.open()
          popup?.focus()
          await ready.promise
          popup?.postMessage(
            { topic: 'rpc-requests', requests },
            hostUrl.origin,
          )
        },
      }
    },
  })
}

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
