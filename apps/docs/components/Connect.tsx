import { useCopyToClipboard } from '@porto/apps/hooks'
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi'
import LucideCheck from '~icons/lucide/check'
import { Button } from './Button'

export function Connect(props: Connect.Props) {
  const { variant = 'default', signInText = 'Sign in' } = props

  const account = useAccount()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const connectors = useConnectors()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )

  const size = variant === 'topnav' ? 'small' : 'default'

  const [copied, copyToClipboard] = useCopyToClipboard({
    timeout: 2_000,
  })

  if (account.address)
    return (
      <div className="flex items-center gap-2">
        {variant !== 'topnav' && (
          <Button onClick={() => copyToClipboard(account.address!)} size={size}>
            {copied && (
              <div className="absolute inset-0 flex items-center justify-center gap-1.5">
                <LucideCheck />
                Copied
              </div>
            )}
            <div className={copied ? 'invisible' : undefined}>
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </div>
          </Button>
        )}
        <Button
          onClick={() => disconnect.disconnect({})}
          size={size}
          variant="destructive"
        >
          Sign out
        </Button>
      </div>
    )
  if (connect.isPending)
    return (
      <div>
        <Button disabled size={size}>
          Check prompt
        </Button>
      </div>
    )
  if (!connector) return null
  return (
    <div>
      <Button
        onClick={() => connect.connect({ connector: connector! })}
        size={size}
        variant={variant === 'topnav' ? 'accentTint' : 'accent'}
      >
        {signInText}
      </Button>
    </div>
  )
}

export namespace Connect {
  export interface Props {
    signInText?: string
    variant?: 'default' | 'topnav'
  }
}
