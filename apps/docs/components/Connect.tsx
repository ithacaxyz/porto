import { Env } from '@porto/apps'
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useDisconnect,
} from 'wagmi'
import LucideWallet from '~icons/lucide/wallet'
import { Button } from './Button'
import { permissions } from './constants'

const idOrigin = import.meta.env.DEV
  ? `https://${Env.get()}.localhost:5174`
  : 'https://id.porto.sh'

export function Connect(props: Connect.Props) {
  const { variant = 'default', signInText = 'Sign in' } = props

  const account = useAccount()
  const connect = useConnect()
  const chainId = useChainId()
  const disconnect = useDisconnect()
  const connectors = useConnectors()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )

  const size = variant === 'topnav' ? 'small' : 'default'

  if (account.address)
    return (
      <div className="flex items-center gap-2">
        <Button
          className="gap-2"
          render={
            // biome-ignore lint/a11y/useAnchorContent: _
            <a href={idOrigin} rel="noreferrer" target="_blank" />
          }
          size={size}
        >
          <LucideWallet className="text-gray10" /> Porto ID
        </Button>
        <Button
          onClick={() => disconnect.disconnect()}
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
        onClick={() =>
          connect.connect({
            capabilities: {
              grantPermissions: permissions(chainId),
            },
            connector: connector!,
          })
        }
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
