import { resolve } from 'node:path'
import { type Hex, Mnemonic, RpcTransport } from 'ox'
import { createServer } from 'prool'
import { type AnvilParameters, anvil } from 'prool/instances'
import { type PrivateKeyAccount, privateKeyToAccount } from 'viem/accounts'
import type { FixedArray } from '../../src/core/internal/types.js'
import { poolId } from './prool.js'

export const enabled = process.env.VITE_DEFAULT_ENV === 'anvil'

export const accounts = Array.from({ length: 20 }, (_, i) => i).map((i) => {
  const privateKey = Mnemonic.toPrivateKey(
    'test test test test test test test test test test test junk',
    {
      as: 'Hex',
      path: Mnemonic.path({ index: i }),
    },
  )
  return {
    ...privateKeyToAccount(privateKey),
    privateKey,
  }
}) as unknown as FixedArray<PrivateKeyAccount & { privateKey: Hex.Hex }, 20>

export const account = {
  relay: accounts[9],
} as const

export const instances = {
  anvil: defineAnvil({
    loadState: resolve(import.meta.dirname, '_generated/anvil.json'),
    port: 8545,
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineAnvil(parameters: AnvilParameters) {
  const { port } = parameters
  const rpcUrl = `http://127.0.0.1:${port}/${poolId}`

  const config = {
    ...parameters,
    accounts: accounts.length,
    odyssey: true,
  } as const

  const transport = RpcTransport.fromHttp(rpcUrl)

  return {
    config,
    port,
    request: transport.request,
    async restart() {
      await fetch(`${rpcUrl}/restart`)
    },
    rpcUrl,
    async start() {
      return await createServer({
        instance: anvil(config),
        port,
      }).start()
    },
  }
}
