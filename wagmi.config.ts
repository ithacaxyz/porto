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
          [odysseyTestnet.id]: '0x44b636676dbbc8361ffa519a121958958b66ba3f',
        },
      },
      project: 'contracts',
    }),
  ],
})
