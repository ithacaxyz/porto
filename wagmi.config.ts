import { defineConfig } from '@wagmi/cli'
import { blockExplorer, foundry } from '@wagmi/cli/plugins'
import { odysseyTestnet } from 'viem/chains'

export default defineConfig([
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
