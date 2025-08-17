import { setTimeout } from 'node:timers/promises'
import { type Address, Secp256k1 } from 'ox'
import { parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  setBalance as setBalance_viem,
  waitForCallsStatus,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import * as Account from '../../src/viem/Account.js'
import type * as Key from '../../src/viem/Key.js'
import * as RelayActions from '../../src/viem/RelayActions.js'
import type { RelayClient } from '../../src/viem/RelayClient.js'
import * as Contracts from './_generated/contracts.js'
import * as Anvil from './anvil.js'

export async function createAccount(
  client: RelayClient,
  parameters: {
    deploy?: boolean | undefined
    keys: readonly Key.Key[]
    setBalance?: false | bigint | undefined
  },
) {
  const { deploy, keys, setBalance } = parameters

  const { account } = await getAccount(client, { keys, setBalance })

  await RelayActions.upgradeAccount(client, {
    account,
    authorizeKeys: keys,
  })

  if (deploy) {
    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [],
      feeToken: Contracts.exp1Address[client.chain.id as never],
    })
    await waitForCallsStatus(client, {
      id,
    })
  }

  return account
}

export async function getAccount(
  client: RelayClient,
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
  client: RelayClient,
  parameters: {
    address: Address.Address
    value?: bigint | undefined
  },
) {
  const { address, value = parseEther('10000') } = parameters

  if (Anvil.enabled) {
    await setBalance_viem(client as any, {
      address,
      value,
    })
    await writeContract(client, {
      abi: Contracts.exp1Abi,
      account: privateKeyToAccount(Anvil.accounts[0]!.privateKey),
      address: Contracts.exp1Address[client.chain.id as never],
      args: [address, value],
      chain: null,
      functionName: 'mint',
    })
  } else {
    const privateKey = process.env.VITE_FAUCET_PRIVATE_KEY as `0x${string}`
    const hash = await writeContract(client, {
      abi: Contracts.exp1Abi,
      account: privateKeyToAccount(privateKey),
      address: Contracts.exp1Address[client.chain.id as never],
      args: [address, value],
      functionName: 'mint',
    })
    await waitForTransactionReceipt(client, {
      hash,
    })
    await setTimeout(2_000)
  }
}
