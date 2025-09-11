import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as zError from 'zod-validation-error'
import * as Permission from './permission.js'

describe('CallPermission', () => {
  test('behavior: parses valid call permission', () => {
    const result = z.parse(Permission.CallPermission, {
      selector: '0xa9059cbb',
      to: '0x1234567890123456789012345678901234567890',
      type: 'call',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "selector": "0xa9059cbb",
        "to": "0x1234567890123456789012345678901234567890",
        "type": "call",
      }
    `)
  })

  test('behavior: encodes call permission', () => {
    const result = z.encode(Permission.CallPermission, {
      selector: '0xa9059cbb',
      to: '0x1234567890123456789012345678901234567890',
      type: 'call',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "selector": "0xa9059cbb",
        "to": "0x1234567890123456789012345678901234567890",
        "type": "call",
      }
    `)
  })

  test('param: rejects missing selector', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.CallPermission, {
          to: '0x1234567890123456789012345678901234567890',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "selector"]`,
    )
  })

  test('param: rejects missing to address', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "to"]`,
    )
  })

  test('param: rejects missing type', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          to: '0x1234567890123456789012345678901234567890',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "type"]`,
    )
  })

  test('error: rejects invalid selector format', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.CallPermission, {
          selector: 'invalid-selector',
          to: '0x1234567890123456789012345678901234567890',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "selector"]`,
    )
  })

  test('error: rejects invalid to address format', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          to: 'invalid-address',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "to"]`,
    )
  })

  test('error: rejects invalid type', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          to: '0x1234567890123456789012345678901234567890',
          type: 'invalid-type',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "type"]`,
    )
  })
})

describe('SpendPermission', () => {
  test('behavior: parses valid spend permission with all fields', () => {
    const result = z.parse(Permission.SpendPermission, {
      limit: '0x64',
      period: 'day',
      token: '0x1234567890123456789012345678901234567890',
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": 100n,
        "period": "day",
        "token": "0x1234567890123456789012345678901234567890",
        "type": "spend",
      }
    `)
  })

  test('behavior: parses valid spend permission with null token', () => {
    const result = z.parse(Permission.SpendPermission, {
      limit: '0x64',
      period: 'day',
      token: null,
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": 100n,
        "period": "day",
        "token": null,
        "type": "spend",
      }
    `)
  })

  test('behavior: parses valid spend permission without token', () => {
    const result = z.parse(Permission.SpendPermission, {
      limit: '0x64',
      period: 'day',
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": 100n,
        "period": "day",
        "type": "spend",
      }
    `)
  })

  test.each([
    { period: 'minute' },
    { period: 'hour' },
    { period: 'day' },
    { period: 'week' },
    { period: 'month' },
    { period: 'year' },
  ])(
    'behavior: parses valid spend permission with period $period',
    ({ period }) => {
      const result = z.parse(Permission.SpendPermission, {
        limit: '0x64',
        period,
        type: 'spend',
      })
      expect(result.period).toBe(period)
    },
  )

  test('behavior: encodes spend permission with BigInt limit', () => {
    const result = z.encode(Permission.SpendPermission, {
      limit: 1000n,
      period: 'day',
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": "0x3e8",
        "period": "day",
        "type": "spend",
      }
    `)
  })

  test('behavior: encodes spend permission with token', () => {
    const result = z.encode(Permission.SpendPermission, {
      limit: 255n,
      period: 'hour',
      token: '0x1234567890123456789012345678901234567890',
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": "0xff",
        "period": "hour",
        "token": "0x1234567890123456789012345678901234567890",
        "type": "spend",
      }
    `)
  })

  test('behavior: encodes spend permission with null token', () => {
    const result = z.encode(Permission.SpendPermission, {
      limit: 0n,
      period: 'week',
      token: null,
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": "0x0",
        "period": "week",
        "token": null,
        "type": "spend",
      }
    `)
  })

  test.each([
    { expected: '0x1', limit: 1n },
    { expected: '0xff', limit: 255n },
    { expected: '0x3e8', limit: 1000n },
    { expected: '0x0', limit: 0n },
  ])(
    'behavior: encodes spend limit $limit to $expected',
    ({ limit, expected }) => {
      const result = z.encode(Permission.SpendPermission, {
        limit,
        period: 'day',
        type: 'spend',
      })
      expect(result.limit).toBe(expected)
    },
  )

  test('param: rejects missing limit', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          period: 'day',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "limit"]`,
    )
  })

  test('param: rejects missing period', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "period"]`,
    )
  })

  test('param: rejects missing type', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'day',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "type"]`,
    )
  })

  test('error: rejects invalid limit format', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          limit: 'invalid-limit',
          period: 'day',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "limit"]`,
    )
  })

  test('error: rejects invalid period', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'invalid-period',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "period"]`,
    )
  })

  test('error: rejects invalid type', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'day',
          type: 'invalid-type',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "type"]`,
    )
  })

  test('error: rejects invalid token format', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'day',
          token: 'invalid-token',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "token"]`,
    )
  })
})

describe('Permission', () => {
  test('behavior: parses call permission', () => {
    const result = z.parse(Permission.Permission, {
      selector: '0xa9059cbb',
      to: '0x1234567890123456789012345678901234567890',
      type: 'call',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "selector": "0xa9059cbb",
        "to": "0x1234567890123456789012345678901234567890",
        "type": "call",
      }
    `)
  })

  test('behavior: parses spend permission', () => {
    const result = z.parse(Permission.Permission, {
      limit: '0x64',
      period: 'day',
      type: 'spend',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "limit": 100n,
        "period": "day",
        "type": "spend",
      }
    `)
  })

  test('error: rejects invalid permission type', () => {
    expect(
      zError.fromError(
        z.safeParse(Permission.Permission, {
          selector: '0xa9059cbb',
          to: '0x1234567890123456789012345678901234567890',
          type: 'invalid-type',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "type" or Invalid input at "limit"; Invalid input at "period"; Invalid input at "type"]`,
    )
  })

  test('error: rejects empty object', () => {
    expect(
      zError.fromError(z.safeParse(Permission.Permission, {}).error),
    ).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid input at "selector"; Invalid input at "to"; Invalid input at "type" or Invalid input at "limit"; Invalid input at "period"; Invalid input at "type"]`,
    )
  })
})
