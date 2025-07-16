import { Query } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import * as Schema from 'effect/Schema'
import * as PermissionsRequest from 'porto/core/internal/permissionsRequest.js'
import { Hooks } from 'porto/remote'
import * as FeeTokens from './FeeTokens.js'
import { porto } from './Porto.js'

export function useResolve(
  request: typeof PermissionsRequest.Schema.Encoded | undefined,
) {
  const client = Hooks.useServerClient(porto)

  return useQuery({
    enabled: !!request,
    initialData: request
      ? {
          ...Schema.decodeSync(PermissionsRequest.Schema)(request),
          _encoded: request,
        }
      : undefined,
    async queryFn() {
      if (!request) throw new Error('no request found.')

      const grantPermissions = Schema.decodeSync(PermissionsRequest.Schema)(
        request,
      )

      const feeTokens = await Query.client.ensureQueryData(
        FeeTokens.fetch.queryOptions(client),
      )
      const permissions = PermissionsRequest.resolvePermissions(
        grantPermissions,
        {
          feeTokens,
        },
      )
      const decoded = {
        ...grantPermissions,
        feeLimit: undefined,
        permissions,
      }
      const _encoded = Schema.encodeSync(PermissionsRequest.Schema)(decoded)
      return {
        ...decoded,
        _encoded,
      }
    },
    queryKey: ['permissionsRequest', client.uid, request],
  })
}

export declare namespace useFetch {
  export type Parameters = FeeTokens.fetch.queryOptions.Parameters & {
    enabled?: boolean | undefined
  }
}
