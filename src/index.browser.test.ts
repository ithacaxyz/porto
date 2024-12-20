import { commands } from '@vitest/browser/context'
import { describe, expect, test } from 'vitest'

import { getPorto, run, waitFor } from './test-utils.js'

// TODO
// - CI setup
// - experimental_connect test

describe('`experimental_createAccount`', () => {
  const method = 'experimental_createAccount'

  test('default', async () => {
    const authenticatorId = await commands.addVirtualAuthenticator()

    const porto = getPorto()
    const { result } = run(() => porto.provider.request({ method }), {
      name: method,
    })

    await waitFor(() => expect(result.current.result).toBeDefined())

    const credentials = await commands.getCredentials(authenticatorId)
    expect(credentials).toHaveLength(1)

    await expect(
      porto.provider.request({ method: 'eth_accounts' }),
    ).resolves.toEqual([result.current.result])
  })

  test('`isUserVerified: false`', async () => {
    const authenticatorId = await commands.addVirtualAuthenticator({
      isUserVerified: false,
    })

    const porto = getPorto()
    const { result } = run(() => porto.provider.request({ method }), {
      name: method,
    })

    await waitFor(() => expect(result.current.error).toBeDefined())

    const credentials = await commands.getCredentials(authenticatorId)
    expect(credentials).toHaveLength(0)

    expect(result.current.error).toMatchInlineSnapshot(`
      [WebAuthnP256.CredentialCreationFailedError: Failed to create credential.

      Details: The operation either timed out or was not allowed. See: https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client.]
    `)
  })
})
