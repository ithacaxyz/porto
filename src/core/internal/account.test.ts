import { Hex } from 'ox'
import { verifyHash } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../test/src/account.js'
import { client, delegation } from '../../../test/src/porto.js'
import * as Account from './account.js'
import * as Call from './call.js'
import * as Delegation from './delegation.js'
import * as Key from './key.js'

describe('from', () => {
  test('default', () => {
    const account = Account.from({
      address: '0x0000000000000000000000000000000000000001',
      delegation: '0x0000000000000000000000000000000000000002',
      keys: [
        Key.fromP256({
          expiry: 42069,
          privateKey:
            '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
          role: 'admin',
        }),
      ],
      label: 'test',
    })

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000001",
        "delegation": "0x0000000000000000000000000000000000000002",
        "keys": [
          {
            "expiry": 42069,
            "publicKey": {
              "prefix": 4,
              "x": 106772332543853129808885768556237579026047721040871197501406793325324706664735n,
              "y": 110339676533900797749866890631856969312064778492080444630962038345769628880904n,
            },
            "role": "admin",
            "sign": [Function],
            "type": "p256",
          },
        ],
        "label": "test",
        "type": "delegated",
      }
    `)
  })
})

describe('sign', () => {
  test('key: owner', async () => {
    const { account } = await getAccount(client, {
      delegation,
    })

    // delegate
    await Delegation.execute(client, {
      account,
      calls: [],
      delegate: true,
    })

    // sign
    const payload = Hex.random(32)
    const [signature] = await Account.sign(account, {
      payloads: [payload],
    })

    // verify
    const valid = await verifyHash(client, {
      address: account.address,
      hash: payload,
      signature,
    })

    expect(valid).toBe(true)
  })

  test('key: P256 (admin)', async () => {
    const key = Key.fromP256({
      privateKey:
        '0x0c57184baffb76254bcb3e225bb789082b9cc25f37d9805e2fbfcd5c681e72ee',
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      delegation,
      keys: [key],
    })

    // delegate
    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
          to: account.address,
        }),
      ],
      delegate: true,
    })

    const payload = Hex.random(32)

    {
      // sign
      const [signature] = await Account.sign(account, {
        key,
        payloads: [payload],
      })

      // verify
      const valid = await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      })

      expect(valid).toBe(true)
    }

    {
      // sign
      const [signature] = await Account.sign(account, {
        key: 1,
        payloads: [payload],
      })

      // verify
      const valid = await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      })

      expect(valid).toBe(true)
    }
  })
})
