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

test('smoke', async () => {
  const code = await porto.provider.request({
    method: 'eth_getCode',
    params: [delegation, 'latest'],
  })
  expect(code).toMatchSnapshot()
})
