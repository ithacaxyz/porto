import { describe, expect, test } from 'vitest'
import * as Capabilities from './capabilities.js'
import * as Schema from './schema.js'

describe('atomic', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: should parse supported status', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )({ status: 'supported' })
      expect(result).toMatchInlineSnapshot(`
          {
            "status": "supported",
          }
        `)
    })

    test('behavior: should parse unsupported status', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )({ status: 'unsupported' })
      expect(result).toMatchInlineSnapshot(`
          {
            "status": "unsupported",
          }
        `)
    })

    test('error: should reject invalid status', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.atomic.GetCapabilitiesResponse)({
          status: 'invalid',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected "supported", actual "invalid"
        Path: status

        Details: { readonly status: "supported" | "unsupported" }
        └─ ["status"]
           └─ "supported" | "unsupported"
              ├─ Expected "supported", actual "invalid"
              └─ Expected "unsupported", actual "invalid"]
      `)
    })

    test('behavior: should encode supported status', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )({ status: 'supported' })
      const encoded = Schema.encodeSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "status": "supported",
        }
      `)
    })

    test('behavior: should encode unsupported status', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )({ status: 'unsupported' })
      const encoded = Schema.encodeSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "status": "unsupported",
        }
      `)
    })

    test('behavior: round-trip encoding/decoding preserves data', () => {
      const originalData = { status: 'supported' as const }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )(decoded)
      const reDecoded = Schema.decodeUnknownSync(
        Capabilities.atomic.GetCapabilitiesResponse,
      )(encoded)
      expect(reDecoded).toEqual(decoded)
    })

    test('error: should reject missing status', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.atomic.GetCapabilitiesResponse)(
          {},
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`status\` is missing
        Path: status

        Details: { readonly status: "supported" | "unsupported" }
        └─ ["status"]
           └─ is missing]
      `)
    })
  })
})

describe('createAccount', () => {
  describe('Request', () => {
    test('behavior: should parse boolean true', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(true)
      expect(result).toBe(true)
    })

    test('behavior: should parse boolean false', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(false)
      expect(result).toBe(false)
    })

    test('behavior: should parse object with chainId', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )({ chainId: '0x1' })
      expect(result).toMatchInlineSnapshot(`
          {
            "chainId": 1,
          }
        `)
    })

    test('behavior: should parse object with label', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )({ label: 'My Account' })
      expect(result).toMatchInlineSnapshot(`
          {
            "label": "My Account",
          }
        `)
    })

    test('behavior: should parse object with both chainId and label', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )({ chainId: '0xa', label: 'Test Account' })
      expect(result).toMatchInlineSnapshot(`
          {
            "chainId": 10,
            "label": "Test Account",
          }
        `)
    })

    test('behavior: should parse empty object', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )({})
      expect(result).toMatchInlineSnapshot('{}')
    })

    test('behavior: should encode boolean true', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(true)
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        decoded,
      )
      expect(encoded).toBe(true)
    })

    test('behavior: should encode boolean false', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(false)
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        decoded,
      )
      expect(encoded).toBe(false)
    })

    test('behavior: should encode object with chainId back to hex', () => {
      const originalData = { chainId: '0xa' }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(originalData)
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "chainId": "0xa",
        }
      `)
    })

    test('behavior: should encode object with label', () => {
      const originalData = { label: 'My Account' }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(originalData)
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "label": "My Account",
        }
      `)
    })

    test('behavior: should encode object with both chainId and label', () => {
      const originalData = { chainId: '0x1', label: 'Test Account' }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )(originalData)
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "chainId": "0x1",
          "label": "Test Account",
        }
      `)
    })

    test('behavior: should encode empty object', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.createAccount.Request,
      )({})
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot('{}')
    })

    test.each([
      { case: 'boolean true', expected: true, input: true },
      { case: 'boolean false', expected: false, input: false },
      { case: 'empty object', expected: {}, input: {} },
      {
        case: 'object with label',
        expected: { label: 'Test' },
        input: { label: 'Test' },
      },
      {
        case: 'object with chainId number to hex',
        expected: { chainId: '0xa' },
        input: { chainId: 10 },
      },
      {
        case: 'object with both fields',
        expected: { chainId: '0x1', label: 'Both Fields' },
        input: { chainId: 1, label: 'Both Fields' },
      },
    ])('behavior: encodes $case correctly', ({ input, expected }) => {
      const encoded = Schema.encodeSync(Capabilities.createAccount.Request)(
        input,
      )
      expect(encoded).toEqual(expected)
    })

    test('error: should reject invalid type', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.createAccount.Request)('string'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected boolean, actual "string"

        Details: boolean | { readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly label?: string | undefined }
        ├─ Expected boolean, actual "string"
        └─ Expected { readonly chainId?: (\`0x\${string}\` <-> number) | undefined; readonly label?: string | undefined }, actual "string"]
      `)
    })
  })
})

