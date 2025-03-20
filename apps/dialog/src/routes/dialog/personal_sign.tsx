import { createFileRoute } from '@tanstack/react-router'
import { Hex, type RpcSchema, Siwe } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { useMemo } from 'react'

import { SignMessage } from '../-components/SignMessage'

export const Route = createFileRoute('/dialog/personal_sign')({
  component: RouteComponent,
  validateSearch(
    search,
  ): RpcSchema.ExtractParams<porto_RpcSchema.Schema, 'personal_sign'> {
    return search as never
  },
})

function RouteComponent() {
  const { 0: hex } = Route.useSearch() ?? {}
  const message = useMemo(() => Hex.toString(hex), [hex])
  const siwe = useMemo(() => Siwe.parseMessage(message), [message])
  if (Object.keys(siwe).length > 0) return <SignMessage.Siwe />
  return <SignMessage message={message} />
}
