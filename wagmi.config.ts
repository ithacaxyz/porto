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
          [odysseyTestnet.id]: '0xde1e05b27289652cf1dcbbaaed1c0e3cb0e8c919',
        },
      },
      project: 'contracts',
    }),
  ],
})
