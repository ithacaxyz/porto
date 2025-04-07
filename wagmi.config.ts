import { defineConfig } from '@wagmi/cli'
import { blockExplorer } from '@wagmi/cli/plugins'
import { odysseyTestnet } from 'viem/chains'

const paths = ['apps/~internal', 'examples/wagmi/src', 'test/src']

export default defineConfig(
  paths.map((path) => ({
    contracts: [],
    out: `${path}/_generated/contracts.ts`,
    plugins: [
      blockExplorer({
        baseUrl: odysseyTestnet.blockExplorers.default.apiUrl,
        contracts: [
          {
            address: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
            name: 'EXP1',
          },
          {
            address: '0x390dd40042a844f92b499069cfe983236d9fe204',
            name: 'EXP2',
          },
        ],
      }),
    ],
  })),
)
