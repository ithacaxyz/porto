import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { anvil } from 'prool/instances'
import { createLogger, defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import * as Chains from '../../src/core/Chains.js'
import * as Anvil from '../../test/src/anvil.js'
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
      async configureServer() {
        if (process.env.ANVIL !== 'true') return

        process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

        const { exp1Address } = await import('@porto/apps/contracts')

        const anvilConfig = {
          port: 8545,
          rpcUrl: 'http://127.0.0.1:8545',
        }
        const relayConfig = {
          port: 9119,
          rpcUrl: 'http://127.0.0.1:9119',
        }
        const chain = Chains.anvil

        if (process.env.CLEAN === 'true')
          rmSync(resolve(import.meta.dirname, 'anvil.json'), {
            force: true,
          })

        logger.info('Starting Anvil...')

        await anvil({
          // @ts-ignore
          odyssey: true,
          port: anvilConfig.port,
          state: resolve(import.meta.dirname, 'anvil.json'),
        }).start()

        logger.info('Anvil started on' + anvilConfig.rpcUrl)

        await Anvil.loadState({
          rpcUrl: anvilConfig.rpcUrl,
        })

        logger.info('Starting Relay...')

        await relay({
          accountRegistry: chain.contracts.accountRegistry.address,
          delegationProxy: chain.contracts.delegation.address,
          // delegationProxy: Anvil.delegation001Address,
          endpoint: anvilConfig.rpcUrl,
          entrypoint: chain.contracts.entryPoint.address,
          feeTokens: [
            '0x0000000000000000000000000000000000000000',
            exp1Address[chain.id],
          ],
          http: {
            port: relayConfig.port,
          },
          userOpGasBuffer: 100_000n,
        }).start()
        await fetch(relayConfig.rpcUrl + '/start')

        logger.info('Relay started on ' + relayConfig.rpcUrl)
      },
      name: 'anvil',
    },
  ],
}))
