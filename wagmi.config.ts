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
          // [odysseyTestnet.id]: '0xde1e05b27289652cf1dcbbaaed1c0e3cb0e8c919',
          // TODO: Update once https://github.com/ithacaxyz/account/pull/6 merged.
          [odysseyTestnet.id]: '0x71048c9277e63087ba6390174691be1bea2c4985',
        },
      },
      project: 'contracts',
    }),
  ],
})
