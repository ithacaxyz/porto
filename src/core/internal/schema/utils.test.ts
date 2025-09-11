import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as u from './utils.js'

describe('Primitive', () => {
  describe('Address', () => {
    test('should parse valid address', () => {
      const result = z.parse(u.address(), '0x1234567890abcdef')
      expect(result).toBe('0x1234567890abcdef')
    })

    test('should reject invalid address without 0x prefix', () => {
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
            "message": "Invalid input"
          }
        ]]
      `,
      )
    })

    test('should reject non-string values', () => {
      expect(() =>
        z.parse(u.address(), 123),
      ).toThrowErrorMatchingInlineSnapshot(
        `
        [$ZodError: [
          {
            "expected": "template_literal",
            "code": "invalid_type",
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `,
      )
    })
  })

  describe('Hex', () => {
    test('should parse valid hex string', () => {
      const result = z.parse(u.hex(), '0xdeadbeef')
      expect(result).toBe('0xdeadbeef')
    })

    test('should reject hex without 0x prefix', () => {
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
            "message": "Invalid input"
          }
        ]]
      `,
      )
    })

    test('should accept empty hex', () => {
      const result = z.parse(u.hex(), '0x')
      expect(result).toBe('0x')
    })
  })

  describe('Number', () => {
    test('should decode hex to number', () => {
      const result = z.parse(u.number(), '0x10')
      expect(result).toBe(16)
    })

    test('should decode 0x0 to 0', () => {
      const result = z.parse(u.number(), '0x0')
      expect(result).toBe(0)
    })

    test('should encode number to hex', () => {
      const result = z.encode(u.number(), 255)
      expect(result).toBe('0xff')
    })

    test('should encode 0 to 0x0', () => {
      const result = z.encode(u.number(), 0)
      expect(result).toBe('0x0')
    })

    test('should reject invalid hex', () => {
      expect(() =>
        z.parse(u.number(), 'invalid'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `)
    })
  })

  describe('BigInt', () => {
    test('should decode hex to bigint', () => {
      const result = z.parse(u.bigint(), '0x100')
      expect(result).toBe(256n)
    })

    test('should decode large hex to bigint', () => {
      const result = z.parse(u.bigint(), '0xffffffffffffffff')
      expect(result).toBe(18446744073709551615n)
    })

    test('should decode 0x0 to 0n', () => {
      const result = z.parse(u.bigint(), '0x0')
      expect(result).toBe(0n)
    })

    test('should encode bigint to hex', () => {
      const result = z.encode(u.bigint(), 1000n)
      expect(result).toBe('0x3e8')
    })

    test('should encode 0n to 0x0', () => {
      const result = z.encode(u.bigint(), 0n)
      expect(result).toBe('0x0')
    })

    test('should reject invalid hex', () => {
      expect(() =>
        z.parse(u.bigint(), 'not-hex'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [$ZodError: [
          {
            "code": "invalid_format",
            "format": "template_literal",
            "pattern": "^0x[\\\\s\\\\S]{0,}$",
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `)
    })
  })
})
