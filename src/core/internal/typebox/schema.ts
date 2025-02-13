import {
  Kind,
  type Static,
  type TNever,
  type TOptional,
  type TSchema,
  type TUndefined,
  type TUnion,
  Type,
} from '@sinclair/typebox'
import type { OneOf as OneOfType } from '../types.js'

export {
  Type,
  type Static,
  type StaticDecode,
  type StaticEncode,
} from '@sinclair/typebox'
export { Value, Encode, Decode } from '@sinclair/typebox/value'

type OneOfStatic<T extends TSchema[], P extends unknown[]> = {
  [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never
}[number]
export interface TOneOf<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Union'
  // @ts-expect-error
  static: OneOfType<OneOfStatic<T, this['params']>>
}
export type OneOf<T extends TSchema[]> = T extends []
  ? TNever
  : T extends [TSchema]
    ? T[0]
    : TOneOf<T>

export function Optional<schema extends TSchema>(
  schema: schema,
): TOptional<TUnion<[schema, TUndefined]>> {
  return Type.Optional(schema) as never
}

export function OneOf<schemas extends TSchema[]>(
  schemas: [...schemas],
): TOneOf<schemas> {
  return Type.Union(schemas) as never
}
