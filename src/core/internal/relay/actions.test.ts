import { AbiFunction, P256, PublicKey, Signature, Value } from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { signAuthorization } from 'viem/experimental'
import { describe, expect, test } from 'vitest'

import * as TestActions from '../../../../test/src/actions.js'
import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Key from '../key.js'
import type { StaticDecode } from '../typebox/schema.js'
import {
  createAccount,
  prepareCalls,
  prepareUpgradeAccount,
  sendPreparedCalls,
  upgradeAccount,
} from './actions.js'
import type * as Capabilities from './typebox/capabilities.js'

const { client } = getPorto({
  transports: {
    relay: true,
  },
})

const defaultKey = {
  expiry: 6942069420,
  permissions: [
    {
      selector: AbiFunction.getSelector(
        AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
      ),
      to: ExperimentERC20.address[0],
      type: 'call',
    },
    {
      selector: AbiFunction.getSelector(
        AbiFunction.fromAbi(ExperimentERC20.abi, 'transfer'),
      ),
      to: ExperimentERC20.address[0],
      type: 'call',
    },
    {
      limit: Value.fromEther('100'),
      period: 'minute',
      token: ExperimentERC20.address[0],
      type: 'spend',
    },
  ],
  publicKey: '0x0000000000000000000000000000000000000000',
  role: 'admin',
  type: 'p256',
} as const satisfies StaticDecode<
  typeof Capabilities.authorizeKeys.Request
>[number]

const feeToken = ExperimentERC20.address[0]

describe('createAccount', () => {
  test('default', async () => {
    const privateKey = P256.randomPrivateKey()
    const publicKey = P256.getPublicKey({ privateKey })

    const result = await createAccount(client, {
      capabilities: {
        authorizeKeys: [
          {
            ...defaultKey,
            publicKey: PublicKey.toHex(publicKey),
          },
        ],
        delegation: client.chain.contracts.delegation.address,
      },
    })

    expect(result.address).toBeDefined()
    expect(result.capabilities.authorizeKeys[0]?.expiry).toBe(defaultKey.expiry)
    expect(result.capabilities.authorizeKeys[0]?.publicKey).toBe(
      PublicKey.toHex(publicKey),
    )
    expect(result.capabilities.authorizeKeys[0]?.role).toBe('admin')
    expect(result.capabilities.authorizeKeys[0]?.type).toBe('p256')
    expect(
      result.capabilities.authorizeKeys[0]?.permissions,
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
  })

  test('error: schema encoding', async () => {
    await expect(() =>
      createAccount(client, {
        capabilities: {
          authorizeKeys: [
            {
              ...defaultKey,
              // @ts-expect-error
              publicKey: 'INVALID!',
            },
          ],
          delegation: client.chain.contracts.delegation.address,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: capabilities.authorizeKeys.0.publicKey
      Value: "INVALID!"

      Details: The encoded value does not match the expected schema]
    `)

    await expect(() =>
      createAccount(client, {
        capabilities: {
          authorizeKeys: [
            {
              ...defaultKey,
              // @ts-expect-error
              role: 'beef',
              publicKey: '0x0000000000000000000000000000000000000000',
            },
          ],
          delegation: client.chain.contracts.delegation.address,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected 'admin'

      Path: capabilities.authorizeKeys.0.role
      Value: "beef"

      Details: The encoded value does not match the expected schema]
    `)
  })
})

describe('prepareCalls', () => {
  test('default', async () => {
    const privateKey = P256.randomPrivateKey()
    const publicKey = P256.getPublicKey({ privateKey })

    const { address, capabilities } = await createAccount(client, {
      capabilities: {
        authorizeKeys: [
          {
            expiry: 0,
            permissions: [],
            role: 'admin',
            type: 'p256',
            publicKey: PublicKey.toHex(publicKey),
          },
        ],
        delegation: client.chain.contracts.delegation.address,
      },
    })

    await TestActions.setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const keyHash = capabilities.authorizeKeys[0]!.hash

    const result = await prepareCalls(client, {
      account: address,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: 0n,
        },
      ],
      capabilities: {
        meta: {
          feeToken,
          keyHash,
          nonce: 0n,
        },
      },
    })

    expect(result.digest).toBeDefined()
  })
})

describe('e2e', () => {
  test('new account', async () => {
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

    const {
      address,
      capabilities: { authorizeKeys },
    } = await createAccount(client, {
      capabilities: {
        authorizeKeys: [
          {
            expiry: 0,
            permissions: [],
            role: 'admin',
            type: 'p256',
            publicKey: p256.publicKey,
          },
        ],
        delegation: client.chain.contracts.delegation.address,
      },
    })

    const key = authorizeKeys[0]!

    await TestActions.setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const request = await prepareCalls(client, {
      account: address,
      calls: [],
      capabilities: {
        meta: {
          feeToken,
          keyHash: key.hash,
          nonce: 0n,
        },
      },
    })

    const signature = P256.sign({
      payload: request.digest,
      privateKey: p256.privateKey,
    })

    // TODO: remove this once the signature gets wrapped on relay.
    const wrapped = Key.wrapSignature(Signature.toHex(signature), {
      keyType: 'p256',
      publicKey: p256.publicKey,
      prehash: false,
    })

    await sendPreparedCalls(client, {
      context: request.context,
      signature: {
        publicKey: p256.publicKey,
        type: 'p256',
        value: wrapped,
      },
    })
  })

  test('upgraded account', async () => {
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

    const signature = await eoa.sign({
      hash: request.digest,
    })

    const authorization = await signAuthorization(client, {
      account: eoa,
      chainId: 0,
      contractAddress: request.context.authorizationAddress!,
      sponsor: true,
    })

    await upgradeAccount(client, {
      authorization: {
        address: authorization.contractAddress,
        chainId: authorization.chainId,
        nonce: authorization.nonce,
        r: authorization.r,
        s: authorization.s,
        yParity: authorization.yParity,
      },
      context: request.context,
      signature,
    })
  })
})
