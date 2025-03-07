import { AbiFunction, P256, PublicKey, Value } from 'ox'
import { describe, expect, test } from 'vitest'

import { ExperimentERC20 } from '../../../../test/src/contracts.js'
import { getPorto } from '../../../../test/src/porto.js'
import type { StaticDecode } from '../typebox/schema.js'
import { createAccount } from './actions.js'
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
      keys: [
        {
          ...defaultKey,
          publicKey: PublicKey.toHex(publicKey),
        },
      ],
    })

    expect(result.address).toBeDefined()
    expect(result.delegation).toBe(client.chain.contracts.delegation.address)
    expect(result.keys[0]?.expiry).toBe(defaultKey.expiry)
    expect(result.keys[0]?.publicKey).toBe(PublicKey.toHex(publicKey))
    expect(result.keys[0]?.role).toBe('admin')
    expect(result.keys[0]?.type).toBe('p256')
    expect(result.keys[0]?.permissions).toMatchInlineSnapshot(`
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
        keys: [
          {
            ...defaultKey,
            // @ts-expect-error
            publicKey: 'INVALID!',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected string to match '^0x(.*)$'

      Path: authorizeKeys.0.publicKey
      Value: "INVALID!"

      Details: The encoded value does not match the expected schema]
    `)

    await expect(() =>
      createAccount(client, {
        keys: [
          {
            ...defaultKey,
            permissions: [],
            publicKey: '0x0000000000000000000000000000000000000000',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected array length to be greater or equal to 2

      Path: authorizeKeys.0.permissions
      Value: []

      Details: The encoded value does not match the expected schema]
    `)

    await expect(() =>
      createAccount(client, {
        keys: [
          {
            ...defaultKey,
            // @ts-expect-error
            role: 'beef',
            publicKey: '0x0000000000000000000000000000000000000000',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Actions.SchemaCoderError: Expected 'admin'

      Path: authorizeKeys.0.role
      Value: "beef"

      Details: The encoded value does not match the expected schema]
    `)
  })
})
