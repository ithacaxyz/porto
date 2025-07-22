import { Value } from 'ox'
import { Key, ServerActions } from 'porto/viem'
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
    const serverClient = TestConfig.getServerClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(serverClient, {
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
      feeLimit: {
        currency: 'USD',
        value: '1',
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
    const serverClient = TestConfig.getServerClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(serverClient, {
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
      feeLimit: {
        currency: 'USD',
        value: '1',
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
    const serverClient = TestConfig.getServerClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })
    await setBalance(serverClient, {
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
    const serverClient = TestConfig.getServerClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })
    await setBalance(serverClient, {
      address: account!.address,
    })

    const { id } = await WalletActions.grantPermissions(walletClient, {
      expiry: 99999999999,
      feeLimit: {
        currency: 'USD',
        value: '1',
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
    const serverClient = TestConfig.getServerClient(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const account = privateKeyToAccount(generatePrivateKey())

    await setBalance(serverClient, {
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
    const serverClient = TestConfig.getServerClient(porto)
    const contracts = TestConfig.getContracts(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const sessionKey = Key.createSecp256k1()

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
      grantPermissions: {
        expiry: 9999999999,
        feeLimit: {
          currency: 'USD',
          value: '1',
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

    await setBalance(serverClient, {
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

  test('behavior: admin key', async () => {
    const porto = TestConfig.getPorto()
    const serverClient = TestConfig.getServerClient(porto)
    const contracts = TestConfig.getContracts(porto)
    const walletClient = TestConfig.getWalletClient(porto)

    const adminKey = Key.createSecp256k1()

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
      grantAdmins: [adminKey],
    })

    await setBalance(serverClient, {
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
    const contracts = TestConfig.getContracts(porto)
    const walletClient = TestConfig.getWalletClient(porto)
    const serverClient = TestConfig.getServerClient(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(walletClient, {
      createAccount: true,
    })

    await setBalance(serverClient, {
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

    const { valid } = await ServerActions.verifySignature(serverClient, {
      address: account!.address,
      digest: request.digest,
      signature,
    })
    expect(valid).toBe(true)

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
