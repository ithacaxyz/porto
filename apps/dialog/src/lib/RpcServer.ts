import { useQuery } from '@tanstack/react-query'
import { type Address, Json } from 'ox'
import { Account, ServerActions } from 'porto'
import type * as FeeToken_typebox from 'porto/core/internal/typebox/feeToken'
import { Hooks } from 'porto/remote'

import * as FeeToken from './FeeToken'
import { porto } from './Porto'

// TODO: consider using EIP-1193 Provider + `wallet_prepareCalls` in the future
// (for case where the account wants to self-relay).
export function usePrepareCalls<const calls extends readonly unknown[]>(
  props: usePrepareCalls.Props<calls>,
) {
  const {
    authorizeKeys,
    address,
    enabled = true,
    calls,
    chainId,
    revokeKeys,
    sponsorUrl,
  } = props

  const account = Hooks.useAccount(porto, { address })
  const client = Hooks.useServerClient(porto, { chainId })
  const feeToken = FeeToken.useFetch({
    addressOrSymbol: props.feeToken,
  })

  return useQuery({
    enabled: enabled && !!account,
    async queryFn() {
      if (!account) throw new Error('account is required.')

      const key = Account.getKey(account, { role: 'admin' })
      if (!key) throw new Error('no admin key found.')

      return await ServerActions.prepareCalls(client, {
        account,
        authorizeKeys,
        calls,
        feeToken: feeToken.data?.address,
        key,
        revokeKeys,
        sponsorUrl,
      })
    },
    queryKey: [
      'prepareCalls',
      account?.address,
      Json.stringify({
        authorizeKeys,
        calls,
        revokeKeys,
        sponsorUrl,
      }),
      client.uid,
      feeToken.data?.address,
    ],
    refetchInterval: 15_000,
  })
}

export declare namespace usePrepareCalls {
  export type Props<calls extends readonly unknown[] = readonly unknown[]> =
    Pick<
      ServerActions.prepareCalls.Parameters<calls>,
      'authorizeKeys' | 'calls' | 'revokeKeys'
    > & {
      address?: Address.Address | undefined
      chainId?: number | undefined
      enabled?: boolean | undefined
      feeToken?: FeeToken_typebox.Symbol | Address.Address | undefined
      sponsorUrl?: string | undefined
    }
}
