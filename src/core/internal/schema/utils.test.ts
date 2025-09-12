import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import type * as zc from 'zod/v4/core'
import * as u from './utils.js'

describe('Primitive', () => {
  describe('Address', () => {
    test('behavior: parse valid address', () => {
      const result = z.parse(u.address(), '0x1234567890abcdef')
      expect(result).toBe('0x1234567890abcdef')
    })

    test('behavior: reject invalid address without 0x prefix', () => {
      expect(() =>
        z.parse(u.address(), '1234567890abcdef'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [],
            "message": "Needs string in format ^0x[A-Fa-f0-9]{40}$."
          }
        ]]
      `,
      )
    })

    test('behavior: reject non-string values', () => {
      expect(() =>
        z.parse(u.address(), 123),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "expected": "template_literal",
            "code": "invalid_type",
            "path": [],
            "message": "Needs string in format ^0x[A-Fa-f0-9]{40}$."
          }
        ]]
      `,
      )
    })
  })

  describe('Hex', () => {
    test('behavior: parse valid hex string', () => {
      const result = z.parse(u.hex(), '0xdeadbeef')
      expect(result).toBe('0xdeadbeef')
    })

    test('behavior: reject hex without 0x prefix', () => {
      expect(() =>
        z.parse(u.hex(), 'deadbeef'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [],
            "message": "Needs string in format ^0x[A-Fa-f0-9]+$."
          }
        ]]
      `,
      )
    })

    test('behavior: accept empty hex', () => {
      const result = z.parse(u.hex(), '0x')
      expect(result).toBe('0x')
    })
  })

  describe('Number', () => {
    test('behavior: decode hex to number', () => {
      const result = z.parse(u.number(), '0x10')
      expect(result).toBe(16)
    })

    test('behavior: decode 0x0 to 0', () => {
      const result = z.parse(u.number(), '0x0')
      expect(result).toBe(0)
    })

    test('behavior: encode number to hex', () => {
      const result = z.encode(u.number(), 255)
      expect(result).toBe('0xff')
    })

    test('behavior: encode 0 to 0x0', () => {
      const result = z.encode(u.number(), 0)
      expect(result).toBe('0x0')
    })

    test('behavior: reject invalid hex', () => {
      expect(() =>
        z.parse(u.number(), 'invalid'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [],
            "message": "Needs string in format ^0x[A-Fa-f0-9]+$."
          }
        ]]
      `)
    })
  })

  describe('BigInt', () => {
    test('behavior: decode hex to bigint', () => {
      const result = z.parse(u.bigint(), '0x100')
      expect(result).toBe(256n)
    })

    test('behavior: decode large hex to bigint', () => {
      const result = z.parse(u.bigint(), '0xffffffffffffffff')
      expect(result).toBe(18446744073709551615n)
    })

    test('behavior: decode 0x0 to 0n', () => {
      const result = z.parse(u.bigint(), '0x0')
      expect(result).toBe(0n)
    })

    test('behavior: encode bigint to hex', () => {
      const result = z.encode(u.bigint(), 1000n)
      expect(result).toBe('0x3e8')
    })

    test('behavior: encode 0n to 0x0', () => {
      const result = z.encode(u.bigint(), 0n)
      expect(result).toBe('0x0')
    })

    test('behavior: reject invalid hex', () => {
      expect(() =>
        z.parse(u.bigint(), 'not-hex'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [],
            "message": "Needs string in format ^0x[A-Fa-f0-9]+$."
          }
        ]]
      `)
    })
  })
})

describe('formatError', () => {
  test('behavior: format invalid type error', () => {
    const schema = z.object({
      name: z.string(),
    })

    try {
      z.parse(schema, { name: 123 })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`name\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format multiple errors', () => {
    const schema = z.object({
      user: z.object({
        age: z.number(),
        name: z.string(),
      }),
    })

    try {
      z.parse(schema, { user: { age: 'not a number', name: 123 } })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 2 errors:

        - at \`user.age\`: Expected number. 
        - at \`user.name\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format invalid union error', () => {
    const schema = z.object({
      value: z.union([z.string(), z.number()]),
    })

    try {
      z.parse(schema, { value: true })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`value\`: Invalid union value.
          - Expected string. 
          - Expected number. ]
      `,
      )
    }
  })

  test('behavior: format complex nested paths', () => {
    const schema = z.object({
      users: z.array(
        z.object({
          addresses: z.array(
            z.object({
              city: z.string(),
            }),
          ),
        }),
      ),
    })

    try {
      z.parse(schema, {
        users: [
          {
            addresses: [{ city: 'New York' }, { city: null }],
          },
        ],
      })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`users[0].addresses[1].city\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format paths with special characters', () => {
    const schema = z.object({
      data: z.object({
        'user-info': z.object({
          'first.name': z.string(),
        }),
      }),
    })

    try {
      z.parse(schema, {
        data: {
          'user-info': {
            'first.name': 42,
          },
        },
      })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`data["user-info"]["first.name"]\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format enum error', () => {
    const schema = z.object({
      color: z.enum(['red', 'green', 'blue']),
    })

    try {
      z.parse(schema, { color: 'yellow' })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`color\`: Expected one of: "red", "green", "blue"]
      `,
      )
    }
  })

  test('behavior: format map error', () => {
    const schema = z.object({
      myMap: z.map(z.string(), z.number()),
    })

    try {
      z.parse(schema, { myMap: new Map([[123, 'value']]) })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 2 errors:

        - at \`myMap[123]\`: Expected string. 
        - at \`myMap[123]\`: Expected number. ]
      `,
      )
    }
  })

  test('behavior: format set error', () => {
    const schema = z.object({
      mySet: z.set(z.number()),
    })

    try {
      z.parse(schema, { mySet: new Set([1, 2, 'invalidItem']) })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`mySet\`: Expected number. ]
      `,
      )
    }
  })

  test('behavior: handle empty path', () => {
    const schema = z.object({})

    try {
      z.parse(schema, 'not an object')
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - Expected object. ]
      `,
      )
    }
  })

  test('behavior: handle array input type', () => {
    const schema = z.object({
      value: z.string(),
    })

    try {
      z.parse(schema, { value: [1, 2, 3] })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`value\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: handle date input type', () => {
    const schema = z.object({
      value: z.string(),
    })

    try {
      z.parse(schema, { value: new Date() })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`value\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: handle bigint type', () => {
    const schema = z.object({
      value: z.string(),
    })

    try {
      z.parse(schema, { value: BigInt(123) })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`value\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format literal error', () => {
    const schema = z.object({
      status: z.literal('active'),
    })

    try {
      z.parse(schema, { status: 'inactive' })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`status\`: Expected "active"]
      `,
      )
    }
  })

  test('behavior: format tuple error', () => {
    const schema = z.tuple([z.string(), z.number()])

    try {
      z.parse(schema, ['hello', 'world'])
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`[1]\`: Expected number. ]
      `,
      )
    }
  })

  test('behavior: format record error', () => {
    const schema = z.record(z.string(), z.number())

    try {
      z.parse(schema, { key1: 1, key2: 'not a number' })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`key2\`: Expected number. ]
      `,
      )
    }
  })

  test('behavior: handle undefined value', () => {
    const schema = z.object({
      required: z.string(),
    })

    try {
      z.parse(schema, { required: undefined })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`required\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: handle null value', () => {
    const schema = z.object({
      value: z.string(),
    })

    try {
      z.parse(schema, { value: null })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`value\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format optional field error', () => {
    const schema = z.object({
      optional: z.optional(z.string()),
    })

    try {
      z.parse(schema, { optional: 123 })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`optional\`: Expected string. ]
      `,
      )
    }
  })

  test('behavior: format with regex check', () => {
    const schema = z.object({
      zipCode: z.string().check(z.regex(/^\d{5}$/)),
    })

    try {
      z.parse(schema, { zipCode: '1234' })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`zipCode\`: Must match pattern: /^\\d{5}$/]
      `,
      )
      expect(result).toMatchInlineSnapshot(`
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`zipCode\`: Must match pattern: /^\\d{5}$/]
      `)
    }
  })

  test('behavior: handle symbol in path', () => {
    const sym = Symbol('test')
    const schema = z.object({
      data: z.record(z.any(), z.string()),
    })

    try {
      z.parse(schema, { data: { [sym]: 123 } })
    } catch (error) {
      const result = u.toValidationError(error as zc.$ZodError)
      expect(result).toMatchInlineSnapshot(
        `
        [Schema.ValidationError: Validation failed with 1 error:

        - at \`data[Symbol(test)]\`: Expected string. ]
      `,
      )
    }
  })
})
