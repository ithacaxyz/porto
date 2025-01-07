import { Hex, Value } from 'ox'
import { Porto } from 'porto'
import { getBalance, setBalance } from 'viem/actions'
import { describe, expect, test } from 'vitest'

import { createPorto, delegation } from '../../../test/src/porto.js'

describe('eth_accounts', () => {
  test('default', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'wallet_disconnect',
    })
    await porto.provider.request({
      method: 'wallet_connect',
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

test('smoke', async () => {
  const porto = createPorto()
  const code = await porto.provider.request({
    method: 'eth_getCode',
    params: [delegation, 'latest'],
  })
  expect(code).toMatchSnapshot()
})
