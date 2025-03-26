export const CORS_DESTROYER_URL = 'https://cors.porto.workers.dev'

export function urlWithCorsBypass(url: string) {
  return `${CORS_DESTROYER_URL}?url=${url}`
}

export const swapAssets = [
  {
    logo: '/icons/eth.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    logo: '/icons/exp.svg',
    symbol: 'EXP',
    name: 'Experiment',
    address: '0x706Aa5C8e5cC2c67Da21ee220718f6f6B154E75c',
  },
  {
    logo: '/icons/exp2.svg',
    symbol: 'EXP2',
    name: 'Experiment 2',
    address: '0x390dD40042a844F92b499069CFe983236d9fe204',
  },
  {
    logo: '/icons/cbbtc.png',
    symbol: 'CBBTC',
    name: 'Coinbase Wrapped BTC',
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  },
  {
    logo: '/icons/usdc.svg',
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
]
