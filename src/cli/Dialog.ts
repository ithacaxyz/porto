import * as Dialog from '../core/Dialog.js'
import type { QueuedRequest } from '../core/Porto.js'
import * as Messenger from './Messenger.js'

export const messenger = await Messenger.cliRelay()

/**
 * Instantiates a CLI dialog.
 *
 * @returns CLI dialog.
 */
export async function cli() {
  let isOpen = false

  return Dialog.from({
    name: 'cli',
    setup(parameters) {
      messenger.on('rpc-response', (response) => {
        Dialog.handleResponse(parameters.internal.store, response)
      })

      messenger.on('ready', () => {
        const { store } = parameters.internal
        const requestQueue = store.getState().requestQueue
        const requests = requestQueue
          .map((x) => (x.status === 'pending' ? x : undefined))
          .filter(Boolean) as readonly QueuedRequest[]
        messenger.send('rpc-requests', requests)
      })

      return {
        close() {},
        destroy() {
          messenger.destroy()
        },
        open() {
          const search = new URLSearchParams([['relayUrl', messenger.relayUrl]])

          const host = parameters.host.replace(/\/$/, '')
          const url = host + '/?' + search.toString()

          console.log('\n\nOpen the URL below in your browser to continue:')
          console.log(`\n${url}\n`)

          isOpen = true
        },
        async secure() {
          return {
            frame: true,
            host: true,
            protocol: true,
          }
        },
        async syncRequests(requests) {
          if (requests.length > 1)
            throw new Error(
              'renderer (`cli`) does not support multiple requests.',
            )
          if (!requests[0]?.request) return

          if (!isOpen) this.open()
          await messenger.waitForReady()
          messenger.send('rpc-requests', requests)
        },
      }
    },
    supportsHeadless: true,
  })
}

export declare namespace cli {
  type Options = {
    messenger: Messenger.CliRelay
  }
}
