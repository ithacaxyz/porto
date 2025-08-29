import * as Ariakit from '@ariakit/react'
import {
  CatchBoundary,
  createFileRoute,
  Link,
  type RouterEvents,
  useRouteContext,
  useRouter,
} from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { baseSepolia } from 'viem/chains'
import {
  useAccount,
  useAccountEffect,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { mipdConfig } from '~/lib/Wagmi'

export const Route = createFileRoute('/_dash/settings/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  const [view, setView] = React.useState<
    'default' | 'success' | 'loading' | 'error'
  >('default')

  const { account: portoAccount } = useRouteContext({
    from: '/_dash/settings/recovery',
  })
  const chainId = window.location.search.includes('testnet')
    ? baseSepolia.id
    : (portoAccount?.chainId as never)

  const grantAdmin = Hooks.useGrantAdmin()

  const account = useAccount({ config: mipdConfig })
  const connect = useConnect({
    config: mipdConfig,
    mutation: {
      onMutate: (_variables) => {
        if (account.chainId === chainId) return
        switchChain.switchChain({ chainId })
      },
    },
  })
  const connectors = useConnectors({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })
  const switchChain = useSwitchChain({ config: mipdConfig })

  const disconnectAll = async () =>
    Promise.all([
      disconnect.disconnectAsync(),
      ...connectors.map((connector) => connector.disconnect()),
    ])

  useRouterEvent('onBeforeNavigate', (event) => {
    if (event.hrefChanged && event.fromLocation) disconnectAll()
  })

  useRouterEvent('onResolved', () => switchChain.switchChain({ chainId }))

  useAccountEffect({
    onConnect: (data) => {
      if (data.chainId === chainId) return
      switchChain.switchChain({ chainId })
    },
  })

  if (!connectors.length) return <div>No wallets found</div>
  return (
    <CatchBoundary
      getResetKey={() => 'recovery'}
      onCatch={(error, errorInfo) => {
        console.error(error, errorInfo)
        disconnectAll()
      }}
    >
      <div>
        <h2>Add recovery wallet</h2>
        <p>
          If you lose access, recover your account with a wallet of your choice.
        </p>
        <pre>
          {JSON.stringify(
            {
              chainId,
              connectedAddress: account.address,
              connectedConnector: account.connector?.id,
              view,
            },
            null,
            2,
          )}
        </pre>
        <section>
          <ol className="flex flex-col gap-3 py-2">
            {connectors.map((connector) => (
              <li key={connector.uid}>
                <Ariakit.Button
                  className="flex items-center gap-2"
                  onClick={async (event) => {
                    event.preventDefault()
                    setView('loading')
                    await disconnectAll()
                    await connect
                      .connectAsync({ connector })
                      .then(({ accounts: [address] }) =>
                        grantAdmin.mutate({
                          address: portoAccount.address,
                          chainId,
                          key: { publicKey: address, type: 'address' },
                        }),
                      )
                      .then(() => setView('success'))
                      .catch(() => setView('error'))
                  }}
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
      </div>
    </CatchBoundary>
  )
}

function useRouterEvent<T extends keyof RouterEvents>(
  type: T,
  handler: (event: RouterEvents[T]) => void,
) {
  const router = useRouter()
  React.useEffect(
    () => router.subscribe(type, handler),
    [router, type, handler],
  )
}
