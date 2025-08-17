import { describe, expect, test } from 'vitest'
import * as Schema from '../../schema/schema.js'
import * as Permission from './permission.js'

describe('CallPermission', () => {
  test('behavior: parses valid call permission', () => {
    const result = Schema.decodeUnknownSync(Permission.CallPermission)({
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
    const result = Schema.encodeSync(Permission.CallPermission)({
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
    expect(() =>
      Schema.decodeUnknownSync(Permission.CallPermission)({
        to: '0x1234567890123456789012345678901234567890',
        type: 'call',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`selector\` is missing
      Path: selector

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" }
      └─ ["selector"]
         └─ is missing]
    `)
  })

  test('param: rejects missing to address', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.CallPermission)({
        selector: '0xa9059cbb',
        type: 'call',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`to\` is missing
      Path: to

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" }
      └─ ["to"]
         └─ is missing]
    `)
  })

  test('param: rejects missing type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.CallPermission)({
        selector: '0xa9059cbb',
        to: '0x1234567890123456789012345678901234567890',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`type\` is missing
      Path: type

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" }
      └─ ["type"]
         └─ is missing]
    `)
  })

  test('error: rejects invalid selector format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.CallPermission)({
        selector: 'invalid-selector',
        to: '0x1234567890123456789012345678901234567890',
        type: 'call',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-selector"
      Path: selector

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" }
      └─ ["selector"]
         └─ Expected \`0x\${string}\`, actual "invalid-selector"]
    `)
  })

  test('error: rejects invalid to address format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.CallPermission)({
        selector: '0xa9059cbb',
        to: 'invalid-address',
        type: 'call',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-address"
      Path: to

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" }
      └─ ["to"]
         └─ Expected \`0x\${string}\`, actual "invalid-address"]
    `)
  })

  test('error: rejects invalid type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.CallPermission)({
        selector: '0xa9059cbb',
        to: '0x1234567890123456789012345678901234567890',
        type: 'invalid-type',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "call", actual "invalid-type"
      Path: type

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" }
      └─ ["type"]
         └─ Expected "call", actual "invalid-type"]
    `)
  })
})

describe('SpendPermission', () => {
  test('behavior: parses valid spend permission with all fields', () => {
    const result = Schema.decodeUnknownSync(Permission.SpendPermission)({
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
    const result = Schema.decodeUnknownSync(Permission.SpendPermission)({
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
    const result = Schema.decodeUnknownSync(Permission.SpendPermission)({
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
      const result = Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: '0x64',
        period,
        type: 'spend',
      })
      expect(result.period).toBe(period)
    },
  )

  test('behavior: encodes spend permission with BigInt limit', () => {
    const result = Schema.encodeSync(Permission.SpendPermission)({
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
    const result = Schema.encodeSync(Permission.SpendPermission)({
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
    const result = Schema.encodeSync(Permission.SpendPermission)({
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
      const result = Schema.encodeSync(Permission.SpendPermission)({
        limit,
        period: 'day',
        type: 'spend',
      })
      expect(result.limit).toBe(expected)
    },
  )

  test('param: rejects missing limit', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        period: 'day',
        type: 'spend',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`limit\` is missing
      Path: limit

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["limit"]
         └─ is missing]
    `)
  })

  test('param: rejects missing period', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: '0x64',
        type: 'spend',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`period\` is missing
      Path: period

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["period"]
         └─ is missing]
    `)
  })

  test('param: rejects missing type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: '0x64',
        period: 'day',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`type\` is missing
      Path: type

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["type"]
         └─ is missing]
    `)
  })

  test('error: rejects invalid limit format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: 'invalid-limit',
        period: 'day',
        type: 'spend',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-limit"
      Path: limit

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["limit"]
         └─ (\`0x\${string}\` <-> bigint)
            └─ Encoded side transformation failure
               └─ Expected \`0x\${string}\`, actual "invalid-limit"]
    `)
  })

  test('error: rejects invalid period', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: '0x64',
        period: 'invalid-period',
        type: 'spend',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "minute", actual "invalid-period"
      Path: period

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["period"]
         └─ "minute" | "hour" | "day" | "week" | "month" | "year"
            ├─ Expected "minute", actual "invalid-period"
            ├─ Expected "hour", actual "invalid-period"
            ├─ Expected "day", actual "invalid-period"
            ├─ Expected "week", actual "invalid-period"
            ├─ Expected "month", actual "invalid-period"
            └─ Expected "year", actual "invalid-period"]
    `)
  })

  test('error: rejects invalid type', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: '0x64',
        period: 'day',
        type: 'invalid-type',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "spend", actual "invalid-type"
      Path: type

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["type"]
         └─ Expected "spend", actual "invalid-type"]
    `)
  })

  test('error: rejects invalid token format', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.SpendPermission)({
        limit: '0x64',
        period: 'day',
        token: 'invalid-token',
        type: 'spend',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid-token"
      Path: token

      Details: { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ ["token"]
         └─ \`0x\${string}\` | null | undefined
            ├─ \`0x\${string}\` | null
            │  ├─ Expected \`0x\${string}\`, actual "invalid-token"
            │  └─ Expected null, actual "invalid-token"
            └─ Expected undefined, actual "invalid-token"]
    `)
  })
})

describe('Permission', () => {
  test('behavior: parses call permission', () => {
    const result = Schema.decodeUnknownSync(Permission.Permission)({
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
    const result = Schema.decodeUnknownSync(Permission.Permission)({
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
    expect(() =>
      Schema.decodeUnknownSync(Permission.Permission)({
        selector: '0xa9059cbb',
        to: '0x1234567890123456789012345678901234567890',
        type: 'invalid-type',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: Expected "call" | "spend", actual "invalid-type"
      Path: type

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ { readonly type: "call" | "spend" }
         └─ ["type"]
            └─ Expected "call" | "spend", actual "invalid-type"]
    `)
  })

  test('error: rejects empty object', () => {
    expect(() =>
      Schema.decodeUnknownSync(Permission.Permission)({}),
    ).toThrowErrorMatchingInlineSnapshot(`
      [Schema.CoderError: \`type\` is missing
      Path: type

      Details: { readonly selector: \`0x\${string}\`; readonly to: \`0x\${string}\`; readonly type: "call" } | { readonly limit: (\`0x\${string}\` <-> bigint); readonly period: "minute" | "hour" | "day" | "week" | "month" | "year"; readonly token?: \`0x\${string}\` | null | undefined; readonly type: "spend" }
      └─ { readonly type: "call" | "spend" }
         └─ ["type"]
            └─ is missing]
    `)
  })
})
