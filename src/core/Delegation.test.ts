import { AbiFunction, Secp256k1, Value } from 'ox'
import { http, createClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getBalance } from 'viem/actions'
import { odysseyTestnet } from 'viem/chains'
import { describe, expect, test } from 'vitest'

import { getAccount } from '../../test/src/account.js'
import { client, delegation } from '../../test/src/porto.js'
import * as Delegation from './Delegation.js'
import * as Account from './internal/account.js'
import * as Call from './internal/call.js'
import * as Key from './internal/key.js'

describe('execute', () => {
  describe('behavior: authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
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
          Call.setCanExecute(),
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
          Call.setCanExecute(),
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
      const key = Key.createP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.setCanExecute(), Call.authorize({ key })],
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

    test('key: secp256k1, executor: JSON-RPC', async () => {
      const key = Key.createSecp256k1({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.setCanExecute(), Call.authorize({ key })],
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
      const key = await Key.createWebCryptoP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [Call.setCanExecute(), Call.authorize({ key })],
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
      const key = Key.createP256({
        role: 'admin',
      })

      const { account } = await getAccount(client, { keys: [key] })

      await Delegation.execute(client, {
        account,
        calls: [
          Call.setCanExecute(),
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
      role: 'admin',
    })

    const { account } = await getAccount(client)

    await Delegation.execute(client, {
      account,
      calls: [
        Call.setCanExecute({ enabled: false, key }),
        Call.authorize({ key }),
      ],
      delegation,
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
    const { account } = await getAccount(client)

    const key = Key.createP256({
      role: 'admin',
    })

    await expect(() =>
      Delegation.execute(client, {
        account,
        calls: [],
        delegation,
        key,
      }),
    ).rejects.toThrowError('Reason: KeyDoesNotExist')
  })
})

describe('prepareExecute', () => {
  describe('authorize', () => {
    test('delegated: false, key: owner, keysToAuthorize: [P256], executor: JSON-RPC', async () => {
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

describe('getExecuteSignPayload', () => {
  test('default', async () => {
    const { account } = await getAccount(client)

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

  test('behavior: account already delegated', async () => {
    const { account } = await getAccount(client)

    await Delegation.execute(client, {
      account,
      calls: [],
      delegation,
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
})

describe('simulate', () => {
  const account = Account.from({
    address: '0xb1596E2aD207c2Df8FA791A1a8a422E4146C5228',
  })
  const client = createClient({
    chain: odysseyTestnet,
    transport: http(),
  })
  const experimentalErc20 = '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c'

  const stateOverrides = [
    {
      address: account.address,
      balance: Value.fromEther('10000'),
    },
  ]

  test('default', async () => {
    const { balances, results } = await Delegation.simulate(client, {
      account,
      calls: [
        // Out: 1 ETH (-1 ETH)
        {
          to: '0x0000000000000000000000000000000000000001',
          value: Value.fromEther('1'),
        },
        // Out: 2 ETH (-3 ETH)
        {
          to: '0x0000000000000000000000000000000000000002',
          value: Value.fromEther('2'),
        },
        // Out: 2 EXP (-2 EXP)
        {
          abi: [AbiFunction.from('function transfer(address, uint256)')],
          functionName: 'transfer',
          args: [
            '0x0000000000000000000000000000000000000003',
            Value.fromEther('2'),
          ],
          to: experimentalErc20,
        },
        // In: 1 EXP (-1 EXP)
        {
          abi: [AbiFunction.from('function mint(address, uint256)')],
          functionName: 'mint',
          args: [account.address, Value.fromEther('1')],
          to: experimentalErc20,
        },
      ],
      stateOverrides,
    })

    expect(balances[0]?.token).toMatchInlineSnapshot(`
      {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "decimals": 18,
        "symbol": "ETH",
      }
    `)
    expect(balances[0]?.value.diff).toBeLessThan(-3)
    expect(balances[1]).toMatchInlineSnapshot(`
      {
        "token": {
          "address": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
          "decimals": 18,
          "symbol": "EXP",
        },
        "value": {
          "diff": -1000000000000000000n,
          "post": 99000000000000000000n,
          "pre": 100000000000000000000n,
        },
      }
    `)
    expect(
      results.map((x) => ({
        ...x,
        logs: x.logs?.map((x) => ({
          ...x,
          blockHash: null,
          blockNumber: null,
          blockTimestamp: null,
          transactionHash: null,
        })),
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "data": "0x",
          "gasUsed": 24000n,
          "logs": [],
          "result": null,
          "status": "success",
        },
        {
          "data": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          "gasUsed": 21060n,
          "logs": [],
          "result": null,
          "status": "success",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
          "gasUsed": 50926n,
          "logs": [
            {
              "address": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
              "blockHash": null,
              "blockNumber": null,
              "blockTimestamp": null,
              "data": "0x0000000000000000000000000000000000000000000000001bc16d674ec80000",
              "logIndex": 0,
              "removed": false,
              "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000b1596e2ad207c2df8fa791a1a8a422e4146c5228",
                "0x0000000000000000000000000000000000000000000000000000000000000003",
              ],
              "transactionHash": null,
              "transactionIndex": 2,
            },
          ],
          "result": undefined,
          "status": "success",
        },
        {
          "data": "0x",
          "gasUsed": 33893n,
          "logs": [
            {
              "address": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
              "blockHash": null,
              "blockNumber": null,
              "blockTimestamp": null,
              "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
              "logIndex": 1,
              "removed": false,
              "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x000000000000000000000000b1596e2ad207c2df8fa791a1a8a422e4146c5228",
              ],
              "transactionHash": null,
              "transactionIndex": 3,
            },
          ],
          "result": undefined,
          "status": "success",
        },
      ]
    `)
  })
})
