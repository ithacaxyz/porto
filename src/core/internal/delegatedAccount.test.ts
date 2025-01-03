import { Secp256k1, Value } from 'ox'
import { privateKeyToAccount } from 'viem/accounts'
import { getBalance } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../test/src/account.js'
import { client, delegation } from '../../../test/src/porto.js'
import * as Call from './call.js'
import * as DelegatedAccount from './delegatedAccount.js'
import * as Key from './key.js'

describe('execute', () => {
  describe('authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, { delegation })

      const key = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        initialize: true,
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...key,
        sign: undefined,
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, {
        delegation,
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [],
        initialize: true,
      })

      const key = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...key,
        sign: undefined,
      })
    })

    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: EOA', async () => {
      const { account, privateKey } = await getAccount(client, {
        delegation,
      })

      const key = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        initialize: true,
        executor: privateKeyToAccount(privateKey),
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...key,
        sign: undefined,
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: EOA', async () => {
      const { account, privateKey } = await getAccount(client, {
        delegation,
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [],
        initialize: true,
      })

      const key = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        executor: privateKeyToAccount(privateKey),
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...key,
        sign: undefined,
      })
    })

    test('key: P256, keysToAuthorize: [P256]', async () => {
      const { account } = await getAccount(client, { delegation })

      const key = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
          Call.setCanExecute(),
        ],
        initialize: true,
      })

      const nextKey = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key: nextKey,
          }),
        ],
        key,
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 1,
        }),
      ).toEqual({
        ...nextKey,
        sign: undefined,
      })
    })

    test('key: P256, keysToAuthorize: [WebCryptoP256]', async () => {
      const { account } = await getAccount(client, { delegation })

      const key = Key.createP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
          Call.setCanExecute(),
        ],
        initialize: true,
      })

      const nextKey = await Key.createWebCryptoP256({
        role: 'admin',
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          Call.authorize({
            key: nextKey,
          }),
        ],
        key,
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 1,
        }),
      ).toEqual({
        ...nextKey,
        sign: undefined,
      })
    })
  })

  describe('arbitrary calls', () => {
    test('key: owner, executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, {
        delegation,
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [],
        initialize: true,
      })

      const alice = privateKeyToAccount(Secp256k1.randomPrivateKey())
      const bob = privateKeyToAccount(Secp256k1.randomPrivateKey())

      const balances_before = await Promise.all([
        getBalance(client, { address: account.address }),
        getBalance(client, { address: alice.address }),
        getBalance(client, { address: bob.address }),
      ])

      expect(balances_before[1]).toEqual(Value.fromEther('0'))
      expect(balances_before[2]).toEqual(Value.fromEther('0'))

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          { to: alice.address, value: Value.fromEther('1') },
          { to: bob.address, value: Value.fromEther('0.5') },
        ],
      })

      const balances_after = await Promise.all([
        getBalance(client, { address: account.address }),
        getBalance(client, { address: alice.address }),
        getBalance(client, { address: bob.address }),
      ])

      expect(balances_after[0]).not.toBeGreaterThan(
        balances_before[0] - Value.fromEther('1'),
      )
      expect(balances_after[1]).toEqual(Value.fromEther('1'))
      expect(balances_after[2]).toEqual(Value.fromEther('0.5'))
    })

    test('key: owner, executor: EOA', async () => {
      const { account, privateKey } = await getAccount(client, {
        delegation,
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [],
        initialize: true,
      })

      const alice = privateKeyToAccount(Secp256k1.randomPrivateKey())
      const bob = privateKeyToAccount(Secp256k1.randomPrivateKey())

      const balances_before = await Promise.all([
        getBalance(client, { address: account.address }),
        getBalance(client, { address: alice.address }),
        getBalance(client, { address: bob.address }),
      ])

      expect(balances_before[1]).toEqual(Value.fromEther('0'))
      expect(balances_before[2]).toEqual(Value.fromEther('0'))

      await DelegatedAccount.execute(client, {
        account,
        calls: [
          { to: alice.address, value: Value.fromEther('1') },
          { to: bob.address, value: Value.fromEther('0.5') },
        ],
        executor: privateKeyToAccount(privateKey),
      })

      const balances_after = await Promise.all([
        getBalance(client, { address: account.address }),
        getBalance(client, { address: alice.address }),
        getBalance(client, { address: bob.address }),
      ])

      expect(balances_after[0]).not.toBeGreaterThan(
        balances_before[0] - Value.fromEther('1'),
      )
      expect(balances_after[1]).toEqual(Value.fromEther('1'))
      expect(balances_after[2]).toEqual(Value.fromEther('0.5'))
    })
  })
})

describe('from', () => {
  test('default', () => {
    const account = DelegatedAccount.from({
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

describe('prepareExecute', () => {
  describe('authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, { delegation })

      const key = account.keys[0]

      const keyToAuthorize = Key.createP256({
        role: 'admin',
      })

      const { request, signPayloads } = await DelegatedAccount.prepareExecute(
        client,
        {
          account,
          calls: [
            Call.authorize({
              key: keyToAuthorize,
            }),
          ],
          initialize: true,
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => key.sign({ payload })),
      )

      await DelegatedAccount.execute(client, {
        ...request,
        signatures,
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...keyToAuthorize,
        sign: undefined,
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, {
        delegation,
      })

      await DelegatedAccount.execute(client, {
        account,
        calls: [],
        initialize: true,
      })

      const key = account.keys[0]

      const keyToAuthorize = Key.createP256({
        role: 'admin',
      })

      const { request, signPayloads } = await DelegatedAccount.prepareExecute(
        client,
        {
          account,
          calls: [
            Call.authorize({
              key: keyToAuthorize,
            }),
          ],
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => key.sign({ payload })),
      )

      await DelegatedAccount.execute(client, {
        ...request,
        signatures,
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...keyToAuthorize,
        sign: undefined,
      })
    })

    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: EOA', async () => {
      const { account, privateKey } = await getAccount(client, {
        delegation,
      })

      const key = account.keys[0]

      const keyToAuthorize = Key.createP256({
        role: 'admin',
      })

      const { request, signPayloads } = await DelegatedAccount.prepareExecute(
        client,
        {
          account,
          calls: [
            Call.authorize({
              key: keyToAuthorize,
            }),
          ],
          initialize: true,
          executor: privateKeyToAccount(privateKey),
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => key.sign({ payload })),
      )

      await DelegatedAccount.execute(client, {
        ...request,
        signatures,
      })

      expect(
        await DelegatedAccount.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...keyToAuthorize,
        sign: undefined,
      })
    })
  })
})

describe('getExecuteSignPayload', () => {
  test('default', async () => {
    const { account } = await getAccount(client, { delegation })

    const key = Key.createP256({
      role: 'admin',
    })

    const payload = await DelegatedAccount.getExecuteSignPayload(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      nonce: 0n,
    })

    expect(payload).toBeDefined()
  })

  test('behavior: account already delegated', async () => {
    const { account } = await getAccount(client, {
      delegation,
    })

    await DelegatedAccount.execute(client, {
      account,
      calls: [],
      initialize: true,
    })

    const key = Key.createP256({
      role: 'admin',
    })

    const payload = await DelegatedAccount.getExecuteSignPayload(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
      nonce: 0n,
    })

    expect(payload).toBeDefined()
  })
})
