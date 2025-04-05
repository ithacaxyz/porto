import { type Address, Secp256k1 } from 'ox'
import { parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  setBalance as setBalance_viem,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'

import * as Account from '../../src/core/internal/account.js'
import * as Key from '../../src/core/internal/key.js'
import type { Client } from '../../src/core/internal/porto.js'
import * as Relay from '../../src/core/internal/relay.js'
import { exp1Abi, exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'

export async function createAccount(
  client: Client,
  parameters: {
    deploy?: boolean | undefined
    keys: NonNullable<Relay.createAccount.Parameters['keys']>
    setBalance?: false | bigint | undefined
  },
) {
  const { deploy, keys, setBalance: balance = parseEther('10000') } = parameters

  const account = await Relay.createAccount(client, { keys })

  if (balance)
    await setBalance(client, {
      address: account.address,
      value: balance,
    })

  if (deploy) {
    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [],
      feeToken: exp1Address,
    })
    await waitForTransactionReceipt(client, {
      hash: id as `0x${string}`,
    })
  }

  return account
}

export async function getAccount(
  client: Client,
  parameters: {
    keys?: readonly Key.Key[] | undefined
    setBalance?: false | bigint | undefined
  } = {},
) {
  const { keys, setBalance: balance = parseEther('10000') } = parameters

  const privateKey = Secp256k1.randomPrivateKey()
  const account = Account.fromPrivateKey(privateKey, { keys })

  if (balance)
    await setBalance(client, {
      address: account.address,
      value: balance,
    })

  return {
    account,
    privateKey,
  }
}

export async function getUpgradedAccount(
  client: Client,
  parameters: {
    keys: readonly Key.Key[]
    setBalance?: false | bigint | undefined
  },
) {
  const { keys, setBalance } = parameters

  const { account } = await getAccount(client, { keys, setBalance })

  const request = await Relay.prepareUpgradeAccount(client, {
    address: account.address,
    feeToken: exp1Address,
    keys,
  })

  const signatures = await Promise.all(
    request.digests.map((payload) => account.sign({ payload })),
  )

  const { bundles } = await Relay.upgradeAccount(client, {
    ...request,
    signatures,
  })

  await waitForTransactionReceipt(client, {
    hash: bundles[0]!.id,
  })

  return account
}

export async function setBalance(
  client: Client,
  parameters: {
    address: Address.Address
    value: bigint
  },
) {
  const { address, value = parseEther('10000') } = parameters

  if (Anvil.enabled) {
    await setBalance_viem(client as any, {
      address,
      value,
    })
    await writeContract(client, {
      abi: exp1Abi,
      account: privateKeyToAccount(Anvil.accounts[0]!.privateKey),
      address: exp1Address,
      args: [address, value],
      chain: null,
      functionName: 'mint',
    })
  } else {
    const key = Key.fromHeadlessWebAuthnP256({
      privateKey: process.env.VITE_ADMIN_PRIVATE_KEY! as `0x${string}`,
    })
    const account = Account.from({
      address: process.env.VITE_ADMIN_ADDRESS! as `0x${string}`,
      keys: [key],
    })
    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          abi: exp1Abi,
          args: [address, value],
          functionName: 'mint',
          to: exp1Address,
        },
      ],
      feeToken: exp1Address,
    })
    await waitForTransactionReceipt(client, {
      hash: id as `0x${string}`,
    })
  }
}
