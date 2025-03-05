import { Hooks } from 'porto/wagmi'
import { useAccount, useConnectors } from 'wagmi'

import { Button } from './Button'

export function Connect(props: Connect.Props) {
  const { variant = 'default' } = props

  const account = useAccount()
  const connect = Hooks.useConnect()
  const disconnect = Hooks.useDisconnect()
  const connectors = useConnectors()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )

  const size = variant === 'topnav' ? 'small' : 'default'

  if (account.address)
    return (
      <div className="flex items-center gap-2">
        <Button disabled size={size}>
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </Button>
        <Button
          size={size}
          variant="destructive"
          onClick={() => disconnect.mutate({})}
        >
          Sign out
        </Button>
      </div>
    )
  if (connect.isPending)
    return (
      <Button disabled size={size}>
        Check prompt
      </Button>
    )
  if (!connector) return null
  return (
    <Button
      onClick={() => connect.mutate({ connector: connector! })}
      size={size}
      variant={variant === 'topnav' ? 'accentTint' : 'accent'}
    >
      Sign in
    </Button>
  )
}

export namespace Connect {
  export interface Props {
    variant?: 'default' | 'topnav'
  }
}