describe('signInWithEthereum', () => {
  describe('Request', () => {
    test('behavior: should parse struct with nonce and no authUrl', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Request,
      )({
        nonce: 'abc123',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "nonce": "abc123",
          }
        `)
    })

    test('behavior: should parse struct with authUrl string', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Request,
      )({
        authUrl: 'https://example.com/auth',
        nonce: 'xyz789',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "authUrl": "https://example.com/auth",
            "nonce": "xyz789",
          }
        `)
    })

    test('behavior: should parse struct with all optional fields', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Request,
      )({
        authUrl: undefined,
        chainId: 1,
        domain: 'example.com',
        expirationTime: new Date('2024-12-31T00:00:00.000Z'),
        issuedAt: new Date('2024-01-01T00:00:00.000Z'),
        nonce: 'test123',
        notBefore: new Date('2024-06-01T00:00:00.000Z'),
        requestId: 'req123',
        resources: ['https://example.com/resource1'],
        scheme: 'https',
        statement: 'Sign in to example.com',
        uri: 'https://example.com',
        version: '1',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "authUrl": undefined,
            "chainId": 1,
            "domain": "example.com",
            "expirationTime": 2024-12-31T00:00:00.000Z,
            "issuedAt": 2024-01-01T00:00:00.000Z,
            "nonce": "test123",
            "notBefore": 2024-06-01T00:00:00.000Z,
            "requestId": "req123",
            "resources": [
              "https://example.com/resource1",
            ],
            "scheme": "https",
            "statement": "Sign in to example.com",
            "uri": "https://example.com",
            "version": "1",
          }
        `)
    })

    test('error: should reject struct without nonce', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.signInWithEthereum.Request)({
          domain: 'example.com',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`nonce\` is missing
        Path: nonce

        Details: { readonly authUrl?: undefined; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce: string; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined } | { readonly authUrl: string; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce?: string | undefined; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined }
        ├─ { readonly authUrl?: undefined; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce: string; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined }
        │  └─ ["nonce"]
        │     └─ is missing
        └─ { readonly authUrl: string; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce?: string | undefined; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined }
           └─ ["authUrl"]
              └─ is missing]
      `)
    })

    test('behavior: should encode struct with nonce', () => {
      const originalData = { nonce: 'abc123' }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Request,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.signInWithEthereum.Request,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "nonce": "abc123",
        }
      `)
    })

    test('behavior: should encode struct with authUrl', () => {
      const originalData = {
        authUrl: 'https://example.com/auth',
        nonce: 'xyz789',
      }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Request,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.signInWithEthereum.Request,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "authUrl": "https://example.com/auth",
          "nonce": "xyz789",
        }
      `)
    })

    test('behavior: should encode struct with all fields including dates', () => {
      const originalData = {
        authUrl: undefined,
        chainId: 1,
        domain: 'example.com',
        expirationTime: new Date('2024-12-31T00:00:00.000Z'),
        issuedAt: new Date('2024-01-01T00:00:00.000Z'),
        nonce: 'test123',
        notBefore: new Date('2024-06-01T00:00:00.000Z'),
        requestId: 'req123',
        resources: ['https://example.com/resource1'],
        scheme: 'https',
        statement: 'Sign in to example.com',
        uri: 'https://example.com',
        version: '1' as const,
      }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Request,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.signInWithEthereum.Request,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "authUrl": undefined,
          "chainId": 1,
          "domain": "example.com",
          "expirationTime": 2024-12-31T00:00:00.000Z,
          "issuedAt": 2024-01-01T00:00:00.000Z,
          "nonce": "test123",
          "notBefore": 2024-06-01T00:00:00.000Z,
          "requestId": "req123",
          "resources": [
            "https://example.com/resource1",
          ],
          "scheme": "https",
          "statement": "Sign in to example.com",
          "uri": "https://example.com",
          "version": "1",
        }
      `)
    })

    test.each([
      {
        case: 'nonce only',
        expected: { nonce: 'test1' },
        input: { nonce: 'test1' },
      },
      {
        case: 'authUrl and nonce',
        expected: { authUrl: 'https://test.com', nonce: 'test2' },
        input: { authUrl: 'https://test.com', nonce: 'test2' },
      },
      {
        case: 'multiple fields with undefined authUrl',
        expected: {
          authUrl: undefined,
          chainId: 5,
          domain: 'test.com',
          nonce: 'test3',
          version: '1',
        },
        input: {
          authUrl: undefined,
          chainId: 5,
          domain: 'test.com',
          nonce: 'test3',
          version: '1' as const,
        },
      },
    ])('behavior: encodes $case correctly', ({ input, expected }) => {
      const encoded = Schema.encodeSync(
        Capabilities.signInWithEthereum.Request,
      )(input)
      expect(encoded).toEqual(expected)
    })

    test('error: should reject invalid version', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.signInWithEthereum.Request)({
          nonce: 'test',
          version: '2',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected "1", actual "2"
        Path: version

        Details: { readonly authUrl?: undefined; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce: string; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined } | { readonly authUrl: string; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce?: string | undefined; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined }
        ├─ { readonly authUrl?: undefined; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce: string; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined }
        │  └─ ["version"]
        │     └─ "1" | undefined
        │        ├─ Expected "1", actual "2"
        │        └─ Expected undefined, actual "2"
        └─ { readonly authUrl: string; readonly chainId?: number | undefined; readonly domain?: string | undefined; readonly expirationTime?: DateFromSelf | undefined; readonly issuedAt?: DateFromSelf | undefined; readonly nonce?: string | undefined; readonly notBefore?: DateFromSelf | undefined; readonly requestId?: string | undefined; readonly resources?: ReadonlyArray<string> | undefined; readonly scheme?: string | undefined; readonly statement?: string | undefined; readonly uri?: string | undefined; readonly version?: "1" | undefined }
           └─ ["authUrl"]
              └─ is missing]
      `)
    })
  })

  describe('Response', () => {
    test('behavior: should parse valid response', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Response,
      )({
        message: 'Sign in to example.com',
        signature: '0xdeadbeef',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "message": "Sign in to example.com",
            "signature": "0xdeadbeef",
          }
        `)
    })

    test('error: should reject missing message', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.signInWithEthereum.Response)({
          signature: '0xdeadbeef',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`message\` is missing
        Path: message

        Details: { readonly message: string; readonly signature: \`0x\${string}\` }
        └─ ["message"]
           └─ is missing]
      `)
    })

    test('error: should reject missing signature', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.signInWithEthereum.Response)({
          message: 'Sign in',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`signature\` is missing
        Path: signature

        Details: { readonly message: string; readonly signature: \`0x\${string}\` }
        └─ ["signature"]
           └─ is missing]
      `)
    })

    test('behavior: should encode valid response', () => {
      const originalData = {
        message: 'Sign in to example.com',
        signature: '0xdeadbeef',
      }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Response,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.signInWithEthereum.Response,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "message": "Sign in to example.com",
          "signature": "0xdeadbeef",
        }
      `)
    })

    test('behavior: encodes response preserving signature format', () => {
      const input = { message: 'Test message', signature: '0x123456789abcdef' }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.signInWithEthereum.Response,
      )(input)
      const encoded = Schema.encodeSync(
        Capabilities.signInWithEthereum.Response,
      )(decoded)
      expect(encoded).toEqual({
        message: 'Test message',
        signature: '0x123456789abcdef',
      })
    })

    test('error: should reject invalid signature format', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.signInWithEthereum.Response)({
          message: 'Sign in',
          signature: 'invalid',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid"
        Path: signature

        Details: { readonly message: string; readonly signature: \`0x\${string}\` }
        └─ ["signature"]
           └─ Expected \`0x\${string}\`, actual "invalid"]
      `)
    })
  })
})

