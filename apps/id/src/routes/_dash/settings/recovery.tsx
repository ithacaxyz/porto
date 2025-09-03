import * as Ariakit from '@ariakit/react'
import { Toast } from '@porto/apps/components'
import * as Ui from '@porto/ui'
import {
  CatchBoundary,
  createFileRoute,
  Link,
  useNavigate,
  useRouteContext,
} from '@tanstack/react-router'
import { Chains } from 'porto'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { type Connector, useConnect, useConnectors, useDisconnect } from 'wagmi'
import { mipdConfig } from '~/lib/Wagmi'

export const Route = createFileRoute('/_dash/settings/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = useRouteContext({
    from: '/_dash/settings/recovery',
  })
  const navigate = useNavigate()

  const [_view, setView] = React.useState<'default' | 'success' | 'loading'>(
    'default',
  )

  const desiredChain = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.has('testnet') && params.get('testnet') !== 'false'
      ? Chains.baseSepolia
      : Chains.base
  }, [])

  // Ensure `porto.chainId` search param is set based on `?testnet` flag
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const current = Number(params.get('porto.chainId') ?? Number.NaN)
    if (current === desiredChain.id) return
    navigate({
      replace: true,
      search: (prev) => ({ ...prev, 'porto.chainId': desiredChain.id }),
      to: '.',
    })
  }, [navigate, desiredChain])

  const connect = useConnect({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })
  const connectors = useConnectors({ config: mipdConfig }).filter(
    (c) => !c.id.toLowerCase().includes('porto'),
  )

  const grantAdmin = Hooks.useGrantAdmin()
  const { data } = Hooks.useAdmins()
  const revokeAdmin = Hooks.useRevokeAdmin()

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
      await disconnectAll()
      const {
        accounts: [address],
      } = await connect.connectAsync({
        chainId: desiredChain.id,
        connector,
      })
      if (!address) throw new Error('Failed to connect to wallet')
      const granted = await grantAdmin.mutateAsync({
        address: account.address,
        chainId: desiredChain.id,
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
      <section className="overflow-x-auto">
        <h2>Add recovery wallet</h2>
        <p>
          If you lose access, recover your account with a wallet of your choice.
        </p>

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

        <ul className="mb-6 flex flex-col">
          {data?.keys.map((key) => (
            <li key={key.id}>
              <pre>{JSON.stringify(key, null, 2)}</pre>
              <Ui.Button
                onClick={() =>
                  revokeAdmin.mutate({
                    address: account.address,
                    chainId: data.chainId as never,
                    id: key.id,
                  })
                }
              >
                revoke
              </Ui.Button>
            </li>
          ))}
        </ul>

        <details className="group">
          <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
            <span>raw admin keys</span>
          </summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
        <Ui.Button
          // biome-ignore lint/correctness/noChildrenProp: _
          children={
            <Link className="" to="..">
              I'll do this later
            </Link>
          }
          onClick={() =>
            connectors.map((connector) => disconnect.disconnect({ connector }))
          }
          variant="secondary"
        />
      </section>
    </CatchBoundary>
  )
}
