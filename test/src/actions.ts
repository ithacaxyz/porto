import { type Address, Secp256k1 } from 'ox'
import { parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { setBalance as setBalance_viem, writeContract } from 'viem/actions'

import * as Account from '../../src/core/internal/account.js'
import type * as Key from '../../src/core/internal/key.js'
import type { Client } from '../../src/core/internal/porto.js'
import * as RelayAccount from '../../src/core/internal/relay/account.js'
import * as Anvil from './anvil.js'
import { ExperimentERC20 } from './contracts.js'

export async function createAccount(
  client: Client,
  parameters: {
    keys: readonly Key.Key[]
    setBalance?: false | bigint | undefined
  },
) {
  const { keys, setBalance: balance = parseEther('10000') } = parameters

  const account = await RelayAccount.create(client, { keys })

  if (balance)
    await setBalance(client, {
      address: account.address,
      value: balance,
    })

  return {
    account,
  }
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

export async function setBalance(
  client: Client,
  parameters: {
    address: Address.Address
    value: bigint
  },
) {
  const { address, value = parseEther('10000') } = parameters

  await setBalance_viem(client as any, {
    address,
    value,
  })
  await writeContract(client, {
    account: privateKeyToAccount(Anvil.accounts[0]!.privateKey),
    chain: null,
    address: ExperimentERC20.address[0],
    abi: ExperimentERC20.abi,
    functionName: 'mint',
    args: [address, value],
  })
}
