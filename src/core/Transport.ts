import { createTransport, type Transport } from 'viem'

export { fallback, http, type Transport, webSocket } from 'viem'

export const relayUrls = {
  anvil: { http: 'http://localhost:9119' },
  prod: { http: 'https://rpc.porto.sh' },
  stg: { http: 'https://stg-rpc.porto.sh' },
} as const

export function relayProxy(
  transports: relayProxy.Value,
): relayProxy.ReturnType {
  return (config) => {
    const transport_public = transports.public(config)
    const transport_relay = transports.relay(config)

    return createTransport({
      key: relayProxy.type,
      name: 'Relay Proxy',
      async request({ method, params }, options) {
        if (isRelay(method))
          return transport_relay.request({ method, params }, options) as never
        return transport_public.request({ method, params }, options) as never
      },
      type: relayProxy.type,
    })
  }
}

export namespace relayProxy {
  export const type = 'relayProxy'

  export type Value = { public: Transport; relay: Transport }

  export type ReturnType = Transport<typeof type>
}

/** @internal */
function isRelay(method: string) {
  if (method.startsWith('wallet_')) return true
  if (method.startsWith('account_')) return true
  if (method === 'health') return true
  return false
}
