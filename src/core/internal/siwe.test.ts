import { afterEach, describe, expect, test } from 'vitest'
import * as TestConfig from '../../../test/src/config.js'
import * as Http from '../../../test/src/http.js'
import * as SiweModule from './siwe.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)

let server: Http.Server | undefined
afterEach(async () => {
  await server?.closeAsync().catch(() => {})
})

describe('authenticate', () => {
  test('behavior: makes POST request to verify endpoint', async () => {
    server = await Http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/verify') {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })
        req.on('end', () => {
          const data = JSON.parse(body)
          expect(data).toEqual({
            address: '0x1234567890123456789012345678901234567890',
            message: 'test message',
            signature: '0xdeadbeef',
            walletAddress: '0x1234567890123456789012345678901234567890',
          })
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ token: 'test-token' }))
        })
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    const result = await SiweModule.authenticate({
      address: '0x1234567890123456789012345678901234567890',
      authUrl: {
        logout: `${server.url}/logout`,
        nonce: `${server.url}/nonce`,
        verify: `${server.url}/verify`,
      },
      message: 'test message',
      signature: '0xdeadbeef',
    })
    expect(result).toEqual({
      token: 'test-token',
    })
  })

  test('error: propagates fetch errors', async () => {
    await expect(
      SiweModule.authenticate({
        address: '0x1234567890123456789012345678901234567890',
        authUrl: {
          logout: 'http://localhost:99999/logout',
          nonce: 'http://localhost:99999/nonce',
          verify: 'http://localhost:99999/verify',
        },
        message: 'test message',
        signature: '0xdeadbeef',
      }),
    ).rejects.toThrow()
  })

  test('behavior: includes publicKey when provided', async () => {
    const siweMessage = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

Sign in to example.com

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: abcd1234
Issued At: 2024-01-01T00:00:00.000Z`

    server = await Http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/verify') {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })
        req.on('end', () => {
          const data = JSON.parse(body)
          expect(data).toEqual({
            address: '0x1234567890123456789012345678901234567890',
            chainId: 1,
            message: siweMessage,
            publicKey:
              '0x04abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            signature: '0xdeadbeef',
            walletAddress: '0x1234567890123456789012345678901234567890',
          })
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ token: 'test-token' }))
        })
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    const result = await SiweModule.authenticate({
      address: '0x1234567890123456789012345678901234567890',
      authUrl: {
        logout: `${server.url}/logout`,
        nonce: `${server.url}/nonce`,
        verify: `${server.url}/verify`,
      },
      message: siweMessage,
      publicKey:
        '0x04abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      signature: '0xdeadbeef',
    })
    expect(result).toEqual({
      token: 'test-token',
    })
  })

  test('behavior: omits publicKey when not provided', async () => {
    const siweMessage = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

Sign in to example.com

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: abcd1234
Issued At: 2024-01-01T00:00:00.000Z`

    server = await Http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/verify') {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })
        req.on('end', () => {
          const data = JSON.parse(body)
          // Should NOT have publicKey field
          expect(data.publicKey).toBeUndefined()
          expect(data).toEqual({
            address: '0x1234567890123456789012345678901234567890',
            chainId: 1,
            message: siweMessage,
            signature: '0xdeadbeef',
            walletAddress: '0x1234567890123456789012345678901234567890',
          })
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ token: 'test-token' }))
        })
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    const result = await SiweModule.authenticate({
      address: '0x1234567890123456789012345678901234567890',
      authUrl: {
        logout: `${server.url}/logout`,
        nonce: `${server.url}/nonce`,
        verify: `${server.url}/verify`,
      },
      message: siweMessage,
      signature: '0xdeadbeef',
      // publicKey intentionally omitted
    })
    expect(result).toEqual({
      token: 'test-token',
    })
  })
})

