import { AbiFunction, Hex, P256, PublicKey, TypedData, Value } from 'ox'
import { Porto } from 'porto'
import {
  getBalance,
  setBalance,
  verifyMessage,
  verifyTypedData,
} from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { createPorto } from '../../../test/src/porto.js'
import * as Key from './key.js'

describe('eth_accounts', () => {
  test('default', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
          },
        },
      ],
    })
    const accounts = await porto.provider.request({
      method: 'eth_accounts',
    })
    expect(accounts.length).toBe(1)
  })

  test('behavior: disconnected', async () => {
    const porto = createPorto()
    await expect(
      porto.provider.request({
        method: 'eth_accounts',
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Provider.DisconnectedError: The provider is disconnected from all chains.]',
    )
  })
})

describe('eth_requestAccounts', () => {
  test('default', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'wallet_disconnect',
    })
    const accounts = await porto.provider.request({
      method: 'eth_requestAccounts',
    })
    expect(accounts.length).toBeGreaterThan(0)
  })
})

describe('eth_sendTransaction', () => {
  test('default', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069420'

    const hash = await porto.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: address,
          to: alice,
          value: Hex.fromNumber(69420),
        },
      ],
    })

    expect(hash).toBeDefined()
    expect(await getBalance(client, { address: alice })).toBe(69420n)
  })
})

describe('eth_signTypedData_v4', () => {
  test('default', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto)
    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    const signature = await porto.provider.request({
      method: 'eth_signTypedData_v4',
      params: [address, TypedData.serialize(typedData)],
    })
    expect(signature).toBeDefined()

    const valid = await verifyTypedData(client, {
      ...typedData,
      address,
      signature,
    })
    expect(valid).toBe(true)
  })
})

