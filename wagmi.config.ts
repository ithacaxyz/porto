import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { anvil, baseSepolia, portoDev } from './src/core/Chains.js'

const address = {
  exp1: {
    [anvil.id]: '0xe1aa25618fa0c7a1cfdab5d6b456af611873b629',
    [baseSepolia.id]: '0x29f45fc3ed1d0ffafb5e2af9cc6c3ab1555cd5a2',
    [portoDev.id]: '0x29f45fc3ed1d0ffafb5e2af9cc6c3ab1555cd5a2',
  },
  exp2: {
    [anvil.id]: '0xe1da8919f262ee86f9be05059c9280142cf23f48',
    [baseSepolia.id]: '0x62a9d6de963a5590f6fba5119e937f167677bfe7',
    [portoDev.id]: '0x502ff46e72c47b8c3183db8919700377eed66d2e',
  },
  expNft: {
    [anvil.id]: '0x4d8e02bbfcf205828a8352af4376b165e123d7b0',
    [baseSepolia.id]: '0xD37861F91a23aF5929F1617D9c94586e822b0a47',
    [portoDev.id]: '0xef11D1c2aA48826D4c41e54ab82D1Ff5Ad8A64Ca',
  },
} as const

export default defineConfig([
  ...['apps/wagmi/src', 'examples/next/src', 'examples/vite-react/src'].map(
    (path) => ({
      contracts: [],
      out: `${path}/_generated/contracts.ts`,
      plugins: [
        foundry({
          deployments: {
            ExperimentERC20: address.exp1[baseSepolia.id],
            ExperimentERC721: address.expNft[baseSepolia.id],
          },
          forge: {
            build: false,
          },
          getName(name) {
            if (name === 'ExperimentERC20') return 'exp1'
            if (name === 'ExperimentERC721') return 'expNft'
            return name
          },
          project: './contracts/demo',
        }),
        foundry({
          deployments: {
            ExperimentERC20: address.exp2[baseSepolia.id],
          },
          forge: {
            build: false,
          },
          getName(name) {
            if (name === 'ExperimentERC20') return 'exp2'
            return name
          },
          include: ['ExperimentERC20.json'],
          project: './contracts/demo',
        }),
      ],
    }),
  ),
  ...['apps/~internal', 'test/src'].map((path) => ({
    contracts: [],
    out: `${path}/_generated/contracts.ts`,
    plugins: [
      foundry({
        deployments: {
          ExperimentERC20: address.exp1,
          ExperimentERC721: address.expNft,
        },
        forge: {
          build: false,
        },
        getName(name) {
          if (name === 'ExperimentERC20') return 'exp1'
          if (name === 'ExperimentERC721') return 'expNft'
          return name
        },
        project: './contracts/demo',
      }),
      foundry({
        deployments: {
          ExperimentERC20: address.exp2,
        },
        forge: {
          build: false,
        },
        getName(name) {
          if (name === 'ExperimentERC20') return 'exp2'
          return name
        },
        include: ['ExperimentERC20.json'],
        project: './contracts/demo',
      }),
    ],
  })),
])
