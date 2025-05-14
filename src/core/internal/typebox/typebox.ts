import {
  Kind,
  type Static as Static_typebox,
  type StaticDecode as StaticDecode_typebox,
  type StaticEncode as StaticEncode_typebox,
  type TNever,
  type TOptional,
  type TSchema,
  type TUndefined,
  type TUnion,
  Type,
} from '@sinclair/typebox/type'

export { Type } from '@sinclair/typebox/type'
export { Decode, Encode, Value } from '@sinclair/typebox/value'

import type { DeepReadonly, OneOf as OneOfType } from '../types.js'

export function OneOf<schemas extends TSchema[]>(
  schemas: [...schemas],
): OneOf.ReturnType<schemas> {
  return Type.Union(schemas) as never
}

export declare namespace OneOf {
  type OneOfStatic<T extends TSchema[], P extends unknown[]> = {
    [K in keyof T]: T[K] extends TSchema ? Static_typebox<T[K], P> : never
  }[number]

  export interface ReturnType<T extends TSchema[] = TSchema[]> extends TSchema {
    [Kind]: 'Union'
    // @ts-expect-error
    static: OneOfType<OneOfStatic<T, this['params']>>
  }

  export type OneOf<T extends TSchema[]> = T extends []
    ? TNever
    : T extends [TSchema]
      ? T[0]
      : ReturnType<T>
}

export function Optional<schema extends TSchema>(
  schema: schema,
): TOptional<TUnion<[schema, TUndefined]>> {
  return Type.Optional(schema) as never
}

export type StaticDecode<
  T extends TSchema,
  P extends unknown[] = [],
> = DeepReadonly<StaticDecode_typebox<T, P>>

export type StaticEncode<
  T extends TSchema,
  P extends unknown[] = [],
> = DeepReadonly<StaticEncode_typebox<T, P>>

export type Static<T extends TSchema, P extends unknown[] = []> = DeepReadonly<
  Static_typebox<T, P>
>
