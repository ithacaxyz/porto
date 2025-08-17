import { describe, expect, test } from 'vitest'
import * as Schema from '../../schema/schema.js'
import * as Capabilities from './capabilities.js'

describe('authorizeKeys', () => {
  describe('Request', () => {
    test('param: validates as array', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.authorizeKeys.Request)('invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }>, actual "invalid"

        Details: Expected ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }>, actual "invalid"]
      `,
      )
    })

    test('param: validates array items as key with permissions', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.authorizeKeys.Request)([
          { invalid: 'key' },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`expiry\` is missing
        Path: 0.expiry

        Details: ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }>
        └─ [0]
           └─ { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }
              └─ ["expiry"]
                 └─ is missing]
      `)
    })

    test('behavior: accepts empty array', () => {
      const request = Schema.decodeUnknownSync(
        Capabilities.authorizeKeys.Request,
      )([])
      expect(request).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid key with permissions', () => {
      const request = Schema.decodeUnknownSync(
        Capabilities.authorizeKeys.Request,
      )([
        {
          expiry: '0x499602d2',
          permissions: [
            {
              selector: '0x1234',
              to: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
              type: 'call',
            },
          ],
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        },
      ])

      expect(request).toMatchInlineSnapshot(`
        [
          {
            "expiry": 1234567890,
            "permissions": [
              {
                "selector": "0x1234",
                "to": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
                "type": "call",
              },
            ],
            "publicKey": "0x1234567890abcdef",
            "role": "admin",
            "type": "secp256k1",
          },
        ]
      `)
    })

    test('behavior: accepts multiple keys', () => {
      const request = Schema.decodeUnknownSync(
        Capabilities.authorizeKeys.Request,
      )([
        {
          expiry: '0x499602d2',
          permissions: [],
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        },
        {
          expiry: '0x499602d3',
          permissions: [
            {
              limit: '0x64',
              period: 'day',
              token: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
              type: 'spend',
            },
          ],
          publicKey: '0xabcdef1234567890',
          role: 'normal',
          type: 'p256',
        },
      ])

      expect(request).toHaveLength(2)
      expect(request[0]!.role).toBe('admin')
      expect(request[1]!.role).toBe('normal')
    })

    test('misc: encodes request correctly', () => {
      const request = [
        {
          expiry: 1234567890,
          permissions: [
            {
              selector: '0x1234',
              to: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
              type: 'call' as const,
            },
          ],
          publicKey: '0x1234567890abcdef',
          role: 'admin' as const,
          type: 'secp256k1' as const,
        },
      ] as const

      const encoded = Schema.encodeSync(Capabilities.authorizeKeys.Request)(
        request,
      )
      expect(encoded).toMatchInlineSnapshot(`
        [
          {
            "expiry": "0x499602d2",
            "permissions": [
              {
                "selector": "0x1234",
                "to": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
                "type": "call",
              },
            ],
            "publicKey": "0x1234567890abcdef",
            "role": "admin",
            "type": "secp256k1",
          },
        ]
      `)
    })
  })

  describe('Response', () => {
    test('param: validates as array', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.authorizeKeys.Response)(
          'invalid',
        ),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>; readonly hash: \`0x\${string}\` }>, actual "invalid"

        Details: Expected ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>; readonly hash: \`0x\${string}\` }>, actual "invalid"]
      `,
      )
    })

    test('param: validates hash field is required', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.authorizeKeys.Response)([
          {
            expiry: '0x499602d2',
            permissions: [],
            publicKey: '0x1234567890abcdef',
            role: 'admin',
            type: 'secp256k1',
          },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`hash\` is missing
        Path: 0.hash

        Details: ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>; readonly hash: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>; readonly hash: \`0x\${string}\` }
              └─ ["hash"]
                 └─ is missing]
      `)
    })

    test('param: validates hash as hex string', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.authorizeKeys.Response)([
          {
            expiry: '0x499602d2',
            hash: 'invalid-hex',
            permissions: [],
            publicKey: '0x1234567890abcdef',
            role: 'admin',
            type: 'secp256k1',
          },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hex"
        Path: 0.hash

        Details: ReadonlyArray<{ readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>; readonly hash: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>; readonly hash: \`0x\${string}\` }
              └─ ["hash"]
                 └─ Expected \`0x\${string}\`, actual "invalid-hex"]
      `)
    })

    test('behavior: accepts empty array', () => {
      const response = Schema.decodeUnknownSync(
        Capabilities.authorizeKeys.Response,
      )([])
      expect(response).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid key with hash', () => {
      const response = Schema.decodeUnknownSync(
        Capabilities.authorizeKeys.Response,
      )([
        {
          expiry: '0x499602d2',
          hash: '0xabcdef1234567890',
          permissions: [],
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        },
      ])

      expect(response).toMatchInlineSnapshot(`
        [
          {
            "expiry": 1234567890,
            "hash": "0xabcdef1234567890",
            "permissions": [],
            "publicKey": "0x1234567890abcdef",
            "role": "admin",
            "type": "secp256k1",
          },
        ]
      `)
    })

    test('behavior: includes all key fields and hash', () => {
      const response = Schema.decodeUnknownSync(
        Capabilities.authorizeKeys.Response,
      )([
        {
          expiry: '0x499602d2',
          hash: '0xabcdef1234567890',
          permissions: [
            {
              selector: '0x1234',
              to: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
              type: 'call',
            },
          ],
          prehash: true,
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        },
      ])

      expect(response[0]).toHaveProperty('expiry')
      expect(response[0]).toHaveProperty('publicKey')
      expect(response[0]).toHaveProperty('role')
      expect(response[0]).toHaveProperty('type')
      expect(response[0]).toHaveProperty('prehash')
      expect(response[0]).toHaveProperty('permissions')
      expect(response[0]).toHaveProperty('hash')
    })

    test('misc: encodes response correctly', () => {
      const response = [
        {
          expiry: 1234567890,
          hash: '0xabcdef1234567890',
          permissions: [
            {
              selector: '0x1234',
              to: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
              type: 'call' as const,
            },
          ],
          publicKey: '0x1234567890abcdef',
          role: 'admin' as const,
          type: 'secp256k1' as const,
        },
      ] as const

      const encoded = Schema.encodeSync(Capabilities.authorizeKeys.Response)(
        response,
      )
      expect(encoded).toMatchInlineSnapshot(`
        [
          {
            "expiry": "0x499602d2",
            "hash": "0xabcdef1234567890",
            "permissions": [
              {
                "selector": "0x1234",
                "to": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
                "type": "call",
              },
            ],
            "publicKey": "0x1234567890abcdef",
            "role": "admin",
            "type": "secp256k1",
          },
        ]
      `)
    })
  })
})

