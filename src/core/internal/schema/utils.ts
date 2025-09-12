import * as Errors from 'ox/Errors'
import * as Hex_ox from 'ox/Hex'
import * as z from 'zod/mini'
import type * as zc from 'zod/v4/core'
import type { OneOf } from '../types.js'

export const address = () =>
  z.templateLiteral(['0x', z.string()], {
    message: 'Needs string in format ^0x[A-Fa-f0-9]{40}$.',
  })
export const hex = () =>
  z.templateLiteral(['0x', z.string()], {
    message: 'Needs string in format ^0x[A-Fa-f0-9]+$.',
  })
export const number = () =>
  z.codec(hex(), z.number(), {
    decode: (value) => Hex_ox.toNumber(value),
    encode: (value) => Hex_ox.fromNumber(value),
  })
export const bigint = () =>
  z.codec(hex(), z.bigint({ message: 'Required bigint' }), {
    decode: (value) => Hex_ox.toBigInt(value),
    encode: (value) => Hex_ox.fromNumber(value),
  })

export const is = <schema extends z.ZodMiniType>(
  schema: schema,
  message: unknown,
): message is z.infer<schema> => {
  try {
    schema.parse(message)
    return true
  } catch {
    return false
  }
}

export function oneOf<const type extends readonly zc.SomeType[]>(
  options: type,
): Omit<z.ZodMiniUnion<type>, '_zod'> & {
  _zod: Omit<z.ZodMiniUnion<type>['_zod'], 'output'> & {
    output: z.ZodMiniUnion<type>['_zod']['output'] extends object
      ? OneOf<z.ZodMiniUnion<type>['_zod']['output']>
      : z.ZodMiniUnion<type>['_zod']['output']
  }
} {
  return z.union(options) as never
}

export class ValidationError extends Errors.BaseError {
  override readonly name = 'Schema.ValidationError'
}

export function toValidationError(e: unknown): ValidationError {
  const error = e as zc.$ZodError

  let message = `Validation failed with ${error.issues.length} error${error.issues.length === 1 ? '' : 's'}:`
  message += '\n'

  for (const issue of error.issues) {
    if (!issue) continue
    message += '\n'
    message += formatIssue(issue)
  }

  return new ValidationError(message)
}

function formatIssue(issue: zc.$ZodIssue, level = 0): string {
  const path = formatPath(issue.path)
  const prefix = `- ${path ? `${path}: ` : ''}`
  const indent = '  '.repeat(level + 1)

  let message = prefix

  switch (issue.code) {
    case 'invalid_type': {
      const expected = issue.expected
      const received = issue.input ? formatReceivedType(issue) : 'undefined'
      message += `Expected ${expected}. ${issue.message !== 'Invalid input' ? issue.message : ''}`
      if (received !== 'undefined') message += `but received ${received}`
      break
    }

    case 'too_big': {
      const max = issue.maximum
      const inclusive = issue.inclusive ?? true
      const exact = issue.exact ?? false

      if (exact) message += `${issue.origin} must be exactly ${max}`
      else
        message += `${issue.origin} must be ${inclusive ? 'at most' : 'less than'} ${max}`
      break
    }

    case 'too_small': {
      const min = issue.minimum
      const inclusive = issue.inclusive ?? true
      const exact = issue.exact ?? false

      if (exact) message += `${issue.origin} must be exactly ${min}`
      else
        message += `${issue.origin} must be ${inclusive ? 'at least' : 'greater than'} ${min}`
      break
    }

    case 'invalid_format': {
      switch (issue.format) {
        case 'regex':
          message += `Must match pattern: ${(issue as zc.$ZodIssueStringInvalidRegex).pattern}`
          break
        case 'starts_with':
          message += `Must start with "${(issue as zc.$ZodIssueStringStartsWith).prefix}"`
          break
        case 'ends_with':
          message += `Must end with "${(issue as zc.$ZodIssueStringEndsWith).suffix}"`
          break
        case 'includes':
          message += `Must include "${(issue as zc.$ZodIssueStringIncludes).includes}"`
          break
        case 'template_literal':
          message += `Must match pattern: ${(issue as zc.$ZodIssueStringInvalidRegex).pattern}`
          break
        default:
          message += `Invalid ${issue.format} format`
      }
      break
    }

    case 'not_multiple_of': {
      message += `Number must be a multiple of ${issue.divisor}`
      break
    }

    case 'unrecognized_keys': {
      const keys = issue.keys.map((k) => `"${k}"`).join(', ')
      message += `Unrecognized key${issue.keys.length > 1 ? 's' : ''}: ${keys}`
      break
    }

    case 'invalid_union': {
      const hasErrors = issue.errors && issue.errors.length > 0

      message += 'Invalid union value.'

      if (hasErrors) {
        issue.errors.forEach((optionErrors) => {
          if (optionErrors.length > 0) {
            optionErrors.forEach((subIssue) => {
              message += '\n'
              message += indent
              message += formatIssue(subIssue, level + 1)
            })
          }
        })
      }
      break
    }

    case 'invalid_key': {
      message += `Invalid ${issue.origin} key`
      if (issue.issues && issue.issues.length > 0) {
        issue.issues.forEach((subIssue) => {
          message += '\n'
          message += indent
          message += formatIssue(subIssue, level + 1)
        })
      }
      break
    }

    case 'invalid_element': {
      message += `Invalid ${issue.origin} element at key "${issue.key}"`
      if (issue.issues && issue.issues.length > 0) {
        issue.issues.forEach((subIssue) => {
          message += '\n'
          message += indent
          message += formatIssue(subIssue, level + 1)
        })
      }
      break
    }

    case 'invalid_value': {
      const values = issue.values.map((v) => JSON.stringify(v)).join(', ')
      if (issue.values.length > 1) message += `Expected one of: ${values}`
      else message += `Expected ${values}`
      break
    }

    case 'custom': {
      message += issue.message || 'Custom validation failed'
      break
    }

    default: {
      message += (issue as zc.$ZodIssueBase).message || 'Validation failed'
    }
  }

  return message
}

function formatPath(path: PropertyKey[]): string {
  if (path.length === 0) return ''
  return (
    'at `' +
    path
      .map((key, index) => {
        if (typeof key === 'number') return `[${key}]`
        if (typeof key === 'symbol') return `[${key.toString()}]`
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) && index > 0) return `.${key}`
        if (index === 0 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) return key
        return `["${key}"]`
      })
      .join('') +
    '`'
  )
}

function formatReceivedType(issue: zc.$ZodIssueInvalidType): string {
  const value = issue.input

  if (value === undefined) return 'undefined'
  if (value === null) return 'null'

  const type = typeof value
  if (type === 'object') {
    if (Array.isArray(value)) return 'array'
    if (value instanceof Date) return 'date'
    if (value instanceof Map) return 'map'
    if (value instanceof Set) return 'set'
    return 'object'
  }
  return type
}
