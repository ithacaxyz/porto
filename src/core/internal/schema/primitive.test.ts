import { describe, expect, test } from 'vitest'
import * as Primitive from './primitive.js'
import * as Schema from './schema.js'

describe('Primitive', () => {
  describe('Address', () => {
    test('should parse valid address', () => {
      const result = Schema.decodeUnknownSync(Primitive.Address)(
        '0x1234567890abcdef',
      )
      expect(result).toBe('0x1234567890abcdef')
    })

    test('should reject invalid address without 0x prefix', () => {
      expect(() =>
        Schema.decodeUnknownSync(Primitive.Address)('1234567890abcdef'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected \`0x\${string}\`, actual "1234567890abcdef"

        Details: Expected \`0x\${string}\`, actual "1234567890abcdef"]
      `,
      )
    })

    test('should reject non-string values', () => {
      expect(() =>
        Schema.decodeUnknownSync(Primitive.Address)(123),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected \`0x\${string}\`, actual 123

        Details: Expected \`0x\${string}\`, actual 123]
      `,
      )
    })
  })

  describe('Hex', () => {
    test('should parse valid hex string', () => {
      const result = Schema.decodeUnknownSync(Primitive.Hex)('0xdeadbeef')
      expect(result).toBe('0xdeadbeef')
    })

    test('should reject hex without 0x prefix', () => {
      expect(() =>
        Schema.decodeUnknownSync(Primitive.Hex)('deadbeef'),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [Schema.CoderError: Expected \`0x\${string}\`, actual "deadbeef"

        Details: Expected \`0x\${string}\`, actual "deadbeef"]
      `,
      )
    })

    test('should accept empty hex', () => {
      const result = Schema.decodeUnknownSync(Primitive.Hex)('0x')
      expect(result).toBe('0x')
    })
  })

  describe('Number', () => {
    test('should decode hex to number', () => {
      const result = Schema.decodeUnknownSync(Primitive.Number)('0x10')
      expect(result).toBe(16)
    })

    test('should decode 0x0 to 0', () => {
      const result = Schema.decodeUnknownSync(Primitive.Number)('0x0')
      expect(result).toBe(0)
    })

    test('should encode number to hex', () => {
      const result = Schema.encodeSync(Primitive.Number)(255)
      expect(result).toBe('0xff')
    })

    test('should encode 0 to 0x0', () => {
      const result = Schema.encodeSync(Primitive.Number)(0)
      expect(result).toBe('0x0')
    })

    test('should reject invalid hex', () => {
      expect(() =>
        Schema.decodeUnknownSync(Primitive.Number)('invalid'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "invalid"

        Details: (\`0x\${string}\` <-> number)
        └─ Encoded side transformation failure
           └─ Expected \`0x\${string}\`, actual "invalid"]
      `)
    })
  })

  describe('BigInt', () => {
    test('should decode hex to bigint', () => {
      const result = Schema.decodeUnknownSync(Primitive.BigInt)('0x100')
      expect(result).toBe(256n)
    })

    test('should decode large hex to bigint', () => {
      const result = Schema.decodeUnknownSync(Primitive.BigInt)(
        '0xffffffffffffffff',
      )
      expect(result).toBe(18446744073709551615n)
    })

    test('should decode 0x0 to 0n', () => {
      const result = Schema.decodeUnknownSync(Primitive.BigInt)('0x0')
      expect(result).toBe(0n)
    })

    test('should encode bigint to hex', () => {
      const result = Schema.encodeSync(Primitive.BigInt)(1000n)
      expect(result).toBe('0x3e8')
    })

    test('should encode 0n to 0x0', () => {
      const result = Schema.encodeSync(Primitive.BigInt)(0n)
      expect(result).toBe('0x0')
    })

    test('should reject invalid hex', () => {
      expect(() =>
        Schema.decodeUnknownSync(Primitive.BigInt)('not-hex'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [Schema.CoderError: Expected \`0x\${string}\`, actual "not-hex"

        Details: (\`0x\${string}\` <-> bigint)
        └─ Encoded side transformation failure
           └─ Expected \`0x\${string}\`, actual "not-hex"]
      `)
    })
  })
})
