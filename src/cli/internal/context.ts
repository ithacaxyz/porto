import { createClient, http } from 'viem'
import { getChainId } from 'viem/actions'

import * as Chains from '../../core/Chains.js'
import * as Utils from './utils.js'

/** Gets a Viem client for RPC Server. */
export async function getClient(options: getClient.Options = {}) {
  const chain = Utils.kebabToCamel(options.chain!) as keyof typeof Chains
  const client = createClient({
    chain: Chains[chain] as Chains.Chain,
    transport: http(options.rpc),
  })
  client.chain = {
    ...client.chain,
    id: (await getChainId(client)) as never,
  }
  return client
}

export declare namespace getClient {
  type Options = {
    /** Chain name. */
    chain?: string | undefined
    /** RPC Server URL. */
    rpc?: string | undefined
  }
}
