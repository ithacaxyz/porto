import { Porto } from 'porto'
import { createClient, custom } from 'viem'

export const porto = Porto.create()

export const client = createClient({
  transport: custom(porto.provider),
})
