import { exp1Config, exp2Config } from '@porto/apps/contracts'
import { useQueryClient } from '@tanstack/react-query'
import { Hooks, Query } from 'porto/wagmi'
import * as React from 'react'
import {
  type Address,
  erc20Abi,
  formatUnits,
  parseEther,
  stringify,
} from 'viem'
import {
  type Config,
  type UseSendCallsReturnType,
  useAccount,
  useCapabilities,
  useChainId,
  useChains,
  useConnect,
  useDisconnect,
  useSendCalls,
  useSwitchChain,
  useWaitForCallsStatus,
} from 'wagmi'
import type { ChainId } from './config'

export function App() {
  const { isConnected } = useAccount()
  return (
    <div>
      <h1>Interop Playground</h1>
      {isConnected ? (
        <>
          <Account />
          <Chains />
        </>
      ) : (
        <Connect />
      )}
    </div>
  )
}

function Account() {
  const account = useAccount()
  const disconnect = useDisconnect()
  const chainId = useChainId()
  const { chains, switchChain, error } = useSwitchChain()

  return (
    <div>
      <div>
        account: {account.address}
        <br />
        status: {account.status}
      </div>

      <div>
        {chains.map((chain) => (
          <button
            disabled={chainId === chain.id}
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            type="button"
          >
            {chain.name}
          </button>
        ))}

        {error?.message}
      </div>

      {account.status !== 'disconnected' && (
        <button onClick={() => disconnect.disconnect()} type="button">
          Sign out
        </button>
      )}
    </div>
  )
}

function Connect() {
  const connect = useConnect()
  const connector = connect.connectors[0]!

  return (
    <div>
      <button
        onClick={() =>
          connect.connect({
            connector,
          })
        }
        type="button"
      >
        Sign in
      </button>
      <div>{connect.error?.message}</div>
    </div>
  )
}

function Chains() {
  const chains = useChains()

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {chains.map((chain) => (
        <div key={chain.id}>
          <ChainGroup
            chainId={chain.id as ChainId}
            key={chain.id}
            name={chain.name}
          />
          <div style={{ backgroundColor: '#b0b0b0', minWidth: 1 }} />
        </div>
      ))}
    </div>
  )
}

export function ChainGroup({
  chainId,
  name,
}: {
  chainId: ChainId
  name: string
}) {
  return (
    <div style={{ width: 300 }}>
      <h3>
        {name} {chainId}
      </h3>

      <Balances chainId={chainId} />

      {chainId !== 0 && <Actions chainId={chainId} />}
    </div>
  )
}

