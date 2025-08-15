import * as Query from '@tanstack/react-query'
import * as FeeTokens from 'porto/core/internal/feeTokens.js'
import { Hooks } from 'porto/remote'
import type { ServerClient } from 'porto/viem'
import { porto } from './Porto.js'

export namespace fetch {
  export function queryOptions(
    client: ServerClient.ServerClient,
    parameters: queryOptions.Options = {},
  ) {
    const { addressOrSymbol, enabled } = parameters

    return Query.queryOptions({
      enabled,
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await FeeTokens.fetch(client, parameters)
      },
      queryKey: queryOptions.queryKey(client, {
        addressOrSymbol,
      }),
    })
  }

  export namespace queryOptions {
    export type Data = FeeTokens.fetch.ReturnType
    export type QueryKey = ReturnType<typeof queryKey>

    export type Options = queryKey.Options &
      Pick<Query.UseQueryOptions<Data, Error, Data, QueryKey>, 'enabled'>

    export function queryKey<const calls extends readonly unknown[]>(
      client: ServerClient.ServerClient,
      options: queryKey.Options,
    ) {
      return ['feeTokens', options, client.uid] as const
    }

    export namespace queryKey {
      export type Options = FeeTokens.fetch.Parameters
    }
  }

  export function useQuery(parameters: useQuery.Parameters) {
    const { chainId } = parameters
    const client = Hooks.useServerClient(porto, { chainId })
    return Query.useQuery(queryOptions(client, parameters))
  }

  export namespace useQuery {
    export type Parameters = queryOptions.Options & {
      chainId?: number | undefined
    }
  }
}
