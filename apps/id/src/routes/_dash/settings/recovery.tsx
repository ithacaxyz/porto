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
import {
  type Connector,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { useRouterEvent } from '~/hooks/useRouterEvents'
import {
  config,
  mipdConfig,
  useChainsStore,
  // config as wagmiConfig,
} from '~/lib/Wagmi'

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
  const chainId = testnet ? Chains.baseSepolia.id : Chains.base

  // useRouterEvent('onBeforeNavigate', (event) => {
  //   // if (event.hrefChanged && event.fromLocation)
  //   // wagmiConfig._internal.chains.setState()

  //   if (event.hrefChanged && event.fromLocation)
  //     chainStore.setChains(config.chains as never)
  // })

  useRouterEvent('onLoad', () => {
    chainStore.setChains([Chains.baseSepolia])
  })
  useRouterEvent('onRendered', () => {
    chainStore.setChains([Chains.baseSepolia])
  })
  useRouterEvent('onResolved', () => {
    chainStore.setChains([Chains.baseSepolia])
  })

  const connect = useConnect({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })
  const switchChain = useSwitchChain({ config: mipdConfig })
  const switchPortoChain = useSwitchChain({ config })
  const connectors = useConnectors({ config: mipdConfig }).filter(
    (c) => !c.id.toLowerCase().includes('porto'),
  )

  const grantAdmin = Hooks.useGrantAdmin({
    mutation: {
      onMutate: (variables) => {
        console.log('onMutate', variables, chainId)
      },
    },
  })

  const { data, error } = Hooks.useAdmins({
    query: {
      // select: (data) => ({
      //   ...data,
      //   keys: data.keys.filter((key) => key.type !== 'address'),
      // }),
    },
  })
  // const customEvent = new CustomEvent('chain-changed', {
  //   bubbles: true,
  //   cancelable: true,
  //   // composed: true,
  //   detail: {
  //     data: { chainId },
  //     message: 'Switching chain for recovery',
  //   },
  // })
  // React.useEffect(() => {
  //   if (typeof window === 'undefined') return
  //   // console.info('dispatching custom event')
  //   const success = window.dispatchEvent(customEvent)
  //   console.info('success', success)
  // }, [customEvent])

  async function tryConnect(connector: Connector) {
    console.log('tryConnect', chainId)
    try {
      const {
        accounts: [address],
      } = await connect.connectAsync({
        chainId: Chains.baseSepolia.id,
        connector,
      })
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
      // // 1. disconnect in case user is connected from previous sessions
      await disconnectAll()

      // // 2. try to connect -- this could fail for a number of reasons:
      // // - one of which is the user doesn't have the chain configured
      // let address = await tryConnect({ chainId, connector })
      // if (!address) {
      //   await switchChain.switchChainAsync({ chainId })
      //   // 1Code has comments. Press enter to view.
      //   address = await tryConnect({ chainId, connector })
      // }
      // 2. try to connect -- this could fail for a number of reasons:
      // - one of which is the user doesn't have the chain configured
      let address = await tryConnect(connector)
      if (!address) {
        await switchPortoChain.switchChainAsync({
          chainId: Chains.baseSepolia.id,
        })
        await switchChain.switchChainAsync({
          chainId: Chains.baseSepolia.id,
        })
        address = await tryConnect(connector)
      }

      if (!address) throw new Error('Failed to connect to wallet')

      const granted = await grantAdmin.mutateAsync({
        address: account.address,
        chainId: Chains.baseSepolia.id,
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
        <pre>
          {JSON.stringify(
            {
              data,
              error: { ...grantAdmin.error, ...error },
            },
            null,
            2,
          )}
        </pre>
      </section>
    </CatchBoundary>
  )
}
