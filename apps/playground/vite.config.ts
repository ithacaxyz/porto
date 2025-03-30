import { exp1Address } from '@porto/apps/contracts'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createServer } from 'prool'
import { anvil } from 'prool/instances'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert({
      hosts: [
        'localhost',
        'stg.localhost',
        process.env.ANVIL ? 'anvil.localhost' : '',
      ],
    }),
    react(),
    tailwindcss(),
    {
      name: 'anvil',
      async configureServer() {
        if (process.env.ANVIL !== 'true') return

        const [Chains, Anvil, { relay }] = await Promise.all([
          import('../../src/core/Chains.js'),
          import('../../test/src/anvil.js'),
          import('../../test/src/prool.js'),
        ])

        const anvilConfig = {
          port: 8545,
          rpcUrl: 'http://127.0.0.1:8545/1',
        }
        const relayConfig = {
          port: 9119,
          rpcUrl: 'http://127.0.0.1:9119/1',
        }
        const chain = Chains.odysseyTestnet

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
          entryPointAddress: chain.contracts.entryPoint.address,
          delegationAddress: chain.contracts.delegation.address,
          rpcUrl: anvilConfig.rpcUrl,
        })

        await createServer({
          instance: relay({
            endpoint: anvilConfig.rpcUrl,
            entrypoint: chain.contracts.entryPoint.address,
            feeTokens: [
              '0x0000000000000000000000000000000000000000',
              exp1Address,
            ],
            userOpGasBuffer: 100_000n,
            http: {
              port: relayConfig.port,
            },
          }),
          port: relayConfig.port,
        }).start()
        await fetch(relayConfig.rpcUrl + '/start')
      },
    },
  ],
})
