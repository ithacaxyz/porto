import { describe, expect, test } from 'vitest'

import { createPorto, delegation } from '../../../test/src/porto.js'

describe('eth_accounts', () => {
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

describe('experimental_createAccount', () => {
  test('default', async () => {
    const porto = createPorto()
    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    expect(account).toBeDefined()
  })
})

describe('eth_requestAccounts', () => {
  test('default', async () => {
    const porto = createPorto()
    await porto.provider.request({
      method: 'experimental_createAccount',
    })
    await porto.provider.request({
      method: 'experimental_disconnect',
    })
    const accounts = await porto.provider.request({
      method: 'eth_requestAccounts',
    })
    expect(accounts.length).toBeGreaterThan(0)
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
