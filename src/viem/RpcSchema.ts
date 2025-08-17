import type * as RpcSchema_ox from 'ox/RpcSchema'
import type { PublicRpcSchema } from 'viem'
import type { Schema as Schema_relay } from '../core/internal/relay/rpcSchema.js'
import type { UnionToTuple } from '../core/internal/types.js'
import type { Schema } from '../core/RpcSchema.js'

export type Relay = [...PublicRpcSchema, ...ToViem<Schema_relay>]

export type Wallet = [
  ...PublicRpcSchema,
  ...ToViem<Exclude<Schema, RpcSchema_ox.Eth>>,
]

type ToViem<schema extends RpcSchema_ox.Generic> =
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
        ...ToViem<tail[number]>,
      ]
    : []
