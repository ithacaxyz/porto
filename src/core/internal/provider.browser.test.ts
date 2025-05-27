import { describe, expect, test } from 'vitest'

import { porto, run } from '../../../test/utils.browser.js'

describe('wallet_connect', () => {
  test('sign up', async () => {
    const { accounts } = await run(
      porto.provider.request({ method: 'wallet_connect' }),
      (iframe) => iframe.getByTestId('sign-up').click(),
    )
    expect(accounts.length).toBe(1)
  })
})
