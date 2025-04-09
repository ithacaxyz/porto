import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createServer } from 'prool'
import { anvil } from 'prool/instances'
import { createLogger, defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

import * as Chains from '../../src/core/Chains.js'
import * as Anvil from '../../test/src/anvil.js'
import { relay } from '../../test/src/prool.js'

const logger = createLogger('info', {
  prefix: 'playground',
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert({
      force: true,
      hosts: [
        'localhost',
        'stg.localhost',
        process.env.ANVIL === 'true' ? 'anvil.localhost' : '',
      ],
    }),
    react(),
    tailwindcss(),
    {
      async configureServer() {
        if (process.env.ANVIL !== 'true') return

        const { exp1Address } = await import('@porto/apps/contracts')

        const anvilConfig = {
          port: 8545,
          rpcUrl: 'http://127.0.0.1:8545/1',
        }
        const relayConfig = {
          port: 9119,
          rpcUrl: 'http://127.0.0.1:9119/1',
        }
        const chain = Chains.odysseyTestnet

        logger.info('Starting Anvil...')

        await createServer({
          instance: anvil({
            chainId: chain.id,
            forkUrl: chain.rpcUrls.default.http[0],
            // @ts-ignore
            odyssey: true,
          }),
          port: anvilConfig.port,
        }).start()

        await Anvil.loadState({
          delegationAddress: chain.contracts.delegation.address,
          entryPointAddress: chain.contracts.entryPoint.address,
          rpcUrl: anvilConfig.rpcUrl,
        })

        logger.info('Anvil started on' + anvilConfig.rpcUrl)
        logger.info('Starting Relay...')

        await createServer({
          instance: relay({
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
          }),
          port: relayConfig.port,
        }).start()
        await fetch(relayConfig.rpcUrl + '/start')

        logger.info('Relay started on ' + relayConfig.rpcUrl)
      },
      name: 'anvil',
    },
  ],
})