describe('experimental_grantPermissions', () => {
  test('default', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('message', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            calls: [{ signature: 'mint()' }],
          },
        },
      ],
    })

    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(2)
    expect(
      accounts![0]!.keys?.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": true,
          "expiry": null,
          "permissions": {
            "calls": [
              {
                "signature": "mint()",
              },
            ],
          },
          "privateKey": CryptoKey {},
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].type).toBe('permissionsChanged')
    expect(messages[0].data.length).toBe(1)
  })

  test('behavior: provided key', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('message', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })

    const permissions = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          key: {
            publicKey:
              '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
            type: 'p256',
          },
          permissions: {
            calls: [{ signature: 'mint()' }],
          },
        },
      ],
    })

    expect(permissions.address).toBeDefined()
    expect({ ...permissions, address: null }).toMatchInlineSnapshot(`
      {
        "address": null,
        "chainId": undefined,
        "expiry": 9999999999,
        "id": "0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e",
        "key": {
          "publicKey": "0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e",
          "type": "p256",
        },
        "permissions": {
          "calls": [
            {
              "signature": "mint()",
            },
          ],
        },
      }
    `)

    {
      const permissions = await porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            key: {
              publicKey: '0x0000000000000000000000000000000000000000',
              type: 'contract',
            },
            permissions: {
              spend: [
                {
                  limit: Hex.fromNumber(Value.fromEther('1.5')),
                  period: 'day',
                },
              ],
            },
          },
        ],
      })

      expect(permissions.address).toBeDefined()
      expect({ ...permissions, address: null }).toMatchInlineSnapshot(`
        {
          "address": null,
          "chainId": undefined,
          "expiry": 9999999999,
          "id": "0x0000000000000000000000000000000000000000",
          "key": {
            "publicKey": "0x0000000000000000000000000000000000000000",
            "type": "secp256k1",
          },
          "permissions": {
            "spend": [
              {
                "limit": "0x14d1120d7b160000",
                "period": "day",
              },
            ],
          },
        }
      `)
    }

    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(3)
    expect(
      accounts![0]!.keys?.map((x) => ({
        ...x,
        expiry: null,
        publicKey: null,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": false,
          "expiry": null,
          "permissions": {
            "calls": [
              {
                "signature": "mint()",
              },
            ],
          },
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
        {
          "canSign": false,
          "expiry": null,
          "permissions": {
            "spend": [
              {
                "limit": 1500000000000000000n,
                "period": "day",
              },
            ],
          },
          "publicKey": null,
          "role": "session",
          "type": "secp256k1",
        },
      ]
    `)

    expect(messages[0].type).toBe('permissionsChanged')
    expect(messages[0].data.length).toBe(1)
  })

  test('behavior: signature verification permission', async () => {
    const porto = createPorto()
    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })

    // Authorize an arbirary key.
    const key = Key.createP256({ role: 'session' })
    await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          key: {
            publicKey: key.publicKey,
            type: key.type,
          },
          expiry: 9999999999,
          permissions: {
            signatureVerification: {
              addresses: ['0xb3030d74b87321d620f2d0cdf3f97cc4598b9248'],
            },
          },
        },
      ],
    })

    const payload =
      '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' as const
    const signature = await Key.sign(key, {
      payload,
    })

    const result = await porto.provider.request({
      method: 'eth_call',
      params: [
        {
          data: AbiFunction.encodeData(
            AbiFunction.from(
              'function isValidSignature(address, bytes32, bytes)',
            ),
            [address, payload, signature],
          ),
          to: '0xb3030d74b87321d620f2d0cdf3f97cc4598b9248',
        },
      ],
    })

    expect(result).toBe(
      '0x1626ba7e00000000000000000000000000000000000000000000000000000000',
    )
  })

  test('behavior: no permissions', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await expect(
      porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            key: {
              publicKey:
                '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
              type: 'p256',
            },
            permissions: {},
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [RpcResponse.InvalidParamsError: Expected object to have at least 1 properties

      Path: params.0.permissions
      Value: {}]
    `,
    )
  })

  test('behavior: unlimited expiry', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await expect(
      porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 0,
            key: {
              publicKey:
                '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
              type: 'p256',
            },
            permissions: {
              calls: [{ signature: 'mint()' }],
            },
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [RpcResponse.InvalidParamsError: Expected number to be greater or equal to 1

      Path: params.0.expiry]
    `,
    )
  })
})

describe('experimental_createAccount', () => {
  test('default', async () => {
    const porto = createPorto()
    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    expect(account).toBeDefined()
  })
})

describe('experimental_permissions', () => {
  test('default', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            calls: [{ signature: 'mint()' }],
          },
        },
      ],
    })
    await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            spend: [
              {
                limit: Hex.fromNumber(Value.fromEther('1.5')),
                period: 'day',
              },
            ],
          },
        },
      ],
    })
    const permissions = await porto.provider.request({
      method: 'experimental_permissions',
    })
    expect(permissions.length).toBe(2)
  })
})

describe('experimental_revokePermissions', () => {
  test('default', async () => {
    const porto = createPorto()

    const messages: any[] = []
    porto.provider.on('message', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    const { id } = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            calls: [{ signature: 'mint()' }],
          },
        },
      ],
    })
    let accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(2)
    expect(
      accounts![0]!.keys?.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": true,
          "expiry": null,
          "permissions": {
            "calls": [
              {
                "signature": "mint()",
              },
            ],
          },
          "privateKey": CryptoKey {},
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].type).toBe('permissionsChanged')
    expect(messages[0].data.length).toBe(1)

    await porto.provider.request({
      method: 'experimental_revokePermissions',
      params: [{ id }],
    })

    accounts = porto._internal.store.getState().accounts
    expect(accounts![0]!.keys?.length).toBe(1)
    expect(
      accounts![0]!.keys?.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
      ]
    `)

    expect(messages[1].type).toBe('permissionsChanged')
    expect(messages[1].data.length).toBe(0)
  })

  test('behavior: revoke last admin key', async () => {
    const porto = createPorto()

    const messages: any[] = []
    porto.provider.on('message', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })

    const accounts = porto._internal.store.getState().accounts
    const id = accounts![0]!.keys![0]!.publicKey

    await expect(() =>
      porto.provider.request({
        method: 'experimental_revokePermissions',
        params: [{ id }],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[RpcResponse.InternalError: cannot revoke permissions.]',
    )
  })
})

describe('personal_sign', () => {
  test('default', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto)
    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    const signature = await porto.provider.request({
      method: 'personal_sign',
      params: [Hex.fromString('hello'), address],
    })
    expect(signature).toBeDefined()

    const valid = await verifyMessage(client, {
      address,
      message: 'hello',
      signature,
    })
    expect(valid).toBe(true)
  })
})

