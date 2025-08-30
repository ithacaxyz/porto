import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Provider } from 'ox'
import { Account, Key } from 'porto'
import { Actions, Hooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import * as React from 'react'
import { decodeFunctionData, erc20Abi } from 'viem'
import { waitForCallsStatus } from 'viem/actions'
import * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import * as Router from '~/lib/Router'
import { ActionRequest } from '../-components/ActionRequest'
import { Approve } from '../-components/Approve'

export const Route = createFileRoute('/dialog/eth_sendTransaction')({
  component: RouteComponent,
  validateSearch(search) {
    return Router.parseSearchRequest(search, {
      method: 'eth_sendTransaction',
    })
  },
})

function RouteComponent() {
  const request = Route.useSearch()
  const capabilities = request.params[0].capabilities
  const { chainId, data, from, to, value } = request._decoded.params[0]

  const calls = [{ data, to: to!, value }] as const
  const { feeToken, merchantRpcUrl } = capabilities ?? {}

  const prepareCallsQuery = Calls.prepareCalls.useQuery({
    address: from,
    calls,
    chainId,
    feeToken,
    merchantRpcUrl,
    refetchInterval: ({ state }) => (state.error ? false : 15_000),
    requiredFunds: undefined,
  })

  const account = Hooks.useAccount(porto, { address: from })
  const client = Hooks.useRelayClient(porto, { chainId })

  const feeTotals = prepareCallsQuery.data?.capabilities.feeTotals
  const quotes = prepareCallsQuery.data?.capabilities.quote?.quotes

  const chain = React.useMemo(() => {
    if (quotes && quotes.length > 0) {
      const destinationChain = quotes[quotes.length - 1]
      if (destinationChain)
        return porto.config.chains.find(
          (chain) => chain.id === destinationChain.chainId,
        )
    }
    return porto.config.chains.find((c) => c.id === chainId)
  }, [quotes, chainId])

  const approval = React.useMemo(() => {
    const [call] = calls
    if (!call || !call.data) return null
    try {
      const decoded = decodeFunctionData({ abi: erc20Abi, data: call.data })
      if (decoded.functionName === 'approve')
        return {
          amount: decoded.args[1],
          spender: decoded.args[0],
          tokenAddress: call.to,
        }
    } catch {
      return null
    }
  }, [calls])

  const respond = useMutation({
    // TODO: use EIP-1193 Provider + `wallet_sendPreparedCalls` in the future
    // to dedupe.
    async mutationFn(data: Calls.prepareCalls.useQuery.Data) {
      if (!account) throw new Error('account not found.')

      const key = Account.getKey(account, { role: 'admin' })
      if (!key) throw new Error('admin key not found.')

      const { capabilities, context, digest } = data

      const signature = await Key.sign(key, {
        payload: digest,
        wrap: false,
      })

      const { id } = await RelayActions.sendPreparedCalls(client, {
        capabilities: capabilities.feeSignature
          ? {
              feeSignature: capabilities.feeSignature,
            }
          : undefined,
        context,
        key,
        signature,
      })

      const { receipts } = await waitForCallsStatus(client, {
        id,
      })
      const hash = receipts?.[0]?.transactionHash

      if (!hash)
        return Actions.respond(porto, request, {
          error: new Provider.UnknownBundleIdError(),
        })
      return Actions.respond(porto, request!, {
        result: hash,
      })
    },
  })

  if (approval)
    return (
      <Approve
        amount={approval.amount}
        chain={chain}
        fees={feeTotals}
        isLoading={prepareCallsQuery.isPending}
        isPending={respond.isPending}
        onApprove={() =>
          prepareCallsQuery.data && respond.mutate(prepareCallsQuery.data)
        }
        onReject={() => Actions.reject(porto, request)}
        spender={approval.spender}
        tokenAddress={approval.tokenAddress}
      />
    )

  return (
    <ActionRequest
      address={from}
      calls={calls}
      chainId={chainId}
      feeToken={feeToken}
      loading={respond.isPending}
      merchantRpcUrl={merchantRpcUrl}
      onApprove={(data) => respond.mutate(data)}
      onReject={() => Actions.reject(porto, request)}
    />
  )
}
