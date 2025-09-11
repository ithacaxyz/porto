import { setTimeout } from 'node:timers/promises'
import { Value } from 'ox'
import { Key } from 'porto/viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import * as Actions from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { setBalance } from '../../test/src/actions.js'
import * as TestConfig from '../../test/src/config.js'
import * as WalletActions from './WalletActions.js'

describe('connect', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    expect(porto._internal.store.getState().accounts.length).toBe(0)

    const walletClient = TestConfig.getWalletClient(porto)
    const response = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    expect(response.accounts.length).toBe(1)

    expect(porto._internal.store.getState().accounts.length).toBe(1)
  })
})

describe('disconnect', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const walletClient = TestConfig.getWalletClient(porto)
    await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    expect(porto._internal.store.getState().accounts.length).toBe(1)
    await WalletActions.disconnect(walletClient)
    expect(porto._internal.store.getState().accounts.length).toBe(0)
  })
})

describe('grantAdmin', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(relayClient, {
      address: account!.address,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)

    const response = await WalletActions.grantAdmin(walletClient, {
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(2)

    expect({
      ...response,
      address: null,
      chainId: null,
    }).toMatchInlineSnapshot(`
      {
        "address": null,
        "chainId": null,
        "key": {
          "id": "0x0000000000000000000000000000000000000000",
          "publicKey": "0x0000000000000000000000000000000000000000",
          "type": "address",
        },
      }
    `)
  })
})

describe('grantPermissions', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()

    const walletClient = TestConfig.getWalletClient(porto)
    await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)

    const response = await WalletActions.grantPermissions(walletClient, {
      expiry: 99999999999,
      feeToken: {
        limit: '1',
        symbol: 'EXP',
      },
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
      permissions: {
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(2)

    expect({
      ...response,
      address: null,
      capabilities: null,
      chainId: null,
      permissions: {
        ...response.permissions,
        spend: response.permissions?.spend?.map((x) => ({
          ...x,
          token: null,
        })),
      },
    }).toMatchInlineSnapshot(`
      {
        "address": null,
        "capabilities": null,
        "chainId": null,
        "expiry": 99999999999,
        "id": "0x0000000000000000000000000000000000000000",
        "key": {
          "publicKey": "0x0000000000000000000000000000000000000000",
          "type": "address",
        },
        "permissions": {
          "calls": [
            {
              "to": "0x0000000000000000000000000000000000000000",
            },
          ],
          "spend": [
            {
              "limit": 1000000000000000000n,
              "period": "year",
              "token": null,
            },
          ],
        },
      }
    `)
  })
})

describe('getAdmins', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(relayClient, {
      address: account!.address,
    })

    await WalletActions.grantAdmin(walletClient, {
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
    })

    {
      const response = await WalletActions.getAdmins(walletClient)
      const [, key] = response.keys
      expect(key).toMatchInlineSnapshot(`
        {
          "id": "0x0000000000000000000000000000000000000000",
          "publicKey": "0x0000000000000000000000000000000000000000",
          "type": "address",
        }
      `)
    }
  })
})

describe('getPermissions', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const walletClient = TestConfig.getWalletClient(porto)
    await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)

    {
      const response = await WalletActions.getPermissions(walletClient)
      expect(response).toMatchInlineSnapshot('[]')
    }

    await WalletActions.grantPermissions(walletClient, {
      expiry: 99999999999,
      feeToken: {
        limit: '1',
        symbol: 'EXP',
      },
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
      permissions: {
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
    })

    {
      const [response] = await WalletActions.getPermissions(walletClient)
      expect({
        ...response,
        address: null,
        chainId: null,
        permissions: {
          ...response!.permissions,
          spend: response!.permissions?.spend?.map((x) => ({
            ...x,
            token: null,
          })),
        },
      }).toMatchInlineSnapshot(`
        {
          "address": null,
          "chainId": null,
          "expiry": 99999999999,
          "id": "0x0000000000000000000000000000000000000000",
          "key": {
            "publicKey": "0x0000000000000000000000000000000000000000",
            "type": "address",
          },
          "permissions": {
            "calls": [
              {
                "to": "0x0000000000000000000000000000000000000000",
              },
            ],
            "spend": [
              {
                "limit": 1000000000000000000n,
                "period": "year",
                "token": null,
              },
            ],
          },
        }
      `)
    }
  })
})

describe('revokeAdmin', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })
    await setBalance(relayClient, {
      address: account!.address,
    })

    const { key } = await WalletActions.grantAdmin(walletClient, {
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(2)

    await WalletActions.revokeAdmin(walletClient, {
      id: key.publicKey,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)
  })
})

describe('revokePermissions', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })
    await setBalance(relayClient, {
      address: account!.address,
    })

    const { id } = await WalletActions.grantPermissions(walletClient, {
      expiry: 99999999999,
      feeToken: {
        limit: '1',
        symbol: 'EXP',
      },
      permissions: {
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(2)

    await WalletActions.revokePermissions(walletClient, {
      id,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)
  })
})

describe('upgradeAccount', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const account = privateKeyToAccount(generatePrivateKey())

    await setBalance(relayClient, {
      address: account!.address,
    })

    await WalletActions.upgradeAccount(walletClient, {
      account,
    })
  })
})

