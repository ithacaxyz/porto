import { WalletClient } from 'porto/viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { describe, expect, test } from 'vitest'
import { setBalance } from '../../test/src/actions.js'
import { getPorto } from '../../test/src/porto.js'
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
      expect(response).toMatchInlineSnapshot(`[]`)
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
