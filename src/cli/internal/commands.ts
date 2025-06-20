import * as fs from 'node:fs'
import * as path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import * as prompts from '@clack/prompts'
import * as Key from '../../viem/Key.js'
import * as WalletActions from '../../viem/WalletActions.js'
import * as Dialog from '../Dialog.js'
import * as Context from './context.js'

/** Creates a Porto account. */
export async function createAccount(_: unknown, args: createAccount.Arguments) {
  const client = await Context.getWalletClient(args)

  prompts.intro('Create a Porto Account')

  const s = prompts.spinner()

  const adminKey = args.adminKey ? Key.createSecp256k1() : undefined

  // Register public key for verification.
  if (adminKey) Dialog.messenger.registerPublicKey(adminKey.publicKey)

  // Create an account.
  s.start('Creating account (check browser window)...')
  const { accounts } = await WalletActions.connect(client, {
    createAccount: true,
    grantAdmins: adminKey
      ? [
          {
            publicKey: adminKey.publicKey,
            type: adminKey.type,
          },
        ]
      : undefined,
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

  if (adminKey) {
    const reveal = await prompts.confirm({
      initialValue: false,
      message: 'Reveal admin private key? (This will be visible in terminal)',
    })

    if (reveal)
      prompts.log.info('Admin private key: ' + adminKey?.privateKey!()!)
    else {
      const keyFile = path.join(
        import.meta.dirname,
        `${accounts[0]!.address}.key`,
      )
      fs.writeFileSync(keyFile, adminKey?.privateKey!()!, { mode: 0o600 })
      fs.chmodSync(keyFile, 0o600)
      prompts.log.info(`Admin key saved securely to: ${keyFile}`)
    }
  }

  prompts.log.info('Address: ' + accounts[0]!.address)
  prompts.log.info('Manage your account at: https://id.porto.sh')

  await setTimeout(1_000)
  process.exit(0)
}

export declare namespace createAccount {
  type Arguments = {
    /** Create a server key with admin privileges. */
    adminKey?: boolean | undefined
    /** Dialog hostname. */
    dialog?: string | undefined
  }
}
