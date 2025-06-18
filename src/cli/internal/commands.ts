import * as prompts from '@clack/prompts'
import * as WalletActions from '../../viem/WalletActions.js'
import * as Context from './context.js'

/** Creates a Porto account. */
export async function createAccount(_: unknown, args: createAccount.Arguments) {
  const client = await Context.getWalletClient(args)

  prompts.intro('Create a Porto Account')

  const s = prompts.spinner()
  s.start('Check browser window...')
  await WalletActions.connect(client, {
    createAccount: true,
  })

  const env = args.dialog?.split(/\.|-/)[0]
  s.stop(
    `Account created. Manage your account at: https://${env ?? ''}.id.porto.sh`,
  )
}

export declare namespace createAccount {
  type Arguments = {
    /** Dialog hostname. */
    dialog?: string | undefined
  }
}
