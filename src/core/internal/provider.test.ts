import {
  Address,
  Hex,
  P256,
  PublicKey,
  Secp256k1,
  Signature,
  TypedData,
  Value,
  WebCryptoP256,
} from 'ox'
import { Mode } from 'porto'
import { encodeFunctionData } from 'viem'
import {
  readContract,
  verifyMessage,
  verifyTypedData,
  waitForTransactionReceipt,
} from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { setBalance } from '../../../test/src/actions.js'
import {
  exp1Abi,
  exp1Address,
  getPorto as getPorto_,
} from '../../../test/src/porto.js'
import * as Porto_internal from './porto.js'

describe.each([
  ['contract', process.env.VITE_ANVIL !== 'false' ? Mode.contract : undefined],
  ['relay', Mode.relay],
] as const)('%s', (type, mode) => {
  if (!mode) return

  const getPorto = () =>
    getPorto_({
      mode,
      transports: {
        relay: type === 'contract' ? false : undefined,
      },
    })

  describe('eth_accounts', () => {
    test('default', async () => {
      const { porto } = getPorto()
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
      const { porto } = getPorto()
      await expect(
        porto.provider.request({
          method: 'eth_accounts',
        }),
      ).rejects.matchSnapshot()
    })
  })

  describe('eth_requestAccounts', () => {
    test('default', async () => {
      const { porto } = getPorto()
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
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const hash = await porto.provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            data: encodeFunctionData({
              abi: exp1Abi,
              args: [alice, 69420n],
              functionName: 'transfer',
            }),
            from: address,
            to: exp1Address,
          },
        ],
      })

      expect(hash).toBeDefined()

      await waitForTransactionReceipt(client, {
        hash,
      })

      expect(
        await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(69420n)
    })
  })

  describe('eth_signTypedData_v4', () => {
    // TODO(relay): counterfactual signature verification
    test.skipIf(type === 'relay')('default', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto)
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

  describe('experimental_grantAdmin', () => {
    test('default', async () => {
      const messages: any[] = []

      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      porto.provider.on('message', (message) => messages.push(message))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const response = await porto.provider.request({
        method: 'experimental_grantAdmin',
        params: [
          {
            key: {
              publicKey: '0x0000000000000000000000000000000000069420',
              type: 'address',
            },
          },
        ],
      })

      expect(response.key).matchSnapshot()

      const accounts = porto._internal.store.getState().accounts
      expect(accounts.length).toBe(1)
      expect(accounts[0]!.keys?.length).toBe(2)

      expect(messages[0].type).toBe('adminsChanged')
      expect(messages[0].data.length).toBe(2)
    })
  })

  describe('experimental_getAdmins', () => {
    test('default', async () => {
      const { porto } = getPorto()
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

      const { address, keys } = await porto.provider.request({
        method: 'experimental_getAdmins',
      })
      expect(address).toBeDefined()
      expect(keys.length).toBe(1)
    })

    test('behavior: disconnected', async () => {
      const { porto } = getPorto()
      await expect(
        porto.provider.request({
          method: 'experimental_getAdmins',
        }),
      ).rejects.matchSnapshot()
    })
  })

  describe('experimental_grantPermissions', () => {
    test('default', async () => {
      const messages: any[] = []

      const { porto } = getPorto()
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
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('permissionsChanged')
      expect(messages[0].data.length).toBe(1)
    })

    test('behavior: provided key', async () => {
      const messages: any[] = []

      const { porto } = getPorto()
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
      expect({ ...permissions, address: null }).matchSnapshot()

      {
        const permissions = await porto.provider.request({
          method: 'experimental_grantPermissions',
          params: [
            {
              expiry: 9999999999,
              key: {
                publicKey: '0x0000000000000000000000000000000000000000',
                type: 'address',
              },
              permissions: {
                calls: [{ signature: 'mint()' }],
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
        expect({ ...permissions, address: null }).matchSnapshot()
      }

      const accounts = porto._internal.store.getState().accounts
      expect(accounts.length).toBe(1)
      expect(accounts![0]!.keys?.length).toBe(3)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('permissionsChanged')
      expect(messages[0].data.length).toBe(1)
    })

    test('behavior: no permissions', async () => {
      const { porto } = getPorto()
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
              permissions: {
                calls: [],
              },
            },
          ],
        }),
      ).rejects.matchSnapshot()
    })

    test('behavior: unlimited expiry', async () => {
      const { porto } = getPorto()
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
      ).rejects.matchSnapshot()
    })
  })

  describe('experimental_createAccount', () => {
    test('default', async () => {
      const { porto } = getPorto()
      const account = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      expect(account).toBeDefined()
    })
  })

  describe('experimental_getPermissions', () => {
    test('default', async () => {
      const { porto } = getPorto()
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
              calls: [{ signature: 'mint()' }],
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
        method: 'experimental_getPermissions',
      })
      expect(permissions.length).toBe(2)
    })
  })

  describe('experimental_revokeAdmin', () => {
    test('default', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const messages: any[] = []
      porto.provider.on('message', (message) => messages.push(message))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const { key } = await porto.provider.request({
        method: 'experimental_grantAdmin',
        params: [
          {
            key: {
              publicKey: '0x0000000000000000000000000000000000069420',
              type: 'address',
            },
          },
        ],
      })
      let accounts = porto._internal.store.getState().accounts
      expect(accounts.length).toBe(1)
      expect(accounts![0]!.keys?.length).toBe(2)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('adminsChanged')
      expect(messages[0].data.length).toBe(2)

      await porto.provider.request({
        method: 'experimental_revokeAdmin',
        params: [{ id: key.publicKey }],
      })

      accounts = porto._internal.store.getState().accounts
      expect(accounts![0]!.keys?.length).toBe(1)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[1].type).toBe('adminsChanged')
      expect(messages[1].data.length).toBe(1)
    })
  })

  describe('experimental_revokePermissions', () => {
    test('default', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const messages: any[] = []
      porto.provider.on('message', (message) => messages.push(message))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
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
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('permissionsChanged')
      expect(messages[0].data.length).toBe(1)

      await porto.provider.request({
        method: 'experimental_revokePermissions',
        params: [{ id }],
      })

      accounts = porto._internal.store.getState().accounts
      expect(accounts![0]!.keys?.length).toBe(1)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[1].type).toBe('permissionsChanged')
      expect(messages[1].data.length).toBe(0)
    })

    test('behavior: revoke last admin key', async () => {
      const { porto } = getPorto()

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
      ).rejects.matchSnapshot()
    })
  })

  describe('personal_sign', () => {
    // TODO(relay): counterfactual signature verification
    test.skipIf(type === 'relay')('default', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto)
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

      const { client, porto } = getPorto()
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
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          privateKey: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].chainId).toBe(Hex.fromNumber(client.chain.id))
    })

    test('behavior: `createAccount` capability', async () => {
      const messages: any[] = []

      const { client, porto } = getPorto()
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
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot(`
        [
          {
            "expiry": null,
            "hash": null,
            "permissions": undefined,
            "privateKey": [Function],
            "publicKey": null,
            "role": "admin",
            "type": "p256",
          },
        ]
      `)

      expect(messages[0].chainId).toBe(Hex.fromNumber(client.chain.id))
    })

    test('behavior: `createAccount` + `grantPermissions` capability', async () => {
      const messages: any[] = []

      const { client, porto } = getPorto()
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
        accounts![0]!.keys?.map((x) => ({
          ...x,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].chainId).toBe(Hex.fromNumber(client.chain.id))
    })

    test('behavior: `createAccount` + `grantPermissions` capability (provided key)', async () => {
      const messages: any[] = []

      const { client, porto } = getPorto()
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
          hash: i === 0 ? null : x.hash,
          id: i === 0 ? null : x.id,
          publicKey: i === 0 ? null : x.publicKey,
        })),
      ).matchSnapshot()

      expect(messages[0].chainId).toBe(Hex.fromNumber(client.chain.id))
    })

    test('behavior: `grantPermissions` capability (unlimited expiry)', async () => {
      const { porto } = getPorto()
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
      ).rejects.matchSnapshot()
    })

    test('behavior: `grantPermissions` capability (no permissions)', async () => {
      const { porto } = getPorto()
      await expect(() =>
        porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
                grantPermissions: {
                  expiry: 9999999,
                  permissions: {
                    calls: [],
                  },
                },
              },
            },
          ],
        }),
      ).rejects.matchSnapshot()
    })
  })

  describe('wallet_disconnect', () => {
    test('default', async () => {
      const messages: any[] = []

      const { porto } = getPorto()
      porto.provider.on('disconnect', (message) => messages.push(message))

      await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await porto.provider.request({
        method: 'wallet_disconnect',
      })

      const accounts = porto._internal.store.getState().accounts
      expect(accounts.length).toBe(0)
      expect(messages).matchSnapshot()
    })
  })

  describe('wallet_sendCalls', () => {
    test('default', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: exp1Abi,
                  args: [alice, 69420n],
                  functionName: 'transfer',
                }),
                to: exp1Address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForTransactionReceipt(client, {
        hash: id,
      })

      expect(
        await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(69420n)
    })

    test('behavior: use inferred permissions', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      await porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            permissions: {
              calls: [{ to: exp1Address }],
              spend: [
                {
                  limit: Hex.fromNumber(69420),
                  period: 'day',
                  token: exp1Address,
                },
              ],
            },
          },
        ],
      })

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: exp1Abi,
                  args: [alice, 40_000n],
                  functionName: 'transfer',
                }),
                to: exp1Address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForTransactionReceipt(client, {
        hash: id,
      })

      expect(
        await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(40_000n)
    })

    test('behavior: `permissions` capability', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const permissions = await porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            permissions: {
              calls: [{ to: exp1Address }],
              spend: [
                {
                  limit: Hex.fromNumber(69420),
                  period: 'day',
                  token: exp1Address,
                },
              ],
            },
          },
        ],
      })
      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: exp1Abi,
                  args: [alice, 40_000n],
                  functionName: 'transfer',
                }),
                to: exp1Address,
              },
            ],
            capabilities: {
              permissions,
            },
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForTransactionReceipt(client, {
        hash: id,
      })

      expect(
        await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(40_000n)
    })

    test('behavior: `permissions.calls` unauthorized', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
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
              spend: [
                {
                  limit: Hex.fromNumber(69420),
                  period: 'day',
                  token: exp1Address,
                },
              ],
            },
          },
        ],
      })
      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 69420n],
                    functionName: 'mint',
                  }),
                  to: exp1Address,
                },
              ],
              capabilities: {
                permissions,
              },
              from: address,
              version: '1',
            },
          ],
        }),
      ).rejects.toThrowError('Unauthorized')
    })

    test('behavior: `permissions.spend` exceeded', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const permissions = await porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            permissions: {
              calls: [{ to: exp1Address }],
              spend: [
                {
                  limit: Hex.fromNumber(69420),
                  period: 'day',
                  token: exp1Address,
                },
              ],
            },
          },
        ],
      })

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: exp1Abi,
                  args: [alice, 50_000n],
                  functionName: 'transfer',
                }),
                to: exp1Address,
              },
            ],
            capabilities: {
              permissions,
            },
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForTransactionReceipt(client, {
        hash: id,
      })

      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 50_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              capabilities: {
                permissions,
              },
              from: address,
              version: '1',
            },
          ],
        }),
      ).rejects.toThrowError('ExceededSpendLimit')
    })

    test('behavior: revoked permission', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const permissions = await porto.provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            permissions: {
              calls: [{ to: exp1Address }],
              spend: [
                {
                  limit: Hex.fromNumber(69420 * 3),
                  period: 'day',
                  token: exp1Address,
                },
              ],
            },
          },
        ],
      })
      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: exp1Abi,
                  args: [alice, 69420n],
                  functionName: 'transfer',
                }),
                to: exp1Address,
              },
            ],
            capabilities: {
              permissions,
            },
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForTransactionReceipt(client, {
        hash: id,
      })

      expect(
        await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(69420n)

      await porto.provider.request({
        method: 'experimental_revokePermissions',
        params: [{ id: permissions.id }],
      })
      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 69420n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              capabilities: {
                permissions,
              },
              from: address,
              version: '1',
            },
          ],
        }),
      ).rejects.toThrowError()
    })

    test('behavior: not provider-managed permission', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

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
              calls: [{ to: exp1Address }],
            },
          },
        ],
      })
      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 69420n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              capabilities: {
                permissions: {
                  id,
                },
              },
              from: address,
              version: '1',
            },
          ],
        }),
      ).rejects.matchSnapshot()
    })

    test('behavior: permission does not exist', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 69420n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              capabilities: {
                permissions: {
                  id: '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
                },
              },
              from: address,
              version: '1',
            },
          ],
        }),
      ).rejects.matchSnapshot()
    })

    test('behavior: no calls.to', async () => {
      const { porto } = getPorto()

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })

      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                // @ts-ignore
                {
                  data: '0xdeadbeef',
                },
              ],
              from: address,
              version: '1',
            },
          ],
        }),
      ).rejects.matchSnapshot()
    })
  })

  describe('wallet_prepareCalls → wallet_sendPreparedCalls', () => {
    describe('behavior: permissions', () => {
      test('default', async () => {
        const { porto } = getPorto()
        const client = Porto_internal.getClient(porto).extend(() => ({
          mode: 'anvil',
        }))

        const alice = Hex.random(20)

        const privateKey = P256.randomPrivateKey()
        const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
          includePrefix: false,
        })

        const { accounts } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
                grantPermissions: {
                  expiry: 9999999999,
                  key: {
                    publicKey: publicKey,
                    type: 'p256',
                  },
                  permissions: {
                    calls: [{ to: exp1Address }],
                    spend: [
                      {
                        limit: Hex.fromNumber(42069n),
                        period: 'day',
                        token: exp1Address,
                      },
                    ],
                  },
                },
              },
            },
          ],
        })

        await setBalance(client, {
          address: accounts[0]?.address!,
          value: Value.fromEther('10000'),
        })

        const key = {
          publicKey,
          type: 'p256',
        } as const

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              key,
            },
          ],
        })

        const signature = P256.sign({ payload: digest, privateKey })

        const result = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              key,
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForTransactionReceipt(client, {
          hash: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: exp1Abi,
            address: exp1Address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })

      test('WebCryptoP256', async () => {
        const { porto } = getPorto()
        const client = Porto_internal.getClient(porto).extend(() => ({
          mode: 'anvil',
        }))

        const alice = Hex.random(20)

        const keyPair = await WebCryptoP256.createKeyPair()
        const publicKey = PublicKey.toHex(keyPair.publicKey, {
          includePrefix: false,
        })

        const { accounts } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
                grantPermissions: {
                  expiry: 9999999999,
                  key: {
                    publicKey: publicKey,
                    type: 'p256',
                  },
                  permissions: {
                    calls: [{ to: exp1Address }],
                    spend: [
                      {
                        limit: Hex.fromNumber(42069n),
                        period: 'day',
                        token: exp1Address,
                      },
                    ],
                  },
                },
              },
            },
          ],
        })

        await setBalance(client, {
          address: accounts[0]?.address!,
          value: Value.fromEther('10000'),
        })

        const key = {
          prehash: true,
          publicKey,
          type: 'p256',
        } as const

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              key,
            },
          ],
        })

        const signature = await WebCryptoP256.sign({
          payload: digest,
          privateKey: keyPair.privateKey,
        })

        const result = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              key,
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForTransactionReceipt(client, {
          hash: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: exp1Abi,
            address: exp1Address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })

      test('Secp256k1', async () => {
        const { porto } = getPorto()
        const client = Porto_internal.getClient(porto).extend(() => ({
          mode: 'anvil',
        }))

        const alice = Hex.random(20)

        const privateKey = Secp256k1.randomPrivateKey()
        const publicKey = Secp256k1.getPublicKey({ privateKey })
        const address = Address.fromPublicKey(publicKey)

        const { accounts } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
                grantPermissions: {
                  expiry: 9999999999,
                  key: {
                    publicKey: address,
                    type: 'address',
                  },
                  permissions: {
                    calls: [{ to: exp1Address }],
                    spend: [
                      {
                        limit: Hex.fromNumber(42069n),
                        period: 'day',
                        token: exp1Address,
                      },
                    ],
                  },
                },
              },
            },
          ],
        })

        await setBalance(client, {
          address: accounts[0]?.address!,
          value: Value.fromEther('10000'),
        })

        const key = {
          publicKey: address,
          type: 'secp256k1',
        } as const

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              key,
            },
          ],
        })

        const signature = Secp256k1.sign({ payload: digest, privateKey })

        const result = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              key,
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForTransactionReceipt(client, {
          hash: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: exp1Abi,
            address: exp1Address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })
    })

    describe('behavior: admin', () => {
      test.skipIf(type === 'relay')('default', async () => {
        const { porto } = getPorto()
        const client = Porto_internal.getClient(porto).extend(() => ({
          mode: 'anvil',
        }))

        const alice = Hex.random(20)

        const privateKey = P256.randomPrivateKey()
        const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
          includePrefix: false,
        })

        const { accounts } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
              },
            },
          ],
        })

        await setBalance(client, {
          address: accounts[0]?.address!,
          value: Value.fromEther('10000'),
        })

        const key = {
          publicKey,
          type: 'p256',
        } as const

        await porto.provider.request({
          method: 'experimental_grantAdmin',
          params: [
            {
              key,
            },
          ],
        })

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              key,
            },
          ],
        })

        const signature = P256.sign({ payload: digest, privateKey })

        const result = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              key,
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForTransactionReceipt(client, {
          hash: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: exp1Abi,
            address: exp1Address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })

      test.skipIf(type === 'relay')('WebCryptoP256', async () => {
        const { porto } = getPorto()
        const client = Porto_internal.getClient(porto).extend(() => ({
          mode: 'anvil',
        }))

        const alice = Hex.random(20)

        const keyPair = await WebCryptoP256.createKeyPair()
        const publicKey = PublicKey.toHex(keyPair.publicKey, {
          includePrefix: false,
        })

        const { accounts } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
              },
            },
          ],
        })

        await setBalance(client, {
          address: accounts[0]?.address!,
          value: Value.fromEther('10000'),
        })

        const key = {
          prehash: true,
          publicKey,
          type: 'p256',
        } as const

        await porto.provider.request({
          method: 'experimental_grantAdmin',
          params: [
            {
              key,
            },
          ],
        })

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              key,
            },
          ],
        })

        const signature = await WebCryptoP256.sign({
          payload: digest,
          privateKey: keyPair.privateKey,
        })

        const result = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              key,
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForTransactionReceipt(client, {
          hash: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: exp1Abi,
            address: exp1Address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })

      test('Secp256k1', async () => {
        const { porto } = getPorto()
        const client = Porto_internal.getClient(porto).extend(() => ({
          mode: 'anvil',
        }))

        const alice = Hex.random(20)

        const privateKey = Secp256k1.randomPrivateKey()
        const publicKey = Secp256k1.getPublicKey({ privateKey })
        const address = Address.fromPublicKey(publicKey)

        const { accounts } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
              },
            },
          ],
        })

        await setBalance(client, {
          address: accounts[0]?.address!,
          value: Value.fromEther('10000'),
        })

        const key = {
          publicKey: address,
          type: 'secp256k1',
        } as const

        await porto.provider.request({
          method: 'experimental_grantAdmin',
          params: [
            {
              key,
            },
          ],
        })

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              key,
            },
          ],
        })

        const signature = Secp256k1.sign({ payload: digest, privateKey })

        const result = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              key,
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForTransactionReceipt(client, {
          hash: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: exp1Abi,
            address: exp1Address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })
    })
  })

  test('behavior: fall through', async () => {
    const { porto } = getPorto()
    expect(
      await porto.provider.request({
        method: 'eth_blockNumber',
      }),
    ).toBeDefined()
  })

  test('behavior: unsupported wallet_ method', async () => {
    const { porto } = getPorto()
    await expect(() =>
      porto.provider.request({
        method: 'wallet_lol',
      }),
    ).rejects.toThrowError(
      'The provider does not support the requested method.',
    )
  })
})

const typedData = {
  domain: {
    chainId: 1,
    name: 'Ether Mail 🥵',
    verifyingContract: '0x0000000000000000000000000000000000000000',
    version: '1.1.1',
  },
  message: {
    contents: 'Hello, Bob! 🖤',
    from: {
      age: 69,
      favoriteColors: ['red', 'green', 'blue'],
      foo: 123123123123123123n,
      isCool: false,
      name: {
        first: 'Cow',
        last: 'Burns',
      },
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: 1234567890n,
    to: {
      age: 70,
      favoriteColors: ['orange', 'yellow', 'green'],
      foo: 123123123123123123n,
      isCool: true,
      name: { first: 'Bob', last: 'Builder' },
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
  },
  primaryType: 'Mail',
  types: {
    Mail: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
      { name: 'hash', type: 'bytes' },
    ],
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
  },
} as const
