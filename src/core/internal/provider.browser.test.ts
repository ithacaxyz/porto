import type { Porto } from 'porto'
import { afterEach, describe, expect, test } from 'vitest'
import { getPorto } from '../../../test/src/browser/porto.js'
import { run } from '../../../test/src/browser/utils.js'

let porto: Porto.Porto | undefined
afterEach(() => porto?.destroy())

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
      porto.provider.request({ method: 'wallet_createAccount' }),
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

describe('wallet_createAccount', () => {
  test('default', async () => {
    porto = getPorto()

    const { address } = await run(
      porto.provider.request({ method: 'wallet_createAccount' }),
      (iframe) => iframe.getByTestId('sign-up').click(),
    )
    expect(address).toBeDefined()
  })
})
