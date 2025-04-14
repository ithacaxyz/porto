import 'viem/window'
import * as Ariakit from '@ariakit/react'
import { Button, Spinner } from '@porto/apps/components'
import { createFileRoute, Link } from '@tanstack/react-router'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import * as React from 'react'
import { toast } from 'sonner'
import { EIP1193Provider } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { Connector, useConnectors } from 'wagmi'
import { CustomToast } from '~/components/CustomToast'
import { porto } from '~/lib/Porto'
import { config, mipdConfig } from '~/lib/Wagmi'
import SecurityIcon from '~icons/ic/outline-security'
import CheckMarkIcon from '~icons/lucide/check'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import CopyIcon from '~icons/lucide/copy'
import XIcon from '~icons/lucide/x'
import WalletConnectIcon from '~icons/token/wallet-connect'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout/recovery')({
  component: RouteComponent,
})

type WCEIP1193Provider = Awaited<ReturnType<typeof EthereumProvider.init>>

function RouteComponent() {
  const [view, setView] = React.useState<'default' | 'success' | 'loading'>(
    'default',
  )

  const _connectors = useConnectors({ config: mipdConfig })
  const connectors = React.useMemo(() => {
    return _connectors.filter((c) => !c.id.toLowerCase().includes('porto'))
  }, [_connectors])

  const [wcProvider, setWcProvider] = React.useState<WCEIP1193Provider | null>(
    null,
  )

  const [openQrDialog, setOpenQrDialog] = React.useState(false)

  const [uri, setUri] = React.useState<string | null>(null)

  const connectThenGrantAdmin = async (
    event: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const provider = (
        openQrDialog ? wcProvider : await connector.getProvider()
      ) as EIP1193Provider

      if (!provider) return
      const [address] = await provider.request({
        method: 'eth_requestAccounts',
      })

      if (!address) return

      await porto.provider.request({
        method: 'experimental_grantAdmin',
        params: [
          {
            key: { publicKey: address, type: 'address' },
          },
        ],
      })

      setView('success')
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          className={t}
          description={
            error instanceof Error
              ? error.message
              : 'Encountered an error while granting admin permissions.'
          }
          kind="error"
          title="Error Connecting"
        />
      ))
    }
  }

  const setupWalletConnect = React.useCallback(async () => {
    EthereumProvider.init({
      chains: [base.id, baseSepolia.id, ...config.chains.map((c) => c.id)],
      methods: ['eth_accounts', 'eth_requestAccounts'],
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      showQrModal: false,
    })
      .then((provider) => {
        provider?.on('display_uri', setUri)
        provider?.enable()
        setWcProvider(provider)
      })
      .catch((error) => console.error(error))
  }, [])

  React.useEffect(() => {
    setupWalletConnect()
  }, [setupWalletConnect])

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
                <li>
                  <Ariakit.Button
                    className="mt-2 flex h-12 w-full max-w-full flex-row items-center justify-between space-x-4 rounded-md border-none p-1 text-xl hover:bg-gray3"
                    onClick={() => setOpenQrDialog(true)}
                  >
                    <div className="ml-1 flex size-9 items-center justify-center rounded-sm bg-accent p-0.5">
                      <WalletConnectIcon className="size-full object-cover" />
                    </div>
                    <span className="select-none text-xl">WalletConnect</span>
                    <ChevronRightIcon className="ml-auto size-6 text-gray9" />
                  </Ariakit.Button>
                  <Ariakit.Dialog
                    className="fixed inset-[0.75rem] z-50 m-auto flex h-fit max-h-[calc(100dvh_-_0.75rem_*_2)] w-[350px] select-none flex-col gap-4 overflow-auto rounded-xl bg-secondary p-3 shadow-2xl"
                    onClose={() => setOpenQrDialog(false)}
                    open={openQrDialog}
                  >
                    <Ariakit.DialogHeading className="flex flex-col items-center justify-between gap-3">
                      <Cuer.Root
                        className="rounded-lg border border-surface bg-white p-2.5 dark:bg-secondary"
                        value={uri ?? ''}
                      >
                        <Cuer.Cells />
                        <Cuer.Finder />
                        <Cuer.Arena>
                          <div className="flex size-full items-center justify-center rounded-[1px] bg-accent">
                            <WalletConnectIcon className="m-auto size-full object-cover" />
                          </div>
                        </Cuer.Arena>
                      </Cuer.Root>
                      <Ariakit.Button
                        className="-bg-linear-270 flex w-full items-center justify-center gap-2 rounded-sm border border-surface bg-gray4 px-4 py-2"
                        onClick={() => {
                          // TODO: replace with hook from addFunds in dialog
                          if (uri) navigator.clipboard.writeText(uri)
                        }}
                      >
                        <CopyIcon className="size-3" />
                        <span>Copy to clipboard</span>
                      </Ariakit.Button>
                    </Ariakit.DialogHeading>
                  </Ariakit.Dialog>
                </li>
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
                render={<Link to="/">Done</Link>}
                variant="accent"
              />
            </React.Fragment>
          )}
        </React.Fragment>
      </div>
    </div>
  )
}