describe('feeToken', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: should parse response with empty tokens', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.feeToken.GetCapabilitiesResponse,
      )({
        supported: true,
        tokens: [],
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": true,
            "tokens": [],
          }
        `)
    })

    test('behavior: should parse response with tokens', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.feeToken.GetCapabilitiesResponse,
      )({
        supported: true,
        tokens: [
          {
            address: '0x1234567890abcdef',
            decimals: 18,
            interop: true,
            kind: 'ERC20',
            symbol: 'USDC',
          },
          {
            address: '0xfedcba0987654321',
            decimals: 6,
            interop: true,
            kind: 'ERC20',
            nativeRate: '0x1000',
            symbol: 'USDT',
          },
        ],
      })
      expect(result).toMatchInlineSnapshot(`
        {
          "supported": true,
          "tokens": [
            {
              "address": "0x1234567890abcdef",
              "decimals": 18,
              "interop": true,
              "kind": "ERC20",
              "symbol": "USDC",
            },
            {
              "address": "0xfedcba0987654321",
              "decimals": 6,
              "interop": true,
              "kind": "ERC20",
              "nativeRate": 4096n,
              "symbol": "USDT",
            },
          ],
        }
      `)
    })

    test('error: should reject missing supported field', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.feeToken.GetCapabilitiesResponse)(
          {
            tokens: [],
          },
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`supported\` is missing
        Path: supported

        Details: { readonly supported: boolean; readonly tokens: ReadonlyArray<{ readonly address: \`0x\${string}\`; readonly decimals: number; readonly interop: boolean; readonly kind: string; readonly nativeRate?: (\`0x\${string}\` <-> bigint) | undefined; readonly symbol: string }> }
        └─ ["supported"]
           └─ is missing]
      `)
    })

    test('behavior: should encode response with empty tokens', () => {
      const originalData = { supported: true, tokens: [] }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.feeToken.GetCapabilitiesResponse,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.feeToken.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
          "tokens": [],
        }
      `)
    })

    test('behavior: should encode response with tokens and BigInt nativeRate', () => {
      const originalData = {
        supported: true,
        tokens: [
          {
            address: '0x1234567890abcdef',
            decimals: 18,
            interop: true,
            kind: 'ERC20',
            symbol: 'USDC',
          },
          {
            address: '0xfedcba0987654321',
            decimals: 6,
            interop: true,
            kind: 'ERC20',
            nativeRate: '0x1000',
            symbol: 'USDT',
          },
        ],
      }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.feeToken.GetCapabilitiesResponse,
      )(originalData)
      const encoded = Schema.encodeSync(
        Capabilities.feeToken.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
          "tokens": [
            {
              "address": "0x1234567890abcdef",
              "decimals": 18,
              "interop": true,
              "kind": "ERC20",
              "symbol": "USDC",
            },
            {
              "address": "0xfedcba0987654321",
              "decimals": 6,
              "interop": true,
              "kind": "ERC20",
              "nativeRate": "0x1000",
              "symbol": "USDT",
            },
          ],
        }
      `)
    })

    test.each([
      {
        case: 'unsupported with empty tokens',
        expected: { supported: false, tokens: [] },
        input: { supported: false, tokens: [] },
      },
      {
        case: 'supported with empty tokens',
        expected: { supported: true, tokens: [] },
        input: { supported: true, tokens: [] },
      },
      {
        case: 'supported with token including BigInt nativeRate conversion',
        expected: {
          supported: true,
          tokens: [
            {
              address: '0x123',
              decimals: 18,
              interop: true,
              kind: 'ERC20',
              nativeRate: '0xff',
              symbol: 'TEST',
            },
          ],
        },
        input: {
          supported: true,
          tokens: [
            {
              address: '0x123',
              decimals: 18,
              interop: true,
              kind: 'ERC20',
              nativeRate: 255n,
              symbol: 'TEST',
            },
          ] as const,
        },
      },
    ])(
      'behavior: encodes feeToken data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(
          Capabilities.feeToken.GetCapabilitiesResponse,
        )(input)
        expect(encoded).toEqual(expected)
      },
    )

    test('error: should reject invalid token structure', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.feeToken.GetCapabilitiesResponse)(
          {
            supported: false,
            tokens: [{ invalid: 'token' }],
          },
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`address\` is missing
        Path: tokens.0.address

        Details: { readonly supported: boolean; readonly tokens: ReadonlyArray<{ readonly address: \`0x\${string}\`; readonly decimals: number; readonly interop: boolean; readonly kind: string; readonly nativeRate?: (\`0x\${string}\` <-> bigint) | undefined; readonly symbol: string }> }
        └─ ["tokens"]
           └─ ReadonlyArray<{ readonly address: \`0x\${string}\`; readonly decimals: number; readonly interop: boolean; readonly kind: string; readonly nativeRate?: (\`0x\${string}\` <-> bigint) | undefined; readonly symbol: string }>
              └─ [0]
                 └─ { readonly address: \`0x\${string}\`; readonly decimals: number; readonly interop: boolean; readonly kind: string; readonly nativeRate?: (\`0x\${string}\` <-> bigint) | undefined; readonly symbol: string }
                    └─ ["address"]
                       └─ is missing]
      `)
    })
  })

  describe('Request', () => {
    test('behavior: should parse string symbol', () => {
      const result = Schema.decodeUnknownSync(Capabilities.feeToken.Request)(
        'USDC',
      )
      expect(result).toBe('USDC')
    })

    test('behavior: should parse address', () => {
      const result = Schema.decodeUnknownSync(Capabilities.feeToken.Request)(
        '0x1234567890abcdef',
      )
      expect(result).toBe('0x1234567890abcdef')
    })

    test('behavior: should encode string symbol', () => {
      const decoded = Schema.decodeUnknownSync(Capabilities.feeToken.Request)(
        'USDC',
      )
      const encoded = Schema.encodeSync(Capabilities.feeToken.Request)(decoded)
      expect(encoded).toBe('USDC')
    })

    test('behavior: should encode address', () => {
      const decoded = Schema.decodeUnknownSync(Capabilities.feeToken.Request)(
        '0x1234567890abcdef',
      )
      const encoded = Schema.encodeSync(Capabilities.feeToken.Request)(decoded)
      expect(encoded).toBe('0x1234567890abcdef')
    })

    test.each([
      { case: 'symbol USDC', expected: 'USDC', input: 'USDC' },
      { case: 'symbol ETH', expected: 'ETH', input: 'ETH' },
      {
        case: 'hex address',
        expected: '0x123456789abcdef',
        input: '0x123456789abcdef',
      },
      {
        case: 'zero address',
        expected: '0x0000000000000000000000000000000000000000',
        input: '0x0000000000000000000000000000000000000000',
      },
    ])(
      'behavior: encodes feeToken request data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(Capabilities.feeToken.Request)(input)
        expect(encoded).toBe(expected)
      },
    )

    test('error: should reject invalid address format', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.feeToken.Request)(123),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected string, actual 123

        Details: string | \`0x\${string}\`
        ├─ Expected string, actual 123
        └─ Expected \`0x\${string}\`, actual 123]
      `)
    })
  })
})

