import * as fs from 'node:fs'
import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import type { Address } from 'viem'
import capabilities from './scripts/capabilities.ts'
import {
  anvil,
  anvil2,
  anvil3,
  arbitrumSepolia,
  base,
  baseSepolia,
  optimismSepolia,
} from './src/core/Chains.js'
import * as anvilAddresses from './test/src/_generated/addresses.js'

const getTokenAddress = (chainId: number, tokenUid: 'exp1' | 'exp2') => {
  const token = capabilities[chainId].fees.tokens.find(
    (t) => t.uid === tokenUid,
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
    [base.id]: '0x074C9c3273F31651a9dae896C1A1d68E868b6998',
    [baseSepolia.id]: getTokenAddress(baseSepolia.id, 'exp1'),
    [optimismSepolia.id]: getTokenAddress(optimismSepolia.id, 'exp1'),
    [arbitrumSepolia.id]: getTokenAddress(arbitrumSepolia.id, 'exp1'),
  },
  exp2: {
    [anvil3.id]: anvilAddresses.exp2Address,
    [anvil.id]: anvilAddresses.exp2Address,
    [anvil2.id]: anvilAddresses.exp2Address,
    [base.id]: '0xFcc74F42621D03Fd234d5f40931D8B82923E4D29',
    [baseSepolia.id]: getTokenAddress(baseSepolia.id, 'exp2'),
    [optimismSepolia.id]: getTokenAddress(optimismSepolia.id, 'exp2'),
    [arbitrumSepolia.id]: getTokenAddress(arbitrumSepolia.id, 'exp2'),
  },
  expNft: {
    [anvil3.id]: anvilAddresses.expNftAddress,
    [anvil.id]: anvilAddresses.expNftAddress,
    [anvil2.id]: anvilAddresses.expNftAddress,
    [base.id]: '0xB37377508CbEd17a2B3694Fa0A68dc7CEE63DaF9',
    [baseSepolia.id]: '0x327cC427d8175b24D2D62CF57F5Fa4d577d6f716',
    [optimismSepolia.id]: '0x6A8Cea0F118041bF7C4A8DA694A130AA252e8783',
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
