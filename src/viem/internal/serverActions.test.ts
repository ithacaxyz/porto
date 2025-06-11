import { AbiFunction, Hex, Value } from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { getCode, readContract, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../../test/src/actions.js'
import * as Anvil from '../../../test/src/anvil.js'
import { exp1Abi, exp1Address } from '../../../test/src/porto.js'
import { getPorto } from '../../../test/src/porto.js'
import * as Key from '../Key.js'
import { sendCalls } from '../ServerActions.js'
import {
  getCallsStatus,
  getCapabilities,
  getKeys,
  health,
  prepareCalls,
  prepareUpgradeAccount,
  sendPreparedCalls,
  upgradeAccount,
  verifySignature,
} from './serverActions.js'

const { client, delegation } = getPorto()

const feeToken = exp1Address

describe('health', () => {
  test('default', async () => {
    const version = await health(client)
    expect(version).toBeDefined()
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

  test('behavior: chainIds', async () => {
    const result = await getCapabilities(client, {
      chainIds: [client.chain!.id],
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
      capabilities: {
        meta: {
          feeToken,
        },
      },
      key: {
        prehash: false,
        publicKey: key.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(key, {
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
      feeToken,
    })

    const result = await getKeys(client, {
      address: account.address,
    })

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
    })

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
      feeToken,
    })

    const result = await getKeys(client, {
      address: account.address,
    })

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
            to: exp1Address,
          },
        ],
        spend: [
          {
            limit: Value.fromEther('100'),
            period: 'minute',
            token: exp1Address,
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
      feeToken,
    })
    await waitForCallsStatus(client, {
      id,
    })

    const result = await getKeys(client, {
      address: account.address,
    })

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
      capabilities: {
        meta: {
          feeToken,
        },
      },
      key: {
        prehash: false,
        publicKey: key.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(key, {
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

    const sponsorKey = Key.createSecp256k1()
    const sponsorAccount = await TestActions.createAccount(client, {
      deploy: true,
      keys: [sponsorKey],
    })

    const userBalance_pre = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const sponsorBalance_pre = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [sponsorAccount.address],
      functionName: 'balanceOf',
    })

    const request = await prepareCalls(client, {
      address: userAccount.address,
      calls: [
        {
          abi: exp1Abi,
          args: [userAccount.address, Value.fromEther('1')],
          functionName: 'mint',
          to: exp1Address,
        },
      ],
      capabilities: {
        meta: {
          feePayer: sponsorAccount.address,
          feeToken,
        },
      },
      key: {
        prehash: false,
        publicKey: userKey.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(userKey, {
      payload: request.digest,
      wrap: false,
    })
    const sponsorSignature = await Key.sign(sponsorKey, {
      payload: request.digest,
    })

    const result = await sendPreparedCalls(client, {
      capabilities: {
        feeSignature: sponsorSignature,
      },
      context: request.context,
      key: request.key!,
      signature,
    })

    await waitForCallsStatus(client, {
      id: result.id,
    })

    const userBalance_post = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [userAccount.address],
      functionName: 'balanceOf',
    })
    const sponsorBalance_post = await readContract(client, {
      abi: exp1Abi,
      address: exp1Address,
      args: [sponsorAccount.address],
      functionName: 'balanceOf',
    })

    // Check if user was credited with 1 EXP.
    expect(userBalance_post).toBe(userBalance_pre + Value.fromEther('1'))

    // Check if sponsor was debited the fee payment.
    expect(sponsorBalance_post).toBeLessThan(sponsorBalance_pre)
  })

  test('behavior: contract calls', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      address: account.address,
      calls: [
        {
          abi: exp1Abi,
          args: [account.address, Value.fromEther('1')],
          functionName: 'mint',
          to: exp1Address,
        },
      ],
      capabilities: {
        meta: {
          feeToken,
        },
      },
      key: {
        prehash: false,
        publicKey: key.publicKey,
        type: 'webauthnp256',
      },
    })

    const signature = await Key.sign(key, {
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
          meta: {
            feeToken,
          },
        },
        key: {
          prehash: false,
          // @ts-expect-error
          publicKey: 'cheese',
          type: 'webauthnp256',
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Rpc.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: key.publicKey
      Value: "cheese"

      Details: The encoded value does not match the expected schema]
    `)
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
          meta: {
            feeToken,
          },
        },
        key: {
          prehash: false,
          publicKey: key.publicKey,
          // @ts-expect-error
          type: 'falcon',
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Rpc.SchemaCoderError: Expected 'p256'

      Path: key.type
      Value: "falcon"

      Details: The encoded value does not match the expected schema]
    `)
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
      delegation,
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

    // RPC Server should have registered the keys.
    const keys = await getKeys(client, {
      address: eoa.address,
    })
    expect(keys.length).toBe(1)

    // Perform a call to deploy the account.
    const req = await prepareCalls(client, {
      address: eoa.address,
      calls: [],
      capabilities: {
        meta: {
          feeToken,
        },
      },
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
      delegation,
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

    // RPC Server should have registered the keys.
    const keys = await getKeys(client, {
      address: eoa.address,
    })
    expect(keys.length).toBe(2)

    // Perform a call to deploy the account.
    const req = await prepareCalls(client, {
      address: eoa.address,
      calls: [],
      capabilities: {
        meta: {
          feeToken,
        },
      },
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
            AbiFunction.fromAbi(exp1Abi, 'mint'),
          ),
          to: exp1Address,
          type: 'call',
        },
        {
          selector: AbiFunction.getSelector(
            AbiFunction.fromAbi(exp1Abi, 'transfer'),
          ),
          to: exp1Address,
          type: 'call',
        },
        {
          limit: Value.fromEther('100'),
          period: 'minute',
          token: exp1Address,
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
      delegation,
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

    // RPC Server should have registered the keys.
    const keys = await getKeys(client, {
      address: eoa.address,
    })
    expect(keys.length).toBe(2)

    // Perform a call to deploy the account.
    const req = await prepareCalls(client, {
      address: eoa.address,
      calls: [],
      capabilities: {
        meta: {
          feeToken,
        },
      },
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
        delegation,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Rpc.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: capabilities.authorizeKeys.0.publicKey
      Value: "INVALID!"

      Details: The encoded value does not match the expected schema]
    `)

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
        delegation,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Rpc.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: capabilities.authorizeKeys.0.publicKey
      Value: "INVALID!"

      Details: The encoded value does not match the expected schema]
    `)
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
