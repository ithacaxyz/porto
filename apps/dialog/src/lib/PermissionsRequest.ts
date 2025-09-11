import { Query } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import * as PermissionsRequest from 'porto/core/internal/permissionsRequest.js'
import { Hooks } from 'porto/remote'
import { Key } from 'porto/viem'
import * as z from 'zod/mini'
import { porto } from './Porto.js'
import * as Tokens from './Tokens.js'

export function useResolve(
  request: z.input<typeof PermissionsRequest.Schema> | undefined,
) {
  const client = Hooks.useRelayClient(porto)

  return useQuery({
    enabled: !!request,
    initialData: request
      ? {
          ...z.decode(PermissionsRequest.Schema, request),
          _encoded: request,
        }
      : undefined,
    async queryFn() {
      if (!request) throw new Error('no request found.')

      const grantPermissions = z.decode(PermissionsRequest.Schema, request)

      const feeTokens = await Query.client.ensureQueryData(
        Tokens.getTokens.queryOptions(client, {}),
      )
      const permissions = Key.resolvePermissions(grantPermissions, {
        feeTokens,
      })
      const decoded = {
        ...grantPermissions,
        feeToken: null,
        permissions,
      }
      const _encoded = z.encode(PermissionsRequest.Schema, decoded)
      return {
        ...decoded,
        _encoded,
      }
    },
    queryKey: ['permissionsRequest', client.uid, request],
  })
}

export declare namespace useFetch {
  export type Parameters = Tokens.getTokens.queryOptions.Options
}
