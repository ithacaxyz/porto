import { createFileRoute } from '@tanstack/react-router'
import { Hex, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'

import { ActionRequest } from '../-components/ActionRequest'

export const Route = createFileRoute('/dialog/wallet_sendCalls')({
  component: RouteComponent,
  validateSearch(
    search,
  ): RpcSchema.ExtractParams<porto_RpcSchema.Schema, 'wallet_sendCalls'> {
    return search as never
  },
})

function RouteComponent() {
  const { 0: parameters } = Route.useSearch() ?? {}
  const { calls, chainId } = parameters

  return (
    <ActionRequest
      calls={calls}
      chainId={chainId ? Hex.toNumber(chainId) : undefined}
    />
  )
}
