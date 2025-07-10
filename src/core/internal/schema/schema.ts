import { ArrayFormatter, ParseError } from 'effect/ParseResult'
import * as Schema from 'effect/Schema'
import type { ParseOptions } from 'effect/SchemaAST'
import * as Errors from 'ox/Errors'
import type { OneOf as OneOfType } from '../types.js'

export const OneOf = <members extends ReadonlyArray<Schema.Schema.All>>(
  ...schemas: members
): Schema.Schema<
  OneOfType<Schema.Schema.Type<members[number]>>,
  Schema.Schema.Encoded<members[number]>,
  Schema.Schema.Context<members[number]>
> => Schema.Union(...schemas) as never

export const decodeSync = coderFn(Schema.decodeSync)
export const decodeUnknownSync = coderFn(Schema.decodeUnknownSync)
export const encodeSync = coderFn(Schema.encodeSync)
export const encodeUnknownSync = coderFn(Schema.encodeUnknownSync)
export const validate = coderFn(Schema.validate)

export class CoderError extends Errors.BaseError<ParseError> {
  override readonly name = 'Schema.CoderError'

  constructor(cause: ParseError) {
    const message = (() => {
      const [issue] = ArrayFormatter.formatErrorSync(cause)

      if (!issue) return cause.message
      if (issue.path.length === 0) return issue.message

      const property = issue.path[issue.path.length - 1] as string
      const path = issue.path.join('.')
      return [
        (issue._tag === 'Missing' ? `\`${property}\` ` : '') + issue.message,
        `Path: ${path}`,
      ].join('\n')
    })()

    super(message, {
      cause,
    })
  }
}

/** @internal */
export function coderFn<
  fn extends (
    schema: Schema.Schema<any, any>,
  ) => (v: unknown, overrideOptions?: ParseOptions) => any,
>(fn: fn): fn {
  return ((schema) => {
    return (v, o) => {
      try {
        return fn(schema)(v, o)
      } catch (error) {
        if (error instanceof ParseError) throw new CoderError(error)
        throw error
      }
    }
  }) as fn
}
