import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { anvil } from 'prool/instances'
import { createClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { writeContract } from 'viem/actions'
import { createLogger, defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

import {
  accountRegistryAddress,
  delegationNewProxyAddress,
  delegationProxyAddress,
  entryPointAddress,
  exp1Address,
  simulatorAddress,
} from '../../test/src/_generated/addresses.js'
import { relay } from '../../test/src/prool.js'

const logger = createLogger('info', {
  prefix: 'playground',
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    mkcert({
      hosts: ['localhost', 'dev.localhost', 'stg.localhost', 'anvil.localhost'],
    }),
    react(),
    tailwindcss(),
    {
      async configureServer(server) {
        if (process.env.ANVIL !== 'true') return

        const { exp1Abi } = await import('@porto/apps/contracts')

        process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

        const anvilConfig = {
          port: 8545,
          rpcUrl: 'http://127.0.0.1:8545',
        }
        const relayConfig = {
          port: 9119,
          rpcUrl: 'http://127.0.0.1:9119',
        }

        if (process.env.CLEAN === 'true')
          rmSync(resolve(import.meta.dirname, 'anvil.json'), {
            force: true,
          })

        logger.info('Starting Anvil...')

        await anvil({
          loadState: resolve(
            import.meta.dirname,
            '../../test/src/_generated/anvil.json',
          ),
          // @ts-ignore
          odyssey: true,
          port: anvilConfig.port,
        }).start()

        logger.info('Anvil started on ' + anvilConfig.rpcUrl)

        logger.info('Starting Relay...')

        const startRelay = async ({
          delegationProxy = delegationProxyAddress,
        }: {
          delegationProxy?: string
        } = {}) => {
          const stop = await relay({
            accountRegistry: accountRegistryAddress,
            delegationProxy,
            endpoint: anvilConfig.rpcUrl,
            entrypoint: entryPointAddress,
            feeTokens: [
              '0x0000000000000000000000000000000000000000',
              exp1Address,
            ],
            http: {
              port: relayConfig.port,
            },
            simulator: simulatorAddress,
            userOpGasBuffer: 100_000n,
          }).start()
          await fetch(relayConfig.rpcUrl + '/start')
          return stop
        }
        let stopRelay = await startRelay()

        logger.info('Relay started on ' + relayConfig.rpcUrl)

        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/relay/up')) {
            stopRelay()
            stopRelay = await startRelay({
              delegationProxy: delegationNewProxyAddress,
            })
            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
            return
          }
          if (req.url?.startsWith('/faucet')) {
            const url = new URL(`https://localhost${req.url}`)
            const address = url.searchParams.get('address') as `0x${string}`
            const value = url.searchParams.get('value') as string

            const client = createClient({
              account: privateKeyToAccount(
                '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
              ),
              transport: http(anvilConfig.rpcUrl),
            })

            const hash = await writeContract(client, {
              abi: exp1Abi,
              address: exp1Address,
              args: [address, BigInt(value)],
              chain: null,
              functionName: 'mint',
            })

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(JSON.stringify({ id: hash }))
            return
          }
          return next()
        })
      },
      name: 'anvil',
    },
  ],
}))
