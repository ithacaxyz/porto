import { defineConfig } from '@wagmi/cli'
import { blockExplorer } from '@wagmi/cli/plugins'
import { odysseyDevnet, odysseyTestnet } from './src/core/Chains.js'

const address = {
  exp1: {
    [odysseyDevnet.id]: '0x541a5505620A658932e326D0dC996C460f5AcBE1',
    [odysseyTestnet.id]: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
  },
  exp2: {
    [odysseyDevnet.id]: '0x0Ee2d43FcaAF97e22E6Bfade9C7a9Cfcca309f25',
    [odysseyTestnet.id]: '0x390dd40042a844f92b499069cfe983236d9fe204',
  },
} as const

export default defineConfig([
  ...['examples/next/src', 'examples/vite-react/src'].map((path) => ({
    contracts: [],
    out: `${path}/_generated/contracts.ts`,
    plugins: [
      blockExplorer({
        baseUrl: odysseyTestnet.blockExplorers.default.apiUrl,
        contracts: [
          {
            address: address.exp1[odysseyTestnet.id],
            name: 'EXP1',
          },
          {
            address: address.exp2[odysseyTestnet.id],
            name: 'EXP2',
          },
        ],
      }),
    ],
  })),
  ...['apps/~internal', 'test/src'].map((path) => ({
    contracts: [],
    out: `${path}/_generated/contracts.ts`,
    plugins: [
      blockExplorer({
        baseUrl: odysseyTestnet.blockExplorers.default.apiUrl,
        chainId: odysseyTestnet.id,
        contracts: [
          {
            address,
            name: 'EXP1',
          },
          {
            address,
            name: 'EXP2',
          },
        ],
        getAddress: (config) =>
          config.address[odysseyTestnet.id] as `0x${string}`,
      }),
    ],
  })),
])
