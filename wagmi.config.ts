import * as fs from 'node:fs'
import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { type Address, createClient, http } from 'viem'
import { getCapabilities } from 'viem/actions'
import {
  anvil,
  anvil2,
  anvil3,
  arbitrumSepolia,
  base,
  baseSepolia,
  optimismSepolia,
  sepolia,
} from './src/core/Chains.js'
import * as anvilAddresses from './test/src/_generated/addresses.js'

const client = createClient({
  transport: http('https://rpc.porto.sh'),
})

const capabilities = await getCapabilities(client)
if (!capabilities) throw new Error('No capabilities found')

const getTokenAddress = (
  chainId: keyof typeof capabilities,
  tokenUid: 'exp1' | 'exp2',
) => {
  const token = capabilities[chainId].fees.tokens.find(
    (t: { uid: string }) => t.uid === tokenUid,
  )
  if (!token)
    throw new Error(`Token ${tokenUid} not found for chain ${chainId}`)
  return token.address as Address
}

const address = {
  exp1: {
    [anvil3.id]: anvilAddresses.exp1Address,
    [anvil.id]: anvilAddresses.exp1Address,
    [anvil2.id]: anvilAddresses.exp1Address,
    [sepolia.id]: getTokenAddress(sepolia.id, 'exp1'),
    [baseSepolia.id]: getTokenAddress(baseSepolia.id, 'exp1'),
    [optimismSepolia.id]: getTokenAddress(optimismSepolia.id, 'exp1'),
    [arbitrumSepolia.id]: getTokenAddress(arbitrumSepolia.id, 'exp1'),
  },
  exp2: {
    [anvil3.id]: anvilAddresses.exp2Address,
    [anvil.id]: anvilAddresses.exp2Address,
    [anvil2.id]: anvilAddresses.exp2Address,
    [sepolia.id]: getTokenAddress(sepolia.id, 'exp2'),
    [baseSepolia.id]: getTokenAddress(baseSepolia.id, 'exp2'),
    [optimismSepolia.id]: getTokenAddress(optimismSepolia.id, 'exp2'),
    [arbitrumSepolia.id]: getTokenAddress(arbitrumSepolia.id, 'exp2'),
  },
  expNft: {
    [anvil3.id]: anvilAddresses.expNftAddress,
    [anvil.id]: anvilAddresses.expNftAddress,
    [anvil2.id]: anvilAddresses.expNftAddress,
    [base.id]: '0x395f6844643F724dBd7fcc52d64dD33F2C1eE63E',
    [baseSepolia.id]: '0x6C083d9E58037A301917Cf21DF55a68518c935E1',
    [optimismSepolia.id]: '0xf8C11A1F8aA0622CFbd9E4a34453319b1f5c0A10',
  },
} as const

const examples = fs
  .readdirSync('examples')
  .filter((dir) => fs.statSync(`examples/${dir}`).isDirectory())
  .map((dir) => `examples/${dir}/src`)

export default defineConfig([
  ...['apps/wagmi/src', ...examples].map((path) => ({
    contracts: [],
    out: `${path}/contracts.ts`,
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
  })),
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
