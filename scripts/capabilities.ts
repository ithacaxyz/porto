import { createClient, http } from 'viem'
import { getCapabilities } from 'viem/actions'

const client = createClient({
  transport: http('https://rpc.ithaca.xyz'),
})

export default await getCapabilities(client)
