import { Hex, Json, Value } from 'ox'
import { Key } from 'porto'
import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import { porto, wagmiConfig } from './config.ts'
import { ExperimentERC20 } from './contracts'

const APP_SERVER_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:6900'
  : 'https://offline-server-example.evm.workers.dev'

const permissions = {
  calls: [
    {
      signature: 'mint(address,uint256)',
      to: ExperimentERC20.address,
    },
    {
      signature: 'approve(address,uint256)',
      to: ExperimentERC20.address,
    },
    {
      signature: 'transfer(address,uint256)',
      to: ExperimentERC20.address,
    },
  ],
  spend: [
    {
      limit: Hex.fromNumber(Value.fromEther('1000')),
      period: 'minute',
      token: ExperimentERC20.address,
    },
  ],
} as const

export function App() {
  useEffect(() => {
    // on `d` press
    window.addEventListener('keydown', (event) => {
      if (event.key === 'd') {
        window.localStorage.clear()
        window.sessionStorage.clear()
        // clear everything

        window.location.reload()
      }
    })
  }, [])
  return (
    <div>
      <details>
        <summary style={{ fontSize: '1.25rem' }}>State/getCapabilities</summary>
        <State />
        <GetCapabilities />
      </details>
      <Events />
      <div>
        <hr />
      </div>
      <Connect />
      <div>
        <hr />
      </div>
      <RequestKey />
      <div>
        <hr />
      </div>
      <AuthorizeServerKey />
      <div>
        <hr />
      </div>
      <Demo />
      <div>
        <hr />
      </div>
      <details>
        <summary style={{ fontSize: '1.25rem' }}>Other Requests</summary>
        <Connect />
        <Login />
        <Register />
        <Accounts />
        <Disconnect />
        <UpgradeAccount />
        <div>
          <hr />
        </div>
        <AuthorizeKey />
        <GetKeys />
        <RevokeKey />
      </details>
    </div>
  )
}

type ServerKey = { key: Key.Rpc }

/**
 * request a key from the App Server
 */
function RequestKey() {
  const [result, setResult] = useState<ServerKey | null>(null)
  return (
    <div>
      <h3>[server] Request Key from Server (POST /keys)</h3>
      <button
        onClick={async () => {
          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const response = await fetch(`${APP_SERVER_URL}/keys`, {
            method: 'POST',
            body: JSON.stringify({
              permissions,
              address: account,
            }),
          })
          const result = await Json.parse(await response.text())
          wagmiConfig.storage?.setItem('keys', Json.stringify(result))
          setResult(result)
        }}
        type="button"
      >
        Request Key
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

/**
 * Authorize server key
 */
function AuthorizeServerKey() {
  const [result, setResult] = useState<any | null>(null)

  return (
    <div>
      <h3>[client] Authorize Server Key (experimental_authorizeKey)</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const serverKeys = Json.parse(
            (await wagmiConfig.storage?.getItem('keys')) || '{}',
          )

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })

          const result = await porto.provider.request({
            method: 'experimental_authorizeKey',
            params: [
              {
                permissions,
                address: account,
                role: serverKeys?.role,
                expiry: serverKeys?.expiry,
                key: Key.fromRpc(serverKeys),
              },
            ],
          })

          setResult(result)
        }}
      >
        <button type="submit">Authorize a Session Key</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

/**
 * Check server activity
 */