function Balances({ chainId }: { chainId: ChainId }) {
  const { data, isLoading } = Hooks.useAssets()

  const assets = React.useMemo(
    () =>
      [...(data?.[chainId] ?? [])].sort((a, b) =>
        (a?.metadata?.symbol ?? '').localeCompare(b?.metadata?.symbol ?? ''),
      ),
    [data, chainId],
  )

  return (
    <div>
      <h4 style={{ margin: '0.5rem 0' }}>Balances</h4>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {isLoading && (
            <tr>
              <td>Loading...</td>
            </tr>
          )}
          {assets?.map((asset) =>
            asset ? (
              <tr key={asset.address}>
                <td style={{ width: '100px' }}>
                  {asset.metadata?.symbol ?? 'ETH'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {Number(
                    formatUnits(asset.balance, asset.metadata?.decimals ?? 18),
                  ).toFixed(2)}
                </td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </div>
  )
}

function Actions({ chainId }: { chainId: Exclude<ChainId, 0> }) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Mint chainId={chainId} />
        <Transfer chainId={chainId} />
        <Swap chainId={chainId} />
      </div>
    </div>
  )
}

function Mint({ chainId }: { chainId: Exclude<ChainId, 0> }) {
  const account = useAccount()

  return (
    <Action title="Mint">
      {({ sendCalls }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const amount = formData.get('amount') as string
            const symbol = formData.get('symbol') as string

            const config = symbol === 'EXP' ? exp1Config : exp2Config

            sendCalls.sendCalls({
              calls: [
                {
                  abi: config.abi,
                  args: [account.address!, parseEther(amount)],
                  functionName: 'mint',
                  to: config.address[chainId],
                },
              ],
              chainId,
            })
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                defaultValue={100}
                min={0}
                name="amount"
                required
                step={0.0001}
                style={{ flex: 1 }}
                type="number"
              />
              <select defaultValue="EXP" name="symbol">
                <option value="EXP">EXP</option>
                <option value="EXP2">EXP2</option>
              </select>
            </div>
            <button type="submit">Mint</button>
          </div>
        </form>
      )}
    </Action>
  )
}

function Transfer({ chainId }: { chainId: Exclude<ChainId, 0> }) {
  const account = useAccount()
  const { data: capabilities, isLoading } = useCapabilities({ chainId })

  return (
    <Action title="Transfer">
      {({ sendCalls }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const to = (formData.get('to') || account.address) as Address
            const amount = formData.get('amount') as `${number}`
            const symbol = formData.get('symbol') as string

            if (symbol === 'ETH') {
              sendCalls.sendCalls({
                calls: [
                  {
                    to,
                    value: parseEther(amount),
                  },
                ],
                chainId,
              })
              return
            }

            const token = capabilities?.feeToken.tokens.find(
              (token) => token.symbol === symbol,
            )
            if (!token) throw new Error(`Token ${symbol} not found`)

            sendCalls.sendCalls({
              calls: [
                {
                  abi: erc20Abi,
                  args: [to, parseEther(amount)],
                  functionName: 'transfer',
                  to: token.address,
                },
              ],
              capabilities: {
                requiredFunds: [{ symbol, value: amount }],
              },
              chainId,
            })
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <input
              name="to"
              placeholder="Recipient address (default: self)"
              type="text"
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                defaultValue={100}
                min={0}
                name="amount"
                step={0.0001}
                style={{ flex: 1 }}
                type="number"
              />
              <select defaultValue="EXP" name="symbol">
                <option value="EXP">EXP</option>
                <option value="EXP2">EXP2</option>
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <button disabled={isLoading} type="submit">
              Transfer
            </button>
          </div>
        </form>
      )}
    </Action>
  )
}

function Swap({ chainId }: { chainId: Exclude<ChainId, 0> }) {
  const account = useAccount()
  const [from, setFrom] = React.useState<'EXP' | 'EXP2'>('EXP')
  const [fromValue, setFromValue] = React.useState<string>('10')
  const [toValue, setToValue] = React.useState<string>('0.1')
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <Action title="Swap">
      {({ sendCalls }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const fromAmount = formData.get('fromAmount') as `${number}`

            const toAddress =
              from === 'EXP'
                ? exp2Config.address[chainId]
                : exp1Config.address[chainId]
            const config = from === 'EXP' ? exp1Config : exp2Config

            sendCalls.sendCalls({
              calls: [
                {
                  abi: config.abi,
                  args: [toAddress, account.address!, parseEther(fromAmount)],
                  functionName: 'swap',
                  to: config.address[chainId],
                },
              ],
              capabilities: {
                requiredFunds: [{ symbol: from, value: fromAmount }],
              },
              chainId,
            })
          }}
          ref={formRef}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                defaultValue={10}
                min={0}
                name="fromAmount"
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : e.target.value
                  const scale = from === 'EXP' ? 0.01 : 100
                  setFromValue(value)
                  setToValue((Number(value) * scale).toString())
                }}
                step={0.0001}
                style={{ flex: 1 }}
                type="number"
                value={fromValue}
              />
              <div style={{ width: '4ch' }}>
                {from === 'EXP' ? 'EXP' : 'EXP2'}
              </div>
            </div>
            <button
              onClick={() => {
                setFrom((from) => (from === 'EXP' ? 'EXP2' : 'EXP'))
                setFromValue(toValue)
                setToValue(fromValue)
              }}
              style={{
                padding: '0 1rem',
                width: 'fit-content',
              }}
              type="button"
            >
              ↓
            </button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                disabled
                min={0}
                name="toAmount"
                step={0.0001}
                style={{ flex: 1 }}
                type="number"
                value={toValue}
              />
              <div style={{ width: '4ch' }}>
                {from === 'EXP' ? 'EXP2' : 'EXP'}
              </div>
            </div>
            <button type="submit">Swap</button>
          </div>
        </form>
      )}
    </Action>
  )
}

function Action({
  children,
  title,
}: {
  children: <config extends Config>(props: {
    sendCalls: UseSendCallsReturnType<config>
  }) => React.ReactNode
  title: string
}) {
  const sendCalls = useSendCalls()
  const waitForCallsStatus = useWaitForCallsStatus({
    id: sendCalls.data?.id,
    retryCount: 0,
    throwOnFailure: true,
  })
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (!waitForCallsStatus.isSuccess) return
    queryClient.invalidateQueries({
      queryKey: [Query.getAssetsQueryKey({})[0]],
    })
  }, [waitForCallsStatus.isSuccess, queryClient.invalidateQueries])

  return (
    <div>
      <p>
        <strong>{title}</strong>
      </p>
      {children({ sendCalls })}
      <div style={{ minHeight: 20 }}>
        {waitForCallsStatus.isFetching && <div>Waiting for inclusion...</div>}
        {waitForCallsStatus.isSuccess && (
          <div>
            <details>
              <summary>Success. View details</summary>
              <pre style={{ overflow: 'scroll' }}>
                {stringify(waitForCallsStatus.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
        {waitForCallsStatus.isError && (
          <div>Error. {waitForCallsStatus.error?.message}</div>
        )}
      </div>
    </div>
  )
}
