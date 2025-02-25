import { AbiFunction, Secp256k1, Value } from 'ox'
import { http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  getBalance,
  readContract,
  waitForTransactionReceipt,
} from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../../test/src/account.js'
import { ExperimentERC20 } from '../../../test/src/contracts.js'
import { getPorto } from '../../../test/src/porto.js'
import * as Chains from '../Chains.js'
import * as Call from './call.js'
import * as Delegation from './delegation.js'
import * as Key from './key.js'

describe('execute', () => {
  describe('behavior: authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

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
        delegation,
      })

      expect(
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        canSign: false,
        expiry: key.expiry,
        publicKey: key.publicKey,
        role: key.role,
        type: 'p256',
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

      await Delegation.execute(client, {
        account,
        calls: [],
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
      })

      expect(
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        expiry: key.expiry,
        publicKey: key.publicKey,
        role: key.role,
        canSign: false,
        type: 'p256',
      })
    })

    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: EOA', async () => {
      const { client, delegation } = getPorto()
      const { account, privateKey } = await getAccount(client)

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
        delegation,
        executor: privateKeyToAccount(privateKey),
      })

      expect(
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        expiry: key.expiry,
        publicKey: key.publicKey,
        role: key.role,
        canSign: false,
        type: 'p256',
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: EOA', async () => {
      const { client, delegation } = getPorto()
      const { account, privateKey } = await getAccount(client)

      await Delegation.execute(client, {
        account,
        calls: [],
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
        executor: privateKeyToAccount(privateKey),
      })

      expect(
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
      ).toEqual({
        expiry: key.expiry,
        publicKey: key.publicKey,
        role: key.role,
        canSign: false,
        type: 'p256',
      })
    })

    test('key: P256, keysToAuthorize: [P256]', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

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
        delegation,
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
        expiry: nextKey.expiry,
        publicKey: nextKey.publicKey,
        role: nextKey.role,
        canSign: false,
        type: 'p256',
      })
    })

    test('key: P256, keysToAuthorize: [WebCryptoP256]', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

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
        delegation,
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
        expiry: nextKey.expiry,
        publicKey: nextKey.publicKey,
        role: nextKey.role,
        canSign: false,
        type: 'p256',
      })
    })
  })

  describe('behavior: arbitrary calls', () => {
    test('key: p256, executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()

      const key = Key.createP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.authorize({ key })],
        delegation,
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
        key,
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

    test('key: p256, executor: JSON-RPC, mint tokens', async () => {
      const { client, delegation } = getPorto()

      const key = Key.createP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.authorize({ key })],
        delegation,
      })

      const mint = AbiFunction.encodeData(
        AbiFunction.from('function mint(address,uint256)'),
        [account.address, Value.fromEther('1000')],
      )

      await Delegation.execute(client, {
        account,
        calls: [{ data: mint, to: ExperimentERC20.address[0] }],
        key,
      })

      const balance = await readContract(client, {
        address: ExperimentERC20.address[0],
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
        args: [account.address],
      })

      expect(balance).toEqual(Value.fromEther('11000'))
    })

    test('key: secp256k1, executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()

      const key = Key.createSecp256k1({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.authorize({ key })],
        delegation,
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
        key,
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

    test('key: webcrypto, executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()

      const key = await Key.createWebCryptoP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.authorize({ key })],
        delegation,
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
        key,
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

    test('key: owner, executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

      await Delegation.execute(client, {
        account,
        calls: [],
        delegation,
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
      const { client, delegation } = getPorto()
      const { account, privateKey } = await getAccount(client)

      await Delegation.execute(client, {
        account,
        calls: [],
        delegation,
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

  describe('behavior: spend limits', () => {
    test('default', async () => {
      const { client, delegation } = getPorto()

      const key = Key.createP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.authorize({ key }),
          Call.setSpendLimit({
            key,
            period: 'day',
            limit: Value.fromEther('1.5'),
          }),
        ],
        delegation,
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
        key,
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

      await expect(() =>
        Delegation.execute(client, {
          account,
          calls: [
            { to: alice.address, value: Value.fromEther('1') },
            { to: bob.address, value: Value.fromEther('0.5') },
          ],
          key,
        }),
      ).rejects.toThrowError('ExceededSpendLimit')
    })
  })

  test('error: insufficient funds', async () => {
    const { client, delegation } = getPorto()
    const { account } = await getAccount(client)

    await expect(() =>
      Delegation.execute(client, {
        account,
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
            value: Value.fromEther('99999'),
          },
        ],
        delegation,
      }),
    ).rejects.toThrowError('An error occurred while executing calls.')
  })

  test('error: unauthorized', async () => {
    const key = Key.createP256({
      role: 'session',
    })

    const { client, delegation } = getPorto()
    const { account } = await getAccount(client)

    await Delegation.execute(client, {
      account,
      calls: [Call.authorize({ key })],
      delegation,
    })

    await Delegation.execute(client, {
      account,
      calls: [Call.setCanExecute({ enabled: false, key })],
    })

    await expect(() =>
      Delegation.execute(client, {
        account,
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        key,
      }),
    ).rejects.toThrowError('Reason: Unauthorized')
  })

  test('error: key does not exist ', async () => {
    const { client, delegation } = getPorto()
    const { account } = await getAccount(client)

    const key = Key.createP256({
      role: 'admin',
    })

    await Delegation.execute(client, {
      account,
      calls: [],
      delegation,
    })

    await expect(() =>
      Delegation.execute(client, {
        account,
        calls: [],
        key,
      }),
    ).rejects.toThrowError('Reason: KeyDoesNotExist')
  })
})

describe('prepareExecute', () => {
  describe('authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

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
          delegation,
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => account.sign({ payload })),
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
        expiry: keyToAuthorize.expiry,
        publicKey: keyToAuthorize.publicKey,
        role: keyToAuthorize.role,
        canSign: false,
        type: 'p256',
      })
    })

    test('delegated: true, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
      const { client, delegation } = getPorto()
      const { account } = await getAccount(client)

      await Delegation.execute(client, {
        account,
        calls: [],
        delegation,
      })

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
        signPayloads.map((payload) => account.sign({ payload })),
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
        expiry: keyToAuthorize.expiry,
        publicKey: keyToAuthorize.publicKey,
        role: keyToAuthorize.role,
        canSign: false,
        type: 'p256',
      })
    })

    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: EOA', async () => {
      const { client, delegation } = getPorto()
      const { account, privateKey } = await getAccount(client)

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
          delegation,
          executor: privateKeyToAccount(privateKey),
        },
      )

      const signatures = await Promise.all(
        signPayloads.map((payload) => account.sign({ payload })),
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
        expiry: keyToAuthorize.expiry,
        publicKey: keyToAuthorize.publicKey,
        role: keyToAuthorize.role,
        canSign: false,
        type: 'p256',
      })
    })
  })
})

test.skip('e2e (https://relay.ithaca.xyz)', async () => {
  const { client, delegation } = getPorto({
    chain: Chains.odysseyTestnet,
    transports: {
      default: http(),
      relay: http('https://relay.ithaca.xyz'),
    },
  })

  const { account } = await getAccount(client, { setBalance: false })

  // delegate
  {
    const hash = await Delegation.execute(client, {
      account,
      delegation,
      calls: [],
    })
    await waitForTransactionReceipt(client, { hash })
  }

  const key = Key.createP256({
    role: 'admin',
  })

  // authorize P256 key
  {
    const hash = await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key,
        }),
      ],
    })

    await waitForTransactionReceipt(client, { hash })
  }

  const anotherKey = Key.createP256({
    role: 'admin',
  })

  // authorize another P256 key with previously authorized key
  {
    const hash = await Delegation.execute(client, {
      account,
      calls: [
        Call.authorize({
          key: anotherKey,
        }),
      ],
      key,
    })

    await waitForTransactionReceipt(client, { hash })
  }

  expect(
    (
      await Delegation.keyAt(client, {
        account: account.address,
        index: 1,
      })
    ).publicKey,
  ).toEqual(anotherKey.publicKey)
})
