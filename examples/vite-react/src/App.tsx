import { Hooks } from 'porto/wagmi'
import { formatEther, parseEther } from 'viem'
import {
  type BaseError,
  useAccount,
  useConnectors,
  useReadContract,
} from 'wagmi'
import { useSendCalls, useWaitForCallsStatus } from 'wagmi/experimental'
import { exp1Address, exp1Config } from './_generated/contracts'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <Account />
      {isConnected ? (
        <>
          <Balance />
          <Mint />
        </>
      ) : (
        <Connect />
      )}
    </>
  )
}

function Account() {
  const account = useAccount()
  const disconnect = Hooks.useDisconnect()

  return (
    <div>
      <h2>Account</h2>

      <div>
        account: {account.address}
        <br />
        chainId: {account.chainId}
        <br />
        status: {account.status}
      </div>

      {account.status !== 'disconnected' && (
        <button onClick={() => disconnect.mutate({})} type="button">
          Disconnect
        </button>
      )}
    </div>
  )
}

function Connect() {
  const connectors = useConnectors()
  const connect = Hooks.useConnect()

  return (
    <div>
      <h2>Connect</h2>
      {connectors
        .filter((x) => x.id === 'xyz.ithaca.porto')
        ?.map((connector) => (
          <div key={connector.uid}>
            <button
              onClick={() =>
                connect.mutate({
                  connector,
                })
              }
              type="button"
            >
              Connect
            </button>
          </div>
        ))}
      <div>{connect.status}</div>
      <div>{connect.error?.message}</div>
    </div>
  )
}

function Balance() {
  const { address } = useAccount()
  const { data: balance } = useReadContract({
    ...exp1Config,
    args: [address!],
    functionName: 'balanceOf',
    query: {
      enabled: !!address,
      refetchInterval: 2_000,
    },
  })

  return (
    <div>
      <h2>Balance</h2>
      <div>Balance: {formatEther(balance ?? 0n)} EXP</div>
    </div>
  )
}

function Mint() {
  const { address } = useAccount()
  const { data, error, isPending, sendCalls } = useSendCalls()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForCallsStatus({
      id: data?.id,
    })

  return (
    <div>
      <h2>Mint EXP</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendCalls({
            calls: [
              {
                ...exp1Config,
                args: [address!, parseEther('100')],
                functionName: 'mint',
                to: exp1Address,
              },
            ],
          })
        }}
      >
        <button disabled={isPending} type="submit">
          {isPending ? 'Confirming...' : 'Mint 100 EXP'}
        </button>
      </form>
      {data?.id && <div>Transaction Hash: {data.id}</div>}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}
