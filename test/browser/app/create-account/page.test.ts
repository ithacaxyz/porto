import { type CDPSession, expect, test } from '@playwright/test'

test('test', async ({ page }) => {
  const client = await page.context().newCDPSession(page)

  await client.send('WebAuthn.enable')

  const result = await client.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
    },
  })
  const authenticatorId = result.authenticatorId

  await page.goto('./create-account')

  await expect(
    page.getByRole('heading', { name: 'experimental_createAccount' }),
  ).toBeVisible()

  await simulateSuccessfulPasskeyInput({
    authenticatorId,
    client,
    trigger() {
      return page.getByRole('button', { name: 'Register' }).click()
    },
  })

  // Confirm the passkey was successfully registered
  const credentials = await client.send('WebAuthn.getCredentials', {
    authenticatorId,
  })
  expect(credentials.credentials).toHaveLength(1)

  await expect(page.getByText(/^0x.+/)).toBeVisible()
})

async function simulateSuccessfulPasskeyInput(options: {
  authenticatorId: string
  client: CDPSession
  trigger: () => Promise<void>
}) {
  const { authenticatorId, client, trigger } = options

  await Promise.all([
    // set `isUserVerified` so subsequent passkey operations will succeed
    client.send('WebAuthn.setUserVerified', {
      authenticatorId,
      isUserVerified: true,
    }),
    // set `automaticPresenceSimulation` so virtual authenticator will respond to next passkey prompt
    client.send('WebAuthn.setAutomaticPresenceSimulation', {
      authenticatorId,
      enabled: true,
    }),
  ])

  // perform user action that triggers passkey prompt
  await trigger()

  // wait to receive the event that the passkey was successfully registered or verified
  // await new Promise<void>((resolve) => {
  //   client.on('WebAuthn.credentialAdded', () => resolve())
  //   client.on('WebAuthn.credentialAsserted', () => resolve())
  // })

  // set `automaticPresenceSimulation` option back to false
  await client.send('WebAuthn.setAutomaticPresenceSimulation', {
    authenticatorId,
    enabled: false,
  })
}
