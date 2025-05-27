import { expect, test } from 'vitest'

import { porto, run, waitFor } from '../utils.browser.js'

test('sign up', async () => {
  const { result } = run(async ({ getIframe }) => {
    const promise = porto.provider.request({ method: 'wallet_connect' })

    const iframe = getIframe()
    await iframe.getByTestId('sign-up').click()

    return promise
  })

  await waitFor(() => expect(result.current.result?.accounts).toBeDefined())
})
