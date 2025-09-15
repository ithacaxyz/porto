import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as Capabilities from './capabilities.js'
import * as u from './utils.js'

describe('atomic', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: parse supported status', () => {
      const result = z.parse(Capabilities.atomic.GetCapabilitiesResponse, {
        status: 'supported',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "status": "supported",
          }
        `)
    })

    test('behavior: parse unsupported status', () => {
      const result = z.parse(Capabilities.atomic.GetCapabilitiesResponse, {
        status: 'unsupported',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "status": "unsupported",
          }
        `)
    })

    test('error: reject invalid status', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.atomic.GetCapabilitiesResponse, {
            status: 'invalid',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`status\`: Invalid union value.
          - Expected "supported"
          - Expected "unsupported"]
      `,
      )
    })

    test('behavior: encode supported status', () => {
      const decoded = z.parse(Capabilities.atomic.GetCapabilitiesResponse, {
        status: 'supported',
      })
      const encoded = z.encode(
        Capabilities.atomic.GetCapabilitiesResponse,
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "status": "supported",
        }
      `)
    })

    test('behavior: encode unsupported status', () => {
      const decoded = z.parse(Capabilities.atomic.GetCapabilitiesResponse, {
        status: 'unsupported',
      })
      const encoded = z.encode(
        Capabilities.atomic.GetCapabilitiesResponse,
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "status": "unsupported",
        }
      `)
    })

    test('behavior: round-trip encoding/decoding preserves data', () => {
      const originalData = { status: 'supported' as const }
      const decoded = z.parse(
        Capabilities.atomic.GetCapabilitiesResponse,
        originalData,
      )
      const encoded = z.encode(
        Capabilities.atomic.GetCapabilitiesResponse,
        decoded,
      )
      const reDecoded = z.parse(
        Capabilities.atomic.GetCapabilitiesResponse,
        encoded,
      )
      expect(reDecoded).toEqual(decoded)
    })

    test('error: reject missing status', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.atomic.GetCapabilitiesResponse, {}).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`status\`: Invalid union value.
          - Expected "supported"
          - Expected "unsupported"]
      `,
      )
    })
  })
})

