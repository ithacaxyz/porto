import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as Key from './key.js'

describe('Key', () => {
  test('param: validates required fields', () => {
    expect(
      u.toValidationError(z.safeParse(Key.Key, {}).error),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 4 errors:

      - at \`expiry\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
      - at \`publicKey\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
      - at \`role\`: Invalid union value.
        - Expected "admin"
        - Expected "normal"
      - at \`type\`: Invalid union value.
        - Expected "p256"
        - Expected "secp256k1"
        - Expected "webauthnp256"]
    `,
    )
  })

  test('param: validates expiry as number', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: 'invalid',
          publicKey: '0x1234',
          role: 'admin',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`expiry\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('param: validates publicKey as hex', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: '0x499602d2',
          publicKey: 'invalid-hex',
          role: 'admin',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`publicKey\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('param: validates role enum', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: '0x499602d2',
          publicKey: '0x1234',
          role: 'invalid',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`role\`: Invalid union value.
        - Expected "admin"
        - Expected "normal"]
    `,
    )
  })

  test('param: validates type enum', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: '0x499602d2',
          publicKey: '0x1234',
          role: 'admin',
          type: 'invalid',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Invalid union value.
        - Expected "p256"
        - Expected "secp256k1"
        - Expected "webauthnp256"]
    `,
    )
  })

  test('param: validates prehash as boolean when provided', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: '0x499602d2',
          prehash: 'invalid',
          publicKey: '0x1234',
          role: 'admin',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`prehash\`: Expected boolean. ]
    `,
    )
  })

  test('behavior: accepts valid key with all required fields', () => {
    const key = z.parse(Key.Key, {
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
    const key = u.toValidationError(
      z.safeParse(Key.Key, {
        expiry: '0x 499602d2',
        prehash: true,
        publicKey: '0x1234567890abcdef',
        role: 'normal',
        type: 'p256',
      }).error,
    )

    expect(key).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`expiry\`: Expected number. ]
    `,
    )
  })

  test.each([
    { role: 'admin', type: 'secp256k1' },
    { role: 'normal', type: 'p256' },
    { role: 'admin', type: 'webauthnp256' },
  ])('behavior: accepts valid role $role and type $type', ({ role, type }) => {
    const key = z.parse(Key.Key, {
      expiry: '0x499602d2',
      publicKey: '0x1234567890abcdef',
      role,
      type,
    })

    expect(key.role).toBe(role)
    expect(key.type).toBe(type)
  })

  test('behavior: prehash is optional', () => {
    const keyWithoutPrehash = z.parse(Key.Key, {
      expiry: '0x499602d2',
      publicKey: '0x1234567890abcdef',
      role: 'admin',
      type: 'secp256k1',
    })

    expect(keyWithoutPrehash.prehash).toBeUndefined()
  })

  test('error: rejects invalid role values', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: '0x499602d2',
          publicKey: '0x1234567890abcdef',
          role: 'superuser',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`role\`: Invalid union value.
        - Expected "admin"
        - Expected "normal"]
    `,
    )
  })

  test('error: rejects invalid type values', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.Key, {
          expiry: '0x123',
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'rsa',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Invalid union value.
        - Expected "p256"
        - Expected "secp256k1"
        - Expected "webauthnp256"]
    `,
    )
  })

  test('misc: encodes key correctly', () => {
    const key = {
      expiry: 1234567890,
      prehash: true,
      publicKey: '0x1234567890abcdef',
      role: 'admin' as const,
      type: 'secp256k1' as const,
    } as const

    const encoded = z.encode(Key.Key, key)
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
    expect(
      u.toValidationError(
        z.safeParse(Key.WithPermissions, {
          expiry: '0x499602d2',
          permissions: 'invalid',
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`permissions\`: Expected array. ]
    `,
    )
  })

  test('param: validates permission objects in array', () => {
    expect(
      u.toValidationError(
        z.safeParse(Key.WithPermissions, {
          expiry: '0x499602d2',
          permissions: [{ invalid: 'permission' }],
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`permissions[0]\`: Invalid union value.
        - at \`selector\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`to\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.
        - at \`type\`: Expected "call"
        - at \`limit\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.
        - at \`period\`: Invalid union value.
          - Expected "minute"
          - Expected "hour"
          - Expected "day"
          - Expected "week"
          - Expected "month"
          - Expected "year"
        - at \`type\`: Expected "spend"]
    `,
    )
  })

  test('behavior: accepts key with empty permissions array', () => {
    const keyWithPermissions = z.parse(Key.WithPermissions, {
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
    const keyWithPermissions = z.parse(Key.WithPermissions, {
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
    const keyWithPermissions = z.parse(Key.WithPermissions, {
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
    expect(
      u.toValidationError(
        z.safeParse(Key.WithPermissions, {
          expiry: '0x499602d2',
          publicKey: '0x1234567890abcdef',
          role: 'admin',
          type: 'secp256k1',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`permissions\`: Expected array. ]
    `,
    )
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

    const encoded = z.encode(Key.WithPermissions, keyWithPermissions)
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
