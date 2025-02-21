import { type Hex, Secp256k1 } from 'ox'
import { type Client, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  setBalance,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'

import * as Account from '../../src/core/internal/account.js'
import * as Key from '../../src/core/internal/key.js'
import * as Action from '../../src/core/internal/relay/action.js'
import { ExperimentERC20 } from './contracts.js'

export async function getAccount(
  client: Client,
  parameters: {
    keys?: readonly Key.Key[] | undefined
    setBalance?: false | bigint | undefined
  } = {},
) {
  const { keys, setBalance: balance = parseEther('10000') } = parameters

  const anvil = client.chain?.rpcUrls.default.http[0]!.includes('127.0.0.1')

  const privateKey = Secp256k1.randomPrivateKey()
  const account = Account.fromPrivateKey(privateKey, { keys })

  if (balance) {
    if (anvil) {
      await setBalance(client as any, {
        address: account.address,
        value: balance,
      })
      await writeContract(client, {
        account: privateKeyToAccount(privateKey),
        chain: null,
        address: ExperimentERC20.address[0],
        abi: ExperimentERC20.abi,
        functionName: 'mint',
        args: [account.address, balance],
      })
    } else {
      const key = Key.fromP256({
        privateKey: process.env.VITE_P256_PRIVATE_KEY as Hex.Hex,
        role: 'admin',
      })
      const account_ = Account.from({
        address: process.env.VITE_EOA_ADDRESS as Hex.Hex,
        keys: [key],
      })

      const hash = await Action.send(client, {
        account: account_,
        calls: [
          {
            to: ExperimentERC20.address[0],
            abi: ExperimentERC20.abi,
            functionName: 'mint',
            args: [account.address, balance],
          },
        ],
        gasToken: ExperimentERC20.address[0],
      })

      await waitForTransactionReceipt(client, { hash })
    }
  }

  return {
    account,
    privateKey,
  }
}
