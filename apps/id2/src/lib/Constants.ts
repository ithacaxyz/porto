import type { PortoConfig } from '@porto/apps'
import { exp1Address, exp2Address } from '@porto/apps/contracts'
import type { Address } from 'ox'
import { Chains } from 'porto'

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

export type ChainId = PortoConfig.ChainId

// TODO: extract from `wallet_getCapabilities` instead of hardcoding.
export const defaultAssets: Record<
  PortoConfig.ChainId,
  ReadonlyArray<{
    name: string
    logo: string
    symbol: string
    decimals: number
    address: Address.Address
    price?: number
    coingeckoId?: string
  }>
> = {
  [Chains.anvil.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: exp1Address[Chains.anvil.id],
      decimals: 18,
      logo: '/icons/exp.svg',
      name: 'Experiment',
      price: 1,
      symbol: 'EXP',
    },
    {
      address: exp2Address[Chains.anvil.id],
      decimals: 18,
      logo: '/icons/exp2.svg',
      name: 'Experiment 2',
      price: 100,
      symbol: 'EXP2',
    },
  ],
  [Chains.anvil2.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: exp1Address[Chains.anvil2.id],
      decimals: 18,
      logo: '/icons/exp.svg',
      name: 'Experiment',
      price: 1,
      symbol: 'EXP',
    },
    {
      address: exp2Address[Chains.anvil2.id],
      decimals: 18,
      logo: '/icons/exp2.svg',
      name: 'Experiment 2',
      price: 100,
      symbol: 'EXP2',
    },
  ],
  [Chains.anvil3.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: exp1Address[Chains.anvil3.id],
      decimals: 18,
      logo: '/icons/exp.svg',
      name: 'Experiment',
      price: 1,
      symbol: 'EXP',
    },
    {
      address: exp2Address[Chains.anvil3.id],
      decimals: 18,
      logo: '/icons/exp2.svg',
      name: 'Experiment 2',
      price: 100,
      symbol: 'EXP2',
    },
  ],
  [Chains.arbitrum.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
  ],
  [Chains.arbitrumSepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
  ],
  [Chains.bsc.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'BNB',
      symbol: 'BNB',
    },
  ],
  [Chains.baseSepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      coingeckoId: 'ethereum',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: exp1Address[Chains.baseSepolia.id],
      decimals: 18,
      logo: '/icons/exp.svg',
      name: 'Experiment',
      price: 1,
      symbol: 'EXP',
    },
    {
      address: exp2Address[Chains.baseSepolia.id],
      decimals: 18,
      logo: '/icons/exp2.svg',
      name: 'Experiment 2',
      price: 100,
      symbol: 'EXP2',
    },
    {
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      coingeckoId: 'usd-coin',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    {
      address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      coingeckoId: 'coinbase-wrapped-btc',
      decimals: 8,
      logo: '/icons/cbbtc.png',
      name: 'Coinbase Wrapped BTC',
      symbol: 'CBBTC',
    },
  ],
  [Chains.base.id]: [
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
  [Chains.celo.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: '0xceba9300f2b948710d2653dd7b07f33a8b32118c',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
  ],
  [Chains.mainnet.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
  ],
  [Chains.optimism.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
  ],
  [Chains.optimismSepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      coingeckoId: 'ethereum',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
    {
      address: exp1Address[Chains.optimismSepolia.id],
      decimals: 18,
      logo: '/icons/exp.svg',
      name: 'Experiment',
      price: 1,
      symbol: 'EXP',
    },
    {
      address: exp2Address[Chains.optimismSepolia.id],
      decimals: 18,
      logo: '/icons/exp2.svg',
      name: 'Experiment 2',
      price: 100,
      symbol: 'EXP2',
    },
    {
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      coingeckoId: 'usd-coin',
      decimals: 6,
      logo: '/icons/usdc.svg',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    {
      address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      coingeckoId: 'coinbase-wrapped-btc',
      decimals: 8,
      logo: '/icons/cbbtc.png',
      name: 'Coinbase Wrapped BTC',
      symbol: 'CBBTC',
    },
  ],
  [Chains.polygon.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Polygon',
      symbol: 'POL',
    },
  ],
  [Chains.sepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logo: '/icons/eth.svg',
      name: 'Ethereum',
      symbol: 'ETH',
    },
  ],
}
