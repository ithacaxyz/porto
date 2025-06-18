import * as fs from 'node:fs'
import * as path from 'node:path'
import * as prompts from '@clack/prompts'
import open from 'open'
import { RpcRequest } from 'ox'
import type * as RpcSchema from '../../core/RpcSchema.js'
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

  const openDialog = args.fund
    ? true
    : await prompts.confirm({
        initialValue: true,
        message: 'Open Porto dialog to fund your account?',
      })

  if (openDialog) {
    const store = RpcRequest.createStore<RpcSchema.Schema>()
    const request = store.prepare({
      method: 'wallet_addFunds',
      params: [
        {
          address: account.address,
        },
      ],
    })

    const search = new URLSearchParams([
      ['id', request.id.toString()],
      ['method', request.method],
      ['params', JSON.stringify(request.params)],
      [
        'referrer',
        JSON.stringify({
          title: 'Porto CLI',
          url: 'cli://porto',
        }),
      ],
    ])

    const dialogUrl = new URL(
      `https://${args.dialog}/dialog/${request.method}?${search.toString()}`,
    )
    prompts.log.info(`Opening ${dialogUrl.hostname}`)
    try {
      await open(dialogUrl.toString())
      prompts.log.success('Browser window opened successfully')
    } catch (error) {
      prompts.log.error(
        `Failed to open browser: ${error instanceof Error ? error.message : String(error)}`,
      )
      prompts.log.info(`Manually open: ${dialogUrl}`)
    }
  }

  const reveal = await prompts.confirm({
    initialValue: false,
    message: 'Reveal private key? (This will be visible in terminal history)',
  })

  prompts.log.info('Address: ' + account.address)
  if (reveal) prompts.log.info('Private key: ' + key.privateKey!()!)
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
    /** Dialog hostname. */
    dialog?: string | undefined
    /** Open dialog to fund account. */
    fund?: boolean | undefined
    /** RPC Server URL. */
    rpc?: string | undefined
  }
}
