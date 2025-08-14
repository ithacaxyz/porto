import * as fs from 'node:fs'
import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import {
  anvil,
  anvil2,
  anvil3,
  base,
  baseSepolia,
  optimismSepolia,
} from './src/core/Chains.js'
import * as anvilAddresses from './test/src/_generated/addresses.js'

const address = {
  exp1: {
    [anvil3.id]: anvilAddresses.exp1Address,
    [anvil.id]: anvilAddresses.exp1Address,
    [anvil2.id]: anvilAddresses.exp1Address,
    [base.id]: '0x074C9c3273F31651a9dae896C1A1d68E868b6998',
    [baseSepolia.id]: '0x3a9b126bf65c518f1e02602bd77bd1288147f94c',
    [optimismSepolia.id]: '0x3a9b126bf65c518f1e02602bd77bd1288147f94c',
  },
  exp2: {
    [anvil3.id]: anvilAddresses.exp2Address,
    [anvil.id]: anvilAddresses.exp2Address,
    [anvil2.id]: anvilAddresses.exp2Address,
    [base.id]: '0xFcc74F42621D03Fd234d5f40931D8B82923E4D29',
    [baseSepolia.id]: '0x6795f10304557a454b94a5c04e9217677cc9b598',
    [optimismSepolia.id]: '0x6795f10304557a454b94a5c04e9217677cc9b598',
  },
  expNft: {
    [anvil3.id]: anvilAddresses.expNftAddress,
    [anvil.id]: anvilAddresses.expNftAddress,
    [anvil2.id]: anvilAddresses.expNftAddress,
    [base.id]: '0xB37377508CbEd17a2B3694Fa0A68dc7CEE63DaF9',
    [baseSepolia.id]: '0x4d129f5033F60ED8419bC7d385c1e7aFa5Ebf88E',
    [optimismSepolia.id]: '0x074C9c3273F31651a9dae896C1A1d68E868b6998',
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
