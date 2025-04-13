import { Chains } from 'porto'
import { Key, Relay } from 'porto/internal'
import { createClient, http } from 'viem'

async function main() {
  const client = createClient({
    chain: Chains.odysseyDevnet,
    transport: http('https://relay-staging.ithaca.xyz'),
  })

  const key = Key.createHeadlessWebAuthnP256({
    role: 'admin',
  })

  console.log(`DRIP_PRIVATE_KEY=${key.privateKey?.privateKey?.()}`)

  const account = await Relay.createAccount(client, { keys: [key] })

  console.log(`DRIP_ADDRESS=${account.address}`)

  console.warn(
    '\nReplace the variables on the deployed worker and in .dev.vars for local development',
  )
  console.warn('Make sure to fund the account with EXP as the next step')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
