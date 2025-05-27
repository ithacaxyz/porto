import { expect, test } from 'vitest'

import { getIframe, porto } from '../utils.browser.js'

test('sign up', async () => {
  const result = await (async () => {
    const promise = porto.provider.request({ method: 'wallet_connect' })

    const iframe = getIframe()
    await iframe.getByTestId('sign-up').click()

    return promise
  })()

  expect(result.accounts).toBeDefined()
})
