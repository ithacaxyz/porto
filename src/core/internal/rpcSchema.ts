import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as RpcSchema from 'ox/RpcSchema'
import type * as Key from './key.js'
import type { OneOf } from './types.js'

export type Schema = RpcSchema.From<
  | RpcSchema.Default
  | {
      Request: {
        method: 'porto_ping'
      }
      ReturnType: string
    }
  | {
      Request: {
        method: 'experimental_authorizeKey'
        params: [AuthorizeKeyParameters]
      }
      ReturnType: AuthorizeKeyReturnType
    }
  | {
      Request: {
        method: 'experimental_createAccount'
        params?: [CreateAccountParameters] | undefined
      }
      ReturnType: CreateAccountReturnType
    }
  | {
      Request: {
        method: 'experimental_prepareCreateAccount'
        params: [PrepareCreateAccountParameters]
      }
      ReturnType: PrepareCreateAccountReturnType
    }
  | {
      Request: {
        method: 'experimental_keys'
        params?: [GetKeysParameters] | undefined
      }
      ReturnType: GetKeysReturnType
    }
  | {
      Request: {
        method: 'experimental_revokeKey'
        params: [RevokeKeyParameters]
      }
      ReturnType: undefined
    }
  | {
      Request: {
        method: 'wallet_connect'
        params?: [ConnectParameters] | undefined
      }
      ReturnType: ConnectReturnType
    }
  | {
      Request: {
        method: 'wallet_disconnect'
      }
      ReturnType: undefined
    }
>

export type AuthorizeKeyParameters = {
  address?: Address.Address | undefined
  key?:
    | OneOf<
        | {
            callScopes: Key.Rpc['callScopes']
            expiry?: Key.Rpc['expiry'] | undefined
          }
        | {
            callScopes: Key.Rpc['callScopes']
            expiry?: Key.Rpc['expiry'] | undefined
            publicKey: Key.Rpc['publicKey']
            role?: 'session' | undefined
            type: Key.Rpc['type']
          }
        | {
            callScopes?: Key.Rpc['callScopes'] | undefined
            expiry?: Key.Rpc['expiry'] | undefined
            publicKey: Key.Rpc['publicKey']
            role: 'admin'
            type: Key.Rpc['type']
          }
      >
    | undefined
}

export type AuthorizeKeyReturnType = GetKeysReturnType[number]

export type ConnectParameters = {
  capabilities?:
    | {
        authorizeKey?: AuthorizeKeyParameters['key'] | undefined
        createAccount?: boolean | CreateAccountParameters | undefined
      }
    | undefined
}

export type ConnectReturnType = {
  accounts: readonly {
    address: Address.Address
    capabilities?:
      | {
          keys?: GetKeysReturnType | undefined
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
        keys?: GetKeysReturnType | undefined
      }
    | undefined
}

export type GetKeysParameters = {
  address?: Address.Address | undefined
}

export type GetKeysReturnType = readonly Key.Rpc[]

export type PrepareCreateAccountParameters = {
  address: Address.Address
  capabilities?:
    | {
        authorizeKey?: AuthorizeKeyParameters['key'] | undefined
      }
    | undefined
  label?: string | undefined
}

export type PrepareCreateAccountReturnType = {
  context: unknown
  signPayloads: readonly Hex.Hex[]
}

export type RevokeKeyParameters = {
  address?: Address.Address | undefined
  publicKey: Hex.Hex
}
