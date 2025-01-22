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
      keys: [
        Key.fromP256({
          expiry: 42069,
          privateKey:
            '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
          role: 'admin',
        }),
      ],
    })

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000001",
        "keys": [
          {
            "canSign": true,
            "expiry": 42069,
            "permissions": undefined,
            "privateKey": [Function],
            "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
            "role": "admin",
            "type": "p256",
          },
        ],
        "type": "delegated",
      }
    `)
  })

  test('args: address', () => {
    const account = Account.from('0x0000000000000000000000000000000000000000')

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "type": "delegated",
      }
    `)
  })
})

describe('fromPrivateKey', () => {
  test('default', () => {
    const account = Account.fromPrivateKey(
      '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
    )

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x673ee8aabd3a62434cb9e3d7c6f9492e286bcb08",
        "keys": undefined,
        "sign": [Function],
        "type": "delegated",
      }
    `)
  })
})

describe('sign', () => {
  test('default', async () => {
    const { account } = await getAccount(client)

    await Delegation.execute(client, {
      account,
      calls: [],
      delegation,
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
      keys: [key],
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      delegation,
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
        key: 0,
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

  test('behavior: with key', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      keys: [key],
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      delegation,
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

  test('behavior: with authorization payload', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client, {
      keys: [key],
    })

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      delegation,
    })

    const payloads = [Hex.random(32), Hex.random(32)] as const

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
  })

  test('behavior: with authorization payload, no root signing key', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client)

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      delegation,
    })

    const nextAccount = Account.from({
      ...account,
      sign: undefined,
      keys: [key],
    })

    const payloads = [Hex.random(32), Hex.random(32)] as const

    await expect(
      Account.sign(nextAccount, {
        // @ts-expect-error: test
        payloads,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: cannot find root signing key to sign authorization.]',
    )
  })

  test('behavior: no keys', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { account } = await getAccount(client)

    await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      delegation,
    })

    const nextAccount = Account.from({
      ...account,
      keys: undefined,
      sign: undefined,
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
