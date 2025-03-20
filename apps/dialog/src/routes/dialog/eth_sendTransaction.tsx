import { createFileRoute } from '@tanstack/react-router'
import { Hex, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'

import { ActionRequest } from '../-components/ActionRequest'

export const Route = createFileRoute('/dialog/eth_sendTransaction')({
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
    <ActionRequest
      calls={[{ data, to: to!, value }]}
      chainId={chainId ? Hex.toNumber(chainId) : undefined}
    />
  )
}
