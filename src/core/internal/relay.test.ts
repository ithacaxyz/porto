import { Hex, Value } from 'ox'
import { readContract } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import {
  exp1Address,
  exp2Abi,
  exp2Address,
  exp2Config,
} from '../../../test/src/_generated/contracts.js'
import * as TestActions from '../../../test/src/actions.js'
import { getPorto } from '../../../test/src/porto.js'
import * as Delegation from './delegation.js'
import * as Key from './key.js'
import * as Relay from './relay.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

describe('createAccount', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const account = await Relay.createAccount(client, { keys: [key] })

    expect(account.address).toBeDefined()
    expect(account.keys[0]?.publicKey).toBe(key.publicKey)
  })

  test('behavior: keys function', async () => {
    let id: string | undefined
    const account = await Relay.createAccount(client, {
      keys(p) {
        id = p.ids[0]
        return [
          Key.createP256({
            role: 'admin',
          }),
        ]
      },
    })

    expect(account.address).toBeDefined()
    expect(id).toBeDefined()
  })

  test('behavior: multiple keys', async () => {
    const key1 = Key.createP256({
      role: 'admin',
    })

    const key2 = await Key.createWebCryptoP256({
      role: 'admin',
    })

    const account = await Relay.createAccount(client, {
      keys: [key1, key2],
    })

    expect(account.address).toBeDefined()
    expect(account.keys[0]?.publicKey).toBe(key1.publicKey)
    expect(account.keys[1]?.publicKey).toBe(key2.publicKey)
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

    const account = await Relay.createAccount(client, {
      keys: [key],
    })

    expect(account.address).toBeDefined()
    expect(account.keys[0]?.publicKey).toBe(key.publicKey)
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

describe('getAccounts', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const account = await Relay.createAccount(client, { keys: [key] })
    const accounts = await Relay.getAccounts(client, {
      keyId: account.keys[0]!.id!,
    })

    expect(accounts[0]!.address).toBe(account.address)
    expect(accounts[0]!.keys[0]?.publicKey).toBe(key.publicKey)
  })
})

describe('getKeys', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const account = await Relay.createAccount(client, { keys: [key] })
    const keys = await Relay.getKeys(client, {
      account,
    })

    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(key.publicKey)
  })

  test('behavior: address', async () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const account = await Relay.createAccount(client, { keys: [key] })
    const keys = await Relay.getKeys(client, {
      account: account.address,
    })

    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(key.publicKey)
  })
})

describe('prepareUpgradeAccount + upgradeAccount', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const eoa = privateKeyToAccount(generatePrivateKey())

    await TestActions.setBalance(client, {
      address: eoa.address,
      value: Value.fromEther('10'),
    })

    const request = await Relay.prepareUpgradeAccount(client, {
      address: eoa.address,
      keys: [key],
      feeToken: exp1Address,
    })

    const signatures = await Promise.all(
      request.digests.map((hash) => eoa.sign({ hash })),
    )

    const result = await Relay.upgradeAccount(client, {
      ...request,
      signatures,
    })

    expect(result.account.keys).toContain(key)
  })
})