describe('merchant', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: should parse supported true', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.merchant.GetCapabilitiesResponse,
      )({ supported: true })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": true,
          }
        `)
    })

    test('behavior: should parse supported false', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.merchant.GetCapabilitiesResponse,
      )({ supported: false })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": false,
          }
        `)
    })

    test('behavior: should encode supported true', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.merchant.GetCapabilitiesResponse,
      )({ supported: true })
      const encoded = Schema.encodeSync(
        Capabilities.merchant.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
        }
      `)
    })

    test('behavior: should encode supported false', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.merchant.GetCapabilitiesResponse,
      )({ supported: false })
      const encoded = Schema.encodeSync(
        Capabilities.merchant.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": false,
        }
      `)
    })

    test.each([
      {
        case: 'supported true',
        expected: { supported: true },
        input: { supported: true },
      },
      {
        case: 'supported false',
        expected: { supported: false },
        input: { supported: false },
      },
    ])(
      'behavior: encodes merchant data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(
          Capabilities.merchant.GetCapabilitiesResponse,
        )(input)
        expect(encoded).toEqual(expected)
      },
    )

    test('error: should reject missing supported field', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.merchant.GetCapabilitiesResponse)(
          {},
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`supported\` is missing
        Path: supported

        Details: { readonly supported: boolean }
        └─ ["supported"]
           └─ is missing]
      `)
    })
  })
})

