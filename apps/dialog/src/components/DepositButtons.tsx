import * as Ariakit from '@ariakit/react'
import { Button, Deposit } from '@porto/ui'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Hex, Value } from 'ox'
import type * as Quote_schema from 'porto/core/internal/relay/schema/quotes'
import * as React from 'react'
import { encodeFunctionData, erc20Abi, zeroAddress } from 'viem'
import {
  createConfig,
  useAccount,
  useAccountEffect,
  useConnect,
  useDisconnect,
  useSendCalls,
  useWaitForCallsStatus,
  useWatchBlockNumber,
  WagmiProvider,
} from 'wagmi'
import { porto } from '~/lib/Porto'

const config = createConfig({
  chains: porto._internal.config.chains,
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: porto._internal.config.transports,
})
const queryClient = new QueryClient()

const defaultNativeDeposit = Value.fromEther('0.1')

export function DepositButtons(props: {
  address: string
  chainId?: number
  assetDeficits?: Quote_schema.AssetDeficit[]
  nativeTokenName?: string
}) {
  const { address, assetDeficits, chainId, nativeTokenName } = props
  const nativeDeficit = assetDeficits?.find(
    (d) => d.address === null || d.address === zeroAddress,
  )
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <div className="flex w-full flex-col gap-[8px]">
          <Deposit
            address={address}
            chainId={chainId}
            value={nativeDeficit?.required ?? defaultNativeDeposit}
          />
          <DepositFromWallet
            address={address}
            assetDeficits={assetDeficits}
            chainId={chainId}
            nativeTokenName={nativeTokenName}
          />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function DepositFromWallet(props: {
  address: string
  chainId?: number
  assetDeficits?: Quote_schema.AssetDeficit[]
  nativeTokenName?: string
}) {
  const { address, assetDeficits, chainId, nativeTokenName } = props
  const [view, setView] = React.useState<'default' | 'connected-wallet'>(
    'default',
  )
  const { address: account, connector } = useAccount()
  const disconnect = useDisconnect()
  const queryClient = useQueryClient()
  const connect = useConnect({
    mutation: {
      async onSuccess(data) {
        if (chainId === undefined) return

        const account = data.accounts[0] as `0x${string}`
        const hexChainId = Hex.fromNumber(chainId)
        const response = await porto.provider.request({
          method: 'wallet_getAssets',
          params: [{ account, chainFilter: [hexChainId] }],
        })
        const assets = response[hexChainId] ?? []
        const nonZeroAssets = assets.filter((asset) => asset.balance !== '0x0')
        queryClient.setQueryData(['assets', { account, chainId }], assets)

        form.setValues(
          Object.fromEntries(
            nonZeroAssets.map((asset) => [asset.address ?? zeroAddress, true]),
          ),
        )

        setView('connected-wallet')
      },
    },
  })

  const {
    data: { assets, nonZeroAssets },
    refetch: refetchAssets,
  } = useQuery({
    enabled: Boolean(account && chainId),
    initialData: [],
    async queryFn() {
      if (!chainId) throw new Error('Missing chainId')
      if (!account) throw new Error('Missing account')
      const response = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{ account }],
      })
      return response[Hex.fromNumber(chainId)]
    },
    queryKey: ['assets', { account, chainId }],
    select: (assets = []) => ({
      assets,
      nonZeroAssets: assets.filter((asset) => asset.balance !== '0x0'),
    }),
  })

  useWatchBlockNumber({
    chainId: chainId as never,
    enabled: Boolean(account && chainId),
    onBlockNumber() {
      refetchAssets()
    },
  })

  useAccountEffect({
    onDisconnect() {
      setView('default')
    },
  })

  const form = Ariakit.useFormStore({})
  const sendCalls = useSendCalls()
  const { isLoading: isConfirming } = useWaitForCallsStatus({
    id: sendCalls.data?.id,
  })
  form.useSubmit(async (state) => {
    if (!address) throw new Error('address is required')
    if (!connector) throw new Error('connector is required')
    const calls = []
    for (const [key, value] of Object.entries(state.values)) {
      if (!value) continue
      const asset = assets.find(
        (asset) => (asset.address ?? zeroAddress) === key,
      )
      if (!asset) throw new Error('asset is required')

      const deficit = assetDeficits?.find(
        (d) => (d.address ?? zeroAddress).toLowerCase() === key.toLowerCase(),
      )

      const balance = Hex.toBigInt(asset.balance, {
        size: asset.metadata?.decimals,
      })

      calls.push(
        key === 'native' || key === zeroAddress
          ? ({
              to: address as `0x${string}`,
              value: deficit?.required ?? defaultNativeDeposit,
            } as const)
          : ({
              data: encodeFunctionData({
                abi: erc20Abi,
                args: [address as `0x${string}`, deficit?.required ?? balance],
                functionName: 'transfer',
              }),
              to: key as `0x${string}`,
            } as const),
      )
    }
    await sendCalls.sendCallsAsync({
      calls,
      experimental_fallback: true,
    })
  })

  const state = Ariakit.useStoreState(form)
  const submittable = React.useMemo(
    () => Object.values(state.values).some((value) => value),
    [state.values],
  )

  const options = React.useMemo(() => {
    const wallets = [
      {
        icon: <MetaMaskIcon />,
        name: 'MetaMask',
        rdns: 'io.metamask',
      },
      {
        icon: <PhantomIcon />,
        name: 'Phantom',
        rdns: 'app.phantom',
      },
      {
        icon: <CoinbaseIcon />,
        name: 'Coinbase',
        rdns: 'com.coinbase.wallet',
      },
    ]

    const mapped = wallets.map((option) => ({
      ...option,
      connector: connect.connectors.find(
        (connector) => option.rdns === connector.id,
      ),
    }))

    // if there is no named wallet detected but an ethereum provider is present,
    // the metamask button gets enabled and acts as a generic connect button
    const hasNamedWallet = mapped.some((w) => w.connector)
    if (!hasNamedWallet) {
      const injectedConnector = connect.connectors.find(
        (c) => c.type === 'injected',
      )
      if (injectedConnector)
        mapped[0] = {
          connector: injectedConnector,
          icon: <MetaMaskIcon />,
          name: 'Connect Wallet',
          rdns: 'injected',
        }
    }

    return mapped
  }, [connect.connectors])

  if (view === 'connected-wallet' && account)
    return nonZeroAssets.length > 0 ? (
      <Ariakit.Form className="flex w-full flex-col gap-[8px]" store={form}>
        <div className="flex flex-col gap-2">
          {nonZeroAssets.map((asset) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: Label contains checkbox
            <label
              className="flex h-9 w-full items-center justify-between rounded-md bg-th_secondary px-2"
              key={asset.address ?? asset.type}
            >
              <div>
                {asset.metadata?.symbol ??
                  (asset.type === 'native' ? nativeTokenName : asset.type)}
              </div>
              <Ariakit.FormCheckbox
                name={form.names[asset.address ?? zeroAddress] as string}
              />
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              disconnect.disconnect()
              setView('default')
            }}
            variant="secondary"
            width="grow"
          >
            Back
          </Button>
          <Ariakit.FormSubmit
            render={
              <Button
                disabled={!submittable}
                loading={
                  sendCalls.isPending
                    ? 'Check Wallet'
                    : isConfirming
                      ? 'Confirming'
                      : undefined
                }
                variant="primary"
                width="grow"
              >
                Transfer
              </Button>
            }
          />
        </div>
      </Ariakit.Form>
    ) : (
      <Button
        onClick={() => {
          disconnect.disconnect()
          setView('default')
        }}
        variant="secondary"
        width="full"
      >
        Go back
      </Button>
    )

  return (
    <div className="flex w-full gap-[8px]">
      {options.map((option) => (
        <Button
          disabled={!option.connector}
          key={option.name}
          loading={
            connect.isPending &&
            'id' in connect.variables.connector &&
            connect.variables.connector.id === option.connector?.id &&
            'Connecting…'
          }
          onClick={async () => {
            if (option.connector) {
              if (option.connector.id === connector?.id)
                await disconnect.disconnectAsync()
              connect.connect({
                chainId: chainId as never,
                connector: option.connector,
              })
            }
          }}
          title={`Connect with ${option.name}`}
          variant="secondary"
          width="grow"
        >
          {option.icon}
        </Button>
      ))}
    </div>
  )
}

