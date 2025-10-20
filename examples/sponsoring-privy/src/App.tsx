import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Hex } from 'ox'
import { Account } from 'porto/viem'
import { Hooks } from 'porto/wagmi'
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
import { porto } from 'wagmi/connectors'

import { exp1Address, exp1Config } from './contracts'

export function App() {
  const privy = usePrivy()

  const { isConnected } = useAccount()

  if (!privy.ready) return <div>Loading...</div>
  return (
    <>
      <PrivyAccount />
      <WagmiAccount />
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

function PrivyAccount() {
  const privy = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  )

  const upgradeAccount = Hooks.useUpgradeAccount()

  return (
    <section>
      <div>
        <h2>Privy Account</h2>
        <button
          onClick={() => {
            privy.login({
              loginMethods: ['passkey', 'email', 'wallet'],
              walletChainType: 'ethereum-only',
            })
          }}
          type="button"
        >
          Login
        </button>
        <pre>{JSON.stringify(privy.user, null, 2)}</pre>
      </div>
      <div>
        <h2>Upgrade Account</h2>
        <button
          onClick={() => {
            if (!embeddedWallet) return
            if (!privy.user?.wallet?.address) return

            const account = Account.from({
              address: privy.user?.wallet?.address as `0x${string}`,
              sign: async (parameters) => {
                const provider = await embeddedWallet.getEthereumProvider()
                const signature = await provider.request({
                  method: 'secp256k1_sign',
                  params: [parameters.hash],
                })

                Hex.assert(signature)

                return signature
              },
            })
            upgradeAccount.mutate({ account, connector: porto() })
          }}
          type="button"
        >
          Upgrade Account
        </button>
        <div>{upgradeAccount.status}</div>
        {upgradeAccount.error && (
          <div>
            Error:{' '}
            {(upgradeAccount.error as BaseError).shortMessage ||
              upgradeAccount.error.message}
          </div>
        )}
        <pre>{JSON.stringify(upgradeAccount.data, null, 2)}</pre>
      </div>
    </section>
  )
}

function WagmiAccount() {
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
