import * as Ariakit from '@ariakit/react'
import { createFileRoute, Link, useRouteContext } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import {
  type Connector,
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

  const [_selectedConnector, setSelectedConnector] = React.useState<
    Connector | undefined
  >(undefined)
  const account = useAccount({ config: mipdConfig })
  const connect = useConnect({
    config: mipdConfig,
    mutation: {
      onMutate: (_variables) => {
        if (account.chainId !== portoAccount?.chainId) {
          console.info('switching chain', {
            accountChainId: account.chainId,
            portoChainId: portoAccount?.chainId,
          })
        }
      },
    },
  })
  const connectors = useConnectors({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })

  const disconnectAll = async () =>
    Promise.all([
      disconnect.disconnectAsync(),
      ...connectors.map((connector) => connector.disconnect()),
    ])

  const switchChain = useSwitchChain({ config: mipdConfig })

  const grantAdmin = Hooks.useGrantAdmin()

  useAccountEffect({
    onConnect: (data) => {
      if (data.chainId !== portoAccount?.chainId) {
        switchChain.switchChain({
          chainId: portoAccount.chainId as never,
        })
      }
    },
    onDisconnect: () => {},
  })

  if (!connectors.length) return <div>No wallets found</div>
  return (
    <div>
      <h2>Add recovery wallet</h2>
      <p>
        If you lose access, recover your account with a wallet of your choice.
      </p>
      <pre>
        {JSON.stringify(
          {
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
                  setSelectedConnector(connector)
                  await disconnectAll()
                  await connect
                    .connectAsync({ connector })
                    .then(({ accounts: [address] }) =>
                      grantAdmin.mutate({
                        address: portoAccount.address,
                        chainId: account.chainId as never,
                        key: { publicKey: address, type: 'address' },
                      }),
                    )
                    .then(() => setView('success'))
                    .catch(() => setView('error'))
                    .finally(() => disconnectAll())
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
  )
}
