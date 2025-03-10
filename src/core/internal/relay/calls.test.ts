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
describe('prepare + sendPrepared', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const { account } = await TestActions.createRelayAccount(client, {
      keys: [key],
    })

    const request = await Calls.prepare(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[0],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      key,
      nonce: 0n,
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
    })

    const result = await Calls.sendPrepared(client, {
      ...request,
      signature,
    })

    expect(result.id).toBeDefined()
  })
})