describe('createAccount', () => {
  describe('Request', () => {
    test('behavior: parse boolean true', () => {
      const result = z.parse(Capabilities.createAccount.Request, true)
      expect(result).toBe(true)
    })

    test('behavior: parse boolean false', () => {
      const result = z.parse(Capabilities.createAccount.Request, false)
      expect(result).toBe(false)
    })

    test('behavior: parse object with chainId', () => {
      const result = z.parse(Capabilities.createAccount.Request, {
        chainId: '0x1',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "chainId": 1,
          }
        `)
    })

    test('behavior: parse object with label', () => {
      const result = z.parse(Capabilities.createAccount.Request, {
        label: 'My Account',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "label": "My Account",
          }
        `)
    })

    test('behavior: parse object with both chainId and label', () => {
      const result = z.parse(Capabilities.createAccount.Request, {
        chainId: '0xa',
        label: 'Test Account',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "chainId": 10,
            "label": "Test Account",
          }
        `)
    })

    test('behavior: parse empty object', () => {
      const result = z.parse(Capabilities.createAccount.Request, {})
      expect(result).toMatchInlineSnapshot('{}')
    })

    test('behavior: encode boolean true', () => {
      const decoded = z.parse(Capabilities.createAccount.Request, true)
      const encoded = z.encode(Capabilities.createAccount.Request, decoded)
      expect(encoded).toBe(true)
    })

    test('behavior: encode boolean false', () => {
      const decoded = z.parse(Capabilities.createAccount.Request, false)
      const encoded = z.encode(Capabilities.createAccount.Request, decoded)
      expect(encoded).toBe(false)
    })

    test('behavior: encode object with chainId back to hex', () => {
      const originalData = { chainId: '0xa' }
      const decoded = z.parse(Capabilities.createAccount.Request, originalData)
      const encoded = z.encode(Capabilities.createAccount.Request, decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "chainId": "0xa",
        }
      `)
    })

    test('behavior: encode object with label', () => {
      const originalData = { label: 'My Account' }
      const decoded = z.parse(Capabilities.createAccount.Request, originalData)
      const encoded = z.encode(Capabilities.createAccount.Request, decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "label": "My Account",
        }
      `)
    })

    test('behavior: encode object with both chainId and label', () => {
      const originalData = { chainId: '0x1', label: 'Test Account' }
      const decoded = z.parse(Capabilities.createAccount.Request, originalData)
      const encoded = z.encode(Capabilities.createAccount.Request, decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "chainId": "0x1",
          "label": "Test Account",
        }
      `)
    })

    test('behavior: encode empty object', () => {
      const decoded = z.parse(Capabilities.createAccount.Request, {})
      const encoded = z.encode(Capabilities.createAccount.Request, decoded)
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
      const encoded = z.encode(Capabilities.createAccount.Request, input)
      expect(encoded).toEqual(expected)
    })

    test('error: reject invalid type', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.createAccount.Request, 'string').error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Invalid union value.
          - Expected boolean. 
          - Expected object. ]
      `,
      )
    })
  })
})

describe('signInWithEthereum', () => {
  describe('Request', () => {
    test('behavior: parse struct with nonce and no authUrl', () => {
      const result = z.parse(Capabilities.signInWithEthereum.Request, {
        nonce: 'abc123',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "nonce": "abc123",
          }
        `)
    })

    test('behavior: parse struct with authUrl string', () => {
      const result = z.parse(Capabilities.signInWithEthereum.Request, {
        authUrl: 'https://example.com/auth',
        nonce: 'xyz789',
      })
      expect(result).toMatchInlineSnapshot(`
        {
          "nonce": "xyz789",
        }
      `)
    })

    test('behavior: parse struct with all optional fields', () => {
      const result = z.parse(Capabilities.signInWithEthereum.Request, {
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

    test('error: reject struct without nonce', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.signInWithEthereum.Request, {
            domain: 'example.com',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Invalid union value.
          - at \`nonce\`: Expected string. 
          - at \`authUrl\`: Invalid union value.
            - Expected string. 
            - Expected object. ]
      `,
      )
    })

    test('behavior: encode struct with nonce', () => {
      const originalData = { nonce: 'abc123' }
      const decoded = z.parse(
        Capabilities.signInWithEthereum.Request,
        originalData,
      )
      const encoded = z.encode(Capabilities.signInWithEthereum.Request, decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "nonce": "abc123",
        }
      `)
    })

    test('behavior: encode struct with authUrl', () => {
      const originalData = {
        authUrl: 'https://example.com/auth',
        nonce: 'xyz789',
      }
      const decoded = z.parse(
        Capabilities.signInWithEthereum.Request,
        originalData,
      )
      const encoded = z.encode(Capabilities.signInWithEthereum.Request, decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "nonce": "xyz789",
        }
      `)
    })

    test('behavior: encode struct with all fields including dates', () => {
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
      const decoded = z.parse(
        Capabilities.signInWithEthereum.Request,
        originalData,
      )
      const encoded = z.encode(Capabilities.signInWithEthereum.Request, decoded)
      expect(encoded).toMatchInlineSnapshot(`
        {
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
        case: 'authUrl only',
        expected: { authUrl: 'https://test.com' },
        input: { authUrl: 'https://test.com' },
      },
      {
        case: 'authUrl with properties',
        expected: {
          authUrl: {
            logout: 'https://test.com/logout',
            nonce: 'https://test.com/nonce',
            verify: 'https://test.com/verify',
          },
        },
        input: {
          authUrl: {
            logout: 'https://test.com/logout',
            nonce: 'https://test.com/nonce',
            verify: 'https://test.com/verify',
          },
        },
      },
      {
        case: 'multiple fields with undefined authUrl',
        expected: {
          chainId: 5,
          domain: 'test.com',
          nonce: 'test3',
          version: '1',
        },
        input: {
          chainId: 5,
          domain: 'test.com',
          nonce: 'test3',
          version: '1' as const,
        },
      },
    ])('behavior: encodes $case correctly', ({ input, expected }) => {
      const encoded = z.encode(Capabilities.signInWithEthereum.Request, input)
      expect(encoded).toEqual(expected)
    })

    test('error: reject invalid version', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.signInWithEthereum.Request, {
            nonce: 'test',
            version: '2',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Invalid union value.
          - at \`version\`: Expected "1"
          - at \`authUrl\`: Invalid union value.
            - Expected string. 
            - Expected object. 
          - at \`version\`: Expected "1"]
      `,
      )
    })
  })

  describe('Response', () => {
    test('behavior: parse valid response', () => {
      const result = z.parse(Capabilities.signInWithEthereum.Response, {
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

    test('error: reject missing message', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.signInWithEthereum.Response, {
            signature: '0xdeadbeef',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`message\`: Expected string. ]
      `,
      )
    })

    test('error: reject missing signature', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.signInWithEthereum.Response, {
            message: 'Sign in',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`signature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
      `,
      )
    })

    test('behavior: encode valid response', () => {
      const originalData = {
        message: 'Sign in to example.com',
        signature: '0xdeadbeef',
      }
      const decoded = z.parse(
        Capabilities.signInWithEthereum.Response,
        originalData,
      )
      const encoded = z.encode(
        Capabilities.signInWithEthereum.Response,
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "message": "Sign in to example.com",
          "signature": "0xdeadbeef",
        }
      `)
    })

    test('behavior: encodes response preserving signature format', () => {
      const input = { message: 'Test message', signature: '0x123456789abcdef' }
      const decoded = z.parse(Capabilities.signInWithEthereum.Response, input)
      const encoded = z.encode(
        Capabilities.signInWithEthereum.Response,
        decoded,
      )
      expect(encoded).toEqual({
        message: 'Test message',
        signature: '0x123456789abcdef',
      })
    })

    test('error: reject invalid signature format', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.signInWithEthereum.Response, {
            message: 'Sign in',
            signature: 'invalid',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`signature\`: Must match pattern: ^0x[\\s\\S]{0,}$]
      `,
      )
    })
  })
})

