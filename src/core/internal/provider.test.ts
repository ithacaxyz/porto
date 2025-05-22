import { createRequestListener } from '@mjackson/node-fetch-server'
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
import { Key, Mode } from 'porto'
import { Sponsor } from 'porto/server'
import { encodeFunctionData, hashMessage, hashTypedData } from 'viem'
import { readContract, setCode, waitForCallsStatus } from 'viem/actions'
import { describe, expect, test, vi } from 'vitest'

import { accountOldProxyAddress } from '../../../test/src/_generated/addresses.js'
import { createAccount, setBalance } from '../../../test/src/actions.js'
import * as Anvil from '../../../test/src/anvil.js'
import * as Http from '../../../test/src/http.js'
import {
  exp1Abi,
  exp1Address,
  getPorto as getPorto_,
} from '../../../test/src/porto.js'
import * as Porto_internal from './porto.js'
import * as Actions from './viem/actions.js'

describe.each([
  ['contract', process.env.VITE_LOCAL !== 'false' ? Mode.contract : undefined],
  ['rpcServer', Mode.rpcServer],
] as const)('%s', (type, mode) => {
  if (!mode) return

  const getPorto = (config: { sponsorUrl?: string | undefined } = {}) =>
    getPorto_({
      ...config,
      mode,
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

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id: hash,
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
    test.runIf(!Anvil.enabled)('default', async () => {
      const { porto } = getPorto()

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      const signature = await porto.provider.request({
        method: 'eth_signTypedData_v4',
        params: [address, TypedData.serialize(typedData)],
      })
      expect(signature).toBeDefined()

      const { valid } = await porto.provider.request({
        method: 'wallet_verifySignature',
        params: [
          {
            address,
            digest: hashTypedData(typedData),
            signature,
          },
        ],
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
      expect({
        ...permissions,
        address: null,
        capabilities: null,
        chainId: null,
      }).matchSnapshot()

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
        expect({
          ...permissions,
          address: null,
          capabilities: null,
          chainId: null,
        }).matchSnapshot()
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

  describe('experimental_getAccountVersion', () => {
    test('default', async () => {
      const { porto } = getPorto()

      await porto.provider.request({
        method: 'experimental_createAccount',
      })

      const version = await porto.provider.request({
        method: 'experimental_getAccountVersion',
      })
      expect(version).toMatchInlineSnapshot(`
        {
          "current": "0.2.0",
          "latest": "0.2.0",
        }
      `)
    })

    test('behavior: provided address', async () => {
      const { porto } = getPorto()

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })

      const version = await porto.provider.request({
        method: 'experimental_getAccountVersion',
        params: [{ address }],
      })
      expect(version).toMatchInlineSnapshot(`
        {
          "current": "0.2.0",
          "latest": "0.2.0",
        }
      `)
    })

    test('behavior: not connected', async () => {
      const { porto } = getPorto()

      await expect(
        porto.provider.request({
          method: 'experimental_getAccountVersion',
        }),
      ).rejects.toMatchInlineSnapshot(
        `[Provider.DisconnectedError: The provider is disconnected from all chains.]`,
      )
    })

    test('behavior: account not found', async () => {
      const { porto } = getPorto()

      await porto.provider.request({
        method: 'experimental_createAccount',
      })

      await expect(
        porto.provider.request({
          method: 'experimental_getAccountVersion',
          params: [{ address: '0x0000000000000000000000000000000000000000' }],
        }),
      ).rejects.toMatchInlineSnapshot(
        `[Provider.UnauthorizedError: The requested method and/or account has not been authorized by the user.]`,
      )
    })

    test.runIf(Anvil.enabled)('behavior: outdated account', async () => {
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

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [],
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id,
      })

      await setCode(client, {
        address,
        bytecode: Hex.concat('0xef0100', accountOldProxyAddress),
      })

      const version = await porto.provider.request({
        method: 'experimental_getAccountVersion',
      })
      expect(version).toMatchInlineSnapshot(`
        {
          "current": "0.0.1",
          "latest": "0.2.0",
        }
      `)
    })
  })

  // TODO: fix (broken from https://github.com/ithacaxyz/relay/pull/622)
  describe.skip('experimental_updateAccount', () => {
    test.runIf(Anvil.enabled && type === 'rpcServer')('default', async () => {
      const { porto } = getPorto()
      const client = Porto_internal.getClient(porto).extend(() => ({
        mode: 'anvil',
      }))

      const capabilities = await Actions.getCapabilities(client)
      vi.spyOn(Actions, 'getCapabilities').mockResolvedValue({
        ...capabilities,
        contracts: {
          ...capabilities.contracts,
          accountImplementation: {
            address: accountOldProxyAddress,
            version: '0.0.1',
          },
          accountProxy: {
            address: accountOldProxyAddress,
            version: '0.0.1',
          },
        },
      })

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [],
            from: address,
            version: '1',
          },
        ],
      })

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id,
      })

      vi.resetAllMocks()

      const version = await porto.provider.request({
        method: 'experimental_getAccountVersion',
      })
      expect(version).toMatchInlineSnapshot(`
        {
          "current": "0.0.1",
          "latest": "0.1.1",
        }
      `)

      const { id: id2 } = await porto.provider.request({
        method: 'experimental_updateAccount',
      })

      if (id2)
        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id: id2,
        })

      {
        const version = await porto.provider.request({
          method: 'experimental_getAccountVersion',
        })
        expect(version).toMatchInlineSnapshot(`
          {
            "current": "0.1.1",
            "latest": "0.1.1",
          }
        `)
      }
    })
  })

  describe('personal_sign', () => {
    test.runIf(!Anvil.enabled)('default', async () => {
      const { porto } = getPorto()

      const { address } = await porto.provider.request({
        method: 'experimental_createAccount',
      })
      const signature = await porto.provider.request({
        method: 'personal_sign',
        params: [Hex.fromString('hello'), address],
      })
      expect(signature).toBeDefined()

      const { valid } = await porto.provider.request({
        method: 'wallet_verifySignature',
        params: [
          {
            address,
            digest: hashMessage('hello'),
            signature,
          },
        ],
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

  describe.runIf(Anvil.enabled)('wallet_getCapabilities', () => {
    test('default', async () => {
      const { porto } = getPorto()
      const capabilities = await porto.provider.request({
        method: 'wallet_getCapabilities',
      })

      const keys = Object.keys(capabilities)
      expect(keys).matchSnapshot()

      const values = Object.values(capabilities)
      const { atomic, feeToken, permissions, sponsor } = values[0]!
      expect(atomic).matchSnapshot()
      expect(feeToken.supported).matchSnapshot()
      expect(feeToken.tokens.length).matchSnapshot()
      expect(permissions).matchSnapshot()
      expect(sponsor).matchSnapshot()
    })

    test('behavior: chainId', async () => {
      const { client, porto } = getPorto()
      const capabilities = await porto.provider.request({
        method: 'wallet_getCapabilities',
        params: [undefined, [Hex.fromNumber(client.chain.id)]],
      })

      const keys = Object.keys(capabilities)
      expect(keys).matchSnapshot()

      const values = Object.values(capabilities)
      const { atomic, feeToken, permissions, sponsor } = values[0]!
      expect(atomic).matchSnapshot()
      expect(feeToken.supported).matchSnapshot()
      expect(
        feeToken.tokens
          .map((x) => ({ ...x, nativeRate: null }))
          .toSorted((a, b) => a.address.localeCompare(b.address)),
      ).matchSnapshot()
      expect(permissions).matchSnapshot()
      expect(sponsor).matchSnapshot()
    })

    test('behavior: unsupported chain', async () => {
      const { porto } = getPorto()
      const capabilities = await porto.provider.request({
        method: 'wallet_getCapabilities',
        params: [undefined, ['0x1']],
      })
      expect(capabilities).toMatchInlineSnapshot(`{}`)
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

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id,
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

    test.runIf(type === 'rpcServer' && Anvil.enabled)(
      'behavior: fee sponsor',
      async () => {
        const { client, porto } = getPorto()

        const sponsorKey = Key.createSecp256k1()
        const sponsorAccount = await createAccount(client, {
          deploy: true,
          keys: [sponsorKey],
        })

        const handler = Sponsor.rpcHandler({
          address: sponsorAccount.address,
          key: {
            privateKey: sponsorKey.privateKey!(),
            type: sponsorKey.type,
          },
          transports: porto._internal.config.transports,
        })
        const server = await Http.createServer(createRequestListener(handler))

        const { address } = await porto.provider.request({
          method: 'experimental_createAccount',
        })
        await setBalance(client, {
          address,
          value: Value.fromEther('10000'),
        })

        const userBalance_pre = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [address],
          functionName: 'balanceOf',
        })
        const sponsorBalance_pre = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [sponsorAccount.address],
          functionName: 'balanceOf',
        })

        const { id } = await porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [Hex.random(20), Value.fromEther('1')],
                    functionName: 'transfer',
                  }),
                  to: exp1Address,
                },
              ],
              capabilities: {
                sponsorUrl: server.url,
              },
              from: address,
              version: '1',
            },
          ],
        })

        expect(id).toBeDefined()

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id,
        })

        const userBalance_post = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [address],
          functionName: 'balanceOf',
        })
        const sponsorBalance_post = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [sponsorAccount.address],
          functionName: 'balanceOf',
        })

        // Check if user was debited 1 EXP.
        expect(userBalance_post).toBe(userBalance_pre - Value.fromEther('1'))

        // Check if sponsor was debited the fee payment.
        expect(sponsorBalance_post).toBeLessThan(sponsorBalance_pre)
      },
    )

    test.runIf(type === 'rpcServer' && Anvil.enabled)(
      'behavior: fee sponsor (porto config)',
      async () => {
        const {
          client,
          porto: { _internal },
        } = getPorto()

        const sponsorKey = Key.createSecp256k1()
        const sponsorAccount = await createAccount(client, {
          deploy: true,
          keys: [sponsorKey],
        })

        const handler = Sponsor.rpcHandler({
          address: sponsorAccount.address,
          key: {
            privateKey: sponsorKey.privateKey!(),
            type: sponsorKey.type,
          },
          transports: _internal.config.transports,
        })
        const server = await Http.createServer(createRequestListener(handler))

        const { porto } = getPorto({ sponsorUrl: server.url })

        const { address } = await porto.provider.request({
          method: 'experimental_createAccount',
        })
        await setBalance(client, {
          address,
          value: Value.fromEther('10000'),
        })

        const userBalance_pre = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [address],
          functionName: 'balanceOf',
        })
        const sponsorBalance_pre = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [sponsorAccount.address],
          functionName: 'balanceOf',
        })

        const { id } = await porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: exp1Abi,
                    args: [Hex.random(20), Value.fromEther('1')],
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

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id,
        })

        const userBalance_post = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [address],
          functionName: 'balanceOf',
        })
        const sponsorBalance_post = await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [sponsorAccount.address],
          functionName: 'balanceOf',
        })

        // Check if user was debited 1 EXP.
        expect(userBalance_post).toBe(userBalance_pre - Value.fromEther('1'))

        // Check if sponsor was debited the fee payment.
        expect(sponsorBalance_post).toBeLessThan(sponsorBalance_pre)
      },
    )

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
                  limit: Hex.fromNumber(Value.fromEther('50')),
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
                  args: [alice, Value.fromEther('50')],
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

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id,
      })

      expect(
        await readContract(client, {
          abi: exp1Abi,
          address: exp1Address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(Value.fromEther('50'))
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

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id,
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

    // TODO: remove condition once Anvil supports reverts on delegated accounts.
    test.runIf(type === 'rpcServer')(
      'behavior: `permissions.calls` unauthorized',
      async () => {
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
      },
    )

    // TODO: remove condition once Anvil supports reverts on delegated accounts.
    test.runIf(type === 'rpcServer')(
      'behavior: `permissions.spend` exceeded',
      async () => {
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
                    limit: Hex.fromNumber(Value.fromEther('50')),
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
                    args: [alice, Value.fromEther('50')],
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

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id,
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
                      args: [alice, Value.fromEther('200')],
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
      },
    )

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

      await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
        id,
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

  describe('wallet_getCallsStatus', () => {
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

      const response = await porto.provider.request({
        method: 'wallet_getCallsStatus',
        params: [id],
      })

      expect(response.id).toBe(id)
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

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id: result[0]!.id,
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

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id: result[0]!.id,
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

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id: result[0]!.id,
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

        await waitForCallsStatus(Porto_internal.getProviderClient(porto), {
          id: result[0]!.id,
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