describe('sendCalls', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          to: exp2Address,
          abi: exp2Abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: exp1Address,
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        ...exp2Config,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })

  test('behavior: via prepareCalls', async () => {
    const key = Key.createP256({ role: 'admin' })
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await Relay.prepareCalls(client, {
      account,
      calls: [
        {
          to: exp2Address,
          abi: exp2Abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: exp1Address,
      key,
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
    })

    const { id } = await Relay.sendCalls(client, {
      ...request,
      signature,
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        ...exp2Config,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })

  test('behavior: pre bundles', async () => {
    const key = Key.createP256({ role: 'admin' })
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const newKey = Key.createP256({ role: 'admin' })
    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          to: exp2Address,
          abi: exp2Abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: exp1Address,
      key: newKey,
      pre: [
        {
          authorizeKeys: [newKey],
          key,
        },
      ],
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        ...exp2Config,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })

  test('behavior: pre bundles (via prepareCalls)', async () => {
    const key = Key.createP256({ role: 'admin' })
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const newKey = Key.createP256({ role: 'admin' })
    const request_1 = await Relay.prepareCalls(client, {
      account,
      authorizeKeys: [newKey],
      key,
      feeToken: exp1Address,
      pre: true,
    })
    const signature_1 = await Key.sign(key, {
      payload: request_1.digest,
    })

    const request_2 = await Relay.prepareCalls(client, {
      account,
      calls: [
        {
          to: exp2Address,
          abi: exp2Abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: exp1Address,
      pre: [{ ...request_1, signature: signature_1 }],
      key,
    })

    const signature_2 = await Key.sign(key, {
      payload: request_2.digest,
    })

    const { id } = await Relay.sendCalls(client, {
      ...request_2,
      signature: signature_2,
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        ...exp2Config,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })
})

describe.each([
  ['e2e: new account', { mode: 'new' }],
  ['e2e: upgraded account', { mode: 'upgraded' }],
])('%s', (_, { mode }) => {
  const initializeAccount =
    mode === 'new' ? TestActions.createAccount : TestActions.getUpgradedAccount

  describe('behavior: arbitrary calls', () => {
    test('mint erc20', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: exp2Address,
            abi: exp2Abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        feeToken: exp1Address,
      })
      expect(id).toBeDefined()

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          address: exp2Address,
          abi: exp2Abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })

    // TODO(relay): fix
    test.skip('mint erc20; no fee token (ETH)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account – no `feeToken` specified.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: exp2Address,
            abi: exp2Abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
      })
      expect(id).toBeDefined()

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          address: exp2Address,
          abi: exp2Abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })

    test('noop', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Perform a no-op call.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
        feeToken: exp1Address,
      })

      expect(id).toBeDefined()
    })

    test('error: contract error (insufficient erc20 balance)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Try to transfer 100 ERC20 tokens to the zero address.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'transfer',
              args: ['0x0000000000000000000000000000000000000000', 100n],
            },
          ],
          feeToken: exp1Address,
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })

    test('error: contract error (insufficient eth balance)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Try to transfer 100000000 ETH tokens to the zero address.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: '0x0000000000000000000000000000000000000000',
              value: Value.fromEther('100000000'),
            },
          ],
          feeToken: exp1Address,
        }),
      ).rejects.toThrowError('Reason: CallError')
    })
  })

  describe('behavior: authorize keys', () => {
    test('authorize admin keys', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Define additional Admin Keys.
      const keys = [
        Key.createP256({ role: 'admin' }),
        await Key.createWebCryptoP256({ role: 'admin' }),
      ] as const

      // 3. Authorize additional Admin Keys.
      const { id } = await Relay.sendCalls(client, {
        account,
        authorizeKeys: keys,
        calls: [],
        feeToken: exp1Address,
      })
      expect(id).toBeDefined()

      // 4. Verify that Account now has 3 Admin Keys.
      const [key_1, key_2, key_3] = [
        await Delegation.keyAt(client, {
          account,
          index: 0,
        }),
        await Delegation.keyAt(client, {
          account,
          index: 1,
        }),
        await Delegation.keyAt(client, {
          account,
          index: 2,
        }),
      ]

      expect(key_1.publicKey).toBe(key.publicKey)
      expect(key_2.publicKey).toBe(keys[0].publicKey)
      expect(key_3.publicKey).toBe(keys[1].publicKey)
    })

    test('authorize key with previous key', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Authorize a new Admin Key.
      const newKey = Key.createP256({ role: 'admin' })
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          authorizeKeys: [newKey],
          feeToken: exp1Address,
        })
        expect(id).toBeDefined()
      }

      // 3. Mint 100 ERC20 tokens to Account with new Admin Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: newKey,
          feeToken: exp1Address,
        })
        expect(id).toBeDefined()

        // 4. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('batch authorize + mint', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Authorize a new Session Key.
      const newKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [{ to: exp2Address }],
        },
      })

      // 3. Mint 100 ERC20 tokens to Account with new Session Key.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: exp2Address,
            abi: exp2Abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        key: newKey,
        feeToken: exp1Address,
        pre: [
          {
            authorizeKeys: [newKey],
            key,
          },
        ],
      })
      expect(id).toBeDefined()

      // 4. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          address: exp2Address,
          abi: exp2Abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })
  })

  describe('behavior: call permissions', () => {
    test('default', async () => {
      // 1. Initialize account with Admin Key
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
        },
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('multiple calls', async () => {
      // 1. Initialize account with Admin Key.
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
        },
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }

      // 4. Mint another 100 ERC20 tokens to Account.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
        })
        expect(id).toBeDefined()

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(200n)
      }
    })

    test('multiple calls (w/ admin key, then session key)', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
        },
      })

      // 2. Mint 100 ERC20 tokens to Account with Admin Key (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: adminKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }

      // 4. Mint another 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
        })
        expect(id).toBeDefined()

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(200n)
      }
    })

    test('multiple scopes', async () => {
      const alice = Hex.random(20)

      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              signature: 'mint(address,uint256)',
            },
            {
              to: alice,
            },
          ],
        },
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
            {
              to: alice,
              value: 100n,
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('error: invalid target', async () => {
      // 1. Initialize account with Admin Key.
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: exp1Address,
            },
          ],
        },
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key (and initialize scoped Session Key).
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        }),
      ).rejects.toThrowError('Reason: Unauthorized')
    })

    test('error: invalid selector', async () => {
      // 1. Initialize account with Admin Key.
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              signature: '0xdeadbeef',
            },
          ],
        },
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key (and initialize scoped Session Key).
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        }),
      ).rejects.toThrowError('Reason: Unauthorized')
    })
  })

  describe('behavior: spend permissions', () => {
    test('admin key', async () => {
      // 1. Initialize Account with Admin Key (with spend permission).
      const adminKey = Key.createP256({
        permissions: {
          spend: [{ limit: 100n, token: exp2Address, period: 'day' }],
        },
        role: 'admin',
      })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: exp2Address,
            abi: exp2Abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        feeToken: exp1Address,
      })

      // 3. Transfer 50 ERC20 tokens from Account.
      await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: exp2Address,
            abi: exp2Abi,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000', 50n],
          },
        ],
        feeToken: exp1Address,
      })

      // 4. Try transfer another 50 ERC20 tokens from Account.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'transfer',
              args: ['0x0000000000000000000000000000000000000000', 100n],
            },
          ],
          feeToken: exp1Address,
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })

    test('session key', async () => {
      // 1. Initialize account with Admin Key and Session Key (with permissions).
      const adminKey = Key.createP256({ role: 'admin' })
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
          spend: [{ limit: 100n, token: exp2Address, period: 'day' }],
        },
      })

      // 2. Mint 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: exp2Address,
            abi: exp2Abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }

      // 4. Transfer 50 ERC20 token from Account.
      await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: exp2Address,
            abi: exp2Abi,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000', 50n],
          },
        ],
        key: sessionKey,
        feeToken: exp1Address,
      })

      // 5. Try to transfer another 50 ERC20 tokens from Account.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: exp2Address,
              abi: exp2Abi,
              functionName: 'transfer',
              args: ['0x0000000000000000000000000000000000000000', 100n],
            },
          ],
          key: sessionKey,
          feeToken: exp1Address,
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })
  })
})
