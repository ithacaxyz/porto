import { Hooks } from 'porto/wagmi'
import { formatEther, parseEther } from 'viem'
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
} from 'wagmi'

import { permissions } from './config'
import { exp1Config } from './contracts'
import { SendTip } from './SendTip'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <h1>Porto Permissions Example</h1>
      <Account />
      {isConnected ? (
        <>
          <Balance /> <AddFunds />
        </>
      ) : (
        <Connect />
      )}
      {isConnected && <SendTip />}
    </>
  )
}

function Account() {
  const account = useAccount()
  const disconnect = useDisconnect()

  return (
    <main>
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

      <footer
        style={{ bottom: 10, fontSize: 24, left: 10, position: 'absolute' }}
      >
        <a
          href="https://github.com/ithacaxyz/porto/tree/main/examples/permissions"
          rel="noopener noreferrer"
          target="_blank"
        >
          Source code
        </a>
      </footer>
    </main>
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
            capabilities: {
              grantPermissions: permissions(),
            },
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

function useBalance() {
  const { address } = useAccount()
  const { data: balance, refetch } = useReadContract({
    abi: exp1Config.abi,
    address: exp1Config.address,
    args: [address!],
    functionName: 'balanceOf',
  })

  return {
    balance,
    refetch,
  }
}

function Balance() {
  const { balance } = useBalance()

  return (
    <div>
      <h2>Balance</h2>
      <div>Balance: {formatEther(balance ?? 0n)} EXP</div>
    </div>
  )
}

function AddFunds() {
  const chainId = useChainId()
  const { address } = useAccount()
  const { balance, refetch } = useBalance()
  const addFunds = Hooks.useAddFunds({
    mutation: {
      onSuccess: () => refetch(),
    },
  })

  if (balance && balance >= parseEther('10'))
    return <p>Your account is funded</p>
  return (
    <div>
      <h2>Fund your account</h2>
      <button
        onClick={() =>
          addFunds.mutate({
            address,
            chainId,
            token: exp1Config.address,
          })
        }
        type="button"
      >
        Add Funds
      </button>
    </div>
  )
}
