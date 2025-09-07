import { Env, Query as Query_porto } from '@porto/apps'
import * as Query from '@tanstack/react-query'
import type { Address } from 'ox'
import { type Account, RelayActions } from 'porto'
import * as PreCalls from 'porto/core/internal/preCalls'
import * as RequiredFunds from 'porto/core/internal/requiredFunds'
import type * as Capabilities_schema from 'porto/core/internal/schema/capabilities'
import type * as Token from 'porto/core/internal/schema/token'
import { Hooks } from 'porto/remote'
import type { RelayClient } from 'porto/viem'
import { porto } from './Porto'
import * as Tokens from './Tokens'

const multichain = Env.get() !== 'anvil'

export namespace prepareCalls {
  export function queryOptions<const calls extends readonly unknown[]>(
    client: RelayClient.RelayClient,
    options: queryOptions.Options<calls>,
  ) {
    const {
      account,
      authorizeKeys,
      enabled = true,
      calls,
      feePayer,
      feeToken,
      merchantRpcUrl,
      nonce,
      requiredFunds,
      refetchInterval,
      revokeKeys,
    } = options

    return Query.queryOptions({
      enabled: enabled && !!account,
      // TODO: use EIP-1193 Provider + `wallet_prepareCalls` in the future
      // to dedupe.
      async queryFn({ queryKey }) {
        const [, { account, feeToken, ...parameters }] = queryKey

        if (!account) throw new Error('account is required.')

        const [tokens, feeTokens] = await Promise.all([
          Query_porto.client.ensureQueryData(
            Tokens.getTokens.queryOptions(client, {}),
          ),
          Query_porto.client.ensureQueryData(
            Tokens.resolveFeeTokens.queryOptions(client, {
              addressOrSymbol: feeToken,
            }),
          ),
        ])
        const [{ address: feeTokenAddress }] = feeTokens

        // Get pre-authorized keys to assign to the call bundle.
        const preCalls = await PreCalls.get({
          address: account.address,
          storage: porto.config.storage,
        })

        const requiredFunds = RequiredFunds.toRelay(
          parameters.requiredFunds ?? [],
          {
            tokens,
          },
        )

        return await RelayActions.prepareCalls(client, {
          ...parameters,
          account,
          feeToken: feeTokenAddress,
          preCalls,
          requiredFunds: multichain ? requiredFunds : undefined,
        })
      },
      queryKey: queryOptions.queryKey(client, {
        account,
        authorizeKeys,
        calls,
        feePayer,
        feeToken,
        merchantRpcUrl,
        nonce,
        requiredFunds,
        revokeKeys,
      }),
      refetchInterval,
    })
  }

  export namespace queryOptions {
    export type Data = RelayActions.prepareCalls.ReturnType
    export type Error = RelayActions.prepareCalls.ErrorType
    export type QueryKey = ReturnType<typeof queryKey>

    export type Options<calls extends readonly unknown[] = readonly unknown[]> =
      queryKey.Options<calls> &
        Pick<
          Query.UseQueryOptions<Data, Error, Data, QueryKey>,
          'enabled' | 'refetchInterval'
        >

    export function queryKey<const calls extends readonly unknown[]>(
      client: RelayClient.RelayClient,
      options: queryKey.Options<calls>,
    ) {
      return ['prepareCalls', options, client.uid] as const
    }

    export namespace queryKey {
      export type Options<
        calls extends readonly unknown[] = readonly unknown[],
      > = Pick<
        RelayActions.prepareCalls.Parameters<calls>,
        'authorizeKeys' | 'calls' | 'feePayer' | 'nonce' | 'revokeKeys'
      > & {
        account?: Account.Account | undefined
        feeToken?: Token.Symbol | Address.Address | undefined
        merchantRpcUrl?: string | undefined
        requiredFunds?: Capabilities_schema.requiredFunds.Request | undefined
      }
    }
  }

  export function useQuery<const calls extends readonly unknown[]>(
    props: useQuery.Props<calls>,
  ) {
    const { address, chainId } = props

    const account = Hooks.useAccount(porto, { address })
    const client = Hooks.useRelayClient(porto, { chainId })

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
