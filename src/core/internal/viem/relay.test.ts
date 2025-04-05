import { AbiFunction, Hex, P256, PublicKey, Value, WebCryptoP256 } from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { describe, expect, test } from 'vitest'

import {
  exp1Abi,
  exp1Address,
} from '../../../../test/src/_generated/contracts.js'
import * as TestActions from '../../../../test/src/actions.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Key from '../key.js'
import type * as Capabilities from '../relay/typebox/capabilities.js'
import { sendCalls } from '../relay.js'
import {
  createAccount,
  getAccounts,
  getKeys,
  prepareCalls,
  prepareCreateAccount,
  prepareUpgradeAccount,
  sendPreparedCalls,
  upgradeAccount,
} from './relay.js'

const { client } = getPorto()

const feeToken = exp1Address

describe('prepareCreateAccount + createAccount', () => {
  const getKey = (publicKey: Hex.Hex) =>
    ({
      expiry: 6942069420,
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
      publicKey,
      role: 'admin',
      type: 'webauthnp256',
    }) as const satisfies Capabilities.authorizeKeys.Request[number]

  test('default', async () => {
    const tmp = privateKeyToAccount(generatePrivateKey())

    const keyPair = await WebCryptoP256.createKeyPair()
    const publicKey = PublicKey.toHex(keyPair.publicKey, {
      includePrefix: false,
    })
    const key = getKey(publicKey)

    const request = await prepareCreateAccount(client, {
      capabilities: {
        authorizeKeys: [key],
        delegation: client.chain.contracts.delegation.address,
      },
    })

    expect(request.context).toBeDefined()
    expect(request.capabilities.authorizeKeys[0]?.expiry).toBe(key.expiry)
    expect(request.capabilities.authorizeKeys[0]?.publicKey).toBe(publicKey)
    expect(request.capabilities.authorizeKeys[0]?.role).toBe(key.role)
    expect(request.capabilities.authorizeKeys[0]?.type).toBe(key.type)
    expect(
      request.capabilities.authorizeKeys[0]?.permissions,
    ).toMatchInlineSnapshot(`
      [
        {
          "selector": "0x40c10f19",
          "to": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
          "type": "call",
        },
        {
          "selector": "0xa9059cbb",
          "to": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
          "type": "call",
        },
        {
          "limit": 100000000000000000000n,
          "period": "minute",
          "token": "0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c",
          "type": "spend",
        },
      ]
    `)

    const signature = await tmp.sign({ hash: request.digests[0]! })

    await createAccount(client, {
      ...request,
      signatures: [
        {
          publicKey: key.publicKey,
          type: key.type,
          value: signature,
        },
      ],
    })
  })

  test('behavior: multiple keys', async () => {
    const key_1 = await (async () => {
      const keyPair = await WebCryptoP256.createKeyPair()
      const publicKey = PublicKey.toHex(keyPair.publicKey, {
        includePrefix: false,
      })
      return {
        ...getKey(publicKey),
        tmp: privateKeyToAccount(generatePrivateKey()),
      } as const
    })()
    const key_2 = await (async () => {
      const privateKey = P256.randomPrivateKey()
      const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
        includePrefix: false,
      })
      return {
        ...getKey(publicKey),
        tmp: privateKeyToAccount(generatePrivateKey()),
      } as const
    })()
    const keys = [key_1, key_2] as const

    const request = await prepareCreateAccount(client, {
      capabilities: {
        authorizeKeys: keys,
        delegation: client.chain.contracts.delegation.address,
      },
    })

    expect(request.context).toBeDefined()
    expect(request.capabilities.authorizeKeys.length).toBe(keys.length)

    const signatures = await Promise.all(
      keys.map(async (key, index) => {
        const signature = await key.tmp.sign({ hash: request.digests[index]! })
        return {
          publicKey: key.publicKey,
          type: key.type,
          value: signature,
        } as const
      }),
    )

    await createAccount(client, {
      ...request,
      signatures,
    })
  })

  test('error: schema encoding', async () => {
    await expect(() =>
      prepareCreateAccount(client, {
        capabilities: {
          authorizeKeys: [
            {
              // @ts-expect-error
              ...getKey('INVALID!'),
            },
          ],
          delegation: client.chain.contracts.delegation.address,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Relay.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: capabilities.authorizeKeys.0.publicKey
      Value: "INVALID!"

      Details: The encoded value does not match the expected schema]
    `)

    await expect(() =>
      prepareCreateAccount(client, {
        capabilities: {
          authorizeKeys: [
            {
              ...getKey(
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              ),
              // @ts-expect-error
              role: 'beef',
            },
          ],
          delegation: client.chain.contracts.delegation.address,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Relay.SchemaCoderError: Expected 'admin'

      Path: capabilities.authorizeKeys.0.role
      Value: "beef"

      Details: The encoded value does not match the expected schema]
    `)
  })
})

