import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi'
import { Button } from '../Button'
import { permissions } from '../constants'

export function SignInButton() {
  const chainId = useChainId()
  const { connectors, connect } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )!

  return (
    <Button
      onClick={async () => {
        await disconnectAsync()
        connect({
          capabilities: {
            grantPermissions: permissions(chainId),
          },
          connector,
        })
      }}
      type="button"
      variant="accent"
    >
      Sign in
    </Button>
  )
}

export function Account() {
  const account = useAccount()
  const disconnect = useDisconnect()

  const address =
    account.address ?? '0xdead00000000000000000000000000000000beef'

  return (
    <div className="flex items-center gap-2">
      <div>
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
      <Button onClick={() => disconnect.disconnect({})} variant="destructive">
        Sign out
      </Button>
    </div>
  )
}

export function Example() {
  const account = useAccount()
  if (account.address) return <Account />
  return <SignInButton />
}
