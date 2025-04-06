import 'viem/window'
import * as Ariakit from '@ariakit/react'
import { Button, Spinner } from '@porto/apps/components'
import { exp1Address } from '@porto/apps/contracts'
import { createFileRoute, Link } from '@tanstack/react-router'
import { cx } from 'cva'
import { Hex } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { odysseyTestnet } from 'viem/chains'
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi'
import { CustomToast } from '~/components/CustomToast'
import { config, porto } from '~/lib/Wagmi'
import SecurityIcon from '~icons/ic/outline-security'
import CheckMarkIcon from '~icons/lucide/check'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import XIcon from '~icons/lucide/x'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout/recovery')({
  component: RouteComponent,
})

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
        <React.Fragment>
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
  const [view, setView] = React.useState<'DEFAULT' | 'success' | 'loading'>(
    'DEFAULT',
  )

  const disconnect = useDisconnect()
  const connectors = useConnectors()

  const account = useAccount()

  const admins = Hooks.useAdmins()

  const connect = useConnect({
    config,
    mutation: {
      onError: (error, _, __) => {
        toast.custom((t) => (
          <CustomToast
            className={t}
            description={error.message}
            kind="error"
            title="Error Connecting"
          />
        ))
        setView('DEFAULT')
      },
      onMutate: (_) => setView('loading'),
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
              <ul className="">
                {connectors.map(async (connector, _index) => (
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

                          await connector?.switchChain?.({
                            addEthereumChainParameter: {
                              blockExplorerUrls: [
                                odysseyTestnet.blockExplorers.default.url,
                              ],
                              chainName: odysseyTestnet.name,
                              nativeCurrency: odysseyTestnet.nativeCurrency,
                              rpcUrls: [odysseyTestnet.rpcUrls.default.http[0]],
                            },
                            chainId: odysseyTestnet.id,
                          })

                          let address = account.address
                          if (await connector.isAuthorized()) {
                            ;[address] = await connector.getAccounts()
                          }

                          if (!address) return

                          if (
                            admins.data?.keys.some(
                              (key) =>
                                key.publicKey.toLowerCase() ===
                                address?.toLowerCase(),
                            )
                          ) {
                            return toast.custom((t) => (
                              <CustomToast
                                className={t}
                                description="The account is already an admin"
                                kind="warn"
                                title="Already Exists"
                              />
                            ))
                          }

                          if (account.connector?.id === connector.id) {
                            await porto.provider.request({
                              method: 'experimental_grantAdmin',
                              params: [
                                {
                                  capabilities: {
                                    feeToken: exp1Address,
                                  },
                                  chainId: Hex.fromNumber(911867),
                                  key: {
                                    publicKey: address,
                                    type: 'address',
                                  },
                                },
                              ],
                            })
                            await disconnect.disconnectAsync({ connector })
                            setView('success')
                            return
                          }

                          await connect.connectAsync({ connector })
                          await porto.provider.request({
                            method: 'experimental_grantAdmin',
                            params: [
                              {
                                capabilities: {
                                  feeToken: exp1Address,
                                },
                                chainId: Hex.fromNumber(911867),
                                key: {
                                  publicKey: address,
                                  type: 'address',
                                },
                              },
                            ],
                          })
                          await disconnect.disconnectAsync({ connector })
                          setView('success')
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
