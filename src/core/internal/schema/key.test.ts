import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as Key from './key.js'
import * as u from './utils.js'

describe('Base', () => {
  test('behavior: parses valid base key', () => {
    const result = z.parse(Key.Base, {
      expiry: '0x64',
      hash: '0xabcdef',
      id: '0x123',
      publicKey: '0xdeadbeef',
      role: 'admin',
      type: 'secp256k1',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": 100,
        "hash": "0xabcdef",
        "id": "0x123",
        "publicKey": "0xdeadbeef",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: encodes base key', () => {
    const result = z.encode(Key.Base, {
      expiry: 100,
      hash: '0xabcdef',
      id: '0x123',
      publicKey: '0xdeadbeef',
      role: 'admin',
      type: 'secp256k1',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": "0x64",
        "hash": "0xabcdef",
        "id": "0x123",
        "publicKey": "0xdeadbeef",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: accepts session role', () => {
    const result = z.parse(Key.Base, {
      expiry: '0x0',
      hash: '0x0',
      id: '0x0',
      publicKey: '0x0',
      role: 'session',
      type: 'address',
    })
    expect(result.role).toMatchInlineSnapshot(`"session"`)
  })

  test('behavior: accepts all key types', () => {
    const types = ['address', 'p256', 'secp256k1', 'webauthn-p256']
    for (const type of types) {
      const result = z.parse(Key.Base, {
        expiry: '0x0',
        hash: '0x0',
        id: '0x0',
        publicKey: '0x0',
        role: 'admin',
        type,
      })
      expect(result.type).toBe(type)
    }
  })

  test('error: rejects invalid role', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Base, {
          expiry: '0x0',
          hash: '0x0',
          id: '0x0',
          publicKey: '0x0',
          role: 'invalid',
          type: 'address',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`role\`: Invalid union value.
        - Expected "admin"
        - Expected "session"]
    `,
    )
  })

  test('error: rejects invalid type', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Base, {
          expiry: '0x0',
          hash: '0x0',
          id: '0x0',
          publicKey: '0x0',
          role: 'admin',
          type: 'invalid',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Invalid union value.
        - Expected "address"
        - Expected "p256"
        - Expected "secp256k1"
        - Expected "webauthn-p256"]
    `,
    )
  })
})

describe('CallPermissions', () => {
  test('behavior: parses call permissions with signature and address', () => {
    const result = z.parse(Key.CallPermissions, [
      {
        signature: 'transfer(address,uint256)',
        to: '0x1234567890123456789012345678901234567890',
      },
    ])
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "signature": "transfer(address,uint256)",
          "to": "0x1234567890123456789012345678901234567890",
        },
      ]
    `)
  })

  test('behavior: parses call permissions with signature and undefined to', () => {
    const result = z.parse(Key.CallPermissions, [
      {
        signature: 'approve(address,uint256)',
        to: undefined,
      },
    ])
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "signature": "approve(address,uint256)",
        },
      ]
    `)
  })

  test('behavior: parses call permissions with undefined signature and address', () => {
    const result = z.parse(Key.CallPermissions, [
      {
        signature: undefined,
        to: '0x1234567890123456789012345678901234567890',
      },
    ])
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "to": "0x1234567890123456789012345678901234567890",
        },
      ]
    `)
  })

  test('behavior: accepts multiple permissions', () => {
    const result = z.parse(Key.CallPermissions, [
      {
        signature: 'transfer(address,uint256)',
        to: '0x1234567890123456789012345678901234567890',
      },
      {
        signature: 'approve(address,uint256)',
        to: undefined,
      },
    ])
    expect(result.length).toMatchInlineSnapshot('2')
  })

  test('error: rejects empty array', () => {
    expect(
      u.toValidationError(z.safeParse(Key.CallPermissions, []).error),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - array must be at least 1]
    `,
    )
  })

  test('error: rejects both signature and to as undefined', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.CallPermissions, [
          {
            signature: undefined,
            to: undefined,
          },
        ]).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`[0]\`: Invalid union value.
        - at \`signature\`: Expected string. 
        - at \`to\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`signature\`: Expected string. 
        - at \`to\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.]
    `,
    )
  })
})

