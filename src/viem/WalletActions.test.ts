import { Value } from 'ox'
import { Key, ServerActions, WalletClient } from 'porto/viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import * as Actions from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { setBalance } from '../../test/src/actions.js'
import {
  exp1Abi,
  exp1Address,
  exp2Abi,
  exp2Address,
  getPorto,
} from '../../test/src/porto.js'
import * as WalletActions from './WalletActions.js'

describe('connect', () => {
  test('default', async () => {
    const { porto } = getPorto()
    expect(porto._internal.store.getState().accounts.length).toBe(0)

    const client = WalletClient.fromPorto(porto)
    const response = await WalletActions.connect(client, {
      createAccount: true,
    })

    expect(response.accounts.length).toBe(1)

    expect(porto._internal.store.getState().accounts.length).toBe(1)
  })
})

describe('disconnect', () => {
  test('default', async () => {
    const { porto } = getPorto()
    const client = WalletClient.fromPorto(porto)
    await WalletActions.connect(client, {
      createAccount: true,
    })

    expect(porto._internal.store.getState().accounts.length).toBe(1)
    await WalletActions.disconnect(client)
    expect(porto._internal.store.getState().accounts.length).toBe(0)
  })
})

describe('grantAdmin', () => {
  test('default', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
    })

    await setBalance(serverClient, {
      address: account!.address,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)

    const response = await WalletActions.grantAdmin(client, {
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
    const { porto } = getPorto()
    const client = WalletClient.fromPorto(porto)
    await WalletActions.connect(client, {
      createAccount: true,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)

    const response = await WalletActions.grantPermissions(client, {
      expiry: 99999999999,
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
              "token": "0x8ce361602b935680e8dec218b820ff5056beb7af",
            },
          ],
        },
      }
    `)
  })
})

describe('getAdmins', () => {
  test('default', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
    })

    await setBalance(serverClient, {
      address: account!.address,
    })

    await WalletActions.grantAdmin(client, {
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
    })

    {
      const response = await WalletActions.getAdmins(client)
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
    const { porto } = getPorto()
    const client = WalletClient.fromPorto(porto)
    await WalletActions.connect(client, {
      createAccount: true,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)

    {
      const response = await WalletActions.getPermissions(client)
      expect(response).toMatchInlineSnapshot('[]')
    }

    await WalletActions.grantPermissions(client, {
      expiry: 99999999999,
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
      const [response] = await WalletActions.getPermissions(client)
      expect({
        ...response,
        address: null,
        chainId: null,
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
                "token": "0x8ce361602b935680e8dec218b820ff5056beb7af",
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
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
    })
    await setBalance(serverClient, {
      address: account!.address,
    })

    const { key } = await WalletActions.grantAdmin(client, {
      key: {
        publicKey: '0x0000000000000000000000000000000000000000',
        type: 'address',
      },
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(2)

    await WalletActions.revokeAdmin(client, {
      id: key.publicKey,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)
  })
})

describe('revokePermissions', () => {
  test('default', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
    })
    await setBalance(serverClient, {
      address: account!.address,
    })

    const { id } = await WalletActions.grantPermissions(client, {
      expiry: 99999999999,
      permissions: {
        calls: [
          {
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(2)

    await WalletActions.revokePermissions(client, {
      id,
    })

    expect(porto._internal.store.getState().accounts[0]!.keys?.length).toBe(1)
  })
})

describe('upgradeAccount', () => {
  test('default', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const account = privateKeyToAccount(generatePrivateKey())

    await setBalance(serverClient, {
      address: account!.address,
    })

    await WalletActions.upgradeAccount(client, {
      account,
    })
  })
})

describe('prepareCalls + sendPreparedCalls', () => {
  test('default', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const sessionKey = Key.createSecp256k1()

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
      grantPermissions: {
        expiry: 9999999999,
        key: sessionKey,
        permissions: {
          calls: [{ to: exp1Address }],
          spend: [
            {
              limit: 1000000000000n,
              period: 'day',
              token: exp1Address,
            },
          ],
        },
      },
    })

    await setBalance(serverClient, {
      address: account!.address,
      value: Value.fromEther('10000'),
    })

    const request = await WalletActions.prepareCalls(client, {
      calls: [
        {
          abi: exp1Abi,
          args: [account!.address, Value.fromEther('1')],
          functionName: 'mint',
          to: exp1Address,
        },
      ],
      key: sessionKey,
    })

    const signature = await Key.sign(sessionKey, {
      payload: request.digest,
      wrap: false,
    })

    const response = await WalletActions.sendPreparedCalls(client, {
      ...request,
      signature,
    })

    expect(response[0]!.id).toBeDefined()

    const { status } = await Actions.waitForCallsStatus(client, {
      id: response[0]!.id,
    })

    expect(status).toBe('success')
  })

  test('behavior: admin key', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const adminKey = Key.createSecp256k1()

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
      grantAdmins: [adminKey],
    })

    await setBalance(serverClient, {
      address: account!.address,
      value: Value.fromEther('10000'),
    })

    const request = await WalletActions.prepareCalls(client, {
      calls: [
        {
          abi: exp1Abi,
          args: [account!.address, Value.fromEther('1')],
          functionName: 'mint',
          to: exp1Address,
        },
      ],
      key: adminKey,
    })

    const signature = await Key.sign(adminKey, {
      payload: request.digest,
      wrap: false,
    })

    const response = await WalletActions.sendPreparedCalls(client, {
      ...request,
      signature,
    })

    expect(response[0]!.id).toBeDefined()

    const { status } = await Actions.waitForCallsStatus(client, {
      id: response[0]!.id,
    })

    expect(status).toBe('success')
  })

  test('behavior: sign typed data', async () => {
    const { client: serverClient, porto } = getPorto()
    const client = WalletClient.fromPorto(porto)

    const {
      accounts: [account],
    } = await WalletActions.connect(client, {
      createAccount: true,
    })

    await setBalance(serverClient, {
      address: account!.address,
    })

    const request = await WalletActions.prepareCalls(client, {
      calls: [
        {
          abi: exp2Abi,
          args: [account!.address, Value.fromEther('1')],
          functionName: 'mint',
          to: exp2Address,
        },
      ],
    })

    const signature = await Actions.signTypedData(client, {
      account: account!.address,
      ...request.typedData,
    })

    const { valid } = await ServerActions.verifySignature(serverClient, {
      address: account!.address,
      digest: request.digest,
      signature,
    })
    expect(valid).toBe(true)

    const response = await WalletActions.sendPreparedCalls(client, {
      ...request,
      signature,
    })

    expect(response[0]!.id).toBeDefined()

    const { status } = await Actions.waitForCallsStatus(client, {
      id: response[0]!.id,
    })

    expect(status).toBe('success')
  })
})
