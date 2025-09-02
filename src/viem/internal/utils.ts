import type { Address, Chain } from 'viem'
import type { IsUndefined, MaybeRequired } from '../../core/internal/types.js'
import type { Account } from '../Account.js'

export type GetAccountParameter<
  account extends Account | undefined = Account | undefined,
  required extends boolean = true,
  nullish extends boolean = false,
> = MaybeRequired<
  {
    account?:
      | Account
      | Address
      | (nullish extends true ? null : never)
      | undefined
  },
  IsUndefined<account> extends true
    ? required extends true
      ? true
      : false
    : false
>

export type GetChainParameter<chain extends Chain | undefined> =
  IsUndefined<chain> extends true
    ? { chain: { id: number } }
    : { chain?: { id: number } | undefined }
