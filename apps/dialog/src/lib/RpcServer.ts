import { Query } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import { Address, Json } from 'ox'
import { Account, RpcServer } from 'porto'
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
  } = props

  const account = Hooks.useAccount(porto, { address })
  const client = Hooks.useClient(porto, { chainId })
  const feeToken = FeeToken.useFetch({
    address: props.feeToken,
    chainId,
  })

  return Query.useQueryWithPersistedError(
    useQuery({
      enabled: enabled && !!account,
      async queryFn() {
        if (!account) throw new Error('account is required.')

        const key = Account.getKey(account, { role: 'admin' })
        if (!key) throw new Error('no admin key found.')

        return await RpcServer.prepareCalls(client, {
          account,
          authorizeKeys,
          calls,
          feeToken: feeToken.data?.address,
          key,
          revokeKeys,
        })
      },
      queryKey: [
        'prepareCalls',
        account?.address,
        Json.stringify({
          authorizeKeys,
          calls,
          revokeKeys,
        }),
        client.uid,
        feeToken.data?.address,
      ],
      refetchInterval: 15_000,
    }),
  )
}

export declare namespace usePrepareCalls {
  export type Props<calls extends readonly unknown[] = readonly unknown[]> =
    Pick<
      RpcServer.prepareCalls.Parameters<calls>,
      'authorizeKeys' | 'calls' | 'revokeKeys'
    > & {
      address?: Address.Address | undefined
      chainId?: number | undefined
      enabled?: boolean | undefined
      feeToken?: Address.Address | undefined
    }
}
