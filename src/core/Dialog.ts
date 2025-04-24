import type { RpcRequest, RpcResponse } from 'ox'
import * as Provider from 'ox/Provider'
import type { Internal } from './internal/porto.js'
import * as UserAgent from './internal/userAgent.js'
import * as Messenger from './Messenger.js'
import type { QueuedRequest, Store } from './Porto.js'

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
  const includesUnsupported = (
    requests: readonly RpcRequest.RpcRequest[] | undefined,
  ) =>
    UserAgent.isSafari() &&
    requests?.some((x) =>
      ['wallet_connect', 'eth_requestAccounts'].includes(x.method),
    )

  return from({
    setup(parameters) {
      const { host, internal } = parameters
      const { store } = internal

      const fallback = popup()?.setup(parameters)

      let open = false

      const hostUrl = new URL(host)

      const root = document.createElement('dialog')
      root.dataset.porto = ''
      root.style.top = '-10000px'
      document.body.appendChild(root)

      const iframe = document.createElement('iframe')
      iframe.setAttribute(
        'allow',
        `publickey-credentials-get ${hostUrl.origin}; publickey-credentials-create ${hostUrl.origin}; clipboard-write`,
      )
      iframe.setAttribute('aria-closed', 'true')
      iframe.setAttribute('aria-label', 'Porto Wallet')
      iframe.setAttribute('hidden', 'until-found')
      iframe.setAttribute('role', 'dialog')
      iframe.setAttribute('tabindex', '0')
      iframe.setAttribute(
        'sandbox',
        'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
      )
      iframe.setAttribute('src', host)
      iframe.setAttribute('title', 'Porto')
      Object.assign(iframe.style, {
        ...styles.iframe,
        display: 'none',
        position: 'fixed',
      })

      root.appendChild(document.createElement('style')).textContent = `
        dialog[data-porto]::backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }

        dialog iframe {
          border-radius: 14px;
        }

        @media (min-width: 460px) {
          dialog iframe {
            animation: porto_fadeFromTop 0.1s cubic-bezier(0.32, 0.72, 0, 1);
            top: 16px;
            inset-inline-end: calc(50% - ${width}px / 2);
            width: ${width}px;
          }
        }

        @media (max-width: 460px) {
          dialog iframe {
            animation: porto_slideFromBottom 0.25s cubic-bezier(0.32, 0.72, 0, 1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100% !important;
          }
        }

        @keyframes porto_fadeFromTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes porto_slideFromBottom {
          from {
            transform: translate3d(0, 100%, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
      `

      root.appendChild(iframe)

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

      let methodPolicies: Messenger.ReadyOptions['methodPolicies'] | undefined

      messenger.on('ready', (options) => {
        const { chainId } = options

        if (!methodPolicies) methodPolicies = options?.methodPolicies

        store.setState((x) => ({
          ...x,
          chainId,
        }))

        messenger.send('__internal', {
          mode: 'iframe',
          referrer: getReferrer(),
          type: 'init',
        })
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
        if (payload.type === 'resize') {
          iframe.style.height = `${payload.height}px`
          if (!isMobile()) iframe.style.width = `${payload.width}px`
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
          fallback?.close()
          open = false
          root.close()
          Object.assign(document.body.style, bodyStyle ?? '')
          // firefox: explicitly restore/clear `overflow` directly
          document.body.style.overflow = bodyStyle.overflow ?? ''
          iframe.style.display = 'none'
          iframe.setAttribute('hidden', 'true')
          iframe.setAttribute('aria-closed', 'true')

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
          fallback?.destroy()
          this.close()
          document.removeEventListener('keydown', onEscape)
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

          root.showModal()
          document.addEventListener('keydown', onEscape)
          document.body.style.overflow = 'hidden'
          iframe.removeAttribute('hidden')
          iframe.removeAttribute('aria-closed')
          iframe.style.display = 'block'
        },
        async syncRequests(requests) {
          if (includesUnsupported(requests.map((x) => x.request)))
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

      function onBlur() {
        handleBlur(store)
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
            host,
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
            mode: isMobile() ? 'popup-standalone' : 'popup',
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
 * Instantiates an inline iframe dialog rendered on a provided `element`.
 *
 * @param options - Options.
 * @returns Inline iframe dialog.
 */
export function experimental_inline(options: inline.Options) {
  const { element } = options
  return from({
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
        'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
      )
      iframe.setAttribute('src', host)
      iframe.setAttribute('title', 'Porto')
      Object.assign(iframe.style, styles.iframe)

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
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const icon = isDark
    ? (document.querySelector(
        'link[rel="icon"][media="(prefers-color-scheme: dark)"]',
      ) as HTMLLinkElement)
    : (document.querySelector('link[rel="icon"]') as HTMLLinkElement)
  return {
    icon: icon?.href,
    origin: location.origin,
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
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.slice(0, 4),
    )
  )
}
