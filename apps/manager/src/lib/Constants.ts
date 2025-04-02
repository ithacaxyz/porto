import { exp1Address, exp2Address } from '@porto/apps/contracts'
import type { Address } from 'ox'
import { base, baseSepolia, odysseyTestnet } from 'viem/chains'
import type { ChainId } from '~/lib/Wagmi'

export const CORS_DESTROYER_URL = 'https://cors.porto.workers.dev'

export function urlWithCorsBypass(url: string) {
  return `${CORS_DESTROYER_URL}?url=${url}`
}

export const ethAsset = {
  address: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  logo: '/icons/eth.svg',
  name: 'Ethereum',
  symbol: 'ETH',
} as const

export const defaultAssets: Record<
  ChainId,
  ReadonlyArray<{
    name: string
    logo: string
    symbol: string
    decimals: number
    address: Address.Address
    price?: number
  }>
> = {
  [odysseyTestnet.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: exp1Address,
      decimals: 18,
      logo: '/icons/exp.svg',
      name: 'Experiment',
      price: 1,
      symbol: 'EXP',
    },
    {
      address: exp2Address,
      decimals: 18,
      logo: '/icons/exp2.svg',
      name: 'Experiment 2',
      price: 100,
      symbol: 'EXP2',
    },
  ],
  [baseSepolia.id]: [
    {
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      logo: '/icons/weth.png',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    {
      address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      decimals: 8,
      logo: '/icons/cbbtc.png',
      name: 'Coinbase Wrapped BTC',
      symbol: 'CBBTC',
    },
  ],
  [base.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      logo: '/icons/weth.png',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    {
      address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      decimals: 8,
      logo: '/icons/cbbtc.png',
      name: 'Coinbase Wrapped BTC',
      symbol: 'CBBTC',
    },
  ],
}