describe('SignatureVerificationPermission', () => {
  test('behavior: parses signature verification permission', () => {
    const result = z.parse(Key.SignatureVerificationPermission, {
      addresses: [
        '0x1234567890123456789012345678901234567890',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      ],
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "addresses": [
          "0x1234567890123456789012345678901234567890",
          "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        ],
      }
    `)
  })

  test('behavior: accepts empty addresses array', () => {
    const result = z.parse(Key.SignatureVerificationPermission, {
      addresses: [],
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "addresses": [],
      }
    `)
  })

  test('error: rejects invalid address format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.SignatureVerificationPermission, {
          addresses: ['invalid-address'],
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`addresses[0]\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })
})

describe('SpendPermissions', () => {
  test('behavior: parses spend permissions', () => {
    const result = z.parse(Key.SpendPermissions, [
      {
        limit: '0x3e8',
        period: 'day',
        token: '0x1234567890123456789012345678901234567890',
      },
    ])
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "limit": 1000n,
          "period": "day",
          "token": "0x1234567890123456789012345678901234567890",
        },
      ]
    `)
  })

  test('behavior: encodes spend permissions', () => {
    const result = z.encode(Key.SpendPermissions, [
      {
        limit: 1000n,
        period: 'day',
        token: '0x1234567890123456789012345678901234567890',
      },
    ])
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "limit": "0x3e8",
          "period": "day",
          "token": "0x1234567890123456789012345678901234567890",
        },
      ]
    `)
  })

  test('behavior: parses spend permissions without token', () => {
    const result = z.parse(Key.SpendPermissions, [
      {
        limit: '0x64',
        period: 'hour',
      },
    ])
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "limit": 100n,
          "period": "hour",
        },
      ]
    `)
  })

  test('behavior: accepts all period types', () => {
    const periods = ['minute', 'hour', 'day', 'week', 'month', 'year']
    for (const period of periods) {
      const result = z.parse(Key.SpendPermissions, [
        {
          limit: '0x1',
          period,
        },
      ])
      expect(result[0]?.period).toBe(period)
    }
  })

  test('behavior: accepts empty array', () => {
    const result = z.parse(Key.SpendPermissions, [])
    expect(result).toMatchInlineSnapshot('[]')
  })

  test('error: rejects invalid period', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.SpendPermissions, [
          {
            limit: '0x1',
            period: 'invalid',
          },
        ]).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`[0].period\`: Invalid union value.
        - Expected "minute"
        - Expected "hour"
        - Expected "day"
        - Expected "week"
        - Expected "month"
        - Expected "year"]
    `,
    )
  })
})

describe('Permissions', () => {
  test('behavior: parses permissions with all fields', () => {
    const result = z.parse(Key.Permissions, {
      calls: [
        {
          signature: 'transfer(address,uint256)',
          to: '0x1234567890123456789012345678901234567890',
        },
      ],
      signatureVerification: {
        addresses: ['0x1234567890123456789012345678901234567890'],
      },
      spend: [
        {
          limit: '0x64',
          period: 'day',
        },
      ],
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [
          {
            "signature": "transfer(address,uint256)",
            "to": "0x1234567890123456789012345678901234567890",
          },
        ],
        "signatureVerification": {
          "addresses": [
            "0x1234567890123456789012345678901234567890",
          ],
        },
        "spend": [
          {
            "limit": 100n,
            "period": "day",
          },
        ],
      }
    `)
  })

  test('behavior: parses empty permissions object', () => {
    const result = z.parse(Key.Permissions, {})
    expect(result).toMatchInlineSnapshot('{}')
  })

  test('behavior: parses permissions with only calls', () => {
    const result = z.parse(Key.Permissions, {
      calls: [
        {
          signature: 'test()',
          to: '0x1234567890123456789012345678901234567890',
        },
      ],
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [
          {
            "signature": "test()",
            "to": "0x1234567890123456789012345678901234567890",
          },
        ],
      }
    `)
  })
})

describe('WithPermissions', () => {
  test('behavior: parses key with permissions', () => {
    const result = z.parse(Key.WithPermissions, {
      expiry: '0x64',
      hash: '0xabcdef',
      id: '0x123',
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
      },
      publicKey: '0xdeadbeef',
      role: 'session',
      type: 'p256',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": 100,
        "hash": "0xabcdef",
        "id": "0x123",
        "permissions": {
          "calls": [
            {
              "signature": "transfer(address,uint256)",
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
        },
        "publicKey": "0xdeadbeef",
        "role": "session",
        "type": "p256",
      }
    `)
  })

  test('behavior: encodes key with permissions', () => {
    const result = z.encode(Key.WithPermissions, {
      expiry: 100,
      hash: '0xabcdef',
      id: '0x123',
      permissions: {
        calls: [
          {
            signature: 'transfer(address,uint256)',
            to: '0x1234567890123456789012345678901234567890',
          },
        ],
        spend: [
          {
            limit: 500n,
            period: 'hour',
          },
        ],
      },
      publicKey: '0xdeadbeef',
      role: 'session',
      type: 'p256',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": "0x64",
        "hash": "0xabcdef",
        "id": "0x123",
        "permissions": {
          "calls": [
            {
              "signature": "transfer(address,uint256)",
              "to": "0x1234567890123456789012345678901234567890",
            },
          ],
          "spend": [
            {
              "limit": "0x1f4",
              "period": "hour",
            },
          ],
        },
        "publicKey": "0xdeadbeef",
        "role": "session",
        "type": "p256",
      }
    `)
  })

  test('behavior: parses key without permissions', () => {
    const result = z.parse(Key.WithPermissions, {
      expiry: '0x0',
      hash: '0x0',
      id: '0x0',
      publicKey: '0x0',
      role: 'admin',
      type: 'webauthn-p256',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "hash": "0x0",
        "id": "0x0",
        "publicKey": "0x0",
        "role": "admin",
        "type": "webauthn-p256",
      }
    `)
  })

  test('behavior: parses key with empty permissions', () => {
    const result = z.parse(Key.WithPermissions, {
      expiry: '0x0',
      hash: '0x0',
      id: '0x0',
      permissions: {},
      publicKey: '0x0',
      role: 'admin',
      type: 'address',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "hash": "0x0",
        "id": "0x0",
        "permissions": {},
        "publicKey": "0x0",
        "role": "admin",
        "type": "address",
      }
    `)
  })
})
