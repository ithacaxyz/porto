import * as Query from '@tanstack/react-query'
import * as Tokens from 'porto/core/internal/tokens'
import { Hooks } from 'porto/remote'
import type { Chain, Client, Transport } from 'viem'
import { porto } from './Porto.js'

export type { Token } from 'porto/core/internal/tokens'

/**
 * Fetches all supported tokens from the Relay for a given chain.
 */
export namespace getTokens {
  export function queryOptions<data = queryOptions.Data>(
    client: Client<Transport, Chain>,
    parameters: queryOptions.Options<data>,
  ) {
    const { addressOrSymbol, enabled, select } = parameters

    return Query.queryOptions({
      enabled,
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await Tokens.getTokens(client, parameters)
      },
      queryKey: queryOptions.queryKey(client, { addressOrSymbol }),
      select,
    })
  }

  export namespace queryOptions {
    export type Data = Tokens.getTokens.ReturnType
    export type QueryKey = ReturnType<typeof queryKey>

    export type Options<data = Data> = queryKey.Options &
      Pick<
        Query.UseQueryOptions<Data, Error, data, QueryKey>,
        'enabled' | 'select'
      >

    export function queryKey<const calls extends readonly unknown[]>(
      client: Client,
      options: queryKey.Options,
    ) {
      return ['Tokens.getTokens', options, client.uid] as const
    }

    export namespace queryKey {
      export type Options = Omit<Tokens.getTokens.Parameters, 'chain'>
    }
  }

  export function useQuery<data = queryOptions.Data>(
    parameters: useQuery.Parameters<data> = {} as useQuery.Parameters<data>,
  ) {
    const { chainId } = parameters
    const client = Hooks.useRelayClient(porto, { chainId })
    return Query.useQuery(queryOptions<data>(client, parameters))
  }

  export namespace useQuery {
    export type Parameters<data = queryOptions.Data> =
      queryOptions.Options<data> & {
        chainId?: number | undefined
      }
  }
}

export namespace resolveFeeTokens {
  export function queryOptions(
    client: Client<Transport, Chain>,
    parameters: queryOptions.Options = {},
  ) {
    const { addressOrSymbol, enabled } = parameters

    return Query.queryOptions({
      enabled,
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await Tokens.resolveFeeTokens(client, parameters)
      },
      queryKey: queryOptions.queryKey(client, {
        addressOrSymbol,
        store: porto._internal.store as any,
      }),
    })
  }

  export namespace queryOptions {
    export type Data = Tokens.resolveFeeTokens.ReturnType
    export type QueryKey = ReturnType<typeof queryKey>

    export type Options = queryKey.Options &
      Pick<Query.UseQueryOptions<Data, Error, Data, QueryKey>, 'enabled'>

    export function queryKey<const calls extends readonly unknown[]>(
      client: Client,
      options: queryKey.Options,
    ) {
      return ['Tokens.resolveFeeTokens', options, client.uid] as const
    }

    export namespace queryKey {
      export type Options = Tokens.resolveFeeTokens.Parameters<Chain>
    }
  }

  export function useQuery(parameters: useQuery.Parameters) {
    const { chainId } = parameters
    const client = Hooks.useRelayClient(porto, { chainId })
    return Query.useQuery(queryOptions(client, parameters))
  }

  export namespace useQuery {
    export type Parameters = queryOptions.Options & {
      chainId?: number | undefined
    }
  }
}
