import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import {
  anvil,
  baseSepolia,
  odysseyDevnet,
  odysseyTestnet,
} from './src/core/Chains.js'
import * as anvilAddresses from './test/src/_generated/addresses.js'

const address = {
  exp1: {
    [anvil.id]: anvilAddresses.exp1Address,
    [baseSepolia.id]: '0x29f45fc3ed1d0ffafb5e2af9cc6c3ab1555cd5a2',
    [odysseyDevnet.id]: '0x541a5505620A658932e326D0dC996C460f5AcBE1',
    [odysseyTestnet.id]: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
  },
  exp2: {
    [anvil.id]: anvilAddresses.exp2Address,
    [baseSepolia.id]: '0x62a9d6de963a5590f6fba5119e937f167677bfe7',
    [odysseyDevnet.id]: '0x0Ee2d43FcaAF97e22E6Bfade9C7a9Cfcca309f25',
    [odysseyTestnet.id]: '0x390dd40042a844f92b499069cfe983236d9fe204',
  },
  expNft: {
    [anvil.id]: anvilAddresses.expNftAddress,
    [baseSepolia.id]: '0xD37861F91a23aF5929F1617D9c94586e822b0a47',
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
