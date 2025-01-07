import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as RpcSchema from 'ox/RpcSchema'
import type { Authorization } from 'viem/experimental'

import type * as Account from './account.js'
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
        params?: [AuthorizeKeyParameters] | undefined
      }
      ReturnType: AuthorizeKeyReturnType
    }
  | {
      Request: {
        method: 'experimental_connect'
        params?: [ConnectParameters] | undefined
      }
      ReturnType: ConnectReturnType
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
        method: 'experimental_disconnect'
      }
      ReturnType: undefined
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
>

export type AuthorizeKeyParameters = {
  address?: Address.Address | undefined
  key?:
    | OneOf<
        | {
            expiry?: number | undefined
          }
        | {
            expiry?: number | undefined
            publicKey: Hex.Hex
            role: 'admin' | 'session'
            type: 'p256' | 'secp256k1' | 'webcrypto-p256' | 'webauthn-p256'
          }
      >
    | undefined
}

export type AuthorizeKeyReturnType = {
  expiry: number
  publicKey: Hex.Hex
  role: 'admin' | 'session'
  type: 'p256' | 'secp256k1' | 'webcrypto-p256' | 'webauthn-p256'
}

export type ConnectParameters = {
  capabilities?:
    | {
        authorizeKey?:
          | boolean
          | Omit<AuthorizeKeyParameters, 'address'>
          | undefined
        createAccount?: boolean | CreateAccountParameters | undefined
      }
    | undefined
}

export type ConnectReturnType = readonly {
  address: Address.Address
  capabilities?:
    | {
        keys?: GetKeysReturnType | undefined
      }
    | undefined
}[]

export type CreateAccountParameters = {
  chainId?: Hex.Hex | undefined
  label?: string | undefined
}

export type GetKeysParameters = {
  address?: Address.Address | undefined
}

export type GetKeysReturnType = readonly AuthorizeKeyReturnType[]

export type ImportAccountParameters = {
  context: PrepareImportAccountReturnType['context']
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
        authorizeKey?:
          | boolean
          | Omit<AuthorizeKeyParameters, 'address'>
          | undefined
      }
    | undefined
  label?: string | undefined
}

export type PrepareImportAccountReturnType = {
  context: {
    account: Account.Account
    authorization: Authorization
  }
  signPayloads: readonly Hex.Hex[]
}
