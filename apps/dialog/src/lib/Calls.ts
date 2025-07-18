import { Query as Query_porto } from '@porto/apps'
import * as Query from '@tanstack/react-query'
import type { Address } from 'ox'
import { Account, ServerActions } from 'porto'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken'
import { Hooks } from 'porto/remote'
import type { ServerClient } from 'porto/viem'

import * as FeeTokens from './FeeTokens'
import { porto } from './Porto'

export namespace prepareCalls {
  export function queryOptions<const calls extends readonly unknown[]>(
    client: ServerClient.ServerClient,
    options: queryOptions.Options<calls>,
  ) {
    const {
      account,
      authorizeKeys,
      enabled = true,
      calls,
      feeToken,
      merchantRpcUrl,
      refetchInterval,
      revokeKeys,
    } = options

    return Query.queryOptions({
      enabled: enabled && !!account,
      async queryFn({ queryKey }) {
        const [, { account, feeToken, ...parameters }] = queryKey

        if (!account) throw new Error('account is required.')

        const key = Account.getKey(account, { role: 'admin' })
        if (!key) throw new Error('no admin key found.')

        const [{ address: feeTokenAddress }] =
          await Query_porto.client.ensureQueryData(
            FeeTokens.fetch.queryOptions(client, {
              addressOrSymbol: feeToken,
            }),
          )

        // TODO: consider using EIP-1193 Provider + `wallet_prepareCalls` in the future
        // (for case where the account wants to self-relay).
        return await ServerActions.prepareCalls(client, {
          ...parameters,
          account,
          feeToken: feeTokenAddress,
          key,
        })
      },
      queryKey: queryOptions.queryKey(client, {
        account,
        authorizeKeys,
        calls,
        feeToken,
        merchantRpcUrl,
        revokeKeys,
      }),
      refetchInterval,
    })
  }

  export namespace queryOptions {
    export type Data = ServerActions.prepareCalls.ReturnType
    export type Error = ServerActions.prepareCalls.ErrorType
    export type QueryKey = ReturnType<typeof queryKey>

    export type Options<calls extends readonly unknown[] = readonly unknown[]> =
      queryKey.Options<calls> &
        Pick<
          Query.UseQueryOptions<Data, Error, Data, QueryKey>,
          'enabled' | 'refetchInterval'
        >

    export function queryKey<const calls extends readonly unknown[]>(
      client: ServerClient.ServerClient,
      options: queryKey.Options<calls>,
    ) {
      return ['prepareCalls', options, client.uid] as const
    }

    export namespace queryKey {
      export type Options<
        calls extends readonly unknown[] = readonly unknown[],
      > = Pick<
        ServerActions.prepareCalls.Parameters<calls>,
        'authorizeKeys' | 'calls' | 'revokeKeys'
      > & {
        account?: Account.Account | undefined
        feeToken?: FeeToken_schema.Symbol | Address.Address | undefined
        merchantRpcUrl?: string | undefined
      }
    }
  }

  export function useQuery<const calls extends readonly unknown[]>(
    props: useQuery.Props<calls>,
  ) {
    const { address, chainId } = props

    const account = Hooks.useAccount(porto, { address })
    const client = Hooks.useServerClient(porto, { chainId })

    return Query.useQuery(queryOptions(client, { ...props, account }))
  }

  export namespace useQuery {
    export type Props<calls extends readonly unknown[] = readonly unknown[]> =
      queryOptions.Options<calls> & {
        address?: Address.Address | undefined
        chainId?: number | undefined
      }

    export type Data = queryOptions.Data
  }
}
