import { Address, Secp256k1, Signature, Value } from 'ox'
import { privateKeyToAccount } from 'viem/accounts'
import { getBalance, sendTransaction, setBalance } from 'viem/actions'
import { signAuthorization } from 'viem/experimental'
import { describe, expect, test } from 'vitest'

import { porto } from '../../../test/src/config.js'
import * as Account from './account.js'
import * as Call from './call.js'
import * as Delegation from './delegation.js'
import * as Key from './key.js'

const state = porto._internal.store.getState()
const client = state.client.extend(() => ({ mode: 'anvil' }))

async function setup() {
  const privateKey = Secp256k1.randomPrivateKey()
  const address = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))

  await setBalance(client, {
    address,
    value: Value.fromEther('2'),
  })

  const key = Key.fromSecp256k1({
    privateKey,
    role: 'owner',
  })

  const account = Account.from({
    address,
    delegation: state.delegation,
    keys: [key],
  })

  return {
    account,
    privateKey,
  }
}

describe('execute', () => {
  describe('authorize', () => {
    test('delegated: false, key: EOA, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await setup()

      const key = Key.createP256({
        role: 'admin',
      })

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

    test('delegated: true, key: EOA, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account, privateKey } = await setup()

      const authorization = await signAuthorization(client, {
        account: privateKeyToAccount(privateKey),
        contractAddress: state.delegation,
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
            to: account.address,
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

    test('delegated: false, key: EOA, keysToAuthorize: [P256], executor: EOA', async () => {
      const { account, privateKey } = await setup()

      const key = Key.createP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key,
            to: account.address,
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

    test('delegated: true, key: EOA, keysToAuthorize: [P256], executor: EOA', async () => {
      const { account, privateKey } = await setup()

      const authorization = await signAuthorization(client, {
        account: privateKeyToAccount(privateKey),
        contractAddress: state.delegation,
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
            to: account.address,
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

    test.skip('key: P256, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await setup()

      const key = Key.createP256({
        role: 'admin',
      })

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

      const nextKey = Key.createP256({
        role: 'admin',
      })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({
            key: nextKey,
            to: account.address,
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
    test('delegated: true, key: EOA, executor: EOA', async () => {
      const { account, privateKey } = await setup()

      const eoa = privateKeyToAccount(privateKey)

      const authorization = await signAuthorization(client, {
        account: eoa,
        contractAddress: state.delegation,
        delegate: true,
      })
      await sendTransaction(client, {
        authorizationList: [authorization],
        account: null,
        to: account.address,
      })

      const alice = privateKeyToAccount(Secp256k1.randomPrivateKey())
      const bob = privateKeyToAccount(Secp256k1.randomPrivateKey())

      const balances_before = await Promise.all([
        getBalance(client, { address: account.address }),
        getBalance(client, { address: alice.address }),
        getBalance(client, { address: bob.address }),
      ])

      expect(balances_before[0]).toEqual(Value.fromEther('2'))
      expect(balances_before[1]).toEqual(Value.fromEther('0'))
      expect(balances_before[2]).toEqual(Value.fromEther('0'))

      await Delegation.execute(client, {
        account: eoa,
        calls: [
          { to: alice.address, value: Value.fromEther('1') },
          { to: bob.address, value: Value.fromEther('0.5') },
        ],
        executor: eoa,
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
    test('delegated: false, key: EOA, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account } = await setup()

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
              to: account.address,
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

    test('delegated: true, key: EOA, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { account, privateKey } = await setup()

      const authorization = await signAuthorization(client, {
        account: privateKeyToAccount(privateKey),
        contractAddress: state.delegation,
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
              to: account.address,
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

    test('delegated: false, key: EOA, keysToAuthorize: [P256], executor: EOA', async () => {
      const { account, privateKey } = await setup()

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
              to: account.address,
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
    const { account, privateKey } = await setup()

    const authorization = await signAuthorization(client, {
      account: privateKeyToAccount(privateKey),
      contractAddress: state.delegation,
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
          to: account.address,
        }),
      ],
      nonce: 0n,
    })

    expect(payload).toBeDefined()
  })

  test('behavior: account not delegated yet', async () => {
    const { account } = await setup()

    const key = Key.createP256({
      role: 'admin',
    })

    const payload = await Delegation.getExecuteSignPayload(client, {
      account,
      calls: [
        Call.authorize({
          key,
          to: account.address,
        }),
      ],
      nonce: 0n,
    })

    expect(payload).toBeDefined()
  })
})
