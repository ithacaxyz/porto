import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as Capabilities from './capabilities.js'

describe('authorizeKeys', () => {
  describe('Request', () => {
    test('param: validates as array', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.authorizeKeys.Request, 'invalid' as never)
            .error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Expected array. ]
      `,
      )
    })

    test('param: validates array items as key with permissions', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.authorizeKeys.Request, [{ invalid: 'key' }])
            .error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 5 errors:

        - at \`[0].expiry\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`[0].publicKey\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`[0].role\`: Invalid union value.
          - Expected "admin"
          - Expected "normal"
        - at \`[0].type\`: Invalid union value.
          - Expected "p256"
          - Expected "secp256k1"
          - Expected "webauthnp256"
        - at \`[0].permissions\`: Expected array. ]
      `,
      )
    })

    test('behavior: accepts empty array', () => {
      const request = z.parse(Capabilities.authorizeKeys.Request, [])
      expect(request).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid key with permissions', () => {
      const request = z.parse(Capabilities.authorizeKeys.Request, [
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
      const request = z.parse(Capabilities.authorizeKeys.Request, [
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

      const encoded = z.encode(Capabilities.authorizeKeys.Request, request)
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
        z.parse(Capabilities.authorizeKeys.Response, 'invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "expected": "array",
            "code": "invalid_type",
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `,
      )
    })

    test('param: validates hash field is required', () => {
      expect(() =>
        z.parse(Capabilities.authorizeKeys.Response, [
          {
            expiry: '0x499602d2',
            permissions: [],
            publicKey: '0x1234567890abcdef',
            role: 'admin',
            type: 'secp256k1',
          },
        ]),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "expected": "template_literal",
            "code": "invalid_type",
            "path": [
              0,
              "hash"
            ],
            "message": "Needs string in format ^0x[A-Fa-f0-9]+$."
          }
        ]]
      `)
    })

    test('param: validates hash as hex string', () => {
      expect(() =>
        z.parse(Capabilities.authorizeKeys.Response, [
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
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [
              0,
              "hash"
            ],
            "message": "Needs string in format ^0x[A-Fa-f0-9]+$."
          }
        ]]
      `)
    })

    test('behavior: accepts empty array', () => {
      const response = z.parse(Capabilities.authorizeKeys.Response, [])
      expect(response).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid key with hash', () => {
      const response = z.parse(Capabilities.authorizeKeys.Response, [
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
      const response = z.parse(Capabilities.authorizeKeys.Response, [
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

      const encoded = z.encode(Capabilities.authorizeKeys.Response, response)
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
        z.parse(Capabilities.meta.Request, 'invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "expected": "object",
            "code": "invalid_type",
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `,
      )
    })

    test('param: validates feePayer as address when provided', () => {
      expect(() =>
        z.parse(Capabilities.meta.Request, {
          feePayer: 'invalid-address',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [
              "feePayer"
            ],
            "message": "Needs string in format ^0x[A-Fa-f0-9]{40}$."
          }
        ]]
      `)
    })

    test('param: validates feeToken as address when provided', () => {
      expect(() =>
        z.parse(Capabilities.meta.Request, {
          feeToken: 'invalid-address',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [
              "feeToken"
            ],
            "message": "Needs string in format ^0x[A-Fa-f0-9]{40}$."
          }
        ]]
      `)
    })

    test('param: validates nonce as hex string when provided', () => {
      expect(() =>
        z.parse(Capabilities.meta.Request, {
          nonce: 'invalid-hex',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [
              "nonce"
            ],
            "message": "Needs string in format ^0x[A-Fa-f0-9]+$."
          }
        ]]
      `)
    })

    test('behavior: accepts empty object', () => {
      const request = z.parse(Capabilities.meta.Request, {})
      expect(request).toMatchInlineSnapshot('{}')
    })

    test('behavior: accepts object with all optional fields', () => {
      const request = z.parse(Capabilities.meta.Request, {
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
      const request = z.parse(Capabilities.meta.Request, {
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
      const request = z.parse(Capabilities.meta.Request, {
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

      const encoded = z.encode(Capabilities.meta.Request, request)
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
        z.parse(Capabilities.revokeKeys.Request, 'invalid'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "expected": "array",
            "code": "invalid_type",
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `,
      )
    })

    test('param: validates array items have hash field', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.revokeKeys.Request, [{ invalid: 'field' }])
            .error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[0].hash\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
      `,
      )
    })

    test('param: validates hash as hex string', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.revokeKeys.Request, [
            { hash: 'invalid-hex' },
          ]).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[0].hash\`: Must match pattern: ^0x[\\s\\S]{0,}$]
      `,
      )
    })

    test('behavior: accepts empty array', () => {
      const request = z.parse(Capabilities.revokeKeys.Request, [])
      expect(request).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid hash objects', () => {
      const request = z.parse(Capabilities.revokeKeys.Request, [
        { hash: '0x1234567890abcdef' },
        { hash: '0xabcdef1234567890' },
      ])

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
      const request = z.parse(Capabilities.revokeKeys.Request, [
        { hash: '0x1234567890abcdef' },
      ])

      expect(request).toHaveLength(1)
      expect(request[0]!.hash).toBe('0x1234567890abcdef')
    })

    test('misc: encodes request correctly', () => {
      const request = [
        { hash: '0x1234567890abcdef' },
        { hash: '0xabcdef1234567890' },
      ] as const

      const encoded = z.encode(Capabilities.revokeKeys.Request, request)
      expect(encoded).toEqual(request)
    })
  })

  describe('Response', () => {
    test('param: validates as array', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.revokeKeys.Response, 'invalid').error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Expected array. ]
      `,
      )
    })

    test('param: validates array items have hash field', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.revokeKeys.Response, [{ invalid: 'field' }])
            .error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[0].hash\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
      `,
      )
    })

    test('param: validates hash as hex string', () => {
      expect(
        u.toValidationError(
          z.safeParse(Capabilities.revokeKeys.Response, [
            { hash: 'invalid-hex' },
          ]).error,
        ),
      ).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[0].hash\`: Must match pattern: ^0x[\\s\\S]{0,}$]
      `,
      )
    })

    test('behavior: accepts empty array', () => {
      const response = z.parse(Capabilities.revokeKeys.Response, [])
      expect(response).toMatchInlineSnapshot('[]')
    })

    test('behavior: accepts valid hash objects', () => {
      const response = z.parse(Capabilities.revokeKeys.Response, [
        { hash: '0x1234567890abcdef' },
        { hash: '0xabcdef1234567890' },
      ])

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
      const response = z.parse(Capabilities.revokeKeys.Response, [
        { hash: '0x1234567890abcdef' },
      ])

      expect(response).toHaveLength(1)
      expect(response[0]!.hash).toBe('0x1234567890abcdef')
    })

    test('misc: encodes response correctly', () => {
      const response = [
        { hash: '0x1234567890abcdef' },
        { hash: '0xabcdef1234567890' },
      ] as const

      const encoded = z.encode(Capabilities.revokeKeys.Response, response)
      expect(encoded).toEqual(response)
    })
  })
})
