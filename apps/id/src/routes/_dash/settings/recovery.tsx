import * as Ariakit from '@ariakit/react'
import { Toast } from '@porto/apps/components'
import {
  CatchBoundary,
  createFileRoute,
  Link,
  useRouteContext,
} from '@tanstack/react-router'
import { Chains } from 'porto'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { baseSepolia } from 'viem/chains'
import {
  type Connector,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { useRouterEvent } from '~/hooks/useRouterEvents'
import { config, mipdConfig, useChainsStore } from '~/lib/Wagmi'

export const Route = createFileRoute('/_dash/settings/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = useRouteContext({
    from: '/_dash/settings/recovery',
  })
  const [_view, setView] = React.useState<'default' | 'success' | 'loading'>(
    'default',
  )

  const chainStore = useChainsStore()
  const testnet = window.location.search.includes('testnet')
  const chainId = testnet ? baseSepolia.id : (account.chainId as never)

  useRouterEvent('onBeforeNavigate', (event) => {
    if (event.hrefChanged && event.fromLocation)
      chainStore.setChains(config.chains as never)
  })

  useRouterEvent('onResolved', () => {
    disconnectAll()
    chainStore.setChains(testnet ? [Chains.baseSepolia] : [Chains.base])
  })

  const connect = useConnect({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })
  const switchChain = useSwitchChain({ config: mipdConfig })
  const connectors = useConnectors({ config: mipdConfig }).filter(
    (c) => !c.id.toLowerCase().includes('porto'),
  )

  const grantAdmin = Hooks.useGrantAdmin()
  const { data: admins } = Hooks.useAdmins({
    query: {
      select: (data) => ({
        ...data,
        keys: data.keys.filter((key) => key.type !== 'address'),
      }),
    },
  })

  async function tryConnect(connector: Connector) {
    try {
      const {
        accounts: [address],
      } = await connect.connectAsync({ chainId, connector })
      return address
    } catch {
      await disconnect.disconnectAsync()
      return undefined
    }
  }

  const disconnectAll = async () =>
    Promise.all([
      disconnect.disconnectAsync(),
      ...connectors.map((connector) => connector.disconnect()),
    ])

  const connectThenGrantAdmin = async (
    event: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      // 1. disconnect in case user is connected from previous sessions
      await disconnectAll()

      // 2. try to connect -- this could fail for a number of reasons:
      // - one of which is the user doesn't have the chain configured
      let address = await tryConnect(connector)
      if (!address) {
        await switchChain.switchChainAsync({
          chainId,
        })
        address = await tryConnect(connector)
      }

      if (!address) throw new Error('Failed to connect to wallet')

      const granted = await grantAdmin.mutateAsync({
        address: account.address,
        chainId,
        key: { publicKey: address, type: 'address' },
      })

      if (!granted) throw new Error('Failed to grant admin permissions')

      setView('success')
      await disconnectAll()
    } catch (error) {
      await disconnectAll()
      console.info(error)
      let message = 'Encountered an error while granting admin permissions.'
      if (
        error instanceof Error &&
        error.message.includes('Key already granted')
      ) {
        message = 'Key already granted as admin'
      }
      toast.custom((t) => (
        <Toast
          className={t}
          description={message}
          kind="warn"
          title="Did not go through"
        />
      ))
    } finally {
      await disconnectAll()
    }
  }

  if (!connectors.length) return <div>No wallets found</div>
  return (
    <CatchBoundary
      getResetKey={() => 'recovery'}
      onCatch={(error, errorInfo) => {
        console.error(error, errorInfo)
        disconnectAll()
      }}
    >
      <section className="flex flex-col gap-4">
        <h2>Add recovery wallet</h2>
        <p>
          If you lose access, recover your account with a wallet of your choice.
        </p>
        <section>
          <ol className="flex flex-col gap-3 py-2">
            {connectors.map((connector) => (
              <li key={connector.uid}>
                <Ariakit.Button
                  className="flex items-center gap-2"
                  onClick={async (event) =>
                    connectThenGrantAdmin(event, connector)
                  }
                >
                  <Ariakit.VisuallyHidden>
                    {connector.name}
                  </Ariakit.VisuallyHidden>
                  <img
                    alt={connector.name}
                    height={24}
                    src={connector.icon}
                    width={24}
                  />
                  {connector.name}
                </Ariakit.Button>
              </li>
            ))}
          </ol>
        </section>
        <Ariakit.Button
          onClick={() =>
            connectors.map((connector) => disconnect.disconnect({ connector }))
          }
          render={
            <Link className="" to="..">
              I'll do this later
            </Link>
          }
        />
        <pre>{JSON.stringify(admins, null, 2)}</pre>
      </section>
    </CatchBoundary>
  )
}
