import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as RpcSchema from 'ox/RpcSchema'
import type { Authorization } from 'viem/experimental'

import type * as AccountDelegation from './accountDelegation.js'

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
        method: 'experimental_grantSession'
        params?: [GrantSessionParameters] | undefined
      }
      ReturnType: GrantSessionReturnType
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
        method: 'experimental_sessions'
        params?: [GetSessionsParameters] | undefined
      }
      ReturnType: GetSessionsReturnType
    }
>

export type ConnectParameters = {
  capabilities?:
    | {
        createAccount?: boolean | CreateAccountParameters | undefined
        grantSession?:
          | boolean
          | Omit<GrantSessionParameters, 'address'>
          | undefined
      }
    | undefined
}

export type ConnectReturnType = readonly {
  address: Address.Address
  capabilities?:
    | {
        sessions?: GetSessionsReturnType | undefined
      }
    | undefined
}[]

export type CreateAccountParameters = {
  label?: string | undefined
}

export type GetSessionsParameters = {
  address?: Address.Address | undefined
}

export type GetSessionsReturnType = readonly GrantSessionReturnType[]

export type GrantSessionParameters = {
  address?: Address.Address | undefined
  expiry?: number | undefined
  keys?:
    | readonly {
        algorithm: 'p256' | 'secp256k1'
        publicKey: Hex.Hex
      }[]
    | undefined
}

export type GrantSessionReturnType = {
  expiry: number
  id: Hex.Hex
}

export type ImportAccountParameters = {
  context: PrepareImportAccountReturnType['context']
  signatures: readonly Hex.Hex[]
}

export type ImportAccountReturnType = {
  address: Address.Address
  capabilities?:
    | {
        sessions?: GetSessionsReturnType | undefined
      }
    | undefined
}

export type PrepareImportAccountParameters = {
  address: Address.Address
  capabilities?:
    | {
        grantSession?:
          | boolean
          | Omit<GrantSessionParameters, 'address'>
          | undefined
      }
    | undefined
  label?: string | undefined
}

export type PrepareImportAccountReturnType = {
  context: {
    account: AccountDelegation.Account
    authorization: Authorization
  }
  signPayloads: readonly Hex.Hex[]
}
