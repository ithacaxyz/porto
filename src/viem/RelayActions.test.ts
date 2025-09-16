import { Hex, Value } from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { getEip712Domain, readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../test/src/actions.js'
import * as Anvil from '../../test/src/anvil.js'
import * as TestConfig from '../../test/src/config.js'
import * as Relay from '../../test/src/relay.js'
import * as AccountContract from './ContractActions.js'
import { ContractActions } from './index.js'
import * as Key from './Key.js'
import * as RelayActions from './RelayActions.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)
const contracts = await TestConfig.getContracts(porto)

describe('createAccount', () => {
  test('default', async () => {
    const account = await RelayActions.createAccount(client, {
      authorizeKeys: [Key.createHeadlessWebAuthnP256()],
    })

    expect(account).toBeDefined()
  })
})

describe('signCalls', () => {
  test('default: signs with provided key', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, { keys: [key] })

    const request = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key,
    })

    const signature = await RelayActions.signCalls(request, { key })
    expect(signature).toBeDefined()

    const { id } = await RelayActions.sendPreparedCalls(client, {
      ...request,
      key: request.key!,
      signature,
    })
    expect(id).toBeDefined()
  })

  test('behavior: signs with account', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, { keys: [key] })

    const request = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    const signature = await RelayActions.signCalls(request, { account })
    expect(signature).toBeDefined()
  })

  test('behavior: signs with eoa', async () => {
    const eoa = privateKeyToAccount(generatePrivateKey())

    await TestActions.setBalance(client, {
      address: eoa.address,
      value: Value.fromEther('100'),
    })
    await RelayActions.upgradeAccount(client, {
      account: eoa,
    })

    const request = await RelayActions.prepareCalls(client, {
      account: eoa,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [eoa.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    const signature = await RelayActions.signCalls(request, { account: eoa })
    expect(signature).toBeDefined()
  })

  test('error: missing signer', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, { keys: [key] })

    const request = await RelayActions.prepareCalls(client, {
      account,
      calls: [],
    })

    await expect(() =>
      // @ts-expect-error testing runtime validation
      RelayActions.signCalls(request, {}),
    ).rejects.toThrowError('no key or account provided')
  })

  test('error: key not found (account signer with mismatched request key)', async () => {
    const adminKey = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [adminKey],
    })
    const otherKey = Key.createHeadlessWebAuthnP256()

    // Create a pre-call request that references a key that is not on the account
    const request = await RelayActions.prepareCalls(client, {
      authorizeKeys: [otherKey],
      preCalls: true,
    })

    await expect(() =>
      RelayActions.signCalls(request, { account }),
    ).rejects.toThrowError('key not found')
  })
})

describe('upgradeAccount', () => {
  test('default', async () => {
    const { account } = await TestActions.getAccount(client)
    const adminKey = Key.createHeadlessWebAuthnP256()

    await RelayActions.upgradeAccount(client, {
      account,
      authorizeKeys: [adminKey],
    })

    // Verify that Relay has registered the admin key.
    const keys = await RelayActions.getKeys(client, {
      account,
      chainIds: [client.chain.id],
    })
    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(adminKey.publicKey)

    // Upgrade account onchain
    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [],
      key: adminKey,
    })
    await waitForCallsStatus(client, {
      id,
    })

    // Check that account now has keys onchain
    const key = await ContractActions.keyAt(client, {
      account,
      index: 0,
    })
    expect(key.publicKey).toEqual(adminKey.publicKey)
  })

  test('behavior: multiple keys', async () => {
    const { account } = await TestActions.getAccount(client)
    const adminKey = Key.createHeadlessWebAuthnP256()
    const sessionKey = Key.createP256({
      expiry: 99999999,
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
      role: 'session',
    })

    await RelayActions.upgradeAccount(client, {
      account,
      authorizeKeys: [adminKey, sessionKey],
    })

    // Verify that Relay has registered the admin key.
    const keys = await RelayActions.getKeys(client, {
      account,
      chainIds: [client.chain.id],
    })
    expect(keys.length).toBe(2)
    expect(keys[0]!.publicKey).toBe(adminKey.publicKey)
    expect(keys[1]!.publicKey).toBe(sessionKey.publicKey)

    // Upgrade account onchain
    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [],
      key: adminKey,
    })
    await waitForCallsStatus(client, {
      id,
    })

    // Check that account now has keys onchain
    const key = await ContractActions.keyAt(client, {
      account,
      index: 0,
    })
    expect(key.publicKey).toEqual(adminKey.publicKey)

    const key2 = await ContractActions.keyAt(client, {
      account,
      index: 1,
    })
    expect(key2.publicKey).toEqual(sessionKey.publicKey)
  })

  test('behavior: prepared upgrade', async () => {
    const { account } = await TestActions.getAccount(client)
    const adminKey = Key.createHeadlessWebAuthnP256()

    const { digests, ...request } = await RelayActions.prepareUpgradeAccount(
      client,
      {
        address: account.address,
        authorizeKeys: [adminKey],
      },
    )

    const signatures = {
      auth: await account.sign({ hash: digests.auth }),
      exec: await account.sign({ hash: digests.exec }),
    }

    await RelayActions.upgradeAccount(client, {
      ...request,
      signatures,
    })

    // Verify that Relay has registered the admin key.
    const keys = await RelayActions.getKeys(client, {
      account,
      chainIds: [client.chain.id],
    })
    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(adminKey.publicKey)

    // Upgrade account onchain
    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [],
      key: adminKey,
    })
    await waitForCallsStatus(client, {
      id,
    })

    // Check that account now has keys onchain
    const key = await ContractActions.keyAt(client, {
      account,
      index: 0,
    })
    expect(key.publicKey).toEqual(adminKey.publicKey)
  })
})