describe('feeToken', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: parse response with empty tokens', () => {
      const result = z.parse(Capabilities.feeToken.GetCapabilitiesResponse, {
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

    test('behavior: parse response with tokens', () => {
      const result = z.parse(Capabilities.feeToken.GetCapabilitiesResponse, {
        supported: true,
        tokens: [
          {
            address: '0x1234567890abcdef',
            decimals: 18,
            interop: true,
            symbol: 'USDC',
            uid: 'usdc',
          },
          {
            address: '0xfedcba0987654321',
            decimals: 6,
            interop: true,
            nativeRate: '0x1000',
            symbol: 'USDT',
            uid: 'usdt',
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
              "symbol": "USDC",
              "uid": "usdc",
            },
            {
              "address": "0xfedcba0987654321",
              "decimals": 6,
              "interop": true,
              "nativeRate": 4096n,
              "symbol": "USDT",
              "uid": "usdt",
            },
          ],
        }
      `)
    })

    test('error: reject missing supported field', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.feeToken.GetCapabilitiesResponse, {
            tokens: [],
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`supported\`: Expected boolean. ]
      `,
      )
    })

    test('behavior: encode response with empty tokens', () => {
      const originalData = { supported: true, tokens: [] }
      const decoded = z.parse(
        Capabilities.feeToken.GetCapabilitiesResponse,
        originalData,
      )
      const encoded = z.encode(
        Capabilities.feeToken.GetCapabilitiesResponse,
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
          "tokens": [],
        }
      `)
    })

    test('behavior: encode response with tokens and BigInt nativeRate', () => {
      const originalData = {
        supported: true,
        tokens: [
          {
            address: '0x1234567890abcdef',
            decimals: 18,
            interop: true,
            symbol: 'USDC',
            uid: 'usdc',
          },
          {
            address: '0xfedcba0987654321',
            decimals: 6,
            interop: true,
            nativeRate: '0x1000',
            symbol: 'USDT',
            uid: 'usdt',
          },
        ],
      }
      const decoded = z.parse(
        Capabilities.feeToken.GetCapabilitiesResponse,
        originalData,
      )
      const encoded = z.encode(
        Capabilities.feeToken.GetCapabilitiesResponse,
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
          "tokens": [
            {
              "address": "0x1234567890abcdef",
              "decimals": 18,
              "interop": true,
              "symbol": "USDC",
              "uid": "usdc",
            },
            {
              "address": "0xfedcba0987654321",
              "decimals": 6,
              "interop": true,
              "nativeRate": "0x1000",
              "symbol": "USDT",
              "uid": "usdt",
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
              nativeRate: '0xff',
              symbol: 'TEST',
              uid: 'test',
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
              nativeRate: 255n,
              symbol: 'TEST',
              uid: 'test',
            },
          ] as const,
        },
      },
    ])(
      'behavior: encodes feeToken data correctly for $case',
      ({ input, expected }) => {
        const encoded = z.encode(
          Capabilities.feeToken.GetCapabilitiesResponse,
          input,
        )
        expect(encoded).toEqual(expected)
      },
    )

    test('error: reject invalid token structure', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.feeToken.GetCapabilitiesResponse, {
            supported: false,
            tokens: [{ invalid: 'token' }],
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 4 errors:

        - at \`tokens[0].address\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`tokens[0].decimals\`: Expected number. 
        - at \`tokens[0].symbol\`: Expected string. 
        - at \`tokens[0].uid\`: Expected string. ]
      `,
      )
    })
  })

  describe('Request', () => {
    test('behavior: parse string symbol', () => {
      const result = z.parse(Capabilities.feeToken.Request, 'USDC')
      expect(result).toBe('USDC')
    })

    test('behavior: parse address', () => {
      const result = z.parse(
        Capabilities.feeToken.Request,
        '0x1234567890abcdef',
      )
      expect(result).toBe('0x1234567890abcdef')
    })

    test('behavior: encode string symbol', () => {
      const decoded = z.parse(Capabilities.feeToken.Request, 'USDC')
      const encoded = z.encode(Capabilities.feeToken.Request, decoded)
      expect(encoded).toBe('USDC')
    })

    test('behavior: encode address', () => {
      const decoded = z.parse(
        Capabilities.feeToken.Request,
        '0x1234567890abcdef',
      )
      const encoded = z.encode(Capabilities.feeToken.Request, decoded)
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
        const encoded = z.encode(Capabilities.feeToken.Request, input)
        expect(encoded).toBe(expected)
      },
    )

    test('error: reject invalid address format', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.feeToken.Request, 123).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Invalid union value.
          - Expected string. 
          - Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.]
      `,
      )
    })
  })
})

describe('merchant', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: parse supported true', () => {
      const result = z.parse(Capabilities.merchant.GetCapabilitiesResponse, {
        supported: true,
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": true,
          }
        `)
    })

    test('behavior: parse supported false', () => {
      const result = z.parse(Capabilities.merchant.GetCapabilitiesResponse, {
        supported: false,
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": false,
          }
        `)
    })

    test('behavior: encode supported true', () => {
      const decoded = z.parse(Capabilities.merchant.GetCapabilitiesResponse, {
        supported: true,
      })
      const encoded = z.encode(
        Capabilities.merchant.GetCapabilitiesResponse,
        decoded,
      )
      expect(encoded).toMatchInlineSnapshot(`
        {
          "supported": true,
        }
      `)
    })

    test('behavior: encode supported false', () => {
      const decoded = z.parse(Capabilities.merchant.GetCapabilitiesResponse, {
        supported: false,
      })
      const encoded = z.encode(
        Capabilities.merchant.GetCapabilitiesResponse,
        decoded,
      )
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
        const encoded = z.encode(
          Capabilities.merchant.GetCapabilitiesResponse,
          input,
        )
        expect(encoded).toEqual(expected)
      },
    )

    test('error: reject missing supported field', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.merchant.GetCapabilitiesResponse, {}).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`supported\`: Expected boolean. ]
      `,
      )
    })
  })
})

