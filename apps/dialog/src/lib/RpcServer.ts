import { Query } from '@porto/apps'
import {
  queryOptions as queryOptions_query,
  type UseQueryOptions,
  useQuery as useQuery_query,
} from '@tanstack/react-query'
import { type Address, Json } from 'ox'
import { Account, ServerActions } from 'porto'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken'
import { Hooks } from 'porto/remote'
import type { ServerClient } from 'porto/viem'

import * as FeeTokens from './FeeTokens'
import { porto } from './Porto'

export namespace prepareCalls {
  export function queryOptions(
    client: ServerClient.ServerClient,
    props: queryOptions.Props,
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
    } = props

    return queryOptions_query({
      enabled: enabled && !!account,
      async queryFn() {
        if (!account) throw new Error('account is required.')

        const key = Account.getKey(account, { role: 'admin' })
        if (!key) throw new Error('no admin key found.')

        const [{ address: feeTokenAddress }] =
          await Query.client.ensureQueryData(
            FeeTokens.fetch.queryOptions(client, {
              addressOrSymbol: feeToken,
            }),
          )

        // TODO: consider using EIP-1193 Provider + `wallet_prepareCalls` in the future
        // (for case where the account wants to self-relay).
        return await ServerActions.prepareCalls(client, {
          account,
          authorizeKeys,
          calls,
          feeToken: feeTokenAddress,
          key,
          merchantRpcUrl,
          revokeKeys,
        })
      },
      queryKey: [
        'prepareCalls',
        account?.address,
        client.uid,
        Json.stringify({
          authorizeKeys,
          calls,
          feeToken,
          merchantRpcUrl,
          revokeKeys,
        }),
      ],
      refetchInterval,
    })
  }

  export namespace queryOptions {
    export type Props<calls extends readonly unknown[] = readonly unknown[]> =
      Pick<
        ServerActions.prepareCalls.Parameters<calls>,
        'authorizeKeys' | 'calls' | 'revokeKeys'
      > &
        Pick<
          UseQueryOptions<
            queryOptions.Data,
            Error,
            queryOptions.Data,
            (string | undefined)[]
          >,
          'enabled' | 'refetchInterval'
        > & {
          account?: Account.Account | undefined
          feeToken?: FeeToken_schema.Symbol | Address.Address | undefined
          merchantRpcUrl?: string | undefined
        }

    export type Data = ServerActions.prepareCalls.ReturnType
  }

  export function useQuery(props: useQuery.Props) {
    const { address, chainId } = props

    const account = Hooks.useAccount(porto, { address })
    const client = Hooks.useServerClient(porto, { chainId })

    return useQuery_query(queryOptions(client, { ...props, account }))
  }

  export namespace useQuery {
    export type Props = queryOptions.Props & {
      address?: Address.Address | undefined
      chainId?: number | undefined
    }

    export type Data = queryOptions.Data
  }
}
