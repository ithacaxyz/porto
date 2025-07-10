import { Chains } from 'porto'
import { createClient, http } from 'viem'

// Instantiate a Viem Client with Porto-compatible Chain.
export const client = createClient({
  chain: Chains.baseSepolia,
  transport: http(),
})
