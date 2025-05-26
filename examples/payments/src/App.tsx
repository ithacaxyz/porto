import { formatEther } from 'viem'
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { BuyNow } from './BuyNft'
import { exp1Config } from './contracts'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <h1>Porto Payments Example</h1>
      <Account />
      {isConnected ? <Balance /> : <Connect />}
      {isConnected && <BuyNow />}
    </>
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
