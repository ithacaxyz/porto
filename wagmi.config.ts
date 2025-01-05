import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { odysseyTestnet } from 'viem/chains'

export default defineConfig({
  out: 'src/core/internal/generated.ts',
  contracts: [],
  plugins: [
    foundry({
      deployments: {
        Delegation: {
          [odysseyTestnet.id]: '0x0ff027b63351364071425cf65d4fece75a8e17b8',
        },
      },
      project: 'contracts',
    }),
  ],
})
