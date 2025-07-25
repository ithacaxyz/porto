import { Mode, Porto, Storage } from 'porto'
import { http } from 'viem'
import * as ServerClient from '../../src/viem/ServerClient.js'
import * as Contracts from './_generated/contracts.js'
import { getChain } from './chains.js'
import { poolId } from './prool.js'

const env = import.meta.env.VITE_DEFAULT_ENV
const chain = getChain(env)

export const exp1Address = Contracts.exp1Address[chain.id]
export const exp1Abi = Contracts.exp1Abi
export const exp1Config = {
  abi: exp1Abi,
  address: exp1Address,
} as const

export const exp2Address = Contracts.exp2Address[chain.id]
export const exp2Abi = Contracts.exp2Abi
export const exp2Config = {
  abi: exp2Abi,
  address: exp2Address,
} as const

export function getPorto(
  parameters: {
    mode?: (parameters: { mock: boolean }) => Mode.Mode | undefined
    merchantRpcUrl?: string | undefined
    rpcUrl?: string | undefined
  } = {},
) {
  const {
    mode = Mode.rpcServer,
    merchantRpcUrl,
    rpcUrl: overrideRpcUrl = import.meta.env.VITE_RPC_URL,
  } = parameters
  const rpcUrl =
    overrideRpcUrl ||
    `${chain.rpcUrls.default.http[0]}${env === 'anvil' ? `/${poolId}` : ''}`
  const porto = Porto.create({
    chains: [chain],
    feeToken: 'EXP',
    merchantRpcUrl,
    mode: mode({
      mock: true,
    }),
    storage: Storage.memory(),
    transports: {
      [chain.id]: http(rpcUrl, {
        async onFetchRequest(_, init) {
          if (process.env.VITE_RPC_DEBUG !== 'true') return
          console.log(`curl \\
${rpcUrl} \\
-X POST \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(JSON.parse(init.body as string))}'`)
        },
        async onFetchResponse(response) {
          if (process.env.VITE_RPC_DEBUG !== 'true') return
          console.log('> ' + JSON.stringify(await response.clone().json()))
        },
      }),
    } as Porto.Config['transports'],
  })

  const client = ServerClient.fromPorto(porto).extend(() => ({
    mode: 'anvil',
  }))

  const delegation = client.chain.contracts.portoAccount.address

  return { client, delegation, porto }
}
