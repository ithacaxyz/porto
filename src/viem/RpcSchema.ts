import type * as RpcSchema_ox from 'ox/RpcSchema'
import type { UnionToTuple } from '../core/internal/types.js'

export type RpcSchema<schema extends RpcSchema_ox.Generic> =
  UnionToTuple<schema> extends [
    infer head extends RpcSchema_ox.Generic,
    ...infer tail extends RpcSchema_ox.Generic[],
  ]
    ? [
        {
          Method: head['Request']['method']
          Parameters: head['Request']['params']
          ReturnType: head['ReturnType']
        },
        ...RpcSchema<tail[number]>,
      ]
    : []
