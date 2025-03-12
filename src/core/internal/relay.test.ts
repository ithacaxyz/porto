import { Hex, Value } from 'ox'
import { readContract } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { generatePrivateKey } from 'viem/accounts'
import { privateKeyToAccount } from 'viem/accounts'
import * as TestActions from '../../../test/src/actions.js'
import { ExperimentERC20 } from '../../../test/src/contracts.js'
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

    const account = await Relay.createAccount(client, {
      keys: [key],
    })

    expect(account.address).toBeDefined()
    expect(account.keys).toContain(key)
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
    expect(account.keys).toContain(key1)
    expect(account.keys).toContain(key2)
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
    expect(account.keys).toContain(key)
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
      feeToken: ExperimentERC20.address[0],
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
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      nonce: randomNonce(),
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        address: ExperimentERC20.address[1],
        abi: ExperimentERC20.abi,
        functionName: 'balanceOf',
        args: [account.address],
      }),
    ).toBe(100n)
  })
})

describe('prepareCalls + sendPreparedCalls', () => {
  test('default', async () => {
    const key = Key.createP256({ role: 'admin' })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await Relay.prepareCalls(client, {
      account,
      calls: [
        {
          to: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [account.address, 100n],
        },
      ],
      feeToken: ExperimentERC20.address[0],
      key,
      nonce: randomNonce(),
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
    })

    const { id } = await Relay.sendPreparedCalls(client, {
      ...request,
      signature,
    })

    expect(id).toBeDefined()

    expect(
      await readContract(client, {
        address: ExperimentERC20.address[1],
        abi: ExperimentERC20.abi,
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
      const { account } = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })
      expect(id).toBeDefined()

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          address: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })

    // TODO: fix
    test.skip('mint erc20; no fee token (ETH)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const { account } = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account – no `feeToken` specified.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        nonce: randomNonce(),
      })
      expect(id).toBeDefined()

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          address: ExperimentERC20.address[1],
          abi: ExperimentERC20.abi,
          functionName: 'balanceOf',
          args: [account.address],
        }),
      ).toBe(100n)
    })

    test('noop', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const { account } = await initializeAccount(client, {
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
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      expect(id).toBeDefined()
    })

    test('error: contract error (insufficient erc20 balance)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const { account } = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Try to transfer 100 ERC20 tokens to the zero address.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: ['0x0000000000000000000000000000000000000000', 100n],
            },
          ],
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })

    test('error: contract error (insufficient eth balance)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const { account } = await initializeAccount(client, {
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
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        }),
      ).rejects.toThrowError('Reason: CallError')
    })
  })

  describe('behavior: authorize keys', () => {
    test('authorize admin keys', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const { account } = await initializeAccount(client, {
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
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
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
      const { account } = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Authorize a new Admin Key.
      const newKey = Key.createP256({ role: 'admin' })
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          authorizeKeys: [newKey],
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()
      }

      // 3. Mint 100 ERC20 tokens to Account with new Admin Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: newKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 4. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test.skip('batch authorize + mint', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({ role: 'admin' })
      const { account } = await initializeAccount(client, {
        keys: [key],
      })

      const newKey = Key.createP256({ role: 'admin' })
      // 2. Authorize a new Admin Key + mint 100 ERC20 tokens to Account with new Admin Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          authorizeKeys: [newKey],
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: newKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 4. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })
  })

  describe('behavior: call permissions', () => {
    // TODO: fix
    test.skip('admin key', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createP256({
        permissions: { calls: [{ to: ExperimentERC20.address[1] }] },
        role: 'admin',
      })
      const { account } = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('session key', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[1],
            },
          ],
        },
      })
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('session key; multiple calls', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[1],
            },
          ],
        },
      })
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
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
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(200n)
      }
    })

    test('session key; multiple calls (w/ admin key, then session key)', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[1],
            },
          ],
        },
      })
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account with Admin Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: adminKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
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
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(200n)
      }
    })

    test('session key; multiple scopes', async () => {
      const alice = Hex.random(20)

      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
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
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
            {
              to: alice,
              value: 100n,
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'balanceOf',
            args: [account.address],
          }),
        ).toBe(100n)
      }
    })

    test('error: session key; invalid target', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[0],
            },
          ],
        },
      })
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        }),
      ).rejects.toThrowError('Reason: Unauthorized')
    })

    test('error: session key; invalid selector', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createP256({ role: 'admin' })
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
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key.
      await expect(
        () =>
          Relay.sendCalls(client, {
            account,
            calls: [
              {
                to: ExperimentERC20.address[1],
                abi: ExperimentERC20.abi,
                functionName: 'mint',
                args: [account.address, 100n],
              },
            ],
            key: sessionKey,
            feeToken: ExperimentERC20.address[0],
            nonce: randomNonce(),
          }),
        // TODO: expect human-readable signature
      ).rejects.toThrowError('op reverted: 0x82b42900')
    })
  })

  describe('behavior: spend permissions', () => {
    test('admin key', async () => {
      // 1. Initialize Account with Admin Key (with spend permission).
      const adminKey = Key.createP256({
        permissions: {
          spend: [
            { limit: 100n, token: ExperimentERC20.address[1], period: 'day' },
          ],
        },
        role: 'admin',
      })
      const { account } = await initializeAccount(client, {
        keys: [adminKey],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, 100n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      // 3. Transfer 50 ERC20 tokens from Account.
      await Relay.sendCalls(client, {
        account,
        calls: [
          {
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000', 50n],
          },
        ],
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      // 4. Try transfer another 50 ERC20 tokens from Account.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: ['0x0000000000000000000000000000000000000000', 100n],
            },
          ],
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })

    test('session key', async () => {
      // 1. Initialize account with Admin Key and Session Key (with permissions).
      const adminKey = Key.createP256({ role: 'admin' })
      const sessionKey = Key.createP256({
        role: 'session',
        permissions: {
          calls: [
            {
              to: ExperimentERC20.address[1],
            },
          ],
          spend: [
            { limit: 100n, token: ExperimentERC20.address[1], period: 'day' },
          ],
        },
      })
      const { account } = await initializeAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'mint',
              args: [account.address, 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        })
        expect(id).toBeDefined()

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            address: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
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
            to: ExperimentERC20.address[1],
            abi: ExperimentERC20.abi,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000', 50n],
          },
        ],
        key: sessionKey,
        feeToken: ExperimentERC20.address[0],
        nonce: randomNonce(),
      })

      // 5. Try to transfer another 50 ERC20 tokens from Account.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              to: ExperimentERC20.address[1],
              abi: ExperimentERC20.abi,
              functionName: 'transfer',
              args: ['0x0000000000000000000000000000000000000000', 100n],
            },
          ],
          key: sessionKey,
          feeToken: ExperimentERC20.address[0],
          nonce: randomNonce(),
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })
  })
})

// TODO: remove this
function randomNonce() {
  return Hex.toBigInt(
    Hex.concat(
      // multichain flag (0 = single chain, 0xc1d0 = multi-chain)
      Hex.fromNumber(0, { size: 2 }),
      // sequence key
      Hex.random(22),
      // sequential nonce
      Hex.fromNumber(0, { size: 8 }),
    ),
  )
}
