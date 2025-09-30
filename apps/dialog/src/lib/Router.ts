import {
  createRouter,
  parseSearchWith,
  stringifySearchWith,
} from '@tanstack/react-router'
import { Json, Provider, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import * as RpcRequest from 'porto/core/internal/schema/request'
import { Actions } from 'porto/remote'

import { routeTree } from '~/routeTree.gen.ts'
import { porto } from './Porto'

export function parseSearchRequest<
  method extends RpcSchema.ExtractMethodName<porto_RpcSchema.Schema>,
>(
  search: Record<string, unknown>,
  parameters: parseSearchRequest.Parameters<method>,
): parseSearchRequest.ReturnType<method> {
  const { method } = parameters
  try {
    // Avoid re-parsing already decoded requests to prevent double-processing
    if ('_decoded' in search && search._decoded) return search as never
    if (search._decoded) return search as never

    const request = RpcRequest.validate(RpcRequest.Request, search)
    if (request.method === method)
      return {
        ...request,
        _returnType: undefined,
        id: Number(search.id),
        jsonrpc: '2.0',
      } as never
    throw new Error(
      `method mismatch. expected "\`${method}\`" but got "\`${request.method}\`"`,
    )
  } catch (error) {
    const rpcError = Provider.parseError(error)
    Actions.rejectAll(porto, rpcError)
    throw error
  }
}

export namespace parseSearchRequest {
  export type Parameters<
    method extends RpcSchema.ExtractMethodName<porto_RpcSchema.Schema>,
  > = { method: method }

  export type ReturnType<
    method extends RpcSchema.ExtractMethodName<porto_RpcSchema.Schema>,
  > = Extract<RpcRequest.Request, { method: method }> & {
    jsonrpc: '2.0'
    id: number
    _returnType: undefined
  }
}

export const router = createRouter({
  context: {
    appState: undefined as never,
    portoState: undefined as never,
  },
  defaultPreload: 'intent',
  parseSearch: parseSearchWith(Json.parse),
  routeTree,
  stringifySearch: stringifySearchWith(Json.stringify),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
