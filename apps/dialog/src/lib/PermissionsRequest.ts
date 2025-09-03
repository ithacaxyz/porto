import { Query } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import * as PermissionsRequest from 'porto/core/internal/permissionsRequest.js'
import * as Schema from 'porto/core/internal/schema/schema.js'
import { Hooks } from 'porto/remote'
import { porto } from './Porto.js'
import * as Tokens from './Tokens.js'

export function useResolve(
  request: typeof PermissionsRequest.Schema.Encoded | undefined,
) {
  const client = Hooks.useRelayClient(porto)

  return useQuery({
    enabled: !!request,
    async queryFn() {
      if (!request) throw new Error('no request found.')

      const grantPermissions = Schema.decodeSync(PermissionsRequest.Schema)(
        request,
      )

      const feeTokens = await Query.client.ensureQueryData(
        Tokens.resolveFeeTokens.queryOptions(client),
      )
      const permissions = PermissionsRequest.resolvePermissions(
        grantPermissions,
        {
          feeTokens,
        },
      )
      const decoded: typeof PermissionsRequest.Schema.Type = {
        ...grantPermissions,
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
  export type Parameters = Tokens.resolveFeeTokens.queryOptions.Options
}
