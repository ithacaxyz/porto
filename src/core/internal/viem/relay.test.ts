import {
  AbiFunction,
  type Hex,
  P256,
  PublicKey,
  Value,
  WebCryptoP256,
} from 'ox'
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
import {
  createAccount,
  getAccounts,
  prepareCalls,
  prepareCreateAccount,
  prepareUpgradeAccount,
  sendPreparedCalls,
  upgradeAccount,
} from './relay.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

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
      type: 'p256',
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

    const hash = Key.hash(key)
    const signature = await tmp.sign({ hash: request.digests[0]! })

    await createAccount(client, {
      ...request,
      signatures: [
        {
          hash,
          id: tmp.address,
          signature,
        },
      ],
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
  // TODO(relay): wait for counterfactual support
  test.skip('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const { id } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const result = await getAccounts(client, {
      id: id!,
    })

    expect(result).toMatchInlineSnapshot()
  })
})

describe('prepareCalls + sendPreparedCalls', () => {
  test('default', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      account: account.address,
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
    })

    await sendPreparedCalls(client, {
      context: request.context,
      signature: {
        publicKey: key.publicKey,
        type: 'p256',
        value: signature,
      },
    })
  })

  test('behavior: contract calls', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      account: account.address,
      calls: [
        {
          abi: exp1Abi,
          functionName: 'mint',
          args: [account.address, Value.fromEther('1')],
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
    })

    await sendPreparedCalls(client, {
      context: request.context,
      signature: {
        publicKey: key.publicKey,
        type: 'p256',
        value: signature,
      },
    })
  })

  test('error: schema encoding', async () => {
    const key = Key.createP256({
      role: 'admin',
    })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    await expect(() =>
      prepareCalls(client, {
        account: account.address,
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
    const key = Key.createP256({
      role: 'admin',
    })
    const { account } = await TestActions.createAccount(client, {
      keys: [key],
    })

    const request = await prepareCalls(client, {
      account: account.address,
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

    const request = await prepareUpgradeAccount(client, {
      address: eoa.address,
      capabilities: {
        authorizeKeys: [
          {
            expiry: 0,
            permissions: [],
            publicKey: p256.publicKey,
            role: 'admin',
            type: 'p256',
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
