import { Address, Secp256k1 } from 'ox'
import { type Client, parseEther } from 'viem'
import { setBalance } from 'viem/actions'
import * as Account from '../../src/core/internal/account.js'
import * as Key from '../../src/core/internal/key.js'

export async function getAccount(
  client: Client,
  parameters: {
    delegation: Address.Address
  },
) {
  const { delegation } = parameters

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

  const account = Account.from({
    address,
    delegation,
    keys: [key],
  })

  return {
    account,
    privateKey,
  }
}
