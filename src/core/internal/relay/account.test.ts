import { describe, expect, test } from 'vitest'

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
