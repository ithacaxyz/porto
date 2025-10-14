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
import { Route } from 'porto/server'
import { encodeFunctionData, hashMessage, hashTypedData } from 'viem'
import {
  readContract,
  setCode,
  signTypedData,
  verifyHash,
  setBalance as viem_setBalance,
  waitForCallsStatus,
  waitForTransactionReceipt,
} from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { accountOldProxyAddress } from '../../../test/src/_generated/addresses.js'
import { createAccount, setBalance } from '../../../test/src/actions.js'
import * as Anvil from '../../../test/src/anvil.js'
import * as TestConfig from '../../../test/src/config.js'
import * as Http from '../../../test/src/http.js'
import * as RelayActions from '../../viem/RelayActions.js'
import * as RelayClient from '../../viem/RelayClient.js'
import * as WalletClient from '../../viem/WalletClient.js'

describe.each([['relay', Mode.relay]] as const)('%s', (type, mode) => {
  if (!mode) return

  const getPorto = (
    config: {
      merchantUrl?: string | undefined
      relayRpcUrl?: string | undefined
    } = {},
  ) =>
    TestConfig.getPorto({
      ...config,
      mode,
    })

  describe('eth_accounts', () => {
    test('default', async () => {
      const porto = getPorto()
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
      const porto = getPorto()
      await expect(
        porto.provider.request({
          method: 'eth_accounts',
        }),
      ).rejects.matchSnapshot()
    })
  })

  describe('eth_requestAccounts', () => {
    test('default', async () => {
      const porto = getPorto()
      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
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
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

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
              abi: contracts.exp1.abi,
              args: [alice, 69420n],
              functionName: 'transfer',
            }),
            from: address,
            to: contracts.exp1.address,
          },
        ],
      })

      expect(hash).toBeDefined()

      const receipt = await waitForTransactionReceipt(client, { hash })
      expect(receipt).toBeDefined()

      expect(
        await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(69420n)
    })
  })

  describe('eth_signTypedData_v4', () => {
    test('predelegated', async () => {
      const porto = getPorto()
      const relayClient = TestConfig.getRelayClient(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      const signature = await porto.provider.request({
        method: 'eth_signTypedData_v4',
        params: [address, TypedData.serialize(typedData)],
      })
      expect(signature).toBeDefined()

      {
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
      }

      {
        const valid = await verifyHash(relayClient, {
          address,
          hash: hashTypedData(typedData),
          signature,
        })
        expect(valid).toBe(true)
      }
    })

    test('delegated', async () => {
      const porto = getPorto()
      const walletClient = TestConfig.getWalletClient(porto)
      const relayClient = TestConfig.getRelayClient(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(relayClient, {
        address,
        value: Value.fromEther('10000'),
      })
      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [{ calls: [] }],
      })
      await waitForCallsStatus(walletClient, {
        id,
      })

      const signature = await porto.provider.request({
        method: 'eth_signTypedData_v4',
        params: [address, TypedData.serialize(typedData)],
      })
      expect(signature).toBeDefined()

      {
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
      }

      {
        const valid = await verifyHash(relayClient, {
          address,
          hash: hashTypedData(typedData),
          signature,
        })
        expect(valid).toBe(true)
      }
    })
  })

  describe('wallet_grantAdmin', () => {
    test('default', async () => {
      const messages: any[] = []

      const porto = getPorto()
      const client = RelayClient.fromPorto(porto).extend(() => ({
        mode: 'anvil',
      }))

      porto.provider.on('message', (message) => messages.push(message))

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const response = await porto.provider.request({
        method: 'wallet_grantAdmin',
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
    })
  })

  describe.runIf(type === 'relay')('wallet_getAssets', () => {
    test('default', async () => {
      const porto = getPorto()
      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
            },
          },
        ],
      })

      const result = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{ account: account!.address }],
      })
      expect(result).toBeDefined()
      expect(Object.keys(result).length).toBeGreaterThanOrEqual(1)
    })

    test('behavior: with balances', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
            },
          },
        ],
      })
      const address = account!.address

      // Set native balance
      await setBalance(client, {
        address,
        value: Value.fromEther('100'),
      })

      // Mint some ERC20 tokens
      await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: contracts.exp1.abi,
                  args: [address, Value.fromEther('1000')],
                  functionName: 'mint',
                }),
                to: contracts.exp1.address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      const result = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{ account: address }],
      })

      expect(result).toBeDefined()
      const assetKeys = Object.keys(result)
      expect(assetKeys.length).toBeGreaterThanOrEqual(1)

      // Check if we have chain-specific assets
      const chainId = Hex.fromNumber(client.chain.id)
      expect(result[chainId]).toBeDefined()
      expect(Array.isArray(result[chainId])).toBe(true)
    })

    test('behavior: after transaction', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
            },
          },
        ],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('1000'),
      })

      // Get assets before transaction
      const assetsBefore = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{ account: address }],
      })

      const alice = Hex.random(20)

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: contracts.exp1.abi,
                  args: [alice, Value.fromEther('50')],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      // Get assets after transaction
      const assetsAfter = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{ account: address }],
      })

      expect(assetsAfter).toBeDefined()
      expect(Object.keys(assetsAfter).length).toBeGreaterThanOrEqual(1)
      // The balance should have changed after the transaction
      expect(assetsAfter).not.toEqual(assetsBefore)
    })

    test('behavior: multiple chains; one unsupported', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
            },
          },
        ],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('100'),
      })

      await expect(
        porto.provider.request({
          method: 'wallet_getAssets',
          params: [{ account: address, chainFilter: [Hex.fromNumber(999999)] }],
        }),
      ).rejects.toThrow('unsupported chain 999999')
    })
  })

  describe('wallet_getAdmins', () => {
    test('default', async () => {
      const porto = getPorto()
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
        method: 'wallet_getAdmins',
      })
      expect(address).toBeDefined()
      expect(keys.length).toBe(1)
    })

    test('behavior: disconnected', async () => {
      const porto = getPorto()
      await expect(
        porto.provider.request({
          method: 'wallet_getAdmins',
        }),
      ).rejects.matchSnapshot()
    })

    test('behavior: disconnect > connect > getAdmins', async () => {
      const porto = getPorto()
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

      await porto.provider.request({
        method: 'wallet_disconnect',
      })

      await porto.provider.request({
        method: 'wallet_connect',
      })

      const { address, keys } = await porto.provider.request({
        method: 'wallet_getAdmins',
      })
      expect(address).toBeDefined()
      expect(keys.length).toBe(1)
    })
  })

  describe('wallet_grantPermissions', () => {
    test('default', async () => {
      const messages: any[] = []

      const porto = getPorto()
      porto.provider.on('message', (message) => messages.push(message))

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
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
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          permissions: {
            ...x.permissions,
            spend: x.permissions?.spend?.map((x) => ({
              ...x,
              token: null,
            })),
          },
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('permissionsChanged')
    })

    test('behavior: provided key', async () => {
      const messages: any[] = []

      const porto = getPorto()
      porto.provider.on('message', (message) => messages.push(message))

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })

      const permissions = await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
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
        permissions: {
          ...permissions.permissions,
          spend: permissions.permissions?.spend?.map((x) => ({
            ...x,
            token: null,
          })),
        },
      }).matchSnapshot()

      {
        const permissions = await porto.provider.request({
          method: 'wallet_grantPermissions',
          params: [
            {
              expiry: 9999999999,
              feeToken: {
                limit: '1',
                symbol: 'EXP',
              },
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
          permissions: {
            ...permissions.permissions,
            spend: permissions.permissions?.spend?.map((x) => ({
              ...x,
              token: null,
            })),
          },
        }).matchSnapshot()
      }

      const accounts = porto._internal.store.getState().accounts
      expect(accounts.length).toBe(1)
      expect(accounts![0]!.keys?.length).toBe(3)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          permissions: {
            ...permissions.permissions,
            spend: permissions.permissions?.spend?.map((x) => ({
              ...x,
              token: null,
            })),
          },
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('permissionsChanged')
    })

    test('behavior: no permissions', async () => {
      const porto = getPorto()
      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      await expect(
        porto.provider.request({
          method: 'wallet_grantPermissions',
          params: [
            {
              expiry: 9999999999,
              feeToken: {
                limit: '1',
                symbol: 'EXP',
              },
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
      const porto = getPorto()
      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      await expect(
        porto.provider.request({
          method: 'wallet_grantPermissions',
          params: [
            {
              expiry: 0,
              feeToken: {
                limit: '1',
                symbol: 'EXP',
              },
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

  describe('wallet_getPermissions', () => {
    test('default', async () => {
      const porto = getPorto()
      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            permissions: {
              calls: [{ signature: 'mint()' }],
            },
          },
        ],
      })
      await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
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
      const permissions = await porto.provider.request({
        method: 'wallet_getPermissions',
      })
      expect(permissions.length).toBe(2)
    })

    test('behavior: grant on connect > grant another > get after connect', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const walletClient = TestConfig.getWalletClient(porto)

      const { accounts } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
              grantPermissions: {
                expiry: 9999999999,
                feeToken: {
                  limit: '1',
                  symbol: 'EXP',
                },
                key: {
                  publicKey: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  type: 'address',
                },
                permissions: {
                  calls: [{ signature: 'mint()' }],
                },
              },
            },
          },
        ],
      })
      await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            key: {
              publicKey:
                '0xcafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe',
              type: 'p256',
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

      {
        const permissions = await porto.provider.request({
          method: 'wallet_getPermissions',
        })
        expect(
          permissions.map((x) => ({
            ...x,
            address: null,
            chainId: null,
            permissions: {
              calls: x.permissions?.calls?.map((x) => ({
                ...x,
                to: null,
              })),
              spend: x.permissions?.spend?.map((x) => ({
                ...x,
                token: null,
              })),
            },
          })),
        ).matchSnapshot()
      }

      await setBalance(client, {
        address: accounts[0]!.address,
        value: Value.fromEther('10000'),
      })
      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [{ calls: [] }],
      })
      await waitForCallsStatus(walletClient, {
        id,
      })

      {
        const permissions = await porto.provider.request({
          method: 'wallet_getPermissions',
        })
        expect(
          permissions.map((x) => ({
            ...x,
            address: null,
            chainId: null,
            permissions: {
              calls: x.permissions?.calls?.map((x) => ({
                ...x,
                to: null,
              })),
              spend: x.permissions?.spend?.map((x) => ({
                ...x,
                token: null,
              })),
            },
          })),
        ).matchSnapshot()
      }

      await porto.provider.request({
        method: 'wallet_disconnect',
      })
      await porto.provider.request({
        method: 'wallet_connect',
      })

      {
        const permissions = await porto.provider.request({
          method: 'wallet_getPermissions',
        })
        expect(
          permissions.map((x) => ({
            ...x,
            address: null,
            chainId: null,
            permissions: {
              calls: x.permissions?.calls?.map((x) => ({
                ...x,
                to: null,
              })),
              spend: x.permissions?.spend?.map((x) => ({
                ...x,
                token: null,
              })),
            },
          })),
        ).matchSnapshot()
      }
    })
  })

  describe('wallet_revokeAdmin', () => {
    test('default', async () => {
      const porto = getPorto()
      const client = RelayClient.fromPorto(porto).extend(() => ({
        mode: 'anvil',
      }))

      const messages: any[] = []
      porto.provider.on('message', (message) => messages.push(message))

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const { key } = await porto.provider.request({
        method: 'wallet_grantAdmin',
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
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('adminsChanged')

      await porto.provider.request({
        method: 'wallet_revokeAdmin',
        params: [{ id: key.publicKey }],
      })

      accounts = porto._internal.store.getState().accounts
      expect(accounts![0]!.keys?.length).toBe(1)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[1].type).toBe('adminsChanged')
    })
  })

  describe('wallet_revokePermissions', () => {
    test('default', async () => {
      const porto = getPorto()
      const client = RelayClient.fromPorto(porto).extend(() => ({
        mode: 'anvil',
      }))

      const messages: any[] = []
      porto.provider.on('message', (message) => messages.push(message))

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const { id } = await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
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
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          permissions: {
            ...x.permissions,
            spend: x.permissions?.spend?.map((x) => ({
              ...x,
              token: null,
            })),
          },
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].type).toBe('permissionsChanged')

      await porto.provider.request({
        method: 'wallet_revokePermissions',
        params: [{ id }],
      })

      accounts = porto._internal.store.getState().accounts
      expect(accounts![0]!.keys?.length).toBe(1)
      expect(
        accounts![0]!.keys?.map((x) => ({
          ...x,
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[1].type).toBe('permissionsChanged')
    })

    test('behavior: revoke last admin key', async () => {
      const porto = getPorto()

      const messages: any[] = []
      porto.provider.on('message', (message) => messages.push(message))

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })

      const accounts = porto._internal.store.getState().accounts
      const id = accounts![0]!.keys![0]!.publicKey

      await expect(() =>
        porto.provider.request({
          method: 'wallet_revokePermissions',
          params: [{ id }],
        }),
      ).rejects.matchSnapshot()
    })
  })

  describe('wallet_getAccountVersion', () => {
    test('default', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      const capabilities = await RelayActions.getCapabilities(client)

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })

      const version = await porto.provider.request({
        method: 'wallet_getAccountVersion',
      })
      expect(version.current).toMatch(
        capabilities.contracts.accountImplementation.version!,
      )
      expect(version.latest).toMatch(
        capabilities.contracts.accountImplementation.version!,
      )
    })

    test('behavior: provided address', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      const capabilities = await RelayActions.getCapabilities(client)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      const version = await porto.provider.request({
        method: 'wallet_getAccountVersion',
        params: [{ address }],
      })
      expect(version.current).toMatch(
        capabilities.contracts.accountImplementation.version!,
      )
      expect(version.latest).toMatch(
        capabilities.contracts.accountImplementation.version!,
      )
    })

    test('behavior: not connected', async () => {
      const porto = getPorto()

      await expect(
        porto.provider.request({
          method: 'wallet_getAccountVersion',
        }),
      ).rejects.toMatchInlineSnapshot(
        '[Provider.DisconnectedError: The provider is disconnected from all chains.]',
      )
    })

    test('behavior: account not found', async () => {
      const porto = getPorto()

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })

      await expect(
        porto.provider.request({
          method: 'wallet_getAccountVersion',
          params: [{ address: '0x0000000000000000000000000000000000000000' }],
        }),
      ).rejects.toMatchInlineSnapshot(
        '[Provider.UnauthorizedError: The requested method and/or account has not been authorized by the user.]',
      )
    })

    test.runIf(Anvil.enabled)('behavior: outdated account', async () => {
      const porto = getPorto()
      const client = RelayClient.fromPorto(porto).extend(() => ({
        mode: 'anvil',
      }))

      const capabilities = await RelayActions.getCapabilities(client)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

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

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      await setCode(client, {
        address,
        bytecode: Hex.concat('0xef0100', accountOldProxyAddress),
      })

      const version = await porto.provider.request({
        method: 'wallet_getAccountVersion',
      })
      expect(version.current).toMatch('0.0.1')
      expect(version.latest).toMatch(
        capabilities.contracts.accountImplementation.version!,
      )
    })
  })

  describe('personal_sign', () => {
    test('predelegated', async () => {
      const porto = getPorto()
      const relayClient = TestConfig.getRelayClient(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      const signature = await porto.provider.request({
        method: 'personal_sign',
        params: [Hex.fromString('hello'), address],
      })
      expect(signature).toBeDefined()

      {
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
      }

      {
        const valid = await verifyHash(relayClient, {
          address,
          hash: hashMessage('hello'),
          signature,
        })
        expect(valid).toBe(true)
      }
    })

    test('delegated', async () => {
      const porto = getPorto()
      const walletClient = TestConfig.getWalletClient(porto)
      const relayClient = TestConfig.getRelayClient(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(relayClient, {
        address,
        value: Value.fromEther('10000'),
      })
      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [{ calls: [] }],
      })
      await waitForCallsStatus(walletClient, {
        id,
      })

      const signature = await porto.provider.request({
        method: 'personal_sign',
        params: [Hex.fromString('hello'), address],
      })
      expect(signature).toBeDefined()

      {
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
      }

      {
        const valid = await verifyHash(relayClient, {
          address,
          hash: hashMessage('hello'),
          signature,
        })
        expect(valid).toBe(true)
      }
    })
  })

  describe('wallet_connect', () => {
    test('default', async () => {
      const messages: any[] = []

      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      porto.provider.on('connect', (message) => messages.push(message))

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
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
          chainId: null,
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

      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

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
          chainId: null,
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

      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      porto.provider.on('connect', (message) => messages.push(message))

      await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
              grantPermissions: {
                expiry: 9999999999,
                feeToken: {
                  limit: '1',
                  symbol: 'EXP',
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
        accounts![0]!.keys?.map((x) => ({
          ...x,
          chainId: null,
          expiry: null,
          hash: null,
          id: null,
          permissions: {
            ...x.permissions,
            spend: x.permissions?.spend?.map((x) => ({
              ...x,
              token: null,
            })),
          },
          publicKey: null,
        })),
      ).matchSnapshot()

      expect(messages[0].chainId).toBe(Hex.fromNumber(client.chain.id))
    })

    test('behavior: `createAccount` + `grantPermissions` capability (provided key)', async () => {
      const messages: any[] = []

      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

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
                feeToken: {
                  limit: '1',
                  symbol: 'EXP',
                },
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
          chainId: null,
          expiry: i === 0 ? null : x.expiry,
          hash: i === 0 ? null : x.hash,
          id: i === 0 ? null : x.id,
          permissions: {
            ...x.permissions,
            spend: x.permissions?.spend?.map((x) => ({
              ...x,
              token: null,
            })),
          },
          publicKey: i === 0 ? null : x.publicKey,
        })),
      ).matchSnapshot()

      expect(messages[0].chainId).toBe(Hex.fromNumber(client.chain.id))
    })

    test('behavior: `grantPermissions` capability (unlimited expiry)', async () => {
      const porto = getPorto()
      await expect(() =>
        porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
                grantPermissions: {
                  expiry: 0,
                  feeToken: {
                    limit: '1',
                    symbol: 'EXP',
                  },
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
      const porto = getPorto()
      await expect(() =>
        porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: true,
                grantPermissions: {
                  expiry: 9999999,
                  feeToken: {
                    limit: '1',
                    symbol: 'EXP',
                  },
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

    test('behavior: `signInWithEthereum` capability (predelegated)', async () => {
      const porto = getPorto()
      const relayClient = TestConfig.getRelayClient(porto)

      const res = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
              signInWithEthereum: {
                domain: 'example.com',
                nonce: 'deadbeef',
                uri: 'http://example.com/',
              },
            },
          },
        ],
      })
      const { message, signature } =
        res.accounts.at(0)?.capabilities?.signInWithEthereum ?? {}
      if (message && signature) {
        switch (type) {
          case 'relay': {
            {
              const { valid } = await porto.provider.request({
                method: 'wallet_verifySignature',
                params: [
                  {
                    address: res.accounts.at(0)?.address!,
                    digest: hashMessage(message),
                    signature,
                  },
                ],
              })
              expect(valid).toBeTruthy()
            }

            {
              const valid = await verifyHash(relayClient, {
                address: res.accounts.at(0)?.address!,
                hash: hashMessage(message),
                signature,
              })
              expect(valid).toBeTruthy()
            }
            break
          }
        }
      }
    })
  })

  describe('wallet_disconnect', () => {
    test('default', async () => {
      const messages: any[] = []

      const porto = getPorto()
      porto.provider.on('disconnect', (message) => messages.push(message))

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      await porto.provider.request({
        method: 'wallet_disconnect',
      })

      const accounts = porto._internal.store.getState().accounts
      expect(accounts.length).toBe(0)
      expect(messages).matchSnapshot()
    })
  })

  describe('wallet_switchEthereumChain', () => {
    test('default', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })

      const initialChainId = await porto.provider.request({
        method: 'eth_chainId',
      })
      expect(initialChainId).toBe(Hex.fromNumber(client.chain.id))

      const targetChain = porto._internal.config.chains.find(
        (chain) => chain.id !== client.chain.id,
      )
      if (!targetChain) throw new Error('No target chain found')

      await porto.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Hex.fromNumber(targetChain.id) }],
      })

      const state = porto._internal.store.getState()
      expect(state.chainIds[0]).toBe(targetChain.id)

      const nextChainId = await porto.provider.request({
        method: 'eth_chainId',
      })
      expect(nextChainId).toBe(Hex.fromNumber(targetChain.id))
      expect(nextChainId).not.toBe(initialChainId)

      await porto.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: initialChainId }],
      })
    })

    test('behavior: unsupported chain', async () => {
      const porto = getPorto()

      await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })

      await expect(
        porto.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x999' }],
        }),
      ).rejects.toMatchInlineSnapshot(
        '[Provider.UnsupportedChainIdError: This Wallet does not support the requested chain ID.]',
      )
    })
  })

  describe.runIf(Anvil.enabled)('wallet_getCapabilities', () => {
    test('default', async () => {
      const porto = getPorto()
      const capabilities = await porto.provider.request({
        method: 'wallet_getCapabilities',
      })

      const keys = Object.keys(capabilities)
      expect(keys).matchSnapshot()

      const values = Object.values(capabilities)
      const { atomic, feeToken, permissions, merchant } = values[0]!
      expect(atomic).matchSnapshot()
      expect(feeToken.supported).matchSnapshot()
      expect(feeToken.tokens.length).matchSnapshot()
      expect(permissions).matchSnapshot()
      expect(merchant).matchSnapshot()
    })

    test('behavior: chainId', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)

      const capabilities = await porto.provider.request({
        method: 'wallet_getCapabilities',
        params: [undefined, [Hex.fromNumber(client.chain.id)]],
      })

      const keys = Object.keys(capabilities)
      expect(keys).matchSnapshot()

      const values = Object.values(capabilities)
      const { atomic, feeToken, permissions, merchant } = values[0]!
      expect(atomic).matchSnapshot()
      expect(feeToken.supported).matchSnapshot()
      expect(
        feeToken.tokens
          .map((x) => ({ ...x, nativeRate: null }))
          .toSorted((a, b) => a.address.localeCompare(b.address)),
      ).matchSnapshot()
      expect(permissions).matchSnapshot()
      expect(merchant).matchSnapshot()
    })
  })

  describe('wallet_sendCalls', () => {
    test('default', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

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
                  abi: contracts.exp1.abi,
                  args: [alice, 69420n],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      expect(
        await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(69420n)
    })

    test.runIf(type === 'relay' && Anvil.enabled)(
      'behavior: `feeToken` capability',
      async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

        const {
          accounts: [account],
        } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: { createAccount: true },
            },
          ],
        })
        const address = account!.address

        await viem_setBalance(client, {
          address,
          value: Value.fromEther('10000'),
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
                    abi: contracts.exp1.abi,
                    args: [alice, 100n],
                    functionName: 'mint',
                  }),
                  to: contracts.exp1.address,
                },
              ],
              capabilities: {
                feeToken: '0x0000000000000000000000000000000000000000',
              },
              from: address,
              version: '1',
            },
          ],
        })

        expect(id).toBeDefined()

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id,
        })

        expect(
          await readContract(client, {
            abi: contracts.exp1.abi,
            address: contracts.exp1.address,
            args: [address],
            functionName: 'balanceOf',
          }),
        ).toBe(Value.fromEther('10000'))
        expect(
          await readContract(client, {
            abi: contracts.exp1.abi,
            address: contracts.exp1.address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(100n)
      },
    )

    test.runIf(type === 'relay')('behavior: merchant fee sponsor', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const merchantKey = Key.createSecp256k1()
      const merchantAccount = await createAccount(client, {
        deploy: true,
        keys: [merchantKey],
      })

      const listener = Route.merchant({
        ...porto.config,
        address: merchantAccount.address,
        key: {
          privateKey: merchantKey.privateKey!(),
          type: merchantKey.type,
        },
      }).listener
      const server = await Http.createServer(listener)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: { createAccount: true },
          },
        ],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const userBalance_pre = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [address],
        functionName: 'balanceOf',
      })
      const merchantBalance_pre = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: contracts.exp1.abi,
                  args: [Hex.random(20), Value.fromEther('1')],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
              },
            ],
            capabilities: {
              merchantUrl: server.url,
            },
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      const userBalance_post = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [address],
        functionName: 'balanceOf',
      })
      const merchantBalance_post = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      // Check if user was debited 1 EXP.
      expect(userBalance_post).toBe(userBalance_pre - Value.fromEther('1'))

      // Check if merchant was debited the fee payment.
      expect(merchantBalance_post).toBeLessThan(merchantBalance_pre)
    })

    test('behavior: merchant fee sponsor (porto config)', async () => {
      const p = getPorto()
      const client = TestConfig.getRelayClient(p)
      const contracts = await TestConfig.getContracts(p)

      const merchantKey = Key.createSecp256k1()
      const merchantAccount = await createAccount(client, {
        deploy: true,
        keys: [merchantKey],
      })

      const listener = Route.merchant({
        ...p.config,
        address: merchantAccount.address,
        key: {
          privateKey: merchantKey.privateKey!(),
          type: merchantKey.type,
        },
      }).listener
      const server = await Http.createServer(listener)

      const porto = getPorto({ merchantUrl: server.url })

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: { createAccount: true },
          },
        ],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const userBalance_pre = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [address],
        functionName: 'balanceOf',
      })
      const merchantBalance_pre = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: contracts.exp1.abi,
                  args: [Hex.random(20), Value.fromEther('1')],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      const userBalance_post = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [address],
        functionName: 'balanceOf',
      })
      const merchantBalance_post = await readContract(client, {
        abi: contracts.exp1.abi,
        address: contracts.exp1.address,
        args: [merchantAccount.address],
        functionName: 'balanceOf',
      })

      // Check if user was debited 1 EXP.
      expect(userBalance_post).toBe(userBalance_pre - Value.fromEther('1'))

      // Check if merchant was debited the fee payment.
      expect(merchantBalance_post).toBeLessThan(merchantBalance_pre)
    })

    test('behavior: use inferred permissions', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            permissions: {
              calls: [{ to: contracts.exp1.address }],
              spend: [
                {
                  limit: Hex.fromNumber(Value.fromEther('50')),
                  period: 'day',
                  token: contracts.exp1.address,
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
                  abi: contracts.exp1.abi,
                  args: [alice, Value.fromEther('50')],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
              },
            ],
            from: address,
            version: '1',
          },
        ],
      })

      expect(id).toBeDefined()

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      expect(
        await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(Value.fromEther('50'))
    })

    test('behavior: `permissions` capability', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const permissions = await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            permissions: {
              calls: [{ to: contracts.exp1.address }],
              spend: [
                {
                  limit: Hex.fromNumber(69420),
                  period: 'day',
                  token: contracts.exp1.address,
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
                  abi: contracts.exp1.abi,
                  args: [alice, 40_000n],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
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

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      expect(
        await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(40_000n)
    })

    // TODO: remove condition once Anvil supports reverts on delegated accounts.
    test.runIf(type === 'relay')(
      'behavior: `permissions.calls` unauthorized',
      async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

        const {
          accounts: [account],
        } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: { createAccount: true },
            },
          ],
        })
        const address = account!.address

        await setBalance(client, {
          address,
          value: Value.fromEther('10000'),
        })

        const alice = '0x0000000000000000000000000000000000069422'

        const permissions = await porto.provider.request({
          method: 'wallet_grantPermissions',
          params: [
            {
              expiry: 9999999999,
              feeToken: {
                limit: '1',
                symbol: 'EXP',
              },
              permissions: {
                calls: [{ to: '0x0000000000000000000000000000000000000000' }],
                spend: [
                  {
                    limit: Hex.fromNumber(69420),
                    period: 'day',
                    token: contracts.exp1.address,
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
                      abi: contracts.exp1.abi,
                      args: [alice, 69420n],
                      functionName: 'mint',
                    }),
                    to: contracts.exp1.address,
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
    test.runIf(type === 'relay')(
      'behavior: `permissions.spend` exceeded',
      async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

        const {
          accounts: [account],
        } = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: { createAccount: true },
            },
          ],
        })
        const address = account!.address

        await setBalance(client, {
          address,
          value: Value.fromEther('10000'),
        })

        const alice = Hex.random(20)

        const permissions = await porto.provider.request({
          method: 'wallet_grantPermissions',
          params: [
            {
              expiry: 9999999999,
              feeToken: {
                limit: '1',
                symbol: 'EXP',
              },
              permissions: {
                calls: [{ to: contracts.exp1.address }],
                spend: [
                  {
                    limit: Hex.fromNumber(Value.fromEther('50')),
                    period: 'day',
                    token: contracts.exp1.address,
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
                    abi: contracts.exp1.abi,
                    args: [alice, Value.fromEther('50')],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
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
                      abi: contracts.exp1.abi,
                      args: [alice, Value.fromEther('200')],
                      functionName: 'transfer',
                    }),
                    to: contracts.exp1.address,
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
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const permissions = await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            permissions: {
              calls: [{ to: contracts.exp1.address }],
              spend: [
                {
                  limit: Hex.fromNumber(69420 * 3),
                  period: 'day',
                  token: contracts.exp1.address,
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
                  abi: contracts.exp1.abi,
                  args: [alice, 69420n],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
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

      await waitForCallsStatus(WalletClient.fromPorto(porto), {
        id,
      })

      expect(
        await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(69420n)

      await porto.provider.request({
        method: 'wallet_revokePermissions',
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
                    abi: contracts.exp1.abi,
                    args: [alice, 69420n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await setBalance(client, {
        address,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const { id } = await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            feeToken: {
              limit: '1',
              symbol: 'EXP',
            },
            key: {
              publicKey:
                '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
              type: 'p256',
            },
            permissions: {
              calls: [{ to: contracts.exp1.address }],
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
                    abi: contracts.exp1.abi,
                    args: [alice, 69420n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

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
                    abi: contracts.exp1.abi,
                    args: [alice, 69420n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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

    test.runIf(!Anvil.enabled && type === 'relay')(
      'behavior: required funds (address)',
      async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

        const {
          accounts: [account],
        } = await porto.provider.request({
          method: 'wallet_connect',
          params: [{ capabilities: { createAccount: true } }],
        })
        const address = account!.address

        const initialBalance = Value.fromEther('10000')
        await setBalance(client, {
          address,
          value: initialBalance,
        })

        const alice = Hex.random(20)
        const chainId_dest = TestConfig.chains[1]!.id

        const { id } = await porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: contracts.exp1.abi,
                    args: [alice, Value.fromEther('50')],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
                },
              ],
              capabilities: {
                // TODO: allow `requiredFunds` to be set without `feeToken`
                feeToken: contracts.exp1.address,
                requiredFunds: [
                  {
                    address: contracts.exp1.address,
                    value: Hex.fromNumber(Value.fromEther('50')),
                  },
                ],
              },
              chainId: Hex.fromNumber(chainId_dest),
              from: address,
              version: '1',
            },
          ],
        })

        expect(id).toBeDefined()

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id,
        })

        const balance = await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [address],
          functionName: 'balanceOf',
        })
        expect(balance).toBeLessThan(initialBalance)

        const client_dest = TestConfig.getRelayClient(porto, {
          chainId: chainId_dest,
        })

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

    test.runIf(!Anvil.enabled && type === 'relay')(
      'behavior: required funds (symbol)',
      async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

        const {
          accounts: [account],
        } = await porto.provider.request({
          method: 'wallet_connect',
          params: [{ capabilities: { createAccount: true } }],
        })
        const address = account!.address

        const initialBalance = Value.fromEther('10000')
        await setBalance(client, {
          address,
          value: initialBalance,
        })

        const alice = Hex.random(20)
        const chainId_dest = TestConfig.chains[1]!.id

        const { id } = await porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                {
                  data: encodeFunctionData({
                    abi: contracts.exp1.abi,
                    args: [alice, Value.fromEther('50')],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
                },
              ],
              capabilities: {
                // TODO: allow `requiredFunds` to be set without `feeToken`
                feeToken: contracts.exp1.address,
                requiredFunds: [
                  {
                    symbol: 'EXP',
                    value: '50',
                  },
                ],
              },
              chainId: Hex.fromNumber(chainId_dest),
              from: address,
              version: '1',
            },
          ],
        })

        expect(id).toBeDefined()

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id,
        })

        const balance = await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [address],
          functionName: 'balanceOf',
        })
        expect(balance).toBeLessThan(initialBalance)

        const client_dest = TestConfig.getRelayClient(porto, {
          chainId: chainId_dest,
        })

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

    test('behavior: no calls.to', async () => {
      const porto = getPorto()

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

      await expect(() =>
        porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: [
                // @ts-expect-error
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
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

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
                  abi: contracts.exp1.abi,
                  args: [alice, 69420n],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
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

  describe('wallet_getCallsStatus', () => {
    test('default', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

      const {
        accounts: [account],
      } = await porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      })
      const address = account!.address

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
                  abi: contracts.exp1.abi,
                  args: [alice, 69420n],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
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
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

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
                  feeToken: {
                    limit: '1',
                    symbol: 'EXP',
                  },
                  key: {
                    publicKey: publicKey,
                    type: 'p256',
                  },
                  permissions: {
                    calls: [{ to: contracts.exp1.address }],
                    spend: [
                      {
                        limit: Hex.fromNumber(42069n),
                        period: 'day',
                        token: contracts.exp1.address,
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
                    abi: contracts.exp1.abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: contracts.exp1.abi,
            address: contracts.exp1.address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })

      test('WebCryptoP256', async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

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
                  feeToken: {
                    limit: '1',
                    symbol: 'EXP',
                  },
                  key: {
                    publicKey: publicKey,
                    type: 'p256',
                  },
                  permissions: {
                    calls: [{ to: contracts.exp1.address }],
                    spend: [
                      {
                        limit: Hex.fromNumber(42069n),
                        period: 'day',
                        token: contracts.exp1.address,
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
                    abi: contracts.exp1.abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: contracts.exp1.abi,
            address: contracts.exp1.address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })

      test('Secp256k1', async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

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
                  feeToken: {
                    limit: '1',
                    symbol: 'EXP',
                  },
                  key: {
                    publicKey: address,
                    type: 'address',
                  },
                  permissions: {
                    calls: [{ to: contracts.exp1.address }],
                    spend: [
                      {
                        limit: Hex.fromNumber(42069n),
                        period: 'day',
                        token: contracts.exp1.address,
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
                    abi: contracts.exp1.abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: contracts.exp1.abi,
            address: contracts.exp1.address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })
    })

    describe('behavior: admin', () => {
      test('Secp256k1', async () => {
        const porto = getPorto()
        const client = TestConfig.getRelayClient(porto)
        const contracts = await TestConfig.getContracts(porto)

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
          method: 'wallet_grantAdmin',
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
                    abi: contracts.exp1.abi,
                    args: [alice, 40_000n],
                    functionName: 'transfer',
                  }),
                  to: contracts.exp1.address,
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
              signature: Signature.toHex(signature),
            },
          ],
        })

        await waitForCallsStatus(WalletClient.fromPorto(porto), {
          id: result[0]!.id,
        })

        expect(
          await readContract(client, {
            abi: contracts.exp1.abi,
            address: contracts.exp1.address,
            args: [alice],
            functionName: 'balanceOf',
          }),
        ).toBe(40_000n)
      })
    })

    test('behavior: sign typed data', async () => {
      const porto = getPorto()
      const client = TestConfig.getRelayClient(porto)
      const contracts = await TestConfig.getContracts(porto)

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

      const walletClient = WalletClient.fromPorto(porto, {
        account: accounts[0]!.address,
      })

      await setBalance(client, {
        address: accounts[0]?.address!,
        value: Value.fromEther('10000'),
      })

      const alice = Hex.random(20)

      const { typedData, ...request } = await porto.provider.request({
        method: 'wallet_prepareCalls',
        params: [
          {
            calls: [
              {
                data: encodeFunctionData({
                  abi: contracts.exp1.abi,
                  args: [alice, 40_000n],
                  functionName: 'transfer',
                }),
                to: contracts.exp1.address,
              },
            ],
          },
        ],
      })

      const signature = await signTypedData(walletClient, typedData as never)

      const result = await porto.provider.request({
        method: 'wallet_sendPreparedCalls',
        params: [
          {
            ...request,
            signature,
          },
        ],
      })

      await waitForCallsStatus(walletClient, {
        id: result[0]!.id,
      })

      expect(
        await readContract(client, {
          abi: contracts.exp1.abi,
          address: contracts.exp1.address,
          args: [alice],
          functionName: 'balanceOf',
        }),
      ).toBe(40_000n)
    })
  })

  test('behavior: fall through', async () => {
    const porto = getPorto()
    expect(
      await porto.provider.request({
        method: 'eth_blockNumber',
      }),
    ).toBeDefined()
  })

  test('behavior: unsupported wallet_ method', async () => {
    const porto = getPorto()
    await expect(() =>
      porto.provider.request({
        method: 'wallet_lol',
      }),
    ).rejects.toThrowError(
      'The provider does not support the requested method.',
    )
  })

  test('behavior: invalid params', async () => {
    const porto = getPorto()
    await porto.provider.request({
      method: 'wallet_connect',
      params: [{ capabilities: { createAccount: true } }],
    })
    await expect(() =>
      porto.provider.request({
        method: 'eth_sendTransaction',
        // @ts-expect-error
        params: [{ to: 1 }],
      }),
    ).rejects.matchSnapshot()
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
