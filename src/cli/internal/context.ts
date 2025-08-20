import { createClient, http } from 'viem'
import { getChainId } from 'viem/actions'

import * as Chains from '../../core/Chains.js'
import * as Mode from '../../core/Mode.js'
import * as Porto from '../../core/Porto.js'
import * as WalletClient from '../../viem/WalletClient.js'
import * as Dialog from '../Dialog.js'
import * as Utils from './utils.js'

/** Gets a Viem client for Porto Dialog. */
export async function getWalletClient(options: getWalletClient.Options = {}) {
  const { dialog: host } = options
  const porto = Porto.create({
    announceProvider: false,
    chains: [Chains.base, Chains.baseSepolia],
    mode: Mode.dialog({
      host: host ? new URL('/dialog', 'https://' + host).toString() : undefined,
      renderer: await Dialog.cli(),
    }),
  })
  return WalletClient.fromPorto(porto, {
    chain: Chains.base,
  })
}

export declare namespace getWalletClient {
  type Options = {
    /** Dialog hostname. */
    dialog?: string | undefined
  }
}

/** Gets a Viem client for Relay. */
export async function getRelayClient(options: getRelayClient.Options = {}) {
  const chain = Utils.kebabToCamel(options.chain!) as keyof typeof Chains
  const client = createClient({
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: _
    chain: Chains[chain] as Chains.Chain,
    transport: http(options.rpc),
  })
  client.chain = {
    ...client.chain,
    id: (await getChainId(client)) as never,
  }
  return client
}

export declare namespace getRelayClient {
  type Options = {
    /** Chain name. */
    chain?: string | undefined
    /** Relay URL. */
    rpc?: string | undefined
  }
}
