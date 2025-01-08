import { Hex, P256, PublicKey, Value } from 'ox'
import { Porto } from 'porto'
import { getBalance, setBalance, verifyMessage } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { createPorto, delegation } from '../../../test/src/porto.js'

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
    const client = Porto.getClient(porto).extend(() => ({ mode: 'anvil' }))

    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address: account,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069420'

    const hash = await porto.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: account,
          to: alice,
          value: Hex.fromNumber(69420),
        },
      ],
    })

    expect(hash).toBeDefined()
    expect(await getBalance(client, { address: alice })).toBe(69420n)
  })
})

describe('experimental_authorizeKey', () => {
  test('default', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('message', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'experimental_authorizeKey',
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
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": true,
          "expiry": null,
          "privateKey": CryptoKey {},
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].type).toBe('keysChanged')
    expect(messages[0].data.length).toBe(2)
  })

  test('behavior: provided key', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('message', (message) => messages.push(message))

    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'experimental_authorizeKey',
      params: [
        {
          key: {
            publicKey:
              '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
            role: 'session',
            type: 'p256',
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
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": false,
          "expiry": null,
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].type).toBe('keysChanged')
    expect(messages[0].data.length).toBe(2)
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

describe('experimental_keys', () => {
  test('default', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'experimental_authorizeKey',
    })
    const keys = await porto.provider.request({
      method: 'experimental_keys',
    })
    expect(keys.length).toBe(2)
    expect(
      keys.map((x) => ({ ...x, expiry: null, publicKey: null })),
    ).toMatchInlineSnapshot(`
      [
        {
          "expiry": null,
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "expiry": null,
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)
  })
})

describe('personal_sign', () => {
  test('default', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto)
    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    const signature = await porto.provider.request({
      method: 'personal_sign',
      params: [Hex.fromString('hello'), account],
    })
    expect(signature).toBeDefined()

    const valid = await verifyMessage(client, {
      address: account,
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
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
  })

  test('behavior: `createAccount` + `authorizeKey` capability', async () => {
    const messages: any[] = []

    const porto = createPorto()
    porto.provider.on('connect', (message) => messages.push(message))

    await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
            authorizeKey: true,
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
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": true,
          "expiry": null,
          "privateKey": CryptoKey {},
          "publicKey": null,
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
  })

  test('behavior: `createAccount` + `authorizeKey` capability (provided key)', async () => {
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
            authorizeKey: {
              publicKey,
              role: 'session',
              type: 'p256',
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
          "privateKey": [Function],
          "publicKey": null,
          "role": "admin",
          "type": "p256",
        },
        {
          "canSign": false,
          "expiry": 694206942069,
          "publicKey": "0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e",
          "role": "session",
          "type": "p256",
        },
      ]
    `)

    expect(messages[0].chainId).toBe(Hex.fromNumber(1))
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
    const client = Porto.getClient(porto).extend(() => ({ mode: 'anvil' }))

    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address: account,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069421'

    const hash = await porto.provider.request({
      method: 'wallet_sendCalls',
      params: [
        {
          from: account,
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

  test('behavior: `key` capability', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({ mode: 'anvil' }))

    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address: account,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069422'

    const key = await porto.provider.request({
      method: 'experimental_authorizeKey',
    })
    const hash = await porto.provider.request({
      method: 'wallet_sendCalls',
      params: [
        {
          capabilities: {
            key,
          },
          from: account,
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

  test('behavior: not provider-managed key', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({ mode: 'anvil' }))

    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address: account,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069421'

    const key = await porto.provider.request({
      method: 'experimental_authorizeKey',
      params: [
        {
          key: {
            publicKey:
              '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
            role: 'session',
            type: 'p256',
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
              key,
            },
            from: account,
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
      '[Error: key (publicKey: 0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e) does not exist or is not a provider-managed key.]',
    )
  })

  test('behavior: key does not exist', async () => {
    const porto = createPorto()
    const client = Porto.getClient(porto).extend(() => ({ mode: 'anvil' }))

    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await setBalance(client, {
      address: account,
      value: Value.fromEther('10000'),
    })

    const alice = '0x0000000000000000000000000000000000069421'

    await expect(() =>
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            capabilities: {
              key: {
                publicKey:
                  '0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e',
              },
            },
            from: account,
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
      '[Error: key (publicKey: 0x86a0d77beccf47a0a78cccfc19fdfe7317816740c9f9e6d7f696a02b0c66e0e21744d93c5699e9ce658a64ce60df2f32a17954cd577c713922bf62a1153cf68e) does not exist or is not a provider-managed key.]',
    )
  })
})

test('smoke', async () => {
  const porto = createPorto()
  const code = await porto.provider.request({
    method: 'eth_getCode',
    params: [delegation, 'latest'],
  })
  expect(code).toMatchSnapshot()
})
