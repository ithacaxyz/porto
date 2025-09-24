import { AbiFunction, Hex, Value } from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { getCode, readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../../test/src/actions.js'
import * as Anvil from '../../../test/src/anvil.js'
import * as TestConfig from '../../../test/src/config.js'
import * as Key from '../Key.js'
import { sendCalls } from '../RelayActions.js'
import {
  addFaucetFunds,
  getAssets,
  getAuthorization,
  getCallsStatus,
  getCapabilities,
  getKeys,
  health,
  prepareCalls,
  prepareUpgradeAccount,
  sendPreparedCalls,
  upgradeAccount,
  verifySignature,
} from './relayActions.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)
const contracts = await TestConfig.getContracts(porto)

describe('addFaucetFunds', () => {
  test('default', async () => {
    const alice = Hex.random(20)

    const result = await addFaucetFunds(client, {
      address: alice,
      tokenAddress: contracts.exp1.address,
      value: Value.fromEther('10'),
    })

    expect(result).toBeDefined()
    expect(result.transactionHash).toBeDefined()

    // Wait for funds to be added
    await new Promise((resolve) => setTimeout(resolve, 2_000))

    const balance = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [alice],
      functionName: 'balanceOf',
    })
    expect(balance).toBe(Value.fromEther('10'))
  })

  test('behavior: unsupported chain', async () => {
    await expect(() =>
      addFaucetFunds(client, {
        address: Hex.random(20),
        chain: { id: 999999 },
        tokenAddress: contracts.exp1.address,
        value: Value.fromEther('1'),
      }),
    ).rejects.toThrow()
  })
})

describe('health', () => {
  test('default', async () => {
    const version = await health(client)
    expect(version).toBeDefined()
  })
})

describe('getAuthorization', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const result = await getAuthorization(client, {
      address: account.address,
    })

    expect(result).toBeDefined()
    expect(result.authorization).toBeDefined()
    expect(result.data).toBeDefined()
    expect(result.to).toBeDefined()
  })

  test('behavior: undelegated', async () => {
    await expect(
      getAuthorization(client, {
        address: Hex.random(20),
      }),
    ).rejects.toThrow('does not exist in storage')
  })
})

describe('getAssets', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const result = await getAssets(client, {
      account: account.address,
    })

    expect(result).toBeDefined()
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(1)

    expect(result[client.chain.id]).toBeDefined()
    expect(Array.isArray(result[client.chain.id])).toBe(true)
  })

  test('behavior: with native balance', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await TestActions.setBalance(client, {
      address: account.address,
      value: Value.fromEther('10'),
    })

    const result = await getAssets(client, {
      account: account.address,
    })

    const chainAssets = result[client.chain.id]!

    const nativeAsset = chainAssets.find((asset) => BigInt(asset.balance) > 0n)
    expect(nativeAsset).toBeDefined()
    expect(nativeAsset!.type).toBeOneOf(['native', 'erc20'])
    expect(BigInt(nativeAsset!.balance)).toBeGreaterThan(0n)
  })

  test('behavior: with ERC20 tokens', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [account.address, Value.fromEther('1000')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
    })

    const result = await getAssets(client, {
      account: account.address,
    })

    const chainAssets = result[client.chain.id]!

    // Find ERC20 asset
    const erc20Asset = chainAssets.find(
      (asset) =>
        asset.address?.toLowerCase() === contracts.exp1.address.toLowerCase(),
    )
    expect(erc20Asset).toBeDefined()
    expect(erc20Asset!.type).toBe('erc20')
    expect(BigInt(erc20Asset!.balance)).toBeGreaterThan(0n)
    expect(erc20Asset!.metadata).toBeDefined()
    expect(erc20Asset!.metadata!.symbol).toBe('EXP')
  })

  test('behavior: with assetFilter', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const chainId = Hex.fromNumber(client.chain.id)

    await sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [account.address, Value.fromEther('1000')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
    })

    const result = await getAssets(client, {
      account: account.address,
      assetFilter: {
        [chainId]: [
          {
            address: contracts.exp1.address,
            type: 'erc20',
          },
        ],
      },
    })

    expect(result[client.chain.id]).toBeDefined()
    expect(Array.isArray(result[client.chain.id])).toBe(true)

    // Should only return erc20 asset
    const chainAssets = result[client.chain.id]!
    expect(chainAssets.every((asset) => asset.type === 'erc20')).toBe(true)
  })

  test('behavior: with assetTypeFilter', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    // Set native balance and mint tokens
    await TestActions.setBalance(client, {
      address: account.address,
      value: Value.fromEther('10'),
    })

    await sendCalls(client, {
      account,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [account.address, Value.fromEther('1000')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
    })

    const result = await getAssets(client, {
      account: account.address,
      assetTypeFilter: ['erc20'],
    })

    const chainAssets = result[client.chain.id]!

    expect(chainAssets.every((asset) => asset.type === 'erc20')).toBe(true)
    expect(chainAssets.find((asset) => asset.type === 'native')).toBeUndefined()
  })

  test('behavior: with chainFilter', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const result = await getAssets(client, {
      account: account.address,
      chainFilter: [client.chain.id],
    })

    expect(Object.keys(result)).toEqual(['0', client.chain.id.toString()])
    expect(result[client.chain.id]).toBeDefined()
  })

  test('behavior: multiple chains; one unsupported', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await expect(
      getAssets(client, {
        account: account.address,
        chainFilter: [client.chain.id, 999999],
      }),
    ).rejects.toThrow('unsupported chain 999999')
  })
})