describe('meta', () => {
  describe('Request', () => {
    test('param: validates as object', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.meta.Request)('invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected { readonly feePayer?: \`0x\${string}\` | undefined; readonly feeToken?: \`0x\${string}\` | undefined; readonly nonce?: (\`0x\${string}\` <-> bigint) | undefined }, actual "invalid"

        Details: Expected { readonly feePayer?: \`0x\${string}\` | undefined; readonly feeToken?: \`0x\${string}\` | undefined; readonly nonce?: (\`0x\${string}\` <-> bigint) | undefined }, actual "invalid"]
      `,
      )
    })

    test('param: validates feePayer as address when provided', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.meta.Request)({
          feePayer: 'invalid-address',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
        Path: feePayer

        Details: { readonly feePayer?: \`0x\${string}\` | undefined; readonly feeToken?: \`0x\${string}\` | undefined; readonly nonce?: (\`0x\${string}\` <-> bigint) | undefined }
        └─ ["feePayer"]
           └─ \`0x\${string}\` | undefined
              ├─ Expected \`0x\${string}\`, actual "invalid-address"
              └─ Expected undefined, actual "invalid-address"]
      `)
    })

    test('param: validates feeToken as address when provided', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.meta.Request)({
          feeToken: 'invalid-address',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
        Path: feeToken

        Details: { readonly feePayer?: \`0x\${string}\` | undefined; readonly feeToken?: \`0x\${string}\` | undefined; readonly nonce?: (\`0x\${string}\` <-> bigint) | undefined }
        └─ ["feeToken"]
           └─ \`0x\${string}\` | undefined
              ├─ Expected \`0x\${string}\`, actual "invalid-address"
              └─ Expected undefined, actual "invalid-address"]
      `)
    })

    test('param: validates nonce as hex string when provided', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.meta.Request)({
          nonce: 'invalid-hex',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hex"
        Path: nonce

        Details: { readonly feePayer?: \`0x\${string}\` | undefined; readonly feeToken?: \`0x\${string}\` | undefined; readonly nonce?: (\`0x\${string}\` <-> bigint) | undefined }
        └─ ["nonce"]
           └─ (\`0x\${string}\` <-> bigint) | undefined
              ├─ (\`0x\${string}\` <-> bigint)
              │  └─ Encoded side transformation failure
              │     └─ Expected \`0x\${string}\`, actual "invalid-hex"
              └─ Expected undefined, actual "invalid-hex"]
      `)
    })

    test('behavior: accepts empty object', () => {
      const request = Schema.decodeUnknownSync(Capabilities.meta.Request)({})
      expect(request).toMatchInlineSnapshot('{}')
    })

    test('behavior: accepts object with all optional fields', () => {
      const request = Schema.decodeUnknownSync(Capabilities.meta.Request)({
        feePayer: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
        feeToken: '0x1234567890abcdef1234567890abcdef12345678',
        nonce: '0x1',
      })

      expect(request).toMatchInlineSnapshot(`
        {
          "feePayer": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
          "feeToken": "0x1234567890abcdef1234567890abcdef12345678",
          "nonce": 1n,
        }
      `)
    })

    test.each([
      {
        field: 'feePayer',
        value: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
      },
      {
        field: 'feeToken',
        value: '0x1234567890abcdef1234567890abcdef12345678',
      },
      { field: 'nonce', value: '0x1' },
    ])('behavior: accepts object with only $field', ({ field, value }) => {
      const request = Schema.decodeUnknownSync(Capabilities.meta.Request)({
        [field]: value,
      })

      expect(request).toHaveProperty(field)
      if (field === 'nonce') {
        expect(request[field]).toBe(1n)
      } else {
        expect((request as any)[field]).toBe(value)
      }
    })

    test('behavior: all fields are optional', () => {
      const request = Schema.decodeUnknownSync(Capabilities.meta.Request)({
        feePayer: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
      })

      expect(request.feePayer).toBe(
        '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
      )
      expect(request.feeToken).toBeUndefined()
      expect(request.nonce).toBeUndefined()
    })

    test('misc: encodes request correctly', () => {
      const request = {
        feePayer: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
        feeToken: '0x1234567890abcdef1234567890abcdef12345678',
        nonce: 1n,
      } as const

      const encoded = Schema.encodeSync(Capabilities.meta.Request)(request)
      expect(encoded).toMatchInlineSnapshot(`
        {
          "feePayer": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
          "feeToken": "0x1234567890abcdef1234567890abcdef12345678",
          "nonce": "0x1",
        }
      `)
    })
  })
})

