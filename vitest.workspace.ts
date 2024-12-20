import react from '@vitejs/plugin-react'
import { defineWorkspace } from 'vitest/config'
import type { BrowserCommand } from 'vitest/node'

export default defineWorkspace([
  {
    test: {
      name: 'node',
      environment: 'node',
      include: ['./src/**/*.test.ts'],
    },
  },
  {
    plugins: [react()],
    test: {
      name: 'browser',
      include: ['./src/**/*.browser.test.ts'],
      browser: {
        commands: {
          ...getWebauthnCommands(),
        },
        enabled: true,
        headless: true,
        name: 'chrome',
        provider: 'webdriverio',
        providerOptions: {},
      },
    },
  },
])

declare module '@vitest/browser/context' {
  interface BrowserCommands extends WebauthnCommands {}

  type WebauthnCommands<
    obj extends ReturnType<typeof getWebauthnCommands> = ReturnType<
      typeof getWebauthnCommands
    >,
  > = {
    [key in keyof obj]: obj[key] extends BrowserCommand<
      infer payload extends unknown[]
    >
      ? (...p: payload) => ReturnType<obj[key]>
      : never
  }
}

function getWebauthnCommands() {
  return {
    addVirtualAuthenticator(ctx, payload = {}) {
      const {
        protocol = 'ctap2',
        transport = 'internal',
        hasResidentKey = true,
        hasUserVerification = true,
        isUserConsenting = true,
        isUserVerified = true,
        extensions,
        uvm,
      } = payload
      return ctx.browser.addVirtualAuthenticator(
        protocol,
        transport,
        hasResidentKey,
        hasUserVerification,
        isUserConsenting,
        isUserVerified,
        extensions,
        uvm,
      )
    },
    getCredentials(ctx, authenticatorId) {
      return ctx.browser.getCredentials(authenticatorId)
    },
    setUserVerified(ctx, authenticatorId) {
      return ctx.browser.setUserVerified(authenticatorId)
    },
  } as const satisfies {
    addVirtualAuthenticator: BrowserCommand<[payload: Payload | undefined]>
    getCredentials: BrowserCommand<
      Parameters<WebdriverIO.Browser['getCredentials']>
    >
    setUserVerified: BrowserCommand<
      Parameters<WebdriverIO.Browser['setUserVerified']>
    >
  }
}

type Payload = {
  protocol?: addVirtualAuthenticator[0]
  transport?: addVirtualAuthenticator[1]
  hasResidentKey?: addVirtualAuthenticator[2]
  hasUserVerification?: addVirtualAuthenticator[3]
  isUserConsenting?: addVirtualAuthenticator[4]
  isUserVerified?: addVirtualAuthenticator[5]
  extensions?: addVirtualAuthenticator[6]
  uvm?: addVirtualAuthenticator[7]
}
type addVirtualAuthenticator = Parameters<
  WebdriverIO.Browser['addVirtualAuthenticator']
>