describe('getKeys', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, { keys: [key] })

    const keys = await RelayActions.getKeys(client, {
      account,
      chainIds: [client.chain.id],
    })

    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(key.publicKey)
  })

  test('behavior: address', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, { keys: [key] })

    const keys = await RelayActions.getKeys(client, {
      account: account.address,
      chainIds: [client.chain.id],
    })

    expect(keys.length).toBe(1)
    expect(keys[0]!.publicKey).toBe(key.publicKey)
  })
})

describe('sendCalls', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: eoa', async () => {
    const eoa = privateKeyToAccount(generatePrivateKey())

    await TestActions.setBalance(client, {
      address: eoa.address,
      value: Value.fromEther('100'),
    })

    await RelayActions.upgradeAccount(client, {
      account: eoa,
    })

    const { id } = await RelayActions.sendCalls(client, {
      account: eoa,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [eoa.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [eoa.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test.runIf(Anvil.enabled)('behavior: no fee token (ETH)', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: pre calls', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const newKey = Key.createP256({
      permissions: {
        calls: [{ to: contracts.exp2.address }],
        spend: [
          {
            limit: Value.fromEther('5'),
            period: 'minute',
            token: contracts.exp1.address,
          },
        ],
      },
      role: 'session',
    })

    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key: newKey,
      preCalls: [
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
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: pre calls; authorize session key, sign with session key', async () => {
    const adminKey = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [adminKey],
    })

    const sessionKey = Key.createP256({
      expiry: 9999999999,
      permissions: {
        calls: [{ to: contracts.exp2.address }],
        spend: [
          {
            limit: Value.fromEther('5'),
            period: 'minute',
            token: contracts.exp1.address,
          },
        ],
      },
      role: 'session',
    })

    const request_1 = await RelayActions.prepareCalls(client, {
      authorizeKeys: [sessionKey],
      preCalls: true,
    })
    const signature_1 = await RelayActions.signCalls(request_1, {
      key: adminKey,
    })

    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key: sessionKey,
      preCalls: [{ ...(request_1 as any), signature: signature_1 }],
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  // TODO: support interop on Anvil
  test.runIf(!Anvil.enabled)('behavior: required funds', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const balance_pre = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [account.address],
      functionName: 'balanceOf',
    })

    const alice = Hex.random(20)
    const chain_dest = TestConfig.chains[1]

    const { id } = await RelayActions.sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [alice, Value.fromEther('50')],
          functionName: 'transfer',
          to: contracts.exp1.address,
        },
      ],
      chain: chain_dest,
      // TODO: allow `requiredFunds` to be set without `feeToken`
      feeToken: contracts.exp1.address,
      requiredFunds: [
        {
          address: contracts.exp1.address,
          value: Value.fromEther('50'),
        },
      ],
    })

    expect(id).toBeDefined()

    const { status } = await waitForCallsStatus(client, {
      id,
    })
    expect(status).toBe('success')

    const client_dest = TestConfig.getRelayClient(porto, {
      chainId: chain_dest!.id,
    })

    const balance_post = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [account.address],
      functionName: 'balanceOf',
    })
    expect(balance_post).toBeLessThan(balance_pre)

    const balance_dest = await readContract(client_dest, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [alice],
      functionName: 'balanceOf',
    })
    expect(balance_dest).toBeGreaterThanOrEqual(Value.fromEther('50'))
    expect(balance_dest).toBeLessThan(Value.fromEther('50.0005'))
  })
})