describe('wallet_connect', () => {
  test('default', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('connect', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'wallet_disconnect',
    })
    await porto.provider.request({
      method: 'wallet_connect',
    })
    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(1)
    expect(
      accounts![0]!.keys?.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": false,
          "expiry": null,
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
  })

  test('behavior: `createAccount` capability', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('connect', (message) => messages.push(message))

    await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
          },
        },
      ],
    })
    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(1)
    expect(
      accounts![0]!.keys?.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
  })

  test('behavior: `createAccount` + `grantPermissions` capability', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('connect', (message) => messages.push(message))

    await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
            grantPermissions: {
              expiry: 9999999999,
              permissions: {
                calls: [{ signature: 'mint()' }],
              },
            },
          },
        },
      ],
    })
    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(2)
    expect(
      accounts![0]!.keys?.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": true,
          "expiry": null,
          "permissions": {
            "calls": [
              {
                "signature": "mint()",
              },
            ],
          },
          "privateKey": CryptoKey {},
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
  })

  test('behavior: `createAccount` + `grantPermissions` capability (provided key)', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('connect', (message) => messages.push(message))

    const privateKey =
      '0x1e8dd87f21bc6bbfc86e726ca9c21a285c13984461cf2e3adb265019fb78203d'
    const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
      includePrefix: false,
    })

    await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
            grantPermissions: {
              expiry: 9999999999,
              key: {
                publicKey,
                type: 'p256',
              },
              permissions: {
                calls: [{ signature: 'mint()' }],
              },
            },
          },
        },
      ],
    })
    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(1)
    expect(accounts![0]!.keys?.length).toBe(2)
    expect(
      accounts![0]!.keys?.map((x, i) => ({
        ...x,
        expiry: i === 0 ? null : x.expiry,
        publicKey: i === 0 ? null : x.publicKey,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "canSign": true,
          "expiry": null,
          "permissions": undefined,
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": false,
          "expiry": 9999999999,
          "permissions": {
            "calls": [
              {
                "signature": "mint()",
              },
            ],
          },
          "publicKey": "0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e",
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
  })

  test('behavior: `grantPermissions` capability (unlimited expiry)', async () => {
    const porto = createPorto()
    await expect(() =>
      porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
              grantPermissions: {
                expiry: 0,
                permissions: {
                  calls: [{ signature: 'mint()' }],
                },
              },
            },
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [RpcResponse.InvalidParamsError: Expected number to be greater or equal to 1

      Path: params.0.capabilities.grantPermissions.expiry]
    `,
    )
  })

  test('behavior: `grantPermissions` capability (no permissions)', async () => {
    const porto = createPorto()
    await expect(() =>
      porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
              grantPermissions: {
                expiry: 9999999,
                permissions: {},
              },
            },
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [RpcResponse.InvalidParamsError: Expected object to have at least 1 properties

      Path: params.0.capabilities.grantPermissions.permissions
      Value: {}]
    `,
    )
  })
})

describe('wallet_disconnect', () => {
  test('default', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('disconnect', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'wallet_disconnect',
    })

    const accounts = porto._internal.store.getState().accounts
    expect(accounts.length).toBe(0)
    expect(messages).toMatchInlineSnapshot(`
      [
        [Provider.DisconnectedError: The provider is disconnected from all chains.],
      ]
    `)
  })
})

