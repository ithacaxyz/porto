import { Secp256k1, Value } from 'ox'
import { privateKeyToAccount } from 'viem/accounts'
import { getBalance, sendTransaction } from 'viem/actions'
import { signAuthorization } from 'viem/experimental'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../test/src/account.js'
import { client, delegation } from '../../../test/src/porto.js'
import * as Call from './call.js'
import * as Delegation from './delegation.js'
import * as Key from './key.js'

describe('execute', () => {
  describe('authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, { delegation })

      const key = Key.createP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        delegate: true,
      })

      expect(
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...key,
        sign: undefined,
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account, privateKey } = await getAccount(client, {
        delegation,
      })

      const authorization = await signAuthorization(client, {
        account: privateKeyToAccount(privateKey),
        contractAddress: delegation,
        delegate: true,
      })
      await sendTransaction(client, {
        authorizationList: [authorization],
        account: null,
        to: account.address,
      })

      const key = Key.createP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
      })

      expect(
        await Delegation.keyAt(client, {
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

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        delegate: true,
        executor: privateKeyToAccount(privateKey),
      })

      expect(
        await Delegation.keyAt(client, {
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

      const authorization = await signAuthorization(client, {
        account: privateKeyToAccount(privateKey),
        contractAddress: delegation,
        delegate: true,
      })
      await sendTransaction(client, {
        authorizationList: [authorization],
        account: null,
        to: account.address,
      })

      const key = Key.createP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
          }),
        ],
        executor: privateKeyToAccount(privateKey),
      })

      expect(
        await Delegation.keyAt(client, {
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

      await Delegation.execute(client, {
        account,
        calls: [
          Call.setCanExecute(),
          Call.authorize({
            key,
          }),
        ],
        delegate: true,
      })

      const nextKey = Key.createP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key: nextKey,
          }),
        ],
        key,
      })

      expect(
        await Delegation.keyAt(client, {
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

      await Delegation.execute(client, {
        account,
        calls: [
          Call.setCanExecute(),
          Call.authorize({
            key,
          }),
        ],
        delegate: true,
      })

      const nextKey = await Key.createWebCryptoP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key: nextKey,
          }),
        ],
        key,
      })

      expect(
        await Delegation.keyAt(client, {
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

      await Delegation.execute(client, {
        account,
        calls: [],
        delegate: true,
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

      await Delegation.execute(client, {
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

      await Delegation.execute(client, {
        account,
        calls: [],
        delegate: true,
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

      await Delegation.execute(client, {
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

describe('prepareExecute', () => {
  describe('authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await getAccount(client, { delegation })

      const key = account.keys[0]

      const keyToAuthorize = Key.createP256({
        role: 'admin',
      })

      const { request, signPayloads } = await Delegation.prepareExecute(
        client,
        {
          account,
          calls: [
            Call.authorize({
              key: keyToAuthorize,
            }),
          ],
          delegate: true,
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => key.sign({ payload })),
      )

      await Delegation.execute(client, {
        ...request,
        signatures,
      })

      expect(
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        ...keyToAuthorize,
        sign: undefined,
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account, privateKey } = await getAccount(client, {
        delegation,
      })

      const authorization = await signAuthorization(client, {
        account: privateKeyToAccount(privateKey),
        contractAddress: delegation,
        delegate: true,
      })
      await sendTransaction(client, {
        authorizationList: [authorization],
        account: null,
        to: account.address,
      })

      const key = account.keys[0]

      const keyToAuthorize = Key.createP256({
        role: 'admin',
      })

      const { request, signPayloads } = await Delegation.prepareExecute(
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

      await Delegation.execute(client, {
        ...request,
        signatures,
      })

      expect(
        await Delegation.keyAt(client, {
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

      const { request, signPayloads } = await Delegation.prepareExecute(
        client,
        {
          account,
          calls: [
            Call.authorize({
              key: keyToAuthorize,
            }),
          ],
          delegate: true,
          executor: privateKeyToAccount(privateKey),
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => key.sign({ payload })),
      )

      await Delegation.execute(client, {
        ...request,
        signatures,
      })

      expect(
        await Delegation.keyAt(client, {
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
    const { account, privateKey } = await getAccount(client, {
      delegation,
    })

    const authorization = await signAuthorization(client, {
      account: privateKeyToAccount(privateKey),
      contractAddress: delegation,
      delegate: true,
    })
    await sendTransaction(client, {
      authorizationList: [authorization],
      account: null,
      to: account.address,
    })

    const key = Key.createP256({
      role: 'admin',
    })

    const payload = await Delegation.getExecuteSignPayload(client, {
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

  test('behavior: account not delegated yet', async () => {
    const { account } = await getAccount(client, { delegation })

    const key = Key.createP256({
      role: 'admin',
    })

    const payload = await Delegation.getExecuteSignPayload(client, {
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