describe('prepareCalls', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key,
    })

    const signature = await RelayActions.signCalls(request, {
      key,
    })

    const { id } = await RelayActions.sendPreparedCalls(client, {
      ...request,
      key: request.key!,
      signature,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: account', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    const signature = await RelayActions.signCalls(request, {
      account,
    })

    const { id } = await RelayActions.sendPreparedCalls(client, {
      ...request,
      key: request.key!,
      signature,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: pre calls', async () => {
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
            token: contracts.exp1.address,
          },
        ],
      },
      role: 'session',
    })
    const request_1 = await RelayActions.prepareCalls(client, {
      authorizeKeys: [newKey],
      preCalls: true,
    })
    const signature_1 = await RelayActions.signCalls(request_1, {
      key,
    })

    const request_2 = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key,
      preCalls: [{ ...request_1, signature: signature_1 }],
    })
    const signature_2 = await RelayActions.signCalls(request_2, {
      key,
    })

    const { id } = await RelayActions.sendPreparedCalls(client, {
      ...request_2,
      key: request_2.key!,
      signature: signature_2,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test.skip('behavior: pre calls; account has executed calls previously', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await RelayActions.sendCalls(client, {
      account,
      calls: [{ to: account.address }],
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
            token: contracts.exp1.address,
          },
        ],
      },
      role: 'session',
    })
    const request_1 = await RelayActions.prepareCalls(client, {
      authorizeKeys: [newKey],
      preCalls: true,
    })
    const signature_1 = await RelayActions.signCalls(request_1, {
      key,
    })

    const request_2 = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key,
      preCalls: [{ ...request_1, signature: signature_1 }],
    })
    const signature_2 = await RelayActions.signCalls(request_2, {
      key,
    })

    const { id } = await RelayActions.sendPreparedCalls(client, {
      ...request_2,
      key: request_2.key!,
      signature: signature_2,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })

  test('behavior: pre calls; authorize session key, sign with session key', async () => {
    const adminKey = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [adminKey],
    })

    const sessionKey = Key.createP256({
      expiry: 9999999999,
      permissions: {
        calls: [{ to: contracts.exp2.address }],
        spend: [
          {
            limit: Value.fromEther('5'),
            period: 'minute',
            token: contracts.exp1.address,
          },
        ],
      },
      role: 'session',
    })

    const request_1 = await RelayActions.prepareCalls(client, {
      authorizeKeys: [sessionKey],
      preCalls: true,
    })
    const signature_1 = await RelayActions.signCalls(request_1, {
      key: adminKey,
    })

    const request_2 = await RelayActions.prepareCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account.address, 100n],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
      key: sessionKey,
      preCalls: [{ ...request_1, signature: signature_1 }],
    })
    const signature_2 = await RelayActions.signCalls(request_2, {
      key: sessionKey,
    })

    const { id } = await RelayActions.sendPreparedCalls(client, {
      ...request_2,
      key: request_2.key!,
      signature: signature_2,
    })

    expect(id).toBeDefined()

    await waitForCallsStatus(client, {
      id,
    })

    expect(
      await readContract(client, {
        ...contracts.exp2,
        args: [account.address],
        functionName: 'balanceOf',
      }),
    ).toBe(100n)
  })
})

