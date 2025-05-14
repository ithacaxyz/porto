import { type Address, Secp256k1 } from 'ox'
import { parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  setBalance as setBalance_viem,
  waitForCallsStatus,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'

import * as Account from '../../src/core/Account.js'
import type { Client } from '../../src/core/internal/porto.js'
import * as Key from '../../src/core/Key.js'
import * as RpcServer from '../../src/core/RpcServer.js'
import * as Anvil from './anvil.js'
import { exp1Abi, exp1Address } from './porto.js'

export async function createAccount(
  client: Client,
  parameters: {
    deploy?: boolean | undefined
    keys: NonNullable<RpcServer.createAccount.Parameters['keys']>
    setBalance?: false | bigint | undefined
  },
) {
  const { deploy, keys, setBalance: balance = parseEther('10000') } = parameters

  const account = await RpcServer.createAccount(client, { keys })

  if (balance)
    await setBalance(client, {
      address: account.address,
      value: balance,
    })

  if (deploy) {
    const { id } = await RpcServer.sendCalls(client, {
      account,
      calls: [],
      feeToken: exp1Address,
    })
    await waitForCallsStatus(client, {
      id,
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

  const request = await RpcServer.prepareUpgradeAccount(client, {
    address: account.address,
    feeToken: exp1Address,
    keys,
  })

  const signatures = await Promise.all(
    request.digests.map((payload) => account.sign({ payload })),
  )

  const { bundles } = await RpcServer.upgradeAccount(client, {
    ...request,
    signatures,
  })

  await waitForCallsStatus(client, {
    id: bundles[0]!.id,
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
    const hash = await writeContract(client, {
      abi: exp1Abi,
      account: privateKeyToAccount(
        process.env.VITE_FAUCET_PRIVATE_KEY as `0x${string}`,
      ),
      address: exp1Address,
      args: [address, value],
      functionName: 'mint',
    })
    await waitForTransactionReceipt(client, {
      hash,
    })
  }
}