describe('permissions', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: should parse response', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.permissions.GetCapabilitiesResponse,
      )({ supported: true })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": true,
          }
        `)
    })

    test('behavior: should encode permissions response', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.permissions.GetCapabilitiesResponse,
      )({ supported: true })
      const encoded = Schema.encodeSync(
        Capabilities.permissions.GetCapabilitiesResponse,
      )(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
        }
      `)
    })

    test.each([
      {
        case: 'supported true',
        expected: { supported: true },
        input: { supported: true },
      },
      {
        case: 'supported false',
        expected: { supported: false },
        input: { supported: false },
      },
    ])(
      'behavior: encodes permissions response data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(
          Capabilities.permissions.GetCapabilitiesResponse,
        )(input)
        expect(encoded).toEqual(expected)
      },
    )

    test('error: should reject invalid type', () => {
      expect(() =>
        Schema.decodeUnknownSync(
          Capabilities.permissions.GetCapabilitiesResponse,
        )({ supported: 'yes' }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected boolean, actual "yes"
        Path: supported

        Details: { readonly supported: boolean }
        └─ ["supported"]
           └─ Expected boolean, actual "yes"]
      `)
    })
  })

  describe('Request', () => {
    test('behavior: should parse empty object', () => {
      const result = Schema.decodeUnknownSync(Capabilities.permissions.Request)(
        {},
      )
      expect(result).toMatchInlineSnapshot('{}')
    })

    test('behavior: should parse with id', () => {
      const result = Schema.decodeUnknownSync(Capabilities.permissions.Request)(
        { id: '0xabc123' },
      )
      expect(result).toMatchInlineSnapshot(`
          {
            "id": "0xabc123",
          }
        `)
    })

    test('behavior: should encode empty object', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.permissions.Request,
      )({})
      const encoded = Schema.encodeSync(Capabilities.permissions.Request)(
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot('{}')
    })

    test('behavior: should encode with id', () => {
      const originalData = { id: '0xabc123' }
      const decoded = Schema.decodeUnknownSync(
        Capabilities.permissions.Request,
      )(originalData)
      const encoded = Schema.encodeSync(Capabilities.permissions.Request)(
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "id": "0xabc123",
        }
      `)
    })

    test.each([
      { case: 'empty object', expected: {}, input: {} },
      {
        case: 'with short id',
        expected: { id: '0x123' },
        input: { id: '0x123' },
      },
      {
        case: 'with long id',
        expected: { id: '0xdeadbeef' },
        input: { id: '0xdeadbeef' },
      },
    ] as const)(
      'behavior: encodes permissions request data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(Capabilities.permissions.Request)(
          input,
        )
        expect(encoded).toEqual(expected)
      },
    )

    test('error: should reject invalid id format', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.permissions.Request)({
          id: 'not-hex',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"
        Path: id

        Details: { readonly id?: \`0x\${string}\` | undefined }
        └─ ["id"]
           └─ \`0x\${string}\` | undefined
              ├─ Expected \`0x\${string}\`, actual "not-hex"
              └─ Expected undefined, actual "not-hex"]
      `)
    })
  })
})