describe('getCapabilities', () => {
  test('default', async () => {
    const result = await getCapabilities(client)
    expect(result.contracts.accountImplementation).toBeDefined()
    expect(result.contracts.accountProxy).toBeDefined()
    expect(result.contracts.orchestrator).toBeDefined()
    expect(result.contracts.simulator).toBeDefined()
    expect(result.fees.quoteConfig).toBeDefined()
    expect(result.fees.recipient).toBeDefined()
    expect(result.fees.tokens).toBeDefined()
  })

  test('behavior: chainId', async () => {
    const result = await getCapabilities(client, {
      chainId: client.chain.id,
    })

    expect(result.contracts.accountImplementation).toBeDefined()
    expect(result.contracts.accountProxy).toBeDefined()
    expect(result.contracts.orchestrator).toBeDefined()
    expect(result.contracts.simulator).toBeDefined()
    expect(result.fees.quoteConfig).toBeDefined()
    expect(result.fees.recipient).toBeDefined()
    expect(result.fees.tokens).toBeDefined()
  })

  test('behavior: chainIds', async () => {
    const result = await getCapabilities(client, {
      chainIds: [client.chain.id],
    })

    const keys = Object.keys(result)
    expect(keys.length).toBeGreaterThan(0)

    for (const key of keys) {
      const capabilities = (result as any)[key]
      expect(capabilities.contracts.accountImplementation).toBeDefined()
      expect(capabilities.contracts.accountProxy).toBeDefined()
      expect(capabilities.contracts.orchestrator).toBeDefined()
      expect(capabilities.contracts.simulator).toBeDefined()
      expect(capabilities.fees.quoteConfig).toBeDefined()
      expect(capabilities.fees.recipient).toBeDefined()
      expect(capabilities.fees.tokens).toBeDefined()
    }
  })

  test('behavior: chainIds (all)', async () => {
    const result = await getCapabilities(client, {
      chainIds: 'all',
    })

    const keys = Object.keys(result)
    expect(keys.length).toBeGreaterThan(0)

    for (const key of keys) {
      const capabilities = (result as any)[key]
      expect(capabilities.contracts.accountImplementation).toBeDefined()
      expect(capabilities.contracts.accountProxy).toBeDefined()
      expect(capabilities.contracts.orchestrator).toBeDefined()
      expect(capabilities.contracts.simulator).toBeDefined()
      expect(capabilities.fees.quoteConfig).toBeDefined()
      expect(capabilities.fees.recipient).toBeDefined()
      expect(capabilities.fees.tokens).toBeDefined()
    }
  })
})

describe('getCallsStatus', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      address: account.address,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: 0n,
        },
      ],
      key: {
        prehash: false,
        publicKey: key.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(key, {
      address: null,
      payload: request.digest,
      wrap: false,
    })

    const { id } = await sendPreparedCalls(client, {
      context: request.context,
      key: request.key!,
      signature,
    })

    const result = await getCallsStatus(client, {
      id,
    })

    expect(result.id).toBeDefined()
  })
})

