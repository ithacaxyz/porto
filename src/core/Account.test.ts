import { Hex } from 'ox'
import { verifyHash } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { createAccount } from '../../test/src/actions.js'
import { getPorto } from '../../test/src/porto.js'
import * as Account from './Account.js'
import * as Key from './Key.js'

const { client } = getPorto()

describe('from', () => {
  test('default', () => {
    const account = Account.from({
      address: '0x0000000000000000000000000000000000000001',
      keys: [
        Key.fromP256({
          expiry: 42069,
          privateKey:
            '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
        }),
      ],
    })

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000001",
        "keys": [
          {
            "expiry": 42069,
            "hash": "0xed7ac7c7b35b77e97be67b84f5889e0ab3ecc69ab65d57db191e11f8811e9965",
            "permissions": undefined,
            "privateKey": [Function],
            "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
            "role": "admin",
            "type": "p256",
          },
        ],
      }
    `)
  })

  test('args: address', () => {
    const account = Account.from('0x0000000000000000000000000000000000000000')

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
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
      }
    `)
  })
})

describe('sign', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const payload = Hex.random(32)
    const signature = await Account.sign(account, {
      payload,
    })

    const valid = await verifyHash(client, {
      address: account.address,
      hash: payload,
      signature,
    })

    expect(valid).toBe(true)
  })

  test('args: key', async () => {
    const key = Key.createHeadlessWebAuthnP256()

    const account = await createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const payload = Hex.random(32)

    {
      const signature = await Account.sign(account, {
        key,
        payload,
      })

      const valid = await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      })

      expect(valid).toBe(true)
    }

    {
      const signature = await Account.sign(account, {
        key: 0,
        payload,
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
    const key = Key.createHeadlessWebAuthnP256()
    const account = await createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const payload = Hex.random(32)

    const signature = await Account.sign(account, {
      payload,
    })

    const valid = await verifyHash(client, {
      address: account.address,
      hash: payload,
      signature,
    })

    expect(valid).toBe(true)
  })

  test('behavior: no keys', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const nextAccount = Account.from({
      ...account,
      keys: undefined,
      sign: undefined,
    })

    const payload = Hex.random(32)

    await expect(
      Account.sign(nextAccount, {
        payload,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: cannot find key to sign with.]',
    )
  })
})
