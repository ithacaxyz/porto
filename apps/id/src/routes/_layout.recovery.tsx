import * as Ariakit from '@ariakit/react'
import { Button, Spinner, Toast } from '@porto/apps/components'
import { createFileRoute, Link } from '@tanstack/react-router'
import { base, baseSepolia } from 'porto/core/Chains'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import {
  type Connector,
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { mipdConfig } from '~/lib/Wagmi'

import SecurityIcon from '~icons/ic/outline-security'
import CheckMarkIcon from '~icons/lucide/check'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import XIcon from '~icons/lucide/x'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount()
  const [view, setView] = React.useState<'default' | 'success' | 'loading'>(
    'default',
  )

  const _connectors = useConnectors({ config: mipdConfig })
  const connectors = React.useMemo(() => {
    return _connectors.filter((c) => !c.id.toLowerCase().includes('porto'))
  }, [_connectors])

  const connect = useConnect({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })
  const switchChain = useSwitchChain({ config: mipdConfig })

  const grantAdmin = Hooks.useGrantAdmin()

  async function tryConnect(connector: Connector) {
    try {
      const {
        accounts: [address],
      } = await connect.connectAsync({ connector })
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
      const chainId =
        import.meta.env.VITE_VERCEL_ENV === 'production'
          ? base.id
          : baseSepolia.id
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

  if (!connectors.length)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 px-3">
        <p className="rounded-lg border border-gray5/50 bg-surface px-2.5 py-1 text-center font-medium text-lg">
          No wallets found
        </p>
        <p className="text-center">
          Please use a desktop browser with a wallet extension to add a recovery
          wallet.
        </p>
        <Button
          className="w-full"
          render={
            <Link from="/recovery" to="/">
              Go back
            </Link>
          }
        />
      </div>
    )

  return (
    <React.Fragment>
      <div className="mb-auto block w-full px-1 max-[863px]:pt-2 sm:pr-3 sm:pl-5 lg:hidden">
        <Layout.Header
          right={
            <Button
              className="block lg:hidden"
              render={<Link to=".." />}
              size="square"
              variant="outline"
            >
              <XIcon className="size-5 text-gray10" />
            </Button>
          }
        />
      </div>

      <div className="mx-auto flex h-full w-full flex-col items-center justify-center bg-transparent min-[550px]:max-w-[395px]">
        {view === 'success' ? (
          <ActionableFeedback feedback="success" />
        ) : view === 'loading' ? (
          <ActionableFeedback feedback="pending" />
        ) : (
          <React.Fragment>
            <section className="flex flex-col items-center gap-y-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-fuchsia-200 p-2">
                <SecurityIcon className="size-full text-purple-600" />
              </div>
              <p className="font-medium text-2xl">Add recovery method</p>
              <p className="text-center font-normal text-lg">
                If you lose access, recover your account with a wallet of your
                choice.
              </p>
            </section>

            <div className="h-10" />

            <section className="w-full">
              <ul>
                {connectors.map((connector) => (
                  <li
                    className="w-full rounded-md border-none py-2"
                    data-connector={connector.id}
                    key={connector.id}
                  >
                    <Ariakit.Button
                      className="flex h-12 w-full max-w-full flex-row items-center justify-between space-x-4 rounded-md border-none p-1 hover:bg-gray3"
                      onClick={(event) =>
                        connectThenGrantAdmin(event, connector)
                      }
                    >
                      <img
                        alt={connector.name}
                        className="ml-1 size-9"
                        src={connector.icon}
                      />
                      <span className="select-none text-xl">
                        {connector.name}
                      </span>
                      <ChevronRightIcon className="ml-auto size-6 text-gray9" />
                    </Ariakit.Button>
                  </li>
                ))}
              </ul>
            </section>

            <Button
              className="my-4 h-11! w-full font-medium text-lg!"
              onClick={() => {
                disconnectAll()
                  .catch(() => {})
                  .finally(() => toast.dismiss())
              }}
              render={
                <Link className="" to="..">
                  I'll do this later
                </Link>
              }
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

function ActionableFeedback({ feedback }: { feedback: 'success' | 'pending' }) {
  return (
    <div className="w-[350px]">
      {feedback === 'pending' ? (
        <div className="mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full bg-blue4 px-2 text-blue10">
          <Spinner />
        </div>
      ) : (
        <div className="mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full bg-emerald-100 px-2 text-emerald-600 dark:bg-emerald-200">
          <CheckMarkIcon className="size-7" />
        </div>
      )}

      <div className="flex flex-col items-center gap-y-2 text-center">
        {feedback === 'pending' ? (
          <React.Fragment>
            <p className="text-center font-medium text-2xl">
              Approve in wallet
            </p>
            <p className="text-lg">Please check your wallet for a request.</p>
            <p className="font-normal text-base text-gray10">
              This will verify ownership of the wallet,
              <br />
              and allow it to recover this passkey.
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="text-center font-medium text-2xl">
              Added recovery method
            </p>
            <p className="text-lg">
              You can now use this wallet to recover your passkey if you ever
              lose access.
            </p>
            <Button
              className="mt-2 h-11! w-full text-lg!"
              render={<Link to="/">Done</Link>}
              variant="accent"
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
