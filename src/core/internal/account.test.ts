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
  test('default', async () => {
    const { account } = await getAccount(client, {
      delegation,
    })

    await Delegation.execute(client, {
      account,
      calls: [],
      initialize: true,
    })

    const payload = Hex.random(32)
    const [signature] = await Account.sign(account, {
      payloads: [payload],
    })

    const valid = await verifyHash(client, {
      address: account.address,
      hash: payload,
      signature,
    })

    expect(valid).toBe(true)
  })

  test('args: key', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      delegation,
      keys: [key],
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      initialize: true,
    })

    const payload = Hex.random(32)

    {
      const [signature] = await Account.sign(account, {
        key,
        payloads: [payload],
      })

      const valid = await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      })

      expect(valid).toBe(true)
    }

    {
      const [signature] = await Account.sign(account, {
        key: 1,
        payloads: [payload],
      })

      const valid = await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      })

      expect(valid).toBe(true)
    }
  })

  test('behavior: with authorization payload', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      delegation,
      keys: [key],
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      initialize: true,
    })

    const payloads = [Hex.random(32), Hex.random(32)] as const

    {
      const signatures = await Account.sign(account, {
        payloads,
      })

      expect(signatures.length).toBe(2)
      expect(
        await verifyHash(client, {
          address: account.address,
          hash: payloads[0],
          signature: signatures[0],
        }),
      ).toBe(true)
      expect(
        await verifyHash(client, {
          address: account.address,
          hash: payloads[1],
          signature: signatures[1]!,
        }),
      ).toBe(true)
    }

    {
      const signatures = await Account.sign(account, {
        key: account.keys[0],
        payloads,
      })

      expect(signatures.length).toBe(2)
      expect(
        await verifyHash(client, {
          address: account.address,
          hash: payloads[0],
          signature: signatures[0],
        }),
      ).toBe(true)
      expect(
        await verifyHash(client, {
          address: account.address,
          hash: payloads[1],
          signature: signatures[1]!,
        }),
      ).toBe(true)
    }

    {
      const signatures = await Account.sign(account, {
        key: 0,
        payloads,
      })

      expect(signatures.length).toBe(2)
      expect(
        await verifyHash(client, {
          address: account.address,
          hash: payloads[0],
          signature: signatures[0],
        }),
      ).toBe(true)
      expect(
        await verifyHash(client, {
          address: account.address,
          hash: payloads[1],
          signature: signatures[1]!,
        }),
      ).toBe(true)
    }
  })

  test('behavior: with authorization payload, no owner', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      delegation,
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      initialize: true,
    })

    const nextAccount = Account.from({
      ...account,
      keys: [key],
    })

    const payloads = [Hex.random(32), Hex.random(32)] as const

    await expect(
      Account.sign(nextAccount, {
        payloads,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: account does not have key of role "owner".]`,
    )
  })

  test('behavior: no keys', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      delegation,
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      initialize: true,
    })

    const nextAccount = Account.from({
      ...account,
      keys: undefined,
    })

    const payloads = [Hex.random(32)] as const

    await expect(
      Account.sign(nextAccount, {
        payloads,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: cannot find key to sign with.]',
    )
  })
})