describe('prepareCalls + sendPreparedCalls', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const contracts = await TestConfig.getContracts(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const sessionKey = Key.createSecp256k1()

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
      grantPermissions: {
        expiry: 9999999999,
        feeToken: {
          limit: '1',
          symbol: 'EXP',
        },
        key: sessionKey,
        permissions: {
          calls: [{ to: contracts.exp1.address }],
          spend: [
            {
              limit: 1000000000000n,
              period: 'day',
              token: contracts.exp1.address,
            },
          ],
        },
      },
    })

    await setBalance(relayClient, {
      address: account!.address,
      value: Value.fromEther('10000'),
    })

    const request = await WalletActions.prepareCalls(walletClient, {
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [account!.address, Value.fromEther('1')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
      key: sessionKey,
    })

    const signature = await Key.sign(sessionKey, {
      address: null,
      payload: request.digest,
      wrap: false,
    })

    const response = await WalletActions.sendPreparedCalls(walletClient, {
      ...request,
      signature,
    })

    expect(response[0]!.id).toBeDefined()

    const { status } = await Actions.waitForCallsStatus(walletClient, {
      id: response[0]!.id,
    })
    await setTimeout(2_000)

    expect(status).toBe('success')
  })

  test('behavior: admin key', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const contracts = await TestConfig.getContracts(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const adminKey = Key.createSecp256k1()

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
      grantAdmins: [adminKey],
    })

    await setBalance(relayClient, {
      address: account!.address,
      value: Value.fromEther('10000'),
    })

    const request = await WalletActions.prepareCalls(walletClient, {
      calls: [
        {
          abi: contracts.exp1.abi,
          args: [account!.address, Value.fromEther('1')],
          functionName: 'mint',
          to: contracts.exp1.address,
        },
      ],
      key: adminKey,
    })

    const signature = await Key.sign(adminKey, {
      address: null,
      payload: request.digest,
      wrap: false,
    })

    const response = await WalletActions.sendPreparedCalls(walletClient, {
      ...request,
      signature,
    })

    expect(response[0]!.id).toBeDefined()

    const { status } = await Actions.waitForCallsStatus(walletClient, {
      id: response[0]!.id,
    })

    expect(status).toBe('success')
  })

  test('behavior: sign typed data', async () => {
    const porto = TestConfig.getPorto()
    const contracts = await TestConfig.getContracts(porto)
    const walletClient = TestConfig.getWalletClient(porto)
    const relayClient = TestConfig.getRelayClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(relayClient, {
      address: account!.address,
    })

    const request = await WalletActions.prepareCalls(walletClient, {
      calls: [
        {
          abi: contracts.exp2.abi,
          args: [account!.address, Value.fromEther('1')],
          functionName: 'mint',
          to: contracts.exp2.address,
        },
      ],
    })

    const signature = await Actions.signTypedData(walletClient, {
      account: account!.address,
      ...request.typedData,
    })

    const response = await WalletActions.sendPreparedCalls(walletClient, {
      ...request,
      signature,
    })

    expect(response[0]!.id).toBeDefined()

    const { status } = await Actions.waitForCallsStatus(walletClient, {
      id: response[0]!.id,
    })

    expect(status).toBe('success')
  })
})

describe('getAssets', () => {
  test('default', async () => {
    const porto = TestConfig.getPorto()
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    const result = await WalletActions.getAssets(walletClient, {
      account: account!.address,
    })

    expect(result).toBeDefined()
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(1)
  })

  test('behavior: no params (account exists on client)', async () => {
    const porto = TestConfig.getPorto()

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

    const walletClient = TestConfig.getWalletClient(porto, {
      account: account!.address,
    })

    const result = await WalletActions.getAssets(walletClient)

    expect(result).toBeDefined()
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(1)
  })

  test('behavior: with chainFilter', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(relayClient, {
      address: account!.address,
      value: Value.fromEther('50'),
    })

    const result = await WalletActions.getAssets(walletClient, {
      account: account!.address,
      chainFilter: [relayClient.chain.id],
    })

    expect(Object.keys(result)).toEqual(['0', relayClient.chain.id.toString()])
    expect(result[relayClient.chain.id]).toBeDefined()
  })

  test('behavior: with assetTypeFilter', async () => {
    const porto = TestConfig.getPorto()
    const relayClient = TestConfig.getRelayClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(relayClient, {
      address: account!.address,
      value: Value.fromEther('10'),
    })

    const nativeResult = await WalletActions.getAssets(walletClient, {
      account: account!.address,
      assetTypeFilter: ['native'],
    })

    const nativeAssets = nativeResult[0]
    expect(nativeAssets?.every((asset) => asset.type === 'native')).toBe(true)

    const erc20Result = await WalletActions.getAssets(walletClient, {
      account: account!.address,
      assetTypeFilter: ['erc20'],
    })

    const erc20Assets = erc20Result[0]
    expect(erc20Assets?.every((asset) => asset.type === 'erc20')).toBe(true)
  })

  test('error: account not found', async () => {
    const porto = TestConfig.getPorto()
    const walletClient = TestConfig.getWalletClient(porto)

    // @ts-expect-error
    await expect(WalletActions.getAssets(walletClient)).rejects.toThrow(
      'account is required',
    )
  })
})
