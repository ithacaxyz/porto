import { formatEther, parseEther } from 'viem'
import {
  type BaseError,
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSendCalls,
  useWaitForCallsStatus,
} from 'wagmi'
import { exp1Address, exp1Config } from './contracts'

export function App() {
  const { isConnected } = useAccount()
  return (
    <main>
      <h1>Sponsoring Vite Example</h1>
      <Account />
      {isConnected ? (
        <>
          <Balance />
          <Mint />
        </>
      ) : (
        <Connect />
      )}
      <footer
        style={{
          bottom: 0,
          fontFamily: 'monospace',
          fontSize: 24,
          position: 'absolute',
        }}
      >
        <a
          href="https://github.com/ithacaxyz/porto/tree/main/examples/sponsoring-vite"
          rel="noopener noreferrer"
          target="_blank"
        >
          Source code
        </a>
      </footer>
    </main>
  )
}

function Account() {
  const account = useAccount()
  const disconnect = useDisconnect()

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
        <button onClick={() => disconnect.disconnect()} type="button">
          Sign out
        </button>
      )}
    </div>
  )
}

function Connect() {
  const connect = useConnect()
  const [connector] = connect.connectors

  return (
    <div>
      <h2>Connect</h2>
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
  const { address, chain } = useAccount()
  const { data, error, isPending, sendCalls } = useSendCalls()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: callStatusData,
  } = useWaitForCallsStatus({
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
      {callStatusData?.receipts?.at(0)?.transactionHash && (
        <div>
          Transaction Hash:{' '}
          <a
            href={`${chain?.blockExplorers.default.url}/tx/${callStatusData?.receipts.at(0)?.transactionHash}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {callStatusData?.receipts.at(0)?.transactionHash}
          </a>
        </div>
      )}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}
