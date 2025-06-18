import open from 'open'
import { RpcRequest } from 'ox'
import * as Dialog from '../core/Dialog.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import * as Messenger from './Messenger.js'

export const messenger = await Messenger.cliRelay()

/**
 * Instantiates a CLI dialog.
 *
 * @returns CLI dialog.
 */
export async function cli() {
  const store = RpcRequest.createStore<RpcSchema.Schema>()

  let isOpen = false

  return Dialog.from({
    name: 'cli',
    setup(parameters) {
      messenger.on('rpc-response', (response) => {
        Dialog.handleResponse(parameters.internal.store, response)
      })

      return {
        close() {},
        destroy() {
          messenger.destroy()
        },
        open(p: { request: RpcRequest.RpcRequest }) {
          const request = store.prepare(p.request)

          const search = new URLSearchParams([
            ['id', request.id.toString()],
            ['method', request.method],
            ['params', JSON.stringify(request.params)],
            [
              'referrer',
              JSON.stringify({
                title: 'Porto CLI',
                url: 'cli://porto',
              }),
            ],
            ['relayUrl', messenger.relayUrl],
          ])

          const host = parameters.host.replace(/\/$/, '')
          const url = host + '/' + request.method + '?' + search.toString()

          open(url)

          isOpen = true
        },
        async syncRequests(requests) {
          if (requests.length > 1)
            throw new Error(
              'renderer (`cli`) does not support multiple requests.',
            )
          if (!requests[0]?.request) return

          const request = store.prepare(requests[0]!.request)

          if (!isOpen) this.open({ request })
          else messenger.send('rpc-requests', requests)
        },
      }
    },
  })
}

export declare namespace cli {
  type Options = {
    messenger: Messenger.CliRelay
  }
}
