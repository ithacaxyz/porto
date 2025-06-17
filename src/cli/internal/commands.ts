import * as fs from 'node:fs'
import * as path from 'node:path'
import * as prompts from '@clack/prompts'
import * as Key from '../../viem/Key.js'
import * as ServerActions from '../../viem/ServerActions.js'
import * as Context from './context.js'

/** Creates a Porto account. */
export async function createAccount(_: unknown, args: createAccount.Arguments) {
  const client = await Context.getClient(args)

  prompts.intro('Create Account')

  const key = Key.createSecp256k1()

  const s = prompts.spinner()
  s.start('Creating...')
  const account = await ServerActions.createAccount(client, {
    authorizeKeys: [key],
  }).catch((error) => {
    s.stop('Failed. ')
    throw error
  })
  s.stop('Created. ')

  prompts.log.info('Address: ' + account.address)

  const reveal = await prompts.confirm({
    initialValue: false,
    message: 'Reveal private key? (This will be visible in terminal history)',
  })

  if (reveal) prompts.log.warn('Private key: ' + key.privateKey!()!)
  else {
    // Write to secure file
    const keyFile = path.join(import.meta.dirname, `${account.address}.key`)
    fs.writeFileSync(keyFile, key.privateKey!()!, { mode: 0o600 })
    fs.chmodSync(keyFile, 0o600)
    prompts.log.info(`Private key saved securely to: ${keyFile}`)
  }
}

export declare namespace createAccount {
  type Arguments = {
    /** Chain name. */
    chain?: string | undefined
    /** RPC Server URL. */
    rpc?: string | undefined
  }
}
