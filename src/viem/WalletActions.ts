/**
 * Porto Wallet Actions.
 *
 * Note: These Actions will eventually be upstreamed into `viem` once an
 * API is solidified & stable.
 */

import type { Client, PrivateKeyAccount } from 'viem'
import * as Typebox from '../core/internal/typebox/typebox.js'
import * as RpcSchema from '../core/RpcSchema.js'
import type * as Account from './Account.js'
import type * as RpcSchema_viem from './RpcSchema.js'

export async function connect(
  client: Client,
  parameters: connect.Parameters = {},
): Promise<connect.ReturnType> {
  const method = 'wallet_connect' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      {
        capabilities: Typebox.Encode(
          RpcSchema.wallet_connect.Capabilities,
          Typebox.Clean(
            RpcSchema.wallet_connect.Capabilities,
            parameters satisfies RpcSchema.wallet_connect.Capabilities,
          ),
        ),
      },
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_connect.Response,
    response satisfies Typebox.Static<typeof RpcSchema.wallet_connect.Response>,
  )
}

export declare namespace connect {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_connect.Capabilities
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_connect.Response
  >
}

export async function disconnect(client: Client) {
  const method = 'wallet_disconnect' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
  })
}

export async function getAdmins(
  client: Client,
  parameters: getAdmins.Parameters = {},
): Promise<getAdmins.ReturnType> {
  const method = 'wallet_getAdmins' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_getAdmins.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_getAdmins.Parameters,
          parameters satisfies RpcSchema.wallet_getAdmins.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_getAdmins.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_getAdmins.Response
    >,
  )
}

export declare namespace getAdmins {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getAdmins.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getAdmins.Response
  >
}

export async function getPermissions(
  client: Client,
  parameters: getPermissions.Parameters = {},
): Promise<getPermissions.ReturnType> {
  const method = 'wallet_getPermissions' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_getPermissions.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_getPermissions.Parameters,
          parameters satisfies RpcSchema.wallet_getPermissions.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_getPermissions.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_getPermissions.Response
    >,
  )
}

export declare namespace getPermissions {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getPermissions.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_getPermissions.Response
  >
}

export async function grantAdmin(
  client: Client,
  parameters: grantAdmin.Parameters,
): Promise<grantAdmin.ReturnType> {
  const method = 'wallet_grantAdmin' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_grantAdmin.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_grantAdmin.Parameters,
          parameters satisfies RpcSchema.wallet_grantAdmin.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_grantAdmin.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_grantAdmin.Response
    >,
  )
}

export declare namespace grantAdmin {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantAdmin.Parameters.properties.capabilities
  > &
    Omit<
      Typebox.StaticDecode<typeof RpcSchema.wallet_grantAdmin.Parameters>,
      'capabilities'
    >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantAdmin.Response
  >
}

export async function grantPermissions(
  client: Client,
  parameters: grantPermissions.Parameters,
): Promise<grantPermissions.ReturnType> {
  const method = 'wallet_grantPermissions' as const
  type Method = typeof method
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_grantPermissions.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_grantPermissions.Parameters,
          parameters satisfies RpcSchema.wallet_grantPermissions.Parameters,
        ),
      ),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_grantPermissions.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_grantPermissions.Response
    >,
  )
}

export declare namespace grantPermissions {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantPermissions.Parameters
  >

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_grantPermissions.Response
  >
}

export async function revokeAdmin(
  client: Client,
  parameters: revokeAdmin.Parameters,
) {
  const method = 'wallet_revokeAdmin' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(
        RpcSchema.wallet_revokeAdmin.Parameters,
        Typebox.Clean(
          RpcSchema.wallet_revokeAdmin.Parameters,
          parameters satisfies RpcSchema.wallet_revokeAdmin.Parameters,
        ),
      ),
    ],
  })
  return undefined
}

export declare namespace revokeAdmin {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_revokeAdmin.Parameters
  >
}

export async function revokePermissions(
  client: Client,
  parameters: revokePermissions.Parameters,
) {
  const { address, id, ...capabilities } = parameters
  const method = 'wallet_revokePermissions' as const
  type Method = typeof method
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(RpcSchema.wallet_revokePermissions.Parameters, {
        address,
        capabilities,
        id,
      } satisfies RpcSchema.wallet_revokePermissions.Parameters),
    ],
  })
  return undefined
}

export declare namespace revokePermissions {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_revokePermissions.Parameters.properties.capabilities
  > &
    Omit<
      Typebox.StaticDecode<
        typeof RpcSchema.wallet_revokePermissions.Parameters
      >,
      'capabilities'
    >
}

export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
): Promise<upgradeAccount.ReturnType> {
  const { account, chainId, ...capabilities } = parameters

  const method = 'wallet_prepareUpgradeAccount' as const
  type Method = typeof method
  const { context, digests } = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method }>
  >({
    method,
    params: [
      Typebox.Encode(RpcSchema.wallet_prepareUpgradeAccount.Parameters, {
        address: account.address,
        capabilities,
        chainId,
      } satisfies RpcSchema.wallet_prepareUpgradeAccount.Parameters),
    ],
  })

  const signatures = {
    auth: await account.sign({ hash: digests.auth }),
    exec: await account.sign({ hash: digests.exec }),
  }

  const method_upgrade = 'wallet_upgradeAccount' as const
  type Method_upgrade = typeof method_upgrade
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: Method_upgrade }>
  >({
    method: method_upgrade,
    params: [
      Typebox.Encode(RpcSchema.wallet_upgradeAccount.Parameters, {
        context,
        signatures,
      } satisfies RpcSchema.wallet_upgradeAccount.Parameters),
    ],
  })

  return Typebox.Decode(
    RpcSchema.wallet_upgradeAccount.Response,
    response satisfies Typebox.Static<
      typeof RpcSchema.wallet_upgradeAccount.Response
    >,
  )
}

export declare namespace upgradeAccount {
  type Parameters = Typebox.StaticDecode<
    typeof RpcSchema.wallet_prepareUpgradeAccount.Parameters.properties.capabilities
  > &
    Omit<
      Typebox.StaticDecode<
        typeof RpcSchema.wallet_prepareUpgradeAccount.Parameters
      >,
      'address' | 'capabilities'
    > & {
      account: PrivateKeyAccount | Account.Account
    }

  type ReturnType = Typebox.StaticDecode<
    typeof RpcSchema.wallet_upgradeAccount.Response
  >
}
