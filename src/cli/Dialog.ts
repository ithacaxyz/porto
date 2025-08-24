import open from 'open'
import * as Dialog from '../core/Dialog.js'
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

      return {
        close() {},
        destroy() {
          messenger.destroy()
        },
        open() {
          const search = new URLSearchParams([
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
          const url = host + '/?' + search.toString()

          open(url)

          isOpen = true
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