describe('getKeys', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await sendCalls(client, {
      account,
      calls: [],
    })

    const result = await getKeys(client, {
      address: account.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)

    expect(result[0]?.hash).toBe(key.hash)
    expect(result[0]?.publicKey).toBe(key.publicKey)
    expect(result[0]?.role).toBe(key.role)
    expect(result[0]?.type).toBe('webauthnp256')
  })

  test('behavior: multiple keys', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const key_2 = Key.createSecp256k1()
    const account = await TestActions.createAccount(client, {
      keys: [key, key_2],
    })

    const result = await getKeys(client, {
      address: account.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)

    expect(result[0]?.hash).toBe(key.hash)
    expect(result[0]?.publicKey).toBe(key.publicKey)
    expect(result[0]?.role).toBe(key.role)
    expect(result[0]?.type).toBe('webauthnp256')
    expect(result[1]?.hash).toBe(key_2.hash)
    expect(result[1]?.publicKey).toBe(Hex.padLeft(key_2.publicKey, 32))
    expect(result[1]?.role).toBe(key_2.role)
    expect(result[1]?.type).toBe(key_2.type)
  })

  test('behavior: deployed account', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await sendCalls(client, {
      account,
      calls: [],
    })

    const result = await getKeys(client, {
      address: account.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)

    expect(result[0]?.hash).toBe(key.hash)
    expect(result[0]?.publicKey).toBe(key.publicKey)
    expect(result[0]?.role).toBe(key.role)
    expect(result[0]?.type).toBe('webauthnp256')
  })

  test('behavior: deployed account; multiple keys', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const key_2 = Key.createSecp256k1()
    const key_3 = Key.createP256({
      permissions: {
        calls: [
          {
            to: contracts.exp1.address,
          },
        ],
        spend: [
          {
            limit: Value.fromEther('100'),
            period: 'minute',
            token: contracts.exp1.address,
          },
        ],
      },
      role: 'session',
    })
    const account = await TestActions.createAccount(client, {
      keys: [key, key_2],
    })

    const { id } = await sendCalls(client, {
      account,
      authorizeKeys: [key_3],
      calls: [],
    })
    await waitForCallsStatus(client, {
      id,
    })

    const result = await getKeys(client, {
      address: account.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)

    expect(result[0]?.hash).toBe(key.hash)
    expect(result[0]?.publicKey).toBe(key.publicKey)
    expect(result[0]?.role).toBe(key.role)
    expect(result[0]?.type).toBe('webauthnp256')
    expect(result[1]?.hash).toBe(key_2.hash)
    expect(result[1]?.publicKey).toBe(Hex.padLeft(key_2.publicKey, 32))
    expect(result[1]?.role).toBe(key_2.role)
    expect(result[1]?.type).toBe(key_2.type)
    expect(result[2]?.hash).toBe(key_3.hash)
    expect(result[2]?.publicKey).toBe(key_3.publicKey)
    expect(result[2]?.role).toBe('normal')
    expect(result[2]?.type).toBe(key_3.type)
  })
})

