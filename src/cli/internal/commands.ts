import { setTimeout } from 'node:timers/promises'
import * as prompts from '@clack/prompts'
import * as WalletActions from '../../viem/WalletActions.js'
import * as Dialog from '../Dialog.js'
import * as Context from './context.js'

/** Creates a Porto account. */
export async function createAccount(_: unknown, args: createAccount.Arguments) {
  const client = await Context.getWalletClient(args)

  prompts.intro('Create a Porto Account')

  const s = prompts.spinner()

  // Create an account.
  s.start('Creating account (check browser window)...')
  const { accounts } = await WalletActions.connect(client, {
    createAccount: true,
  })
  s.stop('Account created.')

  // Onramp the account.
  s.start('Onramping (check browser window)...')
  await client.request({
    method: 'wallet_addFunds',
    params: [
      {
        address: accounts[0]!.address,
      },
    ],
  })
  s.stop('Onramped.')

  // Send success message to the dialog.
  Dialog.messenger.send('success', {
    content: 'You have successfully created an account.',
    title: 'Account created',
  })

  const env = args.dialog?.split(/\.|-/)[0]
  prompts.log.info('Address: ' + accounts[0]!.address)
  prompts.log.info(`Manage your account at: https://${env ?? ''}.id.porto.sh`)

  await setTimeout(1_000)
  process.exit(0)
}

export declare namespace createAccount {
  type Arguments = {
    /** Dialog hostname. */
    dialog?: string | undefined
  }
}
