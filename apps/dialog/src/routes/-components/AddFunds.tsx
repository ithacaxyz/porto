import * as Ariakit from '@ariakit/react'
import { exp1Address } from '@porto/apps/contracts'
import { useCopyToClipboard, usePrevious } from '@porto/apps/hooks'
import { Button, PresetsInput, Spinner } from '@porto/ui'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { Cuer } from 'cuer'
import { Address, Hex, Value } from 'ox'
import { Hooks as RemoteHooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { encodeFunctionData, erc20Abi, zeroAddress, zeroHash } from 'viem'
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
import * as FeeTokens from '~/lib/FeeTokens'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import LucideOctagonAlert from '~icons/lucide/octagon-alert'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'

const presetAmounts = ['30', '50', '100', '250'] as const
const MAX_AMOUNT = 500

const config = createConfig({
  chains: porto._internal.config.chains,
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: porto._internal.config.transports,
})
const queryClient = new QueryClient()

type View =
  | 'connected-wallet-no-funds'
  | 'connected-wallet-transfer'
  | 'default'
  | 'error'

export function AddFunds(props: AddFunds.Props) {
  const { chainId, onApprove, onReject, tokenAddress, value } = props

  const [view, setView] = React.useState<View>('default')

  const account = RemoteHooks.useAccount(porto)
  const address = props.address ?? account?.address
  const chain = RemoteHooks.useChain(porto, { chainId })
  const { data: feeTokens } = FeeTokens.fetch.useQuery({
    addressOrSymbol: tokenAddress,
  })
  const feeToken = React.useMemo(
    () =>
      tokenAddress
        ? feeTokens?.find((token) =>
            Address.isEqual(token.address, tokenAddress),
          )
        : undefined,
    [feeTokens, tokenAddress],
  )

  const { data: assets, refetch: refetchAssets } = Hooks.useAssets({
    account: account?.address,
    query: {
      enabled: Boolean(account?.address),
      select(data) {
        // As we support interop, we can listen to the aggregated assets across
        // all supported chains.
        return data[0]
      },
    },
  })
  const balanceMap = React.useMemo(() => {
    const addressBalanceMap = new Map<Address.Address, bigint>()
    if (!assets || !feeTokens) return addressBalanceMap
    const feeTokenAddressMap = new Map<Address.Address, boolean>()
    for (const feeToken of feeTokens)
      feeTokenAddressMap.set(feeToken.address, true)
    for (const asset of assets) {
      const address =
        (asset.address === 'native' || asset.type === 'native'
          ? zeroAddress
          : asset.address) ?? zeroAddress
      if (feeTokenAddressMap.has(address))
        addressBalanceMap.set(address, asset.balance)
    }
    return addressBalanceMap
  }, [assets, feeTokens])
  useWatchBlockNumber({
    enabled: Boolean(account?.address),
    onBlockNumber() {
      refetchAssets()
    },
  })
  const previousBalanceMap = usePrevious({ value: balanceMap })

  // Close dialog when one of the fee token is greater than before
  React.useEffect(() => {
    if (typeof previousBalanceMap === 'undefined') return
    for (const [address, balance] of balanceMap) {
      const previousBalance = previousBalanceMap.get(address)
      if (typeof previousBalance === 'undefined') continue
      if (balance > previousBalance) onApprove?.({ id: zeroHash })
    }
  }, [balanceMap, onApprove, previousBalanceMap])

  if (view === 'error')
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            icon={TriangleAlertIcon}
            title="Deposit failed"
            variant="destructive"
          />
        </Layout.Header>

        <Layout.Content className="px-1">
          <p className="text-th_base">Your deposit was cancelled or failed.</p>
          <p className="text-th_base-secondary">
            No funds have been deposited.
          </p>
        </Layout.Content>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="flex-grow"
              onClick={() => onReject?.()}
              variant="secondary"
            >
              Close
            </Button>
            <Button
              className="flex-grow"
              onClick={() => setView('default')}
              variant="primary"
            >
              Try again
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )

  return (
    <Layout>
      <Layout.Header>
        {view === 'connected-wallet-no-funds' ? (
          <Layout.Header.Default
            content="You do not have any transferrable assets in this wallet."
            icon={LucideOctagonAlert}
            title="No funds found"
            variant="destructive"
          />
        ) : (
          <Layout.Header.Default
            content={
              view === 'connected-wallet-transfer'
                ? 'Select which assets you want to deposit to your Porto wallet.'
                : 'Deposit via crypto or credit card.'
            }
            title="Add funds"
          />
        )}
      </Layout.Header>

      <Layout.Content>
        <div className="flex flex-col gap-3">
          {view === 'default' && feeToken?.uid.startsWith('exp') && (
            <>
              <Faucet
                address={address}
                chainId={chain?.id}
                decimals={feeToken?.decimals}
                defaultValue={value}
                onApprove={onApprove}
                tokenAddress={tokenAddress}
              />
              <div className="my-auto flex w-full flex-row items-center gap-2 *:border-th_separator">
                <hr className="flex-1 border-th_separator" />
                <span className="px-3 text-th_base-secondary">or</span>
                <hr className="flex-1 border-th_separator" />
              </div>
            </>
          )}

          <WagmiProvider config={config} reconnectOnMount={false}>
            <QueryClientProvider client={queryClient}>
              <DepositCrypto
                address={address}
                chainId={chain?.id}
                feeToken={feeToken}
                minValue={value}
                nativeTokenName={chain?.nativeCurrency?.symbol}
                setView={setView}
                tokenAddress={tokenAddress}
                view={view}
              />
            </QueryClientProvider>
          </WagmiProvider>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export declare namespace AddFunds {
  export type Props = {
    address?: Address.Address | undefined
    chainId?: number | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
    tokenAddress?: Address.Address | undefined
    value?: string | undefined
  }
}

function Faucet(props: {
  address: Address.Address | undefined
  chainId: number | undefined
  defaultValue: string | undefined
  decimals: number | undefined
  tokenAddress: Address.Address | undefined
  onApprove: (result: { id: Hex.Hex }) => void
}) {
  const { address, chainId, defaultValue, decimals, tokenAddress, onApprove } =
    props

  const [amount, setAmount] = React.useState<string>(
    defaultValue
      ? Math.ceil(Number(defaultValue)).toString()
      : presetAmounts[0]!,
  )

  const client = RemoteHooks.useRelayClient(porto)
  const faucet = useMutation({
    async mutationFn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      e.stopPropagation()

      if (!address) throw new Error('address is required')
      if (!chainId) throw new Error('chainId is required')

      const value = Value.from(amount, decimals ?? 18)

      const data = await RelayActions.addFaucetFunds(client, {
        address,
        chainId: chainId,
        tokenAddress: tokenAddress ?? exp1Address[chainId as never],
        value,
      })
      // relay state can be behind node state. wait to ensure sync.
      // TODO: figure out how to resolve.
      await new Promise((resolve) => setTimeout(resolve, 2_000))
      return data
    },
    onSuccess(data) {
      onApprove({ id: data.transactionHash })
    },
  })

  return (
    <form
      className="grid h-min grid-flow-row auto-rows-min grid-cols-1 space-y-3"
      onSubmit={(e) => faucet.mutate(e)}
    >
      <div className="col-span-1 row-span-1">
        <PresetsInput
          adornments={{
            end: {
              label: `Max. $${MAX_AMOUNT}`,
              type: 'fill',
              value: String(MAX_AMOUNT),
            },
            start: '$',
          }}
          inputMode="decimal"
          max={MAX_AMOUNT}
          min={0}
          onChange={setAmount}
          placeholder="Enter amount"
          presets={presetAmounts.map((value) => ({
            label: `$${value}`,
            value,
          }))}
          type="number"
          value={amount}
        />
      </div>
      <div className="col-span-1 row-span-1 space-y-3.5">
        <Button
          className="w-full flex-1"
          data-testid="buy"
          disabled={!address || !amount || Number(amount) === 0}
          loading={faucet.isPending && 'Adding funds…'}
          type="submit"
          variant="primary"
          width="grow"
        >
          Add faucet funds
        </Button>
      </div>
    </form>
  )
}

function DepositCrypto(props: {
  address: Address.Address | undefined
  chainId: number | undefined
  feeToken: FeeTokens.FeeToken | undefined
  minValue: string | undefined
  nativeTokenName: string | undefined
  tokenAddress: Address.Address | undefined
  view: View
  setView: (view: View) => void
}) {
  const {
    address,
    chainId,
    feeToken,
    minValue,
    nativeTokenName,
    tokenAddress,
    view,
    setView,
  } = props

  const { address: account, connector } = useAccount()
  const disconnect = useDisconnect()
  const connect = useConnect({
    mutation: {
      async onSuccess(data) {
        if (chainId) {
          const account = data.accounts[0]
          const hexChainId = Hex.fromNumber(chainId)
          const response = await porto.provider.request({
            method: 'wallet_getAssets',
            params: [{ account, chainFilter: [hexChainId] }],
          })
          const assets = response[hexChainId] ?? []
          const minAssetBalance = minValue
            ? Value.from(minValue, feeToken?.decimals ?? 18)
            : 0n

          const nonZeroAssets = assets.filter(
            (asset) => asset.balance !== '0x0',
          )
          queryClient.setQueryData(['assets', { account, chainId }], assets)
          form.setValues(
            Object.fromEntries(
              nonZeroAssets.map((asset) => [
                asset.address ?? zeroAddress,
                true,
              ]),
            ),
          )

          const hasRequiredTokenAmount = assets.some((asset) => {
            const address =
              asset.type === 'native' ? zeroAddress : asset.address
            const assetBalance = Hex.toBigInt(asset.balance)
            return (
              assetBalance > minAssetBalance &&
              (tokenAddress
                ? address?.toLowerCase() === tokenAddress.toLowerCase()
                : true)
            )
          })
          setView(
            hasRequiredTokenAmount
              ? 'connected-wallet-transfer'
              : 'connected-wallet-no-funds',
          )
        }
      },
    },
  })

  const { data: assets = [] } = useQuery({
    enabled: Boolean(account && chainId),
    async queryFn() {
      if (!chainId) throw new Error('Missing chainId')
      const hexChainId = Hex.fromNumber(chainId)
      const response = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{ account: account! }],
      })
      return response[hexChainId]
    },
    queryKey: ['assets', { account, chainId }],
  })
  const nonZeroAssets = React.useMemo(() => {
    return assets.filter((asset) => asset.balance !== '0x0')
  }, [assets])

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
      const amount = Hex.toBigInt(asset.balance, {
        size: asset.metadata?.decimals,
      })
      calls.push(
        key === zeroAddress
          ? ({
              to: address as Address.Address,
              value: amount / 2n,
            } as const)
          : ({
              data: encodeFunctionData({
                abi: erc20Abi,
                args: [address, amount],
                functionName: 'transfer',
              }),
              to: key as Address.Address,
            } as const),
      )
    }
    await sendCalls.sendCallsAsync({ calls, experimental_fallback: true })
  })
  const state = Ariakit.useStoreState(form)
  const submittable = React.useMemo(() => {
    return Object.values(state.values).some((value) => value)
  }, [state.values])

  const options = React.useMemo(
    () =>
      [
        { icon: <MetaMask />, name: 'MetaMask', rdns: 'io.metamask' },
        { icon: <Phantom />, name: 'Phantom', rdns: 'app.phantom' },
        { icon: <Coinbase />, name: 'Coinbase', rdns: 'com.coinbase.wallet' },
      ].map((option) => ({
        ...option,
        connector: connect.connectors.find(
          (connector) => option.rdns === connector.id,
        ),
      })),
    [connect.connectors],
  )

  if (
    (view === 'connected-wallet-transfer' ||
      view === 'connected-wallet-no-funds') &&
    account
  ) {
    if (view === 'connected-wallet-transfer')
      return (
        <div className="flex flex-col gap-2">
          <Ariakit.Form className="flex flex-col gap-2" store={form}>
            <div className="flex flex-col gap-2">
              {nonZeroAssets.map((asset) => (
                // biome-ignore lint/a11y/noLabelWithoutControl: Label contains checkbox
                <label
                  className="flex h-9 w-full items-center justify-between rounded-th_medium bg-th_secondary px-2"
                  key={asset.address ?? asset.type}
                >
                  <div>
                    {asset.metadata?.symbol ??
                      (asset.type === 'native' ? nativeTokenName : asset.type)}
                  </div>
                  <Ariakit.FormCheckbox
                    disabled={
                      tokenAddress
                        ? (asset.address ?? zeroAddress).toLowerCase() ===
                          tokenAddress.toLowerCase()
                        : false
                    }
                    name={form.names[asset.address ?? zeroAddress] as string}
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                disabled={Object.values(state.values).every((value) => value)}
                onClick={() =>
                  form.setValues(
                    Object.fromEntries(
                      assets.map((asset) => [
                        asset.address ?? zeroAddress,
                        true,
                      ]),
                    ),
                  )
                }
                width="grow"
              >
                Select all
              </Button>
              <Ariakit.FormSubmit
                render={
                  <Button
                    className="font-semibold"
                    disabled={!submittable}
                    loading={
                      sendCalls.isPending
                        ? 'Check Wallet'
                        : isConfirming
                          ? 'Confirming'
                          : undefined
                    }
                    variant="strong"
                    width="grow"
                  >
                    Confirm
                  </Button>
                }
              />
            </div>
          </Ariakit.Form>
          <button
            className="text-center text-[13px] text-th_base-secondary"
            onClick={() => {
              disconnect.disconnect()
              setView('default')
            }}
            type="button"
          >
            Go back
          </button>
        </div>
      )
    return (
      <div className="flex flex-col gap-3">
        <QRCard address={address ?? ''} feeToken={feeToken} />
        <Button
          onClick={() => {
            disconnect.disconnect()
            setView('default')
          }}
          width="full"
        >
          Go back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        {options.map((option) => (
          <Button
            className="disabled:opacity-75"
            disabled={!option.connector}
            key={option.name}
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
            type="button"
            width="grow"
          >
            {option.icon}
            {connect.isPending &&
              'id' in connect.variables.connector &&
              connect.variables.connector.id === option.connector?.id && (
                <Spinner />
              )}
          </Button>
        ))}
      </div>

      <QRCard address={address ?? ''} feeToken={feeToken} />
    </div>
  )
}

function QRCard(props: {
  address: string
  feeToken: FeeTokens.FeeToken | undefined
}) {
  const { address, feeToken } = props
  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })
  return (
    <div className="flex items-center justify-between rounded-th_medium bg-th_secondary p-2">
      <div className="flex gap-2">
        <div className="size-11.5">
          <Cuer.Root errorCorrection="low" value={address}>
            <Cuer.Cells />
            <Cuer.Finder radius={1} />
          </Cuer.Root>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-medium text-[13px]">
            Send {feeToken?.symbol ?? 'directly'}
          </div>
          <div className="min-w-[21ch] max-w-[21ch] text-pretty break-all font-mono font-normal text-[10px] text-th_base-secondary leading-[14px]">
            {address}
          </div>
        </div>
      </div>
      <Button
        className="w-[38px] px-0!"
        onClick={() => copyToClipboard(address ?? '')}
        variant={isCopied ? 'positive' : 'strong'}
      >
        {isCopied ? <LucideCopyCheck /> : <LucideCopy />}
      </Button>
    </div>
  )
}

function Coinbase() {
  return (
    <svg
      className="rounded-full"
      fill="none"
      height="20"
      viewBox="0 0 28 28"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Coinbase Wallet</title>
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
function Phantom() {
  return (
    <svg
      fill="none"
      height="19"
      viewBox="0 0 22 19"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Phantom</title>
      <path
        d="M0.5 15.972C0.5 18.4334 1.7181 19 2.98493 19C5.66472 19 7.67866 16.4679 8.88051 14.4669C8.73434 14.9096 8.65314 15.3523 8.65314 15.7773C8.65314 16.946 9.27031 17.7782 10.4884 17.7782C12.1613 17.7782 13.9478 16.1845 14.8736 14.4669C14.8086 14.7148 14.7761 14.945 14.7761 15.1575C14.7761 15.972 15.1984 16.4855 16.0592 16.4855C18.7715 16.4855 21.5 11.2619 21.5 6.69337C21.5 3.1342 19.8434 0 15.6856 0C8.37704 0 0.5 9.70363 0.5 15.972ZM13.1682 6.30381C13.1682 5.41845 13.623 4.79871 14.2889 4.79871C14.9385 4.79871 15.3933 5.41845 15.3933 6.30381C15.3933 7.18919 14.9385 7.82665 14.2889 7.82665C13.623 7.82665 13.1682 7.18919 13.1682 6.30381ZM16.6439 6.30381C16.6439 5.41845 17.0986 4.79871 17.7645 4.79871C18.4142 4.79871 18.8689 5.41845 18.8689 6.30381C18.8689 7.18919 18.4142 7.82665 17.7645 7.82665C17.0986 7.82665 16.6439 7.18919 16.6439 6.30381Z"
        fill="#AB9FF2"
      />
    </svg>
  )
}
function MetaMask() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 21 20"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>MetaMask</title>
      <g clipPath="url(#clip0_1310_10495)">
        <path
          d="M19.6722 0.666504L11.8687 6.49984L13.3086 3.06124L19.6722 0.666504Z"
          fill="#E2761B"
          stroke="#E2761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M1.65479 0.666504L9.39731 6.5551L8.02452 3.06124L1.65479 0.666504Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M16.8652 14.1938L14.7847 17.3991L19.2325 18.6272L20.5077 14.2614L16.8652 14.1938Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M0.831055 14.2614L2.10012 18.6272L6.54796 17.3991L4.46742 14.1938L0.831055 14.2614Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.29813 8.77813L5.05957 10.6632L9.4769 10.8597L9.31826 6.08252L6.29813 8.77813Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M15.0291 8.77773L11.9663 6.02686L11.8687 10.8593L16.2738 10.6628L15.0291 8.77773Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.54834 17.399L9.2024 16.0973L6.90831 14.292L6.54834 17.399Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M12.1245 16.0973L14.7847 17.399L14.4186 14.292L12.1245 16.0973Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M14.7847 17.3989L12.1245 16.0972L12.3381 17.841L12.3137 18.5717L14.7847 17.3989Z"
          fill="#D7C1B3"
          stroke="#D7C1B3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.54834 17.3989L9.01936 18.5717L9.00105 17.841L9.2024 16.0972L6.54834 17.3989Z"
          fill="#D7C1B3"
          stroke="#D7C1B3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M9.05583 13.1435L6.84717 12.4865L8.4091 11.7681L9.05583 13.1435Z"
          fill="#233447"
          stroke="#233447"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M12.2651 13.1435L12.918 11.7681L14.486 12.4865L12.2651 13.1435Z"
          fill="#233447"
          stroke="#233447"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.54831 17.3991L6.92659 14.1938L4.46777 14.2614L6.54831 17.3991Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M14.4067 14.1938L14.785 17.3991L16.8656 14.2614L14.4067 14.1938Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M16.2738 10.6631L11.8687 10.8596L12.2774 13.1438L12.9242 11.7683L14.4922 12.4868L16.2738 10.6631Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.84725 12.4868L8.41527 11.7683L9.05591 13.1438L9.4769 10.8596L5.05957 10.6631L6.84725 12.4868Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M5.05957 10.6631L6.90826 14.292L6.84725 12.4868L5.05957 10.6631Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M14.4922 12.4868L14.4189 14.292L16.2737 10.6631L14.4922 12.4868Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M9.47665 10.8594L9.05566 13.1436L9.57427 15.8331L9.6963 12.2901L9.47665 10.8594Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M11.8683 10.8594L11.6548 12.2839L11.7463 15.8331L12.2771 13.1436L11.8683 10.8594Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M12.2774 13.1438L11.7466 15.8333L12.1249 16.0973L14.4189 14.2921L14.4922 12.4868L12.2774 13.1438Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.84717 12.4868L6.90818 14.2921L9.20226 16.0973L9.57444 15.8333L9.05583 13.1438L6.84717 12.4868Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M12.3141 18.5717L12.3385 17.841L12.1432 17.663H9.18409L9.00105 17.841L9.01936 18.5717L6.54834 17.3989L7.40862 18.1051L9.15969 19.3331H12.1676L13.9248 18.1051L14.7851 17.3989L12.3141 18.5717Z"
          fill="#C0AD9E"
          stroke="#C0AD9E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M12.1248 16.097L11.7466 15.833H9.5745L9.20232 16.097L9.00098 17.8409L9.18401 17.6628H12.1431L12.3384 17.8409L12.1248 16.097Z"
          fill="#161616"
          stroke="#161616"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M20.0013 6.88054L20.6663 3.663L19.6718 0.666504L12.1245 6.30335L15.0287 8.77791L19.1288 9.98142L20.0379 8.91914L19.6474 8.63668L20.2758 8.05949L19.7877 7.67879L20.4162 7.19984L20.0013 6.88054Z"
          fill="#763D16"
          stroke="#763D16"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M0.666504 3.663L1.33154 6.88054L0.910555 7.19984L1.53899 7.67879L1.05699 8.05949L1.68542 8.63668L1.29494 8.91914L2.19793 9.98142L6.29799 8.77791L9.2022 6.30335L1.65491 0.666504L0.666504 3.663Z"
          fill="#763D16"
          stroke="#763D16"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M19.1291 9.98134L15.0291 8.77783L16.2737 10.6629L14.4189 14.2919L16.8656 14.2612H20.508L19.1291 9.98134Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M6.2978 8.77783L2.19774 9.98134L0.831055 14.2612H4.46742L6.90793 14.2919L5.05924 10.6629L6.2978 8.77783Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
        <path
          d="M11.8682 10.8598L12.1245 6.30363L13.3203 3.06152H8.02441L9.20196 6.30363L9.47652 10.8598L9.56804 12.2966L9.57414 15.8335H11.7462L11.7645 12.2966L11.8682 10.8598Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.0502197"
        />
      </g>
      <defs>
        <clipPath id="clip0_1310_10495">
          <rect fill="white" height="20" rx="4" width="20" x="0.666504" />
        </clipPath>
      </defs>
    </svg>
  )
}
