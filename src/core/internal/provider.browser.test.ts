import type { Porto } from 'porto'
import { waitForCallsStatus } from 'viem/actions'
import { afterEach, describe, expect, test } from 'vitest'
import { getPorto } from '../../../test/src/browser/porto.js'
import { run } from '../../../test/src/browser/utils.js'
import * as WalletClient from '../../viem/WalletClient.js'

let porto: Porto.Porto | undefined
afterEach(() => {
  porto?.destroy()
  window.localStorage.clear()
  window.sessionStorage.clear()
  // biome-ignore lint/suspicious/noDocumentCookie: do what i want
  document.cookie = ''
})

describe('eth_accounts', () => {
  test('default', async () => {
    porto = getPorto()

    await run(porto.provider.request({ method: 'wallet_connect' }), (iframe) =>
      iframe.getByTestId('sign-up').click(),
    )

    const accounts = await run(
      porto.provider.request({
        method: 'eth_accounts',
      }),
    )
    expect(accounts.length).toBe(1)
  })

  test('behavior: disconnected', async () => {
    porto = getPorto()

    await expect(
      porto.provider.request({
        method: 'eth_accounts',
      }),
    ).rejects.toThrowError()
  })
})

describe('wallet_connect', () => {
  test('sign up', async () => {
    porto = getPorto()

    const { accounts } = await run(
      porto.provider.request({ method: 'wallet_connect' }),
      (iframe) => iframe.getByTestId('sign-up').click(),
    )
    expect(accounts.length).toBe(1)
  })

  test('sign in', async () => {
    porto = getPorto()

    await run(
      porto.provider.request({
        method: 'wallet_connect',
        params: [{ capabilities: { createAccount: true } }],
      }),
      (iframe) => iframe.getByTestId('sign-up').click(),
    )
    await run(porto.provider.request({ method: 'wallet_disconnect' }))

    const { accounts } = await run(
      porto.provider.request({ method: 'wallet_connect' }),
      (iframe) => iframe.getByTestId('sign-in').click(),
    )
    expect(accounts.length).toBe(1)
  })
})

describe('wallet_disconnect', () => {
  test('default', async () => {
    porto = getPorto()

    await run(porto.provider.request({ method: 'wallet_connect' }), (iframe) =>
      iframe.getByTestId('sign-up').click(),
    )

    const messages: any[] = []
    porto.provider.on('disconnect', (message) => messages.push(message))

    await run(porto.provider.request({ method: 'wallet_disconnect' }))

    await expect(
      run(porto.provider.request({ method: 'eth_accounts' })),
    ).rejects.toThrowError()

    const accounts2 = porto._internal.store.getState().accounts
    expect(accounts2.length).toBe(0)
    expect(messages).toMatchInlineSnapshot(`
      [
        [Provider.DisconnectedError: The provider is disconnected from all chains.],
      ]
    `)
  })
})

describe('wallet_getAdmins', () => {
  test('default', async () => {
    porto = getPorto()

    await run(porto.provider.request({ method: 'wallet_connect' }), (iframe) =>
      iframe.getByTestId('sign-up').click(),
    )

    const { address, keys } = await porto.provider.request({
      method: 'wallet_getAdmins',
    })
    expect(address).toBeDefined()
    expect(keys.length).toBe(1)
  })

  test('behavior: disconnect > connect > getAdmins', async () => {
    porto = getPorto()

    await run(porto.provider.request({ method: 'wallet_connect' }), (iframe) =>
      iframe.getByTestId('sign-up').click(),
    )

    await run(porto.provider.request({ method: 'wallet_disconnect' }))

    await run(porto.provider.request({ method: 'wallet_connect' }), (iframe) =>
      iframe.getByTestId('sign-in').click(),
    )

    const { address, keys } = await porto.provider.request({
      method: 'wallet_getAdmins',
    })
    expect(address).toBeDefined()
    expect(keys.length).toBe(1)
  })
})

describe('wallet_getPermissions', () => {
  test('default', async () => {
    porto = getPorto()

    await run(
      porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              grantPermissions: {
                expiry: 9999999999,
                permissions: {
                  calls: [{ signature: 'mint()' }],
                },
              },
            },
          },
        ],
      }),
      (iframe) => iframe.getByTestId('sign-up').click(),
    )

    await run(
      porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            permissions: { calls: [{ signature: 'mint()' }] },
          },
        ],
      }),
      (iframe) => iframe.getByTestId('grant').click(),
    )

    const permissions = await run(
      porto.provider.request({
        method: 'wallet_getPermissions',
      }),
    )
    expect(permissions.length).toBe(2)
  })

  test('behavior: grant on connect; grant another; get after connect', async () => {
    porto = getPorto()

    await run(
      porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
              grantPermissions: {
                expiry: 9999999999,
                key: {
                  publicKey: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
                  type: 'secp256k1',
                },
                permissions: {
                  calls: [{ signature: 'mint()' }],
                },
              },
            },
          },
        ],
      }),
      (iframe) => iframe.getByTestId('sign-up').click(),
    )

    await run(
      porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            expiry: 9999999999,
            key: {
              publicKey:
                '0xcafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe',
              type: 'p256',
            },
            permissions: {
              calls: [{ signature: 'mint()' }],
            },
          },
        ],
      }),
      (iframe) => iframe.getByTestId('grant').click(),
    )

    {
      const permissions = await porto.provider.request({
        method: 'wallet_getPermissions',
      })
      expect(
        permissions.map((x) => ({ ...x, address: null, chainId: null })),
      ).matchSnapshot()
    }

    const { id } = await run(
      porto.provider.request({
        method: 'wallet_sendCalls',
        params: [{ calls: [] }],
      }),
      async (iframe) => {
        await iframe.getByTestId('add-funds').click()
        await iframe.getByTestId('buy').click()
        await iframe.getByTestId('confirm').click()
      },
    )
    await waitForCallsStatus(WalletClient.fromPorto(porto), {
      id,
    })

    {
      const permissions = await porto.provider.request({
        method: 'wallet_getPermissions',
      })
      expect(
        permissions.map((x) => ({ ...x, address: null, chainId: null })),
      ).matchSnapshot()
    }
  })
})
