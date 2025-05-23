import { Button } from '@porto/apps/components'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function SignInButton() {
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
