import * as Query from '@tanstack/react-query'
import * as FeeTokens from 'porto/core/internal/feeTokens.js'
import { Hooks } from 'porto/remote'
import type { ServerClient } from 'porto/viem'
import { porto } from './Porto.js'

export namespace fetch {
  export function queryOptions(
    client: ServerClient.ServerClient,
    parameters: queryOptions.Parameters = {},
  ) {
    const { addressOrSymbol, enabled } = parameters

    return Query.queryOptions({
      enabled,
      async queryFn() {
        return await FeeTokens.fetch(client, {
          addressOrSymbol,
          store: porto._internal.store,
        })
      },
      queryKey: [
        'feeTokens',
        client.uid,
        addressOrSymbol,
        porto._internal.store,
      ],
    })
  }

  export declare namespace queryOptions {
    export type Parameters = FeeTokens.fetch.Parameters & {
      enabled?: boolean | undefined
    }
  }

  export function useQuery(parameters: useQuery.Parameters) {
    const { chainId } = parameters
    const client = Hooks.useServerClient(porto, { chainId })
    return Query.useQuery(queryOptions(client, parameters))
  }

  export namespace useQuery {
    export type Parameters = queryOptions.Parameters & {
      chainId?: number | undefined
    }
  }
}
