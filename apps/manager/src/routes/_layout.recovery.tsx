import * as Ariakit from '@ariakit/react'
import { Button, Spinner } from '@porto/apps/components'
import { createFileRoute, Link } from '@tanstack/react-router'
import { cx } from 'cva'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { useConnect, useConnectors, useDisconnect, useSignMessage } from 'wagmi'
import { CustomToast } from '~/components/CustomToast'
import { mipdConfig as config } from '~/lib/MipdWagmi'
import SecurityIcon from '~icons/ic/outline-security'
import CheckMarkIcon from '~icons/lucide/check'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import XIcon from '~icons/lucide/x'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout/recovery')({
  component: RouteComponent,
})

function ActionableFeedback({ feedback }: { feedback: 'SUCCESS' | 'PENDING' }) {
  return (
    <div className="w-[350px]">
      {feedback === 'PENDING' ? (
        <div className="mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full bg-blue4 px-2 text-blue10">
          <Spinner />
        </div>
      ) : (
        <div className="mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full bg-emerald-100 px-2 text-emerald-600 dark:bg-emerald-200">
          <CheckMarkIcon className="size-7" />
        </div>
      )}

      <div className="flex flex-col items-center gap-y-2 text-center">
        <React.Fragment>
          {feedback === 'PENDING' ? (
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
                render={<Link to="..">Done</Link>}
                variant="accent"
              />
            </React.Fragment>
          )}
        </React.Fragment>
      </div>
    </div>
  )
}

function RouteComponent() {
  React.useInsertionEffect(() => {
    toast.warning('Not implemented', {
      description: 'Will be implemented soon after relay is ready',
      duration: Number.POSITIVE_INFINITY,
      position: 'top-right',
    })
  })

  const [view, setView] = React.useState<'DEFAULT' | 'SUCCESS' | 'LOADING'>(
    'DEFAULT',
  )

  const connect = useConnect({
    mutation: {
      onMutate: (_) => setView('LOADING'),
    },
  })
  const disconnect = useDisconnect()
  const _connectors = useConnectors({ config })

  const connectors = React.useMemo(
    () =>
      _connectors.filter(
        (connector) =>
          connector.id !== 'xyz.ithaca.porto' &&
          connector.name.toLowerCase() !== 'porto',
      ),
    [_connectors],
  )

  const { signMessageAsync, status: _signMessageStatus } = useSignMessage({
    mutation: {
      onError: (error, _, __) => console.info(error),
      onMutate: (_) => setView('LOADING'),
      onSuccess: (_, __, ___) => setView('SUCCESS'),
    },
  })

  // @ts-expect-error
  const createAccount = Hooks.useCreateAccount({
    mutation: {
      onError: (error, _, __) => console.info(error),
      onMutate: (_) => [console.info('mutate'), setView('LOADING')],
      onSuccess: (_, __, ___) => setView('SUCCESS'),
    },
  })

  if (!connectors.length) return null

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

      <div
        className={cx(
          'mx-auto flex h-full w-full flex-col items-center justify-center bg-transparent min-[550px]:max-w-[395px]',
        )}
      >
        {view === 'SUCCESS' ? (
          <ActionableFeedback feedback="SUCCESS" />
        ) : view === 'LOADING' ? (
          <ActionableFeedback feedback="PENDING" />
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
              <ul className="">
                {connectors.map((connector, _index) => (
                  <React.Fragment key={connector.id}>
                    <li
                      className="w-full rounded-md border-none py-2"
                      data-connector={connector.id}
                    >
                      <Ariakit.Button
                        className="flex h-12 w-full max-w-full flex-row items-center justify-between space-x-4 rounded-md border-none p-1 hover:bg-gray3"
                        onClick={async (event) => {
                          event.preventDefault()
                          event.stopPropagation()

                          disconnect
                            .disconnectAsync()
                            .catch((error) => console.info(error))
                            .then(() =>
                              connect
                                .connectAsync({ connector })
                                .catch((error) => console.info(error))
                                //
                                .then(() =>
                                  signMessageAsync({
                                    message: `${new Date().toISOString()}\nI'm the owner of this wallet\nSigning a message to confirm my ownership`,
                                  })
                                    //
                                    .then((_signature) =>
                                      toast.custom((t) => (
                                        <CustomToast
                                          className={t}
                                          description="You have successfully signed a message. Look at you"
                                          kind="SUCCESS"
                                          title="Signed Message"
                                        />
                                      )),
                                    ),
                                ),
                            )
                            .catch((error) => {
                              setView('DEFAULT')
                              toast.custom((t) => (
                                <CustomToast
                                  className={t}
                                  description={error.message}
                                  kind="ERROR"
                                  title="Error Signing"
                                />
                              ))
                            })
                        }}
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
                  </React.Fragment>
                ))}
              </ul>
            </section>

            <Button
              className="my-4 h-11! w-full font-medium text-lg!"
              onClick={() => toast.dismiss()}
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
