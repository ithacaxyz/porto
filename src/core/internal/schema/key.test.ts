import { describe, expect, test } from 'vitest'
import * as Key from './key.js'
import * as Schema from './schema.js'

describe('Base', () => {
  test('behavior: parses valid base key', () => {
    const result = Schema.decodeUnknownSync(Key.Base)({
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
    const result = Schema.encodeSync(Key.Base)({
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
    const result = Schema.decodeUnknownSync(Key.Base)({
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
      const result = Schema.decodeUnknownSync(Key.Base)({
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
    expect(() =>
      Schema.decodeUnknownSync(Key.Base)({
        expiry: '0x0',
        hash: '0x0',
        id: '0x0',
        publicKey: '0x0',
        role: 'invalid',
        type: 'address',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "admin", actual "invalid"
      Path: role

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly hash: \`0x\${string}\`; readonly id: \`0x\${string}\`; readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "session"; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }
      └─ ["role"]
         └─ "admin" | "session"
            ├─ Expected "admin", actual "invalid"
            └─ Expected "session", actual "invalid"]
    `)
  })

  test('error: rejects invalid type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Base)({
        expiry: '0x0',
        hash: '0x0',
        id: '0x0',
        publicKey: '0x0',
        role: 'admin',
        type: 'invalid',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "address", actual "invalid"
      Path: type

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly hash: \`0x\${string}\`; readonly id: \`0x\${string}\`; readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "session"; readonly type: "address" | "p256" | "secp256k1" | "webauthn-p256" }
      └─ ["type"]
         └─ "address" | "p256" | "secp256k1" | "webauthn-p256"
            ├─ Expected "address", actual "invalid"
            ├─ Expected "p256", actual "invalid"
            ├─ Expected "secp256k1", actual "invalid"
            └─ Expected "webauthn-p256", actual "invalid"]
    `)
  })
})

describe('CallPermissions', () => {
  test('behavior: parses call permissions with signature and address', () => {
    const result = Schema.decodeUnknownSync(Key.CallPermissions)([
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
    const result = Schema.decodeUnknownSync(Key.CallPermissions)([
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
    const result = Schema.decodeUnknownSync(Key.CallPermissions)([
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
    const result = Schema.decodeUnknownSync(Key.CallPermissions)([
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
    expect(() =>
      Schema.decodeUnknownSync(Key.CallPermissions)([]),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected an array of at least 1 item(s), actual []

      Details: minItems(1)
      └─ Predicate refinement failure
         └─ Expected an array of at least 1 item(s), actual []]
    `)
  })

  test('error: rejects both signature and to as undefined', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.CallPermissions)([
        {
          signature: undefined,
          to: undefined,
        },
      ]),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected string, actual undefined
      Path: 0.signature

      Details: minItems(1)
      └─ From side refinement failure
         └─ ReadonlyArray<{ readonly signature: string; readonly to: \`0x\${string}\` } | { readonly signature: string } | { readonly to: \`0x\${string}\` }>
            └─ [0]
               └─ { readonly signature: string; readonly to: \`0x\${string}\` } | { readonly signature: string } | { readonly to: \`0x\${string}\` }
                  ├─ { readonly signature: string; readonly to: \`0x\${string}\` }
                  │  └─ ["signature"]
                  │     └─ Expected string, actual undefined
                  ├─ { readonly signature: string }
                  │  └─ ["signature"]
                  │     └─ Expected string, actual undefined
                  └─ { readonly to: \`0x\${string}\` }
                     └─ ["to"]
                        └─ Expected \`0x\${string}\`, actual undefined]
    `)
  })
})

describe('SignatureVerificationPermission', () => {
  test('behavior: parses signature verification permission', () => {
    const result = Schema.decodeUnknownSync(
      Key.SignatureVerificationPermission,
    )({
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
    const result = Schema.decodeUnknownSync(
      Key.SignatureVerificationPermission,
    )({
      addresses: [],
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "addresses": [],
      }
    `)
  })

  test('error: rejects invalid address format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.SignatureVerificationPermission)({
        addresses: ['invalid-address'],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: addresses.0

      Details: { readonly addresses: ReadonlyArray<\`0x\${string}\`> }
      └─ ["addresses"]
         └─ ReadonlyArray<\`0x\${string}\`>
            └─ [0]
               └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })
})

describe('SpendPermissions', () => {
  test('behavior: parses spend permissions', () => {
    const result = Schema.decodeUnknownSync(Key.SpendPermissions)([
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
    const result = Schema.encodeSync(Key.SpendPermissions)([
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
    const result = Schema.decodeUnknownSync(Key.SpendPermissions)([
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
      const result = Schema.decodeUnknownSync(Key.SpendPermissions)([
        {
          limit: '0x1',
          period,
        },
      ])
      expect(result[0]?.period).toBe(period)
    }
  })

  test('behavior: accepts empty array', () => {
    const result = Schema.decodeUnknownSync(Key.SpendPermissions)([])
    expect(result).toMatchInlineSnapshot('[]')
  })

  test('error: rejects invalid period', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.SpendPermissions)([
        {
          limit: '0x1',
          period: 'invalid',
        },
      ]),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "minute", actual "invalid"
      Path: 0.period

      Details: ReadonlyArray<{ readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }>
      └─ [0]
         └─ { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | undefined }
            └─ ["period"]
               └─ "minute" | "hour" | "day" | "week" | "month" | "year"
                  ├─ Expected "minute", actual "invalid"
                  ├─ Expected "hour", actual "invalid"
                  ├─ Expected "day", actual "invalid"
                  ├─ Expected "week", actual "invalid"
                  ├─ Expected "month", actual "invalid"
                  └─ Expected "year", actual "invalid"]
    `)
  })
})

describe('Permissions', () => {
  test('behavior: parses permissions with all fields', () => {
    const result = Schema.decodeUnknownSync(Key.Permissions)({
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
    const result = Schema.decodeUnknownSync(Key.Permissions)({})
    expect(result).toMatchInlineSnapshot('{}')
  })

  test('behavior: parses permissions with only calls', () => {
    const result = Schema.decodeUnknownSync(Key.Permissions)({
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
    const result = Schema.decodeUnknownSync(Key.WithPermissions)({
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
    const result = Schema.encodeSync(Key.WithPermissions)({
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
    const result = Schema.decodeUnknownSync(Key.WithPermissions)({
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
    const result = Schema.decodeUnknownSync(Key.WithPermissions)({
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