describe('permissions', () => {
  describe('GetCapabilitiesResponse', () => {
    test('behavior: parse response', () => {
      const result = z.parse(Capabilities.permissions.GetCapabilitiesResponse, {
        supported: true,
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "supported": true,
          }
        `)
    })

    test('behavior: encode permissions response', () => {
      const decoded = z.parse(
        Capabilities.permissions.GetCapabilitiesResponse,
        { supported: true },
      )
      const encoded = z.encode(
        Capabilities.permissions.GetCapabilitiesResponse,
        decoded,
      )
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
        const encoded = z.encode(
          Capabilities.permissions.GetCapabilitiesResponse,
          input,
        )
        expect(encoded).toEqual(expected)
      },
    )

    test('error: reject invalid type', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.permissions.GetCapabilitiesResponse, {
            supported: 'yes',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`supported\`: Expected boolean. ]
      `,
      )
    })
  })

  describe('Request', () => {
    test('behavior: parse empty object', () => {
      const result = z.parse(Capabilities.permissions.Request, {})
      expect(result).toMatchInlineSnapshot('{}')
    })

    test('behavior: parse with id', () => {
      const result = z.parse(Capabilities.permissions.Request, {
        id: '0xabc123',
      })
      expect(result).toMatchInlineSnapshot(`
          {
            "id": "0xabc123",
          }
        `)
    })

    test('behavior: encode empty object', () => {
      const decoded = z.parse(Capabilities.permissions.Request, {})
      const encoded = z.encode(Capabilities.permissions.Request, decoded)
      expect(encoded).toMatchInlineSnapshot('{}')
    })

    test('behavior: encode with id', () => {
      const originalData = { id: '0xabc123' }
      const decoded = z.parse(Capabilities.permissions.Request, originalData)
      const encoded = z.encode(Capabilities.permissions.Request, decoded)
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
        const encoded = z.encode(Capabilities.permissions.Request, input)
        expect(encoded).toEqual(expected)
      },
    )

    test('error: reject invalid id format', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.permissions.Request, {
            id: 'not-hex',
          }).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`id\`: Invalid union value.
          - Must match pattern: ^0x[\\s\\S]{0,}$
          - Expected null. ]
      `,
      )
    })
  })
})