function MetaMaskIcon() {
  return (
    <svg height="20" role="presentation" viewBox="0 0 142 136.878" width="20">
      <path
        d="m132.682 132.192-30.583-9.106-23.063 13.787-16.092-.007-23.077-13.78-30.569 9.106L0 100.801l9.299-34.839L0 36.507 9.299 0l47.766 28.538h27.85L132.682 0l9.299 36.507-9.299 29.455 9.299 34.839-9.299 31.391z"
        fill="#ff5c16"
      />
      <path
        d="m9.305 0 47.767 28.558-1.899 19.599L9.305 0zm30.57 100.814 21.017 16.01-21.017 6.261v-22.271zm19.337-26.469-4.039-26.174L29.317 65.97l-.014-.007v.013l.08 18.321 10.485-9.951 19.344-.001zM132.682 0 84.915 28.558l1.893 19.599L132.682 0zm-30.569 100.814-21.018 16.01 21.018 6.261v-22.271zm10.565-34.839h.007-.007v-.013l-.006.007-25.857-17.798-4.039 26.174h19.336l10.492 9.95.074-18.32z"
        fill="#ff5c16"
      />
      <path
        d="m39.868 123.085-30.569 9.106L0 100.814h39.868v22.271zm19.337-48.747 5.839 37.84-8.093-21.04-27.581-6.843 10.491-9.956h19.344v-.001zm42.907 48.747 30.57 9.106 9.299-31.378h-39.869v22.272zM82.776 74.338l-5.839 37.84 8.092-21.04 27.583-6.843-10.498-9.956H82.776v-.001z"
        fill="#e34807"
      />
      <path
        d="m0 100.801 9.299-34.839h19.997l.073 18.327 27.584 6.843 8.092 21.039-4.16 4.633-21.017-16.01H0v.007zm141.981 0-9.299-34.839h-19.998l-.073 18.327-27.582 6.843-8.093 21.039 4.159 4.633 21.018-16.01h39.868v.007zM84.915 28.538h-27.85l-1.891 19.599 9.872 64.013h11.891l9.878-64.013-1.9-19.599z"
        fill="#ff8d5d"
      />
      <path
        d="M9.299 0 0 36.507l9.299 29.455h19.997l25.87-17.804L9.299 0zm44.127 81.938h-9.059l-4.932 4.835 17.524 4.344-3.533-9.186v.007zM132.682 0l9.299 36.507-9.299 29.455h-19.998L86.815 48.158 132.682 0zM88.568 81.938h9.072l4.932 4.841-17.544 4.353 3.54-9.201v.007zm-9.539 42.447 2.067-7.567-4.16-4.633h-11.9l-4.159 4.633 2.066 7.567"
        fill="#661800"
      />
      <path d="M79.029 124.384v12.495H62.945v-12.495h16.084z" fill="#c0c4cd" />
      <path
        d="m39.875 123.072 23.083 13.8v-12.495l-2.067-7.566-21.016 6.261zm62.238 0-23.084 13.8v-12.495l2.067-7.566 21.017 6.261z"
        fill="#e7ebf6"
      />
    </svg>
  )
}

