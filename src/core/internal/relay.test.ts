import { Hex, Value } from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../../test/src/actions.js'
import * as Anvil from '../../../test/src/anvil.js'
import {
  exp1Abi,
  exp1Address,
  exp2Abi,
  exp2Address,
  exp2Config,
  getPorto,
} from '../../../test/src/porto.js'
import * as Delegation from './delegation.js'
import * as Key from './key.js'
import * as Relay from './relay.js'

const { client } = getPorto()

describe('createAccount', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()

    const account = await Relay.createAccount(client, { keys: [key] })

    expect(account.address).toBeDefined()
    expect(account.keys[0]?.publicKey).toBe(key.publicKey)
  })

  test('behavior: keys function', async () => {
    let id: string | undefined
    const account = await Relay.createAccount(client, {
      keys(p) {
        id = p.ids[0]
        return [Key.createHeadlessWebAuthnP256()]
      },
    })

    expect(account.address).toBeDefined()
    expect(id).toBeDefined()
  })

  test('behavior: multiple keys', async () => {
    const key1 = Key.createHeadlessWebAuthnP256()

    const key2 = Key.createSecp256k1()

    const account = await Relay.createAccount(client, {
      keys: [key1, key2],
    })

    expect(account.address).toBeDefined()
    expect(account.keys[0]?.publicKey).toBe(key1.publicKey)
    expect(account.keys[1]?.publicKey).toBe(key2.publicKey)
  })

  test('behavior: permissions', async () => {
    const key = Key.createHeadlessWebAuthnP256({
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
    const key = Key.createHeadlessWebAuthnP256()

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
    const key = Key.createHeadlessWebAuthnP256()

    const account = await Relay.createAccount(client, { keys: [key] })
    const keys = await Relay.getKeys(client, {
      account,
    })

    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(key.publicKey)
  })

  test('behavior: address', async () => {
    const key = Key.createHeadlessWebAuthnP256()

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
    const key = Key.createHeadlessWebAuthnP256()
    const eoa = privateKeyToAccount(generatePrivateKey())

    await TestActions.setBalance(client, {
      address: eoa.address,
      value: Value.fromEther('10'),
    })

    const request = await Relay.prepareUpgradeAccount(client, {
      address: eoa.address,
      feeToken: exp1Address,
      keys: [key],
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
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          abi: exp2Abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: exp2Address,
        },
      ],
      feeToken: exp1Address,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...exp2Config,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test.runIf(Anvil.enabled)('behavior: no fee token (ETH)', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          abi: exp2Abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: exp2Address,
        },
      ],
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...exp2Config,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: via prepareCalls', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await Relay.prepareCalls(client, {
      account,
      calls: [
        {
          abi: exp2Abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: exp2Address,
        },
      ],
      feeToken: exp1Address,
      key,
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
      wrap: false,
    })

    const { id } = await Relay.sendCalls(client, {
      ...request,
      signature,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...exp2Config,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: pre bundles', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const newKey = Key.createP256({
      permissions: {
        calls: [{ to: exp2Address }],
        spend: [
          {
            limit: Value.fromEther('5'),
            period: 'minute',
            token: exp1Address,
          },
        ],
      },
      role: 'session',
    })
    const { id } = await Relay.sendCalls(client, {
      account,
      calls: [
        {
          abi: exp2Abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: exp2Address,
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

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...exp2Config,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: pre bundles (via prepareCalls)', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const alice = Hex.random(20)
    const newKey = Key.createP256({
      expiry: 9999999999,
      permissions: {
        calls: [{ to: alice }],
        spend: [
          {
            limit: Value.fromEther('5'),
            period: 'day',
            token: exp1Address,
          },
        ],
      },
      role: 'session',
    })
    const request_1 = await Relay.prepareCalls(client, {
      account,
      authorizeKeys: [newKey],
      feeToken: exp1Address,
      key,
      pre: true,
    })
    const signature_1 = await Key.sign(key, {
      payload: request_1.digest,
    })

    const request_2 = await Relay.prepareCalls(client, {
      account,
      calls: [
        {
          abi: exp2Abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: exp2Address,
        },
      ],
      feeToken: exp1Address,
      key,
      pre: [{ ...request_1, signature: signature_1 }],
    })
    const signature_2 = await Key.sign(key, {
      payload: request_2.digest,
      wrap: false,
    })

    const { id } = await Relay.sendCalls(client, {
      ...request_2,
      signature: signature_2,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...exp2Config,
        args: [account.address],
        functionName: 'balanceOf',
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
      const key = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            abi: exp2Abi,
            args: [account.address, 100n],
            functionName: 'mint',
            to: exp2Address,
          },
        ],
        feeToken: exp1Address,
      })
      expect(id).toBeDefined()

      await waitForCallsStatus(client, {
        id,
      })

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          abi: exp2Abi,
          address: exp2Address,
          args: [account.address],
          functionName: 'balanceOf',
        }),
      ).toBe(100n)
    })

    test.runIf(Anvil.enabled)('mint erc20; no fee token (ETH)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account – no `feeToken` specified.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            abi: exp2Abi,
            args: [account.address, 100n],
            functionName: 'mint',
            to: exp2Address,
          },
        ],
      })
      expect(id).toBeDefined()

      await waitForCallsStatus(client, {
        id,
      })

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          abi: exp2Abi,
          address: exp2Address,
          args: [account.address],
          functionName: 'balanceOf',
        }),
      ).toBe(100n)
    })

    test('noop', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
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
      const key = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Try to transfer 100 ERC20 tokens to the zero address.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: ['0x0000000000000000000000000000000000000000', 100n],
              functionName: 'transfer',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })

    // TODO: fix
    test.skip('error: contract error (insufficient eth balance)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
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
      const key = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Define additional Admin Keys.
      const keys = [
        Key.createHeadlessWebAuthnP256(),
        Key.createSecp256k1(),
      ] as const

      // 3. Authorize additional Admin Keys.
      const { id } = await Relay.sendCalls(client, {
        account,
        authorizeKeys: keys,
        calls: [],
        feeToken: exp1Address,
      })
      expect(id).toBeDefined()

      await waitForCallsStatus(client, {
        id,
      })

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
      const key = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Authorize a new Admin Key.
      const newKey = Key.createHeadlessWebAuthnP256()
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          authorizeKeys: [newKey],
          feeToken: exp1Address,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })
      }

      // 3. Mint 100 ERC20 tokens to Account with new Admin Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: newKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 4. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }
    })

    test('batch authorize + mint', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [key],
      })

      // 2. Authorize a new Session Key.
      const newKey = Key.createP256({
        permissions: {
          calls: [{ to: exp2Address }],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 3. Mint 100 ERC20 tokens to Account with new Session Key.
      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            abi: exp2Abi,
            args: [account.address, 100n],
            functionName: 'mint',
            to: exp2Address,
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

      await waitForCallsStatus(client, {
        id,
      })

      // 4. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          abi: exp2Abi,
          address: exp2Address,
          args: [account.address],
          functionName: 'balanceOf',
        }),
      ).toBe(100n)
    })
  })

  describe('behavior: call permissions', () => {
    test('default', async () => {
      // 1. Initialize account with Admin Key
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }
    })

    test('multiple calls', async () => {
      // 1. Initialize account with Admin Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }

      // 4. Mint another 100 ERC20 tokens to Account.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(200n)
      }
    })

    test('multiple calls (w/ admin key, then session key)', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 2. Mint 100 ERC20 tokens to Account with Admin Key (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: adminKey,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }

      // 4. Mint another 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(200n)
      }
    })

    test('multiple scopes', async () => {
      const alice = Hex.random(20)

      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              signature: 'mint(address,uint256)',
              to: exp2Address,
            },
            {
              signature: 'transfer(address,uint256)',
              to: exp1Address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
            {
              abi: exp1Abi,
              args: [alice, 100n],
              functionName: 'transfer',
              to: exp1Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }
    })

    test('error: invalid target', async () => {
      // 1. Initialize account with Admin Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: exp1Address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key (and initialize scoped Session Key).
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
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
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              signature: '0xdeadbeef',
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
          ],
        },
        role: 'session',
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key (and initialize scoped Session Key).
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
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
    test('session key', async () => {
      // 1. Initialize account with Admin Key and Session Key (with permissions).
      const adminKey = Key.createHeadlessWebAuthnP256()
      const account = await initializeAccount(client, {
        keys: [adminKey],
      })

      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: exp2Address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: exp1Address,
            },
            { limit: 100n, period: 'day', token: exp2Address },
          ],
        },
        role: 'session',
      })

      // 2. Mint 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
          pre: [
            {
              authorizeKeys: [sessionKey],
              key: adminKey,
            },
          ],
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: exp2Abi,
            address: exp2Address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }

      {
        // 4. Transfer 50 ERC20 token from Account.
        const { id } = await Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: ['0x0000000000000000000000000000000000000000', 50n],
              functionName: 'transfer',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
        })

        await waitForCallsStatus(client, {
          id,
        })
      }

      // 5. Try to transfer another 50 ERC20 tokens from Account.
      await expect(() =>
        Relay.sendCalls(client, {
          account,
          calls: [
            {
              abi: exp2Abi,
              args: ['0x0000000000000000000000000000000000000000', 100n],
              functionName: 'transfer',
              to: exp2Address,
            },
          ],
          feeToken: exp1Address,
          key: sessionKey,
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })
  })
})