describe('preCalls', () => {
  describe('Request', () => {
    test('behavior: parse empty array', () => {
      const result = z.parse(Capabilities.preCalls.Request, [])
      expect(result).toMatchInlineSnapshot('[]')
    })

    test('behavior: parse array with entries', () => {
      const result = z.parse(Capabilities.preCalls.Request, [
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

    test('error: reject entry without signature', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.preCalls.Request, [{ context: {} }]).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[0].signature\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
      `,
      )
    })

    test('behavior: encode empty array', () => {
      const decoded = z.parse(Capabilities.preCalls.Request, [])
      const encoded = z.encode(Capabilities.preCalls.Request, decoded)
      expect(encoded).toMatchInlineSnapshot('[]')
    })

    test('behavior: encode array with entries', () => {
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
      const decoded = z.parse(Capabilities.preCalls.Request, originalData)
      const encoded = z.encode(Capabilities.preCalls.Request, decoded)
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

    test('behavior: encode array with various context types', () => {
      const originalData = [
        { context: null, signature: '0x123' },
        { context: 'string', signature: '0x456' },
        { context: true, signature: '0x789' },
        { context: { nested: { object: 'value' } }, signature: '0xabc' },
      ]
      const decoded = z.parse(Capabilities.preCalls.Request, originalData)
      const encoded = z.encode(Capabilities.preCalls.Request, decoded)
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
        const encoded = z.encode(Capabilities.preCalls.Request, input)
        expect(encoded).toEqual(expected)
      },
    )

    test('error: reject invalid signature format', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.preCalls.Request, [
            { context: null, signature: 'invalid' },
          ]).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[0].signature\`: Must match pattern: ^0x[\\s\\S]{0,}$]
      `,
      )
    })
  })
})

describe('merchantUrl', () => {
  describe('Request', () => {
    test('behavior: parse string url', () => {
      const result = z.parse(
        Capabilities.merchantUrl.Request,
        'https://rpc.example.com',
      )
      expect(result).toBe('https://rpc.example.com')
    })

    test('behavior: parse empty string', () => {
      const result = z.parse(Capabilities.merchantUrl.Request, '')
      expect(result).toBe('')
    })

    test('behavior: encode string url', () => {
      const decoded = z.parse(
        Capabilities.merchantUrl.Request,
        'https://rpc.example.com',
      )
      const encoded = z.encode(Capabilities.merchantUrl.Request, decoded)
      expect(encoded).toBe('https://rpc.example.com')
    })

    test('behavior: encode empty string', () => {
      const decoded = z.parse(Capabilities.merchantUrl.Request, '')
      const encoded = z.encode(Capabilities.merchantUrl.Request, decoded)
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
      'behavior: encodes merchantUrl data correctly for $case',
      ({ input, expected }) => {
        const encoded = z.encode(Capabilities.merchantUrl.Request, input)
        expect(encoded).toBe(expected)
      },
    )

    test('error: reject non-string', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.merchantUrl.Request, 123).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Expected string. ]
      `,
      )
    })
  })
})
