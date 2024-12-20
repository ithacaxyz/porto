import { commands } from '@vitest/browser/context'
import { expect, test } from 'vitest'

import { getPorto, run, waitFor } from './test-utils.js'

test('default', async () => {
  const authenticatorId = await commands.addVirtualAuthenticator({
    isUserConsenting: true,
  })

  const porto = getPorto()
  const method = 'experimental_createAccount'
  const { result } = run(() => porto.provider.request({ method }), {
    name: method,
  })

  await waitFor(() => expect(result.current).not.toBeNull())

  const credentials = await commands.getCredentials(authenticatorId)
  expect(credentials).toHaveLength(1)

  await expect(
    porto.provider.request({ method: 'eth_accounts' }),
  ).resolves.toEqual([result.current])
})
