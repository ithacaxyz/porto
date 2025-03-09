import {
  AbiFunction,
  Address,
  P256,
  PublicKey,
  Secp256k1,
  Signature,
  Value,
} from 'ox'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { writeContract } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import * as Key from '../key.js'
import type { StaticDecode } from '../typebox/schema.js'
import {
  createAccount,
  prepareCalls,
  prepareUpgradeAccount,
  sendPreparedCalls,
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
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: authorizeKeys.0.publicKey
      Value: "INVALID!"

      Details: The encoded value does not match the expected schema]
    `)

    await expect(() =>
      createAccount(client, {
        capabilities: {
          authorizeKeys: [
            {
              ...defaultKey,
              permissions: [],
              publicKey: '0x0000000000000000000000000000000000000000',
            },
          ],
          delegation: client.chain.contracts.delegation.address,
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected array length to be greater or equal to 2

      Path: authorizeKeys.0.permissions
      Value: []

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
        },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected 'admin'

      Path: authorizeKeys.0.role
      Value: "beef"

      Details: The encoded value does not match the expected schema]
    `)
  })
})

describe('e2e', () => {
  test.skip('new account', async () => {
    const privateKey = P256.randomPrivateKey()
    const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
      includePrefix: false,
    })

    const {
      address,
      capabilities: { authorizeKeys },
    } = await createAccount(client, {
      capabilities: {
        authorizeKeys: [
          {
            expiry: 0,
            role: 'admin',
            type: 'p256',
            publicKey,
          },
        ],
        delegation: client.chain.contracts.delegation.address,
      },
    })

    const key = authorizeKeys[0]!

    await writeContract(client, {
      account: privateKeyToAccount(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ),
      chain: null,
      address: ExperimentERC20.address[0],
      abi: ExperimentERC20.abi,
      functionName: 'mint',
      args: [address, Value.fromEther('1000')],
    })

    const request = await prepareCalls(client, {
      account: address,
      calls: [
        {
          abi: ExperimentERC20.abi,
          functionName: 'mint',
          args: [address, Value.fromEther('100')],
          to: ExperimentERC20.address[0],
        },
      ],
      capabilities: {
        meta: {
          feeToken: ExperimentERC20.address[0],
          keyHash: key.hash,
          nonce: 0n,
        },
      },
    })

    const signature = P256.sign({
      payload: request.digest,
      privateKey,
    })

    const wrapped = Key.wrapSignature(Signature.toHex(signature), {
      keyType: 'p256',
      publicKey,
      prehash: false,
    })

    const result = await sendPreparedCalls(client, {
      context: request.context,
      signature: {
        publicKey,
        type: 'p256',
        value: wrapped,
      },
    })

    // console.log(result)
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

    const eoa = (() => {
      const privateKey = Secp256k1.randomPrivateKey()
      const publicKey = Secp256k1.getPublicKey({ privateKey })
      const address = Address.fromPublicKey(publicKey)
      return {
        address,
        privateKey,
        publicKey,
      } as const
    })()

    await writeContract(client, {
      account: privateKeyToAccount(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ),
      chain: null,
      address: ExperimentERC20.address[0],
      abi: ExperimentERC20.abi,
      functionName: 'mint',
      args: [eoa.address, Value.fromEther('1000')],
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
      },
    })

    const signature = Secp256k1.sign({
      payload: request.digest,
      privateKey: eoa.privateKey,
    })

    // const wrapped = Key.wrapSignature(Signature.toHex(signature), {
    //   keyType: 'p256',
    //   publicKey: p256.publicKey,
    //   prehash: false,
    // })

    // const result = await sendPreparedCalls(client, {
    //   context: request.context,
    //   signature: {
    //     publicKey: eoa.address,
    //     type: 'secp256k1',
    //     value: Signature.toHex(signature),
    //   },
    // })

    // console.log(result)
  })
})
