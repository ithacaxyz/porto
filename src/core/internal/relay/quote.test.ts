import { Chains, Implementation, Porto, Storage } from 'porto'
import { http } from 'viem'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../../test/src/account.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { delegation } from '../../../../test/src/porto.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as ActionRequest from './actionRequest.js'
import * as Quote from './quote.js'

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
    expect(result.nativeFeeEstimate).toMatchInlineSnapshot(`
      {
        "maxFeePerGas": 505n,
        "maxPriorityFeePerGas": 1n,
      }
    `)
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
    expect(result.nativeFeeEstimate).toMatchInlineSnapshot(`
      {
        "maxFeePerGas": 505n,
        "maxPriorityFeePerGas": 1n,
      }
    `)
    expect(result.token).toBeDefined()
    expect(result.ttl).toBeGreaterThan(0)
  })
})
