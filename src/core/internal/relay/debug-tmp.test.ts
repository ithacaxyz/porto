import { Chains, Delegation } from 'porto'
import { http } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { expect, test } from 'vitest'

import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as Action from './action.js'

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

test('debug', async () => {
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