describe('getAccounts', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const result = await getAccounts(client, {
      keyId: account.keys[0]!.id!,
    })

    expect(result.length).toBe(1)
    expect(result[0]?.address).toBe(account.address)
    expect(result[0]?.keys.length).toBe(1)
    expect(result[0]?.keys[0]?.hash).toBe(key.hash)
    expect(result[0]?.keys[0]?.publicKey).toBe(key.publicKey)
    expect(result[0]?.keys[0]?.role).toBe(key.role)
    expect(result[0]?.keys[0]?.type).toBe('webauthnp256')
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
      nonce: 0n,
    })

    const result = await getAccounts(client, {
      keyId: account.keys[0]!.id!,
    })

    expect(result.length).toBe(1)
    expect(result[0]?.address).toBe(account.address)
    expect(result[0]?.keys.length).toBe(1)
    expect(result[0]?.keys[0]?.hash).toBe(key.hash)
    expect(result[0]?.keys[0]?.publicKey).toBe(key.publicKey)
    expect(result[0]?.keys[0]?.role).toBe(key.role)
    expect(result[0]?.keys[0]?.type).toBe('webauthnp256')
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
      nonce: 0n,
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
      nonce: 0n,
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
    const account = await TestActions.createAccount(client, {
      keys: [key, key_2],
    })

    await sendCalls(client, {
      account,
      calls: [],
      feeToken,
      nonce: 0n,
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
          keyHash: key.hash,
          nonce: 0n,
        },
      },
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
      wrap: false,
    })

    await sendPreparedCalls(client, {
      context: request.context,
      signature: {
        publicKey: key.publicKey,
        type: 'webauthnp256',
        value: signature,
      },
    })
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
          keyHash: key.hash,
          nonce: 0n,
        },
      },
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
      wrap: false,
    })

    await sendPreparedCalls(client, {
      context: request.context,
      signature: {
        publicKey: key.publicKey,
        type: 'webauthnp256',
        value: signature,
      },
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
            // @ts-expect-error
            keyHash: 'cheese',
            nonce: 0n,
          },
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Relay.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: capabilities.meta.keyHash
      Value: "cheese"

      Details: The encoded value does not match the expected schema]
    `)
  })

  test('error: schema encoding', async () => {
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
          keyHash: key.hash,
          nonce: 0n,
        },
      },
    })

    const signature = await Key.sign(key, {
      payload: request.digest,
      wrap: false,
    })

    await expect(() =>
      sendPreparedCalls(client, {
        context: request.context,
        signature: {
          publicKey: key.publicKey,
          // @ts-expect-error
          type: 'falcon',
          value: signature,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Relay.SchemaCoderError: Expected 'p256'

      Path: signature.type
      Value: "falcon"

      Details: The encoded value does not match the expected schema]
    `)
  })
})

describe('prepareUpgradeAccount + upgradeAccount', () => {
  test('default', async () => {
    const p256 = (() => {
      const privateKey = P256.randomPrivateKey()
      const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
        includePrefix: false,
      })
      return {
        privateKey,
        publicKey,
      } as const
    })()

    const eoa = privateKeyToAccount(generatePrivateKey())

    await TestActions.setBalance(client, {
      address: eoa.address,
      value: Value.fromEther('10000'),
    })

    const signature = await eoa.sign({
      hash: Hex.random(32),
    })

    const request = await prepareUpgradeAccount(client, {
      address: eoa.address,
      capabilities: {
        authorizeKeys: [
          {
            expiry: 0,
            permissions: [],
            publicKey: p256.publicKey,
            role: 'admin',
            signature,
            type: 'webauthnp256',
          },
        ],
        delegation: client.chain.contracts.delegation.address,
        feeToken,
      },
    })

    const signatures = await Promise.all(
      request.digests.map((digest) =>
        eoa.sign({
          hash: digest,
        }),
      ),
    )

    await upgradeAccount(client, {
      context: request.context,
      signatures,
    })
  })
})
