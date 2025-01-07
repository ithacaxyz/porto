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
          // TODO: uncomment when odyssey has P256VERIFY precompile at 0x100
          // [odysseyTestnet.id]: '0x0ff027b63351364071425cf65d4fece75a8e17b8',
          [odysseyTestnet.id]: '0xc8f36b7222e22d192aa0b73046cdd47444392570',
        },
      },
      project: 'contracts',
    }),
  ],
})
