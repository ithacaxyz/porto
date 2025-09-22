import ChildProcess from 'node:child_process'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { anvil } from 'prool/instances'
import { createClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { writeContract } from 'viem/actions'
import * as chains from 'viem/chains'
import { createLogger, defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { Key, RelayActions } from '../../src/index.js'
import { Route } from '../../src/server/index.js'
import {
  accountNewProxyAddress,
  accountProxyAddress,
  escrowAddress,
  exp1Address,
  funderAddress,
  orchestratorAddress,
  simulatorAddress,
} from '../../test/src/_generated/addresses.js'
import * as Anvil from '../../test/src/anvil.js'
import { relay } from '../../test/src/prool.js'
import { Plugins } from '../~internal/vite/index'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

const logger = createLogger('info', {
  prefix: 'playground',
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  /**
   * when using `tailscale funnel`, add the following to `.env`:
   * - `SKIP_MKCERT=true` - disables mkcert
   * - `ALLOWED_HOSTS=...` - add funnel host to `ALLOWED_HOSTS`
   */
  const skipMkcert = env.SKIP_MKCERT === 'true' || mode === 'test'
  const allowedHosts = env.ALLOWED_HOSTS?.split(',') ?? []

  return {
    define: {
      __APP_VERSION__: JSON.stringify(commitSha),
    },
    plugins: [
      skipMkcert
        ? null
        : mkcert({
            hosts: ['localhost', 'stg.localhost', 'anvil.localhost'],
          }),
      react(),
      Plugins.Icons(),
      tailwindcss(),
      {
        // TODO(next): support `anvil2` & `anvil3`.
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

          const relayConfig = {
            port: 9119,
            rpcUrl: 'http://127.0.0.1:9119',
          }
          const relayClient = createClient({
            chain: chains.anvil,
            transport: http(relayConfig.rpcUrl),
          })

          if (process.env.CLEAN === 'true')
            rmSync(resolve(import.meta.dirname, 'anvil.json'), {
              force: true,
            })

          logger.info('Starting Anvil...')

          await anvil({
            hardfork: 'osaka' as never,
            host: process.env.CI ? '0.0.0.0' : undefined,
            loadState: resolve(
              import.meta.dirname,
              '../../test/src/_generated/anvil.json',
            ),
            port: anvilConfig.port,
          }).start()

          logger.info('Anvil started on ' + anvilConfig.rpcUrl)

          logger.info('Starting Relay...')

          const startRelay = async ({
            accountProxy = accountProxyAddress,
            legacyAccountProxy,
          }: {
            accountProxy?: string
            legacyAccountProxy?: string
          } = {}) => {
            const containerName = 'playground'
            ChildProcess.spawnSync('docker', ['rm', '-f', containerName])
            const stop = await relay({
              containerName: 'playground',
              delegationProxy: accountProxy,
              endpoint: anvilConfig.rpcUrl,
              escrow: escrowAddress,
              feeTokens: [
                '0x0000000000000000000000000000000000000000',
                exp1Address,
              ],
              funder: funderAddress,
              funderOwnerKey: Anvil.account.relay.privateKey,
              funderSigningKey: Anvil.account.relay.privateKey,
              http: {
                port: relayConfig.port,
              },
              intentGasBuffer: 100_000n,
              interopToken: exp1Address,
              legacyDelegationProxy: legacyAccountProxy,
              orchestrator: orchestratorAddress,
              simulator: simulatorAddress,
              txGasBuffer: 100_000n,
              version: 'v24.0.8',
            }).start()
            await fetch(relayConfig.rpcUrl + '/start')
            return stop
          }
          let stopRelay = await startRelay()

          logger.info('Relay started on ' + relayConfig.rpcUrl)

          // Allow CORS.
          server.middlewares.use(async (_, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            next()
          })

          // Upgrade Relay on `/rpc/up`.
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith('/rpc/up')) return next()

            stopRelay()
            stopRelay = await startRelay({
              accountProxy: accountNewProxyAddress,
              legacyAccountProxy: accountProxyAddress,
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

          // Create merchant account.
          const merchantKey = Key.createSecp256k1()
          const merchantAccount = await RelayActions.createAccount(
            relayClient,
            {
              authorizeKeys: [merchantKey],
            },
          )
          await writeContract(anvilClient, {
            abi: exp1Abi,
            address: exp1Address,
            args: [merchantAccount.address, parseEther('10000')],
            chain: null,
            functionName: 'mint',
          })
          await RelayActions.sendCalls(relayClient, {
            account: merchantAccount,
            calls: [],
          })

          // Handle merchant requests on `/merchant`.
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith('/merchant')) return next()
            if (req.method !== 'POST') return next()

            return Route.merchant({
              address: merchantAccount.address,
              key: merchantKey.privateKey!(),
              relay: http(relayConfig.rpcUrl),
            }).listener(req, res)
          })
        },
        name: 'anvil',
      },
    ],
    server: {
      allowedHosts,
    },
  }
})
