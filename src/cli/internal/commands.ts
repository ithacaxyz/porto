import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import * as prompts from '@clack/prompts'
import { numberToHex } from 'viem'
import * as Actions from 'viem/actions'
import * as Chains from '../../core/Chains.js'
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

  // persist admin key immediately to a secure temp file
  let tempKeyFile: string | undefined
  if (adminKey) {
    try {
      const tmpDir = path.join(os.tmpdir(), 'porto')
      fs.mkdirSync(tmpDir, { mode: 0o700, recursive: true })
      tempKeyFile = path.join(
        tmpDir,
        `admin-key-${Date.now()}-${Math.random().toString(36).slice(2)}.key`,
      )
      fs.writeFileSync(tempKeyFile, adminKey.privateKey!()!, { mode: 0o600 })
    } catch {}
  }

  let shouldPrintKeyOnExit = Boolean(adminKey)
  function cleanup(label?: string, err?: unknown) {
    if (!shouldPrintKeyOnExit) return process.exit(1)
    try {
      s.stop('Interrupted.')
    } catch {}
    if (err) {
      const message = err instanceof Error ? err.message : String(err)
      prompts.log.info(`${label ?? 'Error'}: ${message}`)
    }
    if (adminKey) {
      if (tempKeyFile) {
        prompts.log.info(
          `Admin key saved securely to temporary file: ${tempKeyFile}`,
        )
      } else {
        prompts.log.warn(
          'Admin key could not be saved to a temporary file. Please rerun to generate a new key.',
        )
      }
    }
    shouldPrintKeyOnExit = false
    process.exit(1)
  }

  const onSigint = () => cleanup('SIGINT')
  const onSigterm = () => cleanup('SIGTERM')
  const onUncaught = (error: unknown) => cleanup('uncaughtException', error)
  const onUnhandled = (reason: unknown) => cleanup('unhandledRejection', reason)
  const onExit = () => {
    if (!shouldPrintKeyOnExit) return
    if (adminKey) {
      if (tempKeyFile) {
        prompts.log.info(
          `Admin key saved securely to temporary file:\n${tempKeyFile}`,
        )
      } else {
        prompts.log.warn(
          'Admin key could not be saved to a temporary file. Please rerun to generate a new key.',
        )
      }
    }
    shouldPrintKeyOnExit = false
  }

  if (adminKey) {
    process.on('SIGINT', onSigint)
    process.on('SIGTERM', onSigterm)
    process.on('uncaughtException', onUncaught)
    process.on('unhandledRejection', onUnhandled as never)
    process.on('exit', onExit)
  }

  // Register public key for verification.
  if (adminKey) Dialog.messenger.registerPublicKey(adminKey.publicKey)

  const chainId = args.testnet ? Chains.baseSepolia.id : Chains.base.id

  // Create an account.
  s.start('Creating account...')
  const { accounts } = await WalletActions.connect(client, {
    chainIds: [chainId],
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

  // Onramp the account (needed for delegation on next step).
  s.start('Onramping...')
  await client.request({
    method: 'wallet_addFunds',
    params: [
      {
        address: accounts[0]!.address,
        token: args.testnet
          ? undefined
          : '0x0000000000000000000000000000000000000000',
      },
    ],
  })
  s.stop('Onramped.')

  // Send success message to the dialog.
  Dialog.messenger.send('success', {
    content: 'You have successfully created an account.',
    title: 'Account created',
  })

  // Execute a noop call to deploy the account.
  if (adminKey) {
    const { digest, ...request } = await client.request({
      method: 'wallet_prepareCalls',
      params: [
        {
          calls: [],
          chainId: numberToHex(chainId),
          key: adminKey,
        },
      ],
    })

    const signature = await Key.sign(adminKey, {
      address: null,
      payload: digest,
      wrap: false,
    })

    const result = await client.request({
      method: 'wallet_sendPreparedCalls',
      params: [
        {
          ...request,
          signature,
        },
      ],
    })

    s.start('Initializing account...')
    await Actions.waitForCallsStatus(client, {
      id: result[0]!.id,
      throwOnFailure: true,
    })
    s.stop('Account initialized.')
  }

  if (adminKey) {
    const reveal = await prompts.confirm({
      initialValue: false,
      message: 'Reveal private key? (This will be visible in terminal)',
    })

    prompts.log.info('Address: ' + accounts[0]!.address)
    if (reveal) prompts.log.info('Private key: ' + adminKey?.privateKey!()!)
    else {
      const keyFile = path.join(
        import.meta.dirname,
        `${accounts[0]!.address}.key`,
      )
      fs.writeFileSync(keyFile, adminKey?.privateKey!()!, { mode: 0o600 })
      fs.chmodSync(keyFile, 0o600)
      prompts.log.info(`Private key saved securely to: ${keyFile}`)
    }
    if (tempKeyFile)
      try {
        fs.rmSync(tempKeyFile)
      } catch {}
  }
  prompts.log.info('Manage your account at: https://id.porto.sh')

  shouldPrintKeyOnExit = false
  if (adminKey) {
    process.off('SIGINT', onSigint)
    process.off('SIGTERM', onSigterm)
    process.off('uncaughtException', onUncaught)
    process.off('unhandledRejection', onUnhandled as never)
    process.off('exit', onExit)
  }

  await setTimeout(1_000)
  process.exit(0)
}

export declare namespace createAccount {
  type Arguments = {
    /** Create a server key with admin privileges. */
    adminKey?: boolean | undefined
    /** Dialog hostname. */
    dialog?: string | undefined
    /** Whether to onboard via testnet. */
    testnet?: boolean | undefined
  }
}
