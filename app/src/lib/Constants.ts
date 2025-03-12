import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
import { shuffleArray } from '~/utils'

const CORS_DESTROYER_URL = 'https://cors.evm.workers.dev'

export const emojisArray = shuffleArray([
  '🍕',
  '🧁',
  '🦋',
  '❤️',
  '😈',
  '🌟',
  '🌀',
  '🌸',
  '🌈',
  '🚀',
  '🌊',
  '⚡',
  '🐰',
  '🐶',
  '🐱',
  '🐵',
  '🐸',
  '🐮',
  '🐔',
])

export function urlWithLocalCorsBypass(url: string) {
  if (!import.meta.env.DEV) return url

  return `${CORS_DESTROYER_URL}?url=${url}`
}

export function addressApiEndpoint(chainId: number): string {
  if (chainId === baseSepolia.id) {
    return 'https://base.blockscout.com/api/v2'
  }
  if (chainId === odysseyTestnet.id) {
    return 'https://explorer.ithaca.xyz/api/v2'
  }
  if (chainId === optimismSepolia.id) {
    return 'https://optimism-sepolia.blockscout.com/api/v2'
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}
