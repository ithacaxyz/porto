import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as Permissions from './permissions.js'
import type * as PermissionsRequest from './permissionsRequest.js'
import type { OneOf } from './types.js'

export type GrantPermissionsParameters = PermissionsRequest.PermissionsRequest

export type GrantPermissionsReturnType = Permissions.Permissions

export type ConnectParameters = {
  capabilities?:
    | {
        createAccount?: boolean | CreateAccountParameters | undefined
        grantPermissions?: GrantPermissionsParameters | undefined
      }
    | undefined
}

export type ConnectReturnType = {
  accounts: readonly {
    address: Address.Address
    capabilities?:
      | {
          permissions?: PermissionsReturnType | undefined
        }
      | undefined
  }[]
}

export type CreateAccountParameters = {
  chainId?: Hex.Hex | undefined
} & OneOf<
  | {
      label?: string | undefined
    }
  | {
      context: unknown
      signatures: readonly Hex.Hex[]
    }
>

export type CreateAccountReturnType = {
  address: Address.Address
  capabilities?:
    | {
        permissions?: PermissionsReturnType | undefined
      }
    | undefined
}

export type PermissionsParameters = {
  address?: Address.Address | undefined
}

export type PermissionsReturnType = readonly (Permissions.Permissions & {
  chainId?: Hex.Hex | undefined
})[]

export type PrepareCreateAccountParameters = {
  address: Address.Address
  chainId?: Hex.Hex | undefined
  capabilities?:
    | {
        grantPermissions?: GrantPermissionsParameters | undefined
      }
    | undefined
  label?: string | undefined
}

export type PrepareCreateAccountReturnType = {
  context: unknown
  signPayloads: readonly Hex.Hex[]
}

export type RevokePermissionsParameters = {
  address?: Address.Address | undefined
  id: Hex.Hex
}

export type WalletPrepareCallsParameters = {
  version?: string | undefined
  chainId: Hex.Hex
  from?: Address.Address | undefined
  calls: readonly {
    to: Address.Address
    data?: Hex.Hex | undefined
    value?: Hex.Hex | undefined
    capabilities?: Record<string, any> | undefined
  }[]
  capabilities?: Record<string, any> | undefined
}

export type WalletPrepareCallsReturnType = {
  capabilities?: Record<string, any>
  chainId?: Hex.Hex | undefined
  context: unknown
  digest: Hex.Hex
  version?: string | undefined
}

export type WalletSendPreparedCallsParameters = Omit<
  WalletPrepareCallsReturnType,
  'digest'
> & {
  signature: {
    publicKey: Hex.Hex
    type: string
    value: Hex.Hex
  }
}

export type WalletSendPreparedCallsReturnType = {
  id: string
  capabilities?: Record<string, any>
}[]
