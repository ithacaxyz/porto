import type { Client, PrivateKeyAccount } from 'viem'
import * as Typebox from '../core/internal/typebox/typebox.js'
import * as RpcSchema from '../core/RpcSchema.js'
import type * as Account from './Account.js'
import type * as RpcSchema_viem from './RpcSchema.js'

export async function connect(
  client: Client,
  parameters: connect.Parameters = {},
): Promise<connect.ReturnType> {
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_connect' }>
  >({
    method: 'wallet_connect',
    params: [
      {
        capabilities: Typebox.Encode(
          RpcSchema.wallet_connect.Capabilities,
          parameters satisfies RpcSchema.wallet_connect.Capabilities,
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
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_disconnect' }>
  >({
    method: 'wallet_disconnect',
  })
}

export async function getAdmins(
  client: Client,
  parameters: getAdmins.Parameters = {},
): Promise<getAdmins.ReturnType> {
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_getAdmins' }>
  >({
    method: 'wallet_getAdmins',
    params: [
      Typebox.Encode(
        RpcSchema.wallet_getAdmins.Parameters,
        parameters satisfies RpcSchema.wallet_getAdmins.Parameters,
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
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_getPermissions' }>
  >({
    method: 'wallet_getPermissions',
    params: [
      Typebox.Encode(
        RpcSchema.wallet_getPermissions.Parameters,
        parameters satisfies RpcSchema.wallet_getPermissions.Parameters,
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
  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_grantAdmin' }>
  >({
    method: 'wallet_grantAdmin',
    params: [
      Typebox.Encode(
        RpcSchema.wallet_grantAdmin.Parameters,
        parameters satisfies RpcSchema.wallet_grantAdmin.Parameters,
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
  const response = await client.request<
    Extract<
      RpcSchema_viem.Wallet[number],
      { Method: 'wallet_grantPermissions' }
    >
  >({
    method: 'wallet_grantPermissions',
    params: [
      Typebox.Encode(
        RpcSchema.wallet_grantPermissions.Parameters,
        parameters satisfies RpcSchema.wallet_grantPermissions.Parameters,
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
  await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_revokeAdmin' }>
  >({
    method: 'wallet_revokeAdmin',
    params: [
      Typebox.Encode(
        RpcSchema.wallet_revokeAdmin.Parameters,
        parameters satisfies RpcSchema.wallet_revokeAdmin.Parameters,
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
  await client.request<
    Extract<
      RpcSchema_viem.Wallet[number],
      { Method: 'wallet_revokePermissions' }
    >
  >({
    method: 'wallet_revokePermissions',
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

  const { context, signPayloads } = await client.request<
    Extract<
      RpcSchema_viem.Wallet[number],
      { Method: 'wallet_prepareUpgradeAccount' }
    >
  >({
    method: 'wallet_prepareUpgradeAccount',
    params: [
      Typebox.Encode(RpcSchema.wallet_prepareUpgradeAccount.Parameters, {
        address: account.address,
        capabilities,
        chainId,
      } satisfies RpcSchema.wallet_prepareUpgradeAccount.Parameters),
    ],
  })

  const signatures = await Promise.all(
    signPayloads.map((hash) => account.sign({ hash })),
  )

  const response = await client.request<
    Extract<RpcSchema_viem.Wallet[number], { Method: 'wallet_upgradeAccount' }>
  >({
    method: 'wallet_upgradeAccount',
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
