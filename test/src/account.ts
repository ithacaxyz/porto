import { Secp256k1 } from 'ox'
import { type Client, parseEther } from 'viem'
import { setBalance } from 'viem/actions'

import * as Account from '../../src/core/internal/account.js'
import type * as Key from '../../src/core/internal/key.js'

export async function getAccount(
  client: Client,
  parameters: {
    keys?: readonly Key.Key[] | undefined
  } = {},
) {
  const { keys } = parameters

  const privateKey = Secp256k1.randomPrivateKey()
  const account = Account.fromPrivateKey(privateKey, { keys })

  await setBalance(client as any, {
    address: account.address,
    value: parseEther('10000'),
  })

  return {
    account,
    privateKey,
  }
}