describe('prepareCalls + sendPreparedCalls', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      address: account.address,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: 0n,
        },
      ],
      key: {
        prehash: false,
        publicKey: key.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(key, {
      address: null,
      payload: request.digest,
      wrap: false,
    })

    await sendPreparedCalls(client, {
      context: request.context,
      key: request.key!,
      signature,
    })
  })

  test('behavior: fee payer', async () => {
    const userKey = Key.createHeadlessWebAuthnP256()
    const userAccount = await TestActions.createAccount(client, {
      keys: [userKey],
    })

    const merchantKey = Key.createSecp256k1()
    const merchantAccount = await TestActions.createAccount(client, {
      deploy: true,
      keys: [merchantKey],
    })

    const userBalance_pre = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_pre = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    const request = await prepareCalls(client, {
      address: userAccount.address,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [userAccount.address, Value.fromEther('1')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
      capabilities: {
        meta: {
          feePayer: merchantAccount.address,
        },
      },
      key: {
        prehash: false,
        publicKey: userKey.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(userKey, {
      address: null,
      payload: request.digest,
      wrap: false,
    })
    const merchantSignature = await Key.sign(merchantKey, {
      address: null,
      payload: request.digest,
    })

    const result = await sendPreparedCalls(client, {
      capabilities: {
        feeSignature: merchantSignature,
      },
      context: request.context,
      key: request.key!,
      signature,
    })

    await waitForCallsStatus(client, {
      id: result.id,
    })

    const userBalance_post = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const merchantBalance_post = await readContract(client, {
      abi: contracts.exp1.abi,
      address: contracts.exp1.address,
      args: [merchantAccount.address],
      functionName: 'balanceOf',
    })

    // Check if user was credited with 1 EXP.
    expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

    // Check if merchant was debited the fee payment.
    expect(merchantBalance_post).toBeLessThan(merchantBalance_pre)
  })

  // TODO: enable interop on anvil
  test.runIf(!Anvil.enabled)(
    'behavior: required funds (prefunded on all chains)',
    async () => {
      const key = Key.createHeadlessWebAuthnP256()
      const account = await TestActions.createAccount(client, {
        keys: [key],
      })

      const chain_dest = TestConfig.chains[1]

      // fund account on destination chain
      const client_dest = TestConfig.getRelayClient(porto, {
        chainId: chain_dest!.id,
      })
      await TestActions.setBalance(client_dest, {
        address: account.address,
        value: Value.fromEther('2'),
      })

      const balance_pre_source = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [account.address],
        functionName: 'balanceOf',
      })

      const request = await prepareCalls(client, {
        address: account.address,
        calls: [
          {
            abi: contracts.exp1.abi,
            args: [account.address, Value.fromEther('5')],
            functionName: 'transfer',
            to: contracts.exp1.address,
          },
        ],
        capabilities: {
          meta: {
            // TODO: allow `requiredFunds` to be set without `feeToken`
            feeToken: contracts.exp1.address,
          },
          requiredFunds: [
            {
              address: contracts.exp1.address,
              value: Value.fromEther('5'),
            },
          ],
        },
        chain: chain_dest,
        key: {
          prehash: false,
          publicKey: key.publicKey,
          type: 'webauthnp256',
        },
      })

      const signature = await Key.sign(key, {
        address: null,
        payload: request.digest,
        wrap: false,
      })

      const { id } = await sendPreparedCalls(client, {
        context: request.context,
        key: request.key!,
        signature,
      })

      const { status } = await waitForCallsStatus(client, {
        id,
      })
      expect(status).toBe('success')

      const balance_post_source = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [account.address],
        functionName: 'balanceOf',
      })
      expect(balance_post_source).toBeLessThan(balance_pre_source)

      const contracts_dest = await TestConfig.getContracts(porto, {
        chainId: chain_dest!.id,
      })
      const balance_post_destination = await readContract(client_dest, {
        abi: contracts_dest.exp1.abi,
        address: contracts_dest.exp1.address,
        args: [account.address],
        functionName: 'balanceOf',
      })
      expect(balance_post_destination).toBeGreaterThan(Value.fromEther('5'))
      expect(balance_post_destination).toBeLessThan(Value.fromEther('5.0005'))
    },
  )

  // TODO: enable interop on anvil
  test.runIf(!Anvil.enabled)(
    'behavior: required funds (not prefunded on destination chain)',
    async () => {
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

      const request = await prepareCalls(client, {
        address: account.address,
        calls: [
          {
            abi: contracts.exp1.abi,
            args: [alice, Value.fromEther('50')],
            functionName: 'transfer',
            to: contracts.exp1.address,
          },
        ],
        capabilities: {
          meta: {
            // TODO: allow `requiredFunds` to be set without `feeToken`
            feeToken: contracts.exp1.address,
          },
          requiredFunds: [
            {
              address: contracts.exp1.address,
              value: Value.fromEther('50'),
            },
          ],
        },
        chain: chain_dest,
        key: {
          prehash: false,
          publicKey: key.publicKey,
          type: 'webauthnp256',
        },
      })

      const signature = await Key.sign(key, {
        address: null,
        payload: request.digest,
        wrap: false,
      })

      const { id } = await sendPreparedCalls(client, {
        context: request.context,
        key: request.key!,
        signature,
      })

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
    },
  )

  test('behavior: contract calls', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      address: account.address,
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [account.address, Value.fromEther('1')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
      key: {
        prehash: false,
        publicKey: key.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(key, {
      address: null,
      payload: request.digest,
      wrap: false,
    })

    await sendPreparedCalls(client, {
      context: request.context,
      key: request.key!,
      signature,
    })
  })

  test('error: schema encoding', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await expect(() =>
      prepareCalls(client, {
        address: account.address,
        calls: [],
        capabilities: {
          meta: {},
        },
        key: {
          prehash: false,
          // @ts-expect-error
          publicKey: 'cheese',
          type: 'webauthnp256',
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`key.publicKey\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: schema encoding', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    await expect(() =>
      prepareCalls(client, {
        address: account.address,
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
            value: 0n,
          },
        ],
        capabilities: {
          meta: {},
        },
        key: {
          prehash: false,
          publicKey:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          // @ts-expect-error
          type: 'falcon',
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`key.type\`: Invalid union value.
        - Expected "p256"
        - Expected "secp256k1"
        - Expected "webauthnp256"]
    `,
    )
  })
})

describe('prepareUpgradeAccount + upgradeAccount', () => {
  test('default', async () => {
    const eoa = privateKeyToAccount(generatePrivateKey())
    const adminKey = {
      expiry: 0,
      permissions: [],
      prehash: false,
      publicKey: Hex.padLeft(eoa.address, 32),
      role: 'admin',
      type: 'secp256k1',
    } as const

    await TestActions.setBalance(client, {
      address: eoa.address,
    })

    const request = await prepareUpgradeAccount(client, {
      address: eoa.address,
      authorizeKeys: [adminKey],
      delegation: contracts.accountProxy.address,
    })

    const { digests } = request
    const signatures = {
      auth: await eoa.sign({ hash: digests.auth }),
      exec: await eoa.sign({ hash: digests.exec }),
    }

    await upgradeAccount(client, {
      ...request,
      signatures,
    })

    {
      // Account won't be upgraded onchain just yet.
      const code = await getCode(client, {
        address: eoa.address,
      })
      expect(code).toBeUndefined()
    }

    // Relay should have registered the keys.
    const keys = await getKeys(client, {
      address: eoa.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)
    expect(keys.length).toBe(1)

    // Perform a call to deploy the account.
    const req = await prepareCalls(client, {
      address: eoa.address,
      calls: [],
      key: adminKey,
    })
    const signature = await eoa.sign({ hash: req.digest })
    const { id } = await sendPreparedCalls(client, {
      ...req,
      key: req.key!,
      signature,
    })

    await waitForCallsStatus(client, {
      id,
    })

    {
      // Account will be upgraded now.
      const code = await getCode(client, {
        address: eoa.address,
      })
      expect(code).toBeDefined()
    }
  })

  test('behavior: with multiple keys', async () => {
    const eoa = privateKeyToAccount(generatePrivateKey())
    const adminKey = {
      expiry: 0,
      permissions: [],
      prehash: false,
      publicKey: Hex.padLeft(eoa.address, 32),
      role: 'admin',
      type: 'secp256k1',
    } as const
    const adminKey_2 = {
      expiry: 0,
      permissions: [],
      prehash: false,
      publicKey: Hex.random(32),
      role: 'admin',
      type: 'webauthnp256',
    } as const

    await TestActions.setBalance(client, {
      address: eoa.address,
    })

    const request = await prepareUpgradeAccount(client, {
      address: eoa.address,
      authorizeKeys: [adminKey, adminKey_2],
      delegation: contracts.accountProxy.address,
    })

    const { digests } = request
    const signatures = {
      auth: await eoa.sign({ hash: digests.auth }),
      exec: await eoa.sign({ hash: digests.exec }),
    }

    await upgradeAccount(client, {
      ...request,
      signatures,
    })

    {
      // Account won't be upgraded onchain just yet.
      const code = await getCode(client, {
        address: eoa.address,
      })
      expect(code).toBeUndefined()
    }

    // Relay should have registered the keys.
    const keys = await getKeys(client, {
      address: eoa.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)
    expect(keys.length).toBe(2)

    // Perform a call to deploy the account.
    const req = await prepareCalls(client, {
      address: eoa.address,
      calls: [],
      key: adminKey,
    })
    const signature = await eoa.sign({ hash: req.digest })
    const { id } = await sendPreparedCalls(client, {
      ...req,
      key: req.key!,
      signature,
    })

    await waitForCallsStatus(client, {
      id,
    })

    {
      // Account will be upgraded onchain now.
      const code = await getCode(client, {
        address: eoa.address,
      })
      expect(code).toBeDefined()
    }
  })

  test('behavior: with session key', async () => {
    const eoa = privateKeyToAccount(generatePrivateKey())
    const adminKey = {
      expiry: 0,
      permissions: [],
      prehash: false,
      publicKey: Hex.padLeft(eoa.address, 32),
      role: 'admin',
      type: 'secp256k1',
    } as const
    const sessionKey = {
      expiry: 999999999,
      permissions: [
        {
          selector: AbiFunction.getSelector(
            AbiFunction.fromAbi(contracts.exp1.abi, 'mint'),
          ),
          to: contracts.exp1.address,
          type: 'call',
        },
        {
          selector: AbiFunction.getSelector(
            AbiFunction.fromAbi(contracts.exp1.abi, 'transfer'),
          ),
          to: contracts.exp1.address,
          type: 'call',
        },
        {
          limit: Value.fromEther('100'),
          period: 'minute',
          token: contracts.exp1.address,
          type: 'spend',
        },
      ],
      prehash: false,
      publicKey: Hex.random(32),
      role: 'normal',
      type: 'webauthnp256',
    } as const

    await TestActions.setBalance(client, {
      address: eoa.address,
    })

    const request = await prepareUpgradeAccount(client, {
      address: eoa.address,
      authorizeKeys: [adminKey, sessionKey],
      delegation: contracts.accountProxy.address,
    })

    const { digests } = request
    const signatures = {
      auth: await eoa.sign({ hash: digests.auth }),
      exec: await eoa.sign({ hash: digests.exec }),
    }

    await upgradeAccount(client, {
      ...request,
      signatures,
    })

    {
      // Account won't be upgraded onchain just yet.
      const code = await getCode(client, {
        address: eoa.address,
      })
      expect(code).toBeUndefined()
    }

    // Relay should have registered the keys.
    const keys = await getKeys(client, {
      address: eoa.address,
    }).then((result) => result[Hex.fromNumber(client.chain.id)]!)
    expect(keys.length).toBe(2)

    // Perform a call to deploy the account.
    const req = await prepareCalls(client, {
      address: eoa.address,
      calls: [],
      key: adminKey,
    })
    const signature = await eoa.sign({ hash: req.digest })
    const { id } = await sendPreparedCalls(client, {
      ...req,
      key: req.key!,
      signature,
    })

    await waitForCallsStatus(client, {
      id,
    })

    {
      // Account will be upgraded onchain now.
      const code = await getCode(client, {
        address: eoa.address,
      })
      expect(code).toBeDefined()
    }
  })

  test('error: schema encoding', async () => {
    await expect(() =>
      prepareUpgradeAccount(client, {
        address: '0x0000000000000000000000000000000000000000',
        authorizeKeys: [
          {
            expiry: 0,
            permissions: [],
            prehash: false,
            // @ts-expect-error
            publicKey: 'INVALID!',
            role: 'admin',
            type: 'secp256k1',
          },
        ],
        delegation: contracts.accountProxy.address,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`capabilities.authorizeKeys[0].publicKey\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )

    await expect(() =>
      prepareUpgradeAccount(client, {
        address: '0x0000000000000000000000000000000000000000',
        authorizeKeys: [
          {
            expiry: 0,
            permissions: [],
            prehash: false,
            // @ts-expect-error
            publicKey: 'INVALID!',
            role: 'admin',
            type: 'secp256k1',
          },
        ],
        delegation: contracts.accountProxy.address,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`capabilities.authorizeKeys[0].publicKey\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })
})

describe.runIf(!Anvil.enabled)('verifySignature', () => {
  test('default', async () => {
    const key1 = Key.createHeadlessWebAuthnP256()
    const key2 = Key.createSecp256k1()
    const account = await TestActions.createAccount(client, {
      keys: [key1, key2],
    })

    const digest = Hex.random(32)

    {
      const signature = await Key.sign(key1, {
        address: account.address,
        payload: digest,
        wrap: false,
      })

      const result = await verifySignature(client, {
        address: account.address,
        digest,
        signature,
      })

      expect(result.valid).toBe(true)
    }

    {
      const signature = await Key.sign(key2, {
        address: account.address,
        payload: digest,
        wrap: false,
      })

      const result = await verifySignature(client, {
        address: account.address,
        digest,
        signature,
      })

      expect(result.valid).toBe(true)
    }
  })

  test('behavior: invalid', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const digest = Hex.random(32)
    const signature = await Key.sign(key, {
      address: account.address,
      payload: digest,
      wrap: false,
    })

    const result = await verifySignature(client, {
      address: account.address,
      digest:
        '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      signature,
    })

    expect(result.valid).toBe(false)
  })
})

// TODO: Figure out way to get `token` from server (e.g. email link from inbox)
describe.todo('setEmail + verifyEmail')
