import { createClient, http } from 'viem'

export const client = createClient({
  transport: http('https://rpc.porto.sh'),
})
