import type * as ChildProcess from 'node:child_process'
import open from 'open'
import { RpcRequest } from 'ox'
import * as Dialog from '../core/Dialog.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import type * as Messenger from './Messenger.js'

/**
 * Instantiates a CLI dialog.
 *
 * @returns CLI dialog.
 */
export function cli(options: cli.Options) {
  const { messenger } = options

  let browser: ChildProcess.ChildProcess | undefined
  const store = RpcRequest.createStore<RpcSchema.Schema>()

  return Dialog.from({
    name: 'cli',
    setup(parameters) {
      messenger.on('rpc-response', (response) => {
        Dialog.handleResponse(parameters.internal.store, response)
      })

      return {
        close() {
          throw new Error(
            'renderer (`cli`) does not support programmatic closing.',
          )
        },
        destroy() {
          if (browser) browser.kill()
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
            ['callbackMode', 'localRelay'],
            ['callbackUrl', messenger.callbackUrl],
          ])

          const host = parameters.host.replace(/\/$/, '')
          const url = host + '/' + request.method + '?' + search.toString()

          open(url).then((b) => {
            browser = b
          })
        },
        async syncRequests(requests) {
          if (requests.length > 1)
            throw new Error(
              'renderer (`cli`) does not support multiple requests.',
            )
          if (!requests[0]?.request) return

          const request = store.prepare(requests[0]!.request)

          this.open({ request })
        },
      }
    },
  })
}

export declare namespace cli {
  type Options = {
    messenger: Messenger.LocalRelay
  }
}
