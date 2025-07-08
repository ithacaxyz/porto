import { Chains, Mode, Porto, Storage } from 'porto'
import { http } from 'viem'
import * as ServerClient from '../../src/viem/ServerClient.js'
import * as Contracts from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import * as RpcServer from './rpcServer.js'

// Determine which chain to use based on RPC URL
const rpcUrl = process.env.VITE_RPC_URL || 'https://porto-dev.rpc.ithaca.xyz'
export const chain = Anvil.enabled
  ? Chains.anvil
  : rpcUrl === 'https://base-sepolia.rpc.ithaca.xyz'
    ? Chains.baseSepolia
    : rpcUrl === 'https://base-mainnet.rpc.ithaca.xyz'
      ? Chains.base
      : Chains.portoDev

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
    mode?: (parameters: {
      permissionsFeeLimit: Record<string, string>
      mock: boolean
    }) => Mode.Mode | undefined
    merchantRpcUrl?: string | undefined
    rpcUrl?: string | undefined
  } = {},
) {
  const {
    mode = Mode.rpcServer,
    merchantRpcUrl,
    rpcUrl = Anvil.enabled
      ? RpcServer.instances.portoDev.rpcUrl
      : process.env.VITE_RPC_URL || 'https://porto-dev.rpc.ithaca.xyz',
  } = parameters
  const porto = Porto.create({
    chains: [chain],
    merchantRpcUrl,
    mode: mode({
      mock: true,
      permissionsFeeLimit: {
        ETH: '0.1',
        USDC: '100',
        USDT: '100',
      },
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