function Demo() {
  const [result, setResult] = useState<Array<any> | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <h3>
        [server] Demo Server Action (wallet_prepareCalls {'->'}{' '}
        wallet_sendPreparedCalls)
      </h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const action = formData.get('action') as string

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          console.info('account', account)
          const response = await fetch(
            `${APP_SERVER_URL}/demo?action=${action}`,
            {
              method: 'POST',
              body: JSON.stringify({ address: account }),
            },
          )

          if (!response.ok) {
            const errorJson = await response.json()
            console.error(errorJson.error)
            setError(errorJson.error)
            return
          }
          const result = await response.text()
          setResult((prevResult) => [...(prevResult || []), result])
        }}
      >
        <select
          name="action"
          defaultValue="mint"
          style={{ marginRight: '10px' }}
        >
          <option value="mint">Mint</option>
          <option value="approve-transfer">Approve & Transfer</option>
          {/* <option value="schedule">Schedule</option> */}
        </select>
        <button type="submit">Submit</button>
      </form>
      {error ? <pre>{error}</pre> : null}
      {result ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {result.map((tx) => (
            <li key={tx} style={{ marginBottom: '5px' }}>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://odyssey-explorer.ithaca.xyz/tx/${tx}`}
              >
                {tx}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function State() {
  const state = useSyncExternalStore(
    porto._internal.store.subscribe,
    () => porto._internal.store.getState(),
    () => porto._internal.store.getState(),
  )
  return (
    <div>
      <h3>State</h3>
      {state.accounts.length === 0 ? (
        <p>Disconnected</p>
      ) : (
        <>
          <p>Address: {state.accounts[0].address}</p>
          <p>Chain ID: {state.chain.id}</p>
          <div>
            Keys:{' '}
            <pre>{Json.stringify(state.accounts?.[0]?.keys, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  )
}

function Events() {
  const [responses, setResponses] = useState<Record<string, unknown>>({})
  useEffect(() => {
    const handleResponse = (event: string) => (response: unknown) =>
      setResponses((responses) => ({
        ...responses,
        [event]: response,
      }))

    const handleAccountsChanged = handleResponse('accountsChanged')
    const handleChainChanged = handleResponse('chainChanged')
    const handleConnect = handleResponse('connect')
    const handleDisconnect = handleResponse('disconnect')
    const handleMessage = handleResponse('message')

    porto.provider.on('accountsChanged', handleAccountsChanged)
    porto.provider.on('chainChanged', handleChainChanged)
    porto.provider.on('connect', handleConnect)
    porto.provider.on('disconnect', handleDisconnect)
    porto.provider.on('message', handleMessage)
    return () => {
      porto.provider.removeListener('accountsChanged', handleAccountsChanged)
      porto.provider.removeListener('chainChanged', handleChainChanged)
      porto.provider.removeListener('connect', handleConnect)
      porto.provider.removeListener('disconnect', handleDisconnect)
      porto.provider.removeListener('message', handleMessage)
    }
  }, [])
  return (
    <div>
      <h3>Events</h3>
      <pre>{JSON.stringify(responses, null, 2)}</pre>
    </div>
  )
}

function Connect() {
  const [authorizeKey, setAuthorizeKey] = useState<boolean>(true)
  const [result, setResult] = useState<unknown | null>(null)
  const label = `offline-tx-support-${Math.floor(Date.now() / 1000)}`
  return (
    <div>
      <h3>wallet_connect</h3>
      <label>
        <input
          type="checkbox"
          checked={authorizeKey}
          onChange={() => setAuthorizeKey((x) => !x)}
        />
        Authorize a Session Key
      </label>
      <div>
        <button
          onClick={() =>
            porto.provider
              .request({
                method: 'wallet_connect',
                params: [
                  {
                    capabilities: {
                      authorizeKey: authorizeKey ? { permissions } : undefined,
                    },
                  },
                ],
              })
              .then(setResult)
          }
          type="button"
        >
          Login
        </button>
        <button
          onClick={() =>
            porto.provider
              .request({
                method: 'wallet_connect',
                params: [
                  {
                    capabilities: {
                      authorizeKey: authorizeKey ? { permissions } : undefined,
                      createAccount: { label },
                    },
                  },
                ],
              })
              .then(setResult)
          }
          type="button"
        >
          Register
        </button>
      </div>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function Accounts() {
  const [result, setResult] = useState<readonly string[] | null>(null)
  return (
    <div>
      <h3>eth_accounts</h3>
      <button
        onClick={() =>
          porto.provider.request({ method: 'eth_accounts' }).then(setResult)
        }
        type="button"
      >
        Get Accounts
      </button>
      <pre>{result}</pre>
    </div>
  )
}

function Register() {
  const [result, setResult] = useState<unknown | null>(null)
  return (
    <div>
      <h3>experimental_createAccount</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'experimental_createAccount' })
            .then(setResult)
        }
        type="button"
      >
        Register
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function Login() {
  const [result, setResult] = useState<readonly string[] | null>(null)
  return (
    <div>
      <h3>eth_requestAccounts</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'eth_requestAccounts' })
            .then(setResult)
        }
        type="button"
      >
        Login
      </button>
      <pre>{result}</pre>
    </div>
  )
}

function Disconnect() {
  return (
    <div>
      <h3>wallet_disconnect</h3>
      <button
        onClick={() => porto.provider.request({ method: 'wallet_disconnect' })}
        type="button"
      >
        Disconnect
      </button>
    </div>
  )
}

function GetCapabilities() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  return (
    <div>
      <h3>wallet_getCapabilities</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'wallet_getCapabilities' })
            .then(setResult)
        }
        type="button"
      >
        Get Capabilities
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function AuthorizeKey() {
  const [result, setResult] = useState<any | null>(null)
  return (
    <div>
      <h3>experimental_authorizeKey</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const expiry = Number(formData.get('expiry'))

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const result = await porto.provider.request({
            method: 'experimental_authorizeKey',
            params: [
              {
                address: account,
                expiry: Math.floor(Date.now() / 1000) + expiry,
                permissions,
              },
            ],
          })
          setResult(result)
        }}
      >
        <input
          required
          placeholder="expiry (seconds)"
          name="expiry"
          type="number"
        />
        <button type="submit">Authorize a Session Key</button>
      </form>
      {result && <pre>key: {JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

function RevokeKey() {
  const [revoked, setRevoked] = useState(false)
  return (
    <div>
      <h3>experimental_revokeKey</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const publicKey = formData.get('publicKey') as `0x${string}`

          setRevoked(false)
          await porto.provider.request({
            method: 'experimental_revokeKey',
            params: [{ publicKey }],
          })
          setRevoked(true)
        }}
      >
        <input name="publicKey" placeholder="Public Key (0x...)" type="text" />
        <button type="submit">Revoke Key</button>
      </form>
      {revoked && <p>Key revoked.</p>}
    </div>
  )
}

function GetKeys() {
  const [result, setResult] = useState<unknown>(null)

  return (
    <div>
      <h3>experimental_keys</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'experimental_keys' })
            .then(setResult)
        }
        type="button"
      >
        Get Keys
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function UpgradeAccount() {
  const [accountData, setAccountData] = useState<{
    address: string
    privateKey: string
  } | null>(null)
  const [authorizeKey, setAuthorizeKey] = useState<boolean>(true)
  const [privateKey, setPrivateKey] = useState<string>('')
  const [result, setResult] = useState<unknown | null>(null)

  return (
    <div>
      <h3>experimental_prepareCreateAccount</h3>
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
          Create EOA
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
      <label>
        <input
          type="checkbox"
          checked={authorizeKey}
          onChange={() => setAuthorizeKey((x) => !x)}
        />
        Authorize a Session Key
      </label>
      <div>
        <button
          onClick={async () => {
            const account = privateKeyToAccount(privateKey as Hex.Hex)

            const { context, signPayloads } = await porto.provider.request({
              method: 'experimental_prepareCreateAccount',
              params: [
                {
                  address: account.address,
                  capabilities: {
                    authorizeKey: authorizeKey ? { permissions } : undefined,
                  },
                },
              ],
            })

            const signatures = await Promise.all(
              signPayloads.map((hash) => account.sign({ hash })),
            )

            const address = await porto.provider.request({
              method: 'experimental_createAccount',
              params: [{ context, signatures }],
            })
            setResult(address)
          }}
          type="button"
        >
          Upgrade EOA to Porto Account
        </button>
      </div>
      {result ? (
        <p>
          Upgraded account. <pre>{JSON.stringify(result, null, 2)}</pre>
        </p>
      ) : null}
    </div>
  )
}
