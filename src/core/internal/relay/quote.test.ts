import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as ActionRequest from './actionRequest.js'
import * as Quote from './quote.js'

const { client, delegation } = getPorto({
  transports: {
    relay: true,
  },
})

describe('estimateFee', () => {
  test('behavior: new account', async () => {
    const { account } = await getAccount(client, {
      setBalance: false,
    })

    const key = Key.createP256({
      role: 'admin',
    })

    const action = ActionRequest.prepare({
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      multichain: true,
    })

    const result = await Quote.estimateFee(client, {
      action,
      delegation,
      token: ExperimentERC20.address[0],
    })

    expect(result.amount).toBeGreaterThan(0n)
    expect(result.digest).toBeDefined()
    expect(result.gasEstimate).toBeGreaterThan(0)
    expect(result.nativeFeeEstimate.maxFeePerGas).toBeGreaterThan(0n)
    expect(result.nativeFeeEstimate.maxPriorityFeePerGas).toBeGreaterThan(0n)
    expect(result.token).toBeDefined()
    expect(result.ttl).toBeGreaterThan(0)
  })

  test('behavior: existing account', async () => {
    const account = Account.from('0x23ed230396be45ea109410276df89fe8d1ed95be')

    const action = ActionRequest.prepare({
      account,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000001',
        },
      ],
      multichain: true,
    })

    const result = await Quote.estimateFee(client, {
      action,
      token: ExperimentERC20.address[0],
    })

    expect(result.amount).toBeGreaterThan(0n)
    expect(result.digest).toBeDefined()
    expect(result.gasEstimate).toBeGreaterThan(0)
    expect(result.nativeFeeEstimate.maxFeePerGas).toBeGreaterThan(0n)
    expect(result.nativeFeeEstimate.maxPriorityFeePerGas).toBeGreaterThan(0n)
    expect(result.token).toBeDefined()
    expect(result.ttl).toBeGreaterThan(0)
  })
})
