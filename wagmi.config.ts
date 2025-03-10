import { defineConfig } from '@wagmi/cli'
import { blockExplorer, foundry } from '@wagmi/cli/plugins'
import { odysseyTestnet } from 'viem/chains'

export default defineConfig([
  {
    out: 'src/core/internal/generated.ts',
    contracts: [],
    plugins: [
      foundry({
        deployments: {
          Delegation: {
            [odysseyTestnet.id]: '0xabe148edaa9046303c9b9d42243c23b9599484cd',
          },
        },
        project: 'contracts',
      }),
    ],
  },
  {
    out: 'docs/generated.ts',
    contracts: [],
    plugins: [
      blockExplorer({
        baseUrl: odysseyTestnet.blockExplorers.default.apiUrl,
        contracts: [
          {
            name: 'EXP1',
            address: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
          },
          {
            name: 'EXP2',
            address: '0x390dd40042a844f92b499069cfe983236d9fe204',
          },
        ],
      }),
    ],
  },
])
