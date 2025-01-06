import { describe, expect, test } from 'vitest'

import { delegation, porto } from '../../../test/src/porto.js'

describe('eth_accounts', () => {
  test('behavior: disconnected', async () => {
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
    const account = await porto.provider.request({
      method: 'experimental_createAccount',
    })
    expect(account).toBeDefined()
  })
})

describe('eth_requestAccounts', () => {
  test('default', async () => {
    const accounts = await porto.provider.request({
      method: 'eth_requestAccounts',
    })
    expect(accounts.length).toBeGreaterThan(0)
  })
})

test('smoke', async () => {
  const code = await porto.provider.request({
    method: 'eth_getCode',
    params: [delegation, 'latest'],
  })
  expect(code).toMatchSnapshot()
})
