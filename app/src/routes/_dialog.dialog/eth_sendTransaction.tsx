import { createFileRoute } from '@tanstack/react-router'
import { Hex, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'

import { TransactionRequest } from './-components/TransactionRequest'

export const Route = createFileRoute('/_dialog/dialog/eth_sendTransaction')({
  component: RouteComponent,
  validateSearch(
    search,
  ): RpcSchema.ExtractParams<porto_RpcSchema.Schema, 'eth_sendTransaction'> {
    return search as never
  },
})

function RouteComponent() {
  const { 0: parameters } = Route.useSearch() ?? {}
  const { chainId, data, to, value } = parameters

  return (
    <TransactionRequest
      calls={[{ data, to: to!, value }]}
      chainId={chainId ? Hex.toNumber(chainId) : undefined}
    />
  )
}
