import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors } from 'wagmi'
import LucideCheck from '~icons/lucide/check'

import { Button } from './Button'

export function Connect(props: Connect.Props) {
  const { variant = 'default', signInText = 'Sign in' } = props

  const account = useAccount()
  const connect = Hooks.useConnect()
  const disconnect = Hooks.useDisconnect()
  const connectors = useConnectors()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )

  const size = variant === 'topnav' ? 'small' : 'default'

  const [copied, setCopied] = React.useState(false)
  const copyToClipboard = React.useCallback(() => {
    if (copied) return
    if (!account.address) return
    navigator.clipboard.writeText(account.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2_000)
  }, [account.address, copied])

  if (account.address)
    return (
      <div className="flex items-center gap-2">
        <Button onClick={() => copyToClipboard()} size={size}>
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
        onClick={() => connect.mutate({ connector: connector! })}
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