describe('buildMessage', () => {
  test('param: requires chainId', async () => {
    const siwe = {
      domain: 'example.com',
      nonce: 'testnonce12345',
      uri: 'https://example.com/',
    }

    await expect(
      SiweModule.buildMessage({ ...client, chain: undefined }, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('`chainId` is required.')
  })

  test('param: requires domain', async () => {
    const siwe = {
      nonce: 'testnonce12345',
      uri: 'https://example.com/',
    }

    await expect(
      SiweModule.buildMessage(client, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('`domain` is required.')
  })

  test('param: requires uri', async () => {
    const siwe = {
      domain: 'example.com',
      nonce: 'testnonce12345',
    }

    await expect(
      SiweModule.buildMessage(client, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('`uri` is required.')
  })

  test('param: requires nonce or authUrl.nonce', async () => {
    const siwe = {
      domain: 'example.com',
      uri: 'https://example.com/',
    }

    await expect(
      // @ts-expect-error - nonce is required
      SiweModule.buildMessage(client, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('`nonce` or `authUrl.nonce` is required.')
  })

  test('behavior: uses provided nonce', async () => {
    const siwe = {
      domain: 'example.com',
      nonce: 'providednonce12345',
      uri: 'https://example.com/',
    }

    const result = await SiweModule.buildMessage(client, siwe, {
      address: '0x1234567890123456789012345678901234567890',
    })

    expect(result).toContain('example.com')
    expect(result).toContain('providednonce12345')
    expect(result).toContain('0x1234567890123456789012345678901234567890')
  })

  test('behavior: fetches nonce from authUrl', async () => {
    server = await Http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/nonce') {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ nonce: 'fetchednonce12345' }))
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    {
      const result = await SiweModule.buildMessage(
        client,
        {
          authUrl: server.url,
          domain: 'example.com',
          uri: 'https://example.com/',
        },
        {
          address: '0x1234567890123456789012345678901234567890',
        },
      )

      expect(result).toContain('example.com')
      expect(result).toContain('fetchednonce12345')
      expect(result).toContain('0x1234567890123456789012345678901234567890')
    }

    {
      const result = await SiweModule.buildMessage(
        client,
        {
          authUrl: {
            logout: `${server.url}/logout`,
            nonce: `${server.url}/nonce`,
            verify: `${server.url}/verify`,
          },
          domain: 'example.com',
          uri: 'https://example.com/',
        },
        {
          address: '0x1234567890123456789012345678901234567890',
        },
      )

      expect(result).toContain('example.com')
      expect(result).toContain('fetchednonce12345')
      expect(result).toContain('0x1234567890123456789012345678901234567890')
    }
  })

  test('behavior: uses explicit chainId over client chainId', async () => {
    const siwe = {
      chainId: 5,
      domain: 'example.com',
      nonce: 'testnonce12345',
      uri: 'https://example.com/',
    }

    const result = await SiweModule.buildMessage(client, siwe, {
      address: '0x1234567890123456789012345678901234567890',
    })

    // The SIWE message should contain the chain ID 5, not 1 from the client
    expect(result).toContain('Chain ID: 5')
  })

  test('behavior: uses default version 1', async () => {
    const siwe = {
      domain: 'example.com',
      nonce: 'testnonce12345',
      uri: 'https://example.com/',
    }

    const result = await SiweModule.buildMessage(client, siwe, {
      address: '0x1234567890123456789012345678901234567890',
    })

    expect(result).toContain('Version: 1')
  })

  test('behavior: passes through all optional fields', async () => {
    const siwe = {
      domain: 'example.com',
      expirationTime: new Date('2024-12-31T00:00:00.000Z'),
      issuedAt: new Date('2024-01-01T00:00:00.000Z'),
      nonce: 'testnonce12345',
      notBefore: new Date('2024-06-01T00:00:00.000Z'),
      requestId: 'req123',
      resources: [
        'https://example.com/resource1',
        'https://example.com/resource2',
      ],
      scheme: 'https',
      statement: 'Sign in to example.com',
      uri: 'https://example.com/',
      version: '1' as const,
    }

    const result = await SiweModule.buildMessage(client, siwe, {
      address: '0x1234567890123456789012345678901234567890',
    })

    expect(result).toContain('Sign in to example.com')
    expect(result).toContain('req123')
    expect(result).toContain('https://example.com/resource1')
    expect(result).toContain('https://example.com/resource2')
  })

  test('error: handles fetch error when getting nonce', async () => {
    const siwe = {
      authUrl: 'http://localhost:99999', // Invalid port
      domain: 'example.com',
      uri: 'https://example.com/',
    }

    await expect(
      SiweModule.buildMessage(client, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow()
  })

  test('error: handles invalid JSON response when getting nonce', async () => {
    server = await Http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/nonce') {
        res.end('invalid json')
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    const siwe = {
      authUrl: server.url,
      domain: 'example.com',
      uri: 'https://example.com/',
    }

    await expect(
      SiweModule.buildMessage(client, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('`nonce` or `authUrl.nonce` is required.')
  })

  test('error: handles missing nonce in response', async () => {
    server = await Http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/nonce') {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({})) // No nonce field
      } else {
        res.statusCode = 404
        res.end('Not Found')
      }
    })

    const siwe = {
      authUrl: server.url,
      domain: 'example.com',
      uri: 'https://example.com/',
    }

    await expect(
      SiweModule.buildMessage(client, siwe, {
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('`nonce` or `authUrl.nonce` is required.')
  })
})

describe('resolveAuthUrl', () => {
  test('param: returns undefined for falsy authUrl', () => {
    expect(SiweModule.resolveAuthUrl('')).toBeUndefined()
    expect(SiweModule.resolveAuthUrl(null as any)).toBeUndefined()
    expect(SiweModule.resolveAuthUrl(undefined as any)).toBeUndefined()
  })

  test('behavior: resolves string authUrl to object', () => {
    const result = SiweModule.resolveAuthUrl('https://example.com/auth')

    expect(result).toMatchInlineSnapshot(`
      {
        "logout": "https://example.com/auth/logout",
        "nonce": "https://example.com/auth/nonce",
        "verify": "https://example.com/auth/verify",
      }
    `)
  })

  test('behavior: strips trailing slash from string authUrl', () => {
    const result = SiweModule.resolveAuthUrl('https://example.com/auth/')

    expect(result).toMatchInlineSnapshot(`
      {
        "logout": "https://example.com/auth/logout",
        "nonce": "https://example.com/auth/nonce",
        "verify": "https://example.com/auth/verify",
      }
    `)
  })

  test('behavior: resolves authUrl object with origin', () => {
    const authUrl: SiweModule.AuthUrl = {
      logout: '/logout',
      nonce: '/nonce',
      verify: '/verify',
    }

    const result = SiweModule.resolveAuthUrl(authUrl, 'https://example.com')

    expect(result).toMatchInlineSnapshot(`
      {
        "logout": "https://example.com/logout",
        "nonce": "https://example.com/nonce",
        "verify": "https://example.com/verify",
      }
    `)
  })

  test('behavior: preserves absolute URLs in authUrl object', () => {
    const authUrl: SiweModule.AuthUrl = {
      logout: 'https://auth.example.com/logout',
      nonce: 'https://auth.example.com/nonce',
      verify: 'https://auth.example.com/verify',
    }

    const result = SiweModule.resolveAuthUrl(authUrl, 'https://example.com')

    expect(result).toMatchInlineSnapshot(`
      {
        "logout": "https://auth.example.com/logout",
        "nonce": "https://auth.example.com/nonce",
        "verify": "https://auth.example.com/verify",
      }
    `)
  })

  test.each([
    {
      case: 'string authUrl without trailing slash',
      expected: {
        logout: 'https://example.com/auth/logout',
        nonce: 'https://example.com/auth/nonce',
        verify: 'https://example.com/auth/verify',
      },
      input: 'https://example.com/auth',
      origin: '',
    },
    {
      case: 'string authUrl with trailing slash',
      expected: {
        logout: 'https://example.com/auth/logout',
        nonce: 'https://example.com/auth/nonce',
        verify: 'https://example.com/auth/verify',
      },
      input: 'https://example.com/auth/',
      origin: '',
    },
    {
      case: 'relative authUrl object with origin',
      expected: {
        logout: 'https://example.com/logout',
        nonce: 'https://example.com/nonce',
        verify: 'https://example.com/verify',
      },
      input: { logout: '/logout', nonce: '/nonce', verify: '/verify' },
      origin: 'https://example.com',
    },
    {
      case: 'absolute authUrl object',
      expected: {
        logout: 'https://auth.example.com/logout',
        nonce: 'https://auth.example.com/nonce',
        verify: 'https://auth.example.com/verify',
      },
      input: {
        logout: 'https://auth.example.com/logout',
        nonce: 'https://auth.example.com/nonce',
        verify: 'https://auth.example.com/verify',
      },
      origin: 'https://example.com',
    },
  ])(
    'behavior: resolves authUrl correctly for $case',
    ({ input, origin, expected }) => {
      const result = SiweModule.resolveAuthUrl(input as any, origin)
      expect(result).toEqual(expected)
    },
  )
})

describe('resolveUrl', () => {
  // Note: This is testing the internal resolveUrl function indirectly through resolveAuthUrl
  // since resolveUrl is not exported.

  test('behavior: returns url when no origin', () => {
    const result = SiweModule.resolveAuthUrl({
      logout: 'https://example.com/logout',
      nonce: 'https://example.com/nonce',
      verify: 'https://example.com/verify',
    })

    expect(result?.logout).toBe('https://example.com/logout')
  })

  test('behavior: returns absolute url unchanged with origin', () => {
    const result = SiweModule.resolveAuthUrl(
      {
        logout: 'https://example.com/logout',
        nonce: 'https://example.com/nonce',
        verify: 'https://example.com/verify',
      },
      'https://other.com',
    )

    expect(result?.logout).toBe('https://example.com/logout')
  })

  test('behavior: prepends origin to relative url', () => {
    const result = SiweModule.resolveAuthUrl(
      {
        logout: '/logout',
        nonce: '/nonce',
        verify: '/verify',
      },
      'https://example.com',
    )

    expect(result?.logout).toBe('https://example.com/logout')
  })
})