describe('e2e', () => {
  describe('behavior: arbitrary calls', () => {
    test('mint erc20', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      const { id } = await RelayActions.sendCalls(client, {
        account,
        calls: [
          {
            abi: contracts.exp2.abi,
            args: [account.address, 100n],
            functionName: 'mint',
            to: contracts.exp2.address,
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
          abi: contracts.exp2.abi,
          address: contracts.exp2.address,
          args: [account.address],
          functionName: 'balanceOf',
        }),
      ).toBe(100n)
    })

    test.runIf(Anvil.enabled)('mint erc20; no fee token (ETH)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Mint 100 ERC20 tokens to Account – no `feeToken` specified.
      const { id } = await RelayActions.sendCalls(client, {
        account,
        calls: [
          {
            abi: contracts.exp2.abi,
            args: [account.address, 100n],
            functionName: 'mint',
            to: contracts.exp2.address,
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
          abi: contracts.exp2.abi,
          address: contracts.exp2.address,
          args: [account.address],
          functionName: 'balanceOf',
        }),
      ).toBe(100n)
    })

    test('noop', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Perform a no-op call.
      const { id } = await RelayActions.sendCalls(client, {
        account,
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
      })

      expect(id).toBeDefined()
    })

    // TODO: fix
    test.skip('behavior: insufficient erc20 balance (asset deficits)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Try to transfer 100 ERC20 tokens to the zero address.
      await expect(() =>
        RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: ['0x0000000000000000000000000000000000000000', 100n],
              functionName: 'transfer',
              to: contracts.exp2.address,
            },
          ],
        }),
      ).rejects.toThrowError('Error: InsufficientBalance()')
    })

    // TODO: fix
    test.skip('error: contract error (insufficient eth balance)', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Try to transfer 100000000 ETH tokens to the zero address.
      await expect(() =>
        RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              to: '0x0000000000000000000000000000000000000000',
              value: Value.fromEther('100000000'),
            },
          ],
        }),
      ).rejects.toThrowError('Reason: CallError')
    })
  })

  describe('behavior: authorize keys', () => {
    test('authorize admin keys', async () => {
      // 1. Initialize Account with Admin Key.
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Define additional Admin Keys.
      const keys = [
        Key.createHeadlessWebAuthnP256(),
        Key.createSecp256k1(),
      ] as const

      // 3. Authorize additional Admin Keys.
      const { id } = await RelayActions.sendCalls(client, {
        account,
        authorizeKeys: keys,
        calls: [],
      })
      expect(id).toBeDefined()

      await waitForCallsStatus(client, {
        id,
      })

      // 4. Verify that Account now has 3 Admin Keys.
      const [key_1, key_2, key_3] = [
        await AccountContract.keyAt(client, {
          account,
          index: 0,
        }),
        await AccountContract.keyAt(client, {
          account,
          index: 1,
        }),
        await AccountContract.keyAt(client, {
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
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      // 2. Authorize a new Admin Key.
      const newKey = Key.createHeadlessWebAuthnP256()
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          authorizeKeys: [newKey],
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })
      }

      // 3. Mint 100 ERC20 tokens to Account with new Admin Key.
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: newKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 4. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }
    })

    test('batch authorize + mint', async () => {
      // 1. Initialize Account with Admin Key & Session Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
      const sessionKey = Key.createP256({
        permissions: {
          calls: [{ to: contracts.exp2.address }],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 3. Mint 100 ERC20 tokens to Account with new Session Key.
      const { id } = await RelayActions.sendCalls(client, {
        account,
        calls: [
          {
            abi: contracts.exp2.abi,
            args: [account.address, 100n],
            functionName: 'mint',
            to: contracts.exp2.address,
          },
        ],
        key: sessionKey,
      })
      expect(id).toBeDefined()

      await waitForCallsStatus(client, {
        id,
      })

      // 3. Verify that Account has 100 ERC20 tokens.
      expect(
        await readContract(client, {
          abi: contracts.exp2.abi,
          address: contracts.exp2.address,
          args: [account.address],
          functionName: 'balanceOf',
        }),
      ).toBe(100n)
    })
  })

  describe('behavior: call permissions', () => {
    test('default', async () => {
      // 1. Initialize account with Admin Key & Session Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: contracts.exp2.address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account.
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }
    })

    test('multiple calls', async () => {
      // 1. Initialize account with Admin Key & Session Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
      const sessionKey = Key.createP256({
        feeToken: {
          limit: '1',
          symbol: 'EXP',
        },
        permissions: {
          calls: [
            {
              to: contracts.exp2.address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }

      // 4. Mint another 100 ERC20 tokens to Account.
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(200n)
      }
    })

    test('multiple calls (w/ admin key, then session key)', async () => {
      // 1. Initialize account with Admin Key and Session Key (with call permission).
      const adminKey = Key.createHeadlessWebAuthnP256()
      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: contracts.exp2.address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account with Admin Key.
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: adminKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }

      // 4. Mint another 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 5. Verify that Account now has 200 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
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
      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              signature: 'mint(address,uint256)',
              to: contracts.exp2.address,
            },
            {
              signature: 'transfer(address,uint256)',
              to: contracts.exp1.address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account (and initialize scoped Session Key).
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
            {
              abi: contracts.exp1.abi,
              args: [alice, 100n],
              functionName: 'transfer',
              to: contracts.exp1.address,
            },
          ],
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }
    })

    test('error: invalid target', async () => {
      // 1. Initialize account with Admin Key & Session Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: contracts.exp1.address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key.
      await expect(() =>
        RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        }),
      ).rejects.toThrowError('Reason: Unauthorized')
    })

    test('error: invalid selector', async () => {
      // 1. Initialize account with Admin Key & Session Key.
      const adminKey = Key.createHeadlessWebAuthnP256()
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
              token: contracts.exp1.address,
            },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Try to mint ERC20 tokens to Account with Session Key.
      await expect(() =>
        RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
          preCalls: [
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
      const sessionKey = Key.createP256({
        permissions: {
          calls: [
            {
              to: contracts.exp2.address,
            },
          ],
          spend: [
            {
              limit: Value.fromEther('5'),
              period: 'day',
              token: contracts.exp1.address,
            },
            { limit: 100n, period: 'day', token: contracts.exp2.address },
          ],
        },
        role: 'session',
      })
      const account = await TestActions.createAccount(client, {
        keys: [adminKey, sessionKey],
      })

      // 2. Mint 100 ERC20 tokens to Account with Session Key.
      {
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: [account.address, 100n],
              functionName: 'mint',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        })
        expect(id).toBeDefined()

        await waitForCallsStatus(client, {
          id,
        })

        // 3. Verify that Account has 100 ERC20 tokens.
        expect(
          await readContract(client, {
            abi: contracts.exp2.abi,
            address: contracts.exp2.address,
            args: [account.address],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      }

      {
        // 4. Transfer 50 ERC20 token from Account.
        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: ['0x0000000000000000000000000000000000000000', 50n],
              functionName: 'transfer',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        })

        await waitForCallsStatus(client, {
          id,
        })
      }

      // 5. Try to transfer another 50 ERC20 tokens from Account.
      await expect(() =>
        RelayActions.sendCalls(client, {
          account,
          calls: [
            {
              abi: contracts.exp2.abi,
              args: ['0x0000000000000000000000000000000000000000', 100n],
              functionName: 'transfer',
              to: contracts.exp2.address,
            },
          ],
          key: sessionKey,
        }),
      ).rejects.toThrowError('ExceededSpendLimit')
    })
  })

  describe.runIf(Anvil.enabled)('behavior: update account', () => {
    test('default', async () => {
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        deploy: true,
        keys: [key],
      })

      {
        const { contracts } = await RelayActions.getCapabilities(client)
        const { accountImplementation } = contracts
        const { domain: current } = await getEip712Domain(client, {
          address: account.address,
        })
        const { domain: latest } = await getEip712Domain(client, {
          address: accountImplementation.address,
        })
        expect(current.version).toBe(latest.version)
      }

      const porto_newAccount = TestConfig.getPorto({
        relayRpcUrl: Relay.instances.anvil_newAccount.rpcUrl,
      })
      porto_newAccount._internal.store.setState(
        porto._internal.store.getState(),
      )

      {
        const client = TestConfig.getRelayClient(porto_newAccount)
        const {
          contracts: { accountImplementation },
        } = await RelayActions.getCapabilities(client)

        const { domain: current } = await getEip712Domain(client, {
          address: account.address,
        })
        const { domain: latest } = await getEip712Domain(client, {
          address: accountImplementation.address,
        })
        expect(current.version).not.toBe(latest.version)

        const { id } = await RelayActions.sendCalls(client, {
          account,
          calls: [],
        })
        await waitForCallsStatus(client, {
          id,
        })

        {
          const { domain: current } = await getEip712Domain(client, {
            address: account.address,
          })
          expect(current.version).toBe(latest.version)
        }
      }
    })
  })
})