describe('revokeKeys', () => {
  describe('Request', () => {
    test('param: validates as array', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.revokeKeys.Request)('invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected ReadonlyArray<{ readonly hash: \`0x\${string}\` }>, actual "invalid"

        Details: Expected ReadonlyArray<{ readonly hash: \`0x\${string}\` }>, actual "invalid"]
      `,
      )
    })

    test('param: validates array items have hash field', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.revokeKeys.Request)([
          { invalid: 'field' },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`hash\` is missing
        Path: 0.hash

        Details: ReadonlyArray<{ readonly hash: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly hash: \`0x\${string}\` }
              └─ ["hash"]
                 └─ is missing]
      `)
    })

    test('param: validates hash as hex string', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.revokeKeys.Request)([
          { hash: 'invalid-hex' },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hex"
        Path: 0.hash

        Details: ReadonlyArray<{ readonly hash: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly hash: \`0x\${string}\` }
              └─ ["hash"]
                 └─ Expected \`0x\${string}\`, actual "invalid-hex"]
      `)
    })

    test('behavior: accepts empty array', () => {
      const request = Schema.decodeUnknownSync(Capabilities.revokeKeys.Request)(
        [],
      )
      expect(request).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid hash objects', () => {
      const request = Schema.decodeUnknownSync(Capabilities.revokeKeys.Request)(
        [{ hash: '0x1234567890abcdef' }, { hash: '0xabcdef1234567890' }],
      )

      expect(request).toMatchInlineSnapshot(`
        [
          {
            "hash": "0x1234567890abcdef",
          },
          {
            "hash": "0xabcdef1234567890",
          },
        ]
      `)
    })

    test('behavior: accepts single hash object', () => {
      const request = Schema.decodeUnknownSync(Capabilities.revokeKeys.Request)(
        [{ hash: '0x1234567890abcdef' }],
      )

      expect(request).toHaveLength(1)
      expect(request[0]!.hash).toBe('0x1234567890abcdef')
    })

    test('misc: encodes request correctly', () => {
      const request = [
        { hash: '0x1234567890abcdef' },
        { hash: '0xabcdef1234567890' },
      ] as const

      const encoded = Schema.encodeSync(Capabilities.revokeKeys.Request)(
        request,
      )
      expect(encoded).toEqual(request)
    })
  })

  describe('Response', () => {
    test('param: validates as array', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.revokeKeys.Response)('invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected ReadonlyArray<{ readonly hash: \`0x\${string}\` }>, actual "invalid"

        Details: Expected ReadonlyArray<{ readonly hash: \`0x\${string}\` }>, actual "invalid"]
      `,
      )
    })

    test('param: validates array items have hash field', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.revokeKeys.Response)([
          { invalid: 'field' },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: \`hash\` is missing
        Path: 0.hash

        Details: ReadonlyArray<{ readonly hash: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly hash: \`0x\${string}\` }
              └─ ["hash"]
                 └─ is missing]
      `)
    })

    test('param: validates hash as hex string', () => {
      expect(() =>
        Schema.decodeUnknownSync(Capabilities.revokeKeys.Response)([
          { hash: 'invalid-hex' },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hex"
        Path: 0.hash

        Details: ReadonlyArray<{ readonly hash: \`0x\${string}\` }>
        └─ [0]
           └─ { readonly hash: \`0x\${string}\` }
              └─ ["hash"]
                 └─ Expected \`0x\${string}\`, actual "invalid-hex"]
      `)
    })

    test('behavior: accepts empty array', () => {
      const response = Schema.decodeUnknownSync(
        Capabilities.revokeKeys.Response,
      )([])
      expect(response).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid hash objects', () => {
      const response = Schema.decodeUnknownSync(
        Capabilities.revokeKeys.Response,
      )([{ hash: '0x1234567890abcdef' }, { hash: '0xabcdef1234567890' }])

      expect(response).toMatchInlineSnapshot(`
        [
          {
            "hash": "0x1234567890abcdef",
          },
          {
            "hash": "0xabcdef1234567890",
          },
        ]
      `)
    })

    test('behavior: accepts single hash object', () => {
      const response = Schema.decodeUnknownSync(
        Capabilities.revokeKeys.Response,
      )([{ hash: '0x1234567890abcdef' }])

      expect(response).toHaveLength(1)
      expect(response[0]!.hash).toBe('0x1234567890abcdef')
    })

    test('misc: encodes response correctly', () => {
      const response = [
        { hash: '0x1234567890abcdef' },
        { hash: '0xabcdef1234567890' },
      ] as const

      const encoded = Schema.encodeSync(Capabilities.revokeKeys.Response)(
        response,
      )
      expect(encoded).toEqual(response)
    })
  })
})
