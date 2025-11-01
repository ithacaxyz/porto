import { Mode, Porto } from 'porto'
import { createClient, createPublicClient, custom, http } from 'viem'
import { base, baseSepolia, mainnet } from 'viem/chains'

export const chain =
  (import.meta.env.VITE_CHAIN || 'base-sepolia') === 'base' ? base : baseSepolia

export const porto = Porto.create({
  chains: [chain],
  mode: Mode.dialog(),
})

export const client = createClient({
  chain,
  transport: custom(porto.provider),
})

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const usdcAddress = {
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
} as const
