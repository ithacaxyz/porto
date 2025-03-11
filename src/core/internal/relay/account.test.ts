import { Value } from 'ox'
import { describe, expect, test } from 'vitest'

import { generatePrivateKey } from 'viem/accounts'
import { privateKeyToAccount } from 'viem/accounts'
import * as TestActions from '../../../../test/src/actions.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Key from '../key.js'
import * as Account from './account.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

describe('create', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const account = await Account.create(client, {
      keys: [key],
    })

    expect(account.address).toBeDefined()
    expect(account.keys).toContain(key)
  })

  test('behavior: multiple keys', async () => {
    const key1 = Key.createP256({
      role: 'admin',
    })

    const key2 = await Key.createWebCryptoP256({
      role: 'admin',
    })

    const account = await Account.create(client, {
      keys: [key1, key2],
    })

    expect(account.address).toBeDefined()
    expect(account.keys).toContain(key1)
    expect(account.keys).toContain(key2)
  })

  test('behavior: permissions', async () => {
    const key = Key.createP256({
      role: 'admin',
      permissions: {
        calls: [
          {
            signature: 'mint()',
          },
        ],
        spend: [
          {
            limit: 100n,
            period: 'minute',
          },
        ],
      },
    })

    const account = await Account.create(client, {
      keys: [key],
    })

    expect(account.address).toBeDefined()
    expect(account.keys).toContain(key)
    expect(account.keys[0]?.permissions).toMatchInlineSnapshot(`
      {
        "calls": [
          {
            "signature": "mint()",
          },
        ],
        "spend": [
          {
            "limit": 100n,
            "period": "minute",
          },
        ],
      }
    `)
  })
})

describe('prepareUpgrade + upgrade', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const eoa = privateKeyToAccount(generatePrivateKey())

    await TestActions.setBalance(client, {
      address: eoa.address,
      value: Value.fromEther('10'),
    })

    const request = await Account.prepareUpgrade(client, {
      address: eoa.address,
      keys: [key],
      feeToken: ExperimentERC20.address[0],
    })

    const signatures = await Promise.all(
      request.digests.map((hash) => eoa.sign({ hash })),
    )

    const result = await Account.upgrade(client, {
      ...request,
      signatures,
    })

    expect(result.account.keys).toContain(key)
  })
})
