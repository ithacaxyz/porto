import type { Porto } from 'porto'
import { hashMessage } from 'viem'
import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi'
import { Button } from '../Button'
import { Account } from './ConnectAccounts'

export function Example() {
  const account = useAccount()
  if (account.address) return <Account />
  return <SignInButton />
}

function SignInButton() {
  const chainId = useChainId()
  const { connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )!

  return (
    <Button
      onClick={async () => {
        await disconnectAsync()
        const provider = (await connector.getProvider({
          chainId,
        })) as Porto.Porto['provider']
        // TODO: Add [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) support to Wagmi `useConnect`/`connect`/`connector.connect` return type
        const res = await provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                signInWithEthereum: {
                  chainId,
                  nonce: '0xdeadbeef',
                },
              },
            },
          ],
        })
        const address = res.accounts.at(0)?.address!
        const siwe = res.accounts.at(0)?.capabilities?.signInWithEthereum!
        // TODO: Add hook for `wallet_verifySignature`
        const { valid } = await provider.request({
          method: 'wallet_verifySignature',
          params: [
            {
              address,
              digest: hashMessage(siwe.message),
              signature: siwe.signature,
            },
          ],
        })
        if (!valid) await disconnectAsync()
      }}
      type="button"
      variant="accent"
    >
      Sign in with Ethereum
    </Button>
  )
}
