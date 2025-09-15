import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
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
      u.toValidationError(
        z.safeParse(Permission.CallPermission, {
          to: '0x1234567890123456789012345678901234567890',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`selector\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })

  test('param: rejects missing to address', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`to\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]{40}$.]
    `,
    )
  })

  test('param: rejects missing type', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          to: '0x1234567890123456789012345678901234567890',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Expected "call"]
    `,
    )
  })

  test('error: rejects invalid selector format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.CallPermission, {
          selector: 'invalid-selector',
          to: '0x1234567890123456789012345678901234567890',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`selector\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects invalid to address format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          to: 'invalid-address',
          type: 'call',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`to\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects invalid type', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.CallPermission, {
          selector: '0xa9059cbb',
          to: '0x1234567890123456789012345678901234567890',
          type: 'invalid-type',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Expected "call"]
    `,
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
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          period: 'day',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`limit\`: Expected template_literal. Needs string in format ^0x[A-Fa-f0-9]+$.]
    `,
    )
  })

  test('param: rejects missing period', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`period\`: Invalid union value.
        - Expected "minute"
        - Expected "hour"
        - Expected "day"
        - Expected "week"
        - Expected "month"
        - Expected "year"]
    `,
    )
  })

  test('param: rejects missing type', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'day',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Expected "spend"]
    `,
    )
  })

  test('error: rejects invalid limit format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          limit: 'invalid-limit',
          period: 'day',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`limit\`: Must match pattern: ^0x[\\s\\S]{0,}$]
    `,
    )
  })

  test('error: rejects invalid period', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'invalid-period',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`period\`: Invalid union value.
        - Expected "minute"
        - Expected "hour"
        - Expected "day"
        - Expected "week"
        - Expected "month"
        - Expected "year"]
    `,
    )
  })

  test('error: rejects invalid type', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'day',
          type: 'invalid-type',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`type\`: Expected "spend"]
    `,
    )
  })

  test('error: rejects invalid token format', () => {
    expect(
      u.toValidationError(
        z.safeParse(Permission.SpendPermission, {
          limit: '0x64',
          period: 'day',
          token: 'invalid-token',
          type: 'spend',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - at \`token\`: Invalid union value.
        - Must match pattern: ^0x[\\s\\S]{0,}$
        - Expected null. ]
    `,
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
      u.toValidationError(
        z.safeParse(Permission.Permission, {
          selector: '0xa9059cbb',
          to: '0x1234567890123456789012345678901234567890',
          type: 'invalid-type',
        }).error,
      ),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - Invalid union value.
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

  test('error: rejects empty object', () => {
    expect(
      u.toValidationError(z.safeParse(Permission.Permission, {}).error),
    ).toMatchInlineSnapshot(
      `
      [Schema.ValidationError: Validation failed with 1 error:

      - Invalid union value.
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
})
