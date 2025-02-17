import { Hex, Value } from 'ox'
import { Chains, Delegation, Implementation, Porto, Storage } from 'porto'
import { http } from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { getTestnetAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { delegation } from '../../../../test/src/porto.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as Action from './action.js'

// TODO: move to test/src/porto.ts
const porto = Porto.create({
  implementation: Implementation.local(),
  storage: Storage.memory(),
  transports: {
    [Chains.odysseyTestnet.id]: {
      default: http(),
      relay: http('https://relay-staging.ithaca.xyz'),
    },
  },
})
const client = Porto.getClient(porto)

describe('send', () => {
  test('default', async () => {
    const { account } = await getTestnetAccount(client)

    // delegate
    {
      const hash = await Action.send(client, {
        account,
        delegation,
        calls: [],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('0.0001')

    const hash = await Action.send(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[0],
          abi: ExperimentERC20.abi,
          functionName: 'transfer',
          args: [alice, value],
        },
      ],
      gasToken: ExperimentERC20.address[0],
    })

    await waitForTransactionReceipt(client, { hash })

    expect(
      await readContract(client, {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0],
        functionName: 'balanceOf',
        args: [alice],
      }),
    ).toBe(value)
  })

  test('behavior: delegation', async () => {
    const { account } = await getTestnetAccount(client)

    const key = Key.createP256({
      role: 'admin',
    })

    const hash = await Action.send(client, {
      account,
      delegation,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      gasToken: ExperimentERC20.address[0],
    })

    await waitForTransactionReceipt(client, { hash })

    const { publicKey } = await Delegation.keyAt(client, {
      account: account.address,
      index: 0,
    })

    expect(publicKey).toEqual(key.publicKey)
  })
})

describe('prepare, sendPrepared', () => {
  test('default', async () => {
    const { account } = await getTestnetAccount(client)

    // delegate
    {
      const hash = await Action.send(client, {
        account,
        delegation,
        calls: [],
        gasToken: ExperimentERC20.address[0],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    const alice = Hex.random(20)
    const value = Value.fromEther('0.0001')

    const { context, signPayloads } = await Action.prepare(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[0],
          abi: ExperimentERC20.abi,
          functionName: 'transfer',
          args: [alice, value],
        },
      ],
      gasToken: ExperimentERC20.address[0],
    })

    const signatures = await Account.sign(account, {
      payloads: signPayloads,
    })

    const hash = await Action.sendPrepared(client, {
      ...context,
      signatures,
    })

    await waitForTransactionReceipt(client, { hash })

    expect(
      await readContract(client, {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0],
        functionName: 'balanceOf',
        args: [alice],
      }),
    ).toBe(value)
  })
})
