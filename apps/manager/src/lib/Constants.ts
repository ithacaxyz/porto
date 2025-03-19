import { shuffleArray } from '~/utils'

export const CORS_DESTROYER_URL = 'https://cors.porto.workers.dev'

export function urlWithLocalCorsBypass(url: string) {
  return `${CORS_DESTROYER_URL}?url=${url}`
}

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
