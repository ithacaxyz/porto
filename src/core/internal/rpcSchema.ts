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
      ReturnType: Address.Address
    }
  | {
      Request: {
        method: 'experimental_importAccount'
        params: [ImportAccountParameters]
      }
      ReturnType: ImportAccountReturnType
    }
  | {
      Request: {
        method: 'experimental_prepareImportAccount'
        params: [PrepareImportAccountParameters]
      }
      ReturnType: PrepareImportAccountReturnType
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
            callScopes: Key.CallScopes
            expiry?: number | undefined
          }
        | {
            callScopes: Key.CallScopes
            expiry?: number | undefined
            publicKey: Hex.Hex
            role?: 'session' | undefined
            type: 'p256' | 'secp256k1' | 'webauthn-p256'
          }
        | {
            callScopes?: Key.CallScopes | undefined
            expiry?: number | undefined
            publicKey: Hex.Hex
            role: 'admin'
            type: 'p256' | 'secp256k1' | 'webauthn-p256'
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
  label?: string | undefined
}

export type GetKeysParameters = {
  address?: Address.Address | undefined
}

export type GetKeysReturnType = readonly {
  callScopes?: Key.CallScopes | undefined
  expiry: number
  publicKey: Hex.Hex
  role: 'admin' | 'session'
  type: 'p256' | 'secp256k1' | 'webauthn-p256'
}[]

export type ImportAccountParameters = {
  context: unknown
  signatures: readonly Hex.Hex[]
}

export type ImportAccountReturnType = {
  address: Address.Address
  capabilities?:
    | {
        keys?: GetKeysReturnType | undefined
      }
    | undefined
}

export type PrepareImportAccountParameters = {
  address: Address.Address
  capabilities?:
    | {
        authorizeKey?: AuthorizeKeyParameters['key'] | undefined
      }
    | undefined
  label?: string | undefined
}

export type PrepareImportAccountReturnType = {
  context: unknown
  signPayloads: readonly Hex.Hex[]
}