describe('wallet_sendCalls', () => {
  test('default', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069421'

    const hash = await porto.provider.request({
      method: 'wallet_sendCalls',
      params: [
        {
          from: address,
          calls: [
            {
              to: alice,
              value: Hex.fromNumber(69420),
            },
          ],
          version: '1',
        },
      ],
    })

    expect(hash).toBeDefined()
    expect(await getBalance(client, { address: alice })).toBe(69420n)
  })

  test('behavior: `permissions` capability', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069422'

    const permissions = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            calls: [{ to: alice }],
          },
        },
      ],
    })
    const hash = await porto.provider.request({
      method: 'wallet_sendCalls',
      params: [
        {
          capabilities: {
            permissions,
          },
          from: address,
          calls: [
            {
              to: alice,
              value: Hex.fromNumber(69420),
            },
          ],
          version: '1',
        },
      ],
    })

    expect(hash).toBeDefined()
    expect(await getBalance(client, { address: alice })).toBe(69420n)
  })

  test('behavior: `permissions.calls` unauthorized', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069422'

    const permissions = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            calls: [{ to: '0x0000000000000000000000000000000000000000' }],
          },
        },
      ],
    })
    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            capabilities: {
              permissions,
            },
            from: address,
            calls: [
              {
                to: alice,
                value: Hex.fromNumber(69420),
              },
            ],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowError('Unauthorized')
  })

  test('behavior: `permissions.spend` exceeded', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069422'

    const permissions = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            spend: [
              {
                limit: Hex.fromNumber(69420),
                period: 'day',
              },
            ],
          },
        },
      ],
    })

    await porto.provider.request({
      method: 'wallet_sendCalls',
      params: [
        {
          capabilities: {
            permissions,
          },
          from: address,
          calls: [
            {
              to: alice,
              value: Hex.fromNumber(69420),
            },
          ],
          version: '1',
        },
      ],
    })

    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            capabilities: {
              permissions,
            },
            from: address,
            calls: [
              {
                to: alice,
                value: Hex.fromNumber(1),
              },
            ],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowError('ExceededSpendLimit')
  })

  test('behavior: revoked permission', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069423'

    const permissions = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          permissions: {
            calls: [{ to: alice }],
          },
        },
      ],
    })
    const hash = await porto.provider.request({
      method: 'wallet_sendCalls',
      params: [
        {
          capabilities: {
            permissions,
          },
          from: address,
          calls: [
            {
              to: alice,
              value: Hex.fromNumber(69420),
            },
          ],
          version: '1',
        },
      ],
    })

    expect(hash).toBeDefined()
    expect(await getBalance(client, { address: alice })).toBe(69420n)

    await porto.provider.request({
      method: 'experimental_revokePermissions',
      params: [{ id: permissions.id }],
    })
    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            capabilities: {
              permissions,
            },
            from: address,
            calls: [
              {
                to: alice,
                value: Hex.fromNumber(69420),
              },
            ],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowError()
  })

  test('behavior: not provider-managed permission', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069421'

    const { id } = await porto.provider.request({
      method: 'experimental_grantPermissions',
      params: [
        {
          expiry: 9999999999,
          key: {
            publicKey:
              '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
            type: 'p256',
          },
          permissions: {
            calls: [{ to: alice }],
          },
        },
      ],
    })
    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            capabilities: {
              permissions: {
                id,
              },
            },
            from: address,
            calls: [
              {
                to: alice,
                value: Hex.fromNumber(69420),
              },
            ],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[RpcResponse.InternalError: permission (id: 0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e) does not exist.]',
    )
  })

  test('behavior: permission does not exist', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({
      mode: 'anvil',
    }))

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069421'

    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            capabilities: {
              permissions: {
                id: '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
              },
            },
            from: address,
            calls: [
              {
                to: alice,
                value: Hex.fromNumber(69420),
              },
            ],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '[RpcResponse.InternalError: permission (id: 0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e) does not exist.]',
    )
  })

  test('behavior: no calls', async () => {
    const porto = createPorto()

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })

    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            from: address,
            calls: [],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [RpcResponse.InvalidParamsError: Expected array length to be greater or equal to 1

      Path: params.0.calls
      Value: []]
    `,
    )
  })

  test('behavior: no calls.to', async () => {
    const porto = createPorto()

    const { address } = await porto.provider.request({
      method: 'experimental_createAccount',
    })

    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            from: address,
            calls: [
              // @ts-ignore
              {
                data: '0xdeadbeef',
              },
            ],
            version: '1',
          },
        ],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      [RpcResponse.InvalidParamsError: Expected required property

      Path: params.0.calls.0.to]
    `,
    )
  })
})

test('behavior: fall through', async () => {
  const porto = createPorto()
  expect(
    await porto.provider.request({
      method: 'eth_blockNumber',
    }),
  ).toBeDefined()
})

test('behavior: unsupported wallet_ method', async () => {
  const porto = createPorto()
  await expect(() =>
    porto.provider.request({
      method: 'wallet_lol',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    '[Provider.UnsupportedMethodError: The provider does not support the requested method.]',
  )
})

const typedData = {
  domain: {
    name: 'Ether Mail 🥵',
    version: '1.1.1',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  },
  types: {
    Name: [
      { name: 'first', type: 'string' },
      { name: 'last', type: 'string' },
    ],
    Person: [
      { name: 'name', type: 'Name' },
      { name: 'wallet', type: 'address' },
      { name: 'favoriteColors', type: 'string[3]' },
      { name: 'foo', type: 'uint256' },
      { name: 'age', type: 'uint8' },
      { name: 'isCool', type: 'bool' },
    ],
    Mail: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
      { name: 'hash', type: 'bytes' },
    ],
  },
  primaryType: 'Mail',
  message: {
    timestamp: 1234567890n,
    contents: 'Hello, Bob! 🖤',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: {
      name: {
        first: 'Cow',
        last: 'Burns',
      },
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      age: 69,
      foo: 123123123123123123n,
      favoriteColors: ['red', 'green', 'blue'],
      isCool: false,
    },
    to: {
      name: { first: 'Bob', last: 'Builder' },
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      age: 70,
      foo: 123123123123123123n,
      favoriteColors: ['orange', 'yellow', 'green'],
      isCool: true,
    },
  },
} as const
