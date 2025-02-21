import { Hex, Value } from 'ox'
import { Chains, Delegation } from 'porto'
import { readContract, waitForTransactionReceipt } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { http } from 'viem'
import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as Action from './action.js'

// const { client, delegation } = getPorto({
//   transports: {
//     relay: true
//   }
// })
const { client, delegation } = getPorto({
  chain: Chains.odysseyTestnet,
  transports: {
    default: http(),
    relay: http('https://relay-staging.ithaca.xyz', {
      async onFetchRequest(request) {
        // biome-ignore lint/suspicious/noConsoleLog:
        console.log('request:', JSON.stringify(await request.json()))
      },
      async onFetchResponse(response) {
        // biome-ignore lint/suspicious/noConsoleLog:
        console.log('response:', JSON.stringify(await response.clone().json()))
      },
    }),
  },
})

describe('send', () => {
  test('default', async () => {
    const { account } = await getAccount(client)

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
    const { account } = await getAccount(client)

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

  describe('behavior: authorize', () => {
    test('delegated: false, key: EOA, keyToAuthorize: P256', async () => {
      const { account } = await getAccount(client)

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

    test('delegated: true, key: EOA, keyToAuthorize: P256', async () => {
      const { account } = await getAccount(client)

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

      const key = Key.createP256({
        role: 'admin',
      })

      const hash = await Action.send(client, {
        account,
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

    test('key: P256, keyToAuthorize: P256', async () => {
      const { account } = await getAccount(client)

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

      const key = Key.createP256({
        role: 'admin',
      })

      // authorize P256 key
      {
        const hash = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key,
            }),
          ],
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      const anotherKey = Key.createP256({
        role: 'admin',
      })

      // authorize another P256 key with previously authorized key
      {
        const hash = await Action.send(client, {
          account,
          calls: [
            Call.authorize({
              key: anotherKey,
            }),
          ],
          key,
          gasToken: ExperimentERC20.address[0],
        })

        await waitForTransactionReceipt(client, { hash })
      }

      expect(
        (
          await Delegation.keyAt(client, {
            account: account.address,
            index: 1,
          })
        ).publicKey,
      ).toEqual(anotherKey.publicKey)
    })
  })
})

describe.skip('prepare, sendPrepared', () => {
  test('default', async () => {
    const { account } = await getAccount(client)

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
