import { afterEach, describe, expect, test, vi } from 'vitest'
import * as WebAuthnPrf from './WebAuthnPrf'

const account = '0x0000000000000000000000000000000000000001' as const
const credentialId = 'AQIDBA'
const rpId = 'account.example'
const salt = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

describe('WebAuthnPrf', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('behavior: create requests PRF without create-time eval and probes with evalByCredential', async () => {
    const storage = createStorage()
    const calls: {
      create?: CredentialCreationOptions
      get?: CredentialRequestOptions
    } = {}

    stubBrowser({
      credentials: {
        async create(options) {
          calls.create = options
          return credential({
            extensionResults: { prf: {} },
          })
        },
        async get(options) {
          calls.get = options
          return credential({
            extensionResults: {
              prf: {
                resultsByCredential: {
                  [credentialId]: { first: new Uint8Array(32) },
                },
              },
            },
          })
        },
      },
      storage,
    })

    const created = await WebAuthnPrf.create({
      publicKey: {
        challenge: new Uint8Array(32),
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        rp: { id: rpId, name: rpId },
        user: {
          displayName: 'Account',
          id: new Uint8Array([1]),
          name: 'Account',
        },
      },
    })

    expect(
      (created as PublicKeyCredential).getClientExtensionResults().prf?.enabled,
    ).toBe(true)
    expect(calls.create?.publicKey?.extensions).toMatchObject({ prf: {} })
    expect(
      (calls.create?.publicKey?.extensions as any).prf.eval,
    ).toBeUndefined()
    expect(
      (calls.create?.publicKey?.extensions as any).prf.evalByCredential,
    ).toBeUndefined()
    expect(
      (calls.get?.publicKey?.extensions as any).prf.evalByCredential[
        credentialId
      ].first,
    ).toBeInstanceOf(ArrayBuffer)
    expect((calls.get?.publicKey?.extensions as any).prf.eval).toBeUndefined()

    WebAuthnPrf.recordConnectResult({
      accounts: [
        {
          address: account,
          capabilities: {
            admins: [{ credentialId }],
          },
        },
      ],
    })

    expect(WebAuthnPrf.loadAccountMetadata(account)).toMatchObject({
      account,
      credentialId,
      prfEnabled: true,
      rpId,
    })
    expect(JSON.stringify([...storage.values()])).not.toContain('first')
  })

  test('behavior: getAppPrf uses evalByCredential and returns only app-scoped HKDF output', async () => {
    const rawPrf = new Uint8Array(32)
    rawPrf.fill(7)
    const rawPrfBase64 = base64UrlEncode(rawPrf)
    const storage = createStorage()

    const calls: { get?: CredentialRequestOptions } = {}
    stubBrowser({
      credentials: {
        async get(options) {
          calls.get = options
          return credential({
            extensionResults: {
              prf: {
                resultsByCredential: {
                  [credentialId]: { first: numericByteObject(rawPrf) },
                },
              },
            },
          })
        },
      },
      storage,
    })

    const output = await WebAuthnPrf.getAppPrf({
      account,
      appOrigin: 'https://app.example',
      credentialId,
      purpose: 'ergon-vault-unlock',
      rpId,
      salt,
      vaultId: 'vault-1',
    })

    expect(output).toMatch(/^[A-Za-z0-9_-]{43}$/)
    expect(output).not.toBe(rawPrfBase64)
    expect([...storage.values()].join('')).not.toContain(output)
    expect(
      (calls.get?.publicKey?.extensions as any).prf.evalByCredential[
        credentialId
      ].first,
    ).toBeInstanceOf(ArrayBuffer)
    expect((calls.get?.publicKey?.extensions as any).prf.eval).toBeUndefined()
  })

  test('behavior: recovers account metadata from credential ID and stores it only after PRF succeeds', async () => {
    const rawPrf = new Uint8Array(32)
    rawPrf.fill(13)
    const rawPrfBase64 = base64UrlEncode(rawPrf)
    const storage = createStorage()

    stubBrowser({
      credentials: {
        async get() {
          return credential({
            extensionResults: {
              prf: {
                resultsByCredential: {
                  [credentialId]: { first: rawPrf },
                },
              },
            },
          })
        },
      },
      storage,
    })

    const metadata = WebAuthnPrf.resolveAccountMetadata({
      address: account,
      keys: [{ credentialId, type: 'webauthn-p256' }],
    })

    expect(metadata).toMatchObject({
      account,
      credentialId,
      prfEnabled: false,
      rpId,
    })
    expect(WebAuthnPrf.loadAccountMetadata(account)).toBeUndefined()
    if (!metadata) throw new Error('Expected recovered PRF metadata.')

    WebAuthnPrf.assertAccountCredentialBinding({
      account: {
        address: account,
        keys: [{ credentialId, type: 'webauthn-p256' }],
      },
      metadata,
    })

    const output = await WebAuthnPrf.getAppPrf({
      account,
      appOrigin: 'https://app.example',
      credentialId: metadata.credentialId,
      purpose: 'ergon-vault-unlock',
      rpId: metadata.rpId,
      salt,
      vaultId: 'vault-1',
    })

    WebAuthnPrf.recordAccountMetadata({
      ...metadata,
      prfEnabled: true,
      updatedAt: 1,
    })

    expect(WebAuthnPrf.loadAccountMetadata(account)).toMatchObject({
      account,
      credentialId,
      prfEnabled: true,
      rpId,
    })
    expect([...storage.values()].join('')).not.toContain(rawPrfBase64)
    expect([...storage.values()].join('')).not.toContain(output)
  })

  test('behavior: getAppPrf normalizes results.first ArrayBuffer output', async () => {
    const rawPrf = new Uint8Array(new ArrayBuffer(32))
    rawPrf.fill(9)
    const rawPrfBase64 = base64UrlEncode(rawPrf)

    stubBrowser({
      credentials: {
        async get() {
          return credential({
            extensionResults: {
              prf: {
                results: {
                  first: rawPrf.buffer,
                },
              },
            },
          })
        },
      },
      storage: createStorage(),
    })

    const output = await WebAuthnPrf.getAppPrf({
      account,
      appOrigin: 'https://app.example',
      credentialId,
      purpose: 'ergon-vault-unlock',
      rpId,
      salt,
      vaultId: 'vault-1',
    })

    expect(output).toMatch(/^[A-Za-z0-9_-]{43}$/)
    expect(output).not.toBe(rawPrfBase64)
    expect([...rawPrf]).toEqual(new Array(32).fill(0))
  })

  test('behavior: getAppPrf falls back to eval after evalByCredential syntax failure', async () => {
    const calls: CredentialRequestOptions[] = []

    stubBrowser({
      credentials: {
        async get(options) {
          if (options) calls.push(options)
          if (calls.length === 1)
            throw new DOMException('bad prf input', 'SyntaxError')

          const rawPrf = new Uint8Array(new ArrayBuffer(32))
          rawPrf.fill(11)
          return credential({
            extensionResults: {
              prf: {
                results: {
                  first: rawPrf,
                },
              },
            },
          })
        },
      },
      storage: createStorage(),
    })

    await WebAuthnPrf.getAppPrf({
      account,
      appOrigin: 'https://app.example',
      credentialId,
      purpose: 'ergon-vault-unlock',
      rpId,
      salt,
      vaultId: 'vault-1',
    })

    expect(
      (calls[0]?.publicKey?.extensions as any).prf.evalByCredential[
        credentialId
      ],
    ).toBeDefined()
    expect(
      (calls[1]?.publicKey?.extensions as any).prf.eval.first,
    ).toBeInstanceOf(ArrayBuffer)
  })

  test('behavior: rejects invalid PRF request inputs before WebAuthn get', async () => {
    const get = vi.fn()
    stubBrowser({
      credentials: { get },
      storage: createStorage(),
    })

    await expect(
      WebAuthnPrf.getAppPrf({
        account,
        appOrigin: 'https://app.example',
        credentialId,
        purpose: 'bad purpose with spaces',
        rpId,
        salt,
        vaultId: 'vault-1',
      }),
    ).rejects.toThrow('Invalid PRF purpose.')

    await expect(
      WebAuthnPrf.getAppPrf({
        account,
        appOrigin: 'https://app.example',
        credentialId,
        purpose: 'ergon-vault-unlock',
        rpId,
        salt: 'short',
        vaultId: 'vault-1',
      }),
    ).rejects.toThrow('Invalid base64url length.')

    await expect(
      WebAuthnPrf.getAppPrf({
        account,
        appOrigin: 'https://app.example',
        credentialId,
        purpose: 'ergon-vault-unlock',
        rpId,
        salt,
        vaultId: 'bad vault with spaces',
      }),
    ).rejects.toThrow('Invalid vault ID.')

    expect(get).not.toHaveBeenCalled()
  })

  test('behavior: rejects mismatched WebAuthn assertion credential ID', async () => {
    stubBrowser({
      credentials: {
        async get() {
          return credential({
            extensionResults: {
              prf: {
                resultsByCredential: {
                  [credentialId]: { first: new Uint8Array(32) },
                },
              },
            },
            id: 'BAUGBw',
          })
        },
      },
      storage: createStorage(),
    })

    await expect(
      WebAuthnPrf.getAppPrf({
        account,
        appOrigin: 'https://app.example',
        credentialId,
        purpose: 'ergon-vault-unlock',
        rpId,
        salt,
        vaultId: 'vault-1',
      }),
    ).rejects.toThrow('WebAuthn assertion credential ID did not match.')
  })

  test('behavior: stores non-PRF credential metadata without enabling PRF', async () => {
    const storage = createStorage()
    stubBrowser({
      credentials: {
        async create() {
          return credential({
            extensionResults: { prf: {} },
          })
        },
        async get() {
          return credential({
            extensionResults: { prf: {} },
          })
        },
      },
      storage,
    })

    await WebAuthnPrf.create({
      publicKey: {
        challenge: new Uint8Array(32),
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        rp: { id: rpId, name: rpId },
        user: {
          displayName: 'Account',
          id: new Uint8Array([1]),
          name: 'Account',
        },
      },
    })

    WebAuthnPrf.recordConnectResult({
      accounts: [
        {
          address: account,
          capabilities: {
            admins: [{ credentialId }],
          },
        },
      ],
    })

    expect(WebAuthnPrf.loadAccountMetadata(account)).toMatchObject({
      account,
      credentialId,
      prfEnabled: false,
      rpId,
    })
    expect(WebAuthnPrf.getCapabilityStatus({ account })).toBe(
      'credential-not-enabled',
    )
  })

  test('behavior: capability status reflects client support and stored metadata', () => {
    const storage = createStorage()
    stubBrowser({ storage })

    expect(WebAuthnPrf.getCapabilityStatus()).toBe('credential-not-enabled')
    expect(
      WebAuthnPrf.getCapabilityStatus({
        account,
        keys: [
          {
            privateKey: {
              credential: { id: credentialId },
              prf: { enabled: true },
              rpId,
            },
            type: 'webauthn-p256',
          },
        ],
      }),
    ).toBe('enabled')

    storage.set(
      'porto.dialog.prfCredentials',
      JSON.stringify({
        [account]: {
          account,
          credentialId,
          prfEnabled: true,
          rpId,
          updatedAt: 1,
        },
      }),
    )

    expect(WebAuthnPrf.getCapabilityStatus()).toBe('enabled')
    expect(WebAuthnPrf.getCapabilityStatus({ account })).toBe('enabled')
    expect(WebAuthnPrf.getCapabilityStatus({ account, keys: [] })).toBe(
      'credential-not-enabled',
    )
    expect(
      WebAuthnPrf.getCapabilityStatus({
        account: '0x0000000000000000000000000000000000000002',
      }),
    ).toBe('credential-not-enabled')
  })

  test('behavior: validates app origin/referrer match', () => {
    expect(
      WebAuthnPrf.validateAppReferrer({
        origin: 'https://app.example',
        url: new URL('https://app.example/vault'),
      }),
    ).toBe('https://app.example')

    expect(() =>
      WebAuthnPrf.validateAppReferrer({
        origin: 'https://evil.example',
        url: new URL('https://app.example/vault'),
      }),
    ).toThrow('Application origin/referrer mismatch.')
  })

  test('behavior: validates account, credential, and RP binding', () => {
    stubBrowser({ storage: createStorage() })

    const metadata = {
      account,
      credentialId,
      prfEnabled: true,
      rpId,
      updatedAt: 1,
    }

    expect(() =>
      WebAuthnPrf.assertAccountCredentialBinding({
        account: {
          address: account,
          keys: [
            {
              privateKey: {
                credential: { id: credentialId },
                rpId,
              },
              type: 'webauthn-p256',
            },
          ],
        },
        metadata,
      }),
    ).not.toThrow()

    expect(() =>
      WebAuthnPrf.assertAccountCredentialBinding({
        account: {
          address: account,
          keys: [{ credentialId, type: 'webauthn-p256' }],
        },
        metadata,
      }),
    ).not.toThrow()

    expect(() =>
      WebAuthnPrf.assertAccountCredentialBinding({
        account: {
          address: account,
          keys: [
            {
              privateKey: {
                credential: { id: credentialId },
                rpId: 'other.example',
              },
              type: 'webauthn-p256',
            },
          ],
        },
        metadata,
      }),
    ).toThrow('Stored PRF RP ID does not match selected account key.')
  })
})

function credential(options: {
  extensionResults: unknown
  id?: string | undefined
}): Credential {
  return {
    getClientExtensionResults() {
      return options.extensionResults
    },
    id: options.id ?? credentialId,
    rawId: new Uint8Array([1, 2, 3, 4]),
    type: 'public-key',
  } as unknown as Credential
}

function stubBrowser(options: {
  credentials?: Partial<CredentialsContainer>
  storage: Map<string, string>
}) {
  vi.stubGlobal('window', {
    isSecureContext: true,
    localStorage: {
      getItem(key: string) {
        return options.storage.get(key) ?? null
      },
      removeItem(key: string) {
        options.storage.delete(key)
      },
      setItem(key: string, value: string) {
        options.storage.set(key, value)
      },
    },
    location: {
      hostname: rpId,
    },
  })
  vi.stubGlobal('navigator', {
    credentials: options.credentials ?? {
      async create() {
        return null
      },
      async get() {
        return null
      },
    },
  })
}

function createStorage() {
  return new Map<string, string>()
}

function numericByteObject(bytes: Uint8Array) {
  return Object.fromEntries(bytes.entries())
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}
