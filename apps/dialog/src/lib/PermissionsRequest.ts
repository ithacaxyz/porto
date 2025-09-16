import { Query } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import * as PermissionsRequest from 'porto/core/internal/permissionsRequest.js'
import { Hooks } from 'porto/remote'
import { Key, MerchantClient } from 'porto/viem'
import * as z from 'zod/mini'
import { porto } from './Porto.js'
import * as Tokens from './Tokens.js'

export function useResolve(
  request: z.input<typeof PermissionsRequest.Schema> | undefined,
  options: useResolve.Options = {},
) {
  const { merchantUrl } = options

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

      const [permissionsRequest, feeTokens] = await Promise.all([
        (async () => {
          const permissions = z.decode(PermissionsRequest.Schema, request)
          if (permissions.key?.publicKey === '0x' && merchantUrl) {
            const client = MerchantClient.fromUrl(merchantUrl)
            const [key] = await client.request({
              method: 'merchant_getKeys',
              params: [{ address: permissions.address }],
            })
            if (key) {
              return {
                ...permissions,
                key: {
                  publicKey: key.publicKey,
                  type: key.type,
                },
              }
            }
          }
          return permissions
        })(),
        Query.client.ensureQueryData(Tokens.getTokens.queryOptions(client, {})),
      ])

      const permissions = Key.resolvePermissions(permissionsRequest, {
        feeTokens,
      })

      const decoded = {
        ...permissionsRequest,
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

export declare namespace useResolve {
  export type Options = {
    merchantUrl?: string | undefined
  }
}