describe('preCalls', () => {
  describe('Request', () => {
    test('behavior: should parse empty array', () => {
      const result = Schema.decodeUnknownSync(Capabilities.preCalls.Request)([])
      expect(result).toMatchInlineSnapshot('[]')
    })

    test('behavior: should parse array with entries', () => {
      const result = Schema.decodeUnknownSync(Capabilities.preCalls.Request)([
        {
          context: { foo: 'bar' },
          signature: '0xdeadbeef',
        },
        {
          context: 123,
          signature: '0xfeedface',
        },
      ])
      expect(result).toMatchInlineSnapshot(`
          [
            {
              "context": {
                "foo": "bar",
              },
              "signature": "0xdeadbeef",
            },
            {
              "context": 123,
              "signature": "0xfeedface",
            },
          ]
        `)
    })

    test('error: should reject entry without signature', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.preCalls.Request)([
          { context: {} },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`signature\` is missing
        Path: 0.signature

        Details: ReadonlyArray<{ readonly context: unknown; readonly signature: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly context: unknown; readonly signature: \`0x\${string}\` }
              └─ ["signature"]
                 └─ is missing]
      `)
    })

    test('behavior: should encode empty array', () => {
      const decoded = Schema.decodeUnknownSync(Capabilities.preCalls.Request)(
        [],
      )
      const encoded = Schema.encodeSync(Capabilities.preCalls.Request)(decoded)
      expect(encoded).toMatchInlineSnapshot('[]')
    })

    test('behavior: should encode array with entries', () => {
      const originalData = [
        {
          context: { foo: 'bar' },
          signature: '0xdeadbeef',
        },
        {
          context: 123,
          signature: '0xfeedface',
        },
      ]
      const decoded = Schema.decodeUnknownSync(Capabilities.preCalls.Request)(
        originalData,
      )
      const encoded = Schema.encodeSync(Capabilities.preCalls.Request)(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "foo": "bar",
            },
            "signature": "0xdeadbeef",
          },
          {
            "context": 123,
            "signature": "0xfeedface",
          },
        ]
      `)
    })

    test('behavior: should encode array with various context types', () => {
      const originalData = [
        { context: null, signature: '0x123' },
        { context: 'string', signature: '0x456' },
        { context: true, signature: '0x789' },
        { context: { nested: { object: 'value' } }, signature: '0xabc' },
      ]
      const decoded = Schema.decodeUnknownSync(Capabilities.preCalls.Request)(
        originalData,
      )
      const encoded = Schema.encodeSync(Capabilities.preCalls.Request)(decoded)
      expect(encoded).toMatchInlineSnapshot(`
        [
          {
            "context": null,
            "signature": "0x123",
          },
          {
            "context": "string",
            "signature": "0x456",
          },
          {
            "context": true,
            "signature": "0x789",
          },
          {
            "context": {
              "nested": {
                "object": "value",
              },
            },
            "signature": "0xabc",
          },
        ]
      `)
    })

    test.each([
      { case: 'empty array', expected: [], input: [] },
      {
        case: 'single entry with empty context',
        expected: [{ context: {}, signature: '0x123' }],
        input: [{ context: {}, signature: '0x123' }],
      },
      {
        case: 'multiple entries with different context types',
        expected: [
          { context: 'test', signature: '0xabc' },
          { context: null, signature: '0xdef' },
        ],
        input: [
          { context: 'test', signature: '0xabc' },
          { context: null, signature: '0xdef' },
        ],
      },
    ] as const)(
      'behavior: encodes preCalls data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(Capabilities.preCalls.Request)(input)
        expect(encoded).toEqual(expected)
      },
    )

    test('error: should reject invalid signature format', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.preCalls.Request)([
          { context: null, signature: 'invalid' },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid"
        Path: 0.signature

        Details: ReadonlyArray<{ readonly context: unknown; readonly signature: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly context: unknown; readonly signature: \`0x\${string}\` }
              └─ ["signature"]
                 └─ Expected \`0x\${string}\`, actual "invalid"]
      `)
    })
  })
})

