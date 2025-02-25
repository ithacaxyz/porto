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
          [odysseyTestnet.id]: '0x766dd4f7d39233d0c46e241011e18de4207197d8',
        },
        EntryPoint: {
          [odysseyTestnet.id]: '0xB28AF4994867Faf0be7aa6b1bfD6477a0d282410',
        },
      },
      project: 'contracts',
    }),
  ],
})
