import { defineConfig } from '@wagmi/cli'
import { blockExplorer } from '@wagmi/cli/plugins'
import { odysseyTestnet } from 'viem/chains'

const paths = [
  'apps/~internal',
  'examples/next/src',
  'examples/vite-react/src',
  'test/src',
]

export default defineConfig(
  paths.map((path) => ({
    contracts: [],
    out: `${path}/_generated/contracts.ts`,
    plugins: [
      blockExplorer({
        baseUrl: odysseyTestnet.blockExplorers.default.apiUrl,
        contracts: [
          {
            address: '0x541a5505620A658932e326D0dC996C460f5AcBE1',
            name: 'EXP1',
          },
          {
            address: '0x0Ee2d43FcaAF97e22E6Bfade9C7a9Cfcca309f25',
            name: 'EXP2',
          },
        ],
      }),
    ],
  })),
)
