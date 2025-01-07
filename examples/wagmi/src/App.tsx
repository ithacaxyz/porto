import { Hooks } from 'porto/wagmi'
import { type Hex, formatEther, parseEther } from 'viem'
import {
  type BaseError,
  useAccount,
  useConnectors,
  useReadContract,
} from 'wagmi'
import { useCallsStatus, useSendCalls } from 'wagmi/experimental'

import { useState } from 'react'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import { ExperimentERC20 } from './contracts'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <Account />
      {isConnected ? (
        <>
          <Balance />
          <AuthorizeKey />
          <Mint />
        </>
      ) : (
        <>
          <Connect />
          <ImportAccount />
        </>
      )}
    </>
  )
}

function Account() {
  const account = useAccount()
  const { data: keys } = Hooks.useKeys()
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
        <br />
        keys: {JSON.stringify(keys)}
      </div>

      {account.status !== 'disconnected' && (
        <button type="button" onClick={() => disconnect.mutate({})}>
          Log Out
        </button>
      )}
    </div>
  )
}

function Connect() {
  const [authorizeKey, setAuthorizeKey] = useState<boolean>(true)

  const connectors = useConnectors()
  const connect = Hooks.useConnect()

  return (
    <div>
      <h2>Connect</h2>
      <label>
        <input
          type="checkbox"
          checked={authorizeKey}
          onChange={() => setAuthorizeKey((x) => !x)}
        />
        Grant Session
      </label>
      {connectors
        .filter((x) => x.id === 'xyz.ithaca.porto')
        ?.map((connector) => (
          <div key={connector.uid}>
            <button
              key={connector.uid}
              onClick={() => connect.mutate({ connector, authorizeKey })}
              type="button"
            >
              Login
            </button>
            <button
              onClick={() =>
                connect.mutate({ connector, createAccount: true, authorizeKey })
              }
              type="button"
            >
              Register
            </button>
          </div>
        ))}
      <div>{connect.status}</div>
      <div>{connect.error?.message}</div>
    </div>
  )
}

function ImportAccount() {
  const [accountData, setAccountData] = useState<{
    address: string
    privateKey: string
  } | null>(null)
  const [authorizeKey, setAuthorizeKey] = useState<boolean>(true)
  const [privateKey, setPrivateKey] = useState<string>('')

  const connectors = useConnectors()
  const importAccount = Hooks.useImportAccount()

  return (
    <div>
      <h2>Import Account</h2>
      <p>
        <button
          onClick={() => {
            const privateKey = generatePrivateKey()
            setPrivateKey(privateKey)
            setAccountData({
              privateKey,
              address: privateKeyToAddress(privateKey),
            })
          }}
          type="button"
        >
          Create Account
        </button>
        {accountData && <pre>{JSON.stringify(accountData, null, 2)}</pre>}
      </p>
      <div>
        <input
          type="text"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Private Key"
          style={{ width: '300px' }}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={authorizeKey}
            onChange={() => setAuthorizeKey((x) => !x)}
          />
          Grant Session
        </label>
      </div>
      {connectors
        .filter((x) => x.id === 'xyz.ithaca.porto')
        ?.map((connector) => (
          <button
            key={connector.uid}
            onClick={() =>
              importAccount.mutate({
                account: privateKeyToAccount(privateKey as Hex),
                connector,
                authorizeKey,
              })
            }
            type="button"
          >
            Import Account
          </button>
        ))}
      <div>{importAccount.status}</div>
      <div>{importAccount.error?.message}</div>
    </div>
  )
}

function Balance() {
  const { address } = useAccount()
  const { data: balance } = useReadContract({
    ...ExperimentERC20,
    query: {
      enabled: !!address,
      refetchInterval: 2_000,
    },
    functionName: 'balanceOf',
    args: [address!],
  })

  return (
    <div>
      <h2>Balance</h2>
      <div>Balance: {formatEther(balance ?? 0n)} EXP</div>
    </div>
  )
}

function AuthorizeKey() {
  const keys = Hooks.useKeys()
  const authorizeKey = Hooks.useAuthorizeKey()

  if (keys.data?.length !== 0) return null
  return (
    <div>
      <h2>Grant Session</h2>
      <button onClick={() => authorizeKey.mutate({})} type="button">
        Grant Session
      </button>
      {authorizeKey.data && <div>Session granted.</div>}
      {authorizeKey.error && (
        <div>
          Error: {authorizeKey.error.shortMessage || authorizeKey.error.message}
        </div>
      )}
    </div>
  )
}

function Mint() {
  const { address } = useAccount()
  const { data: id, error, isPending, sendCalls } = useSendCalls()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      refetchInterval({ state }) {
        if (state.data?.status === 'CONFIRMED') return false
        return 1_000
      },
    },
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
                abi: ExperimentERC20.abi,
                to: ExperimentERC20.address,
                functionName: 'mint',
                args: [address!, parseEther('100')],
              },
            ],
          })
        }}
      >
        <button disabled={isPending} type="submit">
          {isPending ? 'Confirming...' : 'Mint 100 EXP'}
        </button>
      </form>
      {id && <div>Transaction Hash: {id}</div>}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}
