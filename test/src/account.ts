import { Address, Secp256k1 } from 'ox'
import { type Client, parseEther } from 'viem'
import { setBalance } from 'viem/actions'
import * as DelegatedAccount from '../../src/core/internal/delegatedAccount.js'
import * as Key from '../../src/core/internal/key.js'

export async function getAccount(
  client: Client,
  parameters: {
    delegation: Address.Address
    keys?: readonly Key.Key[] | undefined
  },
) {
  const { delegation, keys } = parameters

  const privateKey = Secp256k1.randomPrivateKey()
  const address = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))

  await setBalance(client as any, {
    address,
    value: parseEther('10000'),
  })

  const key = Key.fromSecp256k1({
    privateKey,
    role: 'owner',
  })

  const account = DelegatedAccount.from({
    address,
    delegation,
    keys: [key, ...(keys ?? [])],
  })

  return {
    account,
    privateKey,
  }
}