describe('merchantRpcUrl', () => {
  describe('Request', () => {
    test('behavior: should parse string url', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.merchantRpcUrl.Request,
      )('https://rpc.example.com')
      expect(result).toBe('https://rpc.example.com')
    })

    test('behavior: should parse empty string', () => {
      const result = Schema.decodeUnknownSync(
        Capabilities.merchantRpcUrl.Request,
      )('')
      expect(result).toBe('')
    })

    test('behavior: should encode string url', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.merchantRpcUrl.Request,
      )('https://rpc.example.com')
      const encoded = Schema.encodeSync(Capabilities.merchantRpcUrl.Request)(
        decoded,
      )
      expect(encoded).toBe('https://rpc.example.com')
    })

    test('behavior: should encode empty string', () => {
      const decoded = Schema.decodeUnknownSync(
        Capabilities.merchantRpcUrl.Request,
      )('')
      const encoded = Schema.encodeSync(Capabilities.merchantRpcUrl.Request)(
        decoded,
      )
      expect(encoded).toBe('')
    })

    test.each([
      { case: 'empty string', expected: '', input: '' },
      {
        case: 'https URL',
        expected: 'https://rpc.example.com',
        input: 'https://rpc.example.com',
      },
      {
        case: 'localhost URL',
        expected: 'http://localhost:8545',
        input: 'http://localhost:8545',
      },
      {
        case: 'websocket URL',
        expected: 'wss://eth-mainnet.alchemyapi.io/v2/demo',
        input: 'wss://eth-mainnet.alchemyapi.io/v2/demo',
      },
    ])(
      'behavior: encodes merchantRpcUrl data correctly for $case',
      ({ input, expected }) => {
        const encoded = Schema.encodeSync(Capabilities.merchantRpcUrl.Request)(
          input,
        )
        expect(encoded).toBe(expected)
      },
    )

    test('error: should reject non-string', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.merchantRpcUrl.Request)(123),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected string, actual 123

        Details: Expected string, actual 123]
      `,
      )
    })
  })
})