function PhantomIcon() {
  return (
    <svg fill="none" role="presentation" viewBox="0 0 22 19" width="20">
      <path
        d="M0.5 15.972C0.5 18.4334 1.7181 19 2.98493 19C5.66472 19 7.67866 16.4679 8.88051 14.4669C8.73434 14.9096 8.65314 15.3523 8.65314 15.7773C8.65314 16.946 9.27031 17.7782 10.4884 17.7782C12.1613 17.7782 13.9478 16.1845 14.8736 14.4669C14.8086 14.7148 14.7761 14.945 14.7761 15.1575C14.7761 15.972 15.1984 16.4855 16.0592 16.4855C18.7715 16.4855 21.5 11.2619 21.5 6.69337C21.5 3.1342 19.8434 0 15.6856 0C8.37704 0 0.5 9.70363 0.5 15.972ZM13.1682 6.30381C13.1682 5.41845 13.623 4.79871 14.2889 4.79871C14.9385 4.79871 15.3933 5.41845 15.3933 6.30381C15.3933 7.18919 14.9385 7.82665 14.2889 7.82665C13.623 7.82665 13.1682 7.18919 13.1682 6.30381ZM16.6439 6.30381C16.6439 5.41845 17.0986 4.79871 17.7645 4.79871C18.4142 4.79871 18.8689 5.41845 18.8689 6.30381C18.8689 7.18919 18.4142 7.82665 17.7645 7.82665C17.0986 7.82665 16.6439 7.18919 16.6439 6.30381Z"
        fill="#AB9FF2"
      />
    </svg>
  )
}

function CoinbaseIcon() {
  return (
    <svg
      className="rounded-full"
      fill="none"
      role="presentation"
      viewBox="0 0 28 28"
      width="20"
    >
      <rect fill="#2C5FF6" height="28" width="28" />
      <path
        clipRule="evenodd"
        d="M14 23.8C19.4124 23.8 23.8 19.4124 23.8 14C23.8 8.58761 19.4124 4.2 14 4.2C8.58761 4.2 4.2 8.58761 4.2 14C4.2 19.4124 8.58761 23.8 14 23.8ZM11.55 10.8C11.1358 10.8 10.8 11.1358 10.8 11.55V16.45C10.8 16.8642 11.1358 17.2 11.55 17.2H16.45C16.8642 17.2 17.2 16.8642 17.2 16.45V11.55C17.2 11.1358 16.8642 10.8 16.45 10.8H11.55Z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  )
}
