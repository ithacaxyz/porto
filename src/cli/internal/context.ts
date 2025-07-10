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
    chains: [Chains.baseSepolia, Chains.portoDev],
    mode: Mode.dialog({
      host: host ? new URL('/dialog', 'https://' + host).toString() : undefined,
      renderer: await Dialog.cli(),
    }),
  })
  return WalletClient.fromPorto(porto)
}

export declare namespace getWalletClient {
  type Options = {
    /** Dialog hostname. */
    dialog?: string | undefined
  }
}

/** Gets a Viem client for RPC Server. */
export async function getServerClient(options: getServerClient.Options = {}) {
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

export declare namespace getServerClient {
  type Options = {
    /** Chain name. */
    chain?: string | undefined
    /** RPC Server URL. */
    rpc?: string | undefined
  }
}
