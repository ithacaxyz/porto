import { expect, test } from 'vitest'

import { porto, run, waitFor } from '../utils.browser.js'

const method = 'wallet_connect'

test('default', async () => {
  const { result } = run(async ({ getIframe }) => {
    const promise = porto.provider.request({ method })

    const iframe = getIframe()
    await iframe.getByTestId('sign-up').click()

    return promise
  })

  await waitFor(() => expect(result.current.result?.accounts).toBeDefined())
})
