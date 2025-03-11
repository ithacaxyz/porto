import * as Hex from 'ox/Hex'
import { readContract } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import * as TestActions from '../../../../test/src/actions.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Key from '../key.js'
import * as Calls from './calls.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

describe('send', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await Calls.send(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      nonce: randomNonce(),
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        address: ExperimentERC20.address[1],
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })
})

describe('prepare + sendPrepared', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await Calls.prepare(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      key,
      nonce: randomNonce(),
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
    })

    const { id } = await Calls.sendPrepared(client, {
      ...request,
      signature,
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        address: ExperimentERC20.address[1],
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })
})

function randomNonce() {
  return Hex.toBigInt(
    Hex.concat(
      // multichain flag (0 = single chain, 0xc1d0 = multi-chain)
      Hex.fromNumber(0, { size: 2 }),
      // sequence key
      Hex.random(22),
      // sequential nonce
      Hex.fromNumber(0, { size: 8 }),
    ),
  )
}
