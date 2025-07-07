import { describe, expect, test } from 'vitest'
import * as Schema from '../../schema/schema.js'
import * as Key from './key.js'

describe('Key', () => {
  test('param: validates required fields', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({}),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`expiry\` is missing
      Path: expiry

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["expiry"]
         └─ is missing]
    `)
  })

  test('param: validates expiry as number', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: 'invalid',
        publicKey: '0x1234',
        role: 'admin',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid"
      Path: expiry

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["expiry"]
         └─ (\`0x\${string}\` <-> number)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "invalid"]
    `)
  })

  test('param: validates publicKey as hex', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: '0x499602d2',
        publicKey: 'invalid-hex',
        role: 'admin',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-hex"
      Path: publicKey

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["publicKey"]
         └─ Expected \`0x\${string}\`, actual "invalid-hex"]
    `)
  })

  test('param: validates role enum', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: '0x499602d2',
        publicKey: '0x1234',
        role: 'invalid',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "admin", actual "invalid"
      Path: role

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["role"]
         └─ "admin" | "normal"
            ├─ Expected "admin", actual "invalid"
            └─ Expected "normal", actual "invalid"]
    `)
  })

  test('param: validates type enum', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: '0x499602d2',
        publicKey: '0x1234',
        role: 'admin',
        type: 'invalid',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "p256", actual "invalid"
      Path: type

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["type"]
         └─ "p256" | "secp256k1" | "webauthnp256"
            ├─ Expected "p256", actual "invalid"
            ├─ Expected "secp256k1", actual "invalid"
            └─ Expected "webauthnp256", actual "invalid"]
    `)
  })

  test('param: validates prehash as boolean when provided', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: '0x499602d2',
        prehash: 'invalid',
        publicKey: '0x1234',
        role: 'admin',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected boolean, actual "invalid"
      Path: prehash

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["prehash"]
         └─ boolean | undefined
            ├─ Expected boolean, actual "invalid"
            └─ Expected undefined, actual "invalid"]
    `)
  })

  test('behavior: accepts valid key with all required fields', () => {
    const key = Schema.decodeUnknownSync(Key.Key)({
      expiry: '0x499602d2',
      publicKey: '0x1234567890abcdef',
      role: 'admin',
      type: 'secp256k1',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 1234567890,
        "publicKey": "0x1234567890abcdef",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: accepts valid key with optional prehash', () => {
    const key = Schema.decodeUnknownSync(Key.Key)({
      expiry: '0x499602d2',
      prehash: true,
      publicKey: '0x1234567890abcdef',
      role: 'normal',
      type: 'p256',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 1234567890,
        "prehash": true,
        "publicKey": "0x1234567890abcdef",
        "role": "normal",
        "type": "p256",
      }
    `)
  })

  test.each([
    { role: 'admin', type: 'secp256k1' },
    { role: 'normal', type: 'p256' },
    { role: 'admin', type: 'webauthnp256' },
  ])('behavior: accepts valid role $role and type $type', ({ role, type }) => {
    const key = Schema.decodeUnknownSync(Key.Key)({
      expiry: '0x499602d2',
      publicKey: '0x1234567890abcdef',
      role,
      type,
    })

    expect(key.role).toBe(role)
    expect(key.type).toBe(type)
  })

  test('behavior: prehash is optional', () => {
    const keyWithoutPrehash = Schema.decodeUnknownSync(Key.Key)({
      expiry: '0x499602d2',
      publicKey: '0x1234567890abcdef',
      role: 'admin',
      type: 'secp256k1',
    })

    expect(keyWithoutPrehash.prehash).toBeUndefined()
  })

  test('error: rejects invalid role values', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: '0x499602d2',
        publicKey: '0x1234567890abcdef',
        role: 'superuser',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "admin", actual "superuser"
      Path: role

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["role"]
         └─ "admin" | "normal"
            ├─ Expected "admin", actual "superuser"
            └─ Expected "normal", actual "superuser"]
    `)
  })

  test('error: rejects invalid type values', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.Key)({
        expiry: '0x123',
        publicKey: '0x1234567890abcdef',
        role: 'admin',
        type: 'rsa',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "p256", actual "rsa"
      Path: type

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256" }
      └─ ["type"]
         └─ "p256" | "secp256k1" | "webauthnp256"
            ├─ Expected "p256", actual "rsa"
            ├─ Expected "secp256k1", actual "rsa"
            └─ Expected "webauthnp256", actual "rsa"]
    `)
  })

  test('misc: encodes key correctly', () => {
    const key = {
      expiry: 1234567890,
      prehash: true,
      publicKey: '0x1234567890abcdef',
      role: 'admin' as const,
      type: 'secp256k1' as const,
    } as const

    const encoded = Schema.encodeSync(Key.Key)(key)
    expect(encoded).toMatchInlineSnapshot(`
      {
        "expiry": "0x499602d2",
        "prehash": true,
        "publicKey": "0x1234567890abcdef",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })
})

describe('WithPermissions', () => {
  test('param: validates permissions array', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.WithPermissions)({
        expiry: '0x499602d2',
        permissions: 'invalid',
        publicKey: '0x1234567890abcdef',
        role: 'admin',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>, actual "invalid"
      Path: permissions

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }
      └─ ["permissions"]
         └─ Expected ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>, actual "invalid"]
    `)
  })

  test('param: validates permission objects in array', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.WithPermissions)({
        expiry: '0x499602d2',
        permissions: [{ invalid: 'permission' }],
        publicKey: '0x1234567890abcdef',
        role: 'admin',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`type\` is missing
      Path: permissions.0.type

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }
      └─ ["permissions"]
         └─ ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }>
            └─ [0]
               └─ { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
                  └─ { readonly type: "call" | "spend" }
                     └─ ["type"]
                        └─ is missing]
    `)
  })

  test('behavior: accepts key with empty permissions array', () => {
    const keyWithPermissions = Schema.decodeUnknownSync(Key.WithPermissions)({
      expiry: '0x499602d2',
      permissions: [],
      publicKey: '0x1234567890abcdef',
      role: 'admin',
      type: 'secp256k1',
    })

    expect(keyWithPermissions).toMatchInlineSnapshot(`
      {
        "expiry": 1234567890,
        "permissions": [],
        "publicKey": "0x1234567890abcdef",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: accepts key with valid permissions', () => {
    const keyWithPermissions = Schema.decodeUnknownSync(Key.WithPermissions)({
      expiry: '0x499602d2',
      permissions: [
        {
          selector: '0xa9059cbb',
          to: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
          type: 'call',
        },
      ],
      publicKey: '0x1234567890abcdef',
      role: 'admin',
      type: 'secp256k1',
    })

    expect(keyWithPermissions.permissions).toHaveLength(1)
    expect(keyWithPermissions.permissions[0]).toMatchInlineSnapshot(`
      {
        "selector": "0xa9059cbb",
        "to": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
        "type": "call",
      }
    `)
  })

  test('behavior: inherits all Key properties', () => {
    const keyWithPermissions = Schema.decodeUnknownSync(Key.WithPermissions)({
      expiry: '0x499602d2',
      permissions: [],
      prehash: false,
      publicKey: '0x1234567890abcdef',
      role: 'normal',
      type: 'p256',
    })

    expect(keyWithPermissions.expiry).toBe(1234567890)
    expect(keyWithPermissions.publicKey).toBe('0x1234567890abcdef')
    expect(keyWithPermissions.role).toBe('normal')
    expect(keyWithPermissions.type).toBe('p256')
    expect(keyWithPermissions.prehash).toBe(false)
  })

  test('error: rejects missing permissions field', () => {
    expect(() =>
      Schema.decodeUnknownSync(Key.WithPermissions)({
        expiry: '0x499602d2',
        publicKey: '0x1234567890abcdef',
        role: 'admin',
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`permissions\` is missing
      Path: permissions

      Details: { readonly expiry: (\`0x\${string}\` <-> number); readonly prehash?: boolean | undefined; readonly publicKey: \`0x\${string}\`; readonly role: "admin" | "normal"; readonly type: "p256" | "secp256k1" | "webauthnp256"; readonly permissions: ReadonlyArray<{ readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }> }
      └─ ["permissions"]
         └─ is missing]
    `)
  })

  test('misc: encodes key with permissions correctly', () => {
    const keyWithPermissions = {
      expiry: 1234567890,
      permissions: [
        {
          selector: '0xa9059cbb',
          to: '0x742d35Cc6634C0532925a3b8D000B4e20200000e',
          type: 'call' as const,
        },
      ],
      publicKey: '0x1234567890abcdef',
      role: 'admin' as const,
      type: 'secp256k1' as const,
    } as const

    const encoded = Schema.encodeSync(Key.WithPermissions)(keyWithPermissions)
    expect(encoded).toMatchInlineSnapshot(`
      {
        "expiry": "0x499602d2",
        "permissions": [
          {
            "selector": "0xa9059cbb",
            "to": "0x742d35Cc6634C0532925a3b8D000B4e20200000e",
            "type": "call",
          },
        ],
        "publicKey": "0x1234567890abcdef",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })
})
