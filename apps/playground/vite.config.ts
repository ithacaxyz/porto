import { spawnSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequestListener } from '@mjackson/node-fetch-server'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { anvil } from 'prool/instances'
import { createClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { writeContract } from 'viem/actions'
import * as chains from 'viem/chains'
import { createLogger, defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { Key, RpcServer } from '../../src/index.js'
import { Sponsor } from '../../src/server/index.js'
import {
  accountNewProxyAddress,
  accountProxyAddress,
  accountRegistryAddress,
  exp1Address,
  orchestratorAddress,
  simulatorAddress,
} from '../../test/src/_generated/addresses.js'
import { rpcServer } from '../../test/src/prool.js'

const logger = createLogger('info', {
  prefix: 'playground',
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === 'test'
      ? null
      : mkcert({
          hosts: [
            'localhost',
            'prod.localhost',
            'stg.localhost',
            'dev.localhost',
            'anvil.localhost',
          ],
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
        const anvilClient = createClient({
          account: privateKeyToAccount(
            '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
          ),
          transport: http(anvilConfig.rpcUrl),
        }).extend(() => ({ mode: 'anvil' }))

        const rpcServerConfig = {
          port: 9119,
          rpcUrl: 'http://127.0.0.1:9119',
        }
        const relayClient = createClient({
          chain: chains.anvil,
          transport: http(rpcServerConfig.rpcUrl),
        })

        if (process.env.CLEAN === 'true')
          rmSync(resolve(import.meta.dirname, 'anvil.json'), {
            force: true,
          })

        logger.info('Starting Anvil...')

        await anvil({
          host: process.env.CI ? '0.0.0.0' : undefined,
          loadState: resolve(
            import.meta.dirname,
            '../../test/src/_generated/anvil.json',
          ),
          // @ts-ignore
          odyssey: true,
          port: anvilConfig.port,
        }).start()

        logger.info('Anvil started on ' + anvilConfig.rpcUrl)

        logger.info('Starting RPC Server...')

        const startRpcServer = async ({
          accountProxy = accountProxyAddress,
        }: {
          accountProxy?: string
        } = {}) => {
          const containerName = 'playground'
          spawnSync('docker', ['rm', '-f', containerName])
          const stop = await rpcServer({
            accountRegistry: accountRegistryAddress,
            containerName: 'playground',
            delegationProxy: accountProxy,
            endpoint: anvilConfig.rpcUrl,
            feeTokens: [
              '0x0000000000000000000000000000000000000000',
              exp1Address,
            ],
            http: {
              port: rpcServerConfig.port,
            },
            intentGasBuffer: 100_000n,
            orchestrator: orchestratorAddress,
            simulator: simulatorAddress,
            txGasBuffer: 100_000n,
          }).start()
          await fetch(rpcServerConfig.rpcUrl + '/start')
          return stop
        }
        let stopRpcServer = await startRpcServer()

        logger.info('RPC Server started on ' + rpcServerConfig.rpcUrl)

        // Allow CORS.
        server.middlewares.use(async (_, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*')
          next()
        })

        // Upgrade RPC Server on `/rpc/up`.
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/rpc/up')) return next()

          stopRpcServer()
          stopRpcServer = await startRpcServer({
            accountProxy: accountNewProxyAddress,
          })
          res.statusCode = 302
          res.setHeader('Location', '/')
          return res.end()
        })

        // Drip tokens on `/faucet`.
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/faucet')) return next()

          const url = new URL(`https://localhost${req.url}`)
          const address = url.searchParams.get('address') as `0x${string}`
          const value = url.searchParams.get('value') as string

          const hash = await writeContract(anvilClient, {
            abi: exp1Abi,
            address: exp1Address,
            args: [address, BigInt(value)],
            chain: null,
            functionName: 'mint',
          })

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ id: hash }))
        })

        // Create app-sponsor account.
        const sponsorKey = Key.createSecp256k1()
        const sponsorAccount = await RpcServer.createAccount(relayClient, {
          keys: [sponsorKey],
        })
        await writeContract(anvilClient, {
          abi: exp1Abi,
          address: exp1Address,
          args: [sponsorAccount.address, parseEther('10000')],
          chain: null,
          functionName: 'mint',
        })
        await RpcServer.sendCalls(relayClient, {
          account: sponsorAccount,
          calls: [],
          feeToken: exp1Address,
        })

        // Handle sponsor requests on `/sponsor`.
        // TODO: move to CF worker for compatibility with non-anvil (prod/stg/dev) environments.
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/sponsor')) return next()
          if (req.method !== 'POST') return next()

          const handler = Sponsor.rpcHandler({
            address: sponsorAccount.address,
            key: {
              privateKey: sponsorKey.privateKey!(),
              type: 'secp256k1',
            },
            transports: {
              [chains.anvil.id]: http(rpcServerConfig.rpcUrl),
            },
          })

          return createRequestListener(handler)(req, res)
        })
      },
      name: 'anvil',
    },
  ],
}))
